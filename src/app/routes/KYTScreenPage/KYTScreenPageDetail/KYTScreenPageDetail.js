//@flow
import { Link as MuiLink, MenuItem } from "@mui/material";
import { Grid, IconButton, SvgIcon, Typography } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable/Nullable";
import Select from "@protego/sdk/UI/Select/Select";
import { toRem } from "@protego/sdk//RegtankUI/v1/utils";
import {
  KYT_ACTION_ASSIGN_KYC_REQUEST,
  KYT_ACTION_CHANGE_STATUS_APPROVAL,
  KYT_VIEW_RE_SCREEN,
} from "actions/KYTAction";
import { Icon } from "@mui/material";
import clsx from "clsx";
import ViewLogDialog from "components/ActivityLogDialogv1";
import ActivityTracker from "components/ActivityTracker";
import ChangeApproval from "components/ChangeApprovalv1";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import Escalate from "components/Escalatev1";
import useExportDialog from "components/ExportDialog";
import UserAvatar from "components/UserAvatar";
import { BTC } from "constants/KYTOM";
import { APPROVED } from "constants/ViewLogType";
import { isEmpty } from "lodash";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "recompose";
import { snackActions } from "util/snackbarUtils";
import { getFullName } from "util/string";
import { withACL } from "../../../../acl";
import type { KytRequestDto } from "../../../../types/typings";
import { downloadReport, KYTScreeningDetailsReport } from "../../../reports";
import KYTRiskScoreView from "../KYTRiskScore/KYTRiskScoreView";
import styles from "../KYTScreenPage.module.scss";
import KYTScreenPageNote from "../KYTScreenPageNote";
import KYTSearchBox from "./../KYTSearchBox";
import OnGoingMonitoring from "./OnGoingMonitoring";
import TransactionList from "./TransactionList";
import { GET_AVAILABLE_ASSIGN } from "actions";
import { ReactComponent as CopyIcon } from "assets/icons/buttons/coppyIcon.svg";
import KYTAssigneeEditor from "@protego/sdk/RegtankUI/v1/AssigneeEditor";
import { ReactComponent as ExportIcon } from "assets/icons/IcExport.svg";
const useStyles = makeStyles({
  header: {
    fontSize: 21 |> toRem,
  },
  card: {
    height: `${30}rem`,
  },
  noMargin: {
    margin: "0!important",
  },
  fullHeight: {
    maxHeight: "100% !important",
  },
});

type Props = {
  current: KytRequestDto,
};

