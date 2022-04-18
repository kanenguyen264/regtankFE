import {
  Box,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Grid,
} from "@mui/material";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { useFormikContext } from "formik";
import React from "react";
import { onlyNumbers } from "validations/constraints";
import styles from "./fatf.module.scss";
import TextField from "@protego/sdk/RegtankUI/v1/TextField/TextFieldOutlined";
import {
  ListScoreHeaderRow,
  ListScoreRow,
  listHeaderSecond,
  listHeaderThird,
} from "./items";
import { isNumeric } from "util/index";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";

export const listHeader = [
  {
    key: 2,
    label: <IntlMessages id={"setting.table.member"} />,
    value: "member",
  },
  { key: 3, label: <IntlMessages id={"setting.table.Apg"} />, value: "Apg" },
  {
    key: 4,
    label: <IntlMessages id={"setting.table.Highrisk"} />,
    value: "Highrisk",
  },
  {
    key: 5,
    label: <IntlMessages id={"setting.table.Blacklisted"} />,
    value: "Blacklisted",
  },
  {
    key: 6,
    label: <IntlMessages id={"setting.table.Other"} />,
    value: "Other",
  },
  {
    key: 7,
    label: <IntlMessages id={"setting.table.NoInFormation"} />,
    value: "NoInFormation",
  },
];
const FATFScore = React.memo((props) => {
  const [activeListScore, setActiveListScore] = React.useState();
  const [inActiveListScore, setInActiveListScore] = React.useState();
  const [listFATFScore, setListFATFScore] = React.useState();
  const formikContext = useFormikContext();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const newObject = { ...formikContext.values.fatfPepScore };
  const { isDisabled } = props;
  const maxLengthInput = 5;
  React.useEffect(() => {
    setActiveListScore(newObject.activePepScore);
    setInActiveListScore(newObject.inActivePepScore);
    setListFATFScore(newObject.fatfScore);
  }, [newObject]);

  const updateFormValues = (data) => {
    const newObject = { ...formikContext.values.fatfPepScore };
    const updateObj = {
      ...newObject,
      ...data,
    };
    formikContext.setFieldValue("fatfPepScore", updateObj);
  };

  const inputChangeHandler = (e, item) => {
    if (isNumeric(e.target.value)) {
      updateFormValues({
        fatfScore: {
          ...item,
          Apg: e.target.value ? parseInt(e.target.value) : 0,
        },
      });
    }
  };

  const inputChangeHandlerHighRisk = (e, item) => {
    if (isNumeric(e.target.value)) {
      updateFormValues({
        fatfScore: {
          ...item,
          HighRisk: e.target.value ? parseInt(e.target.value) : 0,
        },
      });
    }
  };
  const inputChangeHandlerNonFATF = (e, item) => {
    if (isNumeric(e.target.value)) {
      updateFormValues({
        fatfScore: {
          ...item,
          NonFatf: e.target.value ? parseInt(e.target.value) : 0,
        },
      });
    }
  };

  const inputChangeHandlerNoInformation = (e, item) => {
    if (isNumeric(e.target.value)) {
      updateFormValues({
        fatfScore: {
          ...item,
          NoInformation: e.target.value ? parseInt(e.target.value) : 0,
        },
      });
    }
  };

  const inputChangeHandlerBlackList = (e, item) => {
    if (isNumeric(e.target.value)) {
      updateFormValues({
        fatfScore: {
          ...item,
          Blacklist: e.target.value ? parseInt(e.target.value) : 0,
        },
      });
    }
  };

  const inputChangeHandlerTier3 = (e, item, isActive = true) => {
    if (isNumeric(e.target.value)) {
      updateFormValues({
        [isActive ? "activePepScore" : "inActivePepScore"]: {
          ...item,
          TierThree: e.target.value ? parseInt(e.target.value) : 0,
        },
      });
    }
  };

  const inputChangeHandlerTier2 = (e, item, isActive = true) => {
    if (isNumeric(e.target.value)) {
      updateFormValues({
        [isActive ? "activePepScore" : "inActivePepScore"]: {
          ...item,
          TierTwo: e.target.value ? parseInt(e.target.value) : 0,
        },
      });
    }
  };

  const inputChangeHandlerRCA = (e, item, isActive = true) => {
    if (isNumeric(e.target.value)) {
      updateFormValues({
        [isActive ? "activePepScore" : "inActivePepScore"]: {
          ...item,
          RCA: e.target.value ? parseInt(e.target.value) : 0,
        },
      });
    }
  };
  return (
    <div className={styles.fatfWrapper}>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 2 }}>
        <Grid className={styles.headerBlock} item xs={12}>
          <IntlMessages id={"setting.table.FATFSetting"} />
        </Grid>
        <Grid item xs={6}>
          <TextField
            disabled={true}
            value={listFATFScore?.Members}
            InputProps={{ disableUnderline: true }}
            inputProps={{
              min: 0,
              maxLength: maxLengthInput,
            }}
            className={styles.tableCellInput}
            onInput={(e) => onlyNumbers(e)}
            label={<IntlMessages id={"setting.table.member"} />}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            disabled={isDisabled}
            value={listFATFScore?.Apg}
            InputProps={{ disableUnderline: true }}
            inputProps={{
              min: 0,
              maxLength: maxLengthInput,
            }}
            className={styles.tableCellInput}
            onChange={(e) => inputChangeHandler(e, listFATFScore)}
            onInput={(e) => onlyNumbers(e)}
            label={<IntlMessages id={"setting.table.Apg"} />}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            disabled={isDisabled}
            InputProps={{ disableUnderline: true }}
            inputProps={{
              min: 0,
              maxLength: maxLengthInput,
            }}
            className={styles.tableCellInput}
            value={listFATFScore?.HighRisk}
            onChange={(e) => inputChangeHandlerHighRisk(e, listFATFScore)}
            onInput={(e) => onlyNumbers(e)}
            label={<IntlMessages id={"setting.table.Highrisk"} />}
          ></TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            disabled={isDisabled}
            InputProps={{ disableUnderline: true }}
            inputProps={{
              min: 0,
              maxLength: maxLengthInput,
            }}
            className={styles.tableCellInput}
            value={listFATFScore?.Blacklist}
            onChange={(e) => inputChangeHandlerBlackList(e, listFATFScore)}
            onInput={(e) => onlyNumbers(e)}
            label={<IntlMessages id={"setting.table.Blacklisted"} />}
          ></TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            disabled={isDisabled}
            value={listFATFScore?.NonFatf}
            InputProps={{ disableUnderline: true }}
            inputProps={{
              min: 0,
              maxLength: maxLengthInput,
            }}
            className={styles.tableCellInput}
            onChange={(e) => inputChangeHandlerNonFATF(e, listFATFScore)}
            onInput={(e) => onlyNumbers(e)}
            label={<IntlMessages id={"setting.table.Other"} />}
          ></TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            disabled={isDisabled}
            InputProps={{ disableUnderline: true }}
            inputProps={{
              min: 0,
              maxLength: maxLengthInput,
            }}
            className={styles.tableCellInput}
            value={listFATFScore?.NoInformation}
            onChange={(e) => inputChangeHandlerNoInformation(e, listFATFScore)}
            onInput={(e) => onlyNumbers(e)}
            label={<IntlMessages id={"setting.table.NoInFormation"} />}
          ></TextField>
        </Grid>
      </Grid>
      <ListScoreRow
        headerTitle={<IntlMessages id={"setting.table.activePEPSetting"} />}
        data={activeListScore}
        isDisabled={isDisabled}
        onChangeRCA={inputChangeHandlerRCA}
        onChangeTier2={inputChangeHandlerTier2}
        onChangeTier3={inputChangeHandlerTier3}
        tooltipHeader={"DowJonesActivePepScoreSetting"}
      />
      <ListScoreRow
        headerTitle={<IntlMessages id={"setting.table.inactivePEPSetting"} />}
        data={inActiveListScore}
        isDisabled={isDisabled}
        onChangeRCA={(e, item) => inputChangeHandlerRCA(e, item, false)}
        onChangeTier2={(e, item) => inputChangeHandlerTier2(e, item, false)}
        onChangeTier3={(e, item) => inputChangeHandlerTier3(e, item, false)}
        tooltipHeader={"DowJonesInActivePepScoreSetting"}
      />
    </div>
  );
});

export default FATFScore;
