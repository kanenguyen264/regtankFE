import React from "react";
import { Icon } from "@mui/material";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog/Dialog";
import { ErrorOutline } from "@mui/icons-material";
import PropTypes from "prop-types";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { FormattedHTMLMessage } from "react-intl";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: { "& .MuiPaper-root": { width: toRem(488) }, "& .MuiDialogContent-root": {minWidth: 'auto'}},
});
const CaseHasNotBeenSaveDlg = ({ open = false, onClickCancel, onClickOk }) => {
  const classes = useStyles();
  return (
    <Dialog
      open={open}
      onClose={onClickCancel}
      title={{
        text: (
          <IntlMessages id="caseManagement.alert.caseNameHasNotBeenSaved.title" />
        ),
        icon: <Icon component={ErrorOutline} color="primary" />,
      }}
      allowCloseOnTitle={true}
      okProps={{
        text: "Continue",
        onClick: onClickOk,
      }}
      cancelProps={{
        text: "cancel",
        onClick: onClickCancel,
        style: {
          border: "1px solid #E4E4E4",
        },
      }}
      className={classes.root}
    >
      <div>
        <FormattedHTMLMessage id="caseManagement.alert.caseNameHasNotBeenSaved.content" />
      </div>
    </Dialog>
  );
};

CaseHasNotBeenSaveDlg.propTypes = {
  open: PropTypes.bool.isRequired,
  onClickCancel: PropTypes.func.isRequired,
  onClickOk: PropTypes.func.isRequired,
};

export default CaseHasNotBeenSaveDlg;
