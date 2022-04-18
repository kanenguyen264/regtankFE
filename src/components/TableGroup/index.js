import { Divider, IconButton, Popover, Grid } from "@mui/material";
import PlusButton from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import AddIcon from "@mui/icons-material/Add";
import DropdownItem from "@protego/sdk/RegtankUI/v1/DropdownItem";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import clsx from "clsx";
import { GroupSelect } from "constants/GroupSelect";
import { BACKGROUND_APP_BAR } from "constants/ThemeColors";
import React, { Fragment } from "react";
import styles from "./groupStyle.module.scss";
import arrayMove from "array-move";
import { ReactComponent as ExpandMoreIcon } from "assets/icons/IconExpandMore.svg";
import { ReactComponent as ExpandLess } from "assets/icons/IconExpandLess.svg";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import SearchBox from "@protego/sdk/RegtankUI/v1/SearchBoxDebounce";
import { ReactComponent as SearchIcon } from "assets/icons/IcoOutlineSearch.svg";
import { useIntl } from "react-intl";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { TabScrollButton } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Scrollbars } from "react-custom-scrollbars";
import useMediaQuery from "@mui/material/useMediaQuery";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";

const useStyles = makeStyles((theme) => ({
  customTabsContained: {
    display: "flex",
    // width: "100%",
    position: "relative",
    "& > div:first-child": {
      width: "calc(100% - " + toRem(100) + ")",
    },
    "& .MuiTab-root": {
      textTransform: "none",
    },
    "& .MuiTabs-root": {
      "& > div.MuiButtonBase-root:first-child, & > div.MuiButtonBase-root:last-child": {
        position: "absolute",
        height: "100%",
        "&.Mui-disabled": {
          opacity: 1,
          color: "rgba(0, 0, 0, 0.26)",
        },
      },
      "& > div.MuiButtonBase-root:first-child": {
        right: toRem(55),
      },
      "& > div.MuiButtonBase-root:last-child": {
        right: toRem(8),
      },
    },
  },
  tooltipStyles: {
    tooltip: {
      paddingTop: toRem(12),
      paddingBottom: toRem(12),
      paddingLeft: toRem(12),
      paddingRight: toRem(12),
    },
  },
}));

