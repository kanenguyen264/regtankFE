import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tooltipClasses } from "@mui/material/Tooltip";
import { makeStyles, withStyles } from "@mui/styles";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Nullable from "@protego/sdk/UI/Nullable";
import { toRem } from "@protego/sdk/utils/measurements";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import ToolTipMore from "components/ToolTip/downJoneToolTip";
import {
  BORDER_COLOR,
  GRAY_LIGHT,
  LIGHT_GRAY,
  WHITE,
} from "constants/ThemeColors";
import React, { Fragment, useState } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "util/string";
import styles from "./style.module.scss";

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <ToolTipMore {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 440,
  },
});

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

const specialInterestPersonLabel = {
  corruption: <IntlMessages id="djkyc.riskParameters.corruption" />,
  financialCrime: <IntlMessages id="djkyc.riskParameters.financialCrime" />,
  organizedCrime: <IntlMessages id="djkyc.riskParameters.organizedCrime" />,
  taxCrime: <IntlMessages id="djkyc.riskParameters.taxCrime" />,
  terror: <IntlMessages id="djkyc.riskParameters.terror" />,
  trafficking: <IntlMessages id="djkyc.riskParameters.trafficking" />,
};

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
    isSanctionsLists: true,
    activePep: true,
    inActivePep: true,
    ool: true,

    /**
     * SI
     */
    siCorruption: true,
    siFinancialCrime: true,
    siOrganizedCrime: true,
    siTaxCrime: true,
    siTerror: true,
    /**
     * SI-LT
     */
    siTrafficking: true,
    siltCorruption: true,
    siltFinancialCrime: true,
    siltOrganizedCrime: true,
    siltTaxCrime: true,
    siltTerror: true,
    siltTrafficking: true,

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
  });
  const intl = useIntl();

  const getTotalScore = (list) => {
    let sum = list.map((val) => {
      if (typeof val?.riskScore === "number") {
        return val?.riskScore;
      }
      if (typeof val?.riskScore !== "number") {
        let sumChild = val?.child?.map((item) => {
          if (typeof item.riskScore.props?.children === "number") {
            return item.riskScore.props?.children;
          }
          return item.riskScore.props?.children?.reduce(
            (prev, curr) => Number(prev) + Number(curr),
            0
          );
        });
        return sumChild.reduce((prev, curr) => prev + curr, 0);
      }
      return 0;
    });

    let total = sum.reduce((prev, curr) => prev + curr, 0);
    return total;
  };

  const listSetting = useSelector((state) => state.settingScoring),
    RiskTableRow = React.useCallback(
      ({ title, info, riskScore, headered = false, style = {}, tooltip }) => {
        return (
          <StyledTableRow className={`${classes.row}`} style={style}>
            <TableCell className={headered ? classes.brRowKey : ""}>
              <div className={classes.marginTitleGroup}>
                <div className={clsx("d-flex", styles.mTableCell)}>
                  <Typography variant="subtitleGray">{title}</Typography>
                  {tooltip && (
                    <CustomWidthTooltip
                      placement="top-start"
                      content={
                        title?.props?.id === "djkyc.riskParameters.inactivePEP"
                          ? "DowJonesInactivePEP"
                          : "DowJonesActivePEP"
                      }
                    />
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell align="left" className={headered && classes.brRowKey}>
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
            </TableCell>
            <TableCell
              align="left"
              className={headered ? classes.brRowKey : ""}
            >
              <Typography variant="subtitleGray">
                {scoring?.sanctionedPersonOrCountry?.info === true
                  ? "-"
                  : riskScore}
              </Typography>
            </TableCell>
          </StyledTableRow>
        );
      },
      // eslint-disable-next-line
      [classes]
    );

  React.useEffect(() => {
    if (listSetting && listSetting?.detailDj?.weightSetting) {
      setHideList({
        isSanctionsLists: listSetting.detailDj?.weightSetting?.isSanctionsLists,
        activePep: listSetting.detailDj?.weightSetting?.activePep?.isActive,
        inActivePep: listSetting.detailDj?.weightSetting?.inActivePep?.isActive,
        ool: listSetting.detailDj?.weightSetting?.ool?.isActive,
        /**
         * SI
         */
        siCorruption:
          listSetting.detailDj?.weightSetting?.siCorruption?.isActive,
        siFinancialCrime:
          listSetting.detailDj?.weightSetting?.siFinancialCrime?.isActive,
        siOrganizedCrime:
          listSetting.detailDj?.weightSetting?.siOrganizedCrime?.isActive,
        siTaxCrime: listSetting.detailDj?.weightSetting?.siTaxCrime?.isActive,
        siTerror: listSetting.detailDj?.weightSetting?.siTerror?.isActive,
        siTrafficking:
          listSetting.detailDj?.weightSetting?.siTrafficking?.isActive,

        /**
         * SILT
         */
        siltCorruption:
          listSetting.detailDj?.weightSetting?.siltCorruption?.isActive,
        siltFinancialCrime:
          listSetting.detailDj?.weightSetting?.siltFinancialCrime?.isActive,
        siltOrganizedCrime:
          listSetting.detailDj?.weightSetting?.siltOrganizedCrime?.isActive,
        siltTaxCrime:
          listSetting.detailDj?.weightSetting?.siltTaxCrime?.isActive,
        siltTerror: listSetting.detailDj?.weightSetting?.siltTerror?.isActive,

        /**
         * Country of Residence
         */
        fatfResidence:
          listSetting.detailDj?.weightSetting?.fatfResidence?.isActive,
        baselResidence:
          listSetting.detailDj?.weightSetting?.baselResidence?.isActive,
        cpiResidence:
          listSetting.detailDj?.weightSetting?.cpiResidence?.isActive,
        /**
         * Country
         */
        fatfGoverment:
          listSetting.detailDj?.weightSetting?.fatfGoverment?.isActive,
        baselGoverment:
          listSetting.detailDj?.weightSetting?.baselGoverment?.isActive,
        cpiGoverment:
          listSetting.detailDj?.weightSetting?.cpiGoverment?.isActive,
        /**
         * nationality
         */
        fatfNationality:
          listSetting.detailDj?.weightSetting?.fatfNationality?.isActive,
        baselNationality:
          listSetting.detailDj?.weightSetting?.baselNationality?.isActive,
        cpiNationality:
          listSetting.detailDj?.weightSetting?.cpiNationality?.isActive,
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

  const renderSI = (data, title, settings, type = "si") => {
    const filterList = Object.keys(data).filter((key) => {
      return (
        data[key]["info"] && settings[`${type}${capitalizeFirstLetter(key)}`]
      );
    });
    if (!filterList.length) {
      return createData(title, null, settings.siCorruption, false, 0, null);
    } else {
      filterList.map(function (key, index) {
        return createData(
          index === 0 ? title : "",
          null,
          settings,
          data[key]?.score || 0,
          specialInterestPersonLabel[key] || "",
          null
        );
      });
    }
  };
  const rows = [
    createData(
      <IntlMessages id="djkyc.riskParameters.sanctions" />,
      null,
      hideList.isSanctionsLists ? true : false,
      scoring?.sanctionList?.info,
      scoring?.sanctionList?.score,
      null
    ),
    createData(
      <IntlMessages id="djkyc.riskParameters.activePEP" />,
      null,
      hideList.activePep,
      {
        0: <IntlMessages id="appModule.hyphen" />,
        1: <IntlMessages id="setting.table.Tier1" />,
        2: <IntlMessages id="setting.table.Tier2" />,
        3: <IntlMessages id="setting.table.Tier3" />,
        4: <IntlMessages id="setting.djkyc.RCA" />,
      }[scoring.activePep.info] || "-",
      scoring.activePep?.score,
      true
    ),
    createData(
      <IntlMessages id="djkyc.riskParameters.inactivePEP" />,
      null,
      hideList.inActivePep,
      {
        0: "",
        1: "DowJonesTier1",
        2: "DowJonesTier2",
        3: "DowJonesTier3",
        4: "DowJonesRCA",
      }[scoring.inActivePep.info] || "-",
      scoring.inActivePep?.score,
      true
    ),
    /* OOL */
    createData(
      <IntlMessages id="djkyc.riskParameters.OOL" />,
      null,
      hideList.ool,
      scoring?.otherOfficialLists?.info,
      scoring?.otherOfficialLists?.score,
      null
    ),
    /* SI */
    renderSI(
      scoring.specialInterestPerson,
      <FormattedHTMLMessage id="djkyc.riskParameters.SI" />,
      hideList
    ),
    /* SI-LT */
    renderSI(
      scoring.specialInterestPersonLowerThreshold,
      <FormattedHTMLMessage id="djkyc.riskParameters.SILT" />,
      hideList,
      "silt"
    ),

    /* IdIssuingCountry */
    createData(
      <IntlMessages id={"kyc.idIssuingCountry"} />,
      [
        {
          hideList: hideList.fatfGoverment,
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
          hideList: hideList.baselNationality,
          title: <IntlMessages id="basel-aml-index" />,
          info: (
            <Nullable
              component={CountryFlagLanguage}
              valueProp={"countryCode"}
              svg
              demonym
            >
              {scoring.nationality.basel.info}
            </Nullable>
          ),
          riskScore: <Nullable>{scoring.nationality.basel.score}</Nullable>,
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
          hideList: hideList.fatfResidence,
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
            <TableCell className={classes.brRowKey} component="th" colSpan={3}>
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
            </TableCell>
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
                                <CustomWidthTooltip
                                  content={"DowJonesActivePEP"}
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
            <TableCell style={{ width: "60%" }}>
              <div className={classes.marginTitleGroup}>
                <Typography variant="labelFieldBlack">
                  <IntlMessages id="risk-parameter" />
                </Typography>
              </div>
            </TableCell>
            <TableCell align="left" style={{ width: "20%" }}>
              <Typography variant="labelFieldBlack">
                <IntlMessages id="information" />
              </Typography>
            </TableCell>
            <TableCell
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
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <Row key={index} row={row} />
          ))}
        </TableBody>
        <TableRow>
          <TableCell style={{ width: "60%" }} />
          <TableCell align="left" style={{ width: "20%" }}>
            <Typography variant={"Subtitle2"}>
              <IntlMessages id={"setting.tab.weight.total"} />
            </Typography>
          </TableCell>
          <TableCell align="left" style={{ width: "20%" }}>
            <Typography variant={"Subtitle4"}>{getTotalScore(rows)}</Typography>
          </TableCell>
        </TableRow>
      </Table>
    </TableContainer>
  );
}
