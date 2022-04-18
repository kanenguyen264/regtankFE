import { Button, Dialog, DialogContent, Grid } from "@material-ui/core";
import Check from "@material-ui/icons/Check";
import CustomTable from "@protego/sdk/UI/CustomTable/CustomTable";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import Link from "@protego/sdk/UI/Link/Link";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import Nullable from "@protego/sdk/UI/Nullable/index";
import withPagination, {
  withEnhancedPagination,
} from "@protego/sdk/UI/withPagination";
import { toRem } from "@protego/sdk/utils/measurements";
import { generatePath } from "@protego/sdk/utils/router";
import {
  CASE_ACTION_ADD_TO_GROUP,
  CASE_ACTION_WATCH_GROUP_SEARCH,
} from "actions/CaseAction";
import { CASE_ROUTE_DETAIL } from "app/routes/Case/routes";
import { ReactComponent as SearchIcon } from "assets/icons/ic_search.svg";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import ScreenStatusBadge from "components/ScreenStatusBadge";
import RiskRatingLabel from "components/RiskRatingLabel";
import SearchBoxDebounce from "components/SearchBoxDebounce";
import UserAvatar from "components/UserAvatar";
import { get } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { compose } from "redux";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { snackActions } from "util/snackbarUtils";
import styles from "./CasePage.module.scss";
import { ReactComponent as NotFoundIcon } from "assets/icons/ic_notfound.svg";
import CloseableDialogTitle from "@protego/sdk/UI/CloseableDialogTitle/CloseableDialogTitle";
import { filterCols } from "./MyCase";
import { withACL } from "../../../../acl";
import { canAccessKYT } from "util/permision";

const columns = {
  "latestKyc.individualRequest.name": {
    label: <IntlMessages id="case.table.header.referenceId" />,
    sort: true,
    enable: true,
    style: { wordBreak: "break-word" },
    renderCell: (v, { latestKyc }) => (
      <div className={"d-flex"}>
        {latestKyc?.individualRequest?.nationality && (
          <Nullable
            component={CountryFlagLanguage}
            valueProp={"countryCode"}
            svg
            demonym
          >
            {latestKyc?.individualRequest?.nationality}
          </Nullable>
        )}

        <Nullable>{latestKyc?.individualRequest?.name}</Nullable>
      </div>
    ),
  },
  "latestKyc.individualRequest.dateOfBirth": {
    label: <IntlMessages id="case.table.header.DOB" />,
    sort: true,
    enable: true,
    className: styles.with130,
    renderCell: (v, { latestKyc }) => (
      <div className={"flex-center"}>
        <Nullable>
          {formatDate(latestKyc?.individualRequest?.dateOfBirth)}
        </Nullable>
      </div>
    ),
  },
};

