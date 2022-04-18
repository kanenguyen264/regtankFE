import React from "react";
import styles from "./mediaNotFound.module.scss";
import { ReactComponent as ImageLivenessNotFound } from "assets/icons/liveness/ImageLivenessNotFound.svg";
import { Icon } from "@mui/material";

const MediaNotFound = ({ type, description }) => {
  return (
    <div className={styles.mediaNotFoundWrapper}>
      <div className={styles.icon}>
        <Icon component={ImageLivenessNotFound} />
      </div>
      <div className={styles.description}>
        {description || "Image Not Available"}
      </div>
    </div>
  );
};

export default MediaNotFound;
