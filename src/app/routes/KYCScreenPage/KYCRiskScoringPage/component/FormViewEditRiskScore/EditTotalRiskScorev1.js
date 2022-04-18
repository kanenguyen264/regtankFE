import { Grid, Typography } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import Dropdown from "@protego/sdk/RegtankUI/v1/Dropdown/Dropdown";
import DropdownItem from "@protego/sdk/RegtankUI/v1/DropdownItem/index";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import { KYC_ACTION_EDIT_KYC_SCORING } from "actions/KYCAction";
import clsx from "clsx";
import { RISK_LEVEL_TEXT } from "constants/RiskLevelType";
import { Form, Formik } from "formik";
import React, { useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { snackActions } from "util/snackbarUtils";
import * as Yup from "yup";
import styles from "./FormViewEditRiskScore.module.scss";

const EditRiskScore = ({ isOpen, onClose, kycId, risk, riskLevel }) => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef();

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      newScore: Yup.number()
        .typeError(<IntlMessages id="kyc.numberStart0" />)
        .min(0, <IntlMessages id="kyc.numberStart0" />),
      newScoreRiskLevel: Yup.string().required(
        <IntlMessages
          id="appModule.form.error.fieldRequired"
          values={{ FIELD: <IntlMessages id="risk-level" /> }}
        />
      ),
      note: Yup.string()
        .required(<IntlMessages id="kyc.notesIsARequiredField" />)
        .max(1000, <IntlMessages id="kyc.notesIsOnly1000Characters" />),
    });
  }, []);

  const onSubmitData = async (values, actions) => {
    setLoading(true);
    try {
      let data = { ...values };
      if (data.newScore === "") {
        data.newScore = data.risk;
      }

      await dispatch(KYC_ACTION_EDIT_KYC_SCORING({ kycId, body: data }));
      actions.resetForm();
      await onClose(true);
      return snackActions.success(<IntlMessages id="notification.success" />);
    } catch (error) {
      return setError(<IntlMessages id="notification.error" />);
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
        kycId: kycId,
        risk: risk,
        newScore: risk,
        newScoreRiskLevel: riskLevel,
        note: "",
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
              text: <IntlMessages id={"kyc.editTotalRiskScore"} />,
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
                    disabled={values?.note?.trim() === ""}
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
                    <Grid item xs={6}>
                      <div className="d-flex flex-column justify-content-start">
                        <div className={styles.textLabel}>
                          <Typography variant="smallDefault">
                            <IntlMessages id={"risk-score"} />
                          </Typography>
                        </div>
                        <TextField
                          size="small"
                          fullWidth
                          name="newScore"
                          autoFocus
                          variant="outlined"
                          placeholder={formatMessage({
                            id: "kyc.enterAdjustedRiskScore",
                          })}
                          formik={true}
                          className={styles.textScore}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div className="d-flex flex-column">
                        <div className={styles.textLabel}>
                          <Typography variant="smallDefault">
                            <IntlMessages id={"risk-level"} />
                          </Typography>
                        </div>
                        <Dropdown
                          name="newScoreRiskLevel"
                          size="medium"
                          label={
                            <Typography variant="textLabel2">
                              {values.newScoreRiskLevel?.length
                                ? intl.formatMessage({
                                    id: {
                                      LOW: "appModule.riskLevel.low",
                                      MEDIUM: "appModule.riskLevel.medium",
                                      HIGH: "appModule.riskLevel.high",
                                    }[values.newScoreRiskLevel],
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
                                "newScoreRiskLevel",
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
                                "newScoreRiskLevel",
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
                                "newScoreRiskLevel",
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
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="smallDefault">
                        <IntlMessages id={"notes"} />
                      </Typography>
                      <TextField
                        className={styles.textArea}
                        name="note"
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

export default EditRiskScore;
