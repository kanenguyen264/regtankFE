// @ts-nocheck
import { SvgIcon, Typography } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Link from "@protego/sdk/RegtankUI/v1/Link";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable/Nullable";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import {
  withEnhancedPagination,
  WithPaginationInjectedProps,
} from "@protego/sdk/RegtankUI/v1/withPagination";
import { PageResult } from "@protego/sdk/types";
import { generatePath } from "@protego/sdk/utils/router";
import {
  KYB_ACTION_CHANGE_MATCH_STATUS,
  KYB_ACTION_GET_MATCHES_FILTER_LIST,
} from "actions/KYBAction";
import {
  FilterForm,
  FilterProps,
} from "app/routes/KYBScreenPage/KYBScreeningResult/KYBScreeningResultFilter/KYBScreeningResultFilter";
//@ts-ignore
import { ReactComponent as CopyIcon } from "assets/images/icons/CopyIcon.svg";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import ExportCSV from "components/ExportCSV";
import Keyword from "components/Keywordv1";
import MatchesStatus from "components/MatchesStatus";
import { headerExportCYBMatchesCSV } from "constants/HeaderExport";
import { KYB_ROUTE_KYB_SCREEN_DETAIL } from "constants/routes";
import { isEmpty } from "lodash";
import React, {
  FunctionComponent,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "recompose";
import {
  KybDetailedRequestDto,
  KybSimplifiedIndividualMatchDto,
} from "types/typings-api";
import { countryCodeToName } from "util/country";
import { formatDate } from "util/date";
import { getGenderTranslate } from "util/gender";
import { isCompletedStatus } from "util/index";
import { getMatchStatusTranslate } from "util/kycMatchStatus";
import { getFullName } from "util/string";
// @ts-ignore
import { ACLProps, withACL } from "../../../../../acl";
import KYBScreeningResultFilter from "../KYBScreeningResultFilter/KYBScreeningResultFilter";
// @ts-ignore
import styles from "../KYBScreeningResult.module.scss";

interface MatchesTableProps extends WithPaginationInjectedProps {
  ACL?: ACLProps;
  filters: any;
  isLoading?: boolean;
  kybId: string;
  kybStatus: KybDetailedRequestDto["status"];
  matchesList: KybSimplifiedIndividualMatchDto[];
  matchesListPaginated?: PageResult<KybSimplifiedIndividualMatchDto>;
  onFilter: Function;
  onLoad: Function;
  status: { FALSE: number; POSITIVE: number; UNRESOLVED: number };
}
interface EnhancedFilterProps {
  filter: FilterForm;
  setFilter: FilterProps["onChange"];
}

const filterDefs = {
  businessName: {
    property: "businessName",
    operator: "like",
    // filterValue: "Trump",
    valueType: "String",
  },
  statuses: {
    property: "status",
    operator: "IN",
    // filterValue: ["UNRESOLVED", "FALSE", "POSITIVE"],
    valueType: "KybMatchStatus",
  },
  matchId: {
    property: "matchId",
    operator: "like",
    // filterValue: "M01",
    valueType: "String",
  },
  keywords: {
    property: "keywords",
    operator: "IN",
    // filterValue: ["PEP", "SAN", "LF", "FR", "AM"],
    valueType: "KeyWordEnum",
  },
  lastModifiedByStart: {
    property: "updatedAt",
    operator: ">=",
    // filterValue: "1/1/2022",
    valueType: "String",
  },
  lastModifiedByEnd: {
    property: "updatedAt",
    operator: "<=",
    // filterValue: "22/1/2022",
    valueType: "String",
  },
  countryOfIncorporation: {
    property: "countryOfIncorporation",
    operator: "IN",
    // filterValue: ["US"],
    valueType: "String",
  },
};

// MAIN COMPONENT
const MatchesTable = (props: MatchesTableProps & EnhancedFilterProps) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const {
    kybId,
    kybStatus,
    matchesList,
    status,
    ACL,
    paginationParams,
    setPaginationParams,
    filters,
  } = props;
  const [selected, setSelected] = useState<KybSimplifiedIndividualMatchDto[]>(
    []
  );
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const filterList = useSelector((state) => state.kyb.currentMatchesFilterList);
  const [loadingFilter, setLoadingFilter] = useState(false);

  useEffect(() => {
    if (loaded) {
      props?.onLoad({
        id: kybId,
        params: props?.paginationParams,
        filters: filters,
      });
    } else {
      setLoaded(true);
    }
  }, [paginationParams]);

  useEffect(() => {
    setLoadingFilter(true);
    dispatch(
      KYB_ACTION_GET_MATCHES_FILTER_LIST({
        kybId: kybId,
      })
      //@ts-ignore
    ).then(() => setLoadingFilter(false));
  }, []);

  useEffect(() => {
    const listSelected = selected.map((item) => {
      const codeArr = item.nationalityCode
        ? item.nationalityCode.split("/")
        : [];

      const nationality = codeArr.length
        ? codeArr.map((code) => countryCodeToName(code, "demonym")).join(", ")
        : "";
      const status = getMatchStatusTranslate(item.status);
      const gender = getGenderTranslate(item.gender);
      return {
        ...item,
        status: formatMessage({ id: status }),
        gender: formatMessage({ id: gender }),
        dateOfBirth: formatDate(item.dateOfBirth),
        lastModifiedBy: getFullName(item.lastModifiedBy),
        nationality,
      };
    });
    setSelectedFilter(listSelected);
    // eslint-disable-next-line
  }, [selected]);

  const LeftButtons = (useCallback(() => {
    const falseButton = ACL.isAllowedPermissions("KYB_STATUS_RESOLUTION") ? (
      <Button
        variant="containedError"
        disabled={isCompletedStatus(kybStatus)}
        size={"small"}
        onClick={() => {
          dispatch(
            KYB_ACTION_CHANGE_MATCH_STATUS({
              kybId: kybId,
              matchId: selected.map((s) => s.matchId),
              status: "FALSE",
            })
          )
            // @ts-ignore
            .then(() => setSelected([]));
        }}
      >
        <IntlMessages id="false" />
      </Button>
    ) : (
      <></>
    );

    const positiveButton = ACL.isAllowedPermissions("KYB_STATUS_RESOLUTION") ? (
      <Button
        variant="containedSuccess"
        disabled={isCompletedStatus(kybStatus)}
        size={"small"}
        onClick={() => {
          dispatch(
            KYB_ACTION_CHANGE_MATCH_STATUS({
              kybId: kybId,
              matchId: selected[0].matchId,
              status: "POSITIVE",
            })
          )
            // @ts-ignore
            .then(() => setSelected([]));
        }}
      >
        <IntlMessages id="positive" />
      </Button>
    ) : (
      <></>
    );

    if (selected.length === 1) {
      return [
        falseButton,
        <span style={{ width: toRem(16), display: "inline-block" }} />,
        positiveButton,
      ];
    }
    if (selected.length > 1) {
      return [falseButton];
    }
    return [
      <ExportCSV
        nameFileExport={`KYB_ScreeningDetails_` + kybId}
        className={clsx(selected.length > 0 && "mr-3", styles.exportCsv)}
        dataExport={selectedFilter}
        headersExportCSV={headerExportCYBMatchesCSV}
        disabled={selected.length === 0}
      />,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selected,
    selectedFilter,
    status,
    kybId,
    kybStatus,
  ]) as unknown) as FunctionComponent;

  const handleChangeFilter = (values) => {
    let filterValue = [];
    if (values) {
      filterValue = Object.keys(values)
        .filter((val) => !isEmpty(values[val]))
        .map((key) => {
          let value = values[key];
          if (key === "yearOfBirthFrom" || key === "yearOfBirthTo") {
            let date = new Date(value);
            value = date.getFullYear();
          } else if (
            key === "lastModifiedByStart" ||
            key === "lastModifiedByEnd"
          ) {
            value = formatDate(value, "DD/MM/YYYY");
          }
          return { ...filterDefs[key], filterValue: value };
        });
    }

    setPaginationParams({ ...paginationParams, page: 0 });
    props?.onFilter(filterValue);
    props?.onLoad({
      id: kybId,
      filters: filterValue,
      params: { ...paginationParams, page: 0 },
    });
  };

  // @ts-ignore
  return (
    <div className={styles.searchResultTable}>
      <div className={styles.headingTable}>
        <div className={"d-flex align-items-center justify-content-between"}>
          <Typography variant={"titleForm"} style={{ lineHeight: toRem(20) }}>
            <IntlMessages id={"appModule.possibleMatches"} />
          </Typography>
          <div>
            <LeftButtons />
          </div>
        </div>
      </div>
      <div>
        <KYBScreeningResultFilter
          loading={loadingFilter}
          onChange={handleChangeFilter}
          data={filterList}
        />
      </div>
      <CustomTable<KybSimplifiedIndividualMatchDto>
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
          matchId: {
            align: "left",
            label: <IntlMessages id="screening-id" />,
            enable: true,
            sort: true,
            renderCell: (v) => (
              <CopyButton
                classes={{
                  root: styles.CopyButtonRoot,
                  copyButton: styles.CopyButton,
                }}
                copyIcon={<SvgIcon component={CopyIcon} viewBox="0 0 16 16" />}
              >
                <Link
                  to={generatePath(
                    KYB_ROUTE_KYB_SCREEN_DETAIL,
                    {
                      matchId: v as string,
                      kybId: kybId,
                    },
                    {}
                  )}
                  className={styles.TableIdColumn}
                >
                  <Typography>{v}</Typography>
                </Link>
              </CopyButton>
            ),
          },
          businessName: {
            label: <IntlMessages id="kyb.businessName" />,
            enable: true,
            sort: true,
            align: "left",
            className: styles.widthName,
          },
          countryOfIncorporation: {
            label: <IntlMessages id="kyb.countryOfInCorporationtry" />,
            sort: true,
            align: "center",
            renderCell: (v) => (
              <Nullable
                component={CountryFlagLanguage}
                svg
                valueProp={"countryCode"}
              >
                {v}
              </Nullable>
            ),
          },
          keywords: {
            align: "center",
            label: <IntlMessages id="keywords" />,
            enable: true,
            renderCell: (v) => {
              return <Keyword keywords={v} />;
            },
          },
          status: {
            label: <IntlMessages id="status" />,
            enable: true,
            align: "left",
            renderCell: (v, record) => (
              <div
                className={
                  !ACL.isAllowedPermissions("KYB_STATUS_RESOLUTION") ||
                  isCompletedStatus(props?.kybStatus)
                    ? styles.disabledDiv
                    : ""
                }
              >
                <MatchesStatus
                  disabled={
                    ACL.isAllowedPermissions("KYB_STATUS_RESOLUTION") ||
                    isCompletedStatus(props?.kybStatus)
                      ? false
                      : true
                  }
                  value={v as KybSimplifiedIndividualMatchDto["status"]}
                  onChange={async (e) => {
                    dispatch(
                      KYB_ACTION_CHANGE_MATCH_STATUS({
                        kybId: kybId,
                        matchId: record.matchId,
                        status: e.target.value,
                      })
                      //@ts-ignore
                    ).finally(() => {
                      setSelected([]);
                    });
                  }}
                />
              </div>
            ),
          },
        }}
      />
    </div>
  );
};

export default compose(
  withEnhancedPagination({ key: "m" }),
  withACL
)(memo(MatchesTable));