function TableGroup(props) {
  const {
    data,
    onChangeGroup,
    select,
    onSelectDropDown,
    onPressAddNewGroup,
    onChangeOrderGroup,
    addNewRecordIntoGroupProps,
    searchBoxProps,
  } = props;
  const [dropdownOption, setDropdownOption] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [list, setList] = React.useState([]);
  const classes = useStyles();
  const [dragId, setDragId] = React.useState(null);
  const [dragItemStyle, setDragItemStyle] = React.useState(null);
  const { formatMessage } = useIntl();
  const scrollbar = React.useRef();
  const resolutionScreen = useMediaQuery("(max-width:1440px)");
  const resolutionMinScreen = useMediaQuery("(max-width:1280px)");

  const ref = list?.reduce((group, value) => {
    group[value?.id] = React.createRef();
    return group;
  }, {});

  React.useEffect(() => {
    if (data) setList(data);
  }, [data]);
  const onChangeTab = (item, index) => {
    onChangeGroup({ index: index, value: item });
    setAnchorEl(false);
  };

  const handleDrag = (ev) => {
    setDragId(ev.currentTarget.id);
    const el = ref[ev.currentTarget.id]?.current;

    if (el) {
      const viewPort = el.getBoundingClientRect();
      const style = {
        parent: {
          minWidth: viewPort.width,
        },
        child: {
          position: "fixed",
          top: viewPort.top - 1,
          left: viewPort.left,
          backgroundColor: "white",
        },
      };
      setDragItemStyle(style);
    }
  };

  const handleDrop = (ev) => {
    let dragBox = list.findIndex((box) => box.id === +dragId);
    let dropBox = list.findIndex((box) => box.id === +ev.currentTarget.id);

    if (dragBox !== -1 && dropBox !== -1) {
      let sortedList = arrayMove(list, dragBox, dropBox);
      setList(sortedList);
      onChangeOrderGroup && onChangeOrderGroup(sortedList);
    }
  };

  const onPressClose = (item) => {
    setAnchorEl(null);
    setDropdownOption({
      selected: !dropdownOption.selected,
      group: item,
    });
  };

  const getDropDownIcon = (value) => {
    if (dropdownOption?.group?.id === value.id) {
      return dropdownOption.selected ? <ExpandLess /> : <ExpandMoreIcon />;
    }
    return <ExpandMoreIcon />;
  };

  const onPressDropdown = (event, item) => {
    setAnchorEl(event?.currentTarget);
    setDropdownOption({
      selected: !dropdownOption.selected,
      group: item,
    });
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const onPressSelectItemDropdown = (type) => {
    onSelectDropDown(type, dropdownOption?.group);
    setAnchorEl(null);
  };

  if (!list) {
    return null;
  }

  var positionSelect = list?.length <= 1 || !select ? 0 : select?.index;
  if (select) {
    let index = list?.findIndex((i) => i.id === select?.value.id);
    positionSelect = index > 0 ? index : 0;
  }

  const getWidthScreen = () => {
    if (resolutionMinScreen) {
      return 525;
    }
    if (resolutionScreen) {
      return 625;
    }
    return 935;
  };
  return (
    <Fragment>
      <div className={styles.Container}>
        <div className="d-flex" style={{ flexGrow: 2 }}>
          <Tabs
            value={positionSelect}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            className="w-100"
            style={{ marginRight: toRem(16) }}
          >
            {list?.map((item, index) => {
              let colorSelect = positionSelect === index && BACKGROUND_APP_BAR;
              let opacitySelect = positionSelect === index && "1";
              return (
                <div
                  style={
                    dragId && +dragId === +item.id ? dragItemStyle.parent : {}
                  }
                  ref={scrollbar}
                >
                  <div
                    draggable={true}
                    ref={ref[item?.id]}
                    key={index}
                    id={item?.id}
                    style={
                      dragId && +dragId === +item.id ? dragItemStyle.child : {}
                    }
                    onDragOver={(ev) => ev.preventDefault()}
                    onDragStart={handleDrag}
                    onDragEnd={() => {
                      setDragId(null);
                      setDragItemStyle(null);
                    }}
                    onDrop={handleDrop}
                    className={clsx(
                      "d-flex",
                      styles.DragDropItem,
                      dragId && +dragId === +item.id ? styles.IsDraging : ""
                    )}
                  >
                    <div onClick={() => onChangeTab(item, index)}>
                      <Tab
                        style={{ color: colorSelect }}
                        label={
                          <Typography variant="small1" noWrap>
                            {item?.name}
                          </Typography>
                        }
                      ></Tab>
                    </div>
                    <div
                      className={clsx(
                        "d-flex align-items-center",
                        styles.DropdownIcon
                      )}
                    >
                      <div
                        style={{ color: colorSelect }}
                        onClick={(event) => onPressDropdown(event, item)}
                        className={
                          positionSelect === index && styles.SelectedGroup
                        }
                      >
                        {getDropDownIcon(item)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <Popover
              elevation={0}
              disableEnforceFocus={true}
              open={open}
              PaperProps={{
                style: {
                  backgroundColor: ThemeColors.white,
                  boxShadow: ThemeColors.boxShadow,
                  borderRadius: "8px",
                },
              }}
              style={{
                marginTop: "5px",
              }}
              anchorEl={anchorEl}
              id={id}
              onClose={() => onPressClose(dropdownOption.group)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              {GroupSelect?.map((i, ix) => {
                return (
                  <div key={ix}>
                    <DropdownItem onClick={() => onPressSelectItemDropdown(i)}>
                      <Typography variant="small1">
                        <IntlMessages id={i?.label} />
                      </Typography>
                    </DropdownItem>
                  </div>
                );
              })}
            </Popover>
            <div
              className={clsx(
                list?.length === 0 ? "pl-3" : "ml-1 mr-3",
                styles.AddButton
              )}
            >
              <Tooltip
                title={<IntlMessages id={"table.tooltip.add.group"} />}
                arrow
                interactive
                placement="top"
                classes={classes.tooltipStyles}
              >
                <IconButton onClick={onPressAddNewGroup}>
                  <AddIcon color={"primary"} />
                </IconButton>
              </Tooltip>
            </div>
          </Tabs>
        </div>
        <div className="d-flex">
          <Button
            className={styles.btn}
            disabled={data?.length > 0 ? false : true}
            onClick={addNewRecordIntoGroupProps?.onClick}
            variant="contained"
          >
            {addNewRecordIntoGroupProps?.text}
          </Button>
          <SearchBox
            className={clsx(styles.searchBox, "ml-3")}
            placeholder={searchBoxProps?.placeholder}
            searchIcon={<SearchIcon />}
          />
        </div>
      </div>
    </Fragment>
  );
}

export default TableGroup;
