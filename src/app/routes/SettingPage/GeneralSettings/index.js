import { Box, Typography } from "@material-ui/core";
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { makeStyles, withStyles } from '@mui/styles';
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import { toRem } from "@protego/sdk/utils/measurements";
import {
  fetchGeneralSettings,
  fetchGeneralSettingsSuccess,
  submitGeneralSettings,
  submitGeneralSettingsSuccess
} from "actions/Setting";
import { TAB_SETTING as TAB_SETTING_THEME } from "constants/ThemeColors";
import { clone } from "lodash";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { snackActions } from "util/snackbarUtils";
import ApNotification from "./AppNotification";
import Header from "./component/Header";
import EmailNotification from "./EmailNotification";

const AntTabs = withStyles({
  root: {
    borderBottom: TAB_SETTING_THEME.borderBottom,

    // height: "64px"
  },
  indicator: {
    backgroundColor: TAB_SETTING_THEME.color,
  },
})(Tabs);
const AntTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    minWidth: 72,
    fontSize: toRem(15),
    fontWeight: 500,
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    "&:hover": {
      color: TAB_SETTING_THEME.color,
      opacity: 1,
    },
    "&$selected": {
      color: TAB_SETTING_THEME.color,
      fontWeight: toRem(15),
    },
    "&:focus": {
      color: TAB_SETTING_THEME.color,
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  padding: {
    padding: theme.spacing(3),
  },
  bodyTab: {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${ThemeColors.grayText1}`,
    borderRadius: 0,
    borderCollapse: 0,
    "& .MuiBox-root": {
      padding: `${toRem(24)} 0`,
    }
  },
  tabWrap: {
    marginTop: "-1px",
    borderBottom: "0",
    "& .MuiTabs-flexContainer": {
      borderBottom: `1px solid ${ThemeColors.grayLightBorder}`,
      padding: `0 ${toRem(24)}`,
    },

    "& .MuiButtonBase-root": {
      fontWeight: "500",
      fontSize: `${toRem(14)}`,
      lineHeight: `${toRem(20)}`,
      margin: "0",
      padding: `${toRem(26)} 0`,
      marginRight: `${toRem(48)}`,
      color: ThemeColors.defaultDark,
      opacity: "1",
      textTransform: "initial",

      "&.Mui-selected": {
        color: ThemeColors.primary,
      },
    },

    "& .MuiTabs-indicator": {
      height: "4px",
      borderRadius: "4px",
      marginBottom: "-2px",
    },
  },
}));

const GeneralSettingsPage = React.memo(() => {
  const { generalSettings } = useSelector((state) => state.settings);
  const { customerMe } = useSelector((state) => state.settings, shallowEqual);
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    setValue(tab === "1" ? 1 : 0);
  }, [location]);

  const fetchSettings = () => {
    dispatch(fetchGeneralSettings())
      .then((response) => {
        dispatch(fetchGeneralSettingsSuccess(response.data));
      })
      .catch((err) => {
        extractErrorAndNotify(err);
      });
  };

  const onPressReset = () => {
    fetchSettings();
  };

  const onSubmitData = (values) => {
    let summitedData = clone(generalSettings);
    summitedData = { ...summitedData, ...values };
    setLoading(true);
    dispatch(submitGeneralSettings(summitedData))
      .then((rs) => {
        dispatch(submitGeneralSettingsSuccess(rs.data));
        return snackActions.success(
          <IntlMessages id={"notification.success.saved"} />
        );
      })
      .catch((err) => {
        extractErrorAndNotify(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const extractErrorAndNotify = (err) => {
    let jsonParse = JSON.parse(
      JSON.stringify(err.response ? err.response.data : "")
    );

    snackActions.error(
      jsonParse.message ? (
        jsonParse.message
      ) : (
        <IntlMessages id={"notification.error"} />
      )
    );
  };

  const handleChangeTab = (event, newValue) => {
    history.push({
      pathname: location.pathname,
      search: `?tab=${newValue}`,
    });
  };

  return (
    <>
      <Header />
      <LoadingWrapper loading={loading} size={"3rem"}>
        <div className={classes.bodyTab}>
          <AntTabs
            value={value}
            onChange={handleChangeTab}
            aria-label="ant example"
            className={classes.tabWrap}
          >
            <AntTab
              label={
                <IntlMessages
                  id={"setting.generalSettings.appNotifications"}
                  to=""
                />
              }
            />
            <AntTab
              label={
                <IntlMessages
                  id={"setting.generalSettings.emailNotifications"}
                  to=""
                />
              }
            />
          </AntTabs>
          <TabPanel value={value} index={0}>
            <ApNotification
              generalSettings={generalSettings}
              onSubmitData={onSubmitData}
              onPressReset={onPressReset}
              customerMe={customerMe}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <EmailNotification
              generalSettings={generalSettings}
              onSubmitData={onSubmitData}
              onPressReset={onPressReset}
              customerMe={customerMe}
            />
          </TabPanel>
        </div>
      </LoadingWrapper>
    </>
  );
});

export default GeneralSettingsPage;
