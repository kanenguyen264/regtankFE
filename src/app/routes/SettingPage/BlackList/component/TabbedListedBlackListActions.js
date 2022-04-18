// import Button from "@material-ui/core/Button";
// import Popover from "@material-ui/core/Popover";
import { Add as plusIcon, ChevronRight } from "@mui/icons-material";
import { Button, Icon, Popover } from "@mui/material";
import { makeStyles, withStyles } from "@mui/styles";
// import Add from "@material-ui/icons/Add";
import Dropdown from "@protego/sdk/RegtankUI/v1/Dropdown/Dropdown";
import DropdownItem from "@protego/sdk/RegtankUI/v1/DropdownItem";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import clsx from "clsx";
import React from "react";
import { CSVLink } from "react-csv";
import { useIntl } from "react-intl";
import styles from "../BlackListStyle.module.scss";

const useStyles = makeStyles(() => ({
  activeMenu: {
    backgroundColor: "#F5F5F5",
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

function TabbedListedBlackListActions(props) {
  const { additionalActions, selectedItems } = props;
  const disableImport = props.disableImport || false;
  const disableAddNew = props.disableAddNew || false;
  const disableBulk = props.disableBulk || false;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState();
  const [subItems, setSubItems] = React.useState();
  const [activeIdx, setActiveIdx] = React.useState();
  const { formatMessage } = useIntl();

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

  const mainButtons = typeof props.CSVLinkProps === "object" && (
    <Dropdown
      key="mainButtons"
      label={props.CSVLinkProps.label}
      variant="containedWhite"
      style={{color: "#606E7B"}}
      classes={{popoverContainer: styles.actionsPopover}}
    >
      {!disableImport ? (
        <CustomDropdownItem onClick={() => props.onAction("import")}>
          <label className={"text-dark"}>
            <IntlMessages id="appModule.importCSV"></IntlMessages>
          </label>
        </CustomDropdownItem>
      ) : (
        <></>
      )}

      <CustomDropdownItem onClick={() => props.onAction("downloadCsv")}>
        <CSVLink {...props.CSVLinkProps}>
          <IntlMessages id="appModule.downloadCSVTemplate"></IntlMessages>
        </CSVLink>
      </CustomDropdownItem>
    </Dropdown>
  );

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
        className={clsx(typeof props.CSVLinkProps === "object")}
        label={<IntlMessages id={"bulk-actions"} />}
        data-cy="bulk-actions"
        variant="outlinedPrimary"
        classes={{popoverContainer: styles.actionsPopover}}
      >
        {additionalActions?.map((item, index) => (
          <CustomDropdownItem
            onClick={(e) => {
              if (item.subMenu && item.subMenu.length) {
                handlePopoverOpen(e, item.subMenu, index);
              } else {
                item.onClick(selectedItems);
              }
            }}
            className={clsx({
              [classes.activeMenu]: item.subMenu && index === activeIdx,
            })}
            key={index}
            {...item.additionalProps}
          >
            {item.label}
            {item.subMenu && <ChevronRight className="float-right" />}
          </CustomDropdownItem>
        ))}
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
                  item.onClick(selectedItems);
                  handlePopoverClose();
                }}
              >
                {item.label}
              </CustomDropdownItem>
            );
          })}
      </Popover>
    </>
  );

  return (
    <div
      className={clsx(styles.headerAction, "d-flex justify-content-between  align-items-center")}
    >
      <div className={clsx("d-flex justify-content-start align-items-center", styles.importBulkBtns)}>
        {selectedItems?.length > 0 && !disableBulk && bulkActionButtons}
        {mainButtons}
      </div>
      <div className={"d-flex"}>
        {/* <div className={!disableAddNew && commonStyle.mr16}>
          <SearchBoxDebounce
            styleName={commonStyle.searchBoxStyle}
            placeholder={formatMessage({
              id: "setting.blacklist.search",
            })}
          />
        </div> */}
        {!disableAddNew && (
          // <Button
          //   startIcon={<Add />}
          //   className={commonStyle.btnMedium}
          //   variant="contained"
          //   color="primary"
          //   onClick={() => props.onAction("addBlackList")}
          // >
          //   <IntlMessages id="setting.blacklist.table.add" />
          // </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => props.onAction("addBlackList")}
            startIcon={<Icon component={plusIcon} />}
          >
            <IntlMessages id="setting.blacklist.table.add" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default TabbedListedBlackListActions;
