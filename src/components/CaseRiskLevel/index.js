import { Divider, Grid, Typography, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import JRCard from "@protego/sdk/UI/JRCard/JRCard";
import { toRem } from "@protego/sdk/utils/measurements";
import DoughnutChart from "components/Chart/DoughnutChart";
import { RISK_LEVEL_COLOR } from "constants/RiskLevelType";
import { get } from "lodash";
import React, { Fragment } from "react";
import { ResponsiveContainer } from "recharts";
import { useIntl } from "react-intl";
import { canAccessKYT } from "util/permision";
import { useSelector, shallowEqual } from "react-redux";
import { FormattedHTMLMessage } from "react-intl";
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
import {
  dataChartKYT,
  dataChartKYC,
} from "./../DataChartCaseRiskScore/dataChart";
const useStyles = makeStyles((theme) => ({
  riskCoreLarge: {
    background: "#EA2134",
    fontSize: 25,
    color: "#ffffff",
    display: "inline-block",
    borderRadius: 8,
    padding: "17px 9px",
    minWidth: theme.typography.pxToRem(60),
    "&.HIGH": {
      background: RISK_LEVEL_COLOR.HIGH,
    },
    "&.MEDIUM": {
      background: RISK_LEVEL_COLOR.MEDIUM,
    },
    "&.LOW": {
      background: RISK_LEVEL_COLOR.LOW,
    },
  },
  btnHighRisk: {
    color: "#ffffff",
    borderRadius: 18,
    padding: theme.typography.pxToRem(8),
    minWidth: theme.typography.pxToRem(100),
    "&.HIGH": {
      background: RISK_LEVEL_COLOR.HIGH,
    },
    "&.MEDIUM": {
      background: RISK_LEVEL_COLOR.MEDIUM,
    },
    "&.LOW": {
      background: RISK_LEVEL_COLOR.LOW,
    },
  },
  legendBullet: {
    display: "inline-block",
    fontSize: theme.typography.pxToRem(10),
    width: theme.typography.pxToRem(10),
    height: theme.typography.pxToRem(10),
    marginRight: theme.typography.pxToRem(7),
    borderRadius: "50%",

    "&.High": {
      background: RISK_LEVEL_COLOR.HIGH,
    },
    "&.Medium": {
      background: RISK_LEVEL_COLOR.MEDIUM,
    },
    "&.Low": {
      background: RISK_LEVEL_COLOR.LOW,
    },
    "&.Pending": {
      background: RISK_LEVEL_COLOR.PENDING,
    },
  },
}));

const CaseRiskLevel = ({
  data,
  hideKYTChart = false,
  hideKYCChart = false,
}) => {
  const classes = useStyles();
  const intl = useIntl();
  const kytList = get(data, "kytList");
  const kycList = get(data, "kycList");

  const dataChartCountKYT = dataChartKYT(kytList, intl);
  const dataChartCountKYC = dataChartKYC(kycList, intl);
  const { customerMe } = useSelector((state) => state.settings, shallowEqual);

  return (
    <Fragment>
      <JRCard
        dense
        headerLine
        header={
          <div className={"d-flex align-items-center"}>
            <span style={{ fontSize: toRem(21) }}>
              <IntlMessages id="case.detail.riskSummary.header" />
            </span>
            <span className="ml-1">
              <Tooltip
                arrow
                placement="top"
                title={
                  <div className="custom-tooltip">
                    <p>
                      <FormattedHTMLMessage id="tooltip.totalRiskScore" />
                    </p>
                  </div>
                }
              >
                <QuestionMarkIcon />
              </Tooltip>
            </span>
          </div>
        }
      >
        {!hideKYCChart && (
          <Grid container spacing={1} className="my-4">
            <Grid item xs style={{ fontSize: toRem(21) }}>
              <IntlMessages id="case.detail.riskSummary.kyc.title" />
            </Grid>

            <DoughnutChart
              height={100}
              type={"percent"}
              data={dataChartCountKYC}
            />
            <Grid
              container
              className="mt-4"
              direction="row"
              justify="space-around"
              alignItems="center"
            >
              <Grid item>
                <Typography>
                  <span className={`${classes.legendBullet} High`}></span>
                  <span>
                    <IntlMessages id="appModule.riskScoreLevel.high" />
                  </span>
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  <span className={`${classes.legendBullet} Medium`}></span>
                  <span>
                    <IntlMessages id="appModule.riskScoreLevel.medium" />
                  </span>
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  <span className={`${classes.legendBullet} Low`}></span>
                  <span>
                    <IntlMessages id="appModule.riskScoreLevel.low" />
                  </span>
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  <span className={`${classes.legendBullet} Pending`}></span>
                  <span>
                    <IntlMessages id="appModule.riskScoreLevel.pending" />
                  </span>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        )}
        {!hideKYTChart && !hideKYCChart && <Divider variant="fullWidth" />}
        {canAccessKYT(customerMe) && !hideKYTChart && (
          <>
            <Grid container spacing={1} className="my-3">
              <ResponsiveContainer width="100%" id="chart">
                <Fragment>
                  <span style={{ fontSize: toRem(21), paddingLeft: toRem(7) }}>
                    <IntlMessages id="case.detail.riskSummary.kyt.title" />
                  </span>
                  <DoughnutChart
                    height={100}
                    type={"percent"}
                    data={dataChartCountKYT}
                  />
                </Fragment>
              </ResponsiveContainer>
              <Grid
                container
                className="mt-4"
                direction="row"
                justify="space-around"
                alignItems="center"
                spacing={1}
              >
                <Grid item>
                  <Typography>
                    <span className={`${classes.legendBullet} High`}></span>
                    <span>
                      <IntlMessages id="appModule.riskScoreLevel.high" />
                    </span>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>
                    <span className={`${classes.legendBullet} Medium`}></span>
                    <span>
                      <IntlMessages id="appModule.riskScoreLevel.medium" />
                    </span>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>
                    <span className={`${classes.legendBullet} Low`}></span>
                    <span>
                      <IntlMessages id="appModule.riskScoreLevel.low" />
                    </span>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </JRCard>
    </Fragment>
  );
};

export default CaseRiskLevel;
