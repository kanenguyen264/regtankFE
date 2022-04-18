import { Grid, Typography, Tooltip } from "@material-ui/core";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import { KYT_ONGOING_MONITORING } from "actions/KYTAction";
import ConfirmDialog from "components/ConfirmDialog";
import { makeStyles } from "@material-ui/styles";
import { RiskScoreKEY, TransactionKEY } from "constants/KYTOM";
import React, { Fragment, useRef } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import styles from "../KYTScreenPage.module.scss";
import { snackActions } from "util/snackbarUtils";
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
import { FormattedHTMLMessage } from "react-intl";
import { caculateNumerDeduct } from "util/omCerditDeduct";
import { formatDate } from "util/date";
import { Form, Formik } from "formik";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import  { Switch } from "@protego/sdk/RegtankUI/v1/Switch";

const useStyles = makeStyles({
  control: {
    fontSize: toRem(16),
    lineHeight: toRem(24),
    alignItems: "center",
  },
});

const OnGoingMonitoring = (props) => {
  const { data } = props;
  const { omStartPeriod, omEndPeriod } = data;
  const { generalSettings } = useSelector((state) => state.settings);
  const { kytOmCost, kytOmDeductionConfirmation } = generalSettings;
  const [openDialog, setOpenDialog] = React.useState(false);
  const [contentDialog, setContentDialog] = React.useState("");
  const [switchSelected, setSwitchSelected] = React.useState();
  const [currentSwitch, setCurrentSwitch] = React.useState({
    newTransaction: data?.enableNewTransactionMonitoring,
    riskScoreChange: data?.enableNewRiskMonitoring,
  });
  const [loading, setLoading] = React.useState(false);
  const [creditText, setCreditText] = React.useState();
  const [submitName, setSubmitName] = React.useState(
    <IntlMessages id="kyt.dialog.button.enable" />
  );

  const formikOMFormRef = useRef();
  const classes = useStyles();

  const intl = useIntl();
  const dispatch = useDispatch();

  const renderCreditText = () => {
    const text = (
      <div className={"creditPeroid"}>
        {caculateNumerDeduct([data]) > 0 && (
          <div className="cost" style={{ marginTop: 10 }}>
            <FormattedHTMLMessage
              id="kyc.dialog.OM.enable.cost"
              values={{ kycOmCost: kytOmCost }}
            />
          </div>
        )}
        {omStartPeriod !== null && (
          <div className={"date"} style={{ marginTop: 10 }}>
            <div>
              <FormattedHTMLMessage
                id="kyc.dialog.OM.enable.startPeriod"
                values={{ omStartPeriod: formatDate(omStartPeriod) }}
              />
            </div>
            {omEndPeriod && (
              <div>
                <FormattedHTMLMessage
                  id="kyc.dialog.OM.enable.endPeriod"
                  values={{ omEndPeriod: formatDate(omEndPeriod) }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
    setCreditText(text);
  };

  const onChangeSwitchTransaction = (event) => {
    const checked = event.target.checked;
    //check setting on/off OM KYT to display or not display OM confirm
    if (kytOmDeductionConfirmation) {
      setOpenDialog(true);
      let content = checked
        ? intl.formatMessage({ id: "kyt.dialog.confirm.enable" })
        : intl.formatMessage({ id: "kyt.dialog.confirm.disable" });
      checked ? renderCreditText() : setCreditText("");
      setContentDialog(content);
      setSubmitName(
        checked ? (
          <IntlMessages id="kyt.dialog.button.enable" />
        ) : (
          <IntlMessages id="kyt.dialog.button.disable" />
        )
      );
      setSwitchSelected(intl.formatMessage({ id: "kyt.transactions.new" }));
      setCurrentSwitch({ ...currentSwitch, newTransaction: checked });
    } else {
      setLoading(true);
      formikOMFormRef.current.setFieldValue("newTransaction", checked);
      formikOMFormRef.current.submitForm();
    }
  };

  const onChangeSwitchRiskScore = (event) => {
    const checked = event.target.checked;

    //check setting on/off OM KYT to display or not display OM confirm
    if (kytOmDeductionConfirmation) {
      setOpenDialog(true);
      let content = checked ? (
        <IntlMessages id={"kyt.dialog.confirm.enable"} />
      ) : (
        <IntlMessages id={"kyt.dialog.confirm.disable"} />
      );
      checked ? renderCreditText() : setCreditText("");
      setContentDialog(content);
      setSubmitName(
        event.target.checked ? (
          <IntlMessages id="kyt.dialog.button.enable" />
        ) : (
          <IntlMessages id="kyt.dialog.button.disable" />
        )
      );
      setSwitchSelected(
        intl.formatMessage({ id: "kyt.transactions.risk.score" })
      );
      setCurrentSwitch({ ...currentSwitch, riskScoreChange: checked });
    } else {
      setLoading(true);
      formikOMFormRef.current.setFieldValue("riskScoreChange", checked);
      formikOMFormRef.current.submitForm();
    }
  };

  const onCloseDialog = (openDialog) => {
    setOpenDialog(!openDialog);
    setCurrentSwitch({ ...currentSwitch, ...formikOMFormRef.current.values });
  };

  const onSubmitOMDialog = () => {
    setLoading(true);
    formikOMFormRef.current.setFieldValue(
      "newTransaction",
      currentSwitch.newTransaction
    );
    formikOMFormRef.current.setFieldValue(
      "riskScoreChange",
      currentSwitch.riskScoreChange
    );
    formikOMFormRef.current.submitForm();
  };

  const onSubmitOMForm = (values) => {
    const { newTransaction, riskScoreChange } = values;
    callUpdateKYTOM(data.kytId, newTransaction, riskScoreChange);
  };
  const callUpdateKYTOM = (kytId, newTransaction, riskScoreChange) => {
    dispatch(
      KYT_ONGOING_MONITORING([
        {
          kytId: kytId,
          enabledNewTransactionMonitoring: newTransaction,
          enableNewRiskMonitoring: riskScoreChange,
        },
      ])
    )
      .then((result) => {
        setOpenDialog(false);
      })
      .catch((err) => {
        snackActions.error(
          <IntlMessages id="appModule.generic.errorMessage" />
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Fragment>
      <ConfirmDialog
        loading={loading}
        open={openDialog}
        content={contentDialog}
        contentKey={switchSelected}
        onSubmit={onSubmitOMDialog}
        creditText={creditText}
        submitName={submitName}
        onClose={() => onCloseDialog(openDialog)}
      />
      <LoadingWrapper loading={loading && !kytOmDeductionConfirmation}>
        <JRCard
          headerLine
          dense
          header={
            <div className={"d-flex justify-content-between"}>
              <div>
                <Typography className={styles.title}>
                  <IntlMessages id={"kyt.transactions.ongoing"} />
                </Typography>
              </div>
            </div>
          }
        >
          <Formik
            innerRef={formikOMFormRef}
            initialValues={{
              newTransaction: data?.enableNewTransactionMonitoring,
              riskScoreChange: data?.enableNewRiskMonitoring,
            }}
            onSubmit={onSubmitOMForm}
          >
            {({ values, setFieldValue }) => {
              return (
                <Form>
                  <Grid className="d-inline-block">
                    <Grid container className={classes.control}>
                      <Grid item xs={10}>
                        <IntlMessages id={"kyt.transactions.new"} />
                        <span className="ml-1">
                          <Tooltip
                            arrow
                            title={
                              <div className="custom-tooltip">
                                <h5>
                                  <IntlMessages id="kyt.transactions.new" />
                                </h5>
                                <p>
                                  <FormattedHTMLMessage id="kyt.transactions.new.tooltip" />
                                </p>
                              </div>
                            }
                          >
                            <QuestionMarkIcon />
                          </Tooltip>
                        </span>
                      </Grid>
                      <Grid item xs={2} className="text-right">
                        <Switch
                          checked={values.newTransaction}
                          name="newTransaction"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                          onChange={onChangeSwitchTransaction}
                        />
                      </Grid>
                    </Grid>

                    <Grid container className={classes.control}>
                      <Grid item xs={10}>
                        <IntlMessages id={"kyt.transactions.risk.score"} />
                        <span className="ml-1">
                          <Tooltip
                            arrow
                            title={
                              <div className="custom-tooltip">
                                <h5>
                                  <IntlMessages id="kyt.transactions.risk.score" />
                                </h5>
                                <p>
                                  <FormattedHTMLMessage id="kyt.transactions.risk.score.tooltip" />
                                </p>
                              </div>
                            }
                          >
                            <QuestionMarkIcon />
                          </Tooltip>
                        </span>
                      </Grid>
                      <Grid item xs={2} className="text-right">
                        <Switch
                          checked={values.riskScoreChange}
                          name="riskScoreChange"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                          onChange={onChangeSwitchRiskScore}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Form>
              );
            }}
          </Formik>
        </JRCard>
      </LoadingWrapper>
    </Fragment>
  );
};

export default OnGoingMonitoring;
