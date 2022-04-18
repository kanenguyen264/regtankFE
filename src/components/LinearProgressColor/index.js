import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React from "react";

const LinearWithColorStyles = makeStyles(() => {
  return {
    colorPrimary: (props) => {
      return {
        backgroundColor: props.customColor,
        borderRadius: "10px"
      };
    },
    barColorPrimary: (props) => {
      return {
        backgroundColor: props.customColor,
        borderRadius: "10px"
      };
    }
  };
});

const LinearProgressColor = (props) => {
  const linearProgressStyles = LinearWithColorStyles(props);
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%">
        <LinearProgress classes={linearProgressStyles} {...props} />
      </Box>
    </Box>
  );
};

LinearProgressColor.propTypes = {
  value: PropTypes.number.isRequired,
  customColor: PropTypes.string
};

LinearProgressColor.defaultProps = {
  value: 100,
  customColor: "#ddd"
};

export default LinearProgressColor;
