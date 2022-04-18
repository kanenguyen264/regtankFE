import * as React from "react";
import {
  Grid,
  DialogContent,
  DialogActions,
  Button,
  Backdrop,
  Dialog,
  Chip,
  Typography,
} from "@mui/material";
import styles from "./livenessCheckInfo.module.scss";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import { ReactComponent as IconImageNa } from "assets/icons/ic_image_not_available.svg";
import { ReactComponent as IconVideoNa } from "assets/icons/ic_video_not_available.svg";
import { ReactComponent as LivenessCheckPassIcon } from "assets/icons/liveness/LivenessCheckPassIcon.svg";
import { ReactComponent as LivenessCheckFailedIcon } from "assets/icons/liveness/LivenessCheckFailedIcon.svg";
import { ReactComponent as LivenessCheckDefaultIcon } from "assets/icons/liveness/LivenessCheckDefaultIcon.svg";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import clsx from "clsx";
import Status, {
  CompareStatus,
  CompareStatusKYC,
} from "components/LivenessStatus";
import numeral from "numeral";
import PercentChart from "components/Chart/v1/PercentChart";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import MediaNotFound from "./MediaNotFound";
const LivenessCheckInfo = ({ livenessDetail }) => {
  const [urlImage, setUrlImage] = React.useState(false);
  const [openImage, setOpenImage] = React.useState(false);

  const handleOpenImageView = (url) => {
    setUrlImage(url);
    setOpenImage(!openImage);
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

  const renderIconLivenessCheck = (status) => {
    if(status==="LIVENESS_FAILED") {
      return <LivenessCheckFailedIcon />
    } else if (status==="LIVENESS_PASSED"){
      return <LivenessCheckPassIcon />
    } else {
      return <LivenessCheckDefaultIcon />
    }
  }
  return (
    <Grid container spacing={1} className={styles.LivenessCheckInfoWrapper}>
      {openImage && (
        <ImageViewer
          open={openImage}
          handleClose={() => setOpenImage(!openImage)}
          src={urlImage}
        />
      )}
      <Grid item xs={4}>
        <JRCard header={"ID Photo"} headerLine>
          <div className={styles.itemContent}>
            <div className={styles.imgResize}>
              {livenessDetail?.documentInfo?.frontDocumentUrl ? (
                <div
                  onClick={() =>
                    handleOpenImageView(
                      livenessDetail?.documentInfo?.frontDocumentUrl
                    )
                  }
                >
                  <img
                    src={livenessDetail?.documentInfo?.frontDocumentUrl}
                    alt=""
                  />
                </div>
              ) : (
                <div style={{ cursor: "default" }}>
                  <MediaNotFound />
                </div>
              )}
            </div>
            <div className={styles.itemFooter}>Front Side</div>
          </div>
          <div className={styles.itemContent}>
            <div className={styles.imgResize}>
              {livenessDetail?.documentInfo?.backDocumentUrl ? (
                <div
                  onClick={() =>
                    handleOpenImageView(
                      livenessDetail?.documentInfo?.backDocumentUrl
                    )
                  }
                >
                  <img
                    src={livenessDetail?.documentInfo?.backDocumentUrl}
                    alt=""
                  />
                  {openImage && (
                    <ImageViewer
                      open={openImage}
                      handleClose={() => setOpenImage(!openImage)}
                      src={livenessDetail?.documentInfo?.backDocumentUrl}
                    />
                  )}
                </div>
              ) : (
                <div style={{ cursor: "default" }}>
                  <MediaNotFound />
                </div>
              )}
            </div>
            <div className={styles.itemFooter}>Back Side</div>
          </div>
        </JRCard>
      </Grid>
      <Grid item xs={4}>
        <JRCard header={"Profile Photo/Video"} headerLine>
          <div className={styles.itemContent}>
            <div className={styles.imgResize}>
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
                    src={livenessDetail?.livenessCheckInfo?.selfieUrl}
                    alt=""
                  />
                </div>
              ) : (
                <div style={{ cursor: "default" }}>
                  <MediaNotFound />
                </div>
              )}
            </div>
            <div className={styles.itemFooter}>Profile Photo</div>
          </div>
          <div className={styles.itemContent}>
            <div className={styles.imgResize}>
              {livenessDetail?.livenessCheckInfo?.selfieVideoUrl ? (
                <video
                  controls
                  src={livenessDetail?.livenessCheckInfo?.selfieVideoUrl}
                />
              ) : (
                <MediaNotFound />
              )}
            </div>
            <div className={styles.itemFooter}>Profile Video</div>
          </div>
        </JRCard>
      </Grid>
      <Grid item xs={4}>
        <Grid item={6} style={{marginBottom: toRem(24)}}>
          <JRCard header={"Liveness Check"} headerLine>
            <div className={styles.livenessCheck}>
              <div className={styles.iconCheckResult}>
                {renderIconLivenessCheck(livenessDetail?.livenessCheckInfo?.verifyStatus)}
              </div>
              <CompareStatus
                status={livenessDetail?.livenessCheckInfo?.verifyStatus}
              />
              {console.log("livenessDetail?.livenessCheckInfo?.verifyStatus", livenessDetail?.livenessCheckInfo?.verifyStatus)}
            </div>
          </JRCard>
        </Grid>
        <Grid item={6} className={styles.FacialMatch}>
          <JRCard header={"Facial Match"} headerLine>
            <PercentChart
              percentNumber={
                livenessDetail?.livenessCheckInfo?.confidence != null
                  ? `${numeral(
                      livenessDetail?.livenessCheckInfo?.confidence
                    ).format("0,0")}`
                  : "-"
              }
            />
            <Typography
              style={{ textAlign: "center" }}
              component={"div"}
              variant={"subtitleGray"}
            >
              Match similarity % between Liveness
            </Typography>
            <Typography
              style={{ textAlign: "center" }}
              component={"div"}
              variant={"subtitleGray"}
            >
              Check and Identification Photo
            </Typography>
          </JRCard>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LivenessCheckInfo;
