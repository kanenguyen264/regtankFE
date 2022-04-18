import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Grid, IconButton, Typography } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import withPagination from "@protego/sdk/UI/withPagination";
import { generatePath } from "@protego/sdk/utils/router";
import {
  KYB_ACTION_CHANGE_STATUS_RISK_ASSESSMENT,
  KYB_ACTION_RISK_ASSESSMENT_DETAILS,
  KYB_SAVE_RISK_ASSESSMENT,
} from "actions/KYBAction";
import { ReactComponent as ExportIcon } from "assets/icons/IcExport.svg";
import ViewLogDialog from "components/ActivityLogDialogv1";
import ActivityTracker from "components/ActivityTracker";
import ChangeApproval from "components/ChangeApprovalv1";
import Escalate from "components/Escalatev1";
import useExportDialog from "components/ExportDialog";
import { KYB_ROUTE_MY_KYB, KYB_ROUTE_RISK_ASSESSMENT } from "constants/routes";
import { APPROVED } from "constants/ViewLogType";
import { Formik } from "formik";
import moment from "moment";
import React, { Fragment, useRef } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { compose } from "recompose";
import { snackActions } from "util/snackbarUtils";
import { getFullName } from "util/string";
import { withACL } from "../../../../acl";
import { downloadReport, KYBRiskScoringReport } from "../../../reports";
import { useKYBRiskLevelChart } from "../../../reports/KYBRiskScoringReport/KYBRiskLevelChart";
import styles from "./KYBRiskAssessment.module.scss";
import OtherFactor from "./OtherFactor";
import RiskAssessmentDetail from "./RiskAssessmentDetail";
import RiskAssessmentLevel, { getDataChart } from "./RiskAssessmentLevel";
import Note from "./RiskNote/index";
import BusinessSearch from "./RiskSearch/businessSearch";
import DirectorSearch from "./RiskSearch/directorSearch";
import IndividualSearch from "./RiskSearch/individualSearch";

