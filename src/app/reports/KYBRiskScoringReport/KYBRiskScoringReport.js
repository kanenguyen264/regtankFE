//@flow
import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import Keyword from "app/reports/components/Keyword";
import ReportNote from "app/reports/components/ReportNote";
import Table from "app/reports/components/Table";
import { TableCell } from "app/reports/components/Table/TableCell";
import TableEmpty from "app/reports/components/Table/TableEmpty";
import { TableRow } from "app/reports/components/Table/TableRow";
import globalStyle from "app/reports/styles";
import { PAYMENT_MODE } from "constants/PaymentMode";
import React from "react";
import { useIntl } from "react-intl";
import { compose } from "recompose";
import { isEmptyValues } from "util/array";
import { getCompanyType } from "util/companyType";
import { countryCodeToName } from "util/country";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { designationCodeToName } from "util/designationList";
import { industryCodeToName } from "util/industry";
import { getSizeOfCompany } from "util/sizeOfCompany";
import ReportLayout from "../components/ReportLayout";
import useTextMeasurement from "../components/useTextMeasurement";
import withReportProvider from "../components/withReportProvider";
import { renderUser, toPrintedPt } from "../utils";
import { APPROVED, REJECTED } from "constants/ViewLogType";
import { getKybStatusTranslate, getKybColorStatus } from "util/kycStatus";

const localStyle = StyleSheet.create({
  ...globalStyle,
});

const contextual = {
  LOW: ["Low", "#4CAF4F"],
  MEDIUM: ["Medium", "#FA8C16"],
  HIGH: ["High", "#EA2134"],
};

