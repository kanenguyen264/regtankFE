import IconButton from "@mui/material/IconButton";
import { SvgIcon, Typography } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import Link from "@protego/sdk/RegtankUI/v1/Link";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import SearchBox from "@protego/sdk/RegtankUI/v1/SearchBoxDebounce";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable/index";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { generatePath } from "@protego/sdk/utils/router";
import { fetchAllLivenessRequest } from "actions/Liveness";
import { ReactComponent as Circle } from "assets/icons/circle.svg";
import { ReactComponent as SendIcon } from "assets/icons/IcSendLN.svg";
import { ReactComponent as CopyIcon } from "assets/images/icons/CopyIcon.svg";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import LimitTooltipText from "components/LimitTooltipTextv1";
import {
  FILTER_APPROVAL_STATUS,
  FILTER_STATUS,
  LIVENESS_MODE,
  VERIFY_STATUS,
} from "constants/LivenessTest";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "constants/pagingSetting";
import { LIVENESS_ROUTE_LIVENESS_DETAIL } from "constants/routes";
import { debounce } from "lodash";
import numeral from "numeral";
import React, { memo, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { compose } from "recompose";
import { fetchLivenessSetting, resentRequestFromApi } from "services/Liveness";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { snackActions } from "util/snackbarUtils";
import { displayLimitText, getFullName } from "util/string";
import { parseQuery } from "util/stringQuery";
import Status from "./components/Status";
import StatusDropdownList from "./components/StatusDropdown";
import styles from "./Liveness.module.scss";
import { ReactComponent as RefreshBoder } from "assets/icons/refreshBoder.svg";
const Liveness = ({ paginationParams }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const { liveness, loader } = useSelector((state) => state.liveness);
  const [searchText, setSearchText] = useState("");
  const [searchFilterStatus, setSearchFilterStatus] = useState();
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [currentRecord, setCurrentRecord] = React.useState(null);
  const [selections, setSelectItem] = React.useState([]);
  const [isApproveMode, setLivenessMode] = React.useState(false);
  const { formatMessage } = useIntl();
  const onConfirmYes = () => {
    setOpenConfirm(false);
    handleResendEmail();
  };
  const handleResendEmail = async () => {
    try {
      const response = await resentRequestFromApi(currentRecord.requestId);
      if (response.status === 200) {
        snackActions.success(
          <IntlMessages id={"liveness.resendEmailSuccessMessage"} />
        );

        setTimeout(() => {
          loadData();
        }, 1000);
      }
    } catch (error) {
      snackActions.error(
        <IntlMessages id={"liveness.resendEmailFailedMessage"} />
      );
    }
  };

  const handleChangeStatusFilter = (value) => {
    let status = value && value !== -1 ? value : statusFilter;
    if (value === -1) {
      status = "";
    }
    setSearchFilterStatus(status);
  };

  const handleResendClick = (record) => {
    setCurrentRecord(record);
    setOpenConfirm(true);
  };

  const handleSelected = (e) => {
    setSelectItem(e);
  };
  const onChangeSearch = (value) => {
    setSearchText(value);
  };
  const buildSortParams = (sort) => {
    const sortArray = sort ? sort.split(",") : [];
    if (!sortArray) {
      return {};
    }
    return {
      sortBy: sortArray[0],
      orderBy: sortArray[1],
    };
  };

  const { page, size, status, keyword, dateFrom, dateTo, sort } = parseQuery(
    location.search
  );
  const currentSize =
    parseInt(size) && parseInt(size) !== 0 ? parseInt(size) : DEFAULT_PAGE_SIZE;
  const currentPage =
    parseInt(page) && parseInt(page) !== 0 ? parseInt(page) : DEFAULT_PAGE;
  const statusFilter = status || null;

  const keywordFilter = keyword || null;
  const dateFromFilter = dateFrom || null;
  const dateToFilter = dateTo || null;

  const loadData = () => {
    dispatch(
      fetchAllLivenessRequest({
        page: currentPage,
        size: currentSize,
        status: searchFilterStatus,
        keyword: searchText.trim(),
        ...buildSortParams(sort),
      })
    );
  };

  const loadSetting = async () => {
    try {
      const response = await fetchLivenessSetting();
      if (response.status === 200) {
        setLivenessMode(response?.data?.approveMode || false);
      }
    } catch (error) {
      setLivenessMode(LIVENESS_MODE.AUTO);
    }
  };

  useEffect(() => {
    loadSetting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams, searchFilterStatus]);
  const closeConfirm = () => {
    setOpenConfirm(false);
  };
  return (
    <>
      <PageHeading
        customUrlResolver={(index, sub) => {
          if (index === 1)
            return [<IntlMessages id={"liveness.header"} />, false, false];
        }}
        title={
          <IntlMessages
            id={"liveness.header"}
            values={{ test: "react-intl" }}
          />
        }
      />
      <div className={styles.clsOnboardingPage}>
        <LoadingWrapper loading={loader} size={"3rem"}>
          <>
            <JRCard
              header={
                <div style={{ width: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ flexGrow: 1 }}>
                      <Typography className={styles.headerTitleTable}>
                        <IntlMessages id="liveness.allOnboarding" />
                      </Typography>
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <span
                        onClick={() => loadData()}
                        className={styles.iconRefresh}
                      >
                        <RefreshBoder />
                      </span>
                    </div>
                  </div>
                </div>
              }
              // headerLine
              fullBody
              className={styles.card}
            >
              <div className={styles.filterSearch}>
                <div style={{ width: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ flexGrow: 1 }}>
                      <Typography className={styles.filterBy}>
                        <IntlMessages id="filter.by" />{" "}
                        <StatusDropdownList
                          data={
                            isApproveMode
                              ? FILTER_APPROVAL_STATUS
                              : FILTER_STATUS
                          }
                          value={statusFilter || -1}
                          onChange={handleChangeStatusFilter}
                        />
                      </Typography>
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <SearchBox
                        className={styles.searchOnboarding}
                        onChange={onChangeSearch}
                        placeholder={formatMessage({
                          id: "liveness.placeholder.searchList",
                        })}
                        value={keywordFilter}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <CustomTable
                lang={{
                  rowsPerPage: <IntlMessages id={"appModule.table.footer"} />,
                }}
                columnData={{
                  requestId: {
                    label: "ID",
                    sort: true,
                    enable: true,
                    renderCell: (v, { status }) => (
                      <CopyButton
                        component={"span"}
                        placement={"top-start"}
                        copyIcon={
                          <SvgIcon component={CopyIcon} viewBox="0 0 18 16" />
                        }
                      >
                        <Link
                          to={generatePath(LIVENESS_ROUTE_LIVENESS_DETAIL, {
                            requestId: v,
                          })}
                        >
                          {v}
                        </Link>
                      </CopyButton>
                    ),
                  },
                  name: {
                    label: <IntlMessages id="liveness.name" />,
                    sort: true,
                    enable: true,
                    className: styles.cellName,
                    renderCell: (v, record) => {
                      return (
                        <Nullable>
                          {record?.firstName ||
                          record?.lastName ||
                          record?.middleName ? (
                            <LimitTooltipText
                              text={getFullName(record)}
                              disableCopy
                              isRouter={true}
                              limitText={
                                record &&
                                displayLimitText(
                                  String(getFullName(record)),
                                  10
                                )
                              }
                            />
                          ) : (
                            "-"
                          )}
                        </Nullable>
                      );
                    },
                  },
                  country: {
                    label: <IntlMessages id="liveness.country" />,
                    sort: true,
                    enable: true,
                    align: "center",
                    renderCell: (v) => (
                      <Nullable
                        component={CountryFlagLanguage}
                        valueProp={"countryCode"}
                        svg
                      >
                        {v}
                      </Nullable>
                    ),
                  },
                  email: {
                    label: <IntlMessages id="liveness.email" />,
                    sort: true,
                    enable: true,

                    renderCell: (v) => {
                      return (
                        <Nullable>
                          {" "}
                          <LimitTooltipText
                            text={v}
                            disableCopy
                            isRouter={true}
                            limitText={v && displayLimitText(String(v), 9)}
                          />
                        </Nullable>
                      );
                    },
                  },

                  confidence: {
                    label: <IntlMessages id="liveness.matched" />,
                    sort: true,
                    enable: true,
                    align: "center",
                    renderCell: (v) => {
                      return (
                        <span>{v ? `${numeral(v).format("0,0")}%` : "-"}</span>
                      );
                    },
                  },
                  status: {
                    label: <IntlMessages id="liveness.status" />,
                    sort: true,
                    enable: true,
                    align: "left",
                    renderCell: (v) => (
                      <div className="d-flex">
                        <Status status={v} shortMode />
                      </div>
                    ),
                  },
                  createdDate: {
                    label: <IntlMessages id="liveness.createdAt" />,
                    sort: true,
                    enable: true,
                    align: "left",
                    renderCell: (v) => (
                      <div>{formatDate(v, LONG_DATE_TIME)}</div>
                    ),
                  },
                  updatedDate: {
                    label: <IntlMessages id="liveness.updatedAt" />,
                    sort: true,
                    enable: true,
                    align: "left",
                    renderCell: (v) => (
                      <div>{formatDate(v, LONG_DATE_TIME)}</div>
                    ),
                  },
                  btn: {
                    label: <IntlMessages id="liveness.action" />,
                    sort: false,
                    enable: true,
                    align: "center",
                    renderCell: (v, record) => (
                      <div className="d-flex justify-content-center">
                        {[
                          VERIFY_STATUS.APPROVED.key,
                          VERIFY_STATUS.WAIT_FOR_APPROVAL.key,
                          VERIFY_STATUS.LIVENESS_PASSED.key,
                        ].indexOf(record?.status) === -1 && (
                          <IconButton
                            color="default"
                            component="span"
                            onClick={() => handleResendClick(record)}
                          >
                            <SendIcon />
                          </IconButton>
                        )}
                      </div>
                    ),
                  },
                }}
                options={{
                  selectable: true,
                  selections: selections,
                  onSelected: handleSelected,
                }}
                data={liveness}
              />
              {(liveness?.records?.length ?? 0) === 0 && (
                <p
                  className="text-center"
                  style={{
                    marginTop: toRem(40),
                    fontWeight: 500,
                    color: "#808080",
                  }}
                >
                  <IntlMessages id="liveness.emptyLiveness" />
                </p>
              )}
            </JRCard>
          </>
        </LoadingWrapper>

        <Dialog
          open={openConfirm}
          onClose={closeConfirm}
          closeAfterTransition
          maxWidth={"sm"}
          title={{
            text: (
              <Typography variant="title">
                <IntlMessages id="Confirmation" />
              </Typography>
            ),
            icon: <Circle />,
          }}
          actionsCustom={
            <div className="d-flex justify-content-end">
              <Button variant="outlinedSecondary" onClick={closeConfirm}>
                <IntlMessages id="appModule.requestForm.cancel" />
              </Button>
              <Button
                className={"ml-3"}
                variant="contained"
                type="submit"
                onClick={onConfirmYes}
              >
                <IntlMessages id="confirm" />
              </Button>
            </div>
          }
        >
          <div className="d-flex flex-column">
            <IntlMessages id="liveness.confirmDelete" />
          </div>
        </Dialog>
      </div>
    </>
  );
};
export default compose(withPagination)(memo(Liveness));
