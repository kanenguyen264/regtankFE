import {
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from "@material-ui/core";
import { Button, SvgIcon } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Popover from "@material-ui/core/Popover";
import { makeStyles } from "@material-ui/core/styles";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import withPagination from "@protego/sdk/UI/withPagination";
import clsx from "clsx";
import UserAvatar from "components/UserAvatar";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { BR_DROPDOWN_ACTIVE, WHITE } from "constants/ThemeColors";
import { ReactComponent as CheckIcon } from "assets/icons/check.svg";
import { FETCH_ALL_STAFF, FILTER_AUDIT } from "constants/ActionTypes";
import { Formik, useFormikContext } from "formik";
import { remove } from "lodash";
import moment from "moment";
import React, { Fragment, useState } from "react";
import DateRange from "@protego/sdk/RegtankUI/v1/DatePicker/DateRangePicker";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { compose } from "redux";
import { formatDate } from "util/date";
import {
  filterActionList,
  getFilterActionText,
  getFilterActionTypeText,
  filterGroupActionList,
  getGroupByAction,
  getFilterGroupsActionText,
} from "util/filterActionType";
import { canAccessKYT } from "util/permision";
import { getFullName } from "util/string";
import styles from "./AuditPage.module.scss";
import { useIntl } from "react-intl";
import SearchBox from "components/SearchBoxDebounce";
import { map, reduceRight, union } from "lodash";
const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "space-between",
    "&:hover": {
      backgroundColor: "#F5F5F5",
    },
  },
  labelPlacementStart: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  labelPlacementStartStaff: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginLeft: 0,
    marginRight: 0,
  },
  labelPlacementStartStaffActive: {
    color: `${WHITE} `,
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    background: `${BR_DROPDOWN_ACTIVE}`,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: "1px",
  },
  dropdown: {
    backgroundColor: `${WHITE} !important`,
  },
  rounded: {
    borderRadius: toRem(8),
  },
  dropdownLabel: {
    textAlign: "center",
  },
  panel: {
    borderRadius: toRem(4),
    overflow: "hidden",
    backgroundColor: "#fff",
  },
});

const checkBoxStyle = makeStyles({
  root: {
    "&$checked": {
      color: "#0080FF",
    },
  },
  checked: {},
});

function AuditDate(props) {
  const { onChange } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const open = Boolean(anchorEl);
  const formikContext = useFormikContext();
  const classesDateRange = useStyles();
  const [value, setValue] = React.useState([
    {
      startDate: "",
      endDate: moment(new Date(null)).endOf("day"),
      key: "selection",
    },
  ]);

  React.useEffect(() => {
    if (!formikContext.values.startDate && !formikContext.values.endDate) {
      let objTime = {
        startDate: "",
        endDate: moment(new Date()).endOf("day"),
        key: "selection",
      };
      setValue([objTime]);
    }
  }, [formikContext.values.startDate, formikContext.values.endDate]);

  const onPressClose = () => {
    if (value[0].startDate && value[0].endDate) {
      onChange(value[0]);
    }
    setAnchorEl(false);
  };

  const onPressReset = () => {
    setValue([
      {
        startDate: "",
        endDate: moment(new Date()).endOf("day"),
        key: "selection",
      },
    ]);
    formikContext.setFieldValue("startDate", "");
    formikContext.setFieldValue("endDate", "");
  };

  const onChangeTime = (item) => {
    setValue([item.selection]);
  };

  return (
    <>
      <Button
        //  className={clsx(styles.FilterButton, styles.FilterActionButton)}
        onClick={handleClick}
        style={{
          color: ThemeColors.defaultDark,
          borderColor: ThemeColors.grayBorder,
          backgroundColor: ThemeColors.white,
          marginRight: toRem(16),
          fontWeight: 400,
        }}
        endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        variant={"outlinedDropdown"}
      >
        {formikContext.values.startDate && formikContext.values.endDate ? (
          <Typography>
            {formatDate(formikContext.values.startDate, "DD MMM YY") +
              " - " +
              formatDate(formikContext.values.endDate, "DD MMM YY")}
          </Typography>
        ) : (
          <IntlMessages id="audit.filter.audit.date" />
        )}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onPressClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <DateRange
          dateFormat="yyyy"
          ranges={value}
          onChange={(item) => onChangeTime(item)}
          showDateDisplay={false}
          months={1}
          direction="horizontal"
        />

        {/* <div className={clsx(styles.popoverBody, "mt-1")}>
          <Grid
            container
            direction={"row"}
            alignItems={"center"}
            justify={"center"}
            spacing={1}
          >
            <Grid item>
              <Button
                variant="contained"
                className={clsx(styles.FilterButton)}
                onClick={onPressReset}
              >
                <IntlMessages id="audit.filter.reset" />
              </Button>
            </Grid>
          </Grid>
        </div> */}
      </Popover>
    </>
  );
}

