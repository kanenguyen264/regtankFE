import { Button, DialogActions, DialogContent } from "@mui/material";
import { FormControlLabel, Typography } from "@mui/material";
import { Switch } from "@protego/sdk/RegtankUI/v1/Switch";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { makeStyles } from "@mui/styles";
import CloseableDialogTitle from "@protego/sdk/RegtankUI/v1/CloseableDialogTitle/CloseableDialogTitle";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import imgErrorSrc from "assets/images/error.png";
import clsx from "clsx";
import SwitchButton from "components/SwitchButton";
import React, { useCallback, useEffect, useState } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { caculateNumerDeduct } from "util/omCerditDeduct";

const useStyles = makeStyles((theme) => ({
  textWhite: {
    color: "#ffffff",
  },
  contentText: {
    color: "#606E7B",
    fontWeight: "bold",
    lineHeight: "20px",
    opacity: 0.8,
    letterSpacing: 0.1,
  },
  grayText: {
    color: "#7A7A7A",
  },
  switchNoBoder: {
    marginLeft: toRem(-15),
    "& > div": {
      paddingLeft: "0 !important",
      paddingRight: "0 !important",
      borderTop: "1px solid #E6E6E6",
      borderRadius: 0,
      "&:first-child": {
        borderTop: 0,
      },
      "& .MuiTypography-root": {
        fontSize: toRem(15),
        lineHeight: "22px",
        color: "#464646",
      },
    },
  },
  smallText: {
    fontSize: toRem(15),
    lineHeight: "22px",
  },
  listBox: {
    border: "1px solid #C7C7C7",
    boxSizing: "border-box",
    borderRadius: "6px",
    padding: "14px 16px",
    color: "#2B2B2B !important",
  },
  btnClose: {
    backgroundColor: "#0080FF",
    color: "#ffffff",
    "&:focus, &:hover, &$active": {
      backgroundColor: "#006dd8",
      color: "#ffffff",
    },
  },
  btnSave: {
    backgroundColor: "#0080FF",
    color: "#ffffff",
    "&:focus, &:hover, &$active": {
      backgroundColor: "#006dd8",
      color: "#ffffff",
    },
  },
  btnCancel: {
    backgroundColor: "#ffffff",
    color: "#2B2B2B",
    "&:focus, &:hover, &$active": {
      backgroundColor: "#f4f4f4",
      color: "#2B2B2B",
    },
  },
  creditNote: {
    color: "#7A7A7A",
    marginTop: 10,
  },
  labelPlacementStart: {
    display: "flex",
    color: "red",
  },
}));

