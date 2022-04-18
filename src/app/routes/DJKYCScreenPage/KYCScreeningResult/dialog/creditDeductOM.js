import {
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ProtegoContext } from "@protego/sdk/core/ProtegoProvider/ProtegoProvider";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { toRem } from "@protego/sdk/utils/measurements";
import {
  DJ_ACTION_GET_KYC_REQUEST,
  DJ_ACTION_KYC_TOGGLE_OM,
} from "actions/DJAction";
import { ReactComponent as IcQuestion } from "assets/icons/IcQuestion.svg";
import imgErrorSrc from "assets/images/error.png";
import React, { useEffect, useState } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "util/date";
import { caculateNumerDeduct } from "util/omCerditDeduct";
import { snackActions } from "util/snackbarUtils";
import styles from "../KYCScreeningResult.module.scss";
import { clone } from "lodash";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import {
  submitGeneralSettings,
  submitGeneralSettingsSuccess,
} from "actions/Setting";
const useStyles = makeStyles({
  errorWrapper: {
    border: `1px solid ${ThemeColors.defaultLight}`,
    borderRadius: 6,
    padding: "14px 16px",
    height: "100px",
    overflowY: "auto",
    listStyle: "none",
    margin: 0,
  },
  subHeading: {
    fontSize: toRem(15),
    color: ThemeColors.steelGray,
  },
  switch: {
    display: "flex",
    justifyContent: "space-between",
    margin: 0,
  },
});

const OnGoingMonitoringDialog = ({ onClose, selected, enableOM }) => {
  const { generalSettings } = useSelector((state) => state.settings);
  const { kycOmCost } = generalSettings;
  const currentScreeningResult = selected[0];
  const { omStartPeriod, omEndPeriod, kycId } = currentScreeningResult;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(enableOM);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = useState(false);
  const [numberCredit, setNumberCredit] = useState(0);
  const temp = caculateNumerDeduct([currentScreeningResult]);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const { formatMessage } = useIntl();

  const settingsState = useSelector(({ settings }) => {
    const { generalSettings } = settings;
    return {
      generalSettings,
    };
  });

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };
  const handleDontShowAgainChange = (event) => {
    setDontShowAgain(event.target.checked);
  };

  useEffect(() => {
    if (
      currentScreeningResult &&
      currentScreeningResult !== {} &&
      currentScreeningResult.kycId
    ) {
      setNumberCredit(temp);
    }
  }, [currentScreeningResult]);

  const handleSave = async () => {
    setLoading(true);
    handleClose();

    if (dontShowAgain) {
      const { generalSettings } = settingsState;
      let summitedData = clone(generalSettings);
      summitedData.djKycOmDeductionConfirmation = false;

      dispatch(submitGeneralSettings(summitedData))
        .then((rs) => {
          dispatch(submitGeneralSettingsSuccess(rs.data));
        })
        .catch((err) => {
          return snackActions.success(
            <IntlMessages id={"notification.message.error"} />
          );
        });
    }

    const data = await dispatch(
      DJ_ACTION_KYC_TOGGLE_OM({
        enabled: enableOM,
        kycId: currentScreeningResult?.kycId,
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
    await dispatch(DJ_ACTION_GET_KYC_REQUEST(kycId));
    setLoading(false);

    if (errorFound.length) {
      setOpen(true);
      setError(errorFound);
      handleClose();
    } else {
      snackActions.success(
        <FormattedHTMLMessage
          id="kyc.dialog.enabledOnGoingMonitoring.success"
          values={{ total: selected.length }}
        />
      );
      handleClose();
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      allowCloseOnTitle
      title={{
        text: (
          <Typography variant="title">
            <IntlMessages id="Confirmation" />
          </Typography>
        ),
        icon: <IcQuestion />,
      }}
      actionsCustom={
        <div className="d-flex justify-content-end">
          <Button
            variant="outlinedSecondary"
            onClick={handleClose}
            className={"mr-3"}
          >
            <IntlMessages id="appModule.requestForm.cancel" />
          </Button>
          <Button variant="contained" onClick={handleSave}>
            {numberCredit > 0 ? (
              <IntlMessages id="kyc.dialog.button.enable" />
            ) : (
              <IntlMessages id="save" />
            )}
          </Button>
        </div>
      }
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
          </div>
        </>
      ) : (
        <div className={styles.textOm}>
          {currentScreeningResult !== {} && (
            <>
              <div>
                <Typography variant="subtitleGray">
                  <div>
                    {omStartPeriod === null && (
                      <div>
                        <FormattedHTMLMessage
                          id="djkyc.dialog.OM.enable"
                          values={{ kycId }}
                        />
                        <br />
                      </div>
                    )}
                    {omStartPeriod !== null && (
                      <div className="mb-1">
                        <FormattedHTMLMessage
                          id="djkyc.dialog.OM.enableAgain"
                          values={{ kycId }}
                        />
                      </div>
                    )}
                    {numberCredit > 0 && (
                      <FormattedHTMLMessage
                        id="kyc.dialog.OM.enable.cost"
                        values={{ kycOmCost }}
                      />
                    )}
                    {omStartPeriod !== null && (
                      <div>
                        <FormattedHTMLMessage
                          id="kyc.dialog.OM.enable.startPeriod"
                          values={{
                            omStartPeriod: formatDate(omStartPeriod),
                          }}
                        />
                        <br />
                        {omEndPeriod && (
                          <FormattedHTMLMessage
                            id="kyc.dialog.OM.enable.endPeriod"
                            values={{ omEndPeriod: formatDate(omEndPeriod) }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </Typography>
              </div>
              {omStartPeriod === null && (
                <div>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleDontShowAgainChange}
                          name="dontShowAgain"
                          color="primary"
                        />
                      }
                      label={
                        <Typography
                          variant="smallGrayDefault"
                          style={{
                            fontWeight: "500",
                            fontSize: toRem(14),
                            lineHeight: toRem(20),
                            color: ThemeColors.grayText,
                          }}
                        >
                          <IntlMessages
                            id="setting.generalSettings.confirmation.dontShowAgain"
                            values={{ TYPE: "" }}
                          />
                        </Typography>
                      }
                    />
                  </FormGroup>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </Dialog>
  );
};

const useOnGoingMonitoringPrompt = (props) => {
  const { addComponent, removeComponent } = React.useContext(ProtegoContext);

  return (selected, enableOM) => {
    return new Promise((resolve) => {
      const onClose = () => {
        removeComponent({ key: "OnGoingMonitoringKYC" });
        resolve();
      };

      addComponent({
        key: "OnGoingMonitoringKYC",
        component: (
          <OnGoingMonitoringDialog
            selected={selected}
            onClose={onClose}
            enableOM={enableOM}
          />
        ),
      });
    });
  };
};

export default useOnGoingMonitoringPrompt;
