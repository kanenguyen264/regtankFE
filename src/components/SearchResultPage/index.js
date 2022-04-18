import { ReactComponent as NotFoundIcon } from "assets/icons/ic_notfound.svg";
import clsx from "clsx";
import React, { Fragment } from "react";
import styles from "./searchPage.module.scss";
import { Typography } from "@mui/material";
const SearchResultPage = (props) => {
  const { title } = props;
  return (
    <Fragment>
      <div className={styles.container}>
        <NotFoundIcon />
        <Typography variant="body1">{title}</Typography>
      </div>
    </Fragment>
  );
};
export default SearchResultPage;
