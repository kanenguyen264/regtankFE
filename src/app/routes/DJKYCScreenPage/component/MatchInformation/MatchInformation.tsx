import { Grid, Icon, SvgIcon, Typography } from "@mui/material";
import KYCAssigneeEditor from "@protego/sdk/RegtankUI/v1/AssigneeEditor";
import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import Switch from "@protego/sdk/RegtankUI/v1/Switch/BasicSwitch";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import Link from "@protego/sdk/UI/Link";
import Nullable from "@protego/sdk/UI/Nullable/Nullable";
import { generatePath } from "@protego/sdk/utils/router";
import { GET_AVAILABLE_ASSIGN } from "actions";
import {
  DJ_ACTION_ASSIGN_KYC_REQUEST,
  DJ_ACTION_KYC_TOGGLE_OM,
  DJ_ACTION_RE_SCREENING_MY_KYC_DETAILS,
} from "actions/DJAction.ts";
//@ts-ignore
import { ReactComponent as CopyIcon } from "assets/icons/CopyIconGreen.svg";
//@ts-ignore
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
import { ReactComponent as CopyIconOutlined } from "assets/images/icons/CopyIcon.svg";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import Gender from "components/Gender";
import { DJ_KYC_ROUTE_KYC_SCREEN_DETAIL } from "constants/routes";
import { isFunction } from "lodash";
import React, { useEffect } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "recompose";
import { KycIndividualRequestEntityRes } from "types/typings-api";
import { formatDate, LONG_DATE } from "util/date";
import withUserSettings from "util/hocs/withUserSettings";
import { snackActions } from "util/snackbarUtils";
import { withACL } from "../../../../../acl";
import KYCNoteComposer from "../../component/DJNoteComposer";
import useOnGoingMonitoringPrompt from "./dialog/creditOMConfirm";
import disablePrompt from "./dialog/disableOMConfirm";
//@ts-ignore
import styles from "./MatchInformation.module.scss";

interface MatchInfoProps {
  callBackFunc?: Function;
  exportButton?: React.ReactNode;
  kycId: string;
  positiveMatch: string;
  requestEntity: KycIndividualRequestEntityRes;
}

