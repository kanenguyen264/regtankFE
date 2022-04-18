import { Dialog, DialogContent, Grid, Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CloseableDialogTitle from "@protego/sdk/UI/CloseableDialogTitle/CloseableDialogTitle";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import { toRem } from "@protego/sdk/utils/measurements";
import { KYT_CHANGE_LOG } from "actions/KYTAction";
import { NEW_RISK, NEW_TRANSACTION } from "constants/KYTOM";
import React, { memo, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { formatDate, LONG_DATE_TIME } from "util/date";

const useStyles = makeStyles((theme) => ({
  content: {
    fontSize: "14px",
    color: "#464646",
    paddingTop: toRem(24),
    height: toRem(500)
  },
  contentActions: {
    height: "50px",
    alignItems: "center"
  },
  colorGreen: {
    color: "#4CAF50"
  },
  colorYellow: {
    color: "#FF9800"
  },
  colorRed: {
    color: "#EA2134"
  },
  actionButtons: {
    color: "#0080FF",
    backgroundColor: "transparent !important"
  },
  actionButtonsDisabled: {
    color: "#0080ff70 !important"
  },
  textLabel: {
    color: "#7A7A7A"
  }
}));
const ViewLogDialog = (props) => {
  const { open, onClose, kytId } = props;
  const listChangeLog = useSelector((state) => state.kyt.listChangeLog);
  const [loading, setLoading] = useState(false);
  const className = useStyles();
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  React.useEffect(() => {
    setLoading(true);
    if (open) {
      fetch();
    }
    // eslint-disable-next-line
  }, [dispatch, open]);

  const fetch = () => {
    dispatch(KYT_CHANGE_LOG(kytId)).then(() => {
      setLoading(false);
    });
  };

  const getContent = (value) => {
    let content = "";
    if (value?.onGoingMonitoringType === NEW_TRANSACTION) {
      return (content = (
        <IntlMessages id={"kyt.view.change.log.transaction"} />
      ));
    }
    if (value?.onGoingMonitoringType === NEW_RISK) {
      return (
        formatMessage({
          id: "kyt.view.change.log.risk.score"
        }) +
        ` ${value?.previousRiskScore} ` +
        formatMessage({
          id: "kyt.view.change.log.risk.score.to"
        }) +
        ` ${value?.newRiskScore}`
      );
    }
    return <Typography>{content}</Typography>;
  };

  return (
    <Dialog fullWidth open={open} onClose={onClose} disableBackdropClick>
      <CloseableDialogTitle onClose={onClose}>
        <IntlMessages id={"kyt.transactions.change.log"} />
      </CloseableDialogTitle>
      <LoadingWrapper loading={loading}>
        <DialogContent className={className.content}>
          {listChangeLog?.map((value) => {
            return (
              <Grid container spacing={1}>
                <Grid item xs={3}>
                  <Typography className={className.textLabel}>
                    {formatDate(value?.updatedAt, LONG_DATE_TIME)}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  {getContent(value)}
                </Grid>
              </Grid>
            );
          })}
        </DialogContent>
      </LoadingWrapper>
    </Dialog>
  );
};

export default memo(ViewLogDialog);
