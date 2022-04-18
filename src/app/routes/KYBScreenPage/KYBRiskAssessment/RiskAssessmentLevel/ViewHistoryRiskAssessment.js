import { Grid } from "@mui/material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import clsx from "clsx";
import React, { memo } from "react";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { getRiskLevel } from "util/riskLevel";
import { getFullName } from "util/string";
import styles from "../KYBRiskAssessment.module.scss";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import { Typography } from "@material-ui/core";

const ViewHistoryRiskAssessment = ({ data, isOpen, onClose, risk }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      allowCloseOnTitle
      title={{
        text: <IntlMessages id={"kyc.Notes"} />,
      }}
    >
      <div>
        <Grid container className={clsx(styles.containerView)}>
          <Grid item xs={12} className={"mb-2"}>
            <div>
              <Typography variant="subtitleGray">
                <IntlMessages id={"kyb.risk.assessment.history.previous"} />
              </Typography>
            </div>
            <div>
              <Typography variant="textLabel2">
                <span
                  className={clsx(styles.legendBullet)}
                  style={{
                    background: getRiskLevel(data?.previousRiskAssessmentLevel)
                      .color,
                  }}
                ></span>
                {
                  {
                    LOW: <IntlMessages id={"kyc.labelLowScore"} />,
                    MEDIUM: <IntlMessages id={"kyc.labelMediumScore"} />,
                    HIGH: <IntlMessages id={"kyc.labelHighScore"} />,
                  }[data?.previousRiskAssessmentLevel]
                }
              </Typography>
            </div>
          </Grid>

          <Grid item xs={12} className="mb-2">
            <div>
              <Typography variant="subtitleGray">
                <IntlMessages id={"kyc.labelLastEditedBy"} />
              </Typography>
            </div>
            <div>
              <Typography variant="textLabel2">
                <span>{getFullName(data?.lastModifiedBy)}</span>
              </Typography>
            </div>
          </Grid>

          <Grid item xs={12} className="mb-2">
            <div>
              <Typography variant="subtitleGray">
                <IntlMessages id={"kyb.risk.assessment.history.editOn"} />
              </Typography>
            </div>
            <div>
              <Typography variant="textLabel2">
                <span>{formatDate(data?.updatedAt, LONG_DATE_TIME)}</span>
              </Typography>
            </div>
          </Grid>

          <Grid item xs={12} className="mb-2">
            <div>
              <Typography variant="subtitleGray">
                <IntlMessages id={"kyc.Notes"} />
              </Typography>
            </div>
            <div style={{ width: "100%" }}>
              <Typography variant="textLabel2">
                <span style={{ wordBreak: "break-word" }}>{data?.notes}</span>
              </Typography>
            </div>
          </Grid>
        </Grid>
      </div>
    </Dialog>
  );
};

export default memo(ViewHistoryRiskAssessment);
