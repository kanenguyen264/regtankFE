import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  MenuItem,
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CloseableDialogTitle from "@protego/sdk/UI/CloseableDialogTitle/CloseableDialogTitle";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import LoadingWrapper from "@protego/sdk/UI/LoadingWrapper";
import Select from "@protego/sdk/UI/Select/Select";
import TextField from "@protego/sdk/UI/TextField/TextField";
import { toRem } from "@protego/sdk/utils/measurements";
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

import {
  DJ_ACTION_ESCALATE_KYC,
  DJ_ACTION_GET_KYC_SCORING,
  DJ_ACTION_GET_KYC_INDIVIDUAL_REQUEST
} from "actions/DJAction";
import { KYT_ACTION_ESCALATE, KYTAction_RequestItem } from "actions/KYTAction";
import clsx from "clsx";
import UserAvatar from "components/UserAvatar";
import { FETCH_ALL_ADMIN } from "constants/ActionTypes";
import { Form, Formik } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { snackActions } from "util/snackbarUtils";
import { getFullName } from "util/string";
import * as Yup from "yup";
import styles from "./Escalate.module.scss";
import { getListAdmin } from "actions/Staff";
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
      fontStyle: "#7A7A7A",
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

  const onSubmitData = (values, actions) => {
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
            dispatch(DJ_ACTION_GET_KYC_INDIVIDUAL_REQUEST(action.payload.kycId));
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
    <Dialog fullWidth maxWidth={"xs"} open={isOpen} onClose={onClose}>
      <CloseableDialogTitle onClose={onClose}>
        <IntlMessages id={"kyc.screen.result.Escalate"} /> {id}
      </CloseableDialogTitle>

      <Formik
        initialValues={{
          note: "",
          user: "",
        }}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={onSubmitData}
      >
        {({ values }) => {
          return (
            <LoadingWrapper loading={loading}>
              <Form className={className.root}>
                <DialogContent>
                  <Grid container>
                    <Grid item xs={12} className="mb-2">
                      <Grid container spacing={1}>
                        <Grid item xs={12} className="d-flex flex-column ">
                          <span className={"mb-1"}>
                            {openSelect ? (
                              <IntlMessages id={"kyc.escalate.select.user"} />
                            ) : (
                              <IntlMessages id={"kyc.view.log.escalated.to"} />
                            )}
                          </span>
                          <FormControl className={"mb-3"}>
                            <Select
                              name="user"
                              formik={true}
                              displayEmpty
                              onClose={() => onPressClose()}
                              open={openSelect}
                              onOpen={() => onOpenSelectedUser()}
                              className={styles.selectStyle}
                              MenuProps={{
                                classes: { paper: className.menuPaper },
                                anchorOrigin: {
                                  vertical: "bottom",
                                  horizontal: "left",
                                },
                                getContentAnchorEl: null,
                              }}
                            >
                              <MenuItem
                                key={"__null"}
                                value={""}
                                onClick={() => setOpenSelect(!openSelect)}
                              >
                                <div className="d-inline-flex align-items-center">
                                  <UserAvatar
                                    user={{
                                      firstName: "?",
                                      lastName: "",
                                      colorCode: "#E6E6E6",
                                    }}
                                    size={26}
                                    classes={{
                                      root: styles.AssigneeEditorInputUser,
                                    }}
                                    className={className.icon}
                                    noExtractLetter
                                    toolTipTitle={
                                      <IntlMessages id="appModule.Unassigned"></IntlMessages>
                                    }
                                  />
                                  <span>
                                    {intl.formatMessage({
                                      id: "appModule.Unassigned",
                                    })}
                                  </span>
                                </div>
                              </MenuItem>
                              {listAdmin?.map((user) => {
                                return (
                                  <MenuItem
                                    onClick={() => setOpenSelect(!openSelect)}
                                    key={user.id}
                                    value={user}
                                  >
                                    <div className="d-inline-flex align-items-center">
                                      <UserAvatar
                                        user={user}
                                        size={26}
                                        classes={{
                                          root: styles.AssigneeEditorInputUser,
                                        }}
                                      />
                                      <div className={styles.textOverflow}>
                                        {getFullName(user)}
                                      </div>
                                    </div>
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <span>
                        <IntlMessages id={"comment.button.note"} />
                      </span>
                      <TextField
                        className={clsx(className.customInput, "mt-1")}
                        name="note"
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
                </DialogContent>
                <DialogActions className="justify-content-center">
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    <IntlMessages id="kyc.escalate.proceed" />
                  </Button>
                  <Button
                    className={clsx("ml-3")}
                    onClick={onClose}
                    variant="contained"
                    fullWidth
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
  );
};

export default React.memo(EscalateDialog);
