import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React from "react";
const LinearProgressColor = (props) => {
  const ProgressCustom = withStyles((theme) => ({
    root: {
      height: 10,
      borderRadius: 5
    },
    colorPrimary: {
      backgroundColor:
        theme.palette.grey[theme.palette.type === "light" ? 200 : 700]
    },
    bar: {
      borderRadius: 5,
      backgroundColor: props.customColor
    }
  }))(LinearProgress);
  return (
    <>
      <ProgressCustom variant="determinate" value={props.value} />
    </>
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
