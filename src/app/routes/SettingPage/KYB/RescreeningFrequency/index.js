import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import { makeStyles } from "@material-ui/styles";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import clsx from "clsx";
import { RISK_LEVEL_COLOR } from "constants/RiskLevelType";
import React from "react";
import { onlyNumbers } from "validations/constraints";
import styles from "../../SettingsPage.module.scss";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
const maxLengthInput = 5;

const useStyles = makeStyles({
  headCell: {
    backgroundColor: ThemeColors.backgroundHeader,
    color: ThemeColors.bodyText,
    fontWeight: 500,
    height: toRem(56),
    fontSize: toRem(12),
    border: 0,
    paddingLeft: `${toRem(25)} !important`,
  },
  cellRiskLevel: {
    backgroundColor: "transparent",
    paddingLeft: `${toRem(25)} !important`,
    fontSize: `${toRem(14)} !important`,
    fontWeight: `700 !important`,
  },
  rescreeningFrequency: {
    backgroundColor: "transparent",
    fontSize: `${toRem(14)} !important`,
    paddingLeft: `${toRem(25)} !important`,
    fontWeight: `400 !important`,
  },
  table: {
    // borderRadius: "6px",
    // border: "1px solid #EBEBEB",
    // borderCollapse: "separate",
  },
  flexCenter: {
    display: "flex",
    alignItems: "center",
  },
});

const ReScreeningFrequency = ({ riskLevelSetting, onChange, isDisabled }) => {
  const classes = useStyles();

  const handleChange = (name, val) => {
    const newChange = Object.assign({}, riskLevelSetting);
    newChange[name] = val;
    onChange(newChange);
  };

  return (
    <JRCard
      header={
        <IntlMessages id="setting.kyb.rescreeningFrequency"></IntlMessages>
      }
      className={clsx(styles.card, "mt-4")}
    >
      <>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell width="50%" className={classes.headCell}>
                <IntlMessages id="setting.kyb.riskLevel" />
              </TableCell>
              <TableCell width="50%" className={classes.headCell}>
                <IntlMessages id="setting.kyb.rescreeningFrequency" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                style={{ color: RISK_LEVEL_COLOR.LOW }}
                className={classes.cellRiskLevel}
              >
                <IntlMessages id="appModule.riskScore.low" />
              </TableCell>
              <TableCell className={classes.rescreeningFrequency}>
                <div className={classes.flexCenter}>
                  <TextField
                    variant="outlined"
                    disabled={isDisabled}
                    className={styles.inputRiskLevelSetting}
                    InputProps={{
                      disableUnderline: true,
                    }}
                    inputProps={{
                      min: 0,
                      fontSize: toRem(14),
                      maxLength: maxLengthInput,
                    }}
                    onInput={(e) => onlyNumbers(e)}
                    onChange={(e) => handleChange("LOW", e.target.value)}
                    value={riskLevelSetting?.LOW}
                    error={riskLevelSetting?.LOW === ""}
                  />
                  <span className={clsx(styles.TextLabel, "ml-2")}>
                    <IntlMessages id={"setting.tab.other.months"} />
                  </span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                style={{ color: RISK_LEVEL_COLOR.MEDIUM }}
                className={classes.cellRiskLevel}
              >
                <IntlMessages id="appModule.riskScore.medium" />
              </TableCell>
              <TableCell className={classes.rescreeningFrequency}>
                <div className={classes.flexCenter}>
                  <TextField
                    variant="outlined"
                    disabled={isDisabled}
                    className={styles.inputRiskLevelSetting}
                    InputProps={{
                      disableUnderline: true,
                    }}
                    inputProps={{
                      min: 0,
                      fontSize: toRem(14),
                      maxLength: maxLengthInput,
                    }}
                    onInput={(e) => onlyNumbers(e)}
                    onChange={(e) => handleChange("MEDIUM", e.target.value)}
                    value={riskLevelSetting?.MEDIUM}
                    error={riskLevelSetting?.MEDIUM === ""}
                  />
                  <span className={clsx(styles.TextLabel, "ml-2")}>
                    <IntlMessages id={"setting.tab.other.months"} />
                  </span>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                style={{ color: RISK_LEVEL_COLOR.HIGH }}
                className={classes.cellRiskLevel}
              >
                <IntlMessages id="appModule.riskScore.high" />
              </TableCell>
              <TableCell className={classes.rescreeningFrequency}>
                <div className={classes.flexCenter}>
                  <TextField
                    variant="outlined"
                    disabled={isDisabled}
                    className={styles.inputRiskLevelSetting}
                    InputProps={{
                      disableUnderline: true,
                    }}
                    inputProps={{
                      min: 0,
                      fontSize: toRem(14),
                      maxLength: maxLengthInput,
                    }}
                    onInput={(e) => onlyNumbers(e)}
                    onChange={(e) => handleChange("HIGH", e.target.value)}
                    value={riskLevelSetting?.HIGH}
                    error={riskLevelSetting?.HIGH === ""}
                  />
                  <span className={clsx(styles.TextLabel, "ml-2")}>
                    <IntlMessages id={"setting.tab.other.months"} />
                  </span>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </>
    </JRCard>
  );
};

export default ReScreeningFrequency;
