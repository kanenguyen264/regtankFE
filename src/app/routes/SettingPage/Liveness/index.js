import { Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";

import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { GET_LIVENESS_SETTING, SUBMIT_LIVENESS_SETTING } from "actions/Setting";
import clsx from "clsx";
import { Form, Formik } from "formik";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { snackActions } from "util/snackbarUtils";
import FilterLiveness from "../Liveness/FilterLiveness";
import styles from "../SettingsPage.module.scss";
import { Switch } from "@protego/sdk/RegtankUI/v1/Switch";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
const useStyles = makeStyles({
  settingBlock: {
    marginBottom: toRem(40),
    marginTop: toRem(40),
  },
  settingHeading: {
    fontSize: toRem(14),
    lineHeight: toRem(24),
    fontWeight: 500,
    marginBottom: toRem(16),
    color: ThemeColors.mainBlackText,
  },
  controlWrapper: {
    maxWidth: toRem(645),
    border: `1px solid ${ThemeColors.grayText1}`,
    borderRadius: "8px",
    padding: `3px ${toRem(24)}`,

    "& $control": {
      borderBottom: `1px solid ${ThemeColors.grayText1}`,
    },
    "& $control:last-child": {
      border: "none",
    },
  },
  control: {
    fontSize: toRem(16),
    lineHeight: toRem(24),
    alignItems: "center",
    padding: `${toRem(14)} 0`,
  },
  buttonGroup: {
    maxWidth: toRem(645),
  },
  filterLivenessWrapper:{
    height: toRem(118),
    paddingTop: toRem(28),
  }
});

const LivenessSetting = React.memo(function () {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [settingState, setSettingState] = useState({});
  const [loading, setLoading] = useState(false);
  const livenessRef = useRef();
  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSettings = () => {
    setLoading(true);
    dispatch(GET_LIVENESS_SETTING())
      .then((response) => {
        setSettingState(response);
      })
      .catch((err) => {
        extractErrorAndNotify(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onPressReset = () => {
    fetchSettings();
  };
  const onSubmitData = (values) => {
    dispatch(SUBMIT_LIVENESS_SETTING(values))
      .then((rs) => {
        return snackActions.success(
          <IntlMessages id={"notification.success"} />
        );
      })
      .catch((err) => {
        extractErrorAndNotify(err);
      });
  };

  const extractErrorAndNotify = (err) => {
    let jsonParse = JSON.parse(
      JSON.stringify(err.response ? err.response.data : "")
    );

    snackActions.error(
      jsonParse.message ? (
        jsonParse.message
      ) : (
        <IntlMessages id={"notification.error"} />
      )
    );
  };

  const Header = () => {
    return (
      <Fragment>
        <PageHeading
          title={<IntlMessages id={"setting.menu.LivenessSetting"} />}
          customUrlResolver={(index, sub) => {
            switch (index) {
              case 1:
                return [
                  <IntlMessages id={"setting.kyc.breadcrumb.settings"} />,
                  null,
                  false,
                ];
              case 2:
                return [
                  <IntlMessages id={"setting.menu.LivenessSetting"} />,
                  null,
                  false,
                ];
              default:
                break;
            }
          }}
        />
      </Fragment>
    );
  };

  const Content = () => {
    return (
      <LoadingWrapper loading={loading} size={"3rem"}>
        <JRCard
          header={
            <IntlMessages id={"setting.menu.LivenessSetting"} />
          }
          headerLine
        >
          <Formik
            initialValues={{
              approveMode: settingState?.approveMode,
              livenessConfidence: settingState?.livenessConfidence,
            }}
            innerRef={livenessRef}
            onSubmit={onSubmitData}
          >
            {({ values, setFieldValue }) => {
              return (
                <Form className={styles.generalSettingForm}>
                  <div className={classes.settingBlock}>
                    <h5 className={classes.settingHeading}>
                      <IntlMessages
                        id={"setting.menu.liveness.compliance.officer"}
                      />
                    </h5>
                    <div className={classes.controlWrapper}>
                      <Grid container className={classes.control}>
                        <Grid item xs={10} style={{fontSize: toRem(14), color: ThemeColors.mainBlackText}}>
                          <IntlMessages
                            id={"setting.menu.liveness.compliance.status"}
                          />
                        </Grid>
                        <Grid item xs={2} className="text-right">
                          <Switch
                            checked={values.approveMode}
                            name="approveMode"
                            inputProps={{ "aria-label": "secondary checkbox" }}
                            onChange={(event, checked) => {
                              setFieldValue("approveMode", checked);
                            }}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  </div>

                  <div className={classes.settingBlock}>
                    <h5 className={classes.settingHeading}>
                      <IntlMessages
                        id={"setting.menu.liveness.face.match.similarity"}
                      />
                    </h5>
                    <div className={clsx(classes.controlWrapper, classes.filterLivenessWrapper)}>
                      <Grid container className={classes.control}>
                        {values?.livenessConfidence && (
                          <FilterLiveness
                            name="filterLiveness"
                            livenessMatchLevel={values.livenessConfidence}
                          />
                        )}
                      </Grid>
                    </div>
                  </div>

                  <div classes={clsx("d-flex justify-content-between")}>
                    <div className={clsx("flex-end mt-4 pb-2", classes.buttonGroup)}>
                      <Button
                        className={styles.ButtonSize}
                        variant="containedWhite"
                        onClick={onPressReset}
                      >
                        <IntlMessages id="appModule.reset" />
                      </Button>
                      <Button
                        className={clsx(styles.ButtonSize, "ml-3")}
                        variant="contained"
                        color="primary"
                        type="submit"
                      >
                        <IntlMessages id="customer.dialog.save" />
                      </Button>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </JRCard>
      </LoadingWrapper>
    );
  };

  return (
    <Fragment>
      <Header />
      <Content />
    </Fragment>
  );
});

export default LivenessSetting;
