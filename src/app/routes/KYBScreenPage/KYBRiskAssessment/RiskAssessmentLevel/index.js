import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { makeStyles, withStyles } from "@mui/styles";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { KYB_CHANGE_RISK_LEVEL_ASSESSMENT } from "actions/KYBAction";
import { SETTING_KYB_DETAIL } from "actions/SettingScoringAction";
import { ReactComponent as Edit } from "assets/icons/Edit.svg";
import RiskScorePieChart from "components/Chart/v1/RiskScorePieChart";
import { RISK_LEVEL_TEXT } from "constants/RiskLevelType";
import { isEmpty } from "lodash";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { ResponsiveContainer } from "recharts";
import { formatDate, LONG_DATE } from "util/date";
import { getRiskLevel, getTextTranslateRiskKey } from "util/riskLevel";
import styles from "../KYBRiskAssessment.module.scss";
import FormEditRiskScore from "./EditRiskAssessmentLevel";
import HistoryRiskAssessment from "./HistoryRiskAssessment";
import RiskLevel from "./RiskLevel";

export const getDataChart = (level, func) => {
  const risk = 0;
  const riskLevel = getRiskLevel(level);
  return (
    level && {
      datasets: [
        {
          data: [risk, 0],
          backgroundColor: [riskLevel.color, riskLevel.color],
          borderWidth: 0,
          hoverBackgroundColor: [riskLevel.color, riskLevel.color],
        },
      ],
      textLevel: getRiskLevel(level).textNormal,
      centerText: {
        textNumber: `${risk}`,
        colorNumber: riskLevel.color,
        text: [func({ id: getTextTranslateRiskKey(riskLevel?.textNormal) })],
        colorText: riskLevel.color,
        fontStyle: "Arial",
      },
    }
  );
};

const RiskAssessmentLevel =
  /**
   *
   * @param {KycIndividualMatchEntity} props.match
   * @returns {JSX.Element}
   * @constructor
   */
  function RiskAssessmentLevel(props) {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const settingKyb = useSelector((state) => state.settingScoring.settingKyb);
    const windowWidth = useSelector((state) => state.settings.width);
    const riskDetail = useSelector((state) => state.kyb.riskDetail);
    const { riskLevel, kybId, riskHistory, ACL } = props;
    const [level, setLevel] = React.useState();
    const [isShowMonthReScreening, setIsShowMonthReScreening] = React.useState(
      false
    );
    const [openEditTotalRiskScore, setOpenEditTotalRiskScore] = React.useState(
      false
    );

    const handleOpenEditTotalRiskScore = () => {
      setOpenEditTotalRiskScore(true);
    };

    const handleCloseEditTotalRiskScore = (value) => {
      setOpenEditTotalRiskScore(false);
    };
    useEffect(() => {
      setIsShowMonthReScreening(
        riskDetail?.kybRequest?.enableReScreening &&
          riskDetail?.riskLevel !== null
      );
      // eslint-disable-next-line
    }, [riskDetail]);
    useEffect(() => {
      fetchKYBSetting();
      // eslint-disable-next-line
    }, [settingKyb, level]);

    const fetchKYBSetting = () => {
      if (isEmpty(settingKyb) && isShowMonthReScreening) {
        dispatch(SETTING_KYB_DETAIL());
      }
    };

    const onSubmitChangeRiskLevel = (level) => {
      dispatch(
        KYB_CHANGE_RISK_LEVEL_ASSESSMENT({
          kybId: kybId,
          body: { newRiskAssessmentLevel: level, notes: "" },
        })
      ).then((result) => {
        setLevel(level);
      });
    };

    React.useEffect(() => {
      setLevel(riskLevel);
    }, [riskLevel]);

    const getMonthReScreening = () => {
      const month =
        riskLevel === RISK_LEVEL_TEXT.LOW
          ? settingKyb.riskLevelSetting?.LOW
          : riskLevel === RISK_LEVEL_TEXT.MEDIUM
          ? settingKyb.riskLevelSetting?.MEDIUM
          : settingKyb.riskLevelSetting?.HIGH;
      if (parseInt(month)) {
        return parseInt(month) === 1
          ? `${month} ${formatMessage({ id: "kyb.monthRescreening" })}`
          : `${month} ${formatMessage({ id: "kyb.monthsRescreening" })}`;
      } else {
        return "";
      }
    };

    return (
      <>
        <JRCard
          headerLine
          className={styles.jrCardStyleRiskNote}
          header={
            <div
              className={"d-flex justify-content-between align-items-center"}
            >
              <div className={"d-flex flex-column"}>
                <Typography variant="titleForm">
                  <IntlMessages id="kyb.risk.level" />
                </Typography>
                <Typography variant="subtitleGray">
                  <IntlMessages id={"kyc.risk.score.last.edit"} />{" "}
                  {formatDate(riskDetail?.kybRequest?.updatedAt, LONG_DATE)}
                </Typography>
              </div>
              {ACL.isAllowedPermissions("MY_KYB_EDIT") && (
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
                    kybId={kybId}
                    risk={riskDetail?.kybRequest?.scoring?.risk}
                    riskLevel={riskDetail?.kybRequest?.scoring?.riskLevel}
                  ></FormEditRiskScore>
                </div>
              )}
            </div>
          }
        >
          <div
            style={{
              paddingBottom: riskHistory?.length > 0 ? toRem(0) : toRem(24),
            }}
          >
            <Grid container>
              {riskLevel ? (
                <ResponsiveContainer width="100%" id="chart">
                  <RiskScorePieChart
                    scoring={{ risk: 0, riskLevel: riskLevel }}
                    showRiskLevel
                  />
                </ResponsiveContainer>
              ) : (
                <Grid item xs={12}>
                  <div
                    className={
                      !ACL.isAllowedPermissions("MY_KYB_EDIT") &&
                      styles.disabledDiv
                    }
                  >
                    <RiskLevel
                      disableRounded={true}
                      value={level ? level : null}
                      onChange={(e) => {
                        onSubmitChangeRiskLevel(e?.target?.value);
                      }}
                    />
                  </div>
                </Grid>
              )}
            </Grid>
            {isShowMonthReScreening && (
              <Grid container alignItems={"center"} justifyContent={"center"}>
                <Grid item className="d-flex mt-2 algin-items-center">
                  <span className={styles.textRescreen}>
                    {`${formatMessage({
                      id: "setting.tab.other.ReScreening",
                    })} `}
                    {windowWidth < 1511 && <br />}
                  </span>

                  <Typography variant="labelFieldBlack">
                    {getMonthReScreening()}
                  </Typography>
                </Grid>
              </Grid>
            )}
            {riskHistory?.length > 0 && (
              <Grid container justify={"center"}>
                <HistoryRiskAssessment data={riskHistory} />
              </Grid>
            )}
          </div>
        </JRCard>
      </>
    );
  };

export default RiskAssessmentLevel;
