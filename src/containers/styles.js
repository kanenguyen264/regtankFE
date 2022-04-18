import React from "react";
import { makeStyles } from "@mui/styles";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import { ReactComponent as IcError } from "assets/icons/ic_notification_error.svg";
import { ReactComponent as IcInfo } from "assets/icons/ic_notification_info.svg";
import { ReactComponent as IcSuccess } from "assets/icons/ic_notification_success.svg";
import { ReactComponent as IcWarring } from "assets/icons/ic_notification_warring.svg";

const useSnackbarStyle = makeStyles(() => ({
  contentRoot: {
    borderRadius: 6,
  },
  variantSuccess: {
    backgroundColor: `${ThemeColors.successLight2} !important`,
    color: `${ThemeColors.success} !important`,
    border: `1px solid ${ThemeColors.success} !important`,
  },
  variantError: {
    backgroundColor: `${ThemeColors.errorLight2} !important`,
    color: `${ThemeColors.errorBorder} !important`,
    border: `1px solid ${ThemeColors.errorBorder} !important`,
  },
  variantInfo: {
    backgroundColor: `${ThemeColors.infoLight2} !important`,
    color: `${ThemeColors.primary} !important`,
    border: `1px solid ${ThemeColors.primary} !important`,
  },
  variantWarning: {
    backgroundColor: `${ThemeColors.warningLight2} !important`,
    color: `${ThemeColors.warningDark} !important`,
    border: `1px solid ${ThemeColors.warningDark} !important`,
  },
}));

const iconVariant = {
  success: (
    <div className="mr-2">
      <IcSuccess />
    </div>
  ),
  error: (
    <div className="mr-2">
      <IcError />
    </div>
  ),
  warning: (
    <div className="mr-2">
      <IcWarring />
    </div>
  ),
  info: (
    <div className="mr-2">
      <IcInfo />
    </div>
  ),
};

export { useSnackbarStyle, iconVariant };
