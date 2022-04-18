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

const AppNotificationForm = ({
  generalSettings,
  onSubmitData,
  onPressReset,
  customerMe,
}) => {
  const formikAppRef = useRef();
  useEffect(() => {
    if (formikAppRef && generalSettings) {
      formikAppRef.current.setValues({
        kycSearchConfirmation: generalSettings.kycSearchConfirmation,
        djKycSearchConfirmation: generalSettings.djKycSearchConfirmation,
        kybSearchConfirmation: generalSettings.kybSearchConfirmation,
        kytSearchConfirmation: generalSettings.kytSearchConfirmation,
        kycOmDeductionConfirmation: generalSettings.kycOmDeductionConfirmation,
        djKycOmDeductionConfirmation:
          generalSettings.djKycOmDeductionConfirmation,
        blacklistUpdate: generalSettings.blacklistUpdate,
        kybOmDeductionConfirmation: generalSettings.kybOmDeductionConfirmation,
      });
    }
  }, [generalSettings]);

  const classes = formStyles();
  return (
    <>
      {generalSettings && (
        <Formik
          innerRef={formikAppRef}
          initialValues={{
            kycSearchConfirmation: false,
            kybSearchConfirmation: false,
            kytSearchConfirmation: false,
            kycOmDeductionConfirmation: false,
            blacklistUpdate: false,
            kybOmDeductionConfirmation: false,
            djKycSearchConfirmation: false,
            djKycOmDeductionConfirmation: false,
          }}
          onSubmitData
          onSubmit={onSubmitData}
        >
          {({ values, setFieldValue }) => {
            return (
              <Form className={styles.generalSettingForm}>
                <div className={classes.settingBlock}>
                  <h5 className={classes.settingHeading}>
                    <IntlMessages id={"setting.generalSettings.description"} />
                  </h5>
                  <div className={classes.controlWrapper}>
                    {/* ACURIS KYC Screening Confirmation START */}

                    <Grid container className={classes.control}>
                      <Grid item xs={10}>
                        <IntlMessages
                          id={"setting.generalSettings.kyc.confirmation"}
                        />
                        <span className="ml-1">
                          <Tooltip
                            placement="top-start"
                            arrow
                            title={
                              <div className={clsx(classes.tooltipContent)}>
                                <h5>
                                  <FormattedHTMLMessage id="setting.generalSettings.kyc.confirmation.tooltip.title" />
                                </h5>
                                <p>
                                  <FormattedHTMLMessage id="setting.generalSettings.kyc.confirmation.tooltip.content" />
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
                          checked={values.kycSearchConfirmation}
                          name="kycSearchConfirmation"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                          onChange={(event, checked) => {
                            setFieldValue("kycSearchConfirmation", checked);
                          }}
                        />
                      </Grid>
                    </Grid>
                    {/* ACURIS KYC Screening Confirmation END */}

                    {/* DOW JONES KYC Screening Confirmation START*/}
                    <Grid container className={classes.control}>
                      <Grid item xs={10}>
                        <IntlMessages
                          id={"setting.generalSettings.kycDj.confirmation"}
                        />
                        <span className="ml-1">
                          <Tooltip
                            placement="top-start"
                            arrow
                            title={
                              <div className={clsx(classes.tooltipContent)}>
                                <h5>
                                  <FormattedHTMLMessage id="setting.generalSettings.kycDj.confirmation.tooltip.title" />
                                </h5>
                                <p>
                                  <FormattedHTMLMessage id="setting.generalSettings.kycDj.confirmation.tooltip" />
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
                          checked={values.djKycSearchConfirmation}
                          name="djKycSearchConfirmation"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                          onChange={(event, checked) => {
                            setFieldValue("djKycSearchConfirmation", checked);
                          }}
                        />
                      </Grid>
                    </Grid>
                    {/* DOW JONES KYC Screening Confirmation END*/}

                    {/* KYB Screening Confirmation */}
                    <Grid container className={classes.control}>
                      <Grid item xs={10}>
                        <IntlMessages
                          id={"setting.generalSettings.kyb.confirmation"}
                        />
                        <span className="ml-1">
                          <Tooltip
                            placement="top-start"
                            arrow
                            title={
                              <div className={clsx(classes.tooltipContent)}>
                                <h5>
                                  <FormattedHTMLMessage id="setting.generalSettings.kyb.confirmation.tooltip.title" />
                                </h5>
                                <p>
                                  <FormattedHTMLMessage id="setting.generalSettings.kyb.confirmation.tooltip" />
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
                          checked={values.kybSearchConfirmation}
                          name="kybSearchConfirmation"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                          onChange={(event, checked) => {
                            setFieldValue("kybSearchConfirmation", checked);
                          }}
                        />
                      </Grid>
                    </Grid>

                    {/* KYT Screening Confirmation */}
                    {canAccessKYT(customerMe) && (
                      <Grid container className={classes.control}>
                        <Grid item xs={10}>
                          <IntlMessages
                            id={"setting.generalSettings.kyt.confirmation"}
                          />
                          <span className="ml-1">
                            <Tooltip
                              placement="top-start"
                              arrow
                              title={
                                <div className={clsx(classes.tooltipContent)}>
                                  <h5>
                                    <FormattedHTMLMessage id="setting.generalSettings.kyt.confirmation.tooltip.title" />
                                  </h5>
                                  <p>
                                    <FormattedHTMLMessage id="setting.generalSettings.kyt.confirmation.tooltip" />
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
                            checked={values.kytSearchConfirmation}
                            name="kytSearchConfirmation"
                            inputProps={{
                              "aria-label": "secondary checkbox",
                            }}
                            onChange={(event, checked) => {
                              setFieldValue("kytSearchConfirmation", checked);
                            }}
                          />
                        </Grid>
                      </Grid>
                    )}

                    {/* Acuris Ongoing Monitoring */}
                    <Grid container className={classes.control}>
                      <Grid item xs={10}>
                        <IntlMessages
                          id={"setting.generalSettings.kyc.onGoingMonitor"}
                        />
                        <span className="ml-1">
                          <Tooltip
                            placement="top-start"
                            arrow
                            title={
                              <div className={clsx(classes.tooltipContent)}>
                                <h5>
                                  <FormattedHTMLMessage id="setting.generalSettings.kyc.onGoingMonitor.tooltip.title" />
                                </h5>
                                <p>
                                  <FormattedHTMLMessage id="setting.generalSettings.kyc.OMConfirm.enable.tooltip" />
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
                          checked={values.kycOmDeductionConfirmation}
                          name="kycOmDeductionConfirmation"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                          onChange={(event, checked) => {
                            setFieldValue(
                              "kycOmDeductionConfirmation",
                              checked
                            );
                          }}
                        />
                      </Grid>
                    </Grid>

                    {/* Dow Jones Ongoing Monitoring */}
                    <Grid container className={classes.control}>
                      <Grid item xs={10}>
                        <IntlMessages
                          id={"setting.generalSettings.djkyc.onGoingMonitor"}
                        />
                        <span className="ml-1">
                          <Tooltip
                            placement="top-start"
                            arrow
                            title={
                              <div className={clsx(classes.tooltipContent)}>
                                <h5>
                                  <FormattedHTMLMessage id="setting.generalSettings.djkyc.onGoingMonitor.tooltip.title" />
                                </h5>
                                <p>
                                  <FormattedHTMLMessage id="setting.generalSettings.djkyc.OMConfirm.enable.tooltip" />
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
                          checked={values.djKycOmDeductionConfirmation}
                          name="djKycOmDeductionConfirmation"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                          onChange={(event, checked) => {
                            setFieldValue(
                              "djKycOmDeductionConfirmation",
                              checked
                            );
                          }}
                        />
                      </Grid>
                    </Grid>
                    {/* KYB  Ongoing Monitoring */}
                    <Grid container className={classes.control}>
                      <Grid item xs={10}>
                        <IntlMessages
                          id={"setting.generalSettings.kyb.onGoingMonitor"}
                        />
                        <span className="ml-1">
                          <Tooltip
                            placement="top-start"
                            arrow
                            title={
                              <div className={clsx(classes.tooltipContent)}>
                                <h5>
                                  <FormattedHTMLMessage id="setting.generalSettings.kyb.onGoingMonitor.tooltip.title" />
                                </h5>
                                <p>
                                  <FormattedHTMLMessage id="setting.generalSettings.kyb.OMConfirm.enable.tooltip" />
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
                          checked={values.kybOmDeductionConfirmation}
                          name="kybOmDeductionConfirmation"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                          onChange={(event, checked) => {
                            setFieldValue(
                              "kybOmDeductionConfirmation",
                              checked
                            );
                          }}
                        />
                      </Grid>
                    </Grid>
                  </div>
                </div>

                <div className={classes.settingBlock}>
                  <h5
                    className={classes.settingHeading}
                    style={{ marginTop: toRem(24) }}
                  >
                    <IntlMessages id={"setting.generalSettings.show.popup"} />
                  </h5>
                  <div className={classes.controlWrapper}>
                    <Grid container className={classes.control}>
                      <Grid item xs={10}>
                        <IntlMessages
                          id={"setting.generalSettings.blacklist.update"}
                        />
                        <span className="ml-1">
                          <Tooltip
                            placement="top-start"
                            arrow
                            title={
                              <div className={clsx(classes.tooltipContent)}>
                                <h5>
                                  <IntlMessages id="setting.generalSettings.blacklist.update" />
                                </h5>
                                <p>
                                  <FormattedHTMLMessage id="setting.general.setting.tool.tip" />
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
                          checked={values.blacklistUpdate}
                          name="blacklistUpdate"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                          onChange={(event, checked) => {
                            setFieldValue("blacklistUpdate", checked);
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
                  <div
                    className={"flex-end pb-2"}
                    style={{ marginTop: toRem(24) }}
                  >
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

export default AppNotificationForm;
