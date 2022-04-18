import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import {
  submitGeneralSettings,
  submitGeneralSettingsSuccess,
} from "actions/Setting";
import { ReactComponent as IcQuestion } from "assets/icons/IcQuestion.svg";
import clsx from "clsx";
import { clone } from "lodash";
import React, { memo, useState } from "react";
import { FormattedHTMLMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { snackActions } from "util/snackbarUtils";

const CreditDeductionModelConfirm = (props) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const {
    open,
    onPress,
    onPressSubmit,
    searchType,
    creditsDeducted,
    disableButton,
    content,
  } = props;
  const settingsState = useSelector(({ settings }) => {
    const { generalSettings } = settings;
    return {
      generalSettings,
    };
  });
  const dispatch = useDispatch();

  const handleDontShowAgainChange = (event) => {
    setDontShowAgain(event.target.checked);
  };

  const onSubmit = () => {
    const { generalSettings } = settingsState;
    let summitedData = clone(generalSettings);
    if (dontShowAgain) {
      if (searchType === "KYC") {
        summitedData.kycSearchConfirmation = false;
      } else if (searchType === "KYB") {
        summitedData.kybSearchConfirmation = false;
      } else if (searchType === "DJKYC") {
        summitedData.djKycSearchConfirmation = false;
      } else {
        summitedData.kytSearchConfirmation = false;
      }
      dispatch(submitGeneralSettings(summitedData))
        .then((rs) => {
          dispatch(submitGeneralSettingsSuccess(rs.data));
          onPressSubmit();
        })
        .catch((err) => {
          return snackActions.success(
            <IntlMessages id={"notification.message.error"} />
          );
        });
    } else {
      onPressSubmit();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onPress}
      title={{
        text: <IntlMessages id="Confirmation" />,
        icon: <IcQuestion />,
      }}
      allowCloseOnTitle
      actionsCustom={
        <div className="d-flex justify-content-end">
          <Button
            onClick={onPress}
            variant="outlinedSecondary"
            disabled={disableButton}
            size={"medium"}
          >
            <IntlMessages id="cancel" />
          </Button>
          <Button
            className={clsx("ml-3")}
            onClick={onSubmit}
            variant="contained"
            disabled={disableButton}
          >
            <IntlMessages id="continue" />
          </Button>
        </div>
      }
    >
      <div id="DialogContent">
        <div>
          <Typography variant="subtitleGraySemiBold">
            {content || (
              <FormattedHTMLMessage
                id="setting.generalSettings.confirmation.content"
                values={{
                  CREDITS: creditsDeducted,
                }}
              />
            )}
          </Typography>
        </div>

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
                <Typography variant="smallGrayDefault">
                  <IntlMessages
                    id="setting.generalSettings.confirmation.dontShowAgain"
                    values={{
                      TYPE:
                        searchType === "KYC"
                          ? "Acuris KYC"
                          : searchType === "DJKYC"
                          ? "Dow Jones KYC"
                          : searchType === "KYB"
                          ? "Acuris KYB"
                          : searchType,
                    }}
                  />
                </Typography>
              }
            />
          </FormGroup>
        </div>
      </div>
    </Dialog>
  );
};

export default memo(CreditDeductionModelConfirm);
