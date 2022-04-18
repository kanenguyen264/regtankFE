import { makeStyles } from "@mui/styles";
import {
  Grid,
  Typography,
} from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import SelectAutoComplete from "@protego/sdk/RegtankUI/v1/SelectAutoComplete";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import clsx from "clsx";
import { Field, Form, Formik } from "formik";
import React, { useState, useMemo } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import * as Yup from "yup";
import { SupportActionSubmit } from "actions/support";
import styles from "./SupportPage.module.scss";
import TYSupportPage from "./TYSupport";
import { PRIORITY } from "constants/priority";
import UploadFile from "components/uploadFile";
import { map } from "lodash";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
const useStyles = makeStyles((theme) => ({
  textRoot: {
    marginBottom: theme.typography.pxToRem(0),
    "& .MuiFormHelperText-root": {
      top: "calc(100% - 1.247rem)",
    },
  },
  textMargin: {
    marginTop: "1.176rem",
  },
  button: {
    paddingLeft: theme.typography.pxToRem(40),
    paddingRight: theme.typography.pxToRem(40),
    marginLeft: theme.typography.pxToRem(15),
    minWidth: `${theme.typography.pxToRem(100)} !important`,
  },
  titleMargin: {
    marginBottom: "1.765rem",
  },
}));

const supportTypeFactory = (label) => ({
  label,
  value: label.toUpperCase().replace(/\s/g, "-"),
});

