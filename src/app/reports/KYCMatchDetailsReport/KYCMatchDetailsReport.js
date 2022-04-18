//@flow
import { capitalizeFirst } from "@protego/sdk/utils/string";
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
import { countryCodeToName } from "util/country";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { getGenderTranslate } from "util/gender";
import { getHostURL, validURL } from "util/url";
import ReportLayout from "../components/ReportLayout";
import useTextMeasurement from "../components/useTextMeasurement";
import withReportProvider from "../components/withReportProvider";
import { renderUser } from "../utils";

const localStyle = StyleSheet.create({
  ...globalStyle,
});

const KYCMatchDetailsReport = compose(withReportProvider)(
  /**
   *
   * @param {MatchResponseDto} props.match
   * @param {KycSimplifiedRequestDto} props.kycRequest
   * @param {BasicUserInfoDto} props.printedBy
   * @returns {null}
   * @constructor
   */
  function KYCMatchDetailsReport(props) {
    const { company, matchDetail, printedBy, notesDetail } = props;
    const matchInfo = matchDetail.match;
    const screenDetail = matchDetail.request;
    const notesMatchDetail =
      notesDetail && notesDetail.length > 0 ? notesDetail : [];
    const textMeasurement = useTextMeasurement();
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
              {matchDetail?.assignee ? renderUser(matchDetail?.assignee) : "-"}
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
      const keywordsStyle = {
        paddingTop: 0,
        paddingBottom: 0,
      };
      return (
        <Table>
          {/*  Name */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "case.detail.individualRequest.name" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {screenDetail.name}
            </TableCell>
          </TableRow>
          {/*  Gender */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "case.detail.individualRequest.gender" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {formatMessage({ id: getGenderTranslate(screenDetail.gender) })}
            </TableCell>
          </TableRow>

          {/*  Reference ID */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "case.detail.individualRequest.referenceId",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {screenDetail.referenceId || "-"}
            </TableCell>
          </TableRow>

          {/*  Year of Birth and Date of Birth  */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "case.detail.individualRequest.YOB" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {screenDetail.yearOfBirth || "-"}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "case.detail.individualRequest.DOB" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {formatDate(screenDetail.dateOfBirth) || "-"}
            </TableCell>
          </TableRow>

          {/*  Place of Birth  and Nationality*/}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({ id: "case.detail.individualRequest.POB" })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {countryCodeToName(screenDetail.placeOfBirth) || "-"}
            </TableCell>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "case.detail.individualRequest.nationality",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={3}>
              {countryCodeToName(screenDetail.nationality, "demonym") || "-"}
            </TableCell>
          </TableRow>

          {/*  Phone Number */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "case.detail.individualRequest.phoneNumber",
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
                id: "case.detail.individualRequest.emailAddress",
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
                id: "case.detail.individualRequest.governmentId",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {screenDetail.governmentIdNumber || "-"}
            </TableCell>
          </TableRow>

          {/*  ID Issuing Country */}
          <TableRow>
            <TableCell style={localStyle.tableTitleHorizontal} weighting={2}>
              {formatMessage({
                id: "case.detail.individualRequest.idIssuingCountry",
              })}
            </TableCell>
            <TableCell style={localStyle.tableContentHorizontal} weighting={8}>
              {countryCodeToName(screenDetail.idIssuingCountry) || "-"}
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

          {/*  Keywords */}
          <TableRow>
            <TableCell
              style={{
                ...localStyle.tableContentHorizontal,
                ...keywordsStyle,
              }}
              weighting={2}
            >
              {formatMessage({
                id: "case.detail.table.kyc.header.keyword",
              })}
            </TableCell>
            <TableCell
              style={{
                ...localStyle.tableContentHorizontal,
                ...keywordsStyle,
              }}
              weighting={8}
            >
              <Keyword keywords={screenDetail.keywords} />
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

    const renderAssociations = () => {
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

    const header = {
      headerTitle: ["KYC", "MATCH DETAILS REPORT"],
      subHeaderTitle: matchDetail.kycId,
      title: "KNOW YOUR CUSTOMER (KYC)",
      subTitle: "MATCH DETAILS REPORT",
    };

    return (
      <ReportLayout header={header} footer={printedBy}>
        <View style={localStyle.reportContainer}>
          {/* KYC ID */}
          <View>
            <Text style={localStyle.titleForBlockFirst}>
              KYC ID - {matchDetail.kycId}
            </Text>
            {renderPrinterInfo()}
          </View>

          {/* SCREENING DETAILS */}
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage({ id: "screening-details" })} - {matchDetail.kycId}
            </Text>
            {renderScreeningDetails()}
          </View>

          {/* MATCH DETAILS */}
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
              <Text>
                {`${formatMessage({
                  id: "match-details",
                })} - ${matchInfo.matchId}`}
              </Text>
              <Text>
                <Text style={{ fontWeight: "unset" }}>
                  {formatMessage({
                    id: "case.detail.table.kyc.header.status",
                  })}
                </Text>
                {" - "}
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
            </View>
            <View>{renderMatchingDetails()}</View>
          </View>

          {/* KEY DATA */}
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage({
                id: "result.Table.KeyData",
              })}
            </Text>
            {renderKeyData()}
          </View>

          {/* FURTHER INFORMATION */}
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage({
                id: "result.Table.Further",
              })}
            </Text>
            {renderFurtherInformation()}
          </View>

          {/* ASSOCIATIONS */}
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage({
                id: "result.Table.Associations",
              })}
            </Text>
            {renderAssociations()}
          </View>

          {/* SOURCES */}
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage({
                id: "result.Table.Sources",
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

export default KYCMatchDetailsReport;
