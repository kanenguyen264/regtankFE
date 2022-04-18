import { Grid } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Link from "@protego/sdk/UI/Link";
import React from "react";
import { Route, Switch } from "react-router-dom";
import CaseReportExample from "./CaseReport";
import KYTReportExample from "./KYTReport";
import KYCMatchDetailsReport from "./KYCMatchDetailsReport";
import KYBMatchDetailsReport from "./KYBMatchDetailsReport";
import KYBRiskAssessmentReport from "./KYBRiskAssessmentReport";
import KYCRiskScoringReport from "./KYCRiskScoringReport";
import KYCScreeningDetailReport from "./KYCScreeningDetailReport";
import KYBScreeningDetailReport from "./KYBScreeningDetailReport";
const useStyles = makeStyles((theme) => ({
  appWrapper: {
    "& iframe": {
      height: "100vh",
      width: "calc(100%)"
    }
  }
}));

const ExampleReport = (props) => {
  const { match } = props;
  const styles = useStyles();
  return (
    <>
      <Grid container spacing={2} className={styles.appWrapper}>
        <Grid item xs={2}>
          <ul className="mt-4">
            <li>
              <Link to={`${match.url}/case`}>Case Report</Link>
            </li>
            <li>
              <Link to={`${match.url}/kyt`}>KYT Report</Link>
            </li>
            <li>
              <Link to={`${match.url}/kyc-match`}>KYC Match Detail</Link>
            </li>
            <li>
              <Link to={`${match.url}/kyc-risk`}>KYC Risk Scoring</Link>
            </li>
            <li>
              <Link to={`${match.url}/kyc-screening-details`}>
                KYC Screening Details
              </Link>
            </li>
            <li>
              <Link to={`${match.url}/kyb-match`}>KYB Match Detail</Link>
            </li>
            <li>
              <Link to={`${match.url}/kyb-risk-assessment`}>
                KYB Risk Assessment
              </Link>
            </li>
            <li>
              <Link to={`${match.url}/kyb-screening-details`}>
                KYB Screening Details
              </Link>
            </li>
          </ul>
        </Grid>
        <Grid item xs={10}>
          <Switch>
            <Route path={`${match.url}/case`} component={CaseReportExample} />
            <Route path={`${match.url}/kyt`} component={KYTReportExample} />
            <Route
              path={`${match.url}/kyc-match`}
              component={KYCMatchDetailsReport}
            />
            <Route
              path={`${match.url}/kyc-risk`}
              component={KYCRiskScoringReport}
            />
            <Route
              path={`${match.url}/kyc-screening-details`}
              component={KYCScreeningDetailReport}
            />
            <Route
              path={`${match.url}/kyb-match`}
              component={KYBMatchDetailsReport}
            />
            <Route
              path={`${match.url}/kyb-risk-assessment`}
              component={KYBRiskAssessmentReport}
            />
            <Route
              path={`${match.url}/kyb-screening-details`}
              component={KYBScreeningDetailReport}
            />
          </Switch>
        </Grid>
      </Grid>
    </>
  );
};

export default ExampleReport;