const KYBRiskAssessment = ({ match, setPaginationParams, props, ACL }) => {
  const riskDetail = useSelector((state) => state.kyb.riskDetail);
  const notesRiskDetail = useSelector((state) => state.kyb.notes);

  const formikRiskAssessment = useRef();
  const { formatMessage } = useIntl();
  const getRiskLevelChart = useKYBRiskLevelChart();
  const exportDialog = useExportDialog();
  const [stateApproval, setStateApproval] = React.useState("");
  const [openChangeStatus, setOpenChangeStatus] = React.useState(false);
  const dispatch = useDispatch();
  const { kybId } = match.params;
  let history = useHistory();
  const [openViewLog, setOpenViewLog] = React.useState(false);

  const fetch = React.useCallback(() => {
    dispatch(
      KYB_ACTION_RISK_ASSESSMENT_DETAILS({
        kybIds: kybId,
      })
    );
    // eslint-disable-next-line
  }, [dispatch]);

  React.useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, [dispatch]);

  const onSaveRiskAssessment = () => {
    let otherRiskFactor = {
      sourceOfFunds: formikRiskAssessment.current.values.sourceOfFunds,
      countryOfFunds: formikRiskAssessment.current.values.countryOfFunds,
      paymentMode:
        formikRiskAssessment.current.values.paymentMode === -1
          ? null
          : formikRiskAssessment.current.values.paymentMode,
      others: formikRiskAssessment.current.values.others,
    };

    /**
     * List Director
     */
    let newArrDirector = formikRiskAssessment.current.values.directorsController?.map(
      (item) => {
        let director = {
          kycRequest: {
            id: item?.id,
            kycId: item.kycId,
          },
          designationPosition: item?.designationPosition,
          remarks: item?.remarks,
        };
        return director;
      }
    );
    /**
     * List Individual
     */
    let newIndividual = formikRiskAssessment.current.values?.individualShareholder?.map(
      (item) => {
        let individual = {
          kycRequest: {
            kycId: item?.kycId,
            id: item?.id,
          },
          percentOfShare: item?.percentOfShare,
          remarks: item?.remarks,
        };
        return individual;
      }
    );
    /**
     * List Business
     */
    let newBusiness = formikRiskAssessment.current.values?.businessShareholder?.map(
      (item) => {
        let business = {
          kybRequest: {
            id: item?.id,
            kybId: item?.kybId,
          },
          percentOfShare: item?.percentOfShare,
          remarks: item?.remarks,
        };
        return business;
      }
    );

    let sum = newIndividual?.reduce((total, num) => {
      if (parseFloat(num?.percentOfShare ? num?.percentOfShare : 0) >= 0) {
        return (
          total + parseFloat(num?.percentOfShare ? num?.percentOfShare : 0)
        );
      }
      // eslint-disable-next-line
      return;
    }, 0);

    let sumBusiness = newBusiness?.reduce((total, num) => {
      if (parseFloat(num?.percentOfShare ? num?.percentOfShare : 0) >= 0) {
        return (
          total + parseFloat(num?.percentOfShare ? num?.percentOfShare : 0)
        );
      }
      // eslint-disable-next-line
      return;
    }, 0);

    if (isNaN(sum) || sum > 100) {
      return snackActions.error(<IntlMessages id={"kyb.alert.message"} />);
    }

    if (isNaN(sumBusiness) || sumBusiness > 100) {
      return snackActions.error(<IntlMessages id={"kyb.alert.message"} />);
    }

    let createDataSubmit = {
      id: formikRiskAssessment.current.values.id,
      otherRiskFactor,
      directorsController: newArrDirector,
      individualShareholder: newIndividual,
      businessShareholder: newBusiness,
    };
    dispatch(KYB_SAVE_RISK_ASSESSMENT(createDataSubmit))
      .then((res) => {
        return snackActions.success(
          <IntlMessages id={"kyb.alert.message.success"} />
        );
      })
      .catch(() => {
        return snackActions.error(
          <IntlMessages id={"kyb.alert.error.save"} />,
          "",
          1000
        );
      });
  };

  const download = React.useCallback(async () => {
    const chart = await getRiskLevelChart({
      model: getDataChart(riskDetail?.kybRequest?.riskLevel, formatMessage),
    });

    return downloadReport(
      KYBRiskScoringReport,
      `KYB_RiskScoring_${kybId}_${moment().format("YYYYMMDD")}`,
      {
        chartData: chart,
        //   chartData: null,
        notesDetail: notesRiskDetail[riskDetail?.id],
        riskScoring: riskDetail,
      }
    );
    // eslint-disable-next-line
  }, [riskDetail, notesRiskDetail]);

  const exportPDF = async () => {
    await exportDialog({
      init: download,
      onSuccess: () => {},
    });
  };

  const onPressChangeStatus = (status, note) => {
    let body = {
      kybId: kybId,
      status: status,
      note: { content: note },
    };
    dispatch(KYB_ACTION_CHANGE_STATUS_RISK_ASSESSMENT({ params: body }))
      .then((result) => {
        let getMessage =
          status === APPROVED
            ? formatMessage({ id: "kyb.change.note.was.approved" })
            : formatMessage({ id: "kyb.change.note.was.rejected" });
        snackActions.success(kybId + " " + getMessage);
        setStateApproval(status);
      })
      .catch(() => {
        snackActions.error(<IntlMessages id={"error"} />);
      })
      .finally(() => {
        dispatch(
          KYB_ACTION_RISK_ASSESSMENT_DETAILS({
            kybIds: kybId,
          })
        );
        setOpenChangeStatus(false);
      });
  };
  return (
    <Fragment>
      <PageHeading
        title={<IntlMessages id="kyb.risk.assessment.header.title" />}
        backButtonUrl={true}
        customUrlResolver={(index, sub, isLast) => {
          if (index === 1) {
            return ["KYB", generatePath(KYB_ROUTE_MY_KYB), true];
          }
          if (index === 2) {
            return [
              <IntlMessages id="screening-result" />,
              `/app/screen-kyb/result/${kybId}`,
              true,
            ];
          }
          if (index === 3) {
            return [null, null, null, true];
          }
          if (isLast) {
            return [
              <IntlMessages id="kyb.risk.assessment.header.title" />,
              generatePath(KYB_ROUTE_RISK_ASSESSMENT, {
                kybId: kybId,
              }),
              false,
            ];
          }
          return null;
        }}
      />
      <div>
        <Grid container columnSpacing={2}>
          <Grid item xs={12}>
            <div className={styles.header}>
              <div className="align-items-center d-flex">
                <div className={"mr-2"}>
                  <IconButton
                    className={styles.iconBack}
                    onClick={() => history.push(KYB_ROUTE_MY_KYB)}
                  >
                    <KeyboardArrowLeftIcon />
                  </IconButton>
                </div>
                <Typography variant="titleForm">
                  <FormattedHTMLMessage
                    id="kyb.risk.score.title"
                    values={{ kybId: kybId }}
                  />
                </Typography>
              </div>
              <div className={"d-flex"}>
                <Button
                  className={"ml-3"}
                  onClick={exportPDF}
                  variant={"outlined"}
                  size={"medium"}
                  startIcon={<ExportIcon />}
                >
                  <Typography variant="Subtitle3">
                    <IntlMessages id="export"></IntlMessages>
                  </Typography>
                </Button>
                <Button
                  onClick={() => setOpenViewLog(true)}
                  variant="outlined"
                  size={"medium"}
                  className={"mr-3 ml-3"}
                >
                  <IntlMessages id={"kyc.risk.scoring.view.log"} />
                </Button>
                <Escalate
                  screen="KYBRiskAssessment"
                  id={riskDetail?.kybRequest?.kybId}
                  viewLogPosition={"left"}
                  openViewLog={openViewLog}
                  hideViewLog
                />
                {ACL.isAllowedPermissions("KYB_APPROVE_REJECT") && (
                  <div className="ml-3">
                    <ChangeApproval
                      status={riskDetail?.kybRequest?.status}
                      onPressChange={onPressChangeStatus}
                      id={kybId}
                      openChangeStatus={openChangeStatus}
                      setOpenChangeStatus={() =>
                        setOpenChangeStatus(!openChangeStatus)
                      }
                      approval={stateApproval}
                    />
                  </div>
                )}
              </div>
            </div>
          </Grid>
        </Grid>
        {riskDetail !== null && (
          <Formik
            innerRef={formikRiskAssessment}
            initialValues={{
              id: riskDetail?.id,
              otherRiskFactor: {},
              directorsController: [],
              businessShareholder: [],
              individualShareholder: [],
              content: riskDetail?.kybRequest?.businessInformation
                ? riskDetail?.kybRequest?.businessInformation
                : "",
              businessInformation: riskDetail?.kybRequest?.businessInformation
                ? riskDetail?.kybRequest?.businessInformation
                : "",
              sourceOfFunds: riskDetail?.otherRiskFactor?.sourceOfFunds
                ? riskDetail?.otherRiskFactor?.sourceOfFunds
                : "",
              countryOfFunds: riskDetail?.otherRiskFactor?.countryOfFunds
                ? riskDetail?.otherRiskFactor?.countryOfFunds
                : "",
              paymentMode: riskDetail?.otherRiskFactor?.paymentMode
                ? riskDetail?.otherRiskFactor?.paymentMode
                : -1,
              others: riskDetail?.otherRiskFactor?.others
                ? riskDetail?.otherRiskFactor?.others
                : "",
            }}
            enableReinitialize={true}
            onSubmit={
              ACL.isAllowedPermissions("MY_KYB_EDIT") && onSaveRiskAssessment
            }
            validateOnChange={true}
            validateOnBlur={true}
            validateOnMount={true}
          >
            {({ errors, values, setFieldValue }) => {
              return (
                <div>
                  <Grid container columnSpacing={2}>
                    <Grid item xs={9}>
                      <RiskAssessmentDetail ACL={ACL} kybId={kybId} />
                      <div>
                        <div className={"mt-4"}>
                          <OtherFactor />
                        </div>
                        <div className={"mt-4"}>
                          <DirectorSearch
                            headerTitle={
                              <IntlMessages id={"kyb.risk.Directors"} />
                            }
                          />
                        </div>
                        <div className={"mt-4"}>
                          <IndividualSearch
                            headerTitle={
                              <IntlMessages id={"kyb.risk.Individual"} />
                            }
                          />
                        </div>
                        <div className={"mt-4"}>
                          <BusinessSearch
                            headerTitle={
                              <IntlMessages id={"kyb.risk.Business"} />
                            }
                          />
                        </div>
                        <div>
                          <ActivityTracker
                            className={styles.MarginActivity}
                            lastModifiedAt={riskDetail?.kybRequest?.updatedAt}
                            lastModifiedBy={getFullName(
                              riskDetail?.kybRequest?.lastModifiedBy
                            )}
                            screenedBy={getFullName(
                              riskDetail?.kybRequest?.createdBy
                            )}
                            screenedAt={riskDetail?.kybRequest?.createdAt}
                          />
                          {ACL.isAllowedPermissions("MY_KYB_EDIT") && (
                            <div className={"flex-end"}>
                              <Button
                                variant={"contained"}
                                type="submit"
                                onClick={onSaveRiskAssessment}
                              >
                                <IntlMessages id="kyb.save" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={3}>
                      <Grid container rowSpacing={2} flexDirection={"column"}>
                        <Grid item xs>
                          <RiskAssessmentLevel
                            ACL={ACL}
                            riskLevel={riskDetail?.kybRequest?.riskLevel}
                            riskHistory={riskDetail?.riskLevelStatusHistory}
                            kybId={riskDetail?.kybRequest?.kybId}
                          />
                        </Grid>
                        <Grid item xs className={styles.noteContainer}>
                          <JRCard
                            header={
                              <Typography variant="titleForm">
                                <IntlMessages id={"kyc.Notes"} />
                              </Typography>
                            }
                          >
                            <Note
                              sm={10}
                              md={3}
                              id={riskDetail?.id}
                              className={styles.noteRisk}
                            />
                          </JRCard>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              );
            }}
          </Formik>
        )}
        {openViewLog && (
          <ViewLogDialog
            refId={kybId}
            isOpen={openViewLog}
            onClose={() => setOpenViewLog(false)}
          />
        )}
      </div>
    </Fragment>
  );
};

export default compose(withPagination, withACL)(KYBRiskAssessment);
