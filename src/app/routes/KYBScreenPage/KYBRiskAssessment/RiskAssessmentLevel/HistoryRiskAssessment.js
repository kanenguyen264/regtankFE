import {
  CardActions,
  CardContent,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import JRCard from "@protego/sdk/UI/JRCard/JRCard";
import clsx from "clsx";
import React, { memo, useEffect, useState } from "react";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { getRiskLevel } from "util/riskLevel";
import styles from "../KYBRiskAssessment.module.scss";
import ViewHistoryRiskAssessment from "./ViewHistoryRiskAssessment";
import { getFullName, truncateStr } from "util/string";
import { round } from "lodash";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
const HistoryRiskAssessment = ({ data }) => {
  const [openViewRiskScore, setOpenViewRiskScore] = useState(false);
  const [indexSelected, setIndexSelected] = useState(0);
  const [itemSelected, setItemSelected] = useState();

  useEffect(() => {
    if (data) {
      setItemSelected(data[indexSelected]);
    }
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

  if (!itemSelected) {
    return null;
  }
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
            <Grid item xs={12} sm={5}>
              <Typography variant="small1">
                <IntlMessages id={"kyb.risk.assessment.history.previous"} />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={7}>
              <label>
                <span
                  className={clsx(styles.legendBullet)}
                  style={{
                    background: getRiskLevel(
                      itemSelected?.previousRiskAssessmentLevel
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
                      }[itemSelected?.previousRiskAssessmentLevel]
                    }
                  </span>
                </Typography>
              </label>
            </Grid>
          </Grid>

          <Grid container item className={styles.containerRow}>
            <Grid item xs={12} sm={5}>
              <Typography variant="small1">
                <IntlMessages id={"kyc.labelLastEditedBy"} />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={7}>
              <Typography variant="small1">
                {getFullName(itemSelected?.lastModifiedBy)}
              </Typography>
            </Grid>
          </Grid>

          <Grid container item className={styles.containerRow}>
            <Grid item xs={12} sm={5}>
              <Typography variant="small1">
                <IntlMessages id={"kyc.labelDateTime"} />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={7}>
              <Typography variant="small1">
                {formatDate(itemSelected.updatedAt, LONG_DATE_TIME)}
              </Typography>
            </Grid>
          </Grid>

          <Grid container item className={styles.containerRow}>
            <Grid item xs={12} sm={5}>
              <Typography variant="small1">
                <IntlMessages id={"kyc.Notes"} />
              </Typography>
            </Grid>
            <Grid item xs={12} sm={7}>
              <label style={{ wordBreak: "break-word" }}>
                <Typography variant="small1">
                  {truncateStr(itemSelected.notes, 100)}
                </Typography>
                {itemSelected.notes.length > 100 && (
                  <span
                    className={styles.labelMore}
                    onClick={handleOpenViewRiskScore}
                  >
                    <IntlMessages id={"kyc.labelMore"} />
                  </span>
                )}
              </label>
              <ViewHistoryRiskAssessment
                isOpen={openViewRiskScore}
                onClose={handleCloseViewRiskScore}
                data={itemSelected}
              />
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions className={styles.footerHistoryTotalRisk}>
        <Button
          variant="outlinedIcon"
          onClick={handlePrevious}
          disabled={indexSelected === 0}
        >
          <KeyboardArrowLeft />
        </Button>
        <Typography variant="Subtitle2" className="ml-3 mr-2">
          <div>
            <span>{indexSelected + 1}</span>/<span>{data.length}</span>
          </div>
        </Typography>
        <Button
          variant="outlinedIcon"
          onClick={handleNext}
          disabled={indexSelected === data.length - 1}
        >
          <KeyboardArrowRight />
        </Button>
      </CardActions>
    </div>
  );
};

export default memo(HistoryRiskAssessment);
