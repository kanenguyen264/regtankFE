import React, { memo, useEffect } from "react";
import {
  Grid,
  TableRow,
  TableCell,
  Collapse,
  Tab,
  Tabs,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import styles from "../report.module.scss";
import IntlMessages from "@protego/sdk/UI/IntlMessages";

import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import { useIntl } from "react-intl";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import FilterSelectIconType from "components/FilterComponentv1/FilterSelectIconType.js";
import FilterSelectType from "components/FilterComponentv1/FilterSelectType.js";
import FilterDateTime from "components/FilterComponentv1/FilterDateTime";
import { BACKGROUND_APP_BAR, Tab_COLORS } from "constants/ThemeColors";
import { withStyles } from "@material-ui/core/styles";
import { DATE_TIME_FILTER, USER } from "constants/ActionTypes";
import { useFormikContext } from "formik";
import moment from "moment";
import clsx from "clsx";
import { numberOnlyInput } from "util/index";
import { CHECKBOX, CHECKBOX_DISABLE_REPORT } from "constants/ThemeColors";
const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  disableInput: {
    "& .MuiInputBase-input.Mui-disabled": {
      backgroundColor: "#F5F5F5",
    },
  },
});
const AntTabs = withStyles((theme) => ({
  root: {
    borderBottom: "1px solid #e8e8e8",
  },
  indicator: {
    backgroundColor: BACKGROUND_APP_BAR,
  },
}))(Tabs);
const AntTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    fontSize: theme.typography.pxToRem(16),
    minWidth: theme.typography.pxToRem(60),
    paddingLeft: theme.typography.pxToRem(12),
    paddingRight: theme.typography.pxToRem(12),
    color: Tab_COLORS.color,
    "&:hover": {
      color: Tab_COLORS.hover,
      opacity: 1,
    },
    "&$selected": {
      color: Tab_COLORS.hover,
      fontWeight: 400,
    },
    "&:focus": {
      color: Tab_COLORS.hover,
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);
const checkBoxStyle = makeStyles({
  checked: { color: `${CHECKBOX}  !important` },
  checkedDisabled: {
    color: `${CHECKBOX_DISABLE_REPORT}  !important`,
    backgroundColor: "red",
  },
});

