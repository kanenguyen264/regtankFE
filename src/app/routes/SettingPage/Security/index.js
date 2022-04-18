import React, { Fragment } from "react";
import { makeStyles, withStyles } from "@mui/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import Authentication from "./Authentication";
import WhiteList from "./WhiteList";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";

import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { RouterPrompt } from "./RouterPrompt";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { withACL } from "../../../../acl";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import styles from "./security.module.scss";

const AntTabs = withStyles({
  root: {},
  indicator: {
    backgroundColor: ThemeColors.primary,
  },
})(Tabs);
const AntTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    minWidth: 72,
    fontSize: toRem(15),
    fontWeight: 500,
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    "&:hover": {
      color: ThemeColors.primary,
      opacity: 1,
    },
    "&$selected": {
      color: ThemeColors.primary,
      fontWeight: toRem(15),
    },
    "&:focus": {
      color: ThemeColors.primary,
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
      {value === index && <Typography component={"div"}>{children}</Typography>}
    </div>
  );
}

export default withACL(function CustomizedTabs({ ACL }) {
  const [value, setValue] = React.useState(0);
  const [isAuthChanged, setIsAuthFormChanged] = React.useState(false);
  const [isWhitelistChanged, setIsWhitelistChanged] = React.useState(false);
  const history = useHistory();
  const location = useLocation();
  const disabled = !ACL.isAllowedPermissions("SETTING_SECURITY_EDIT");

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    setValue(tab === "1" ? 1 : 0);
  }, [location]);

  const handleChange = (event, newValue) => {
    history.push({
      pathname: location.pathname,
      search: `?tab=${newValue}`,
    });
  };
  return (
    <div className={styles.securityWrapper}>
      <RouterPrompt
        when={
          (isAuthChanged && value === 0) || (isWhitelistChanged && value === 1)
        }
        onOK={() => true}
        onCancel={() => false}
      />
      <PageHeading
        title={<IntlMessages id={"url.security"} />}
        customUrlResolver={(index, sub) => {
          switch (index) {
            case 1:
              return [
                <IntlMessages id={"setting.kyc.breadcrumb.settings"} />,
                null,
                false,
              ];
            case 2:
              return [<IntlMessages id={"url.security"} />, null, false];
            default:
              break;
          }
        }}
      />{" "}
      <div className={styles.tabWrapper}>
        <AntTabs
          className={styles.tabHeader}
          value={value}
          onChange={handleChange}
          aria-label="ant example"
        >
          <AntTab
            label={<IntlMessages id={"setting.authentication"} to="" />}
          />
          <AntTab
            label={<IntlMessages id={"setting.menu.whitelist"} to="" />}
          />
        </AntTabs>
        <TabPanel className={styles.tabPanel} value={value} index={0}>
          <Authentication
            disabled={disabled}
            setFormChanged={(value) => {
              setIsAuthFormChanged(value);
            }}
          />
        </TabPanel>
        <TabPanel className={styles.tabPanel} value={value} index={1}>
          <WhiteList
            disabled={disabled}
            setFormChanged={(value) => {
              setIsWhitelistChanged(value);
            }}
          />
        </TabPanel>
      </div>
    </div>
  );
});
