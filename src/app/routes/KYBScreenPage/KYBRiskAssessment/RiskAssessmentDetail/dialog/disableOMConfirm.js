import { Typography } from "@mui/material";
import { ProtegoContext } from "@protego/sdk/core/ProtegoProvider/ProtegoProvider";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { KYB_ACTION_TOGGLE_OM } from "actions/KYBAction";
import { ReactComponent as IcQuestion } from "assets/icons/IcQuestion.svg";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { FormattedHTMLMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { snackActions } from "util/snackbarUtils";
import styles from "../RiskAssessmentDetail.module.scss";
const OnGoingMonitoringDialog = ({ selected, onClose }) => {
  const { generalSettings } = useSelector((state) => state.settings);
  const { deductOM } = useSelector((state) => state.kyc);
  const { kycOmCost } = generalSettings;
  const currentScreeningResult = selected[0];
  const [open, setOpen] = React.useState(true);
  const {
    omStartPeriod,
    omEndPeriod,
    kybId,
    enableOM,
    setSwitchOM,
  } = currentScreeningResult;
  const [dialogContent, setDialogContent] = useState({
    omStartPeriod,
    omEndPeriod,
    kybId,
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
    handleClose();
    try {
      await dispatch(KYB_ACTION_TOGGLE_OM({ enabled: enableOM, kybId }));
      snackActions.success(
        <FormattedHTMLMessage
          id="kyb.dialog.disabledOnGoingMonitoring.success"
          values={{ total: "1" }}
        />
      );
      setSwitchOM(false);
    } catch (error) {
      snackActions.error(<IntlMessages id="appModule.generic.errorMessage" />);
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
            <IntlMessages id="disable" />
          </Button>
        </div>
      }
    >
      <>
        <div className={styles.textOm}>
          <Typography variant="subtitleGray">
            <div>
              <FormattedHTMLMessage
                id="kyb.dialog.onGoingMonitoring.confirmDisable"
                values={{ kybId }}
              />
            </div>
          </Typography>
        </div>
      </>
    </Dialog>
  );
};

const useOnGoingMonitoringPrompt = (props) => {
  const { addComponent, removeComponent } = React.useContext(ProtegoContext);
  return (selected) => {
    return new Promise((resolve) => {
      const onClose = () => {
        removeComponent({ key: "disableOM" });
        resolve();
      };

      addComponent({
        key: "disableOM",
        component: (
          <OnGoingMonitoringDialog selected={selected} onClose={onClose} />
        ),
      });
    });
  };
};

export default useOnGoingMonitoringPrompt;
