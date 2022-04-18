import { Grid } from "@mui/material";
import Checkbox from "@protego/sdk/RegtankUI/v1/Checkbox";
import { Switch } from "@protego/sdk/RegtankUI/v1/Switch";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import React, { useState, useEffect } from "react";
import styles from "./authentication.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateCompanyTwoFactorAuth, hideMessage } from "actions";
import { snackActions } from "util/snackbarUtils";
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
import { FormattedHTMLMessage } from "react-intl";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import clsx from "clsx";

const Authentication = function Authentication({
  setFormChanged,
  disabled = false,
}) {
  const dispatch = useDispatch();
  const { showMessage, errorMessage, customerMe } = useSelector(
    (state) => state.settings
  );
  const [enabledTwoFactorAuth, setEnabledTwoFactorAuth] = useState(false);
  const [toggledTwoFactorAuth, setToggledTwoFactorAuth] = useState(false);

  const handleChangeToggledTwoFactorAuth = (event) => {
    setToggledTwoFactorAuth(event.target.checked);
  };

  const handleChangeEnabledTwoFactorAuth = (event) => {
    setEnabledTwoFactorAuth(event.target.checked);
  };

  const resetDataTwoFactorAuth = async () => {
    setEnabledTwoFactorAuth(customerMe?.enabledTwoFactorAuth);
    setToggledTwoFactorAuth(customerMe?.allowedToTurnOff);
  };

  const submitDataTwoFactorAuth = async () => {
    const dataSubmit = {
      enabled: enabledTwoFactorAuth,
      allowedToTurnOff: toggledTwoFactorAuth,
    };
    await dispatch(updateCompanyTwoFactorAuth(dataSubmit));
  };

  useEffect(() => {
    let flag =
      enabledTwoFactorAuth === customerMe?.enabledTwoFactorAuth &&
      toggledTwoFactorAuth === customerMe?.allowedToTurnOff;
    setFormChanged(!flag);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabledTwoFactorAuth, toggledTwoFactorAuth, customerMe]);

  useEffect(() => {
    if (customerMe?.enabledTwoFactorAuth || customerMe?.allowedToTurnOff) {
      setEnabledTwoFactorAuth(customerMe?.enabledTwoFactorAuth);
      setToggledTwoFactorAuth(customerMe?.allowedToTurnOff);
    }
  }, [customerMe]);

  const createNotification = () => {
    if (errorMessage) return snackActions.error(<IntlMessages id="error" />);
    return snackActions.success(
      <IntlMessages id="setting.changesSuccessfullySaved" />
    );
  };

  useEffect(() => {
    if (showMessage) {
      dispatch(hideMessage());
    }
  }, [showMessage, dispatch]);

  return (
    <div className={styles.authenticationWrapper}>
      {showMessage === true && createNotification()}
      <Grid container>
        <Grid item xs={12}>
          <div className={styles.titleTab}>
            <IntlMessages id={"setting.2FAAuthentication"} />
          </div>
          <div className={styles.cardFA}>
            <div className="d-sm-flex justify-content-sm-between align-items-sm-center">
              <div className="d-flex">
                <span className={styles.textContent}>
                  <IntlMessages id="setting.Use2FAForTheCompany" />
                </span>
                <span className="ml-1">
                  <Tooltip
                    arrow
                    title={
                      <div className="custom-tooltip">
                        <h5>
                          <IntlMessages id="setting.2FAForTheCompany" />
                        </h5>
                        <p>
                          <FormattedHTMLMessage id="setting.Use2FAForTheCompany.tooltip" />
                        </p>
                      </div>
                    }
                  >
                    <QuestionMarkIcon />
                  </Tooltip>
                </span>
              </div>
              <div className="d-flex">
                <div className={styles.btnSwitch}>
                  <Switch
                    disabled={disabled}
                    checked={enabledTwoFactorAuth}
                    onChange={handleChangeEnabledTwoFactorAuth}
                    name="reScreening"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.authOptions}>
            <Checkbox
              disabled={!enabledTwoFactorAuth || disabled}
              checked={toggledTwoFactorAuth}
              onChange={handleChangeToggledTwoFactorAuth}
            />
            <span className={styles.labelCheckBox}>
              <IntlMessages id={"setting.allowUsersToTurnOff2FA"} />
            </span>
          </div>
        </Grid>
        {!disabled && (
          <Grid item xs={12} className={clsx("flex-end", styles.buttonGroup)}>
            <Button
              variant="containedWhite"
              onClick={!disabled && resetDataTwoFactorAuth}
              style={{ width: toRem(140) }}
            >
              <IntlMessages id="customer.dialog.cancel" />
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={!disabled && submitDataTwoFactorAuth}
              className={"ml-3"}
              style={{ width: toRem(140) }}
            >
              <IntlMessages id="customer.dialog.save" />
            </Button>
          </Grid>
        )}
      </Grid>
    </div>
  );
};
export default Authentication;