const RenderContent = withACL((props) => {
  const {
    requestEntity,
    kycId,
    callBackFunc,
    positiveMatch,
    archivedAt,
    ACL,
  } = props;
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  const [switchRescreening, setWitchRescreening] = React.useState(
    requestEntity?.enableReScreening
  );
  const [switchOnGoingMonitoring, setSwitchOnGoingMonitoring] = React.useState(
    requestEntity?.enableOnGoingMonitoring
  );
  const confirmEnableOM = useOnGoingMonitoringPrompt();
  const confirmDisableOM = disablePrompt();
  useEffect(() => {
    setWitchRescreening(requestEntity?.enableReScreening);
  }, [requestEntity?.enableReScreening]);

  const { formatMessage } = useIntl();
  // const confirmDisableOM = usePromptDialog([]);

  const onReScreening = (event) => {
    const _switchRescreening = !switchRescreening;
    setWitchRescreening(_switchRescreening);
    dispatch(
      DJ_ACTION_RE_SCREENING_MY_KYC_DETAILS({
        action: event.target.checked,
        kycId: kycId,
      })
    );

    if (callBackFunc && isFunction(callBackFunc)) {
      callBackFunc(_switchRescreening);
    }
  };

  const handleToggleOnGoingMonitoring = async (event) => {
    const originalVal = switchOnGoingMonitoring;
    const generalSettings = settings["generalSettings"];
    const djKycOmDeductionConfirmation =
      generalSettings["djKycOmDeductionConfirmation"];

    const val = event.target.checked;
    if (val === false) {
      // check setting on/off of KYC OM when enable
      if (!djKycOmDeductionConfirmation) {
        try {
          await dispatch(DJ_ACTION_KYC_TOGGLE_OM({ enabled: val, kycId }));
          snackActions.success(
            <FormattedHTMLMessage
              id="djkyc.dialog.disabledOnGoingMonitoring.success"
              values={{ total: "1" }}
            />
          );
          setSwitchOnGoingMonitoring(val);
        } catch (e) {
          snackActions.error(
            <IntlMessages id="appModule.generic.errorMessage" />
          );
          setSwitchOnGoingMonitoring(originalVal);
        }
      } else {
        const req = {
          kycId,
          setSwitchOM: setSwitchOnGoingMonitoring,
          enableOM: val,
          ...requestEntity,
        };
        await confirmDisableOM([req]);
      }
    } else {
      // check setting on/off of KYC OM when enable
      if (djKycOmDeductionConfirmation) {
        const req = {
          kycId,
          setSwitchOM: setSwitchOnGoingMonitoring,
          enableOM: val,
          ...requestEntity,
        };
        await confirmEnableOM([req]);
      } else {
        try {
          await dispatch(DJ_ACTION_KYC_TOGGLE_OM({ enabled: val, kycId }));
          snackActions.success(
            <FormattedHTMLMessage
              id="djkyc.dialog.enabledOnGoingMonitoring.success"
              values={{ total: 1 }}
            />
          );
          setSwitchOnGoingMonitoring(val);
        } catch (e) {
          snackActions.error(
            <IntlMessages id="appModule.generic.errorMessage" />
          );
          setSwitchOnGoingMonitoring(originalVal);
        }
      }
    }
  };

  return (
    <div className={styles.Container}>
      <Grid container spacing={1} columns={10}>
        {/** Positive match **/}
        <Grid item xs={2}>
          <div className={"d-flex flex-column"}>
            <Typography variant="labelFieldForm">
              <IntlMessages id="screening.result.positiveMatch" />
            </Typography>
            <Typography variant="textLabel2">
              {positiveMatch ? (
                <Link
                  to={generatePath(
                    DJ_KYC_ROUTE_KYC_SCREEN_DETAIL,
                    {
                      matchId: positiveMatch.matchId as string,
                      kycId: kycId,
                    },
                    {}
                  )}
                >
                  {positiveMatch.matchId}
                </Link>
              ) : (
                "-"
              )}
            </Typography>
          </div>
        </Grid>
        {/** Date of Birth **/}
        <Grid item xs={2}>
          <div className={"d-flex flex-column"}>
            <Typography variant="labelFieldForm">
              <IntlMessages id={"screening.result.Dob"} />
            </Typography>
            <Typography variant="textLabel2">
              <Nullable component={"span"}>
                {formatDate(requestEntity.dateOfBirth, LONG_DATE)}
              </Nullable>
            </Typography>
          </div>
        </Grid>
        {/** Government ID No. **/}
        <Grid item xs={2}>
          <div className={"d-flex flex-column"}>
            <Typography variant="labelFieldForm">
              <IntlMessages id="government-id-number" />
            </Typography>
            <Typography variant="textLabel2">
              <Nullable>{requestEntity.governmentIdNumber}</Nullable>
            </Typography>
          </div>
        </Grid>
        {/** Nationality **/}
        <Grid item xs={2}>
          <div className={"d-flex flex-column"}>
            <Typography variant="labelFieldForm">
              <IntlMessages id={"result.Nationality"} />
            </Typography>
            <Typography variant="textLabel2">
              <Nullable
                component={CountryFlagLanguage}
                demonym
                valueProp={"countryCode"}
                svg
                displayCountryName
              >
                {requestEntity.nationality}
              </Nullable>
            </Typography>
          </div>
        </Grid>
        {/** Phone Number **/}
        <Grid item xs={2}>
          <div className={"d-flex flex-column"}>
            <Typography variant="labelFieldForm">
              <IntlMessages id={"screening.result.Phone"} />
            </Typography>
            <Typography variant="textLabel2">
              <Nullable>{requestEntity.phone}</Nullable>
            </Typography>
          </div>
        </Grid>
        {/** Gender **/}
        <Grid item xs={2}>
          <div className={"d-flex flex-column"}>
            <Typography variant="labelFieldForm">
              <IntlMessages id={"screening.result.Gender"} />
            </Typography>
            <Typography variant="textLabel2">
              <Gender type={requestEntity.gender} variant={"textLabel2"} />
            </Typography>
          </div>
        </Grid>
        {/** Place of Birth **/}
        <Grid item xs={2}>
          <div className={"d-flex flex-column"}>
            <Typography variant="labelFieldForm">
              <IntlMessages id={"screening.result.Pob"} />
            </Typography>
            <Typography variant="textLabel2">
              <Nullable
                component={CountryFlagLanguage}
                valueProp={"countryCode"}
                svg
                displayCountryName
              >
                {requestEntity.placeOfBirth}
              </Nullable>
            </Typography>
          </div>
        </Grid>
        {/** ID Issuing Country **/}
        <Grid item xs={2}>
          <div className={"d-flex flex-column"}>
            <Typography variant="labelFieldForm">
              <IntlMessages id="kyc.idIssuingCountry" />
            </Typography>
            <Typography variant="textLabel2">
              <Nullable
                component={CountryFlagLanguage}
                valueProp={"countryCode"}
                svg
                displayCountryName
              >
                {requestEntity.idIssuingCountry}
              </Nullable>
            </Typography>
          </div>
        </Grid>
        {/** Country of Residence **/}
        <Grid item xs={2}>
          <div className={"d-flex flex-column"}>
            <Typography variant="labelFieldForm">
              <IntlMessages id={"screening.result.Residence"} />
            </Typography>
            <Typography variant="textLabel2">
              <Nullable
                component={CountryFlagLanguage}
                valueProp={"countryCode"}
                svg
                displayCountryName
              >
                {requestEntity.countryOfResidence}
              </Nullable>
            </Typography>
          </div>
        </Grid>
        {/** Email Address **/}
        <Grid item xs={2}>
          <div className={"d-flex flex-column"}>
            <Typography variant="labelFieldForm">
              <IntlMessages id={"screening.result.Email"} />
            </Typography>
            <Typography variant="textLabel2">
              <Nullable>{requestEntity.email}</Nullable>
            </Typography>
          </div>
        </Grid>
        {/** Reference ID **/}
        <Grid item xs={8}>
          <div className={"d-flex flex-column"}>
            <Typography variant="labelFieldForm">
              <IntlMessages id={"screening.result.Reference"} />
            </Typography>
            <Typography variant="textLabel2">
              <Nullable
                component={({ children, ...others }) => (
                  <CopyButton
                    component={"span"}
                    {...others}
                    copyIcon={
                      <SvgIcon
                        component={CopyIconOutlined}
                        viewBox="0 0 16 16"
                      />
                    }
                  >
                    <span>{children}</span>
                  </CopyButton>
                )}
              >
                {requestEntity.referenceId}
              </Nullable>
            </Typography>
          </div>
        </Grid>

        {/** Address Line **/}
        <Grid item xs={2}>
          <div className={"d-flex flex-column"}>
            <Typography variant="labelFieldForm">
              <IntlMessages id="kyc.address" />
            </Typography>
            <Typography variant="textLabel2">
              <Nullable>{requestEntity.address1}</Nullable>
            </Typography>
          </div>
        </Grid>

        <Grid item xs={12}>
          <hr />
          <Grid container className={styles.switchesWrapper}>
            {/* ReScreening */}
            <Grid item xs={2} className="d-flex flex-row align-items-center">
              {archivedAt ? (
                <Tooltip
                  arrow
                  title={
                    <div className="custom-tooltip">
                      <p>
                        <FormattedHTMLMessage id="dj.screen.tooltip.rescreening.disabled" />{" "}
                      </p>
                    </div>
                  }
                  placement={"top-start"}
                >
                  <span>
                    <Switch checked={switchRescreening} disabled />
                  </span>
                </Tooltip>
              ) : (
                <Switch
                  disabled={!requestEntity?.reScreeningEditable || false}
                  checked={switchRescreening}
                  onChange={onReScreening}
                />
              )}
              <Typography variant="Subtitle2">
                <IntlMessages id="re-screening" />
                <span className="ml-1">
                  <Tooltip
                    arrow
                    title={
                      <div className="custom-tooltip">
                        <h5>
                          <IntlMessages id="re-screening" />
                        </h5>
                        <p>
                          <FormattedHTMLMessage id="dj.screen.tooltip.rescreening" />
                        </p>
                      </div>
                    }
                    placement={"top-start"}
                  >
                    <QuestionMarkIcon />
                  </Tooltip>
                </span>
              </Typography>
            </Grid>
            {/* OM */}
            <Grid item xs={8} className="d-flex flex-row align-items-center">
              {archivedAt ? (
                <Tooltip
                  arrow
                  title={
                    <div className="custom-tooltip">
                      <p>
                        <FormattedHTMLMessage id="dj.screen.tooltip.rescreening.disabled" />
                      </p>
                    </div>
                  }
                  placement={"top-start"}
                >
                  <span>
                    <Switch checked={switchOnGoingMonitoring} disabled />
                  </span>
                </Tooltip>
              ) : (
                <Switch
                  disabled={
                    ACL.isAllowedPermissions("DJ_MY_KYC_EDIT") ? false : true
                  }
                  checked={switchOnGoingMonitoring}
                  onChange={handleToggleOnGoingMonitoring}
                />
              )}
              <Typography variant="Subtitle2">
                <IntlMessages id="kyc.ongoing" />
                <span className="ml-1">
                  <Tooltip
                    arrow
                    title={
                      <div className="custom-tooltip">
                        <h5>
                          <IntlMessages id="kyc.ongoing" />
                        </h5>
                        <p>
                          <FormattedHTMLMessage id="kyc.screen.tooltip.onGoingMonitoring" />
                        </p>
                      </div>
                    }
                    placement={"top-start"}
                  >
                    <QuestionMarkIcon />
                  </Tooltip>
                </span>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
});
const MatchInformation = React.memo(function MatchInformation(
  props: MatchInfoProps
) {
  const dispatch = useDispatch();

  const [openNoteComment, setOpenNoteComment] = React.useState(false);
  const [
    heightScreeningDetailRef,
    setHeightScreeningDetailRef,
  ] = React.useState(0);
  const users = useSelector((state) => state.staff?.userAvailableAssign);

  const addNoteRef = React.useRef<() => void>(null);
  const screeningDetailRef = React.useRef(null);
  const screenObj = window.screen;
  const [loadingAssign, setLoadingAssign] = React.useState(false);

  React.useEffect(() => {
    setHeightScreeningDetailRef(screeningDetailRef.current.clientHeight);
  }, []);
  React.useEffect(() => {
    dispatch(GET_AVAILABLE_ASSIGN({ params: "KYC" }));
  }, []);

  React.useEffect(() => {
    setHeightScreeningDetailRef(screeningDetailRef.current.clientHeight);
  }, []);

  const onPressOpenNote = () => {
    setOpenNoteComment(!openNoteComment);
  };
  const changeAssignee = async (
    optionSelected,
    setAnchorEl,
    setSelectedValue
  ) => {
    if (optionSelected?.id) {
      setLoadingAssign(true);
      setAnchorEl(null);
      setSelectedValue(optionSelected);
      await dispatch(
        DJ_ACTION_ASSIGN_KYC_REQUEST({
          kycId: props.kycId,
          userId: optionSelected.id,
        })
      );
    }
    setLoadingAssign(false);
  };
  //@ts-ignore
  const assignee = props.requestEntity?.assignee;
  const isSafari =
    navigator.vendor.match(/apple/i) &&
    !navigator.userAgent.match(/crios/i) &&
    !navigator.userAgent.match(/fxios/i);

  const getHeightFromScreen = () => {
    //@ts-ignore
    if (screenObj.width <= 1280) {
      return (isSafari ? screenObj.height / 1.7 : screenObj.height / 1.85) - 80;
    }
    return (isSafari ? screenObj.height / 1.84 : screenObj.height / 1.6) - 80;
  };

  return (
    <JRCard
      //@ts-ignore
      ref={screeningDetailRef}
      className={styles.JRCardBorder}
      //@ts-ignore
      headerLine
      header={
        <div className={"d-flex justify-content-between align-items-center"}>
          <div className={"d-flex flex-column align-items-start"}>
            <div>
              <Typography variant="Subtitle2">
                <IntlMessages id="screening-details" />
              </Typography>
            </div>
            <div className={"mt-1"}>
              <CopyButton
                component={"span"}
                tooltip={<IntlMessages id="tooltip.copyID" />}
                copyIcon={<Icon component={CopyIcon} fontSize={toRem(18.33)} />}
                className={styles.copyButton}
              >
                <Typography variant={"titleForm"}>{props.kycId}</Typography>
              </CopyButton>
            </div>
          </div>

          <div className="d-flex align-items-center">
            <Typography variant="labelFieldForm" className={"mr-3"}>
              <IntlMessages id="screening.result.Assignee" />
            </Typography>
            <LoadingWrapper loading={loadingAssign}>
              <div>
                <KYCAssigneeEditor
                  selected={assignee}
                  data={users || []}
                  customOnChange={changeAssignee}
                  placement={"bottom-end"}
                  mWidth={100}
                />
              </div>
            </LoadingWrapper>
          </div>
        </div>
      }
    >
      <div className={styles.flexGrow}>
        <div>
          <div className={styles.noteGroup}>
            <Typography variant="titleForm">
              {props.requestEntity.name}
            </Typography>
          </div>
          <div className={styles.flexGrow}>
            {openNoteComment ? (
              <KYCNoteComposer
                id={props.kycId}
                addNoteCallbackRef={addNoteRef}
                withoutOutsideCard
                className={styles.NewNote}
                containerHeight={getHeightFromScreen()}
                scrollBarColor="#e6e6e6"
              />
            ) : (
              <RenderContent {...props} />
            )}
          </div>
        </div>
      </div>
    </JRCard>
  );
});

export default compose(withUserSettings)(MatchInformation);
