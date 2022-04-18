import {
  Grid,
  IconButton,
  Dialog,
  Backdrop,
  DialogContent
} from "@material-ui/core";
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
import UserAvatar from "components/UserAvatar";
import { KYC_ROUTE_KYC_SCREEN_DETAIL } from "constants/routes";
import React, { Fragment } from "react";
import { formatDate } from "util/date";
import { ReactComponent as CloseIcon } from "assets/icons/close_icon.svg";
import styles from "./MatchProfile.module.scss";
const MatchProfile = function MatchProfile({ matchDetail }) {
  const { paging, match, kycId } = matchDetail;

  const [openImage, setOpenImage] = React.useState(false);

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
            flex: 1
          }}
        >
          <div className={"d-flex mr-1"}>
            <Typography className={styles.TextHeaderDescription}>
              {paging.currentMatch} <IntlMessages id={"dialog.profile.outOf"} />{" "}
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
                  to: generatePath(KYC_ROUTE_KYC_SCREEN_DETAIL, {
                    kycId: kycId,
                    matchId: paging.previousId
                  })
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
                  to: generatePath(KYC_ROUTE_KYC_SCREEN_DETAIL, {
                    kycId: kycId,
                    matchId: paging.nextId
                  })
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

  const ImageViewer = (props) => {
    const { open, src, title, handleClose } = props;
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
        PaperProps={{
          style: { borderRadius: "5px" }
        }}
        maxWidth={"lg"}
      >
        <DialogContent
          style={{
            padding: "8px",
            position: "relative",
            maxWidth: "100%"
          }}
        >
          <CloseIcon
            style={{
              position: "absolute",
              marginTop: "8px",
              right: "16px",
              cursor: "pointer"
            }}
            onClick={handleClose}
          ></CloseIcon>
          <img
            style={{
              borderRadius: "5px",
              flexShrink: 0,
              width: "100%",
              height: "100%"
            }}
            alt={title}
            src={src}
          ></img>
        </DialogContent>
      </Dialog>
    );
  };

  const handleOpen = () => {
    setOpenImage(true);
  };

  const handleClose = () => {
    setOpenImage(false);
  };

  return (
    <Fragment>
      <JRCard className={styles.CardContainer} header={renderHeader()}>
        <div className={styles.BodyBackground}>
          <Grid container>
            <Grid item xs={2}>
              {match.imageThumbnail && (
                <ImageViewer
                  open={openImage}
                  handleClose={handleClose}
                  src={match.imageThumbnail}
                ></ImageViewer>
              )}

              <UserAvatar
                user={match.name}
                size={75}
                src={match.imageThumbnail}
                className={styles.userAvatarInMatch}
                {...(match.imageThumbnail && { onClick: handleOpen })}
              />
            </Grid>
            <Grid item xs={4}>
              <div>
                <Typography className={styles.TextDescription}>
                  <IntlMessages id={"result.Name"} />
                </Typography>
                <Typography>{match.name}</Typography>
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
                    <Nullable>{formatDate(match.dateOfBirth)}</Nullable>
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div>
                <Typography className={styles.TextDescription}>
                  <IntlMessages id={"result.Nationality"} />
                </Typography>
                <Typography>
                  <Nullable
                    component={CountryFlagLanguage}
                    valueProp={"countryCode"}
                    svg
                    demonym
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
                      svg
                    >
                      {match.placeOfBirth}
                    </Nullable>
                  </Typography>
                </div>
              </div>
              <div className={styles.PaddingTopText}>
                <Typography className={styles.TextDescription}>
                  <IntlMessages id={"result.Country"} />
                </Typography>
                <div className={styles.HeightFlag}>
                  <Typography>
                    <Nullable
                      component={CountryFlagLanguage}
                      valueProp={"countryCode"}
                      svg
                    >
                      {match.nationalityCode}
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
                  {match.keywords}
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
