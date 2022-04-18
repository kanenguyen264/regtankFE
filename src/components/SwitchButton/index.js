import { FormControlLabel, Typography } from "@mui/material";
import { Switch } from "@protego/sdk/RegtankUI/v1/Switch";
import { makeStyles } from "@material-ui/core/styles";
import JRCard from "@protego/sdk/UI/JRCard/JRCard";
import clsx from "clsx";
import React, { memo } from "react";
import styles from "./styles.module.scss";
const useStyles = makeStyles({
  root: {
    display: "flex",

    justifyContent: "space-between",
  },
});
const SwitchButton = (props) => {
  const {
    onChange,
    name,
    className,
    disableShadow,
    labelPlacement,
    disablePadding,
    checked,
    disabled,
  } = props;
  const classes = useStyles();

  return (
    <JRCard
      dense
      disableShadow={disableShadow}
      className={clsx(
        disablePadding && styles.cleanPadding,
        styles.cleanMargin,
        className,
        styles.wrapperSwitchFormControl
      )}
    >
      <FormControlLabel
        disabled={disabled}
        style={{ marginLeft: 0 }}
        className={"d-flex justify-content-between"}
        classes={classes}
        labelPlacement={labelPlacement ? labelPlacement : "start"}
        control={<Switch checked={checked} onChange={onChange} />}
        label={name}
      />
    </JRCard>
  );
};
export default memo(SwitchButton);
