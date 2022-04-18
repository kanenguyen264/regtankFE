import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import {
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import clsx from "clsx";
import { round } from "lodash";
import React, { memo, useEffect, useState } from "react";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { getRiskLevel } from "util/riskLevel";
import { getFullName, truncateStr } from "util/string";
import ViewRiskScore from "../FormViewEditRiskScore/ViewTotalRiskScore";
import styles from "./FormViewEditRiskScore.module.scss";
const HistoryTotalRiskScore = ({ data }) => {
  const [openViewRiskScore, setOpenViewRiskScore] = useState(false);
  const [indexSelected, setIndexSelected] = useState(0);
  const [itemSelected, setItemSelected] = useState(data[0]);

  useEffect(() => {
    setItemSelected(data[indexSelected]);
  }, [indexSelected, data]);

  const handleOpenViewRiskScore = () => {
    setOpenViewRiskScore(true);
  };

  const handleCloseViewRiskScore = (value) => {
    setOpenViewRiskScore(false);
  };

  const handlePrevious = () => {
    if (indexSelected === 0) {
      return;
    }
    setIndexSelected(indexSelected - 1);
  };

  const handleNext = () => {
    if (indexSelected === data.length - 1) {
      return;
    }
    setIndexSelected(indexSelected + 1);
  };

  return (
    <div className={styles.container}>
      <CardContent className={styles.content}>
        <Grid container>
          <Grid
            container
            columnSpacing={0.5}
            item
            className={styles.containerRow}
          >
            <Grid item xs={12} sm={5} className={styles.colLeft}>
              <Typography variant="small1">
                <IntlMessages id={"kyc.labelPreviousScore"} />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={7} className={styles.colRight}>
              <label
                style={{
                  color: getRiskLevel(itemSelected.previousScoreRiskLevel)
                    .color,
                }}
                className={styles.labelRiskScore}
              >
                {round(itemSelected.previousScore)}
              </label>
              <label>
                <span
                  className={clsx(styles.legendBullet)}
                  style={{
                    background: getRiskLevel(
                      itemSelected.previousScoreRiskLevel
                    ).color,
                  }}
                ></span>
                <Typography variant="labelFieldForm" color="grayText">
                  <span>
                    {
                      {
                        LOW: <IntlMessages id={"kyc.labelLowScore"} />,
                        MEDIUM: <IntlMessages id={"kyc.labelMediumScore"} />,
                        HIGH: <IntlMessages id={"kyc.labelHighScore"} />,
                      }[itemSelected.previousScoreRiskLevel]
                    }
                  </span>
                </Typography>
              </label>
            </Grid>
          </Grid>

          <Grid container item className={styles.containerRow}>
            <Grid item xs={12} sm={5} className={styles.colLeft}>
              <Typography variant="small1">
                <IntlMessages id={"kyc.labelLastEditedBy"} />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={7} className={styles.colRight}>
              <Typography variant="small1">
                {getFullName(itemSelected.lastModifiedBy)}
              </Typography>
            </Grid>
          </Grid>

          <Grid container item className={styles.containerRow}>
            <Grid item xs={12} sm={5} className={styles.colLeft}>
              <Typography variant="small1">
                <IntlMessages id={"kyc.labelDateTime"} />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={7} className={styles.colRight}>
              <Typography variant="small1">
                {formatDate(itemSelected.updatedAt, LONG_DATE_TIME)}
              </Typography>
            </Grid>
          </Grid>

          <Grid container item className={styles.containerRow}>
            <Grid item xs={12} sm={5} className={styles.colLeft}>
              <Typography variant="small1">
                <IntlMessages id={"kyc.Notes"} />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={7} className={styles.colRight}>
              <label style={{ wordBreak: "break-word" }}>
                <Typography variant="small1">
                  {truncateStr(itemSelected.note, 100)}
                </Typography>
                {itemSelected.note.length > 100 && (
                  <span
                    className={styles.labelMore}
                    onClick={handleOpenViewRiskScore}
                  >
                    <IntlMessages id={"kyc.labelMore"} />
                  </span>
                )}
              </label>
              <ViewRiskScore
                isOpen={openViewRiskScore}
                onClose={handleCloseViewRiskScore}
                data={itemSelected}
              ></ViewRiskScore>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions className={styles.footerHistoryTotalRisk}>
        <IconButton
          variant="outlinedIconDefault"
          onClick={handlePrevious}
          disabled={indexSelected === 0}
        >
          <KeyboardArrowLeft />
        </IconButton>
        <Typography variant="Subtitle2">
          <span>{indexSelected + 1}</span>/<span>{data.length}</span>
        </Typography>
        <IconButton
          variant="outlinedIconDefault"
          onClick={handleNext}
          disabled={indexSelected === data.length - 1}
        >
          <KeyboardArrowRight />
        </IconButton>
      </CardActions>
    </div>
  );
};

export default memo(HistoryTotalRiskScore);
