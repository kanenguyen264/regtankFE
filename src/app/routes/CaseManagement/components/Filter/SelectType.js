import React from "react";
import { ReactComponent as IconSelect } from "assets/icons/IcoSelectArrow.svg";
import styles from "./style.module.scss";
import MenuItem from "@mui/material/MenuItem";
import { SvgIcon, Select, FormControl } from "@mui/material";
import Checkbox from "@protego/sdk/RegtankUI/v1/Checkbox";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";

const SelectType = ({ data, onChange = null, fields }) => {
  return (
    <FormControl className={styles.selectType}>
      <Select
        displayEmpty
        multiple
        value={[]}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return <span>Status</span>;
          }

          return selected.join(", ");
        }}
        inputProps={{ "aria-label": "Without label" }}
        MenuProps={{
          classes: { paper: styles.selectType_popover },
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
        }}
        IconComponent={() => {
          return <SvgIcon viewBox={"0 0 12 8"} component={IconSelect} />;
        }}
        className={styles.selectType_list}
      >
        {data &&
          data?.map((item) => {
            let checked = fields?.filterValues?.find((val) => val === item?.id)
              ?.length
              ? true
              : false;
            return (
              <MenuItem
                value={0}
                className={styles.selectType_item}
                onClick={() => {
                  onChange && onChange(fields?.name, item?.id, !checked);
                }}
              >
                <Checkbox checked={checked} />
                <span>
                  <IntlMessages id={item?.label} />
                </span>
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
  );
};

export default SelectType;
