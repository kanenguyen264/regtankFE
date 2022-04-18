import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { PageResult } from "@protego/sdk/types";
import CopyButton from "@protego/sdk/UI/CopyButton";
import CustomTable from "@protego/sdk/UI/CustomTable";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import Link from "@protego/sdk/UI/Link";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import Nullable from "@protego/sdk/UI/Nullable/Nullable";
import { usePrompt } from "@protego/sdk/UI/PromptDialog";
import {
  withEnhancedPagination,
  WithPaginationInjectedProps
} from "@protego/sdk/UI/withPagination";
import { toRem } from "@protego/sdk/utils/measurements";
import { generatePath } from "@protego/sdk/utils/router";
import {
  KYB_ACTION_CHANGE_MATCH_STATUS,
  KYB_ACTION_GET_MATCHES_FILTER_LIST,
  KYB_RISK_ASSESSMENT_GENERATE
} from "actions/KYBAction";
import {
  FilterForm,
  FilterProps
} from "app/routes/KYBScreenPage/KYBScreeningResult/KYBScreeningResultFilter/KYBScreeningResultFilter";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import ExportCSV from "components/ExportCSV";
import Keyword from "components/Keyword";
import MatchesStatus from "components/MatchesStatus";
import { headerExportCYBMatchesCSV } from "constants/HeaderExport";
import {
  KYB_ROUTE_KYB_SCREEN_DETAIL,
  KYB_ROUTE_RISK_ASSESSMENT
} from "constants/routes";
import { isEmpty, matches } from "lodash";
import * as React from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { compose } from "recompose";
import {
  KybDetailedRequestDto,
  KybSimplifiedIndividualMatchDto
} from "types/typings-api";
import { countryCodeToName } from "util/country";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { isCompletedStatus } from "util/index";
import { getMatchStatusTranslate } from "util/kycMatchStatus";
import { getFullName } from "util/string";
import { ACLProps, withACL } from "../../../../acl";
// @ts-ignore
import styles from "../KYBScreeningResult/KYBScreeningResult.module.scss";
import KYBScreeningResultFilter from "../KYBScreeningResult/KYBScreeningResultFilter";
interface MatchesTableProps extends WithPaginationInjectedProps {
  ACL?: ACLProps;
  filters: any;
  isLoading?: boolean;
  kybId: string;
  kybStatus: KybDetailedRequestDto["status"];
  matchesList: any;
  matchesListPaginated?: PageResult<KybSimplifiedIndividualMatchDto>;
  onFilter: Function;
  onLoad: Function;
  unresolved: number;
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
const MatchesTable = (compose(
  // withMatchesTableFilter,
  withEnhancedPagination({ key: "m" }),
  withACL
)(function MatchesTable(props: MatchesTableProps & EnhancedFilterProps) {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const history = useHistory();

  const {
    kybId,
    kybStatus,
    matchesList,
    unresolved,
    ACL,
    paginationParams,
    setPaginationParams,
    filters,
  } = props;

  const [selected, setSelected] = React.useState<
    KybSimplifiedIndividualMatchDto[]
  >([]);
  // @ts-ignore
  const filterList = useSelector((state) => state.kyb.currentMatchesFilterList);
  const [key, setKey] = React.useState(kybStatus);
  const [selectedFilter, setSelectedFilter] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  //@ts-ignore
  const locale = useSelector(({ settings }) => settings.locale);
  const [loadingFilter, setLoadingFilter] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setKey(kybStatus);
  }, [kybStatus]);

  React.useEffect(() => {
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

  React.useEffect(() => {
    setLoadingFilter(true);
    dispatch(
      KYB_ACTION_GET_MATCHES_FILTER_LIST({
        kybId: kybId,
      })
      //@ts-ignore
    ).then(() => setLoadingFilter(false));
  }, []);

  React.useEffect(() => {
    const listSelected = selected.map((item) => {
      const codeArr =
        item && item.countryOfIncorporation
          ? item.countryOfIncorporation.split("/")
          : [];
      const countryOfIncorporation = codeArr.length
        ? codeArr.map((code) => countryCodeToName(code)).join(", ")
        : "";
      const status = getMatchStatusTranslate(item.status);
      return {
        ...item,
        status: formatMessage({ id: status }),
        updatedAt: formatDate(item.updatedAt, LONG_DATE_TIME),
        lastModifiedBy: getFullName(item.lastModifiedBy),
        countryOfIncorporation: countryOfIncorporation,
      };
    });

    setSelectedFilter(listSelected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, locale]);

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

  const generateScorePrompt = usePrompt<boolean>({
    title: <IntlMessages id="confirmation" />,
    message: (
      <p className="text-center" style={{ fontSize: toRem(17) }}>
        <IntlMessages id={"kyb.generateScorePromptContent"}></IntlMessages>
      </p>
    ),
    actions: [
      {
        value: true,
        label: formatMessage({ id: "button.yes" }),
        color: "primary",
      },
      { value: false, label: formatMessage({ id: "button.no" }) },
    ],
    allowCloseOnTitle: true,
  });

  const generate = (kybId) => {
    setLoading(true);
    dispatch(
      KYB_RISK_ASSESSMENT_GENERATE({
        kybId: kybId,
      })
    )
      // @ts-ignore
      .then((res) => {
        setLoading(false);
        history.push(
          generatePath(KYB_ROUTE_RISK_ASSESSMENT, {
            kybId: kybId,
          })
        );
      });
  };

  const LeftButtons = (React.useCallback(() => {
    const falseButton = ACL.isAllowedPermissions("KYB_STATUS_RESOLUTION") ? (
      <Button
        className={clsx(styles.False, styles.PositiveFalseButton)}
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
        className={clsx(styles.Positive, styles.PositiveFalseButton)}
        onClick={() => {
          dispatch(
            KYB_ACTION_CHANGE_MATCH_STATUS({i
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

    const goToScoringButton = isCompletedStatus(kybStatus) ? (
      //@ts-ignore
      <Button
        variant={"contained"}
        color={"primary"}
        component={Link}
        to={generatePath(KYB_ROUTE_RISK_ASSESSMENT, {
          kybId: kybId,
        })}
        size={"small"}
      >
        <IntlMessages id="appModule.popup.viewRiskAssessment" />
      </Button>
    ) : ACL.isAllowedPermissions("KYB_MODULE_CREATE") ? (
      <Button
        variant={"contained"}
        color={"primary"}
        size={"small"}
        onClick={() => {
          generateScorePrompt().then((result) => {
            if (result === true) generate(kybId);
          });
        }}
      >
        <IntlMessages id="appModule.popup.generateRiskAssessment" />
      </Button>
    ) : (
      <></>
    );

    if (selected.length > 0) {
      return [
        <ExportCSV
          nameFileExport={`KYB_ScreeningDetails_` + kybId}
          className="mr-2"
          dataExport={selectedFilter}
          headersExportCSV={headerExportCYBMatchesCSV}
        />,
        falseButton,
        selected.length === 1 ? (
          <span style={{ width: toRem(16), display: "inline-block" }} />
        ) : null,
        selected.length === 1 ? positiveButton : null,
      ];
    }

    if (unresolved === 0) {
      return goToScoringButton;
    }

    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selected,
    selectedFilter,
    kybStatus,
    kybId,
  ]) as unknown) as React.FunctionComponent;

  return (
    <div className={styles.Search}>
      <LoadingWrapper loading={loading} size={"1rem"}>
        <Grid container spacing={2}>
          <Grid xs={12} item>
            <div
              style={{
                justifyContent: "space-between",
                display: "flex",
              }}
            >
              <div className={"d-flex align-items-center"}>
                <div>
                  <LeftButtons />
                </div>
              </div>
              <div>
                <KYBScreeningResultFilter
                  loading={loadingFilter}
                  onChange={handleChangeFilter}
                  data={filterList}
                />
              </div>
            </div>
          </Grid>
          <Grid xs={12} item style={{ paddingTop: 0 }}>
            <CustomTable
              key={key}
              lang={{
                rowsPerPage: <IntlMessages id={"appModule.table.footer"} />,
              }}
              className={styles.Table}
              data={matchesList?.records ? matchesList : []}
              options={{
                selectable: true,
                selections: selected,
                onSelected: setSelected,
                checkHighlight: "hasNewChanges",
              }}
              columnData={{
                matchId: {
                  label: <IntlMessages id="screening-id" />,
                  enable: true,
                  renderCell: (v) => (
                    <CopyButton
                      classes={{
                        root: styles.CopyButtonRoot,
                        copyButton: styles.CopyButton,
                      }}
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
                        {v}
                      </Link>
                    </CopyButton>
                  ),
                },
                businessName: {
                  align: "center",
                  label: <IntlMessages id="kyb.businessName" />,
                  enable: true,
                  sort: true,
                },

                countryOfIncorporation: {
                  label: <IntlMessages id="kyb.countryOfInCorporationtry" />,
                  enable: true,
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
                  label: <IntlMessages id="keywords" />,
                  enable: true,
                  align: "center",
                  renderCell: (v) => {
                    return <Keyword keywords={v} />;
                  },
                },

                //@ts-ignore
                status: {
                  label: <IntlMessages id="status" />,
                  sort: true,
                  align: "center",
                  renderCell: (v, record) => {
                    return (
                      <div>
                        <div>
                          <MatchesStatus
                            disabled={
                              !ACL.isAllowedPermissions(
                                "KYB_STATUS_RESOLUTION"
                              ) || isCompletedStatus(props?.kybStatus)
                            }
                            value={
                              v as KybSimplifiedIndividualMatchDto["status"]
                            }
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
                      </div>
                    );
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </LoadingWrapper>
    </div>
  );
}) as unknown) as React.FunctionComponent<MatchesTableProps>;

export default MatchesTable;
