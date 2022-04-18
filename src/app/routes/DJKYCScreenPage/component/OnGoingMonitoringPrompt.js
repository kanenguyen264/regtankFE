import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Switch,
  DialogTitle,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import { ProtegoContext } from "@protego/sdk/core/ProtegoProvider/ProtegoProvider";
import CloseableDialogTitle from "@protego/sdk/UI/CloseableDialogTitle/CloseableDialogTitle";
import imgErrorSrc from "assets/images/error.png";
import { FormattedHTMLMessage } from "react-intl";
import { toRem } from "@protego/sdk/utils/measurements";
import { snackActions } from "util/snackbarUtils";
import {
  TEXT_SUBTITLE,
  TEXT_DARK_GRAY,
  BORDER_LIGHT_GRAY,
} from "constants/ThemeColors";
import {
  DJ_ACTION_KYC_BULK_TOGGLE_OM,
  DJ_ACTION_KYC_TOGGLE_OM,
} from "actions/DJAction";
import { useDispatch, useSelector } from "react-redux";
import { caculateNumerDeduct } from "util/omCerditDeduct";
import { formatDate } from "util/date";
import { isEmpty } from "lodash";

const useStyles = makeStyles({
  errorWrapper: {
    border: `1px solid ${BORDER_LIGHT_GRAY}`,
    borderRadius: 6,
    padding: `${toRem(14)} ${toRem(16)}`,
    height: "100px",
    overflowY: "auto",
    listStyle: "none",
    margin: 0,
  },
  subHeading: {
    fontSize: toRem(15),
    color: TEXT_SUBTITLE,
  },
  switch: {
    display: "flex",
    justifyContent: "space-between",
    margin: 0,
  },
  paper: {
    maxWidth: toRem(524),
  },
  dialogContent: {
    padding: toRem(32),
    color: TEXT_DARK_GRAY,
  },
  creditNote: {
    color: "#7A7A7A",
  },
});

