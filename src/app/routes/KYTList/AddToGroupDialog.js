import {
  DialogContent,
  Grid,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import Check from "@material-ui/icons/Check";
import CloseableDialogTitle from "@protego/sdk/UI/CloseableDialogTitle/CloseableDialogTitle";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Link from "@protego/sdk/RegtankUI/v1/Link/Link";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable/index";
import withPagination, {
  withEnhancedPagination,
} from "@protego/sdk/RegtankUI/v1/withPagination";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { generatePath } from "@protego/sdk/utils/router";
import {
  KYT_ACTION_ADD_TO_GROUP,
  KYT_ACTION_WATCH_GROUP_SEARCH,
  KYT_ACTION_WATCH_GROUP_CLEAN,
} from "actions/KYTAction";
import { CASE_ROUTE_DETAIL } from "app/routes/Case/routes";
import { ReactComponent as NotFoundIcon } from "assets/icons/ic_notfound.svg";
import { ReactComponent as SearchIcon } from "assets/icons/ic_search.svg";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import RiskRatingLabel from "components/RiskRatingLabelv1";
import SearchBoxDebounce from "@protego/sdk/RegtankUI/v1/SearchBoxDebounce";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import WalletAddressText from "components/WalletAddressText";
import { MANUAL } from "constants/KYTOM";
import { KYT_ROUTE_SCREEN } from "constants/routes";
import { get, isEmpty } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "redux";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { snackActions } from "util/snackbarUtils";
import styles from "./KYTList.module.scss";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import CustomScrollbar from "@protego/sdk/RegtankUI/v1/Scrollbar";
import { PlusButton, CheckButton } from "@protego/sdk/RegtankUI/v1/Button";

const nullable = (data, fn = (d) => d) => (isEmpty(data) ? "-" : data > fn);

const AddToGroupDialog = withEnhancedPagination({ key: "addKytGroup" })(
  ({ data, isOpen, onClose, risk, paginationParams, group }) => {
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const [searchText, setSearchText] = React.useState("");
    const { watchGroupSearch } = useSelector((state) => state.kyt);
    const [loading, setLoading] = React.useState(false);
    const listResult = watchGroupSearch;
    const [listAdded, setListAdded] = React.useState([]);

    React.useEffect(() => {
      if (searchText) onPressSearch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginationParams, group]);

    const isProfileAddedd = (rowData) => {
      if (listAdded.includes(rowData.kytId)) {
        return true;
      }
      return false;
    };
    const onChangeSearch = (value) => {
      if (!value) {
        // setListResult([]);
      }
      setSearchText(value);
    };
    const onPressClose = () => {
      dispatch(KYT_ACTION_WATCH_GROUP_CLEAN());
      onClose && onClose();
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
        kytIds: listAdded,
        watchGroupId: group?.id,
      };
      dispatch(KYT_ACTION_ADD_TO_GROUP({ params: params }))
        .then((result) => {
          let message =
            listAdded?.length +
            " " +
            formatMessage({ id: "kyt.watch.group.add.success" }) +
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

    const onPressSearch = () => {
      setLoading(true);
      dispatch(
        KYT_ACTION_WATCH_GROUP_SEARCH({
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

    const onPressAdd = (rowData) => {
      listAdded.push(rowData.kytId);
      setListAdded([...listAdded]);
    };
    const onPressCheck = (rowData) => {
      if (listAdded.includes(rowData.kytId)) {
        const index = listAdded.indexOf(rowData.kytId);
        //delete id in profileIdsAdded
        if (index > -1) {
          listAdded.splice(index, 1);
          setListAdded([...listAdded]);
        }
      }
    };
    const renderOwner = (value) => {
      let v = get(value?.addressDetails, "wallet.name");
      let wallet = get(value?.addressDetails, "wallet");

      if (!v || v.trim().length === 0) {
        return nullable(v);
      }

      if (wallet.url && wallet.url.length) {
        return (
          <MuiLink href={wallet.url} target="_blank">
            {v}
          </MuiLink>
        );
      }
      return v;
    };
    const CustomColl = (value) => {
      const riskLevel = get(value?.addressDetails, "risk.riskLevel");
      const changes = get(value?.addressDetails, "kytRiskScoreChangeHistory");
      const riskValue = get(value?.addressDetails, "risk.risk");
      const hasChange = changes && changes.length;
      const isManuallyEdited = hasChange && changes[0].type === MANUAL;
      return (
        <div className={styles.CustomColWrapper}>
          <Grid container spacing={1} className={"mt-2 mb-2"}>
            <Grid item xs={1}>
              <div style={{ width: toRem(55) }}></div>
            </Grid>
            <Grid item xs={3}>
              <div className={"d-flex flex-column"}>
                <span className={"headerText"}>
                  <IntlMessages id={"risk-score"} />
                </span>
                <div className={"mt-1"}>
                  <RiskRatingLabel
                    level={riskLevel}
                    value={riskValue}
                    isManualEdit={isManuallyEdited}
                  />
                </div>
              </div>
            </Grid>
            <Grid item xs={2}>
              <div className={"d-flex flex-column"}>
                <span className={"headerText"}>
                  <IntlMessages id={"case.detail.table.kyt.header.assetType"} />
                </span>
                <span className={styles.textPlaceholder}>{value?.asset}</span>
              </div>
            </Grid>
            <Grid item xs={2} className={"d-flex flex-column"}>
              <div className={"d-flex flex-column"}>
                <div className={"d-flex"}>
                  <span className={"headerText"}>
                    <IntlMessages id={"table.column.refId"} />
                  </span>
                </div>
                <div className={styles.textOverflow}>
                  <Nullable
                    component={Link}
                    to={
                      value?.referenceId &&
                      generatePath(
                        CASE_ROUTE_DETAIL,
                        { caseId: encodeURIComponent(value?.referenceId) },
                        { reference: true }
                      )
                    }
                  >
                    {value?.referenceId}
                  </Nullable>
                </div>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className={"d-flex flex-column"}>
                <span className={"headerText"}>
                  <IntlMessages id={"owner"} />
                </span>
                <div className={styles.textOverSize}>{renderOwner(value)}</div>
              </div>
            </Grid>
            <Grid item xs={1}>
              <div style={{ width: toRem(55) }}></div>
            </Grid>
            <Grid item xs={3}>
              <div className={"d-flex flex-column"}>
                <span className={"headerText"}>
                  <IntlMessages id={"kyt.assignee"} />
                </span>
                <Nullable
                  component={UserAvatar}
                  valueProp={"user"}
                  // style={{ margin: "0 auto" }}
                >
                  {value?.assignee}
                </Nullable>
              </div>
            </Grid>
            <Grid item xs={2}>
              <div className={"d-flex flex-column"}>
                <span className={"headerText"}>
                  <IntlMessages id={"last-modified-by"} />
                </span>
                <div
                  style={{ width: toRem(120) }}
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
        </div>
      );
    };
    return (
      <Dialog
        open={isOpen}
        onClose={onPressClose}
        maxWidth={791}
        title={{
          text: (
            <Typography variant="titleForm">
              <IntlMessages id={"kyc.watch.group.add.to"} />
              <span className={styles.colorTitleDialog}> {group?.name} </span>
            </Typography>
          ),
        }}
        okProps={{
          text: "save",
          onClick: onSave,
          disabled: listAdded?.length === 0,
        }}
        allowCloseOnTitle
        scrollType={"body"}
        className={styles.groupListDialogWrapper}
      >
        <LoadingWrapper loading={loading}>
          <CustomScrollbar
            autoHeight={false}
            style={{
              width: toRem(752),
              height: toRem(652),
            }}
            classes={{
              scrollbarView: styles.customScrollbarView,
            }}
          >
            <Grid container className={"mt-1"} spacing={1}>
              <Grid item xs={10} style={{ paddingRight: 0 }}>
                <div className={"mr-2"}>
                  <SearchBoxDebounce
                    styleName={styles.searchBoxStyle}
                    onChange={onChangeSearch}
                    disableDebounce={true}
                    placeholder={formatMessage({
                      id: "kyt.watch.group.dialog.search",
                    })}
                  />
                </div>
              </Grid>
              <Grid item xs={2}>
                <div className={"d-flex justify-content-center"}>
                  <Button
                    size={"small"}
                    variant={"outlined"}
                    fullWidth
                    disabled={searchText ? false : true}
                    onClick={onPressSearch}
                    // className={styles.btn}
                    // className={clsx(styles.btn, styles.btnAdd)}
                  >
                    <IntlMessages id={"appModule.search"} />
                  </Button>
                </div>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {listResult?.records?.length > 0 ? (
                <div className={clsx(styles.tableDialog)}>
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
                          Matches
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
                      kytId: {
                        label: "KYT ID",
                        sort: false,
                        align: "left",
                        style: { whiteSpace: "nowrap" },
                        renderCell: (v, { status }) => (
                          <div
                            className={clsx(styles.Link, styles.Ids, "d-flex")}
                          >
                            <Link
                              to={generatePath(
                                KYT_ROUTE_SCREEN,
                                { id: v },
                                { source: "list" }
                              )}
                              data-cy={"id"}
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

                        renderCell: (
                          v,
                          { addressDetails: { wallet, address } }
                        ) => {
                          return (
                            <Grid container>
                              {/* {wallet?.country && (
                                <Grid item xs={1}>
                                  <div
                                    className={
                                      "d-flex align-items-start justify-content-start"
                                    }
                                  >
                                    <CountryFlagLanguage
                                      countryCode={wallet?.country}
                                      svg
                                      size={30}
                                    />
                                  </div>
                                </Grid>
                              )} */}
                              <Grid item xs={12}>
                                <div className={styles.textOverflow}>
                                  <WalletAddressText
                                    width={320}
                                    text={address}
                                    disableCopy={true}
                                  />
                                </div>
                              </Grid>
                            </Grid>
                          );
                        },
                      },
                      add: {
                        sort: false,
                        label: "",
                        className: styles.width30,
                        renderCell: (v, rowData) => (
                          <div className={"d-flex align-items-center"}>
                            {isProfileAddedd(rowData) ? (
                              <span
                                className={clsx(
                                  styles.textPlaceholder,
                                  "d-flex"
                                )}
                              >
                                <CheckButton
                                  onClick={() => onPressCheck(rowData)}
                                  // disabled={rowData.profileAdded}
                                />
                              </span>
                            ) : (
                              <PlusButton onClick={() => onPressAdd(rowData)} />
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
                        <IntlMessages id={"kyt.watch.group.dialog.Find"} />
                      </span>
                    </div>
                  )}
                </div>
              )}
            </Grid>
          </CustomScrollbar>
        </LoadingWrapper>
      </Dialog>
    );
  }
);

export default compose(withPagination)(AddToGroupDialog);