const SupportPage = function SupportPage({ match }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const intl = useIntl();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileUpload, setFileUpload] = useState([]);
  const supportTypes = useMemo(() => {
    return [
      intl.formatMessage({ id: "bug-report" }),
      intl.formatMessage({ id: "account-related" }),
      intl.formatMessage({ id: "features-suggestion" }),
      intl.formatMessage({ id: "others" }),
    ].map(supportTypeFactory);
  }, [intl]),
    validationSchema = useMemo(() => {
      return Yup.object().shape({
        message: Yup.string().required(
          <IntlMessages id="support.messages.messageTypeRequired" />
        ),
        subject: Yup.string().required(
          <IntlMessages id="support.messages.subjectRequired" />
        ),
        supportType: Yup.string().test(
          "check-object-empty",
          "You can't leave BASEL blank.",
          function checkSupportType(_supportType) {
            if (_supportType === " ") {
              return this.createError({
                message: (
                  <IntlMessages id="support.messages.supportTypeRequired" />
                ),
              });
            }
            return true;
          }
        ),
        priorityType: Yup.string().test(
          "check-object-empty",
          "You can't leave BASEL blank.",
          function checkPriority(_priorityType) {
            if (_priorityType === " ") {
              return this.createError({
                message: (
                  <IntlMessages id="support.messages.priorityTypeRequired" />
                ),
              });
            }
            return true;
          }
        ),
      });
      // eslint-disable-next-line
    }, [intl]);

  const setFileUploadFunction = (value) => {
    setFileUpload(value);
  };

  return (
    <div className={styles.SupportPage}>
      <PageHeading
        className={styles.PageHeading}
        title={<IntlMessages id="support" />}
        customUrlResolver={(_index, sub) => {
          switch (sub) {
            case "support":
              return [<IntlMessages id={"support"} />, null, false];
            default:
              break;
          }
        }}
      />
      <SwitchTransition>
        <CSSTransition
          key={success ? "yes" : "no"}
          addEndListener={(node, done) =>
            node.addEventListener("transitionend", done, false)
          }
          classNames="fade"
        >
          {!success ? (
            <LoadingWrapper loading={loading}>
              <JRCard
                header={
                  <Typography className={styles.titleForm} variant="titleForm">
                    <IntlMessages id="support-form" />
                  </Typography>
                }
                disableShadow
                headerLine
              >
                <Formik
                  initialValues={{
                    supportType: " ",
                    phone: "",
                    subject: "",
                    message: "",
                    priorityType: " ",
                    files: fileUpload,
                  }}
                  validationSchema={validationSchema}
                  onSubmit={async (values) => {
                    setLoading(true);
                    try {
                      values.files = fileUpload;
                      await dispatch(SupportActionSubmit(values));
                      setLoading(false);
                      setSuccess(true);
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  {({ values, errors, submitForm, touched }) => {
                    return (
                      <Form className={styles.contentContainer}>
                        <Grid container>
                          <Grid item xs={12}>
                            <TextField
                              name={"subject"}
                              classes={{ root: classes.textRoot }}
                              fullWidth
                              placeholder={intl.formatMessage({ id: "supportForm.placeholder.subject" })}
                              formik
                              label={intl.formatMessage({
                                id: "subject",
                              })}
                              InputLabelProps={{ required: true, shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              name={"phone"}
                              type="tel"
                              classes={{ root: classes.textRoot }}
                              fullWidth
                              placeholder={intl.formatMessage({
                                id: "supportForm.placeholder.phoneNumber",
                              })}
                              label={intl.formatMessage({
                                id: "supportForm.phoneNumber",
                              })}
                              formik
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Field
                              type="select"
                              name={"priorityType"}
                              placeholder={intl.formatMessage({
                                id: "supportForm.placeholder.priority",
                              })}
                              label={intl.formatMessage({
                                id: "supportForm.priority",
                              })}
                              labelRequired={true}
                              component={SelectAutoComplete}
                              options={map(PRIORITY, function square(n) {
                                return n.label;
                              })}
                              getOptionLabel={(option) => {
                                return option.trim()
                                  ? intl.formatMessage({
                                    id: option
                                  })
                                  : "";
                              }}
                              disableClearable
                              clearOnBlur
                              formik
                              disableSearch
                              textFieldProps={{ error: touched?.priorityType && errors?.priorityType ? true : false, }}
                            />
                            {(errors?.priorityType && touched?.priorityType) && (
                              <Typography component={"div"} color={ThemeColors.errorBorder} variant="small1" style={{ marginTop: 6 }}>
                                {errors?.priorityType}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12}>
                            <Field
                              type="select"
                              name={"supportType"}
                              placeholder={intl.formatMessage({
                                id: "supportForm.placeholder.suportType",
                              })}
                              label={intl.formatMessage({
                                id: "select-support-type",
                              })}
                              labelRequired={true}
                              component={SelectAutoComplete}
                              options={map(supportTypes, function square(n) {
                                return n.label;
                              })}
                              getOptionLabel={(option) => {
                                return option.trim() ? option : "";
                              }}
                              disableClearable
                              clearOnBlur
                              formik
                              disableSearch
                              textFieldProps={{ error: touched?.supportType && errors?.supportType ? true : false, }}
                            />
                            {(errors?.supportType && touched?.supportType) && (
                              <Typography component={"div"} color={ThemeColors.errorBorder} variant="small1" style={{ marginTop: 6 }}>
                                {errors?.supportType}
                              </Typography>
                            )}
                          </Grid>
                          <Grid item xs={12} className="mb-custom">
                            <TextField
                              classes={{
                                root: clsx(classes.textRoot),
                              }}
                              size="small"
                              name={"message"}
                              multiline
                              rows={10}
                              placeholder={intl.formatMessage({ id: "supportForm.placeholder.message" })}
                              label={intl.formatMessage({
                                id: "message",
                              })}
                              fullWidth
                              variant="outlined"
                              formik
                              InputLabelProps={{ required: true, shrink: true }}
                            />
                          </Grid>
                          <Grid container item xs={12}>
                            <Grid xs={8}>
                              <UploadFile
                                fileUploadCallback={setFileUploadFunction}
                                accept=".jpg, .jpeg, .png, .pdf, .csv, .docx, .xlxs"
                              />
                            </Grid>
                            <Grid xs={4} className={styles.buttonGroup}>
                              <Button
                                variant={"containedWhite"}
                                type={"reset"}
                                disabled={loading}
                                className={classes.button}
                              >
                                <IntlMessages id="appModule.reset" />
                              </Button>
                              <Button
                                variant={"contained"}
                                type={"button"}
                                onClick={submitForm}
                                disabled={loading}
                                className={clsx(classes.button, "ml-3")}
                              >
                                <IntlMessages id="send" />
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Form>
                    );
                  }}

                </Formik>
              </JRCard>
            </LoadingWrapper>
          ) : (
            <TYSupportPage />
          )}
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};

export default SupportPage;