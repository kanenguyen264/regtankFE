import React from "react";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import ToolTipMore from "components/ToolTip";
import styles from "./fatf.module.scss";
import { onlyNumbers } from "validations/constraints";
import {
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Grid,
} from "@mui/material";
import TextField from "@protego/sdk/RegtankUI/v1/TextField/TextFieldOutlined";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
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
export const listHeaderSecond = [
  {
    key: 1,
    name: "PEPSetting",
    label: <IntlMessages id={"setting.table.activePEPSetting"} />,
    tooltip: "DowJonesActivePepScoreSetting",
  },
  {
    key: 2,
    name: "NotPEP",
    label: <IntlMessages id={"setting.table.NotPEP"} />,
  },
  {
    key: 3,
    name: "RCA",
    label: <IntlMessages id={"setting.djkyc.RCA"} />,
    tooltip: "DowJonesRCAScoreSetting",
  },
  {
    key: 4,
    name: "Tier3",
    label: <IntlMessages id={"setting.table.Tier3"} />,
    tooltip: "DowJonesTier3ScoreSetting",
  },
  {
    key: 5,
    name: "Tier2",
    label: <IntlMessages id={"setting.table.Tier2"} />,
    tooltip: "DowJonesTier2ScoreSetting",
  },
  {
    key: 6,
    name: "Tier1",
    label: <IntlMessages id={"setting.table.Tier1"} />,
    tooltip: "DowJonesTier1ScoreSetting",
  },
];

export const listHeaderThird = [
  {
    key: 1,
    name: "PEPSetting",
    label: <IntlMessages id={"setting.table.inactivePEPSetting"} />,
    tooltip: "DowJonesInActivePepScoreSetting",
  },
  {
    key: 2,
    name: "NotPEP",
    label: <IntlMessages id={"setting.table.NotPEP"} />,
  },
  {
    key: 3,
    name: "RCA",
    label: <IntlMessages id={"setting.djkyc.RCA"} />,
    tooltip: "DowJonesRCAScoreSetting",
  },
  {
    key: 4,
    name: "Tier3",
    label: <IntlMessages id={"setting.table.Tier3"} />,
    tooltip: "DowJonesTier3ScoreSetting",
  },
  {
    key: 5,
    name: "Tier2",
    label: <IntlMessages id={"setting.table.Tier2"} />,
    tooltip: "DowJonesTier2ScoreSetting",
  },
  {
    key: 6,
    name: "Tier1",
    label: <IntlMessages id={"setting.table.Tier1"} />,
    tooltip: "DowJonesTier1ScoreSetting",
  },
];

const maxLengthInput = 5;

export const ListScoreHeaderRow = ({ data }) => {
  return (
    <TableHead>
      {data.map((item, index) => {
        return (
          <TableCell key={index}>
            <div
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div className={"d-flex"}>
                <Typography>{item.label}</Typography>
                {item.tooltip && <ToolTipMore content={item.tooltip} />}
              </div>
            </div>
          </TableCell>
        );
      })}
      <TableCell></TableCell>
    </TableHead>
  );
};

export const ListScoreRow = ({
  data,
  isDisabled = false,
  onChangeRCA,
  onChangeTier2,
  onChangeTier3,
  headerTitle,
  tooltipHeader,
}) => {
  return (
    <Grid
      container
      rowSpacing={2}
      columnSpacing={{ xs: 2 }}
      style={{ marginTop: toRem(20) }}
    >
      <Grid className={styles.headerBlock} item xs={12}>
        <div className={"d-flex"}>
          {headerTitle}{" "}
          <span>
            {tooltipHeader && (
              <ToolTipMore placement="top-start" content={tooltipHeader} />
            )}
          </span>
        </div>
      </Grid>
      <Grid item xs={6}>
        <TextField
          disabled={true}
          InputProps={{ disableUnderline: true }}
          inputProps={{
            min: 0,
            maxLength: maxLengthInput,
          }}
          className={styles.tableCellInput}
          value={data?.NotPep ? data.NotPep : 0}
          onInput={(e) => onlyNumbers(e)}
          label={<IntlMessages id={"setting.table.NotPEP"} />}
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
          value={data?.RCA}
          onChange={(e) => onChangeRCA(e, data)}
          onInput={(e) => onlyNumbers(e)}
          label={
            <div className={"d-flex"}>
              <IntlMessages id={"setting.djkyc.RCA"} />
              <span>
                <ToolTipMore
                  placement="top-start"
                  content={"DowJonesRCAScoreSetting"}
                />
              </span>
            </div>
          }
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
          value={data?.TierThree}
          onChange={(e) => onChangeTier3(e, data)}
          onInput={(e) => onlyNumbers(e)}
          label={
            <div className={"d-flex"}>
              <IntlMessages id={"setting.table.Tier3"} />
              <span>
                <ToolTipMore
                  placement="top-start"
                  content={"DowJonesTier3ScoreSetting"}
                />
              </span>
            </div>
          }
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
          value={data?.TierTwo}
          onChange={(e) => onChangeTier2(e, data)}
          onInput={(e) => onlyNumbers(e)}
          label={
            <div className={"d-flex"}>
              <IntlMessages id={"setting.table.Tier2"} />
              <span>
                <ToolTipMore
                  placement="top-start"
                  content={"DowJonesTier2ScoreSetting"}
                />
              </span>
            </div>
          }
        ></TextField>
      </Grid>
      <Grid item xs={6}>
        <TextField
          disabled={true}
          InputProps={{ disableUnderline: true }}
          inputProps={{
            min: 0,
            maxLength: maxLengthInput,
          }}
          className={styles.tableCellInput}
          value={data?.TierOne}
          onInput={(e) => onlyNumbers(e)}
          label={
            <div className={"d-flex"}>
              <IntlMessages id={"setting.table.Tier1"} />
              <span>
                <ToolTipMore
                  placement="top-start"
                  content={"DowJonesTier1ScoreSetting"}
                />
              </span>
            </div>
          }
        ></TextField>
      </Grid>
    </Grid>
  );
};
