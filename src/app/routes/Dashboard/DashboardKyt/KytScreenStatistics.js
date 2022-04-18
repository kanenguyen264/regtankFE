import { Grid } from "@material-ui/core";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import JRCard from "@protego/sdk/UI/JRCard/JRCard";
import styles from "app/routes/Dashboard/Dashboard.module.scss";
import React from "react";
import { useSelector } from "react-redux";
import { FormattedHTMLMessage } from "react-intl";
import clsx from "clsx";

const KytScreenStatistics = () => {
  // const dispatch = useDispatch();
  const { kyt } = useSelector((state) => state.dashboard);
  return (
    <JRCard disableShadow className={clsx(styles.cardDashBoard, styles.statisticCard)}>
      <div className={styles.title}>
        <IntlMessages id={"dashboard.kytScreeningStatistics"} />
      </div>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <JRCard disableShadow className={styles.card}>
            <div className={clsx(styles.totalCardKyt, styles.totalCard)}>{kyt.allCount ?? 0}</div>
            <div className={styles.titleCard}>
              <FormattedHTMLMessage id="dashboard.content.total" />
            </div>
          </JRCard>
        </Grid>
        <Grid item xs={6}>
          <JRCard disableShadow className={[styles.card]}>
            <div className={clsx(styles.totalCardKyt, styles.totalCard)}>{kyt.dailyCount ?? 0}</div>
            <div className={styles.titleCard}>
              <FormattedHTMLMessage id="dashboard.content.daily" />
            </div>
          </JRCard>
        </Grid>
      </Grid>
    </JRCard>
  );
};

export default KytScreenStatistics;
