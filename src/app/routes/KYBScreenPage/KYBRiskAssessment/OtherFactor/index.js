import MenuItem from "@material-ui/core/MenuItem";
import { Grid, Typography } from "@mui/material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import Select from "@protego/sdk/RegtankUI/v1/CSelect";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import { PAYMENT_MODE } from "constants/PaymentMode";
import { useFormikContext } from "formik";
import React from "react";
import { useIntl } from "react-intl";
import styles from "./OtherFactor.module.scss";

const OtherFactor = () => {
  const intl = useIntl();
  const formikContext = useFormikContext();

  return (
    <JRCard
      headerLine
      header={
        <Typography variant="titleForm">
          <IntlMessages id="kyb.risk.factor" />
        </Typography>
      }
    >
      <div className={styles.otherFactorContainer}>
        <Grid container direction={"row"} columnSpacing={2} rowSpacing={1.5}>
          <Grid item xs={6}>
            <Typography variant="smallDefault">
              <IntlMessages id={"kyb.source.of.funds"} />
            </Typography>
            <TextField
              variant={"outlined"}
              fullWidth
              formik
              value={null}
              name={"sourceOfFunds"}
              placeholder={intl.formatMessage({
                id: "kyb.source.of.funds",
              })}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="smallDefault">
              <IntlMessages id={"kyb.Payment"} />
            </Typography>
            <div className={styles.selectStyle}>
              <Select
                MenuProps={{
                  classes: { paper: styles.menuPaper },
                }}
                size="small"
                name={"paymentMode"}
                value={null}
                formik
              >
                <MenuItem value={-1} style={{ display: "none" }}>
                  <Typography
                    variant="labelFieldForm"
                    className={styles.textDefault}
                  >
                    <IntlMessages id={"kyb.other.factor.select"} />
                  </Typography>
                </MenuItem>
                {PAYMENT_MODE.map((opt, index) => (
                  <MenuItem key={index} value={opt.value}>
                    <Typography variant="small1">
                      <IntlMessages id={opt.label} />
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </div>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="smallDefault">
              <IntlMessages id={"kyb.Country.of.funds"} />
            </Typography>
            <TextField
              fullWidth
              variant={"outlined"}
              formik
              value={null}
              name={"countryOfFunds"}
              placeholder={intl.formatMessage({
                id: "kyb.Country.of.funds",
              })}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography variant="smallDefault">
              <IntlMessages id={"kyb.Other"} />
            </Typography>
            <Tooltip
              placement={"top-start"}
              disableFocusListener={
                formikContext?.values?.others?.length > 0 ? false : true
              }
              title={
                <Typography variant="body1">
                  {formikContext?.values?.others}
                </Typography>
              }
              arrow
            >
              <TextField
                formik
                variant={"outlined"}
                name={"others"}
                fullWidth
                value={"null"}
                placeholder={intl.formatMessage({
                  id: "kyb.type.other.risk.factor",
                })}
              />
            </Tooltip>
          </Grid>
        </Grid>
      </div>
    </JRCard>
  );
};
export default OtherFactor;
