import React, { Fragment, useRef } from "react";
import { SvgIcon, Typography } from "@mui/material";
import { CSVLink } from "react-csv";
import { makeStyles } from "@material-ui/core/styles";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import clsx from "clsx";
import { formatDate } from "util/date";
import { useIntl } from "react-intl";
import { ReactComponent as ExportIcon } from "assets/icons/IcExport.svg";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
const ExportSCV = ({
  nameFileExport,
  dataExport,
  headersExportCSV,
  size,
  className,
  ...props
}) => {
  const { formatMessage } = useIntl();
  const stringToday = "_" + formatDate(new Date(), "YYYYMMDD");
  const csvLink = useRef();

  const headersExport = headersExportCSV.map((item) => {
    return {
      label: formatMessage({ id: item.label }),
      key: item.key,
    };
  });

  const onPressExport = () => {
    csvLink.current.link.click();
  };
  return (
    <Fragment>
      <Button
        variant={"contained"}
        className={className}
        onClick={() => onPressExport()}
        startIcon={<ExportIcon />}
        size={"small"}
        {...props}
      >
        <Typography variant="Subtitle3">
          <IntlMessages id="export" />
        </Typography>
      </Button>
      <CSVLink
        data={dataExport}
        filename={nameFileExport + stringToday + ".csv"}
        className="hidden"
        headers={headersExport}
        ref={csvLink}
      />
    </Fragment>
  );
};

export default ExportSCV;
