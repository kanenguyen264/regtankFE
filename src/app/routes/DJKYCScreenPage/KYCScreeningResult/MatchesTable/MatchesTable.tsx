// @ts-nocheck
import React from "react";
import { SvgIcon, Typography } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Link from "@protego/sdk/RegtankUI/v1/Link";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable/Nullable";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import {
  withEnhancedPagination,
  WithPaginationInjectedProps
} from "@protego/sdk/RegtankUI/v1/withPagination";
import { PageResult } from "@protego/sdk/types";
import { generatePath } from "@protego/sdk/utils/router";
import {
  DJ_ACTION_CHANGE_MATCH_STATUS,
  DJ_KYC_ACTION_GET_MATCHES_FILTER_LIST
} from "actions/DJAction";
import {
  FilterForm,
  FilterProps
} from "app/routes/KYCScreenPage/KYCScreeningResult/KYCScreeningResultFilter/KYCScreeningResultFilter";
//@ts-ignore
import { ReactComponent as CopyIcon } from "assets/images/icons/CopyIcon.svg";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import ExportCSV from "components/ExportCSV";
import Gender from "components/Gender";
import Keyword from "components/Keywordv1";
import MatchesStatus from "components/MatchesStatus";
import { headerExportMatchesCSV } from "constants/HeaderExport";
import { DJ_KYC_ROUTE_KYC_SCREEN_DETAIL } from "constants/routes";
import { isEmpty } from "lodash";
import {
  FunctionComponent,
  memo,
  useCallback,
  useEffect,
  useState
} from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "recompose";
import {
  KycDetailedRequestDto,
  KycSimplifiedIndividualMatchDto
} from "types/typings-api";
import { countryCodeToName } from "util/country";
import { formatDate } from "util/date";
import { getGenderTranslate } from "util/gender";
import { isCompletedStatus } from "util/index";
import { getMatchStatusTranslate } from "util/kycMatchStatus";
import { getFullName } from "util/string";
// @ts-ignore
import { ACLProps, withACL } from "../../../../../acl";
// @ts-ignore
import styles from "../KYCScreeningResult.module.scss";
import KYCScreeningResultFilter from "../KYCScreeningResultFilter/KYCScreeningResultFilter";

interface MatchesTableProps extends WithPaginationInjectedProps {
  ACL?: ACLProps;
  filters: any;
  isLoading?: boolean;
  kycId: string;
  kycStatus: KycDetailedRequestDto["status"];
  matchesList: KycSimplifiedIndividualMatchDto[];
  matchesListPaginated?: PageResult<KycSimplifiedIndividualMatchDto>;
  onFilter: Function;
  onLoad: Function;
  status: { FALSE: number; POSITIVE: number; UNRESOLVED: number };
}
interface EnhancedFilterProps {
  filter: FilterForm;
  setFilter: FilterProps["onChange"];
}

