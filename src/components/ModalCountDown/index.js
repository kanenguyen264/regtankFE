import { Icon, Grid } from "@mui/material";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import { AuthActionLogout } from "@protego/sdk/actions/auth";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { logout } from "actions/Auth";
import clsx from "clsx";
import { TIMER_LOGOUT } from "constants/AppSettings";
import { useSnackbar } from "notistack";
import React, { memo } from "react";
import { useDispatch } from "react-redux";
import styles from "./styles.module.scss";
import { ErrorOutline } from "@mui/icons-material";

const ModalCountDown = (props) => {
  const { open } = props;
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [seconds, setSeconds] = React.useState(TIMER_LOGOUT);
  const [openForm, setOpenForm] = React.useState(false);
  const timer = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      setOpenForm(open);
    }
  }, [open]);

  React.useEffect(() => {
    if (openForm) {
      if (seconds === 0) {
        onPressLogout();
        return;
      }
      timer.current = setTimeout(() => {
        setSeconds((t) => t - 1);
      }, 1000);
    }
    return () => {
      clearTimeout(timer.current);
    };
    // eslint-disable-next-line
  }, [openForm, seconds]);

  const onPressClose = () => {
    clearTimeout(timer.current);
    setSeconds(TIMER_LOGOUT);
    setOpenForm(false);
  };

  const onPressLogout = async () => {
    setOpenForm(false);
    await dispatch(logout());
    await dispatch(AuthActionLogout());
    enqueueSnackbar(<IntlMessages id={"notification.session.expired"} />, {
      variant: "warning",
      persist: true,
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
      onClose: (event, reason, key) => {
        if (reason === "clickaway") {
          closeSnackbar(key);
        }
      },
    });
  };

  return (
    <Dialog
      open={openForm}
      aria-labelledby="customized-dialog-title"
      className={styles.countDownDialogWrapper}
      okProps={{
        text: (
          <span>
            <IntlMessages id="continue" /> {`(${seconds}s)`}
          </span>
        ),
        onClick: onPressClose,
        className: styles.okButton,
      }}
      cancelProps={{
        onClick: onPressLogout,
        className: styles.cancelButton,
      }}
      title={{
        text: <IntlMessages id="notification.timeout.title" />,
        icon: <Icon component={ErrorOutline} color="warning" />,
      }}
      allowCloseOnTitle
    >
      <Grid container>
        <Grid item xs={12}>
          <div className={styles.textCenter}>
            <IntlMessages id="notification.timeout.content" />
          </div>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default memo(ModalCountDown);
