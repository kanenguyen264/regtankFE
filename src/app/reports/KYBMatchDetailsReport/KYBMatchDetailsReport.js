//@flow
import { Link, StyleSheet, Text, View } from "@react-pdf/renderer";
import Keyword from "app/reports/components/Keyword";
import ReportNote from "app/reports/components/ReportNote";
import Table from "app/reports/components/Table";
import { TableCell } from "app/reports/components/Table/TableCell";
import TableEmpty from "app/reports/components/Table/TableEmpty";
import { TableRow } from "app/reports/components/Table/TableRow";
import globalStyle from "app/reports/styles";
import React from "react";
import { useIntl } from "react-intl";
import { compose } from "recompose";
import { isEmptyValues } from "util/array";
import { getCompanyType } from "util/companyType";
import { countryCodeToName } from "util/country";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { industryCodeToName } from "util/industry";
import { getKybColorStatus, getKybStatusTranslate } from "util/kycStatus";
import { getSizeOfCompany } from "util/sizeOfCompany";
import { getHostURL, validURL } from "util/url";
import ReportLayout from "../components/ReportLayout";
import useTextMeasurement from "../components/useTextMeasurement";
import withReportProvider from "../components/withReportProvider";
import { renderUser } from "../utils";

const localStyle = StyleSheet.create({
  ...globalStyle
});

