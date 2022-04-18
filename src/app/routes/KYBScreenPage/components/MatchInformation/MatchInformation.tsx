import {
  Grid,
  IconButton,
  Switch,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import CopyButton from "@protego/sdk/UI/CopyButton";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import JRCard from "@protego/sdk/UI/JRCard/JRCard";
import Link from "@protego/sdk/UI/Link";
import Nullable from "@protego/sdk/UI/Nullable/Nullable";
import { usePrompt } from "@protego/sdk/UI/PromptDialog";
import { toRem } from "@protego/sdk/utils/measurements";
import {
  KYB_ACTION_RE_SCREENING_MY_KYB_DETAILS,
  KYB_ACTION_TOGGLE_OM,
} from "actions/KYBAction";
//@ts-ignore
import { ReactComponent as EventNoteBlackIcon } from "assets/icons/IcNoteBlack.svg";
//@ts-ignore
import { ReactComponent as EventNoteDisableIcon } from "assets/icons/IcNoteDisable.svg";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import { KYB_ROUTE_KYB_SCREEN_DETAIL } from "constants/routes";
import { isFunction } from "lodash";
import React from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import Moment from "react-moment";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "redux";
import { KybBusinessRequestEntityRes } from "types/typings-api";
import withUserSettings from "util/hocs/withUserSettings";
import { industryCodeToName } from "util/industry";
import { getSizeOfCompany } from "util/sizeOfCompany";
import { snackActions } from "util/snackbarUtils";
import { avatarString, getFullName } from "util/string";
import useOnGoingMonitoringPrompt from "../../KYBScreeningResult/dialog/creditDeductOM.js";
import KYBNoteComposer from "../KYBNoteComposer";
//@ts-ignore
import styles from "./MatchInformation.module.scss";

interface MatchInfoProps {
  callBackFunc?: Function;
  exportButton?: React.ReactNode;
  kybId: string;
  positiveMatch: string;
  requestEntity: KybBusinessRequestEntityRes;
}

function RenderContent(props) {
  const { requestEntity, positiveMatch, kybId, callBackFunc, ACL } = props;
  const settings = useSelector((state) => state.settings);
  const generalSettings = settings["generalSettings"];
  const { formatMessage } = useIntl();

  const dispatch = useDispatch();
  const confirmEnableOM = useOnGoingMonitoringPrompt();

  const [switchRescreening, setWitchRescreening] = React.useState(
    requestEntity?.enableReScreening
  );
  const [switchOnGoingMonitoring, setSwitchOnGoingMonitoring] = React.useState(
    //@ts-ignore
    requestEntity?.enableOnGoingMonitoring
  );

  React.useEffect(() => {
    setSwitchOnGoingMonitoring(requestEntity?.enableOnGoingMonitoring);
  }, [requestEntity]);

  const onReScreening = (event) => {
    const _switchRescreening = !switchRescreening;
    setWitchRescreening(_switchRescreening);
    dispatch(
      KYB_ACTION_RE_SCREENING_MY_KYB_DETAILS({
        action: event.target.checked,
        kybId: kybId,
      })
    );
    if (callBackFunc && isFunction(callBackFunc)) {
      callBackFunc(_switchRescreening);
    }
  };

  const confirmDisableOM = usePrompt({
    title: <IntlMessages id="confirmation" />,
    message: (
      <FormattedHTMLMessage
        id="kyb.dialog.onGoingMonitoring.confirmDisable"
        values={{ kybId: requestEntity?.kybId }}
      />
    ),
    actions: [
      {
        value: true,
        label: formatMessage({ id: "disable" }),
        color: "primary",
      },
      {
        value: false,
        label: formatMessage({ id: "cancel" }),
      },
    ],
  });
  const onChangeGoingMonitoring = async (event) => {
    const originalVal = switchOnGoingMonitoring;
    const val = event.target.checked;
    const kybOmDeductionConfirmation =
      generalSettings["kybOmDeductionConfirmation"];
    if (val === false) {
      // check setting on/off of KYB OM
      if (kybOmDeductionConfirmation) {
        const promptValue = await confirmDisableOM();
        if (promptValue !== true) {
          return;
        }
        try {
          await dispatch(
            KYB_ACTION_TOGGLE_OM({
              enabled: val,
              kybId: requestEntity?.kybId,
            })
          );

          setSwitchOnGoingMonitoring(val);
          snackActions.success(
            <IntlMessages
              id="kyb.dialog.OM.disable.content"
              values={{ total: 1 }}
            />
          );
        } catch (e) {
          snackActions.error(
            <IntlMessages id="appModule.generic.errorMessage" />
          );
          setSwitchOnGoingMonitoring(originalVal);
        }
      } else {
        try {
          await dispatch(
            KYB_ACTION_TOGGLE_OM({
              enabled: val,
              kybId: requestEntity?.kybId,
            })
          );
          setSwitchOnGoingMonitoring(val);
          snackActions.success(
            <IntlMessages
              id="kyb.dialog.OM.disable.content"
              values={{ total: 1 }}
            />
          );
        } catch (e) {
          snackActions.error(
            <IntlMessages id="appModule.generic.errorMessage" />
          );
          setSwitchOnGoingMonitoring(originalVal);
        }
      }
    } else {
      // check setting on/off of KYB OM
      if (kybOmDeductionConfirmation) {
        await confirmEnableOM(
          [requestEntity],
          val,
          KYB_ROUTE_KYB_SCREEN_DETAIL
        );
      } else {
        try {
          await dispatch(
            KYB_ACTION_TOGGLE_OM({
              enabled: val,
              kybId: requestEntity.kybId,
            })
          );
          setSwitchOnGoingMonitoring(val);
          snackActions.success(
            <IntlMessages
              id="kyb.dialog.onGoingMonitoring.success.headline"
              values={{ total: 1 }}
            />
          );
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
    <div className={styles.PaddingTopText}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography className={styles.TextDescription}>
            <IntlMessages id="screening.result.positiveMatch" />
          </Typography>
          {positiveMatch ? (
            <Link
              to={`/app/screen-kyb/result/${kybId}/match/${positiveMatch.matchId}`}
            >
              {positiveMatch.matchId}
            </Link>
          ) : (
            "-"
          )}
        </Grid>
        <Grid item xs={6}>
          <Typography className={styles.TextDescription}>
            <IntlMessages id="re-screening" />
          </Typography>
          {requestEntity?.archivedAt ? (
            <Tooltip
              arrow
              title={
                <div className="custom-tooltip">
                  <p>
                    <IntlMessages id="kyc.screen.tooltip.rescreening.disabled" />
                  </p>
                </div>
              }
            >
              <span>
                <Switch disabled checked={switchRescreening} />
              </span>
            </Tooltip>
          ) : (
            <Switch
              disabled={
                !requestEntity?.reScreeningEditable ||
                !ACL.isAllowedPermissions("MY_KYB_EDIT")
              }
              checked={switchRescreening}
              onChange={onReScreening}
            />
          )}
        </Grid>
        <Grid item xs={6}>
          <Typography className={styles.TextDescription}>
            <IntlMessages id="kyb.ongoing" />
          </Typography>
          {requestEntity?.archivedAt ? (
            <Tooltip
              arrow
              title={
                <div className="custom-tooltip">
                  <p>
                    <IntlMessages id="kyc.screen.tooltip.rescreening.disabled" />
                  </p>
                </div>
              }
            >
              <span>
                <Switch disabled checked={switchOnGoingMonitoring} />
              </span>
            </Tooltip>
          ) : (
            <Switch
              disabled={!ACL.isAllowedPermissions("MY_KYB_EDIT")}
              checked={switchOnGoingMonitoring}
              onChange={onChangeGoingMonitoring}
            />
          )}
        </Grid>
        <Grid item xs={6}>
          <Typography className={styles.TextDescription}>
            <IntlMessages id={"screening.result.Reference"} />
          </Typography>
          <Typography>
            <Nullable>{requestEntity.referenceId}</Nullable>
          </Typography>
        </Grid>
        {/* gender */}
        <Grid item xs={6}>
          <Typography className={styles.TextDescription}>
            <IntlMessages id={"kyb.BusinessIDNumber"} />
          </Typography>
          <Typography>
            <Nullable>{requestEntity.businessIdNumber}</Nullable>
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography className={styles.TextDescription}>
            <IntlMessages id={"kyb.DateOfIncorporation"} />
          </Typography>
          <Typography>
            <Nullable component={Moment} format={"DD/MM/YYYY"}>
              {requestEntity.dateOfIncorporation}
            </Nullable>
          </Typography>
        </Grid>
        {/* gender */}
        <Grid item xs={6}>
          <Typography className={styles.TextDescription}>
            <IntlMessages id={"kyb.SizeOfTheCompany"} />
          </Typography>
          <Typography>
            <Nullable>
              {requestEntity.sizeOfTheCompany && (
                <IntlMessages
                  id={getSizeOfCompany(requestEntity.sizeOfTheCompany)}
                />
              )}
            </Nullable>
          </Typography>
        </Grid>
        {/* year of birth */}
        <Grid item xs={6}>
          <Typography className={styles.TextDescription}>
            <IntlMessages id={"kyb.countryOfInCorporationtry"} />
          </Typography>
          <Typography>
            <Nullable
              component={CountryFlagLanguage}
              valueProp={"countryCode"}
              svg
            >
              {requestEntity.countryOfIncorporation}
            </Nullable>
          </Typography>
        </Grid>
        {/* Company */}
        <Grid item xs={6}>
          <Typography className={styles.TextDescription}>
            <IntlMessages id={"form.countryOfHeadquarter"} />
          </Typography>
          <Typography>
            <Nullable
              component={CountryFlagLanguage}
              valueProp={"countryCode"}
              svg
            >
              {requestEntity.countryOfHeadQuarter}
            </Nullable>
          </Typography>
        </Grid>
      </Grid>
      {/* phone */}
      <Typography
        className={clsx(styles.TextDescription, styles.PaddingTopText)}
      >
        <IntlMessages id={"screening.result.Phone"} />
      </Typography>
      <Typography>
        <Nullable>{requestEntity.phone}</Nullable>
      </Typography>
      {/* email */}
      <Typography
        className={clsx(styles.TextDescription, styles.PaddingTopText)}
      >
        <IntlMessages id={"screening.result.Email"} />
      </Typography>
      <Typography>
        <Nullable>{requestEntity.email}</Nullable>
      </Typography>
      {/* Nature of Business */}
      <Typography
        className={clsx(styles.TextDescription, styles.PaddingTopText)}
      >
        <IntlMessages id="kyb.NatureOfBusiness" />
      </Typography>
      <Typography>
        <Nullable>
          {industryCodeToName(requestEntity.natureOfBusiness)}
        </Nullable>
      </Typography>
      {/* Website */}
      <Typography
        className={clsx(styles.TextDescription, styles.PaddingTopText)}
      >
        <IntlMessages id="kyb.Website" />
      </Typography>
      <Nullable>{requestEntity.website}</Nullable>
      {/* Relationship */}
      <Typography
        className={clsx(styles.TextDescription, styles.PaddingTopText)}
      >
        <IntlMessages id="kyb.ScreeningDetails.Relationship" />
      </Typography>
      <Nullable>{requestEntity.relationship}</Nullable>
      {/* address line 1 */}
      <Typography
        className={clsx(styles.TextDescription, styles.PaddingTopText)}
      >
        <IntlMessages id="address-line-1" />
      </Typography>
      <Typography>
        <Nullable>{requestEntity.address1}</Nullable>
      </Typography>
      {/* address line 2 */}
      <Typography
        className={clsx(styles.TextDescription, styles.PaddingTopText)}
      >
        <IntlMessages id="address-line-2" />
      </Typography>
      <Typography>
        <Nullable>{requestEntity.address2}</Nullable>
      </Typography>
      {/* Business Information */}
      <Typography
        className={clsx(styles.TextDescription, styles.PaddingTopText)}
      >
        <IntlMessages id={"kyb.BusinessInformation"} />
      </Typography>
      <Typography>
        <Nullable>{requestEntity.businessInformation}</Nullable>
      </Typography>
    </div>
  );
}

const MatchInformation = React.memo(function MatchInformation(
  props: MatchInfoProps
) {
  const { requestEntity, kybId, callBackFunc } = props;
  const dispatch = useDispatch();

  const [switchRescreening, setWitchRescreening] = React.useState(
    requestEntity?.enableReScreening
  );

  const onReScreening = (event) => {
    const _switchRescreening = !switchRescreening;
    setWitchRescreening(_switchRescreening);
    dispatch(
      KYB_ACTION_RE_SCREENING_MY_KYB_DETAILS({
        action: event.target.checked,
        kybId: kybId,
      })
    );
    if (callBackFunc && isFunction(callBackFunc)) {
      callBackFunc(_switchRescreening);
    }
  };
  const [openNoteComment, setOpenNoteComment] = React.useState(false),
    addNoteRef = React.useRef<() => void>(null);
  const screenObj = window.screen;

  const onPressOpenNote = () => {
    setOpenNoteComment(!openNoteComment);
  };
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
      className={clsx(props.className, styles.CardContainer)}
      style={{ backgroundColor: "#f4f4f4" }}
      header={
        <div className={clsx(styles.HeaderCustom, styles.flexRow)}>
          <div
            className={clsx([
              styles.TextOverFlow,
              styles.CardHeaderTitleSafari,
            ])}
          >
            <div style={{ float: "left" }} className="d-fex">
              <div>
                <span
                  style={{
                    fontSize: toRem(14),
                    fontWeight: 400,
                    color: "#7A7A7A",
                  }}
                >
                  <IntlMessages id="screening-details" />
                </span>
              </div>

              <CopyButton
                className={clsx(styles.copyIcon, "position-relative")}
                component={"span"}
              >
                <span>{props.kybId}</span>
              </CopyButton>
            </div>
            <div
              style={{ float: "right", height: "100%", display: "none" }}
              className="row align-items-center"
            >
              <Switch checked={switchRescreening} onChange={onReScreening} />
            </div>
          </div>
        </div>
      }
    >
      <div className={styles.flexGrow}>
        <div className={styles.BodyBackground}>
          <div className={clsx(styles.flexColumn, styles.flexGrow)}>
            <div className={styles.noteGroup}>
              <Typography
                className={styles.CardHeaderName}
                style={{
                  color: openNoteComment && "#A3A3A3",
                  wordBreak: "break-all",
                }}
              >
                {props.requestEntity.businessName}
              </Typography>
              <IconButton
                onClick={onPressOpenNote}
                className={styles.IconButtonStyle}
              >
                {openNoteComment ? (
                  <EventNoteBlackIcon />
                ) : (
                  <EventNoteDisableIcon />
                )}
              </IconButton>
            </div>
            <div className={styles.flexGrow}>
              {openNoteComment ? (
                <>
                  <KYBNoteComposer
                    id={props.kybId}
                    addNoteCallbackRef={addNoteRef}
                    withoutOutsideCard
                    className={styles.NewNote}
                    containerHeight={getHeightFromScreen()}
                    scrollBarColor="#e6e6e6"
                  />
                </>
              ) : (
                <RenderContent {...props} />
              )}
            </div>
          </div>
          <div>
            <Grid item xs={6}>
              <Typography className={styles.TextDescription}>
                <IntlMessages id={"screening.result.Assignee"} />
              </Typography>
              <Typography>
                {assignee ? (
                  <table className="mt-1">
                    <tr>
                      <td>
                        <Avatar
                          alt={getFullName(assignee)}
                          style={{ background: assignee?.colorCode }}
                        >
                          {assignee.firstName || assignee.lastName
                            ? avatarString(
                                assignee.firstName,
                                assignee.lastName
                              )
                            : ""}
                        </Avatar>
                      </td>
                      <td>
                        <span>{getFullName(assignee)}</span>
                      </td>
                    </tr>
                  </table>
                ) : (
                  "-"
                )}
              </Typography>
            </Grid>
          </div>
        </div>
      </div>
    </JRCard>
  );
});

export default compose(withUserSettings)(MatchInformation);