const KYBRiskScoringReport = compose(withReportProvider)(
  /**
   *
   * @param {RiskScoringReportProps} props
   * @returns {null}
   * @constructor
   */
  function KYBRiskScoringReport(props) {
    const { company, printedBy, riskScoring, notesDetail, chartData } = props;
    const notesMatchDetail =
      notesDetail && notesDetail.length > 0 ? notesDetail : [];
    const { formatMessage } = useIntl();
    const textMeasurement = useTextMeasurement();

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
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {riskScoring?.assignee ? renderUser(riskScoring?.assignee) : "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "report.createdDate" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {formatDate(riskScoring.createdAt, LONG_DATE_TIME)}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "report.createdBy" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {riskScoring.createdBy ? renderUser(riskScoring.createdBy) : "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "last-modified-date" })}
            </TableCell>
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {formatDate(riskScoring.updatedAt, LONG_DATE_TIME)}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "last-modified-by" })}
            </TableCell>
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {riskScoring.lastModifiedBy
                ? renderUser(riskScoring.lastModifiedBy)
                : "-"}
            </TableCell>
          </TableRow>
          {(riskScoring?.kybRequest?.status === APPROVED ||
            riskScoring?.kybRequest.status === REJECTED) && (
            <TableRow>
              <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
                {
                  {
                    APPROVED: formatMessage({ id: "kyc.lastApprovedDate" }),
                    REJECTED: formatMessage({ id: "kyc.lastRejectedDate" }),
                  }[riskScoring?.kybRequest?.status]
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
                  }[riskScoring?.kybRequest?.status]
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
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {formatDate(new Date(), LONG_DATE_TIME)}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "printed-by" })}
            </TableCell>
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {printedBy ? renderUser(printedBy) : "-"}
            </TableCell>
          </TableRow>
        </Table>
      );
    };

    const renderTotalRiskScore = () => {
      return (
        chartData && (
          <Table
            style={{
              border: "1pt solid #F5F5F5",
            }}
          >
            <TableRow>
              <TableCell
                weighting={10}
                style={[localStyle.tableTitleRiskLevelHorizontal]}
              >
                {formatMessage({ id: "kyb.totalRiskLevel" })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                style={{
                  alignItems: "center",
                  height: 110,
                }}
              >
                <Image
                  src={chartData}
                  style={{
                    width: toPrintedPt(250),
                  }}
                />
              </TableCell>
            </TableRow>
          </Table>
        )
      );
    };

    const renderScreeningDetails = () => {
      return (
        <Table>
          {/* Company Name */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "company-name" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {riskScoring.kybRequest?.businessName || "-"}
            </TableCell>
          </TableRow>
          {/*  Reference ID */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "case.detail.individualRequest.referenceId",
              })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {riskScoring.kybRequest?.referenceId || "-"}
            </TableCell>
          </TableRow>
          {/* Positive Match */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "screening.result.positiveMatch",
              })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {riskScoring.kybRequest?.positiveMatch?.businessName || "-"}
            </TableCell>
          </TableRow>
          {/* Assignee */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "screening.result.Assignee" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {riskScoring.kybRequest?.assignee
                ? renderUser(riskScoring.kybRequest?.assignee)
                : "-"}
            </TableCell>
          </TableRow>
          {/* Date of Incorporation &&  Size of Company */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.DateOfIncorporation" })}
            </TableCell>
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {formatDate(
                riskScoring.kybRequest?.dateOfIncorporation,
                LONG_DATE_TIME
              ) || "-"}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.sizeOfCompany" })}
            </TableCell>
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {riskScoring.kybRequest?.sizeOfTheCompany
                ? formatMessage({
                    id: getSizeOfCompany(
                      riskScoring.kybRequest?.sizeOfTheCompany
                    ),
                  })
                : "-"}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.BusinessIDNumber" })}
            </TableCell>
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {riskScoring.kybRequest?.businessIdNumber || "-"}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "phone-number" })}
            </TableCell>
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {riskScoring.kybRequest?.phone || "-"}
            </TableCell>
          </TableRow>
          {/* Email Address */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "email-address" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {riskScoring.kybRequest?.email || "-"}
            </TableCell>
          </TableRow>
          {/* Website */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.Website" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {riskScoring.kybRequest?.website || "-"}
            </TableCell>
          </TableRow>
          {/* Nature Of Business */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.NatureOfBusiness" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {riskScoring.kybRequest?.natureOfBusiness
                ? industryCodeToName(riskScoring.kybRequest?.natureOfBusiness)
                : "-"}
            </TableCell>
          </TableRow>
          {/* Company Type*/}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.companyType" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {riskScoring.kybRequest?.companyType
                ? formatMessage({
                    id: getCompanyType(riskScoring.kybRequest?.companyType),
                  })
                : "-"}
            </TableCell>
          </TableRow>
          {/* Business Relationship*/}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.Relationship" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {riskScoring.kybRequest?.relationship || "-"}
            </TableCell>
          </TableRow>
          {/* Address Line 1 */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "address-line" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {riskScoring.kybRequest?.address1 || "-"}
            </TableCell>
          </TableRow>
          {/* Address Line 2 */}
          {/* <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "address-line-2" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {" "}
              {riskScoring.kybRequest?.address2 || "-"}
            </TableCell>
          </TableRow> */}
          {/* Country of Incorporation  &&  Country Of Headquarter */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.CountryOfIncorporation" })}
            </TableCell>
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {riskScoring.kybRequest?.countryOfIncorporation
                ? countryCodeToName(
                    riskScoring.kybRequest?.countryOfIncorporation
                  )
                : "-"}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "form.countryOfHeadquarter" })}
            </TableCell>
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {riskScoring.kybRequest?.countryOfHeadQuarter
                ? countryCodeToName(
                    riskScoring.kybRequest?.countryOfHeadQuarter
                  )
                : "-"}
            </TableCell>
          </TableRow>
          {/* Business Information*/}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.risk.assessment.BusinessInfo" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {riskScoring.kybRequest?.businessInformation || "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.KeyWord" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              <Keyword
                itemPerRow={8}
                keywords={riskScoring.kybRequest?.positiveMatch?.keywords}
              ></Keyword>
            </TableCell>
          </TableRow>
        </Table>
      );
    };

    const renderOtherRiskFactors = () => {
      const getPaymentMode = () => {
        const found = PAYMENT_MODE.find(
          (item) => item.value === riskScoring?.otherRiskFactor?.paymentMode
        );
        return found ? <Text>{formatMessage({ id: found.label })}</Text> : "-";
      };

      const otherRiskFactor = riskScoring.otherRiskFactor;
      const isObjectNull = isEmptyValues(otherRiskFactor);

      return isObjectNull ? (
        <TableEmpty>
          <Text>
            {formatMessage({
              id: "kyb.report.nodata.noOtherRisksFactorsToShow",
            })}
          </Text>
        </TableEmpty>
      ) : (
        <Table>
          {/* Source of Funds */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.source.of.funds" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {riskScoring?.otherRiskFactor?.sourceOfFunds || "-"}
            </TableCell>
          </TableRow>
          {/* Country of Funds */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.Country.of.funds" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {riskScoring?.otherRiskFactor?.countryOfFunds || "-"}
            </TableCell>
          </TableRow>
          {/* Payment Mode */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.Payment" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {getPaymentMode()}
            </TableCell>
          </TableRow>
          {/* Others */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.Other" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {riskScoring?.otherRiskFactor?.others || "-"}
            </TableCell>
          </TableRow>
        </Table>
      );
    };

    const renderDirectorsControllers = () => {
      return riskScoring.directorsController?.length > 0 ? (
        <Table disableEvenOdd={true} bordered={true}>
          <TableRow evenOdd="even">
            <TableCell style={localStyle.tableTitleHorizontal} weighting={1.5}>
              {formatMessage({
                id: "kyc.kycId",
              })}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={1.5}>
              {formatMessage({
                id: "risk-score",
              })}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={1.5}>
              {formatMessage({
                id: "source.table.name",
              })}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "appModule.designation",
              })}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={1.5}>
              {formatMessage({
                id: "kyb.table.Remarks",
              })}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "last-modified-by",
              })}
            </TableCell>
          </TableRow>
          {riskScoring?.directorsController.map((item, index) => {
            return (
              <TableRow evenOdd={"odd"} key={index}>
                <TableCell
                  style={localStyle.tableContentHorizontal}
                  weighting={1.5}
                >
                  {item?.kycRequest?.kycId || "-"}
                </TableCell>
                <TableCell weighting={1.5}>
                  <Text style={localStyle.tableContentHorizontal}>
                    {item?.kycRequest?.risk !== null ? (
                      <Text
                        style={{
                          fontWeight: 700,
                          color: contextual[item?.kycRequest?.riskLevel][1],
                        }}
                      >
                        {Math.round(item?.kycRequest?.risk)}
                      </Text>
                    ) : (
                      "-"
                    )}
                  </Text>
                </TableCell>
                <TableCell
                  style={localStyle.tableContentHorizontal}
                  weighting={1.5}
                >
                  <Text
                    style={{
                      width: toPrintedPt(14 + 24, "h"),
                    }}
                  >
                    <Text style={{ textAlign: "justify" }}>
                      {textMeasurement(item?.kycRequest?.name, 134)}
                    </Text>
                  </Text>
                </TableCell>
                <TableCell
                  style={localStyle.tableContentHorizontal}
                  weighting={2}
                >
                  {item?.designationPosition
                    ? formatMessage({
                        id: designationCodeToName(item?.designationPosition)
                          .label,
                      })
                    : "-"}
                </TableCell>
                <TableCell
                  style={localStyle.tableContentHorizontal}
                  weighting={1.5}
                >
                  {item?.remarks || "-"}
                </TableCell>
                <TableCell
                  style={localStyle.tableContentHorizontal}
                  weighting={2}
                >
                  <Text>{renderUser(item?.lastModifiedBy)}</Text>
                  <Text>{formatDate(item?.updatedAt, LONG_DATE_TIME)}</Text>
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      ) : (
        <TableEmpty>
          <Text>
            {formatMessage({
              id: "kyb.report.nodata.noDirectorsControllersToShow",
            })}
          </Text>
        </TableEmpty>
      );
    };

    const individualShareholdersUltimateBeneficiaries = () => {
      return riskScoring.individualShareholder?.length > 0 ? (
        <Table disableEvenOdd={true} bordered={true}>
          <TableRow evenOdd="even">
            <TableCell style={localStyle.tableTitleHorizontal} weighting={1.5}>
              {formatMessage({
                id: "kyc.kycId",
              })}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={1.5}>
              {formatMessage({
                id: "risk-score",
              })}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={1.5}>
              {formatMessage({
                id: "source.table.name",
              })}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "kyb.table.ofShare",
              })}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={1.5}>
              {formatMessage({
                id: "kyb.table.Remarks",
              })}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "last-modified-by",
              })}
            </TableCell>
          </TableRow>
          {riskScoring?.individualShareholder.map((item, index) => {
            return (
              <TableRow evenOdd={"odd"} key={index}>
                <TableCell
                  style={localStyle.tableContentHorizontal}
                  weighting={1.5}
                >
                  {item?.kycRequest?.kycId || "-"}
                </TableCell>
                <TableCell
                  style={localStyle.tableContentHorizontal}
                  weighting={1.5}
                >
                  {item?.kycRequest?.risk !== null ? (
                    <Text
                      style={{
                        fontWeight: 700,
                        color: contextual[item?.kycRequest.riskLevel][1],
                      }}
                    >
                      {Math.round(item?.kycRequest?.risk)}
                    </Text>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell
                  style={localStyle.tableContentHorizontal}
                  weighting={1.5}
                >
                  <Text style={{ wordBreak: "break-all" }}>
                    {item?.kycRequest?.name || "-"}
                  </Text>
                </TableCell>
                <TableCell
                  style={localStyle.tableContentHorizontal}
                  weighting={2}
                >
                  {item?.percentOfShare ? item?.percentOfShare + "%" : "-"}
                </TableCell>
                <TableCell
                  style={localStyle.tableContentHorizontal}
                  weighting={1.5}
                >
                  {item?.remarks || "-"}
                </TableCell>
                <TableCell
                  style={localStyle.tableContentHorizontal}
                  weighting={2}
                >
                  <Text>{renderUser(item?.lastModifiedBy)}</Text>
                  <Text>{formatDate(item?.updatedAt, LONG_DATE_TIME)}</Text>
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      ) : (
        <TableEmpty>
          <Text>
            {formatMessage({
              id: "kyb.report.nodata.noShareholdersToShow",
            })}
          </Text>
        </TableEmpty>
      );
    };

    const businessShareholdersUltimateBeneficiaries = () => {
      return riskScoring.businessShareholder?.length > 0 ? (
        <Table disableEvenOdd={true} bordered={true}>
          <TableRow evenOdd="even">
            <TableCell style={localStyle.tableTitleHorizontal} weighting={1.5}>
              {formatMessage({
                id: "kyb.kybId",
              })}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={1.5}>
              {formatMessage({
                id: "risk-level",
              })}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={1.5}>
              {formatMessage({
                id: "kyb.businessName",
              })}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "kyb.table.ofShare",
              })}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={1.5}>
              {formatMessage({
                id: "kyb.table.Remarks",
              })}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "last-modified-by",
              })}
            </TableCell>
          </TableRow>
          {riskScoring.businessShareholder.map((item, index) => {
            return (
              <TableRow evenOdd={"odd"} key={index}>
                <TableCell
                  style={localStyle.tableContentHorizontal}
                  weighting={1.5}
                >
                  {item?.kybRequest?.kybId || "-"}
                </TableCell>
                <TableCell
                  style={localStyle.tableContentHorizontal}
                  weighting={1.5}
                >
                  {item?.kybRequest?.riskLevel ? (
                    <Text
                      style={{
                        fontWeight: 700,
                        color: contextual[item?.kybRequest.riskLevel][1],
                      }}
                    >
                      {item?.kybRequest?.riskLevel}
                    </Text>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell
                  style={localStyle.tableContentHorizontal}
                  weighting={1.5}
                >
                  <Text style={{ wordBreak: "break-all" }}>
                    {item?.kybRequest?.businessName || "-"}
                  </Text>
                </TableCell>
                <TableCell
                  style={localStyle.tableContentHorizontal}
                  weighting={2}
                >
                  {item?.percentOfShare ? item?.percentOfShare + "%" : "-"}
                </TableCell>
                <TableCell
                  style={localStyle.tableContentHorizontal}
                  weighting={1.5}
                >
                  {item?.remarks || "-"}
                </TableCell>
                <TableCell
                  style={localStyle.tableContentHorizontal}
                  weighting={2}
                >
                  <Text>{renderUser(item?.lastModifiedBy)}</Text>
                  <Text>{formatDate(item?.updatedAt, LONG_DATE_TIME)}</Text>
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      ) : (
        <TableEmpty>
          <Text>
            {formatMessage({
              id: "kyb.report.nodata.noShareholdersToShow",
            })}
          </Text>
        </TableEmpty>
      );
    };

    const header = {
      headerTitle: ["KYB", "RISK ASSESSMENT REPORT"],
      subHeaderTitle: riskScoring.kybRequest?.kybId,
      title: "KNOW YOUR BUSINESS (KYB)",
      subTitle: "RISK ASSESSMENT REPORT",
    };

    return (
      <ReportLayout header={header} footer={printedBy}>
        <View style={localStyle.reportContainer}>
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
                {formatMessage({ id: "kyb.kybId" }) + " "}-{" "}
                {riskScoring?.kybRequest?.kybId}
              </Text>

              <Text style={localStyle.titleForBlockFirst}>
                <Text style={{ fontWeight: "unset" }}>
                  {formatMessage({
                    id: "case.detail.table.kyc.header.status",
                  })}
                </Text>
                {" - "}
                <Text
                  style={{
                    color: getKybColorStatus(riskScoring?.kybRequest?.status),
                  }}
                >
                  {formatMessage({
                    id: getKybStatusTranslate(riskScoring?.kybRequest?.status),
                  })}
                </Text>
              </Text>
            </View>
          </View>
          {renderPrinterInfo()}
        </View>
        {chartData && (
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage({ id: "total-risk-score" })}
            </Text>
            {renderTotalRiskScore()}
          </View>
        )}
        <View>
          <Text style={localStyle.titleForBlock}>
            {formatMessage({ id: "screening-details" })}
            {" - "}
            {riskScoring.kybRequest?.kybId}
          </Text>
          {renderScreeningDetails()}
        </View>
        <View>
          <Text style={localStyle.titleForBlock}>
            {formatMessage({ id: "kyb.risk.factor" })}
          </Text>
          {renderOtherRiskFactors()}
        </View>
        <View>
          <Text style={localStyle.titleForBlock}>
            {formatMessage({
              id: "kyb.directors_controllers",
            })}
          </Text>
          {renderDirectorsControllers()}
        </View>
        <View>
          <Text style={localStyle.titleForBlock}>
            {formatMessage({
              id: "kyb.individual_shareholders_ultimate_beneficiaries",
            })}
          </Text>
          {individualShareholdersUltimateBeneficiaries()}
        </View>
        <View>
          <Text style={localStyle.titleForBlock}>
            {formatMessage({
              id: "kyb.business_shareholders_ultimate_beneficiaries",
            })}
          </Text>
          {businessShareholdersUltimateBeneficiaries()}
        </View>
        <View>
          <Text style={localStyle.titleForBlock}>
            {formatMessage({
              id: "result.Table.Notes",
            })}
          </Text>
          <ReportNote notes={notesMatchDetail}></ReportNote>
        </View>
      </ReportLayout>
    );
  }
);

export default KYBRiskScoringReport;
