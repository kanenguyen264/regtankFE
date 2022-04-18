import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CloseableDialogTitle from "@protego/sdk/RegtankUI/v1/CloseableDialogTitle/CloseableDialogTitle";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import clsx from "clsx";
import React, { memo } from "react";
import styles from "./styles.module.scss";

const ConfirmDialog = (props) => {
  const {
    open,
    onClose,
    onSubmit,
    title,
    content,
    contentKey,
    submitName,
    loading,
    creditText,
  } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const onPressClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth={"xs"}
      aria-labelledby="customized-dialog-title"
    >
      <CloseableDialogTitle onClose={onPressClose}>
        {title ? title : <IntlMessages id={"dialog.confirm.title"} />}
      </CloseableDialogTitle>

      <LoadingWrapper loading={loading}>
        <>
          <DialogContent>
            <Grid container>
              <Grid item xs={12}>
                <div className={styles.textCenter}>
                  <span className={styles.textCenter}></span>
                  {content}
                  &nbsp;
                  <strong>{contentKey}</strong>
                </div>
                <div className={styles.textCenter}>
                  <strong>{creditText}</strong>
                </div>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className="justify-content-center">
            <Button
              className={clsx(styles.buttonSize, "ml-2")}
              variant="containedWhite"
              onClick={onPressClose}
            >
              <IntlMessages id="appModule.requestForm.cancel" />
            </Button>
            <Button
              className={clsx(styles.buttonSize)}
              variant="contained"
              color="primary"
              onClick={onSubmit}
            >
              {submitName}
            </Button>
          </DialogActions>
        </>
      </LoadingWrapper>
    </Dialog>
  );
};

export default memo(ConfirmDialog);
