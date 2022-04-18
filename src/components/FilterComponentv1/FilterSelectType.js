import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomScrollbar from "@protego/sdk/RegtankUI/v1/Scrollbar";
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Popover,
  Typography,
  Checkbox,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import DropdownItem from "@protego/sdk/RegtankUI/v1/DropdownItem";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import SearchBox from "@protego/sdk/RegtankUI/v1/SearchBoxDebounce";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { FETCH_ACTION_KYC_CATEGORY } from "actions/Setting";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import UserAvatar from "components/UserAvatar";
import {
  ASSET,
  BLACKLIST,
  CATEGORY,
  COMPANY_TYPE,
  COUNTRY,
  FETCH_ALL_STAFF,
  GROUP_LIST_KYB,
  GROUP_LIST_KYC,
  GROUP_LIST_KYT,
  NATIONALITY,
  NATURE_OF_BUSINESS,
  NEW_TRANSACTION_MONITORING,
  OWNER,
  RISK_LEVEL,
  RISK_SCORE,
  STATUS,
  USER,
  GROUP_LIST_DJ_KYC,
  NATIONALITY_DJ,
} from "constants/ActionTypes";
import { RISK_LEVEL_COLOR } from "constants/RiskLevelType";
import { UNASSIGN_COLOR, WHITE } from "constants/ThemeColors";
import { ReactComponent as IcOutlineSearch } from "assets/icons/IcoOutlineSearch.svg";
import { useFormikContext } from "formik";
import { find, map } from "lodash";
import React, { useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { getCompanyList, getCompanyType } from "util/companyType";
import { countryCodeToName, getCountryLib } from "util/country";
import { filterActionList, getFilterActionText } from "util/filterType";
import { getIndustry, industryCodeToName } from "util/industry";
import { getFullName } from "util/string";
import styles from "./FilterComponent.module.scss";
const useStyles = makeStyles({
  labelPlacementStart: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
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

const SelectType = (props) => {
  const {
    onChange,
    data,
    reset,
    fullWidth = false,
    disableBorderLRT = false,
    clsLabelDefaul = false,
    label,
    noReset,
    disabledFilterSelect,
    className = "",
    titileLable = "",
  } = props;
  const dispatch = useDispatch();
  const intl = useIntl();
  const [searchText, setSearchText] = useState();
  const listAllStaff = useSelector((state) => {
    /**
     * Create default Unassigned
     */
    let objUnassigned = {
      id: 0,
      firstName: intl.formatMessage({ id: "appModule.Unassigned" }),
      lastName: "",
    };
    let arr = state?.staff?.listAllStaff;
    arr.splice(state?.staff?.listAllStaff?.length, 0, objUnassigned);
    return arr;
  });

  const { listOwner } = useSelector((state) => state.kyt);
  const { kycCategory } = useSelector((state) => state.settings);
  const watchGroupKYC = useSelector((state) => state.kyc?.watchGroup);
  const watchGroupKYB = useSelector((state) => state.kyb?.watchGroup);
  const watchGroupKYT = useSelector((state) => state.kyt?.watchGroup);
  const watchGroupDJKYC = useSelector((state) => state.downJones?.watchGroup);
  const [dataCountrySelect, setDataCountrySelect] = useState(getCountryLib());
  const [dataAllStaffSelect, setDataAllStaffSelect] = useState(listAllStaff);
  const [dataWatchGroupKYC, setDataWatchGroupKYC] = useState(watchGroupKYC);
  const [dataWatchGroupKYB, setDataWatchGroupKYB] = useState(watchGroupKYB);
  const [dataWatchGroupKYT, setDataWatchGroupKYT] = useState(watchGroupKYT);
  const [dataAllOwner, setDataAllOwner] = useState([]);
  const [dataCategory, setDataCategory] = useState([kycCategory]);
  const [dataIndustry, setDataIndustry] = useState(getIndustry());
  const [dataWatchGroupDJKYC, setDataWatchGroupDJKYC] = useState(
    watchGroupDJKYC
  );
  const [dataCountryDJSelect, setDataCountryDJSelect] = useState(
    getCountryLib("demonym", true)
  );
  React.useEffect(() => {
    dispatch({ type: FETCH_ALL_STAFF });
    dispatch(FETCH_ACTION_KYC_CATEGORY());
    // eslint-disable-next-line
  }, []);
  React.useEffect(() => {
    setDataAllStaffSelect(listAllStaff);
    setDataCategory(kycCategory);
    setDataWatchGroupKYC(watchGroupKYC);
    setDataWatchGroupKYB(watchGroupKYB);
    setDataWatchGroupKYT(watchGroupKYT);
    setDataWatchGroupDJKYC(watchGroupDJKYC);
    // eslint-disable-next-line
  }, [listAllStaff, kycCategory, watchGroupKYC, watchGroupKYB, watchGroupKYT]);
  React.useEffect(() => {
    if (listOwner?.length > 0) {
      setDataAllOwner(listOwner);
    }
    // eslint-disable-next-line
  }, [listOwner]);

  let countryByName = getCountryLib();
  let countryDJByName = getCountryLib("demonym", true);
  React.useEffect(() => {
    if (!noReset) {
      onChange([], data.property);
    }
    // eslint-disable-next-line
  }, [reset]);

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = async (e) => {
    setAnchorEl(null);
    setTimeout(() => {
      onChangeSearch("");
    }, 500);
  };
  const [selected, setSelected] = React.useState([]);
  const formikContext = useFormikContext();

  const open = Boolean(anchorEl),
    anchorOrigin = {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin = {
      vertical: "top",
      horizontal: "left",
    };

  React.useEffect(() => {
    if (formikContext.values[data.property]) {
      const filters = {};
      for (let value of formikContext.values[data.property]) {
        if (!filters[value]) {
          filters[value] = true;
        }
      }
      setSelected(filters);
    }
  }, [formikContext, data.property]);

  const actionTypeList = React.useMemo(() => {
    const filters = {};
    let dataFilter = {};
    switch (data.dataSelect) {
      case NATIONALITY:
      case COUNTRY:
        dataFilter = map(dataCountrySelect, "code");
        break;
      case NATIONALITY_DJ:
        dataFilter = map(dataCountryDJSelect, "code");
        break;
      case USER:
        dataFilter = map(dataAllStaffSelect, "id");
        break;
      case GROUP_LIST_KYC:
        dataFilter = map(dataWatchGroupKYC, "id");
        break;
      case GROUP_LIST_KYB:
        dataFilter = map(dataWatchGroupKYB, "id");
        break;
      case GROUP_LIST_KYT:
        dataFilter = map(dataWatchGroupKYT, "id");
        break;
      case OWNER:
        dataFilter = dataAllOwner;
        break;
      case BLACKLIST:
      case CATEGORY:
        dataFilter = map(dataCategory, "name");
        break;
      case NATURE_OF_BUSINESS:
        dataFilter = map(dataIndustry, "key");
        break;
      case COMPANY_TYPE:
        dataFilter = getCompanyList();
        break;
      case GROUP_LIST_DJ_KYC:
        dataFilter = map(dataWatchGroupDJKYC, "id");
        break;
      default:
        dataFilter = data?.list || filterActionList[data.dataSelect];
        break;
    }

    for (let value of dataFilter) {
      if (!filters[value]) {
        filters[value] = true;
      }
    }

    return Object.keys(filters);
  }, [
    dataCountrySelect,
    dataAllStaffSelect,
    data.dataSelect,
    dataAllOwner,
    dataCategory,
    dataIndustry,
    dataWatchGroupKYC,
    dataWatchGroupKYB,
    dataWatchGroupKYT,
  ]);

  const handleChange = (event) => {
    const emitValue = {
      ...selected,
      [event.target.name]: event.target.checked,
    };

    onChange(emitValue, data.property);
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
      onChange([], data.property);
      return;
    }
    onChange(filters, data.property);
  };

  let isSelectAll =
    Object.keys(selected)?.length === actionTypeList?.length ? true : false;

  const onChangeSearch = (text) => {
    setSearchText(text);
    let dataFilter = null;
    switch (data.dataSelect) {
      case COUNTRY:
        const countryByNameClone = [...countryByName];
        dataFilter = countryByNameClone.filter(
          (item) => item.name?.toUpperCase().indexOf(text?.toUpperCase()) > -1
        );
        setDataCountrySelect(dataFilter);
        break;
      case NATIONALITY:
        const countryByDemonymClone = [...countryByName];
        dataFilter = countryByDemonymClone.filter(
          (item) =>
            item.demonym?.toUpperCase().indexOf(text?.toUpperCase()) > -1
        );
        setDataCountrySelect(dataFilter);
        break;
      case NATIONALITY_DJ:
        const countryDJByDemonymClone = [...countryDJByName];
        dataFilter = countryDJByDemonymClone.filter(
          (item) =>
            item.demonym?.toUpperCase().indexOf(text?.toUpperCase()) > -1
        );
        setDataCountryDJSelect(dataFilter);
        break;
      case NATURE_OF_BUSINESS:
        const IndustryClone = [...getIndustry()];
        dataFilter = IndustryClone.filter(
          (item) => item.value?.toUpperCase().indexOf(text?.toUpperCase()) > -1
        );

        setDataIndustry(dataFilter);
        break;
      case USER:
        let listAllStaffClone = listAllStaff.map((item) => ({
          ...item,
          fullName: getFullName(item),
        }));
        dataFilter = listAllStaffClone.filter(
          (item) =>
            item.fullName
              .toUpperCase()
              .replace(/\s+/g, " ")
              .indexOf(text.toUpperCase().replace(/\s+/g, " ")) > -1
        );
        setDataAllStaffSelect(dataFilter);
        break;
      case OWNER: {
        dataFilter = listOwner.filter(
          (item) => item?.toUpperCase().indexOf(text?.toUpperCase()) > -1
        );
        setDataAllOwner(dataFilter);
        break;
      }
      default:
        break;
    }
  };
  const getUserById = (id) => {
    const data = find(listAllStaff, function (o) {
      return o.id === Number(id);
    });
    return data;
  };
  const getNameGroupListKycById = (id) => {
    const data = find(watchGroupKYC, function (o) {
      return o.id === Number(id);
    });
    return data?.name;
  };
  const getNameGroupListDJKycById = (id) => {
    const data = find(watchGroupDJKYC, function (o) {
      return o.id === Number(id);
    });
    return data?.name;
  };
  const getNameGroupListKybById = (id) => {
    const data = find(watchGroupKYB, function (o) {
      return o.id === Number(id);
    });
    return data?.name;
  };
  const getNameGroupListKytById = (id) => {
    const data = find(watchGroupKYT, function (o) {
      return o.id === Number(id);
    });
    return data?.name;
  };
  const getPlaceholder = () => {
    switch (data?.dataSelect) {
      case COUNTRY: {
        return intl.formatMessage({
          id: "kyt.filter.search.country.name",
        });
      }
      case OWNER: {
        return intl.formatMessage({
          id: "kyt.filter.owner",
        });
      }
      default:
        return intl.formatMessage({
          id: "appModule.search",
        });
    }
  };

  const ListWrap = (props) => {
    return (
      <div className="RegFilterListWrap">
        {data?.showScrollbar ? (
          <CustomScrollbar
            classes={{
              vCustomScrollBarThumb: "RegFilterVScrollbarThumb",
              vCustomScrollBarTrack: "RegFilterVScrollBarTrack",
            }}
            style={{
              //   height: toRem(300),
              width: toRem(272),
            }}
          >
            {props.children}
          </CustomScrollbar>
        ) : (
          props.children
        )}
      </div>
    );
  };

  return (
    <>
      <div
        className={clsx(open && styles.buttonLabelPopover)}
        onClick={handleClick}
      >
        {/* <Typography variant="Subtitle2">
          {label || (
            <span className={clsx({ [styles.clsLabelDefaul]: clsLabelDefaul })}>
              <IntlMessages id={data.label} />
            </span> */}

        {titileLable && (
          <span
            className={clsx(
              open && styles.clsTitileLableActive,
              styles.clsTitileLable
            )}
          >
            {" "}
            {titileLable}
          </span>
        )}
        <Button
          className={clsx(
            { open: open },
            open && styles.clsDisableBorderLRTActive,
            disableBorderLRT ? styles.clsDisableBorderLRT : classes.dropdown,
            classes.rounded
          )}
          variant={"outlinedDropdown"}
          endIcon={
            open ? (
              <span className={clsx(styles.clsTitileLableActive)}>
                <ExpandLessIcon />
              </span>
            ) : (
              <ExpandMoreIcon />
            )
          }
          onClick={handleClick}
          size={"small"}
          fullWidth={fullWidth}
        >
          <Typography variant="labelFieldForm">
            {label || (
              <span
                className={clsx(open && styles.clsTitileLableActive, {
                  [styles.clsLabelDefaul]: clsLabelDefaul,
                })}
              >
                <IntlMessages id={data.label} />
              </span>
            )}
          </Typography>
        </Button>
      </div>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        className={clsx(styles.popover, className)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div className={clsx(styles.panel, styles.popoverDialog)}>
          {(data.search || data.selectAll) && (
            <div className="m-3 RegFilterSelectControl">
              <Grid
                container
                direction={"row"}
                alignItems={"center"}
                justify={"center"}
                spacing={1}
              >
                <Grid item xs={12}>
                  {data.search && (
                    <Grid item xs={12} className="mb-2">
                      <SearchBox
                        onChange={onChangeSearch}
                        value={searchText}
                        placeholder={getPlaceholder()}
                        iconRight={false}
                        disableDebounce
                        className={styles.searchBox}
                        searchIcon={<IcOutlineSearch />}
                      />
                    </Grid>
                  )}
                  {data.selectAll && (
                    <Button
                      variant={"outlinedSecondary"}
                      fullWidth
                      onClick={onPressSelectAll}
                    >
                      <Typography variant="labelFieldForm">
                        {isSelectAll ? (
                          <IntlMessages id="audit.filter.un.select.all" />
                        ) : (
                          <IntlMessages id="audit.filter.select.all" />
                        )}
                      </Typography>
                    </Button>
                  )}
                </Grid>
              </Grid>
            </div>
          )}
          <ListWrap>
            {actionTypeList && actionTypeList.length > 0 ? (
              <FormControl className={styles.formStyle}>
                <FormGroup>
                  {actionTypeList?.map((type, index) => {
                    return (
                      <DropdownItem key={index}>
                        <FormControlLabel
                          labelPlacement={"end"}
                          style={{ margin: 0 }}
                          classes={{
                            labelPlacementStart: classes.labelPlacementStart,
                          }}
                          control={
                            <Checkbox
                              className={styles.checkBox}
                              key={index}
                              name={type}
                              checked={selected[type] ? selected[type] : false}
                              onChange={handleChange}
                              disabled={
                                data.maximumValues &&
                                Object.keys(selected)?.length >=
                                  data.maximumValues &&
                                !selected[type]
                                  ? true
                                  : false
                              }
                            />
                          }
                          label={
                            <div className="d-flex align-items-center">
                              <Typography variant="small1">
                                <div className={styles.textOverflow}>
                                  {(() => {
                                    switch (data.dataSelect) {
                                      case RISK_LEVEL:
                                        return (
                                          <span
                                            style={{
                                              color: RISK_LEVEL_COLOR[type],
                                            }}
                                          >
                                            <IntlMessages
                                              id={getFilterActionText(type)}
                                            />
                                          </span>
                                        );
                                      case COUNTRY:
                                        return data.hideFlag ? (
                                          <span>{countryCodeToName(type)}</span>
                                        ) : (
                                          <>
                                            <CountryFlagLanguage
                                              countryCode={type}
                                              svg
                                              demonym
                                            />
                                            {countryCodeToName(type)}
                                          </>
                                        );
                                      case NATIONALITY:
                                        return data.hideFlag ? (
                                          <span>
                                            {countryCodeToName(type, "demonym")}
                                          </span>
                                        ) : (
                                          <>
                                            <CountryFlagLanguage
                                              countryCode={type}
                                              svg
                                              demonym
                                            />
                                            {countryCodeToName(type)}
                                          </>
                                        );
                                      case NATIONALITY_DJ:
                                        return (
                                          <>
                                            <CountryFlagLanguage
                                              countryCode={type}
                                              svg
                                              demonym
                                              djwl
                                            />
                                            {countryCodeToName(
                                              type,
                                              "demonym",
                                              true
                                            )}
                                          </>
                                        );
                                      case USER:
                                        return (
                                          <div key={type.id} value={type.id}>
                                            <div className="d-inline-flex align-items-center">
                                              <UserAvatar
                                                user={
                                                  getUserById(type)?.id > 0
                                                    ? getUserById(type)
                                                    : {
                                                        firstName: "?",
                                                        lastName: "",
                                                        colorCode: UNASSIGN_COLOR,
                                                      }
                                                }
                                                size={26}
                                                classes={{
                                                  root:
                                                    styles.AssigneeEditorInputUser,
                                                }}
                                              />
                                              <div
                                                className={styles.textOverflow}
                                              >
                                                {getFullName(getUserById(type))}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      case ASSET:
                                        return (
                                          <span>
                                            <IntlMessages
                                              id={`filter.${type}`}
                                            />
                                          </span>
                                        );
                                      case OWNER:
                                      case NEW_TRANSACTION_MONITORING:
                                      case CATEGORY:
                                      case BLACKLIST:
                                      case RISK_SCORE:
                                        return <span>{type}</span>;

                                      case STATUS: {
                                        if (data?.listStatus?.length > 0) {
                                          return (
                                            <IntlMessages
                                              id={getFilterActionText(
                                                type,
                                                data?.listStatus
                                              )}
                                            />
                                          );
                                        }
                                        return (
                                          <IntlMessages
                                            id={getFilterActionText(type, data)}
                                          />
                                        );
                                      }
                                      case GROUP_LIST_DJ_KYC: {
                                        return getNameGroupListDJKycById(type);
                                      }
                                      case GROUP_LIST_KYC: {
                                        return getNameGroupListKycById(type);
                                      }
                                      case GROUP_LIST_KYB: {
                                        return getNameGroupListKybById(type);
                                      }
                                      case GROUP_LIST_KYT: {
                                        return getNameGroupListKytById(type);
                                      }
                                      case COMPANY_TYPE:
                                        return (
                                          <IntlMessages
                                            id={getCompanyType(type)}
                                          />
                                        );
                                      case NATURE_OF_BUSINESS:
                                        return industryCodeToName(type);
                                      default:
                                        return (
                                          <IntlMessages
                                            id={getFilterActionText(type, data)}
                                          />
                                        );
                                    }
                                  })()}
                                </div>
                              </Typography>
                            </div>
                          }
                        />
                      </DropdownItem>
                    );
                  })}
                </FormGroup>
              </FormControl>
            ) : (
              <div className={styles.noAvailable}>
                <IntlMessages id="report.NoAvailable" />{" "}
                {data?.name && <IntlMessages id={data?.name} />}
              </div>
            )}
          </ListWrap>
        </div>
      </Popover>
    </>
  );
};
export default SelectType;
