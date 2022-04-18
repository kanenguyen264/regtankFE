//@flow
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import ReportNote from "app/reports/components/ReportNote";
import RiskLevelButton from "app/reports/components/RiskLevelButton";
import Table from "app/reports/components/Table";
import { TableCell } from "app/reports/components/Table/TableCell";
import { TableRow } from "app/reports/components/Table/TableRow";
import useTextMeasurement from "app/reports/components/useTextMeasurement";
import globalStyle from "app/reports/styles";
import PropTypes from "prop-types";
import React from "react";
import { useIntl } from "react-intl";
import { compose } from "recompose";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { getRiskLevel } from "util/riskLevel";
import ReportLayout from "../components/ReportLayout";
import withReportProvider from "../components/withReportProvider";
import { renderUser } from "../utils";
import { countryCodeToName } from "util/country";

const localStyle = StyleSheet.create({
  ...globalStyle,
  transactionHeader: {
    fontSize: 6,
    fontWeight: 400
  },
  transactionContent: {
    fontSize: 6,
    fontWeight: 500,
    textAlign: "justify"
  },
  transactionDateTime: {
    width: 50
  },
  transactionId: {
    width: 95
  },
  transactionSenderRecipientRContainer: {
    width: 175,
    padding: 0,
    justifyContent: "flex-start"
  },
  transactionAddressHeader: {
    width: 81
  },
  transactionAddress: {
    width: 81,
    paddingTop: 6,
    paddingBottom: 0
  },
  transactionRiskScore: {
    width: 28,
    textAlign: "center"
  },
  transactionAmount: {
    width: 66
  }
});

