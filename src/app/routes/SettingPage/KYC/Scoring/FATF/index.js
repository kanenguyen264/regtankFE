import {
  Grid
} from "@mui/material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import TextField from "@protego/sdk/RegtankUI/v1/TextField/TextFieldOutlined";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { useFormikContext } from "formik";
import React from "react";
import { onlyNumbers } from "validations/constraints";
import styles from "./fatf.module.scss";

const listHeader = [
  { key: 1, label: <IntlMessages id={"setting.table.FATFSetting"} /> },
  { key: 2, label: <IntlMessages id={"setting.table.member"} /> },
  { key: 3, label: <IntlMessages id={"setting.table.Apg"} /> },
  { key: 4, label: <IntlMessages id={"setting.table.Highrisk"} /> },
  { key: 5, label: <IntlMessages id={"setting.table.Blacklisted"} /> },
  { key: 6, label: <IntlMessages id={"setting.table.Other"} /> },
  { key: 7, label: <IntlMessages id={"setting.table.NoInFormation"} /> },
];
const listHeaderSecond = [
  {
    key: 1,
    name: "PEPSetting",
    label: <IntlMessages id={"setting.table.PEPSetting"} />,
  },
  {
    key: 2,
    name: "NotPEP",
    label: <IntlMessages id={"setting.table.NotPEP"} />,
  },
  {
    key: 3,
    name: "Tier4",
    label: <IntlMessages id={"setting.table.Tier4"} />,
  },
  { key: 4, name: "Tier3", label: <IntlMessages id={"setting.table.Tier3"} /> },
  { key: 5, name: "Tier2", label: <IntlMessages id={"setting.table.Tier2"} /> },
  { key: 6, name: "Tier1", label: <IntlMessages id={"setting.table.Tier1"} /> },
];

