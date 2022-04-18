import { Box, Button, Grid, Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import JRCard from "@protego/sdk/UI/JRCard/JRCard";
import { toRem } from "@protego/sdk/utils/measurements";
import React from "react";
import styles from "./components/Dashboard.module.scss";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCredit } from "../../../actions/DashboardAction";
import { ADMIN } from "constants/ActionTypes";
const CircularProgressBase = withStyles((theme) => ({
  root: {
    height: 10
  },
  circleStatic: {
    color: "#E2EAFF"
  }
}))(CircularProgress);
const CircularProgressCustom = withStyles((theme) => ({
  root: {
    height: 10,
    zIndex: 2,
    position: "absolute",
    borderRadius: 4
  },

  circleStatic: {
    color: "#5C88F7"
  }
}))(CircularProgress);

const creditStyle = {
  fCenter: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    display: "flex"
  },
  buttonGroup: {
    flexDirection: "column",
    width: 110,
    paddingTop: toRem(40)
  },
  textPadding: {
    paddingTop: 10,
    alignItems: "center",
    display: "flex",
    justifyContent: "center"
  }
};

function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <div>
        <CircularProgressCustom
          variant="static"
          value={props.value}
          size={toRem(170)}
        />
        <CircularProgressBase variant="static" size={toRem(170)} value={100} />
      </div>
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          component="div"
          className={styles.TextCreditValue}
          color="textSecondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

function CreditUsage() {
  const history = useHistory();
  const { me } = useSelector((state) => state.me);
  const { credit } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, [dispatch]);

  React.useEffect(() => {
    if (credit) setProgress(credit.creditsUsed);
  }, [credit]);

  const fetch = () => {
    dispatch(fetchCredit());
  };

  function onPressTopUp() {
    history.push("/app/credit");
  }
  function onPressUpgrade() {
    history.push("/app/package");
  }

  return (
    <JRCard
      headerLine
      header={
        <Typography className={styles.dashBoardTitleCard}>
          {<IntlMessages id="dashboard.credit.usage"></IntlMessages>}
        </Typography>
      }
    >
      <div style={{ height: toRem(268) }}>
        {me.role === ADMIN ? (
          <Grid container style={{ maxHeight: toRem(250) }}>
            <Grid item xs={6} style={creditStyle.fCenter}>
              <CircularProgressWithLabel value={progress} />
              <div style={creditStyle.fCenter}>
                <Typography
                  style={creditStyle.textPadding}
                  className={styles.chartTextDescription}
                >
                  {<IntlMessages id="dashboard.Credit.Credits"></IntlMessages>}
                </Typography>
                <div style={creditStyle.textPadding}>
                  <Typography className={styles.chartTextDescription}>
                    {<IntlMessages id="dashboard.Credit.ExpirationDate" />}
                    &nbsp;
                    {moment(credit ? credit.expiredDate : "").format(
                      "DD/MM/YYYY"
                    )}
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div style={creditStyle.buttonGroup}>
                <Button
                  size={"small"}
                  variant={"contained"}
                  color={"primary"}
                  fullWidth
                  onClick={onPressTopUp}
                >
                  <IntlMessages id="dashboard.Credit.TopUp" />
                </Button>
                <Button
                  size={"small"}
                  variant={"outlined"}
                  color={"primary"}
                  className={"mt-3"}
                  onClick={onPressUpgrade}
                  fullWidth
                >
                  <IntlMessages id="dashboard.Credit.Upgrade" />
                </Button>
              </div>
            </Grid>
          </Grid>
        ) : (
          <Grid container>
            <Grid item style={creditStyle.fCenter}>
              <CircularProgressWithLabel value={progress} />
              <div style={creditStyle.fCenter}>
                <Typography
                  style={creditStyle.textPadding}
                  className={styles.chartTextDescription}
                >
                  {<IntlMessages id="dashboard.Credit.Credits"></IntlMessages>}
                </Typography>
                <div style={creditStyle.textPadding}>
                  <Typography className={styles.chartTextDescription}>
                    {<IntlMessages id="dashboard.Credit.ExpirationDate" />}
                    &nbsp;
                    {moment(credit ? credit.expiredDate : "").format(
                      "DD/MM/YYYY"
                    )}
                  </Typography>
                </div>
              </div>
            </Grid>
          </Grid>
        )}
      </div>
    </JRCard>
  );
}

export default CreditUsage;