const KYBMatchDetailsReport = compose(withReportProvider)(
  function KYBMatchDetailsReport(props) {
    const { company, matchDetail, printedBy, notesDetail } = props;
    const textMeasurement = useTextMeasurement();
    const matchInfo = matchDetail.match;
    const screenDetail = matchDetail.request;
    const notesMatchDetail =
      notesDetail && notesDetail.length > 0 ? notesDetail : [];
    const { formatMessage } = useIntl();

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

    const renderPrinterInfo = () => {
      return (
        <Table>
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "screening-id" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {matchDetail.match?.matchId || "-"}
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
              {formatMessage({ id: "kyt.assignee" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
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
              {formatDate(screenDetail?.createdAt, LONG_DATE_TIME)}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "report.createdBy" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {screenDetail?.createdBy
                ? renderUser(screenDetail.createdBy)
                : "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "last-modified-date" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {formatDate(screenDetail.updatedAt, LONG_DATE_TIME)}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "last-modified-by" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {screenDetail.lastModifiedBy
                ? renderUser(screenDetail.lastModifiedBy)
                : "-"}
            </TableCell>
          </TableRow>

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
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {screenDetail?.businessName || "-"}
            </TableCell>
          </TableRow>
          {/*  Reference ID */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "case.detail.individualRequest.referenceId"
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
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
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {screenDetail?.positiveMatch?.matchId || "-"}
            </TableCell>
          </TableRow>
          {/* Assignee */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "screening.result.Assignee" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
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
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {formatDate(screenDetail?.dateOfIncorporation, LONG_DATE_TIME) ||
                "-"}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.sizeOfCompany" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
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
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {screenDetail.businessIdNumber || "-"}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "phone-number" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {screenDetail.phone || "-"}
            </TableCell>
          </TableRow>
          {/* Email Address */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "email-address" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {screenDetail.email || "-"}
            </TableCell>
          </TableRow>
          {/* Website */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.Website" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {screenDetail.website || "-"}
            </TableCell>
          </TableRow>
          {/* Nature Of Business */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.NatureOfBusiness" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {screenDetail.natureOfBusiness
                ? industryCodeToName(screenDetail.natureOfBusiness)
                : "-"}
            </TableCell>
          </TableRow>
          {/* Company Type*/}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.companyType" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {screenDetail.companyType
                ? formatMessage({
                    id: getCompanyType(screenDetail.companyType)
                  })
                : "-"}
            </TableCell>
          </TableRow>
          {/* Business Relationship*/}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.Relationship" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {screenDetail.relationship || "-"}
            </TableCell>
          </TableRow>
          {/* Address Line 1 */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "address-line-1" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {screenDetail.address1 || "-"}
            </TableCell>
          </TableRow>
          {/* Address Line 2 */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "address-line-2" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {" "}
              {screenDetail.address2 || "-"}
            </TableCell>
          </TableRow>
          {/* Country of Incorporation  &&  Country Of Headquarter */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.CountryOfIncorporation" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {screenDetail.countryOfIncorporation
                ? countryCodeToName(screenDetail.countryOfIncorporation)
                : "-"}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "form.countryOfHeadquarter" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {screenDetail.countryOfHeadQuarter
                ? countryCodeToName(screenDetail.countryOfHeadQuarter)
                : "-"}
            </TableCell>
          </TableRow>
          {/* Business Information*/}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.risk.assessment.BusinessInfo" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {screenDetail.businessInformation || "-"}
            </TableCell>
          </TableRow>
        </Table>
      );
    };

    const renderMatchingDetails = () => {
      return (
        <Table>
          {/*  business Name */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.businessName" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {matchInfo?.businessName ? matchInfo.businessName : "-"}
            </TableCell>
          </TableRow>
          {/*  business Name */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "kyb.alias" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {matchInfo.aliases.length > 0
                ? matchInfo.aliases.join(", ")
                : "-"}
            </TableCell>
          </TableRow>
          {/* Phone number */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "phone-number" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {matchInfo.telephoneNumber ? matchInfo.telephoneNumber : "-"}
            </TableCell>
          </TableRow>
          {/* Phone number */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "screening.result.Address" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {matchInfo.addresses.length > 0
                ? matchInfo.addresses.map((item, indexAddresses) => (
                    <Text key={indexAddresses}>{item}</Text>
                  ))
                : "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "case.detail.table.kyc.header.keyword"
              })}
            </TableCell>
            <TableCell weighting={8}>
              <Keyword keywords={matchInfo.keywords}></Keyword>
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
              id: "kyb.report.nodata.noKeyDataToShow"
            })}
          </Text>
        </TableEmpty>
      ) : (
        <Table>
          {/*  Notes */}
          <TableRow>
            <TableCell
              weighting={2}
              style={[
                localStyle.tableTitleHorizontal,
                { justifyContent: "flex-start" }
              ]}
            >
              {formatMessage({
                id: "result.Table.Notes"
              })}
            </TableCell>
            <TableCell style={localStyle.notesContent} weighting={8}>
              {keysData.notes && keysData.notes.length > 0
                ? keysData.notes.map((key, i) => {
                    return (
                      <Text key={i} style={localStyle.tableContentHorizontal}>
                        {key.text}
                      </Text>
                    );
                  })
                : "-"}
            </TableCell>
          </TableRow>
        </Table>
      );
    };

    const renderLinkedBusinesses = () => {
      const linkedBusinesses = matchInfo.linkedBusinesses;
      return linkedBusinesses && linkedBusinesses.length > 0 ? (
        <Table disableEvenOdd={true} bordered={true}>
          <TableRow evenOdd="even">
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "result.Table.BusinessName"
              })}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={8}>
              {formatMessage({
                id: "connection.table.connection"
              })}
            </TableCell>
          </TableRow>
          {linkedBusinesses.map((item, i) => {
            return (
              <TableRow key={i} evenOdd={"odd"}>
                <TableCell
                  weighting={2}
                  style={localStyle.tableContentHorizontal}
                >
                  {item.businessName || "-"}
                </TableCell>
                <TableCell
                  style={localStyle.tableContentHorizontal}
                  weighting={8}
                >
                  {item.linkDescription || "-"}
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      ) : (
        <TableEmpty>
          <Text>
            {formatMessage({
              id: "kyb.report.nodata.noLinkedBusinessesToShow"
            })}
          </Text>
        </TableEmpty>
      );
    };

    const renderLinkedIndividuals = () => {
      const linkedIndividuals = matchInfo.linkedIndividuals;
      return linkedIndividuals && linkedIndividuals.length > 0 ? (
        <Table disableEvenOdd={true} bordered={true}>
          <TableRow evenOdd="even">
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "source.table.name"
              })}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={8}>
              {formatMessage({
                id: "kyb.position"
              })}
            </TableCell>
          </TableRow>
          {linkedIndividuals.map((item, i) => {
            return (
              <TableRow key={i} evenOdd={"odd"}>
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
                  {item.position || "-"}
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      ) : (
        <TableEmpty>
          <Text>
            {formatMessage({
              id: "kyb.report.nodata.noLinkedIndividualsToShow"
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
                id: "case.detail.individualRequest.name"
              })}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={3}>
              {formatMessage({
                id: "source.table.Categories"
              })}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "source.table.CreationDate"
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
                  <TableCell weighting={3} style={{ color: "#000" }}>
                    <View
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row"
                      }}
                    >
                      <Keyword
                        itemPerRow={2}
                        keywords={item.keywords}
                      ></Keyword>
                    </View>
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
              id: "kyb.report.nodata.noSourcesToShow"
            })}
          </Text>
        </TableEmpty>
      );
    };

    const header = {
      headerTitle: ["KYB", "MATCH DETAILS REPORT"],
      subHeaderTitle: matchDetail.kybId,
      title: "KNOW YOUR BUSINESS (KYB)",
      subTitle: "MATCH DETAILS REPORT"
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
              <Text style={localStyle.titleForBlockFirst}>
                KYB ID - {matchDetail.kybId}
              </Text>
              <Text style={localStyle.titleForBlockFirst}>
                <Text style={{ fontWeight: "unset" }}>
                  {formatMessage({
                    id: "case.detail.table.kyc.header.status"
                  })}
                </Text>
                {" - "}
                <Text
                  style={{ color: getKybColorStatus(screenDetail?.status) }}
                >
                  {formatMessage({
                    id: getKybStatusTranslate(screenDetail?.status)
                  })}
                </Text>
              </Text>
            </View>
            {renderPrinterInfo()}
          </View>

          {/* SCREENING DETAILS */}
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage({ id: "screening-details" })}
              {" - "}
              {matchDetail.kybId}
            </Text>
            {renderScreeningDetails()}
          </View>

          {/* MATCH DETAILS */}
          <View>
            <View
              style={[
                localStyle.titleForBlock,
                {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between"
                }
              ]}
            >
              <Text>
                {formatMessage({
                  id: "match-details"
                })}
                {" - "}
                {matchInfo.matchId}
              </Text>
              <Text localStyle={{ display: "flex", float: "right" }}>
                <Text style={{ fontWeight: "unset" }}>
                  {formatMessage({
                    id: "case.detail.table.kyc.header.status"
                  })}
                </Text>
                {" - "}
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
            </View>
          </View>
          <View>{renderMatchingDetails()}</View>

          {/* KEY DATA */}
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage({
                id: "result.Table.KeyData"
              })}
            </Text>
            {renderKeyData()}
          </View>

          {/* LINKED BUSINESSES */}
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage({
                id: "result.Table.LinkedBusinesses"
              })}
            </Text>
            {renderLinkedBusinesses()}
          </View>

          {/* LINKED INDIVIDUALS */}
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage({
                id: "result.Table.LinkedIndividuals"
              })}
            </Text>
            {renderLinkedIndividuals()}
          </View>

          {/* SOURCES */}
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage({
                id: "result.Table.Sources"
              })}
            </Text>
            {renderSources()}
          </View>

          {/* NOTES */}
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage({ id: "result.Table.Notes" })}
            </Text>
            <ReportNote notes={notesMatchDetail}></ReportNote>
          </View>
        </View>
      </ReportLayout>
    );
  }
);

export default KYBMatchDetailsReport;
