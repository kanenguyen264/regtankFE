import { Grid } from "@material-ui/core";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import JRCard from "@protego/sdk/UI/JRCard/JRCard";
import styles from "app/routes/Dashboard/Dashboard.module.scss";
import React, { Fragment } from "react";
import { FormattedHTMLMessage } from "react-intl";
import { useSelector } from "react-redux";
import clsx from "clsx";

const KybScreenStatistics = () => {
  const { kyb } = useSelector((state) => state.dashboard);

  return (
    <Fragment>
      <Grid item xs={12}>
        <JRCard disableShadow className={clsx(styles.cardDashBoard, styles.statisticCard)}>
          <div className={styles.title}>
            <IntlMessages id={"dashboard.kybScreeningStatistics"} />
          </div>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <JRCard disableShadow className={styles.card}>
                <div className={clsx(styles.totalCardKyb, styles.totalCard)}>{kyb.allCount ?? 0}</div>
                <div className={styles.titleCard}>
                  <FormattedHTMLMessage id="dashboard.content.total" />
                </div>
              </JRCard>
            </Grid>
            <Grid item xs={6}>
              <JRCard disableShadow className={[styles.card]}>
                <div className={clsx(styles.totalCardKyb, styles.totalCard)}>{kyb.dailyCount ?? 0}</div>
                <div className={styles.titleCard}>
                  <FormattedHTMLMessage id="dashboard.content.daily" />
                </div>
              </JRCard>
            </Grid>
          </Grid>
        </JRCard>
      </Grid>
    </Fragment>
  );
};

export default KybScreenStatistics;
