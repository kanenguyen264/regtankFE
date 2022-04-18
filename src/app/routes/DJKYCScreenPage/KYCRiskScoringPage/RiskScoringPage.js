import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Button, Grid, IconButton, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import MuiTheme from "@protego/sdk/RegtankUI/v1/MuiTheme/theme";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import { generatePath } from "@protego/sdk/utils/router";
import {
  DJ_ACTION_CHANGE_STATUS_RISK_SCORE,
  DJ_ACTION_GET_KYC_SCORING,
} from "actions/DJAction";
import { useKYBRiskLevelChart } from "app/reports/KYBRiskScoringReport/KYBRiskLevelChart";
import { useSettingScoringChart } from "app/routes/SettingPage/KYC/Scoring/components/ScoringChart";
import { ReactComponent as ExportIcon } from "assets/icons/IcExport.svg";
import ActivityTracker from "components/ActivityTracker";
import ChangeApproval from "components/ChangeApprovalv1";
import Escalate from "components/Escalatev1";
import useExportDialog from "components/ExportDialog";
import {
  DJ_KYC_ROUTE_KYC_SCREEN_RESULT,
  DJ_KYC_ROUTE_MY_KYC,
  SETTING_DJ_SCORING_ROUTE_INDEX,
} from "constants/routes";
import { APPROVED } from "constants/ViewLogType";
import moment from "moment";
import React, { Fragment, useEffect } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { snackActions } from "util/snackbarUtils";
import { getFullName } from "util/string";
import { withACL } from "../../../../acl";
import { downloadReport, DJKYCRiskScoringReport } from "../../../reports";
import { getDataChart } from "../../KYBScreenPage/KYBRiskAssessment/RiskAssessmentLevel";
import styles from "./RiskScoringPage.module.scss";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import MatchInformation from "../component/MatchInformation/MatchInformation";
import Link from "@protego/sdk/RegtankUI/v1/Link";
import Summary from "./component/summary";
import ListRiskScoring from "./component/RiskScorings";
import clsx from "clsx";
import Note from "./component/Note";
import ViewLogDialog from "components/ActivityLogDialogv1";

