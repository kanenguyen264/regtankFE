import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import TextField from "@protego/sdk/RegtankUI/v1/TextField/TextFieldOutlined";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import clsx from "clsx";
import { RISK_LEVEL_COLOR } from "constants/RiskLevelType";
import { useFormikContext } from "formik";
import React from "react";
import { onlyNumbers } from "validations/constraints";
import styles from "../../../SettingsPage.module.scss";
import { toRem } from "@protego/sdk/utils/measurements";
import { isNumeric } from "util/index";

const Other = React.memo((props) => {
  const formikContext = useFormikContext();
  const {
    values: { otherSetting },
  } = formikContext;

  const { isDisabled, errors } = props;
  const maxLengthInput = 5;

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
    <Table className={clsx(styles.TablePadding, styles.RiskLevelTbl)}>
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
                  className={styles.tableCellInputOther}
                  onInput={(e) => onlyNumbers(e)}
                  onChange={(e) => handleChangeValue(e, "lowReScreening")}
                  value={otherSetting?.lowReScreening}
                />
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
                  InputProps={{ disableUnderline: true }}
                  inputProps={{
                    min: 0,
                    maxLength: maxLengthInput,
                  }}
                  error={errors?.medium}
                  onInput={(e) => onlyNumbers(e)}
                  onChange={(e) => handleChangeValue(e, "mediumScore")}
                  value={otherSetting?.mediumScore}
                />
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
                  className={styles.tableCellInputOther}
                  onInput={(e) => onlyNumbers(e)}
                  onChange={(e) => handleChangeValue(e, "mediumReScreening")}
                  value={otherSetting?.mediumReScreening}
                />
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
                  onInput={(e) => onlyNumbers(e)}
                  onChange={(e) => handleChangeValue(e, "highReScreening")}
                  value={otherSetting?.highReScreening}
                />
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
