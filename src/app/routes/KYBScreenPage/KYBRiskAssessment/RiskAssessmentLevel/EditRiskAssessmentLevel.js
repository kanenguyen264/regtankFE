import { Button, Grid, Typography } from "@mui/material";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import Dropdown from "@protego/sdk/RegtankUI/v1/Dropdown/Dropdown";
import DropdownItem from "@protego/sdk/RegtankUI/v1/DropdownItem/index";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import {
  KYB_ACTION_RISK_ASSESSMENT_DETAILS,
  KYB_CHANGE_RISK_LEVEL_ASSESSMENT,
} from "actions/KYBAction";
import clsx from "clsx";
import { RISK_LEVEL_TEXT } from "constants/RiskLevelType";
import { Form, Formik, ErrorMessage } from "formik";
import React, { Fragment, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { snackActions } from "util/snackbarUtils";
import * as Yup from "yup";
import styles from "../KYBRiskAssessment.module.scss";

const EditRiskAssessmentLevel = ({
  data,
  isOpen,
  onClose,
  kybId,
  risk,
  type,
}) => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const formRef = useRef();

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      newRiskAssessmentLevel: Yup.string().required(
        <IntlMessages
          id="appModule.form.error.fieldRequired"
          values={{ FIELD: <IntlMessages id="risk-level" /> }}
        />
      ),
      notes: Yup.string()
        .required(<IntlMessages id="kyc.notesIsARequiredField" />)
        .max(1000, <IntlMessages id="kyc.notesIsOnly1000Characters" />),
    });
  }, []);

  const onSubmitData = async (values, actions) => {
    setLoading(true);
    try {
      await dispatch(
        KYB_CHANGE_RISK_LEVEL_ASSESSMENT({
          kybId,
          body: values,
        })
      ).then((result) => {
        setLoading(false);
        dispatch(
          KYB_ACTION_RISK_ASSESSMENT_DETAILS({
            kybIds: kybId,
          })
        );
      });
      actions.resetForm();
      await onClose(true);
      snackActions.success(<IntlMessages id="notification.success" />);
    } finally {
      setLoading(false);
    }
  };
  const onCloseDialog = () => {
    onClose();
    formRef?.current?.resetForm();
  };

  return (
    <Formik
      initialValues={{
        newRiskAssessmentLevel: "",
        notes: "",
      }}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={onSubmitData}
      innerRef={formRef}
    >
      {({ errors, values, setFieldValue, handleSubmit }) => {
        return (
          <Dialog
            open={isOpen}
            onClose={onCloseDialog}
            allowCloseOnTitle
            title={{
              text: <IntlMessages id={"kyb.risk.assessment.edit.title"} />,
            }}
            actionsCustom={
              <div style={{ width: "100%" }}>
                <div className="d-flex justify-content-end">
                  <Button variant="outlinedSecondary" onClick={onCloseDialog}>
                    <IntlMessages id="appModule.requestForm.cancel" />
                  </Button>
                  <Button
                    className={clsx("ml-3")}
                    variant="contained"
                    type="submit"
                    onClick={() => handleSubmit()}
                    disabled={values?.notes?.trim() === ""}
                  >
                    <IntlMessages id="save" />
                  </Button>
                </div>
              </div>
            }
          >
            <LoadingWrapper loading={loading}>
              <div className={styles.dialog}>
                <Form>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <div className="d-flex flex-column">
                        <div className={styles.textLabel}>
                          <Typography variant="smallDefault">
                            <IntlMessages id={"risk-level"} />
                          </Typography>
                        </div>
                        <Dropdown
                          name="newRiskAssessmentLevel"
                          size="medium"
                          label={
                            <Typography variant="textLabel2">
                              {values.newRiskAssessmentLevel?.length
                                ? intl.formatMessage({
                                    id: {
                                      LOW: "appModule.riskLevel.low",
                                      MEDIUM: "appModule.riskLevel.medium",
                                      HIGH: "appModule.riskLevel.high",
                                    }[values.newRiskAssessmentLevel],
                                  })
                                : intl.formatMessage({
                                    id: "kyc.selectRiskLevel",
                                  })}
                            </Typography>
                          }
                          variant="outlinedDropdown"
                          className={clsx("justify-content-between d-flex")}
                        >
                          <DropdownItem
                            onClick={() => {
                              setFieldValue(
                                "newRiskAssessmentLevel",
                                RISK_LEVEL_TEXT.LOW
                              );
                            }}
                            style={{
                              margin: 0,
                            }}
                          >
                            <Typography variant="small1">
                              <IntlMessages id={"appModule.riskLevel.low"} />
                            </Typography>
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              setFieldValue(
                                "newRiskAssessmentLevel",
                                RISK_LEVEL_TEXT.MEDIUM
                              );
                            }}
                            style={{
                              margin: 0,
                            }}
                          >
                            <Typography variant="small1">
                              <IntlMessages id={"appModule.riskLevel.medium"} />
                            </Typography>
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              setFieldValue(
                                "newRiskAssessmentLevel",
                                RISK_LEVEL_TEXT.HIGH
                              );
                            }}
                            style={{
                              margin: 0,
                            }}
                          >
                            <Typography variant="small1">
                              <IntlMessages id={"appModule.riskLevel.high"} />
                            </Typography>
                          </DropdownItem>
                        </Dropdown>

                        <ErrorMessage
                          render={(msg) => (
                            <div className={styles.helpTextError}>{msg}</div>
                          )}
                          name="newRiskAssessmentLevel"
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="smallDefault">
                        <IntlMessages id={"notes"} />
                      </Typography>
                      <TextField
                        className={styles.textArea}
                        name="notes"
                        fullWidth
                        multiline
                        rows={6}
                        variant="outlined"
                        as={"textarea"}
                        placeholder={formatMessage({
                          id: "write.a.note.dot",
                        })}
                        formik={true}
                      />
                    </Grid>
                  </Grid>
                </Form>
              </div>
            </LoadingWrapper>
          </Dialog>
        );
      }}
    </Formik>
  );
};

export default EditRiskAssessmentLevel;
