import { Chip, Grid, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import LoadingWrapper from "@protego/sdk/UI/LoadingWrapper/LoadingWrapper";
import withPagination from "@protego/sdk/UI/withPagination";
import { toRem } from "@protego/sdk/utils/measurements";
import { ReactComponent as ChipDeleteIcon } from "assets/icons/IcChipDelete.svg";
import { ReactComponent as MoreFiltersIcon } from "assets/images/icons/MoreFiltersIcon.svg";
import clsx from "clsx";
import {
  ACTIVE,
  ACTIVE_DISABLED,
  ASSET,
  CATEGORY,
  COUNTRY,
  DATE_TIME_FILTER,
  NEW_TRANSACTION_MONITORING,
  OWNER,
  PROPERTY_RISK_SCORE,
  PROPERTY_YEAR_OF_BIRTH,
  RISK_FILTER,
  RISK_SCORE,
  SELECTED,
  USER,
  ACTIVE_INACTIVE,
  ENABLED_DISABLED,
  ENABLED,
  NATIONALITY_DJ,
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
import { NATIONALITY } from "../../constants/ActionTypes";
import styles from "./FilterComponent.module.scss";
import FilterDateTime from "./FilterDateTime";
import FilterSelectType from "./FilterSelectType";
import RiskScoreFilterComponent from "./RiskScoreFilterComponent";
const StyleChip = withStyles({
  root: {
    backgroundColor: "rgba(0, 128, 255, 0.08)",
    color: "#0080FF",
    maxWidth: "100%",
    fontSize: toRem(14),
  },
})(Chip);

const FilterComponent = ({
  paginationParams,
  listFilter,
  onSubmitFilter,
  onFilterActive,
  resetFilter,
  hideMoreFilter,
  numberOfDisplayFilter = 6,
  moreFilterIcon = <MoreFiltersIcon />,
  classes = [],
  djwl = false,
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
      case SELECTED: {
        filterValue = filterValue[0].value;
        switch (filterDefinitionObj?.dataSelect) {
          case COUNTRY:
          case NATIONALITY_DJ:
          case NATIONALITY: {
            /**
             * If select more than 12 country
             * set text only number country
             */
            if (filterValue?.length > 12) {
              return (
                filterValue?.length +
                " " +
                intl.formatMessage({ id: "appModule.filter.country" })
              );
            }
            return filterValue
              .map((item) => countryCodeToName(item, "demonym", true))
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
            if (o1.property === "fromRisk") {
              return -1;
            } else if (o2.property === "toRisk") {
              return 1;
            }
            return 0;
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
            className={clsx(styles.container, {
              [classes?.filterWrap]: classes.filterWrap,
            })}
          >
            <Grid item xs={12}>
              <Grid container>
                <Grid item>
                  <span>
                    <Typography className={styles.textFilterLabel}>
                      <IntlMessages id="filter" />
                    </Typography>
                  </span>
                </Grid>
                <Grid item xs={9}>
                  <Grid container spacing={0}>
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
                              <div
                                className={clsx(
                                  moreFilters && styles.mb12,
                                  styles.filterItemMargin
                                )}
                              >
                                {
                                  {
                                    SELECTED: (
                                      <FilterSelectType
                                        reset={reset}
                                        data={item}
                                        onChange={onChangeActionType}
                                        djwl={djwl}
                                      />
                                    ),
                                    RISK_FILTER: (
                                      <RiskScoreFilterComponent
                                        data={item}
                                        reset={resetRiskScore}
                                        onChange={
                                          singleComponentOnChangeHandler
                                        }
                                      />
                                    ),
                                    DATE_TIME_FILTER: (
                                      <FilterDateTime
                                        data={item}
                                        reset={reset}
                                        onChange={onChangeDateTime}
                                      />
                                    ),
                                  }[item.type]
                                }
                              </div>
                            </Grid>
                          );
                        })}
                    {!hideMoreFilter && (
                      <Grid item>
                        <Button
                          variant="outlined"
                          className={clsx(
                            moreFilters
                              ? clsx(styles.MoreFilterButtonContainedActive, {
                                  [classes?.moreFilterActive]: classes.moreFilterActive,
                                })
                              : clsx(styles.FilterButtonContained),
                            { [classes?.moreFilter]: classes.moreFilter }
                          )}
                          startIcon={moreFilterIcon}
                          onClick={() => setMoreFilters(!moreFilters)}
                        >
                          <IntlMessages id="appModule.filter.moreFilter" />
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
                <Grid item xs>
                  <div className="flex-end">
                    <div className={styles.mr10}>
                      <Button
                        variant={"contained"}
                        color="primary"
                        onClick={onPressApply}
                        className={clsx(styles.FilterButton)}
                      >
                        <IntlMessages id="audit.filter.apply" />
                      </Button>
                    </div>
                    <Button
                      variant={"outlined"}
                      className={clsx(styles.FilterButtonOutline)}
                      onClick={onPressReset}
                    >
                      <IntlMessages id="audit.filter.reset" />
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} style={{ paddingLeft: toRem(50) }}>
              {chipMap &&
                Array.from(chipMap.keys()).map((key, index) => {
                  return (
                    <span key={index}>
                      <StyleChip
                        key={index}
                        className={styles.paddingChip}
                        size={"medium"}
                        deleteIcon={
                          <div className={styles.chipDelete}>
                            <ChipDeleteIcon />
                          </div>
                        }
                        label={
                          <>
                            {getChipLabel(key)}
                            {": "}
                            {getChipValue(key, chipMap.get(key))}
                          </>
                        }
                        onDelete={() => handleDelete(key)}
                      />
                    </span>
                  );
                })}
            </Grid>
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
