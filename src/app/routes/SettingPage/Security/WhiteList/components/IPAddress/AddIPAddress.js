import React from "react";
import { Formik } from "formik";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import * as Yup from "yup";
import IPAddressForm from "./IPAddressForm";
import styles from "./../ComponentsWhitelist.module.scss";

function AddIPAddress({ onAdd, selectIPAddress, typeEnable, isReset, disabled = false }) {
  const onSubmitData = async (values, actions) => {
    onAdd(values);
    actions.resetForm();
  };

  const validationSchema = Yup.object().shape({
    ipAddress: Yup.string()
      .required(<IntlMessages id="setting.validate.IPRequired" />)
      .matches(
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        {
          message: <IntlMessages id="setting.validate.IPAddressType" />,
          excludeEmptyString: true
        }
      )
      .test(function check(_ipAddress) {
        if (selectIPAddress.indexOf(_ipAddress) !== -1) {
          return this.createError({
            message: <IntlMessages id="setting.IPAddressAlreadyExists" />
          });
        }
        if (selectIPAddress.length >= 5) {
          return this.createError({
            message: <IntlMessages id="setting.totalIP" />
          });
        }
        return true;
      })
  });

  return (
    <Formik
      initialValues={{
        ipAddress: ""
      }}
      onSubmit={onSubmitData}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnMount={false}
      validateOnBlur={false}
    >
      {({ submitForm, resetForm, errors, values }) => {
        return (
          <IPAddressForm
            submitForm={submitForm}
            resetForm={resetForm}
            typeEnable={typeEnable}
            isReset={isReset}
            errors={errors}
            values={values}
            disabled={disabled}
          />
        );
      }}
    </Formik>
  );
}

export default AddIPAddress;