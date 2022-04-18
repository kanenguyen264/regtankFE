import { makeStyles } from "@mui/styles";
import {
  Box,
  Card,
  Checkbox,
  Divider,
  Grid,
  FormControlLabel,
  Typography,
  Popover,
  FormControl,
  Icon,
  InputAdornment,
} from "@mui/material";
import Switch from "@protego/sdk/RegtankUI/v1/Switch/BasicSwitch";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import TextFieldOutlined from "@protego/sdk/RegtankUI/v1/TextField/TextFieldOutlined";
import useOneTimeLocationState from "@protego/sdk/UI/useOneTimeLocationState";
import { toRem } from "@protego/sdk/utils/measurements";
import { DJ_ACTION_INPUT_INDIVIDUAL_BY_USER } from "actions/DJAction";
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
import clsx from "clsx";
import CreditDeductionModelConfirm from "components/CreditDeductionModelConfirmv1";
import { RANGE_CALENDAR } from "constants/AppSettings";
import {
  DAYS,
  getLabelMonth,
  MONTHS,
  YEARS,
} from "constants/DateDropdownSelect";
import { Field, Form, Formik } from "formik";
import { cloneDeep, keys, map, omitBy, pick } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "recompose";
import { getCountryLib } from "util/country";
import withUserSettings from "util/hocs/withUserSettings";
import { getContentMessage } from "util/index";
import { snackActions } from "util/snackbarUtils";
import { AntTab, AntTabs, TabPanel } from "../CustomFields/CustomTabs";
import CustomTooltip  from "@protego/sdk/RegtankUI/v1/Tooltip";
import { initialValues, validationSchema } from "./Formik";
import SelectAutoComplete from "@protego/sdk/RegtankUI/v1/SelectAutoComplete";
import GenderGroup from "components/GenderGroup";
import DatePicker from "react-datepicker";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import CountryFlagLanguage from "components/CountryFlagLanguagev1";
//@ts-ignore
import styles from "./Individual.module.scss";
import { ReactComponent as calendarIcon } from "assets/icons/calendarIcon.svg";
import {
  BACKGROUND_APP_BAR,
  TEXT_DARK_GRAY,
  DIVIDER,
} from "constants/ThemeColors";
const TAB_POSITION = {
  tab1: 0,
  tab2: 1,
};
const getYearsPickerRangeStart = (date) => {
  const dateYear = date.getFullYear();
  let rangeStart = dateYear;
  let count = 0;
  while (!Number.isInteger((dateYear - count) / 9)) {
    count++;
  }
  rangeStart = dateYear - count + 1;
  return [rangeStart, rangeStart + 8];
};

const datasets = [
  {
    id: "pep",
    label: <IntlMessages id="kyc.dataset.pep" />,
    defaultValue: true,
  },
  {
    id: "currentSanctions",
    label: <IntlMessages id="kyc.dataset.currentSanctions" />,
    defaultValue: true,
  },
  {
    id: "financialRegulator",
    label: <IntlMessages id="kyc.dataset.financialRegulator" />,
    defaultValue: true,
  },
  {
    id: "lawEnforcement",
    label: <IntlMessages id="kyc.dataset.lawEnforcement" />,
    defaultValue: true,
  },
  {
    id: "adverseMedia",
    label: <IntlMessages id="kyc.dataset.adverseMedia" />,
    defaultValue: true,
  },
];

const useStyles = makeStyles({
  disabledCheckbox: {
    opacity: 0.6,
  },
});

