import { Grid, MenuItem, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import DropdownList from "@protego/sdk/RegtankUI/v1/DropdownList";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import {
  DJ_ACTION_ESCALATE_KYC,
  DJ_ACTION_GET_KYC_INDIVIDUAL_REQUEST,
  DJ_ACTION_GET_KYC_SCORING,
} from "actions/DJAction";
import {
  KYB_ACTION_ESCALATE,
  KYB_ACTION_GET_KYB_REQUEST,
  KYB_ACTION_RISK_ASSESSMENT_DETAILS,
} from "actions/KYBAction";
import {
  KYC_ACTION_ESCALATE,
  KYC_ACTION_GET_KYC_REQUEST,
  KYC_ACTION_GET_KYC_SCORING,
} from "actions/KYCAction";
import { KYTAction_RequestItem, KYT_ACTION_ESCALATE } from "actions/KYTAction";
import { getListAdmin } from "actions/Staff";
import clsx from "clsx";
import { Form, Formik } from "formik";
import React, { useRef } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { snackActions } from "util/snackbarUtils";
import { getFullName } from "util/string";
import * as Yup from "yup";
import styles from "./Escalate.module.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFormHelperText-root": {
      color: "#EA2134",
      paddingTop: toRem(4),
      fontSize: toRem(14),
    },
  },
  customInput: {
    "& .MuiInputBase-formControl": {
      marginBottom: 0,
      paddingTop: toRem(3),
    },
  },
  icon: {
    left: 0,
    color: "#7A7A7A",
  },
  menuPaper: {
    maxHeight: toRem(200),
  },
  input: {
    "&::placeholder": {
      fontSize: toRem(15),
      opacity: 0.7,
    },
  },
}));

