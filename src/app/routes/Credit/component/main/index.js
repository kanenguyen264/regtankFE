import { Box, Grid, Typography } from "@material-ui/core";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import JRCard from "@protego/sdk/UI/JRCard/JRCard";
import { fetchCreditBundle, fetchCustomerCredit } from "actions";
import { LINK_EMAIL_SUPPORT, NAME_EMAIL_SUPPORT } from "constants/Email";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { FormattedHTMLMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { formatCredit } from "util/currency";
import Cards from "../cards/index";
import "./style.scss";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
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

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};
export default function FullWidthTabs() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCustomerCredit());
    dispatch(fetchCreditBundle());
    // eslint-disable-next-line
  }, []);
  const { customerCredit, creditBundles } = useSelector(
    (state) => state.credit
  );
  return (
    <div className="Pricing-table">
      <JRCard>
        <div className="header">
          <div>
            <h1>
              <IntlMessages id="credit.yourAccountCreditBalance" />
            </h1>
            <span className="priceHeader">
              {formatCredit(customerCredit?.creditBalance)}
            </span>
            <p style={{ color: " #868e96" }}>
              <FormattedHTMLMessage
                id="credit.content"
                values={{
                  email: NAME_EMAIL_SUPPORT,
                  linkEmail: LINK_EMAIL_SUPPORT
                }}
              />
            </p>
          </div>
        </div>

        <div>
          <center>
            <Grid container justify="center" spacing={3}>
              {creditBundles.map((value) => (
                <Grid key={value} item>
                  <Cards creditBundle={value} />
                </Grid>
              ))}
            </Grid>
          </center>
        </div>
      </JRCard>
    </div>
  );
}
