//@flow
import { capitalizeFirst } from "@protego/sdk/utils/string";
import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import Keyword from "app/reports/components/Keyword";
import ReportNote from "app/reports/components/ReportNote";
import Table from "app/reports/components/Table";
import { TableCell } from "app/reports/components/Table/TableCell";
import { TableRow } from "app/reports/components/Table/TableRow";
import globalStyle from "app/reports/styles";
import React from "react";
import { useIntl } from "react-intl";
import { compose } from "recompose";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { getKycStatusTranslate } from "util/kycStatus";
import { getRiskLevel } from "util/riskLevel";
import ReportLayout from "../components/ReportLayout";
import useTextMeasurement from "../components/useTextMeasurement";
import withReportProvider from "../components/withReportProvider";
import { renderUser } from "../utils";
import { countryCodeToName } from "util/country";
import IntlMessages from "@protego/sdk/UI/IntlMessages";

const localStyle = StyleSheet.create({
  ...globalStyle,
  tableKycId: {
    width: 67,
  },
  tableKycRiskScore: {
    width: 52,
  },
  tableKycKeywords: {
    width: 106,
  },
  tableKycStatus: {
    width: 74,
  },
  tableKycAssignee: {
    width: 105,
  },
  tableKycLastModifiedBy: {
    width: 91,
  },
  tableKytId: {
    width: 56,
  },
  tableKytRiskScore: {
    width: 53,
  },
  tableKytWalletAddress: {
    width: 96,
  },
  tableKytAsset: {
    width: 34,
  },
  tableKytOwner: {
    width: 73,
  },
  tableKytCountry: {
    width: 92,
  },
  tableKytLastModifiedBy: {
    width: 91,
  },
});
const kycChart = [
  {
    label: "appModule.riskScoreLevel.high",
    color: "#E92235",
  },
  {
    label: "appModule.riskScoreLevel.medium",
    color: "#FD9701",
  },
  {
    label: "appModule.riskScoreLevel.low",
    color: "#4CAF50",
  },
  {
    label: "appModule.riskScoreLevel.pending",
    color: "#BDBDBD",
  },
];
const kytChart = [
  {
    label: "appModule.riskScoreLevel.high",
    color: "#E92235",
  },
  {
    label: "appModule.riskScoreLevel.medium",
    color: "#FD9701",
  },
  {
    label: "appModule.riskScoreLevel.low",
    color: "#4CAF50",
  },
];
const CaseDetailReport = compose(withReportProvider)(
  /**
   *
   * @param {CaseDetailReportProps} props
   * @returns {null}
   * @constructor
   */
  function CaseDetailReport(props) {
    const { formatMessage } = useIntl();
    const {
      caseDetail,
      notes,
      printedBy,
      company,
      chartKyc,
      chartKyt,
      hideKYCInfo = false,
      hideKYTInfo = false,
    } = props;
    const textMeasurement = useTextMeasurement();
    const header = {
      headerTitle: ["CASE", "DETAILS REPORT"],
      subHeaderTitle: caseDetail.caseId,
      title: "INDIVIDUAL",
      subTitle: "CASE DETAILS REPORT",
    };

    const getColorText = (level) => {
      const levelObj = getRiskLevel(level);
      return levelObj?.color || "#000000";
    };

    return (
      <ReportLayout header={header} footer={printedBy}>
        <View style={localStyle.reportContainer}>
          {/* CASE ID */}
          <View>
            <Text style={localStyle.titleForBlockFirst}>
              {formatMessage({ id: "case.table.header.caseId" })}
              {" - "}
              {caseDetail.caseId}
            </Text>
            {!hideKYCInfo && (
              <Table>
                {/* Reference ID */}
                <TableRow>
                  <TableCell
                    style={localStyle.tableTitleHorizontal}
                    weighting={2}
                  >
                    {formatMessage({ id: "reference-id" })}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={8}
                  >
                    {caseDetail.referenceId}
                  </TableCell>
                </TableRow>

                {/* Company Name */}
                <TableRow>
                  <TableCell
                    style={localStyle.tableTitleHorizontal}
                    weighting={2}
                  >
                    {formatMessage({ id: "company-name" })}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={8}
                  >
                    {company.company}
                  </TableCell>
                </TableRow>

                {/* Assignee */}
                <TableRow>
                  <TableCell
                    style={localStyle.tableTitleHorizontal}
                    weighting={2}
                  >
                    {formatMessage({
                      id: "case.detail.table.kyc.header.assignee",
                    })}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={8}
                  >
                    {caseDetail.latestKyc?.assignee
                      ? renderUser(caseDetail.latestKyc?.assignee)
                      : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={localStyle.tableTitleHorizontal}
                    weighting={2}
                  >
                    {formatMessage({ id: "report.createdDate" })}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={3}
                  >
                    {formatDate(caseDetail.createdAt, LONG_DATE_TIME)}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableTitleHorizontal}
                    weighting={2}
                  >
                    {formatMessage({ id: "report.createdBy" })}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={3}
                  >
                    {caseDetail.createdBy
                      ? renderUser(caseDetail.createdBy)
                      : "-"}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    style={localStyle.tableTitleHorizontal}
                    weighting={2}
                  >
                    {formatMessage({ id: "last-modified-date" })}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={3}
                  >
                    {formatDate(caseDetail.updatedAt, LONG_DATE_TIME)}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableTitleHorizontal}
                    weighting={2}
                  >
                    {formatMessage({ id: "last-modified-by" })}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={3}
                  >
                    {caseDetail.lastModifiedBy
                      ? renderUser(caseDetail.lastModifiedBy)
                      : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={localStyle.tableTitleHorizontal}
                    weighting={2}
                  >
                    {formatMessage({ id: "date-printed" })}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={3}
                  >
                    {formatDate(new Date(), LONG_DATE_TIME)}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableTitleHorizontal}
                    weighting={2}
                  >
                    {formatMessage({ id: "printed-by" })}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={3}
                  >
                    {renderUser(printedBy)}
                  </TableCell>
                </TableRow>
              </Table>
            )}
          </View>

          {/* TOTAL RISK SCORE / LEVEL */}
          {!hideKYCInfo && !hideKYTInfo && (
            <View>
              <Text style={localStyle.titleForBlock}>
                {formatMessage({ id: "case.report.totalRiskScoreLevel" })}
              </Text>
              <Table>
                <TableRow>
                  {!hideKYCInfo && (
                    <TableCell
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                      }}
                      textAlign="center"
                      weighting={5}
                    >
                      {formatMessage({ id: "case.report.knowYourCustomer" })}
                    </TableCell>
                  )}

                  {!hideKYTInfo && (
                    <TableCell
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                      }}
                      textAlign="center"
                      weighting={5}
                    >
                      {formatMessage({ id: "case.report.knowYourTransaction" })}
                    </TableCell>
                  )}
                </TableRow>
                <TableRow>
                  {!hideKYCInfo && (
                    <TableCell
                      style={{
                        border: "1pt solid #F5F5F5",
                        height: 175,
                      }}
                      weighting={5}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          style={{ width: 170, marginBottom: 10 }}
                          src={chartKyc}
                        />
                        <Text>
                          {kycChart.map((item, index) => (
                            <Text key={index}>
                              <Text style={{ color: item.color }}>● </Text>
                              <IntlMessages id={item.label} />
                              {"  "}
                            </Text>
                          ))}
                        </Text>
                      </View>
                    </TableCell>
                  )}
                  {!hideKYTInfo && (
                    <TableCell
                      style={{
                        border: "1pt solid #F5F5F5",
                        height: 175,
                      }}
                      weighting={5}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          style={{ width: 170, marginBottom: 10 }}
                          src={chartKyt}
                        />
                        <Text>
                          {kytChart.map((item, index) => (
                            <Text key={index}>
                              <Text style={{ color: item.color }}>● </Text>
                              <IntlMessages id={item.label} />
                              {"  "}
                            </Text>
                          ))}
                        </Text>
                      </View>
                    </TableCell>
                  )}
                </TableRow>
              </Table>
            </View>
          )}

          {/* CASE DETAILS */}
          {!hideKYCInfo && (
            <View>
              <Text style={localStyle.titleForBlock}>
                {formatMessage({ id: "case-details" }).toUpperCase()}
                {" - "}
                {caseDetail.caseId}
              </Text>
              <Table>
                {/* Name */}
                <TableRow>
                  <TableCell
                    style={localStyle.tableTitleHorizontal}
                    weighting={2}
                  >
                    {formatMessage({
                      id: "case.detail.individualRequest.name",
                    })}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={8}
                  >
                    {caseDetail.latestKyc?.individualRequest?.name || "-"}
                  </TableCell>
                </TableRow>

                {/* Gender */}
                <TableRow>
                  <TableCell
                    style={localStyle.tableTitleHorizontal}
                    weighting={2}
                  >
                    {formatMessage({
                      id: "case.detail.individualRequest.gender",
                    })}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={8}
                  >
                    {caseDetail.latestKyc?.individualRequest.gender
                      ? capitalizeFirst(
                          caseDetail.latestKyc?.individualRequest.gender
                        )
                      : "-"}
                  </TableCell>
                </TableRow>

                {/* Year of Birth */}
                {/* Date of Birth */}
                <TableRow>
                  <TableCell
                    style={localStyle.tableTitleHorizontal}
                    weighting={2}
                  >
                    {formatMessage({ id: "case.detail.individualRequest.YOB" })}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={3}
                  >
                    {caseDetail.latestKyc?.individualRequest.yearOfBirth ?? "-"}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableTitleHorizontal}
                    weighting={2}
                  >
                    {formatMessage({ id: "case.table.header.DOB" })}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={3}
                  >
                    {formatDate(
                      caseDetail.latestKyc?.individualRequest?.dateOfBirth,
                      LONG_DATE_TIME
                    ) || "-"}
                  </TableCell>
                </TableRow>

                {/* Place of Birth */}
                {/* Nationality */}
                <TableRow>
                  <TableCell
                    style={localStyle.tableTitleHorizontal}
                    weighting={2}
                  >
                    {formatMessage({ id: "case.detail.individualRequest.POB" })}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={3}
                  >
                    {countryCodeToName(
                      caseDetail.latestKyc?.individualRequest?.placeOfBirth
                    ) || "-"}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableTitleHorizontal}
                    weighting={2}
                  >
                    {formatMessage({
                      id: "case.detail.individualRequest.nationality",
                    })}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={3}
                  >
                    {countryCodeToName(
                      caseDetail.latestKyc?.individualRequest.nationality,
                      "demonym"
                    ) || "-"}
                  </TableCell>
                </TableRow>

                {/* Phone Number */}
                <TableRow>
                  <TableCell
                    style={localStyle.tableTitleHorizontal}
                    weighting={2}
                  >
                    {formatMessage({
                      id: "case.detail.individualRequest.phoneNumber",
                    })}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={8}
                  >
                    {caseDetail.latestKyc?.individualRequest.phone ?? "-"}
                  </TableCell>
                </TableRow>

                {/* Email Address */}
                <TableRow>
                  <TableCell
                    style={localStyle.tableTitleHorizontal}
                    weighting={2}
                  >
                    {formatMessage({
                      id: "case.detail.individualRequest.emailAddress",
                    })}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={8}
                  >
                    {caseDetail.latestKyc?.individualRequest.email ?? "-"}
                  </TableCell>
                </TableRow>

                {/* Government ID Number */}
                <TableRow>
                  <TableCell
                    style={localStyle.tableTitleHorizontal}
                    weighting={2}
                  >
                    {formatMessage({
                      id: "case.detail.individualRequest.governmentId",
                    })}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={8}
                  >
                    {caseDetail.latestKyc?.individualRequest
                      .governmentIdNumber ?? "-"}
                  </TableCell>
                </TableRow>

                {/* ID Issuing Country */}
                <TableRow>
                  <TableCell
                    style={localStyle.tableTitleHorizontal}
                    weighting={2}
                  >
                    {formatMessage({
                      id: "case.detail.individualRequest.idIssuingCountry",
                    })}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={8}
                  >
                    {countryCodeToName(
                      caseDetail.latestKyc?.individualRequest?.idIssuingCountry
                    ) || "-"}
                  </TableCell>
                </TableRow>

                {/* Address Line 1 */}
                <TableRow>
                  <TableCell
                    style={localStyle.tableTitleHorizontal}
                    weighting={2}
                  >
                    {formatMessage({ id: "address-line-1" })}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={8}
                  >
                    {caseDetail.latestKyc?.individualRequest.address1 ?? "-"}
                  </TableCell>
                </TableRow>

                {/* Address Line 2 */}
                <TableRow>
                  <TableCell
                    style={localStyle.tableTitleHorizontal}
                    weighting={2}
                  >
                    {formatMessage({ id: "address-line-2" })}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={8}
                  >
                    {caseDetail.latestKyc?.individualRequest.address2 ?? "-"}
                  </TableCell>
                </TableRow>

                {/* Country of Residence */}
                <TableRow>
                  <TableCell
                    style={localStyle.tableTitleHorizontal}
                    weighting={2}
                  >
                    {formatMessage({
                      id: "case.detail.individualRequest.countryOfResidence",
                    })}
                  </TableCell>
                  <TableCell
                    style={localStyle.tableContentHorizontal}
                    weighting={8}
                  >
                    {countryCodeToName(
                      caseDetail.latestKyc?.individualRequest
                        ?.countryOfResidence
                    ) || "-"}
                  </TableCell>
                </TableRow>
              </Table>
            </View>
          )}

          {/* KYC Table */}
          {!hideKYCInfo && (
            <View>
              <Text style={localStyle.titleForBlock}>
                {formatMessage({ id: "case.report.knowYourCustomer" })}
              </Text>
              <Table disableEvenOdd bordered>
                <TableRow evenOdd={"even"}>
                  <TableCell
                    style={[localStyle.tableKycId, localStyle.fontWeight300]}
                  >
                    {formatMessage({
                      id: "case.detail.table.kyc.header.kycId",
                    })}
                  </TableCell>
                  <TableCell
                    style={[
                      localStyle.tableKycRiskScore,
                      localStyle.fontWeight300,
                    ]}
                  >
                    {formatMessage({
                      id: "case.detail.table.kyc.header.riskScore",
                    })}
                  </TableCell>
                  <TableCell
                    style={[
                      localStyle.tableKycKeywords,
                      localStyle.fontWeight300,
                    ]}
                  >
                    {formatMessage({
                      id: "case.detail.table.kyc.header.keyword",
                    })}
                  </TableCell>
                  <TableCell
                    style={[
                      localStyle.tableKycStatus,
                      localStyle.fontWeight300,
                    ]}
                  >
                    {formatMessage({
                      id: "case.detail.table.kyc.header.status",
                    })}
                  </TableCell>
                  <TableCell
                    style={[
                      localStyle.tableKycAssignee,
                      localStyle.fontWeight300,
                    ]}
                  >
                    {formatMessage({
                      id: "case.detail.table.kyc.header.assignee",
                    })}
                  </TableCell>
                  <TableCell
                    style={[
                      localStyle.tableKycLastModifiedBy,
                      localStyle.fontWeight300,
                    ]}
                  >
                    {formatMessage({
                      id: "case.detail.table.kyc.header.lastKycScreenBy",
                    })}
                  </TableCell>
                </TableRow>
                {caseDetail.kycList &&
                  caseDetail.kycList.length > 0 &&
                  caseDetail.kycList.map((kyc) => (
                    <TableRow key={kyc.id} evenOdd={"odd"}>
                      <TableCell
                        style={[
                          localStyle.tableKycId,
                          localStyle.fontWeight500,
                        ]}
                      >
                        {kyc.kycId}
                      </TableCell>
                      <TableCell
                        textAlign="center"
                        style={[
                          localStyle.tableKycRiskScore,
                          localStyle.fontWeight700,
                          {
                            color: getColorText(
                              kyc.individualRiskScore?.riskLevel
                            ),
                          },
                        ]}
                      >
                        {kyc.individualRiskScore?.risk ?? "-"}
                      </TableCell>
                      <TableCell
                        style={[
                          localStyle.tableKycKeywords,
                          localStyle.fontWeight500,
                        ]}
                      >
                        <Keyword
                          itemPerRow={2}
                          keywords={kyc.positiveMatch?.keywords}
                        ></Keyword>
                      </TableCell>
                      <TableCell
                        style={[
                          localStyle.tableKycStatus,
                          localStyle.fontWeight500,
                        ]}
                      >
                        {kyc.status
                          ? formatMessage({
                              id: getKycStatusTranslate(kyc.status),
                            })
                          : "-"}
                      </TableCell>
                      <TableCell
                        style={[
                          localStyle.tableKycAssignee,
                          localStyle.fontWeight500,
                        ]}
                      >
                        {kyc.assignee ? renderUser(kyc.assignee) : "-"}
                      </TableCell>
                      <TableCell
                        style={[
                          localStyle.tableKycLastModifiedBy,
                          localStyle.fontWeight500,
                          {
                            justifyContent: "center",
                          },
                        ]}
                      >
                        <Text>
                          {kyc.lastModifiedBy
                            ? renderUser(kyc.lastModifiedBy)
                            : "-"}
                        </Text>
                        <Text>
                          {formatDate(kyc.updatedAt, LONG_DATE_TIME) || "-"}
                        </Text>
                      </TableCell>
                    </TableRow>
                  ))}
              </Table>
            </View>
          )}

          {/* KYT Table */}
          {!hideKYTInfo && (
            <View>
              <Text style={localStyle.titleForBlock}>
                {formatMessage({ id: "case.report.knowYourTransaction" })}
              </Text>

              <Table disableEvenOdd bordered>
                <TableRow evenOdd={"even"}>
                  <TableCell
                    style={[localStyle.tableKytId, localStyle.fontWeight300]}
                  >
                    KYT ID
                  </TableCell>
                  <TableCell
                    style={[
                      localStyle.tableKytRiskScore,
                      localStyle.fontWeight300,
                    ]}
                  >
                    {formatMessage({
                      id: "case.detail.table.kyc.header.riskScore",
                    })}
                  </TableCell>
                  <TableCell
                    style={[
                      localStyle.tableKytWalletAddress,
                      localStyle.fontWeight300,
                    ]}
                  >
                    {formatMessage({
                      id: "case.detail.table.kyt.header.walletAddress",
                    })}
                  </TableCell>
                  <TableCell
                    style={[localStyle.tableKytAsset, localStyle.fontWeight300]}
                  >
                    {formatMessage({
                      id: "case.detail.table.kyt.header.asset",
                    })}
                  </TableCell>
                  <TableCell
                    style={[localStyle.tableKytOwner, localStyle.fontWeight300]}
                  >
                    {formatMessage({
                      id: "case.detail.table.kyt.header.walletName",
                    })}
                  </TableCell>
                  <TableCell
                    style={[
                      localStyle.tableKytCountry,
                      localStyle.fontWeight300,
                    ]}
                  >
                    {formatMessage({
                      id: "case.detail.table.kyt.header.walletCountry",
                    })}
                  </TableCell>

                  <TableCell
                    style={[
                      localStyle.tableKytLastModifiedBy,
                      localStyle.fontWeight300,
                    ]}
                  >
                    {formatMessage({
                      id: "case.detail.table.kyc.header.lastKycScreenBy",
                    })}
                  </TableCell>
                </TableRow>
                {caseDetail.kytList.map((kyt) => (
                  <TableRow key={kyt.id} evenOdd={"odd"}>
                    <TableCell
                      style={[localStyle.tableKytId, localStyle.fontWeight500]}
                    >
                      {kyt.kytId}
                    </TableCell>
                    <TableCell
                      style={[
                        localStyle.tableKytRiskScore,
                        localStyle.fontWeight700,
                        {
                          color: getColorText(
                            kyt.addressDetails.risk.riskLevel
                          ),
                        },
                      ]}
                      textAlign={"center"}
                    >
                      {kyt.addressDetails.risk.risk ?? 0}
                    </TableCell>
                    <TableCell
                      style={[
                        localStyle.tableKytWalletAddress,
                        localStyle.fontWeight500,
                      ]}
                    >
                      <Text>
                        {textMeasurement(kyt.addressDetails.address, 140)}
                      </Text>
                    </TableCell>
                    <TableCell
                      textAlign={"center"}
                      style={[
                        localStyle.tableKytAsset,
                        localStyle.fontWeight500,
                      ]}
                    >
                      {kyt.asset}
                    </TableCell>
                    <TableCell
                      style={[
                        localStyle.tableKytOwner,
                        localStyle.fontWeight500,
                      ]}
                    >
                      {kyt.addressDetails.wallet.name?.indexOf("-") >= 0
                        ? kyt.addressDetails.wallet.name.split("-").join("\n")
                        : textMeasurement(
                            kyt.addressDetails.wallet.name ?? "-",
                            100
                          )}
                    </TableCell>
                    <TableCell
                      style={[
                        localStyle.tableKytCountry,
                        localStyle.fontWeight500,
                      ]}
                    >
                      {countryCodeToName(kyt.addressDetails.wallet.country) ||
                        "-"}
                    </TableCell>
                    <TableCell
                      style={[
                        localStyle.tableKytLastModifiedBy,
                        localStyle.fontWeight500,
                        {
                          justifyContent: "center",
                        },
                      ]}
                    >
                      <Text>
                        {kyt.lastModifiedBy
                          ? renderUser(kyt.lastModifiedBy)
                          : "-"}
                      </Text>
                      <Text>
                        {formatDate(kyt.updatedAt, LONG_DATE_TIME) || "-"}
                      </Text>
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            </View>
          )}

          {/* Notes */}
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage({ id: "case.table.header.note" })}
            </Text>
            <ReportNote notes={notes}></ReportNote>
          </View>
        </View>
      </ReportLayout>
    );
  }
);

export default CaseDetailReport;
