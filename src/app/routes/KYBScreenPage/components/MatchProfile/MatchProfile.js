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
import Keyword from "components/Keyword";
import { KYB_ROUTE_KYB_SCREEN_DETAIL } from "constants/routes";
import React, { Fragment, useState } from "react";
import styles from "./MatchProfile.module.scss";

const MatchProfile = function MatchProfile({ matchDetail }) {
  const { paging, kybId } = matchDetail;
  const [
    viewMoreAddressesMatchDetails,
    setViewMoreAddressesMatchDetails,
  ] = useState(false);
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
            <span>{matchDetail.match.matchId}</span>
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
              {paging.currentMatch} <IntlMessages id={"dialog.profile.outOf"} />{" "}
              &nbsp;
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
                  to: generatePath(KYB_ROUTE_KYB_SCREEN_DETAIL, {
                    kybId: kybId,
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
                  to: generatePath(KYB_ROUTE_KYB_SCREEN_DETAIL, {
                    kybId: kybId,
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
      <JRCard className={styles.CardContainer} header={renderHeader()}>
        <div className={styles.BodyBackground}>
          <Grid container>
            <Grid item xs={9}>
              <div>
                <Typography className={styles.TextDescription}>
                  <IntlMessages id={"kyb.businessName"} />
                </Typography>
                <Typography>{matchDetail.match.businessName}</Typography>
              </div>
              <div className={styles.PaddingTopText}>
                <Typography className={styles.TextDescription}>
                  <IntlMessages id={"kyb.alias"} />
                </Typography>
                <Typography>
                  <Nullable>{matchDetail.match.aliases.join(", ")}</Nullable>
                </Typography>
              </div>

              <div className={styles.PaddingTopText}>
                <div class="d-flex ">
                  <div class="flex-fill">
                    <Typography className={styles.TextDescription}>
                      <IntlMessages id={"kyb.phoneNumber"} />
                    </Typography>
                    <Typography>
                      <Nullable>{matchDetail.match.telephoneNumber}</Nullable>
                    </Typography>
                  </div>
                </div>
                <div className={styles.PaddingTopText}>
                  <Typography className={styles.TextDescription}>
                    <IntlMessages id={"kyb.addresses"} />
                  </Typography>
                  <Typography>
                    <Nullable>
                      {!viewMoreAddressesMatchDetails &&
                      matchDetail.match.addresses.length > 5 ? (
                        <>
                          {matchDetail.match.addresses
                            .slice(0, 5)
                            .map((item) => (
                              <li style={{ listStyle: "none" }}>{item}</li>
                            ))}
                          <span
                            className={styles.ViewMore}
                            onClick={() =>
                              setViewMoreAddressesMatchDetails(true)
                            }
                          >
                            <IntlMessages id={"kyb.viewMore"} />
                          </span>
                        </>
                      ) : (
                        <>
                          {matchDetail.match.addresses.map((item) => (
                            <li style={{ listStyle: "none" }}>{item}</li>
                          ))}
                          {matchDetail.match.addresses.length > 5 && (
                            <span
                              className={styles.ViewMore}
                              onClick={() =>
                                setViewMoreAddressesMatchDetails(false)
                              }
                            >
                              <IntlMessages id={"kyb.viewLess"} />
                            </span>
                          )}
                        </>
                      )}
                    </Nullable>
                  </Typography>
                </div>
              </div>
            </Grid>

            <Grid item xs={3}>
              <Typography className={styles.TextDescription}>
                <IntlMessages id={"result.Keywords"} />
              </Typography>
              <div className={styles.PaddingTopText}>
                <Nullable component={Keyword} valueProp={"keywords"}>
                  {matchDetail?.match?.keywords}
                </Nullable>
              </div>
            </Grid>
          </Grid>
        </div>
      </JRCard>
    </Fragment>
  );
};

export default MatchProfile;
