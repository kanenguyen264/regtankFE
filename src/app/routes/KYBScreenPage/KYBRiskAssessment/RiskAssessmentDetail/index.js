import { Grid, Icon, SvgIcon, Typography } from "@mui/material";
import KYCAssigneeEditor from "@protego/sdk/RegtankUI/v1/AssigneeEditor";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import Link from "@protego/sdk/RegtankUI/v1/Link";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable";
import Switch from "@protego/sdk/RegtankUI/v1/Switch/BasicSwitch";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { GET_AVAILABLE_ASSIGN } from "actions";
import {
  KYB_ACTION_ASSIGN_KYB_REQUEST,
  KYB_ACTION_RISK_ASSESSMENT_DETAILS,
  KYB_ACTION_SWITCH_RE_SCREENING,
  KYB_ACTION_TOGGLE_OM,
  KYB_UPDATE_BUSINESS_INFORMATION,
} from "actions/KYBAction";
import { ReactComponent as CheckAdd } from "assets/icons/CheckAdd.svg";
import { ReactComponent as CheckDelete } from "assets/icons/CheckDelete.svg";
import { ReactComponent as CopyIcon } from "assets/icons/CopyIconGreen.svg";
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
import { ReactComponent as CopyIconOutlined } from "assets/images/icons/CopyIcon.svg";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import { Field, useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import { FormattedHTMLMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "recompose";
import { formatDate } from "util/date";
import withUserSettings from "util/hocs/withUserSettings";
import { industryCodeToName } from "util/industry";
import { getSizeOfCompany } from "util/sizeOfCompany";
import { snackActions } from "util/snackbarUtils";
import useOnGoingMonitoringPrompt from "./dialog/creditOMConfirm";
import disablePrompt from "./dialog/disableOMConfirm";
import styles from "./RiskAssessmentDetail.module.scss";

const RiskAssessmentDetail = ({ ACL, kybId }) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.staff?.userAvailableAssign);
  const formikContext = useFormikContext();
  const riskDetail = useSelector((state) => state.kyb.riskDetail);
  const [switchReScreening, setWitchReScreening] = useState(null);
  const [switchOnGoingMonitoring, setSwitchOnGoingMonitoring] = useState(false);
  const [editEnable, setEditEnable] = React.useState(false);
  const [loadingAssign, setLoadingAssign] = React.useState(false);
  const { kybRequest } = riskDetail;
  const settings = useSelector((state) => state.settings);
  const confirmEnableOM = useOnGoingMonitoringPrompt();
  const confirmDisableOM = disablePrompt();
  useEffect(() => {
    setWitchReScreening(riskDetail?.kybRequest?.enableReScreening);
    setSwitchOnGoingMonitoring(riskDetail?.kybRequest?.enableOnGoingMonitoring);
  }, [riskDetail]);

  useEffect(() => {
    dispatch(GET_AVAILABLE_ASSIGN({ params: "KYB" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        KYB_ACTION_ASSIGN_KYB_REQUEST({
          kybId: kybId,
          userId: optionSelected.id,
        })
      );
    }
    setLoadingAssign(false);
  };
  const onReScreening = (event) => {
    dispatch(
      KYB_ACTION_SWITCH_RE_SCREENING({
        kybId: riskDetail?.kybRequest?.kybId,
        status: event.target.checked,
      })
    ).then(() => {
      setWitchReScreening(!switchReScreening);
    });
  };

  const handleToggleOnGoingMonitoring = async (event) => {
    const originalVal = switchOnGoingMonitoring;
    const generalSettings = settings["generalSettings"];
    const kybOmDeductionConfirmation =
      generalSettings["kybOmDeductionConfirmation"];

    const val = event.target.checked;
    if (val === false) {
      // check setting on/off of KYC OM when enable
      if (!kybOmDeductionConfirmation) {
        try {
          await dispatch(KYB_ACTION_TOGGLE_OM({ enabled: val, kybId }));
          snackActions.success(
            <FormattedHTMLMessage
              id="kyb.dialog.disabledOnGoingMonitoring.success"
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
      } else {
        const req = {
          kybId,
          setSwitchOM: setSwitchOnGoingMonitoring,
          enableOM: val,
          ...kybRequest,
        };
        await confirmDisableOM([req]);
      }
    } else {
      // check setting on/off of KYC OM when enable
      if (kybOmDeductionConfirmation) {
        const req = {
          kybId,
          setSwitchOM: setSwitchOnGoingMonitoring,
          enableOM: val,
          ...kybRequest,
        };
        await confirmEnableOM([req]);
      } else {
        try {
          await dispatch(KYB_ACTION_TOGGLE_OM({ enabled: val, kybId }));
          snackActions.success(
            <FormattedHTMLMessage
              id="kyb.dialog.enabledOnGoingMonitoring.success"
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
  const onPressSaveInformation = (requestData) => {
    setEditEnable(!editEnable);
    if (editEnable && requestData) {
      dispatch(
        KYB_UPDATE_BUSINESS_INFORMATION({
          kybId: requestData?.kybId,
          body: formikContext?.values?.content,
        })
      ).then(() => {
        dispatch(
          KYB_ACTION_RISK_ASSESSMENT_DETAILS({
            kybIds: requestData?.kybId,
          })
        );
      });
    }
  };

  const onPressClean = () => {
    setEditEnable(!editEnable);
    formikContext.setFieldValue(
      "content",
      riskDetail?.kybRequest?.businessInformation
    );
  };

  return (
    <JRCard
      headerLine
      header={
        <div className={"d-flex justify-content-between align-items-center"}>
          <div className={"d-flex flex-column align-items-start"}>
            <div>
              <Typography variant="Subtitle2">
                <IntlMessages id="screening-details" />
              </Typography>
            </div>
            <div>
              <CopyButton
                component={"span"}
                tooltip={<IntlMessages id="tooltip.copyID" />}
                copyIcon={<Icon component={CopyIcon} fontSize={toRem(18.33)} />}
                className={styles.copyButton}
              >
                <Typography variant={"titleForm"}>{kybId}</Typography>
              </CopyButton>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <Typography variant="labelFieldForm" className={"mr-3"}>
              <IntlMessages id="screening.result.Assignee" />
            </Typography>
            <LoadingWrapper loading={loadingAssign}>
              <div>
                <KYCAssigneeEditor
                  selected={kybRequest?.assignee}
                  data={users || []}
                  customOnChange={changeAssignee}
                  placement={"bottom-end"}
                  mWidth={100}
                />
              </div>
            </LoadingWrapper>
          </div>
        </div>
      }
    >
      <div className={styles.flexGrow}>
        <div>
          <div className={styles.noteGroup}>
            <Typography variant="titleForm">
              {kybRequest?.businessName}
            </Typography>
          </div>
          <div className={styles.flexGrow}>
            <div className={styles.Container}>
              <Grid container spacing={1} columns={10}>
                <Grid item xs={8}>
                  <Grid container spacing={1.5} columns={8}>
                    {/** Positive match **/}
                    <Grid item xs={2}>
                      <div className={"d-flex flex-column"}>
                        <Typography variant="labelFieldForm">
                          <IntlMessages id="screening.result.positiveMatch" />
                        </Typography>
                        <Typography variant="textLabel2">
                          {kybRequest?.positiveMatch ? (
                            <Link
                              to={`/app/screen-kyb/result/${kybRequest?.kybId}/match/${kybRequest?.positiveMatch.matchId}`}
                            >
                              {kybRequest?.positiveMatch.matchId}
                            </Link>
                          ) : (
                            "-"
                          )}
                        </Typography>
                      </div>
                    </Grid>
                    {/** Company Type */}
                    <Grid item xs={2}>
                      <div className={"d-flex flex-column"}>
                        <Typography variant="labelFieldForm">
                          <IntlMessages id="kyb.companyType" />
                        </Typography>
                        <Typography variant="textLabel2">
                          <Nullable component={"span"}>
                            {kybRequest?.companyType}
                          </Nullable>
                        </Typography>
                      </div>
                    </Grid>
                    {/** Country Of Incorporation */}
                    <Grid item xs={2}>
                      <div className={"d-flex flex-column"}>
                        <Typography variant="labelFieldForm">
                          <IntlMessages id="kyb.CountryOfIncorporation" />
                        </Typography>
                        <Typography variant="textLabel2">
                          <Nullable
                            component={CountryFlagLanguage}
                            valueProp={"countryCode"}
                            svg
                            displayCountryName
                            tooltip={false}
                          >
                            {kybRequest?.countryOfIncorporation}
                          </Nullable>
                        </Typography>
                      </div>
                    </Grid>
                    {/** Phone number */}
                    <Grid item xs={2}>
                      <div className={"d-flex flex-column"}>
                        <Typography variant="labelFieldForm">
                          <IntlMessages id="screening.result.Phone" />
                        </Typography>
                        <Typography variant="textLabel2">
                          <Nullable component={"span"}>
                            {kybRequest?.phone}
                          </Nullable>
                        </Typography>
                      </div>
                    </Grid>

                    {/** Bussiness ID Number */}
                    <Grid item xs={2}>
                      <div className={"d-flex flex-column"}>
                        <Typography variant="labelFieldForm">
                          <IntlMessages id="kyb.BusinessIDNumber" />
                        </Typography>
                        <Typography variant="textLabel2">
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
                            {kybRequest?.businessIdNumber}
                          </Nullable>
                        </Typography>
                      </div>
                    </Grid>
                    {/** Size of the Company */}
                    <Grid item xs={2}>
                      <div className={"d-flex flex-column"}>
                        <Typography variant="labelFieldForm">
                          <IntlMessages id="kyb.SizeOfTheCompany" />
                        </Typography>
                        <Typography variant="textLabel2">
                          <Nullable component={"span"}>
                            {kybRequest?.sizeOfTheCompany && (
                              <IntlMessages
                                id={getSizeOfCompany(
                                  riskDetail?.kybRequest?.sizeOfTheCompany
                                )}
                              />
                            )}
                          </Nullable>
                        </Typography>
                      </div>
                    </Grid>
                    {/** Country of Headquarter */}
                    <Grid item xs={2}>
                      <div className={"d-flex flex-column"}>
                        <Typography variant="labelFieldForm">
                          <IntlMessages id="kyb.CountryOfHeadquarter" />
                        </Typography>
                        <Typography variant="textLabel2">
                          <Nullable
                            component={CountryFlagLanguage}
                            valueProp={"countryCode"}
                            svg
                            displayCountryName
                          >
                            {kybRequest?.countryOfHeadQuarter}
                          </Nullable>
                        </Typography>
                      </div>
                    </Grid>
                    {/** Email Address */}
                    <Grid item xs={2}>
                      <div className={"d-flex flex-column"}>
                        <Typography variant="labelFieldForm">
                          <IntlMessages id="screening.result.Email" />
                        </Typography>
                        <Typography variant="textLabel2">
                          <Nullable component={"span"}>
                            {kybRequest?.email}
                          </Nullable>
                        </Typography>
                      </div>
                    </Grid>
                    {/** Business Relationship */}
                    <Grid item xs={2}>
                      <div className={"d-flex flex-column"}>
                        <Typography variant="labelFieldForm">
                          <IntlMessages id="kyb.Relationship" />
                        </Typography>
                        <Typography variant="textLabel2">
                          <Nullable component={"span"}>
                            {kybRequest?.relationship}
                          </Nullable>
                        </Typography>
                      </div>
                    </Grid>
                    {/** Date of Incorporation */}
                    <Grid item xs={2}>
                      <div className={"d-flex flex-column"}>
                        <Typography variant="labelFieldForm">
                          <IntlMessages id="kyb.DateOfIncorporation" />
                        </Typography>
                        <Typography variant="textLabel2">
                          <Nullable component={"span"}>
                            {formatDate(kybRequest?.dateOfIncorporation)}
                          </Nullable>
                        </Typography>
                      </div>
                    </Grid>
                    {/** Website */}
                    <Grid item xs={2}>
                      <div className={"d-flex flex-column"}>
                        <Typography variant="labelFieldForm">
                          <IntlMessages id="kyb.Website" />
                        </Typography>
                        <Typography variant="textLabel2">
                          <Nullable component={"span"}>
                            {kybRequest?.website}
                          </Nullable>
                        </Typography>
                      </div>
                    </Grid>
                    {/** Address Line */}
                    <Grid item xs={2}>
                      <div className={"d-flex flex-column"}>
                        <Typography variant="labelFieldForm">
                          <IntlMessages id="address-line" />
                        </Typography>
                        <Typography variant="textLabel2">
                          <Nullable component={"span"}>
                            {kybRequest?.address1}
                          </Nullable>
                        </Typography>
                      </div>
                    </Grid>
                    {/** Nature of Business */}
                    <Grid item xs={6}>
                      <div className={"d-flex flex-column"}>
                        <Typography variant="labelFieldForm">
                          <IntlMessages id="kyb.NatureOfBusiness" />
                        </Typography>
                        <Typography variant="textLabel2">
                          <Nullable component={"span"}>
                            {kybRequest?.natureOfBusiness && (
                              <IntlMessages
                                id={industryCodeToName(
                                  kybRequest?.natureOfBusiness
                                )}
                              />
                            )}
                          </Nullable>
                        </Typography>
                      </div>
                    </Grid>
                    {/** Reference ID */}
                    <Grid item xs={2}>
                      <div className={"d-flex flex-column"}>
                        <Typography variant="labelFieldForm">
                          <IntlMessages id="kyb.risk.assessment.detail.Reference" />
                        </Typography>
                        <Typography variant="textLabel2">
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
                            {kybRequest?.referenceId}
                          </Nullable>
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                {/** Business Information */}
                <Grid item xs={2}>
                  <div className={"d-flex flex-column"}>
                    <div className="d-flex">
                      <Typography variant="labelFieldForm" className="mr-3">
                        <IntlMessages id="kyb.risk.assessment.BusinessInfo" />
                      </Typography>
                      <div
                        className={clsx(styles.Link)}
                        onClick={() => setEditEnable(!editEnable)}
                      >
                        <IntlMessages id="kyb.risk.edit" />
                      </div>
                    </div>
                    <div className="d-flex flex-column">
                      <div className={styles.businessInfoNote}>
                        <Field
                          disabled={!editEnable}
                          as={"textarea"}
                          placeholder=""
                          rows={5}
                          formik
                          name={"content"}
                        />
                      </div>

                      <div className="d-flex justify-content-end">
                        {editEnable && (
                          <div className={styles.buttonEditGroup}>
                            <Button
                              variant="outlinedIcon"
                              onClick={() => onPressClean()}
                            >
                              <CheckDelete />
                            </Button>
                            <Button
                              className={"ml-3"}
                              variant="outlinedIcon"
                              onClick={() =>
                                onPressSaveInformation(riskDetail?.kybRequest)
                              }
                            >
                              <CheckAdd />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Grid>

                <Grid item xs={10} className={styles.switchGroup}>
                  <hr />
                  <Grid container className={styles.switchesWrapper}>
                    {/** Rescreening  */}
                    <Grid item xs={2}>
                      <div>
                        {kybRequest?.archivedAt ? (
                          <Tooltip
                            arrow
                            placement={"top-start"}
                            title={
                              <div className="custom-tooltip">
                                <p>
                                  <IntlMessages id="kyc.screen.tooltip.rescreening.disabled" />
                                </p>
                              </div>
                            }
                          >
                            <div>
                              <Switch
                                disabled
                                checked={switchReScreening}
                                name="reScreening"
                              />
                            </div>
                          </Tooltip>
                        ) : (
                          <Switch
                            checked={switchReScreening}
                            onChange={onReScreening}
                            name="reScreening"
                            disabled={
                              !kybRequest?.reScreeningEditable ||
                              !ACL.isAllowedPermissions("MY_KYB_EDIT")
                            }
                          />
                        )}
                        <Typography variant="Subtitle2">
                          <span>
                            <IntlMessages id="re-screening" />
                          </span>
                          <span className="ml-1">
                            <Tooltip
                              arrow
                              placement={"top-start"}
                              title={
                                <div className="custom-tooltip">
                                  <h5>
                                    <IntlMessages id="setting.kyb.reScreening" />
                                  </h5>
                                  <p>
                                    <FormattedHTMLMessage id="kyb.screen.tooltip.rescreening" />
                                  </p>
                                </div>
                              }
                            >
                              <QuestionMarkIcon />
                            </Tooltip>
                          </span>
                        </Typography>
                      </div>
                    </Grid>
                    {/** OM  */}

                    <Grid item xs={8}>
                      <div>
                        {kybRequest?.archivedAt ? (
                          <Tooltip
                            arrow
                            placement={"top-start"}
                            title={
                              <div className="custom-tooltip">
                                <p>
                                  <IntlMessages id="kyc.screen.tooltip.rescreening.disabled" />
                                </p>
                              </div>
                            }
                          >
                            <div>
                              <Switch
                                disabled
                                checked={switchOnGoingMonitoring}
                                name="onGoingMonitoring"
                              />
                            </div>
                          </Tooltip>
                        ) : (
                          <Switch
                            checked={switchOnGoingMonitoring}
                            onChange={handleToggleOnGoingMonitoring}
                            name="onGoingMonitoring"
                            disabled={!ACL.isAllowedPermissions("MY_KYB_EDIT")}
                          />
                        )}
                        <Typography variant="Subtitle2">
                          <span>
                            <IntlMessages id="kyc.ongoing" />
                          </span>
                          <span className="ml-1">
                            <Tooltip
                              arrow
                              placement={"top-start"}
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
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </div>
    </JRCard>
  );
};

export default compose(withUserSettings)(RiskAssessmentDetail);
