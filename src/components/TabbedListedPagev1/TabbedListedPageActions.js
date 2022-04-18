import { ChevronRight } from "@mui/icons-material";
import { Popover, Typography } from "@mui/material";
import { makeStyles, withStyles } from "@mui/styles";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import Dropdown from "@protego/sdk/RegtankUI/v1/Dropdown";
import DropdownItem from "@protego/sdk/RegtankUI/v1/DropdownItem";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import clsx from "clsx";
import ExportCSV from "components/ExportCSVv1";
import React from "react";
import { CSVLink } from "react-csv";
import { formatDate } from "../../util/date";
import { TabbedListedContext } from "./TabbedListedContext";
import styles from "./TabbedListedPage.module.scss";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@protego/sdk/RegtankUI/v1/MuiTheme/theme";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
/**
 *
 * @param {TabbedListedPageActionsProps} props
 * @constructor
 */

const useStyles = makeStyles(() => ({
  activeMenu: {
    backgroundColor: "#F5F5F5",
  },
  popoverDropdown: {
    marginTop: "4px",
    "& .MuiDropdown-panel": {
      minWidth: `${toRem(181)} !important`,
    },
  },
}));

const CustomDropdownItem = withStyles({
  root: {
    "&[disabled]": {
      cursor: "not-allowed",
      color: "#a9aaab",
    },
  },
})(DropdownItem);

function TabbedListedPageActions(props) {
  const { additionalActions } = props;
  const context = React.useContext(TabbedListedContext);
  const disableExport = props.disableExport || false;
  const disableImport = props.disableImport || false;
  const disabledArchive = props.disabledArchive || false;
  // TODO: get rid of onAction and these disable* flags
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState();
  const [subItems, setSubItems] = React.useState();
  const [activeIdx, setActiveIdx] = React.useState();

  const handlePopoverOpen = (event, subMenu, index) => {
    if (index !== activeIdx) {
      event.preventDefault();
      setActiveIdx(index);
      setSubItems(subMenu);
      setAnchorEl(event.currentTarget);
    }
  };

  const handlePopoverClose = () => {
    anchorEl.click();
    setAnchorEl(null);
    setSubItems(null);
    setActiveIdx(null);
  };

  const stringToday = "_" + formatDate(new Date(), "YYYYMMDD");
  const mainButtons =
    typeof props.CSVLinkProps === "object" &&
    (!disableImport ? (
      <Dropdown
        key="mainButtons"
        className={clsx(styles.importButton, "mr-2")}
        label={
          <Typography variant="Subtitle5">
            {props.CSVLinkProps.label}
          </Typography>
        }
      >
        <Typography variant="labelFieldForm">
          <CustomDropdownItem onClick={() => props.onAction("import")}>
            <IntlMessages id="appModule.importCSV"></IntlMessages>
          </CustomDropdownItem>
          <CustomDropdownItem onClick={() => props.onAction("downloadCsv")}>
            <CSVLink
              {...props.CSVLinkProps}
              style={{ color: "unset", textDecoration: "none" }}
            >
              <IntlMessages id="appModule.downloadCSVTemplate"></IntlMessages>
            </CSVLink>
          </CustomDropdownItem>
        </Typography>
      </Dropdown>
    ) : (
      <></>
    ));

  const anchorOrigin = {
    vertical: "top",
    horizontal: "right",
  };
  const transformOrigin = {
    vertical: "top",
    horizontal: "left",
  };

  const bulkActionButtons = (
    <>
      <Dropdown
        key="bulkButtons"
        variant="outlined"
        className={clsx(
          typeof props.CSVLinkProps === "object",
          "mr-3",
          styles.bulkButton
        )}
        label={
          <Typography variant="Subtitle5">
            <IntlMessages id={"bulk-actions"} />
          </Typography>
        }
        data-cy="bulk-actions"
        classes={{ popoverContainer: classes.popoverDropdown }}
      >
        {additionalActions ? (
          additionalActions.map((item, index) => {
            if (item?.component) {
              return item.component;
            }
            return (
              <CustomDropdownItem
                onClick={(e) => {
                  if (item.subMenu && item.subMenu.length) {
                    handlePopoverOpen(e, item.subMenu, index);
                  } else {
                    item.onClick(context.selected);
                  }
                }}
                className={clsx({
                  [classes.activeMenu]: item.subMenu && index === activeIdx,
                })}
                key={index}
                {...item.additionalProps}
              >
                <Typography variant="small1">{item.label}</Typography>

                {item.subMenu && <ChevronRight className="float-right" />}
              </CustomDropdownItem>
            );
          })
        ) : (
          <></>
        )}
        {!disableExport && context.selected?.length > 0 ? (
          <CustomDropdownItem
            className={styles.ExportSelected}
            component={ExportCSV}
            dataExport={props.ExportCSVProps.dataExport}
            nameFileExport={
              props.ExportCSVProps.nameFileExport + stringToday + ".csv"
            }
            headersExportCSV={props.ExportCSVProps.headersExportCSV}
          >
            <Typography variant="small1">
              <IntlMessages id={"appModule.button.exportSelected"} />
            </Typography>
          </CustomDropdownItem>
        ) : (
          <></>
        )}
        {!disabledArchive ? (
          <CustomDropdownItem
            onClick={() => props.onAction("addToArchive")}
            data-cy={"addToArchive"}
          >
            <Typography variant="small1">
              <IntlMessages id={"appModule.button.addToArchive"} />
            </Typography>
          </CustomDropdownItem>
        ) : (
          <></>
        )}
      </Dropdown>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        classes={{
          paper: classes.paper,
        }}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        onClose={handlePopoverClose}
      >
        {subItems &&
          subItems.map((item, index) => {
            return (
              <CustomDropdownItem
                key={index}
                onClick={() => {
                  item.onClick(context.selected);
                  handlePopoverClose();
                }}
              >
                <Typography variant="small1">{item.label}</Typography>
              </CustomDropdownItem>
            );
          })}
      </Popover>
    </>
  );

  const unarchived = (
    <Dropdown
      key="bulkButtons"
      variant="outlined"
      className={clsx("mr-3", styles.bulkButton)}
      label={
        <Typography variant="Subtitle5">
          <IntlMessages id={"bulk-actions"} />
        </Typography>
      }
      data-cy="bulk-actions"
      classes={{ popoverContainer: classes.popoverDropdown }}
    >
      <CustomDropdownItem
        onClick={() => props.onAction("unarchived")}
        data-cy={"unarchived"}
      >
        <Typography variant="small1">
          <IntlMessages id={"appModule.button.unArchive"} />
        </Typography>
      </CustomDropdownItem>
    </Dropdown>
  );

  return (
    <ThemeProvider theme={theme}>
      <div className={clsx("d-flex", { [props.className]: props.className })}>
        {
          {
            main: [
              context.selected?.length > 0 && bulkActionButtons,
              mainButtons,
            ].filter(Boolean),
            watch: [
              context.selected?.length > 0 && bulkActionButtons,
              mainButtons,
            ].filter(Boolean),
            archive: [
              context.selected?.length > 0 && unarchived,
              mainButtons,
            ].filter(Boolean),
          }[context.page]
        }
      </div>
    </ThemeProvider>
  );
}

export default TabbedListedPageActions;
