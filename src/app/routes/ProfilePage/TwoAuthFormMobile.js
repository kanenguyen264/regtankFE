import {
  Button,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Link,
  Typography
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CloseableDialogTitle from "@protego/sdk/UI/CloseableDialogTitle/CloseableDialogTitle";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import TextField from "@protego/sdk/UI/TextField/TextField";
import { toRem } from "@protego/sdk/utils/measurements";
import IcAuthy from "assets/icons/authy.png";
import { ReactComponent as IcAuthGoogle } from "assets/icons/IcAuthGoogle.svg";
import { ReactComponent as IcAuthLock } from "assets/icons/IcAuthLock.svg";
import clsx from "clsx";
import QRCode from "qrcode.react";
import React from "react";
import styles from "./ProfilePage.module.scss";
const URL_ANDROID =
  "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=vi&gl=US";
const URL_IOS = "https://apps.apple.com/app/google-authenticator/id388497605";

const useStyles = makeStyles((theme) => ({
  btnVerify: {
    backgroundColor: "#0080FF",
    color: "white",
    padding: toRem(10),
    "&:focus, &:hover, &$active": {
      backgroundColor: "#0080FF"
    }
  }
}));
const inputStyle = makeStyles((theme) => ({
  root: {
    backgroundColor: "white"
  },
  input: {
    backgroundColor: "white"
  }
}));

const TwoAuthFormMobile = (props) => {
  const {
    open,
    twoAuth,
    onClose,
    onSubmit,
    mfaKey,
    otpAuthUri,
    verifyCodeError
  } = props;
  const classStyle = useStyles();
  const classInput = inputStyle();
  const theme = useTheme();
  const [password, setPassword] = React.useState("");
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  React.useEffect(() => {
    if (!open) {
      setPassword("");
    }
  }, [open]);

  const onPressClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth={"sm"}
      aria-labelledby="customized-dialog-title"
    >
      <CloseableDialogTitle onClose={onPressClose}>
        {twoAuth ? (
          <IntlMessages id={"profile.form.disable"} />
        ) : (
          <IntlMessages id={"profile.form.enable"} />
        )}
      </CloseableDialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={12} className={"mt-4"}>
            <Grid container>
              <Grid item xs={4}>
                <div className={styles.fCenter}>
                  <IcAuthGoogle />
                  <img
                    alt=""
                    src={IcAuthy}
                    className={clsx(styles.icAuthy, "ml-1")}
                  />
                </div>
              </Grid>
              <Grid item xs={8}>
                <span>
                  <Typography>
                    <IntlMessages id={"profile.2af.mobile.download"} />
                    <span>
                      {" "}
                      <Link
                        className={styles.Link}
                        href={URL_ANDROID}
                        target="_blank"
                      >
                        <IntlMessages
                          id={"profile.2af.mobile.google.android"}
                        />{" "}
                      </Link>
                      <Link
                        className={styles.Link}
                        href={URL_IOS}
                        target="_blank"
                      >
                        <IntlMessages id={"profile.2af.mobile.google.ios"} />{" "}
                      </Link>
                    </span>{" "}
                    <IntlMessages id={"profile.2af.mobile.or"} />
                    <span className={styles.Link}>
                      {" "}
                      <Link
                        href={"https://authy.com/download/"}
                        target="_blank"
                        className={styles.Link}
                      >
                        <IntlMessages id={"profile.2af.mobile.auThy"} />
                      </Link>
                    </span>
                  </Typography>
                </span>
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={12} item className={"mt-4 mb-4"}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={4}>
                {otpAuthUri && (
                  <div className={styles.fCenter}>
                    <QRCode
                      className={styles.qrCodeBorder}
                      value={otpAuthUri}
                      size={130}
                    />
                  </div>
                )}
              </Grid>
              <Grid item xs={8}>
                <Typography>
                  <IntlMessages id={"profile.2af.mobile.scan"} />
                </Typography>
                <Typography className={"mt-4"}>
                  <IntlMessages id={"profile.2af.mobile.key"} />
                </Typography>
                <Typography className={styles.textCode}>{mfaKey}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={12} item className={"mt-4 mb-4"}>
            <Divider />
          </Grid>
          <Grid item xs={12} className={"mb-4"}>
            <Grid container>
              <Grid item xs={4}>
                <div className={styles.fCenter}>
                  <IcAuthLock />
                </div>
              </Grid>
              <Grid item xs={8}>
                <Typography>
                  <IntlMessages id={"profile.enter.digit.code"} />
                </Typography>
                <Grid item>
                  <Grid
                    container
                    alignItems={"center"}
                    justify={"center"}
                    spacing={2}
                  >
                    <Grid item xs={8} className={"mt-2"}>
                      <TextField
                        name="profile.form.password"
                        value={password}
                        style={{ marginBottom: 0 }}
                        fullWidth
                        onChange={(e) => setPassword(e.target.value)}
                        variant="outlined"
                        placeholder={"000 000"}
                        classes={{
                          input: classInput.input
                        }}
                        error={verifyCodeError}
                        helperText={
                          verifyCodeError && (
                            <IntlMessages
                              id={"profile.2af.mobile.verify.failed"}
                            />
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={"mt-2"}>
                      <Button
                        variant="contained"
                        fullWidth
                        size={"small"}
                        className={classStyle.btnVerify}
                        onClick={() => onSubmit(password)}
                        disabled={!password}
                      >
                        <IntlMessages id="profile.2af.mobile.verify" />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default TwoAuthFormMobile;
