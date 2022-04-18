import { makeStyles } from "@material-ui/styles";
import {
  Box,
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import SelectAutoComplete from "@protego/sdk/RegtankUI/v1/SelectAutoComplete";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import { Switch } from "@protego/sdk/RegtankUI/v1/Switch";
import useOneTimeLocationState from "@protego/sdk/UI/useOneTimeLocationState";
import { typeEmail } from "@protego/sdk/utils/regularExpression";
import { KYC_ACTION_INPUT_INDIVIDUAL_BY_USER } from "actions/KYCAction";
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
import clsx from "clsx";
import CreditDeductionModelConfirm from "components/CreditDeductionModelConfirmv1";
import GenderGroup from "components/GenderGroup";
import {
  DAYS,
  getLabelMonth,
  MONTHS,
  YEARS,
} from "constants/DateDropdownSelect";
import { Field, Form, Formik } from "formik";
import { cloneDeep, isEmpty, map } from "lodash";
import omitBy from "lodash/omitBy";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "recompose";
import { getCountryLib } from "util/country";
import withUserSettings from "util/hocs/withUserSettings";
import { getContentMessage } from "util/index";
import { snackActions } from "util/snackbarUtils";
import * as Yup from "yup";
import CountryFlagLanguage from "components/CountryFlagLanguagev1";
//@ts-ignore
import styles from "./Individual.module.scss";

const useStyles = makeStyles({
  disabledCheckbox: {
    opacity: 0.6,
  },
});

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

let datasetsInitialVals = {};
datasetsInitialVals = datasets.reduce(
  (obj, item) => ({ ...obj, [item["id"]]: item.defaultValue }),
  datasetsInitialVals
);

const IndividualForm = compose(withUserSettings)(function IndividualForm({}) {
  const intl = useIntl();
  const dispatch = useDispatch();
  const error = useOneTimeLocationState("error");
  const [invalidDate, setInvalidDate] = useState(false);
  const [openConfirmModel, setOpenConfirmModel] = useState(false);
  const countryByName = getCountryLib("name");
  const countryByDemonym = getCountryLib("demonym");
  const formikKycSearchFormRef = useRef();
  const loading = useSelector((state) => state.kyc.loading);
  const [enableDatasets, setEnableDataSets] = useState(true);
  const classes = useStyles();
  const screenResolution = useMediaQuery("(max-width:1440px)");

  const generalSettings = useSelector(({ settings }) => {
    const { generalSettings } = settings;
    return generalSettings;
  });

  const validationSchema = Yup.object().shape({
    forename: Yup.string()
      .trim()
      .required(
        //@ts-ignore
        <IntlMessages id="kyc.from.firstNameIsARequiredField" />
      )
      .max(
        100,
        //@ts-ignore
        <IntlMessages
          id="appModule.form.error.fieldLessThan"
          values={{
            FIELD: <IntlMessages id="form.firstName" />,
            LENGTH_CHAR: 100,
          }}
        />
      ),
    middlename: Yup.string().max(
      100,
      //@ts-ignore
      <IntlMessages
        id="appModule.form.error.fieldLessThan"
        values={{
          FIELD: <IntlMessages id="form.middleName" />,
          LENGTH_CHAR: 100,
        }}
      />
    ),
    surname: Yup.string()
      .trim()
      .required(
        //@ts-ignore
        <IntlMessages id="kyc.from.lastNameIsARequiredField" />
      )
      .max(
        100,
        //@ts-ignore
        <IntlMessages
          id="appModule.form.error.fieldLessThan"
          values={{
            FIELD: <IntlMessages id="form.lastName" />,
            LENGTH_CHAR: 100,
          }}
        />
      ),
    governmentIdNumber: Yup.string().max(
      100,
      //@ts-ignore
      <IntlMessages
        id="appModule.form.error.fieldLessThan"
        values={{
          FIELD: <IntlMessages id="form.governmentIdNumber" />,
          LENGTH_CHAR: 100,
        }}
      />
    ),
    email: Yup.string()
      .test(
        "Validate Email",
        <IntlMessages id="kyc.from.emailMustBeAValidEmail"></IntlMessages>,
        (value) => {
          return typeEmail(value);
        }
      )
      .max(
        64,
        //@ts-ignore
        <IntlMessages
          id="appModule.form.error.fieldLessThan"
          values={{
            FIELD: <IntlMessages id="email-address" />,
            LENGTH_CHAR: 64,
          }}
        />
      ),
    phone: Yup.string()
      .matches(
        /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/,
        {
          //@ts-ignore
          message: <IntlMessages id="kyc.from.pleaseEnterAValidPhone" />,
          excludeEmptyString: true,
        }
      )
      .max(
        20,
        //@ts-ignore
        <IntlMessages
          id="appModule.form.error.fieldLessThan"
          values={{
            FIELD: <IntlMessages id="kyc.phoneNumber" />,
            LENGTH_CHAR: 20,
          }}
        />
      ),
    address1: Yup.string().max(
      150,
      //@ts-ignore
      <IntlMessages
        id="appModule.form.error.fieldLessThan"
        values={{
          FIELD: <IntlMessages id="kyc.addressLine1" />,
          LENGTH_CHAR: 150,
        }}
      />
    ),
    address2: Yup.string().max(
      150,
      //@ts-ignore
      <IntlMessages
        id="appModule.form.error.fieldLessThan"
        values={{
          FIELD: <IntlMessages id="kyc.addressLine2" />,
          LENGTH_CHAR: 150,
        }}
      />
    ),
    referenceId: Yup.string()
      .max(
        40,
        //@ts-ignore
        <IntlMessages id="appModule.from.referenceIdIsOnly40Characters" />
      )
      .matches(/^[a-zA-Z0-9.@_-]+$/g, {
        //@ts-ignore
        message: <IntlMessages id="kyc.referenceIdExcludeSpecialCharacter" />,
        excludeEmptyString: true,
      }),
    yearOfBirthTemp: Yup.number().when(
      ["dateOfBirthTemp", "monthOfBirthTemp"],
      {
        is: (val1, val2) => val1 > 0 || val2 > 0,
        then: Yup.number().min(
          1900,
          //@ts-ignore
          <IntlMessages id="kyc.from.yearOfBirthRequiredField" />
        ),
      }
    ),
    monthOfBirthTemp: Yup.number().when(["dateOfBirthTemp"], {
      is: (val1) => val1 > 0,
      then: Yup.number().min(
        1,
        //@ts-ignore
        <IntlMessages id="kyc.from.MonthOfBirthRequiredField" />
      ),
    }),
    dateOfBirth: Yup.mixed().test(
      "checkDate",
      //@ts-ignore
      <IntlMessages id="appModule.form.error.invalidDate" />,
      function (value) {
        const _date = this.parent.dateOfBirthTemp;
        const _month = this.parent.monthOfBirthTemp;
        const _year = this.parent.yearOfBirthTemp;
        if (_date > 0 && _month > 0 && _year > 0) {
          const dateInput = moment(`${_year}-${_month}-${_date}`, "yyyy-MM-DD");
          return moment().isAfter(dateInput);
        } else if (_month > 0 && _date === 0) {
          return this.createError({
            //@ts-ignore
            message: <IntlMessages id="kyc.from.dateOfBirthRequiredField" />,
          });
        } else if (_year > 0) {
          const currentYear = moment().year();
          return currentYear <= _year;
        }
        return true;
      }
    ),
  });

  const onSubmitData = async (values) => {
    if (generalSettings.kycSearchConfirmation) {
      setOpenConfirmModel(true);
    } else {
      doSubmit();
    }
  };

  const doSubmit = async () => {
    setOpenConfirmModel(false);
    let values = formikKycSearchFormRef.current.values;
    let data = cloneDeep(values);
    data.countryOfResidence =
      values.countryOfResidence !== -1 ? values.countryOfResidence.code : -1;
    data.idIssuingCountry =
      values.idIssuingCountry !== -1 ? values.idIssuingCountry.code : -1;
    data.nationality = values.nationality !== -1 ? values.nationality.code : -1;
    data.placeOfBirth =
      values.placeOfBirth !== -1 ? values.placeOfBirth.code : -1;
    data.yearOfBirth =
      Number(values.yearOfBirthTemp) === 0
        ? null
        : Number(values.yearOfBirthTemp);

    if (values.dateOfBirthTemp > 0) {
      const dateInput = moment(
        `${values.yearOfBirthTemp}-${values.monthOfBirthTemp}-${values.dateOfBirthTemp}`,
        "yyyy-MM-DD"
      );
      if (!dateInput.isValid()) {
        setInvalidDate(true);
        return;
      } else {
        data.dateOfBirth = dateInput;
        setInvalidDate(false);
      }
    }
    const submitValues = omitBy(data, (v) => {
      if (typeof v === "string") return v.length === 0;
      if (typeof v === "number") return v < 0;
      return v === null;
    });

    dispatch(KYC_ACTION_INPUT_INDIVIDUAL_BY_USER(submitValues));
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
  const enableOM = formikKycSearchFormRef.current
    ? formikKycSearchFormRef.current.values.enableOnGoingMonitoring
    : false;
  const { kycCost, kycOmCost } = generalSettings;

  return (
    <div className={styles.FormIndividual}>
      <CreditDeductionModelConfirm
        open={openConfirmModel}
        onPressSubmit={doSubmit}
        onPress={onCloseConfirmModel}
        searchType={"KYC"}
        creditsDeducted={enableOM ? kycCost + kycOmCost : kycCost}
        disableButton={loading}
      />
      <Formik
        initialValues={{
          countryOfResidence: -1,
          forename: "",
          middlename: "",
          surname: "",
          dateOfBirth: null,
          yearOfBirth: "",
          governmentIdNumber: "",
          email: "",
          phone: "",
          address1: "",
          address2: "",
          gender: null,
          referenceId: "",
          placeOfBirth: -1,
          nationality: -1,
          enableReScreening: false,
          enableOnGoingMonitoring: false,
          idIssuingCountry: -1,
          dateOfBirthTemp: 0,
          monthOfBirthTemp: 0,
          yearOfBirthTemp: 0,
          ...datasetsInitialVals,
        }}
        onSubmit={onSubmitData}
        validationSchema={validationSchema}
        enableReinitialize={true}
        innerRef={formikKycSearchFormRef}
      >
        {({ errors, values, submitForm, setFieldValue, touched }) => {
          return (
            <Form>
              <Grid container>
                <Grid item xs={12}>
                  <JRCard
                    className={styles.Individual}
                    disableShadow
                    header={
                      <Typography variant="titleForm">
                        <IntlMessages id="individual" />
                      </Typography>
                    }
                    headerLine
                  >
                    <Grid
                      container
                      spacing={screenResolution ? 1 : 2}
                      rowSpacing={screenResolution ? 2 : 0}
                      columnSpacing={screenResolution ? 0.5 : 0}
                    >
                      <Grid item xs={6} container>
                        {/* Full name */}
                        <Grid item xs={4} className="pr-4">
                          <TextField
                            fullWidth
                            formik
                            name={"forename"}
                            placeholder={intl.formatMessage({
                              id: "kyc.input.firstName",
                            })}
                            label={intl.formatMessage({
                              id: "form.firstName",
                            })}
                            required={true}
                          />
                        </Grid>

                        {/* Middle name */}
                        <Grid
                          item
                          xs={4}
                          className={!screenResolution && "pl-2 pr-2"}
                        >
                          <TextField
                            fullWidth
                            formik
                            name={"middlename"}
                            placeholder={intl.formatMessage({
                              id: "kyc.input.middleName",
                            })}
                            label={intl.formatMessage({
                              id: "form.middleName",
                            })}
                          />
                        </Grid>

                        {/* Surname */}
                        <Grid item xs={4} className="pl-4">
                          <TextField
                            fullWidth
                            formik
                            name={"surname"}
                            placeholder={intl.formatMessage({
                              id: "kyc.input.lastName",
                            })}
                            label={intl.formatMessage({
                              id: "form.lastName",
                            })}
                            required={true}
                          />
                        </Grid>
                      </Grid>

                      {/* Gender */}
                      <Grid item xs={6}>
                        <div>
                          <Typography className={styles.label}>
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

                      {/* Date of Birth, Month of Birth, Year of Birth*/}
                      <Grid item xs={6} container>
                        <Grid item xs={4} className="pr-4">
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
                          {(invalidDate || errors.dateOfBirth) && (
                            <Typography color="error" variant="small1">
                              {errors.dateOfBirth || "Invalid Date"}
                            </Typography>
                          )}
                        </Grid>
                        <Grid
                          item
                          xs={4}
                          className={!screenResolution && "pl-2 pr-2"}
                        >
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
                          {errors.monthOfBirthTemp && (
                            <Typography color="error" variant="small1">
                              {errors.monthOfBirthTemp}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={4} className="pl-4">
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
                            <Typography color="error" variant="small1">
                              {errors.yearOfBirthTemp}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>

                      {/* Place of Birth */}
                      <Grid item xs={6}>
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
                          renderOption={(props, option) => (
                            <Box component="li" {...props}>
                              <CountryFlagLanguage
                                countryCode={option.name}
                                svg
                                displayCountryName
                                disableTooltip
                                demonym
                                size={"26.67"}
                              />
                            </Box>
                          )}
                        />
                      </Grid>

                      {/* Government ID Number */}
                      <Grid item xs={6}>
                        <Field
                          component={TextField}
                          fullWidth
                          formik
                          name={"governmentIdNumber"}
                          placeholder={intl.formatMessage({
                            id: "kyc.input.governmentIdNumber",
                          })}
                          label={intl.formatMessage({
                            id: "form.governmentIdNumber",
                          })}
                        />
                      </Grid>

                      {/* ID Issuing Country */}
                      <Grid item xs={6}>
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
                          renderOption={(props, option) => (
                            <Box component="li" {...props}>
                              <CountryFlagLanguage
                                countryCode={option.name}
                                svg
                                displayCountryName
                                disableTooltip
                                demonym
                                size={"26.67"}
                              />
                            </Box>
                          )}
                          options={countryByName}
                          getOptionLabel={(option) => {
                            return option?.name ? option?.name : "";
                          }}
                          disableClearable
                          clearOnBlur
                          formik
                          value={values.idIssuingCountry}
                        />
                      </Grid>

                      {/* Nationality */}
                      <Grid item xs={6}>
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
                          renderOption={(props, option) => (
                            <Box component="li" {...props}>
                              <CountryFlagLanguage
                                countryCode={option.name}
                                svg
                                displayCountryName
                                disableTooltip
                                demonym
                                size={"26.67"}
                              />
                            </Box>
                          )}
                        ></Field>
                      </Grid>

                      {/* Country of Residence */}
                      <Grid item xs={6}>
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
                          renderOption={(props, option) => (
                            <Box component="li" {...props}>
                              <CountryFlagLanguage
                                countryCode={option.name}
                                svg
                                displayCountryName
                                disableTooltip
                                demonym
                                size={"26.67"}
                              />
                            </Box>
                          )}
                        />
                      </Grid>

                      {/* Phone Number*/}
                      <Grid item xs={6}>
                        <Field
                          component={TextField}
                          formik
                          fullWidth
                          type="tel"
                          name={"phone"}
                          placeholder={intl.formatMessage({
                            id: "kyc.input.phoneNumber",
                          })}
                          label={intl.formatMessage({
                            id: "kyc.phoneNumber",
                          })}
                        />
                      </Grid>

                      {/* Email Address */}
                      <Grid item xs={6}>
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
                      <Grid item xs={6}>
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

                      {/* addressLine2 */}
                      {/* <Grid item xs={6}>
                        <Field
                          component={TextField}
                          fullWidth
                          formik
                          name={"address2"}
                          placeholder={intl.formatMessage({
                            id: "kyc.input.here",
                          })}
                          label={intl.formatMessage({
                            id: "kyc.addressLine2",
                          })}
                        />
                      </Grid> */}

                      {/* referenceId */}
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          formik
                          name={"referenceId"}
                          inputProps={{
                            maxLength: 40,
                          }}
                          placeholder={intl.formatMessage({
                            id: "kyc.input.referenceId",
                          })}
                          label={intl.formatMessage({
                            id: "kyc.ReferenceID",
                          })}
                        />
                      </Grid>

                      {/* switchRescreening */}
                      <Grid item xs={6} container>
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
                                  <span className="ml-1">
                                    <Tooltip
                                      arrow
                                      placement="top-start"
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
                                    </Tooltip>
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
                                  <span className="ml-1">
                                    <Tooltip
                                      arrow
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
                                    </Tooltip>
                                  </span>
                                </div>
                              </Card>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>

                      {/* different keywords */}
                      <Grid item xs={6} container className={styles.Datasets}>
                        {/* Dataset */}
                        <Grid item xs={12}>
                          <div className={styles.DatasetsTitle}>
                            <Typography variant="titleForm">
                              <IntlMessages id="kyc.keywords.title" />
                            </Typography>
                            {enableDatasets && (
                              <Typography variant="small2">
                                <span
                                  onClick={() => {
                                    let flag = datasets.filter(
                                      (item) => values[item.id] === false
                                    ).length
                                      ? true
                                      : false;
                                    datasets.forEach((item) => {
                                      setFieldValue(item.id, flag);
                                    });
                                  }}
                                  className={styles.DatasetDeselectAll}
                                >
                                  <IntlMessages
                                    id={
                                      datasets.filter(
                                        (item) => values[item.id] === false
                                      ).length
                                        ? "kyc.dataset.selectall"
                                        : "kyc.dataset.deselectall"
                                    }
                                  />
                                </span>
                              </Typography>
                            )}
                          </div>
                          <div className={styles.DatasetContainer}>
                            {datasets.map((item) => {
                              return (
                                <FormControlLabel
                                  className={clsx(styles.DatasetField)}
                                  control={
                                    <Field
                                      as={Checkbox}
                                      type={"checkbox"}
                                      name={item.id}
                                      disabled={!enableDatasets}
                                      values={values[item.id]}
                                      classes={{
                                        disabled: classes.disabledCheckbox,
                                      }}
                                    />
                                  }
                                  label={
                                    <Typography className={styles.label}>
                                      {item.label}
                                    </Typography>
                                  }
                                />
                              );
                            })}
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </JRCard>
                </Grid>

                {/* Button Action */}
                <Grid
                  item
                  xs={12}
                  className="align-self-end"
                  className={styles.groupAction}
                >
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      variant={"outlined"}
                      type={"reset"}
                      disabled={loading}
                    >
                      <IntlMessages id="appModule.reset" />
                    </Button>
                    <Button
                      className="ml-3"
                      variant={"contained"}
                      color={"primary"}
                      type={"button"}
                      onClick={submitForm}
                      disabled={isEmpty(touched) ? true : false}
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
    </div>
  );
});

export default IndividualForm;
