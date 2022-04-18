import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import CloseableDialogTitle from "@protego/sdk/RegtankUI/v1/CloseableDialogTitle/CloseableDialogTitle";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import clsx from "clsx";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styles from "./dialogStyles.module.scss";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";

const useStyles = makeStyles((theme) => ({
  rootChecked: {
    color: "#BFBFBF",
    "& + [class*='MuiFormControlLabel-label']": {
      fontSize: toRem(15),
    },
    "&$checked": {
      color: ThemeColors.primary,
    },
  },
  checked: {},
}));

const DialogComponent = (props) => {
  const {
    isOpen,
    onClose,
    title,
    content,
    checkBoxNotShow,
    handleChange,
    actions,
    onActions,
    className="",
  } = props;

  const [checkState, setCheckState] = useState(false);
  const classesName = useStyles();

  return (
    <Dialog maxWidth={"sm"} open={isOpen} className={className}>
      <CloseableDialogTitle
        className={
          typeof onClose !== "function" &&
          "d-flex align-items-center justify-content-center"
        }
        onClose={onClose}
      >
        {title}
      </CloseableDialogTitle>
      <DialogContent>
        <Grid container direction="column" alignItems="center">
          <Grid
            xs={12}
            item
            className={clsx(styles.textNotice, styles.textAlignCenter)}
          >
            {content}
            {checkBoxNotShow && (
              <Grid xs={12} item>
                <FormControlLabel
                  control={
                    <Checkbox
                      classes={{
                        root: classesName.rootChecked,
                        checked: classesName.checked,
                      }}
                      checked={checkState}
                      onChange={(event) => {
                        setCheckState(event.target.checked);
                        if (typeof handleChange === "function") {
                          handleChange(event.target.checked);
                        }
                      }}
                      name="checkState"
                    />
                  }
                  label={checkBoxNotShow}
                />
              </Grid>
            )}
          </Grid>
          <Grid xs={12} item>
            <DialogActions
              disableSpacing
              className={clsx(styles.p0, "d-flex justify-content-start")}
            >
              <Grid container>
                {actions?.map((item, index) => {
                  return (
                    <Grid key={index} item className={"ml-3"}>
                      <Button
                        variant={item?.variant || "primary"}
                        fullWidth
                        onClick={() => onActions(item, checkState)}
                        className={styles.btnWidth}
                      >
                        {item?.label}
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
            </DialogActions>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

DialogComponent.propTypes = {
  onClose: PropTypes.func,
};

export default DialogComponent;
