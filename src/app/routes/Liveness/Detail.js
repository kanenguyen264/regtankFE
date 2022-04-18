import {
  Grid,
  Tooltip,
  Typography,
  Dialog,
  Backdrop,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Divider from "@material-ui/core/Divider";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import JRCard from "@protego/sdk/UI/JRCard/JRCard";
import Link from "@protego/sdk/UI/Link/Link";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import Nullable from "@protego/sdk/UI/Nullable";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";

import { toRem } from "@protego/sdk/utils/measurements";
import { generatePath } from "@protego/sdk/utils/router";

import { fetchLivenessRequestDetail } from "actions/Liveness";
import { ReactComponent as IconImageNa } from "assets/icons/ic_image_not_available.svg";
import { ReactComponent as IconVideoNa } from "assets/icons/ic_video_not_available.svg";
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
import clsx from "clsx";
import ChangeStatusDialog from "components/ChangeApproval/ChangeStatus/ChangeStatusDialog";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import DialogComponent from "components/DialogComponent";
import Status, {
  CompareStatus,
  CompareStatusKYC,
} from "components/LivenessStatus";
import { REJECTED } from "constants/ActionTypes";
import { KYC_STATUS } from "constants/KycStatus";
import { getDocumentTypeKey, VERIFY_STATUS } from "constants/LivenessTest";
import {
  KYC_ROUTE_KYC_SCREEN_RESULT,
  KYC_ROUTE_KYC_SCREEN_SCORING,
} from "constants/routes";
import numeral from "numeral";
import React, { Fragment, useEffect } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import {
  deleteRequestFromApi,
  resentRequestFromApi,
  updateRequestStatusFromApi,
} from "services/Liveness";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { isCompletedStatus } from "util/index";
import { snackActions } from "util/snackbarUtils";
import { getFullName } from "util/string";
import styles from "./Liveness.module.scss";
import ScreenStatusBadge from "components/ScreenStatusBadge";
import ViewLogDialog from "./components/ActivityLogDialog";
import { ReactComponent as CloseIcon } from "assets/icons/close_icon.svg";
import { LIVENESS_ROUTE_LIVENESS_CHECK } from "constants/routes";
const ProfilePage = function ProfilePage(props) {
  const dispatch = useDispatch();
  const { livenessDetail, loader } = useSelector((state) => state.liveness);
  const { requestId } = useParams();
  const history = useHistory();
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [openApproveConfirm, setOpenApproveConfirm] = React.useState(false);
  const [openRejectConfirm, setOpenRejectConfirm] = React.useState(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState(false);
  const [openViewLog, setOpenViewLog] = React.useState(false);
  const [openImage, setOpenImage] = React.useState(false);
  const [urlImage, setUrlImage] = React.useState(false);
  const { formatMessage } = useIntl();

  const onConfirmYes = (record) => {
    setOpenConfirm(false);
    handleResendEmail();
  };

  const onDeleteConfirmYes = () => {
    setDeleteConfirm(false);
    handleDelete();
  };

  const handleDelete = async () => {
    try {
      const response = await deleteRequestFromApi({
        requestIds: [livenessDetail.requestId],
      });
      if (response.status === 200) {
        snackActions.success(
          <IntlMessages id={"liveness.deleteSuccessMessage"} />
        );
        history.push(LIVENESS_ROUTE_LIVENESS_CHECK);
      }
    } catch (error) {
      snackActions.error(<IntlMessages id={"liveness.deleteFailedMessage"} />);
      history.push(LIVENESS_ROUTE_LIVENESS_CHECK);
    }
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

  const ImageViewer = (props) => {
    const { open, src, title, handleClose } = props;
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
      >
        <DialogContent
          style={{
            padding: "8px",
            position: "relative",
            maxWidth: "100%",
            backgroundColor: "transparent",
            overflow: "hidden",
          }}
        >
          <img
            style={{
              borderRadius: "5px",
              flexShrink: 0,
              width: "100%",
              height: "100%",
            }}
            alt={title}
            src={urlImage}
          ></img>
        </DialogContent>
        <DialogActions
          style={{
            padding: "8px",
            position: "relative",
            maxWidth: "100%",
            backgroundColor: "transparent",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <div>
            <Button
              onClick={() => setOpenImage(!openImage)}
              size={"small"}
              className={styles.btnClose}
            >
              <IntlMessages id={"close"} />
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    );
  };

  const handleOpenImageView = (url) => {
    setUrlImage(url);
    setOpenImage(!openImage);
  };

  return (
    <LoadingWrapper loading={loader} size={"3rem"}>
      <Fragment>
        <PageHeading
          backButtonUrl={true}
          customUrlResolver={(index, sub) => {
            switch (index) {
              case 1:
                return [<IntlMessages id="liveness.title" />];
              case 2:
                return [requestId, false, false];
              default:
                return null;
            }
          }}
          title={<IntlMessages id={"liveness.title"} />}
        />
        {livenessDetail && (
          <Box mb={2} textAlign="right" className={styles.actions}>
            <Button size="small" onClick={() => setOpenViewLog(true)}>
              <span className={styles.textDelete}>
                <IntlMessages id={"liveness.viewLog"} />
              </span>
            </Button>
            <Button size="small" onClick={() => setDeleteConfirm(true)}>
              <span className={styles.textDelete}>
                <IntlMessages id={"liveness.delete"} />
              </span>
            </Button>
          </Box>
        )}
        <JRCard
          header={
            <Typography className={styles.titleHeader}>
              {livenessDetail?.requestId}
            </Typography>
          }
          headerLine
          fullBody
          disableShadow
          className={styles.container}
        >
          {livenessDetail && (
            <div className={styles.jrCard}>
              <div key="module-status" className={styles.module}>
                <div className={clsx(styles.mb24, styles.textTitle)}>
                  <IntlMessages id={"liveness.title"} />
                </div>

                <Grid container>
                  <Grid item xs={6}>
                    <div className={clsx(styles.mb16, styles.textLabelBold)}>
                      <IntlMessages id={"liveness.status_of_onboarding"} />
                    </div>
                    <div className={clsx(styles.mb24)}>
                      <Status status={livenessDetail?.status} />
                    </div>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <div className={styles.itemLabel}>
                          <IntlMessages id={"liveness.kycId"} />
                        </div>
                        <div className={styles.itemContent}>
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
                        </div>
                      </Grid>
                      <Grid item xs={8}>
                        <div className={styles.itemLabel}>
                          <IntlMessages id={"liveness.kyc.status"} />
                        </div>
                        <div className={styles.itemContent}>
                          {livenessDetail?.kycId ? (
                            <div className="d-flex align-items-start">
                              <CompareStatusKYC
                                type="liveness"
                                status={convertStatusKyc()}
                              />
                            </div>
                          ) : (
                            <IntlMessages id={"appModule.hyphen"} />
                          )}
                        </div>
                      </Grid>
                      <Grid item xs={4}>
                        <div className={styles.itemLabel}>
                          <IntlMessages id={"liveness.status_changed_at"} />
                        </div>
                        <div className={styles.itemContent}>
                          <Nullable>
                            {formatDate(
                              livenessDetail?.updatedDate,
                              LONG_DATE_TIME
                            )}
                          </Nullable>
                        </div>
                      </Grid>
                      <Grid item xs={8}>
                        <div className={styles.itemLabel}>
                          <IntlMessages id={"liveness.deviceType"} />
                        </div>
                        <div className={styles.itemContent}>
                          <Nullable>{livenessDetail?.deviceType}</Nullable>
                        </div>
                      </Grid>
                      <Grid item xs={4}>
                        <div className={styles.itemLabel}>
                          <IntlMessages id={"liveness.url_link_created_at"} />
                        </div>
                        <div className={styles.itemContent}>
                          <Nullable>
                            {formatDate(
                              livenessDetail?.createdDate,
                              LONG_DATE_TIME
                            )}
                          </Nullable>
                        </div>
                      </Grid>
                      <Grid item xs={8}>
                        <div className={styles.itemLabel}>
                          <IntlMessages id={"liveness.ipAddress"} />
                        </div>
                        <div className={styles.itemContent}>
                          <Nullable>
                            {livenessDetail?.requestIpAddress}
                          </Nullable>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <div className={styles.textLabelBold}>
                          <IntlMessages id={"liveness.selfiePhoto"} />
                        </div>
                        <div className={styles.itemContent}>
                          <div
                            className={
                              !livenessDetail?.livenessCheckInfo?.selfieUrl &&
                              styles.imgResize
                            }
                          >
                            {livenessDetail?.livenessCheckInfo?.selfieUrl ? (
                              <div
                                onClick={() =>
                                  handleOpenImageView(
                                    livenessDetail?.livenessCheckInfo?.selfieUrl
                                  )
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <img
                                  src={
                                    livenessDetail?.livenessCheckInfo?.selfieUrl
                                  }
                                  alt=""
                                />
                              </div>
                            ) : (
                              <div style={{ cursor: "default" }}>
                                <IconImageNa />
                              </div>
                            )}
                          </div>
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <div className={styles.textLabelBold}>
                          <IntlMessages id={"liveness.selfieVideo"} />
                        </div>
                        <div className={styles.itemContent}>
                          <div
                            className={
                              !livenessDetail?.livenessCheckInfo
                                ?.selfieVideoUrl && styles.imgResize
                            }
                          >
                            {livenessDetail?.livenessCheckInfo
                              ?.selfieVideoUrl ? (
                              <video
                                controls
                                src={
                                  livenessDetail?.livenessCheckInfo
                                    ?.selfieVideoUrl
                                }
                              />
                            ) : (
                              <IconVideoNa />
                            )}
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                    <div className={"mt-3"}>
                      {(livenessDetail?.livenessCheckInfo?.verifyStatus ||
                        "") && (
                        <Grid item xs={12}>
                          <div
                            className={clsx(
                              "d-flex align-items-center",
                              styles.textTitle
                            )}
                          >
                            <IntlMessages id={"liveness.livenessCheck"} />
                            <div className={"ml-2"}>
                              <CompareStatus
                                status={
                                  livenessDetail?.livenessCheckInfo
                                    ?.verifyStatus
                                }
                              />
                            </div>
                          </div>
                        </Grid>
                      )}
                    </div>
                  </Grid>
                </Grid>
              </div>
              <Divider />
              <div key="module-profile" className={clsx(styles.module)}>
                <div className={clsx(styles.mb24, styles.textTitle)}>
                  <IntlMessages id={"liveness.personalInfo"} />
                </div>
                <Grid container>
                  <Grid item xs={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <div className={styles.itemLabel}>
                          <IntlMessages id={"liveness.name"} />
                        </div>
                        <div className={styles.itemContent}>
                          <Nullable>
                            {livenessDetail?.userProfile?.firstName ||
                            livenessDetail?.userProfile?.lastName ||
                            livenessDetail?.userProfile?.middleName
                              ? getFullName(livenessDetail?.userProfile)
                              : "-"}
                          </Nullable>
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div className={styles.itemLabel}>
                          <IntlMessages id={"liveness.gender"} />
                        </div>
                        <div className={styles.itemContent}>
                          <Nullable>
                            {livenessDetail?.userProfile?.gender}
                          </Nullable>
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div className={styles.itemLabel}>
                          <IntlMessages id={"liveness.dateOfBirth"} />
                        </div>
                        <div className={styles.itemContent}>
                          <Nullable>
                            {livenessDetail?.userProfile?.dateOfBirth}
                          </Nullable>
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div className={styles.itemLabel}>
                          <IntlMessages id={"liveness.yearOfBirth"} />
                        </div>
                        <div className={styles.itemContent}>
                          <Nullable>
                            {livenessDetail?.userProfile?.yearOfBirth
                              ? livenessDetail?.userProfile?.yearOfBirth
                              : (
                                  livenessDetail?.userProfile?.dateOfBirth ||
                                  "-"
                                ).substr(0, 4)}
                          </Nullable>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <div className={styles.itemLabel}>
                          <IntlMessages id={"place-of-birth"} />
                        </div>
                        <div>
                          <Nullable
                            component={CountryFlagLanguage}
                            valueProp={"countryCode"}
                            displayCountryName
                            svg
                          >
                            {livenessDetail?.userProfile?.placeOfBirth}
                          </Nullable>
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div className={styles.itemLabel}>
                          <IntlMessages id={"liveness.nationality"} />
                        </div>
                        <div>
                          <Nullable
                            component={CountryFlagLanguage}
                            valueProp={"countryCode"}
                            displayCountryName
                            demonym
                            svg
                          >
                            {livenessDetail?.userProfile?.nationality}
                          </Nullable>
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div className={styles.itemLabel}>
                          <IntlMessages id={"liveness.country"} />
                        </div>
                        <div>
                          <Nullable
                            component={CountryFlagLanguage}
                            valueProp={"countryCode"}
                            displayCountryName
                            svg
                          >
                            {livenessDetail?.userProfile?.country}
                          </Nullable>
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div className={styles.itemLabel}>
                          <IntlMessages id={"form.idIssuingCountry"} />
                        </div>
                        <div>
                          <Nullable
                            component={CountryFlagLanguage}
                            valueProp={"countryCode"}
                            displayCountryName
                            svg
                          >
                            {livenessDetail?.userProfile?.idIssuingCountry}
                          </Nullable>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <div className={styles.itemLabel}>
                          <IntlMessages id={"email-address"} />
                        </div>
                        <div className={styles.itemContent}>
                          <Nullable>
                            {livenessDetail?.userProfile?.email}
                          </Nullable>
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div className={styles.itemLabel}>
                          <IntlMessages
                            id={"liveness.ocr.governmentIDNumber"}
                          />
                        </div>
                        <div className={styles.itemContent}>
                          <Nullable>
                            {livenessDetail?.userProfile?.governmentIdNumber}
                          </Nullable>
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div className={styles.itemLabel}>
                          <IntlMessages id={"reference-id"} />
                        </div>
                        <div className={styles.itemContent}>
                          <Nullable>
                            {livenessDetail?.userProfile?.referenceId}
                          </Nullable>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <div className={styles.itemLabel}>
                          <IntlMessages id={"liveness.idType"} />
                        </div>
                        <div className={styles.itemContent}>
                          <IntlMessages
                            id={getDocumentTypeKey(
                              livenessDetail?.documentInfo?.documentType
                            )}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <div className={styles.textLabelBold}>
                          <IntlMessages id={"liveness.frontSide"} />
                        </div>
                        <div className={styles.itemContent}>
                          <div className={styles.imgResize}>
                            {livenessDetail?.documentInfo?.frontDocumentUrl ? (
                              <div
                                onClick={() =>
                                  handleOpenImageView(
                                    livenessDetail?.documentInfo
                                      ?.frontDocumentUrl
                                  )
                                }
                              >
                                <img
                                  src={
                                    livenessDetail?.documentInfo
                                      ?.frontDocumentUrl
                                  }
                                  alt=""
                                />
                              </div>
                            ) : (
                              <div style={{ cursor: "default" }}>
                                <IconImageNa />
                              </div>
                            )}
                          </div>
                        </div>
                      </Grid>
                      <Grid item xs={6}>
                        <div className={styles.textLabelBold}>
                          <IntlMessages id={"liveness.backSide"} />
                        </div>
                        <div className={styles.itemContent}>
                          <div className={styles.imgResize}>
                            {livenessDetail?.documentInfo?.backDocumentUrl ? (
                              <div
                                onClick={() =>
                                  handleOpenImageView(
                                    livenessDetail?.documentInfo
                                      ?.backDocumentUrl
                                  )
                                }
                              >
                                <img
                                  src={
                                    livenessDetail?.documentInfo
                                      ?.backDocumentUrl
                                  }
                                  alt=""
                                />
                                {openImage && (
                                  <ImageViewer
                                    open={openImage}
                                    handleClose={() => setOpenImage(!openImage)}
                                    src={
                                      livenessDetail?.documentInfo
                                        ?.backDocumentUrl
                                    }
                                  />
                                )}
                              </div>
                            ) : (
                              <div style={{ cursor: "default" }}>
                                <IconImageNa />
                              </div>
                            )}
                          </div>
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div className={styles.itemContent}>
                          <span className={styles.faceMatchText}>
                            <IntlMessages id={"liveness.faceToIDMatch"} />{" "}
                            <Tooltip
                              arrow
                              title={
                                <div className="custom-tooltip">
                                  <h5>
                                    <IntlMessages id="liveness.faceToIDMatch" />
                                  </h5>
                                  <p>
                                    <FormattedHTMLMessage id="liveness.face.match.tooltip" />
                                  </p>
                                </div>
                              }
                            >
                              <QuestionMarkIcon />
                            </Tooltip>{" "}
                          </span>
                          <Chip
                            label={
                              livenessDetail?.livenessCheckInfo?.confidence !=
                              null
                                ? `${numeral(
                                    livenessDetail?.livenessCheckInfo
                                      ?.confidence
                                  ).format("0,0")}%`
                                : "-"
                            }
                            className={clsx(styles.chip, "ml-2")}
                          />
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
              {livenessDetail?.status !== VERIFY_STATUS.LIVENESS_PASSED.key && (
                <div>
                  <Divider />
                  <Grid item xs={12} className={styles.groupAction}>
                    {VERIFY_STATUS.WAIT_FOR_APPROVAL.key ===
                      livenessDetail?.status && (
                      <Button
                        variant="outlined"
                        onClick={() => setOpenRejectConfirm(true)}
                      >
                        <IntlMessages id={"liveness.reject"} />
                      </Button>
                    )}
                    {VERIFY_STATUS.WAIT_FOR_APPROVAL.key ===
                      livenessDetail?.status && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setOpenApproveConfirm(true)}
                      >
                        <IntlMessages id={"liveness.approve"} />
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
                      >
                        <IntlMessages id={"liveness.resendEmail"} />
                      </Button>
                    )}
                  </Grid>
                </div>
              )}
            </div>
          )}
        </JRCard>
        {openImage && (
          <ImageViewer
            open={openImage}
            handleClose={() => setOpenImage(!openImage)}
            src={urlImage}
          />
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
            isOpen={openConfirm}
            title={formatMessage({ id: "confirm" })}
            content={<IntlMessages id="liveness.resentEmailConfirm" />}
            actions={[
              {
                value: true,
                label: formatMessage({ id: "button.yes" }),
                color: "primary",
                type: "submit",
              },
              {
                value: false,
                label: formatMessage({ id: "cancel" }),
                type: "cancel",
              },
            ]}
            onActions={(action, data) => {
              switch (action?.type) {
                case "submit": {
                  onConfirmYes();
                  return;
                }
                case "cancel": {
                  setOpenConfirm(false);
                  return;
                }
                default:
                  return;
              }
            }}
          />
        )}
        {openApproveConfirm && (
          <DialogComponent
            isOpen={openApproveConfirm}
            title={formatMessage({ id: "confirm" })}
            content={<IntlMessages id="liveness.approveConfirm" />}
            actions={[
              {
                value: true,
                label: formatMessage({ id: "button.yes" }),
                color: "primary",
                type: "submit",
              },
              {
                value: false,
                label: formatMessage({ id: "cancel" }),
                type: "cancel",
              },
            ]}
            onActions={(action, data) => {
              switch (action?.type) {
                case "submit": {
                  onApproveConfirmYes();
                  return;
                }
                case "cancel": {
                  setOpenApproveConfirm(false);
                  return;
                }
                default:
                  return;
              }
            }}
          />
        )}
        {openRejectConfirm && (
          <ChangeStatusDialog
            fixedPosition
            isOpen={openRejectConfirm}
            onClose={() => setOpenRejectConfirm(false)}
            onPressChange={(data, note) => {
              onRejectConfirmYes(data, note);
            }}
            status={VERIFY_STATUS.REJECTED.key}
          />
        )}
        {deleteConfirm && (
          <DialogComponent
            isOpen={deleteConfirm}
            title={formatMessage({ id: "confirm" })}
            content={<IntlMessages id="liveness.deleteConfirm" />}
            actions={[
              {
                value: true,
                label: formatMessage({ id: "button.yes" }),
                color: "primary",
                type: "submit",
              },
              {
                value: false,
                label: formatMessage({ id: "cancel" }),
                type: "cancel",
              },
            ]}
            onActions={(action, data) => {
              switch (action?.type) {
                case "submit": {
                  onDeleteConfirmYes();
                  return;
                }
                case "cancel": {
                  setDeleteConfirm(false);
                  return;
                }
                default:
                  return;
              }
            }}
          />
        )}
      </Fragment>
    </LoadingWrapper>
  );
};

export default ProfilePage;
