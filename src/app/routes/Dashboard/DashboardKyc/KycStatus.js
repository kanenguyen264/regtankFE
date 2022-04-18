import { Grid } from "@mui/material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import styles from "app/routes/Dashboard/Dashboard.module.scss";
import clsx from "clsx";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import LinearProgressColor from "components/LinearProgressCustomColorv1";
import { DashboardContext } from "../Dashboard";
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
      <Grid
        container
        className={clsx(styles.kycStatus, className, styles.statusItem)}
      >
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

const KycStatus = () => {
  const { kyc } = useSelector((state) => state.dashboard);
  const heightObj = React.useContext(DashboardContext);
  const stageCanvasRef = React.useRef(null);
  React.useEffect(() => {
    if (stageCanvasRef.current) {
      let height = stageCanvasRef.current.offsetHeight;
        heightObj.setHeightOfStatusCard(height);
      setTimeout(() => {
        let height = stageCanvasRef.current.offsetHeight;
        heightObj.setHeightOfStatusCard(height);
      }, 1200);
    }
  }, [stageCanvasRef]);

  return (
    <Fragment>
      <JRCard
        ref={stageCanvasRef}
        disableShadow
        className={clsx(
          styles.cardDashBoard,
          styles.heightCard,
          styles.statusCard,
          styles.kycStatusCard
        )}
      >
        {/* Title and Header */}
        <Grid container>
          <Grid item xs={8}>
            <div className={styles.title}>
              <IntlMessages id={"dashboard.KYCStatus"} />
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
            percent={`${parseFloat(kyc.status?.completedPercent ?? 0).toFixed(
              2
            )}%`}
            total={`${Math.round(kyc.status?.completed ?? 0)}`}
          >
            <LinearProgressColor
              customColor={ThemeColors.dashboard.completed}
              value={kyc.status?.completedPercent ?? 0}
            />
          </StatusParameter>

          {/* Pending Scoring */}
          <StatusParameter
            titleStatus={
              <IntlMessages id="dashboard.status.positiveAndNoMatch" />
            }
            percent={`${parseFloat(kyc.status?.pendingPercent ?? 0).toFixed(
              2
            )}%`}
            total={`${Math.round(kyc.status?.pending ?? 0)}`}
          >
            <LinearProgressColor
              customColor={ThemeColors.dashboard.pending}
              value={kyc.status?.pendingPercent ?? 0}
            />
          </StatusParameter>

          {/* Unresolved */}
          <StatusParameter
            titleStatus={
              <IntlMessages id="dashboard.status.Unresolved"></IntlMessages>
            }
            percent={`${parseFloat(kyc.status?.unresolvedPercent ?? 0).toFixed(
              2
            )}%`}
            total={`${Math.round(kyc.status?.unresolved ?? 0)}`}
            className={"mb-0"}
          >
            <LinearProgressColor
              customColor={ThemeColors.dashboard.unresolved}
              value={kyc.status?.unresolvedPercent ?? 0}
            />
          </StatusParameter>
        </Grid>
      </JRCard>
    </Fragment>
  );
};

export default KycStatus;
