import React, { Fragment } from "react";
import { ButtonBase } from "@mui/material";
import { CSVLink } from "react-csv";
import { makeStyles } from "@mui/styles";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import clsx from "clsx";
import { formatDate } from "util/date";
import { useIntl } from "react-intl";
import { Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@protego/sdk/RegtankUI/v1/MuiTheme/theme";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { DROPDOWN, WHITE } from "constants/ThemeColors";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
const useStyles = makeStyles((theme) => ({
  btnExportCSV: {
    height: toRem(36),
    paddingLeft: toRem(18),
    backgroundColor: ThemeColors.white,
    "&:hover": {
      textDecoration: "none",
      backgroundColor: `${ThemeColors.itemHover} !important`,
    },
    ".textStyle": {
      "&:hover": {
        color: `${ThemeColors.primary} !important`,
        textDecoration: "none",
      },
    },
  },
  textStyle: {
    color: ThemeColors.defaultDark,
    marginTop: toRem(8),
    marginRight: toRem(8),
    marginBottom: toRem(8),
    fontWeight: 500,
    "&:hover": {
      color: `${ThemeColors.primary} !important`,
      textDecoration: "none",
    },
    fontFamily: "Montserrat",
  },
}));

const ExportSCV = ({
  nameFileExport,
  dataExport,
  headersExportCSV,
  size,
  className,
  ...props
}) => {
  const classes = useStyles();
  const { formatMessage } = useIntl();
  const stringToday = "_" + formatDate(new Date(), "YYYYMMDD");

  const headersExport = headersExportCSV.map((item) => {
    return {
      label: formatMessage({ id: item.label }),
      key: item.key,
    };
  });

  return (
    <Fragment>
      <CSVLink
        data={dataExport}
        filename={nameFileExport + stringToday + ".csv"}
        className={clsx(classes.btnExportCSV, className)}
        headers={headersExport}
      >
        <Typography variant="small1" className={"d-flex align-items-center"}>
          <span className={classes.textStyle}>
            <IntlMessages id="export" />
          </span>
        </Typography>
      </CSVLink>
    </Fragment>
  );
};

export default ExportSCV;
