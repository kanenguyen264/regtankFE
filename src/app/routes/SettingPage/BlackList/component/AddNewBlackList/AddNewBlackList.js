import { makeStyles } from "@material-ui/core/styles";
import { ExpandMore } from "@material-ui/icons";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
} from "@mui/material";
import CloseableDialogTitle from "@protego/sdk/RegtankUI/v1/CloseableDialogTitle/CloseableDialogTitle";
import Dropdown from "@protego/sdk/RegtankUI/v1/Dropdown/Dropdown";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import CustomScrollbar from "@protego/sdk/RegtankUI/v1/Scrollbar";
import { TextFieldOutlined } from "@protego/sdk/RegtankUI/v1/TextField";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import clsx from "clsx";
import SelectAutoCompleteChip from "components/CAutoCompletev1";
// import SelectAutoComplete from "components/SelectAutoCompletev1";
import SelectAutoComplete from "@protego/sdk/RegtankUI/v1/SelectAutoComplete";
import { DAYS, MONTHS, YEARS } from "constants/DateDropdownSelect";
import { TEXT_HIGH } from "constants/ThemeColors";
import { ErrorMessage, Field, Form, Formik } from "formik";
import moment from "moment";
import React, { useState } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { getCountryLib } from "util/country";
import * as Yup from "yup";
import styles from "./style.module.scss";
import moduleStyles from "../../BlackListStyle.module.scss";
import { CAutoComplete } from "../InputForm";

const useStyles = makeStyles((theme) => ({
  dropdownButton: {
    "& .MuiButton-label": {
      justifyContent: "space-between",
    },
  },
  customInput: {
    "& .MuiInputBase-formControl": {
      marginBottom: 0,
    },
    "& .MuiDropdown-dropdownLabel": {
      marginBottom: 0,
      color: "#rgba(43, 43, 43, 0.7);",
    },
  },
  icon: {
    left: 0,
    color: "#5A5A5A",
  },
  menuPaper: {
    maxHeight: toRem(200),
  },
}));

const TextFieldLabel = function TextFieldLabel(props) {
  const { label, required, error } = props;
  const className = useStyles();
  return (
    <div className={styles.inputLabel}>
      <Field
        component={TextFieldOutlined}
        {...props}
        fullWidth
        size={"large"}
      />
    </div>
  );
};

