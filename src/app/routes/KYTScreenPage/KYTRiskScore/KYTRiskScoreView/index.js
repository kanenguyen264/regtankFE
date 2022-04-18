import {
  Grid,
  IconButton,
  Link as MuiLink,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { withStyles } from "@material-ui/core/styles";
import CloseableDialogTitle from "@protego/sdk/UI/CloseableDialogTitle/CloseableDialogTitle";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import { toRem } from "@protego/sdk/utils/measurements";
import { SETTING_KYT_DETAIL } from "actions/SettingScoringAction";
import { ReactComponent as Edit } from "assets/icons/Edit.svg";
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
import { ReactComponent as Square } from "assets/icons/square.svg";
import { CriminalTypeActivities, ScoreMatrix } from "constants/KYTScoreMatrix";
import { ADMIN_ROLE } from "constants/Role";
import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ResponsiveContainer } from "recharts";
import KYTEditRiskScoreDialog from "../KYTRiskScoreEdit";
import KYTRiskScoreHistoryDialog from "../KYTRiskScoreHistory";
import RiskScorePieChart from "components/Chart/v1/RiskScorePieChart";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import { formatDate, LONG_DATE } from "util/date";
import "./style.scss";
import styles from "./styles.module.scss"

const EditIconButton = withStyles((theme) => ({
  root: {
    padding: 0,
    verticalAlign: "top",
    "&:hover": {
      backgroundColor: "#0000",
    },
    "&:hover svg path": {
      opacity: 0.7,
    },
  },
}))(IconButton);

const RiskScorePieChartCustom = withStyles(() => ({
  levelText: {},
  riskScoreContainer: {
    marginTop: `-${toRem(10)} !important`,
  },
  totalText: {
    fontSize: toRem(40),
  },
}))(RiskScorePieChart);

