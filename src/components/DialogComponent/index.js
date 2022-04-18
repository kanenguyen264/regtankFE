import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseableDialogTitle from "@protego/sdk/UI/CloseableDialogTitle/CloseableDialogTitle";
import { toRem } from "@protego/sdk/utils/measurements";
import clsx from "clsx";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styles from "./dialogStyles.module.scss";

const useStyles = makeStyles((theme) => ({
  rootChecked: {
    color: "#BFBFBF",
    "& + [class*='MuiFormControlLabel-label']": {
      fontSize: toRem(15),
    },
    "&$checked": {
      color: "#0080FF",
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
  } = props;

  const [checkState, setCheckState] = useState(false);
  const classesName = useStyles();

  return (
    <Dialog maxWidth={"sm"} open={isOpen}>
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
                        variant="contained"
                        color={item.color}
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
