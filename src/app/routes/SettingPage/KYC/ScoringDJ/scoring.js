import { Box, Tab, Tabs, Grid, SvgIcon, Typography } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import { withStyles } from "@mui/styles";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import { ReactComponent as IcoArrowPrevious } from "assets/icons/IcoArrowPrevious.svg";

import TextField from "@protego/sdk/RegtankUI/v1/TextField/TextFieldOutlined";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import {
  SETTING_DJ_SCORING_ACTION_DETAIL,
  SETTING_DJ_SCORING_ACTION_SAVE,
} from "actions/SettingScoringAction";
import clsx from "clsx";
import { BACKGROUND_APP_BAR } from "constants/ThemeColors";
import { Form, Formik } from "formik";
import { isEmpty } from "lodash";
import React, {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useIntl } from "react-intl";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router";
import { useHistory } from "react-router-dom";
import { compose } from "recompose";
import { formatDate } from "util/date";
import { snackActions } from "util/snackbarUtils";
import * as Yup from "yup";
import styles from "../../SettingsPage.module.scss";
import FATFScoring from "./FATF";
import RiskLevel from "../components/RiskLevel";
import WeightTab from "./Weight";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import {
  SETTING_DJ_SCORING_ROUTE_ARCHIVE,
  SETTING_DJ_SCORING_ROUTE_DETAIL,
  SETTING_DJ_SCORING_ROUTE_INDEX,
  PAGE_NOT_FOUND,
} from "constants/routes";
import { generatePath } from "@protego/sdk/utils/router";

const ListTabTable = [
  { id: 0, label: <IntlMessages id={"risk-level"} /> },
  { id: 1, label: <IntlMessages id={"risk-parameter"} /> },
  { id: 2, label: <IntlMessages id={"setting.tab.FaTF"} /> },
];

