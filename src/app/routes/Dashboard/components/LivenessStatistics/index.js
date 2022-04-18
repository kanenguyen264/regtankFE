import { Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import * as React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSummaryRequestChart } from "../../../../../actions";
import { REPORT_DAYS } from "../../../../../constants/Dashboard";
import styles from "../../Dashboard.module.scss";
import NumberOfRecords from "../NumberOfRecords";

const LivenessStatistics = () => {
  const dispatch = useDispatch();
  const { summaryRequestReport } = useSelector((state) => state.dashboard);

  const loadData = (type) => {
    dispatch(fetchSummaryRequestChart({ type }));
  };

  useEffect(() => {
    loadData(REPORT_DAYS.ONE_WEEK);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Card className={styles.root}>
          <CardContent>
            <h2>
              <IntlMessages id="dashboard.liveness_statistics" />
            </h2>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <NumberOfRecords
                  number={summaryRequestReport?.data?.totalRequest}
                  title={
                    <IntlMessages id="dashboard.total_number_of_request" />
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <NumberOfRecords
                  number={summaryRequestReport?.data?.dailyRequest}
                  title={
                    <IntlMessages id="dashboard.daily_number_of_request" />
                  }
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default LivenessStatistics;
