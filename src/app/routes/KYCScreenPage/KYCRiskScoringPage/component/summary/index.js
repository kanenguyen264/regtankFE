import { Box, Grid, Tooltip, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { ReactComponent as Edit } from "assets/icons/Edit.svg";
import RiskScorePieChart from "components/Chart/v1/RiskScorePieChart";
import React, { Fragment, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { ResponsiveContainer } from "recharts";
import { formatDate, LONG_DATE } from "util/date";
import { getRiskLevel } from "util/riskLevel";
import { withACL } from "../../../../../../acl";
import FormEditRiskScore from "../FormViewEditRiskScore/EditTotalRiskScorev1";
import HistoryTotalRiskScore from "../FormViewEditRiskScore/HistoryTotalRiskScore";
import styles from "../../RiskScoringPage.module.scss";
import { compose } from "recompose";
import { baseStyles } from "@protego/sdk/styles/base";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
/**
 *
 * @param {KycIndividualRiskScoreEntity} scoring
 * @returns {JSX.Element}
 * @constructor
 */
function Summary({ scoring, enableReScreening, kycId, ACL }) {
  const { formatMessage } = useIntl();
  const windowWidth = useSelector((state) => state.settings.width);
  const [openEditTotalRiskScore, setOpenEditTotalRiskScore] = useState(false);

  const handleOpenEditTotalRiskScore = () => {
    setOpenEditTotalRiskScore(true);
  };

  const handleCloseEditTotalRiskScore = (value) => {
    setOpenEditTotalRiskScore(false);
  };

  return (
    <Fragment>
      <JRCard
        className={styles.riskScoreContainer}
        headerLine
        header={
          <div className={"d-flex justify-content-between align-items-center"}>
            <div className={"d-flex flex-column"}>
              <Typography variant="titleForm">
                <IntlMessages id="total-risk-score" />
              </Typography>
              <Typography variant="subtitleGray">
                <IntlMessages id={"kyc.risk.score.last.edit"} />{" "}
                {formatDate(scoring.updatedAt, LONG_DATE)}
              </Typography>
            </div>
            {ACL.isAllowedPermissions("MY_KYC_EDIT") &&
              scoring.sanctionedPersonOrCountry.info === false && (
                <div>
                  <Tooltip
                    style={{ minWidth: toRem(20) }}
                    title={<IntlMessages id={"Edit"}></IntlMessages>}
                    arrow
                  >
                    <Button
                      aria-label="edit-risk-scoring"
                      disableRipple
                      disableFocusRipple
                      onClick={handleOpenEditTotalRiskScore}
                      variant={"outlinedIconDefault"}
                    >
                      <Edit />
                    </Button>
                  </Tooltip>
                  <FormEditRiskScore
                    isOpen={openEditTotalRiskScore}
                    onClose={handleCloseEditTotalRiskScore}
                    kycId={kycId}
                    risk={scoring.risk}
                    riskLevel={scoring.riskLevel}
                  ></FormEditRiskScore>
                </div>
              )}
          </div>
        }
      >
        <div
          style={{
            paddingBottom:
              scoring.changeHistory && scoring.changeHistory.length > 0
                ? toRem(0)
                : toRem(24),
          }}
        >
          <Grid container>
            <ResponsiveContainer width="100%" id="chart">
              <RiskScorePieChart
                isSanction={scoring.sanctionedPersonOrCountry.info}
                scoring={{ risk: scoring.risk, riskLevel: scoring.riskLevel }}
              />
            </ResponsiveContainer>
            {enableReScreening && (
              <Grid container alignItems={"center"} justifyContent={"center"}>
                <Grid item className="d-flex mt-2 algin-items-center">
                  <span className={styles.textRescreen}>
                    {`${formatMessage({
                      id: "setting.tab.other.ReScreening",
                    })} `}
                    {windowWidth < 1511 && <br />}
                  </span>

                  <Typography variant="labelFieldBlack">
                    {scoring.reScreeningPeriod === 1
                      ? `1 ${formatMessage({
                          id: "kyc.month",
                        })}`
                      : `${scoring.reScreeningPeriod} ${formatMessage({
                          id: "kyc.months",
                        })}`}
                  </Typography>
                </Grid>
              </Grid>
            )}
            {scoring.changeHistory && scoring.changeHistory.length > 0 && (
              <Grid
                item
                xs={12}
                className="d-flex justify-content-center align-items-center"
              >
                <HistoryTotalRiskScore data={scoring.changeHistory} />
              </Grid>
            )}
          </Grid>
        </div>
      </JRCard>
    </Fragment>
  );
}

export default compose(withStyles(baseStyles, { index: 99 }), withACL)(Summary);
