import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CloseableDialogTitle from "@protego/sdk/UI/CloseableDialogTitle/CloseableDialogTitle";
import Dropdown from "@protego/sdk/UI/Dropdown/Dropdown";
import DropdownItem from "@protego/sdk/UI/DropdownItem/index";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import TextField from "@protego/sdk/UI/TextField/TextField";
import { toRem } from "@protego/sdk/utils/measurements";
import clsx from "clsx";
import { APPROVED, REJECTED } from "constants/ViewLogType";
import { Form, Formik } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import * as Yup from "yup";
import styles from "./ChangeStatus.module.scss";
import LoadingWrapper from "@protego/sdk/UI/LoadingWrapper/LoadingWrapper";

const useStyles = makeStyles((theme) => ({
  customInput: {
    "& .MuiInputBase-formControl": {
      marginBottom: 0,
      paddingTop: toRem(3),
    },
    "& .MuiFormHelperText-root": {
      color: "#EA2134",
      paddingTop: toRem(4),
      fontSize: toRem(14),
    },
  },
  icon: {
    left: 0,
    color: "red",
    fill: "white",
  },
  input: {
    "&::placeholder": {
      fontStyle: "#7A7A7A",
      fontSize: toRem(15),
      opacity: 0.7,
    },
  },
}));
const ChangeStatusDialog = ({
  isOpen,
  onClose,
  data,
  onPressChange,
  status,
  fixedPosition,
  loading = false,
}) => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const className = useStyles();
  const [typeSubmit, setTypeSubmit] = React.useState(true);
  const validationSchema = React.useMemo(() => {
    return Yup.object().shape({
      note: Yup.string()
        .required(<IntlMessages id="kyc.change.note.required" />)
        .max(1000, <IntlMessages id="kyc.notesIsOnly1000Characters" />),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onSubmitData = async (values, actions) => {
    if (typeSubmit) {
      await onPressChange(values.status, values.note);
      setTypeSubmit(false);
    }
  };

  return (
    <LoadingWrapper loading={loading} size={"3rem"}>
      <Dialog
        fullWidth
        maxWidth={"xs"}
        open={isOpen}
        onClose={onClose}
        classes={{ root: styles.DialogWrap }}
      >
        <CloseableDialogTitle onClose={onClose}>
          <IntlMessages id={"kyc.change.approval.status"} />
        </CloseableDialogTitle>
        <Formik
          initialValues={{
            status: status === APPROVED ? APPROVED : REJECTED,
            note: "",
          }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={onSubmitData}
        >
          {({ values, setFieldValue }) => {
            return (
              <Form>
                <DialogContent>
                  <Grid container>
                    <Grid item xs={12} className="mb-4">
                      <Grid container>
                        <Grid item xs={12} className="d-flex flex-column ">
                          <span className={styles.label}>
                            <IntlMessages id={"kyc.Status"}></IntlMessages>
                          </span>
                          <div>
                            <Dropdown
                              disabled={fixedPosition}
                              name="status"
                              label={
                                values.status === APPROVED
                                  ? intl.formatMessage({
                                      id: "kyc.change.note.approved",
                                    })
                                  : intl.formatMessage({
                                      id: "kyc.change.note.rejected",
                                    })
                              }
                              className={clsx(
                                "justify-content-between d-flex",
                                styles.dropdownButton
                              )}
                            >
                              <div
                                style={{
                                  pointerEvents:
                                    status === APPROVED ? "none" : "visible",
                                }}
                              >
                                <DropdownItem
                                  onClick={() => {
                                    setFieldValue("status", APPROVED);
                                  }}
                                >
                                  <IntlMessages
                                    id={"kyc.change.note.approved"}
                                  />
                                </DropdownItem>
                              </div>
                              <div
                                style={{
                                  pointerEvents:
                                    status === REJECTED ? "none" : "visible",
                                }}
                              >
                                <DropdownItem
                                  onClick={() => {
                                    setFieldValue("status", REJECTED);
                                  }}
                                >
                                  <IntlMessages
                                    id={"kyc.change.note.rejected"}
                                  />
                                </DropdownItem>
                              </div>
                            </Dropdown>
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} className="d-flex flex-column">
                      <span className={styles.label}>
                        <IntlMessages id={"comment.button.note"} />
                      </span>
                      <div>
                        <TextField
                          className={className.customInput}
                          name="note"
                          fullWidth
                          multiline
                          rows={5}
                          variant="outlined"
                          InputProps={{
                            classes: { input: className.input },
                          }}
                          placeholder={formatMessage({
                            id: "kyc.change.approval.reason",
                          })}
                          formik={true}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions className="justify-content-center">
                  <Button
                    disabled={
                      values.status === status && !fixedPosition && true
                    }
                    fullWidth
                    className={clsx(styles.btn)}
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    <IntlMessages id="save" />
                  </Button>
                  <Button
                    className={clsx(styles.btn, "ml-3")}
                    onClick={onClose}
                    variant="contained"
                    fullWidth
                  >
                    <IntlMessages id="appModule.requestForm.cancel" />
                  </Button>
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      </Dialog>
    </LoadingWrapper>
  );
};

export default ChangeStatusDialog;
