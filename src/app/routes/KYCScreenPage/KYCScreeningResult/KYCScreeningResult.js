//@flow
import { Grid, Icon, SvgIcon, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import KYCAssigneeEditor from "@protego/sdk/RegtankUI/v1/AssigneeEditor";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import Link from "@protego/sdk/RegtankUI/v1/Link";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import Switch from "@protego/sdk/RegtankUI/v1/Switch/BasicSwitch";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { baseStyles } from "@protego/sdk/styles/base";
import Nullable from "@protego/sdk/UI/Nullable";
import { generatePath } from "@protego/sdk/utils/router";
import { capitalizeFirst } from "@protego/sdk/utils/string";
import { GET_AVAILABLE_ASSIGN } from "actions";
import {
  KYC_ACTION_ASSIGN_KYC_REQUEST,
  KYC_ACTION_GET_KYC_BLACKLIST_REQUEST,
  KYC_ACTION_GET_KYC_MATCH_REQUEST,
  KYC_ACTION_GET_KYC_REQUEST,
  KYC_ACTION_RE_SCREENING_MY_KYC,
  KYC_ACTION_TOGGLE_OM,
} from "actions/KYCAction";
import { downloadReport, KYCScreeningDetailsReport } from "app/reports";
import { ReactComponent as CopyIcon } from "assets/icons/CopyIconGreen.svg";
import { ReactComponent as ExportIcon } from "assets/icons/IcExport.svg";
import { ReactComponent as IcoArrowPrevious } from "assets/icons/IcoArrowPrevious.svg";
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
import { ReactComponent as CopyIconOutlined } from "assets/images/icons/CopyIcon.svg";
import clsx from "clsx";
import ActivityTracker from "components/ActivityTracker";
import BlacklistTable from "components/BlacklistTable";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import Escalate from "components/Escalatev1";
import useExportDialog from "components/ExportDialog";
import KYCNoteDialogViewer from "components/KYCNoteDialogViewer";
import LivenessStatus from "components/LivenessStatus";
import {
  KYC_ROUTE_KYC_SCREEN,
  KYC_ROUTE_KYC_SCREEN_SCORING,
  KYC_ROUTE_MY_KYC,
  LIVENESS_ROUTE_LIVENESS_DETAIL,
} from "constants/routes";
import React, { useCallback, useEffect } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { connect, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useHistory, withRouter } from "react-router-dom";
import { compose } from "recompose";
import KYCService, { KYCNoteAdapter } from "services/KYCService";
import { formatDate } from "util/date";
import withUserSettings from "util/hocs/withUserSettings";
import { isCompletedStatus } from "util/index";
import { snackActions } from "util/snackbarUtils";
import { getFullName } from "util/string";
import { withACL } from "../../../../acl";
import ScreenResultStatus from "../component/ScreenResultStatus";
import useOnGoingMonitoringPrompt from "./dialog/creditDeductOM";
import disablePrompt from "./dialog/disableOMConfirm";
import styles from "./KYCScreeningResult.module.scss";
import MatchesTable from "./MatchesTable";
import ScoringButton from "./ScoringButton";
//import { withEnhancedPagination } from "@protego/sdk/RegtankUI/v1/withPagination";

const KYCScreeningResult = compose(
  withACL,
  withRouter,
  withStyles(baseStyles, { index: 99 }),
  withUserSettings,
  // withEnhancedPagination({key: 'm'}),
  connect((state) => ({
    currentScreeningResult: state.kyc.currentScreeningRequest,
    currentScreeningMatches: state.kyc.currentScreeningMatches,
    currentScreeningBlackLists: state.kyc.currentScreeningBlackLists,
  })),
  (Component) =>
    function KYCScreeningResultOuterPage(props) {
      const dispatch = useDispatch();
      const history = useHistory();
      const location = useLocation();

      const { match, currentScreeningResult, ACL } = props;
      const kycId = match.params.kycId;
      const fromKYC = location?.state?.fromKYC;
      const [isLoaded, setIsLoaded] = React.useState(false);
      const [loadingBlacklist, setLoadingBlacklist] = React.useState(false);
      const [loadingMatches, setLoadingMatches] = React.useState(false);

      useEffect(() => {
        dispatch(KYC_ACTION_GET_KYC_REQUEST(kycId)).then((data) => {
          if (
            data?.individualMatches?.length === 0 &&
            data?.kycBlacklistMatches?.length === 0 &&
            fromKYC
          ) {
            history.push(
              generatePath(KYC_ROUTE_KYC_SCREEN_SCORING, {
                kycId: kycId,
              })
            );
          }
          setIsLoaded(true);
        });
        if (ACL.isAllowedPermissions("SETTING_BLACKLIST_VIEW")) {
          setLoadingBlacklist(true);
          dispatch(
            KYC_ACTION_GET_KYC_BLACKLIST_REQUEST({ id: kycId })
          ).finally(() => setLoadingBlacklist(false));
        }

        setLoadingMatches(true);
        dispatch(KYC_ACTION_GET_KYC_MATCH_REQUEST({ id: kycId })).finally(() =>
          setLoadingMatches(false)
        );
      }, [dispatch, kycId]);

      return (
        <>
          <PageHeading
            title={<IntlMessages id="screening-result" />}
            backButtonUrl={KYC_ROUTE_KYC_SCREEN}
            customUrlResolver={(index, isLast) => {
              if (index === 0) {
                return [<IntlMessages id="url._home" />];
              }
              if (index === 1) {
                return [
                  <IntlMessages id="url.acurisKyc" />,
                  generatePath(KYC_ROUTE_MY_KYC),
                  true,
                ];
              }
              if (index === 2) {
                return [null, null, null, true];
              }
              if (isLast)
                return [<IntlMessages id="screening-result" />, null, false];
            }}
          />
          {currentScreeningResult !== null &&
          isLoaded &&
          currentScreeningResult.kycId === kycId ? (
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
    // paginationParams,
  }) {
    const printedBy = useSelector((state) => state.me.me);
    const exportDialog = useExportDialog();
    const notes = useSelector((state) => state.kyc.notes);
    const [loadingAssign, setLoadingAssign] = React.useState(false);
    let history = useHistory();

    const { generalSettings } = useSelector((state) => state.settings);
    const confirmEnableOM = useOnGoingMonitoringPrompt();
    const confirmDisableOM = disablePrompt();
    const [filterParams, setFilterParams] = React.useState(null);
    const [isLoadedNote, setIsLoadedNote] = React.useState(false);

    const renderField = (label, value, className = "") => (
        <div className={clsx(styles.Field, className)}>
          <div className="d-flex flex-column">
            <Typography variant="labelFieldForm">{label}</Typography>

            <Typography variant="textLabel2">{value}</Typography>
          </div>
        </div>
      ),
      [viewNote, setViewNote] = React.useState(null),
      /**
       *
       * @type {{POSITIVE: number, FALSE: number, UNRESOLVED: number}}
       */
      statusSection = React.useMemo(
        () =>
          currentScreeningResult.individualMatches?.reduce(
            (acc, val) => {
              const newAcc = { ...acc };
              newAcc[val.status]++;
              return newAcc;
            },
            {
              UNRESOLVED: 0,
              POSITIVE: 0,
              FALSE: 0,
            }
          ) ?? {
            UNRESOLVED: 0,
            POSITIVE: 0,
            FALSE: 0,
          },
        [currentScreeningResult]
      ),
      statusSectionBlacklist = React.useMemo(
        () =>
          currentScreeningResult.kycBlacklistMatches?.reduce(
            (acc, val) => {
              const newAcc = { ...acc };
              newAcc[val.status]++;
              return newAcc;
            },
            {
              UNRESOLVED: 0,
              POSITIVE: 0,
              FALSE: 0,
            }
          ) ?? {
            UNRESOLVED: 0,
            POSITIVE: 0,
            FALSE: 0,
          },
        [currentScreeningResult]
      );

    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const [switchRescreening, setWitchRescreening] = React.useState(
      currentScreeningResult.enableReScreening
    );

    const users = useSelector((state) => {
      return state.staff.userAvailableAssign;
    });
    useEffect(() => {
      dispatch(GET_AVAILABLE_ASSIGN({ params: "KYC" }));
    }, []);

    const handleChangeReScreening = (event) => {
      setWitchRescreening(!switchRescreening);
      dispatch(
        KYC_ACTION_RE_SCREENING_MY_KYC({
          action: event.target.checked,
          kycId: currentScreeningResult.kycId,
        })
      );
    };

    const [
      switchOnGoingMonitoring,
      setSwitchOnGoingMonitoring,
    ] = React.useState(currentScreeningResult.enableOnGoingMonitoring);

    React.useEffect(() => {
      setWitchRescreening(currentScreeningResult.enableReScreening);
      setSwitchOnGoingMonitoring(
        currentScreeningResult.enableOnGoingMonitoring
      );
      if (
        currentScreeningResult &&
        currentScreeningResult.kycId &&
        !isLoadedNote
      ) {
        fetchNotes(`${currentScreeningResult.kycId}`);
      }
    }, [currentScreeningResult]);

    const handleToggleOnGoingMonitoring = async (event) => {
      const originalVal = switchOnGoingMonitoring;
      const val = event.target.checked;
      const kycOmDeductionConfirmation =
        generalSettings["kycOmDeductionConfirmation"];

      if (val === false) {
        // check setting on/off of KYC OM
        if (kycOmDeductionConfirmation) {
          await confirmDisableOM([currentScreeningResult], val);
        } else {
          try {
            await dispatch(
              KYC_ACTION_TOGGLE_OM({
                enabled: val,
                kycId: currentScreeningResult?.kycId,
              })
            );
            await dispatch(
              KYC_ACTION_GET_KYC_REQUEST(currentScreeningResult?.kycId)
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
              KYC_ACTION_TOGGLE_OM({
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
    const fetchNotes = React.useCallback(
      () => {
        dispatch(
          KYCNoteAdapter.actionGetAll({
            id: currentScreeningResult?.kycId,
          })
        ).then(() => setIsLoadedNote(true));
      },
      // eslint-disable-next-line
      [dispatch]
    );
    React.useEffect(() => {
      if (
        currentScreeningResult &&
        currentScreeningResult?.kycId &&
        !isLoadedNote
      ) {
        fetchNotes(`${currentScreeningResult?.kycId}`);
      }
      // eslint-disable-next-line
    }, [currentScreeningResult]);

    const download = useCallback(async () => {
      try {
        const { data = [] } = await KYCService.getKycMatchRequest({
          id: currentScreeningResult.kycId,
          params: { size: currentScreeningMatches?.total_records },
        });
        return downloadReport(
          KYCScreeningDetailsReport,
          `KYC_ScreeningDetails_${currentScreeningResult.kycId}_${formatDate(
            new Date(),
            "YYYYMMDDHHmmss"
          )}`,
          {
            notesDetail: notes ? notes[currentScreeningResult.kycId] : [],
            individual: currentScreeningResult,
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
          KYC_ACTION_ASSIGN_KYC_REQUEST({
            kycId: currentScreeningResult.kycId,
            userId: optionSelected.id,
          })
        );
      }
      setLoadingAssign(false);
    };

    return (
      <>
        <div className={styles.container}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <div className={styles.header}>
                <div className="d-flex">
                  <div style={{ marginRight: toRem(17) }}>
                    <SvgIcon
                      className={styles.iconBack}
                      onClick={() => history.push(KYC_ROUTE_MY_KYC)}
                      component={IcoArrowPrevious}
                      viewBox={"0 0 8 14"}
                    />
                  </div>
                  <Typography variant="titleForm">
                    <FormattedHTMLMessage
                      id="search-results--notice"
                      style={{ lineHeight: toRem(27) }}
                      values={{
                        count: currentScreeningResult?.totalMatches || 0,
                        name: currentScreeningResult.individualRequest?.name,
                      }}
                    />
                  </Typography>
                </div>

                <div className={"ml-auto d-flex"}>
                  <Escalate
                    screen="KYCScreeningResult"
                    id={currentScreeningResult?.kycId}
                    viewLogPosition={"left"}
                  />
                  <Button
                    onClick={exportPDF}
                    variant={"contained"}
                    className={clsx("ml-3", styles.exportBtn)}
                    size={"medium"}
                    startIcon={<ExportIcon />}
                    disabled={
                      currentScreeningMatches?.total_records >= 0 ? false : true
                    }
                  >
                    <Typography variant="Subtitle3">
                      <IntlMessages id="export"></IntlMessages>
                    </Typography>
                  </Button>
                </div>
              </div>
            </Grid>
          </Grid>

          <Grid container spacing={2} className={styles.SectionDetail}>
            {/* User Info */}
            <Grid xs={9} item style={{ marginBottom: toRem(24) }}>
              <JRCard
                header={
                  <div
                    className={
                      "d-flex justify-content-between align-items-center"
                    }
                  >
                    <div className={"d-flex flex-column align-items-start"}>
                      <div>
                        <Typography variant="Subtitle2">
                          <IntlMessages id="screening-details" />
                        </Typography>
                      </div>
                      <div style={{ marginTop: toRem(8) }}>
                        <CopyButton
                          component={"span"}
                          tooltip={<IntlMessages id="tooltip.copyID" />}
                          copyIcon={
                            <Icon
                              component={CopyIcon}
                              fontSize={toRem(18.33)}
                            />
                          }
                          className={styles.copyButton}
                        >
                          <Typography variant={"titleForm"}>
                            {currentScreeningResult.kycId}
                          </Typography>
                        </CopyButton>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <div>
                        <Typography
                          variant="labelFieldForm"
                          style={{ marginRight: toRem(16) }}
                        >
                          <IntlMessages id="screening.result.Assignee" />
                        </Typography>
                      </div>
                      <LoadingWrapper loading={loadingAssign}>
                        <div>
                          <KYCAssigneeEditor
                            selected={currentScreeningResult.assignee}
                            data={users || []}
                            hideSearchBox={true}
                            customOnChange={changeAssignee}
                            placement={"bottom-end"}
                            mWidth={100}
                          />
                        </div>
                      </LoadingWrapper>
                    </div>
                  </div>
                }
                headerLine
                classes={{ root: styles.cardWrap }}
              >
                <div className={styles.contentInfo}>
                  <div className={styles.userTitle}>
                    <Typography
                      variant="titleForm"
                      style={{ lineHeight: toRem(20) }}
                    >
                      {currentScreeningResult.individualRequest.name}
                    </Typography>
                  </div>
                  <div className={styles.UserInfo}>
                    <div
                      style={{
                        maxWidth: "20%",
                      }}
                    >
                      <Grid container spacing={0}>
                        <Grid item xs={12}>
                          {renderField(
                            "Onboarding ID",
                            currentScreeningResult.individualRequest
                              ?.livenessId ? (
                              <Link
                                to={generatePath(
                                  LIVENESS_ROUTE_LIVENESS_DETAIL,
                                  {
                                    requestId:
                                      currentScreeningResult.individualRequest
                                        ?.livenessId,
                                  }
                                )}
                              >
                                <Nullable>
                                  {
                                    currentScreeningResult.individualRequest
                                      ?.livenessId
                                  }
                                </Nullable>
                              </Link>
                            ) : (
                              <IntlMessages id={"appModule.hyphen"} />
                            ),
                            "flex-fill"
                          )}
                        </Grid>

                        <Grid item xs={12}>
                          {renderField(
                            <IntlMessages id="gender" />,
                            <Nullable>
                              {currentScreeningResult.individualRequest.gender
                                |> capitalizeFirst}
                            </Nullable>,
                            "flex-fill"
                          )}
                        </Grid>

                        <Grid item xs={12}>
                          {renderField(
                            <IntlMessages id="reference-id" />,
                            <Nullable
                              component={({ children, ...others }) => (
                                <CopyButton
                                  component={"span"}
                                  {...others}
                                  copyIcon={
                                    <SvgIcon
                                      component={CopyIconOutlined}
                                      viewBox="0 0 16 16"
                                    />
                                  }
                                >
                                  <span>{children}</span>
                                </CopyButton>
                              )}
                            >
                              {
                                currentScreeningResult.individualRequest
                                  .referenceId
                              }
                            </Nullable>
                          )}
                        </Grid>
                      </Grid>
                    </div>
                    <div
                      style={{
                        maxWidth: "20%",
                      }}
                    >
                      <Grid container spacing={0}>
                        <Grid item xs={12}>
                          {renderField(
                            "Onboarding Status",
                            currentScreeningResult?.individualRequest
                              ?.livenessStatus ? (
                              <LivenessStatus
                                status={
                                  currentScreeningResult.individualRequest
                                    ?.livenessStatus
                                }
                              />
                            ) : (
                              <IntlMessages id={"appModule.hyphen"} />
                            ),
                            "flex-fill"
                          )}
                        </Grid>

                        <Grid item xs={12}>
                          {renderField(
                            <IntlMessages id="date-of-birth" />,
                            <Nullable>
                              {formatDate(
                                currentScreeningResult.individualRequest
                                  .dateOfBirth
                              )}
                            </Nullable>,
                            "flex-fill"
                          )}
                        </Grid>

                        <Grid item xs={12}>
                          {renderField(
                            <IntlMessages id="place-of-birth" />,
                            <Nullable
                              component={CountryFlagLanguage}
                              valueProp={"countryCode"}
                              svg
                              displayCountryName
                            >
                              {
                                currentScreeningResult.individualRequest
                                  .placeOfBirth
                              }
                            </Nullable>,
                            "flex-fill"
                          )}
                        </Grid>
                      </Grid>
                    </div>
                    <div
                      style={{
                        maxWidth: "20%",
                      }}
                    >
                      {renderField(
                        <IntlMessages id="government-id-number" />,
                        <Nullable>
                          {
                            currentScreeningResult.individualRequest
                              .governmentIdNumber
                          }
                        </Nullable>
                      )}
                      {renderField(
                        <IntlMessages id="kyc.idIssuingCountry" />,
                        <Nullable
                          component={CountryFlagLanguage}
                          valueProp={"countryCode"}
                          svg
                          displayCountryName
                        >
                          {
                            currentScreeningResult.individualRequest
                              .idIssuingCountry
                          }
                        </Nullable>
                      )}
                    </div>
                    <div
                      style={{
                        maxWidth: "20%",
                      }}
                    >
                      {renderField(
                        <IntlMessages id="nationality" />,
                        <Nullable
                          component={CountryFlagLanguage}
                          valueProp={"countryCode"}
                          svg
                          displayCountryName
                          demonym
                        >
                          {currentScreeningResult.individualRequest.nationality}
                        </Nullable>
                      )}
                      {renderField(
                        <IntlMessages id="country-of-residence" />,
                        <Nullable
                          component={CountryFlagLanguage}
                          valueProp={"countryCode"}
                          svg
                          displayCountryName
                        >
                          {
                            currentScreeningResult.individualRequest
                              .countryOfResidence
                          }
                        </Nullable>
                      )}
                    </div>
                    <div
                      style={{
                        maxWidth: "20%",
                      }}
                    >
                      {renderField(
                        <IntlMessages id="phone-number" />,
                        <Nullable>
                          {currentScreeningResult.individualRequest.phone}
                        </Nullable>
                      )}
                      {renderField(
                        <IntlMessages id="email-address" />,
                        <Nullable>
                          {currentScreeningResult.individualRequest.email}
                        </Nullable>
                      )}

                      {renderField(
                        <IntlMessages id="kyc.address" />,
                        <Nullable>
                          {currentScreeningResult.individualRequest.address1}
                        </Nullable>
                      )}
                    </div>
                  </div>
                </div>

                <hr />
                <div>
                  <Grid item xs={12}>
                    <Grid container className={styles.switchesWrapper}>
                      <Grid item className="d-flex align-items-center">
                        <div className={styles.boxSwitches}>
                          <div className={styles.btnSwitch}>
                            {!currentScreeningResult?.reScreeningEditable &&
                            currentScreeningResult?.archivedAt === null ? (
                              <Tooltip
                                placement="top-start"
                                arrow
                                title={
                                  <div className="custom-tooltip">
                                    <p>
                                      <FormattedHTMLMessage id="kyc.screen.tooltip.rescreening.disabled" />
                                    </p>
                                  </div>
                                }
                              >
                                <span>
                                  <Switch
                                    checked={switchRescreening}
                                    disabled
                                  />
                                </span>
                              </Tooltip>
                            ) : (
                              <Switch
                                checked={switchRescreening}
                                disabled={
                                  ACL.isAllowedPermissions("MY_KYC_EDIT")
                                    ? false
                                    : true
                                }
                                onChange={handleChangeReScreening}
                              />
                            )}
                          </div>
                          <div>
                            <Typography variant="Subtitle2">
                              <IntlMessages id="re-screening" />
                            </Typography>
                            <span style={{ marginLeft: toRem(8) }}>
                              <Tooltip
                                placement="top-start"
                                arrow
                                title={
                                  <div className="custom-tooltip">
                                    <h5>
                                      <IntlMessages id="re-screening" />
                                    </h5>
                                    <p>
                                      <FormattedHTMLMessage id="kyc.screen.tooltip.rescreening" />
                                    </p>
                                  </div>
                                }
                              >
                                <QuestionMarkIcon />
                              </Tooltip>
                            </span>
                          </div>
                        </div>
                        <div className={styles.boxSwitches}>
                          <div className={styles.btnSwitch}>
                            {currentScreeningResult?.archivedAt ? (
                              <Tooltip
                                placement="top-start"
                                arrow
                                title={
                                  <div className="custom-tooltip">
                                    <p>
                                      <FormattedHTMLMessage id="kyc.screen.tooltip.onGoingMonitoring.disabled" />
                                    </p>
                                  </div>
                                }
                              >
                                <span>
                                  <Switch
                                    checked={switchOnGoingMonitoring}
                                    disabled
                                  />
                                </span>
                              </Tooltip>
                            ) : !currentScreeningResult.individualRequest
                                ?.forename?.length ||
                              currentScreeningResult.individualRequest?.pep ===
                                false ||
                              currentScreeningResult.individualRequest
                                ?.adverseMedia === false ||
                              currentScreeningResult.individualRequest
                                ?.lawEnforcement === false ||
                              currentScreeningResult.individualRequest
                                ?.currentSanctions === false ||
                              currentScreeningResult.individualRequest
                                ?.financialRegulator === false ? (
                              <Tooltip
                                arrow
                                placement="top-start"
                                title={
                                  !currentScreeningResult.individualRequest
                                    ?.forename?.length ? (
                                    <div className="custom-tooltip">
                                      <p>
                                        <FormattedHTMLMessage id="kyc.screen.tooltip.onGoingMonitoring.requiredFirstName" />
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="custom-tooltip">
                                      <p>
                                        <FormattedHTMLMessage id="kyc.screen.tooltip.onGoingMonitoring.differentDatasetFault" />
                                      </p>
                                    </div>
                                  )
                                }
                              >
                                <span>
                                  <Switch
                                    checked={switchOnGoingMonitoring}
                                    disabled
                                  />
                                </span>
                              </Tooltip>
                            ) : (
                              <Switch
                                disabled={
                                  ACL.isAllowedPermissions("MY_KYC_EDIT")
                                    ? false
                                    : true
                                }
                                checked={switchOnGoingMonitoring}
                                onChange={handleToggleOnGoingMonitoring}
                              />
                            )}
                          </div>
                          <div>
                            <Typography variant="Subtitle2">
                              <IntlMessages id="kyc.ongoing" />
                            </Typography>
                            <span style={{ marginLeft: toRem(8) }}>
                              <Tooltip
                                placement="top-start"
                                arrow
                                title={
                                  <div className="custom-tooltip">
                                    <h5>
                                      <IntlMessages id="kyc.ongoing" />
                                    </h5>
                                    <p>
                                      <FormattedHTMLMessage id="kyc.screen.tooltip.onGoingMonitoring" />
                                    </p>
                                  </div>
                                }
                              >
                                <QuestionMarkIcon />
                              </Tooltip>
                            </span>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              </JRCard>
            </Grid>
            {/* Status */}
            <Grid item xs={3} style={{ marginBottom: toRem(24) }}>
              <ScreenResultStatus
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
                  {currentScreeningBlackLists?.total_records === 0 && (
                    <ActivityTracker
                      style={{ marginTop: 0 }}
                      lastModifiedAt={currentScreeningResult.updatedAt}
                      lastModifiedBy={getFullName(
                        currentScreeningResult.lastModifiedBy
                      )}
                      screenedBy={getFullName(currentScreeningResult.createdBy)}
                      screenedAt={currentScreeningResult.createdAt}
                    />
                  )}
                </Grid>
              )}

            {/* Scoring button */}
            {currentScreeningResult.unresolved === 0 &&
              currentScreeningResult.blacklistUnresolved === 0 &&
              (currentScreeningMatches?.total_records > 0 ||
                currentScreeningBlackLists?.total_records > 0 || filterParams !== null) && (
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
                <Grid item xs={12}>
                  <div
                    style={{ marginTop: toRem(100) }}
                    className={"d-flex flex-column"}
                  >
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
                          to={generatePath(KYC_ROUTE_KYC_SCREEN_SCORING, {
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
                </Grid>
              )}

            {/* Blacklist*/}
            {ACL.isAllowedPermissions("SETTING_BLACKLIST_VIEW") && (
              <Grid xs={12} item style={{ paddingTop: 0 }}>
                <div>
                  <LoadingWrapper loading={loadingBlacklist} size={"3rem"}>
                    <div
                      className={clsx({
                        "mb-4": currentScreeningBlackLists?.total_records > 0,
                      })}
                      style={{
                        minHeight: !currentScreeningBlackLists?.records
                          ? "100px"
                          : "auto",
                      }}
                    >
                      {currentScreeningBlackLists?.total_records > 0 && (
                        <>
                          <BlacklistTable
                            kycId={currentScreeningResult.kycId}
                            matchesList={currentScreeningBlackLists}
                            kycStatus={currentScreeningResult.status}
                            ACL={ACL}
                            isLoading={loadingBlacklist}
                            onLoad={(val) => {
                              setLoadingBlacklist(true);
                              dispatch(
                                KYC_ACTION_GET_KYC_BLACKLIST_REQUEST(val)
                              ).then(() => {
                                setLoadingBlacklist(false);
                              });
                            }}
                          />

                          {currentScreeningMatches?.total_records === 0 &&
                            filterParams === null && (
                              <ActivityTracker
                                lastModifiedAt={
                                  currentScreeningResult.updatedAt
                                }
                                lastModifiedBy={getFullName(
                                  currentScreeningResult.lastModifiedBy
                                )}
                                screenedBy={getFullName(
                                  currentScreeningResult.createdBy
                                )}
                                screenedAt={currentScreeningResult.createdAt}
                              />
                            )}
                        </>
                      )}
                    </div>
                  </LoadingWrapper>
                </div>
              </Grid>
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
                        kycId={currentScreeningResult.kycId}
                        matchesList={currentScreeningMatches}
                        kycStatus={currentScreeningResult.status}
                        onLoad={(val) => {
                          try {
                            setLoadingMatches(true);
                            dispatch(KYC_ACTION_GET_KYC_MATCH_REQUEST(val))
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
                        lastModifiedAt={currentScreeningResult.updatedAt}
                        lastModifiedBy={getFullName(
                          currentScreeningResult.lastModifiedBy
                        )}
                        screenedBy={getFullName(
                          currentScreeningResult.createdBy
                        )}
                        screenedAt={currentScreeningResult.createdAt}
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
