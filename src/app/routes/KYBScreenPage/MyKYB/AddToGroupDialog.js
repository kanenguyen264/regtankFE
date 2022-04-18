import { Grid, Typography } from "@mui/material";
import {
  Button,
  CheckButton,
  PlusButton,
} from "@protego/sdk/RegtankUI/v1/Button";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Link from "@protego/sdk/RegtankUI/v1/Link/Link";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable/index";
import { withEnhancedPagination } from "@protego/sdk/RegtankUI/v1/withPagination";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { generatePath } from "@protego/sdk/utils/router";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import {
  KYB_ACTION_ADD_TO_GROUP,
  KYB_ACTION_WATCH_GROUP_SEARCH,
} from "actions/KYBAction";
import CustomScrollbar from "@protego/sdk/RegtankUI/v1/Scrollbar";
import { CASE_ROUTE_DETAIL } from "app/routes/Case/routes";
import { ReactComponent as NotFoundIcon } from "assets/icons/ic_notfound.svg";
import { ReactComponent as SearchIcon } from "assets/icons/ic_search.svg";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import RiskRatingLabel from "components/RiskRatingLabelv1";
import ScreenStatusBadge from "components/ScreenStatusBadgev1";
import SearchBoxDebounce from "@protego/sdk/RegtankUI/v1/SearchBoxDebounce";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import {
  KYB_ROUTE_KYB_SCREEN_RESULT,
  KYB_ROUTE_RISK_ASSESSMENT,
} from "constants/routes";
import React from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { snackActions } from "util/snackbarUtils";
import styles from "./KYBList.module.scss";
const AddToGroupDialog = withEnhancedPagination({ key: "addKybGroup" })(
  ({ data, isOpen, onClose, risk, paginationParams, group }) => {
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const [searchText, setSearchText] = React.useState("");
    const { watchGroupSearch } = useSelector((state) => state.kyb);
    const [loading, setLoading] = React.useState(false);
    const [listResult, setListResult] = React.useState([]);
    const [listAdded, setListAdded] = React.useState([]);

    React.useEffect(() => {
      if (searchText) {
        checkIsAdded(watchGroupSearch);
        return;
      }
      setListResult([]);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchGroupSearch]);

    React.useEffect(() => {
      if (searchText) onPressSearch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginationParams, group]);
    React.useEffect(() => {
      checkIsAdded(listResult);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listAdded]);

    const checkIsAdded = (list) => {
      let newList = list?.records?.map((item) => {
        let index = listAdded?.findIndex((i) => i === item?.kybId);
        if (index >= 0) {
          let obj = { ...item, added: true };
          return obj;
        }
        return item;
      });
      let updateList = { ...list, records: newList };
      setListResult(updateList);
    };
    const onPressClose = () => {
      onClose();
    };
    const onPressCheck = (rowData) => {
      if (listAdded.includes(rowData.kybId)) {
        const index = listAdded.indexOf(rowData.kybId);
        if (index > -1) {
          listAdded.splice(index, 1);
          setListAdded([...listAdded]);
        }
      }
    };
    const isProfileAdded = (rowData) => {
      if (listAdded.includes(rowData.kybId)) {
        return true;
      }
      return false;
    };
    const onSave = () => {
      setLoading(true);
      /**
       * Submit data
       */
      if (listAdded?.length === 0) {
        onClose();
        return;
      }
      let params = {
        kybIds: listAdded,
        watchGroupId: group?.id,
      };
      dispatch(KYB_ACTION_ADD_TO_GROUP({ params: params }))
        .then((result) => {
          let message =
            listAdded?.length +
            " " +
            formatMessage({ id: "kyb.watch.group.add.success" }) +
            " " +
            group?.name;
          snackActions.success(message);
        })
        .catch((err) => {
          snackActions.error(err?.toString());
        })
        .finally(() => {
          setLoading(false);
          onClose();
        });
    };
    const onChangeSearch = (value) => {
      if (!value) {
        setListResult([]);
      }
      setSearchText(value);
    };

    const onPressSearch = () => {
      setLoading(true);
      dispatch(
        KYB_ACTION_WATCH_GROUP_SEARCH({
          params: {
            ...paginationParams,
            search: searchText,
            watchGroupId: group?.id,
          },
        })
      )
        .then(() => {
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    const onPressAdd = (value) => {
      listAdded.push(value?.kybId);
      setListAdded([...listAdded]);
    };
    const CustomColl = (value) => {
      const riskLevel = value?.riskLevel;

      const refId = value?.referenceId;
      return (
        <Grid container spacing={2} className={"mt-2 mb-2"}>
          <Grid item xs={4}>
            <div
              className={
                "d-flex flex-column align-items-center justify-content-center"
              }
            >
              <span className={styles.textPlaceholder}>
                <IntlMessages id={"risk-level"} />
              </span>
              <div className={"mt-1 d-flex"}>
                <RiskRatingLabel
                  size="small"
                  level={riskLevel}
                  value={riskLevel?.split("", 1)}
                  showLevel
                  numberOfChanges={value?.countRiskLevelChange}
                />
              </div>
            </div>
          </Grid>
          <Grid item xs={4} className={"d-flex flex-column"}>
            <div className={"d-flex flex-column "}>
              <div className={"d-flex justify-content-center"}>
                <span className={styles.textPlaceholder}>
                  <IntlMessages id={"table.column.refId"} />
                </span>
              </div>
              <div className={styles.textOverflow}>
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
              </div>
            </div>
          </Grid>
          <Grid item xs={4} />
          <Grid item xs={4}>
            <div className={"d-flex flex-column align-items-center"}>
              <span className={styles.textPlaceholder}>
                <IntlMessages id={"case.table.header.status"} />
              </span>
              <ScreenStatusBadge
                type="kyb"
                status={value?.status}
                unresolved={value?.record?.unresolved}
              />
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className={"d-flex flex-column align-items-center"}>
              <span className={styles.textPlaceholder}>
                <IntlMessages id={"screening.result.Assignee"} />
              </span>
              <Nullable
                component={UserAvatar}
                valueProp={"user"}
                style={{ margin: "0 auto" }}
              >
                {value?.assignee}
              </Nullable>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className={"d-flex flex-column align-items-center"}>
              <span className={styles.textPlaceholder}>
                <IntlMessages id={"table.column.lastScreenBy"} />
              </span>
              <div
                style={{ width: toRem(150) }}
                className={"d-flex align-items-center"}
              >
                <Nullable
                  component={UserAvatar}
                  valueProp={"user"}
                  description={formatDate(value?.updatedAt, LONG_DATE_TIME)}
                >
                  {value?.lastModifiedBy}
                </Nullable>
              </div>
            </div>
          </Grid>
        </Grid>
      );
    };
    return (
      <Dialog
        open={isOpen}
        onClose={onPressClose}
        title={{
          text: (
            <Typography variant="titleForm">
              <IntlMessages id={"kyc.watch.group.add.to"} />
              <span className={styles.colorTitleDialog}> {group?.name} </span>
            </Typography>
          ),
        }}
        allowCloseOnTitle
        okProps={
          listResult?.total_records > 0 && {
            text: "save",
            onClick: onSave,
            disabled: listAdded?.length === 0,
          }
        }
        scrollType={"body"}
        className={styles.groupListDialogWrapper}
      >
        {/* <CloseableDialogTitle onClose={onPressClose}>
          <IntlMessages id={"kyb.watch.group.add.to"} />
          {group?.name}
        </CloseableDialogTitle> */}
        <LoadingWrapper loading={loading}>
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
              <Grid container className={"mt-1 mb-1"}>
                <Grid item xs={10}>
                  <div className={"mr-2"}>
                    <SearchBoxDebounce
                      onChange={onChangeSearch}
                      styleName={styles.searchBoxStyle}
                      disableDebounce={true}
                      placeholder={formatMessage({
                        id: "kyb.watch.group.dialog.search",
                      })}
                    />
                    {listResult?.total_records > 0 && (
                      <div className={"pt-3"}>
                        <span>
                          {listResult.total_records}{" "}
                          <IntlMessages id={"kyb.watch.group.matches"} />
                        </span>
                      </div>
                    )}
                  </div>
                </Grid>
                <Grid item xs={2}>
                  <div
                    className={
                      "d-flex align-items-center justify-content-center"
                    }
                  >
                    <Button
                      disabled={searchText ? false : true}
                      onClick={onPressSearch}
                      className={styles.btn}
                      variant="outlined"
                    >
                      <IntlMessages id={"appModule.search"} />
                    </Button>
                  </div>
                </Grid>
                <Grid item xs={12} className={styles.bodyTable}>
                  {listResult?.records?.length > 0 ? (
                    <div className={styles.marginHeader}>
                      <CustomTable
                        //@ts-ignore
                        lang={{
                          rowsPerPage: (
                            <IntlMessages id={"appModule.table.footer"} />
                          ),
                        }}
                        options={{
                          selectable: false,
                          disableTableHead: true,
                          enableCollapsibleCell: true,
                          renderCollapse: CustomColl,
                        }}
                        data={listResult}
                        columnData={{
                          kybId: {
                            label: "KYB ID",
                            sort: false,
                            align: "left",
                            renderCell: (v, { status }) => (
                              <div className={clsx(styles.Link)}>
                                <Link
                                  to={
                                    status === "COMPLETED"
                                      ? generatePath(
                                          KYB_ROUTE_RISK_ASSESSMENT,
                                          {
                                            kybId: v,
                                          }
                                        )
                                      : generatePath(
                                          KYB_ROUTE_KYB_SCREEN_RESULT,
                                          {
                                            kybId: v,
                                          }
                                        )
                                  }
                                >
                                  {v}
                                </Link>
                              </div>
                            ),
                          },
                          referenceId: {
                            sort: false,
                            align: "left",
                            label: <IntlMessages id="reference-id" />,
                            renderCell: (
                              v,
                              { countryOfIncorporation, businessName }
                            ) => (
                              <div>
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
                          add: {
                            sort: false,
                            label: "",
                            className: styles.width30,
                            renderCell: (v, rowData) => (
                              <div className={"d-flex align-items-center"}>
                                {isProfileAdded(rowData) ? (
                                  <span
                                    className={clsx(
                                      styles.textPlaceholder,
                                      "d-flex"
                                    )}
                                  >
                                    <CheckButton
                                      onClick={() => onPressCheck(rowData)}
                                    />
                                  </span>
                                ) : (
                                  <PlusButton
                                    onClick={() => onPressAdd(rowData)}
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
                      {searchText && listResult?.total_records === 0 ? (
                        <div
                          className={"d-flex flex-column  align-items-center"}
                        >
                          <NotFoundIcon />
                          <span
                            className={clsx(styles.textPlaceholder, "mt-3")}
                          >
                            <IntlMessages id={"table.no.matches.found"} />
                          </span>
                        </div>
                      ) : (
                        <div
                          className={"d-flex flex-column  align-items-center"}
                        >
                          <SearchIcon />
                          <span
                            className={clsx(styles.textPlaceholder, "mt-3")}
                          >
                            <IntlMessages id={"kyb.watch.group.dialog.Find"} />
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </Grid>
              </Grid>
            </div>
          </CustomScrollbar>
        </LoadingWrapper>
      </Dialog>
    );
  }
);
export default React.memo(AddToGroupDialog);
