import { Grid } from "@mui/material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import styles from "app/routes/Dashboard/Dashboard.module.scss";
import clsx from "clsx";
import LinearProgressColor from "components/LinearProgressCustomColorv1";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { DashboardContext } from "../Dashboard";
import CustomScrollbar from "@protego/sdk/RegtankUI/v1/Scrollbar";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";

const AttributionParameter = ({
  titleAttribution,
  children,
  percent,
  total,
}) => {
  return (
    <Fragment>
      <Grid container className={clsx(styles.kytStatus, styles.statusItem)}>
        <Grid item xs={4} className={styles.titleStatus}>
          {titleAttribution}
        </Grid>
        <Grid item xs={4} className={clsx(styles.chart, styles.barStatus)}>
          {children}
        </Grid>
        <Grid container item xs={4} className={styles.parameter}>
          <Grid item xs={6}>
            {percent}
          </Grid>
          <Grid item xs={6}>
            {total}
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

const KytAssetAttribution = () => {
  const { kyt } = useSelector((state) => state.dashboard);
  const arrAttr = kyt.asset;
  const heightObj = React.useContext(DashboardContext);
  const headerRef = React.useRef(null);

  return (
    <Fragment>
      <JRCard
        disableShadow
        className={clsx(
          styles.cardDashBoard,
          styles.heightCard,
          styles.statusCard,
          styles.kytStatusCard
        )}
        style={{ paddingTop: 0, paddingBottom: 0 }}
      >
        <Grid container ref={headerRef} style={{ paddingTop: toRem(24) }}>
          <Grid item xs={8}>
            <div className={styles.title}>
              <IntlMessages id={"dashboard.kytAssetAttribution"} />
            </div>
          </Grid>
          <Grid container item xs={4} className={styles.parameter}>
            <Grid item xs={6}>
              <IntlMessages id={"dashboard.percent"} />
            </Grid>
            <Grid item xs={6}>
              <IntlMessages id={"dashboard.total"} />
            </Grid>
          </Grid>
        </Grid>

        {/* Attribution */}
        <CustomScrollbar
          autoHeightMax={
            heightObj?.heightOfStatusCard - headerRef?.current?.offsetHeight
          }
        >
          <Grid
            container
            className={styles.heightKytAssetAttribution}
            style={{ paddingBottom: toRem(24) }}
          >
            {/* <div className={styles.heightKytAssetAttribution}> */}
            {arrAttr?.map((attribution, index) => {
              return (
                <AttributionParameter
                  key={index}
                  titleAttribution={
                    <IntlMessages
                      id={`dashboard.kyt.attribution.${attribution.asset}`}
                    />
                  }
                  percent={`${parseFloat(attribution.percent ?? 0).toFixed(
                    2
                  )}%`}
                  total={`${Math.round(attribution.count ?? 0)}`}
                >
                  <LinearProgressColor
                    customColor={ThemeColors.dashboard.kyt}
                    value={attribution.percent ?? 0}
                    customShadowColor={"rgb(200 168 237 / 50%)"}
                  ></LinearProgressColor>
                </AttributionParameter>
              );
            })}
            {/* </div> */}
          </Grid>
        </CustomScrollbar>
      </JRCard>
    </Fragment>
  );
};

export default KytAssetAttribution;
