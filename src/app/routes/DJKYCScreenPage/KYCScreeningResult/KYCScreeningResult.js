//@flow
import { Grid, SvgIcon, Typography } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import Link from "@protego/sdk/UI/Link";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import { usePrompt } from "@protego/sdk/UI/PromptDialog";
import { generatePath } from "@protego/sdk/utils/router";
import {
  DJ_ACTION_GET_KYC_INDIVIDUAL_REQUEST,
  DJ_ACTION_KYC_TOGGLE_OM,
  DJ_ACTION_GET_KYC_REQUEST,
  DJ_ACTION_RE_SCREENING_MY_KYC,
  DJ_KYC_ACTION_GET_KYC_BLACKLIST_REQUEST,
  DJ_KYC_ACTION_GET_KYC_MATCH_REQUEST,
} from "actions/DJAction";
import { ReactComponent as IcoArrowPrevious } from "assets/icons/IcoArrowPrevious.svg";
import ActivityTracker from "components/ActivityTracker";
import BlacklistTable from "components/BlacklistDJTable";
import Escalate from "components/Escalatev1";
import KYCNoteDialogViewer from "components/KYCNoteDialogViewer";
import {
  DJ_KYC_ROUTE_KYC_SCREEN,
  DJ_KYC_ROUTE_KYC_SCREEN_SCORING,
  DJ_KYC_ROUTE_MY_KYC,
} from "constants/routes";
import React, { useEffect } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { connect, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useHistory, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { DJNoteAdapter } from "services/DJService";
import withUserSettings from "util/hocs/withUserSettings";
import { isCompletedStatus } from "util/index";
import { snackActions } from "util/snackbarUtils";
import { getFullName } from "util/string";
import { withACL } from "../../../../acl";
import useOnGoingMonitoringPrompt from "./dialog/creditDeductOM";
import styles from "./KYCScreeningResult.module.scss";
import MatchesTable from "./MatchesTable";
import ScoringButton from "./ScoringButton";
import Status from "./Status/index";
import UserInfo from "./UserInfo";
import disablePrompt from "./dialog/disableOMConfirm";

const KYCScreeningResult = compose(
  withACL,
  withRouter,
  withUserSettings,
  connect((state) => ({
    currentScreeningResult: state.downJones.currentScreeningRequest,
    currentScreeningMatches: state.downJones.currentScreeningMatches,
    currentScreeningBlackLists: state.downJones.currentScreeningBlackLists,
  })),
  (Component) =>
    function KYCScreeningResultOuterPage(props) {
      const dispatch = useDispatch();
      const location = useLocation();

      const { match, currentScreeningResult } = props;
      const kycId = match.params.kycId;
      const fromKYC = location?.state?.fromKYC;
      const [loadingBlacklist, setLoadingBlacklist] = React.useState(false);
      const [loadingMatches, setLoadingMatches] = React.useState(false);

      const [isLoaded, setIsLoaded] = React.useState(false);
      const history = useHistory();

      useEffect(() => {
        dispatch(DJ_ACTION_GET_KYC_INDIVIDUAL_REQUEST(kycId)).then((data) => {
          if (
            data?.individualMatches?.length === 0 &&
            data?.kycBlacklistMatches?.length === 0 &&
            fromKYC
          ) {
            history.push(
              generatePath(DJ_KYC_ROUTE_KYC_SCREEN_SCORING, {
                kycId: kycId,
              })
            );
          }
          setIsLoaded(true);

          setLoadingBlacklist(true);
          dispatch(
            DJ_KYC_ACTION_GET_KYC_BLACKLIST_REQUEST({ id: kycId })
          ).finally(() => setLoadingBlacklist(false));

          setLoadingMatches(true);
          dispatch(
            DJ_KYC_ACTION_GET_KYC_MATCH_REQUEST({ id: kycId })
          ).finally(() => setLoadingMatches(false));
        });
      }, [dispatch, kycId]);

      return (
        <>
          <PageHeading
            title={<IntlMessages id="screening-result" />}
            backButtonUrl={DJ_KYC_ROUTE_KYC_SCREEN}
            customUrlResolver={(index) => {
              if (index === 1) {
                return [
                  <IntlMessages id="url.DJKyc" />,
                  generatePath(DJ_KYC_ROUTE_MY_KYC),
                  true,
                ];
              }
              if (index === 2) {
                return [null, null, null, true];
              }
              if (index == 3)
                return [<IntlMessages id="screening-result" />, null, false];
            }}
          />
          {currentScreeningResult !== null &&
          isLoaded &&
          currentScreeningResult?.kycId === kycId ? (
            <Component
              {...props}
              loadingBlacklist={loadingBlacklist}
              setLoadingBlacklist={setLoadingBlacklist}
              loadingMatches={loadingMatches}
              setLoadingMatches={setLoadingMatches}
            />
          ) : (
            <div style={{ height: "60vh" }} />
          )}
        </>
      );
    }
)(
  /**
   *
   * @param {KycDetailedRequestDto} currentScreeningResult
   * @returns {JSX.Element}
   * @constructor
   */
  function KYCScreeningResult({
    currentScreeningResult,
    currentScreeningMatches,
    currentScreeningBlackLists,
    ACL,
    loadingBlacklist,
    setLoadingBlacklist,
    loadingMatches,
    setLoadingMatches,
  }) {
    let history = useHistory();
    const [viewNote, setViewNote] = React.useState(null);
    const [
      switchOnGoingMonitoring,
      setSwitchOnGoingMonitoring,
    ] = React.useState(currentScreeningResult?.enableOnGoingMonitoring);
    const { formatMessage } = useIntl();
    const [switchRescreening, setWitchRescreening] = React.useState(
      currentScreeningResult.enableReScreening
    );

    const handleChangeReScreening = (event) => {
      setWitchRescreening(!switchRescreening);
      dispatch(
        DJ_ACTION_RE_SCREENING_MY_KYC({
          action: event.target.checked,
          kycId: currentScreeningResult?.kycId,
        })
      );
    };
    const [isLoadedNote, setIsLoadedNote] = React.useState(false);
    const [filterParams, setFilterParams] = React.useState(null);
    const confirmEnableOM = useOnGoingMonitoringPrompt();
    const confirmDisableOM = disablePrompt();
    const { generalSettings } = useSelector((state) => state.settings);
    const dispatch = useDispatch();
    const fetchNotes = React.useCallback(
      () => {
        dispatch(
          DJNoteAdapter.actionGetAll({
            id: currentScreeningResult?.kycId,
          })
        ).then(() => setIsLoadedNote(true));
      },
      // eslint-disable-next-line
      [dispatch]
    );
    React.useEffect(() => {
      if (currentScreeningResult && currentScreeningResult?.kycId) {
        if (!isLoadedNote) {
          fetchNotes(`${currentScreeningResult?.kycId}`);
        }
        setSwitchOnGoingMonitoring(
          currentScreeningResult.enableOnGoingMonitoring
        );
      }
      // eslint-disable-next-line
    }, [currentScreeningResult]);

    const handleToggleOnGoingMonitoring = async (event) => {
      const originalVal = switchOnGoingMonitoring;
      const val = event.target.checked;
      const kycOmDeductionConfirmation =
        generalSettings["djKycOmDeductionConfirmation"];

      if (val === false) {
        // check setting on/off of KYC OM
        if (kycOmDeductionConfirmation) {
          await confirmDisableOM([currentScreeningResult], val);
        } else {
          try {
            await dispatch(
              DJ_ACTION_KYC_TOGGLE_OM({
                enabled: val,
                kycId: currentScreeningResult?.kycId,
              })
            );
            await dispatch(
              DJ_ACTION_GET_KYC_REQUEST(currentScreeningResult?.kycId)
            );
            snackActions.success(
              <FormattedHTMLMessage
                id="kyc.dialog.disabledOnGoingMonitoring.success"
                values={{ total: "1" }}
              />
            );
            setSwitchOnGoingMonitoring(val);
          } catch (e) {
            snackActions.error(
              <IntlMessages id="appModule.generic.errorMessage" />
            );
            setSwitchOnGoingMonitoring(originalVal);
          }
        }
      } else {
        // check setting on/off of KYC OM
        if (kycOmDeductionConfirmation) {
          await confirmEnableOM([currentScreeningResult], val);
        } else {
          try {
            await dispatch(
              DJ_ACTION_KYC_TOGGLE_OM({
                enabled: val,
                kycId: currentScreeningResult.kycId,
              })
            );
            snackActions.success(
              <FormattedHTMLMessage
                id="kyc.dialog.enabledOnGoingMonitoring.success"
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
                      onClick={() => history.push(DJ_KYC_ROUTE_MY_KYC)}
                      component={IcoArrowPrevious}
                      viewBox={"0 0 8 14"}
                    />
                  </div>
                  <Typography variant="titleForm">
                    <FormattedHTMLMessage
                      id="search-results--notice"
                      values={{
                        count: currentScreeningResult?.totalMatches || 0,
                        name:
                          currentScreeningResult?.individualRequest?.fullName,
                      }}
                    />
                  </Typography>
                </div>

                <div className={"ml-auto d-flex"}>
                  <Escalate
                    screen="DJKYCScreeningResult"
                    id={currentScreeningResult?.kycId}
                    className={styles.EscalateWrap}
                    viewLogPosition={"left"}
                  />
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
              filterParams === null &&
              currentScreeningBlackLists?.total_records === 0 && (
                <Grid xs={12} item>
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
              currentScreeningResult?.blacklistUnresolved === 0 &&
              (currentScreeningMatches?.total_records > 0 ||
                currentScreeningBlackLists?.total_records > 0 ||
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
              filterParams === null &&
              currentScreeningBlackLists?.total_records === 0 && (
                <div className={"d-flex flex-column w-100"} style={{marginTop: toRem(60)}}>
                  <div
                    className={
                      "text-center d-flex flex-column align-items-center"
                    }
                  >
                    <p>
                      <FormattedHTMLMessage id="kyc.no-match" />
                    </p>
                    {(ACL.isAllowedPermissions("KYC_MODULE_CREATE") ||
                      isCompletedStatus(currentScreeningResult.status)) && (
                      <Button
                        variant={"contained"}
                        component={Link}
                        to={generatePath(DJ_KYC_ROUTE_KYC_SCREEN_SCORING, {
                          kycId: currentScreeningResult.kycId,
                        })}
                      >
                        {currentScreeningResult &&
                        isCompletedStatus(currentScreeningResult.status) ? (
                          <IntlMessages id="view-source" />
                        ) : (
                          <IntlMessages id="generate-score" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}

            {/* Blacklist*/}
            <Grid xs={12} item style={{ paddingTop: 0 }}>
              <div>
                <LoadingWrapper loading={loadingBlacklist} size={"3rem"}>
                  <div
                    style={{
                      minHeight: !currentScreeningBlackLists?.records
                        ? "100px"
                        : "auto",
                      marginBottom:
                        currentScreeningBlackLists?.total_records > 0
                          ? toRem(24)
                          : "auto",
                    }}
                  >
                    {currentScreeningBlackLists?.total_records > 0 && (
                      <>
                        <BlacklistTable
                          kycId={currentScreeningResult.kycId}
                          matchesList={currentScreeningBlackLists}
                          // status={statusSection}
                          kycStatus={currentScreeningResult.status}
                          isLoading={loadingBlacklist}
                          onLoad={(val) => {
                            setLoadingBlacklist(true);
                            dispatch(
                              DJ_KYC_ACTION_GET_KYC_BLACKLIST_REQUEST(val)
                            ).then(() => {
                              setLoadingBlacklist(false);
                            });
                          }}
                        />
                        {currentScreeningMatches?.total_records === 0 &&
                          filterParams === null && (
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
                          )}
                      </>
                    )}
                  </div>
                </LoadingWrapper>
              </div>
            </Grid>

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
                        kycId={currentScreeningResult.kycId}
                        matchesList={currentScreeningMatches}
                        kycStatus={currentScreeningResult.status}
                        onLoad={(val) => {
                          try {
                            setLoadingMatches(true);
                            dispatch(DJ_KYC_ACTION_GET_KYC_MATCH_REQUEST(val))
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
            <Grid item xs={12}>
              {currentScreeningBlackLists?.total_records > 0 &&
                currentScreeningMatches?.total_records === 0 &&
                filterParams === null && (
                  <div className={styles.noTable}>
                    <IntlMessages id="kyc.noTableMatches" />
                  </div>
                )}
            </Grid>

            <Grid item xs={12}>
              {currentScreeningBlackLists?.total_records === 0 &&
                currentScreeningMatches?.total_records > 0 && (
                  <div className={styles.noTable}>
                    <IntlMessages id="kyc.noTableBLMatches" />
                  </div>
                )}
            </Grid>
          </Grid>

          {/* Notes */}
          <KYCNoteDialogViewer
            id={viewNote}
            onClose={() => setViewNote(null)}
          />
        </div>
      </>
    );
  }
);

export default KYCScreeningResult;