const FATFScore = React.memo((props) => {
  const [listScore, setListScore] = React.useState();
  const [listFATFScore, setListFATFScore] = React.useState();
  const formikContext = useFormikContext();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const newObject = { ...formikContext.values.fatfPepScore };
  const { isDisabled } = props;
  const maxLengthInput = 5;
  React.useEffect(() => {
    setListScore(newObject.fatfScore);
    setListFATFScore(newObject.pepScore);
  }, [newObject]);

  const isNumeric = (value) => {
    var regex = /^[+]*[0-9]*$/;
    if (isNaN(value / 2) && !regex.test(value)) {
      return false;
    }
    return true;
  };

  const inputChangeHandler = (e, item) => {
    if (isNumeric(e.target.value)) {
      const new_obj = {
        ...item,
        Apg: e.target.value ? parseInt(e.target.value) : 0,
      };

      const newObject = { ...formikContext.values.fatfPepScore };
      const updateObj = {
        ...newObject,
        fatfScore: new_obj,
        pepScore: newObject.pepScore,
      };
      formikContext.setFieldValue("fatfPepScore", updateObj);
    }
  };

  const inputChangeHandlerHighRisk = (e, item) => {
    if (isNumeric(e.target.value)) {
      const new_obj = {
        ...item,
        HighRisk: e.target.value ? parseInt(e.target.value) : 0,
      };

      const newObject = { ...formikContext.values.fatfPepScore };
      const updateObj = {
        ...newObject,
        fatfScore: new_obj,
        pepScore: newObject.pepScore,
      };
      formikContext.setFieldValue("fatfPepScore", updateObj);
    }
  };
  const inputChangeHandlerNonFATF = (e, item) => {
    if (isNumeric(e.target.value)) {
      const new_obj = {
        ...item,
        NonFatf: e.target.value ? parseInt(e.target.value) : 0,
      };

      const newObject = { ...formikContext.values.fatfPepScore };
      const updateObj = {
        ...newObject,
        fatfScore: new_obj,
        pepScore: newObject.pepScore,
      };
      formikContext.setFieldValue("fatfPepScore", updateObj);
    }
  };

  const inputChangeHandlerNoInformation = (e, item) => {
    if (isNumeric(e.target.value)) {
      const new_obj = {
        ...item,
        NoInformation: e.target.value ? parseInt(e.target.value) : 0,
      };

      const newObject = { ...formikContext.values.fatfPepScore };
      const updateObj = {
        ...newObject,
        fatfScore: new_obj,
        pepScore: newObject.pepScore,
      };
      formikContext.setFieldValue("fatfPepScore", updateObj);
    }
  };

  const inputChangeHandlerBlackList = (e, item) => {
    if (isNumeric(e.target.value)) {
      const new_obj = {
        ...item,
        Blacklist: e.target.value ? parseInt(e.target.value) : 0,
      };
      const newObject = { ...formikContext.values.fatfPepScore };
      const updateObj = {
        ...newObject,
        fatfScore: new_obj,
        pepScore: newObject.pepScore,
      };
      formikContext.setFieldValue("fatfPepScore", updateObj);
    }
  };

  const inputChangeHandlerTier3 = (e, item) => {
    if (isNumeric(e.target.value)) {
      const new_obj = {
        ...item,
        TierThree: e.target.value ? parseInt(e.target.value) : 0,
      };

      const newObject = { ...formikContext.values.fatfPepScore };
      const updateObj = {
        ...newObject,
        fatfScore: newObject.fatfScore,
        pepScore: new_obj,
      };
      formikContext.setFieldValue("fatfPepScore", updateObj);
    }
  };

  const inputChangeHandlerTier2 = (e, item) => {
    if (isNumeric(e.target.value)) {
      const new_obj = {
        ...item,
        TierTwo: e.target.value ? parseInt(e.target.value) : 0,
      };
      const newObject = { ...formikContext.values.fatfPepScore };
      const updateObj = {
        ...newObject,
        fatfScore: newObject.fatfScore,
        pepScore: new_obj,
      };
      formikContext.setFieldValue("fatfPepScore", updateObj);
    }
  };

  const inputChangeHandlerTier4 = (e, item) => {
    if (isNumeric(e.target.value)) {
      const new_obj = {
        ...item,
        TierFour: e.target.value ? parseInt(e.target.value) : 0,
      };
      const newObject = { ...formikContext.values.fatfPepScore };
      const updateObj = {
        ...newObject,
        fatfScore: newObject.fatfScore,
        pepScore: new_obj,
      };
      formikContext.setFieldValue("fatfPepScore", updateObj);
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
            fullWidth
            disabled={true}
            value={listScore?.Members}
            variant={"outlined"}
            label={"Member"}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            disabled={isDisabled}
            value={listScore?.Apg}
            onChange={(e) => inputChangeHandler(e, listScore)}
            onInput={(e) => onlyNumbers(e)}
            inputProps={{
              min: 0,
              maxLength: maxLengthInput,
            }}
            variant={"outlined"}
            label={"APG"}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            disabled={isDisabled}
            value={listScore?.HighRisk}
            onChange={(e) => inputChangeHandlerHighRisk(e, listScore)}
            onInput={(e) => onlyNumbers(e)}
            inputProps={{
              min: 0,
              maxLength: maxLengthInput,
            }}
            variant={"outlined"}
            label={"High-risk Jurisdictions"}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            disabled={isDisabled}
            value={listScore?.Blacklist}
            onChange={(e) => inputChangeHandlerBlackList(e, listScore)}
            onInput={(e) => onlyNumbers(e)}
            variant={"outlined"}
            inputProps={{
              min: 0,
              maxLength: maxLengthInput,
            }}
            label={"Blacklisted"}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            disabled={isDisabled}
            value={listScore?.NonFatf}
            onChange={(e) => inputChangeHandlerNonFATF(e, listScore)}
            onInput={(e) => onlyNumbers(e)}
            inputProps={{
              min: 0,
              maxLength: maxLengthInput,
            }}
            variant={"outlined"}
            label={"Others"}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            disabled={isDisabled}
            value={listScore?.NoInformation}
            onChange={(e) => inputChangeHandlerNoInformation(e, listScore)}
            onInput={(e) => onlyNumbers(e)}
            variant={"outlined"}
            inputProps={{
              min: 0,
              maxLength: maxLengthInput,
            }}
            label="No Information"
          />
        </Grid>
      </Grid>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 2 }} style={{marginTop: toRem(33)}}>
        <Grid className={styles.headerBlock} item xs={12}>
          <IntlMessages id={"setting.table.PEPSetting"} />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            disabled={true}
            value={listFATFScore?.TierOne}
            variant={"outlined"}
            label={"Tier 1"}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            disabled={isDisabled}
            value={listFATFScore?.TierTwo}
            onChange={(e) => inputChangeHandlerTier2(e, listFATFScore)}
            onInput={(e) => onlyNumbers(e)}
            variant={"outlined"}
            label={"Tier 2"}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            disabled={isDisabled}
            className={styles.tableCellInput}
            value={listFATFScore?.TierThree}
            onChange={(e) => inputChangeHandlerTier3(e, listFATFScore)}
            onInput={(e) => onlyNumbers(e)}
            variant={"outlined"}
            label={"Tier 3"}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            disabled={isDisabled}
            value={listFATFScore?.TierFour}
            onChange={(e) => inputChangeHandlerTier4(e, listFATFScore)}
            onInput={(e) => onlyNumbers(e)}
            variant={"outlined"}
            label={"Tier 4"}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            disabled={true}
            value={listFATFScore?.NotPep || 0}
            variant={"outlined"}
            label={"NOT PEP"}
          />
        </Grid>
      </Grid>
    </div>
  );
});

export default FATFScore;
