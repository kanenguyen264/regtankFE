import { Button, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
// import CustomTable from "@protego/sdk/UI/CustomTable/CustomTable";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Link from "@protego/sdk/RegtankUI/v1/Link/Link";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable/index";
import SearchBoxDebounce from "@protego/sdk/RegtankUI/v1/SearchBoxDebounce";
import { withEnhancedPagination } from "@protego/sdk/RegtankUI/v1/withPagination";
import { toRem } from "@protego/sdk/utils/measurements";
import { CASE_MANAGEMENT_SEARCH_PROFILE } from "actions/CaseManagementAction";
import { PlusButton, CheckButton } from "@protego/sdk/RegtankUI/v1/Button";
import { ReactComponent as NotFoundIcon } from "assets/icons/ic_notfound.svg";
import { ReactComponent as SearchIcon } from "assets/icons/ic_search.svg";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import { stringify } from "qs";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { formatDate } from "util/date";
import { useKycStyles } from "../muiStyles/kycStyles";
import CustomColl from "./CustomColl";
import styles from "./style.module.scss";
//import ScreenStatusBadge from "@protego/sdk/RegtankUI/v1/ScreenStatusBadge";
import ScreenStatusBadge from "components/ScreenStatusBadgev1";
import { generatePath } from "@protego/sdk/utils/router";
import {
  KYC_ROUTE_KYC_SCREEN_RESULT,
  KYC_ROUTE_KYC_SCREEN_SCORING,
  KYB_ROUTE_KYB_SCREEN_RESULT,
  KYB_ROUTE_RISK_ASSESSMENT,
  KYT_ROUTE_SCREEN,
} from "constants/routes";
const KYC = withEnhancedPagination({ key: "KybTab" })(
  ({
    listResult,
    limitProfileAdded,
    dataTabs,
    setDataTab,
    paginationParams,
    setPaginationParams,
  }) => {
    const kycWrapper = useKycStyles();
    const { formatMessage } = useIntl();
    const [searchText, setSearchText] = useState("");
    const { profileIdsAdded, groupProfileId } = dataTabs;
    const dispatch = useDispatch();
    useEffect(() => {
      searchText && handleSearch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginationParams]);

    const handleSearch = (e) => {
      if (searchText) {
        let params = {
          ...paginationParams,
          search: searchText,
          profileType: "KYB",
          parentProfileId: groupProfileId,
        };
        dispatch(
          CASE_MANAGEMENT_SEARCH_PROFILE({
            caseId: dataTabs.caseId,
            params: params,
          })
        ).then((result) => {});
      }
    };
    const onChangeSearch = (value) => {
      setSearchText(value);
    };
    const onPressAdd = (rowData) => {
      profileIdsAdded.push(rowData.kybId);
      setDataTab({ ...dataTabs, profileIdsAdded });
    };
    const isProfileAddedd = (rowData) => {
      if (profileIdsAdded.includes(rowData.kybId)) {
        return true;
      }
      return false;
    };
    const onPressCheck = (rowData) => {
      if (profileIdsAdded.includes(rowData.kybId)) {
        const index = profileIdsAdded.indexOf(rowData.kybId);
        //delete id in profileIdsAdded
        if (index > -1) {
          profileIdsAdded.splice(index, 1);
          setDataTab({ ...dataTabs, profileIdsAdded });
        }
      }
    };
    const isDisableAddProfile = () => {
      if (limitProfileAdded && profileIdsAdded.length === limitProfileAdded) {
        return true;
      }
      return false;
    };
    return (
      <div>
        <Grid container className={"mt-1 mb-1"} spacing={1}>
          <Grid item xs={9} style={{ paddingRight: 0 }}>
            <SearchBoxDebounce
              className={styles.searchBoxStyle}
              onChange={onChangeSearch}
              disableDebounce={true}
              placeholder={formatMessage({
                id: "kyb.watch.group.dialog.search",
              })}
              iconDeleteSearch={true}
              searchSub={true}
            />
          </Grid>
          <Grid item xs={3}>
            <div className={"d-flex float-right"}>
              <Button
                style={{ height: toRem(51), marginRight: toRem(11) }}
                variant="outlined"
                onClick={handleSearch}
                disabled={!searchText ? true : false}
              >
                <IntlMessages id={"appModule.search"} />
              </Button>
            </div>
          </Grid>
        </Grid>
        <Grid className={kycWrapper.customTable}>
          {listResult?.records?.length > 0 ? (
            <CustomTable
              //@ts-ignore
              lang={{
                rowsPerPage: <IntlMessages id={"appModule.table.footer"} />,
                pageRangeDisplayed: 2,
              }}
              options={{
                pagination: true,
                selectable: false,
                enableCollapsibleCell: true,
                renderCollapse: CustomColl,
                minWidth: toRem(33),
                maxWidth: toRem(33),
              }}
              labelDisplayedRows={({ count }) => {
                return (
                  <div>
                    <Typography
                      color="primary"
                      variant="body1"
                      component="span"
                    >
                      {count}
                    </Typography>{" "}
                    Matches
                  </div>
                );
              }}
              data={listResult}
              columnData={{
                kybId: {
                  label: "KYB ID",
                  sort: false,
                  align: "left",
                  renderCell: (v, { status }) => (
                    <div className={clsx(styles.Link, styles.Ids, "d-flex")}>
                      <Link
                        to={
                          status === "COMPLETED"
                            ? generatePath(KYB_ROUTE_RISK_ASSESSMENT, {
                                kybId: v
                              })
                            : generatePath(
                                KYB_ROUTE_KYB_SCREEN_RESULT,
                                {
                                  kybId: v
                                }
                              )
                        }
                        target="_blank"
                      >
                      {v}
                      </Link>
                    </div>
                  ),
                },
                businessName: {
                  sort: false,
                  align: "left",
                  label: <IntlMessages id="BusinessName" />,
                  renderCell: (v, { countryOfIncorporation, businessName }) => (
                    <div className={styles.businessName}>
                      {countryOfIncorporation && (
                        <Nullable
                          component={CountryFlagLanguage}
                          demonym
                          valueProp={"countryCode"}
                          svg
                        >
                          {countryOfIncorporation}
                        </Nullable>
                      )}
                      <Nullable>{businessName}</Nullable>
                    </div>
                  ),
                },
                status: {
                  label: <IntlMessages id="case.table.header.status" />,
                  sort: false,
                  align: "left",
                  enable: true,
                  renderCell: (v, { unresolved }) => {
                    return (
                      <div
                        className={clsx("d-flex flex-column", styles.Status)}
                      >
                        <ScreenStatusBadge
                          type="kyb"
                          status={v}
                          unresolved={unresolved}
                        />
                      </div>
                    );
                  },
                },
                add: {
                  sort: false,
                  label: "",
                  className: styles.width30,
                  renderCell: (v, rowData) => (
                    <div className={"d-flex flex-column align-items-center"}>
                      {isProfileAddedd(rowData) || rowData.profileAdded ? (
                        <CheckButton
                          onClick={() => onPressCheck(rowData)}
                          disabled={rowData.profileAdded}
                        />
                      ) : (
                        <PlusButton
                          disabled={isDisableAddProfile()}
                          onClick={() => onPressAdd(rowData)}
                        />
                      )}
                    </div>
                  ),
                },
              }}
            />
          ) : (
            <div
              className={clsx(
                styles.contentTable,
                "d-flex align-items-center flex-column"
              )}
            >
              {searchText && listResult?.total_records === 0 ? (
                <div className={"d-flex flex-column  align-items-center"}>
                  <NotFoundIcon />
                  <span className={clsx(styles.CellText, "mt-3")}>
                    <IntlMessages id={"table.no.matches.found"} />
                  </span>
                </div>
              ) : (
                <div className={"d-flex flex-column  align-items-center"}>
                  <SearchIcon />
                  <span className={clsx(styles.CellText, "mt-3")}>
                    <IntlMessages id={"Find KYB to add to case"} />
                  </span>
                </div>
              )}
            </div>
          )}
        </Grid>
      </div>
    );
  }
);
export default KYC;
