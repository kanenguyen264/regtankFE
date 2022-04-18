import { makeStyles } from "@material-ui/styles";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";

export const formStyles = makeStyles({
  settingBlock: {
    marginTop: toRem(3),
  },
  settingHeading: {
    fontWeight: 500,
    fontSize: toRem(14),
    lineHeight: toRem(20),
    padding: `0 ${toRem(24)}`,
    marginBottom: toRem(28),
    color: ThemeColors.mainBlackText,
  },
  controlWrapper: {
    padding: 0,
    maxWidth: toRem(645),
    border: `2px solid ${ThemeColors.grayText1}`,
    borderCollapse: "collapse",
    borderSpacing: "0",
    marginLeft: "-1px",
    borderRadius: "0",

    "& $control": {
      borderBottom: `1px solid ${ThemeColors.grayLight}`,
    },
    "& $control:last-child": {
      border: "none",
    },
  },
  tooltipArrow: {
    left: toRem(23),
  },
  control: {
    fontSize: toRem(14),
    lineHeight: toRem(20),
    alignItems: "center",
    borderBottom: `2px solid ${ThemeColors.grayText1}`,
    borderCollapse: "collapse",
    borderSpacing: "0",
    padding: toRem(24),
    color: "#000000",

    "& .MuiSwitch-root": {
      margin: "0 !important",
    },

    "& svg": {
      width: toRem(16),
      height: toRem(16),
      marginLeft: toRem(8),
    },
  },
  tooltipContent: {
    maxWidth: "100% !important",
    minWidth: toRem(200),
    "& h5": {
      fontSize: toRem(16),
      lineHeight: toRem(24),
      color: ThemeColors.white,
      fontWeight: 500,
      marginBottom: toRem(8),
    },
    "& + .MuiTooltip-arrow": {
      left: `${toRem(23)} !important`,
    },
    "& p": {
      fontSize: toRem(14),
      lineHeight: toRem(20),
      marginBottom: 0,
    },
  },
});
