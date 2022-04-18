import { Button, DialogContent, Grid } from "@material-ui/core";
import Check from "@material-ui/icons/Check";
import CloseableDialogTitle from "@protego/sdk/UI/CloseableDialogTitle/CloseableDialogTitle";
import CustomTable from "@protego/sdk/UI/CustomTable/CustomTable";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import Link from "@protego/sdk/UI/Link/Link";
import LoadingWrapper from "@protego/sdk/UI/LoadingWrapper/LoadingWrapper";
import Nullable from "@protego/sdk/UI/Nullable/index";
import withPagination, {
  withEnhancedPagination,
} from "@protego/sdk/UI/withPagination";
import { generatePath } from "@protego/sdk/utils/router";
import {
  KYC_ACTION_ADD_TO_GROUP,
  KYC_ACTION_WATCH_GROUP_SEARCH,
} from "actions/KYCAction";
import { KYT_ACTION_WATCH_GROUP_SEARCH } from "actions/KYTAction";
import { CASE_ROUTE_DETAIL } from "app/routes/Case/routes";
import { ReactComponent as SearchIcon } from "assets/icons/ic_search.svg";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import SearchBoxDebounce from "components/SearchBoxDebounce";
import {
  KYC_ROUTE_KYC_SCREEN_RESULT,
  KYC_ROUTE_KYC_SCREEN_SCORING,
} from "constants/routes";
import React from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { compose } from "redux";
import { snackActions } from "util/snackbarUtils";
import styles from "./KYCList.module.scss";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";

const AddToGroupDialog = withEnhancedPagination({ key: "addKycGroup" })(
  ({
    data,
    isOpen,
    onClose,
    risk,
    paginationParams,
    group,
    router,
    title,
    textPlaceholder,
  }) => {
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const [searchText, setSearchText] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
      onPressSearch();
    }, [paginationParams, group]);

    const onChangeSearch = (value) => {
      setSearchText(value);
    };

    const onPressSearch = () => {
      setLoading(true);
      var action = KYC_ACTION_WATCH_GROUP_SEARCH({
        params: {
          ...paginationParams,
          search: searchText,
          watchGroupId: group?.id,
        },
      });
      if (router === "KYT") {
        action = KYT_ACTION_WATCH_GROUP_SEARCH({
          params: {
            ...paginationParams,
            search: searchText,
            watchGroupId: group?.id,
          },
        });
      }

      dispatch(action)
        .then(() => {
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    const onPressAdd = (value) => {
      setLoading(true);
      let params = {
        kycIds: [value?.kycId],
        watchGroupId: group?.id,
      };
      dispatch(KYC_ACTION_ADD_TO_GROUP({ params: params }))
        .then((result) => {
          let message =
            formatMessage({ id: "kyc.watch.group.add.success" }) +
            " " +
            group?.name;
          snackActions.success(message);
        })
        .catch((err) => {
          snackActions.error(err?.toString());
        });
    };

    return (
      <Dialog maxWidth={"sm"} fullWidth open={isOpen} onClose={onClose}>
        <CloseableDialogTitle onClose={onClose}>
          {title}
          {group?.name}
        </CloseableDialogTitle>
        <LoadingWrapper loading={loading}>
          <DialogContent className={styles.cleanPaddingJRCard}>
            <Grid container className={"mt-3 mb-3"}>
              <Grid item xs={10}>
                <div className={"ml-2"}>
                  <SearchBoxDebounce
                    onChange={onChangeSearch}
                    disableDebounce={true}
                    placeholder={formatMessage({
                      id: textPlaceholder,
                    })}
                  />
                  {data?.records?.length > 0 && (
                    <div className={"pt-3"}>
                      <span>
                        {data.records.length}
                        <IntlMessages id={"kyt.watch.group.matches"} />
                      </span>
                    </div>
                  )}
                </div>
              </Grid>
              <Grid item xs={2}>
                <div className={"d-flex justify-content-center"}>
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
                {data?.records?.length > 0 ? (
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
                    }}
                    data={data}
                    columnData={{
                      kycId: {
                        label: "KYC ID",
                        sort: false,
                        align: "left",
                        renderCell: (v, { status }) => (
                          <div
                            className={clsx(
                              styles.Link,
                              styles.Ids,
                              "d-flex align-items-center"
                            )}
                          >
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
                        align: "center",
                        label: <IntlMessages id="reference-id" />,
                        renderCell: (v, { individualRequest }) => (
                          <div>
                            <Nullable
                              component={CountryFlagLanguage}
                              demonym
                              valueProp={"countryCode"}
                              svg
                            >
                              {individualRequest?.nationality}
                            </Nullable>
                            <Nullable
                              component={Link}
                              to={
                                v &&
                                generatePath(
                                  CASE_ROUTE_DETAIL,
                                  { caseId: encodeURIComponent(v) },
                                  { reference: true }
                                )
                              }
                            >
                              {v}
                            </Nullable>
                          </div>
                        ),
                      },
                      add: {
                        sort: false,
                        label: "",
                        className: styles.width30,
                        renderCell: (v, rowData) => (
                          <div className={"d-flex align-items-center"}>
                            {rowData?.groupAdd ? (
                              <span
                                className={clsx(
                                  styles.textPlaceholder,
                                  "d-flex"
                                )}
                              >
                                <Check />
                                <IntlMessages id={"kyc.group.added"} />
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
                ) : (
                  <div className={"d-flex align-items-center flex-column mt-4"}>
                    <SearchIcon />
                    <span className={clsx(styles.textPlaceholder, "mt-3")}>
                      <IntlMessages id={"kyc.watch.group.dialog.Find"} />
                    </span>
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

export default compose(withPagination)(AddToGroupDialog);