const KYTScreenPageDetail = compose(withACL)(function KYTScreenPageDetail(
  props: Props
) {
  const classes = useStyles();
  const divRef = useRef();
  const omRef = useRef();

  const dispatch = useDispatch();
  const exportDialog = useExportDialog();

  const { current, ref, ACL } = props;

  const currentState = useSelector((state) => state.kyt.current);
  const transactions = useSelector(
    (state) => state.kyt.transactions[currentState.kytId]
  );
  const notes = useSelector((state) => state.kyt.notes[currentState.kytId]);
  const printedBy = useSelector((state) => state.me.me);
  const userAssign = useSelector((state) => state.kyt.assignee);

  const [noteContainerHeight, setNoteContainerHeight] = useState(0);
  const detailRef = useRef(null);
  const [hDetail, setHDetail] = useState(0);
  const [heightOm, setHeightOm] = useState();
  const [openChangeStatus, setOpenChangeStatus] = React.useState(false);
  const [stateApproval, setStateApproval] = React.useState("");
  const [loadingAssign, setLoadingAssign] = React.useState(false);
  const intl = useIntl();
  const users = useSelector((state) => state.staff.userAvailableAssign);
  const isUsersLoaded = Array.isArray(users);
  // const isUsersLoaded = Array.isArray(users) && users.length > 0;
  const [openViewLog, setOpenViewLog] = React.useState(false);
  React.useEffect(() => {
    dispatch(GET_AVAILABLE_ASSIGN({ params: "KYT" }));
  }, []);
  useEffect(() => {
    if (!currentState?.viewReScreened) {
      dispatch(KYT_VIEW_RE_SCREEN(currentState?.kytId));
    }
    // eslint-disable-next-line
  }, [currentState]);

  useEffect(() => {
    // Re-calculate the height for note container
    if (omRef && omRef?.current) {
      let height = omRef.current.offsetHeight;
      setHeightOm(height);
    }
    // eslint-disable-next-line
  }, [omRef]);

  useEffect(() => {
    // Re-calculate the height for note container
    if (divRef && divRef.current) {
      let height = divRef.current.offsetHeight;
      setNoteContainerHeight(height - 100);
    }
    // eslint-disable-next-line
  }, [divRef]);

  const withAsset = React.useCallback(
    (data) => (data ? data + " " + currentState.asset : "-"),
    [currentState.asset]
  );

  const download = React.useCallback(() => {
    return downloadReport(
      KYTScreeningDetailsReport,
      `KYT_ScreeningDetails_${currentState.kytId}_${moment().format(
        "YYYYMMDD"
      )}`,
      {
        kyt: currentState,
        printedBy,
        transactions: transactions?.records || [],
        notes: notes || [],
      }
    );
    // eslint-disable-next-line
  }, [currentState, transactions, notes]);

  const exportPDF = async () => {
    await exportDialog({
      init: download,
      onSuccess: () => {},
    });
  };

  const mainRef = React.useCallback((node) => {
    if (node !== null && currentState.asset !== BTC) {
      let fs = parseFloat(getComputedStyle(document.documentElement).fontSize);
      let height = node.offsetHeight - fs * 1.6;
      setNoteContainerHeight(height);
    }
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    let height = detailRef?.current?.offsetHeight;
    setHDetail(height);

    if (current?.asset === BTC) {
      setNoteContainerHeight(height);
    }
    // eslint-disable-next-line
  }, [detailRef]);

  const onPressChangeStatus = (status, note) => {
    let body = {
      kytId: current?.kytId,
      status: status,
      note: { content: note },
    };
    dispatch(KYT_ACTION_CHANGE_STATUS_APPROVAL({ params: body }))
      .then((result) => {
        let getMessage =
          status === APPROVED
            ? intl.formatMessage({ id: "change.status.approved" })
            : intl.formatMessage({ id: "change.status.rejected" });
        snackActions.success(current?.kytId + " " + getMessage);
        setStateApproval(status);
      })
      .catch(() => {
        snackActions.error(<IntlMessages id={"error"} />);
      })
      .finally(() => {
        setOpenChangeStatus(false);
      });
  };

  const showOnGoingMonitoring = (currentKyt) => {
    return currentKyt?.asset === BTC && !currentKyt.archivedAt;
  };
  const changeAssignee = async (
    optionSelected,
    setAnchorEl,
    setSelectedValue
  ) => {
    if (optionSelected?.id) {
      setLoadingAssign(true);
      setAnchorEl(null);
      setSelectedValue(optionSelected);
      await dispatch(
        KYT_ACTION_ASSIGN_KYC_REQUEST({
          kytId: currentState.kytId,
          userId: optionSelected.id,
        })
      );
    }
    setLoadingAssign(false);
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div className={"d-flex justify-content-end"}>
          <Button
            onClick={() => setOpenViewLog(true)}
            variant="outlined"
            size={"medium"}
            className={"mr-3 ml-3"}
          >
            <IntlMessages id={"kyc.risk.scoring.view.log"} />
          </Button>
          <Escalate
            screen="KYTScreeningPage"
            id={current?.kytId}
            viewLogPosition={"left"}
            openViewLog={openViewLog}
            hideViewLog
          />
          {ACL.isAllowedPermissions("KYT_APPROVE_REJECT") && (
            <div className="ml-3">
              {" "}
              <ChangeApproval
                status={current?.status}
                onPressChange={onPressChangeStatus}
                id={current?.kytId}
                openChangeStatus={openChangeStatus}
                setOpenChangeStatus={() =>
                  setOpenChangeStatus(!openChangeStatus)
                }
                approval={stateApproval}
              />{" "}
            </div>
          )}
        </div>
      </Grid>
      <Grid ref={mainRef} item xs={9} className="d-flex flex-column">
        <KYTSearchBox ref={ref} current={current} />
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <div ref={detailRef}>
              <JRCard
                className={clsx("flex-grow-1", classes.noMargin)}
                headerLine
                header={
                  <div className={styles.editForm_header}>
                    <div>
                      <Typography
                        variant="Subtitle2"
                        component={"div"}
                        style={{ marginBottom: toRem(8) }}
                        className={styles.titleHeader}
                      >
                        <IntlMessages id="screening-details" />
                      </Typography>
                      <CopyButton
                        component={"span"}
                        tooltip={<IntlMessages id="appModule.tooltip.copy" />}
                        copyIcon={
                          <Icon component={CopyIcon} fontSize={toRem(18.33)} />
                        }
                        className={styles.copyButton}
                      >
                        <Typography
                          variant="titleCard"
                          component={"span"}
                          className={styles.titleHeaderId}
                        >
                          {currentState.kytId}
                        </Typography>
                      </CopyButton>
                    </div>
                    <div className="d-flex align-items-center">
                      <div>
                        <Typography
                          className={"mr-3"}
                          className={styles.assignee}
                        >
                          <IntlMessages id="screening.result.Assignee" />
                        </Typography>
                      </div>
                      <LoadingWrapper>
                        <div>
                          <KYTAssigneeEditor
                            selected={currentState.assignee}
                            data={users || []}
                            customOnChange={changeAssignee}
                            placement={"bottom-end"}
                            mWidth={100}
                          />
                        </div>
                      </LoadingWrapper>
                      <div>
                        <Button
                          onClick={exportPDF}
                          variant={"contained"}
                          color={"primary"}
                          size={"medium"}
                          startIcon={<ExportIcon />}
                          style={{ marginLeft: 16 }}
                          className={styles.pdfButton}
                        >
                          <IntlMessages id="export" />
                        </Button>
                      </div>
                    </div>

                    {/* <Tooltip title={<IntlMessages id="Edit" />}>
                      <EditButton onClick={handleEditButton} />
                    </Tooltip> */}
                  </div>
                }
              >
                <div
                  className="d-flex align-items-center"
                  style={{
                    marginTop: `${20 / 17}rem`,
                  }}
                >
                  <div className={styles.WalletDetail}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <small className="text-muted">
                          <IntlMessages id="wallet-address" />
                        </small>
                        <CopyButton component={Typography}>
                          <span style={{ fontSize: "1rem" }}>
                            {currentState.address}
                          </span>
                        </CopyButton>
                      </Grid>

                      <Grid item xs={4}>
                        <small className="text-muted">
                          <IntlMessages id="appModule.asset" />
                        </small>
                        <Typography>{currentState.asset}</Typography>
                      </Grid>

                      <Grid item xs={4}>
                        <small className="text-muted">
                          <IntlMessages id="owner" />
                        </small>
                        <Typography>
                          {currentState.addressDetails.wallet.name &&
                          currentState.addressDetails.wallet.name.trim()
                            .length ? (
                            currentState.addressDetails.wallet.url &&
                            currentState.addressDetails.wallet.url.length ? (
                              <MuiLink
                                href={currentState.addressDetails.wallet.url}
                                target="_blank"
                              >
                                {currentState.addressDetails.wallet.name}
                              </MuiLink>
                            ) : (
                              currentState.addressDetails.wallet.name
                            )
                          ) : (
                            "-"
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <small className="text-muted">
                          <IntlMessages id="type" />
                        </small>
                        <Typography>
                          <Nullable>
                            {current.addressDetails.wallet.type?.toUpperCase()}
                          </Nullable>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <small className="text-muted">
                          <IntlMessages id="country" />
                        </small>
                        <Typography>
                          <Nullable
                            component={CountryFlagLanguage}
                            valueProp={"countryCode"}
                            svg
                          >
                            {currentState.addressDetails.wallet.country}
                          </Nullable>
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <small className="text-muted">
                          <IntlMessages id="reference-id" />
                        </small>
                        <Typography>
                          <Nullable>{currentState.referenceId}</Nullable>
                        </Typography>
                      </Grid>
                    </Grid>
                  </div>
                  <div
                    className={"d-flex flex-column justify-content-between"}
                    style={{
                      // borderLeft: "1px solid #e4e4e4",
                      flex: "0 0 auto",
                    }}
                  >
                    <div>
                      <div className={styles.CurrentBalance}>
                        <IntlMessages id="current-balance" />
                      </div>
                      <div>
                        <span data-number>
                          {currentState.addressDetails.currentBalance?.toFixed(
                            9
                          ) |> withAsset}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className={styles.Received}>
                        <IntlMessages id="received" />
                      </div>
                      <div>
                        <span data-number>
                          {currentState.addressDetails.totalDeposits?.toFixed(9)
                            |> withAsset}
                        </span>
                        <span>
                          {currentState.addressDetails.totalDepositCount || 0}{" "}
                          transaction
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className={styles.Sent}>
                        <IntlMessages id="sent" />
                      </div>
                      <div>
                        <span data-number>
                          {currentState.addressDetails.totalSpent?.toFixed(9)
                            |> withAsset}
                        </span>
                        <span>
                          {currentState.addressDetails.totalSpendCount || 0}{" "}
                          transaction
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </JRCard>
            </div>
          </Grid>
          <Grid item xs={3} className={styles.riskcoreView}>
            <KYTRiskScoreView
              ACL={ACL}
              mHeight={hDetail}
              key={"kyt_risk_score_view"}
              kytId={currentState.kytId}
              addressDetailsId={currentState.addressDetails.id}
              scoring={currentState.addressDetails.risk}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={3} className={styles.noteContainer}>
        {showOnGoingMonitoring(currentState) && (
          <div ref={omRef} style={{marginBottom: toRem(10)}}>
            <OnGoingMonitoring data={currentState} kytId={current?.kytId} />
          </div>
        )}
        <JRCard
          header={
            <Typography variant="h6">
              <IntlMessages id={"note"} />
            </Typography>
          }
          headerLine
        >
          <div ref={divRef}>
            <KYTScreenPageNote
              sm={10}
              md={3}
              className={styles.noteRisk}
              id={currentState.kytId}
            />
          </div>
        </JRCard>
      </Grid>
      <Grid item xs={12}>
        <ActivityTracker
          style={{ marginTop: "0" }}
          lastModifiedAt={currentState?.updatedAt}
          lastModifiedBy={getFullName(currentState?.lastModifiedBy)}
          screenedBy={getFullName(currentState?.createdBy)}
          screenedAt={currentState?.createdAt}
        />
      </Grid>
      <Grid item xs={12} className={"mt-1"}>
        <TransactionList current={currentState} />
      </Grid>

      {openViewLog && (
        <ViewLogDialog
          refId={currentState.kytId}
          isOpen={openViewLog}
          onClose={() => setOpenViewLog(false)}
        />
      )}
    </Grid>
  );
});

export default KYTScreenPageDetail;
