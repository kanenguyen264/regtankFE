import React from "react";
import { MuiThemeAuthentication } from "../../constants/MuiTheme";
import ThemeProvider from "@material-ui/styles/ThemeProvider";

const withAuthenticationTheme = (Component) => (props) => {
  return (
    <ThemeProvider theme={MuiThemeAuthentication}>
      <Component {...props} />
    </ThemeProvider>
  );
};

export default withAuthenticationTheme;
