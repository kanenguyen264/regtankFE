//@flow
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import Keyword from "app/reports/components/Keyword";
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
import ReportLayout from "../components/ReportLayout";
import withReportProvider from "../components/withReportProvider";
import { renderUser } from "../utils";
import { industryCodeToName } from "util/industry";
import { getCompanyType } from "util/companyType";
import { getSizeOfCompany } from "util/sizeOfCompany";
import useTextMeasurement from "../components/useTextMeasurement";
import { getKybStatusTranslate, getKybColorStatus } from "util/kycStatus";
const localStyle = StyleSheet.create({
  ...globalStyle
});

const KYBScreeningDetailsReport = compose(withReportProvider)(
  /**
   *
   * @param {MatchResponseDto} props.match
   * @param {KybSimplifiedRequestDto} props.kybRequest
   * @param {BasicUserInfoDto} props.printedBy
   * @returns {null}
   * @constructor
   */
  function KYBScreeningDetailsReport(props) {
    const { company, printedBy, notesDetail, business, matches } = props;
    const textMeasurement = useTextMeasurement();
    const screenDetail = business;
    const notes = notesDetail && notesDetail.length > 0 ? notesDetail : [];
    const { formatMessage } = useIntl();

    const renderPrinterInfo = () => {
      return (
        <Table>
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              KYB ID
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {screenDetail.kybId}
            </TableCell>
          </TableRow>
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
              {formatMessage({ id: "kyb.Assignee" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {screenDetail?.assignee
                ? renderUser(screenDetail?.assignee)
                : "-"}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "report.createdDate" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {formatDate(screenDetail.createdAt, LONG_DATE_TIME)}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "report.createdBy" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {screenDetail.createdBy
                ? renderUser(screenDetail.createdBy)
                : "-"}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell weighting={2} style={localStyle.tableTitleHorizontal}>
              {formatMessage({ id: "last-modified-date" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {formatDate(screenDetail.updatedAt, LONG_DATE_TIME)}
            </TableCell>
            <TableCell weighting={2} style={localStyle.tableTitleHorizontal}>
              {formatMessage({ id: "last-modified-by" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {screenDetail.lastModifiedBy
                ? renderUser(screenDetail.lastModifiedBy)
                : "-"}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell weighting={2} style={localStyle.tableTitleHorizontal}>
              {formatMessage({ id: "date-printed" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {formatDate(new Date(), LONG_DATE_TIME)}
            </TableCell>
            <TableCell weighting={2} style={localStyle.tableTitleHorizontal}>
              {formatMessage({ id: "printed-by" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {printedBy ? renderUser(printedBy) : "-"}
            </TableCell>
          </TableRow>
        </Table>
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
              {screenDetail?.businessName || "-"}
            </TableCell>
          </TableRow>
          {/*  Reference ID */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "kyb.referenceId"
              })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {screenDetail?.referenceId || "-"}
            </TableCell>
          </TableRow>
          {/* Positive Match */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "screening.result.positiveMatch"
              })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {screenDetail?.positiveMatch?.businessName || "-"}
            </TableCell>
          </TableRow>
          {/* Assignee */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "screening.result.Assignee" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {screenDetail?.assignee
                ? renderUser(screenDetail?.assignee)
                : "-"}
            </TableCell>
          </TableRow>
          {/* Date of Incorporation &&  Size of Company */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.DateOfIncorporation" })}
            </TableCell>
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {formatDate(screenDetail?.dateOfIncorporation, LONG_DATE_TIME) ||
                "-"}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.sizeOfCompany" })}
            </TableCell>
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {screenDetail?.sizeOfTheCompany
                ? formatMessage({
                    id: getSizeOfCompany(screenDetail?.sizeOfTheCompany)
                  })
                : "-"}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.BusinessIDNumber" })}
            </TableCell>
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {screenDetail?.businessIdNumber || "-"}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "phone-number" })}
            </TableCell>
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {screenDetail?.phone || "-"}
            </TableCell>
          </TableRow>
          {/* Email Address */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "email-address" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {screenDetail?.email || "-"}
            </TableCell>
          </TableRow>
          {/* Website */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.Website" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {screenDetail?.website || "-"}
            </TableCell>
          </TableRow>
          {/* Nature Of Business */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.NatureOfBusiness" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {screenDetail?.natureOfBusiness
                ? industryCodeToName(screenDetail?.natureOfBusiness)
                : "-"}
            </TableCell>
          </TableRow>
          {/* Company Type*/}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.companyType" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {screenDetail?.companyType
                ? formatMessage({
                    id: getCompanyType(screenDetail?.companyType)
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
              {screenDetail?.relationship || "-"}
            </TableCell>
          </TableRow>
          {/* Address Line 1 */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "address-line-1" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {screenDetail?.address1 || "-"}
            </TableCell>
          </TableRow>
          {/* Address Line 2 */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "address-line-2" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {" "}
              {screenDetail?.address2 || "-"}
            </TableCell>
          </TableRow>
          {/* Country of Incorporation  &&  Country Of Headquarter */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.CountryOfIncorporation" })}
            </TableCell>
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {screenDetail?.countryOfIncorporation
                ? countryCodeToName(screenDetail?.countryOfIncorporation)
                : "-"}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "form.countryOfHeadquarter" })}
            </TableCell>
            <TableCell weighting={3} style={localStyle.tableContentHorizontal}>
              {screenDetail?.countryOfHeadQuarter
                ? countryCodeToName(screenDetail?.countryOfHeadQuarter)
                : "-"}
            </TableCell>
          </TableRow>
          {/* Business Information*/}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.risk.assessment.BusinessInfo" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {screenDetail?.businessInformation || "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.KeyWord" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              <Keyword
                itemPerRow={8}
                keywords={screenDetail?.positiveMatch?.keywords}
              ></Keyword>
            </TableCell>
          </TableRow>
        </Table>
      );
    };
    const renderMatches = () => {
      return (
        <View>
          {matches && matches.length > 0 ? (
            <Table>
              <TableRow>
                <TableCell style={localStyle.tableTitleHorizontal}>
                  {formatMessage({
                    id: "kyc.report.screeningId"
                  })}
                </TableCell>
                <TableCell
                  style={localStyle.tableTitleHorizontal}
                  weighting={1.5}
                >
                  {formatMessage({ id: "kyb.businessName" })}
                </TableCell>
                <TableCell
                  weighting={1.5}
                  style={localStyle.tableTitleHorizontal}
                >
                  {formatMessage({ id: "kyb.CountryOfIncorporation" })}
                </TableCell>

                <TableCell
                  weighting={2}
                  style={localStyle.tableTitleHorizontal}
                >
                  {formatMessage({
                    id: "kyb.KeyWord"
                  })}
                </TableCell>
                <TableCell
                  weighting={1.5}
                  style={localStyle.tableTitleHorizontal}
                >
                  {formatMessage({
                    id: "kyb.Status"
                  })}
                </TableCell>
              </TableRow>
              {matches.map((matchInfo, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell style={localStyle.tableContentHorizontal}>
                      {matchInfo.matchId}
                    </TableCell>
                    <TableCell
                      weighting={1.5}
                      style={localStyle.tableContentHorizontal}
                    >
                      {textMeasurement(matchInfo.businessName, 200)}
                    </TableCell>
                    <TableCell
                      weighting={1.5}
                      style={localStyle.tableContentHorizontal}
                    >
                      {countryCodeToName(
                        matchInfo.countryOfIncorporation,
                        "demonym"
                      ) || "-"}
                    </TableCell>
                    <TableCell
                      weighting={2}
                      style={localStyle.tableContentHorizontal}
                    >
                      <Keyword
                        itemPerRow={2}
                        keywords={matchInfo.keywords}
                      ></Keyword>
                    </TableCell>
                    <TableCell
                      style={localStyle.statusPossibleMatches}
                      weighting={1.5}
                    >
                      <Text>
                        {
                          {
                            POSITIVE: (
                              <Text style={{ color: "#cf1425" }}>
                                {formatMessage({
                                  id: "status.resolution.button.positive"
                                })}
                              </Text>
                            ),
                            FALSE: (
                              <Text style={{ color: "#4CAF4F" }}>
                                {formatMessage({
                                  id: "status.resolution.button.false"
                                })}
                              </Text>
                            ),
                            UNRESOLVED: (
                              <Text style={{ color: "#0080FF" }}>
                                {formatMessage({
                                  id: "status.resolution.button.unresolved"
                                })}
                              </Text>
                            )
                          }[matchInfo.status]
                        }
                      </Text>
                    </TableCell>
                  </TableRow>
                );
              })}
            </Table>
          ) : (
            <Table>
              <TableRow>
                <TableCell weighting={10}>
                  {formatMessage({
                    id: "kyb.noPossibleMatchesToShow"
                  })}
                </TableCell>
              </TableRow>
            </Table>
          )}
        </View>
      );
    };
    const header = {
      headerTitle: ["KYB", "SCREENING DETAILS REPORT"],
      subHeaderTitle: screenDetail.kybId,
      title: "KNOW YOUR CUSTOMER (KYB)",
      subTitle: "SCREENING DETAILS REPORT"
    };

    return (
      <ReportLayout header={header} footer={printedBy}>
        <View style={localStyle.reportContainer}>
          {/* KYB ID */}
          <View>
            <View
              style={[
                localStyle.titleForBlockFirst,
                {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between"
                }
              ]}
            >
              <Text>KYB ID - {screenDetail.kybId}</Text>
              <Text>
                <Text style={{ fontWeight: "unset" }}>
                  {formatMessage({
                    id: "kyb.Status"
                  })}
                </Text>
                {" - "}
                <Text style={{ color: getKybColorStatus(screenDetail.status) }}>
                  {formatMessage({
                    id: getKybStatusTranslate(screenDetail.status)
                  })}
                </Text>
              </Text>
            </View>
            <View>{renderPrinterInfo()}</View>
          </View>

          {/* SCREENING DETAILS */}
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage({ id: "screening-details" })} - {business.kybId}
            </Text>
            {renderScreeningDetails()}
          </View>

          {/* POSSIBLE MATCHES  */}
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage({ id: "kyc.report.possibleMatches" })}
            </Text>

            {renderMatches()}
          </View>
        </View>
        {/* NOTES */}
        <View>
          <View style={localStyle.titleForBlock}>
            <Text>{formatMessage({ id: "result.Table.Notes" })}</Text>
          </View>
          <ReportNote notes={notes}></ReportNote>
        </View>
      </ReportLayout>
    );
  }
);

export default KYBScreeningDetailsReport;
