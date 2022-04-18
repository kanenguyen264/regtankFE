import IntlMessages from "@protego/sdk/UI/IntlMessages";
import * as React from "react";
import {
  Typography,
  Button,
} from "@mui/material";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import { ReactComponent as Circle } from "assets/icons/circle.svg";
import styles from "./ConfirmDialog.module.scss";
const ConfirmDialog = (props) => {
  const {
    open,
    onClose,
    title,
    content,
    onSubmit
  } = props;
  const closeConfirm = () => {
    onClose(false);
  };
  const submitConfirm = () => {
    onSubmit(true);
  };
  return (
    <Dialog
      open={open}
      onClose={closeConfirm}
      closeAfterTransition
      maxWidth={"sm"}
      className={styles.confirmDialog}
      title={{
        text: (
          title ? title :
          <Typography variant="title">
            <IntlMessages id="confirm" />
          </Typography>
        ),
        icon: <Circle />,
      }}
      actionsCustom={
        <div className="d-flex justify-content-end">
          <Button variant="outlinedSecondary" onClick={closeConfirm}>
            <IntlMessages id="appModule.requestForm.cancel" />
          </Button>
          <Button
            className={"ml-3"}
            variant="contained"
            type="submit"
            onClick={submitConfirm}
          >
            <IntlMessages id="yes" />
          </Button>
        </div>
      }
    >
      {content}
    </Dialog>
  );
};

export default ConfirmDialog;
