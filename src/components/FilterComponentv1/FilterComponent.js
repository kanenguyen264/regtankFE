import { Chip, Divider, Grid, Typography, SvgIcon } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import SearchBox from "@protego/sdk/RegtankUI/v1/SearchBoxDebounce";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import { ReactComponent as ChipDeleteIcon } from "assets/icons/IcChipDelete.svg";
import { ReactComponent as FilterIcon } from "assets/icons/IcFilter.svg";
import { ReactComponent as MoreFiltersIcon } from "assets/images/icons/MoreFiltersIcon.svg";
import clsx from "clsx";
import {
  ACTIVE,
  ACTIVE_DISABLED,
  ACTIVE_INACTIVE,
  ASSET,
  CATEGORY,
  COUNTRY,
  DATE_TIME_FILTER,
  ENABLED,
  ENABLED_DISABLED,
  NATIONALITY,
  NEW_TRANSACTION_MONITORING,
  OWNER,
  PROPERTY_RISK_SCORE,
  PROPERTY_YEAR_OF_BIRTH,
  RISK_FILTER,
  RISK_SCORE,
  SELECTED,
  SELECTED_ICON,
  USER,
} from "constants/ActionTypes";
import { BETWEEN } from "constants/FilterOperators";
import { Formik } from "formik";
import { find } from "lodash";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import "react-date-range/dist/theme/default.css";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { compose } from "redux";
import { countryCodeToName } from "util/country";
import { formatDate, LONG_DATE, YEAR_MONTH_DATE } from "util/date";
import { getFilterActionText, getKeyFromKeywordData } from "util/filterType";
import { getFullName } from "util/string";
import styles from "./FilterComponent.module.scss";
import FilterDateTime from "./FilterDateTime";
import FilterSelectType from "./FilterSelectType";
import FilterSelectIconType from "./FilterSelectIconType";
import RiskScoreFilterComponent from "./RiskScoreFilterComponent";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ReactComponent as SearchIcon } from "assets/icons/IcoOutlineSearch.svg";

