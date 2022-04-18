import React from "react";
import { Checkbox, FormControlLabel, SvgIcon } from "@mui/material";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { withStyles } from "@mui/styles";
import { ReactComponent as CheckedIcon } from "assets/icons/CbCheckedIcon.svg";
import { ReactComponent as UncheckedIcon } from "assets/icons/CbUncheckedIcon.svg";
import { ReactComponent as DisabledIcon } from "assets/icons/CbDisabledIcon.svg";
import { ReactComponent as IndeterminateIcon } from "assets/icons/CbIndeterminateIcon.svg";

const CustomCheckbox = withStyles({
  root: {
    padding: 0,

    color: "transparent",
    "& .MuiSvgIcon-root": {
      width: toRem(18),
      height: toRem(18),
      fill: "#0080FF",
    },
    "& input:not(:checked) + .MuiSvgIcon-root": {
      fill: "#FFF",
    },
    "&.MuiCheckbox-indeterminate": {
      cursor: "auto",
      backgroundColor: "transparent !important",
    },
    "&.Mui-disabled .MuiSvgIcon-root": {
      color: "#C2C2C2",
    },
  },
})((props) => {
  const {
    label,
    labelPlacement = "start",
    indeterminate = false,
    disabled = false,
  } = props;
  const viewBox = "0 0 18 18";
  const checkBox = (
    <Checkbox
      {...props}
      style={{ padding: 0 }}
      checkedIcon={<SvgIcon viewBox={viewBox} component={CheckedIcon} />}
      disabled={disabled && !indeterminate ? true : false}
      indeterminateIcon={
        <SvgIcon viewBox={viewBox} component={IndeterminateIcon} />
      }
      icon={
        <SvgIcon
          viewBox={viewBox}
          component={props.disabled ? DisabledIcon : UncheckedIcon}
        />
      }
    />
  );

  return (
    <>
      {label ? (
        <FormControlLabel
          control={checkBox}
          label={label}
          labelPlacement={labelPlacement}
        />
      ) : (
        checkBox
      )}
    </>
  );
});

export default CustomCheckbox;
