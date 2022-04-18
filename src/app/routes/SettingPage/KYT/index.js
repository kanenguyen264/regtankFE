import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Button, ResetButton } from "@protego/sdk/RegtankUI/v1/Button";
import TextField from "@protego/sdk/RegtankUI/v1/TextField/TextFieldOutlined";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
  withStyles,
} from "@material-ui/core/styles";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";

import {
  SETTING_KYT_DETAIL,
  SETTING_KYT_DETAIL_SAVE,
} from "actions/SettingScoringAction";
import clsx from "clsx";
import { parseInt } from "lodash";
import React, { Fragment } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { snackActions } from "util/snackbarUtils";
import styles from "./kytStyle.module.scss";
import { withACL } from "../../../../acl";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#F5F5F5",
    color: "#707070",
    fontSize: 17,
    fontWeight: "500",
  },
}))(TableCell);

const useStyles = makeStyles((theme) => ({
  tableRow: {
    background: "#F5F5F5",
  },
  tableCellLevel: {
    width: theme.typography.pxToRem(220),
  },
  tableCellScore: {
    width: theme.typography.pxToRem(150),
  },
  tableCellDescription: {
    paddingLeft: theme.typography.pxToRem(150),
  },
}));

const Header = () => {
  return (
    <Fragment>
      <PageHeading
        title={<IntlMessages id={"setting.kyt.header"} />}
        customUrlResolver={(index, sub) => {
          switch (index) {
            case 1:
              return [
                <IntlMessages id={"setting.kyt.breadcrumb.settings"} />,
                null,
                false,
              ];
            case 2:
              return [<IntlMessages id={"setting.kyt.header"} />, null, false];
            case 3:
              return [
                <IntlMessages id={"setting.kyt.breadcrumb.kyt"} />,
                false,
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

const theme = createMuiTheme({
  overrides: {
    // Style sheet name ⚛️
    MuiTableHead: {
      root: {
        backgroundColor: "#F5F5F5",
      },
    },

    MuiInputBase: {
      root: {
        backgroundColor: "#F5F5F5",
      },
    },
  },
});

const Content = ({ isEditable = true }) => {
  const dispatch = useDispatch();
  const { settingKyt } = useSelector((state) => state.settingScoring);
  const [low, setLow] = React.useState(""),
    [lowError, setLowError] = React.useState(false),
    [medium, setMedium] = React.useState(""),
    [mediumError, setMediumError] = React.useState(false),
    [messageError, setMessageError] = React.useState(""),
    [high, setHigh] = React.useState(""),
    [loading, setLoading] = React.useState(false);
  const classes = useStyles();
  const { formatMessage } = useIntl();

  React.useEffect(() => {
    fetchKYTDetail();
    // eslint-disable-next-line
  }, [dispatch]);

  React.useEffect(() => {
    if (settingKyt && settingKyt.riskLevelSetting) {
      setLoading(false);
      setLow(settingKyt.riskLevelSetting.LOW);
      setMedium(settingKyt.riskLevelSetting.MEDIUM);
      setHigh(settingKyt.riskLevelSetting.HIGH);
    }
  }, [settingKyt]);

  const fetchKYTDetail = () => {
    dispatch(SETTING_KYT_DETAIL());
  };

  const isNumeric = (value) => {
    var regex = /^[+]*[0-9]*$/;
    if (!regex.test(value)) {
      return false;
    }
    return true;
  };

  const onChangeMedium = (e) => {
    if (isNumeric(e.target.value) && e.target.value.length < 3) {
      setMedium(e.target.value);
    }
  };
  const onChangeLow = (e) => {
    if (isNumeric(e.target.value) && e.target.value.length < 3) {
      setLow(e.target.value);
    }
  };
  const onPressReset = () => {
    setLoading(true);
    fetchKYTDetail();
  };
  const onPressSave = () => {
    try {
      if (low < 10 && medium < 10 && low < medium) {
        setLoading(true);
        let riskLevelSettingObj = settingKyt.riskLevelSetting;
        const newObj = {
          ...riskLevelSettingObj,
          LOW: parseInt(low),
          MEDIUM: parseInt(medium),
          HIGH: 10,
        };
        let settingKytSubmit = {
          ...settingKyt,
          riskLevelSetting: newObj,
        };

        dispatch(SETTING_KYT_DETAIL_SAVE({ settingKytSubmit })).then(
          (result) => {
            setLoading(false);
            if (result && result.data) {
              /**
               * Check response data
               */
              return snackActions.success(
                formatMessage({ id: "notification.success" })
              );
            }
            return snackActions.error(
              formatMessage({ id: "notification.error" })
            );
          }
        );
        setLowError(false);
        setMediumError(false);
      } else {
        if (parseInt(low) >= parseInt(medium)) {
          setMediumError(false);
          setLowError(true);
          setMessageError(
            formatMessage({ id: "appModule.form.error.lowOver" })
          );
          return;
        } else if (parseInt(medium) >= 10) {
          setMediumError(true);
          setLowError(false);
          setMessageError(
            formatMessage({ id: "appModule.form.error.mediumOver" })
          );
          return;
        } else {
          setLowError(true);
          setMediumError(false);
          setMessageError(
            formatMessage({ id: "appModule.form.error.mediumOver" })
          );
          return;
        }
      }
    } catch (error) {}
  };

  return (
    <Fragment>
      <ThemeProvider theme={theme}>
        <Fragment>
          <LoadingWrapper loading={loading}>
            <TableContainer className={styles.tableCustom}>
              <Table aria-label="setting kyt">
                <TableHead>
                  <TableRow className={classes.tableRow}>
                    <StyledTableCell className={styles.riskLevelCol}>
                      <IntlMessages id="setting.tab.other.RiskLevel" />
                    </StyledTableCell>
                    <StyledTableCell align="left" className={styles.scoreCol}>
                      <IntlMessages id="setting.tab.other.Score" />
                    </StyledTableCell>
                    <StyledTableCell>
                      <IntlMessages id="setting.tab.other.Description" />
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell
                      style={{
                        color: "#21A453",
                        fontWeight: "bold",
                      }}
                    >
                      <IntlMessages id="setting.table.Low" />
                    </TableCell>
                    <TableCell align="left">
                      <div className={styles.inputScoring}>
                        <TextField
                          disabled={!isEditable}
                          name="riskScoreLow"
                          value={low}
                          className={clsx(
                            styles.tableCellInput,
                            styles.inputScore
                          )}
                          InputProps={{ disableUnderline: true }}
                          inputProps={{
                            min: 0,
                          }}
                          onChange={(e) => onChangeLow(e)}
                        ></TextField>
                      </div>
                    </TableCell>
                    <TableCell className={styles.tableCellDescription}>
                      <div>
                        <IntlMessages id="setting.table.ARiskScoreFrom" />
                        {`0`}
                        <IntlMessages id="setting.table.to" />
                        {`${low}`}
                        <IntlMessages id="setting.table.hasALowRisk" />
                        {lowError && (
                          <div className={styles.errorTitle}>
                            {messageError}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{
                        color: "#FEBE2D",
                        fontWeight: "bold",
                      }}
                    >
                      <IntlMessages id="setting.table.Medium" />
                    </TableCell>
                    <TableCell align="left">
                    <div className={styles.inputScoring}>
                      <TextField
                        disabled={!isEditable}
                        className={clsx(
                          styles.tableCellInput,
                          styles.inputScore
                        )}
                        InputProps={{ disableUnderline: true }}
                        inputProps={{
                          min: 0,
                        }}
                        name="riskScoreMedium"
                        value={medium}
                        onChange={(e) => onChangeMedium(e)}
                      ></TextField></div>
                    </TableCell>
                    <TableCell className={classes.tableCellDescription}>
                      <div>
                        <IntlMessages id="setting.table.ARiskScoreFrom" />
                        {Number(low) + 1}
                        <IntlMessages id="setting.table.to" />
                        {medium}
                        <IntlMessages id="setting.table.hasAMediumRisk" />
                      </div>
                      {mediumError && (
                        <div className={styles.errorTitle}>{messageError}</div>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{
                        color: "#D44333",
                        fontWeight: "bold",
                      }}
                    >
                      <IntlMessages id="setting.table.High" />
                    </TableCell>
                    <TableCell align="left">
                    <div className={styles.inputScoring}>
                      <TextField
                        disabled={true}
                        className={clsx(
                          styles.tableCellInput,
                          styles.inputScore
                        )}
                        InputProps={{ disableUnderline: true }}
                        inputProps={{
                          min: 0,
                        }}
                        value={high}
                        name="riskScoreHigh"
                      ></TextField></div>
                    </TableCell>
                    <TableCell className={styles.tableCellDescription}>
                      <div>
                        <IntlMessages id="setting.table.ARiskScoreFrom" />
                        {Number(medium) + 1}
                        <IntlMessages id="setting.table.to" />
                        {`10`}
                        <IntlMessages id="setting.table.hasAHighRisk" />
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              {isEditable && (
                <div className={styles.footerTable}>
                  <div className={"flex-end"}>
                    <ResetButton
                      className={clsx(styles.ButtonSize)}
                      onClick={onPressReset}
                    >
                      <IntlMessages id="appModule.reset" />
                    </ResetButton>
                    <Button
                      className={clsx(styles.ButtonSize, "ml-3")}
                      variant="contained"
                      color="primary"
                      onClick={isEditable && onPressSave}
                    >
                      <IntlMessages id="customer.dialog.save" />
                    </Button>
                  </div>
                </div>
              )}
            </TableContainer>
          </LoadingWrapper>
        </Fragment>
      </ThemeProvider>
    </Fragment>
  );
};

const SettingKYT = function SettingKYT({ ACL }) {
  const isEditable = ACL.isAllowedPermissions("SETTING_KYT_EDIT");

  return (
    <div className={styles.kytSettingWrapper}>
      <Header />
      <Content isEditable={isEditable} />
      {/* <Activities /> */}
    </div>
  );
};

export default withACL(SettingKYT);
