// @ts-nocheck
import { Grid, Icon, Typography } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import Link from "@protego/sdk/RegtankUI/v1/Link";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable";
import { Switch } from "@protego/sdk/RegtankUI/v1/Switch";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import { usePrompt } from "@protego/sdk/UI/PromptDialog";
import {
  KYC_ACTION_RE_SCREENING_MY_KYC_DETAILS,
  KYC_ACTION_TOGGLE_OM,
} from "actions/KYCAction";
//@ts-ignore
import { ReactComponent as CopyIcon } from "assets/icons/CopyIconGreen.svg";
//@ts-ignore
import { ReactComponent as IconNote } from "assets/icons/IcNote.svg";
//@ts-ignore
import { ReactComponent as IconNoteActive } from "assets/icons/IcNoteActive.svg";
//@ts-ignore
import { ReactComponent as IcQuestion } from "assets/icons/IcQuestion.svg";
//@ts-ignore
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import Gender from "components/Gender";
import { isFunction } from "lodash";
import React, { useEffect } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import Moment from "react-moment";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "recompose";
import { KycIndividualRequestEntityRes } from "types/typings-api";
import withUserSettings from "util/hocs/withUserSettings";
import { snackActions } from "util/snackbarUtils";
import { getFullName } from "util/string";
import { withACL } from "../../../../../../acl";
import useOnGoingMonitoringPrompt from "./dialog/creditOMConfirm";
import disableOM from "./dialog/disableOMConfirm";
//@ts-ignore
import styles from "./MatchInformation.module.scss";
import MatchInformationNote from "./MatchInformationNote";

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
  const confirmDisableOm = disableOM();
  useEffect(() => {
    setWitchRescreening(requestEntity?.enableReScreening);
  }, [requestEntity?.enableReScreening]);

  const { formatMessage } = useIntl();

  const confirmDisableOM = usePrompt({
    title: { text: <IntlMessages id="confirmation" />, icon: <IcQuestion /> },
    message: (
      <Typography variant="body1" color="grayText">
        <FormattedHTMLMessage
          id="kyc.dialog.onGoingMonitoring.confirmDisable"
          values={{ kycId }}
        />
      </Typography>
    ),
    actions: [
      {
        value: false,
        label: formatMessage({ id: "cancel" }),
        variant: "outlinedSecondary",
      },
      {
        value: true,
        label: formatMessage({ id: "disable" }),
        variant: "contained",
      },
    ],
  });

  const onReScreening = (event) => {
    const _switchRescreening = !switchRescreening;
    setWitchRescreening(_switchRescreening);
    dispatch(
      KYC_ACTION_RE_SCREENING_MY_KYC_DETAILS({
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
    const kycOmDeductionConfirmation =
      generalSettings["kycOmDeductionConfirmation"];

    const val = event.target.checked;
    if (val === false) {
      // check setting on/off of KYC OM when enable
      if (!kycOmDeductionConfirmation) {
        try {
          await dispatch(KYC_ACTION_TOGGLE_OM({ enabled: val, kycId }));
          snackActions.success(
            <FormattedHTMLMessage
              id="kyc.dialog.disabledOnGoingMonitoring.success"
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
        await confirmDisableOm([req]);
      }
    } else {
      // check setting on/off of KYC OM when enable
      if (kycOmDeductionConfirmation) {
        const req = {
          kycId,
          setSwitchOM: setSwitchOnGoingMonitoring,
          enableOM: val,
          ...requestEntity,
        };
        await confirmEnableOM([req]);
      } else {
        try {
          await dispatch(KYC_ACTION_TOGGLE_OM({ enabled: val, kycId }));
          snackActions.success(
            <FormattedHTMLMessage
              id="kyc.dialog.enabledOnGoingMonitoring.success"
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
      <Grid container>
        {/** Positive match **/}
        <Grid item xs={6}>
          <Typography variant="Subtitle2">
            <IntlMessages id="screening.result.positiveMatch" />
          </Typography>
        </Grid>
        <Grid item xs={6}>
          {positiveMatch ? (
            <Link
              to={`/app/screen-kyc/result/${kycId}/match/${positiveMatch.matchId}`}
            >
              <Typography variant="Subtitle5">
                {positiveMatch.matchId}
              </Typography>
            </Link>
          ) : (
            "-"
          )}
        </Grid>
        {/** Re-screening **/}
        <Grid item xs={6}>
          {archivedAt ? (
            <Tooltip
              arrow
              placement="top-start"
              title={
                <div className="custom-tooltip">
                  <p>
                    <FormattedHTMLMessage id="kyc.screen.tooltip.rescreening.disabled" />
                  </p>
                </div>
              }
            >
              <span>
                <Switch checked={switchRescreening} disabled />
              </span>
            </Tooltip>
          ) : (
            <Switch
              checked={switchRescreening}
              disabled={
                !requestEntity?.reScreeningEditable ||
                !ACL.isAllowedPermissions("MY_KYC_EDIT") ||
                false
              }
              onChange={onReScreening}
            />
          )}
          <Typography variant="Subtitle2">
            <IntlMessages id="re-screening" />
            <span className="ml-1">
              <Tooltip
                arrow
                placement="bottom-start"
                title={
                  <div className="custom-tooltip">
                    <h5>
                      <IntlMessages id="re-screening" />
                    </h5>
                    <p>
                      <FormattedHTMLMessage id="kyc.screen.tooltip.rescreening" />
                    </p>
                  </div>
                }
              >
                <QuestionMarkIcon />
              </Tooltip>
            </span>
          </Typography>
        </Grid>

        {/** Ongoing Monitoring **/}
        <Grid item xs={6}>
          {archivedAt ? (
            <Tooltip
              arrow
              placement="top-start"
              title={
                <div className="custom-tooltip">
                  <p>
                    <FormattedHTMLMessage id="kyc.screen.tooltip.onGoingMonitoring.disabled" />
                  </p>
                </div>
              }
            >
              <span>
                <Switch checked={switchOnGoingMonitoring} disabled />
              </span>
            </Tooltip>
          ) : !requestEntity.forename?.length ||
            requestEntity.pep === false ||
            requestEntity.adverseMedia === false ||
            requestEntity.lawEnforcement === false ||
            requestEntity.currentSanctions === false ||
            requestEntity.financialRegulator === false ? (
            <Tooltip
              arrow
              placement="top-start"
              title={
                !requestEntity.forename?.length ? (
                  <div className="custom-tooltip">
                    <p>
                      <FormattedHTMLMessage id="kyc.screen.tooltip.onGoingMonitoring.requiredFirstName" />
                    </p>
                  </div>
                ) : (
                  <div className="custom-tooltip">
                    <p>
                      <FormattedHTMLMessage id="kyc.screen.tooltip.onGoingMonitoring.differentDatasetFault" />
                    </p>
                  </div>
                )
              }
            >
              <span>
                <Switch checked={switchOnGoingMonitoring} disabled />
              </span>
            </Tooltip>
          ) : (
            <Switch
              disableRipple
              disabled={!ACL.isAllowedPermissions("MY_KYC_EDIT") || false}
              checked={switchOnGoingMonitoring}
              onChange={handleToggleOnGoingMonitoring}
            />
          )}
          <Typography variant="Subtitle2">
            <IntlMessages id="kyc.ongoing" />
            <span className="ml-1">
              <Tooltip
                arrow
                placement="bottom-start"
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
              >
                <QuestionMarkIcon />
              </Tooltip>
            </span>
          </Typography>
        </Grid>
        {/** Reference ID **/}
        <Grid item xs={6}>
          <Typography variant="Subtitle2">
            <IntlMessages id={"screening.result.Reference"} />
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="textLabel2">
            <Nullable>{requestEntity.referenceId}</Nullable>
          </Typography>
        </Grid>
        {/** Gender **/}
        <Grid item xs={6}>
          <Typography variant="Subtitle2">
            <IntlMessages id={"screening.result.Gender"} />
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="textLabel2">
            <Gender type={requestEntity.gender} />
          </Typography>
        </Grid>

        {/** Date of Birth **/}
        <Grid item xs={6}>
          <Typography variant="Subtitle2">
            <IntlMessages id={"screening.result.Dob"} />
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="textLabel2">
            <Nullable component={Moment} format={"DD/MM/YYYY"}>
              {requestEntity.dateOfBirth}
            </Nullable>
          </Typography>
        </Grid>
        {/** Place of Birth **/}
        <Grid item xs={6}>
          <Typography variant="Subtitle2">
            <IntlMessages id={"screening.result.Pob"} />
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Nullable
            component={CountryFlagLanguage}
            valueProp={"countryCode"}
            svg
          >
            {requestEntity.placeOfBirth}
          </Nullable>
        </Grid>
        {/** Government ID No. **/}
        <Grid item xs={6}>
          <Typography variant="Subtitle2">
            <IntlMessages id="government-id-number" />
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="textLabel2">
            <Nullable>{requestEntity.governmentIdNumber}</Nullable>
          </Typography>
        </Grid>
        {/** ID Issuing Country **/}
        <Grid item xs={6}>
          <Typography variant="Subtitle2">
            <IntlMessages id="kyc.idIssuingCountry" />
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Nullable
            component={CountryFlagLanguage}
            valueProp={"countryCode"}
            svg
          >
            {requestEntity.idIssuingCountry}
          </Nullable>
        </Grid>
        {/** Nationality **/}
        <Grid item xs={6}>
          <Typography variant="Subtitle2">
            <IntlMessages id={"result.Nationality"} />
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Nullable
            component={CountryFlagLanguage}
            demonym
            valueProp={"countryCode"}
            svg
          >
            {requestEntity.nationality}
          </Nullable>
        </Grid>
        {/** Country of Residence **/}
        <Grid item xs={6} className={styles.lastChild}>
          <Typography variant="Subtitle2">
            <IntlMessages id={"screening.result.Residence"} />
          </Typography>
        </Grid>
        <Grid item xs={6} className={styles.lastChild}>
          <Nullable
            component={CountryFlagLanguage}
            valueProp={"countryCode"}
            svg
          >
            {requestEntity.countryOfResidence}
          </Nullable>
        </Grid>
        {/** Phone Number **/}
        <Grid item xs={6}>
          <Typography variant="Subtitle2">
            <IntlMessages id={"screening.result.Phone"} />
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="textLabel2">
            <Nullable>{requestEntity.phone}</Nullable>
          </Typography>
        </Grid>
        {/** Email Address **/}
        <Grid item xs={6}>
          <Typography variant="Subtitle2">
            <IntlMessages id={"screening.result.Email"} />
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="textLabel2">
            <Nullable>{requestEntity.email}</Nullable>
          </Typography>
        </Grid>

        {/** Address Line 1 **/}
        <Grid item xs={6}>
          <Typography variant="Subtitle2">
            <IntlMessages id="kyc.address" />
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="textLabel2">
            <Nullable>{requestEntity.address1}</Nullable>
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
});

const MatchInformation = React.memo(function MatchInformation(
  props: MatchInfoProps
) {
  const [openNoteComment, setOpenNoteComment] = React.useState(false);

  const onPressOpenNote = () => {
    setOpenNoteComment(!openNoteComment);
  };

  //@ts-ignore
  const assignee = props.requestEntity?.assignee;

  return (
    <JRCard
      //@ts-ignore
      className={styles.MatchContainer}
      headerLine
      header={
        <div className={"d-flex justify-content-between align-items-center"}>
          <div className={"d-flex flex-column align-items-start"}>
            <div>
              <Typography variant="Subtitle2">
                <IntlMessages id="screening.title" />
              </Typography>
            </div>
            <div className={"mt-2"}>
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
          <div className="d-flex flex-row align-items-center">
            <Typography variant="labelFieldForm">
              <IntlMessages id={"screening.result.Assignee"} />
            </Typography>
            <div className="ml-2">
              {assignee ? (
                <UserAvatar
                  user={getFullName(assignee)}
                  size={32}
                  description={
                    <Typography variant="labelFieldBlack">
                      {getFullName(assignee)}
                    </Typography>
                  }
                />
              ) : (
                "-"
              )}
            </div>
          </div>
        </div>
      }
    >
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="titleForm" className="mr-2">
            {props.requestEntity.name}
          </Typography>
          <Button
            variant={"outlinedIcon"}
            onClick={onPressOpenNote}
            className={
              openNoteComment ? styles.noteButtonActive : styles.noteButton
            }
          >
            {openNoteComment ? <IconNoteActive /> : <IconNote />}
          </Button>
        </Grid>
        <Grid item xs={12}>
          {openNoteComment ? (
            <MatchInformationNote id={props.kycId} sm={10} md={3} />
          ) : (
            <RenderContent {...props} />
          )}
        </Grid>
      </Grid>
    </JRCard>
  );
});

export default compose(withUserSettings)(MatchInformation);
