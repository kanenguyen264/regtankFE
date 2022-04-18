//@flow
import { capitalizeFirst } from "@protego/sdk/utils/string";
import { Image, StyleSheet, Text, View, Link } from "@react-pdf/renderer";
import Keyword from "app/reports/components/Keyword";
import Status from "app/reports/components/Status";
import Category from "app/reports/components/Category";
import ReportNote from "app/reports/components/ReportNote";
import Table from "app/reports/components/Table";
import { TableCell } from "app/reports/components/Table/TableCell";
import { TableRow } from "app/reports/components/Table/TableRow";
import globalStyle from "app/reports/styles";
import React from "react";
import { useIntl } from "react-intl";
import { compose } from "recompose";
import { countryCodeToName } from "util/country";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { getRiskLevel } from "util/riskLevel";
import ReportLayout from "../components/ReportLayout";
import SSFATFScoreTable from "../components/SSFATFScoreTable/SSFATFScoreTable";
import SSOtherSettingTable from "../components/SSOtherSettingTable/SSOtherSettingTable";
import SSWeightSettingTable from "../components/SSWeightSettingTable/SSWeightSettingTable";
import withReportProvider from "../components/withReportProvider";
import { renderUser } from "../utils";
import TableEmpty from "app/reports/components/Table/TableEmpty";
import { isEmptyValues } from "util/array";
import useTextMeasurement from "../components/useTextMeasurement";
import { getHostURL, validURL } from "util/url";

const localStyle = StyleSheet.create({
  ...globalStyle,
  titleForRiskSetting: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 9,
    textTransform: "uppercase",
  },
  titleForSubMatch: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 24,
    textTransform: "uppercase",
  },
});

const contextual = {
  LOW: ["Low", "#4CAF4F"],
  MEDIUM: ["Medium", "#FF9800"],
  HIGH: ["High", "#EA2134"],
};
const toBool = (v) => (v ? "Yes" : "No"),
  nullable = (v) => v ?? "-";

