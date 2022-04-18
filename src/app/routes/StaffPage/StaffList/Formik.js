import React from "react";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import { typeEmail } from "@protego/sdk/utils/regularExpression";
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
  dobTab: 0,
};

export const validationSchema = Yup.object().shape(
  {
    firstName: Yup.string().required(
      <IntlMessages id="appModule.form.error.firstNameRequired"></IntlMessages>
    ),
    email: Yup.string()
      .required(
        <IntlMessages id="appModule.form.error.emailIsRequired"></IntlMessages>
      )
      .test(
        "Validate Email",
        <IntlMessages id="staff.from.emailMustBeAValidEmail"></IntlMessages>,
        (value) => {
          return typeEmail(value);
        }
      ),
    phone: Yup.string().matches(/^[+]*[0-9]*$/, {
      message: (
        <IntlMessages id="appModule.form.error.phoneInValid"></IntlMessages>
      ),
      excludeEmptyString: true,
    }),
    roles: Yup.number().min(
      0,
      <IntlMessages id="appModule.form.error.txtgroupRequired"></IntlMessages>
    ),
    department: Yup.number().min(
      0,
      <IntlMessages id="staff.department.require"></IntlMessages>
    ),
  },
  []
);
