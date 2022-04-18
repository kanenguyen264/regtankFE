import { Grid, Typography } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import SelectAutoComplete from "@protego/sdk/RegtankUI/v1/SelectAutoComplete";
import { Field, useFormik, FormikProvider } from "formik";
import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import * as Yup from "yup";
import { isEmpty, filter, includes } from "lodash";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import clsx from "clsx";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import InputAdornment from '@mui/material/InputAdornment';
import { ReactComponent as SearchIcon } from "assets/icons/IcoOutlineSearch.svg";
import styles from "./../ComponentsWhitelist.module.scss";

function AddCountry({ onAdd, countries, selectCountry, typeEnable, isReset, disabled = false }) {
  const [contriesCurrent, setContriesCurrent] = useState([]);
  useEffect(() => {
    const countriesTamp = [...countries];
    setContriesCurrent(
      filter(countriesTamp, function (o) {
        return !includes(selectCountry, o.code);
      })
    );
  }, [selectCountry, countries]);

  const validationSchema = Yup.object().shape({
    country: Yup.object().test(function checkCountry(_country) {
      if (isEmpty(_country)) {
        return this.createError({
          message: <IntlMessages id="setting.validate.CountryRequired" />
        });
      }
      if (selectCountry && selectCountry.length >= 10) {
        return this.createError({
          message: <IntlMessages id="setting.totalCountry" />
        });
      }
      if (selectCountry.indexOf(_country?.code) > -1) {
        return this.createError({
          message: <IntlMessages id="setting.CountryExists" />
        });
      }
      return true;
    })
  });

  const intl = useIntl();
  const formik = useFormik({
    initialValues: {
      country: {}
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => onAdd(values)
  });
  const onChange = async (event, newValue) => {
    await formik.setFieldValue("country", newValue, false);
  };
  const submitForm = async () => {
    await formik.submitForm();
  };

  useEffect(() => {
    if (formik?.errors?.country || formik?.values?.country) {
      formik.resetForm();
    }
    // eslint-disable-next-line
  }, [isReset]);

  return (
    <Grid container>
      <Grid item className={clsx(styles.addCountry)}>
        <FormikProvider value={formik}>
          <Field
            id="combo-box-countries"
            name="country"
            placeholder={intl.formatMessage({
              id: "setting.SelectOrTypeToAdd",
            })}
            type="select"
            className={clsx(
              styles.SelectOutlinedNoLabel,
              !typeEnable ? styles.dropdownInputDisable : ""
            )}
            component={SelectAutoComplete}
            options={contriesCurrent}
            getOptionLabel={(option) => option?.name || ""}
            value={formik.values.country}
            size="small"
            disableClearable
            clearOnBlur
            disabled={!typeEnable || disabled}
            onChange={onChange}
            variant="outlined"
            noLabel
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    className={clsx("ml-2", styles.dropdownIconSearch)}
                  />
                </InputAdornment>
              ),
            }}
            textFieldProps={{ error: formik.errors?.country ? true : false, }}
          />
        </FormikProvider>
      </Grid>

      <Grid item className="ml-4">
        <Button
          size={"small"}
          disabled={!typeEnable || disabled}
          className={styles.toggleButton}
          onClick={submitForm}
        >
          <IntlMessages id={"setting.dialog.add"} />
        </Button>
      </Grid>
      {formik.errors.country && (
        <Typography component={"p"} color={ThemeColors.errorBorder} variant="small1" style={{ marginTop: 6, width: "100%" }}>
          {formik.errors.country}
        </Typography>
      )}
    </Grid>
  );
}

export default AddCountry;