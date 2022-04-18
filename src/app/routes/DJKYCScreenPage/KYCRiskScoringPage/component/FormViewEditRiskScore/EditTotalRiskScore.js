import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CloseableDialogTitle from "@protego/sdk/UI/CloseableDialogTitle/CloseableDialogTitle";
import Dropdown from "@protego/sdk/UI/Dropdown/Dropdown";
import DropdownItem from "@protego/sdk/UI/DropdownItem/index";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import TextField from "@protego/sdk/UI/TextField/TextField";
import { toRem } from "@protego/sdk/utils/measurements";
import { DJ_ACTION_EDIT_KYC_SCORING } from "actions/DJAction";
import clsx from "clsx";
import { RISK_LEVEL_TEXT } from "constants/RiskLevelType";
import { Form, Formik } from "formik";
import React, { Fragment, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { snackActions } from "util/snackbarUtils";
import * as Yup from "yup";
import {ERROR_MSG, STATUS_FALSE, TEXT_MEDIUM, STATUS_POSITIVE} from 'constants/ThemeColors';

const useStyles = makeStyles(() => ({
  buttonSize: {
    width: toRem(150)
  },
  customInput: {
    "& .MuiInputBase-formControl": {
      marginBottom: 0
    }
  },
  customError: {
    color: ERROR_MSG,
    fontSize: toRem(12)
  },
  dropdownWrapper: {
    position: "relative",
    width: "100%"
  },
  dropdownButton: {
    width: "100%",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    lineHeight: "1.1876em",
    height: "1.35294rem",
    boxSizing: "content-box",
    paddingLeft: 0,
    paddingRight: 0,
    overflow: "hidden"
  },
  dropdownError: {
    position: "absolute",
    top: "100%",
    left: 0,
    color: ERROR_MSG,
    fontSize: "0.7058823529411765rem",
    marginTop: "3px",
    textAlign: "left",
    fontWeight: "400",
    lineHeight: "1.66",
    letterSpacing: "0.03333em"
  },
  colorGreen: {
    color: STATUS_FALSE
  },
  colorYellow: {
    color: TEXT_MEDIUM,
  },
  colorRed: {
    color: STATUS_POSITIVE
  },
  dialogPaper: {
    minWidth: toRem(650)
  }
}));

const EditRiskScore = ({ isOpen, onClose, kycId, risk, riskLevel}) => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const dispatch = useDispatch();
  const className = useStyles();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
        .max(1000, <IntlMessages id="kyc.notesIsOnly1000Characters" />)
    });
  }, []);

  const onSubmitData = async (values, actions) => {
    setLoading(true);
    try {
      let data = { ...values };
      if (data.newScore === "") {
        data.newScore = data.risk;
      }

      await dispatch(DJ_ACTION_EDIT_KYC_SCORING({ kycId, body: data }));
      actions.resetForm();
      await onClose(true);
      return snackActions.success(<IntlMessages id="notification.success" />);
    } catch (error) {
      return setError(<IntlMessages id="notification.error" />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Dialog
        fullWidth
        open={isOpen}
        onClose={onClose}
        disableBackdropClick
        disableEscapeKeyDown
        classes={{ paper: className.dialogPaper }}
      >
        <CloseableDialogTitle onClose={onClose}>
          <IntlMessages id={"kyc.editTotalRiskScore"} />
        </CloseableDialogTitle>
        <Formik
          initialValues={{
            kycId: kycId,
            risk: risk,
            newScore: risk,
            newScoreRiskLevel: riskLevel,
            note: ""
          }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={onSubmitData}
        >
          {({ errors, values, setFieldValue }) => {
            return (
              <LoadingWrapper loading={loading}>
                <Form>
                  <DialogContent>
                    <Grid container>
                      {error && (
                        <Grid
                          item
                          xs={12}
                          className={clsx("mb-2", className.customError)}
                        >
                          <label>{error}</label>
                        </Grid>
                      )}

                      <Grid item xs={12} className="mb-4">
                        <Grid container spacing={1}>
                          <Grid item xs={8}>
                            <TextField
                              className={className.customInput}
                              inputProps={{
                                min: 0,
                                style: { height: toRem(23) }
                              }}
                              name="newScore"
                              autoFocus
                              margin="dense"
                              fullWidth
                              variant="outlined"
                              placeholder={formatMessage({
                                id: "kyc.enterAdjustedRiskScore"
                              })}
                              formik={true}
                              type="number"
                            />
                          </Grid>
                          <Grid
                            item
                            xs={4}
                            className="d-flex align-items-center"
                          >
                            <div className={className.dropdownWrapper}>
                              <Dropdown
                                name="newScoreRiskLevel"
                                label={
                                  values.newScoreRiskLevel?.length
                                    ? intl.formatMessage({
                                        id: {
                                          LOW: "appModule.riskLevel.low",
                                          MEDIUM: "appModule.riskLevel.medium",
                                          HIGH: "appModule.riskLevel.high"
                                        }[values.newScoreRiskLevel]
                                      })
                                    : intl.formatMessage({
                                        id: "kyc.selectRiskLevel"
                                      })
                                }
                                className={clsx(className.dropdownButton)}
                              >
                                <DropdownItem
                                  className={className.colorGreen}
                                  onClick={() => {
                                    setFieldValue(
                                      "newScoreRiskLevel",
                                      RISK_LEVEL_TEXT.LOW
                                    );
                                  }}
                                >
                                  <IntlMessages
                                    id={"appModule.riskLevel.low"}
                                  />
                                </DropdownItem>
                                <DropdownItem
                                  className={className.colorYellow}
                                  onClick={() => {
                                    setFieldValue(
                                      "newScoreRiskLevel",
                                      RISK_LEVEL_TEXT.MEDIUM
                                    );
                                  }}
                                >
                                  <IntlMessages
                                    id={"appModule.riskLevel.medium"}
                                  />
                                </DropdownItem>
                                <DropdownItem
                                  className={className.colorRed}
                                  onClick={() => {
                                    setFieldValue(
                                      "newScoreRiskLevel",
                                      RISK_LEVEL_TEXT.HIGH
                                    );
                                  }}
                                >
                                  <IntlMessages
                                    id={"appModule.riskLevel.high"}
                                  />
                                </DropdownItem>
                              </Dropdown>
                              {errors.newScoreRiskLevel && (
                                <p
                                  className={clsx(
                                    "MuiFormHelperText-root Mui-error",
                                    className.dropdownError
                                  )}
                                >
                                  {errors.newScoreRiskLevel}
                                </p>
                              )}
                            </div>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          className={className.customInput}
                          name="note"
                          fullWidth
                          multiline
                          rows={12}
                          variant="outlined"
                          placeholder={formatMessage({ id: "kyc.Notes" })}
                          formik={true}
                        />
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      className={className.buttonSize}
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={values?.note?.trim() === ""}
                    >
                      <IntlMessages id="save" />
                    </Button>
                    <Button
                      className={clsx(className.buttonSize, "ml-3")}
                      variant="contained"
                      onClick={onClose}
                    >
                      <IntlMessages id="appModule.requestForm.cancel" />
                    </Button>
                  </DialogActions>
                </Form>
              </LoadingWrapper>
            );
          }}
        </Formik>
      </Dialog>
    </Fragment>
  );
};

export default EditRiskScore;
