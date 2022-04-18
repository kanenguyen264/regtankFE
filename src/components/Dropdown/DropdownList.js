import { MenuItem } from "@mui/material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Select from "@protego/sdk/RegtankUI/v1/Select";
import * as React from "react";
import styles from "./styles.module.scss";
const DropdownList = function DropdownList({
  disableRounded,
  value,
  onChange,
  data,
}: StatusProps) {
  return (
    <Select
      MenuProps={{
        classes: { paper: styles.menuPaper },
      }}
      value={value}
      style={{ margin: 0 }}
      withFormControlProps={{ fullWidth: true }}
      onChange={(e) => onChange(e.target.value)}
    >
      <MenuItem value={-1} style={{ display: "none" }}>
        <IntlMessages id={"kyb.designation.select"} />
      </MenuItem>
      {data?.map((opt, index) => (
        <MenuItem key={index} value={opt.value}>
          <IntlMessages id={opt.label} />
        </MenuItem>
      ))}
    </Select>
  );
};

export default DropdownList;
