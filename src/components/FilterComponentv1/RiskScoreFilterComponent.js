import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  Popover,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { TextFieldOutlined } from "@protego/sdk/RegtankUI/v1/TextField";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import clsx from "clsx";
import React, { useState } from "react";
import styles from "./FilterComponent.module.scss";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
const checkBoxLabelStyles = makeStyles({
  root: {
    margin: "0 !important",
  },
  labelPlacementStart: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
});
const useStyles = makeStyles({
  labelPlacementStart: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  dropdown: {
    paddingTop: toRem(12),
    paddingBottom: toRem(12),
    backgroundColor: `${ThemeColors.white} !important`,
  },
  rounded: {
    borderRadius: toRem(8),
  },
  dropdownLabel: {
    textAlign: "center",
  },
  panel: {
    borderRadius: toRem(4),
    overflow: "hidden",
    backgroundColor: "#fff",
  },
});

const textBoxStyles = makeStyles({
  disableInput: {
    "& .MuiInputBase-input.Mui-disabled": {
      backgroundColor: ThemeColors.disabledBg,
    },
  },
});

const TextFieldLabel = function TextFieldLabel(props) {
  return (
    <div>
      <TextFieldOutlined
        variant={"outlined"}
        inputProps={{
          min: 0,
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
  const open = Boolean(anchorEl),
    anchorOrigin = {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin = {
      vertical: "top",
      horizontal: "left",
    };
  const checkBoxLabelClasses = checkBoxLabelStyles();
  const textBoxClasses = textBoxStyles();
  const [isSanctionChecked, setIsSanctionChecked] = useState(false);
  const [noScoreChecked, setNoScoreChecked] = useState(false);
  const [fromRisk, setFromRisk] = useState("");
  const [toRisk, setToRisk] = useState("");
  const classes = useStyles();
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
        className={clsx(classes.dropdown, classes.rounded)}
        variant={"outlinedDropdown"}
        size={"small"}
        endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        onClick={handleClick}
      >
        <Typography variant="labelFieldForm">
          {<IntlMessages id={data.label} />}
        </Typography>
      </Button>

      <Popover
        anchorOrigin={anchorOrigin}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        className={styles.popover}
      >
        <div style={{ width: toRem(200), overflow: "hidden" }}>
          <Grid
            container
            style={{
              paddingLeft: toRem(15),
              paddingRight: toRem(15),
              marginTop: toRem(5),
            }}
            rowSpacing={1}
          >
            <Grid item xs={12}>
              <Typography variant="subtitleGray">
                <IntlMessages id="kyc.filter.riskScore.title" />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                labelPlacement={"start"}
                classes={checkBoxLabelClasses}
                control={
                  <Checkbox
                    style={{ padding: 0 }}
                    name="isSanction"
                    checked={isSanctionChecked}
                    onChange={handleIsSanctionCheckBoxChange}
                  />
                }
                label={
                  <div className="d-inline-flex align-items-center">
                    <Typography variant="subtitleGray">
                      <IntlMessages id="kyc.filter.riskScore.isSanction" />
                    </Typography>
                  </div>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Grid
                container
                direction="row"
                justify="space-between"
                columnSpacing={1}
              >
                <Grid item xs={6}>
                  <TextFieldLabel
                    name={"fromRisk"}
                    label={<IntlMessages id="kyc.filter.riskScore.from" />}
                    disabled={isSanctionChecked || noScoreChecked}
                    className={textBoxClasses.disableInput}
                    onChange={handleRiskFilterChange}
                    value={fromRisk}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextFieldLabel
                    name={"toRisk"}
                    label={<IntlMessages id="kyc.filter.riskScore.to" />}
                    disabled={isSanctionChecked || noScoreChecked}
                    className={textBoxClasses.disableInput}
                    onChange={handleRiskFilterChange}
                    value={toRisk}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} className={"mb-3"}>
              <hr />
              <FormControlLabel
                labelPlacement={"start"}
                classes={checkBoxLabelClasses}
                control={
                  <Checkbox
                    style={{ padding: 0 }}
                    name="noScore"
                    checked={noScoreChecked}
                    onChange={handleNoScoreCheckBoxChange}
                  />
                }
                label={
                  <Typography variant="labelFieldForm">
                    <div className="d-inline-flex align-items-center">
                      <div className={styles.textOverflow}>
                        <IntlMessages id="kyc.filter.riskScore.noScore" />
                      </div>
                    </div>
                  </Typography>
                }
              />
            </Grid>
          </Grid>
        </div>
      </Popover>
    </>
  );
};

export default RiskScoreFilterComponent;
