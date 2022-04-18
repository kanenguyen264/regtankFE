import { DialogContent, Grid } from "@material-ui/core";
import Check from "@material-ui/icons/Check";
import CloseableDialogTitle from "@protego/sdk/UI/CloseableDialogTitle/CloseableDialogTitle";
import { generatePath } from "@protego/sdk/utils/router";
import {
  DJ_ACTION_ADD_TO_GROUP,
  DJ_ACTION_WATCH_GROUP_SEARCH,
} from "actions/DJAction";
import { CASE_ROUTE_DETAIL } from "app/routes/Case/routes";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import {
  DJ_KYC_ROUTE_KYC_SCREEN_RESULT,
  DJ_KYC_ROUTE_KYC_SCREEN_SCORING,
} from "constants/routes";
import { get } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { snackActions } from "util/snackbarUtils";
import styles from "./KYCList.module.scss";
import {
  Button,
  CheckButton,
  PlusButton,
} from "@protego/sdk/RegtankUI/v1/Button";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Link from "@protego/sdk/RegtankUI/v1/Link/Link";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable/index";
import CustomScrollbar from "@protego/sdk/RegtankUI/v1/Scrollbar";
import SearchBoxDebounce from "@protego/sdk/RegtankUI/v1/SearchBoxDebounce";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { withEnhancedPagination } from "@protego/sdk/RegtankUI/v1/withPagination";
import RiskRatingLabel from "components/RiskRatingLabelv1";
import ScreenStatusBadge from "components/ScreenStatusBadgev1";
import {Typography} from "@mui/material";
import { formatDate, LONG_DATE, TIME } from "util/date";
import { ReactComponent as IcOutlineSearch } from "assets/icons/IcoOutlineSearch.svg";
import { ReactComponent as NotFoundIcon } from "assets/icons/ic_notfound.svg";
import { ReactComponent as SearchIcon } from "assets/icons/ic_search.svg";

const AddToGroupDialog = withEnhancedPagination({ key: "addKycGroup" })(
  ({ data, isOpen, onClose, risk, paginationParams, group }) => {
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const [searchText, setSearchText] = React.useState("");
    const { watchGroupSearch } = useSelector((state) => state.downJones);
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
        let index = listAdded?.findIndex((i) => i === item?.kycId);
        if (index >= 0) {
          let obj = { ...item, added: true };
          return obj;
        }
        return item;
      });
      let updateList = { ...list, records: newList };
      setListResult(updateList);
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
        DJ_ACTION_WATCH_GROUP_SEARCH({
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
      listAdded.push(value?.kycId);
      setListAdded([...listAdded]);
    };

    const onPressClose = () => {
      onClose();
      // setLoading(true);
      // /**
      //  * Submit data
      //  */
      // if (listAdded?.length === 0) {
      //   onClose();
      //   return;
      // }
      // let params = {
      //   kycIds: listAdded,
      //   watchGroupId: group?.id,
      // };
      // dispatch(DJ_ACTION_ADD_TO_GROUP({ params: params }))
      //   .then((result) => {
      //     let message =
      //       listAdded?.length +
      //       " " +
      //       formatMessage({ id: "kyc.watch.group.add.success" }) +
      //       " " +
      //       group?.name;
      //     snackActions.success(message);
      //   })
      //   .catch((err) => {
      //     snackActions.error(err?.toString());
      //   })
      //   .finally(() => {
      //     setLoading(false);
      //     onClose();
      //   });
    };
    const isProfileAdded = (rowData) => {
      if (listAdded.includes(rowData.kycId)) {
        return true;
      }
      return false;
    };
    const onPressCheck = (rowData) => {
      if (listAdded.includes(rowData.kycId)) {
        const index = listAdded.indexOf(rowData.kycId);
        if (index > -1) {
          listAdded.splice(index, 1);
          setListAdded([...listAdded]);
        }
      }
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
        kycIds: listAdded,
        watchGroupId: group?.id,
      };
      dispatch(DJ_ACTION_ADD_TO_GROUP({ params: params }))
        .then((result) => {
          let message =
            listAdded?.length +
            " " +
            formatMessage({ id: "kyc.watch.group.add.success" }) +
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

    const CustomColl = (value) => {
      const risk = get(value?.individualRiskScore, "risk");
      const riskLevel = get(value?.individualRiskScore, "riskLevel");
      const numberOfChanges = get(
        value?.individualRiskScore,
        "numberOfChanges"
      );
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

                <div>
                  <Nullable component={UserAvatar} valueProp={"user"} size={24}>
                    {value?.assignee}
                  </Nullable>
                </div>
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
                      <div className="d-flex flex-column">
                        <div>{formatDate(value?.updatedAt, LONG_DATE)}</div>
                        <div>{formatDate(value?.updatedAt, TIME)}</div>
                      </div>
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
        className={styles.dialog}
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
                          onClick={onPressSearch}
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
                  {listResult?.records?.length > 0 ? (
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
                                variant="body1"
                                component="span"
                              >
                                {count}
                              </Typography>{" "}
                              <IntlMessages id={"kyc.labelMatches"} />
                            </div>
                          );
                        }}
                        options={{
                          selectable: false,
                          disableTableHead: false,
                          enableCollapsibleCell: true,
                          renderCollapse: CustomColl,
                        }}
                        data={listResult}
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
                                      ? generatePath(
                                        DJ_KYC_ROUTE_KYC_SCREEN_SCORING,
                                        {
                                          kycId: v,
                                        }
                                      )
                                      : generatePath(
                                        DJ_KYC_ROUTE_KYC_SCREEN_RESULT,
                                        {
                                          kycId: v,
                                        }
                                      )
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
                              <Typography>
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
                                <Typography>
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
                            <Typography variant="button2">
                              <IntlMessages id={"table.no.matches.found"} />
                            </Typography>
                          </span>
                        </div>
                      ) : (
                        <div
                          className={"d-flex flex-column align-items-center"}
                        >
                          <SearchIcon />
                          <span
                            className={clsx(styles.textPlaceholder, "mt-3")}
                          >
                            <Typography variant="button2">
                              <IntlMessages
                                id={"kyc.watch.group.dialog.Find"}
                              />
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
        </LoadingWrapper>
      </Dialog>
    );
  }
);

export default React.memo(AddToGroupDialog);
