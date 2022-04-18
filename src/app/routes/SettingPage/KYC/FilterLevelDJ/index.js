import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import {
  SETTING_DJ_KYC_DETAIL,
  SETTING_DJ_KYC_DETAIL_SAVE,
} from "actions/SettingScoringAction";
import React, { Fragment, useEffect, useState, useRef } from "react";
import { snackActions } from "util/snackbarUtils";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../SettingsPage.module.scss";
import { Field, Form, Formik } from "formik";
import { FormattedHTMLMessage } from "react-intl";
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import clsx from "clsx";
import { BLACK_RAISIN } from "constants/ThemeColors";
const FilterLevel = () => {
  const formRef = useRef();
  const dispatch = useDispatch();
  const { settingKYCDJSearchType } = useSelector(
    (state) => state.settingScoring
  );
  const [loading, setLoading] = useState(false);
  const fetchDJKYCSetting = () => {
    dispatch(SETTING_DJ_KYC_DETAIL());
  };
  useEffect(() => {
    fetchDJKYCSetting();
    // eslint-disable-next-line
  }, [dispatch]);
  const onPressReset = () => {
    fetchDJKYCSetting();
  };
  const onSubmitData = async (values) => {
    setLoading(true);
    dispatch(SETTING_DJ_KYC_DETAIL_SAVE(values)).then((result) => {
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
          header={<IntlMessages id="setting.kyc.content.header"></IntlMessages>}
          headerLine
        >
          <Formik
            initialValues={{
              searchType: settingKYCDJSearchType?.searchType || null,
            }}
            onSubmit={onSubmitData}
            enableReinitialize={true}
            innerRef={formRef}
          >
            {({ submitForm }) => {
              return (
                <Form className="d-flex flex-column">
                  <Grid container>
                    <Grid
                      xs={8}
                      className="MuiGrid-grid-xs-2 align-items-sm-center d-sm-flex "
                    >
                      <FormControl component="fieldset">
                        <Field
                          as={RadioGroup}
                          aria-label="searchType"
                          name="searchType"
                          row
                          className={styles.colorRadio}
                          style={{ with: "100%" }}
                        >
                          <span style={{ marginRight: toRem(200) }}>
                            <FormControlLabel
                              style={{ marginRight: "5px" }}
                              control={<Radio value="PRECISE" size="small" />}
                              label={
                                <>
                                  <IntlMessages id="setting.precise" />
                                </>
                              }
                            />
                            <span>
                              <Tooltip
                                arrow
                                placement={"top-start"}
                                title={
                                  <div className="custom-tooltip">
                                    <p style={{ textAlign: "center" }}>
                                      <FormattedHTMLMessage id="setting.precise.tooltip" />
                                    </p>
                                  </div>
                                }
                              >
                                <QuestionMarkIcon />
                              </Tooltip>
                            </span>
                          </span>
                          <span style={{ marginRight: toRem(200) }}>
                            <FormControlLabel
                              style={{ marginRight: "5px" }}
                              control={
                                <Radio
                                  placement={"top-start"}
                                  value="NEAR"
                                  size="small"
                                />
                              }
                              label={<IntlMessages id="setting.near" />}
                            />
                            <span>
                              <Tooltip
                                arrow
                                placement={"top-start"}
                                title={
                                  <div className="custom-tooltip">
                                    <p style={{ textAlign: "center" }}>
                                      <FormattedHTMLMessage id="setting.near.tooltip" />
                                    </p>
                                  </div>
                                }
                              >
                                <QuestionMarkIcon />
                              </Tooltip>
                            </span>
                          </span>
                          <span>
                            <FormControlLabel
                              style={{ marginRight: "5px" }}
                              control={<Radio value="BROAD" size="small" />}
                              label={<IntlMessages id="setting.broad" />}
                            />
                            <span>
                              <Tooltip
                                arrow
                                placement={"top-start"}
                                title={
                                  <div className="custom-tooltip">
                                    <p style={{ textAlign: "center" }}>
                                      <FormattedHTMLMessage id="setting.broad.tooltip" />
                                    </p>
                                  </div>
                                }
                              >
                                <QuestionMarkIcon />
                              </Tooltip>
                            </span>
                          </span>
                        </Field>
                      </FormControl>
                    </Grid>
                    <Grid xs={4}>
                      <Box display="flex" justifyContent="flex-end">
                        <Button
                          className="mr-3"
                          variant={"containedWhite"}
                          type={"reset"}
                          onClick={onPressReset}
                        >
                          <IntlMessages id="appModule.reset" />
                        </Button>
                        <Button
                          variant={"contained"}
                          color={"primary"}
                          type={"button"}
                          onClick={submitForm}
                        >
                          <IntlMessages id="save" />
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Form>
              );
            }}
          </Formik>
        </JRCard>
      </LoadingWrapper>
    </Fragment>
  );
};
export default FilterLevel;
