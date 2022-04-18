import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Button, Grid, IconButton, SvgIcon, Typography } from "@mui/material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import Link from "@protego/sdk/RegtankUI/v1/Link";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { generatePath } from "@protego/sdk/utils/router";
import {
  KYC_ACTION_CHANGE_STATUS_RISK_SCORE,
  KYC_ACTION_GET_KYC_SCORING,
} from "actions/KYCAction";
import { useKYBRiskLevelChart } from "app/reports/KYBRiskScoringReport/KYBRiskLevelChart";
import { useSettingScoringChart } from "app/routes/SettingPage/KYC/Scoring/components/ScoringChart";
import { ReactComponent as ExportIcon } from "assets/icons/IcExport.svg";
import clsx from "clsx";
import ViewLogDialog from "components/ActivityLogDialogv1";
import ActivityTracker from "components/ActivityTracker";
import ChangeApproval from "components/ChangeApprovalv1";
import Escalate from "components/Escalatev1";
import useExportDialog from "components/ExportDialog";
import {
  KYC_ROUTE_KYC_SCREEN_RESULT,
  KYC_ROUTE_MY_KYC,
} from "constants/routes";
import { APPROVED } from "constants/ViewLogType";
import moment from "moment";
import React, { Fragment, useEffect } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { KYCNoteMatchAdapter } from "services/KYCService";
import { snackActions } from "util/snackbarUtils";
import { getFullName } from "util/string";
import { withACL } from "../../../../acl";
import { downloadReport, KYCRiskScoringReport } from "../../../reports";
import { getDataChart } from "../../KYBScreenPage/KYBRiskAssessment/RiskAssessmentLevel";
import MatchInformation from "../component/MatchInformation/MatchInformation";
import Note from "./component/Note";
import ListRiskScoring from "./component/RiskScorings";
import Summary from "./component/summary";
import styles from "./RiskScoringPage.module.scss";

const RiskScoringPage = function RiskScoringPage({ match, ACL }) {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const getRiskLevelChart = useKYBRiskLevelChart();
  const exportDialog = useExportDialog();
  let history = useHistory();
  const currentRiskScoring = useSelector((state) => state.kyc.riskScoring);
  const settingScoring = useSelector((state) => state.settingScoring.detail);
  const printedBy = useSelector((state) => state.me.me);
  const matchNotes = useSelector((state) => state.kyc.matchNotes);
  const scoringNotes = useSelector((state) => state.kyc.scoringNotes);
  const [openViewLog, setOpenViewLog] = React.useState(false);
  const [openChangeStatus, setOpenChangeStatus] = React.useState(false);
  const isSettingScoringAvailable =
    typeof currentRiskScoring !== "undefined" &&
    currentRiskScoring !== null &&
    typeof settingScoring !== "undefined" &&
    settingScoring !== null &&
    typeof settingScoring.id === "number" &&
    settingScoring.id === currentRiskScoring.scoring.scoringId;
  const [isReScreen, setIsReScreen] = React.useState(false);
  const chartDataPromise = useSettingScoringChart(settingScoring);
  const kycId = match.params.kycId;
  const [stateApproval, setStateApproval] = React.useState("");
  React.useEffect(() => {
    setIsReScreen(currentRiskScoring?.request?.enableReScreening);
    // eslint-disable-next-line
  }, [currentRiskScoring, settingScoring]);

  const fetchMatchNotes = React.useCallback(
    (kycId) => {
      dispatch(
        KYCNoteMatchAdapter.actionGetAll({
          id: kycId,
        })
      );
    },
    [dispatch]
  );

  React.useEffect(() => {
    if (currentRiskScoring && currentRiskScoring.positiveMatch) {
      fetchMatchNotes(`${kycId}@${currentRiskScoring.positiveMatch.matchId}`);
    }
    // eslint-disable-next-line
  }, [currentRiskScoring]);

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
      KYCRiskScoringReport,
      `KYC_RiskScoring_${currentRiskScoring.kycId}_${moment().format(
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
  const exportPDF = async () => {
    await exportDialog({
      init: download,
      onSuccess: () => {},
    });
  };

  useEffect(() => {
    dispatch(KYC_ACTION_GET_KYC_SCORING(kycId));
    setIsReScreen(currentRiskScoring?.request?.enableReScreening);
    // eslint-disable-next-line
  }, [dispatch]);

  const onPressChangeStatus = (status, note) => {
    let body = {
      kycId: kycId,
      status: status,
      note: { content: note },
    };
    dispatch(KYC_ACTION_CHANGE_STATUS_RISK_SCORE({ params: body }))
      .then((result) => {
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
        dispatch(KYC_ACTION_GET_KYC_SCORING(kycId));
        setOpenChangeStatus(false);
      });
  };

  return (
    <Fragment>
      <PageHeading
        title={<IntlMessages id="risk-scoring" />}
        backButtonUrl={true}
        customUrlResolver={(index, subPath) => {
          if (index === 1) {
            return [
              <IntlMessages id="url.acurisKyc" />,
              generatePath(KYC_ROUTE_MY_KYC),
              true,
            ];
          }
          if (index === 2) {
            return [
              <IntlMessages id="screening-result" />,
              generatePath(KYC_ROUTE_KYC_SCREEN_RESULT, {
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
                        onClick={() => history.push(KYC_ROUTE_MY_KYC)}
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
                    <Button
                      className={"ml-3"}
                      onClick={exportPDF}
                      variant={"outlined"}
                      size={"medium"}
                      startIcon={<ExportIcon />}
                    >
                      <Typography variant="Subtitle3">
                        <IntlMessages id="export"></IntlMessages>
                      </Typography>
                    </Button>
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
                    {ACL.isAllowedPermissions("KYC_APPROVE_REJECT") && (
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
                          to={`/app/setting/kyc/scoring/${settingScoring.id}`}
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
        )}
      </div>

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
    </Fragment>
  );
};

export default withACL(RiskScoringPage);
