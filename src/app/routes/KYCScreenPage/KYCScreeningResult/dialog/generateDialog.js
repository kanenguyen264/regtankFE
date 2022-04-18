import { Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { ProtegoContext } from "@protego/sdk/core/ProtegoProvider/ProtegoProvider";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import theme from "@protego/sdk/RegtankUI/v1/MuiTheme/theme";
import { generatePath } from "@protego/sdk/utils/router";
import { ReactComponent as IcQuestion } from "assets/icons/IcQuestion.svg";
import { KYC_ROUTE_KYC_SCREEN_SCORING } from "constants/routes";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

const OnGoingMonitoringDialog = ({ onClose, enableOM, selected }) => {
  const [open, setOpen] = React.useState(true);
  const currentScreeningResult = selected[0];
  const history = useHistory();
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleSave = async () => {
    handleClose();
    history.push(
      generatePath(KYC_ROUTE_KYC_SCREEN_SCORING, {
        kycId: currentScreeningResult?.kycId,
      })
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        onClose={handleClose}
        open={open}
        allowCloseOnTitle
        title={{
          text: <IntlMessages id="Confirmation" />,
          icon: <IcQuestion />,
        }}
        actionsCustom={
          <div style={{ width: "100%" }}>
            <div className="d-flex justify-content-end">
              <Button variant="outlinedSecondary" onClick={handleClose}>
                <Typography variant="Subtitle1">
                  <IntlMessages id="cancel" />
                </Typography>
              </Button>
              <Button
                className={"ml-3"}
                variant="contained"
                type="submit"
                onClick={handleSave}
              >
                <IntlMessages id="button.yes" />
              </Button>
            </div>
          </div>
        }
      >
        <div>
          <Typography variant="body1" color="grayText">
            <div className="d-flex align-items-center justify-content-center">
              <IntlMessages id="kyc.generateScorePromptTitle"></IntlMessages>
              <br />
              <IntlMessages id="kyc.generateScorePromptContent"></IntlMessages>
            </div>
          </Typography>
        </div>
      </Dialog>
    </ThemeProvider>
  );
};

const useOnGoingMonitoringPrompt = (props) => {
  const { addComponent, removeComponent } = React.useContext(ProtegoContext);
  return (selected, enableOM) => {
    return new Promise((resolve) => {
      const onClose = () => {
        removeComponent({ key: "disableOM" });
        resolve();
      };

      addComponent({
        key: "disableOM",
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