const EscalateDialog = ({
  isOpen,
  onClose,
  data,
  onPressChange,
  status,
  id,
  screen,
}) => {
  const listAdmin = useSelector((state) => state.staff.listAllAdmin);
  const dispatch = useDispatch();
  const intl = useIntl();
  const { formatMessage } = intl;
  const className = useStyles();
  const [openSelect, setOpenSelect] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const formRef = useRef();

  React.useEffect(() => {
    dispatch(getListAdmin({ params: getKeyScreen(screen) }));
    // eslint-disable-next-line
  }, []);

  const getKeyScreen = (screen) => {
    switch (screen) {
      case "KYCScreeningResult":
      case "KYCRiskScoring":
        return "KYC";
      case "KYBScreeningResult":
      case "KYBRiskAssessment":
        return "KYB";
      case "KYTScreeningPage":
        return "KYT";
      case "DJKYCRiskScoring":
        return "DJKYC";
      case "DJKYCScreeningResult":
        return "DJKYC";
      default:
        return;
    }
  };

  const validationSchema = React.useMemo(() => {
    return Yup.object().shape({
      user: Yup.object().required(
        <IntlMessages id={"kyc.escalate.to.require"} />
      ),
      note: Yup.string()
        .required(<IntlMessages id="kyc.escalate.required" />)
        .max(1000, <IntlMessages id="kyc.notesIsOnly1000Characters" />),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitData = (values) => {
    if (/DJKYC/.test(id)) {
      let body = {
        kycId: id,
        note: { content: values?.note },
        user: values?.user?.id,
      };
      onSubmitEscalate(DJ_ACTION_ESCALATE_KYC(body), values);
      return;
    }

    if (/KYC/.test(id)) {
      let body = {
        kycId: id,
        note: { content: values?.note },
        user: values?.user?.id,
      };
      onSubmitEscalate(KYC_ACTION_ESCALATE(body), values);
      return;
    }

    if (/KYB/.test(id)) {
      let body = {
        kybId: id,
        note: { content: values?.note },
        user: values?.user?.id,
      };
      onSubmitEscalate(KYB_ACTION_ESCALATE(body), values);
      return;
    }

    if (/KYT/.test(id)) {
      let body = {
        kytId: id,
        note: { content: values?.note },
        user: values?.user?.id,
      };
      onSubmitEscalate(KYT_ACTION_ESCALATE(body), values);
      return;
    }
  };

  const onSubmitEscalate = (action, values) => {
    setLoading(true);
    dispatch(action)
      .then(() => {
        let message =
          formatMessage({ id: "kyc.escalate.to" }) +
          " " +
          getFullName(values?.user);
        snackActions.success(message);
        switch (screen) {
          case "KYCScreeningResult":
            dispatch(KYC_ACTION_GET_KYC_REQUEST(action.payload.kycId));
            break;
          case "KYBScreeningResult":
            dispatch(KYB_ACTION_GET_KYB_REQUEST(action.payload.kybId));
            break;
          case "KYTScreeningPage":
            dispatch(KYTAction_RequestItem(action.payload.kytId));
            break;
          case "KYCRiskScoring":
            dispatch(KYC_ACTION_GET_KYC_SCORING(action.payload.kycId));
            break;
          case "KYBRiskAssessment":
            dispatch(
              KYB_ACTION_RISK_ASSESSMENT_DETAILS({
                kybIds: action.payload.kybId,
              })
            );
            break;
          case "DJKYCRiskScoring":
            dispatch(DJ_ACTION_GET_KYC_SCORING(action.payload.kycId));
            break;
          case "DJKYCScreeningResult":
            dispatch(
              DJ_ACTION_GET_KYC_INDIVIDUAL_REQUEST(action.payload.kycId)
            );
            break;
          default:
            break;
        }
      })
      .catch(() => {
        snackActions.error(<IntlMessages id={"error"} />);
      })
      .finally(() => {
        setLoading(false);
        onClose();
      });
  };

  const onOpenSelectedUser = () => {
    setOpenSelect(!openSelect);
  };

  const onPressClose = () => {
    setOpenSelect(!openSelect);
  };

  return (
    <Formik
      innerRef={formRef}
      initialValues={{
        note: "",
        user: "",
      }}
      enableReinitialize={false}
      validationSchema={validationSchema}
      onSubmit={onSubmitData}
    >
      {({ values, dirty, isValid, setFieldValue, errors }) => {
        return (
          <Dialog
            open={isOpen}
            onClose={onClose}
            title={{
              text: (
                <Typography variant="titleForm">
                  <IntlMessages id={"kyc.screen.result.Escalate"} /> {id}
                </Typography>
              ),
            }}
            className={styles.dialogWrap}
            allowCloseOnTitle
            actionsCustom={
              <div className="justify-content-center d-flex">
                <Button onClick={onClose} variant="outlinedSecondary">
                  <IntlMessages id="appModule.requestForm.cancel" />
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  onClick={() => {
                    onSubmitData(values);
                  }}
                  disabled={!dirty || !isValid}
                  className={clsx("ml-3")}
                >
                  <IntlMessages id="kyc.escalate.proceed" />
                </Button>
              </div>
            }
          >
            <LoadingWrapper loading={loading}>
              <Form className={className.root}>
                <div>
                  <Grid container>
                    <Grid item xs={12} style={{ marginBottom: toRem(24) }}>
                      <DropdownList
                        name="user"
                        formik
                        label={<IntlMessages id="kyc.view.log.escalated.to" />}
                        getContentAnchorEl={null}
                        className={styles.assignee}
                        displayEmpty
                        helperText={errors.user}
                        renderValue={() => {
                          if (values?.user?.length === 0) {
                            return (
                              <Typography
                                variant="small1"
                                style={{ color: "#232323" }}
                              >
                                {intl.formatMessage({
                                  id: "appModule.Unassigned",
                                })}
                              </Typography>
                            );
                          }
                          return (
                            <div className="d-inline-flex align-items-center">
                              <UserAvatar
                                user={values.user}
                                size={32}
                                classes={{
                                  root: styles.AssigneeEditorInputUser,
                                }}
                              />
                              <div className={styles.textOverflow}>
                                <Typography variant="small1">
                                  {getFullName(values.user)}
                                </Typography>
                              </div>
                            </div>
                          );
                        }}
                      >
                        {listAdmin?.map((user) => {
                          return (
                            <MenuItem
                              key={user.id}
                              value={user}
                              component="div"
                              onClick={() => {
                                setOpenSelect(!openSelect);
                                setFieldValue("user", user);
                              }}
                            >
                              <div className="d-inline-flex align-items-center">
                                <UserAvatar
                                  user={user}
                                  size={32}
                                  classes={{
                                    root: styles.AssigneeEditorInputUser,
                                  }}
                                />
                                <div className={styles.textOverflow}>
                                  <Typography variant="small1">
                                    {getFullName(user)}
                                  </Typography>
                                </div>
                              </div>
                            </MenuItem>
                          );
                        })}
                      </DropdownList>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        className={clsx(
                          className.customInput,
                          styles.notes,
                          "mt-1"
                        )}
                        name="note"
                        label={<IntlMessages id={"appModule.label.notes"} />}
                        fullWidth
                        multiline
                        rows={6}
                        variant="outlined"
                        placeholder={formatMessage({
                          id: "kyc.escalate.placeholder",
                        })}
                        formik={true}
                        InputProps={{
                          classes: { input: className.input },
                        }}
                      />
                    </Grid>
                  </Grid>
                </div>
              </Form>
            </LoadingWrapper>
          </Dialog>
        );
      }}
    </Formik>
  );
};

export default React.memo(EscalateDialog);
