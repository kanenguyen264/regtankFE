//@flow
import { Grid, SvgIcon, Typography } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import Link from "@protego/sdk/UI/Link";
import { generatePath } from "@protego/sdk/utils/router";
import {
  KYB_ACTION_GET_KYB_MATCH_REQUEST,
  KYB_ACTION_GET_KYB_REQUEST,
  KYB_ACTION_RE_SCREENING_MY_KYB,
  KYB_ACTION_TOGGLE_OM,
} from "actions/KYBAction";
import { fetchGeneralSettings } from "actions/Setting";
import { downloadReport, KYBScreeningDetailsReport } from "app/reports";
import { ReactComponent as ExportIcon } from "assets/icons/IcExport.svg";
import { ReactComponent as IcoArrowPrevious } from "assets/icons/IcoArrowPrevious.svg";
import clsx from "clsx";
import ActivityTracker from "components/ActivityTracker";
import Escalate from "components/Escalatev1";
import useExportDialog from "components/ExportDialog";
import {
  KYB_ROUTE_KYB_SCREEN,
  KYB_ROUTE_MY_KYB,
  KYB_ROUTE_RISK_ASSESSMENT,
} from "constants/routes";
import React, { useCallback } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { connect, useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { getKYBMatchRequest, KYBNoteAdapter } from "services/KYBService";
import { formatDate } from "util/date";
import withUserSettings from "util/hocs/withUserSettings";
import { isCompletedStatus } from "util/index";
import { snackActions } from "util/snackbarUtils";
import { getFullName } from "util/string";
import { withACL } from "../../../../acl";
import useOnGoingMonitoringPrompt from "./dialog/creditDeductOM";
import disablePrompt from "./dialog/disableOMConfirm";
import styles from "./KYBScreeningResult.module.scss";
import MatchesTable from "./MatchesTable";
import ScoringButton from "./ScoringButton";
import Status from "./Status/index";
import UserInfo from "./UserInfo";

const KYBScreeningResult = compose(
  withACL,
  withRouter,
  withUserSettings,
  connect((state) => ({
    currentScreeningResult: state.kyb.currentScreeningRequest,
    currentScreeningMatches: state.kyb.currentScreeningMatches,
  })),
  (Component) =>
    function KYBScreeningResultOuterPage(props) {
      const { match, currentScreeningResult, dispatch } = props;
      const kybId = match.params.kybId;
      const [loadingMatches, setLoadingMatches] = React.useState(false);

      React.useEffect(() => {
        dispatch(KYB_ACTION_GET_KYB_REQUEST(kybId));
        /**
         * Fetch general setting
         */
        dispatch(fetchGeneralSettings());
        setLoadingMatches(true);
        dispatch(KYB_ACTION_GET_KYB_MATCH_REQUEST({ id: kybId })).finally(() =>
          setLoadingMatches(false)
        );
        // eslint-disable-next-line
      }, [kybId]);

      if (currentScreeningResult && currentScreeningResult.error) {
        return <Redirect to={KYB_ROUTE_KYB_SCREEN} />;
      }
      return (
        currentScreeningResult !== null &&
        !currentScreeningResult.error && (
          <>
            <PageHeading
              title={<IntlMessages id="screening-result" />}
              backButtonUrl={KYB_ROUTE_KYB_SCREEN}
              customUrlResolver={(index, subPath, isLast) => {
                if (index === 1) {
                  return ["KYB", generatePath(KYB_ROUTE_MY_KYB), true];
                }
                if (index === 2) {
                  return [null, null, null, true];
                }
                if (isLast)
                  return [<IntlMessages id="screening-result" />, null, false];
              }}
            />
            {currentScreeningResult &&
              currentScreeningResult.kybId === kybId && (
                <Component
                  {...props}
                  loadingMatches={loadingMatches}
                  setLoadingMatches={setLoadingMatches}
                />
              )}
          </>
        )
      );
    }
)(
  /**
   *
   * @param {KycDetailedRequestDto} currentScreeningResult
   * @returns {JSX.Element}
   * @constructor
   */
  function KYBScreeningResult({
    currentScreeningResult,
    ACL,
    currentScreeningMatches,
    loadingMatches,
    setLoadingMatches,
  }) {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const history = useHistory();
    const printedBy = useSelector((state) => state.me.me);
    const notes = useSelector((state) => state.kyb.notes);
    const exportDialog = useExportDialog();
    const [loading, setLoading] = React.useState(false);
    const { generalSettings } = useSelector((state) => state.settings);
    const [filterParams, setFilterParams] = React.useState(null);
    const [isLoadedNote, setIsLoadedNote] = React.useState(false);
    const renderField = (label, value, className = "") => (
      <div className={clsx(styles.Field, className)}>
        <span className={styles.FieldName}>{label}</span>
        <span className={styles.Value}>{value}</span>
      </div>
    );

    const confirmEnableOM = useOnGoingMonitoringPrompt();
    const confirmDisableOM = disablePrompt();

    const [switchRescreening, setWitchRescreening] = React.useState(
      currentScreeningResult.enableReScreening
    );
    const [
      switchOnGoingMonitoring,
      setSwitchOnGoingMonitoring,
    ] = React.useState(false);

    const handleChangeReScreening = (event) => {
      setWitchRescreening(!switchRescreening);
      dispatch(
        KYB_ACTION_RE_SCREENING_MY_KYB({
          action: event.target.checked,
          kybId: currentScreeningResult.kybId,
        })
      );
    };

    const fetchNotes = React.useCallback(
      (kybId) => {
        dispatch(
          KYBNoteAdapter.actionGetAll({
            id: currentScreeningResult?.kybId,
          })
        ).then(() => setIsLoadedNote(true));
      },
      // eslint-disable-next-line
      [dispatch]
    );
    React.useEffect(() => {
      if (
        currentScreeningResult &&
        currentScreeningResult?.kybId &&
        !isLoadedNote
      ) {
        fetchNotes(`${currentScreeningResult?.kybId}`);
      }
      setSwitchOnGoingMonitoring(
        currentScreeningResult.enableOnGoingMonitoring
      );
      // eslint-disable-next-line
    }, [currentScreeningResult]);

    const download = useCallback(async () => {
      try {
        const { data = [] } = await getKYBMatchRequest({
          id: currentScreeningResult.kybId,
          params: { size: currentScreeningMatches?.total_records },
        });
        return downloadReport(
          KYBScreeningDetailsReport,
          `KYB_ScreeningDetails_${currentScreeningResult?.kybId}_${formatDate(
            new Date(),
            "YYYYMMDDHHmmss"
          )}`,
          {
            notesDetail: notes ? notes[currentScreeningResult?.kybId] : [],
            business: currentScreeningResult,
            matches: data?.records || [],
            printedBy,
          }
        );
      } catch (err) {
        snackActions.error(
          <IntlMessages id="appModule.generic.errorMessage" />
        );
      }
      // eslint-disable-next-line
    }, [notes, currentScreeningResult]);

    const exportPDF = async () => {
      await exportDialog({
        init: download,
        onSuccess: () => {},
      });
    };

    const handleToggleOnGoingMonitoring = async (event) => {
      const originalVal = switchOnGoingMonitoring;
      const val = event.target.checked;
      const kybOmDeductionConfirmation =
        generalSettings["kybOmDeductionConfirmation"];
      if (val === false) {
        // check setting on/off of KYB OM
        if (kybOmDeductionConfirmation) {
          const promptValue = await confirmDisableOM(
            [currentScreeningResult],
            val
          );
          if (promptValue !== true) {
            return;
          }
          try {
            await dispatch(
              KYB_ACTION_TOGGLE_OM({
                enabled: val,
                kybId: currentScreeningResult?.kybId,
              })
            );
            snackActions.success(
              <IntlMessages
                id="kyb.dialog.OM.disable.content"
                values={{ total: 1 }}
              />
            );
            setSwitchOnGoingMonitoring(val);
          } catch (e) {
            snackActions.error(
              <IntlMessages id="appModule.generic.errorMessage" />
            );
            setSwitchOnGoingMonitoring(originalVal);
          }
        } else {
          try {
            await dispatch(
              KYB_ACTION_TOGGLE_OM({
                enabled: val,
                kybId: currentScreeningResult?.kybId,
              })
            );
            setSwitchOnGoingMonitoring(val);
            snackActions.success(
              <IntlMessages
                id="kyb.dialog.OM.disable.content"
                values={{ total: 1 }}
              />
            );

            // await dispatch(
            //   KYB_ACTION_GET_KYB_REQUEST(currentScreeningResult?.kybId)
            // );
          } catch (e) {
            snackActions.error(
              <IntlMessages id="appModule.generic.errorMessage" />
            );
            setSwitchOnGoingMonitoring(originalVal);
          }
        }
      } else {
        // check setting on/off of KYB OM
        if (kybOmDeductionConfirmation) {
          await confirmEnableOM([currentScreeningResult], val);
        } else {
          try {
            await dispatch(
              KYB_ACTION_TOGGLE_OM({
                enabled: val,
                kybId: currentScreeningResult.kybId,
              })
            );
            snackActions.success(
              <IntlMessages
                id="kyb.dialog.onGoingMonitoring.success.headline"
                values={{ total: 1 }}
              />
            );
          } catch (e) {
            snackActions.error(
              <IntlMessages id="appModule.generic.errorMessage" />
            );
            setSwitchOnGoingMonitoring(originalVal);
          }
        }
      }
    };

    return (
      <>
        <div className={styles.container}>
          {/* Header */}
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <div className={styles.header}>
                <div className="d-flex">
                  <div style={{ marginRight: toRem(17) }}>
                    <SvgIcon
                      className={styles.iconBack}
                      onClick={() => history.push(KYB_ROUTE_MY_KYB)}
                      component={IcoArrowPrevious}
                      viewBox={"0 0 8 14"}
                      style={{cursor: "pointer"}}
                    />
                  </div>
                  <Typography variant="titleForm">
                    <FormattedHTMLMessage
                      id="search-results--notice"
                      values={{
                        count: currentScreeningResult?.totalMatches || 0,
                        name: currentScreeningResult.businessName,
                      }}
                    />
                  </Typography>
                </div>

                <div className={"ml-auto d-flex"}>
                  <Escalate
                    screen="KYBScreeningResult"
                    id={currentScreeningResult?.kybId}
                    className={styles.EscalateWrap}
                    viewLogPosition={"left"}
                    style={{
                      height: toRem(40),
                      marginLeft: toRem(16),
                    }}
                  />
                  {ACL.isAllowedPermissions("KYB_MODULE_VIEW") && (
                    <Button
                      onClick={exportPDF}
                      variant={"contained"}
                      className={clsx("ml-3", styles.exportBtn)}
                      size={"medium"}
                      startIcon={<ExportIcon />}
                      disabled={
                        currentScreeningMatches?.total_records >= 0
                          ? false
                          : true
                      }
                    >
                      <Typography variant="Subtitle3">
                        <IntlMessages id="export"></IntlMessages>
                      </Typography>
                    </Button>
                  )}
                </div>
              </div>
            </Grid>
          </Grid>

          <Grid container spacing={2} className={styles.SectionDetail}>
            {/* Screening Detail */}
            <Grid xs={9} item style={{ marginBottom: toRem(24) }}>
              <UserInfo
                currentScreeningResult={currentScreeningResult}
                switchRescreening={switchRescreening}
                handleChangeReScreening={handleChangeReScreening}
                switchOnGoingMonitoring={switchOnGoingMonitoring}
                handleToggleOnGoingMonitoring={handleToggleOnGoingMonitoring}
              />
            </Grid>

            {/* STATUS */}
            <Grid xs={3} item style={{ marginBottom: toRem(24) }}>
              <Status
                className={"h-100"}
                data={{
                  unresolvedCount: currentScreeningResult?.unresolved || 0,
                  positiveCount: currentScreeningResult?.positiveMatch ? 1 : 0,
                  falseCount:
                    currentScreeningResult?.totalMatches -
                    (currentScreeningResult?.positiveMatch ? 1 : 0) -
                    currentScreeningResult?.unresolved,
                }}
              />
            </Grid>

            {/* Activity Tracker */}
            {currentScreeningMatches?.total_records === 0 &&
              filterParams === null && (
                <Grid xs={12} item style={{paddingTop: 0}}>
                  <ActivityTracker
                    style={{ marginTop: 0 }}
                    lastModifiedAt={currentScreeningResult.updatedAt}
                    lastModifiedBy={getFullName(
                      currentScreeningResult.lastModifiedBy
                    )}
                    screenedBy={getFullName(currentScreeningResult.createdBy)}
                    screenedAt={currentScreeningResult.createdAt}
                  />
                </Grid>
              )}

            {/* Scoring button */}
            {currentScreeningResult?.unresolved === 0 &&
              (currentScreeningMatches?.total_records > 0 ||
                filterParams !== null) && (
                <Grid
                  xs={12}
                  item
                  style={{
                    paddingTop: 0,
                    paddingBottom: 0,
                    marginTop: toRem(-8),
                    marginBottom: toRem(16),
                  }}
                >
                  <ScoringButton
                    ACL={ACL}
                    currentScreeningResult={currentScreeningResult}
                  />
                </Grid>
              )}
            {currentScreeningMatches?.total_records === 0 &&
              filterParams === null && (
                <div
                  className={"d-flex flex-column w-100"}
                  style={{ marginTop: toRem(80) }}
                >
                  <div
                    className={
                      "text-center d-flex flex-column align-items-center"
                    }
                  >
                    <p className={styles.noMatchTxt} style={{marginBottom: toRem(24)}}>
                      <FormattedHTMLMessage id="kyc.no-match" />
                    </p>
                    {currentScreeningResult &&
                    isCompletedStatus(currentScreeningResult.status) ? (
                      <Button
                        variant={"contained"}
                        color={"primary"}
                        component={Link}
                        to={generatePath(KYB_ROUTE_RISK_ASSESSMENT, {
                          kybId: currentScreeningResult.kybId,
                        })}
                      >
                        <IntlMessages id="appModule.popup.viewRiskAssessment" />
                      </Button>
                    ) : (
                      <ScoringButton
                        ACL={ACL}
                        currentScreeningResult={currentScreeningResult}
                      />
                    )}
                  </div>
                </div>
              )}

            {/* Matches Detail */}
            <LoadingWrapper loading={loadingMatches} size={"3rem"}>
              <Grid xs={12} item style={{ paddingTop: 0 }}>
                <div
                  style={{
                    minHeight: !currentScreeningMatches?.records
                      ? "100px"
                      : "auto",
                  }}
                >
                  {(currentScreeningMatches?.total_records > 0 ||
                    filterParams !== null) && (
                    <>
                      <MatchesTable
                        kybId={currentScreeningResult.kybId}
                        matchesList={currentScreeningMatches}
                        unresolved={currentScreeningResult.unresolved}
                        kybStatus={currentScreeningResult.status}
                        onLoad={(val) => {
                          try {
                            setLoadingMatches(true);
                            dispatch(KYB_ACTION_GET_KYB_MATCH_REQUEST(val))
                              .then(() => setLoadingMatches(false))
                              .finally(() => setLoadingMatches(false));
                          } catch (err) {
                            snackActions.error(
                              <IntlMessages id="appModule.generic.errorMessage" />
                            );
                          }
                        }}
                        filters={filterParams}
                        onFilter={(val) => setFilterParams(val)}
                        isLoading={loadingMatches}
                      />

                      <ActivityTracker
                        lastModifiedAt={currentScreeningResult?.updatedAt}
                        lastModifiedBy={getFullName(
                          currentScreeningResult?.lastModifiedBy
                        )}
                        screenedBy={getFullName(
                          currentScreeningResult?.createdBy
                        )}
                        screenedAt={currentScreeningResult?.createdAt}
                      />
                    </>
                  )}
                </div>
              </Grid>
            </LoadingWrapper>
          </Grid>
        </div>
      </>
    );
  }
);

export default KYBScreeningResult;