const KYTRiskScoreView = (props) => {
  const dispatch = useDispatch();
  const { kytId, scoring, mHeight, ACL } = props;
  const currentUser = useSelector((state) => state.me?.me);
  const [openEditRiskScore, setOpenEditRiskScore] = useState(false);
  const [openRiskScoreHistory, setOpenRiskScoreHistory] = useState(false);
  React.useEffect(() => {
    dispatch(SETTING_KYT_DETAIL());
    // eslint-disable-next-line
  }, []);

  const kytRiskScoreChangeHistory = useSelector((state) => {
    return state.kyt.current?.addressDetails?.kytRiskScoreChangeHistory;
  });
  const QuestionMark = () => {
    const [openQuestionMark, setOpenQuestionMark] = React.useState(false);
    const { settingKyt } = useSelector((state) => state.settingScoring);
    const handleClickOpen = () => {
      setOpenQuestionMark(true);
    };

    const handleClose = () => {
      setOpenQuestionMark(false);
    };

    const getColorLevel = (enumLevel) => {
      if (enumLevel <= settingKyt?.riskLevelSetting?.LOW) {
        return "#50AE55";
      } else if (enumLevel <= settingKyt?.riskLevelSetting?.MEDIUM) {
        return "#FF9800";
      } else {
        return "#EA2134";
      }
    };

    return (
      <>
        <span onClick={handleClickOpen} style={{ cursor: "pointer" }}>
          <QuestionMarkIcon />
        </span>

        <Dialog
          fullWidth
          open={openQuestionMark}
          onClose={handleClose}
          className={styles.viewLogDialog}
          disableDialogAction={true}
        >
          <CloseableDialogTitle onClose={handleClose}>
            <IntlMessages id={"kyt.kytScoreMatrix"} />
          </CloseableDialogTitle>

          <DialogContent>
            <div className="mt-4">
              <Grid container spacing={3}>
                <Grid
                  item
                  xs={4}
                  className="titleRisk"
                  style={{ textAlign: "center" }}
                >
                  <Square style={{ background: "#50AE55" }} /> &nbsp;
                  <IntlMessages id={"appModule.riskScoreLevel.low"} />
                </Grid>
                <Grid
                  className="titleRisk"
                  item
                  xs={4}
                  style={{ textAlign: "center" }}
                >
                  <Square style={{ background: "#FF9800" }} /> &nbsp;
                  <IntlMessages id={"appModule.riskScoreLevel.medium"} />
                </Grid>
                <Grid
                  className="titleRisk"
                  item
                  xs={4}
                  style={{ textAlign: "center" }}
                >
                  <Square style={{ background: "#EA2134" }} /> &nbsp;
                  <IntlMessages id={"appModule.riskScoreLevel.high"} />
                </Grid>
              </Grid>
            </div>
            <div className="mt-4">
              {ScoreMatrix.map((item, index) => {
                return (
                  <div id={index}>
                    <Grid container>
                      <Grid item xs={1} className="titleRisk">
                        <Square
                          style={{
                            background: getColorLevel(item.key),
                          }}
                        />
                        &nbsp; <span>{item.key}</span>
                      </Grid>
                      <Grid item xs={11} className="contentKYTScoreMatrix">
                        <IntlMessages id={item.content}></IntlMessages>
                      </Grid>
                    </Grid>
                    <hr />
                  </div>
                );
              })}
            </div>
            <div className="noteKYTScoreMatrix">
              <span>
                *<IntlMessages id="kyt.riskScoreMatrixNote"></IntlMessages>{" "}
              </span>
            </div>
            <div className="mt-3">
              <span className="titleRisk">
                <IntlMessages id="kyt.criminalTypeActivities"></IntlMessages>
              </span>
              <ul className="mt-1">
                {CriminalTypeActivities.map((item, index) => {
                  return (
                    <>
                      <li className="contentKYTScoreMatrix" key={index}>
                        <IntlMessages id={item.content}></IntlMessages>
                      </li>
                    </>
                  );
                })}
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  };
  const Header = () => {
    return (
      <div>
        <Grid className={"d-flex justify-content-between align-items-center"}>
          {/* <Grid item xs={2}>
            {kytRiskScoreChangeHistory && kytRiskScoreChangeHistory.length > 0 && (
              <div className="ribbon ribbon-top-left">
                <span>
                  <IntlMessages id="kyc.labelEdited"></IntlMessages>
                </span>
              </div>
            )}
          </Grid> */}
          {/* <Grid item xs={8}>
            <Typography style={{ fontSize: toRem(21), textAlign: "left" }}>
              <IntlMessages id="risk-score" /> {QuestionMark()}
            </Typography>
          </Grid> */}
          <div className={"d-flex flex-column"}>
            <Typography variant="h6" className="titleRiskScore">
              <IntlMessages id="risk-score" /> {QuestionMark()}
            </Typography>
            {kytRiskScoreChangeHistory && kytRiskScoreChangeHistory.length > 0 && (
              <span className="titleUpdateAt">
                <Typography variant="Subtitle2">
                  <IntlMessages id={"kyc.risk.score.last.edit"} />{" "}
                  {formatDate(
                    kytRiskScoreChangeHistory[0].updatedAt,
                    LONG_DATE
                  )}
                </Typography>
              </span>
            )}
          </div>
          {console.log(kytRiskScoreChangeHistory)}
          <Grid item xs={2}>
            {ACL.isAllowedPermissions("MY_KYT_EDIT") && (
              <Grid container justify="flex-end">
                <Tooltip
                  style={{ minWidth: toRem(20) }}
                  title={<IntlMessages id={"Edit"}></IntlMessages>}
                  arrow
                >
                  <EditIconButton
                    aria-label="edit-risk-scoring"
                    disableRipple
                    disableFocusRipple
                    onClick={handleOpenEditRiskScore}
                  >
                    <Edit />
                  </EditIconButton>
                </Tooltip>
              </Grid>
            )}
          </Grid>
        </Grid>
      </div>
    );
  };

  const handleOpenEditRiskScore = () => {
    setOpenEditRiskScore(true);
  };

  const handleCloseEditRiskScore = () => {
    setOpenEditRiskScore(false);
  };

  const handleOpenRiskScoreHistory = () => {
    setOpenRiskScoreHistory(true);
  };

  const handleCloseRiskScoreHistory = () => {
    setOpenRiskScoreHistory(false);
  };

  return (
    <Fragment>
      <KYTEditRiskScoreDialog
        open={openEditRiskScore}
        onClose={handleCloseEditRiskScore}
        kytId={kytId}
        currentRisk={scoring.risk}
        currentRiskLevel={scoring.riskLevel}
      ></KYTEditRiskScoreDialog>
      <JRCard style={{ height: mHeight }} dense headerLine header={<Header />}>
        <Grid container spacing={1} className="mb-4  mt-2">
          <ResponsiveContainer
            width="100%"
            id="kytRiskScoreContainer"
            className="d-flex flex-column align-items-center"
          >
            <>
              <RiskScorePieChartCustom
                scoring={{ risk: scoring.risk, riskLevel: scoring.riskLevel }}
              />

              {kytRiskScoreChangeHistory &&
                kytRiskScoreChangeHistory.length > 0 && (
                  <span className="mt-3">
                    <Button
                      aria-label="edit-risk-scoring"
                      color="primary"
                      onClick={handleOpenRiskScoreHistory}
                      variant={"outlined"}
                    >
                      <IntlMessages id="kyt.riskScore.viewHistory" />
                    </Button>
                  </span>
                )}
            </>
          </ResponsiveContainer>
        </Grid>

        <KYTRiskScoreHistoryDialog
          open={openRiskScoreHistory}
          onClose={handleCloseRiskScoreHistory}
          data={kytRiskScoreChangeHistory}
        />
      </JRCard>
    </Fragment>
  );
};

export default KYTRiskScoreView;