const OnGoingMonitoringDialog = ({ onClose, selected }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [om, setOm] = React.useState(true);
  const [error, setError] = React.useState(null);
  const dispatch = useDispatch();
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
        <FormattedHTMLMessage
          id= {om ? "djkyc.dialog.enabledOnGoingMonitoring.success" : "djkyc.dialog.disabledOnGoingMonitoring.success" }
          values={{ total: selected.length, br: <br /> }}
        />
      );
      handleClose();
    }
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      onClose={handleClose}
      open={open}
      fullWidth
      maxWidth="xs"
      classes={{ paper: !numerKYCDeducted ? classes.paper : "" }}
    >
      {error && error.length ? (
        <>
          <DialogTitle onClose={handleClose} style={{ textAlign: "center" }}>
            <IntlMessages id="djkyc.dialog.onGoingMonitoring.title" />
          </DialogTitle>
          <DialogContent classes={{ root: classes.dialogContent }}>
            <div
              className="text-center"
              style={{ marginTop: toRem(24), marginBottom: toRem(24) }}
            >
              <div>
                <img
                  width="72"
                  height="72"
                  className="image-error"
                  src={imgErrorSrc}
                  alt="avatar"
                />
              </div>
              <div style={{ marginTop: toRem(18) }}>
                <FormattedHTMLMessage
                  id="djkyc.dialog.onGoingMonitoring.error.headline"
                  values={{
                    success: selected.length - error.length,
                    error: error.length,
                  }}
                />
              </div>
            </div>
            <ul className={classes.errorWrapper}>
              {error.map((kycId, index) => (
                <li key={index}>{kycId}</li>
              ))}
            </ul>
          </DialogContent>
          <DialogActions className="justify-content-center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleClose}
              style={{ width: toRem(122) }}
            >
              <IntlMessages id="close" />
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <CloseableDialogTitle onClose={handleClose}>
            <IntlMessages id="djkyc.dialog.onGoingMonitoring.title" />
          </CloseableDialogTitle>
          <DialogContent classes={{ root: classes.dialogContent }}>
            <div
              className="text-center"
              style={{ marginTop: toRem(10), marginBottom: toRem(24) }}
            >
              <FormattedHTMLMessage
                id="djkyc.dialog.onGoingMonitoring.headline"
                values={{ total: selected.length }}
              />
            </div>
            {numerKYCDeducted > 0 && (
              <div className={`text-center mb-4 ${classes.creditNote}`}>
                <FormattedHTMLMessage id="kyc.dialog.onGoingMonitoring.creditNote" />
              </div>
            )}
            <div style={{ marginBottom: toRem(16) }}>
              <FormControlLabel
                className={classes.switch}
                labelPlacement={"start"}
                control={
                  <Switch
                    checked={om}
                    onChange={(e) => setOm(e.target.checked)}
                  />
                }
                label={<IntlMessages id="kyc.ongoing" />}
              />
            </div>
            <div className={classes.subHeading}>
              <IntlMessages id="kyc.dialog.onGoingMonitoring.emailUpdate" />
            </div>
          </DialogContent>
          <DialogActions className="justify-content-between">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSave}
              style={{ width: "calc(50% - 8px)" }}
              onClick={handleSave}
            >
              <IntlMessages id="save" />
            </Button>

            <Button
              variant="contained"
              style={{ width: "calc(50% - 8px)", marginLeft: 0 }}
              size="large"
              onClick={handleClose}
            >
              <IntlMessages id="cancel" />
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

const CreditDeductDialog = ({ selected, onClose, onSuccess }) => {
  const { generalSettings } = useSelector((state) => state.settings);
  const { deductOM } = useSelector((state) => state.kyc);
  const { djKycOmCost } = generalSettings;
  const currentScreeningResult = selected[0];
  const [open, setOpen] = React.useState(true);
  const {
    omStartPeriod,
    omEndPeriod,
    kycId,
    enableOM,
    setSwitchOM,
  } = currentScreeningResult;
  const [error, setError] = React.useState(null);
  const classes = useStyles();

  const [dialogContent, setDialogContent] = useState({
    omStartPeriod,
    omEndPeriod,
    kycId,
    enableOM,
    setSwitchOM,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isEmpty(deductOM)) {
      setDialogContent({ ...dialogContent, ...deductOM });
    }
  }, [deductOM]);

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleSave = async () => {
    try {
      setSwitchOM(true);
      handleClose();
      const data = await dispatch(
        DJ_ACTION_KYC_TOGGLE_OM({
          enabled: enableOM,
          kycId: kycId,
        })
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
        handleClose();
      } else {
        setDialogContent({ ...dialogContent, ...data });
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess();
        } else {
          snackActions.success(
            <FormattedHTMLMessage
              id="djkyc.dialog.enabledOnGoingMonitoring.success"
              values={{ total: selected.length }}
            />
          );
        }
      }
    } catch (error) {
      snackActions.error(error.message);
    }
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      onClose={handleClose}
      open={open}
      fullWidth={false}
      maxWidth="xs"
    >
      <CloseableDialogTitle onClose={handleClose}>
        <IntlMessages id="confirmation" />
      </CloseableDialogTitle>
      {error && error.length ? (
        <>
          <DialogContent>
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
                <FormattedHTMLMessage
                  id="kyc.dialog.onGoingMonitoring.error.headline"
                  values={{
                    success: selected.length - error.length,
                    error: error.length,
                  }}
                />
              </div>
            </div>
            <ul className={classes.errorWrapper}>
              {error.map((kycId, index) => (
                <li key={index}>{kycId}</li>
              ))}
            </ul>
          </DialogContent>
          <DialogActions className="justify-content-center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleClose}
            >
              <IntlMessages id="close" />
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          {dialogContent && !isEmpty(dialogContent) && (
            <DialogContent>
              <div className="text-center mb-3">
                {dialogContent.omStartPeriod === null && (
                  <p>
                    <FormattedHTMLMessage
                      id="djkyc.dialog.OM.enable"
                      values={{ kycId }}
                    />
                  </p>
                )}
                {dialogContent.omStartPeriod !== null && (
                  <div className="text-center mb-3">
                    <p>
                      <FormattedHTMLMessage
                        id="djkyc.dialog.OM.enableAgain"
                        values={{ kycId }}
                      />
                    </p>
                  </div>
                )}
                {caculateNumerDeduct([dialogContent]) > 0 ? (
                  <p>
                    <FormattedHTMLMessage
                      id="kyc.dialog.OM.enable.cost"
                      values={{ kycOmCost: djKycOmCost }}
                    />
                  </p>
                ) : (
                  ""
                )}
                {dialogContent.omStartPeriod !== null && (
                  <div className="text-center mb-3">
                    <p>
                      <FormattedHTMLMessage
                        id="kyc.dialog.OM.enable.startPeriod"
                        values={{
                          omStartPeriod: formatDate(
                            dialogContent.omStartPeriod
                          ),
                        }}
                      />
                    </p>
                    {dialogContent.omEndPeriod && (
                      <p>
                        <FormattedHTMLMessage
                          id="kyc.dialog.OM.enable.endPeriod"
                          values={{
                            omEndPeriod: formatDate(dialogContent.omEndPeriod),
                          }}
                        />
                      </p>
                    )}
                  </div>
                )}
              </div>
            </DialogContent>
          )}
          <DialogActions className="justify-content-center">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSave}
            >
              <IntlMessages id="save" />
            </Button>
            <Button variant="contained" size="large" onClick={handleClose}>
              <IntlMessages id="cancel" />
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export const useCreditDeductionDialog = (props) => {
  const { addComponent, removeComponent } = React.useContext(ProtegoContext);
  const { key = "CreditDeductionKYC", onSuccess = null } = props;
  return (selected) => {
    return new Promise((resolve) => {
      const onClose = () => {
        removeComponent({ key: key });
        resolve();
      };

      addComponent({
        key: key,
        component: (
          <CreditDeductDialog
            selected={selected}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        ),
      });
    });
  };
};

const useOnGoingMonitoringPrompt = () => {
  const { addComponent, removeComponent } = React.useContext(ProtegoContext);

  return (selected) => {
    return new Promise((resolve) => {
      const onClose = () => {
        removeComponent({ key: "OnGoingMonitoringDJKYC" });
        resolve();
      };

      addComponent({
        key: "OnGoingMonitoringDJKYC",
        component: (
          <OnGoingMonitoringDialog selected={selected} onClose={onClose} />
        ),
      });
    });
  };
};

export default useOnGoingMonitoringPrompt;
