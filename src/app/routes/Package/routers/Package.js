import React, { useEffect, Fragment, useState } from "react";
import { Grid, AppBar, Tab, Tabs, Box } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";

import JRCard from "@protego/sdk/UI/JRCard/JRCard";
import PackageItem from "../component/cards";
import { fetchAllPackage } from "actions";
import {
  MONTHLY,
  QUARTERLY,
  BIANNUAL,
  ANNUAL,
} from "constants/PackagePlanType";
import "../Package.scss";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
const Package = () => {
  const dispatch = useDispatch();

  const { packages } = useSelector((state) => state.package);
  const [typeAction, setTypeAction] = useState();
  const { customerCredit } = useSelector((state) => state.credit);
  useEffect(() => {
    dispatch(fetchAllPackage());
    setTypeAction(MONTHLY);
  }, [dispatch]);

  const handleChange = (event, newValue) => {
    setTypeAction(newValue);
  };

  const showCartPackage = (selected, index) => {
    if (
      (typeAction === MONTHLY &&
        selected.monthly.price === 0 &&
        selected.monthly.credits === 0) ||
      (typeAction === QUARTERLY &&
        selected.quarterly.price === 0 &&
        selected.quarterly.credits === 0) ||
      (typeAction === BIANNUAL &&
        selected.biAnnual.price === 0 &&
        selected.biAnnual.credits === 0) ||
      (typeAction === ANNUAL &&
        selected.annual.price === 0 &&
        selected.annual.credits === 0)
    ) {
      return <></>;
    } else {
      return (
        <Grid key={selected.id} item>
          <PackageItem type={typeAction} data={selected} />
        </Grid>
      );
    }
  };

  return (
    <Fragment>
      <PageHeading
        title={<IntlMessages id="package.header" />}
        customUrlResolver={(index, sub) => {
          if (index === 1) return <IntlMessages id="package.header" />;
        }}
      />
      <div className="Pricing-table">
        <JRCard>
          <div className="header">
            <div>
              <h1 className="title">
                <IntlMessages id="package.title" />
                {` ${customerCredit?.usedPackage?.name}`}
                <IntlMessages id="package.title1" />
              </h1>
              <p style={{ color: " #868e96" }}>
                <IntlMessages id="package.subscription" />
              </p>
            </div>
            <Box
              display="flex"
              justifyContent="center"
              m={1}
              p={1}
              bgcolor="background.paper"
            >
              <Box>
                <AppBar position="static" color="default">
                  <Tabs
                    value={typeAction}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="Subscription Plans"
                    centered
                  >
                    <Tab label="Monthly" value={MONTHLY} />
                    <Tab label="Quarterly" value={QUARTERLY} />
                    <Tab label="Bi-annual" value={BIANNUAL} />
                    <Tab label="Annual" value={ANNUAL} />
                  </Tabs>
                </AppBar>
              </Box>
            </Box>
          </div>
          <div>
            <Grid container justify="center" spacing={3}>
              {packages.map((item, index) => showCartPackage(item, index))}
            </Grid>
          </div>
        </JRCard>
      </div>
    </Fragment>
  );
};

export default Package;
