import { Grid } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import React, { useEffect } from "react";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import InputAdornment from '@mui/material/InputAdornment';
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { ReactComponent as SearchIcon } from "assets/icons/IcoOutlineSearch.svg";
import { Form } from "formik";
import { useIntl } from "react-intl";
import clsx from "clsx";
import styles from "./../ComponentsWhitelist.module.scss";

const IPAddressForm = ({
  submitForm,
  resetForm,
  typeEnable,
  isReset,
  errors,
  values,
  disabled = false
}) => {
  const intl = useIntl();

  useEffect(() => {
    if (errors?.ipAddress || values?.ipAddress) {
      resetForm();
    }
    // eslint-disable-next-line
  }, [isReset]);

  return (
    <Form>
      <Grid container>
        <Grid item className={clsx(styles.addCountry)}>
          <TextField
            disabled={!typeEnable || disabled}
            className={clsx(
              styles.InputOutlinedNoLabel,
              !typeEnable ? styles.dropdownInputDisable : ""
            )}
            name={"ipAddress"}
            placeholder={intl.formatMessage({
              id: "setting.typeAddressToAdd"
            })}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    className={styles.dropdownIconSearch}
                  />
                </InputAdornment>
              ),
            }}
            fullWidth
            formik
          />
        </Grid>
        <Grid item className="ml-4">
          <div>
            <Button
              size={"small"}
              disabled={!typeEnable || disabled}
              className={styles.toggleButton}
              onClick={submitForm}
            >
              <IntlMessages id={"setting.dialog.add"} />
            </Button>
          </div>
        </Grid>
      </Grid>
    </Form>
  );
};

export default IPAddressForm;