const DJKYCRiskScoringReport = compose(withReportProvider)(
  /**
   *
   * @param {RiskScoringReportProps} props
   * @returns {null}
   * @constructor
   */
  function DJKYCRiskScoringReport(props) {
    const { formatMessage, formatHTMLMessage } = useIntl();
    const textMeasurement = useTextMeasurement();
    const {
      riskScoring,
      notesDetail,
      chartSetting,
      chartKyc,
      company,
      matchNotesDetail,
      enableReScreening,
    } = props;
    const scoringSetting = props.scoring;
    const matchInfo = riskScoring.positiveMatch;
    const kycBlacklistMatches =
      riskScoring?.kycBlacklistMatches?.length > 0
        ? riskScoring.kycBlacklistMatches
        : [];
    const textRiskScore = (value) => {
      switch (value) {
        case "Low":
          return formatMessage({ id: "appModule.riskScoreLevel.low" });
        case "Medium":
          return formatMessage({ id: "appModule.riskScoreLevel.medium" });
        case "High":
          return formatMessage({ id: "appModule.riskScoreLevel.high" });
        default:
          break;
      }
    };

    const getTitle = React.useCallback((item, isUrl = false) => {
      let nameUrl = "";
      if (item.title && !isUrl) {
        nameUrl = item.title;
      } else {
        const { originalUrl, c6Url } = item;
        const urlCombine = originalUrl || c6Url;
        nameUrl = validURL(urlCombine ? urlCombine : "")
          ? getHostURL(urlCombine)
          : urlCombine;
      }
      return nameUrl;
    }, []);

    const sanction =
      riskScoring?.scoring?.sanctionedPersonOrCountry?.info === true || false;

    const header = {
      headerTitle: ["DOW JONES KYC", "RISK ASSESSMENT REPORT"],
      subHeaderTitle: riskScoring.kycId,
      title: "KNOW YOUR CUSTOMER (DOW JONES KYC)",
      subTitle: "RISK ASSESSMENT REPORT",
    };

    const getColorText = (level) => {
      const levelObj = getRiskLevel(level);
      return levelObj?.color || "#000000";
    };

    const renderPrinterInfo = () => {
      return (
        <Table>
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "company-name" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {company.company}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyt.assignee" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {riskScoring?.assignee ? renderUser(riskScoring?.assignee) : "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "report.createdDate" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {formatDate(riskScoring?.request?.createdAt, LONG_DATE_TIME)}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "report.createdBy" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {riskScoring?.request?.createdBy
                ? renderUser(riskScoring.request.createdBy)
                : "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell weighting={2} style={localStyle.tableTitleHorizontal}>
              {formatMessage({ id: "last-modified-date" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {riskScoring.request.updatedAt
                ? formatDate(riskScoring.request.updatedAt, LONG_DATE_TIME)
                : "-"}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "last-modified-by" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {riskScoring.request.lastModifiedBy
                ? renderUser(riskScoring.request.lastModifiedBy)
                : "-"}
            </TableCell>
          </TableRow>
          {(riskScoring.status === "APPROVED" ||
            riskScoring.status === "REJECTED") && (
            <TableRow>
              <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
                {
                  {
                    APPROVED: formatMessage({ id: "kyc.lastApprovedDate" }),
                    REJECTED: formatMessage({ id: "kyc.lastRejectedDate" }),
                  }[riskScoring.status]
                }
              </TableCell>
              <TableCell
                style={localStyle.tableContentHorizontal}
                weighting={3}
              >
                {formatDate(
                  riskScoring?.statusChangedBy?.updatedAt,
                  LONG_DATE_TIME
                )}
              </TableCell>
              <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
                {
                  {
                    APPROVED: formatMessage({ id: "kyc.lastApprovedBy" }),
                    REJECTED: formatMessage({ id: "kyc.lastRejectedBy" }),
                  }[riskScoring.status]
                }
              </TableCell>
              <TableCell
                style={localStyle.tableContentHorizontal}
                weighting={3}
              >
                {riskScoring?.statusChangedBy?.lastModifiedBy
                  ? renderUser(riskScoring?.statusChangedBy?.lastModifiedBy)
                  : "-"}
              </TableCell>
            </TableRow>
          )}

          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "date-printed" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {formatDate(new Date(), LONG_DATE_TIME)}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "printed-by" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {props.printedBy ? renderUser(props.printedBy) : "-"}
            </TableCell>
          </TableRow>
        </Table>
      );
    };

    const renderTotalRiskScore = () => {
      return (
        <View>
          {/* Total Risk Score / Level */}
          <Table>
            <TableRow>
              <TableCell
                style={[localStyle.tableTitleRiskLevelHorizontal]}
                weighting={10}
              >
                {formatMessage({ id: "total-rick-score" })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                weighting={10}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  border: "1pt solid #F5F5F5",
                  height: 162,
                }}
              >
                <Image
                  style={{ width: 110, marginBottom: 10 }}
                  src={chartKyc}
                />
                {!sanction ? (
                  <Text
                    style={{
                      fontWeight: 700,
                      fontSize: 28,
                      color: getColorText(riskScoring?.scoring?.riskLevel),
                    }}
                  >
                    {Math.round(riskScoring?.scoring?.risk)}
                  </Text>
                ) : (
                  <View
                    style={{
                      backgroundColor: getColorText(
                        riskScoring?.scoring?.riskLevel
                      ),
                      borderRadius: 20,
                      padding: "2px 8px",
                      marginBottom: 5,
                      marginTop: -10,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: 600,
                        fontSize: 10,
                        color: "#fff",
                      }}
                    >
                      {formatMessage({
                        id: "appModule.totalRiskScore.sanction",
                      })}
                    </Text>
                  </View>
                )}
                {enableReScreening && (
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ fontWeight: 400, fontSize: 9 }}>
                      {formatMessage({ id: "kyc.filter.rescreening" })}
                      {": "}
                    </Text>
                    <Text style={{ fontWeight: 700, fontSize: 9 }}>
                      {riskScoring?.scoring?.reScreeningPeriod}{" "}
                      {formatMessage({ id: "setting.tab.other.months" })}
                    </Text>
                  </View>
                )}
              </TableCell>
            </TableRow>
          </Table>

          {/* Risk Score History */}
          <Table>
            <TableRow>
              <TableCell
                style={[localStyle.tableTitleRiskLevelHorizontal]}
                weighting={10}
              >
                {formatMessage({ id: "kyc.riskScoreHistory" })}
              </TableCell>
            </TableRow>
            {riskScoring?.scoring?.changeHistory.map((item, index) => {
              return (
                <Table key={index}>
                  {index % 2 !== 0 || (
                    <TableRow style={{ marginBottom: 100 }}></TableRow>
                  )}
                  <TableRow includeTopBorder>
                    <TableCell
                      style={localStyle.tableTitleHorizontal}
                      weighting={95}
                      totalWeight={495}
                    >
                      {formatMessage({ id: "kyc.labelPreviousScore" })}
                    </TableCell>
                    <TableCell
                      style={localStyle.tableContentHorizontal}
                      weighting={207}
                      totalWeight={495}
                    >
                      {item.previousScore
                        ? Math.round(item.previousScore)
                        : "-"}
                    </TableCell>
                    <TableCell
                      style={localStyle.tableTitleHorizontal}
                      weighting={95}
                      totalWeight={495}
                    >
                      {formatMessage({ id: "kyb.table.risk.level" })}
                    </TableCell>
                    <TableCell weighting={97} totalWeight={495}>
                      {item.previousScoreRiskLevel ? (
                        <Text
                          style={{
                            color: contextual[item.previousScoreRiskLevel][1],
                          }}
                        >
                          {textRiskScore(
                            contextual[item.previousScoreRiskLevel][0]
                          )}
                        </Text>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={localStyle.tableTitleHorizontal}
                      weighting={95}
                      totalWeight={495}
                    >
                      {formatMessage({ id: "kyb.labelLastEditedBy" })}
                    </TableCell>
                    <TableCell
                      style={localStyle.tableContentHorizontal}
                      weighting={207}
                      totalWeight={495}
                    >
                      {item.lastModifiedBy
                        ? renderUser(item.lastModifiedBy)
                        : "-"}
                    </TableCell>
                    <TableCell
                      style={localStyle.tableTitleHorizontal}
                      weighting={95}
                      totalWeight={495}
                    >
                      {formatMessage({ id: "kyb.labelDateTime" })}
                    </TableCell>
                    <TableCell
                      style={localStyle.tableContentHorizontal}
                      weighting={97}
                      totalWeight={495}
                    >
                      {item.updatedAt
                        ? formatDate(item.updatedAt, LONG_DATE_TIME)
                        : "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={localStyle.tableTitleHorizontal}
                      weighting={95}
                      totalWeight={495}
                    >
                      {formatMessage({ id: "result.Table.Notes" })}
                    </TableCell>
                    <TableCell
                      style={localStyle.tableContentHorizontal}
                      weighting={400}
                      totalWeight={495}
                    >
                      {textMeasurement(item.note, 600)}
                    </TableCell>
                  </TableRow>
                </Table>
              );
            })}
          </Table>
        </View>
      );
    };

    const renderScreeningDetails = () => {
      return (
        <Table>
          {/* Name */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "name" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {riskScoring.request.name}
            </TableCell>
          </TableRow>
          {/* gender */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "gender" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {riskScoring?.request?.gender
                ? capitalizeFirst(riskScoring.request.gender)
                : "-"}
            </TableCell>
          </TableRow>
          {/* Reference ID */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "reference-id" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {riskScoring.request.referenceId ?? "-"}
            </TableCell>
          </TableRow>
          {/* yearOfBirth and  date-of-birth  */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyc.yearOfBirth" })}
            </TableCell>
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {riskScoring.request.yearOfBirth ?? "-"}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "date-of-birth" })}
            </TableCell>
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {riskScoring.request.dateOfBirth
                ? formatDate(riskScoring.request.dateOfBirth, LONG_DATE_TIME)
                : "-"}
            </TableCell>
          </TableRow>
          {/* place-of-birth and  nationality  */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "place-of-birth" })}
            </TableCell>
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {countryCodeToName(riskScoring.request.placeOfBirth) || "-"}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "nationality" })}
            </TableCell>
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {countryCodeToName(riskScoring.request.nationality, "demonym") ||
                "-"}
            </TableCell>
          </TableRow>
          {/* phone-number */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "phone-number" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {riskScoring.request.phone ?? "-"}
            </TableCell>
          </TableRow>
          {/* Email Address */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "email-address" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {riskScoring.request.email ?? "-"}
            </TableCell>
          </TableRow>
          {/* government-id-number */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "government-id-number" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {riskScoring.request.governmentIdNumber ?? "-"}
            </TableCell>
          </TableRow>
          {/* ID Issuing Country */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "form.idIssuingCountry" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {countryCodeToName(riskScoring.request.idIssuingCountry) || "-"}
            </TableCell>
          </TableRow>
          {/* address-line-1 */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "address-line-1" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {riskScoring.request.address1 ?? "-"}
            </TableCell>
          </TableRow>
          {/* address-line-2 */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "address-line-2" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {riskScoring.request.address2 ?? "-"}
            </TableCell>
          </TableRow>
          {/* country-of-residence*/}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "country-of-residence" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {countryCodeToName(riskScoring.request.countryOfResidence) || "-"}
            </TableCell>
          </TableRow>
          {/* keyword */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "case.detail.table.kyc.header.keyword",
              })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              <Keyword
                keywords={riskScoring?.request?.keywords || "-"}
              ></Keyword>
            </TableCell>
          </TableRow>
        </Table>
      );
    };
    const renderBlacklistDetails = (item, index) => {
      return (
        <Table key={index}>
          {/* Name */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "name" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {item?.kycBlacklist?.fullName}
            </TableCell>
          </TableRow>
          {/* Blacklist ID */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "setting.blacklist.table.blackListId" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {item?.kycBlacklist?.blacklistId}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyc.yearOfBirth" })}
            </TableCell>
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {item?.kycBlacklist?.yearOfBirth ?? "-"}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "date-of-birth" })}
            </TableCell>
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {item?.kycBlacklist?.dateOfBirth
                ? formatDate(item?.kycBlacklist?.dateOfBirth, LONG_DATE_TIME)
                : "-"}
            </TableCell>
          </TableRow>
          {/* place-of-birth and  nationality  */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "place-of-birth" })}
            </TableCell>
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {countryCodeToName(item?.kycBlacklist?.placeOfBirth) || "-"}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "nationality" })}
            </TableCell>
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {countryCodeToName(item?.kycBlacklist?.nationality, "demonym") ||
                "-"}
            </TableCell>
          </TableRow>
          {/* phone-number */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "phone-number" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {item?.kycBlacklist?.phone ?? "-"}
            </TableCell>
          </TableRow>
          {/* Email Address */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "email-address" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {item?.kycBlacklist?.email ?? "-"}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "form.idIssuingCountry" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {countryCodeToName(item?.kycBlacklist?.idIssuingCountry) || "-"}
            </TableCell>
          </TableRow>
          {/* address-*/}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "setting.blacklist.table.address" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {item?.kycBlacklist?.address ?? "-"}
            </TableCell>
          </TableRow>

          {/* country-of-residence*/}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "country-of-residence" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {countryCodeToName(item?.kycBlacklist?.countryOfResidence) || "-"}
            </TableCell>
          </TableRow>
          {/* category */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "kyc.category",
              })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              <Category
                style={{ background: "#0073E6" }}
                defaultValue={"-"}
                categories={item?.kycBlacklist?.categories}
              ></Category>
            </TableCell>
          </TableRow>
          {/* status */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "kyc.Status",
              })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              <Status status={item?.status}></Status>
            </TableCell>
          </TableRow>
        </Table>
      );
    };
    const renderMatchingDetails = () => {
      return (
        <Table>
          {/*  Name */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "case.detail.individualRequest.name",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {matchInfo.name}
            </TableCell>
          </TableRow>

          {/*  Gender and  Date of Birth  */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "case.detail.individualRequest.gender",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {matchInfo.gender ? capitalizeFirst(matchInfo.gender) : "-"}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "case.detail.individualRequest.DOB",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {formatDate(matchInfo.dateOfBirth) || "-"}
            </TableCell>
          </TableRow>

          {/*  Nationality  and  Place of Birth*/}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "case.detail.individualRequest.nationality",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {countryCodeToName(matchInfo.nationalityCode, "demonym") || "-"}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "case.detail.individualRequest.POB",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {countryCodeToName(matchInfo.placeOfBirth) || "-"}
            </TableCell>
          </TableRow>

          {/*  Country */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "case.detail.table.kyt.header.walletCountry",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {countryCodeToName(matchInfo.nationalityCode) || "-"}
            </TableCell>
          </TableRow>

          {/*  Keywords */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "case.detail.table.kyc.header.keyword",
              })}
            </TableCell>
            <TableCell weighting={8}>
              <View
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Keyword keywords={matchInfo.keywords}></Keyword>
              </View>
            </TableCell>
          </TableRow>
        </Table>
      );
    };

    const renderKeyData = () => {
      const keysData = matchInfo.keyData;
      const isObjectNull = isEmptyValues(keysData);
      return isObjectNull ? (
        <TableEmpty>
          <Text>
            {formatMessage({
              id: "kyc.report.nodata.noKeyDataToShow",
            })}
          </Text>
        </TableEmpty>
      ) : (
        <Table>
          {/*  Alias */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "kyc.labelAlias",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {keysData.aliases && keysData.aliases.length > 0
                ? keysData.aliases.map((key, index) => {
                    return <Text key={index + key.name}>{key.name}</Text>;
                  })
                : "-"}
            </TableCell>
          </TableRow>

          {/*  Email Address */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "case.detail.individualRequest.emailAddress",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {keysData.email || "-"}
            </TableCell>
          </TableRow>

          {/*  Telephone */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "result.Table.Telephone",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {keysData.telephone || "-"}
            </TableCell>
          </TableRow>

          {/*  Addresses */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "kyc.labelAddresses",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {keysData.addresses && keysData.addresses.length > 0
                ? keysData.addresses.map((key, index) => {
                    return <Text key={index + key}>{key}</Text>;
                  })
                : "-"}
            </TableCell>
          </TableRow>
        </Table>
      );
    };

    const renderFurtherInformation = () => {
      const furtherInformation = matchInfo.furtherInformation;
      const isObjectNull = isEmptyValues(furtherInformation);
      return isObjectNull ? (
        <TableEmpty>
          <Text>
            {formatMessage({
              id: "kyc.report.nodata.noFurtherInformationToShow",
            })}
          </Text>
        </TableEmpty>
      ) : (
        <Table>
          {/*  Political Positions */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "result.Table.Position",
              })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {furtherInformation.politicalPositions &&
              furtherInformation.politicalPositions.length
                ? furtherInformation.politicalPositions.map((item) => {
                    return (
                      <Text>
                        {item.description}{" "}
                        {item.from ? ` from ${formatDate(item.from)}` : ""}
                        {item.to ? ` to ${formatDate(item.to)}` : ""}
                      </Text>
                    );
                  })
                : "-"}
            </TableCell>
          </TableRow>

          {/* Notes */}
          <TableRow>
            <TableCell
              style={[
                localStyle.tableTitleHorizontal,
                { justifyContent: "flex-start" },
              ]}
              weighting={2}
            >
              {formatMessage({
                id: "result.Table.Notes",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {furtherInformation.notes && furtherInformation.notes.length > 0
                ? furtherInformation.notes.map((item, index) => {
                    return <Text key={index + item}>{item}</Text>;
                  })
                : "-"}
            </TableCell>
          </TableRow>
        </Table>
      );
    };

    const renderConnections = () => {
      const connections = matchInfo.connections;
      return connections && connections.length > 0 ? (
        <Table disableEvenOdd={true} bordered={true}>
          <TableRow evenOdd="even">
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "case.detail.individualRequest.name",
              })}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={8}>
              {formatMessage({
                id: "kyc.associations",
              })}
            </TableCell>
          </TableRow>
          {connections && connections.length > 0 ? (
            connections.map((item, index) => {
              return (
                <TableRow key={index + item.name} evenOdd={"odd"}>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={2}
                  >
                    {item.name || "-"}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={8}
                  >
                    {item.association || "-"}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow evenOdd={"odd"}>
              <TableCell
                style={localStyle.tableContentHorizontal}
                weighting={2}
              >
                -
              </TableCell>
              <TableCell
                style={localStyle.tableContentHorizontal}
                weighting={8}
              >
                -
              </TableCell>
            </TableRow>
          )}
        </Table>
      ) : (
        <TableEmpty>
          <Text>
            {formatMessage({
              id: "kyc.report.nodata.noConnectionsToShow",
            })}
          </Text>
        </TableEmpty>
      );
    };

    const renderSources = () => {
      const sources = matchInfo.sources;
      return sources && sources.length > 0 ? (
        <Table disableEvenOdd={true} bordered={true}>
          <TableRow evenOdd="even">
            <TableCell style={localStyle.tableTitleHorizontal} weighting={5}>
              {formatMessage({
                id: "case.detail.individualRequest.name",
              })}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={3}>
              {formatMessage({
                id: "case.detail.table.kyc.header.keyword",
              })}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "source.table.CreationDate",
              })}
            </TableCell>
          </TableRow>
          {sources.map((item, index) => {
            const nameUrl = getTitle(item);
            if (nameUrl !== "") {
              return (
                <TableRow evenOdd={"odd"} key={index}>
                  <TableCell weighting={5}>
                    <Link
                      style={localStyle.link}
                      wrap={false}
                      src={`${item.originalUrl}`}
                    >
                      {textMeasurement(nameUrl, 500)}
                    </Link>
                  </TableCell>
                  <TableCell weighting={3}>
                    <Keyword itemPerRow={3} keywords={item.keywords}></Keyword>
                  </TableCell>

                  <TableCell
                    weighting={2}
                    style={localStyle.tableContentHorizontal}
                  >
                    {formatDate(item.creationDate, LONG_DATE_TIME) || "-"}
                  </TableCell>
                </TableRow>
              );
            }
            return null;
          })}
        </Table>
      ) : (
        <TableEmpty>
          <Text>
            {formatMessage({
              id: "kyc.report.nodata.noSourcesToShow",
            })}
          </Text>
        </TableEmpty>
      );
    };

    const renderRiskParameter = () => {
      try {
        return (
          <>
            <Table declareColumnSizings={[4, 3, 3]} disableEvenOdd bordered>
              <TableRow evenOdd="even" freeWeight>
                <TableCell style={localStyle.tableTitleHorizontal}>
                  {formatMessage({ id: "risk-param" })}
                </TableCell>
                <TableCell style={localStyle.tableTitleHorizontal}>
                  {formatMessage({ id: "information" })}
                </TableCell>
                <TableCell style={localStyle.tableTitleHorizontal}>
                  {formatMessage({ id: "risk-score" })}
                </TableCell>
              </TableRow>

              <TableRow evenOdd={"odd"} freeWeight>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {formatMessage({ id: "djkyc.riskParameters.sanctions" })}
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {riskScoring.scoring.sanctionList.info |> toBool}
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {sanction === true
                    ? "-"
                    : riskScoring.scoring.sanctionList.score}
                </TableCell>
              </TableRow>

              <TableRow evenOdd={"odd"} freeWeight>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {formatMessage({ id: "djkyc.riskParameters.activePEP" })}
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {riskScoring?.scoring?.activePep?.info > 0
                    ? `${formatMessage({ id: "tier" })} ${
                        riskScoring?.scoring?.activePep?.info
                      }`
                    : formatMessage({ id: "kyc.notPep" })}
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {sanction === true
                    ? "-"
                    : riskScoring.scoring.activePep.score}
                </TableCell>
              </TableRow>
              <TableRow evenOdd={"odd"} freeWeight>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {formatMessage({ id: "djkyc.riskParameters.inactivePEP" })}
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {riskScoring.scoring.inActivePep.info |> toBool}
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {sanction === true
                    ? "-"
                    : riskScoring.scoring.inActivePep.score}
                </TableCell>
              </TableRow>
              <TableRow evenOdd={"odd"} freeWeight>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {formatMessage({ id: "djkyc.riskParameters.OOL" })}
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {riskScoring.scoring.otherOfficialLists.info |> toBool}
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {sanction === true
                    ? "-"
                    : riskScoring.scoring.otherOfficialLists.score}
                </TableCell>
              </TableRow>
              {/** pending
               */}
              <TableRow evenOdd={"odd"} freeWeight>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {formatMessage({ id: "djkyc.riskParameters.SI" })}
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {0 |> toBool}
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {sanction === true ? "-" : 0}
                </TableCell>
              </TableRow>
              {/** pending
               */}
              <TableRow evenOdd={"odd"} freeWeight>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {formatMessage({ id: "djkyc.riskParameters.SILT" })}
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {0 |> toBool}
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {sanction === true ? "-" : 0}
                </TableCell>
              </TableRow>
              {/* idIssuingCountry*/}
              <TableRow evenOdd={"odd"} freeWeight>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {formatMessage({ id: "form.idIssuingCountry" })}
                </TableCell>
              </TableRow>
              <TableRow evenOdd={"odd"} freeWeight>
                <TableCell style={localStyle.tableContentHorizontal}>
                  <Text style={localStyle.subRowTable}>
                    ● {formatMessage({ id: "fatf" })}
                  </Text>
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {riskScoring.scoring.idIssuingCountry.fatf.info
                    |> countryCodeToName
                    |> nullable}
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {sanction === true
                    ? "-"
                    : riskScoring.scoring.idIssuingCountry.fatf.score
                      |> nullable}
                </TableCell>
              </TableRow>
              <TableRow evenOdd={"odd"} freeWeight>
                <TableCell style={localStyle.tableContentHorizontal}>
                  <Text style={localStyle.subRowTable}>
                    ● {formatMessage({ id: "basel-aml-index" })}
                  </Text>
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {riskScoring.scoring.idIssuingCountry.basel.info
                    |> countryCodeToName
                    |> nullable}
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {sanction === true
                    ? "-"
                    : riskScoring.scoring.idIssuingCountry.basel.score
                      |> nullable}
                </TableCell>
              </TableRow>
              <TableRow evenOdd={"odd"} freeWeight>
                <TableCell style={localStyle.tableContentHorizontal}>
                  <Text style={localStyle.subRowTable}>
                    ● {formatMessage({ id: "report.corruptPerceptionIndex" })}
                  </Text>
                </TableCell>

                <TableCell style={localStyle.tableContentHorizontal}>
                  {riskScoring.scoring.idIssuingCountry.cpi.info
                    |> countryCodeToName
                    |> nullable}
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {sanction === true
                    ? "-"
                    : riskScoring.scoring.idIssuingCountry.cpi.score
                      |> nullable}
                </TableCell>
              </TableRow>
              {/* nationality*/}
              <TableRow evenOdd={"odd"} freeWeight>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {formatMessage({ id: "nationality" })}
                </TableCell>
              </TableRow>
              <TableRow evenOdd={"odd"} freeWeight>
                <TableCell style={localStyle.tableContentHorizontal}>
                  <Text style={localStyle.subRowTable}>● FATF</Text>
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {countryCodeToName(
                    riskScoring.scoring.nationality.fatf.info,
                    "demonym"
                  ) |> nullable}
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {sanction === true
                    ? "-"
                    : riskScoring.scoring.nationality.fatf.score |> nullable}
                </TableCell>
              </TableRow>
              <TableRow evenOdd={"odd"} freeWeight>
                <TableCell style={localStyle.tableContentHorizontal}>
                  <Text style={localStyle.subRowTable}>
                    ● {formatMessage({ id: "basel-aml-index" })}
                  </Text>
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {countryCodeToName(
                    riskScoring.scoring.nationality.basel.info,
                    "demonym"
                  ) |> nullable}
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {sanction === true
                    ? "-"
                    : riskScoring.scoring.nationality.basel.score |> nullable}
                </TableCell>
              </TableRow>
              <TableRow evenOdd={"odd"} freeWeight>
                <TableCell style={localStyle.tableContentHorizontal}>
                  <Text style={localStyle.subRowTable}>
                    ● {formatMessage({ id: "report.corruptPerceptionIndex" })}
                  </Text>
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {countryCodeToName(
                    riskScoring.scoring.nationality.cpi.info,
                    "demonym"
                  ) |> nullable}
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {sanction === true
                    ? "-"
                    : riskScoring.scoring.nationality.cpi.score |> nullable}
                </TableCell>
              </TableRow>
              {/* Country Residence */}
              <TableRow evenOdd={"old"} freeWeight>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {formatMessage({
                    id: "setting.tab.weight.CountryResidence",
                  })}
                </TableCell>
              </TableRow>
              <TableRow evenOdd={"odd"} freeWeight>
                <TableCell style={localStyle.tableContentHorizontal}>
                  <Text style={localStyle.subRowTable}>
                    ● {formatMessage({ id: "fatf" })}
                  </Text>
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {riskScoring.scoring.countryOfResidence.fatf.info
                    |> countryCodeToName
                    |> nullable}
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {sanction === true
                    ? "-"
                    : riskScoring.scoring.countryOfResidence.fatf.score
                      |> nullable}
                </TableCell>
              </TableRow>
              <TableRow evenOdd={"odd"} freeWeight>
                <TableCell style={localStyle.tableContentHorizontal}>
                  <Text style={localStyle.subRowTable}>
                    ● {formatMessage({ id: "basel-aml-index" })}
                  </Text>
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {riskScoring.scoring.countryOfResidence.basel.info
                    |> countryCodeToName
                    |> nullable}
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {sanction === true
                    ? "-"
                    : riskScoring.scoring.countryOfResidence.basel.score
                      |> nullable}
                </TableCell>
              </TableRow>
              <TableRow evenOdd={"odd"} freeWeight>
                <TableCell style={localStyle.tableContentHorizontal}>
                  <Text style={localStyle.subRowTable}>
                    ● {formatMessage({ id: "corrupt-perception-index" })}s
                  </Text>
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {riskScoring.scoring.countryOfResidence.cpi.info
                    |> countryCodeToName
                    |> nullable}
                </TableCell>
                <TableCell style={localStyle.tableContentHorizontal}>
                  {sanction === true
                    ? "-"
                    : riskScoring.scoring.countryOfResidence.cpi.score
                      |> nullable}
                </TableCell>
              </TableRow>
            </Table>
          </>
        );
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <ReportLayout header={header} footer={props.printedBy}>
        <View style={localStyle.reportContainer}>
          {/* KYC ID */}
          <View>
            <View break>
              <View
                style={[
                  localStyle.titleForBlockFirst,
                  {
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  },
                ]}
              >
                <Text style={localStyle.titleForBlockFirst}>
                  {formatMessage({ id: "kyc.kycId" }) + " "}-{" "}
                  {riskScoring.kycId}
                </Text>
                {(riskScoring.status === "APPROVED" ||
                  riskScoring.status === "REJECTED") && (
                  <Text style={localStyle.titleForBlockFirst}>
                    <Text style={{ fontWeight: "unset" }}>
                      {formatMessage({
                        id: "case.detail.table.kyc.header.status",
                      })}
                    </Text>
                    {" - "}
                    {
                      {
                        APPROVED: (
                          <Text style={{ color: "#4CAF4F" }}>
                            {formatMessage({
                              id: "kyc.change.note.approved",
                            })}
                          </Text>
                        ),
                        REJECTED: (
                          <Text style={{ color: "#EA2134" }}>
                            {formatMessage({
                              id: "kyc.change.note.rejected",
                            })}
                          </Text>
                        ),
                      }[riskScoring.status]
                    }
                  </Text>
                )}
              </View>
            </View>

            {renderPrinterInfo()}
          </View>

          {/* TOTAL RISK SCORE / LEVEL */}
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage({ id: "total-rick-score" })}
            </Text>
            {renderTotalRiskScore()}
          </View>

          {/* SCREENING DETAILS */}
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage({ id: "screening-details" })}
              {" - "}
              {riskScoring.kycId}
            </Text>
            {renderScreeningDetails()}
          </View>
          {/* BLACKLIST DETAILS  */}
          {kycBlacklistMatches.map((item, index) => {
            return (
              <View>
                <Text style={localStyle.titleForBlock}>
                  {formatMessage({ id: "kyc.blDetails" }) + " "}-{" "}
                  {item.kycBlacklist?.blacklistId}
                </Text>
                {renderBlacklistDetails(item, index)}
              </View>
            );
          })}

          {matchInfo && (
            <>
              {/* MATCH DETAILS */}
              <View>
                <View
                  style={[
                    localStyle.titleForBlock,
                    {
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    },
                  ]}
                >
                  <Text>
                    {`${formatMessage({
                      id: "kyc.report.positiveMatchDetails",
                    })} - ${matchInfo.matchId}`}
                  </Text>
                </View>
                <View>{renderMatchingDetails()}</View>
              </View>

              {/* KEY DATA */}
              <View>
                <Text style={localStyle.titleForSubMatch}>
                  {formatMessage({
                    id: "result.Table.KeyData",
                  })}
                </Text>
                {renderKeyData()}
              </View>

              {/* FURTHER INFORMATION */}
              <View>
                <Text style={localStyle.titleForSubMatch}>
                  {formatMessage({
                    id: "result.Table.Further",
                  })}
                </Text>
                {renderFurtherInformation()}
              </View>

              {/* CONNECTIONS */}
              <View>
                <Text style={localStyle.titleForSubMatch}>
                  {formatMessage({
                    id: "result.Table.Connections",
                  })}
                </Text>
                {renderConnections()}
              </View>

              {/* SOURCES */}
              <View>
                <Text style={localStyle.titleForSubMatch}>
                  {formatMessage({
                    id: "result.Table.Sources",
                  })}
                </Text>
                {renderSources()}
              </View>

              {/* NOTES */}
              <View>
                <Text style={localStyle.titleForSubMatch}>
                  {formatMessage({
                    id: "result.Table.Notes",
                  })}
                </Text>
                <ReportNote notes={matchNotesDetail}></ReportNote>
              </View>
            </>
          )}

          {/* RISK PARAMETERS */}
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage({ id: "risk-param" })}
            </Text>
            {renderRiskParameter()}
          </View>

          {/* NOTES */}
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage({
                id: "result.Table.Notes",
              })}
            </Text>
            <ReportNote notes={notesDetail}></ReportNote>
          </View>

          {/* APPENDIX  - RISK ENGINE SETTINGS*/}
          <View break>
            {/* APPENDIX */}
            <Text style={[localStyle.titleForRiskSetting]}>
              {formatMessage({ id: "appModule.appendix" })}
            </Text>

            {/* RISK ENGINE SETTINGS */}
            <View>
              <Text style={[localStyle.titleForRiskSetting]}>
                {formatMessage({
                  id: "appModule.riskEngineSetting",
                })}
              </Text>
            </View>

            {/* I. RISK LEVEL */}
            <View>
              <Text style={localStyle.titleForBlockFirst}>
                I. {formatMessage({ id: "setting.tab.other.RiskLevel" })}
              </Text>
              <SSOtherSettingTable scoring={scoringSetting} />
            </View>

            {/* II. RISK PARAMETERS FOR CHART*/}
            <View>
              <Text style={localStyle.titleForBlock}>
                II. {formatMessage({ id: "risk-parameter" })}
              </Text>
              <View>
                <Image
                  style={{ width: 495, marginBottom: 10 }}
                  src={chartSetting}
                />
              </View>
            </View>
            {/* II. RISK PARAMETERS */}
            <View break>
              <Text style={localStyle.titleForBlockFirst}>
                II. {formatMessage({ id: "risk-parameter" })}
              </Text>
              <SSWeightSettingTable scoring={scoringSetting} />
            </View>

            {/* III. FATF / PEP SCORE */}
            <View break>
              <Text style={localStyle.titleForBlockFirst}>
                III. {formatMessage({ id: "fatf-pep-score" })}
              </Text>
              <SSFATFScoreTable scoring={scoringSetting} />
            </View>
          </View>
        </View>
      </ReportLayout>
    );
  }
);

export default DJKYCRiskScoringReport;
