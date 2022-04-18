import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Icon,
} from "@mui/material";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog/Dialog";
import { makeStyles } from "@mui/styles";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import {
  submitGeneralSettings,
  submitGeneralSettingsSuccess,
} from "actions/Setting";
import clsx from "clsx";
import { clone } from "lodash";
import React, { memo, useState } from "react";
import { FormattedHTMLMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { snackActions } from "util/snackbarUtils";
import { TEXT_DARK_GRAY } from "constants/ThemeColors";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { ErrorOutline } from "@mui/icons-material";
const useStyles = makeStyles((theme) => ({
  contentText: {
    color: TEXT_DARK_GRAY,
    fontWeight: 500,
  },
  checkboxLabel: {
    color: TEXT_DARK_GRAY,
    fontWeight: 400,
    fontSize: toRem(14),
  },
}));

const CreditDeductionModelConfirm = (props) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const className = useStyles();
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
    <>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        maxWidth="xs"
        onClose={onPress}
        aria-labelledby="form-dialog-title"
        title={{
          text: <IntlMessages id="confirmation" />,
          icon: <Icon component={ErrorOutline} color="warning" />,
        }}
        okProps={{
          onClick: onSubmit,
          disabled: disableButton,
          text: <IntlMessages id="continue" />,
        }}
        cancelProps={{
          onClick: onPress,
          disabled: disableButton,
          text: <IntlMessages id="cancel" />,
        }}
      >
        <div>
          <Box
            display="flex"
            className={`${className.contentText} mt-4 mb-2`}
            justifyContent="center"
          >
            {content || (
              <FormattedHTMLMessage
                id="setting.generalSettings.confirmation.content"
                values={{
                  CREDITS: creditsDeducted,
                }}
              />
            )}
          </Box>
          <div className={"mt-4"}>
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
                  <span className={className.checkboxLabel}>
                    <IntlMessages
                      id="setting.generalSettings.confirmation.dontShowAgain"
                      values={{
                        TYPE:
                          searchType === "KYC"
                            ? "Acuris KYC"
                            : searchType === "DJKYC"
                            ? "Dow Jones KYC"
                            : searchType,
                      }}
                    />
                  </span>
                }
              />
            </FormGroup>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default memo(CreditDeductionModelConfirm);
