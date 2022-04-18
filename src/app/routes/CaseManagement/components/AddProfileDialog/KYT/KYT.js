import Check from "@material-ui/icons/Check";
import { Button, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import SearchBoxDebounce from "@protego/sdk/RegtankUI/v1/SearchBoxDebounce";
import { withEnhancedPagination } from "@protego/sdk/RegtankUI/v1/withPagination";
import { toRem } from "@protego/sdk/utils/measurements";
import { CASE_MANAGEMENT_SEARCH_PROFILE } from "actions/CaseManagementAction";
import { PlusButton, CheckButton } from "@protego/sdk/RegtankUI/v1/Button";
import { ReactComponent as NotFoundIcon } from "assets/icons/ic_notfound.svg";
import { ReactComponent as SearchIcon } from "assets/icons/ic_search.svg";
import clsx from "clsx";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { useKycStyles } from "../muiStyles/kycStyles";
import CustomColl from "./CustomColl";
import styles from "./KYTList.module.scss";
import WalletAddressText from "components/WalletAddressText";
import { generatePath } from "@protego/sdk/utils/router";
import {
  KYC_ROUTE_KYC_SCREEN_RESULT,
  KYC_ROUTE_KYC_SCREEN_SCORING,
  KYB_ROUTE_KYB_SCREEN_RESULT,
  KYB_ROUTE_RISK_ASSESSMENT,
  KYT_ROUTE_SCREEN,
} from "constants/routes";
import Link from "@protego/sdk/RegtankUI/v1/Link/Link";
const KYC = withEnhancedPagination({ key: "kytTab" })(
  ({
    listResult,
    limitProfileAdded,
    dataTabs,
    setDataTab,
    paginationParams,
  }) => {
    const kycWrapper = useKycStyles();
    const { formatMessage } = useIntl();
    const [searchText, setSearchText] = useState("");
    const dispatch = useDispatch();
    const { profileIdsAdded, groupProfileId } = dataTabs;
    React.useEffect(() => {
      if (searchText) handleSearch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginationParams]);

    const handleSearch = (e) => {
      if (searchText) {
        let params = {
          ...paginationParams,
          search: searchText,
          profileType: "KYT",
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
      profileIdsAdded.push(rowData.kytId);
      setDataTab({ ...dataTabs, profileIdsAdded });
    };
    const isProfileAddedd = (rowData) => {
      if (profileIdsAdded.includes(rowData.kytId)) {
        return true;
      }
      return false;
    };
    const onPressCheck = (rowData) => {
      if (profileIdsAdded.includes(rowData.kytId)) {
        const index = profileIdsAdded.indexOf(rowData.kytId);
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
                id: "KYT ID, Wallet Address",
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
                kytId: {
                  label: "KYT ID",
                  sort: false,
                  align: "left",
                  renderCell: (v, { status }) => (
                    <div className={clsx(styles.Link, styles.Ids)}>
                      <Link
                        to={generatePath(
                          KYT_ROUTE_SCREEN,
                          { id: v },
                          { source: "list" }
                        )}
                        data-cy={"id"}
                        target={"_blank"}
                      >
                        {v}
                      </Link>
                    </div>
                  ),
                },
                "addressDetails.address": {
                  label: <IntlMessages id="Wallet Address" />,
                  sort: false,
                  align: "left",
                  renderCell: (v, { addressDetails: { wallet, address } }) => {
                    return (
                      <div className={styles.walletAddress}>
                        <WalletAddressText text={address} disableCopy={true} />
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
                  <span className={clsx(styles.textPlaceholder, "mt-3")}>
                    <IntlMessages id={"table.no.matches.found"} />
                  </span>
                </div>
              ) : (
                <div className={"d-flex flex-column  align-items-center"}>
                  <SearchIcon />
                  <span className={clsx(styles.textPlaceholder, "mt-3")}>
                    <IntlMessages id={"Find KYT to add to case"} />
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
