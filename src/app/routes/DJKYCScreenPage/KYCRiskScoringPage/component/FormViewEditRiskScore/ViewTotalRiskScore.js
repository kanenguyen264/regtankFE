import { Dialog, DialogContent, Grid } from "@material-ui/core";
import CloseableDialogTitle from "@protego/sdk/UI/CloseableDialogTitle/CloseableDialogTitle";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import clsx from "clsx";
import { round } from "lodash";
import React, { Fragment } from "react";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { getRiskLevel } from "util/riskLevel";
import { getFullName } from "util/string";
import styles from "./FormViewEditRiskScore.module.scss";

const ViewRiskScore = ({ isOpen, onClose, data }) => {
  return (
    <Fragment>
      <Dialog fullWidth open={isOpen} onClose={onClose}>
        <CloseableDialogTitle onClose={onClose}>
          <IntlMessages id={"kyc.Notes"} />
        </CloseableDialogTitle>
        <DialogContent>
          <Grid container className={clsx("mt-2 mb-4", styles.containerView)}>
            <Grid item xs={12} className={"mb-2"}>
              <div className={styles.colLeft}>
                <span>
                  <IntlMessages id={"kyc.labelPreviousScore"} />
                </span>
              </div>
              <div className={styles.colRight}>
                <label
                  style={{
                    color: getRiskLevel(data.previousScoreRiskLevel).color
                  }}
                  className={styles.labelRiskScore}
                >
                  {round(data.previousScore)}
                </label>
                <label>
                  <span
                    className={clsx(styles.legendBullet)}
                    style={{
                      background: getRiskLevel(data.previousScoreRiskLevel)
                        .color
                    }}
                  ></span>
                  {
                    {
                      LOW: <IntlMessages id={"kyc.labelLowScore"} />,
                      MEDIUM: <IntlMessages id={"kyc.labelMediumScore"} />,
                      HIGH: <IntlMessages id={"kyc.labelHighScore"} />
                    }[data.previousScoreRiskLevel]
                  }
                </label>
              </div>
            </Grid>

            <Grid item xs={12} className="mb-2">
              <div className={styles.colLeft}>
                <span>
                  <IntlMessages id={"kyc.labelLastEditedBy"} />
                </span>
              </div>
              <div className={styles.colRight}>
                <span>{getFullName(data.lastModifiedBy)}</span>
              </div>
            </Grid>

            <Grid item xs={12} className="mb-2">
              <div className={styles.colLeft}>
                <span>
                  <IntlMessages id={"kyc.labelDateTime"} />
                </span>
              </div>
              <div className={styles.colRight}>
                <span>{formatDate(data.updatedAt, LONG_DATE_TIME)}</span>
              </div>
            </Grid>

            <Grid item xs={12} className="mb-2">
              <div className={styles.colLeft}>
                <span>
                  <IntlMessages id={"kyc.Notes"} />
                </span>
              </div>
              <div style={{ width: "100%" }}>
                <span style={{ wordBreak: "break-word" }}>{data.note}</span>
              </div>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default ViewRiskScore;
