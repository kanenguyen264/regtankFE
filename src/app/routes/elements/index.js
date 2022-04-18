import React from "react";
import Buttons from "./Button";
import Dropdown from "./Dropdown";
import Selects from "./Select";
import Dialog from "./Dialog";
import PromptDialog from "./PromptDialog";
import SelectOthers from "./SelectOthers";
import { ThemeProvider } from "@mui/material/styles";
import MuiTheme from "@protego/sdk/RegtankUI/v1/MuiTheme/theme";
import withStyles from "@mui/styles/withStyles";
import { baseStyles } from "@protego/sdk/styles/base";
import DatePicker from "./DatePicker";
const Wrap = withStyles(baseStyles, { index: 9999 })(function Wrap() {
  return (
    <div>
      <Buttons />
      <Dropdown />
      <Selects />
      <Dialog />
      <PromptDialog />
      <SelectOthers />
      <DatePicker />
    </div>
  );
});
const Elements = () => {
  return (
    <ThemeProvider theme={MuiTheme}>
      <Wrap />
    </ThemeProvider>
  );
};

export default Elements;
