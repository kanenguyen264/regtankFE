import { Grid, DialogActions } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { makeStyles } from "@mui/styles";
import { Switch } from "@protego/sdk/RegtankUI/v1/Switch";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { fetchWhitelist, hideMessage, updateWhitelist } from "actions";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCountryWhitelist } from "util/countryWhitelist";
import { snackActions } from "util/snackbarUtils";
import CountryTab from "./components/Countries";
import IPAddress from "./components/IPAddress";
import CloseableDialogTitle from "@protego/sdk/RegtankUI/v1/CloseableDialogTitle/CloseableDialogTitle";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import { isEmpty } from "lodash";
import styles from "./components/ComponentsWhitelist.module.scss";
import clsx from "clsx";
const typeCountry = "COUNTRY";
const typeIpAddress = "IP";

const useStyles = makeStyles((theme) => ({
  root: {},
  tableSortLabel: (props) => ({
    color: "#707070",
    fill: props.headCellColor,
  }),
  tabContent: {
    borderRadius: "8px",
    border: `1px solid ${ThemeColors.grayText1}`,
    marginTop: "-1px",
  },
  tabHeight: {
    height: "500px",
  },
}));

const WhitelistScreen = function ScreenScoringNew({
  match,
  setFormChanged,
  disabled = false,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { whitelist, showMessage, errorMessage } = useSelector(
    (state) => state.settings
  );
  const countryByName = getCountryWhitelist();
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedIPAddress, setSelectedIPAddress] = useState([]);
  const [typeWhitelistCompany, setTypeWhitelistCompany] = useState(false);
  const [typeWhitelistIP, setTypeWhitelistIP] = useState(false);
  const [typeChangeEnable, setTypeChangeEnable] = useState(null);
  const [openConfirmEnable, setOpenConfirmEnable] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const handleCloseConfirmEnable = () => {
    setOpenConfirmEnable(false);
  };

  useEffect(() => {
    dispatch(fetchWhitelist());
  }, [dispatch]);

  useEffect(() => {
    if (whitelist?.type === typeCountry) {
      setTypeWhitelistIP(false);
      setTypeWhitelistCompany(true);
      setTypeChangeEnable(typeCountry);
    }
    if (whitelist?.type === typeIpAddress) {
      setTypeWhitelistIP(true);
      setTypeWhitelistCompany(false);
      setTypeChangeEnable(typeIpAddress);
    }
  }, [whitelist]);

  const updateTypeWhitelistCompany = (v) => {
    const value = v.target.checked;
    if (value) {
      if (typeWhitelistIP) {
        setOpenConfirmEnable(true);
      } else {
        setTypeWhitelistCompany(true);
        setTypeChangeEnable(typeCountry);
      }
    } else {
      setTypeWhitelistCompany(false);
      setTypeChangeEnable(null);
    }
    setIsReset(!isReset);
  };

  const updateTypeWhitelistIP = (v) => {
    const value = v.target.checked;
    if (value) {
      if (typeWhitelistCompany) {
        setOpenConfirmEnable(true);
      } else {
        setTypeWhitelistIP(true);
        setTypeChangeEnable(typeIpAddress);
      }
    } else {
      setTypeWhitelistIP(false);
      setTypeChangeEnable(null);
    }
    setIsReset(!isReset);
  };

  const handleSwitchEnable = () => {
    if (typeChangeEnable === typeCountry) {
      setTypeWhitelistCompany(false);
      setTypeWhitelistIP(true);
      setTypeChangeEnable(typeIpAddress);
    }
    if (typeChangeEnable === typeIpAddress) {
      setTypeWhitelistCompany(true);
      setTypeWhitelistIP(false);
      setTypeChangeEnable(typeCountry);
    }

    setIsReset(!isReset);
    setOpenConfirmEnable(false);
  };

  const resetForm = () => {
    setIsReset(!isReset);
    dispatch(fetchWhitelist());
  };

  const updateSelectCountries = (v) => {
    setSelectedCountries(v);
  };

  const updateSelectIPAddress = (v) => {
    setSelectedIPAddress(v);
  };

  const submitWhitelist = async () => {
    const dataSubmit = {
      type: typeChangeEnable,
      countries: selectedCountries,
      ips: selectedIPAddress,
    };
    setIsReset(!isReset);
    await dispatch(updateWhitelist(dataSubmit));
  };

  const createNotification = () => {
    if (errorMessage) return snackActions.error(<IntlMessages id="error" />);
    return snackActions.success(<IntlMessages id="setting.whitelistSaved" />);
  };

  useEffect(() => {
    if (showMessage) {
      dispatch(hideMessage());
    }
  }, [showMessage, dispatch]);

  useEffect(() => {
    if (whitelist && !isEmpty(whitelist)) {
      const compare = [
        typeChangeEnable === whitelist.type ||
          (!typeChangeEnable && !whitelist.type),
        JSON.stringify(selectedIPAddress) === JSON.stringify(whitelist.ips),
        JSON.stringify(selectedCountries) ===
          JSON.stringify(whitelist.countries),
      ];

      setFormChanged(compare.includes(false));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCountries,
    selectedIPAddress,
    typeWhitelistCompany,
    typeWhitelistIP,
    typeChangeEnable,
    whitelist,
  ]);

  return (
    <Fragment>
      {showMessage === true && createNotification()}
      <div>
        <Dialog
          open={openConfirmEnable}
          onClose={handleCloseConfirmEnable}
          title={<IntlMessages id="confirm" />}
          disableDialogAction
        >
          <DialogContent>
            <div className="mt-2 mb-2">
              <DialogContentText style={{ color: "#2B2B2B" }}>
                <IntlMessages id={"setting.confirmSwitch"} />{" "}
                <span style={{ fontWeight: 700 }}>
                  {typeChangeEnable !== typeCountry ? (
                    <IntlMessages id={"setting.country"} />
                  ) : (
                    <IntlMessages id={"setting.ipAddress"} />
                  )}
                </span>
              </DialogContentText>
            </div>
          </DialogContent>
          <DialogActions className="justify-content-center">
            <Button
              style={{ width: "150px" }}
              variant="contained"
              size="small"
              color="primary"
              onClick={handleSwitchEnable}
            >
              <IntlMessages id="setting.switch" />
            </Button>
            <Button
              style={{ width: "150px" }}
              onClick={handleCloseConfirmEnable}
              variant="outlined"
              size="small"
              color="primary"
            >
              <IntlMessages id="cancel" />
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <Grid className={styles.containerPadding} container>
        <Grid item xs={6}>
          <div className={`${classes.tabContent}`}>
            <div className={styles.tabContentHeader}>
              <div
                className={clsx(
                  "d-sm-flex justify-content-sm-between align-items-sm-center",
                  styles.tabContentHeaderTitle
                )}
              >
                <span>
                  <IntlMessages id={"setting.country"} />
                </span>
                <div className={styles.tabContentHeaderRight}>
                  <Switch
                    disabled={disabled}
                    checked={typeWhitelistCompany}
                    onChange={updateTypeWhitelistCompany}
                  />
                  <IntlMessages id={"setting.enable"} />
                </div>
              </div>
            </div>
            <div className={styles.tabContentBox}>
              <CountryTab
                typeEnable={typeWhitelistCompany}
                disabled={disabled}
                addListCountries={updateSelectCountries}
                countries={countryByName}
                isReset={isReset}
              />
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className={`${classes.tabContent}`}>
            <div className={styles.tabContentHeader}>
              <div
                className={clsx(
                  "d-sm-flex justify-content-sm-between align-items-sm-center",
                  styles.tabContentHeaderTitle
                )}
              >
                <span>
                  <IntlMessages id={"setting.ipAddress"} />
                </span>
                <div className={styles.tabContentHeaderRight}>
                  <Switch
                    disabled={disabled}
                    checked={typeWhitelistIP}
                    onChange={updateTypeWhitelistIP}
                  />
                  <IntlMessages id={"setting.enable"} />
                </div>
              </div>
            </div>
            <div className={styles.tabContentBox}>
              <IPAddress
                typeEnable={typeWhitelistIP}
                disabled={disabled}
                iPAddress={selectedIPAddress}
                addListIPAddress={updateSelectIPAddress}
                isReset={isReset}
              />
            </div>
          </div>
        </Grid>
        {!disabled && (
          <Grid item xs={12} className={"mt-5 flex-end"}>
            <Button
              onClick={resetForm}
              variant="containedWhite"
              className={styles.btnCustom}
            >
              <IntlMessages id="customer.dialog.cancel" />
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={submitWhitelist}
              className={clsx("ml-3", styles.btnCustom)}
            >
              <IntlMessages id="customer.dialog.save" />
            </Button>
          </Grid>
        )}
      </Grid>
    </Fragment>
  );
};

export default WhitelistScreen;
