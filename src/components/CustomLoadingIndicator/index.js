import { CircularProgress } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";

const CustomLoadingIndicator = withStyles((theme) => ({
  root: {
    position: "relative"
  },
  bottom: {
    color: "#DADADA"
  },
  top: {
    color: "#1a90ff",
    position: "absolute",
    left: 0
  },
  circle: {
    strokeLinecap: "round"
  }
}))(({ classes, ...props }) => {
  return (
    <div className={classes.root}>
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.bottom}
        classes={{
          circle: classes.circle
        }}
        size={40}
        thickness={4}
        {...props}
      />
    </div>
  );
});

CustomLoadingIndicator.propTypes = CircularProgress.propTypes;

export default CustomLoadingIndicator;
