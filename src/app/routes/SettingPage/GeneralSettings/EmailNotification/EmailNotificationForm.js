import { Grid } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { Switch } from "@protego/sdk/RegtankUI/v1/Switch";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
import clsx from "clsx";
import { Form, Formik } from "formik";
import React, { useEffect, useRef } from "react";
import { FormattedHTMLMessage } from "react-intl";
import { canAccessKYT } from "../../../../../util/permision";
import styles from "../../SettingsPage.module.scss";
import { formStyles } from "../styles";

const EmailNotificationForm = ({
  generalSettings,
  onSubmitData,
  onPressReset,
  customerMe,
}) => {
  const formikEmailRef = useRef();
  useEffect(() => {
    if (formikEmailRef && generalSettings) {
      formikEmailRef.current.setValues({
        kycOmEmailSummaryEnabled:
          generalSettings.kycOmEmailSummaryEnabled || false,
        kybOmEmailSummaryEnabled:
          generalSettings.kybOmEmailSummaryEnabled || false,
        kytOmEmailSummaryEnabled:
          generalSettings.kytOmEmailSummaryEnabled || false,
        kycAssignmentOmEmailEnabled:
          generalSettings.kycAssignmentOmEmailEnabled || false,
        blacklistEmailSummaryEnabled:
          generalSettings.blacklistEmailSummaryEnabled || false,
        kybAssignmentOmEmailEnabled:
          generalSettings.kybAssignmentOmEmailEnabled || false,
        djKycAssignmentOmEmailEnabled:
          generalSettings.djKycAssignmentOmEmailEnabled || false,
        djKycOmEmailSummaryEnabled:
          generalSettings.djKycOmEmailSummaryEnabled || false,
      });
    }
  }, [generalSettings]);

  const classes = formStyles();
  return (
    <>
      {generalSettings && (
        <Formik
          innerRef={formikEmailRef}
          initialValues={{
            kycOmEmailSummaryEnabled: false,
            djKycOmEmailSummaryEnabled: false,
            kybOmEmailSummaryEnabled: false,
            kytOmEmailSummaryEnabled: false,
            kycAssignmentOmEmailEnabled: false,
            djKycAssignmentOmEmailEnabled: false,
            blacklistEmailSummaryEnabled: false,
            kybAssignmentOmEmailEnabled: false,
          }}
          onSubmitData
          onSubmit={onSubmitData}
        >
          {({ values, setFieldValue }) => {
            return (
              <Form className={styles.generalSettingForm}>
                <div className={classes.settingBlock}>
                  <h5 className={classes.settingHeading}>
                    <IntlMessages id={"setting.generalSettings.email.title"} />
                  </h5>
                  <div className={classes.controlWrapper}>
                    {/* Acuris KYC Ongoing Monitoring Summary */}
                    <Grid container className={classes.control}>
                      <Grid item xs={10}>
                        <IntlMessages
                          id={"setting.generalSettings.email.kyc.OMSummary"}
                        />
                        <span className="ml-1">
                          <Tooltip
                            placement="top-start"
                            arrow
                            title={
                              <div className={clsx(classes.tooltipContent)}>
                                <h5>
                                  <FormattedHTMLMessage id="setting.generalSettings.email.kyc.OMSummary.tooltip.title" />
                                </h5>
                                <p>
                                  <FormattedHTMLMessage id="setting.generalSettings.email.kyc.OMSummary.tooltip.content" />
                                </p>
                              </div>
                            }
                          >
                            <QuestionMarkIcon />
                          </Tooltip>
                        </span>
                      </Grid>
                      <Grid item xs={2} className="text-right">
                        <Switch
                          checked={values.kycOmEmailSummaryEnabled}
                          name="kycOmEmailSummaryEnabled"
                          onChange={(event) => {
                            setFieldValue(
                              "kycOmEmailSummaryEnabled",
                              event.target.checked
                            );
                          }}
                        />
                      </Grid>
                    </Grid>

                    {/* Dow Jones KYC Ongoing Monitoring Summary */}
                    <Grid container className={classes.control}>
                      <Grid item xs={10}>
                        <IntlMessages
                          id={"setting.generalSettings.email.djkyc.OMSummary"}
                        />
                        <span className="ml-1">
                          <Tooltip
                            placement="top-start"
                            arrow
                            title={
                              <div className={clsx(classes.tooltipContent)}>
                                <h5>
                                  <FormattedHTMLMessage id="setting.generalSettings.email.djkyc.OMSummary.tooltip.title" />
                                </h5>
                                <p>
                                  <FormattedHTMLMessage id="setting.generalSettings.email.djkyc.OMSummary.tooltip.content" />
                                </p>
                              </div>
                            }
                          >
                            <QuestionMarkIcon />
                          </Tooltip>
                        </span>
                      </Grid>
                      <Grid item xs={2} className="text-right">
                        <Switch
                          checked={values.djKycOmEmailSummaryEnabled}
                          name="djKycOmEmailSummaryEnabled"
                          onChange={(event) => {
                            setFieldValue(
                              "djKycOmEmailSummaryEnabled",
                              event.target.checked
                            );
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container className={classes.control}>
                      <Grid item xs={10}>
                        <IntlMessages
                          id={
                            "setting.generalSettings.email.kyc.assignment.OMSummary"
                          }
                        />
                        <span className="ml-1">
                          <Tooltip
                            placement="top-start"
                            arrow
                            title={
                              <div className={clsx(classes.tooltipContent)}>
                                <h5>
                                  <FormattedHTMLMessage id="setting.generalSettings.email.kyc.assignment.tooltip.title" />
                                </h5>
                                <p>
                                  <FormattedHTMLMessage id="setting.generalSettings.email.kyc.assignment.tooltip.content" />
                                </p>
                              </div>
                            }
                            enterDelay={300}
                          >
                            <QuestionMarkIcon />
                          </Tooltip>
                        </span>
                      </Grid>
                      <Grid item xs={2} className="text-right">
                        <Switch
                          checked={values.kycAssignmentOmEmailEnabled}
                          name="kycAssignmentOmEmailEnabled"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                          onChange={(event, checked) => {
                            setFieldValue(
                              "kycAssignmentOmEmailEnabled",
                              checked
                            );
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Grid container className={classes.control}>
                      <Grid item xs={10}>
                        <IntlMessages
                          id={
                            "setting.generalSettings.email.djkyc.assignment.OMSummary"
                          }
                        />
                        <span className="ml-1">
                          <Tooltip
                            placement="top-start"
                            className={"ml-1"}
                            arrow
                            title={
                              <div className={clsx(classes.tooltipContent)}>
                                <h5>
                                  <FormattedHTMLMessage id="setting.generalSettings.email.djkyc.assignment.tooltip.title" />
                                </h5>
                                <p>
                                  <FormattedHTMLMessage id="setting.generalSettings.email.djkyc.assignment.tooltip.content" />
                                </p>
                              </div>
                            }
                            enterDelay={300}
                          >
                            <QuestionMarkIcon />
                          </Tooltip>
                        </span>
                      </Grid>
                      <Grid item xs={2} className="text-right">
                        <Switch
                          checked={values.djKycAssignmentOmEmailEnabled}
                          name="djKycAssignmentOmEmailEnabled"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                          onChange={(event, checked) => {
                            setFieldValue(
                              "djKycAssignmentOmEmailEnabled",
                              checked
                            );
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container className={classes.control}>
                      <Grid item xs={10}>
                        <IntlMessages
                          id={"setting.generalSettings.email.kyb.OMSummary"}
                        />
                        <span className="ml-1">
                          <Tooltip
                            placement="top-start"
                            arrow
                            title={
                              <div className={clsx(classes.tooltipContent)}>
                                <h5>
                                  <FormattedHTMLMessage id="setting.generalSettings.email.kyb.OMSummary.tooltip.title" />
                                </h5>
                                <p>
                                  <FormattedHTMLMessage id="setting.generalSettings.email.kyb.OMSummary.tooltip" />
                                </p>
                              </div>
                            }
                          >
                            <QuestionMarkIcon />
                          </Tooltip>
                        </span>
                      </Grid>
                      <Grid item xs={2} className="text-right">
                        <Switch
                          checked={values.kybOmEmailSummaryEnabled}
                          name="kybOmEmailSummaryEnabled"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                          onChange={(event, checked) => {
                            setFieldValue("kybOmEmailSummaryEnabled", checked);
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container className={classes.control}>
                      <Grid item xs={10}>
                        <IntlMessages
                          id={"setting.generalSettings.kyb.assignment"}
                        />
                        <span className="ml-1">
                          <Tooltip
                            placement="top-start"
                            className={"ml-1"}
                            arrow
                            title={
                              <div className={clsx(classes.tooltipContent)}>
                                <h5>
                                  <FormattedHTMLMessage id="setting.generalSettings.kyb.assignment.tooltip.title" />
                                </h5>
                                <p>
                                  <FormattedHTMLMessage id="setting.generalSettings.kyb.tooltip" />
                                </p>
                              </div>
                            }
                            enterDelay={300}
                          >
                            <QuestionMarkIcon />
                          </Tooltip>
                        </span>
                      </Grid>
                      <Grid item xs={2} className="text-right">
                        <Switch
                          checked={values.kybAssignmentOmEmailEnabled}
                          name="kybAssignmentOmEmailEnabled"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                          onChange={(event, checked) => {
                            setFieldValue(
                              "kybAssignmentOmEmailEnabled",
                              checked
                            );
                          }}
                        />
                      </Grid>
                    </Grid>
                    {canAccessKYT(customerMe) && (
                      <Grid container className={classes.control}>
                        <Grid item xs={10}>
                          <IntlMessages
                            id={"setting.generalSettings.email.kyt.OMSummary"}
                          />
                          <span className="ml-1">
                            <Tooltip
                              placement="top-start"
                              arrow
                              title={
                                <div className={clsx(classes.tooltipContent)}>
                                  <h5>
                                    <FormattedHTMLMessage id="setting.generalSettings.email.kyt.OMSummary.tooltip.title" />
                                  </h5>
                                  <p>
                                    <FormattedHTMLMessage id="setting.generalSettings.email.kyt.OMSummary.tooltip" />
                                  </p>
                                </div>
                              }
                            >
                              <QuestionMarkIcon />
                            </Tooltip>
                          </span>
                        </Grid>
                        <Grid item xs={2} className="text-right">
                          <Switch
                            checked={values.kytOmEmailSummaryEnabled}
                            name="kytOmEmailSummaryEnabled"
                            inputProps={{
                              "aria-label": "secondary checkbox",
                            }}
                            onChange={(event, checked) => {
                              setFieldValue(
                                "kytOmEmailSummaryEnabled",
                                checked
                              );
                            }}
                          />
                        </Grid>
                      </Grid>
                    )}

                    <Grid container className={classes.control}>
                      <Grid item xs={10}>
                        <IntlMessages
                          id={"setting.generalSettings.email.blacklist.summary"}
                        />
                        <span className="ml-1">
                          <Tooltip
                            placement="top-start"
                            arrow
                            title={
                              <div className={clsx(classes.tooltipContent)}>
                                <h5>
                                  <IntlMessages id="setting.generalSettings.email.blacklist.summary" />
                                </h5>
                                <p>
                                  <FormattedHTMLMessage id="setting.generalSettings.email.blacklist.summary.tooltip" />
                                </p>
                              </div>
                            }
                            enterDelay={300}
                          >
                            <QuestionMarkIcon />
                          </Tooltip>
                        </span>
                      </Grid>
                      <Grid item xs={2} className="text-right">
                        <Switch
                          checked={values.blacklistEmailSummaryEnabled}
                          name="blacklistEmailSummaryEnabled"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                          onChange={(event, checked) => {
                            setFieldValue(
                              "blacklistEmailSummaryEnabled",
                              checked
                            );
                          }}
                        />
                      </Grid>
                    </Grid>
                  </div>
                </div>

                <div
                  className={clsx("d-flex justify-content-between ")}
                  style={{ maxWidth: toRem(645) }}
                >
                  <div className={"flex-end mt-4 pb-2"}>
                  <Button
                      className={styles.ButtonSize}
                      variant="containedWhite"
                      onClick={onPressReset}
                    >
                      <IntlMessages id="appModule.reset" />
                    </Button>
                    <Button
                      className={clsx(styles.ButtonSize, "ml-3")}
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      <IntlMessages id="customer.dialog.save" />
                    </Button>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
    </>
  );
};

export default EmailNotificationForm;
