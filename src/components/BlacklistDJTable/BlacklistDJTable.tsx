// @ts-nocheck
import { SvgIcon, Typography } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import {
  withEnhancedPagination,
  WithPaginationInjectedProps,
} from "@protego/sdk/RegtankUI/v1/withPagination";
import { PageResult } from "@protego/sdk/types";
import { DJ_ACTION_BLACKLIST_MATCH_CHANGE_STATUS } from "actions/DJAction";
// @ts-ignore
import { ReactComponent as CopyIcon } from "assets/images/icons/CopyIcon.svg";
import clsx from "clsx";
import ChipCategory from "components/ChipCategory";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import ExportCSV from "components/ExportCSV";
import Gender from "components/Gender";
import MatchesStatus from "components/MatchesStatus";
import { headerExportBlackListMatchesCSV } from "constants/HeaderExport";
import React, {
  FunctionComponent,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { compose } from "recompose";
import {
  KycDetailedRequestDto,
  KycSimplifiedIndividualMatchDto,
} from "types/typings-api";
import { countryCodeToName } from "util/country";
import { formatDate } from "util/date";
import { getGenderTranslate } from "util/gender";
import { isCompletedStatus } from "util/index";
import { getMatchStatusTranslate } from "util/kycMatchStatus";
import { getFullName } from "util/string";
// @ts-ignore
import BlacklistDetailDialog from "./BlacklistDJDetailDialog";
// @ts-ignore
import styles from "./styles.module.scss";
interface BlacklistTableProps extends WithPaginationInjectedProps {
  ACL: any;
  isLoading?: boolean;
  kycId: string;
  kycStatus: KycDetailedRequestDto["status"];
  matchesList: KycSimplifiedIndividualMatchDto[];
  matchesListPaginated?: PageResult<KycSimplifiedIndividualMatchDto>;
  // paginationPrefix?: string;
  onLoad: Function;
  status: { FALSE: number; POSITIVE: number; UNRESOLVED: number };
}

// MAIN COMPONENT
const BlacklistTable = (props: BlacklistTableProps) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const {
    kycId,
    kycStatus,
    matchesList,
    status,
    ACL,
    paginationParams,
  } = props;
  const [selected, setSelected] = useState<KycSimplifiedIndividualMatchDto[]>(
    []
  );

  const [selectedFilter, setSelectedFilter] = useState([]);
  const [openViewDetail, setOpenViewDetail] = React.useState(false);
  const [blacklistIdSelected, setBlacklistIdSelected] = React.useState(null);
  const [loaded, setLoaded] = useState(false);
  const [currentDetailData, setCurrentDetailData] = useState(null);

  useEffect(() => {
    const listSelected = selected.map((item) => {
      const blacklistItem = item["kycBlacklist"];
      const codeArr = blacklistItem?.nationality
        ? blacklistItem.nationality.split("/")
        : [];
      const nationality = codeArr.length
        ? codeArr.map((code) => countryCodeToName(code, "demonym")).join(", ")
        : "";
      const status = getMatchStatusTranslate(item.status);
      const gender = getGenderTranslate(blacklistItem.gender);
      const category = blacklistItem?.categories?.map((a) => a.name).toString();

      return {
        ...item,
        matchId: blacklistItem?.blacklistId,
        name: blacklistItem?.fullName,
        category: category,
        status: formatMessage({ id: status }),
        gender: formatMessage({ id: gender }),
        dateOfBirth: formatDate(blacklistItem.dateOfBirth),
        lastModifiedBy: getFullName(item.lastModifiedBy),
        nationality,
      };
    });

    setSelectedFilter(listSelected);
    // eslint-disable-next-line
  }, [selected]);

  useEffect(() => {
    if (loaded) {
      props?.onLoad({ id: kycId, params: props?.paginationParams });
    } else {
      setLoaded(true);
    }
  }, [paginationParams]);

  const LeftButtons = (useCallback(() => {
    const falseButton = (
      <Button
        variant="containedError"
        onClick={() => {
          dispatch(
            DJ_ACTION_BLACKLIST_MATCH_CHANGE_STATUS({
              kycId: kycId,
              // @ts-ignore
              blacklistId: selected.map((s) => s?.kycBlacklist?.blacklistId),
              status: "FALSE",
            })
          )
            // @ts-ignore
            .then(() => setSelected([]));
        }}
      >
        <IntlMessages id="false" />
      </Button>
    );

    if (selected.length === 1) {
      return [
        <ExportCSV
          nameFileExport={`KYC_ScreeningDetails_` + kycId}
          className="mr-2"
          dataExport={selectedFilter}
          headersExportCSV={headerExportBlackListMatchesCSV}
        />,
      ];
    }
    if (selected.length > 1) {
      return [
        <ExportCSV
          nameFileExport={`KYC_ScreeningDetails_` + kycId}
          className="mr-2"
          dataExport={selectedFilter}
          headersExportCSV={headerExportBlackListMatchesCSV}
        />,
        falseButton,
      ];
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selected,
    selectedFilter,
    status,
    kycId,
    kycStatus,
  ]) as unknown) as FunctionComponent;

  const handleViewDetail = (data) => {
    setOpenViewDetail(!openViewDetail);
    setCurrentDetailData(data);
  };

  // @ts-ignore
  return (
    <div className={styles.searchResultTable}>
      <div className={styles.headingTable}>
        <div className={"d-flex align-items-center justify-content-between"}>
          <Typography variant={"titleForm"}>
            <IntlMessages id={"blacklist.matches"} />
          </Typography>
          <div>
            <LeftButtons />
          </div>
        </div>
      </div>
      <CustomTable<KycSimplifiedIndividualMatchDto>
        lang={{
          rowsPerPage: <IntlMessages id={"appModule.table.footer"} />,
        }}
        labelDisplayedRows={() => {
          return null;
        }}
        className={styles.Table}
        data={matchesList}
        options={{
          selectable: true,
          selections: selected,
          onSelected: setSelected,
          checkHighlight: "hasNewChanges",
          pagination: true,
        }}
        columnData={{
          "kycBlacklist.blacklistId": {
            label: <IntlMessages id="screening-id" />,
            enable: true,
            sort: true,
            headerProps: {
              style: { width: toRem(160), minWidth: "120px" },
            },
            renderCell: (v) => (
              <div className={clsx(styles.Ids, "d-flex align-items-center")}>
                <CopyButton
                  component={"span"}
                  copyIcon={
                    <SvgIcon component={CopyIcon} viewBox="0 0 16 16" />
                  }
                >
                  <Typography variant="subtitleGray">{v}</Typography>
                </CopyButton>
              </div>
            ),
          },
          "kycBlacklist.fullName": {
            label: <IntlMessages id="name" />,
            enable: true,
            sort: true,
            renderCell: (v, { imageThumbnail }) => {
              return (
                <div className={"d-flex align-items-center"}>
                  <UserAvatar
                    user={v}
                    description={
                      <Typography variant="subtitleGray">{v}</Typography>
                    }
                    src={imageThumbnail}
                    hideAvatar
                  />
                </div>
              );
            },
          },
          "kycBlacklist.dateOfBirth": {
            label: <IntlMessages id="date-of-birth" />,
            sort: true,
            align: "left",
            renderCell: (v) => {
              return (
                <div className={"flex-start"}>
                  <Typography variant="subtitleGray">
                    <Nullable>{formatDate(v)}</Nullable>
                  </Typography>
                </div>
              );
            },
          },
          "kycBlacklist.gender": {
            label: <IntlMessages id="gender" />,
            enable: true,
            sort: false,
            align: "left",
            renderCell: (v) => <Gender type={v} />,
          },
          "kycBlacklist.nationality": {
            label: <IntlMessages id="nationality" />,
            enable: true,
            align: "center",
            sort: false,
            renderCell: (v) => (
              <Nullable
                component={CountryFlagLanguage}
                svg
                valueProp={"countryCode"}
                djwl
              >
                {v}
              </Nullable>
            ),
          },
          "kycBlacklist.categories": {
            label: <IntlMessages id="table.category" />,
            enable: false,
            align: "center",
            renderCell: (v) => {
              return <ChipCategory keywords={v} multiLanguage></ChipCategory>;
            },
          },
          status: {
            label: <IntlMessages id="status" />,
            sort: false,
            align: "left",
            renderCell: (v, record) => (
              <div
                className={
                  props && isCompletedStatus(props?.kycStatus)
                    ? styles.disabledDiv
                    : ""
                }
              >
                <div>
                  <MatchesStatus
                    value={v as KycSimplifiedIndividualMatchDto["status"]}
                    onChange={async (e) => {
                      dispatch(
                        DJ_ACTION_BLACKLIST_MATCH_CHANGE_STATUS({
                          kycId: kycId,
                          //@ts-ignore
                          blacklistId: record?.kycBlacklist?.blacklistId,
                          status: e.target.value,
                        })
                        //@ts-ignore
                      ).finally(() => {
                        setSelected([]);
                      });
                    }}
                  />
                </div>
              </div>
            ),
          },
          action: {
            label: <IntlMessages id="setting.action" />,
            sort: false,
            align: "left",
            renderCell: (v, record) => (
              <>
                <div
                  onClick={() => handleViewDetail(record)}
                  className={styles.buttonViewDetail}
                >
                  <IntlMessages id="table.action.viewDetails" />
                </div>
              </>
            ),
          },
        }}
      />
      <BlacklistDetailDialog
        data={currentDetailData}
        open={openViewDetail}
        onClose={() => setOpenViewDetail(false)}
      />
    </div>
  );
};

export default compose(withEnhancedPagination({ key: "b" }))(
  memo(BlacklistTable)
);
