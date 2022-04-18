import { Grid } from "@mui/material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import styles from "app/routes/Dashboard/Dashboard.module.scss";
import clsx from "clsx";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import LinearProgressColor from "components/LinearProgressCustomColorv1";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";

const StatusParameter = ({
  titleStatus,
  children,
  percent,
  total,
  className,
}) => {
  return (
    <Fragment>
      <Grid container className={clsx(styles.kybStatus, className, styles.statusItem)}>
        <Grid item xs={4} className={styles.titleStatus}>
          {titleStatus}
        </Grid>
        <Grid item xs={4} className={styles.barStatus}>
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

const KybStatus = () => {
  const { kyb } = useSelector((state) => state.dashboard);
  return (
    <Fragment>
      <JRCard
        disableShadow
        className={clsx(styles.cardDashBoard, styles.heightCard, styles.statusCard, styles.kybStatusCard)}
      >
        {/* Title and Header */}
        <Grid container>
          <Grid item xs={8}>
            <div className={styles.title}>
              <IntlMessages id={"dashboard.KYBStatus"} />
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

        {/* Parameter */}
        <Grid container direction="column">
          {/* Completed */}
          <StatusParameter
            titleStatus={
              <IntlMessages id="dashboard.status.Completed"></IntlMessages>
            }
            percent={`${parseFloat(kyb.status?.completedPercent ?? 0).toFixed(
              2
            )}%`}
            total={`${Math.round(kyb.status?.completed ?? 0)}`}
          >
            <LinearProgressColor
              customColor={ThemeColors.dashboard.completed}
              value={kyb.status?.completedPercent ?? 0}
            />
          </StatusParameter>

          {/* Pending Scoring */}
          <StatusParameter
            titleStatus={
              <IntlMessages id="dashboard.status.positiveAndNoMatch"></IntlMessages>
            }
            percent={`${parseFloat(kyb.status?.pendingPercent ?? 0).toFixed(
              2
            )}%`}
            total={`${Math.round(kyb.status?.pending ?? 0)}`}
          >
            <LinearProgressColor
              customColor={ThemeColors.dashboard.pending}
              value={kyb.status?.pendingPercent ?? 0}
            />
          </StatusParameter>

          {/* Unresolved */}
          <StatusParameter
            titleStatus={
              <IntlMessages id="dashboard.status.Unresolved"></IntlMessages>
            }
            percent={`${parseFloat(kyb.status?.unresolvedPercent ?? 0).toFixed(
              2
            )}%`}
            total={`${Math.round(kyb.status?.unresolved ?? 0)}`}
            className={"mb-0"}
          >
            <LinearProgressColor
              customColor={ThemeColors.dashboard.unresolved}
              value={kyb.status?.unresolvedPercent ?? 0}
            />
          </StatusParameter>
        </Grid>
      </JRCard>
    </Fragment>
  );
};

export default KybStatus;
