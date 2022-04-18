import { Icon, Grid } from "@mui/material";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import clsx from "clsx";
import { TIMER_LOGOUT } from "constants/AppSettings";
import { useSnackbar } from "notistack";
import React, { memo } from "react";
import { useDispatch } from "react-redux";
import styles from "./styles.module.scss";
import { useHistory } from "react-router-dom";
import { FormattedHTMLMessage } from "react-intl";
import { LOG_OUT } from "constants/ActionTypes";
import { ErrorOutline } from "@mui/icons-material";

const ModalAccessDenied = (props) => {
  const { open } = props;
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [seconds, setSeconds] = React.useState(TIMER_LOGOUT);
  const [openForm, setOpenForm] = React.useState(false);
  const timer = React.useRef(null);
  const history = useHistory();

  React.useEffect(() => {
    if (open) {
      setOpenForm(open);
    }
  }, [open]);

  const onPressSubmit = async () => {
    setOpenForm(false);
    history.push("/signIn");
    dispatch({ type: LOG_OUT });
  };

  return (
    <Dialog
      open={openForm}
      aria-labelledby="customized-dialog-title"
      allowCloseOnTitle
      okProps={{
        text: <IntlMessages id="appModule.signIn" />,
        onClick: onPressSubmit,
      }}
      className={styles.DialogWrapper}
      title={{
        text: <IntlMessages id="appModule.change.permissions.title" />,
        icon: <Icon component={ErrorOutline} color="warning" />,
      }}
    >
      <Grid container alignItems={"center"}>
        <Grid item xs={12}>
          <div>
            <FormattedHTMLMessage id="appModule.change.permissions.content"></FormattedHTMLMessage>
          </div>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default memo(ModalAccessDenied);