const AddNewBlackList = (props) => {
  const { formatMessage } = useIntl();
  const {
    title,
    isOpen,
    onClose,
    categoryList,
    onSubmit,
    onPressAddCategory,
  } = props;
  const [loading, setLoading] = useState(false);
  const countryByName = getCountryLib("name");
  const countryByDemonym = getCountryLib("demonym");
  const intl = useIntl();

  const DateList = DAYS.map((item, index) => {
    return { id: index, label: item };
  });

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required(
      <IntlMessages id="setting.blacklist.name.required" />
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
    email: Yup.string()
      .email(
        //@ts-ignore
        <IntlMessages id="setting.blacklist.email.valid" />
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
    category: Yup.array()
      .min(1, <IntlMessages id="setting.blacklist.category.required" />)
      .required(<IntlMessages id="setting.blacklist.category.required" />),
    yearOfBirthTemp: Yup.object({
      id: Yup.number().when(["dateOfBirthTemp", "monthOfBirthTemp"], {
        is: (val1, val2) => val1 > 0 || val2 > 0,
        then: Yup.number().min(
          1900,
          //@ts-ignore
          <IntlMessages id="setting.blacklist.yearOfBirth.required" />
        ),
      }),
    }).nullable(),
    monthOfBirthTemp: Yup.object({
      id: Yup.number().when(["dateOfBirthTemp"], {
        is: (val1) => val1 > 0,
        then: Yup.number().min(
          1,
          //@ts-ignore
          <IntlMessages id="setting.blacklist.monthOfBirth.required" />
        ),
      }),
    }).nullable(),
    dateOfBirthTemp: Yup.mixed()
      .test(
        "checkDate",
        //@ts-ignore
        <IntlMessages id="setting.blacklist.invalidDate" />,
        function (value) {
          const _date = this.parent.dateOfBirthTemp;
          const _month = this.parent.monthOfBirthTemp;
          const _year = this.parent.yearOfBirthTemp;
          if (_date > 0 && _month > 0 && _year > 0) {
            const dateInput = moment(
              `${_year}-${_month}-${_date}`,
              "yyyy-MM-DD"
            );
            return moment().isAfter(dateInput);
          } else if (_month > 0 && _date === 0) {
            return this.createError({
              //@ts-ignore
              message: (
                <IntlMessages id="setting.blacklist.dayOfBirth.required" />
              ),
            });
          } else if (_year > 0) {
            const currentYear = moment().year();
            return currentYear <= _year;
          }
          return true;
        }
      )
      .nullable(),
    address: Yup.string().max(
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
  });

  const onSubmitData = async (values) => {
    setLoading(true);
    onSubmit(values);
  };

  const onPressAddNewCategory = (val) => {
    onPressAddCategory(val);
  };
  return (
    <Formik
      initialValues={{
        fullName: "",
        category: [],
        dateOfBirth: null,
        monthOfBirth: null,
        yearOfBirth: null,
        gender: null,
        countryOfResidence: null,
        idIssuingCountry: null,
        placeOfBirth: null,
        nationality: null,
        further: "",
        gender: null,
        dateOfBirthTemp: null,
        monthOfBirthTemp: null,
        yearOfBirthTemp: null,
        groupChipCategory: [],
        furtherInformation: "",
      }}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={onSubmitData}
    >
      {({ values, errors, touched, submitForm, isValid, dirty }) => {
        return (
          <Form>
            <Dialog
              maxWidth={"sm"}
              fullWidth
              open={isOpen}
              className={styles.addNewDlg}
            >
              <CloseableDialogTitle onClose={onClose}>
                <FormattedHTMLMessage
                  id="setting.blacklist.title"
                  values={{ title: title }}
                />
              </CloseableDialogTitle>
              <LoadingWrapper loading={isOpen && loading}>
                <DialogContent>
                  <CustomScrollbar>
                    <div className={styles.Form}>
                      <Grid container>
                        <Grid item xs={12} className={styles.fieldForm}>
                          <TextFieldLabel
                            name="fullName"
                            required
                            label={
                              <IntlMessages
                                id={"setting.blacklist.dialog.full.name"}
                              />
                            }
                            placeholder={formatMessage({
                              id: "setting.blacklist.dialog.full.name.input",
                            })}
                          />
                        </Grid>
                        <Grid item xs={12} className={styles.fieldForm}>
                          <CAutoComplete
                            name="category"
                            className={moduleStyles.CAutoComplete}
                            multiple
                            required
                            numberChip={5}
                            labelHeader={
                              <IntlMessages
                                id={"setting.blacklist.dialog.category"}
                              />
                            }
                            placeholder={formatMessage({
                              id: "setting.blacklist.dialog.category.select",
                            })}
                            component={SelectAutoCompleteChip}
                            options={categoryList}
                            value={values.category}
                            onPressAdd={onPressAddNewCategory}
                            getOptionLabel={(option) => option?.name}
                          />
                        </Grid>
                        <Grid item xs={12} className={styles.fieldForm}>
                          <CAutoComplete
                            formik
                            labelHeader={
                              <IntlMessages
                                id={"setting.blacklist.table.nationality"}
                              />
                            }
                            id="nationality"
                            name="nationality"
                            placeholder={formatMessage({
                              id: "setting.blacklist.dialog.id.country.select",
                            })}
                            component={SelectAutoComplete}
                            options={countryByDemonym}
                            getOptionLabel={(option) => option.demonym}
                            value={values.nationality}
                          />
                        </Grid>
                        <Grid item xs={12} className={styles.fieldForm}>
                          <div>
                            <div
                              style={{
                                fontSize: toRem(12),
                                lineHeight: toRem(16),
                                fontWeight: "500",
                                color: "#95A1AC",
                                marginBottom: "6px",
                              }}
                            >
                              <IntlMessages
                                id={"setting.blacklist.table.dateOfBirth"}
                              />
                            </div>
                            <Grid container spacing={1}>
                              <Grid item xs={4}>
                                <CAutoComplete
                                  formik
                                  id={"dateOfBirthTemp"}
                                  name={"dateOfBirthTemp"}
                                  component={SelectAutoComplete}
                                  options={DAYS.map((item, index) => {
                                    return { id: item, label: item };
                                  })}
                                  getOptionLabel={(option) => option.label}
                                  value={values.dateOfBirthTemp}
                                  placeholder={formatMessage({
                                    id:
                                      "setting.blacklist.dialog.id.day.select",
                                  })}
                                />
                              </Grid>
                              <Grid item xs={4}>
                                <CAutoComplete
                                  formik
                                  id={"monthOfBirthTemp"}
                                  name={"monthOfBirthTemp"}
                                  component={SelectAutoComplete}
                                  placeholder={formatMessage({
                                    id:
                                      "setting.blacklist.dialog.id.month.select",
                                  })}
                                  options={MONTHS.map((item, index) => {
                                    return {
                                      id: item.value,
                                      label: intl.formatMessage({
                                        id: item.label,
                                      }),
                                    };
                                  })}
                                  getOptionLabel={(option) => option.label}
                                  value={values.monthOfBirthTemp}
                                />
                              </Grid>
                              <Grid item xs={4}>
                                <CAutoComplete
                                  formik
                                  id={"yearOfBirthTemp"}
                                  name={"yearOfBirthTemp"}
                                  component={SelectAutoComplete}
                                  options={YEARS.map((item, index) => {
                                    return {
                                      id: item,
                                      label: item,
                                    };
                                  })}
                                  placeholder={formatMessage({
                                    id:
                                      "setting.blacklist.dialog.id.year.select",
                                  })}
                                  getOptionLabel={(option) => option.label}
                                  value={values.yearOfBirthTemp}
                                />
                              </Grid>
                            </Grid>
                          </div>
                        </Grid>
                        <Grid item xs={12} className={styles.fieldForm}>
                          <CAutoComplete
                            labelHeader={
                              <IntlMessages
                                id={"setting.blacklist.table.gender"}
                              />
                            }
                            name="gender"
                            placeholder={formatMessage({
                              id: "setting.blacklist.dialog.id.gender.select",
                            })}
                            component={SelectAutoComplete}
                            options={[
                              {
                                id: "MALE",
                                label: formatMessage({
                                  id: "appModule.filter.MALE",
                                }),
                              },
                              {
                                id: "FEMALE",
                                label: formatMessage({
                                  id: "appModule.filter.FEMALE",
                                }),
                              },
                              {
                                id: "UNSPECIFIED",
                                label: formatMessage({
                                  id: "appModule.filter.UNSPECIFIED",
                                }),
                              },
                            ]}
                            getOptionLabel={(option) => {
                              return option.label;
                            }}
                            formik
                            value={values.gender}
                          ></CAutoComplete>
                        </Grid>
                        <Grid item xs={12} className={styles.fieldForm}>
                          <CAutoComplete
                            labelHeader={
                              <IntlMessages
                                id={"setting.blacklist.table.country"}
                              />
                            }
                            name="countryOfResidence"
                            placeholder={formatMessage({
                              id:
                                "setting.blacklist.dialog.id.countryOfResidence.select",
                            })}
                            component={SelectAutoComplete}
                            options={countryByName}
                            getOptionLabel={(option) => option.name}
                            formik
                            value={values.countryOfResidence}
                          ></CAutoComplete>
                        </Grid>

                        <Grid item xs={12} className={styles.fieldForm}>
                          <CAutoComplete
                            labelHeader={
                              <IntlMessages
                                id={"setting.blacklist.dialog.id.country"}
                              />
                            }
                            name="idIssuingCountry"
                            placeholder={formatMessage({
                              id:
                                "setting.blacklist.dialog.id.idIssuingCountry.select",
                            })}
                            component={SelectAutoComplete}
                            options={countryByName}
                            getOptionLabel={(option) => option.name}
                            value={values.idIssuingCountry}
                          />
                        </Grid>
                        <Grid item xs={12} className={styles.fieldForm}>
                          <CAutoComplete
                            labelHeader={
                              <IntlMessages
                                id={"setting.blacklist.dialog.place.birth"}
                              />
                            }
                            id="place-of-birth"
                            name="placeOfBirth"
                            placeholder={formatMessage({
                              id:
                                "setting.blacklist.dialog.id.placeOfBirth.select",
                            })}
                            component={SelectAutoComplete}
                            options={countryByName}
                            getOptionLabel={(option) => option.name}
                            value={values.placeOfBirth}
                          />
                        </Grid>
                        <Grid item xs={12} className={styles.fieldForm}>
                          <TextFieldLabel
                            name="email"
                            label={
                              <IntlMessages
                                id={"setting.blacklist.dialog.email"}
                              />
                            }
                            placeholder={formatMessage({
                              id: "setting.blacklist.dialog.email.input",
                            })}
                          />
                        </Grid>

                        <Grid item xs={12} className={styles.fieldForm}>
                          <TextFieldLabel
                            name="phone"
                            label={
                              <IntlMessages
                                id={"setting.blacklist.dialog.phone"}
                              />
                            }
                            placeholder={formatMessage({
                              id: "setting.blacklist.dialog.phone.input",
                            })}
                          />
                        </Grid>
                        <Grid item xs={12} className={styles.fieldForm}>
                          <TextFieldLabel
                            name="address"
                            label={
                              <IntlMessages
                                id={"setting.blacklist.dialog.address"}
                              />
                            }
                            rows={6}
                            multiline
                            placeholder={formatMessage({
                              id: "setting.blacklist.dialog.address.input",
                            })}
                          />
                        </Grid>
                        <Grid item xs={12} className={styles.fieldForm}>
                          <TextFieldLabel
                            label={
                              <IntlMessages
                                id={"setting.blacklist.dialog.further"}
                              />
                            }
                            rows={6}
                            multiline
                            name="furtherInformation"
                            placeholder={formatMessage({
                              id: "setting.blacklist.dialog.further.input",
                            })}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  </CustomScrollbar>
                </DialogContent>
              </LoadingWrapper>

              <DialogActions disableSpacing className={styles.dialogAction}>
                <Button
                  fullWidth
                  className={clsx(styles.btnWidth)}
                  variant="containedWhite"
                  onClick={onClose}
                >
                  <IntlMessages id="setting.blacklist.dialog.cancel" />
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={submitForm}
                  className={styles.btnWidth}
                  disabled={!(dirty && isValid)}
                >
                  <IntlMessages id="setting.blacklist.dialog.add" />
                </Button>
              </DialogActions>
            </Dialog>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddNewBlackList;
