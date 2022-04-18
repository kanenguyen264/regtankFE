import { Grid } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import Slider from "@protego/sdk/RegtankUI/v1/Slider";
import {
  SETTING_KYC_DETAIL,
  SETTING_KYC_DETAIL_SAVE,
} from "actions/SettingScoringAction";
import clsx from "clsx";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import React, { Fragment, useEffect, useState } from "react";

import { snackActions } from "util/snackbarUtils";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../SettingsPage.module.scss";

const marks = [
  {
    value: 0,
    label: "0%",
  },
  {
    value: 25,
    label: "25%",
  },
  {
    value: 50,
    label: "50%",
  },
  {
    value: 75,
    label: "75%",
  },
  {
    value: 100,
    label: "100%",
  },
];

const FilterLevel = ({ disabled = false }) => {
  const dispatch = useDispatch();
  const { settingKyc } = useSelector((state) => state.settingScoring);
  const [fuzzyLevelData, setfuzzyLevelData] = useState(
    settingKyc ? settingKyc.fuzzyLevel : 0
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchKYCSetting();
    // eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    if (settingKyc) {
      setfuzzyLevelData(settingKyc.fuzzyLevel);
    }
  }, [settingKyc]);

  const fetchKYCSetting = () => {
    setLoading(true);
    dispatch(SETTING_KYC_DETAIL()).then(() => {
      setLoading(false);
    });
  };

  const valueText = (value) => {
    return `${value}%`;
  };

  const handleChange = (e, value) => {
    setfuzzyLevelData(value);
  };

  const onPressReset = () => {
    fetchKYCSetting();
  };
  const onPressSave = () => {
    setLoading(true);
    let settingKycSubmit = {
      ...settingKyc,
      fuzzyLevel: fuzzyLevelData,
    };
    dispatch(SETTING_KYC_DETAIL_SAVE(settingKycSubmit)).then((result) => {
      setLoading(false);
      if (result) {
        return snackActions.success(<IntlMessages id="notification.success" />);
      }
      return snackActions.error(<IntlMessages id="notification.error" />);
    });
  };

  return (
    <Fragment>
      <LoadingWrapper loading={loading}>
        <JRCard
          header={
            <IntlMessages id="setting.kyc.content.header"></IntlMessages>
          }
          headerLine
        >
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            className="mt-4"
          >
            <Grid item xs={8} className="mb-4 mt-4">
              <Slider
                defaultValue={0}
                valueLabelDisplay="on"
                step={1}
                marks={marks}
                value={fuzzyLevelData}
                min={0}
                max={100}
                valueLabelFormat={(value) => valueText(value)}
                onChange={!disabled && handleChange}
                style={disabled ? { pointerEvents: "none" } : {}}
              />
            </Grid>
          </Grid>
          {disabled ? (
            <></>
          ) : (
            <div className={"d-flex justify-content-between "}>
              <div className={"flex-end mt-4 pb-2"}>
                <Button
                  className={clsx(styles.ButtonSize, "mr-3")}
                  variant="containedWhite"
                  onClick={onPressReset}
                >
                  <IntlMessages id="appModule.reset" />
                </Button>
                <Button
                  className={styles.ButtonSize}
                  variant="contained"
                  color="primary"
                  onClick={onPressSave}
                >
                  <IntlMessages id="customer.dialog.save" />
                </Button>
              </div>
            </div>
          )}
        </JRCard>
      </LoadingWrapper>
    </Fragment>
  );
};
export default FilterLevel;
