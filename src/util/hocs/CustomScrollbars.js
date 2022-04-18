import React from "react";
import { Scrollbars } from "react-custom-scrollbars";

const CustomScrollbars = (props) => (
  <Scrollbars
    {...props}
    autoHide
    renderTrackHorizontal={(propValues) => (
      <div
        {...propValues}
        style={{ display: "none" }}
        className="track-horizontal"
      />
    )}
  />
);

export default CustomScrollbars;
