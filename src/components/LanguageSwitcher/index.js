import React from "react";

import LanguageItem from "./LanguageItem";
import languageData from "./data";
import { makeStyles } from "@material-ui/core/styles";
// import clsx from "clsx";

const useStyles = makeStyles({
  item: {
    paddingTop: `${18 / 17}rem !important`,
    paddingBottom: `${18 / 17}rem !important`,
    paddingLeft: `${18 / 17}rem !important`,
    "&:not(:last-child)": {
      borderBottom: "1px solid #ddd"
    }
  }
});

const LanguageSwitcher = ({ switchLanguage, handleRequestClose }) => {
  const classes = useStyles();
  return (
    <ul className="list-unstyled">
      {languageData.map((language, index) => (
        <LanguageItem
          className={classes.item}
          key={index}
          language={language}
          handleRequestClose={handleRequestClose}
          switchLanguage={switchLanguage}
        />
      ))}
    </ul>
  );
};

export default LanguageSwitcher;