const RowTable = ({ typeReset, row, openColl, onChangeCollapse }) => {
  const checkBoxClass = checkBoxStyle();
  const { formatMessage } = useIntl();
  const formFilter = useFormikContext();
  const [resultOnChange] = React.useState({});
  const classes = useRowStyles();
  const [value, setValue] = React.useState(0);

  const onChangeActionType = (action, property) => {
    if (action && property) {
      //eslint-disable-next-line
      resultOnChange[property] = Object.keys(action)?.filter(function (key) {
        if (action[key]) {
          return key;
        }
      });
      formFilter.setFieldValue(`${property}`, resultOnChange[property]);
    }
  };

  const onChangeDateTime = (data, property) => {
    if (data?.startDate || data?.endDate) {
      const dateArray = [
        moment(data?.startDate).startOf("day").valueOf(),
        moment(data?.endDate).endOf("day").valueOf(),
      ];
      formFilter.setFieldValue(`${property}`, dateArray);
    } else {
      formFilter.setFieldValue(`${property}`, []);
    }
  };

  function a11yProps(index) {
    return {
      id: `wrapped-tab-${index}`,
      "aria-controls": `wrapped-tabpanel-${index}`,
    };
  }
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) {
      formFilter.setFieldValue(`filterByMode`, "creation");
      formFilter.setFieldValue(`updatedAt`, []);
      formFilter.setFieldValue(`lastModifiedBy`, []);
    } else if (newValue === 1) {
      formFilter.setFieldValue(`filterByMode`, "modification");
      formFilter.setFieldValue(`createdAt`, []);
      formFilter.setFieldValue(`createdBy`, []);
    }
  };
  const handleChangeCheckbox = (e) => {
    formFilter.setFieldValue(e.target.name, e.target.checked);

    if (e.target.name === "isSanction") {
      clearRiskCoreSearchRangeIsSanction();
    } else {
      clearRiskCoreSearchRange();
    }
  };
  const clearRiskCoreSearchRangeIsSanction = () => {
    formFilter.setFieldValue("toRisk", "");
    formFilter.setFieldValue("fromRisk", "");
  };
  const clearRiskCoreSearchRange = () => {
    formFilter.setFieldValue("toRisk", "");
    formFilter.setFieldValue("fromRisk", "");
    formFilter.setFieldValue("riskLevel", []);
  };
  useEffect(() => {
    setValue(0);
  }, [typeReset]);
  return (
    <>
      <TableRow className={classes.root}>
        <TableCell component="th" scope="row" className={styles.tabCellPadding}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => onChangeCollapse(row)}
            className={openColl ? styles.collapseActive : styles.collapse}
          >
            {openColl ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          <div className={styles.filterTitle}>
            {formatMessage({ id: row.name })}
          </div>
        </TableCell>
      </TableRow>
      <TableRow className={classes.root}>
        <TableCell className={styles.tabCellPadding} colSpan={6}>
          <Collapse in={openColl}>
            <div className={styles.collapsePadding}>
              {
                {
                  MODE: (
                    <Grid container>
                      {row?.filterData?.map((val, index) => {
                        switch (val?.dataSelect) {
                          case USER: {
                            return (
                              <Grid container key={index}>
                                <Grid item xs={12}>
                                  {/* <span className={styles.titleInput}>
                                    <IntlMessages
                                      id={"report.table.Assignee"}
                                    />
                                  </span> */}
                                  <FilterSelectIconType
                                    fullWidth
                                    disableBorderLRT
                                    clsLabelDefaul
                                    data={val}
                                    label={
                                      formFilter.values[val?.property]?.length >
                                      0
                                        ? formFilter.values[val?.property]
                                            .length +
                                          " " +
                                          (formFilter.values[val?.property]
                                            .length > 1
                                            ? formatMessage({
                                                id: val?.labelMany,
                                              })
                                            : formatMessage({
                                                id: val?.labelOne,
                                              }))
                                        : false
                                    }
                                    onChange={onChangeActionType}
                                    titileLable={
                                      <IntlMessages
                                        id={"report.table.Assignee"}
                                      />
                                    }
                                    reset={typeReset}
                                  />
                                </Grid>
                              </Grid>
                            );
                          }
                          case DATE_TIME_FILTER: {
                            return (
                              <Grid className="mt-3" item xs={12} key={index}>
                                <AntTabs
                                  value={value}
                                  onChange={handleChangeTab}
                                >
                                  <AntTab
                                    label={
                                      <span className={styles.tabFilterByMode}>
                                        <IntlMessages
                                          id={"report.table.Creation"}
                                        />
                                      </span>
                                    }
                                    {...a11yProps(0)}
                                  />
                                  <AntTab
                                    label={
                                      <span className={styles.tabFilterByMode}>
                                        <IntlMessages
                                          id={"report.table.Modification"}
                                        />
                                      </span>
                                    }
                                    {...a11yProps(1)}
                                  />
                                </AntTabs>
                                <div className={styles.tabCustom}>
                                  {
                                    {
                                      0: (
                                        <div value={value}>
                                          {val.children[0].tabChildren?.map(
                                            (item, index) => {
                                              return (
                                                <Grid container key={index}>
                                                  <Grid item xs={12}>
                                                    {
                                                      {
                                                        DATE_TIME_FILTER: (
                                                          <div
                                                            className={
                                                              styles.pb24
                                                            }
                                                            key="created"
                                                          >
                                                            <FilterDateTime
                                                              titileLable={
                                                                <IntlMessages
                                                                  id={
                                                                    "report.table.DateCreated"
                                                                  }
                                                                />
                                                              }
                                                              noReset={true}
                                                              fullWidth
                                                              disableBorderLRT
                                                              clsLabelDefaul
                                                              data={item}
                                                              reset={false}
                                                              onChange={
                                                                onChangeDateTime
                                                              }
                                                              valueDefault={
                                                                formFilter
                                                                  .values[
                                                                  "createdAt"
                                                                ]
                                                              }
                                                            />
                                                          </div>
                                                        ),
                                                        USER: (
                                                          <>
                                                            <FilterSelectIconType
                                                              titileLable={
                                                                <IntlMessages
                                                                  id={
                                                                    "report.table.CreatedBy"
                                                                  }
                                                                />
                                                              }
                                                              fullWidth
                                                              disableBorderLRT
                                                              clsLabelDefaul
                                                              data={item}
                                                              key="created"
                                                              noReset={true}
                                                              label={
                                                                formFilter
                                                                  .values[
                                                                  item?.property
                                                                ]?.length > 0
                                                                  ? formFilter
                                                                      .values[
                                                                      item
                                                                        ?.property
                                                                    ].length +
                                                                    " " +
                                                                    (formFilter
                                                                      .values[
                                                                      item
                                                                        ?.property
                                                                    ].length > 1
                                                                      ? formatMessage(
                                                                          {
                                                                            id:
                                                                              item?.labelMany,
                                                                          }
                                                                        )
                                                                      : formatMessage(
                                                                          {
                                                                            id:
                                                                              item?.labelOne,
                                                                          }
                                                                        ))
                                                                  : false
                                                              }
                                                              onChange={
                                                                onChangeActionType
                                                              }
                                                            />
                                                          </>
                                                        ),
                                                      }[item.dataSelect]
                                                    }
                                                  </Grid>
                                                </Grid>
                                              );
                                            }
                                          )}
                                        </div>
                                      ),
                                      1: (
                                        <div value={value}>
                                          {val.children[1].tabChildren?.map(
                                            (item, index) => {
                                              return (
                                                <Grid container key={index}>
                                                  <Grid item xs={12}>
                                                    {
                                                      {
                                                        DATE_TIME_FILTER: (
                                                          <div
                                                            className={
                                                              styles.pb24
                                                            }
                                                            key="updatedAt"
                                                          >
                                                            <FilterDateTime
                                                              titileLable={
                                                                <IntlMessages
                                                                  id={
                                                                    "report.LastModifiedOn"
                                                                  }
                                                                />
                                                              }
                                                              valueDefault={
                                                                formFilter
                                                                  .values[
                                                                  "updatedAt"
                                                                ]
                                                              }
                                                              disableBorderLRT
                                                              clsLabelDefaul
                                                              noReset={true}
                                                              fullWidth
                                                              data={item}
                                                              reset={typeReset}
                                                              onChange={
                                                                onChangeDateTime
                                                              }
                                                            />
                                                          </div>
                                                        ),
                                                        USER: (
                                                          <>
                                                            <FilterSelectIconType
                                                              titileLable={
                                                                <IntlMessages
                                                                  id={
                                                                    "report.lastModifiedBy"
                                                                  }
                                                                />
                                                              }
                                                              fullWidth
                                                              disableBorderLRT
                                                              clsLabelDefaul
                                                              data={item}
                                                              noReset={true}
                                                              key="update"
                                                              label={
                                                                formFilter
                                                                  .values[
                                                                  item?.property
                                                                ]?.length > 0
                                                                  ? formFilter
                                                                      .values[
                                                                      item
                                                                        ?.property
                                                                    ].length +
                                                                    " " +
                                                                    (formFilter
                                                                      .values[
                                                                      item
                                                                        ?.property
                                                                    ].length > 1
                                                                      ? formatMessage(
                                                                          {
                                                                            id:
                                                                              item?.labelMany,
                                                                          }
                                                                        )
                                                                      : formatMessage(
                                                                          {
                                                                            id:
                                                                              item?.labelOne,
                                                                          }
                                                                        ))
                                                                  : false
                                                              }
                                                              onChange={
                                                                onChangeActionType
                                                              }
                                                            />
                                                          </>
                                                        ),
                                                      }[item.dataSelect]
                                                    }
                                                  </Grid>
                                                </Grid>
                                              );
                                            }
                                          )}
                                        </div>
                                      ),
                                    }[value]
                                  }
                                </div>
                              </Grid>
                            );
                          }
                          default:
                        }
                      })}
                    </Grid>
                  ),
                  RISK_ASSESSMENT: (
                    <div>
                      {row?.filterData?.map((val, index) => {
                        return (
                          <div
                            key={index}
                            className={("d-flex", val?.padding && styles.pt24)}
                          >
                            <Grid container justify={"center"}>
                              <Grid item xs={12}>
                                {
                                  {
                                    SELECTED: (
                                      <>
                                        {val?.type === "SELECTED_ICON" ? (
                                          <FilterSelectIconType
                                            titileLable={
                                              val.name && (
                                                <IntlMessages id={val?.name} />
                                              )
                                            }
                                            reset={typeReset}
                                            fullWidth
                                            disableBorderLRT
                                            clsLabelDefaul
                                            data={val}
                                            onChange={onChangeActionType}
                                            disabledFilterSelect={
                                              formFilter.values.noScore
                                            }
                                            label={
                                              formFilter.values[val?.property]
                                                ?.length > 0
                                                ? formFilter.values[
                                                    val?.property
                                                  ].length +
                                                  " " +
                                                  (formFilter.values[
                                                    val?.property
                                                  ].length > 1
                                                    ? formatMessage({
                                                        id: val?.labelMany,
                                                      })
                                                    : formatMessage({
                                                        id: val?.labelOne,
                                                      }))
                                                : false
                                            }
                                          />
                                        ) : (
                                          <FilterSelectType
                                            titileLable={
                                              val.name && (
                                                <IntlMessages id={val?.name} />
                                              )
                                            }
                                            reset={typeReset}
                                            fullWidth
                                            disableBorderLRT
                                            clsLabelDefaul
                                            data={val}
                                            onChange={onChangeActionType}
                                            disabledFilterSelect={
                                              formFilter.values.noScore
                                            }
                                            label={
                                              formFilter.values[val?.property]
                                                ?.length > 0
                                                ? formFilter.values[
                                                    val?.property
                                                  ].length +
                                                  " " +
                                                  (formFilter.values[
                                                    val?.property
                                                  ].length > 1
                                                    ? formatMessage({
                                                        id: val?.labelMany,
                                                      })
                                                    : formatMessage({
                                                        id: val?.labelOne,
                                                      }))
                                                : false
                                            }
                                          />
                                        )}
                                      </>
                                    ),

                                    RISK_FILTER: (
                                      <Grid container spacing={2}>
                                        {!val?.hideRiskScoreMinMax && (
                                          <>
                                            <Grid xs={6} item>
                                              <TextField
                                                label={formatMessage({
                                                  id: "report.RiskScoreMin",
                                                })}
                                                fullWidth
                                                style={{ marginBottom: 0 }}
                                                onChange={(e) => {
                                                  if (
                                                    numberOnlyInput(
                                                      e.target.value
                                                    )
                                                  ) {
                                                    formFilter.setFieldValue(
                                                      "fromRisk",
                                                      e.target.value
                                                    );
                                                  }
                                                }}
                                                name={"fromRisk"}
                                                value={
                                                  formFilter.values.fromRisk
                                                }
                                                error={
                                                  formFilter.errors.fromRisk
                                                }
                                                helperText={
                                                  formFilter.errors.fromRisk
                                                }
                                                disabled={
                                                  formFilter.values
                                                    .isSanction ||
                                                  formFilter.values.noScore
                                                }
                                                className={
                                                  formFilter.values
                                                    .isSanction ||
                                                  formFilter.values.noScore
                                                    ? clsx(
                                                        styles.placeholderInput,
                                                        classes.disableInput,
                                                        styles.clsDisableBorderLRT
                                                      )
                                                    : clsx(
                                                        styles.placeholderInput
                                                      )
                                                }
                                                placeholder={formatMessage({
                                                  id: "report.table.Min",
                                                })}
                                              />
                                            </Grid>

                                            <Grid xs={6} item>
                                              <TextField
                                                label={formatMessage({
                                                  id: "report.RiskScoreMax",
                                                })}
                                                fullWidth
                                                style={{ marginBottom: 0 }}
                                                disabled={
                                                  formFilter.values
                                                    .isSanction ||
                                                  formFilter.values.noScore
                                                }
                                                className={
                                                  formFilter.values
                                                    .isSanction ||
                                                  formFilter.values.noScore
                                                    ? clsx(
                                                        styles.placeholderInput,
                                                        classes.disableInput
                                                      )
                                                    : styles.placeholderInput
                                                }
                                                name={"toRisk"}
                                                placeholder={formatMessage({
                                                  id: "report.table.Max",
                                                })}
                                                value={formFilter.values.toRisk}
                                                error={formFilter.errors.toRisk}
                                                helperText={
                                                  formFilter.errors.toRisk
                                                }
                                                onChange={(e) => {
                                                  if (
                                                    numberOnlyInput(
                                                      e.target.value
                                                    )
                                                  ) {
                                                    formFilter.setFieldValue(
                                                      "toRisk",
                                                      e.target.value
                                                    );
                                                  }
                                                }}
                                              />
                                            </Grid>
                                          </>
                                        )}
                                        {!val?.hideRiskScore && (
                                          <>
                                            <Grid
                                              xs={6}
                                              item
                                              className={
                                                styles.padddingRightNull
                                              }
                                            >
                                              <FormControlLabel
                                                control={
                                                  <Checkbox
                                                    disabled={
                                                      formFilter.values
                                                        .fromRisk ||
                                                      formFilter.values.toRisk
                                                    }
                                                    classes={{
                                                      checked:
                                                        checkBoxClass.checked,
                                                      disabled:
                                                        checkBoxClass.checkedDisabled,
                                                    }}
                                                    checked={
                                                      formFilter?.values
                                                        ?.isSanction
                                                    }
                                                    onChange={
                                                      handleChangeCheckbox
                                                    }
                                                    name="isSanction"
                                                  />
                                                }
                                                label={
                                                  <span
                                                    className={
                                                      formFilter.values
                                                        .fromRisk ||
                                                      formFilter.values.toRisk
                                                        ? styles.disableText
                                                        : styles.checkBoxLabel
                                                    }
                                                  >
                                                    <IntlMessages
                                                      id={
                                                        "report.table.MSanctionedEntitiesOnlyax"
                                                      }
                                                    />
                                                  </span>
                                                }
                                              />
                                            </Grid>

                                            <Grid
                                              xs={6}
                                              item
                                              className={
                                                styles.padddingRightNull
                                              }
                                            >
                                              {!val?.hideRiskScoreNoScore && (
                                                <FormControlLabel
                                                  control={
                                                    <Checkbox
                                                      disabled={
                                                        (formFilter.values
                                                          .riskLevel &&
                                                          formFilter.values
                                                            .riskLevel.length >
                                                            0) ||
                                                        formFilter.values
                                                          .fromRisk ||
                                                        formFilter.values.toRisk
                                                      }
                                                      classes={{
                                                        checked:
                                                          checkBoxClass.checked,
                                                        disabled:
                                                          checkBoxClass.checkedDisabled,
                                                      }}
                                                      checked={
                                                        formFilter?.values
                                                          ?.noScore
                                                      }
                                                      onChange={
                                                        handleChangeCheckbox
                                                      }
                                                      name="noScore"
                                                    />
                                                  }
                                                  label={
                                                    <span
                                                      className={
                                                        (formFilter.values
                                                          .riskLevel &&
                                                          formFilter.values
                                                            .riskLevel.length >
                                                            0) ||
                                                        formFilter.values
                                                          .fromRisk ||
                                                        formFilter.values.toRisk
                                                          ? styles.disableText
                                                          : styles.checkBoxLabel
                                                      }
                                                    >
                                                      <IntlMessages
                                                        id={
                                                          "report.table.ScreeningWithNoScoreOnly"
                                                        }
                                                      />
                                                    </span>
                                                  }
                                                />
                                              )}
                                            </Grid>
                                          </>
                                        )}
                                      </Grid>
                                    ),
                                  }[val?.type]
                                }
                              </Grid>
                            </Grid>
                          </div>
                        );
                      })}
                    </div>
                  ),
                  GROUP_LIST: (
                    <div>
                      {row?.filterData?.map((val, index) => {
                        return (
                          <div
                            key={index}
                            className={("d-flex", val?.padding && styles.pt24)}
                          >
                            <Grid container>
                              <Grid item xs={12}>
                                {val?.type === "SELECTED_ICON" ? (
                                  <FilterSelectIconType
                                    titileLable={
                                      val.name && (
                                        <IntlMessages id={val?.name} />
                                      )
                                    }
                                    reset={typeReset}
                                    fullWidth
                                    disableBorderLRT
                                    clsLabelDefaul
                                    data={val}
                                    label={
                                      formFilter.values[val?.property]?.length >
                                      0
                                        ? formFilter.values[val?.property]
                                            .length +
                                          " " +
                                          (formFilter.values[val?.property]
                                            .length > 1
                                            ? formatMessage({
                                                id: val?.labelMany,
                                              })
                                            : formatMessage({
                                                id: val?.labelOne,
                                              }))
                                        : false
                                    }
                                    onChange={onChangeActionType}
                                  />
                                ) : (
                                  <FilterSelectType
                                    titileLable={
                                      val.name && (
                                        <IntlMessages id={val?.name} />
                                      )
                                    }
                                    reset={typeReset}
                                    fullWidth
                                    disableBorderLRT
                                    clsLabelDefaul
                                    data={val}
                                    label={
                                      formFilter.values[val?.property]?.length >
                                      0
                                        ? formFilter.values[val?.property]
                                            .length +
                                          " " +
                                          (formFilter.values[val?.property]
                                            .length > 1
                                            ? formatMessage({
                                                id: val?.labelMany,
                                              })
                                            : formatMessage({
                                                id: val?.labelOne,
                                              }))
                                        : false
                                    }
                                    onChange={onChangeActionType}
                                  />
                                )}
                              </Grid>
                            </Grid>
                          </div>
                        );
                      })}
                    </div>
                  ),
                  OTHER: (
                    <div>
                      {row?.filterData?.map((val, index) => {
                        return (
                          <div
                            key={index}
                            className={("d-flex", val?.padding && styles.pt24)}
                          >
                            <Grid container>
                              <Grid item xs={12}>
                                {val?.type === "SELECTED_ICON" ? (
                                  <FilterSelectIconType
                                    titileLable={
                                      val.name && (
                                        <span
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          <IntlMessages id={val?.name} />
                                        </span>
                                      )
                                    }
                                    reset={typeReset}
                                    fullWidth
                                    disableBorderLRT
                                    clsLabelDefaul
                                    data={val}
                                    label={
                                      formFilter.values[val?.property]?.length >
                                      0
                                        ? formFilter.values[val?.property]
                                            .length +
                                          " " +
                                          (formFilter.values[val?.property]
                                            .length > 1
                                            ? formatMessage({
                                                id: val?.labelMany,
                                              })
                                            : formatMessage({
                                                id: val?.labelOne,
                                              }))
                                        : false
                                    }
                                    onChange={onChangeActionType}
                                    djwl
                                  />
                                ) : (
                                  <FilterSelectType
                                    titileLable={
                                      val.name && (
                                        <IntlMessages id={val?.name} />
                                      )
                                    }
                                    reset={typeReset}
                                    fullWidth
                                    disableBorderLRT
                                    clsLabelDefaul
                                    data={val}
                                    label={
                                      formFilter.values[val?.property]?.length >
                                      0
                                        ? formFilter.values[val?.property]
                                            .length +
                                          " " +
                                          (formFilter.values[val?.property]
                                            .length > 1
                                            ? formatMessage({
                                                id: val?.labelMany,
                                              })
                                            : formatMessage({
                                                id: val?.labelOne,
                                              }))
                                        : false
                                    }
                                    onChange={onChangeActionType}
                                    djwl
                                  />
                                )}
                              </Grid>
                            </Grid>
                          </div>
                        );
                      })}
                    </div>
                  ),
                }[row?.TableName]
              }
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default memo(RowTable);
