import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Avatar,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Switch,
  Typography,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import BaseOutlinedInput from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";
import TextField from "@protego/sdk//RegtankUI/v1/TextField";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { getMFAVerify, hideMessage, updateTwoFactorAuth } from "actions/me";
import clsx from "clsx";
import LinearProgressColor from "components/LinearProgressColor";
import { STRENGTH_PASSWORD } from "constants/ThemeColors";
import { useFormik, useFormikContext } from "formik";
import React, { Fragment, useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "recompose";
import { checkRoleUser } from "util/aclRoles";
import { formatDate, LONG_DATE_TIME } from "util/date";
import withAuthenticationTheme from "util/hocs/withAuthenticationTheme";
import { snackActions } from "util/snackbarUtils";
import { getFirstString } from "util/string";
import { passwordValidation, PASSWORD_REGEX } from "validations/password";
import styles from "./ProfilePage.module.scss";
import TwoAuthForm from "./TwoAuthForm";
import TwoAuthFormMobile from "./TwoAuthFormMobile";

const useStyles = makeStyles((theme) => ({
  avatarRoot: {
    width: theme.typography.pxToRem(167),
    height: theme.typography.pxToRem(167),
    fontSize: theme.typography.pxToRem(71 * (167.0 / 177)),
    marginTop: theme.typography.pxToRem(23),
  },
  errorText: {
    color: STRENGTH_PASSWORD.medium,
    "& > ul": {
      paddingLeft: toRem(17),
    },
  },
}));

const helperTextStyles = makeStyles((theme) => ({
  error: {
    display: "none",
  },
}));

const ProfilePageCommon = compose(withAuthenticationTheme)(
  function ProfilePageCommon(props) {
    const dispatch = useDispatch();
    const {
      mfaVerify,
      errorMessage,
      mfaKey,
      otpAuthUri,
      verifyCodeStatus,
      me,
    } = useSelector((state) => state.me);
    const { customerMe } = useSelector((state) => state.settings);
    const { formatMessage } = useIntl();
    const helperTestClasses = helperTextStyles("");
    const formikContext = useFormikContext();
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [avatarColor, setAvatarColor] = useState("");
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [openForm, setOpenForm] = useState(false);
    const [openFormScan, setOpenFormScan] = useState(false);
    const [verifyCodeError, setVerifyCodeError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    var nameCode = getFirstString(me.firstName) + getFirstString(me.lastName);

    useEffect(() => {
      if (props.user.colorCode) {
        setAvatarColor(props.user.colorCode);
      }
    }, [props.user.colorCode]);

    const formik = useFormik({
      initialValues: props.user,
    });
    const classes = useStyles({ ...props, user: formik.values });

    const onClickAvatar = () => {
      setDisplayColorPicker(!displayColorPicker);
    };
    const onChangeColorPicker = (color) => {
      setAvatarColor(color.hex);
      props.parentCallback(color.hex);
    };
    const onHandleCloseColorPicker = () => {
      setDisplayColorPicker(false);
    };

    const onPressClose = () => {
      setOpenForm(false);
    };
    const onPressCloseScan = () => {
      setOpenFormScan(false);
      setVerifyCodeError(false);
    };
    const cover = {
      position: "fixed",
      top: "0px",
      right: "0px",
      bottom: "0px",
      left: "0px",
    };
    useEffect(() => {
      const validation = passwordValidation(
        formikContext.values.password,
        PASSWORD_REGEX
      );
      setPasswordStrength(validation);
    }, [formikContext.values.password]);

    const onChangeTwoAuth = () => {
      setOpenForm(true);
    };

    React.useEffect(() => {
      if (mfaVerify) {
        if (me?.enabledTwoFactorAuth) {
          dispatch(
            updateTwoFactorAuth({
              enabled_two_factor_auth: !me?.enabledTwoFactorAuth,
              userId: me?.id,
            })
          );
          return;
        } else {
          setOpenForm(false);
          setOpenFormScan(true);
          dispatch(hideMessage());
        }
      }
      if (errorMessage && !mfaVerify && openForm) {
        dispatch(hideMessage());
        snackActions.error(<IntlMessages id={errorMessage} />);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mfaVerify, errorMessage, dispatch]);

    React.useEffect(() => {
      if (verifyCodeStatus) {
        if (openForm || openFormScan) {
          setOpenForm(false);
          setOpenFormScan(false);
          setVerifyCodeError(false);
          dispatch(hideMessage());
          if (me?.enabledTwoFactorAuth) {
            snackActions.success(
              <IntlMessages id={"profile.form.enable.success"} />
            );
            return;
          }
          snackActions.success(
            <IntlMessages id={"profile.form.disable.success"} />
          );
        }
      }

      if (!verifyCodeStatus && errorMessage && openFormScan) {
        setVerifyCodeError(true);
      }
      dispatch(hideMessage());
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [verifyCodeStatus, errorMessage, dispatch]);

    const onPressSubmitForm = async (password) => {
      dispatch(getMFAVerify({ password: password }));
    };
    const handleClickShowPassword = () => {
      setShowPassword(!showPassword);
    };

    const onPressVerifyCode = (code) => {
      dispatch(
        updateTwoFactorAuth({
          mfa_key: mfaKey,
          verify_code: code,
          enabled_two_factor_auth: !me?.enabledTwoFactorAuth,
          userId: me?.id,
        })
      );
    };
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    const renderStrengthPassword = () => {
      let pos = 0;
      let color = STRENGTH_PASSWORD.default;
      if (passwordStrength.isValid) {
        pos = 3;
        color = STRENGTH_PASSWORD.strong;
      } else {
        switch (passwordStrength.value) {
          case "Strong":
            pos = 3;
            color = STRENGTH_PASSWORD.strong;
            break;
          case "Medium_2":
            pos = 2;
            color = STRENGTH_PASSWORD.medium;
            break;
          case "Medium_1":
            pos = 1;
            color = STRENGTH_PASSWORD.medium;
            break;
          default:
            break;
        }
      }
      return (
        <Grid container className={"mt-1"}>
          {[0, 1, 2, 3].map((item) => {
            if (item <= pos) {
              return (
                <Grid item xs={3} className={item === 0 ? "" : "pl-1"}>
                  <LinearProgressColor customColor={color} value={100} />
                </Grid>
              );
            }
            return (
              <Grid item xs={3} className={item === 0 ? "" : "pl-1"}>
                <LinearProgressColor value={100} />
              </Grid>
            );
          })}
        </Grid>
      );
    };

    return (
      <div className={clsx(styles.Section, styles.SectionCommon)}>
        <TwoAuthForm
          open={openForm}
          twoAuth={me?.enabledTwoFactorAuth}
          onClose={onPressClose}
          onSubmit={onPressSubmitForm}
        />
        <TwoAuthFormMobile
          open={openFormScan}
          twoAuth={me?.enabledTwoFactorAuth}
          mfaKey={mfaKey}
          otpAuthUri={otpAuthUri}
          onClose={onPressCloseScan}
          onSubmit={onPressVerifyCode}
          verifyCodeError={verifyCodeError}
        />
        <div>
          <div className={styles.profileHeader}>
            <div>
              <Avatar
                className={styles.avatar}
                onClick={() => onClickAvatar()}
                style={{ backgroundColor: avatarColor, cursor: "pointer" }}
              >
                <text className={styles.titleAvatar}>{nameCode}</text>
              </Avatar>
            </div>

            <div
              style={{
                zIndex: 2,
                position: "absolute",
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  paddingTop: "12.5rem",
                }}
              >
                {displayColorPicker && (
                  <div className="color-picker-cover">
                    <div
                      style={cover}
                      onClick={() => onHandleCloseColorPicker()}
                    />
                    <ChromePicker
                      color={avatarColor}
                      onChange={onChangeColorPicker}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.profileContent}>
            <div className={styles.profileTitle}>
              <Typography variant="titleForm">
                <IntlMessages id={"profile.title"} />
              </Typography>
            </div>
            <div className={styles.contentInfo}>
              <Grid container spacing={2} columnSpacing={1}>
                <Grid item xs={6}>
                  <TextField
                    label={
                      <>
                        {formatMessage({
                          id: "form.firstName",
                        })}
                        <span className={styles.required}> *</span>
                      </>
                    }
                    fullWidth
                    name={"firstName"}
                    formik
                    placeholder={"Michael"}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    formik
                    fullWidth
                    name={"lastName"}
                    label={formatMessage({ id: "form.lastName" })}
                    placeholder={"Scott"}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label={
                      <>
                        {formatMessage({
                          id: "appModule.email",
                        })}
                        <span className={styles.required}> *</span>
                      </>
                    }
                    fullWidth
                    name={"email"}
                    type={"email"}
                    formik
                    placeholder={formatMessage({ id: "form.email" })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    name={"phone"}
                    formik
                    label={formatMessage({ id: "phone-number" })}
                    placeholder={formatMessage({ id: "form.phoneNumber" })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl
                    error={formikContext.errors.password}
                    className={styles.textField}
                    component="fieldset"
                  >
                    <BaseOutlinedInput
                      InputLabelProps={{ shrink: true }}
                      label={formatMessage({ id: "appModule.password" })}
                      name={"password"}
                      type={showPassword ? "text" : "password"}
                      fullWidth
                      onChange={(event) => {
                        formikContext.setFieldValue(
                          "password",
                          event.target.value
                        );
                      }}
                      placeholder={formatMessage({ id: "profile.password" })}
                      togglePassword
                      variant="standard"
                      shrink={"true"}
                      autoComplete="new-password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      FormHelperTextProps={{ classes: helperTestClasses }}
                      {...(formikContext.errors.password && {
                        error: true,
                      })}
                    />
                    {formikContext.values.password && renderStrengthPassword()}
                    {formikContext.values.password &&
                      formikContext.errors.password && (
                        <Fragment>
                          <Grid container className={"mt-1"}>
                            <Grid item xs={12}>
                              <Typography
                                variant="small1"
                                className={classes.errorText}
                              >
                                <IntlMessages id="appModule.form.error.passwordNotStrong"></IntlMessages>
                              </Typography>
                            </Grid>
                            <Grid item xs={12} className={classes.errorText}>
                              <Typography variant="small1">
                                <ul className={"mb-0"}>
                                  {!passwordStrength.contains?.includes(
                                    "uppercase"
                                  ) && (
                                    <li>
                                      <IntlMessages id="appModule.form.error.passwordAZ"></IntlMessages>
                                    </li>
                                  )}
                                  {!passwordStrength.contains?.includes(
                                    "number"
                                  ) && (
                                    <li>
                                      <IntlMessages id="appModule.form.error.passwordNumber09"></IntlMessages>
                                    </li>
                                  )}
                                  {!passwordStrength.contains?.includes(
                                    "length"
                                  ) && (
                                    <li>
                                      <IntlMessages id="appModule.form.error.password8Char"></IntlMessages>
                                    </li>
                                  )}
                                </ul>
                              </Typography>
                            </Grid>
                          </Grid>
                        </Fragment>
                      )}
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <div className={styles.disableDiv}>
                    <TextField
                      fullWidth
                      name={"role"}
                      disabled={true}
                      placeholder={checkRoleUser(me?.roles)?.displayName}
                      label={formatMessage({ id: "appModule.role" })}
                    />
                  </div>
                </Grid>
                {customerMe.allowedToTurnOff &&
                  customerMe.enabledTwoFactorAuth && (
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={
                              me?.enabledTwoFactorAuth
                                ? me?.enabledTwoFactorAuth
                                : false
                            }
                            onChange={onChangeTwoAuth}
                          />
                        }
                        label={
                          <Typography>
                            <IntlMessages id={"profile.two.auth"} />
                          </Typography>
                        }
                      />
                    </Grid>
                  )}

                <Grid item xs={12}>
                  <TextField
                    label={formatMessage({ id: "note" })}
                    fullWidth
                    name={"bio"}
                    multiline
                    rows={4}
                    formik
                    variant={"outlined"}
                    placeholder={formatMessage({ id: "write.a.note" })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className="d-flex align-items-end justify-content-between">
                    <Typography
                      variant={"small2"}
                      className={styles.lastEditText}
                    >
                      <IntlMessages id="company.dialog.detail.lasteditby" />
                      {` ${me?.lastModifiedBy?.firstName}
                    ${me?.lastModifiedBy?.lastName} `}
                      {formatDate(me?.updatedAt, LONG_DATE_TIME)}
                    </Typography>
                    <div>
                      <Button
                        variant={"outlinedSecondary"}
                        onClick={() => props.cancelFrom()}
                      >
                        <IntlMessages id="cancel"></IntlMessages>
                      </Button>
                      <Button
                        variant={"contained"}
                        type={"submit"}
                        className={"ml-3"}
                      >
                        <IntlMessages id="save"></IntlMessages>
                      </Button>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ProfilePageCommon;
