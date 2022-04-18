import MenuItem from "@mui/material/MenuItem";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import Select from "@protego/sdk/RegtankUI/v1/Select/Select";
import * as React from "react";
import Dropdown from "@protego/sdk/RegtankUI/v1/Dropdown/Dropdown";
import DropdownItem from "@protego/sdk/RegtankUI/v1/DropdownItem/index";
import { Typography } from "@mui/material";
import { getDocumentTypeKey, VERIFY_STATUS } from "constants/LivenessTest";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
const StatusDropdownList = function DropdownList({
  value,
  onChange,
  data,
}: StatusProps) {
  return (
    <Dropdown
      style={{
        // width: toRem(106),
        height: toRem(40),
      }}
      name="newScoreRiskLevel"
      size="small"
      label={
        <Typography
          variant="body1 "
          style={{
            fontSize: toRem(14),
          }}
        >
          {value !== -1 ? (
            <IntlMessages id={VERIFY_STATUS[value].label} />
          ) : (
            <IntlMessages id={"liveness.allStatus"} />
          )}
        </Typography>
      }
      variant="outlined"
    >
      <DropdownItem
        onClick={() => {
          onChange(-1);
        }}
        key={-1}
        style={{
          fontSize: toRem(12),
        }}
      >
        <IntlMessages id={"liveness.allStatus"} />
      </DropdownItem>
      {data.map((opt, index) => (
        <DropdownItem
          onClick={() => {
            onChange(opt.key);
          }}
          key={index}
          style={{
            fontSize: toRem(12),
          }}
        >
          <IntlMessages id={opt.label2 || opt.label} />
        </DropdownItem>
      ))}
    </Dropdown>
  );
};

export default StatusDropdownList;
