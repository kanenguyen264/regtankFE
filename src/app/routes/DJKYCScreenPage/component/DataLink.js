import React from "react";
import clsx from "clsx";
import styles from "../KYCMatchDetail/MatchProfile/MatchProfile.module.scss";
import LaunchIcon from "@material-ui/icons/Launch";
import { Link } from "react-router-dom";

const DataLink = ({ className = "", ...props }) => {
  /**
   * If href not link type
   * Render text
   */
  if (!props?.href) {
    return <span>{props?.displayTxt}</span>;
  }
  return (
    <Link
      className={clsx(styles.DataLink, className)}
      to={{ pathname: props?.href || "#" }}
      target="_blank"
      {...props}
    >
      {props?.displayTxt && <span>{props.displayTxt}</span>}
      <LaunchIcon fontSize="small" color="disabled"></LaunchIcon>
    </Link>
  );
};
export default DataLink;
