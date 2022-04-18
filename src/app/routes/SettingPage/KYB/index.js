import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";

import {
  SETTING_KYB_DETAIL,
  SETTING_KYB_DETAIL_SAVE,
} from "actions/SettingScoringAction";
import clsx from "clsx";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { snackActions } from "util/snackbarUtils";
import * as yup from "yup";
import styles from "../SettingsPage.module.scss";
import FilterLevel from "./FilterLevel";
import ReScreeningFrequency from "./RescreeningFrequency";
import { withACL } from "../../../../acl";

const Header = () => {
  return (
    <Fragment>
      <PageHeading
        title={<IntlMessages id={"setting.kyb.header"} />}
        customUrlResolver={(index, sub) => {
          switch (index) {
            case 1:
              return [
                <IntlMessages id={"setting.kyc.breadcrumb.settings"} />,
                null,
                false,
              ];
            case 2:
              return [<IntlMessages id={"setting.kyb.header"} />, null, false];
            default:
              break;
          }
        }}
      />
    </Fragment>
  );
};

const SettingKYB = ({ ACL }) => {
  const dispatch = useDispatch();
  const settingKyb = useSelector((state) => state.settingScoring.settingKyb);
  const [settingState, setSettingState] = useState({});
  const [loading, setLoading] = useState(false);
  const isEditable = ACL.isAllowedPermissions("SETTING_KYB_EDIT");

  const validationSchema = yup.object().shape({
    fuzzyLevel: yup.number().required(),
    riskLevelSetting: yup.object().shape({
      LOW: yup.number().required(),
      MEDIUM: yup.number().required(),
      HIGH: yup.number().required(),
    }),
  });

  useEffect(() => {
    setSettingState(settingKyb);
  }, [settingKyb]);

  useEffect(() => {
    fetchKYBSetting();
    // eslint-disable-next-line
  }, []);

  const fetchKYBSetting = () => {
    setLoading(true);
    dispatch(SETTING_KYB_DETAIL()).then(() => {
      setLoading(false);
    });
  };

  const resetSettings = () => {
    setSettingState(settingKyb);
  };

  const saveSettings = async () => {
    if (!(await validationSchema.isValid(settingState))) {
      return;
    }

    setLoading(true);
    try {
      await dispatch(SETTING_KYB_DETAIL_SAVE(settingState));
      snackActions.success(<IntlMessages id="notification.success" />);
    } catch (e) {
      snackActions.error(<IntlMessages id="notification.error" />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Header />
      <LoadingWrapper loading={loading}>
        <div className={styles.kybSetting}>
          <FilterLevel
            disabled={!isEditable}
            fuzzyLevel={settingState.fuzzyLevel}
            onChange={(val) => {
              const newState = Object.assign({}, settingState, {
                fuzzyLevel: val,
              });
              setSettingState(newState);
            }}
          />
          <ReScreeningFrequency
            isDisabled={!isEditable}
            riskLevelSetting={settingState.riskLevelSetting}
            onChange={(val) => {
              const newState = Object.assign({}, settingState, {
                riskLevelSetting: val,
              });
              setSettingState(newState);
            }}
          />
          {isEditable && (
            <div className="text-right mt-5">
              <Button variant="containedWhite" onClick={resetSettings}>
                <IntlMessages id="appModule.reset" />
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={isEditable && saveSettings}
                className="ml-3"
              >
                <IntlMessages id="save" />
              </Button>
            </div>
          )}
        </div>
      </LoadingWrapper>
    </Fragment>
  );
};

export default withACL(SettingKYB);
