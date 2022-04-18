import React, { Fragment } from "react";
import {
  Button,
  FormControlLabel,
  Grid,
  Popover,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
import CustomTooltip from "./CustomTooltip";
import CustomCheckbox from "./CustomCheckbox";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import {
  DATA_ACCESS_VIEW_ALL,
  DATA_ACCESS_VIEW_SELF,
  DATA_ACCESS_VIEW_RELATED,
  DATA_ACCESS_VIEW_OWN_DEPT,
} from "constants/Role";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import aclStyles from "../ACLPage.module.scss";
import Dropdown from "@protego/sdk/RegtankUI/v1/Dropdown/Dropdown";
import DropdownItem from "@protego/sdk/RegtankUI/v1/DropdownItem/index";

const ACLDropdown = ({ item: itemProp, handleChange, disabled }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [item, setItem] = React.useState(itemProp);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
    handleChange(item);
  };

  const onChangeRadio = (val) => {
    handleChange({
      ...item,
      dataAccessPermission: val,
    });
  };

  const onChangeRelated = (checked) => {
    handleChange({
      ...item,
      canViewRelated: !checked,
    });
  };
  return (
    <Fragment>
      <Dropdown
        fullWidth
        variant="text"
        className={clsx(aclStyles.buttonWrap, {
          disabled: disabled,
        })}
        style={{ paddingLeft: 0 }}
        label={
          <Typography variant="Subtitle5">
            <CustomTooltip
              arrow
              title={
                <div className="custom-tooltip">
                  {item?.dataAccessPermission === DATA_ACCESS_VIEW_ALL ? (
                    <IntlMessages id="setting.ACL.tooltip.viewAll" />
                  ) : item?.dataAccessPermission ===
                    DATA_ACCESS_VIEW_OWN_DEPT ? (
                    <IntlMessages id="setting.ACL.tooltip.viewOwnDept" />
                  ) : (
                    <IntlMessages
                      id="setting.ACL.tooltip.viewRelated"
                      values={{ br: <br /> }}
                    />
                  )}
                </div>
              }
            >
              <span>
                {item?.dataAccessPermission === DATA_ACCESS_VIEW_ALL ? (
                  <IntlMessages id="setting.ACL.pe.viewAll" />
                ) : item?.dataAccessPermission === DATA_ACCESS_VIEW_SELF ? (
                  <IntlMessages id="setting.ACL.pe.viewSelf" />
                ) : (
                  <IntlMessages id="setting.ACL.pe.viewOwnDept" />
                )}

                {item?.canViewRelated && (
                  <span>
                    {" - "}
                    <IntlMessages id="setting.ACL.pe.related" />{" "}
                  </span>
                )}
              </span>
            </CustomTooltip>
          </Typography>
        }
        className={clsx("justify-content-between d-flex")}
      >
        <div>
          {item.function !== "DEPARTMENT_MODULE" && (
            <DropdownItem
              onClick={(e) => {
                onChangeRadio(DATA_ACCESS_VIEW_SELF);
              }}
            >
              <Typography variant="small1">
                <IntlMessages id="setting.ACL.pe.viewSelf" />
              </Typography>
            </DropdownItem>
          )}
        </div>
        <div>
          <DropdownItem
            onClick={(e) => {
              onChangeRadio(DATA_ACCESS_VIEW_OWN_DEPT);
            }}
          >
            <Typography variant="small1">
              <IntlMessages id="setting.ACL.pe.viewOwnDept" />
            </Typography>
          </DropdownItem>
        </div>
        <div>
          <DropdownItem
            onClick={(e) => {
              onChangeRadio(DATA_ACCESS_VIEW_ALL);
            }}
          >
            <Typography variant="small1">
              <IntlMessages id="setting.ACL.pe.viewAll" />
            </Typography>
          </DropdownItem>
        </div>
        <div>
          {item?.canViewRelated !== null && (
            <DropdownItem
              onClick={() => {
                onChangeRelated(item?.canViewRelated ? true : false);
              }}
            >
              <div className="d-flex justify-content-between">
                <div>
                  <CustomCheckbox
                    className={clsx(aclStyles.checkboxInput)}
                    value={DATA_ACCESS_VIEW_RELATED}
                    checked={item?.canViewRelated ? true : false}
                  />
                  <Typography variant="small1" className="pl-2">
                    <IntlMessages id="setting.ACL.pe.viewRelated" />
                  </Typography>
                </div>
                <div className="d-flex align-items-center">
                  <CustomTooltip
                    arrow
                    title={
                      <div className="custom-tooltip">
                        <IntlMessages
                          id="setting.ACL.tooltip.viewRelated"
                          values={{ br: <br /> }}
                        />
                      </div>
                    }
                  >
                    <QuestionMarkIcon />
                  </CustomTooltip>
                </div>
              </div>
            </DropdownItem>
          )}
        </div>
      </Dropdown>
    </Fragment>
  );
};

export default ACLDropdown;
