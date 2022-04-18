import { Grid, Typography } from "@mui/material";
import {
  Button,
  CheckButton,
  PlusButton,
} from "@protego/sdk/RegtankUI/v1/Button";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Link from "@protego/sdk/RegtankUI/v1/Link/Link";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable/index";
import CustomScrollbar from "@protego/sdk/RegtankUI/v1/Scrollbar";
import SearchBoxDebounce from "@protego/sdk/RegtankUI/v1/SearchBoxDebounce";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { generatePath } from "@protego/sdk/utils/router";
import { CASE_ROUTE_DETAIL } from "app/routes/Case/routes";
import { ReactComponent as IcOutlineSearch } from "assets/icons/IcoOutlineSearch.svg";
import { ReactComponent as NotFoundIcon } from "assets/icons/ic_notfound.svg";
import { ReactComponent as SearchIcon } from "assets/icons/ic_search.svg";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import RiskRatingLabel from "components/RiskRatingLabelv1";
import ScreenStatusBadge from "components/ScreenStatusBadgev1";
import {
  KYC_ROUTE_KYC_SCREEN_RESULT,
  KYC_ROUTE_KYC_SCREEN_SCORING,
} from "constants/routes";
import { get } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { formatDate, LONG_DATE, TIME } from "util/date";
import styles from "../KYBRiskAssessment.module.scss";
const DirectorsTable = ({
  data,
  open,
  onPressClose,
  resultName,
  title,
  paginationParams,
  onPressCheck,
  onPressAddItem,
  onPressSearchModal,
}) => {
  const [searchText, setSearchText] = React.useState("");
  const { formatMessage } = useIntl();

  const onChangeSearch = (value) => {
    setSearchText(value);
  };

  const CustomColl = (value) => {
    const risk = get(value?.individualRiskScore, "risk");
    const riskLevel = get(value?.individualRiskScore, "riskLevel");
    const numberOfChanges = get(value?.individualRiskScore, "numberOfChanges");
    const refId = get(value, "individualRequest.referenceId");

    return (
      <Grid container className={styles.cellColl}>
        <Grid item xs={4}>
          <div className={"d-flex flex-column align-items-start"}>
            <div>
              <div className={styles.labelPadding}>
                <Typography variant="small1">
                  <IntlMessages id={"risk-score"} />
                </Typography>
              </div>

              <RiskRatingLabel
                level={riskLevel}
                value={risk}
                type={
                  value?.individualRiskScore?.isSanction === true ? "San" : ""
                }
                numberOfChanges={numberOfChanges}
              />
            </div>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div className={"d-flex flex-column align-items-start"}>
            <div>
              <div className={styles.labelPadding}>
                <Typography variant="small1">
                  <IntlMessages id={"table.column.refId"} />
                </Typography>
              </div>
              <div>
                <Typography variant="body1">
                  <Nullable
                    component={Link}
                    to={
                      refId &&
                      generatePath(
                        CASE_ROUTE_DETAIL,
                        { caseId: encodeURIComponent(refId) },
                        { reference: true }
                      )
                    }
                  >
                    {refId}
                  </Nullable>
                </Typography>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div className={"d-flex flex-column align-items-start"}>
            <div>
              <div className={styles.labelPadding}>
                <Typography variant="small1">
                  <IntlMessages id={"case.table.header.status"} />
                </Typography>
              </div>

              <ScreenStatusBadge
                type="kyc"
                status={value?.status}
                unresolved={value?.unresolved}
              />
            </div>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div className={"d-flex flex-column align-items-start"}>
            <div>
              <div className={styles.labelPadding}>
                <Typography variant="small1">
                  <IntlMessages id={"screening.result.Assignee"} />
                </Typography>
              </div>

              <Typography variant="smallGrayDefault">
                <Nullable component={UserAvatar} valueProp={"user"} size={24}>
                  {value?.assignee}
                </Nullable>
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div className={"d-flex flex-column align-items-start"}>
            <div>
              <div className={styles.labelPadding}>
                <Typography variant="small1">
                  <IntlMessages id={"last-modified-by"} />
                </Typography>
              </div>

              <div>
                <Nullable
                  component={UserAvatar}
                  valueProp={"user"}
                  size={24}
                  description={
                    <Typography variant="smallGrayDefault">
                      <div className="d-flex flex-column">
                        <div>{formatDate(value?.updatedAt, LONG_DATE)}</div>
                        <div>{formatDate(value?.updatedAt, TIME)}</div>
                      </div>
                    </Typography>
                  }
                >
                  {value?.lastModifiedBy}
                </Nullable>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    );
  };
  let searchNotFound =
    (searchText || resultName) && data?.records?.length === 0 ? true : false;

  return (
    <div>
      <CustomScrollbar
        autoHeight={false}
        style={{
          width: toRem(752),
          height: toRem(568),
        }}
        classes={{
          scrollbarView: styles.customScrollbarView,
        }}
      >
        <div className={styles.cleanPaddingJRCard}>
          <Grid container>
            <Grid xs={12} item>
              <Grid container className="mt-1">
                <Grid item xs={10}>
                  <div className={"mr-2"}>
                    <SearchBoxDebounce
                      onChange={onChangeSearch}
                      disableDebounce={true}
                      placeholder={formatMessage({
                        id: "kyc.watch.group.dialog.search",
                      })}
                      searchIcon={<IcOutlineSearch />}
                      iconDeleteSearch
                    />
                  </div>
                </Grid>
                <Grid item xs={2}>
                  <div className={"d-flex justify-content-center"}>
                    <Button
                      disabled={searchText ? false : true}
                      onClick={() => onPressSearchModal(searchText)}
                      className={styles.btn}
                      variant="outlined"
                    >
                      <IntlMessages id={"appModule.search"} />
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} className={styles.bodyTable}>
              {data?.records?.length > 0 ? (
                <div>
                  <CustomTable
                    //@ts-ignore
                    lang={{
                      rowsPerPage: (
                        <IntlMessages id={"appModule.table.footer"} />
                      ),
                      pageRangeDisplayed: 2,
                    }}
                    labelDisplayedRows={({ count }) => {
                      return (
                        <div>
                          <Typography
                            color="primary"
                            variant="Subtitle5"
                            component="span"
                          >
                            {count}
                          </Typography>{" "}
                          <IntlMessages id={"matches"} />
                        </div>
                      );
                    }}
                    options={{
                      selectable: false,
                      disableTableHead: false,
                      enableCollapsibleCell: true,
                      renderCollapse: CustomColl,
                    }}
                    data={data}
                    columnData={{
                      kycId: {
                        label: (
                          <Typography variant="Subtitle4">
                            <IntlMessages id="kyc.kycId" />
                          </Typography>
                        ),
                        sort: false,
                        align: "left",
                        renderCell: (v, { status }) => (
                          <div className={clsx(styles.Link)}>
                            <Link
                              to={
                                status === "COMPLETED"
                                  ? generatePath(KYC_ROUTE_KYC_SCREEN_SCORING, {
                                      kycId: v,
                                    })
                                  : generatePath(KYC_ROUTE_KYC_SCREEN_RESULT, {
                                      kycId: v,
                                    })
                              }
                            >
                              {v}
                            </Link>
                          </div>
                        ),
                      },
                      "individualRequest.referenceId": {
                        sort: false,
                        align: "left",
                        label: <IntlMessages id="name" />,
                        renderCell: (v, { individualRequest, name }) => (
                          <Typography variant="subtitleGray">
                            <div>
                              {individualRequest?.nationality && (
                                <Nullable
                                  component={CountryFlagLanguage}
                                  demonym
                                  valueProp={"countryCode"}
                                  svg
                                >
                                  {individualRequest?.nationality}
                                </Nullable>
                              )}
                              <Nullable>{individualRequest?.name}</Nullable>
                            </div>
                          </Typography>
                        ),
                      },
                      "individualRequest.dateOfBirth": {
                        sort: false,
                        align: "left",
                        label: <IntlMessages id="date-of-birth" />,
                        renderCell: (v) => (
                          <div>
                            <Typography variant="subtitleGray">
                              <Nullable>{formatDate(v)}</Nullable>
                            </Typography>
                          </div>
                        ),
                      },
                      add: {
                        sort: false,
                        label: "",
                        className: styles.width30,
                        renderCell: (v, rowData) => (
                          <div className={"d-flex align-items-center"}>
                            {rowData?.added ? (
                              <span className={clsx("d-flex")}>
                                <CheckButton
                                  onClick={() => onPressCheck(rowData)}
                                />
                              </span>
                            ) : (
                              <PlusButton
                                onClick={() => onPressAddItem(rowData)}
                              />
                            )}
                          </div>
                        ),
                      },
                    }}
                  />
                </div>
              ) : (
                <div
                  className={clsx(
                    styles.contentTable,
                    "d-flex align-items-center flex-column"
                  )}
                >
                  {searchNotFound ? (
                    <div className={"d-flex flex-column  align-items-center"}>
                      <NotFoundIcon />
                      <span className={clsx(styles.textPlaceholder, "mt-3")}>
                        <Typography variant="button2">
                          <IntlMessages id={"table.no.matches.found"} />
                        </Typography>
                      </span>
                    </div>
                  ) : (
                    <div className={"d-flex flex-column align-items-center"}>
                      <SearchIcon />
                      <span className={clsx(styles.textPlaceholder, "mt-3")}>
                        <Typography variant="button2">
                          <IntlMessages id={"kyc.watch.group.dialog.Find"} />
                        </Typography>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </Grid>
          </Grid>
        </div>
      </CustomScrollbar>
    </div>
  );
};

export default DirectorsTable;