const FilterComponent = ({
  paginationParams,
  listFilter,
  onSubmitFilter,
  onFilterActive,
  resetFilter,
  hideMoreFilter,
  numberOfDisplayFilter = 6,
  moreFilterIcon = <MoreFiltersIcon />,
  className = "",
  SearchPlaceholder = "",
  classes = null,
}) => {
  const intl = useIntl();
  const { audits } = useSelector((state) => state.audit);
  const formFilter = React.useRef();
  const { search } = paginationParams;
  const [chipMap, setChipMap] = React.useState(new Map());
  const [loading, setLoading] = React.useState(false);
  const [resultOnChange] = React.useState({});
  const { listAllStaff } = useSelector((state) => state.staff);
  const [reset, setReset] = React.useState(true);
  const [resetRiskScore, setResetRiskScore] = React.useState(true); // stupid solution for now, I will enhance later
  const [moreFilters, setMoreFilters] = React.useState(false);
  const { kycCategory } = useSelector((state) => state.settings);
  const matches = useMediaQuery("(min-width:1920px)");

  React.useEffect(() => {
    if (search) {
      resetForSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  React.useEffect(() => {
    setLoading(false);
  }, [audits]);

  const onChangeActionType = async (action, property) => {
    // eslint-disable-next-line
    resultOnChange[property] = Object.keys(action)?.filter(function (key) {
      if (action[key]) {
        return key;
      }
    });
    formFilter.current.setFieldValue(`${property}`, resultOnChange[property]);
    buildChipMap(property, resultOnChange[property]);
  };

  const singleComponentOnChangeHandler = async (propertyName, filterValue) => {
    // eslint-disable-next-line
    resultOnChange[propertyName] = filterValue;
    formFilter.current.setFieldValue(`${propertyName}`, filterValue);

    buildChipMap(propertyName, filterValue);
  };
  const onChangeDateTime = (data, property) => {
    if (data?.startDate || data?.endDate) {
      let dateFormat =
        formatDate(data.startDate, LONG_DATE) +
        " - " +
        formatDate(data.endDate, LONG_DATE);
      resultOnChange[property] = [`${dateFormat}`];
      formFilter.current.setFieldValue(`${property}`, data);
      buildChipMap(property, [`${dateFormat}`]);
    } else {
      formFilter.current.setFieldValue(`${property}`, []);
      buildChipMap(property, []);
    }
  };

  const buildChipMap = (propertyName, filterValue) => {
    const filterDefinitionObj = getFilterDefinitionByProperty(propertyName);

    if (filterDefinitionObj) {
      const filterDefinitionPropName = filterDefinitionObj.property;

      if (chipMap.has(filterDefinitionPropName)) {
        let chipObjects = Object.assign(chipMap.get(filterDefinitionPropName));
        let currentChip = findByPropertyNameInList(chipObjects, propertyName);

        if (!isValidFilterValue(filterValue) && currentChip) {
          // Remove chip if value is clear
          const currentIndex = chipObjects.indexOf(currentChip);
          chipObjects.splice(currentIndex, 1);

          if (!chipObjects || chipObjects.length <= 0) {
            chipMap.delete(filterDefinitionPropName);
            // return;
          }
        } else {
          if (currentChip) {
            // remove if is exist
            const currentIndex = chipObjects.indexOf(currentChip);
            chipObjects.splice(currentIndex, 1);
          }

          if (!isValidFilterValue(filterValue)) return;

          let p = {
            property: propertyName,
            value: filterValue,
          };
          chipObjects.push(p);
        }
        if (chipObjects && chipObjects.length > 0) {
          chipMap.set(filterDefinitionPropName, chipObjects);
        }
      } else {
        if (!isValidFilterValue(filterValue)) {
          return;
        }

        let p = {
          property: propertyName,
          value: filterValue,
        };

        chipMap.set(filterDefinitionPropName, [p]);
      }

      // trick to update state of Map
      let newMap = new Map();
      chipMap.forEach(function (value, key, map) {
        newMap.set(key, value);
      });

      setChipMap(newMap);
    }
  };

  const isValidFilterValue = (filterValue) => {
    if (!filterValue) {
      return false;
    } else if (Array.isArray(filterValue)) {
      return filterValue.length > 0;
    }

    return true;
  };

  const getFilterDefinitionByProperty = (propertyName) => {
    return find(listFilter, function (o) {
      if (o.property === propertyName) {
        return true;
      } else if (o.children) {
        return findByPropertyNameInList(o.children, propertyName);
      } else {
        return o.property === propertyName;
      }
    });
  };

  const findByPropertyNameInList = (list, propertyName) => {
    return find(list, function (o2) {
      return o2.property === propertyName;
    });
  };

  const getChipLabel = (propertyName) => {
    const filterDefinitionObj = getFilterDefinitionByProperty(propertyName);

    if (filterDefinitionObj) {
      return intl.formatMessage({ id: filterDefinitionObj.label });
    }
    return "";
  };

  const getChipValue = (propertyName, filterValue) => {
    const filterDefinitionObj = getFilterDefinitionByProperty(propertyName);
    if (!filterValue || !filterDefinitionObj) return "";
    switch (filterDefinitionObj.type) {
      case DATE_TIME_FILTER: {
        return filterValue[0].value;
      }
      case SELECTED_ICON:
      case SELECTED: {
        filterValue = filterValue[0].value;
        switch (filterDefinitionObj?.dataSelect) {
          case NATIONALITY:
          case COUNTRY: {
            /**
             * If select more than 12 country
             * set text only number country
             */
            if (filterValue?.length >= 10) {
              return (
                filterValue?.length +
                " " +
                intl.formatMessage({ id: "appModule.filter.country" })
              );
            }
            return filterValue
              .map((item) => countryCodeToName(item))
              .join(", ");
          }
          case USER: {
            return filterValue
              .map((item) => getFullName(getUserById(item)))
              .join(", ");
          }
          case ASSET:
          case NEW_TRANSACTION_MONITORING:
          case OWNER:
          case CATEGORY:
          case RISK_SCORE: {
            return filterValue.map((item) => item).join(", ");
          }

          default:
            return filterValue
              .map((item) =>
                intl.formatMessage({
                  id: getFilterActionText(item, filterDefinitionObj),
                })
              )
              .join(", ");
        }
      }
      case RISK_FILTER: {
        let riskFilterLabel = "";

        filterValue
          .sort(function (o1, o2) {
            return o1.property > o2.property;
          })
          .forEach((item, index) => {
            const name = item.property;
            const value = item.value;

            if (!value) return false;

            if (index > 0) {
              riskFilterLabel += ", ";
            }
            if (name === "isSanction") {
              riskFilterLabel += "Sanction";
            } else if (name === "noScore") {
              riskFilterLabel += intl.formatMessage({
                id: "kyc.filter.riskScore.noScore",
              });
            } else if (name === "fromRisk") {
              riskFilterLabel +=
                intl.formatMessage({ id: "kyc.filter.riskScore.from" }) +
                " " +
                item.value;
            } else if (name === "toRisk") {
              riskFilterLabel +=
                intl.formatMessage({ id: "kyc.filter.riskScore.to" }) +
                " " +
                item.value;
            }
          });

        return riskFilterLabel;
      }
      default:
        return filterValue?.map((item) => item.toString()).join(", ");
    }
  };

  const onPressReset = () => {
    formFilter.current.resetForm({});
    setChipMap(new Map());
    setReset(!reset);
    setResetRiskScore(!resetRiskScore);
    resetFilter();
  };

  const resetForSearch = () => {
    formFilter.current.resetForm({});
    setChipMap(new Map());
    setReset(!reset);
    setResetRiskScore(!resetRiskScore);
  };
  const handleDelete = async (property) => {
    resultOnChange[property] = [];
    formFilter.current.setFieldValue(property, resultOnChange[property]);

    // trick to update state of Map
    chipMap.delete(property);

    let newMap = new Map();
    chipMap.forEach(function (value, key, map) {
      newMap.set(key, value);
    });

    setChipMap(newMap);

    if (property === PROPERTY_YEAR_OF_BIRTH) {
      formFilter.current.setFieldValue(property, []);
    }

    if (property === PROPERTY_RISK_SCORE) {
      setResetRiskScore(!resetRiskScore);
    }
  };

  const onPressApply = () => {
    let submitFilterData = Object.keys(formFilter.current.values)
      .filter((property) => {
        return isValidFilterValue(formFilter.current.values[property]);
      })
      .map((property) => {
        let dataFilterValue = null;
        const filterDefinitionObj = getFilterDefinitionByProperty(property);

        if (!filterDefinitionObj) {
          return null;
        }

        if (filterDefinitionObj.type === RISK_FILTER) {
          const chilProp = findByPropertyNameInList(
            filterDefinitionObj.children,
            property
          );
          return {
            property: chilProp.fieldSystemName,
            operator: chilProp.operator,
            filterValue: formFilter.current.values[chilProp.property],
            valueType: chilProp.valueType,
          };
        } else if (
          filterDefinitionObj.dataSelect === ACTIVE_DISABLED ||
          filterDefinitionObj.dataSelect === ACTIVE_INACTIVE ||
          filterDefinitionObj.dataSelect === ENABLED_DISABLED
        ) {
          dataFilterValue = formFilter.current.values[property].map((data) => {
            return data === ACTIVE || data === ENABLED ? true : false;
          });
        } else {
          dataFilterValue = formFilter.current.values[property];
        }

        if (filterDefinitionObj.dataSelect === CATEGORY) {
          dataFilterValue = formFilter.current.values[property];
          let categoryId = dataFilterValue?.map((val) => {
            return kycCategory?.find((item) => item.name === val).id;
          });
          return {
            property: filterDefinitionObj.fieldSystemName,
            operator: filterDefinitionObj.operator,
            filterValue: categoryId,
            valueType: filterDefinitionObj?.valueType,
          };
        }

        if (filterDefinitionObj.dataSelect === DATE_TIME_FILTER) {
          dataFilterValue = formFilter.current.values[property];
          return {
            property: filterDefinitionObj.fieldSystemName,
            operator: BETWEEN,
            valueType: filterDefinitionObj.valueType,
            filterValue: [
              formatDate(dataFilterValue.startDate, YEAR_MONTH_DATE),
              formatDate(dataFilterValue.endDate, YEAR_MONTH_DATE),
            ],
          };
        }

        return {
          property: filterDefinitionObj.fieldSystemName,
          operator: filterDefinitionObj.operator,
          filterValue: getKeyFromKeywordData(dataFilterValue),
          valueType: filterDefinitionObj?.valueType,
        };
      });

    onFilterActive(true);
    onSubmitFilter(submitFilterData);
  };

  const getUserById = (id) => {
    const data = find(listAllStaff, function (o) {
      return o.id === Number(id);
    });
    return data;
  };
  /**
   * new design
   */

  return (
    <Fragment>
      <Formik
        innerRef={formFilter}
        initialValues={{
          startDate: null,
          endDate: null,
        }}
      >
        <LoadingWrapper loading={loading}>
          <Grid
            container
            direction={"row"}
            className={clsx(styles.container, className)}
          >
            <Grid container>
              <Grid item xs={"auto"} className="pt-2">
                <Typography variant="textLabel">
                  <IntlMessages id="filter.by" />
                </Typography>
              </Grid>
              <Grid
                container
                spacing={matches ? 1 : 0.5}
                item
                xs
                className={clsx(styles.dropdownPadding, "RegFilterDropdown-wrap")}
              >
                {listFilter &&
                  listFilter
                    .slice(
                      0,
                      moreFilters
                        ? listFilter.length
                        : hideMoreFilter
                        ? 6
                        : numberOfDisplayFilter
                    )
                    .map((item, index) => {
                      return (
                        <Grid item key={index}>
                          <div>
                            {
                              {
                                SELECTED: (
                                  <FilterSelectType
                                    reset={reset}
                                    data={item}
                                    onChange={onChangeActionType}
                                    className={classes?.selectType}
                                  />
                                ),
                                SELECTED_ICON: (
                                  <FilterSelectIconType
                                    reset={reset}
                                    data={item}
                                    onChange={onChangeActionType}
                                    className={classes?.selectIconType}
                                  />
                                ),
                                RISK_FILTER: (
                                  <RiskScoreFilterComponent
                                    data={item}
                                    reset={resetRiskScore}
                                    onChange={singleComponentOnChangeHandler}
                                    className={classes?.riskScore}
                                  />
                                ),
                                DATE_TIME_FILTER: (
                                  <FilterDateTime
                                    data={item}
                                    reset={reset}
                                    onChange={onChangeDateTime}
                                    className={classes?.datePicker}
                                  />
                                ),
                              }[item.type]
                            }
                          </div>
                        </Grid>
                      );
                    })}
              </Grid>

              <Grid item xs={"auto"} className={clsx(styles.buttonGroup, 'RegFilterButtonGroup-wrap')}>
                {!hideMoreFilter && (
                  <div>
                    <div className={clsx("d-flex align-items-center")}>
                      <Typography variant="textLabel" className="mr-2">
                        <IntlMessages id="filter.more" />
                      </Typography>
                      <Button
                        className={clsx(
                          styles.moreFilter,
                          moreFilters && styles.MoreFilterButtonContainedActive
                        )}
                        variant={"outlinedIcon"}
                        onClick={() => setMoreFilters(!moreFilters)}
                      >
                        <div>
                          <FilterIcon />
                        </div>
                      </Button>
                      <div className="d-flex align-items-center">
                        <Divider
                          orientation="vertical"
                          flexItem
                          className="ml-3 mr-3"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <Button
                  variant={"outlinedSecondary"}
                  onClick={onPressReset}
                  className={`mr-3 ${styles.button}`}
                  size="small"
                >
                  <IntlMessages id="audit.filter.reset" />
                </Button>
                <Button
                  variant={
                    Array.from(chipMap.keys())?.length > 0
                      ? "outlined"
                      : "outlinedSecondary"
                  }
                  onClick={onPressApply}
                  size="small"
                  disabled={!(Array.from(chipMap.keys())?.length > 0)}
                  className={styles.button}
                >
                  <IntlMessages id="audit.filter.apply" />
                </Button>
                <SearchBox
                  className={clsx(styles.searchBox, "ml-3")}
                  placeholder={intl.formatMessage({
                    id: SearchPlaceholder || "search",
                  })}
                  searchIcon={<SearchIcon />}
                />
              </Grid>
            </Grid>

            {chipMap && (
              <Grid container spacing={0.5} className={clsx(styles.chipContainer, "RegFilterChip-wrap")}>
                {Array.from(chipMap.keys()).map((key, index) => {
                  return (
                    <Grid item className={styles.chipGroup}>
                      <span key={index}>
                        <Chip
                          key={index}
                          className={styles.paddingChip}
                          size={"small"}
                          deleteIcon={
                            <div className={styles.chipDelete}>
                              <ChipDeleteIcon />
                            </div>
                          }
                          label={
                            <Typography variant="small1" color="primary">
                              {getChipLabel(key)}
                              {": "}
                              {getChipValue(key, chipMap.get(key))}
                            </Typography>
                          }
                          onDelete={() => handleDelete(key)}
                        />
                      </span>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Grid>
        </LoadingWrapper>
      </Formik>
    </Fragment>
  );
};

export default compose(withPagination)(FilterComponent);

FilterComponent.propTypes = {
  hideMoreFilter: PropTypes.bool,
};

FilterComponent.defaultProps = {
  hideMoreFilter: false,
};