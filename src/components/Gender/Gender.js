import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import { Typography } from "@mui/material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import React, { Fragment } from "react";
import { getGenderTranslate } from "util/gender";

const Gender = ({ type, showIcon, variant }) => {
  const localizeGenderKey = getGenderTranslate(type);
  return (
    <Fragment>
      <div className="d-flex">
        {showIcon &&
          {
            MALE: <MaleIcon />,
            FEMALE: <FemaleIcon />,
          }[type]}
        <Typography variant={variant ? variant : "subtitleGray"}>
          <IntlMessages id={localizeGenderKey}></IntlMessages>
        </Typography>
      </div>
    </Fragment>
  );
};

export default Gender;
