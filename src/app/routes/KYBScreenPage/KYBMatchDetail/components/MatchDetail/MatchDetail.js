import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  Backdrop,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  Icon,
} from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import Link from "@protego/sdk/RegtankUI/v1/Link";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable";
import { generatePath } from "@protego/sdk/utils/router";
import { ReactComponent as CloseIcon } from "assets/icons/close_icon.svg";
import { ReactComponent as CopyIcon } from "assets/icons/CopyIconGreen.svg";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguagev1";
import Gender from "components/Gender";
import Keyword from "components/Keywordv1";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { KYB_ROUTE_KYB_SCREEN_DETAIL } from "constants/routes";
import React, { Fragment, useState } from "react";
import { formatDate } from "util/date";
import { isCompletedStatus } from "util/index";
import StatusResolution from "../../components/StatusResolution";
import styles from "./MatchDetail.module.scss";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";

const MatchDetail = function MatchDetail({ matchDetail, currentResult }) {
  const { paging, match, kybId } = matchDetail;

  const [openImage, setOpenImage] = React.useState(false);
  const [
    viewMoreAddressesMatchDetails,
    setViewMoreAddressesMatchDetails,
  ] = useState(false);

  const renderHeader = () => {
    return (
      <div className={styles.CardHeaderContainer}>
        <div className="d-flex flex-column">
          <Typography variant="Subtitle2">
            <IntlMessages id="match-details" />
          </Typography>
          <div className={"mt-2"}>
            <CopyButton
              component={"span"}
              tooltip={<IntlMessages id="tooltip.copyID" />}
              copyIcon={<Icon component={CopyIcon} fontSize={toRem(18.33)} />}
              className={styles.copyButton}
            >
              <Typography variant="titleForm">{match.matchId}</Typography>
            </CopyButton>
          </div>
        </div>

        <div className={clsx("d-flex align-items-center", styles.headerPagination)}>
          <div className={"d-flex mr-2"}>
            <div className="d-flex align-baseline align-items-center">
              <Typography variant="textLabel">
                {paging.currentMatch}{" "}
                <IntlMessages id={"dialog.profile.outOf"} />
              </Typography>
              &nbsp;
              <Typography variant="textLabel" color="primary">
                {paging.totalMatches}{" "}
                {paging.totalMatches > 1 ? (
                  <IntlMessages id={"dialog.profile.possibleMatches"} />
                ) : (
                  <IntlMessages id={"dialog.profile.possibleMatch"} />
                )}
              </Typography>
            </div>
          </div>
          <div className={"d-flex align-items-center"}>
            <div>
              <Button
                variant="outlinedIcon"
                size="small"
                disabled={!paging.previousId}
                {...(paging.previousId && {
                  component: Link,
                  to: generatePath(KYB_ROUTE_KYB_SCREEN_DETAIL, {
                    kybId: kybId,
                    matchId: paging.previousId,
                  }),
                })}
              >
                <KeyboardArrowLeftIcon />
              </Button>
            </div>
            <div className={"ml-2"}>
              <Button
                disabled={!matchDetail.paging.nextId}
                variant="outlinedIcon"
                size="small"
                {...(paging.nextId && {
                  component: Link,
                  to: generatePath(KYB_ROUTE_KYB_SCREEN_DETAIL, {
                    kybId: kybId,
                    matchId: paging.nextId,
                  }),
                })}
              >
                <KeyboardArrowRightIcon />
              </Button>
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
          timeout: 500,
        }}
        PaperProps={{
          style: { borderRadius: "5px" },
        }}
        maxWidth={"lg"}
      >
        <DialogContent
          style={{
            padding: "8px",
            position: "relative",
            maxWidth: "100%",
          }}
        >
          <CloseIcon
            style={{
              position: "absolute",
              marginTop: "8px",
              right: "16px",
              cursor: "pointer",
            }}
            onClick={handleClose}
          ></CloseIcon>
          <img
            style={{
              borderRadius: "5px",
              flexShrink: 0,
              width: "100%",
              height: "100%",
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
      <JRCard
        headerLine
        header={renderHeader()}
        className={styles.CardContainer}
      >
        <div className={styles.BodyBackground}>
          <Grid container rowSpacing={1.5}>
            <Grid item xs={9}>
              <Grid container>
                <Grid item>
                  {match.imageThumbnail && (
                    <ImageViewer
                      open={openImage}
                      handleClose={handleClose}
                      src={match.imageThumbnail}
                    ></ImageViewer>
                  )}
                  <UserAvatar
                    user={match.businessName}
                    size={48}
                    src={match.imageThumbnail}
                    className={styles.userAvatarInMatch}
                    {...(match.imageThumbnail && { onClick: handleOpen })}
                  />
                </Grid>
                <Grid item>
                  <div className="d-flex flex-column">
                    <Typography variant="Subtitle1">{match.businessName}</Typography>
                    <Typography variant="Subtitle2">
                      <div className="d-flex" style={{ marginTop: "6px" }}>
                        <Nullable>
                          <Gender type={match.gender} variant={"Subtitle2"} />
                        </Nullable>
                        {match && match.dateOfBirth && (
                          <>
                            {" "}
                            &nbsp;
                            {" · "}
                            &nbsp;
                            <Nullable>{formatDate(match.dateOfBirth)}</Nullable>
                          </>
                        )}
                      </div>
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <StatusResolution
                kybId={matchDetail.kybId}
                match={matchDetail.match}
                currentResult={currentResult}
                disabled={isCompletedStatus(matchDetail.kycStatus)}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container rowSpacing={1}>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={3} className="d-flex flex-column pr-4">
                      <Typography variant="labelFieldForm">
                        <IntlMessages id={"kyb.alias"} />
                      </Typography>
                      <Typography variant="textLabel2" style={{marginTop: "4px"}}>
                        <Nullable>{match.aliases.join(", ")}</Nullable>
                      </Typography>
                    </Grid>
                    <Grid item xs={3} className="d-flex flex-column pr-4">
                      <Typography variant="labelFieldForm">
                        <IntlMessages id={"kyb.phoneNumber"} />
                      </Typography>
                      <Typography variant="textLabel2" style={{marginTop: "4px"}}>
                        <Nullable>{match.telephoneNumber}</Nullable>
                      </Typography>
                    </Grid>
                    <Grid item xs={3} className="d-flex flex-column pr-4">
                      <Typography variant="labelFieldForm">
                        <IntlMessages id={"kyb.addresses"} />
                      </Typography>
                      <Typography variant="textLabel2" style={{marginTop: "4px"}}>
                        {!viewMoreAddressesMatchDetails &&
                        match.addresses.length > 1 ? (
                          <Nullable>
                            {match.addresses
                              .slice(0, 1)
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
                          </Nullable>
                        ) : (
                          <Nullable>
                            {match.addresses.map((item) => (
                              <li style={{ listStyle: "none" }}>{item}</li>
                            ))}
                            {match.addresses.length > 1 && (
                              <span
                                className={styles.ViewMore}
                                onClick={() =>
                                  setViewMoreAddressesMatchDetails(false)
                                }
                              >
                                <IntlMessages id={"kyb.viewLess"} />
                              </span>
                            )}
                          </Nullable>
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={3} className="pr-4">
                      <div className="d-flex flex-column">
                        <Typography variant="labelFieldForm">
                          <IntlMessages id={"result.Keywords"} />
                        </Typography>
                        <div className={styles.keywordStyle} style={{marginTop: "4px"}}>
                          <Nullable component={Keyword} valueProp={"keywords"}>
                            {match.keywords}
                          </Nullable>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </JRCard>
    </Fragment>
  );
};

export default MatchDetail;
