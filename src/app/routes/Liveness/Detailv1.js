import { Grid, Typography, IconButton } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import Link from "@protego/sdk/RegtankUI/v1/Link/Link";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading";
import { generatePath } from "@protego/sdk/utils/router";
import { fetchLivenessRequestDetail } from "actions/Liveness";
import { formatDate, LONG_DATE_TIME } from "util/date";
import ChangeStatusDialog from "components/ChangeApprovalv1/ChangeStatus/OnboardingChangeStatusDialog";
import DialogComponent from "./components/ConfirmDialog";
import Status from "components/LivenessStatus";
import ScreenStatusBadge from "components/ScreenStatusBadgev1";
import { REJECTED } from "constants/ActionTypes";
import { KYC_STATUS } from "constants/KycStatus";
import { VERIFY_STATUS } from "constants/LivenessTest";
import React, { Fragment, useEffect } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import {
  resentRequestFromApi,
  updateRequestStatusFromApi,
} from "services/Liveness";
import { isCompletedStatus } from "util/index";
import { snackActions } from "util/snackbarUtils";
import styles from "./Liveness.module.scss";
import ViewLogDialog from "components/ActivityLogDialogv1";
import {
  KYC_ROUTE_KYC_SCREEN_RESULT,
  KYC_ROUTE_KYC_SCREEN_SCORING,
  LIVENESS_ROUTE_LIVENESS_CHECK,
} from "constants/routes";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import UserProfile from "./components/UserProfile";
import LivenessCheckInfo from "./components/LivenessCheckInfo";
import { ReactComponent as ClockIcon } from "assets/icons/ClockIcon.svg";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
const ProfilePage = function ProfilePage(props) {
  const dispatch = useDispatch();
  const { livenessDetail, loader } = useSelector((state) => state.liveness);
  const { requestId } = useParams();
  const history = useHistory();
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [openApproveConfirm, setOpenApproveConfirm] = React.useState(false);
  const [openRejectConfirm, setOpenRejectConfirm] = React.useState(false);
  const [openViewLog, setOpenViewLog] = React.useState(false);
  const [openImage, setOpenImage] = React.useState(false);
  const [urlImage, setUrlImage] = React.useState(false);
  const { formatMessage } = useIntl();

  const onConfirmYes = (record) => {
    setOpenConfirm(false);
    handleResendEmail();
  };

  const onApproveConfirmYes = (record) => {
    setOpenApproveConfirm(false);
    updateStatus({
      status: VERIFY_STATUS.APPROVED.key,
    });
  };

  const onRejectConfirmYes = (status, remark) => {
    setOpenRejectConfirm(false);
    updateStatus({
      status: status,
      remark,
    });
  };

  const handleResendEmail = async () => {
    try {
      const response = await resentRequestFromApi(livenessDetail?.requestId);
      if (response.status === 200) {
        snackActions.success(
          <IntlMessages id={"liveness.resendEmailSuccessMessage"} />
        );
        setTimeout(() => {
          dispatch(fetchLivenessRequestDetail(requestId, history));
        }, 1000);
      }
    } catch (error) {
      snackActions.error(
        <IntlMessages id={"liveness.resendEmailFailedMessage"} />
      );
    }
  };

  const updateStatus = async (params) => {
    try {
      const response = await updateRequestStatusFromApi({
        ...params,
        requestId: livenessDetail?.requestId,
      });
      if (response.status === 200) {
        snackActions.success(
          livenessDetail?.requestId +
            " " +
            formatMessage({
              id:
                params?.status === REJECTED
                  ? "liveness.statusUpdateRejectMessage"
                  : "liveness.statusUpdateSuccessMessage",
            })
        );
        setTimeout(() => {
          dispatch(fetchLivenessRequestDetail(requestId, history));
        }, 1000);
      }
    } catch (error) {
      snackActions.error(
        <IntlMessages id={"liveness.statusUpdateFailedMessage"} />
      );
    }
  };

  useEffect(() => {
    dispatch(fetchLivenessRequestDetail(requestId, history));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const convertStatusKyc = () => {
    if (livenessDetail?.kycStatus === KYC_STATUS.PENDING) {
      return livenessDetail?.kycPositiveMatch ? "POSITIVE_MATCH" : "NO_MATCH";
    }
    return livenessDetail?.kycStatus;
  };

  return (
    <LoadingWrapper loading={loader} size={"3rem"}>
      <Fragment>
        <div className={styles.headerOnboardingDetail}>
          <PageHeading
            backButtonUrl={true}
            customUrlResolver={(index, sub) => {
              switch (index) {
                case 1:
                  return [<IntlMessages id="liveness.onboardingTitle" />];
                case 2:
                  return [<IntlMessages id="liveness.onboardingDetails" />];
                default:
                  return null;
              }
            }}
            title={<IntlMessages id={"liveness.onboardingTitle"} />}
          />
        </div>
        {livenessDetail && (
          <>
            {/* Header */}
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <div className={styles.headerDetail}>
                  <div className="align-items-center d-flex">
                    <div className={"mr-2"}>
                      <IconButton
                        className={styles.iconBack}
                        onClick={() =>
                          history.push(LIVENESS_ROUTE_LIVENESS_CHECK)
                        }
                      >
                        <KeyboardArrowLeftIcon />
                      </IconButton>
                    </div>
                    <Typography variant="titleForm">
                      <FormattedHTMLMessage
                        id="liveness.onboardingDetailsTitle"
                        values={{ requestId }}
                      />
                    </Typography>
                  </div>
                  <div className={"d-flex"}>
                    <Button
                      onClick={() => setOpenViewLog(true)}
                      variant="outlined"
                      size={"medium"}
                      className={"ml-3"}
                    >
                      <IntlMessages id={"liveness.viewLog"} />
                    </Button>
                    {livenessDetail?.status !==
                      VERIFY_STATUS.LIVENESS_PASSED.key && (
                      <>
                        {VERIFY_STATUS.WAIT_FOR_APPROVAL.key ===
                          livenessDetail?.status && (
                          <Button
                            size={"medium"}
                            variant="containedSuccess"
                            onClick={() => setOpenApproveConfirm(true)}
                            className={"ml-3"}
                          >
                            <IntlMessages id={"liveness.approve"} />
                          </Button>
                        )}
                        {VERIFY_STATUS.WAIT_FOR_APPROVAL.key ===
                          livenessDetail?.status && (
                          <Button
                            size={"medium"}
                            variant="containedError"
                            onClick={() => setOpenRejectConfirm(true)}
                            className={"ml-3"}
                          >
                            <IntlMessages id={"liveness.reject"} />
                          </Button>
                        )}
                        {[
                          VERIFY_STATUS.APPROVED.key,
                          VERIFY_STATUS.WAIT_FOR_APPROVAL.key,
                          VERIFY_STATUS.LIVENESS_PASSED.key,
                        ].indexOf(livenessDetail?.status) === -1 && (
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => setOpenConfirm(true)}
                            className={"ml-3"}
                          >
                            <IntlMessages id={"liveness.resendEmail"} />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>
            <Grid container columnSpacing={2}>
              <Grid item xs={9}>
                {/* UserProfile */}
                <UserProfile
                  onboardingID={livenessDetail.requestId}
                  userProfile={livenessDetail?.userProfile}
                  documentType={livenessDetail?.documentInfo?.documentType}
                />
                {/* LivenessCheckInfo */}
                <div style={{ height: toRem(24) }}></div>
                <LivenessCheckInfo livenessDetail={livenessDetail} />
              </Grid>
              <Grid item xs={3}>
                {/* Onboarding Summary */}
                <JRCard
                  header={
                    <Typography>
                      <Nullable>
                        <IntlMessages id={"liveness.onboarding.summary"} />
                      </Nullable>
                    </Typography>
                  }
                  fullBody
                  headerLine
                  disableShadow
                  className={styles.summaryBox}
                >
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography className={styles.titleBox}>
                        <IntlMessages id={"liveness.onboarding.status"} />
                      </Typography>
                      <Typography className={styles.valueBox}>
                        <Status status={livenessDetail?.status} />
                      </Typography>
                    </Grid>
                    <Grid item xs={6} className="mt-3">
                      <Typography className={styles.titleBox}>
                        <IntlMessages id={"liveness.onboarding.linkedKYCID"} />
                      </Typography>
                      <Typography className={styles.valueBox}>
                        {livenessDetail?.kycId ? (
                          <Link
                            to={
                              isCompletedStatus(livenessDetail?.kycStatus)
                                ? generatePath(KYC_ROUTE_KYC_SCREEN_SCORING, {
                                    kycId: livenessDetail?.kycId,
                                  })
                                : generatePath(KYC_ROUTE_KYC_SCREEN_RESULT, {
                                    kycId: livenessDetail?.kycId,
                                  })
                            }
                          >
                            {livenessDetail?.kycId}
                          </Link>
                        ) : (
                          <IntlMessages id={"appModule.hyphen"} />
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} className="mt-3">
                      <Typography className={styles.titleBox}>
                        <IntlMessages id={"liveness.kyc.status"} />
                      </Typography>
                      <Typography className={styles.valueBox}>
                        {livenessDetail?.kycId ? (
                          <div className="d-flex align-items-start">
                            <ScreenStatusBadge
                              type="kyc"
                              status={convertStatusKyc()}
                            />
                          </div>
                        ) : (
                          <IntlMessages id={"appModule.hyphen"} />
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} className="mt-3">
                      <Typography className={styles.titleBox}>
                        <IntlMessages id={"liveness.deviceType"} />
                      </Typography>
                      <Typography className={styles.valueBox}>
                        <Nullable>{livenessDetail?.deviceType}</Nullable>
                      </Typography>
                    </Grid>
                    <Grid item xs={6} className="mt-3">
                      <Typography className={styles.titleBox}>
                        <IntlMessages id={"liveness.ipAddress"} />
                      </Typography>
                      <Typography className={styles.valueBox}>
                        <Nullable>{livenessDetail?.requestIpAddress}</Nullable>
                      </Typography>
                    </Grid>
                  </Grid>
                </JRCard>
                {/* Notes */}
              </Grid>
            </Grid>
            <Grid container className={"mt-3"}>
              <Grid item xs={12}>
                <div className={styles.activityTrackerContainer}>
                  <ClockIcon className={styles.iconClock} />
                  <div className={styles.activityTrackerRow}>
                    <Typography
                      className={styles.activityTrackerItem}
                      component="span"
                    >
                      <FormattedHTMLMessage
                        id="liveness.onboarding.statusChangedAt"
                        values={{
                          datetime: formatDate(
                            livenessDetail?.updatedDate,
                            LONG_DATE_TIME
                          ),
                        }}
                      />
                    </Typography>
                    <Typography
                      className={styles.activityTrackerItem}
                      component="span"
                    >
                      <FormattedHTMLMessage
                        id="liveness.onboarding.urlLinkCreatedAt"
                        values={{
                          datetime: formatDate(
                            livenessDetail?.createdDate,
                            LONG_DATE_TIME
                          ),
                        }}
                      />
                    </Typography>
                  </div>
                </div>
              </Grid>
            </Grid>
          </>
        )}
        {openViewLog && (
          <ViewLogDialog
            refId={livenessDetail.requestId}
            isOpen={openViewLog}
            onClose={() => setOpenViewLog(false)}
          />
        )}
        {openConfirm && (
          <DialogComponent
            open={openConfirm}
            title={formatMessage({ id: "confirmation" })}
            content={<IntlMessages id="liveness.resentEmailConfirm" />}
            onClose={setOpenConfirm}
            onSubmit={onConfirmYes}
          />
        )}
        {openApproveConfirm && (
          <DialogComponent
            open={openApproveConfirm}
            title={formatMessage({ id: "confirmation" })}
            content={<IntlMessages id="liveness.approveConfirm" />}
            onClose={setOpenApproveConfirm}
            onSubmit={onApproveConfirmYes}
          />
        )}
        {openRejectConfirm && (
          <ChangeStatusDialog
            fixedPosition
            hideStatusSelect
            isOpen={openRejectConfirm}
            onClose={() => setOpenRejectConfirm(false)}
            onPressChange={(data, note) => {
              onRejectConfirmYes(data, note);
            }}
            status={VERIFY_STATUS.REJECTED.key}
          />
        )}
      </Fragment>
    </LoadingWrapper>
  );
};

export default ProfilePage;
