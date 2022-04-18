import { LinearProgress } from "@mui/material";
import { withStyles } from "@mui/styles";
import PropTypes from "prop-types";
import React from "react";
import { styled } from "@mui/material/styles";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";

const CustomLinearProgress = styled(LinearProgress)((props) => {
  return {
    height: toRem(16),
    borderRadius: toRem(12),
    backgroundColor: props.customShadowColor || ThemeColors.grayBorder,
    "& .MuiLinearProgress-bar": {
      backgroundColor: props.customColor || ThemeColors.primaryLight,
      borderRadius: toRem(12),
    },
  };
});

const LinearProgressColor = (props) => {
  return <CustomLinearProgress variant="determinate" {...props} />;
};

LinearProgressColor.propTypes = {
  value: PropTypes.number.isRequired,
  customColor: PropTypes.string,
  customShadowColor: PropTypes.string,
};

export default LinearProgressColor;
