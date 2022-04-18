import {
  Button,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
} from "@mui/material";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog/Dialog";
import makeStyles from "@mui/styles/makeStyles";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import CloseableDialogTitle from "@protego/sdk/UI/CloseableDialogTitle/CloseableDialogTitle";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { ReactComponent as IcDatabase } from "assets/icons/ic_databaseUpdate.svg";
import { ReactComponent as IcManualEdit } from "assets/icons/ic_manualEdited.svg";
import { round } from "lodash";
import React, { Fragment, useEffect, useState } from "react";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { getRiskLevel } from "util/riskLevel";
import { getFullName } from "util/string";
import styles from "./styles.module.scss";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  content: {
    fontSize: toRem(14),
    padding: "0px 0px",
    color: "#252525",
    width: toRem(488),
  },
  contentActions: {
    //   height: "40px",
    // alignItems: "center",
  },
  colorGreen: {
    color: "#4CAF50",
  },
  colorYellow: {
    color: "#FF9800",
  },
  colorRed: {
    color: "#EA2134",
  },
  actionButtons: {
    color: "#0080FF",
    backgroundColor: "transparent !important",
  },
  actionButtonsDisabled: {
    color: "#0080ff70 !important",
  },
  textLabel: {
    color: "#606E7B",
    fontSize: toRem(12),
  },
}));

const KYTRiskScoreHistoryDialog = ({ open, onClose, data }) => {
  const className = useStyles();
  const [indexSelected, setIndexSelected] = useState(0);
  const [itemSelected, setItemSelected] = useState({});

  useEffect(() => {
    if (data) {
      setItemSelected(data[indexSelected]);
    }
  }, [indexSelected, data]);

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
    <Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        allowCloseOnTitle={true}
        //  disableBackdropClick
        title={{
          text: <IntlMessages id={"kyt.riskScore.historyDialogHeader"} />,
          //   icon: <Icon component={ErrorOutline} color="primary" />,
        }}
        disableDialogAction={true}
        className={styles.riskCoreViewDialog}
      >
        {/* <CloseableDialogTitle onClose={onClose}>
          <IntlMessages id={"kyt.riskScore.historyDialogHeader"} />
        </CloseableDialogTitle> */}

        <div className={clsx(className.content)}>
          {itemSelected && (
            <Grid container>
              <Grid item xs={12} className={styles.contentWrapper}>
                <Grid container>
                  <Grid item xs={12}>
                    <Grid container>
                      <Grid xs={6}>
                        <div className={"d-flex flex-column"}>
                          <span className={className.textLabel}>
                            <IntlMessages id={"kyt.riskScore.previousScore"} />
                          </span>
                          <div className={"d-flex"}>
                            <label
                              style={{
                                color: getRiskLevel(
                                  itemSelected.previousScoreRiskLevel
                                ).color,
                              }}
                              className="mt-1"
                            >
                              {round(itemSelected.previousScore)}
                            </label>
                            <label className="mt-1">
                              <span
                                style={{
                                  background: getRiskLevel(
                                    itemSelected.previousScoreRiskLevel
                                  ).color,
                                  width: toRem(10),
                                  height: toRem(10),
                                  borderRadius: "50%",
                                  display: "inline-block",
                                  marginRight: "5px",
                                  marginLeft: "15px",
                                }}
                              />
                              <span>
                                {
                                  {
                                    LOW: (
                                      <IntlMessages
                                        id={"appModule.riskScoreLevel.low"}
                                      />
                                    ),
                                    MEDIUM: (
                                      <IntlMessages
                                        id={"appModule.riskScoreLevel.medium"}
                                      />
                                    ),
                                    HIGH: (
                                      <IntlMessages
                                        id={"appModule.riskScoreLevel.high"}
                                      />
                                    ),
                                  }[itemSelected.previousScoreRiskLevel]
                                }
                              </span>
                            </label>
                          </div>
                        </div>
                      </Grid>
                      <Grid xs={6}>
                        <div className={"d-flex flex-column"}>
                          <span className={className.textLabel}>
                            <IntlMessages id={"kyt.view.history.type"} />
                          </span>
                          <span className="mt-1">
                            {itemSelected?.type === "SYSTEM" ? (
                              <div className={"d-flex align-items-center"}>
                                <IcDatabase />
                                <IntlMessages
                                  id={"kyt.view.history.database.update"}
                                />
                              </div>
                            ) : (
                              <div className={"d-flex align-items-center"}>
                                <IcManualEdit />
                                <IntlMessages id={"kyt.view.history.manual"} />
                              </div>
                            )}
                          </span>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} className="mt-3 mb-3">
                    <Grid container>
                      <Grid xs={6}>
                        <div className={"d-flex flex-column"}>
                          <span className={className.textLabel}>
                            <IntlMessages id={"kyt.riskScore.createdAt"} />
                          </span>
                          <span className="mt-1">
                            {formatDate(itemSelected.updatedAt, LONG_DATE_TIME)}
                          </span>
                        </div>
                      </Grid>
                      <Grid xs={6}>
                        <div className={"d-flex flex-column"}>
                          <span className={className.textLabel}>
                            <IntlMessages id={"kyt.riskScore.editedBy"} />
                          </span>
                          <Grid item className="mt-1">
                            <span>{getFullName(itemSelected.createdBy)}</span>
                          </Grid>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={12} className={className.textLabel}>
                    <span>
                      <IntlMessages id={"notes"} />
                    </span>
                  </Grid>
                  <Grid item xs={12} className="mt-1 mb-3">
                    <label>{itemSelected.note}</label>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Divider style={{backgroundColor: "#F4F4F6"}} />
              </Grid>
              <Grid item xs={12} className={styles.contentActionsWrapper}>
                <Grid
                  container
                  justify="space-between"
                  className={clsx(className.contentActions)}
                >
                  <Grid item className={styles.numOfRevisions}>
                    {" "}
                    <IntlMessages
                      id="kyt.riskScore.numOfRevisions"
                      values={{
                        CURRENT: indexSelected + 1,
                        TOTAL: (data && data.length) || 0,
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      size="small"
                      onClick={handlePrevious}
                      disabled={indexSelected === 0}
                      className={
                        indexSelected === 0
                          ? className.actionButtonsDisabled
                          : className.actionButtons
                      }
                    >
                      <KeyboardArrowLeft />
                      <IntlMessages id={"result.prev"} />
                    </Button>
                    &nbsp;
                    <Button
                      size="small"
                      onClick={handleNext}
                      disabled={data && indexSelected === data.length - 1}
                      className={
                        data && indexSelected === data.length - 1
                          ? className.actionButtonsDisabled
                          : className.actionButtons
                      }
                    >
                      <IntlMessages id={"result.next"} />
                      <KeyboardArrowRight />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </div>
      </Dialog>
    </Fragment>
  );
};

export default KYTRiskScoreHistoryDialog;