const filterDefs = {
  name: {
    property: "name",
    operator: "like",
    // filterValue: "Trump",
    valueType: "String",
  },
  gender: {
    property: "gender",
    operator: "=",
    // filterValue: "MALE",
    valueType: "Gender",
  },
  statuses: {
    property: "status",
    operator: "IN",
    // filterValue: ["UNRESOLVED", "FALSE", "POSITIVE"],
    valueType: "KycMatchStatus",
  },
  matchId: {
    property: "matchId",
    operator: "like",
    // filterValue: "M01",
    valueType: "String",
  },
  yearOfBirthFrom: {
    property: "yearOfBirth",
    operator: ">=",
    // filterValue: 1990,
    valueType: "Integer",
  },
  yearOfBirthTo: {
    property: "yearOfBirth",
    operator: "<=",
    // filterValue: 2022,
    valueType: "Integer",
  },
  keywords: {
    property: "keywords",
    operator: "IN",
    // filterValue: ["PEP", "SAN", "LF", "FR", "AM"],
    valueType: "String",
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
  nationalityCodes: {
    property: "nationalityCode",
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
    kycId,
    kycStatus,
    matchesList,
    status,
    ACL,
    paginationParams,
    setPaginationParams,
    filters,
  } = props;
  const [selected, setSelected] = useState<KycSimplifiedIndividualMatchDto[]>(
    []
  );
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const filterList = useSelector(
    (state) => state.downJones.currentMatchesFilterList
  );
  const [loadingFilter, setLoadingFilter] = useState(false);

  useEffect(() => {
    if (loaded) {
      props?.onLoad({
        id: kycId,
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
      DJ_KYC_ACTION_GET_MATCHES_FILTER_LIST({
        kycId: kycId,
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
    const falseButton = ACL.isAllowedPermissions("DJ_KYC_STATUS_RESOLUTION") ? (
      <Button
        variant="containedError"
        disabled={isCompletedStatus(kycStatus)}
        size={"small"}
        onClick={() => {
          dispatch(
            DJ_ACTION_CHANGE_MATCH_STATUS({
              kycId: kycId,
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

    const positiveButton = ACL.isAllowedPermissions(
      "DJ_KYC_STATUS_RESOLUTION"
    ) ? (
      <Button
        variant="containedSuccess"
        disabled={isCompletedStatus(kycStatus)}
        size={"small"}
        onClick={() => {
          dispatch(
            DJ_ACTION_CHANGE_MATCH_STATUS({
              kycId: kycId,
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
      return [
        falseButton,
      ];
    }
    return [
      <ExportCSV
        nameFileExport={`KYC_ScreeningDetails_` + kycId}
        className={clsx(selected.length > 0 && "mr-3", styles.exportCsv)}
        dataExport={selectedFilter}
        headersExportCSV={headerExportMatchesCSV}
        disabled={selected.length === 0}
      />,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selected,
    selectedFilter,
    status,
    kycId,
    kycStatus,
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
      id: kycId,
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
        <KYCScreeningResultFilter
          loading={loadingFilter}
          onChange={handleChangeFilter}
          data={filterList}
        />
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
                    DJ_KYC_ROUTE_KYC_SCREEN_DETAIL,
                    {
                      matchId: v as string,
                      kycId: kycId,
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
          name: {
            label: <IntlMessages id="name" />,
            enable: true,
            sort: true,
            align: "left",
            className: styles.widthName,
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
          dateOfBirth: {
            label: <IntlMessages id="date-of-birth" />,
            sort: true,
            align: "center",
            renderCell: (v) => {
              return (
                <Typography variant="subtitleGray">
                  <Nullable>{formatDate(v)}</Nullable>
                </Typography>
              );
            },
          },
          gender: {
            align: "center",
            label: <IntlMessages id="gender" />,
            enable: true,
            renderCell: (v) => <Gender type={v} />,
          },
          nationalityCode: {
            label: <IntlMessages id="nationality" />,
            enable: true,
            align: "left",
            renderCell: (v) => (
              <Nullable
                component={CountryFlagLanguage}
                demonym
                svg
                valueProp={"countryCode"}
                djwl
              >
                {v}
              </Nullable>
            ),
          },
          keywords: {
            label: <IntlMessages id="keywords" />,
            enable: true,
            align: "left",
            className: styles.widthStatus,
            renderCell: (v) => {
              return <Keyword keywords={v} />;
            },
          },
          status: {
            label: <IntlMessages id="status" />,
            sort: false,
            align: "left",
            className: styles.widthStatus,
            renderCell: (v, record) => (
              <div
                className={
                  props && isCompletedStatus(props?.kycStatus)
                    ? styles.disabledDiv
                    : ""
                }
              >
                <MatchesStatus
                  disabled={
                    ACL.isAllowedPermissions("DJ_KYC_STATUS_RESOLUTION")
                      ? false
                      : true
                  }
                  value={v as KycSimplifiedIndividualMatchDto["status"]}
                  onChange={async (e) => {
                    dispatch(
                      DJ_ACTION_CHANGE_MATCH_STATUS({
                        kycId: kycId,
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
