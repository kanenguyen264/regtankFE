import React from "react";
import { makeStyles } from "@mui/styles";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";

export const useAddProfileStyles = makeStyles({
  root: {},
  MuiTabs: {
    "& .MuiTabs-flexContainer": {
      borderBottom: `${toRem(1)} solid ${ThemeColors.grayBorder}`,
    },
    "& .MuiTab-root": {
      fontSize: toRem(12),
      textTransform: "capitalize",
      backgroundColor: ThemeColors.disabledBg,
      marginRight: toRem(8),
      borderTopLeftRadius: toRem(10),
      borderTopRightRadius: toRem(10),
      border: `${toRem(1)} solid ${ThemeColors.grayBorder}`,
      borderBottom: 0,
      width: toRem(120)
    },
    "& .Mui-selected": {
      backgroundColor: ThemeColors.white,
      color: ThemeColors.primary,
    },
    "& .MuiTabs-indicator": {
      backgroundColor: ThemeColors.white,
      height: toRem(1),
    },
  },
  MuiTabPanel: {
    padding: `${toRem(30)} 0 !important`,
  },
});
