import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Popover,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import TextField from "@protego/sdk/UI/TextField/TextField";
import { toRem } from "@protego/sdk/utils/measurements";
import clsx from "clsx";
import React, { useState } from "react";
import styles from "./FilterComponent.module.scss";
import { CHECKBOX } from "constants/ThemeColors";
const checkBoxLabelStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "space-between",
  },
  labelPlacementStart: {
    marginLeft: 0,
  },
});

const checkBoxStyles = makeStyles({
  root: {
    "&$checked": {
      color: CHECKBOX,
    },
  },
  checked: {},
});

const textBoxStyles = makeStyles({
  disableInput: {
    "& .MuiInputBase-input.Mui-disabled": {
      backgroundColor: "#F5F5F5",
    },
  },
});

const TextFieldLabel = function TextFieldLabel(props) {
  return (
    <div>
      {props.label && <Typography>{props.label}</Typography>}
      <TextField
        inputProps={{
          min: 0,
          style: { height: toRem(15) },
        }}
        {...props}
      />
    </div>
  );
};

const RiskScoreFilterComponent = (props) => {
  const { data, onChange, reset } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = (e) => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const checkBoxLabelClasses = checkBoxLabelStyles();
  const checkBoxClasses = checkBoxStyles();
  const textBoxClasses = textBoxStyles();
  const [isSanctionChecked, setIsSanctionChecked] = useState(false);
  const [noScoreChecked, setNoScoreChecked] = useState(false);
  const [fromRisk, setFromRisk] = useState("");
  const [toRisk, setToRisk] = useState("");

  React.useEffect(() => {
    setIsSanctionChecked(false);
    setNoScoreChecked(false);
    onChange("isSanction", false);
    onChange("noScore", false);
    clearRiskCoreSearchRange();
    // eslint-disable-next-line
  }, [reset]);

  const handleIsSanctionCheckBoxChange = (event) => {
    let checked = event.target.checked;
    onChange(event.target.name, checked);
    setIsSanctionChecked(checked);
    clearRiskCoreSearchRange();
  };

  const handleNoScoreCheckBoxChange = (event) => {
    let checked = event.target.checked;
    onChange(event.target.name, checked);
    setNoScoreChecked(checked);
    clearRiskCoreSearchRange();
  };

  const handleRiskFilterChange = (event) => {
    const value = event.target.value;
    const key = event.target.name;

    if (key === "fromRisk") {
      setFromRisk(value);
    } else {
      setToRisk(value);
    }

    onChange(key, value);
  };

  const clearRiskCoreSearchRange = () => {
    setFromRisk("");
    setToRisk("");
    onChange("fromRisk", "");
    onChange("toRisk", "");
  };

  return (
    <>
      <Button
        variant="outlined"
        className={clsx(styles.FilterButton, styles.FilterBorder, "mr-1")}
        endIcon={open ? <ExpandLess /> : <ExpandMore />}
        onClick={handleClick}
      >
        <span className={styles.textFilter}>
          <IntlMessages id={data.label} />
        </span>
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <div style={{ width: toRem(200), overflow: "hidden" }}>
          <Grid
            container
            style={{
              paddingLeft: toRem(15),
              paddingRight: toRem(15),
              marginTop: toRem(5),
            }}
            spacing={1}
          >
            <Grid item xs={12}>
              <span>
                <IntlMessages id="kyc.filter.riskScore.title" />
              </span>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                labelPlacement={"start"}
                classes={checkBoxLabelClasses}
                control={
                  <Checkbox
                    name="isSanction"
                    classes={{
                      root: checkBoxClasses.root,
                      checked: checkBoxClasses.checked,
                    }}
                    checked={isSanctionChecked}
                    onChange={handleIsSanctionCheckBoxChange}
                  />
                }
                label={
                  <div className="d-inline-flex align-items-center">
                    <div className={styles.textOverflow}>
                      <IntlMessages id="kyc.filter.riskScore.isSanction" />
                    </div>
                  </div>
                }
              ></FormControlLabel>
            </Grid>
            <Grid item xs={12}>
              <Grid
                container
                direction="row"
                justify="space-between"
                spacing={1}
              >
                <Grid item xs={6}>
                  <TextFieldLabel
                    name={"fromRisk"}
                    label={<IntlMessages id="kyc.filter.riskScore.from" />}
                    disabled={isSanctionChecked || noScoreChecked}
                    className={textBoxClasses.disableInput}
                    onChange={handleRiskFilterChange}
                    value={fromRisk}
                  ></TextFieldLabel>
                </Grid>
                <Grid item xs={6}>
                  <TextFieldLabel
                    name={"toRisk"}
                    label={<IntlMessages id="kyc.filter.riskScore.to" />}
                    disabled={isSanctionChecked || noScoreChecked}
                    className={textBoxClasses.disableInput}
                    onChange={handleRiskFilterChange}
                    value={toRisk}
                  ></TextFieldLabel>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Divider />
          <Grid
            container
            style={{ paddingLeft: toRem(15), paddingRight: toRem(15) }}
            spacing={1}
          >
            <Grid item xs={12}>
              <FormControlLabel
                labelPlacement={"start"}
                classes={checkBoxLabelClasses}
                control={
                  <Checkbox
                    name="noScore"
                    classes={{
                      root: checkBoxClasses.root,
                      checked: checkBoxClasses.checked,
                    }}
                    checked={noScoreChecked}
                    onChange={handleNoScoreCheckBoxChange}
                  />
                }
                label={
                  <div className="d-inline-flex align-items-center">
                    <div className={styles.textOverflow}>
                      <IntlMessages id="kyc.filter.riskScore.noScore" />
                    </div>
                  </div>
                }
              ></FormControlLabel>
            </Grid>
          </Grid>
        </div>
      </Popover>
    </>
  );
};

export default RiskScoreFilterComponent;
