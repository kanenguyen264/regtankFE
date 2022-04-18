import { Grid, Tooltip, Typography } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { ReactComponent as Edit } from "assets/icons/Edit.svg";
import RiskScorePieChart from "components/Chart/v1/RiskScorePieChart";
import { round } from "lodash";
import React, { Fragment, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { ResponsiveContainer } from "recharts";
import { compose } from "recompose";
import { formatDate, LONG_DATE } from "util/date";
import { withACL } from "../../../../../../acl";
import styles from "../../RiskScoringPage.module.scss";
import FormEditRiskScore from "../FormViewEditRiskScore/EditTotalRiskScorev1";
import HistoryTotalRiskScore from "../FormViewEditRiskScore/HistoryTotalRiskScore";

/**
 *
 * @param {KycIndividualRiskScoreEntity} scoring
 * @returns {JSX.Element}
 * @constructor
 */
function Summary({ scoring, kycId, enableReScreening, ACL }) {
  const [openEditTotalRiskScore, setOpenEditTotalRiskScore] = useState(false);
  const { formatMessage } = useIntl();
  const windowWidth = useSelector((state) => state.settings.width);

  const handleOpenEditTotalRiskScore = () => {
    setOpenEditTotalRiskScore(true);
  };

  const handleCloseEditTotalRiskScore = () => {
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
            {ACL.isAllowedPermissions("DJ_MY_KYC_EDIT") &&
              scoring.sanctionList.info === false && (
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
                    risk={round(scoring?.risk, 2)}
                    riskLevel={scoring?.riskLevel}
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
                isSanction={scoring?.sanctionList?.info}
                scoring={{ risk: scoring?.risk, riskLevel: scoring?.riskLevel }}
              />
            </ResponsiveContainer>
            {enableReScreening && (
              <Grid container alignItems={"center"} justifyContent={"center"}>
                <Grid item className="d-flex mt-2 algin-items-center">
                  <div className="d-flex align-items-center ">
                    <Typography variant="labelFieldForm" className="mr-2">
                      {`${formatMessage({
                        id: "setting.tab.other.ReScreening",
                      })} `}
                      {windowWidth < 1511 && <br />}
                    </Typography>

                    <Typography variant="labelFieldBlack">
                      {scoring.reScreeningPeriod === 1
                        ? `1 ${formatMessage({
                            id: "kyc.month",
                          })}`
                        : `${scoring.reScreeningPeriod} ${formatMessage({
                            id: "kyc.months",
                          })}`}
                    </Typography>
                  </div>
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
  // return (
  //   <Fragment>
  //     <JRCard
  //       dense
  //       className={styles.headerSummary}
  //       headerLine
  //       header={
  //         <div
  //           className={
  //             "d-flex justify-content-between align-items-center position-relative"
  //           }
  //         >
  //           {scoring?.changeHistory && scoring?.changeHistory?.length > 0 && (
  //             <div className={clsx(styles.ribbon, styles["ribbon-top-left"])}>
  //               <span>
  //                 <IntlMessages id="kyc.labelEdited"></IntlMessages>
  //               </span>
  //             </div>
  //           )}
  //           <div
  //             className={
  //               scoring?.changeHistory && scoring?.changeHistory?.length > 0
  //                 ? styles.hasRibbon
  //                 : ""
  //             }
  //           >
  //             <Typography style={{ fontSize: toRem(21), fontWeight: 500 }}>
  //               <IntlMessages id="total-risk-score" />
  //             </Typography>
  //           </div>
  //           {scoring?.sanctionList?.info === false && (
  //             <div>
  //               <Tooltip
  //                 style={{ minWidth: toRem(20) }}
  //                 title={<IntlMessages id={"Edit"}></IntlMessages>}
  //                 arrow
  //               >
  //                 <EditIconButton
  //                   aria-label="edit-risk-scoring"
  //                   disableRipple
  //                   disableFocusRipple
  //                   onClick={handleOpenEditTotalRiskScore}
  //                 >
  //                   <Edit />
  //                 </EditIconButton>
  //               </Tooltip>
  //               <FormEditRiskScore
  //                 isOpen={openEditTotalRiskScore}
  //                 onClose={handleCloseEditTotalRiskScore}
  //                 kycId={kycId}
  //                 risk={round(scoring?.risk, 2)}
  //                 riskLevel={scoring?.riskLevel}
  //               ></FormEditRiskScore>
  //             </div>
  //           )}
  //         </div>
  //       }
  //     >
  //       <div>
  //         <Grid container spacing={1} className="mt-1 mb-2">
  //           <ResponsiveContainer width="100%" id="chart">
  //             <RiskScorePieChart
  //               isSanction={scoring?.sanctionList?.info}
  //               scoring={{ risk: scoring?.risk, riskLevel: scoring?.riskLevel }}
  //             />
  //           </ResponsiveContainer>
  //           {enableReScreening && (
  //             <Grid
  //               justify="center"
  //               container
  //               alignItems="center"
  //               className="mt-4 mb-2"
  //             >
  //               <Typography>
  //                 <Box
  //                   component="span"
  //                   fontWeight="fontWeightBold"
  //                   fontSize={17}
  //                 >
  //                   {`${formatMessage({
  //                     id: "setting.tab.other.ReScreening",
  //                   })}: `}
  //                 </Box>
  //                 {windowWidth < 1511 && <br />}
  //                 <Box
  //                   component="span"
  //                   fontWeight="fontWeightBold"
  //                   fontSize={17}
  //                   color={getRiskLevel(scoring.riskLevel).color}
  //                 >
  //                   {scoring.reScreeningPeriod === 1
  //                     ? `1 ${formatMessage({
  //                         id: "kyc.month",
  //                       })}`
  //                     : `${scoring.reScreeningPeriod} ${formatMessage({
  //                         id: "kyc.months",
  //                       })}`}
  //                 </Box>
  //               </Typography>
  //             </Grid>
  //           )}
  //         </Grid>
  //         {scoring?.changeHistory && scoring?.changeHistory?.length > 0 && (
  //           <Grid container className="mt-3 mb-3">
  //             <Grid item xs={12}>
  //               <HistoryTotalRiskScore data={scoring?.changeHistory} />
  //             </Grid>
  //           </Grid>
  //         )}
  //       </div>
  //     </JRCard>
  //   </Fragment>
  // );
}

export default compose(withACL)(Summary);
