import { Grid, Icon, SvgIcon, Typography } from "@mui/material";
import KYCAssigneeEditor from "@protego/sdk/RegtankUI/v1/AssigneeEditor";
import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import Switch from "@protego/sdk/RegtankUI/v1/Switch/BasicSwitch";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import Nullable from "@protego/sdk/UI/Nullable";
import { capitalizeFirst } from "@protego/sdk/utils/string";
import { GET_AVAILABLE_ASSIGN } from "actions";
import { DJ_ACTION_ASSIGN_KYC_REQUEST } from "actions/DJAction";
import { ReactComponent as CopyIcon } from "assets/icons/CopyIconGreen.svg";
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
import { ReactComponent as CopyIconOutlined } from "assets/images/icons/CopyIcon.svg";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import React from "react";
import { FormattedHTMLMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "recompose";
import { formatDate } from "util/date";
import { withACL } from "../../../../acl";
import styles from "./KYCScreeningResult.module.scss";

const UserInfo = ({
  currentScreeningResult,
  switchRescreening,
  handleChangeReScreening,
  switchOnGoingMonitoring,
  handleToggleOnGoingMonitoring,
  ACL,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [loadingAssign, setLoadingAssign] = React.useState(false);
  const users = useSelector((state) => {
    return state.staff?.userAvailableAssign;
  });

  React.useEffect(() => {
    setLoadingAssign(true);
    dispatch(GET_AVAILABLE_ASSIGN({ params: "DJKYC" })).finally(() =>
      setLoadingAssign(false)
    );
  }, []);

  const renderField = (label, value, className = "") => (
    <div className={clsx(styles.Field, className)}>
      <div className="d-flex flex-column">
        <Typography variant="labelFieldForm">{label}</Typography>

        <Typography variant="textLabel2">{value}</Typography>
      </div>
    </div>
  );

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
          kycId: currentScreeningResult.kycId,
          userId: optionSelected.id,
        })
      );
    }
    setLoadingAssign(false);
  };

  return (
    <JRCard
      header={
        <div className={"d-flex justify-content-between align-items-center"}>
          <div className={"d-flex flex-column align-items-start"}>
            <Typography variant="Subtitle2" style={{ lineHeight: toRem(20) }}>
              <IntlMessages id="screening-details" />
            </Typography>
            <div style={{ marginTop: toRem(8) }}>
              <CopyButton
                component={"span"}
                tooltip={<IntlMessages id="tooltip.copyID" />}
                copyIcon={<Icon component={CopyIcon} fontSize={toRem(18.33)} />}
                className={styles.copyButton}
              >
                <Typography
                  variant={"titleForm"}
                  style={{ lineHeight: toRem(20) }}
                >
                  {currentScreeningResult.kycId}
                </Typography>
              </CopyButton>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <div>
              <Typography
                variant="labelFieldForm"
                style={{ marginRight: toRem(16) }}
              >
                <IntlMessages id="screening.result.Assignee" />
              </Typography>
            </div>
            <LoadingWrapper loading={loadingAssign}>
              <div>
                <KYCAssigneeEditor
                  selected={currentScreeningResult.assignee}
                  data={users || []}
                  hideSearchBox={true}
                  customOnChange={changeAssignee}
                  placement={"bottom-end"}
                  mWidth={100}
                />
              </div>
            </LoadingWrapper>
          </div>
        </div>
      }
      headerLine
      classes={{ root: styles.cardWrap }}
    >
      <div className={styles.contentInfo}>
        <div className={styles.userTitle}>
          <Typography variant="titleForm" style={{ lineHeight: toRem(20) }}>
            {currentScreeningResult.individualRequest.name}
          </Typography>
        </div>
        <div className={styles.UserInfo}>
          <div
            style={{
              maxWidth: "20%",
            }}
          >
            <Grid container spacing={0}>
              <Grid item xs={12}>
                {renderField(
                  <IntlMessages id="gender" />,
                  <Nullable>
                    {currentScreeningResult.individualRequest.gender
                      |> capitalizeFirst}
                  </Nullable>,
                  "flex-fill"
                )}
              </Grid>

              <Grid item xs={12}>
                {renderField(
                  <IntlMessages id="reference-id" />,
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
                    {currentScreeningResult.individualRequest.referenceId}
                  </Nullable>
                )}
              </Grid>
            </Grid>
          </div>
          <div
            style={{
              maxWidth: "20%",
            }}
          >
            <Grid container spacing={0}>
              <Grid item xs={12}>
                {renderField(
                  <IntlMessages id="date-of-birth" />,
                  <Nullable>
                    {formatDate(
                      currentScreeningResult.individualRequest.dateOfBirth
                    )}
                  </Nullable>,
                  "flex-fill"
                )}
              </Grid>

              <Grid item xs={12}>
                {/* {renderField(
                  <IntlMessages id="date-of-birth" />,
                  <Nullable>
                    {formatDate(
                      currentScreeningResult.individualRequest.dateOfBirth
                    )}
                  </Nullable>,
                  "flex-fill"
                )} */}
              </Grid>

              <Grid item xs={12}>
                {renderField(
                  <IntlMessages id="place-of-birth" />,
                  <Nullable
                    component={CountryFlagLanguage}
                    valueProp={"countryCode"}
                    svg
                    displayCountryName
                  >
                    {currentScreeningResult.individualRequest.placeOfBirth}
                  </Nullable>,
                  "flex-fill"
                )}
              </Grid>
            </Grid>
          </div>
          <div
            style={{
              maxWidth: "20%",
            }}
          >
            {renderField(
              <IntlMessages id="government-id-number" />,
              <Nullable>
                {currentScreeningResult.individualRequest.governmentIdNumber}
              </Nullable>
            )}
            {renderField(
              <IntlMessages id="kyc.idIssuingCountry" />,
              <Nullable
                component={CountryFlagLanguage}
                valueProp={"countryCode"}
                svg
                displayCountryName
              >
                {currentScreeningResult.individualRequest.idIssuingCountry}
              </Nullable>
            )}
          </div>
          <div
            style={{
              maxWidth: "20%",
            }}
          >
            {renderField(
              <IntlMessages id="nationality" />,
              <Nullable
                component={CountryFlagLanguage}
                valueProp={"countryCode"}
                svg
                displayCountryName
                demonym
              >
                {currentScreeningResult.individualRequest.nationality}
              </Nullable>
            )}
            {renderField(
              <IntlMessages id="country-of-residence" />,
              <Nullable
                component={CountryFlagLanguage}
                valueProp={"countryCode"}
                svg
                displayCountryName
              >
                {currentScreeningResult.individualRequest.countryOfResidence}
              </Nullable>
            )}
          </div>
          <div
            style={{
              maxWidth: "20%",
            }}
          >
            {renderField(
              <IntlMessages id="phone-number" />,
              <Nullable>
                {currentScreeningResult.individualRequest.phone}
              </Nullable>
            )}
            {renderField(
              <IntlMessages id="email-address" />,
              <Nullable>
                {currentScreeningResult.individualRequest.email}
              </Nullable>
            )}

            {renderField(
              <IntlMessages id="kyc.address" />,
              <Nullable>
                {currentScreeningResult.individualRequest.address1}
              </Nullable>
            )}
          </div>
        </div>
      </div>

      <hr />
      <div>
        <Grid item xs={12}>
          <Grid container className={styles.switchesWrapper}>
            <Grid item className="d-flex align-items-center">
              <div className={styles.boxSwitches}>
                <div className={styles.btnSwitch}>
                  {currentScreeningResult?.archivedAt ? (
                    <Tooltip
                      placement="top-start"
                      arrow
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
                        ACL.isAllowedPermissions("DJ_MY_KYC_EDIT")
                          ? false
                          : true
                      }
                      onChange={handleChangeReScreening}
                    />
                  )}
                </div>
                <div>
                  <Typography variant="Subtitle2">
                    <IntlMessages id="re-screening" />
                  </Typography>
                  <span style={{ marginLeft: toRem(8) }}>
                    <Tooltip
                      placement="top-start"
                      arrow
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
                </div>
              </div>
              <div className={styles.boxSwitches}>
                <div className={styles.btnSwitch}>
                  {currentScreeningResult?.archivedAt ? (
                    <Tooltip
                      placement="top-start"
                      arrow
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
                  ) : (
                    <Switch
                      disabled={
                        ACL.isAllowedPermissions("DJ_MY_KYC_EDIT")
                          ? false
                          : true
                      }
                      checked={switchOnGoingMonitoring}
                      onChange={handleToggleOnGoingMonitoring}
                    />
                  )}
                </div>
                <div>
                  <Typography variant="Subtitle2">
                    <IntlMessages id="kyc.ongoing" />
                  </Typography>
                  <span style={{ marginLeft: toRem(8) }}>
                    <Tooltip
                      placement="top-start"
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
                    >
                      <QuestionMarkIcon />
                    </Tooltip>
                  </span>
                </div>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </JRCard>
  );
};

export default compose(withACL)(UserInfo);