function AuditStaff(props) {
  const { data, onChange } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = (e) => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const [selected, setSelected] = React.useState([]);
  const classes = useStyles();
  const checkBoxClass = checkBoxStyle();
  const formikContext = useFormikContext();

  React.useEffect(() => {
    if (formikContext.values.listStaff) {
      let newList = data?.map((item) => {
        let index = formikContext.values.listStaff?.findIndex(
          (i) => i.id === item.id
        );
        if (index >= 0) {
          return formikContext.values.listStaff[index];
        }
        return item;
      });
      setSelected(newList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formikContext]);
  React.useEffect(() => {
    let newList = data?.map((item) => {
      let obj = {
        ...item,
        checkBox: false,
      };
      return obj;
    });
    onChange(newList);
    setSelected(newList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleChange = (user) => {
    let listUpdate = selected?.map((item) => {
      if (item.id === user.id) {
        const emitValue = {
          ...item,
          checkBox: !user.checkBox,
        };
        return emitValue;
      }
      return item;
    });
    onChange(listUpdate);
    setSelected(listUpdate);
  };

  const onPressSelectAll = () => {
    let isSelectAllStaff = selected?.filter((item) => !item.checkBox)?.length
      ? false
      : true;

    let arr = selected?.map((user) => {
      const emitValue = {
        ...user,
        checkBox: !isSelectAllStaff ? true : false,
      };
      return emitValue;
    });
    onChange(arr);
    setSelected(arr);
  };

  let isSelectAllStaff = selected?.filter((item) => !item.checkBox)?.length
    ? false
    : true;

  return (
    <>
      <Button
        onClick={handleClick}
        style={{
          color: ThemeColors.defaultDark,
          borderColor: ThemeColors.grayBorder,
          backgroundColor: ThemeColors.white,
          marginRight: toRem(16),
          fontWeight: 400,
        }}
        endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        variant={"outlinedDropdown"}
      >
        <IntlMessages id="audit.filter.staff" />
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className={"m-3"}>
          <Grid
            container
            direction={"row"}
            alignItems={"center"}
            justify={"center"}
            spacing={1}
          >
            <Grid item xs={12}>
              <Button
                style={{ width: "100%" }}
                variant={"outlined"}
                className={clsx(styles.FilterButtonContained)}
                onClick={onPressSelectAll}
              >
                {isSelectAllStaff ? (
                  <IntlMessages id="audit.filter.un.select.all" />
                ) : (
                  <IntlMessages id="audit.filter.select.all" />
                )}
              </Button>
            </Grid>
          </Grid>
        </div>
        <FormControl className={styles.formStyleStaff}>
          <FormGroup>
            {selected?.map((user, index) => {
              if (!user) {
                // eslint-disable-next-line
                return;
              }
              return (
                <FormControlLabel
                  key={index}
                  labelPlacement={"start"}
                  // classes={classes}
                  classes={{
                    labelPlacementStart: user.checkBox
                      ? classes.labelPlacementStartStaffActive
                      : classes.labelPlacementStartStaff,
                  }}
                  control={
                    <div>
                      <Checkbox
                        style={{
                          visibility: "hidden",
                        }}
                        key={index}
                        classes={{
                          root: checkBoxClass.root,
                          checked: checkBoxClass.checked,
                        }}
                        checked={user.checkBox ? user.checkBox : false}
                        onChange={() => handleChange(user)}
                      />

                      <span
                        style={{
                          paddingRight: toRem(16),
                        }}
                      >
                        {user.checkBox ? <CheckIcon /> : ""}
                      </span>
                    </div>
                  }
                  label={
                    <div key={user.id} value={user.id}>
                      <div
                        className="d-inline-flex align-items-center"
                        style={{
                          paddingLeft: toRem(16),
                        }}
                      >
                        <UserAvatar
                          user={user}
                          size={26}
                          classes={{
                            root: styles.AssigneeEditorInputUser,
                          }}
                        />
                        <div className={styles.textOverflow}>
                          <Typography>{getFullName(user)}</Typography>
                        </div>
                      </div>
                    </div>
                  }
                />
              );
            })}
          </FormGroup>
        </FormControl>
      </Popover>
    </>
  );
}
function AuditActionType(props) {
  const { onChange } = props;
  const intl = useIntl();
  const classes = useStyles();
  const checkBoxClass = checkBoxStyle();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = async (e) => {
    setAnchorEl(null);
    setTimeout(() => {
      onChangeSearch("");
    }, 500);
  };
  const open = Boolean(anchorEl);
  const [selected, setSelected] = React.useState([]);
  const formikContext = useFormikContext();
  const { customerMe } = useSelector((state) => state.settings, shallowEqual);
  const [searchText, setSearchText] = useState();

  const filterActionListObject = map(filterActionList, function square(value) {
    return {
      key: value,
      label: intl.formatMessage({
        id: getFilterActionTypeText(value),
      }),
    };
  });
  const [dataActionListSelect, setDataActionListSelect] = useState(
    map(filterActionListObject, "key")
  );
  const searchActionTypeByGroup = (text) => {
    let dataFilter = reduceRight(
      map(
        filterGroupActionList.filter(
          (item) =>
            intl
              .formatMessage({
                id: item.labelGroup,
              })
              ?.toUpperCase()
              .indexOf(text?.toUpperCase()) > -1
        ),
        "data"
      ),
      function (flattened, other) {
        return [...other, ...flattened];
      },
      []
    );

    return dataFilter;
  };
  const searchActionType = (text) => {
    let data = map(
      filterActionListObject.filter(
        (item) => item.label?.toUpperCase().indexOf(text?.toUpperCase()) > -1
      ),
      "key"
    );
    return data;
  };
  const onChangeSearch = (text) => {
    let searchText = text.replace(/\s+/g, " ").trim();
    setSearchText(searchText);
    let dataSearch = union(
      searchActionTypeByGroup(searchText),
      searchActionType(searchText)
    );
    setDataActionListSelect(dataSearch);
  };
  React.useEffect(() => {
    if (formikContext.values.listAction) {
      const filters = {};
      for (let value of formikContext.values.listAction) {
        if (!filters[value]) {
          filters[value] = true;
        }
      }
      setSelected(filters);
    }
  }, [formikContext]);

  const filterDisabledModule = (data) => {
    if (!canAccessKYT(customerMe)) {
      return remove(data, function (item) {
        return !item.startsWith("KYT_"); //remove if color is green
      });
    }

    return data;
  };

  const actionTypeList = React.useMemo(() => {
    const filters = {};
    for (let value of filterActionList) {
      if (!filters[value]) {
        filters[value] = true;
      }
    }

    return filterDisabledModule(Object.keys(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event) => {
    const emitValue = {
      ...selected,
      [event.target.name]: event.target.checked,
    };
    onChange(emitValue);
  };

  const onPressSelectAll = () => {
    let isSelectAll =
      Object.keys(selected)?.length === actionTypeList?.length ? true : false;
    let filters = {};
    for (let value of actionTypeList) {
      if (!filters[value]) {
        filters[value] = true;
      }
    }
    if (isSelectAll) {
      onChange([]);
      return;
    }
    onChange(filters);
  };

  let isSelectAll =
    Object.keys(selected)?.length === actionTypeList?.length ? true : false;
  let countTotalGroups = {
    LOGIN_LOGOUT: 0,
    ACURIS_KYC_ACTIVITIES: 0,
    DOW_JONES_KYC_ACTIVITIES: 0,
    KYB_ACTIVITIES: 0,
    KYT_ACTIVITIES: 0,
    CASE_ACTIVITIES: 0,
    STAFF_ACTIVITIES: 0,
    WHITELIST: 0,
    LIVENESS_ACTIVITIES: 0,
  };
  const renderLabel = (type) => {
    countTotalGroups[type] = countTotalGroups[type] + 1;
    return (
      countTotalGroups[type] === 1 && (
        <Typography className={styles.textLabel}>
          <IntlMessages id={getFilterGroupsActionText(type)} />
        </Typography>
      )
    );
  };
  return (
    <>
      <Button
        onClick={handleClick}
        style={{
          color: ThemeColors.defaultDark,
          borderColor: ThemeColors.grayBorder,
          backgroundColor: ThemeColors.white,
          fontWeight: 400,
        }}
        endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        variant={"outlinedDropdown"}
      >
        <IntlMessages id="audit.filter.action.type" />
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <div className={"m-3"}>
          <Grid
            container
            direction={"row"}
            alignItems={"center"}
            justify={"center"}
            spacing={1}
          >
            <Grid item xs={12}>
              <SearchBox
                onChange={onChangeSearch}
                value={searchText}
                placeholder={intl.formatMessage({
                  id: "audit.searchActionType",
                })}
                styleName={styles.FilterBorder}
                iconRight={false}
                disableDebounce
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                style={{ width: "100%" }}
                variant={"outlined"}
                className={clsx(styles.FilterButtonContained)}
                onClick={onPressSelectAll}
              >
                {isSelectAll ? (
                  <IntlMessages id="audit.filter.un.select.all" />
                ) : (
                  <IntlMessages id="audit.filter.select.all" />
                )}
              </Button>
            </Grid>
          </Grid>
        </div>
        <FormControl className={styles.formStyle} style={{ width: "100%" }}>
          <FormGroup>
            {dataActionListSelect?.map((type, index) => {
              return (
                <div key={index}>
                  <div className={styles.labelList}>
                    {renderLabel(getGroupByAction(type))}
                  </div>
                  <FormControlLabel
                    labelPlacement={"end"}
                    className={styles.labelList}
                    classes={{
                      labelPlacementStart: classes.labelPlacementStart,
                    }}
                    control={
                      <Checkbox
                        key={index}
                        classes={{
                          root: checkBoxClass.root,
                          checked: checkBoxClass.checked,
                        }}
                        name={type}
                        checked={selected[type] ? selected[type] : false}
                        onChange={handleChange}
                      />
                    }
                    label={
                      <div key={index}>
                        <div className="d-inline-flex align-items-center">
                          <div className={styles.textOverflow}>
                            <IntlMessages id={getFilterActionTypeText(type)} />
                          </div>
                        </div>
                      </div>
                    }
                  />
                </div>
              );
            })}
          </FormGroup>
        </FormControl>
      </Popover>
    </>
  );
}
const AuditFilterComponent = ({
  props,
  paginationParams,
  setPaginationParams,
  onChangeFilter,
}) => {
  const dispatch = useDispatch();
  const { audits } = useSelector((state) => state.audit);
  const { listAllStaff } = useSelector((state) => state.staff);
  const formFilter = React.useRef();
  const { page, size } = paginationParams;
  const [listChip, setListChip] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    dispatch({ type: FETCH_ALL_STAFF });
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    setLoading(false);
  }, [audits]);

  const onChangeActionType = (action) => {
    const { startDate, endDate, listStaff } = formFilter?.current?.values;

    // eslint-disable-next-line
    var result = Object.keys(action)?.filter(function (key) {
      if (action[key]) {
        return key;
      }
    });
    let actionList = result.toString();
    let staffId = listStaff?.map((a) => a.id);
    formFilter.current.setFieldValue("listAction", result);
    let listChip = result.concat(listStaff);
    let milliseconds = startDate ? startDate?.getTime() : "";
    let millisecondsEndDate = endDate
      ? moment(endDate).endOf("day").valueOf()
      : "";
    setListChip(listChip);

    let param = {
      page: page,
      size: size,
      startDate: milliseconds,
      endDate: millisecondsEndDate,
      ids: staffId.toString(),
      actions: actionList,
    };

    onChangeFilter(param);
  };

  const onChangeDate = (date) => {
    formFilter.current.setFieldValue(
      "startDate",
      date.startDate ? date.startDate : ""
    );
    formFilter.current.setFieldValue(
      "endDate",
      date.endDate ? date.endDate : ""
    );
    var milliseconds = date?.startDate ? date?.startDate?.getTime() : "";
    var millisecondsEndDate = date?.endDate
      ? moment(date?.endDate).endOf("day").valueOf()
      : "";
    let staffId = formFilter.current.values.listStaff?.map((a) => a.id);
    let listActionType = formFilter.current.values.listAction;

    let param = {
      page: page,
      size: size,
      startDate: milliseconds,
      endDate: millisecondsEndDate,
      ids: staffId.toString(),
      actions: listActionType.toString(),
    };
    onChangeFilter(param);
  };

  const onChangeStaff = (list) => {
    const { startDate, endDate, listAction } = formFilter?.current?.values;

    var names = [];
    let nameWithId = [];
    // eslint-disable-next-line
    list?.map((item) => {
      if (item && item.checkBox) {
        names.push(item);
        nameWithId.push(item.id);
      }
    });
    /**
     * Get only user id
     */
    let listActionType = formFilter.current.values.listAction;
    let nameId = nameWithId.toString();
    formFilter.current.setFieldValue("listStaff", names);

    var milliseconds = startDate ? startDate?.getTime() : "";
    var millisecondsEndDate = endDate
      ? moment(endDate).endOf("day").valueOf()
      : "";

    let listChip = names.concat(listAction);
    setListChip(listChip);
    let param = {
      page: page,
      size: size,
      startDate: milliseconds,
      endDate: millisecondsEndDate,
      ids: nameId,
      actions: listActionType.toString(),
    };
    onChangeFilter(param);
  };

  const onPressReset = () => {
    let param = {
      page: 0,
      size: size,
      startDate: "",
      endDate: "",
      ids: "",
      actions: "",
    };

    onChangeFilter(param);
    setPaginationParams({ page: 0, size: size });
    formFilter.current.resetForm();
    setListChip([]);
    dispatch({
      type: FILTER_AUDIT,
      payload: param,
    });
  };

  const handleDelete = (item) => {
    const {
      startDate,
      endDate,
      listAction,
      listStaff,
    } = formFilter?.current?.values;

    /**
     * remove action type
     */
    let index = listStaff?.findIndex((user) => user.id === item?.id);
    let indexAction = listAction?.findIndex((user) => user === item);
    if (indexAction >= 0) {
      listAction.splice(indexAction, 1);
    }
    if (index >= 0) {
      listStaff.splice(index, 1);
    }
    let listChip = listStaff?.concat(listAction);
    setListChip(listChip);
    formFilter.current.setFieldValue("listStaff", listStaff);
    formFilter.current.setFieldValue("listAction", listAction);
    let staffId = listStaff?.map((a) => a.id);
    let param = {
      page: page,
      size: size,
      startDate: startDate ? startDate?.getTime() : "",
      endDate: endDate ? moment(endDate).endOf("day").valueOf() : "",
      ids: staffId?.toString(),
      actions: listAction?.toString(),
    };
    onChangeFilter(param);
  };

  const onPressApply = () => {
    const {
      listStaff,
      listAction,
      startDate,
      endDate,
    } = formFilter.current.values;
    let staffId = listStaff?.map((a) => a.id);
    var milliseconds = startDate ? startDate.getTime() : "";
    var millisecondsEndDate = endDate
      ? moment(endDate).endOf("day").valueOf()
      : "";
    setLoading(true);
    setPaginationParams({ page: 0, size: size });
    let param = {
      page: 0,
      size: size,
      startDate: milliseconds,
      endDate: millisecondsEndDate,
      ids: staffId.toString() ? staffId.toString() : [],
      actions: listAction.toString() ? listAction.toString() : [],
    };
    dispatch({
      type: FILTER_AUDIT,
      payload: param,
    });
  };

  return (
    <Fragment>
      <Formik
        innerRef={formFilter}
        initialValues={{
          listStaff: [],
          listAction: [],
          startDate: null,
          endDate: null,
        }}
      >
        <LoadingWrapper loading={loading}>
          <Grid container direction={"row"}>
            <Grid item xs>
              <div className={styles.filter_chips}>
                {listChip?.map((item, index) => {
                  return (
                    <div className={styles.filter_chip}>
                      <span>
                        {item?.fullName ? (
                          item?.fullName
                        ) : (
                          <IntlMessages id={getFilterActionText(item)} />
                        )}
                      </span>
                      <SvgIcon
                        onClick={() => {
                          handleDelete(item);
                        }}
                        component={CloseIcon}
                      />
                    </div>
                  );
                })}
              </div>
            </Grid>
            <Grid>
              <div className={"d-flex flex-end"}>
                <div className={styles.filter}>
                  <div className={clsx(styles.filter_form, "d-flex")}>
                    <div className={styles.filter_list}>
                      {/* <div className={styles.mr8}></div>
                  <div className={styles.mr8}></div> */}
                      <div className={styles.filter_fields}>
                        <AuditDate
                          className={styles.mr8}
                          data={audits?.records}
                          onChange={onChangeDate}
                        />
                        <AuditStaff
                          className={styles.mr8}
                          data={listAllStaff}
                          onChange={onChangeStaff}
                        />
                        <AuditActionType
                          className={styles.mr8}
                          data={audits?.records}
                          onChange={onChangeActionType}
                        />
                      </div>
                    </div>
                    <div
                      className={clsx(
                        styles.filter_controls,
                        "d-flex align-items-center"
                      )}
                    >
                      <span
                        className={clsx(styles.filter_spacer, "d-block")}
                        style={{
                          height: toRem(36),
                          width: "2px",
                          // backgroundColor: ThemeColors.grayBorder,
                          margin: `0 ${toRem(8)}`,
                        }}
                      ></span>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={onPressApply}
                        className={styles.mr8}
                      >
                        <IntlMessages id="audit.filter.apply" />
                      </Button>
                      <Button
                        variant="containedWhite"
                        style={{
                          color: ThemeColors.defaultDark,
                          borderColor: ThemeColors.grayBorder,
                          backgroundColor: ThemeColors.white,
                          marginRight: toRem(16),
                          fontWeight: 600,
                        }}
                        onClick={onPressReset}
                      >
                        <IntlMessages id="audit.filter.reset" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </LoadingWrapper>
      </Formik>
    </Fragment>
  );
};

export default compose(withPagination)(AuditFilterComponent);
