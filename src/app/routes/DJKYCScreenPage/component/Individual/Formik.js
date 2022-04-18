import React from "react";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import moment from "moment";
import * as Yup from "yup";

export const initialValues = {
  name: "",
  countryOfResidence: -1,
  firstName: "",
  middleName: "",
  lastName: "",
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
  idIssuingCountry: -1,
  dateOfBirthTemp: 0,
  monthOfBirthTemp: 0,
  yearOfBirthTemp: 0,
  profileNote: null,
  occupationTitles: null,
  strickDateMatch: null,
  yearOfBirthFrom: null,
  yearOfBirthTo: null,
  nameTab: 0,
  enableOnGoingMonitoring: 0,
  dobTab: 0,
};

export const validationSchema = Yup.object().shape(
  {
    name: Yup.string()
      .when(
        ["firstName", "middleName", "lastName", "nameTab"],
        (firstName, middleName, lastName, nameTab) => {
          if (nameTab === 0) {
            return Yup.string()
              .trim()
              .required(
                <IntlMessages id="kyc.from.fullNameIsARequiredField" />
              );
          }
        }
      )
      .max(
        100,
        //@ts-ignore
        <IntlMessages
          id="appModule.form.error.fieldLessThan"
          values={{
            FIELD: <IntlMessages id="form.name" />,
            LENGTH_CHAR: 100,
          }}
        />
      ),
    firstName: Yup.string()
      .when(["nameTab"], (nameTab) => {
        if (nameTab === 1) {
          return Yup.string()
            .trim()
            .required(<IntlMessages id="kyc.from.firstNameIsARequiredField" />);
        }
      })
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
    lastName: Yup.string()
      .when(["firstName", "nameTab"], (firstName, nameTab) => {
        if (nameTab === 1 && firstName) {
          return Yup.string()
            .trim()
            .required(<IntlMessages id="kyc.from.lastNameIsARequiredField" />);
        }
      })
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
      .email(
        //@ts-ignore
        <IntlMessages id="kyc.from.emailMustBeAValidEmail" />
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
        <IntlMessages id="appModule.from.referenceIdIsOnly40Characters" />
      )
      .matches(/^[a-zA-Z0-9.@_-]+$/g, {
        message: <IntlMessages id="kyc.referenceIdExcludeSpecialCharacter" />,
        excludeEmptyString: true,
      }),
    yearOfBirthTemp: Yup.number()
      .typeError(<IntlMessages id="appModule.form.error.invalidDate" />)
      .when(["dateOfBirthTemp", "monthOfBirthTemp", "strickDateMatch"], {
        is: (val1, val2, val3) => val1 > 0 || val2 > 0 || val3,
        then: Yup.number()
          .required(<IntlMessages id="kyc.from.yearOfBirthRequiredField" />)
          .min(1900, <IntlMessages id="kyc.from.yearOfBirthRequiredField" />),
      })
      .max(
        moment().year(),
        <IntlMessages id="appModule.form.error.invalidDate" />
      ),
    monthOfBirthTemp: Yup.number()
      .typeError(<IntlMessages id="appModule.form.error.invalidDate" />)
      .when(["dateOfBirthTemp", "strickDateMatch", "yearOfBirthTemp"], {
        is: (val1, val2, val3) => val1 > 0 || val2 || val3 > 0,
        then: Yup.number()
          .required(<IntlMessages id="kyc.from.MonthOfBirthRequiredField" />)
          .min(1, <IntlMessages id="kyc.from.MonthOfBirthRequiredField" />),
      }),
    dateOfBirthTemp: Yup.number()
      .when(["strickDateMatch", "monthOfBirthTemp", "yearOfBirthTemp"], {
        is: (val1, val2, val3) => val1 || val2 > 0 || val3 > 0,
        then: Yup.number()
          .required(<IntlMessages id="kyc.from.dateOfBirthRequiredField" />)
          .min(1, <IntlMessages id="kyc.from.dateOfBirthRequiredField" />),
      })
      .typeError(<IntlMessages id="appModule.form.error.invalidDate" />)
      .max(31, <IntlMessages id="appModule.form.error.invalidDate" />)
      .min(0, <IntlMessages id="appModule.form.error.invalidDate" />),
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
  },
  [
    ["name", "firstName", "middleName", "lastName"],
    ["name", "lastName", "nameTab"],
    ["dateOfBirthTemp", "monthOfBirthTemp"],
    ["yearOfBirthTemp", "monthOfBirthTemp"],
    ["dateOfBirthTemp", "yearOfBirthTemp"],
  ]
);
