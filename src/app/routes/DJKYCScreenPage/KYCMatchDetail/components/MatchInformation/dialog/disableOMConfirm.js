import { Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { ProtegoContext } from "@protego/sdk/core/ProtegoProvider/ProtegoProvider";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import theme from "@protego/sdk/RegtankUI/v1/MuiTheme/theme";
import { DJ_ACTION_KYC_TOGGLE_OM } from "actions/DJAction";
import { ReactComponent as IcQuestion } from "assets/icons/IcQuestion.svg";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { FormattedHTMLMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
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
    handleClose();
    try {
      await dispatch(DJ_ACTION_KYC_TOGGLE_OM({ enabled: enableOM, kycId }));
      snackActions.success(
        <FormattedHTMLMessage
          id="djkyc.dialog.disabledOnGoingMonitoring.success"
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
            <IntlMessages id="cancel" />
          </Button>
          <Button
            className={"ml-3"}
            variant="containedError"
            type="submit"
            onClick={handleSave}
          >
            <IntlMessages id="disable" />
          </Button>
        </div>
      }
    >
      <div className={styles.textOm}>
        <Typography variant="subtitleGray">
          <div>
            <FormattedHTMLMessage
              id="djkyc.dialog.onGoingMonitoring.confirmDisable"
              values={{ kycId }}
            />
          </div>
        </Typography>
      </div>
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
