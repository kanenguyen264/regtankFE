import { DialogActions, DialogContent, Grid } from "@mui/material";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import makeStyles from "@mui/styles/makeStyles";
import Dropdown from "@protego/sdk/RegtankUI/v1/Dropdown/Dropdown";
import DropdownItem from "@protego/sdk/RegtankUI/v1/DropdownItem/index";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import TextFieldOutlined from "@protego/sdk/RegtankUI/v1/TextField/TextFieldOutlined";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { KYT_ACTION_EDIT_RISK_SCORE } from "actions/KYTAction";
import clsx from "clsx";
import { RISK_LEVEL_TEXT } from "constants/RiskLevelType";
import { Form, Formik } from "formik";
import React, { Fragment, useMemo } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { snackActions } from "util/snackbarUtils";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import * as Yup from "yup";
import styles from "./kytRiskCoreEditDialog.module.scss";
const useStyles = makeStyles((theme) => ({
  buttonSize: {
    width: toRem(120),
  },
  customInput: {
    "& .MuiInputBase-formControl": {
      marginBottom: 0,
    },
  },
  customError: {
    color: "#f44336",
    fontSize: toRem(12),
  },
  dropdownWrapper: {
    position: "relative",
    width: "100%",
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
    overflow: "hidden",
    background: "#FFFFFF !important",
    border: "1px solid #ECEEF0 !important",
    // border-r\\Radius: 6px;
  },
  dropdownError: {
    position: "absolute",
    top: "100%",
    left: 0,
  },
  colorGreen: {
    color: "#4CAF50",
  },
  colorYellow: {
    color: "#FF9800",
  },
  colorRed: {
    color: "#EA2134",
  },
}));

const allRiskLevels = [
  {
    name: RISK_LEVEL_TEXT.LOW,
    label: "appModule.riskLevel.low",
    color: "colorGreen",
  },
  {
    name: RISK_LEVEL_TEXT.MEDIUM,
    label: "appModule.riskLevel.medium",
    color: "colorYellow",
  },
  {
    name: RISK_LEVEL_TEXT.HIGH,
    label: "appModule.riskLevel.high",
    color: "colorRed",
  },
];

const KYTEditRiskScoreDialog = ({
  open,
  onClose,
  kytId,
  currentRisk,
  currentRiskLevel,
}) => {
  const className = useStyles();
  const intl = useIntl();
  const { formatMessage } = intl;
  const dispatch = useDispatch();

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      newScore: Yup.number()
        .typeError(<IntlMessages id="kyt.riskScore.scoreStart0" />)
        .min(0, <IntlMessages id="kyt.riskScore.scoreStart0" />)
        .max(10, <IntlMessages id="kyt.riskScore.scoreMax10" />),
      newScoreRiskLevel: Yup.string().required(
        <IntlMessages
          id="appModule.form.error.fieldRequired"
          values={{ FIELD: <IntlMessages id="risk-level" /> }}
        />
      ),
      note: Yup.string()
        .required(<IntlMessages id="kyt.riskScore.notesIsARequiredField" />)
        .max(
          1000,
          <IntlMessages id="kyt.riskScore.notesIsOnly1000Characters" />
        ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRisk]);

  const onSubmitData = async (values) => {
    try {
      let data = { ...values };
      if (data.newScore === "") {
        data.newScore = currentRisk;
      }

      await dispatch(
        KYT_ACTION_EDIT_RISK_SCORE({
          kytId: kytId,
          data: data,
        })
      );
      snackActions.success(<IntlMessages id="notification.success" />);
      onClose(true);
    } catch (err) {
      snackActions.error(<IntlMessages id="notification.error" />);
    }
  };

  return (
    <>
      <Dialog
        // fullWidth
        open={open}
        onClose={onClose}
        disableBackdropClick
        disableEscapeKeyDown
        disableDialogAction
        title={{
          text: <IntlMessages id={"kyt.riskScore.editDialogHeader"} />,
        }}
        className={styles.kytRiskCoreEditDialog}
        scroll="body"
        allowCloseOnTitle={true}
      >
        {/* <CloseableDialogTitle onClose={onClose}>
          <IntlMessages id={"kyt.riskScore.editDialogHeader"} />
        </CloseableDialogTitle> */}
        <Formik
          initialValues={{
            newScore: currentRisk,
            newScoreRiskLevel: currentRiskLevel,
            note: "",
          }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={onSubmitData}
        >
          {({ errors, values, setFieldValue, isSubmitting }) => {
            return (
              <LoadingWrapper loading={isSubmitting}>
                <Form>
                  <div>
                    <Grid container alignContent={"center"}>
                      <Grid
                        item
                        xs={12}
                        className="mb-4 d-flex align-items-center"
                      >
                        <Grid container spacing={1}>
                          <Grid item xs={6} className="">
                            <TextFieldOutlined
                              //   className={className.customInput}
                              inputProps={{
                                min: 0,
                              }}
                              name="newScore"
                              autoFocus
                              margin="dense"
                              fullWidth
                              variant="outlined"
                              placeholder={formatMessage({
                                id: "kyt.riskScore.enterAdjustedRiskScore",
                              })}
                              formik={true}
                              label={"Risk Score"}
                            />
                          </Grid>
                          <Grid item xs={6} style={{ paddingRight: 0 }}>
                            <div className={styles.labelInput}>Risk Level</div>
                            <div
                              className={clsx(
                                className.dropdownWrapper,
                                styles.dropdwonWrapper
                              )}
                            >
                              <Dropdown
                                variant="outlinedDropdown"
                                name="newScoreRiskLevel"
                                label={
                                  values.newScoreRiskLevel?.length
                                    ? intl.formatMessage({
                                        id: {
                                          LOW: "appModule.riskLevel.low",
                                          MEDIUM: "appModule.riskLevel.medium",
                                          HIGH: "appModule.riskLevel.high",
                                        }[values.newScoreRiskLevel],
                                      })
                                    : intl.formatMessage({
                                        id: "kyt.riskScore.selectRiskLevel",
                                      })
                                }
                                className={clsx(
                                  "justify-content-between d-flex"
                                )}
                                fullWidth
                                size="large"
                              >
                                {allRiskLevels.map((item) => {
                                  return (
                                    <DropdownItem
                                      key={item.name}
                                      className={className[item.color]}
                                      onClick={() => {
                                        setFieldValue(
                                          "newScoreRiskLevel",
                                          item.name
                                        );
                                      }}
                                    >
                                      <IntlMessages id={item.label} />
                                    </DropdownItem>
                                  );
                                })}
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
                          className={styles.notes}
                          label={"Notes"}
                          name="note"
                          fullWidth
                          multiline
                          rows={12}
                          variant="outlined"
                          placeholder={formatMessage({
                            id: "Please provide the reason for changes.",
                          })}
                          formik={true}
                        />
                      </Grid>
                    </Grid>
                  </div>
                  <DialogActions className={styles.dialogActions}>
                    <Button
                      className={clsx(className.buttonSize, "ml-3")}
                      variant="containedWhite"
                      onClick={onClose}
                    >
                      <IntlMessages id="appModule.requestForm.cancel" />
                    </Button>
                    <Button
                      className={className.buttonSize}
                      variant="contained"
                      type="submit"
                      disabled={isSubmitting || values?.note?.trim() === ""}
                    >
                      <IntlMessages id="Proceed" />
                    </Button>
                  </DialogActions>
                </Form>
              </LoadingWrapper>
            );
          }}
        </Formik>
      </Dialog>
    </>
  );
};

export default KYTEditRiskScoreDialog;