const AddToGroupDialog = withEnhancedPagination({ key: "addCaseGroup" })(
  ({ data, isOpen, onClose, risk, paginationParams, group, ACL }) => {
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const [searchText, setSearchText] = React.useState("");
    const { watchGroupSearch } = useSelector((state) => state.case);
    const [loading, setLoading] = React.useState(false);
    const [listResult, setListResult] = React.useState([]);
    const [listAdded, setListAdded] = React.useState([]);
    const { customerMe } = useSelector((state) => state.settings, shallowEqual);

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
        let index = listAdded?.findIndex((i) => i === item?.caseId);
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
    const onPressClose = () => {
      setLoading(true);
      if (listAdded?.length === 0) {
        onClose();
        return;
      }

      let params = {
        caseIds: listAdded,
        watchGroupId: group?.id,
      };
      dispatch(CASE_ACTION_ADD_TO_GROUP({ params: params }))
        .then((result) => {
          let message =
            listAdded?.length +
            " " +
            formatMessage({ id: "case.watch.group.add.success" }) +
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
        CASE_ACTION_WATCH_GROUP_SEARCH({
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
      setListAdded((listAdded) => [...listAdded, value?.caseId]);
    };

    const CustomColl = (value) => {
      const riskLevel = get(value?.latestKyc, "individualRiskScore.riskLevel");
      const riskLevelKYT = get(
        value?.latestKyt,
        "addressDetails.risk.riskLevel"
      );
      const numberOfChanges = get(
        value?.latestKyc,
        "individualRiskScore.numberOfChanges"
      );
      const isSan = get(value?.latestKyc, "individualRiskScore.isSanction");
      const riskScore = get(value?.latestKyc, "individualRiskScore.risk");
      const riskScoreKYT = get(value?.latestKyt, "addressDetails.risk.risk");
      const refId = get(value?.latestKyc, "individualRequest.referenceId");
      return (
        <Grid container spacing={2} className={"mt-2 mb-2"}>
          {ACL.isAllowedPermissions("KYC_MODULE_VIEW") && (
            <>
              <Grid item xs={4}>
                <div className={"d-flex flex-column align-items-center"}>
                  <span className={styles.textPlaceholder}>
                    <IntlMessages id={"case.table.header.kycRiskScore"} />
                  </span>
                  <div className={"mt-1"}>
                    <RiskRatingLabel
                      level={riskLevel}
                      value={riskScore}
                      type={isSan ? "San" : ""}
                      numberOfChanges={numberOfChanges}
                    />
                  </div>
                </div>
              </Grid>
              <Grid item xs={4} className={"d-flex flex-column"}>
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
              </Grid>
              <Grid item xs={4}>
                <div className={"d-flex flex-column align-items-center"}>
                  <span className={styles.textPlaceholder}>
                    <IntlMessages id={"case.table.header.status"} />
                  </span>
                  <Nullable
                    component={ScreenStatusBadge}
                    type="kyc"
                    status={value?.latestKyc?.status}
                    unresolved={value?.latestKyc?.unresolved}
                    // className={styles.statusBadge}
                  >
                    {value?.latestKyc?.status}
                  </Nullable>
                </div>
              </Grid>
            </>
          )}

          {ACL.isAllowedPermissions("KYT_MODULE_VIEW") &&
            canAccessKYT(customerMe) && (
              <>
                <Grid item xs={4}>
                  <div className={"d-flex flex-column align-items-center"}>
                    <span className={styles.textPlaceholder}>
                      <IntlMessages id={"case.table.header.kytRiskScore"} />
                    </span>
                    <div className={"mt-1"}>
                      <RiskRatingLabel
                        level={riskLevelKYT}
                        value={riskScoreKYT}
                      />
                    </div>
                  </div>
                </Grid>
                <Grid item xs={4}>
                  <div className={"d-flex flex-column align-items-center"}>
                    <span className={styles.textPlaceholder}>
                      <IntlMessages id={"kyt.assignee"} />
                    </span>
                    <Nullable
                      component={UserAvatar}
                      valueProp={"user"}
                      style={{ margin: "0 auto" }}
                    >
                      {value?.latestKyt?.assignee}
                    </Nullable>
                  </div>
                </Grid>
                <Grid item xs={4}>
                  <div className={"d-flex flex-column"}>
                    <div>
                      <span className={styles.textPlaceholder}>
                        <IntlMessages id={"table.column.lastScreenBy"} />
                      </span>
                    </div>
                    <div
                      className={clsx("d-flex align-items-center")}
                      style={{ width: toRem(140) }}
                    >
                      <Nullable
                        component={UserAvatar}
                        valueProp={"user"}
                        description={formatDate(
                          value?.latestKyc?.updatedAt,
                          LONG_DATE_TIME
                        )}
                      >
                        {value?.latestKyc?.lastModifiedBy}
                      </Nullable>
                    </div>
                  </div>
                </Grid>
              </>
            )}
        </Grid>
      );
    };
    return (
      <Dialog maxWidth={"sm"} fullWidth open={isOpen} onClose={onPressClose}>
        <CloseableDialogTitle onClose={onPressClose}>
          <IntlMessages id={"case.watch.group.add.to"} />
          {group?.name}
        </CloseableDialogTitle>
        <LoadingWrapper loading={loading}>
          <DialogContent className={styles.cleanPadding}>
            <Grid container className={"mt-1 mb-1"}>
              <Grid item xs={10}>
                <div className={"mr-2"}>
                  <SearchBoxDebounce
                    onChange={onChangeSearch}
                    styleName={styles.textSearchPlaceholder}
                    disableDebounce={true}
                    placeholder={formatMessage({
                      id: "case.watch.group.dialog.search",
                    })}
                  />
                  {listResult?.total_records > 0 && (
                    <div className={"pt-3"}>
                      <span>
                        {listResult.total_records}{" "}
                        <IntlMessages id={"case.watch.group.matches"} />
                      </span>
                    </div>
                  )}
                </div>
              </Grid>
              <Grid item xs={2}>
                <div
                  className={"d-flex align-items-center justify-content-center"}
                >
                  <Button
                    disabled={searchText ? false : true}
                    onClick={onPressSearch}
                    className={styles.btn}
                  >
                    <IntlMessages id={"appModule.search"} />
                  </Button>
                </div>
              </Grid>
              <Grid item xs={12}>
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
                        enableCollapsibleCell:
                          ACL.isAllowedPermissions("KYC_MODULE_VIEW") ||
                          (ACL.isAllowedPermissions("KYT_MODULE_VIEW") &&
                            canAccessKYT(customerMe))
                            ? true
                            : false,
                        renderCollapse: CustomColl,
                      }}
                      data={listResult}
                      columnData={{
                        ...filterCols(
                          columns,
                          !ACL.isAllowedPermissions("KYC_MODULE_VIEW"),
                          !(
                            canAccessKYT(customerMe) &&
                            ACL.isAllowedPermissions("KYT_MODULE_VIEW")
                          )
                        ),
                        add: {
                          sort: false,
                          label: "",
                          className: styles.width30,
                          renderCell: (v, rowData) => (
                            <div className={"d-flex align-items-center"}>
                              {rowData?.added ? (
                                <span
                                  className={clsx(
                                    styles.textPlaceholder,
                                    "d-flex"
                                  )}
                                >
                                  <Check />
                                  <IntlMessages id={"case.group.added"} />
                                </span>
                              ) : (
                                <Button
                                  size={"small"}
                                  variant={"contained"}
                                  disabled={v}
                                  className={clsx(styles.btn, styles.btnAdd)}
                                  fullWidth
                                  onClick={() => onPressAdd(rowData)}
                                >
                                  <IntlMessages id="kyb.table.add" />
                                </Button>
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
                          <IntlMessages id={"case.watch.group.dialog.Find"} />
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </Grid>
            </Grid>
          </DialogContent>
        </LoadingWrapper>
      </Dialog>
    );
  }
);

export default compose(withPagination, withACL)(AddToGroupDialog);