const KYTScreeningDetailsReport = compose(withReportProvider)(
  /**
   *
   * @param {KYTScreeningDetailsReportProps} props
   * @returns {null}
   * @constructor
   */
  function KYTScreeningDetailsReport(props) {
    const { kyt, transactions, notes, printedBy } = props;
    const { formatMessage } = useIntl();
    const textMeasurement = useTextMeasurement();
    const header = {
      headerTitle: ["KYT", "SCREENING DETAILS REPORT"],
      subHeaderTitle: kyt.kytId,
      title: "KNOW YOUR TRANSACTION (KYT)",
      subTitle: "SCREENING DETAILS REPORT"
    };

    const renderSenderAndRecipient = (data) => {
      return (
        <Table disableEvenOdd>
          {data && data.length > 0 ? (
            data.map((item) => {
              const riskLevel = getRiskLevel(item.risk?.riskLevel);
              return (
                <TableRow key={item.id}>
                  <TableCell
                    style={[
                      localStyle.transactionContent,
                      localStyle.transactionAddress
                    ]}
                  >
                    {textMeasurement(item.address, 158)}
                  </TableCell>
                  <TableCell
                    style={[
                      localStyle.transactionContent,
                      localStyle.transactionRiskScore,
                      { color: riskLevel.color, fontSize: 7 }
                    ]}
                  >
                    {item.risk?.risk}
                  </TableCell>
                  <TableCell
                    style={[
                      localStyle.transactionContent,
                      localStyle.transactionAmount
                    ]}
                  >
                    {textMeasurement(`${item.amount} ${item.asset}`, 130)}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                style={[
                  localStyle.transactionContent,
                  localStyle.transactionAddress
                ]}
              ></TableCell>
              <TableCell
                style={[
                  localStyle.transactionContent,
                  localStyle.transactionRiskScore
                ]}
              ></TableCell>
              <TableCell
                style={[
                  localStyle.transactionContent,
                  localStyle.transactionAmount
                ]}
              ></TableCell>
            </TableRow>
          )}
        </Table>
      );
    };

    return (
      <ReportLayout header={header} footer={printedBy}>
        <View style={localStyle.reportContainer}>
          {/* KYT ID */}
          <View>
            <Text style={localStyle.titleForBlockFirst}>
              KYT ID - {kyt.kytId}
            </Text>
            <Table>
              <TableRow>
                <TableCell weighting={2}>
                  {formatMessage({ id: "company-name" })}
                </TableCell>
                <TableCell weighting={8} isHeader>
                  {kyt.addressDetails.wallet.name ?? "-"}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell weighting={2}>
                  {formatMessage({ id: "kyt.assignee" })}
                </TableCell>
                <TableCell weighting={8} isHeader>
                  {renderUser(kyt.assignee) || "-"}
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
                  {formatDate(kyt.createdAt, LONG_DATE_TIME)}
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
                  {kyt.createdBy ? renderUser(kyt.createdBy) : "-"}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell weighting={2}>
                  {formatMessage({ id: "last-modified-date" })}
                </TableCell>
                <TableCell weighting={3} isHeader>
                  {kyt.updatedAt
                    ? formatDate(kyt.updatedAt, LONG_DATE_TIME)
                    : "-"}
                </TableCell>
                <TableCell weighting={2}>
                  {formatMessage({ id: "last-modified-by" })}
                </TableCell>
                <TableCell weighting={3} isHeader>
                  {kyt.lastModifiedBy
                    ? `${kyt.lastModifiedBy.firstName} ${kyt.lastModifiedBy.lastName}`
                    : "-"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell weighting={2}>
                  {formatMessage({ id: "date-printed" })}
                </TableCell>
                <TableCell weighting={3} isHeader>
                  {formatDate(new Date(), LONG_DATE_TIME)}
                </TableCell>
                <TableCell weighting={2}>
                  {formatMessage({ id: "printed-by" })}
                </TableCell>
                <TableCell weighting={3} isHeader>
                  {props.printedBy ? renderUser(props.printedBy) : "-"}
                </TableCell>
              </TableRow>
            </Table>
          </View>

          {/* RISK SCORE / LEVEL */}
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage({
                id: "kyt.riskScoreLevel"
              })}
            </Text>
            <Table
              style={{
                border: "1pt solid #F5F5F5"
              }}
            >
              <TableRow>
                <TableCell weighting={10} textAlign="center">
                  <Text
                    style={{
                      fontWeight: 700,
                      fontSize: 9
                    }}
                  >
                    {formatMessage({ id: "kyt.riskScoreLevel" })}
                  </Text>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell weighting={10}>
                  <RiskLevelButton
                    level={kyt.addressDetails?.risk?.riskLevel}
                    score={kyt.addressDetails?.risk?.risk}
                  ></RiskLevelButton>
                </TableCell>
              </TableRow>
            </Table>
          </View>

          {/* SCREENING DETAILS*/}
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage(
                {
                  id: "kyt.screeningDetailsWithId"
                },
                {
                  ID: kyt.kytId
                }
              )}
            </Text>
            <Table>
              <TableRow>
                <TableCell weighting={2}>
                  {formatMessage({ id: "wallet-address" })}
                </TableCell>
                <TableCell weighting={8} isHeader>
                  {kyt.address}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell weighting={2}>
                  {formatMessage({ id: "owner" })}
                </TableCell>
                <TableCell weighting={8} isHeader>
                  {kyt.addressDetails.wallet.name ?? "-"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell weighting={2}>
                  {formatMessage({ id: "appModule.asset" })}
                </TableCell>
                <TableCell weighting={3} isHeader>
                  {kyt.asset}
                </TableCell>
                <TableCell weighting={2}>
                  {formatMessage({ id: "type" })}
                </TableCell>
                <TableCell weighting={3} isHeader>
                  {kyt.addressDetails.wallet.type?.toUpperCase() ?? "-"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell weighting={2}>
                  {formatMessage({ id: "country" })}
                </TableCell>
                <TableCell weighting={8} isHeader>
                  {countryCodeToName(kyt.addressDetails?.wallet?.country) ||
                    "-"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell weighting={2}>
                  {formatMessage({ id: "reference-id" })}
                </TableCell>
                <TableCell weighting={8} isHeader>
                  {kyt.referenceId ?? "-"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell weighting={2}>
                  {formatMessage({ id: "received" })}
                </TableCell>
                <TableCell weighting={3} isHeader>
                  <Text style={{ color: "#4CAF4F", fontWeight: 600 }}>
                    {(kyt.addressDetails.totalDeposits ?? 0).toFixed(9)}{" "}
                    {kyt.asset}
                  </Text>
                </TableCell>
                <TableCell weighting={2}>
                  {formatMessage({ id: "kyt.transactions" })}
                </TableCell>
                <TableCell weighting={3} isHeader>
                  <Text>{kyt.addressDetails.totalDepositCount || 0}</Text>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell weighting={2}>
                  {formatMessage({ id: "sent" })}
                </TableCell>
                <TableCell weighting={3} isHeader>
                  <Text style={{ color: "#EA2134", fontWeight: 600 }}>
                    {(kyt.addressDetails.totalSpent ?? 0).toFixed(9)}{" "}
                    {kyt.asset}
                  </Text>
                </TableCell>
                <TableCell weighting={2}>
                  {formatMessage({ id: "kyt.transactions" })}
                </TableCell>
                <TableCell weighting={3} isHeader>
                  <Text>{kyt.addressDetails.totalSpendCount || 0}</Text>
                </TableCell>
              </TableRow>
            </Table>
          </View>

          {/* TRANSACTION HISTORY */}
          <View break>
            <Text style={localStyle.titleForBlockFirst}>
              {formatMessage({
                id: "kyt.transactionHistory"
              })}
            </Text>
            {transactions && transactions.length > 0 ? (
              <Table disableEvenOdd bordered>
                <TableRow evenOdd={"even"}>
                  <TableCell
                    style={[
                      localStyle.transactionHeader,
                      localStyle.transactionDateTime
                    ]}
                  >
                    {formatMessage({
                      id: "kyt.transaction.dateTime"
                    })}
                  </TableCell>
                  <TableCell
                    style={[
                      localStyle.transactionHeader,
                      localStyle.transactionId
                    ]}
                  >
                    {formatMessage({
                      id: "kyt.transaction.transactionId"
                    })}
                  </TableCell>
                  <TableCell
                    style={[
                      localStyle.transactionHeader,
                      localStyle.transactionAddressHeader
                    ]}
                  >
                    {formatMessage({
                      id: "kyt.transaction.sender"
                    })}
                  </TableCell>
                  <TableCell
                    style={[
                      localStyle.transactionHeader,
                      localStyle.transactionRiskScore
                    ]}
                  >
                    {formatMessage({ id: "kyt.transaction.riskScore" })}
                  </TableCell>
                  <TableCell
                    style={[
                      localStyle.transactionHeader,
                      localStyle.transactionAmount
                    ]}
                  >
                    {formatMessage({
                      id: "kyt.transaction.amount"
                    })}
                  </TableCell>
                  <TableCell
                    style={[
                      localStyle.transactionHeader,
                      localStyle.transactionAddressHeader
                    ]}
                  >
                    {formatMessage({ id: "kyt.transaction.recipient" })}
                  </TableCell>
                  <TableCell
                    style={[
                      localStyle.transactionHeader,
                      localStyle.transactionRiskScore
                    ]}
                  >
                    {formatMessage({ id: "kyt.transaction.riskScore" })}
                  </TableCell>
                  <TableCell
                    style={[
                      localStyle.transactionHeader,
                      localStyle.transactionAmount
                    ]}
                  >
                    {formatMessage({
                      id: "kyt.transaction.amount"
                    })}
                  </TableCell>
                </TableRow>
                {/* body */}
                {transactions &&
                  transactions.map((item) => {
                    return (
                      <TableRow key={item.id} evenOdd={"odd"}>
                        <TableCell
                          style={[
                            localStyle.transactionContent,
                            localStyle.transactionDateTime,
                            { justifyContent: "flex-start" }
                          ]}
                        >
                          {item.updatedAt
                            ? formatDate(item.timestamp, LONG_DATE_TIME)
                            : "-"}
                        </TableCell>
                        <TableCell
                          style={[
                            localStyle.transactionContent,
                            localStyle.transactionId,
                            { justifyContent: "flex-start" }
                          ]}
                        >
                          <Text>{textMeasurement(item.txHash, 170)}</Text>
                        </TableCell>
                        <TableCell
                          style={[
                            localStyle.transactionContent,
                            localStyle.transactionSenderRecipientRContainer
                          ]}
                        >
                          {renderSenderAndRecipient(item.senders)}
                        </TableCell>
                        <TableCell
                          style={[
                            localStyle.transactionContent,
                            localStyle.transactionSenderRecipientRContainer
                          ]}
                        >
                          {renderSenderAndRecipient(item.recipients)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </Table>
            ) : (
              <View>
                <Table>
                  <TableRow>
                    <TableCell weighting={10}>
                      {formatMessage({
                        id: "kyt.noTransactionsToShow"
                      })}
                    </TableCell>
                  </TableRow>
                </Table>
              </View>
            )}
          </View>

          {/* Notes */}
          <View>
            <Text style={localStyle.titleForBlock}>
              {formatMessage({
                id: "notes"
              })}
            </Text>
            <ReportNote notes={notes}></ReportNote>
          </View>
        </View>
      </ReportLayout>
    );
  }
);

KYTScreeningDetailsReport.propTypes = {
  kyt: PropTypes.object.isRequired,
  transactions: PropTypes.array,
  notes: PropTypes.array
};

export default KYTScreeningDetailsReport;
