import { Grid, Typography } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import Dropdown from "@protego/sdk/RegtankUI/v1/Dropdown/Dropdown";
import DropdownItem from "@protego/sdk/RegtankUI/v1/DropdownItem/index";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import clsx from "clsx";
import { APPROVED, REJECTED } from "constants/ViewLogType";
import { Form, Formik } from "formik";
import React, { useRef } from "react";
import { useIntl } from "react-intl";
import * as Yup from "yup";
import styles from "./ChangeStatus.module.scss";

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
  const [typeSubmit, setTypeSubmit] = React.useState(true);
  const formRef = useRef(null);

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
    <Formik
      initialValues={{
        status: status === APPROVED ? APPROVED : REJECTED,
        note: "",
      }}
      enableReinitialize={true}
      validationSchema={validationSchema}
      innerRef={formRef}
    >
      {({ values, setFieldValue }) => {
        return (
          <Dialog
            open={isOpen}
            onClose={onClose}
            title={{
              text: (
                <Typography variant="titleForm">
                  <IntlMessages id="kyc.change.approval.status" />
                </Typography>
              ),
            }}
            allowCloseOnTitle
            actionsCustom={
              <div className="d-flex justify-content-end">
                <Button
                  className={clsx(styles.btn, "mr-3")}
                  onClick={onClose}
                  variant="outlinedSecondary"
                >
                  <IntlMessages id="appModule.requestForm.cancel" />
                </Button>
                <Button
                  disabled={
                    formRef?.current?.values.status === status &&
                    !fixedPosition &&
                    true
                  }
                  className={clsx(styles.btn)}
                  variant="contained"
                  type="submit"
                  onClick={() => {
                    onSubmitData(formRef?.current?.values);
                  }}
                >
                  <IntlMessages id="save" />
                </Button>
              </div>
            }
          >
            <LoadingWrapper loading={loading} size={"3rem"}>
              <Form>
                <div className={styles.dialog}>
                  <Grid container>
                    <Grid item xs={12} className="mb-4">
                      <Grid container>
                        <Grid item xs={12} className="d-flex flex-column ">
                          <Typography variant="smallDefault">
                            <IntlMessages id={"kyc.Status"}></IntlMessages>
                          </Typography>
                          <div>
                            <Dropdown
                              disabled={fixedPosition}
                              variant={"outlinedSecondary"}
                              name="status"
                              label={
                                <Typography variant="labelFieldForm">
                                  {values.status === APPROVED
                                    ? intl.formatMessage({
                                        id: "kyc.change.note.approved",
                                      })
                                    : intl.formatMessage({
                                        id: "kyc.change.note.rejected",
                                      })}
                                </Typography>
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
                                  <Typography variant="small1">
                                    <IntlMessages
                                      id={"kyc.change.note.approved"}
                                    />
                                  </Typography>
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
                                  <Typography variant="small1">
                                    <IntlMessages
                                      id={"kyc.change.note.rejected"}
                                    />
                                  </Typography>
                                </DropdownItem>
                              </div>
                            </Dropdown>
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} className="d-flex flex-column">
                      <Typography variant="smallDefault">
                        <IntlMessages id={"comment.button.note"} />
                      </Typography>
                      <TextField
                        as={"textarea"}
                        className={styles.textArea}
                        name="note"
                        fullWidth
                        multiline
                        rows={5}
                        variant="outlined"
                        placeholder={formatMessage({
                          id: "kyc.change.approval.reason",
                        })}
                        formik={true}
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

export default ChangeStatusDialog;
