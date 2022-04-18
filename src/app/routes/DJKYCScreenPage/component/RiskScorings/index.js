import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Collapse,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { makeStyles, withStyles } from "@mui/styles";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import ToolTipMore from "components/ToolTip";
import {
  LIGHT_GRAY,
  WHITE,
  BORDER_COLOR,
  GRAY_LIGHT,
} from "constants/ThemeColors";
import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./style.module.scss";
import clsx from "clsx";
const StyledTableCell = withStyles()(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: WHITE,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    width: "100%",
    "& .MuiTableCell-root": {
      borderBottom: "unset",
    },
  },
  brRowKey: {
    background: LIGHT_GRAY,
    fontWeight: "bold",
  },
  rowHead: {
    height: toRem(48),
    backgroundColor: GRAY_LIGHT,
  },
  row: {
    height: toRem(52),
    "& .MuiTableRow-root": {
      width: "100%",
    },
    "& .MuiTableCell-root": {
      borderBottom: `1px solid ${BORDER_COLOR}`,
    },
  },
  marginTitleGroup: {
    marginLeft: toRem(15),
  },
});

/**
 *
 * @param {KycIndividualRiskScoreEntity} scoring
 * @returns {JSX.Element}
 * @constructor
 */
export default function ListRiskScoring({ scoring }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [collaspeRiskcoreHeader, setCollaspeRiskcoreHeader] = React.useState(
    false
  );
  const [hideList, setHideList] = React.useState({
      lawEnforcement: true,
      pepScoreSetting: true,
      previouslySanction: true,
      adverseMedia: true,
      financialRegulator: true,
      isPersonSanction: true,
      isCountrySanction: true,
      /**
       * Country of Residence
       */
      fatfResidence: true,
      baselResidence: true,
      cpiResidence: true,
      /**
       * Country
       */
      fatfGoverment: true,
      baselGoverment: true,
      cpiGoverment: true,
      /**
       * nationality
       */
      fatfNationality: true,
      baselNationality: true,
      cpiNationality: true,
    }),
    listSetting = useSelector((state) => state.settingScoring),
    RiskTableRow = React.useCallback(
      ({ title, info, riskScore, headered = false, style = {}, tooltip }) => {
        return (
          <StyledTableRow className={`${classes.row}`} style={style}>
            <StyledTableCell className={headered ? classes.brRowKey : ""}>
              <div className={classes.marginTitleGroup}>
                <div className={clsx("d-flex", styles.mTableCell)}>
                  <Typography variant="subtitleGray">{title}</Typography>
                  {tooltip && (
                    <ToolTipMore placement="top-start" content={"PEP"} />
                  )}
                </div>
              </div>
            </StyledTableCell>
            <StyledTableCell
              align="left"
              className={headered && classes.brRowKey}
            >
              <Typography variant="subtitleGray">
                {typeof info === "boolean" ? (
                  info ? (
                    <IntlMessages id="yes" />
                  ) : (
                    <IntlMessages id="no" />
                  )
                ) : (
                  info
                )}
              </Typography>
            </StyledTableCell>
            <StyledTableCell
              align="left"
              className={headered ? classes.brRowKey : ""}
            >
              <Typography variant="subtitleGray">
                {scoring?.sanctionedPersonOrCountry?.info === true
                  ? "-"
                  : riskScore}
              </Typography>
            </StyledTableCell>
          </StyledTableRow>
        );
      },
      // eslint-disable-next-line
      [classes]
    );

  React.useEffect(() => {
    if (listSetting && listSetting.detail.weightSetting) {
      setHideList({
        isPersonSanction: listSetting.detail.weightSetting.isPersonSanction,
        isCountrySanction: listSetting.detail.weightSetting.isCountrySanction,
        lawEnforcement:
          listSetting.detail.weightSetting.lawEnforcement.isActive,
        pepScoreSetting:
          listSetting.detail.weightSetting.pepScoreSetting.isActive,
        previouslySanction:
          listSetting.detail.weightSetting.previouslySanction.isActive,
        adverseMedia: listSetting.detail.weightSetting.adverseMedia.isActive,
        financialRegulator:
          listSetting.detail.weightSetting.financialRegulator.isActive,
        /**
         * Country of Residence
         */
        fatfResidence: listSetting.detail.weightSetting.fatfResidence.isActive,
        baselResidence:
          listSetting.detail.weightSetting.baselResidence.isActive,
        cpiResidence: listSetting.detail.weightSetting.cpiResidence.isActive,
        /**
         * Country
         */
        fatfGoverment: listSetting.detail.weightSetting.fatfGoverment.isActive,
        baselGoverment:
          listSetting.detail.weightSetting.baselGoverment.isActive,
        cpiGoverment: listSetting.detail.weightSetting.cpiGoverment.isActive,
        /**
         * nationality
         */
        fatfNationality:
          listSetting.detail.weightSetting.fatfNationality.isActive,
        baselNationality:
          listSetting.detail.weightSetting.baselNationality.isActive,
        cpiNationality:
          listSetting.detail.weightSetting.cpiNationality.isActive,
      });
    }
  }, [listSetting]);

  const createData = (title, child, hideList, info, riskScore, tooltip) => {
    return {
      title,
      child,
      hideList,
      info,
      riskScore,
      tooltip,
    };
  };

  const rows = [
    createData(
      <IntlMessages id="sanctioned-person-or-country" />,
      null,
      hideList.isPersonSanction || hideList.isCountrySanction ? true : false,
      scoring.sanctionedPersonOrCountry.info,
      scoring.sanctionedPersonOrCountry.score,
      null
    ),
    createData(
      <IntlMessages id="pep" />,
      null,
      hideList.pepScoreSetting,
      {
        0: <IntlMessages id="kyc.notPep" />,
        1: <IntlMessages id="setting.table.Tier1" />,
        2: <IntlMessages id="setting.table.Tier2" />,
        3: <IntlMessages id="setting.table.Tier3" />,
        4: <IntlMessages id="setting.table.Tier4" />,
      }[scoring.pep.info] || "-",
      scoring.pep.score,
      true
    ),
    createData(
      <IntlMessages id="previously-sanctioned---person" />,
      null,
      hideList.previouslySanction,
      scoring.previouslySanctionedPerson.info,
      scoring.previouslySanctionedPerson.score,
      null
    ),
    createData(
      <IntlMessages id="financial-regulator" />,
      null,
      hideList.financialRegulator,
      scoring.financialRegulator.info,
      scoring.financialRegulator.score,
      null
    ),
    createData(
      <IntlMessages id="law-enforcement" />,
      null,
      hideList.lawEnforcement,
      scoring.lawEnforcement.info,
      scoring.lawEnforcement.score,
      null
    ),
    createData(
      <IntlMessages id="adverse-media" />,
      null,
      hideList.adverseMedia,
      scoring.adverseMedia.info,
      scoring.adverseMedia.score,
      null
    ),
    createData(
      <IntlMessages id={"kyc.idIssuingCountry"} />,
      [
        {
          hideList: hideList.baselResidence,
          title: "FATF",
          info: (
            <Nullable
              component={CountryFlagLanguage}
              valueProp={"countryCode"}
              svg
            >
              {scoring.idIssuingCountry.fatf.info}
            </Nullable>
          ),
          riskScore: <Nullable>{scoring.idIssuingCountry.fatf.score}</Nullable>,
        },
        {
          hideList: hideList.baselGoverment,
          title: <IntlMessages id="basel-aml-index" />,
          info: (
            <Nullable
              component={CountryFlagLanguage}
              valueProp={"countryCode"}
              svg
            >
              {scoring.idIssuingCountry.basel.info}
            </Nullable>
          ),
          riskScore: (
            <Nullable>{scoring.idIssuingCountry.basel.score}</Nullable>
          ),
        },
        {
          hideList: hideList.cpiGoverment,
          title: <IntlMessages id="corrupt-perception-index" />,
          info: (
            <Nullable
              component={CountryFlagLanguage}
              valueProp={"countryCode"}
              svg
            >
              {scoring.idIssuingCountry.cpi.info}
            </Nullable>
          ),
          riskScore: <Nullable>{scoring.idIssuingCountry.cpi.score}</Nullable>,
        },
      ],
      false,
      null,
      null,
      null
    ),
    createData(
      <IntlMessages id={"nationality"} />,
      [
        {
          hideList: hideList.fatfNationality,
          title: "FATF",
          info: (
            <Nullable
              component={CountryFlagLanguage}
              valueProp={"countryCode"}
              svg
              demonym
            >
              {scoring.nationality.fatf.info}
            </Nullable>
          ),
          riskScore: <Nullable>{scoring.nationality.fatf.score}</Nullable>,
        },
        {
          hideList: hideList.cpiNationality,
          title: <IntlMessages id="corrupt-perception-index" />,
          info: (
            <Nullable
              component={CountryFlagLanguage}
              valueProp={"countryCode"}
              svg
              demonym
            >
              {scoring.nationality.cpi.info}
            </Nullable>
          ),
          riskScore: <Nullable>{scoring.nationality.cpi.score}</Nullable>,
        },
      ],
      false,
      null,
      null,
      null
    ),
    createData(
      <IntlMessages id={"country-of-residence"} />,
      [
        {
          hideList: hideList.baselResidence,
          title: "FATF",
          info: (
            <Nullable
              component={CountryFlagLanguage}
              valueProp={"countryCode"}
              svg
            >
              {scoring.countryOfResidence.fatf.info}
            </Nullable>
          ),
          riskScore: (
            <Nullable> {scoring.countryOfResidence.fatf.score} </Nullable>
          ),
        },
        {
          hideList: hideList.baselResidence,
          title: <IntlMessages id="basel-aml-index" />,
          info: (
            <Nullable
              component={CountryFlagLanguage}
              valueProp={"countryCode"}
              svg
            >
              {scoring.countryOfResidence.basel.info}
            </Nullable>
          ),
          riskScore: (
            <Nullable> {scoring.countryOfResidence.basel.score}</Nullable>
          ),
        },
        {
          hideList: hideList.cpiResidence,
          title: <IntlMessages id="corrupt-perception-index" />,
          info: (
            <Nullable
              component={CountryFlagLanguage}
              valueProp={"countryCode"}
              svg
            >
              {scoring.countryOfResidence.cpi.info}
            </Nullable>
          ),
          riskScore: (
            <Nullable> {scoring.countryOfResidence.cpi.score}</Nullable>
          ),
        },
      ],
      false,
      null,
      null,
      null
    ),
  ];

  const Row = (props) => {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    return (
      <Fragment>
        {row?.child ? (
          <StyledTableRow className={`${classes.row}`}>
            <StyledTableCell
              className={classes.brRowKey}
              component="th"
              colSpan={3}
            >
              <span className="d-flex justify-content-between align-items-center">
                <div className={classes.marginTitleGroup}>
                  <Typography variant="labelFieldBlack">{row.title}</Typography>
                </div>
                {row?.child && (
                  <div>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      style={{ padding: 0 }}
                      onClick={() => setOpen(!open)}
                    >
                      {open ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </div>
                )}
              </span>
            </StyledTableCell>
          </StyledTableRow>
        ) : (
          collaspeRiskcoreHeader && (
            <RiskTableRow
              title={row.title}
              info={row.info}
              riskScore={row.riskScore}
              tooltip={row.tooltip}
            />
          )
        )}
        <TableRow>
          <TableCell
            style={{
              paddingBottom: 0,
              paddingTop: 0,
              paddingLeft: 0,
              paddingRight: 0,
            }}
            colSpan={3}
          >
            <Collapse in={open} timeout="0" unmountOnExit>
              {row.child?.map((data, index) => {
                const {
                  title,
                  info,
                  riskScore,
                  headered = false,
                  style = {},
                  tooltip,
                } = data;
                return (
                  <Table>
                    <TableHead>
                      <TableRow className={`${classes.row}`}>
                        <TableCell align="left" style={{ width: "60%" }}>
                          <div className={classes.marginTitleGroup}>
                            <div className={clsx("d-flex", styles.mTableCell)}>
                              <Typography variant={"subtitleGray"}>
                                {title}
                              </Typography>

                              {tooltip && (
                                <ToolTipMore
                                  content={"PEP"}
                                  placement={"left"}
                                />
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell align="left" style={{ width: "20%" }}>
                          <div className="d-flex align-items-center ">
                            <Typography variant={"subtitleGray"}>
                              {typeof info === "boolean" ? (
                                info ? (
                                  <IntlMessages id="yes" />
                                ) : (
                                  <IntlMessages id="no" />
                                )
                              ) : (
                                info
                              )}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell align="left" style={{ width: "20%" }}>
                          <div className="d-flex align-items-center ">
                            <Typography variant={"subtitleGray"}>
                              {scoring?.sanctionedPersonOrCountry?.info === true
                                ? "-"
                                : riskScore}
                            </Typography>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                  </Table>
                );
              })}
            </Collapse>
          </TableCell>
        </TableRow>
      </Fragment>
    );
  };

  return (
    <TableContainer component={Paper} className={styles.tableContainer}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow
            className={classes.rowHead}
            style={{
              borderBottom:
                !collaspeRiskcoreHeader && `1px solid ${BORDER_COLOR}`,
            }}
          >
            <StyledTableCell style={{ width: "60%" }}>
              <div className={classes.marginTitleGroup}>
                <Typography variant="labelFieldBlack">
                  <IntlMessages id="risk-parameter" />
                </Typography>
              </div>
            </StyledTableCell>
            <StyledTableCell align="left" style={{ width: "20%" }}>
              <Typography variant="labelFieldBlack">
                <IntlMessages id="information" />
              </Typography>
            </StyledTableCell>
            <StyledTableCell
              align="left"
              style={{ width: "20%" }}
              className={styles.cellHeaderHaveCollapse}
            >
              <span className="d-flex justify-content-between align-items-center">
                <div className={classes.marginTitleGroup}>
                  <Typography
                    variant="labelFieldBlack"
                    className={"labelCollapse"}
                  >
                    <IntlMessages id="risk-score" />
                  </Typography>
                </div>
                <div>
                  <IconButton
                    size="small"
                    style={{ padding: 0 }}
                    onClick={() => {
                      setCollaspeRiskcoreHeader(!collaspeRiskcoreHeader);
                    }}
                  >
                    {(collaspeRiskcoreHeader && <KeyboardArrowUpIcon />) || (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                </div>
              </span>
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <Row key={index} row={row} />
          ))}
        </TableBody>
        <TableRow>
          <StyledTableCell style={{ width: "60%" }} />
          <StyledTableCell align="left" style={{ width: "20%" }}>
            <Typography variant={"Subtitle2"}>
              <IntlMessages id={"setting.tab.weight.total"} />
            </Typography>
          </StyledTableCell>
          <StyledTableCell align="left" style={{ width: "20%" }}>
            <Typography variant={"Subtitle4"}>
              {scoring.idIssuingCountry.basel.score}
            </Typography>
          </StyledTableCell>
        </TableRow>
      </Table>
    </TableContainer>
  );
}
