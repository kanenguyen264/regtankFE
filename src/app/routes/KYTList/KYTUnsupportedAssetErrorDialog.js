import React from "react";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import clsx from "clsx";
import imgErrorSrc from "assets/images/error.png";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import { makeStyles } from "@mui/styles";
import { FormattedHTMLMessage, useIntl } from "react-intl";

const useStyles = makeStyles((theme) => ({
  DialogTitle: {
    padding: toRem(22, 43),
  },
  DialogTextTitle: {
    fontSize: toRem(21),
    lineHeight: toRem(25),
    textAlign: "center",
  },
  DialogImage: {
    marginTop: toRem(6),
    display: "block",
    margin: "auto",
    width: toRem(72),
  },
  ContentWrap: {
    marginTop: toRem(27.8),
  },
  ContentText: {
    fontSize: toRem(14),
    lineHeight: "20px",
    color: "#606E7B",
    marginBottom: toRem(8),
  },
  BtnClose: {
    fontSize: toRem(17),
    lineHeight: toRem(22),
    textAlign: "center",
    padding: toRem(16),
    width: toRem(122),
  },
}));

const UnsupportedAssetErrorDialog = (props) => {
  const styles = useStyles();
  const { open, onClose } = props;

  return (
    <>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="xs"
        aria-labelledby="form-dialog-title"
        className={clsx(["Dialog"])}
        allowCloseOnTitle={true}
        title={{
          text: (
            <Typography variant="title">
              <IntlMessages id={"kyt.dialog.ongoingMonitoringKYT"} />
            </Typography>
          ),
        }}
        actionsCustom={
          <Button
            onClick={onClose}
            className={styles.BtnClose}
            variant="containedWhite"
          >
            <IntlMessages id={"dialog.confirm.button.close"} />
          </Button>
        }
      >
        <div className={clsx(styles.DialogContentWrap)}>
          <img
            className={clsx(styles.DialogImage)}
            src={imgErrorSrc}
            alt="error"
          />
          <div className={clsx(styles.ContentWrap)}>
            <Typography className={clsx(styles.ContentText)}>
              <strong>
                <IntlMessages id={"kyt.onGoingMonitoring"} />{" "}
              </strong>
              <IntlMessages
                id={"kyt.dialog.canNotBeAppliedForThisKYTScreening"}
              />
            </Typography>
            <Typography className={clsx(styles.ContentText)}>
              <FormattedHTMLMessage id={"kyt.dialog.textBTCSupportOM"} />
            </Typography>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default UnsupportedAssetErrorDialog;
