import React from "react";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";

const CustomTooltip = (props) => {
  return (
    <Tooltip
      placement="top-start"
      {...props}
    >
      {props.children}
    </Tooltip>
  );
};

export default CustomTooltip;