const IndividualForm = compose(withUserSettings)(function IndividualForm() {
  const intl = useIntl();
  const dispatch = useDispatch();
  const error = useOneTimeLocationState("error");
  const [openConfirmModel, setOpenConfirmModel] = useState(false);
  const countryByName = getCountryLib("name", true);
  const countryByDemonym = getCountryLib("demonym", true);
  const formRef = useRef();
  const loading = useSelector((state) => state.downJones.loading);
  const [nameTab, setNameTab] = React.useState(0);
  const [dobTab, setDobTab] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [enableDatasets, setEnableDataSets] = useState(true);
  const classes = useStyles();
  const [fromYOB, setFromYOB] = React.useState(RANGE_CALENDAR.min);
  const [toYOB, setToYOB] = React.useState(RANGE_CALENDAR.max);
  const [txtYOB, setTxtYOB] = React.useState(
    fromYOB.getFullYear() + " - " + toYOB.getFullYear()
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const generalSettings = useSelector(({ settings }) => {
    const { generalSettings } = settings;
    return generalSettings;
  });

  const onSubmitData = () => {
    if (generalSettings.djKycSearchConfirmation) {
      setOpenConfirmModel(true);
    } else {
      doSubmit();
    }
  };

  const doSubmit = async () => {
    setOpenConfirmModel(false);
    let values = formRef.current.values;
    let data = cloneDeep(values);
    data.countryOfResidence =
      values.countryOfResidence !== -1 ? values.countryOfResidence.code : -1;
    data.idIssuingCountry =
      values.idIssuingCountry !== -1 ? values.idIssuingCountry.code : -1;
    data.nationality = values.nationality !== -1 ? values.nationality.code : -1;
    data.placeOfBirth =
      values.placeOfBirth !== -1 ? values.placeOfBirth.code : -1;

    if (
      values.dateOfBirthTemp > 0 &&
      values.monthOfBirthTemp &&
      values.yearOfBirthTemp
    ) {
      data.yearOfBirth =
        Number(values.yearOfBirthTemp) === 0
          ? null
          : Number(values.yearOfBirthTemp);
      data.monthOfBirth =
        Number(values.monthOfBirthTemp) === 0
          ? null
          : Number(values.monthOfBirthTemp);
      data.dateOfBirth =
        Number(values.dateOfBirthTemp) === 0
          ? null
          : Number(values.dateOfBirthTemp);
    }
    /**
     * Disable value if change tab
     */
    data.firstName =
      nameTab === TAB_POSITION.tab2 ? values.firstName?.trim() : null;
    data.lastName =
      nameTab === TAB_POSITION.tab2 ? values.lastName.trim() : null;
    data.middleName =
      nameTab === TAB_POSITION.tab2 ? values.middleName.trim() : null;
    data.name = nameTab === TAB_POSITION.tab1 ? values.name.trim() : null;

    data.dateOfBirth =
      dobTab === TAB_POSITION.tab1
        ? values.dateOfBirthTemp > 0
          ? values.dateOfBirthTemp
          : null
        : null;
    data.monthOfBirth =
      dobTab === TAB_POSITION.tab1
        ? values.monthOfBirthTemp > 0
          ? values.monthOfBirthTemp
          : null
        : null;
    data.yearOfBirth =
      dobTab === TAB_POSITION.tab1
        ? values.yearOfBirthTemp > 0
          ? values.yearOfBirthTemp
          : null
        : null;
    data.strickDateMatch =
      dobTab === TAB_POSITION.tab1 ? values.strickDateMatch : null;
    /**
     * Check if not select range yearn, to will get the default
     */
    data.yearOfBirthFrom =
      dobTab === TAB_POSITION.tab2
        ? values.yearOfBirthFrom === TAB_POSITION.tab1 || fromYOB.getFullYear()
        : null;
    data.yearOfBirthTo =
      dobTab === TAB_POSITION.tab2
        ? values.yearOfBirthTo === TAB_POSITION.tab1 || toYOB.getFullYear()
        : null;

    const submitValues = omitBy(data, (v) => {
      if (typeof v === "string") return v.length === 0;
      if (typeof v === "number") return v < 0;
      return v === null;
    });

    var model = {
      name: "",
      countryOfResidence: -1,
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: null,
      monthOfBirth: null,
      yearOfBirth: null,
      governmentIdNumber: "",
      email: "",
      phone: "",
      address1: "",
      address2: "",
      gender: null,
      referenceId: "",
      placeOfBirth: -1,
      nationality: -1,
      idIssuingCountry: -1,
      profileNote: null,
      occupationTitles: null,
      strickDateMatch: null,
      yearOfBirthFrom: null,
      yearOfBirthTo: null,
      enableOnGoingMonitoring: false,
      enableReScreening: false,
    };
    /**
     * Remove property not use
     */
    let params = pick(submitValues, keys(model));
    dispatch(DJ_ACTION_INPUT_INDIVIDUAL_BY_USER(params)).catch((err) => {
      snackActions.error(getContentMessage(err));
    });
  };

  useEffect(() => {
    if (error) {
      snackActions.error(getContentMessage(error));
    }
    // eslint-disable-next-line
  }, [error]);

  const onCloseConfirmModel = () => {
    setOpenConfirmModel(false);
  };

  const onPressResetForm = () => {
    alert("as");
    setFromYOB(RANGE_CALENDAR.min);
    setToYOB(RANGE_CALENDAR.max);
  };

  const enableOM = formRef.current
    ? formRef.current.values.enableOnGoingMonitoring
    : false;
  const { djKycCost, djKycOmCost } = generalSettings;

  return (
    <div className={styles.FormIndividual}>
      <CreditDeductionModelConfirm
        open={openConfirmModel}
        onPressSubmit={doSubmit}
        onPress={onCloseConfirmModel}
        searchType={"DJKYC"}
        creditsDeducted={enableOM ? djKycCost + djKycOmCost : djKycCost}
        disableButton={loading}
      />
      <Grid item container xs={12}>
        <Grid item xs={12} lg={12} className="m-auto">
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmitData}
            validationSchema={validationSchema}
            enableReinitialize={true}
            innerRef={formRef}
          >
            {({ errors, values, submitForm, setFieldValue, handleChange }) => {
              return (
                <Form className="d-flex flex-column">
                  <Grid container spacing={2}>
                    {/* Name */}
                    <Grid item xs={6} className={styles.spaceFeilds}>
                      <AntTabs
                        value={nameTab}
                        onChange={(event, newVal) => {
                          setNameTab(newVal);
                          if (newVal === 1) {
                            formRef.current.setFieldValue("name", "");
                          } else {
                            formRef.current.setFieldValue("firstName", "");
                            formRef.current.setFieldValue("middlerName", "");
                            formRef.current.setFieldValue("lastName", "");
                          }
                          formRef.current.setFieldValue("nameTab", newVal);
                        }}
                        className={styles.Tabs}
                      >
                        <AntTab
                          className={styles.Tab}
                          label={<IntlMessages id={"kyc.tab.name"} to="" />}
                        />
                        <AntTab
                          className={styles.Tab}
                          label={<IntlMessages id={"kyc.tab.nameType"} to="" />}
                        />
                      </AntTabs>
                      <TabPanel value={nameTab} index={0}>
                        <Grid container>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              formik
                              name={"name"}
                              placeholder={intl.formatMessage({
                                id: "kyc.input.fullName",
                              })}
                              label={intl.formatMessage({
                                id: "kyc.fullName",
                              })}
                              required={true}
                              value={values.name}
                            />
                          </Grid>
                          <Grid item xs={12} className={styles.profileNotes}>
                            <div style={{ marginRight: toRem(120) }}>
                              <FormControlLabel
                                className={clsx(styles.DatasetField)}
                                control={
                                  <Field
                                    as={Checkbox}
                                    type={"checkbox"}
                                    name={"profileNote"}
                                  />
                                }
                                label={
                                  <Typography className={styles.label}>
                                    {<IntlMessages id="kyc.profileNotes" />}
                                  </Typography>
                                }
                              />
                              <span>
                                <CustomTooltip
                                  arrow
                                  placement="top-start"
                                  title={
                                    <div className={styles.profileGroupTooltip}>
                                      <IntlMessages
                                        id="kyc.tooltip.profileNotes"
                                        values={{ br: "" }}
                                      />
                                    </div>
                                  }
                                >
                                  <QuestionMarkIcon />
                                </CustomTooltip>
                              </span>
                            </div>
                            <div>
                              <FormControlLabel
                                className={clsx(styles.DatasetField)}
                                control={
                                  <Field
                                    as={Checkbox}
                                    type={"checkbox"}
                                    name={"occupationTitles"}
                                  />
                                }
                                label={
                                  <Typography className={styles.label}>
                                    {<IntlMessages id="kyc.occupationTitles" />}
                                  </Typography>
                                }
                              />
                              <CustomTooltip
                                arrow
                                placement="top-start"
                                title={
                                  <div className={styles.profileGroupTooltip}>
                                    <IntlMessages
                                      id="kyc.tooltip.occupationTitles"
                                      values={{ br: "" }}
                                    />
                                  </div>
                                }
                              >
                                <QuestionMarkIcon />
                              </CustomTooltip>
                            </div>
                          </Grid>
                        </Grid>
                      </TabPanel>
                      <TabPanel
                        value={nameTab}
                        index={1}
                        style={{ marginBottom: toRem(11) }}
                      >
                        <Grid container spacing={1}>
                          <Grid item xs={4}>
                            <TextField
                              fullWidth
                              formik
                              name={"firstName"}
                              placeholder={intl.formatMessage({
                                id: "kyc.input.firstName",
                              })}
                              label={intl.formatMessage({
                                id: "form.firstName",
                              })}
                              required={true}
                              value={values.firstName}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <TextField
                              fullWidth
                              formik
                              name={"middleName"}
                              placeholder={intl.formatMessage({
                                id: "kyc.input.middleName",
                              })}
                              label={intl.formatMessage({
                                id: "form.middleName",
                              })}
                              value={values.middleName}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <TextField
                              fullWidth
                              formik
                              name={"lastName"}
                              placeholder={intl.formatMessage({
                                id: "kyc.input.lastName",
                              })}
                              label={intl.formatMessage({
                                id: "form.lastName",
                              })}
                              required={true}
                              value={values.lastName}
                            />
                          </Grid>
                        </Grid>
                      </TabPanel>
                    </Grid>

                    {/* BOD */}
                    <Grid item xs={6} className={styles.spaceFeilds}>
                      <AntTabs
                        className={styles.Tabs}
                        value={dobTab}
                        onChange={(event, newVal) => {
                          setDobTab(newVal);
                          if (newVal === 1) {
                            formRef.current.setFieldValue(
                              "dateOfBirthTemp",
                              ""
                            );
                            formRef.current.setFieldValue(
                              "monthOfBirthTemp",
                              ""
                            );
                            formRef.current.setFieldValue(
                              "yearOfBirthTemp",
                              ""
                            );
                            formRef.current.setFieldValue(
                              "strickDateMatch",
                              ""
                            );
                          }
                          formRef.current.setFieldValue("dobTab", newVal);
                        }}
                      >
                        <AntTab
                          classes={styles.Tab}
                          label={<IntlMessages id={"kyc.tab.dob"} to="" />}
                        />
                        <AntTab
                          classes={styles.Tab}
                          label={<IntlMessages id={"kyc.tab.yob"} to="" />}
                        />
                      </AntTabs>
                      <TabPanel value={dobTab} index={0}>
                        <Grid container spacing={1}>
                          <Grid item xs={4}>
                            <Field
                              className={styles.widthBoxYear}
                              type="select"
                              inputProps={{ "aria-label": "Without label" }}
                              name="dateOfBirthTemp"
                              placeholder={intl.formatMessage({
                                id: "kyc.screen.choose.date",
                              })}
                              label={intl.formatMessage({
                                id: "kyc.labelDate",
                              })}
                              component={SelectAutoComplete}
                              options={DAYS}
                              getOptionLabel={(option) => {
                                if (option !== 0) {
                                  return option;
                                }
                                return "";
                              }}
                              disableClearable
                              error={true}
                              clearOnBlur
                              {...(errors.dateOfBirth && {
                                error: true,
                              })}
                              formik
                              value={values.dateOfBirthTemp}
                            />
                            {errors.dateOfBirthTemp && (
                              <p
                                className={clsx(
                                  "position-absolute",
                                  styles.formError
                                )}
                              >
                                {errors.dateOfBirthTemp || (
                                  <IntlMessages id="kyc.from.dateOfBirthRequiredField" />
                                )}
                              </p>
                            )}
                          </Grid>
                          <Grid item xs={4}>
                            <Field
                              className={styles.widthBoxYear}
                              type="select"
                              inputProps={{ "aria-label": "Without label" }}
                              name="monthOfBirthTemp"
                              placeholder={intl.formatMessage({
                                id: "kyc.screen.choose.month",
                              })}
                              label={intl.formatMessage({
                                id: "month",
                              })}
                              options={map(MONTHS, function square(n) {
                                return n.value;
                              })}
                              component={SelectAutoComplete}
                              getOptionLabel={(option) => {
                                return option
                                  ? intl.formatMessage({
                                      id: getLabelMonth(option) || " ",
                                    })
                                  : "";
                              }}
                              disableClearable
                              error={true}
                              clearOnBlur
                              {...(errors.dateOfBirth && {
                                error: true,
                              })}
                              formik
                              value={values.monthOfBirthTemp}
                            />
                            {(errors.dateOfBirth || errors.monthOfBirthTemp) &&
                              !values?.monthOfBirthTemp && (
                                <p
                                  className={clsx(
                                    "position-absolute",
                                    styles.formError
                                  )}
                                >
                                  {errors.monthOfBirthTemp || (
                                    <IntlMessages id="kyc.from.MonthOfBirthRequiredField" />
                                  )}
                                </p>
                              )}
                          </Grid>
                          <Grid item xs={4}>
                            <Field
                              className={styles.widthBoxYear}
                              type="select"
                              inputProps={{ "aria-label": "Without label" }}
                              name="yearOfBirthTemp"
                              placeholder={intl.formatMessage({
                                id: "kyc.screen.choose.year",
                              })}
                              label={intl.formatMessage({
                                id: "year",
                              })}
                              component={SelectAutoComplete}
                              options={YEARS}
                              getOptionLabel={(option) => {
                                if (option !== 0) {
                                  return option;
                                }
                                return "";
                              }}
                              disableClearable
                              error={true}
                              clearOnBlur
                              textFieldProps={{
                                ...((errors.yearOfBirthTemp ||
                                  errors.dateOfBirth) && {
                                  error: true,
                                }),
                              }}
                              formik
                              value={values.yearOfBirthTemp}
                            />
                            {errors.yearOfBirthTemp && (
                              <p
                                className={clsx(
                                  "position-absolute",
                                  styles.formError
                                )}
                              >
                                {errors.yearOfBirthTemp}
                              </p>
                            )}
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            className={styles.strickDateMatchField}
                          >
                            <FormControlLabel
                              className={clsx(styles.DatasetField)}
                              control={
                                <Field
                                  as={Checkbox}
                                  type={"checkbox"}
                                  name={"strickDateMatch"}
                                  disabled={!enableDatasets}
                                  classes={{
                                    disabled: classes.disabledCheckbox,
                                  }}
                                />
                              }
                              label={
                                <Typography className={styles.label}>
                                  {<IntlMessages id="kyc.strictDateMatch" />}
                                </Typography>
                              }
                            />
                            <CustomTooltip
                              arrow
                              placement="top-start"
                              title={
                                <div className={styles.profileGroupTooltip}>
                                  <IntlMessages
                                    id="kyc.tooltip.strictDateMatch"
                                    values={{ br: "" }}
                                  />
                                </div>
                              }
                            >
                              <QuestionMarkIcon />
                            </CustomTooltip>
                          </Grid>
                        </Grid>
                      </TabPanel>
                      <TabPanel
                        value={dobTab}
                        index={1}
                        style={{ marginBottom: toRem(11) }}
                      >
                        <Grid container>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              value={txtYOB}
                              aria-describedby={id}
                              onClick={handleClick}
                              InputLabelProps={{
                                readOnly: true,
                              }}
                              label={<IntlMessages id="kyc.tab.yob" />}
                              InputProps={{
                                endAdornment: <Icon component={calendarIcon} />,
                              }}
                            />
                            <Popover
                              id={id}
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
                              classes={{ paper: styles.YearPicker }}
                            >
                              <Grid container className={styles.YearPickerWrap}>
                                <Grid
                                  item
                                  xs={6}
                                  className={styles.yearFromWrap}
                                >
                                  <FormControl
                                    component="fieldset"
                                    className={styles.yearFromInput}
                                  >
                                    <TextFieldOutlined
                                      fullWidth
                                      name="from"
                                      label={"From"}
                                      variant="outlined"
                                      disabled
                                      value={fromYOB.getFullYear().toString()}
                                    />
                                  </FormControl>
                                  <DatePicker
                                    className={styles.yearFromDatePickerWrap}
                                    onChange={(date) => {
                                      setFromYOB(date);
                                    }}
                                    minDate={RANGE_CALENDAR.min}
                                    selected={fromYOB}
                                    showYearPicker
                                    dateFormat="yyyy"
                                    yearItemNumber={12}
                                    inline
                                    renderCustomHeader={({
                                      date,
                                      decreaseYear,
                                      increaseYear,
                                    }) => (
                                      <div
                                        style={{
                                          display: "block",
                                        }}
                                        className={styles.yearFromHeader}
                                      >
                                        <ChevronLeft onClick={decreaseYear} />
                                        <span>
                                          {getYearsPickerRangeStart(date)[0] +
                                            " - " +
                                            getYearsPickerRangeStart(date)[1]}
                                        </span>
                                        <ChevronRight onClick={increaseYear} />
                                      </div>
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={6} className={styles.yearToWrap}>
                                  <FormControl
                                    component="fieldset"
                                    className={styles.yearToInput}
                                  >
                                    <TextFieldOutlined
                                      fullWidth
                                      name="to"
                                      label={"To"}
                                      variant="outlined"
                                      disabled
                                      value={toYOB.getFullYear().toString()}
                                    />
                                  </FormControl>
                                  <DatePicker
                                    onChange={(date) => {
                                      setToYOB(date);
                                    }}
                                    maxDate={RANGE_CALENDAR.max}
                                    selected={new Date(toYOB)}
                                    showYearPicker
                                    className={styles.yearToDatePickerWrap}
                                    dateFormat="yyyy"
                                    yearItemNumber={12}
                                    inline
                                    renderCustomHeader={({
                                      date,
                                      increaseYear,
                                      decreaseYear,
                                    }) => (
                                      <div
                                        style={{
                                          display: "block",
                                        }}
                                        className={styles.yearToHeader}
                                      >
                                        <ChevronLeft onClick={decreaseYear} />
                                        <span>
                                          {getYearsPickerRangeStart(date)[0] +
                                            " - " +
                                            getYearsPickerRangeStart(date)[1]}
                                        </span>
                                        <ChevronRight onClick={increaseYear} />
                                      </div>
                                    )}
                                  />
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  className={styles.yearPickerControl}
                                >
                                  <Button
                                    className="ml-3"
                                    variant={"containedWhite"}
                                    size={"small"}
                                    type={"reset"}
                                    disabled={loading}
                                    style={{ marginRight: toRem(16) }}
                                    onClick={()=>{
                                      // setTxtYOB(
                                      //   RANGE_CALENDAR.min.getFullYear() +
                                      //     " - " +
                                      //     RANGE_CALENDAR.max.getFullYear()
                                      // );
                                      setFromYOB(RANGE_CALENDAR.min);
                                      setToYOB(RANGE_CALENDAR.max)
                                      // setFieldValue(
                                      //   "yearOfBirthFrom",
                                      //   RANGE_CALENDAR.min.getFullYear()
                                      // );
                                      // setFieldValue(
                                      //   "yearOfBirthTo",
                                      //   RANGE_CALENDAR.max.getFullYear()
                                      // );
                                    }}
                                  >
                                    <IntlMessages id="appModule.reset" />
                                  </Button>
                                  <Button
                                    variant={"contained"}
                                    color={"primary"}
                                    size={"small"}
                                    type={"button"}
                                    onClick={() => {
                                      setTxtYOB(
                                        fromYOB.getFullYear() +
                                          " - " +
                                          toYOB.getFullYear()
                                      );
                                      setFieldValue(
                                        "yearOfBirthFrom",
                                        fromYOB.getFullYear()
                                      );
                                      setFieldValue(
                                        "yearOfBirthTo",
                                        toYOB.getFullYear()
                                      );
                                      setAnchorEl(null);
                                    }}
                                    disabled={loading}
                                  >
                                    <IntlMessages id="appModule.apply" />
                                  </Button>
                                </Grid>
                              </Grid>
                            </Popover>
                          </Grid>
                        </Grid>
                      </TabPanel>
                    </Grid>

                    {/* Gender */}
                    <Grid item xs={6} className={styles.spaceFeilds}>
                      <div>
                        <Typography className={styles.gender}>
                          <IntlMessages id="gender" />
                        </Typography>
                        <GenderGroup
                          value={values?.gender}
                          handleChange={(event) => {
                            setFieldValue("gender", event.target.value);
                          }}
                        />
                      </div>
                    </Grid>

                    {/* Place of Birth */}
                    <Grid item xs={6} className={styles.spaceFeilds}>
                      <Field
                        id="place-of-birth"
                        name="placeOfBirth"
                        placeholder={intl.formatMessage({
                          id: "kyc.screen.choose.placeBirth",
                        })}
                        label={intl.formatMessage({
                          id: "kyc.placeOfBirth",
                        })}
                        component={SelectAutoComplete}
                        options={countryByName}
                        getOptionLabel={(option) =>
                          option.name ? option.name : ""
                        }
                        disableClearable
                        clearOnBlur
                        value={values.placeOfBirth}
                        renderOption={(props, option) => {
                          return (
                            <Box component="li" {...props}>
                              <CountryFlagLanguage
                                countryCode={option.code}
                                svg
                                displayCountryName
                                disableTooltip
                                demonym
                                size={"26.67"}
                                djwl={true}
                              />
                            </Box>
                          );
                        }}
                      />
                    </Grid>

                    {/* Government ID Number */}
                    <Grid item xs={6} className={styles.spaceFeilds}>
                      <TextField
                        fullWidth
                        formik
                        placeholder={intl.formatMessage({
                          id: "form.placeholder.governmentIdNumber",
                        })}
                        label={intl.formatMessage({
                          id: "form.governmentIdNumber",
                        })}
                        name={"governmentIdNumber"}
                      />
                    </Grid>

                    {/* ID Issuing Country */}
                    <Grid item xs={6} className={styles.spaceFeilds}>
                      <Field
                        type="select"
                        name="idIssuingCountry"
                        placeholder={intl.formatMessage({
                          id: "kyc.screen.choose.idIssuingCountry",
                        })}
                        label={intl.formatMessage({
                          id: "form.idIssuingCountry",
                        })}
                        component={SelectAutoComplete}
                        options={countryByName}
                        renderOption={(props, option) => {
                          return (
                            <Box component="li" {...props}>
                              <CountryFlagLanguage
                                countryCode={option.code}
                                svg
                                displayCountryName
                                disableTooltip
                                demonym
                                size={"26.67"}
                                djwl={true}
                              />
                            </Box>
                          );
                        }}
                        getOptionLabel={(option) =>
                          option.name ? option.name : ""
                        }
                        disableClearable
                        clearOnBlur
                        formik
                        value={values.idIssuingCountry}
                      />
                    </Grid>

                    {/* Nationality */}
                    <Grid item xs={6} className={styles.spaceFeilds}>
                      <Field
                        id="nationality"
                        name="nationality"
                        placeholder={intl.formatMessage({
                          id: "kyc.screen.choose.nationality",
                        })}
                        label={intl.formatMessage({
                          id: "form.nationality",
                        })}
                        component={SelectAutoComplete}
                        options={countryByDemonym}
                        getOptionLabel={(option) =>
                          option.demonym ? option.demonym : ""
                        }
                        disableClearable
                        clearOnBlur
                        formik
                        value={values.nationality}
                        renderOption={(props, option) => {
                          return (
                            <Box component="li" {...props}>
                              <CountryFlagLanguage
                                countryCode={option.code}
                                svg
                                displayCountryName
                                disableTooltip
                                demonym
                                size={"26.67"}
                                djwl={true}
                              />
                            </Box>
                          );
                        }}
                      />
                    </Grid>

                    {/* Country of Residence */}
                    <Grid item xs={6} className={styles.spaceFeilds}>
                      <Field
                        name="countryOfResidence"
                        label={intl.formatMessage({
                          id: "kyc.countryOfResidence",
                        })}
                        placeholder={intl.formatMessage({
                          id: "kyc.screen.choose.countryOfResidence",
                        })}
                        component={SelectAutoComplete}
                        options={countryByName}
                        getOptionLabel={(option) =>
                          option.name ? option.name : ""
                        }
                        disableClearable
                        clearOnBlur
                        formik
                        value={values.countryOfResidence}
                        renderOption={(props, option) => {
                          return (
                            <Box component="li" {...props}>
                              <CountryFlagLanguage
                                countryCode={option.code}
                                svg
                                displayCountryName
                                disableTooltip
                                demonym
                                size={"26.67"}
                                djwl={true}
                              />
                            </Box>
                          );
                        }}
                      />
                    </Grid>

                    {/* Phone Number*/}
                    <Grid item xs={6} className={styles.spaceFeilds}>
                      <TextField
                        formik
                        fullWidth
                        type="tel"
                        name={"phone"}
                        placeholder={intl.formatMessage({
                          id: "kyc.placeholder.phoneNumber",
                        })}
                        label={intl.formatMessage({
                          id: "kyc.phoneNumber",
                        })}
                      />
                    </Grid>

                    {/* Email Address */}
                    <Grid item xs={6} className={styles.spaceFeilds}>
                      <Field
                        component={TextField}
                        fullWidth
                        name={"email"}
                        placeholder={intl.formatMessage({
                          id: "kyc.input.email",
                        })}
                        label={intl.formatMessage({
                          id: "email-address",
                        })}
                        formik
                      />
                    </Grid>

                    {/* Address */}
                    <Grid item xs={6} className={styles.spaceFeilds}>
                      <Field
                        component={TextField}
                        formik
                        fullWidth
                        name={"address1"}
                        placeholder={intl.formatMessage({
                          id: "kyc.input.address",
                        })}
                        label={intl.formatMessage({
                          id: "kyc.labelAddress",
                        })}
                      />
                    </Grid>

                    {/* referenceId */}
                    <Grid item xs={6} className={styles.spaceFeilds}>
                      <TextField
                        fullWidth
                        formik
                        name={"referenceId"}
                        placeholder={intl.formatMessage({
                          id: "kyc.input.referenceId",
                        })}
                        label={intl.formatMessage({
                          id: "kyc.ReferenceID",
                        })}
                        inputProps={{
                          maxLength: 40,
                        }}
                      />
                    </Grid>

                    {/* Ongoing monitoring */}
                    {/* switchRescreening */}
                    <Grid item xs={6} container className={styles.spaceFeilds}>
                      <Grid item xs={5} className="pt-0">
                        <Box
                          display="flex"
                          flexWrap="wrap"
                          className={styles.containerSwitches}
                        >
                          <Box className={styles.boxSwitches}>
                            <Card
                              className={clsx(
                                styles.cardReScreening,
                                "pl-0 pr-0"
                              )}
                            >
                              <span className={clsx(styles.reScreening)}>
                                <Switch
                                  checked={values.enableReScreening}
                                  onChange={(e) =>
                                    setFieldValue(
                                      "enableReScreening",
                                      e.target.checked
                                    )
                                  }
                                  name="enableReScreening"
                                  inputProps={{
                                    "aria-label": "secondary checkbox",
                                  }}
                                />
                              </span>
                              <div>
                                <span className={styles.switchTitle}>
                                  <IntlMessages id="re-screening" />
                                </span>
                                <span className="ml-2">
                                  <CustomTooltip
                                    placement="top-start"
                                    arrow
                                    title={
                                      <div className="custom-tooltip">
                                        <h5>
                                          <IntlMessages id="re-screening" />
                                        </h5>
                                        <p>
                                          <FormattedHTMLMessage id="kyc.screen.tooltip.rescreening" />
                                        </p>
                                      </div>
                                    }
                                  >
                                    <QuestionMarkIcon />
                                  </CustomTooltip>
                                </span>
                              </div>
                            </Card>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={6} className="pt-0">
                        <Box
                          display="flex"
                          flexWrap="wrap"
                          className={styles.containerSwitches}
                        >
                          <Box className={styles.boxSwitches}>
                            <Card
                              className={clsx(
                                styles.cardReScreening,
                                "pl-0 pr-0"
                              )}
                            >
                              <span className={clsx(styles.reScreening)}>
                                <Switch
                                  checked={values.enableOnGoingMonitoring}
                                  onChange={(e) => {
                                    const val = e.target.checked;
                                    if (val === true) {
                                      setEnableDataSets(false);
                                      datasets.forEach(({ id }) => {
                                        setFieldValue(id, true);
                                      });
                                    } else {
                                      setEnableDataSets(true);
                                    }
                                    setFieldValue(
                                      "enableOnGoingMonitoring",
                                      val
                                    );
                                  }}
                                  name="enableOnGoingMonitoring"
                                  inputProps={{
                                    "aria-label": "secondary checkbox",
                                  }}
                                />
                              </span>
                              <div>
                                <span className={styles.switchTitle}>
                                  <IntlMessages id="kyc.ongoing" />
                                </span>
                                <span className="ml-2">
                                  <CustomTooltip
                                    arrow
                                    placement="top-start"
                                    title={
                                      <div className="custom-tooltip">
                                        <h5>
                                          <IntlMessages id="kyc.ongoing" />
                                        </h5>
                                        <p>
                                          <FormattedHTMLMessage id="kyc.screen.tooltip.onGoingMonitoring" />
                                        </p>
                                      </div>
                                    }
                                  >
                                    <QuestionMarkIcon />
                                  </CustomTooltip>
                                </span>
                              </div>
                            </Card>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Button Action */}
                    <Grid item xs={12} className={styles.groupAction}>
                      <Box display="flex" justifyContent="flex-end">
                        <Button
                          variant={"containedWhite"}
                          onClick={() => onPressResetForm()}
                          disabled={loading}
                        >
                          <IntlMessages id="appModule.reset" />
                        </Button>
                        <Button
                          className={`ml-3 ${
                            !!formRef.current && !!formRef.current.dirty
                              ? "btn-valid"
                              : ""
                          }`}
                          variant={"contained"}
                          color={"primary"}
                          type={"button"}
                          onClick={submitForm}
                          disabled={loading}
                        >
                          <IntlMessages id="screen" />
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Form>
              );
            }}
          </Formik>
        </Grid>
      </Grid>
    </div>
  );
});

export default IndividualForm;
