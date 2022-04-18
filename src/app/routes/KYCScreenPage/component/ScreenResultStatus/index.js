import { Grid, Typography } from "@mui/material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import React from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";

const ScreenResultStatus = ({ data, className = "", ...props }) => {
  const { unresolvedCount = 0, falseCount = 0, positiveCount = 0 } = data;
  return (
    <JRCard
      headerLine
      header={
        <Typography variant={"titleForm"}>
          <IntlMessages id="status" />
        </Typography>
      }
      className={clsx(styles.cardContained, className)}
    >
      <Grid container spacing={1} className={styles.cardContent}>
        <Grid item xs={12}>
          <div className={clsx(styles.card, styles.cardUnresolved)}>
            <Grid container alignItems={"center"}>
              <Grid item xs={1}>
                <div className={styles.dividerUnresolved} />
              </Grid>
              <Grid item xs={7} className={"d-flex justify-content-start "}>
                <Typography variant={"Subtitle1"}>
                  <IntlMessages id="unresolved" />
                </Typography>
              </Grid>
              <Grid item xs={4} className={"d-flex justify-content-end"}>
                <Typography variant={"labelFieldForm"}>
                  <div className={"d-flex align-items-center"}>
                    <Typography
                      variant={"h3MainBlack"}
                      style={{ marginRight: toRem(8) }}
                    >
                      {unresolvedCount}
                    </Typography>
                    <IntlMessages id={"kyc.labelMatches"} />
                  </div>
                </Typography>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={clsx(styles.card, styles.cardPositive)}>
            <Grid container alignItems={"center"}>
              <Grid item xs={1}>
                <div className={styles.dividerPositive} />
              </Grid>
              <Grid item xs={7} className={"d-flex justify-content-start "}>
                <Typography variant={"Subtitle1"}>
                  <IntlMessages id="positive" />
                </Typography>
              </Grid>
              <Grid item xs={4} className={"d-flex justify-content-end"}>
                <Typography variant={"labelFieldForm"}>
                  <div className={"d-flex align-items-center"}>
                    <Typography
                      variant={"h3"}
                      style={{ marginRight: toRem(8) }}
                    >
                      {positiveCount}
                    </Typography>
                    <IntlMessages id={"kyc.labelMatches"} />
                  </div>
                </Typography>
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={clsx(styles.card, styles.cardFalse)}>
            <Grid container alignItems={"center"}>
              <Grid item xs={1}>
                <div className={styles.dividerFalse} />
              </Grid>
              <Grid item xs={7} className={"d-flex justify-content-start "}>
                <Typography variant={"Subtitle1"}>
                  <IntlMessages id="false" />
                </Typography>
              </Grid>
              <Grid item xs={4} className={"d-flex justify-content-end"}>
                <Typography variant={"labelFieldForm"}>
                  <div className={"d-flex align-items-center"}>
                    <Typography
                      variant={"h3"}
                      style={{ marginRight: toRem(8) }}
                    >
                      {falseCount}
                    </Typography>
                    <IntlMessages id={"kyc.labelMatches"} />
                  </div>
                </Typography>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </JRCard>
  );
};

export default ScreenResultStatus;