const OngoingMonitoringDialog = (props) => {
  const { generalSettings } = useSelector((state) => state.settings);
  const { kytOmCost } = generalSettings;
  const styles = useStyles();
  const [
    enabledNewTransactionMonitoring,
    setEnabledNewTransactionMonitoring,
  ] = useState(true);
  const [enableNewRiskMonitoring, setIsRiskScroreChange] = useState(true);
  const [totalSelected, setTotalSelected] = useState(null);

  const { open, onClose, onSave, type, selected, errorSelected } = props;
  const { formatMessage } = useIntl();
  const numerKYTDeducted = caculateNumerDeduct(selected);

  useEffect(() => {
    /**
     * Reset data when close the dialog
     */

    setEnabledNewTransactionMonitoring(true);
    setIsRiskScroreChange(true);
  }, [open]);

  useEffect(() => {
    /**
     * Check select is changed
     */

    let total = selected.length;
    setTotalSelected(total);
  }, [selected]);

  useEffect(() => {
    /**
     * Reset data when close the dialog
     */

    setEnabledNewTransactionMonitoring(true);
    setIsRiskScroreChange(true);
  }, [open]);

  const handelSwitchNewTransaction = useCallback(() => {
    setEnabledNewTransactionMonitoring(!enabledNewTransactionMonitoring);
  }, [enabledNewTransactionMonitoring]);

  const handelSwitchRiskScroreChange = useCallback(() => {
    setIsRiskScroreChange(!enableNewRiskMonitoring);
  }, [enableNewRiskMonitoring]);

  const onSubmitForm = async () => {
    let data = {
      enabledNewTransactionMonitoring,
      enableNewRiskMonitoring,
    };

    onSave(data);
    onClose();
  };

  return (
    <>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="xs"
        aria-labelledby="form-dialog-title"
        title={{
          text: (
            <Typography variant="title">
              <IntlMessages id={"kyt.dialog.ongoingMonitoringKYT"} />
            </Typography>
          ),
        }}
        allowCloseOnTitle
        cancelProps={{
          text: formatMessage({ id: "close" }),
          onClick: () => onClose(),
        }}
        okProps={{
          text: formatMessage({ id: "save" }),
          onClick: () => onSubmitForm(),
        }}
      >
        {/* <CloseableDialogTitle onClose={onClose}>
          <IntlMessages id={"kyt.dialog.ongoingMonitoringKYT"} />
        </CloseableDialogTitle> */}
        {type === "request" ? (
          <>
            {/* <DialogContent> */}
            <div>
              <div>
                <div className={styles.contentText}>
                  <IntlMessages id={"kyt.dialog.settingsWillBeAppliedTo"} />
                  <FormattedHTMLMessage
                    id={
                      totalSelected > 1
                        ? "kyt.dialog.KYTScreenings"
                        : "kyt.dialog.KYTScreening"
                    }
                    values={{
                      number: totalSelected,
                    }}
                  />
                </div>
                <IntlMessages id={"kyt.dialog.creditNote"} />
              </div>

              {/* {numerKYTDeducted > 0 && (
                <center>
                  <Typography className={styles.creditNote}>
                    <FormattedHTMLMessage id="kyc.dialog.onGoingMonitoring.creditNote" />
                  </Typography>
                </center>
              )} */}
              <div className={clsx(styles.switchNoBoder, "mt-2")}>
                <FormControlLabel
                  style={{ margin: 0, display: "block" }}
                  classes={{
                    labelPlacementStart: styles.labelPlacementStart,
                  }}
                  labelPlacement={"end"}
                  control={
                    <Switch
                      checked={enableNewRiskMonitoring}
                      onChange={handelSwitchRiskScroreChange}
                    />
                  }
                  label={
                    <Typography variant="Subtitle2">
                      <IntlMessages id={"kyt.transactions.risk.score"} />
                    </Typography>
                  }
                />

                <FormControlLabel
                  style={{ margin: 0 }}
                  classes={{
                    labelPlacementStart: styles.labelPlacementStart,
                  }}
                  labelPlacement={"end"}
                  control={
                    <Switch
                      checked={enabledNewTransactionMonitoring}
                      onChange={handelSwitchNewTransaction}
                    />
                  }
                  label={
                    <Typography variant="Subtitle2">
                      <IntlMessages id={"kyt.transactions.new"} />
                    </Typography>
                  }
                />
                {/* <SwitchButton
                  className={clsx(styles.switchStyle)}
                  disableShadow={true}
                  checked={enableNewRiskMonitoring}
                  name={<IntlMessages id={"kyt.transactions.risk.score"} />}
                  onChange={handelSwitchRiskScroreChange}
                />
                <SwitchButton
                  className={clsx(styles.switchStyle)}
                  disableShadow={true}
                  name={<IntlMessages id={"kyt.transactions.new"} />}
                  checked={enabledNewTransactionMonitoring}
                  onChange={handelSwitchNewTransaction}
                /> */}
              </div>
              <Typography
                className={clsx(styles.smallText, styles.grayText, "mt-2")}
              >
                <IntlMessages id={"kyt.dialog.textReceiveNotification"} />
              </Typography>
            </div>
            {/* </DialogContent> */}
            {/* <DialogActions className="justify-content-center">
              <Button
                className={clsx(styles.btnSave, "mr-3")}
                size="large"
                variant="contained"
                color="primary"
                onClick={onSubmitForm}
              >
                <IntlMessages id={"kyt.dialog.button.save"} />
              </Button>
              <Button
                className={clsx(styles.btnCancel)}
                onClick={onClose}
                size="large"
                variant="contained"
              >
                <IntlMessages id={"dialog.confirm.button.cancel"} />
              </Button>
            </DialogActions> */}
          </>
        ) : (
          <>
            <DialogContent>
              <div>
                <center>
                  <img
                    width="72"
                    height="72"
                    className="image-error mb-3"
                    src={imgErrorSrc}
                    alt="avatar"
                  />
                  <Typography>
                    <strong>
                      <FormattedHTMLMessage
                        id={"kyt.dialog.KYTScreenings"}
                        values={{
                          number: errorSelected?.totalKYTApplied,
                        }}
                      />
                    </strong>
                    <IntlMessages id={"kyt.dialog.textScreeningsApplied"} />
                  </Typography>
                  <Typography>
                    <IntlMessages id={"kyt.dialog.errorWith"} />
                    <strong>
                      <FormattedHTMLMessage
                        id={"kyt.dialog.KYTScreeningsDotted"}
                        values={{
                          number: errorSelected?.totalKYTError,
                        }}
                      />
                    </strong>
                  </Typography>
                  <Typography className={clsx(styles.grayText, "mt-2")}>
                    <IntlMessages id={"kyt.dialog.textBTCSupportOM"} />
                  </Typography>
                </center>
                <div className={clsx(styles.listBox, "mt-4 listBox")}>
                  <Typography>
                    <IntlMessages id={"kyt.dialog.assetypeIsNotBTC"} />
                  </Typography>
                  <List className="p-0">
                    {errorSelected?.listKYTError?.map((item, index) => {
                      return (
                        <ListItem key={index} className="p-0">
                          <ListItemText primary={item?.kytId} />
                        </ListItem>
                      );
                    })}
                  </List>
                </div>
              </div>
            </DialogContent>
            <DialogActions className="justify-content-center">
              <Button
                className={clsx(styles.btnClose)}
                onClick={onClose}
                size="large"
                variant="contained"
                color="primary"
              >
                <IntlMessages id={"dialog.confirm.button.close"} />
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default OngoingMonitoringDialog;
