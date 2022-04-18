import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import { makeStyles } from "@material-ui/core/styles";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import { toRem } from "@protego/sdk/utils/measurements";
import { FETCH_ACTION_KYC_CATEGORY } from "actions/Setting";
import clsx from "clsx";
import SearchBox from "components/SearchBoxDebounce";
import UserAvatar from "components/UserAvatar";
import {
  ASSET,
  BLACKLIST,
  CATEGORY,
  COUNTRY,
  FETCH_ALL_STAFF,
  NEW_TRANSACTION_MONITORING,
  OWNER,
  RISK_LEVEL,
  RISK_SCORE,
  USER,
  STATUS,
  GROUP_LIST_KYC,
  GROUP_LIST_KYB,
  GROUP_LIST_KYT,
  GROUP_LIST_DJ_KYC,
  NATURE_OF_BUSINESS,
  COMPANY_TYPE,
  NATIONALITY,
  NATIONALITY_DJ,
} from "constants/ActionTypes";
import { RISK_LEVEL_COLOR } from "constants/RiskLevelType";
import { useFormikContext } from "formik";
import { filter, find, map } from "lodash";
import React, { useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { countryCodeToName, getCountryLib } from "util/country";
import { filterActionList, getFilterActionText } from "util/filterType";
import { getFullName } from "util/string";
import styles from "./FilterComponent.module.scss";
import { UNASSIGN_COLOR } from "constants/ThemeColors";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import { getCompanyList, getCompanyType } from "util/companyType";
import { getIndustry, industryCodeToName } from "util/industry";
const useStyles = makeStyles({
  root: {
    paddingLeft: toRem(16),
    margin: 0,
    display: "flex",
    justifyContent: "space-between",
    "&:hover": {
      backgroundColor: "#F5F5F5",
    },
  },
});

const checkBoxStyle = makeStyles({
  root: {
    color: "#DBDDE0",
    "&$checked": {
      color: "#0080FF",
    },
    "&:hover": {
      backgroundColor: "transparent !important",
    },
  },
  checked: {},
});

const SelectType = (props) => {
  const {
    onChange,
    data,
    reset,
    fullWidth,
    label,
    noReset,
    disabledFilterSelect,
    djwl = false,
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
  const [dataCountryDJSelect, setDataCountryDJSelect] = useState(
    getCountryLib("demonym", true)
  );
  const [dataAllStaffSelect, setDataAllStaffSelect] = useState(listAllStaff);
  const [dataWatchGroupKYC, setDataWatchGroupKYC] = useState(watchGroupKYC);
  const [dataWatchGroupDJKYC, setDataWatchGroupDJKYC] = useState(
    watchGroupDJKYC
  );
  const [dataWatchGroupKYB, setDataWatchGroupKYB] = useState(watchGroupKYB);
  const [dataWatchGroupKYT, setDataWatchGroupKYT] = useState(watchGroupKYT);
  const [dataAllOwner, setDataAllOwner] = useState([]);
  const [dataCategory, setDataCategory] = useState([kycCategory]);
  const [dataIndustry, setDataIndustry] = useState(getIndustry());
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
  }, [
    listAllStaff,
    kycCategory,
    watchGroupKYC,
    watchGroupKYB,
    watchGroupKYT,
    watchGroupDJKYC,
  ]);
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
      case GROUP_LIST_DJ_KYC:
        dataFilter = map(dataWatchGroupDJKYC, "id");
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
    dataWatchGroupDJKYC,
    dataCountryDJSelect,
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
  return (
    <>
      <Button
        disable
        variant="outlined"
        fullWidth={fullWidth}
        className={clsx(
          styles.FilterButton,
          styles.FilterBorder,
          disabledFilterSelect && styles.disabledButton
        )}
        endIcon={open ? <ExpandLess /> : <ExpandMore />}
        onClick={!disabledFilterSelect && handleClick}
      >
        <span className={styles.textFilter}>
          {label || <IntlMessages id={data.label} />}
        </span>
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        classes={{
          paper: clsx({ [styles.PopoverContainerFull]: data.fullWidth }),
        }}
      >
        {(data.search || data.selectAll) && (
          <div className={"m-3"}>
            <Grid
              container
              direction={"row"}
              alignItems={"center"}
              justify={"center"}
              spacing={1}
            >
              {data.search && (
                <Grid item xs={12}>
                  <SearchBox
                    onChange={onChangeSearch}
                    value={searchText}
                    placeholder={getPlaceholder()}
                    styleName={styles.FilterBorder}
                    iconRight={false}
                    disableDebounce
                  />
                </Grid>
              )}
              {data.selectAll && (
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
              )}
            </Grid>
          </div>
        )}
        {actionTypeList && actionTypeList.length > 0 ? (
          <FormControl className={styles.formStyle} style={{ width: "100%" }}>
            <FormGroup>
              {actionTypeList?.map((type, index) => {
                return (
                  <div key={index}>
                    <FormControlLabel
                      labelPlacement={"start"}
                      classes={classes}
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
                        <div key={index}>
                          <div className="d-flex align-items-center">
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
                                    return (
                                      <>
                                        <CountryFlagLanguage
                                          countryCode={type}
                                          svg
                                          demonym
                                          djwl={djwl}
                                        />
                                        {countryCodeToName(type, "demonym", djwl)}
                                      </>
                                    );

                                  case NATIONALITY:
                                    return (
                                      <>
                                        <CountryFlagLanguage
                                          countryCode={type}
                                          svg
                                          demonym
                                          djwl={djwl}
                                        />
                                        {countryCodeToName(type, "demonym", djwl)}
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
                                          <div className={styles.textOverflow}>
                                            <Typography>
                                              {getFullName(getUserById(type))}
                                            </Typography>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  case ASSET:
                                  case OWNER:
                                  case NEW_TRANSACTION_MONITORING:
                                  case CATEGORY:
                                  case BLACKLIST:
                                  case RISK_SCORE:
                                    return (
                                      <span className={styles.textCapitalize}>
                                        {type}
                                      </span>
                                    );

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
                                  case GROUP_LIST_KYC: {
                                    return getNameGroupListKycById(type);
                                  }
                                  case GROUP_LIST_DJ_KYC: {
                                    return getNameGroupListDJKycById(type);
                                  }
                                  case GROUP_LIST_KYB: {
                                    return getNameGroupListKybById(type);
                                  }
                                  case GROUP_LIST_KYT: {
                                    return getNameGroupListKytById(type);
                                  }
                                  case COMPANY_TYPE:
                                    return (
                                      <IntlMessages id={getCompanyType(type)} />
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
                          </div>
                        </div>
                      }
                    />
                  </div>
                );
              })}{" "}
            </FormGroup>
          </FormControl>
        ) : (
          <div className={styles.noAvailable}>
            <IntlMessages id="report.NoAvailable" />{" "}
            {data?.name && <IntlMessages id={data?.name} />}
          </div>
        )}
      </Popover>
    </>
  );
};
export default SelectType;
