import {
  Button,
  DialogActions,
  DialogContent,
  FormControlLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { ProtegoContext } from "@protego/sdk/core/ProtegoProvider/ProtegoProvider";
import CloseableDialogTitle from "@protego/sdk/UI/CloseableDialogTitle/CloseableDialogTitle";
import imgErrorSrc from "assets/images/error.png";
import { useDispatch, useSelector } from "react-redux";
// import { KYC_ACTION_BULK_TOGGLE_OM } from "actions/KYCAction";
import {FormattedHTMLMessage, useIntl} from "react-intl";
import {
  DJ_ACTION_KYC_BULK_TOGGLE_OM,
} from "actions/DJAction";
import { toRem } from "@protego/sdk/utils/measurements";
import { snackActions } from "util/snackbarUtils";
import { caculateNumerDeduct } from "util/omCerditDeduct";
import theme from "@protego/sdk/RegtankUI/v1/MuiTheme/theme";
import Switch from "@protego/sdk/RegtankUI/v1/Switch/BasicSwitch";
import {ThemeProvider} from "@mui/material/styles";
import {Typography} from "@mui/material";

const useStyles = makeStyles({
  errorWrapper: {
    border: "1px solid #C7C7C7",
    borderRadius: 6,
    padding: "14px 16px",
    height: "100px",
    overflowY: "auto",
    listStyle: "none",
    margin: 0,
  },
  subHeading: {
    fontSize: toRem(15),
    color: "#7A7A7A",
  },
  switch: {
    display: "flex",
    justifyContent: "space-between",
    margin: 0,
  },
  creditNote: {
    color: "#7A7A7A",
  },
});

const OnGoingMonitoringDialog = ({ onClose, selected }) => {
  const { generalSettings } = useSelector((state) => state.settings);
  const { kycOmCost } = generalSettings;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(true);
  const [om, setOm] = React.useState(true);
  const [error, setError] = React.useState(null);
  const { formatMessage } = useIntl();
  const numerKYCDeducted = caculateNumerDeduct(selected);

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleSave = async () => {
    const kycIds = selected.map((one) => one.kycId);
    setOpen(false);
    // TODO: call API for bulk KYC OM with selected
    const data = await dispatch(
      DJ_ACTION_KYC_BULK_TOGGLE_OM({ kycIds, enabled: om })
    );

    const errorFound = Object.entries(data).reduce(
      (accumulator, [kycId, success]) => {
        if (!success) {
          accumulator.push(kycId);
        }
        return accumulator;
      },
      []
    );
    if (errorFound.length) {
      setOpen(true);
      setError(errorFound);
    } else {
      snackActions.success(
        <IntlMessages
          id="kyc.dialog.onGoingMonitoring.success.headline"
          values={{ total: selected.length }}
        />
      );
      handleClose();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        onClose={handleClose}
        open={open}
        allowCloseOnTitle
        title={{
          text: (
            <Typography variant="title">
              <IntlMessages id="kyc.dialog.onGoingMonitoring.title" />
            </Typography>
          ),
        }}
        cancelProps={{
          text: formatMessage({ id: "close" }),
          onClick: () => handleClose(),
        }}
        okProps={{
          text: formatMessage({ id: "save" }),
          onClick: () => handleSave(),
        }}
      >
        {error && error.length ? (
          <>
            <div>
              <div className="text-center mb-3">
                <div>
                  <img
                    width="72"
                    height="72"
                    className="image-error mb-3"
                    src={imgErrorSrc}
                    alt="avatar"
                  />
                </div>
                <div>
                  <Typography variant="body1" color="grayText">
                    <FormattedHTMLMessage
                      id="kyc.dialog.onGoingMonitoring.error.headline"
                      values={{
                        success: selected.length - error.length,
                        error: error.length,
                      }}
                    />
                  </Typography>
                </div>
              </div>
              <ul className={classes.errorWrapper}>
                {error.map((kycId, index) => (
                  <li key={index}>{kycId}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <>
            <div>
              <div className={`text-start  ${classes.headline}`}>
                <Typography variant="button2" color="grayText">
                  <FormattedHTMLMessage
                    id="kyc.dialog.onGoingMonitoring.headline"
                    values={{ total: selected.length }}
                  />
                </Typography>
              </div>
              {numerKYCDeducted > 0 && (
                <div className={`mb-2 ${classes.creditNote}`}>
                  <Typography variant="textLabel" color="grayText">
                    <FormattedHTMLMessage id="kyc.dialog.onGoingMonitoring.creditNote" />
                  </Typography>
                </div>
              )}
              <div className={`mb-2`}>
                <FormControlLabel
                  style={{ margin: 0 }}
                  classes={{
                    labelPlacementStart: classes.labelPlacementStart,
                  }}
                  labelPlacement={"end"}
                  control={
                    <Switch
                      checked={om}
                      onChange={(e) => setOm(e.target.checked)}
                    />
                  }
                  label={
                    <Typography variant="Subtitle2">
                      <IntlMessages id="kyc.ongoing" />
                    </Typography>
                  }
                />
              </div>
              <div>
                <Typography variant="textLabel" color="grayText">
                  <IntlMessages id="kyc.dialog.onGoingMonitoring.emailUpdate" />
                </Typography>
              </div>
            </div>
          </>
        )}
      </Dialog>
    </ThemeProvider>
  );
};

const useOnGoingMonitoringPrompt = (props) => {
  const { addComponent, removeComponent } = React.useContext(ProtegoContext);

  return (selected) => {
    return new Promise((resolve) => {
      const onClose = () => {
        removeComponent({ key: "OnGoingMonitoringKYC" });
        resolve();
      };

      addComponent({
        key: "OnGoingMonitoringKYC",
        component: (
          <OnGoingMonitoringDialog selected={selected} onClose={onClose} />
        ),
      });
    });
  };
};

export default useOnGoingMonitoringPrompt;
