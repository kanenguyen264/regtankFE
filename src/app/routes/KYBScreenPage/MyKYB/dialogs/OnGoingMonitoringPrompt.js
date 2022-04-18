import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import { ProtegoContext } from "@protego/sdk/core/ProtegoProvider/ProtegoProvider";
import CloseableDialogTitle from "@protego/sdk/UI/CloseableDialogTitle/CloseableDialogTitle";
import imgErrorSrc from "assets/images/error.png";
import { useDispatch, useSelector } from "react-redux";
import { KYB_ACTION_BULK_TOGGLE_OM } from "actions/KYBAction";
import { FormattedHTMLMessage } from "react-intl";
import { toRem } from "@protego/sdk/utils/measurements";
import { snackActions } from "util/snackbarUtils";
import { caculateNumerDeduct } from "util/omCerditDeduct";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import { DARK_GRAY_LIGHT, DARK_GRAY_LIGHT_SECOND } from "constants/ThemeColors";

const useStyles = makeStyles({
  errorWrapper: {
    border: `1px solid ${DARK_GRAY_LIGHT_SECOND}`,
    borderRadius: 6,
    padding: "14px 16px",
    height: "100px",
    overflowY: "auto",
    listStyle: "none",
    margin: 0,
  },
  subHeading: {
    fontSize: toRem(15),
    color: DARK_GRAY_LIGHT,
  },
  switch: {
    display: "flex",
    justifyContent: "space-between",
    margin: 0,
  },
  creditNote: {
    color: DARK_GRAY_LIGHT,
  },
});

const OnGoingMonitoringDialog = ({ onClose, selected }) => {
  const { generalSettings } = useSelector((state) => state.settings);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(true);
  const [om, setOm] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const numberKYBDeducted = caculateNumerDeduct(selected);

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleSave = async () => {
    setLoading(true);
    const kybIds = selected.map((one) => one.kybId);
    // TODO: call API for bulk KYC OM with selected
    const data = await dispatch(
      KYB_ACTION_BULK_TOGGLE_OM({ kybIds, enabled: om })
    );

    setLoading(false);
    const errorFound =
      data &&
      Object.entries(data).reduce((accumulator, [kybId, success]) => {
        if (!success) {
          accumulator.push(kybId);
        }
        return accumulator;
      }, []);
    if (errorFound.length) {
      setOpen(true);
      setError(errorFound);
    } else {
      if (om) {
        snackActions.success(
          <IntlMessages
            id="kyb.dialog.onGoingMonitoring.success.headline"
            values={{ total: selected.length }}
          />
        );
      } else {
        snackActions.success(
          <IntlMessages
            id="kyb.dialog.OM.disable.content"
            values={{ total: selected.length }}
          />
        );
      }

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
    >
      <CloseableDialogTitle onClose={handleClose}>
        <IntlMessages id="kyb.dialog.onGoingMonitoring.title" />
      </CloseableDialogTitle>

      <div>
        <LoadingWrapper loading={loading} size={"3rem"}>
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
                      id="kyb.dialog.onGoingMonitoring.error.headline"
                      values={{
                        success: selected.length - error.length,
                        error: error.length,
                      }}
                    />
                  </div>
                </div>
                <ul className={classes.errorWrapper}>
                  {error.map((kybId, index) => (
                    <li key={index}>{kybId}</li>
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
              <DialogContent>
                <div className={`text-center mb-4 ${classes.headline}`}>
                  <FormattedHTMLMessage
                    id="kyb.dialog.onGoingMonitoring.headline"
                    values={{ total: selected.length }}
                  />
                </div>
                {numberKYBDeducted > 0 && (
                  <div className={`text-center mb-4 ${classes.creditNote}`}>
                    <FormattedHTMLMessage id="kyb.dialog.onGoingMonitoring.creditNote" />
                  </div>
                )}
                <div className="mb-4">
                  <FormControlLabel
                    className={classes.switch}
                    labelPlacement={"start"}
                    control={
                      <Switch
                        checked={om}
                        onChange={(e) => setOm(e.target.checked)}
                      />
                    }
                    label={<IntlMessages id="kyb.ongoing" />}
                  />
                </div>
                <div className={classes.subHeading}>
                  <IntlMessages id="kyb.dialog.onGoingMonitoring.emailUpdate" />
                </div>
              </DialogContent>
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
        </LoadingWrapper>
      </div>
    </Dialog>
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
