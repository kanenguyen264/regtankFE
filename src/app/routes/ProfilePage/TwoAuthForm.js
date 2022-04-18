import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CloseableDialogTitle from "@protego/sdk/UI/CloseableDialogTitle/CloseableDialogTitle";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import TextField from "@protego/sdk/UI/TextField/TextField";
import clsx from "clsx";
import React from "react";
import { useIntl } from "react-intl";
import styles from "./ProfilePage.module.scss";

const useStyles = makeStyles((theme) => ({
  paper: {
    minWidth: "300px"
  },
  input: {
    backgroundColor: "white"
  },
  customInput: {
    "& .MuiInputBase-formControl": {
      margin: 0
    }
  }
}));

const TwoAuthForm = (props) => {
  const { open, twoAuth, onClose, onSubmit } = props;
  const intl = useIntl();
  const classes = useStyles();
  const { formatMessage } = intl;
  const theme = useTheme();
  const [password, setPassword] = React.useState("");
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const onPressClose = () => {
    onClose();
  };

  React.useEffect(() => {
    if (!open) {
      setPassword("");
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth={"xs"}
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
          <Grid item xs={12}>
            <Grid container direction={"column"}>
              <span>
                <IntlMessages id={"profile.form.password"} />
              </span>
              <TextField
                className={"mt-2"}
                classes={{
                  input: classes.input
                }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                placeholder={formatMessage({
                  id: "profile.form.input.password"
                })}
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className="justify-content-center">
        <Button
          className={clsx(styles.buttonSize)}
          variant="contained"
          color="primary"
          onClick={() => onSubmit(password)}
          disabled={!password}
        >
          <IntlMessages id="profile.form.button.continue" />
        </Button>
        <Button
          className={clsx(styles.buttonSize, "ml-3")}
          variant="contained"
          onClick={onPressClose}
        >
          <IntlMessages id="appModule.requestForm.cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TwoAuthForm;