const RiskScoringPage = function RiskScoringPage({ match, ACL }) {
  const dispatch = useDispatch();
  let history = useHistory();
  const getRiskLevelChart = useKYBRiskLevelChart();

  const exportDialog = useExportDialog();

  const currentRiskScoring = useSelector(
    (state) => state.downJones.riskScoring
  );
  const kycId = match.params?.kycId;
  const settingScoring = useSelector((state) => state.settingScoring?.detailDj);
  const [openChangeStatus, setOpenChangeStatus] = React.useState(false);
  const [stateApproval, setStateApproval] = React.useState("");
  const { formatMessage } = useIntl();
  const [loading, setLoading] = React.useState(false);
  const [isReScreen, setIsReScreen] = React.useState(false);
  const [openViewLog, setOpenViewLog] = React.useState(false);
  const chartDataPromise = useSettingScoringChart(settingScoring);
  const matchNotes = useSelector((state) => state.downJones.matchNotes);
  const printedBy = useSelector((state) => state.me.me);
  const scoringNotes = useSelector((state) => state.downJones.scoringNotes);

  useEffect(() => {
    setIsReScreen(currentRiskScoring?.request?.enableReScreening);
    // eslint-disable-next-line
  }, [currentRiskScoring, settingScoring]);

  useEffect(() => {
    dispatch(DJ_ACTION_GET_KYC_SCORING(kycId));
    // eslint-disable-next-line
  }, [dispatch]);

  const onPressChangeStatus = (status, note) => {
    setLoading(true);
    let body = {
      kycId: kycId,
      status: status,
      note: { content: note },
    };
    dispatch(DJ_ACTION_CHANGE_STATUS_RISK_SCORE({ params: body }))
      .then(() => {
        let getMessage =
          status === APPROVED
            ? formatMessage({ id: "kyc.change.note.was.approved" })
            : formatMessage({ id: "kyc.change.note.was.rejected" });
        snackActions.success(kycId + " " + getMessage);
        setStateApproval(status);
      })
      .catch(() => {
        snackActions.error(<IntlMessages id={"error"} />);
      })
      .finally(() => {
        dispatch(DJ_ACTION_GET_KYC_SCORING(kycId));
        setOpenChangeStatus(false);
        setLoading(false);
      });
  };
  const exportPDF = async () => {
    await exportDialog({
      init: download,
      onSuccess: () => {},
    });
  };
  const download = React.useCallback(async () => {
    const chartKyc = await getRiskLevelChart({
      model: getDataChart(currentRiskScoring.scoring.riskLevel, formatMessage),
      showBlacklist:
        currentRiskScoring?.kycBlacklistMatches?.length > 0 ? true : false,
      isSanction: currentRiskScoring?.scoring?.sanctionedPersonOrCountry?.info,
    });

    let matchNotesDetail = [];
    if (currentRiskScoring.positiveMatch) {
      matchNotesDetail =
        matchNotes[`${kycId}@${currentRiskScoring.positiveMatch.matchId}`];
    }

    return downloadReport(
      DJKYCRiskScoringReport,
      `DJKYC_RiskScoring_${currentRiskScoring.kycId}_${moment().format(
        "YYYYMMDD"
      )}`,
      {
        riskScoring: currentRiskScoring,
        scoring: settingScoring,
        chartSetting: await chartDataPromise,
        chartKyc: chartKyc,
        printedBy,
        notesDetail:
          scoringNotes && scoringNotes[kycId] ? scoringNotes[kycId] : [],
        matchNotesDetail: matchNotesDetail,
        enableReScreening: isReScreen,
      }
    );

    // eslint-disable-next-line
  }, [
    currentRiskScoring,
    settingScoring,
    chartDataPromise,
    scoringNotes,
    matchNotes,
    isReScreen,
  ]);

  return (
    <ThemeProvider theme={MuiTheme}>
      <Fragment>
        <PageHeading
          classes={{ root: styles.PageHeading }}
          title={<IntlMessages id="risk-scoring" />}
          backButtonUrl={true}
          customUrlResolver={(index) => {
            if (index === 1) {
              return [
                <IntlMessages id="url.DJKyc" />,
                generatePath(DJ_KYC_ROUTE_MY_KYC),
                true,
              ];
            }
            if (index === 2) {
              return [
                <IntlMessages id="screening-result" />,
                generatePath(DJ_KYC_ROUTE_KYC_SCREEN_RESULT, {
                  kycId: kycId,
                }),
              ];
            }
            if (index === 3) {
              return [null, null, null, true];
            }
            if (index === 4) {
              return [<IntlMessages id="risk-scoring" />, null, false];
            }

            if (index === 6) {
              return [null, null, null, true];
            }
          }}
        />
        <div>
          {currentRiskScoring !== null && (
            <div className={styles.buttonGroup}>
              <Grid container columnSpacing={2}>
                <Grid item xs={12}>
                  <div className={styles.header}>
                    <div className="align-items-center d-flex">
                      <div className={"mr-2"}>
                        <IconButton
                          className={styles.iconBack}
                          onClick={() => history.push(DJ_KYC_ROUTE_MY_KYC)}
                        >
                          <KeyboardArrowLeftIcon />
                        </IconButton>
                      </div>
                      <Typography variant="titleForm">
                        <FormattedHTMLMessage
                          id="kyc.risk.score.title"
                          values={{ kycId: currentRiskScoring?.kycId }}
                        />
                      </Typography>
                    </div>
                    <div className={"d-flex"}>
                      {/* <Button
                        className={"ml-3"}
                        onClick={exportPDF}
                        variant={"outlined"}
                        size={"medium"}
                        startIcon={<ExportIcon />}
                      >
                        <Typography variant="Subtitle3">
                          <IntlMessages id="export"></IntlMessages>
                        </Typography>
                      </Button> */}
                      <Button
                        onClick={() => setOpenViewLog(true)}
                        variant="outlined"
                        size={"medium"}
                        className={"mr-3 ml-3"}
                      >
                        <IntlMessages id={"kyc.risk.scoring.view.log"} />
                      </Button>
                      <Escalate
                        screen="KYCRiskScoring"
                        id={currentRiskScoring.kycId}
                        viewLogPosition={"left"}
                        openViewLog={openViewLog}
                        hideViewLog
                      />
                      {ACL.isAllowedPermissions("DJ_KYC_APPROVE_REJECT") && (
                        <div className="ml-3">
                          <ChangeApproval
                            status={currentRiskScoring?.status}
                            onPressChange={onPressChangeStatus}
                            id={kycId}
                            openChangeStatus={openChangeStatus}
                            setOpenChangeStatus={() =>
                              setOpenChangeStatus(!openChangeStatus)
                            }
                            approval={stateApproval}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Grid>
              </Grid>
              <Grid container columnSpacing={2}>
                <Grid item xs={9}>
                  <MatchInformation
                    className={styles.matchHeight}
                    kycId={currentRiskScoring.kycId}
                    requestEntity={{
                      assignee: currentRiskScoring.assignee,
                      ...currentRiskScoring.request,
                    }}
                    callBackFunc={(val) => setIsReScreen(val)}
                    positiveMatch={currentRiskScoring.positiveMatch}
                    archivedAt={currentRiskScoring?.archivedAt}
                  />
                  <ListRiskScoring scoring={currentRiskScoring.scoring} />
                  <Typography
                    className={clsx(
                      styles.TextDescription,
                      styles.PaddingTopText
                    )}
                  >
                    <IntlMessages id={"kyc.riskMatrixVersion"} />
                    {": "}
                    <span className={styles.Link}>
                      {settingScoring && settingScoring.name ? (
                        ACL.isAllowedPermissions("SETTING_KYC_VIEW") ? (
                          <Link
                            to={`${SETTING_DJ_SCORING_ROUTE_INDEX}/scoring/${settingScoring.id}`}
                          >
                            {settingScoring.name}
                          </Link>
                        ) : (
                          settingScoring.name
                        )
                      ) : (
                        "__"
                      )}
                    </span>
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Grid container rowSpacing={2} flexDirection={"column"}>
                    <Grid item xs>
                      <Summary
                        sm={10}
                        md={3}
                        enableReScreening={isReScreen}
                        scoring={currentRiskScoring.scoring}
                        kycId={currentRiskScoring.kycId}
                      />
                    </Grid>
                    <Grid item xs className={styles.noteContainer}>
                      <JRCard
                        header={
                          <Typography variant="titleForm">
                            <IntlMessages id={"kyc.Notes"} />
                          </Typography>
                        }
                      >
                        <Note
                          sm={10}
                          md={3}
                          id={currentRiskScoring.kycId}
                          className={styles.noteRisk}
                        />
                      </JRCard>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
            // <div style={{ marginTop: toRem(32) }}>
            //   <div className="mt-4 mb-4 d-flex justify-content-between">
            //     <div>
            //       {/* <Button
            //       variant={"contained"}
            //       size={"small"}
            //       style={{
            //         height: toRem(40),
            //       }}
            //     >
            //       <IntlMessages id="export" />
            //     </Button> */}
            //     </div>
            //     <div className={styles.approveBtnGroup}>
            //       <Escalate
            //         screen="DJKYCRiskScoring"
            //         id={currentRiskScoring.kycId}
            //         hideViewLog={false}
            //         divider={true}
            //         viewLogPosition="left"
            //         className={`${styles.EscalateWrap}`}
            //       />
            //       {ACL.isAllowedPermissions("DJ_KYC_APPROVE_REJECT") && (
            //         <ChangeApproval
            //           status={currentRiskScoring?.status}
            //           id={kycId}
            //           openChangeStatus={openChangeStatus}
            //           setOpenChangeStatus={() =>
            //             setOpenChangeStatus(!openChangeStatus)
            //           }
            //           loading={loading}
            //           onPressChange={onPressChangeStatus}
            //         />
            //       )}
            //     </div>
            //   </div>
            //   <Grid container spacing={2}>
            //     <Grid item xs={3}>
            //       <MatchInformation
            //         className={clsx(styles.matchHeight)}
            //         kycId={currentRiskScoring.kycId}
            //         requestEntity={{
            //           assignee: currentRiskScoring.assignee,
            //           ...currentRiskScoring.request,
            //         }}
            //         callBackFunc={(val) => setIsReScreen(val)}
            //         positiveMatch={currentRiskScoring.positiveMatch}
            //         archivedAt={currentRiskScoring?.archivedAt}
            //         callBackFunc={(val) => setIsReScreen(val)}
            //       />
            //     </Grid>
            //     <Grid item xs={6}>
            //       <ListRiskScoring scoring={currentRiskScoring.scoring} />
            //       <Typography
            //         className={clsx(
            //           "mt-2",
            //           styles.TextDescription,
            //           styles.PaddingTopText
            //         )}
            //       >
            //         <IntlMessages id={"kyc.riskMatrixVersion"} />
            //         {": "}
            //         {settingScoring &&
            //         settingScoring?.name &&
            //         settingScoring?.id ? (
            //           ACL.isAllowedPermissions("SETTING_KYC_VIEW") ? (
            //             <Link
            //               to={`${SETTING_DJ_SCORING_ROUTE_INDEX}/scoring/${settingScoring.id}`}
            //             >
            //               {settingScoring.name}
            //             </Link>
            //           ) : (
            //             settingScoring.name
            //           )
            //         ) : (
            //           "__"
            //         )}
            //       </Typography>
            //     </Grid>
            //     <Grid item xs={3} className={"d-flex flex-column"}>
            //       <Summary
            //         scoring={currentRiskScoring.scoring}
            //         kycId={currentRiskScoring.kycId}
            //         enableReScreening={isReScreen}
            //       />
            //       <div style={{ height: "100%" }}>
            //         <DJScoringNoteComposer
            //           id={currentRiskScoring.kycId}
            //           className={styles.noteRisk}
            //         />
            //       </div>
            //     </Grid>
            //   </Grid>
            // </div>
          )}
          {openViewLog && (
            <ViewLogDialog
              refId={kycId}
              isOpen={openViewLog}
              onClose={() => setOpenViewLog(false)}
            />
          )}
          <ActivityTracker
            className={styles.MarginActivity}
            lastModifiedAt={currentRiskScoring?.request?.updatedAt}
            lastModifiedBy={getFullName(
              currentRiskScoring?.request?.lastModifiedBy
            )}
            screenedBy={getFullName(currentRiskScoring?.request?.createdBy)}
            screenedAt={currentRiskScoring?.request?.createdAt}
          />
        </div>
      </Fragment>
    </ThemeProvider>
  );
};

export default withACL(RiskScoringPage);
