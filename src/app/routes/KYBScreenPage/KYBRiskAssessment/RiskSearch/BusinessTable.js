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
import RiskRatingLabel from "components/RiskRatingLabelv1";
import ScreenStatusBadge from "components/ScreenStatusBadgev1";
import { get } from "lodash";
import React from "react";
import { useIntl } from "react-intl";
import { formatDate, LONG_DATE, TIME } from "util/date";
import styles from "../KYBRiskAssessment.module.scss";

const BusinessTable = ({
  kycSelect,
  data,
  open,
  onPress,
  onPressClose,
  resultName,
  page,
  title,
  paginationParams,
  onPressCheck,
  onPressAddItem,
  onPressSearchModal,
  onPressAdd,
  findNotFound,
  props,
}) => {
  const [searchText, setSearchText] = React.useState(resultName);
  const { formatMessage } = useIntl();

  const onChangeSearch = (value) => {
    setSearchText(value);
  };

  const CustomColl = (value) => {
    const risk = get(value, "risk");
    const riskLevel = get(value, "riskLevel");
    const numberOfChanges = get(value, "countRiskLevelChange");
    const refId = get(value, "referenceId");

    return (
      <Grid container className={styles.cellColl}>
        <Grid item xs={4}>
          <div className={"d-flex flex-column align-items-start"}>
            <div>
              <div className={styles.labelPadding}>
                <Typography variant="small1">
                  <IntlMessages id={"risk-level"} />
                </Typography>
              </div>
              <RiskRatingLabel
                level={riskLevel}
                value={riskLevel?.split("", 1)}
                showLevel
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
                        id: "kyb.watch.group.dialog.search",
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
                      kybId: {
                        label: (
                          <Typography variant="Subtitle4">
                            <IntlMessages id="kyb.kybId" />
                          </Typography>
                        ),
                        sort: false,
                        align: "left",
                        renderCell: (v, { status }) => {
                          return (
                            <div>
                              <Link
                                to={`/app/screen-kyb/result/${v}${
                                  status === "COMPLETED"
                                    ? "/riskAssessment"
                                    : ""
                                }`}
                                target={"_blank"}
                              >
                                {v}
                              </Link>
                            </div>
                          );
                        },
                      },

                      businessName: {
                        sort: false,
                        style: { wordBreak: "break-all" },
                        label: <IntlMessages id="result.Table.BusinessName" />,
                        renderCell: (v) => (
                          <Typography variant="subtitleGray">{v}</Typography>
                        ),
                      },
                      dateOfIncorporation: {
                        sort: false,
                        align: "center",
                        className: styles.width140,
                        label: <IntlMessages id="form.dateOfIncorporation" />,
                        renderCell: (v) => (
                          <div className={"flex-center"}>
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
                          <IntlMessages id={"kyb.watch.group.dialog.Find"} />
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

export default BusinessTable;
