import { View } from "@react-pdf/renderer";
import PropTypes from "prop-types";
import React from "react";

const styles = {
  row: {
    display: "inline-block"
  }
};

const HrTag = (props) => {
  const { width, color, height, debug, style, ...other } = props;
  return (
    <View
      debug={debug || false}
      {...other}
      style={[
        styles.row,
        { width: width, height: height, backgroundColor: color, ...style }
      ]}
    ></View>
  );
};

HrTag.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string
};

HrTag.defaultProps = {
  width: "100%",
  height: 1,
  color: "#636363"
};

export default HrTag;
