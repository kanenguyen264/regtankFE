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
import { getGenderTranslate } from "util/gender";
import ReportLayout from "../components/ReportLayout";
import withReportProvider from "../components/withReportProvider";
import { renderUser } from "../utils";
import useTextMeasurement from "../components/useTextMeasurement";
const localStyle = StyleSheet.create({
  ...globalStyle,
});

const KYCScreeningDetailsReport = compose(withReportProvider)(
  /**
   *
   * @param {MatchResponseDto} props.match
   * @param {KycSimplifiedRequestDto} props.kycRequest
   * @param {BasicUserInfoDto} props.printedBy
   * @returns {null}
   * @constructor
   */
  function KYCScreeningDetailsReport(props) {
    const { company, individual, printedBy, notesDetail, matches = [] } = props;
    const screenDetail = individual.individualRequest;
    const individualMatches = matches;
    const notesIndividual =
      notesDetail && notesDetail.length > 0 ? notesDetail : [];
    const textMeasurement = useTextMeasurement();
    const { formatMessage } = useIntl();

    const renderPrinterInfo = () => {
      return (
        <Table>
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              KYC ID
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {individual.kycId}
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
              {formatMessage({ id: "kyc.Assignee" })}
            </TableCell>
            <TableCell weighting={8} style={localStyle.tableContentHorizontal}>
              {individual?.assignee ? renderUser(individual?.assignee) : "-"}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "report.createdDate" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {formatDate(individual.createdAt, LONG_DATE_TIME)}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "report.createdBy" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {individual.createdBy ? renderUser(individual.createdBy) : "-"}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell weighting={2} style={localStyle.tableTitleHorizontal}>
              {formatMessage({ id: "last-modified-date" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {formatDate(individual.updatedAt, LONG_DATE_TIME)}
            </TableCell>
            <TableCell weighting={2} style={localStyle.tableTitleHorizontal}>
              {formatMessage({ id: "last-modified-by" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {individual.lastModifiedBy
                ? renderUser(individual.lastModifiedBy)
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
          {/*  Name */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "name" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {screenDetail.name}
            </TableCell>
          </TableRow>
          {/*  Gender */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "result.Gender" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {formatMessage({ id: getGenderTranslate(screenDetail.gender) })}
            </TableCell>
          </TableRow>

          {/*  Reference ID */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "kyc.referenceId",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {screenDetail.referenceId || "-"}
            </TableCell>
          </TableRow>

          {/*  Year of Birth and Date of Birth  */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "screening.result.Yob" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {screenDetail.yearOfBirth || "-"}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "screening.result.Dob" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {formatDate(screenDetail.dateOfBirth) || "-"}
            </TableCell>
          </TableRow>

          {/*  Place of Birth  and Nationality*/}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "screening.result.Pob" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {countryCodeToName(screenDetail.placeOfBirth) || "-"}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "kyc.Nationality",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {countryCodeToName(screenDetail.nationality, "demonym") || "-"}
            </TableCell>
          </TableRow>
          {/*  ID Issuing Country */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "kyc.idIssuingCountry",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {countryCodeToName(screenDetail.idIssuingCountry) || "-"}
            </TableCell>
          </TableRow>

          {/*  Phone Number */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "kyc.phoneNumber",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {screenDetail.phone || "-"}
            </TableCell>
          </TableRow>

          {/*  Email Address */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "result.Table.EmailAddress",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {screenDetail.email || "-"}
            </TableCell>
          </TableRow>

          {/*  Government ID Number */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "kyc.report.governmentId",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {screenDetail.governmentIdNumber || "-"}
            </TableCell>
          </TableRow>

          {/*  Address Line1 */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "address-line-1",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {screenDetail.address1 || "-"}
            </TableCell>
          </TableRow>

          {/*  Address Line2 */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "address-line-2",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {screenDetail.address2 || "-"}
            </TableCell>
          </TableRow>

          {/*  Country of Residence */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "kyc.countryOfResidence",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {countryCodeToName(screenDetail.countryOfResidence) || "-"}
            </TableCell>
          </TableRow>

          {/* Keywords */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "kyc.KeyWord",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              <Keyword keywords={screenDetail.keywords || "-"} />
            </TableCell>
          </TableRow>
        </Table>
      );
    };
    const renderIndividualMatches = () => {
      return (
        <View>
          {individualMatches && individualMatches.length > 0 ? (
            <Table>
              <TableRow>
                <TableCell style={localStyle.tableTitleHorizontal}>
                  {formatMessage({
                    id: "kyc.report.screeningId",
                  })}
                </TableCell>
                <TableCell
                  style={localStyle.tableTitleHorizontal}
                  weighting={1.5}
                >
                  {formatMessage({
                    id: "kyc.report.name",
                  })}
                </TableCell>
                <TableCell style={localStyle.tableTitleHorizontal}>
                  {formatMessage({
                    id: "kyc.report.DOB",
                  })}
                </TableCell>
                <TableCell style={localStyle.tableTitleHorizontal}>
                  {formatMessage({
                    id: "kyc.filter.gender",
                  })}
                </TableCell>
                <TableCell style={localStyle.tableTitleHorizontal}>
                  {formatMessage({
                    id: "kyc.Nationality",
                  })}
                </TableCell>
                <TableCell
                  style={localStyle.tableTitleHorizontal}
                  weighting={2}
                >
                  {formatMessage({
                    id: "kyc.KeyWord",
                  })}
                </TableCell>
                <TableCell
                  weighting={1.5}
                  style={localStyle.tableTitleHorizontal}
                >
                  {formatMessage({
                    id: "kyc.Status",
                  })}
                </TableCell>
              </TableRow>
              {individualMatches.map((matchInfo, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell style={localStyle.tableContentHorizontal}>
                      {matchInfo.matchId}
                    </TableCell>
                    <TableCell
                      style={localStyle.tableContentHorizontal}
                      weighting={1.5}
                    >
                      {textMeasurement(matchInfo.name, 200)}
                    </TableCell>
                    <TableCell style={localStyle.tableContentHorizontal}>
                      {formatDate(matchInfo.dateOfBirth) || "-"}
                    </TableCell>
                    <TableCell style={localStyle.tableContentHorizontal}>
                      {formatMessage({
                        id: getGenderTranslate(matchInfo.gender),
                      })}
                    </TableCell>
                    <TableCell style={localStyle.tableContentHorizontal}>
                      {countryCodeToName(
                        matchInfo.nationalityCode,
                        "demonym"
                      ) || "-"}
                    </TableCell>
                    <TableCell
                      style={localStyle.tableContentHorizontal}
                      weighting={2}
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
                                  id: "status.resolution.button.positive",
                                })}
                              </Text>
                            ),
                            FALSE: (
                              <Text style={{ color: "#4CAF4F" }}>
                                {formatMessage({
                                  id: "status.resolution.button.false",
                                })}
                              </Text>
                            ),
                            UNRESOLVED: (
                              <Text style={{ color: "#0080FF" }}>
                                {formatMessage({
                                  id: "status.resolution.button.unresolved",
                                })}
                              </Text>
                            ),
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
                    id: "kyb.noPossibleMatchesToShow",
                  })}
                </TableCell>
              </TableRow>
            </Table>
          )}
        </View>
      );
    };
    const header = {
      headerTitle: ["KYC", "SCREENING DETAILS REPORT"],
      subHeaderTitle: individual.kycId,
      title: "KNOW YOUR CUSTOMER (KYC)",
      subTitle: "SCREENING DETAILS REPORT",
    };

    return (
      <ReportLayout header={header} footer={printedBy}>
        <View style={localStyle.reportContainer}>
          {/* KYC ID */}
          <View>
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
              <Text>KYC ID - {individual.kycId}</Text>
              <Text>
                <Text style={{ fontWeight: "unset" }}>
                  {formatMessage({
                    id: "case.detail.table.kyc.header.status",
                  })}
                </Text>
                {" - "}
                {
                  {
                    UNRESOLVED: (
                      <Text style={{ color: "#192D65" }}>
                        {formatMessage({
                          id: "appModule.kyc.status.UNRESOLVED",
                        })}
                      </Text>
                    ),
                    COMPLETED: (
                      <Text style={{ color: "#6C0BC1" }}>
                        {formatMessage({
                          id: "appModule.kyc.status.COMPLETED",
                        })}
                      </Text>
                    ),
                    NO_MATCH: (
                      <Text style={{ color: "#0080FF" }}>
                        {formatMessage({
                          id: "appModule.kyc.status.NO_MATCH",
                        })}
                      </Text>
                    ),
                    POSITIVE_MATCH: (
                      <Text style={{ color: "#0080FF" }}>
                        {formatMessage({
                          id: "appModule.kyc.status.POSITIVE_MATCH",
                        })}
                      </Text>
                    ),
                    APPROVED: (
                      <Text style={{ color: "#4CAF50" }}>
                        {formatMessage({
                          id: "appModule.filter.APPROVED",
                        })}
                      </Text>
                    ),
                    REJECTED: (
                      <Text style={{ color: "#EA2134" }}>
                        {formatMessage({
                          id: "appModule.filter.REJECTED",
                        })}
                      </Text>
                    ),
                  }[individual.status]
                }
              </Text>
            </View>
            <View>{renderPrinterInfo()}</View>
          </View>

          {/* SCREENING DETAILS */}
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage({ id: "screening-details" })} - {individual.kycId}
            </Text>
            {renderScreeningDetails()}
          </View>

          {/* POSSIBLE MATCHES  */}
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage({ id: "kyc.report.possibleMatches" })}
            </Text>

            {renderIndividualMatches()}
          </View>
        </View>
        {/* NOTES */}
        <View>
          <View style={localStyle.titleForBlock}>
            <Text>{formatMessage({ id: "result.Table.Notes" })}</Text>
          </View>

          <ReportNote notes={notesIndividual}></ReportNote>
        </View>
      </ReportLayout>
    );
  }
);

export default KYCScreeningDetailsReport;
