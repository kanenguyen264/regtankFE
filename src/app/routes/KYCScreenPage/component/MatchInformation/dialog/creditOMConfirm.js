import { Typography } from "@mui/material";
import { ProtegoContext } from "@protego/sdk/core/ProtegoProvider/ProtegoProvider";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { KYC_ACTION_TOGGLE_OM } from "actions/KYCAction";
import { ReactComponent as IcQuestion } from "assets/icons/IcQuestion.svg";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { FormattedHTMLMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "util/date";
import { caculateNumerDeduct } from "util/omCerditDeduct";
import { snackActions } from "util/snackbarUtils";
import styles from "../MatchInformation.module.scss";

const OnGoingMonitoringDialog = ({ selected, onClose }) => {
  const { generalSettings } = useSelector((state) => state.settings);
  const { deductOM } = useSelector((state) => state.kyc);
  const { kycOmCost } = generalSettings;
  const currentScreeningResult = selected[0];
  const [open, setOpen] = React.useState(true);
  const {
    omStartPeriod,
    omEndPeriod,
    kycId,
    enableOM,
    setSwitchOM,
  } = currentScreeningResult;
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
      handleClose();
      const data = await dispatch(
        KYC_ACTION_TOGGLE_OM({
          enabled: enableOM,
          kycId: kycId,
        })
      );
      setDialogContent({ ...dialogContent, ...data });
      snackActions.success(
        <IntlMessages
          id="kyc.dialog.onGoingMonitoring.success.headline"
          values={{ total: selected.length }}
        />
      );
      setSwitchOM(true);
    } catch (error) {
      snackActions.error(error.message);
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
          <Button variant="outlinedSecondary" onClick={handleClose}>
            <IntlMessages id="appModule.requestForm.cancel" />
          </Button>
          <Button
            className={"ml-3"}
            variant="contained"
            type="submit"
            onClick={handleSave}
          >
            <IntlMessages id="save" />
          </Button>
        </div>
      }
    >
      {dialogContent && !isEmpty(dialogContent) && (
        <div className={styles.textOm}>
          <Typography variant="subtitleGray">
            <div>
              {dialogContent.omStartPeriod === null && (
                <div>
                  <FormattedHTMLMessage
                    id="kyc.dialog.OM.enable"
                    values={{ kycId }}
                  />
                  <br />
                </div>
              )}

              {dialogContent.omStartPeriod !== null && (
                <div className="mb-1">
                  <FormattedHTMLMessage
                    id="kyc.dialog.OM.enableAgain"
                    values={{ kycId }}
                  />
                </div>
              )}
              {caculateNumerDeduct([dialogContent]) > 0 ? (
                <FormattedHTMLMessage
                  id="kyc.dialog.OM.enable.cost"
                  values={{ kycOmCost }}
                />
              ) : (
                ""
              )}
              {dialogContent.omStartPeriod !== null && (
                <div>
                  <FormattedHTMLMessage
                    id="kyc.dialog.OM.enable.startPeriod"
                    values={{
                      omStartPeriod: formatDate(dialogContent.omStartPeriod),
                    }}
                  />
                  <br />
                  {dialogContent.omEndPeriod && (
                    <FormattedHTMLMessage
                      id="kyc.dialog.OM.enable.endPeriod"
                      values={{
                        omEndPeriod: formatDate(dialogContent.omEndPeriod),
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </Typography>
        </div>
      )}
    </Dialog>
  );
};

const useOnGoingMonitoringPrompt = (props) => {
  const { addComponent, removeComponent } = React.useContext(ProtegoContext);
  return (selected) => {
    return new Promise((resolve) => {
      const onClose = () => {
        removeComponent({ key: "creditOMKYC" });
        resolve();
      };

      addComponent({
        key: "creditOMKYC",
        component: (
          <OnGoingMonitoringDialog selected={selected} onClose={onClose} />
        ),
      });
    });
  };
};

export default useOnGoingMonitoringPrompt;