const ScoringDJ = compose(
  withRouter,
  withPagination
)(function DJ(props) {
  const [value, setValue] = useState(0);
  const { paginationParams, match, disabled = false } = props;
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [listScoreScoring, setListScoreScoring] = useState({});
  const [loading, setLoading] = useState(false);
  const formikScore = useRef();
  const history = useHistory();
  const detail = useSelector(
    (state) => state.settingScoring.detailDj,
    shallowEqual
  );
  const [riskLevelErrors, setRiskLevelErrors] = useState({
    low: false,
    medium: false,
    high: false,
  });

  //Formik Schema
  const AddSchema = Yup.object().shape({
    name: Yup.string()
      .max(
        100,
        <IntlMessages
          id="appModule.form.error.fieldLessThan"
          values={{
            FIELD: <IntlMessages id="setting.scoring.fileName" />,
            LENGTH_CHAR: 100,
          }}
        />
      )
      .required(
        <IntlMessages
          id="appModule.form.error.fieldRequired"
          values={{
            FIELD: <IntlMessages id="setting.scoring.fileName" />,
          }}
        />
      ),
    description: Yup.string().max(
      2000,
      <IntlMessages
        id="appModule.form.error.fieldLessThan"
        values={{
          FIELD: <IntlMessages id="setting.scoring.description" />,
          LENGTH_CHAR: 2000,
        }}
      />
    ),
  });

  useEffect(() => {
    setLoading(true);
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, paginationParams]);

  useEffect(() => {
    if (detail) {
      setListScoreScoring(detail);
      if (process.env.NODE_ENV === "development") {
        if (typeof detail !== "undefined")
          window.localStorage.setItem(
            "doc:settingScoring",
            JSON.stringify(detail)
          );
      }
    }
    // eslint-disable-next-line
  }, [detail.id]);

  const fetchDetail = useCallback(() => {
    const { id } = match.params;
    dispatch(SETTING_DJ_SCORING_ACTION_DETAIL(id)).then(() => {
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  /**
   *  Check current page
   */
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const StyledTabs = withStyles({
    root: {
      borderRadius: "6px 6px 0 0",
      "& .MuiTab-root": {
        minWidth: toRem(136),
      },
    },
    selected: {
      backgroundColor: BACKGROUND_APP_BAR,
      fontWeight: 500,
      color: "red",
    },
    indicator: {
      display: "flex",
      justifyContent: "center",
      "& > span": {
        width: "100%",
        backgroundColor: BACKGROUND_APP_BAR,
      },
    },
  })((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

  const TabCustom = memo((props) => {
    const { value, handleChange } = props;
    return (
      <Box boxShadow={2} style={{ borderRadius: "6px" }}>
        <StyledTabs
          value={value}
          onChange={handleChange}
          className={styles.tabContainer}
        >
          {ListTabTable.map((item, index) => {
            if (value === index) {
              return (
                <Tab
                  key={item.id}
                  label={item.label}
                  className={styles.tabItemActiveKYCSetting}
                />
              );
            }
            return (
              <Tab
                key={item.id}
                label={item.label}
                className={styles.tabItemKYCSetting}
              />
            );
          })}
        </StyledTabs>
      </Box>
    );
  });

  const onPressResetForm = async () => {
    formikScore.current.resetForm();
  };

  const onSaveScreenScoring = async (values) => {
    /**
     * Check value from page child
     */
    let dataSubmit = values;

    if (!isEmpty(values.fatfPepScore)) {
      dataSubmit["fatfPepScore"] = values.fatfPepScore;
    }

    if (!isEmpty(values.weightSetting)) {
      dataSubmit["weightSetting"] = values.weightSetting;
    }

    if (!isEmpty(values.weightSetting)) {
      dataSubmit["otherSetting"] = values.otherSetting;
    }

    if (dataSubmit && dataSubmit.otherSetting.lowScore <= 0) {
      setRiskLevelErrors({
        ...riskLevelErrors,
        low: true,
      });
      return snackActions.error(
        formatMessage({ id: "appModule.form.error.lowLessThan0" })
      );
    }

    if (
      dataSubmit &&
      dataSubmit.otherSetting.lowScore >= dataSubmit.otherSetting.mediumScore
    ) {
      setRiskLevelErrors({
        ...riskLevelErrors,
        low: true,
      });
      return snackActions.error(
        formatMessage({ id: "appModule.form.error.lowOver" })
      );
    }

    setRiskLevelErrors({
      low: false,
      medium: false,
      high: false,
    });

    setLoading(true);
    /**
     * Check if data no change
     */
    if (dataSubmit.name === detail.name) {
      /**
       * Check if name have datetime
       */
      if (detail.name) {
        var currentTimeWithName =
          formatDate(new Date(), "YYYYMMDDHHmmSS") + "-" + dataSubmit.name;
        let dateTimeName = detail.name.split("-");
        if (dateTimeName[1]) {
          currentTimeWithName =
            formatDate(new Date(), "YYYYMMDDHHmmSS") + "-" + dateTimeName[1];
        }
      }
      dataSubmit["name"] = currentTimeWithName;
    }

    dispatch(SETTING_DJ_SCORING_ACTION_SAVE(dataSubmit))
      .then(() => {
        setLoading(false);
        onPressGoBack();
      })
      .catch(() => {
        setLoading(false);
        return snackActions.error(<IntlMessages id="notification.error" />);
      });
  };

  const onPressGoBack = () => {
    history.push({
      pathname: SETTING_DJ_SCORING_ROUTE_INDEX,
    });
  };

  const TabPanel = memo((props) => {
    const { value } = props;
    const { fatfPepScore, weightSetting, otherSetting } = listScoreScoring;

    switch (value) {
      case 0:
        return (
          <RiskLevel
            isDisabled={!listScoreScoring.isActive || disabled}
            data={otherSetting}
            errors={riskLevelErrors}
          />
        );
      case 1:
        return (
          <WeightTab
            isDisabled={!listScoreScoring.isActive || disabled}
            data={weightSetting}
            {...props}
          />
        );
      case 2:
        return (
          <FATFScoring
            isDisabled={!listScoreScoring.isActive || disabled}
            data={fatfPepScore}
            {...props}
          />
        );

      default:
        return;
    }
  });

  return (
    <div className={styles.scoringWrapper}>
      <PageHeading
        title={<IntlMessages id={"setting.scoring"} />}
        match={match}
        style={{ marginTop: toRem(20) }}
        customUrlResolver={(index, sub, isLast) => {
          if (isLast) {
            return ListTabTable[value].label;
          }
          switch (sub) {
            case "kyc":
              return [null, null, null, true];

            case "dow-jones":
              return [
                <IntlMessages id={"url.dj-kyc"} />,
                generatePath(SETTING_DJ_SCORING_ROUTE_INDEX),
                true,
              ];
            case "scoring":
              return [
                <IntlMessages id={"setting.kyc.breadcrumb.scoring"} />,
                null,
                false,
              ];
            default:
              break;
          }
        }}
      />

      <Formik
        innerRef={formikScore}
        initialValues={Object.assign({
          id: detail.id,
          name: detail.name,
          description: detail.description,
          isActive: true,
          fatfPepScore: detail.fatfPepScore,
          otherSetting: detail.otherSetting,
          weightSetting: detail.weightSetting,
        })}
        enableReinitialize={true}
        onSubmit={!disabled && onSaveScreenScoring}
        validationSchema={AddSchema}
        validateOnChange={true}
        validateOnBlur={true}
        validateOnMount={true}
      >
        {({ errors }) => {
          return (
            <LoadingWrapper loading={loading}>
              <Form>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <div className={clsx(styles.header)}>
                      <div style={{ marginRight: toRem(17) }}>
                        <SvgIcon
                          className={styles.iconBack}
                          onClick={() =>
                            history.push(SETTING_DJ_SCORING_ROUTE_INDEX)
                          }
                          component={IcoArrowPrevious}
                          viewBox={"0 0 8 14"}
                        />
                      </div>
                      <Typography variant="titleForm">
                        Risk Level Scoring
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={9}>
                    <div className={styles.leftContent}>
                      <JRCard>
                        <TabCustom value={value} handleChange={handleChange} />
                        <div className={styles.tabPanel}>
                          <TabPanel value={value} {...props} />
                        </div>
                      </JRCard>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    <div className={styles.scoreSetting}>
                      <JRCard
                        header={<IntlMessages id={"Score Settings"} />}
                        headerLine
                      >
                        <TextField
                          disabled={!detail.isActive || disabled}
                          fullWidth
                          name={"name"}
                          formik
                          placeholder={formatMessage({
                            id: "FileName",
                          })}
                          label={formatMessage({
                            id: "setting.scoring.fileName",
                          })}
                          {...(errors.name && {
                            error: true,
                            helperText: errors.name,
                          })}
                          variant="outlined"
                          required
                        />
                        <div style={{ height: toRem(40) }}></div>
                        <TextField
                          className={clsx("mt-4")}
                          disabled={!detail.isActive || disabled}
                          fullWidth
                          name={"description"}
                          multiline
                          formik
                          rows={4}
                          placeholder={formatMessage({
                            id: "Type your description here.",
                          })}
                          label={formatMessage({
                            id: "setting.scoring.description",
                          })}
                          {...(errors.description && {
                            error: true,
                            helperText: errors.description,
                          })}
                          variant="outlined"
                        />
                      </JRCard>
                    </div>
                  </Grid>
                </Grid>
                {!disabled && (
                  <div className={styles.ButtonGroup}>
                    <div
                      className={
                        "flex-end                                                                                                                                                                                                                                                                              "
                      }
                    >
                      <Button variant="containedWhite" onClick={onPressGoBack}>
                        <IntlMessages id="customer.dialog.cancel" />
                      </Button>
                      {detail && detail.isActive && (
                        <Fragment>
                          <Button
                            className={clsx("ml-3 mr-3")}
                            variant="containedWhite"
                            onClick={onPressResetForm}
                          >
                            <IntlMessages id="appModule.reset" />
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                          >
                            <IntlMessages id="customer.dialog.save" />
                          </Button>
                        </Fragment>
                      )}
                    </div>
                  </div>
                )}
              </Form>
            </LoadingWrapper>
          );
        }}
      </Formik>
    </div>
  );
});

export default ScoringDJ;
