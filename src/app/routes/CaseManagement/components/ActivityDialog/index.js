import CloseIcon from "@mui/icons-material/Close";
import { SvgIcon } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CustomScrollbar from "@protego/sdk/RegtankUI/v1/Scrollbar";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { ReactComponent as AddProfileIcon } from "assets/icons/IcoAddProfile.svg";
import { ReactComponent as ApproveIcon } from "assets/icons/IcoApprove.svg";
import { ReactComponent as AssignIcon } from "assets/icons/IcoAssign.svg";
import { ReactComponent as EditInformationIcon } from "assets/icons/IcoEditInfo.svg";
import { ReactComponent as OMIcon } from "assets/icons/IcoOMSettings.svg";
import { ReactComponent as RejectIcon } from "assets/icons/IcoReject.svg";
import PropTypes from "prop-types";
import React from "react";
import styles from "./style.module.scss";
const types = {
  editField: {
    action: <IntlMessages id="caseManagement.activityLog.type.edited"/>,
    icon: <SvgIcon component={EditInformationIcon} />,
  },
  approve: {
    action: <IntlMessages id="caseManagement.activityLog.type.approved"/>,
    icon: <SvgIcon viewBox={"0 0 32 32"} component={ApproveIcon} />,
  },
  reject: {
    action: <IntlMessages id="caseManagement.activityLog.type.rejected"/>,
    icon: <SvgIcon viewBox={"0 0 32 32"} component={RejectIcon} />,
  },
  om: {
    action: <IntlMessages id="caseManagement.activityLog.type.changed"/>,
    icon: <SvgIcon viewBox={"0 0 24 24"} component={OMIcon} />,
  },
  assign: {
    action: <IntlMessages id="caseManagement.activityLog.type.assigned"/>,
    icon: <SvgIcon viewBox={"0 0 24 24"} component={AssignIcon} />,
  },
  updateProfile: {
    action: <IntlMessages id="caseManagement.activityLog.type.added"/>,
    icon: <SvgIcon viewBox={"0 0 22 22"} component={AddProfileIcon} />,
  },
  default: {
    action: <IntlMessages id="caseManagement.activityLog.type.edited"/>,
    icon: <SvgIcon viewBox={"0 0 20 20"} component={EditInformationIcon} />,
  },
};

const CustomDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const Item = ({ data }) => {
  return (
    <div className={styles.logItem}>
      <div className={styles.logItem_header}>
        <Typography className={styles.logItem_name}><IntlMessages id="caseManagement.activityLog" /></Typography>
        <Typography className={styles.logItem_modifiedBy}>
          {types[data?.type || "default"].action}
        </Typography>
        <Typography className={styles.logItem_datetime}><IntlMessages id="caseManagement.dateNdTime" /></Typography>
      </div>
      <div className={styles.logItem_body}>
        <div className={styles.logItem_name}>
          <Typography>{types[data?.type || "default"].icon}</Typography>
          {data.name}
        </div>
        <div className={styles.logItem_modifiedBy}>{data.modifiedBy}</div>
        <div className={styles.logItem_DateTime}>{data.date}</div>
      </div>
    </div>
  );
};

const ActivityDialog = ({ open, onClose = null, data = [] }) => {
  return (
    <Dialog
      className={styles.activityDlg}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <CustomDialogTitle
        className={styles.activityDlg_title}
        id="customized-dialog-title"
        onClose={() => {
          onClose && onClose();
        }}
      >
        <Typography><IntlMessages id="caseManagement.activityLog" /></Typography>
      </CustomDialogTitle>

      <DialogContent className={styles.activityDlg_content}>
        {data && data.length ? (
          <div>
            <CustomScrollbar autoHeightMax={toRem(500)} classes={{vCustomScrollBarTrack: styles.vScrollbar, vCustomScrollBarThumb: styles.vScrollbarThumb}}>
              {data.map((item) => (
                <Item data={item} />
              ))}
            </CustomScrollbar>
          </div>
        ) : (
          <></>
        )}
      </DialogContent>
    </Dialog>
  );
};

ActivityDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
  data: PropTypes.array,
};

export default ActivityDialog;
