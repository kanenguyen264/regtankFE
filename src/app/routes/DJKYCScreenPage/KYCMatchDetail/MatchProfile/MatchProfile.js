import { Grid, IconButton } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import CopyButton from "@protego/sdk/UI/CopyButton";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import JRCard from "@protego/sdk/UI/JRCard/JRCard";
import Link from "@protego/sdk/UI/Link/Link";
import Nullable from "@protego/sdk/UI/Nullable/Nullable";
import { generatePath } from "@protego/sdk/utils/router";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import Gender from "components/Gender";
import Keyword from "components/Keyword";
import { DJ_KYC_ROUTE_KYC_SCREEN_DETAIL } from "constants/routes";
import React, { Fragment } from "react";
import styles from "./MatchProfile.module.scss";
import { getFullDateTime } from "util/date";

const MatchProfile = React.forwardRef(function MatchProfile(
  { matchDetail },
  ref
) {
  const { paging, match, kycId } = matchDetail;

  const renderHeader = () => {
    return (
      <div className={styles.CardHeaderContainer}>
        <Typography
          className={clsx([styles.TextOverFlow, styles.CardHeaderTitle])}
        >
          <IntlMessages id="match-details" /> -{" "}
          <CopyButton
            className={clsx(styles.copyIcon, "position-relative")}
            component={"span"}
          >
            <span>{match.matchId}</span>
          </CopyButton>
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            flex: 1,
          }}
        >
          <div className={"d-flex mr-1"}>
            <Typography className={styles.TextHeaderDescription}>
              <span className={styles.TextPossible}>{paging.currentMatch}</span>{" "}
              <IntlMessages id={"dialog.profile.outOf"} />{" "}
              <text className={styles.TextPossible}>
                {paging.totalMatches}{" "}
                {paging.totalMatches > 1 ? (
                  <IntlMessages id={"dialog.profile.possibleMatches"} />
                ) : (
                  <IntlMessages id={"dialog.profile.possibleMatch"} />
                )}
              </text>
            </Typography>
          </div>
          <div className={"d-flex"}>
            <div
              className={clsx(
                !paging.previousId && styles.IconButtonUnActiveStyle,
                styles.removeHoverButton
              )}
            >
              <IconButton
                style={{ padding: 0, margin: 0, paddingLeft: 2 }}
                {...(paging.previousId && {
                  component: Link,
                  to: generatePath(DJ_KYC_ROUTE_KYC_SCREEN_DETAIL, {
                    kycId: kycId,
                    matchId: paging.previousId,
                  }),
                })}
              >
                <ArrowBackIosIcon />
                <Typography className={styles.TextDescription}>
                  <IntlMessages id={"result.prev"} />
                </Typography>
              </IconButton>
            </div>
            <div
              className={clsx(
                !matchDetail.paging.nextId && styles.IconButtonUnActiveStyle,
                "ml-2",
                styles.removeHoverButton
              )}
            >
              <IconButton
                style={{ padding: 0, margin: 0, paddingLeft: 2 }}
                {...(paging.nextId && {
                  component: Link,
                  to: generatePath(DJ_KYC_ROUTE_KYC_SCREEN_DETAIL, {
                    kycId: kycId,
                    matchId: paging.nextId,
                  }),
                })}
              >
                <Typography className={styles.TextDescription}>
                  <IntlMessages id={"result.next"} />
                </Typography>
                <ArrowForwardIosIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <Fragment>
      <JRCard
        className={clsx(styles.CardContainer, "w-100")}
        header={renderHeader()}
        ref={ref}
      >
        <div className={styles.BodyBackground}>
          <Grid container>
            <Grid item xs={4}>
              <div>
                <Typography className={styles.TextDescription}>
                  <IntlMessages id={"result.Name"} />
                </Typography>
                <Typography>{match.concatenatedName}</Typography>
              </div>
              <div className={styles.PaddingTopText}>
                <Typography className={styles.TextDescription}>
                  <IntlMessages id={"result.Gender"} />
                </Typography>
                <div className={styles.HeightFlag}>
                  <Typography>
                    <Nullable>
                      <Gender type={match.gender} />
                    </Nullable>
                  </Typography>
                </div>
              </div>
              <div className={styles.PaddingTopText}>
                <Typography className={styles.TextDescription}>
                  <IntlMessages id={"result.DateOfBirth"} />
                </Typography>
                <div className={styles.HeightFlag}>
                  <Typography>
                    <Nullable>{getFullDateTime(match)}</Nullable>
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div>
                <Typography className={styles.TextDescription}>
                  <IntlMessages id={"result.Nationality"} />
                </Typography>
                <Typography>
                  <Nullable
                    component={CountryFlagLanguage}
                    valueProp={"countryCode"}
                    displayCountryName={true}
                    svg
                    djwl
                  >
                    {match.nationalityCode}
                  </Nullable>
                </Typography>
              </div>
              <div className={styles.PaddingTopText}>
                <Typography className={styles.TextDescription}>
                  <IntlMessages id={"result.PlaceOfBirth"} />
                </Typography>
                <div className={styles.HeightFlag}>
                  <Typography>
                    <Nullable
                      component={CountryFlagLanguage}
                      valueProp={"countryCode"}
                      displayCountryName={true}
                      svg
                      djwl
                    >
                      {match.placeOfBirth}
                    </Nullable>
                  </Typography>
                </div>
              </div>
              <div className={styles.PaddingTopText}>
                <Typography className={styles.TextDescription}>
                  <IntlMessages id={"screening.result.Residence"} />
                </Typography>
                <div className={styles.HeightFlag}>
                  <Typography>
                    <Nullable
                      component={CountryFlagLanguage}
                      valueProp={"countryCode"}
                      displayCountryName={true}
                      svg
                      djwl
                    >
                      {match.countryOfResidence}
                    </Nullable>
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={4}>
              <Typography className={styles.TextDescription}>
                <IntlMessages id={"result.Keywords"} />
              </Typography>
              <div className={styles.PaddingTopText}>
                <Nullable
                  component={Keyword}
                  valueProp={"keywords"}
                  screen={"DJ"}
                >
                  {match.keywords}
                </Nullable>
              </div>
            </Grid>
          </Grid>
        </div>
      </JRCard>
    </Fragment>
  );
});

export default MatchProfile;
