import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import TextField from "@protego/sdk/RegtankUI/v1/TextField/TextFieldOutlined";
import clsx from "clsx";
import { RISK_LEVEL_COLOR } from "constants/RiskLevelType";
import { useFormikContext } from "formik";
import React from "react";
import { onlyNumbers } from "validations/constraints";
import styles from "../../../../SettingsPage.module.scss";

const Other = React.memo((props) => {
  const formikContext = useFormikContext();
  const {
    values: { otherSetting },
  } = formikContext;

  const { isDisabled, errors } = props;
  const maxLengthInput = 5;

  const isNumeric = (value) => {
    var regex = /^[+]*[0-9]*$/;
    if (!regex.test(value)) {
      return false;
    }
    return true;
  };

  const handleChangeValue = async (e, key) => {
    if (isNumeric(e.target.value)) {
      const newObject = { ...formikContext.values.otherSetting };
      const newValue = e.target.value ? parseInt(e.target.value) : 0;
      newObject[key] = newValue;
      if (key === "mediumScore") {
        newObject["highScore"] = newValue + 1;
      }
      formikContext.setFieldValue("otherSetting", newObject);
    }
  };

  return (
    <Table
      className={styles.RiskLevelTbl}
      style={{ borderCollapse: "separate" }}
    >
      <TableHead>
        <TableRow>
          <TableCell style={{ width: "30%" }}>
            <IntlMessages id={"setting.tab.other.RiskLevel"} />
          </TableCell>
          <TableCell style={{ width: "50%", paddingLeft: 0 }}>
            <IntlMessages id={"setting.tab.other.scoreThreshold"} />
          </TableCell>
          <TableCell style={{ width: "20%", paddingLeft: 0 }}>
            <IntlMessages id={"setting.tab.other.ReScreeningFrequency"} />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {/* LOW */}
        <TableRow>
          <TableCell
            style={{ color: RISK_LEVEL_COLOR.LOW, fontWeight: "bold" }}
          >
            <IntlMessages id={"appModule.riskScore.low"} />
          </TableCell>
          <TableCell padding={"none"}>
            <div style={{ alignItems: "center", display: "flex" }}>
              <div className={"mr-2"}>
                <IntlMessages id="setting.table.aRiskScoreLessThan" />
              </div>
              <div className={styles.inputScoring}>
                <TextField
                  name="lowScore"
                  className={styles.tableCellInput}
                  InputProps={{ disableUnderline: true }}
                  inputProps={{
                    min: 0,
                    maxLength: maxLengthInput,
                  }}
                  disabled={isDisabled}
                  error={errors.low}
                  onInput={(e) => onlyNumbers(e)}
                  onChange={(e) => handleChangeValue(e, "lowScore")}
                  value={otherSetting?.lowScore}
                  variant="outlined"
                />
              </div>
              <div className={"ml-2"}>
                <IntlMessages id="setting.table.hasALowRisk" />
              </div>
            </div>
          </TableCell>
          <TableCell padding={"none"}>
            <div style={{ alignItems: "center", display: "flex" }}>
              <div className={styles.inputScoring}>
                <TextField
                  disabled={isDisabled}
                  name="lowReScreening"
                  InputProps={{ disableUnderline: true }}
                  inputProps={{
                    min: 0,
                    maxLength: maxLengthInput,
                  }}
                  className={styles.tableCellInput}
                  onInput={(e) => onlyNumbers(e)}
                  onChange={(e) => handleChangeValue(e, "lowReScreening")}
                  value={otherSetting?.lowReScreening}
                  variant="outlined"
                ></TextField>
              </div>
              <span className={clsx(styles.TextLabel, "pl-2")}>
                <IntlMessages id={"setting.tab.other.months"} />
              </span>
            </div>
          </TableCell>
        </TableRow>

        {/* MEDIUM */}
        <TableRow>
          <TableCell
            style={{ color: RISK_LEVEL_COLOR.MEDIUM, fontWeight: "bold" }}
          >
            <IntlMessages id={"appModule.riskScore.medium"} />
          </TableCell>
          <TableCell padding={"none"}>
            <div style={{ alignItems: "center", display: "flex" }}>
              <div className={"mr-2"}>
                <IntlMessages id="setting.table.ARiskScoreFrom" />
                <strong>{`${Number(otherSetting?.lowScore) + 1}`}</strong>
                <span>
                  <IntlMessages id="setting.table.to" />
                </span>
              </div>
              <div className={styles.inputScoring}>
                <TextField
                  disabled={isDisabled}
                  name="mediumScore"
                  className={styles.tableCellInput}
                  InputProps={{ disableUnderline: true }}
                  inputProps={{
                    min: 0,
                    maxLength: maxLengthInput,
                  }}
                  error={errors?.medium}
                  onInput={(e) => onlyNumbers(e)}
                  onChange={(e) => handleChangeValue(e, "mediumScore")}
                  value={otherSetting?.mediumScore}
                  variant="outlined"
                ></TextField>
              </div>
              <div className={"ml-2"}>
                <IntlMessages id="setting.table.hasAMediumRisk" />
              </div>
            </div>
          </TableCell>
          <TableCell padding={"none"}>
            <div style={{ alignItems: "center", display: "flex" }}>
              <div className={styles.inputScoring}>
                <TextField
                  disabled={isDisabled}
                  name="mediumReScreening"
                  InputProps={{ disableUnderline: true }}
                  inputProps={{
                    min: 0,
                    maxLength: maxLengthInput,
                  }}
                  className={styles.tableCellInput}
                  onInput={(e) => onlyNumbers(e)}
                  onChange={(e) => handleChangeValue(e, "mediumReScreening")}
                  value={otherSetting?.mediumReScreening}
                  variant="outlined"
                ></TextField>
              </div>
              <span className={clsx(styles.TextLabel, "pl-2")}>
                <IntlMessages id={"setting.tab.other.months"} />
              </span>
            </div>
          </TableCell>
        </TableRow>

        {/* HIGH */}
        <TableRow>
          <TableCell
            style={{ color: RISK_LEVEL_COLOR.HIGH, fontWeight: "bold" }}
          >
            <IntlMessages id={"appModule.riskScore.high"} />
          </TableCell>
          <TableCell padding={"none"}>
            <div style={{ alignItems: "center", display: "flex" }}>
              <div className={"mr-1"}>
                <IntlMessages id="setting.table.aRiskScoreMoreThan" />
              </div>
              <div>
                <strong>{otherSetting?.highScore - 1}</strong>
              </div>
              <div className="ml-1">
                <IntlMessages id="setting.table.hasAHighRisk" />
              </div>
            </div>
          </TableCell>
          <TableCell padding={"none"}>
            <div style={{ alignItems: "center", display: "flex" }}>
              <div className={styles.inputScoring}>
                <TextField
                  disabled={isDisabled}
                  name="otherSetting.highReScreening"
                  InputProps={{ disableUnderline: true }}
                  inputProps={{
                    min: 0,
                    maxLength: maxLengthInput,
                  }}
                  className={styles.tableCellInput}
                  onInput={(e) => onlyNumbers(e)}
                  onChange={(e) => handleChangeValue(e, "highReScreening")}
                  value={otherSetting?.highReScreening}
                  variant="outlined"
                ></TextField>
              </div>
              <text className={clsx(styles.TextLabel, "pl-2")}>
                <IntlMessages id={"setting.tab.other.months"} />
              </text>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
});

export default Other;
