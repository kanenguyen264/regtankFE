import {
  createMuiTheme as baseCreateMuiTheme,
  StylesProvider,
} from "@material-ui/core/styles";
// import { createTheme as baseCreateMuiTheme } from '@mui/material/styles';
import { ThemeProvider } from "@material-ui/styles";
import { ThemeProvider as InnerThemeProvider } from "@mui/material/styles";
import {
  createGenerateClassName,
  StylesProvider as InnerStylesProvider,
} from "@mui/styles";
// import { ThemeProvider } from '@mui/material/styles';
import ProtegoProvider from "@protego/sdk/core/ProtegoProvider/ProtegoProvider";
import RegTheme from "@protego/sdk/RegtankUI/v1/MuiTheme/theme";
import { setDrawerType } from "actions";
import "assets/vendors/style";
import { FIXED_DRAWER, MINI_DRAWER } from "constants/ActionTypes";
import { USER_TIME_OUT } from "constants/AppSettings";
import { VERSION_BUILD, VERSION_WEB } from "constants/Version";
import { includes } from "lodash";
import { SnackbarProvider } from "notistack";
import React, { useEffect } from "react";
import { IntlProvider } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import withAuthenticationTheme from "util/hocs/withAuthenticationTheme";
import { SnackbarUtilsConfigurator } from "util/snackbarUtils";
import { ACLProvider } from "../acl";
import MuiTheme from "../constants/MuiTheme";
import AppLocale from "../lngProvider";
import ApiService from "../services/ApiService";
import AuthService from "../services/AuthService";
import AppLayout from "./AppLayout";
import { iconVariant, useSnackbarStyle } from "./styles";
import indigoTheme from "./themes/indigoTheme";
const CP = "CP";

const createMuiTheme = (theme) => {
  return baseCreateMuiTheme(MuiTheme, theme);
};

const generateClassName = createGenerateClassName({
  productionPrefix: "muiv4",
});
const generateClassNameInner = createGenerateClassName({
  productionPrefix: "reg",
  seed: "reg",
});
const RestrictedRoute = ({ component: Component, authUser, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      authUser ? (
        <ACLProvider>
          <Component {...props} />
        </ACLProvider>
      ) : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

const App = (props) => {
  const dispatch = useDispatch();
  const locale = useSelector(({ settings }) => settings.locale);
  const { authUser, initURL } = useSelector(({ auth }) => auth);
  const drawerType = useSelector((state) => state.settings.drawerType);
  const { match, location } = props;
  const classes = useSnackbarStyle();

  useEffect(() => {
    if (includes(location.pathname, "/app/setting")) {
      if (drawerType !== MINI_DRAWER)
        dispatch(setDrawerType(MINI_DRAWER, location.pathname));
    } else {
      if (drawerType !== FIXED_DRAWER)
        dispatch(setDrawerType(FIXED_DRAWER, location.pathname));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  let applyTheme = createMuiTheme(indigoTheme);

  if (location.pathname === "/") {
    if (authUser === null) {
      return <Redirect to={"/signin"} />;
    } else if (initURL === "" || initURL === "/" || initURL === "/signin") {
      return <Redirect to={"/app/dashboard"} />;
    } else {
      return <Redirect to={initURL} />;
    }
  }

  const currentAppLocale = AppLocale[locale.locale];

  return (
    <QueryParamProvider ReactRouterRoute={Route}>
      <StylesProvider injectFirst generateClassName={generateClassName}>
        <ThemeProvider theme={applyTheme}>
          <InnerStylesProvider generateClassName={generateClassNameInner}>
            <InnerThemeProvider theme={RegTheme}>
              <IntlProvider
                locale={currentAppLocale.locale}
                messages={currentAppLocale.messages}
              >
                <SnackbarProvider
                  maxSnack={3}
                  iconVariant={iconVariant}
                  classes={classes}
                >
                  <SnackbarUtilsConfigurator />
                  <div className="app-main">
                    <ProtegoProvider
                      authRender={withAuthenticationTheme}
                      services={{
                        APIService: ApiService,
                        AuthService: AuthService,
                      }}
                      type={CP}
                      version={{
                        VERSION_BUILD: VERSION_BUILD,
                        VERSION_WEB: VERSION_WEB,
                      }}
                      userTimeOut={USER_TIME_OUT}
                    >
                      <RestrictedRoute
                        path={`${match.url}app`}
                        authUser={authUser}
                        component={AppLayout}
                      />
                    </ProtegoProvider>
                  </div>
                </SnackbarProvider>
              </IntlProvider>
            </InnerThemeProvider>
          </InnerStylesProvider>
        </ThemeProvider>
      </StylesProvider>
    </QueryParamProvider>
  );
};

export default App;
