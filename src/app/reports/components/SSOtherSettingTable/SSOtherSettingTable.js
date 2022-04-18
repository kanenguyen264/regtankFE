//@flow
import { StyleSheet, Text } from "@react-pdf/renderer";
import Table from "app/reports/components/Table";
import { TableCell } from "app/reports/components/Table/TableCell";
import { TableRow } from "app/reports/components/Table/TableRow";
import globalStyle from "app/reports/styles";
import React from "react";
import { useIntl } from "react-intl";
import { compose } from "recompose";
const localStyle = StyleSheet.create({
  ...globalStyle,
  tableTitleRiskLevel: {
    width: 119
  },
  tableTitleScoreThreshold: {
    width: 245,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  tableTitleOngoingMonitoring: {
    width: 132,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start"
  }
});
const SSOtherSettingTable = compose()(
  /**
   *
   * @param {SSOtherSettingTableProps} props
   * @returns {null}
   * @constructor
   */
  function SSOtherSettingTable(props) {
    const { formatMessage } = useIntl();
    return (
      <Table
        declareColumnSizings={[2, 6, 2]}
        disableEvenOdd
        bordered
        context={{
          TableRow: {
            style: { borderBottom: "1pt solid #CFCFCF" }
          },
          ...(props.context ?? {})
        }}
      >
        <TableRow evenOdd={"even"}>
          <TableCell
            style={[
              localStyle.tableTitleHorizontal,
              localStyle.tableTitleRiskLevel
            ]}
          >
            {formatMessage({ id: "setting.tab.other.RiskLevel" })}
          </TableCell>
          <TableCell
            weighting={119}
            totalWeight={495}
            style={[
              localStyle.tableTitleHorizontal,
              localStyle.tableTitleScoreThreshold
            ]}
          >
            {formatMessage({ id: "setting.tab.other.scoreThreshold" })}
          </TableCell>

          <TableCell
            style={[
              localStyle.tableTitleHorizontal,
              localStyle.tableTitleOngoingMonitoring
            ]}
          >
            {formatMessage({ id: "re-screening" })}
          </TableCell>
        </TableRow>
        <TableRow evenOdd={"odd"}>
          <TableCell
            style={[
              localStyle.tableTitleRiskLevel,
              { color: "#4CAF50", fontWeight: 700 }
            ]}
          >
            {formatMessage({ id: "setting.table.Low" })}
          </TableCell>
          <TableCell
            style={[
              localStyle.tableTitleHorizontal,
              localStyle.tableTitleScoreThreshold
            ]}
          >
            <Text>
              {formatMessage({
                id: "setting.table.aRiskScoreLessThan"
              })}{" "}
            </Text>
            <Text style={{ fontWeight: 700 }}>
              {props.scoring.otherSetting?.lowScore}{" "}
            </Text>
            <Text>
              {formatMessage({
                id: "setting.table.hasALowRisk"
              })}
            </Text>
          </TableCell>
          <TableCell
            style={[
              localStyle.tableTitleHorizontal,
              localStyle.tableTitleOngoingMonitoring
            ]}
          >
            <Text style={{ fontWeight: 700 }}>
              {props.scoring.otherSetting?.lowReScreening ?? "-"}{" "}
            </Text>
            <Text>{formatMessage({ id: "setting.tab.other.months" })}</Text>
          </TableCell>
        </TableRow>
        <TableRow evenOdd={"odd"}>
          <TableCell
            style={[
              localStyle.tableTitleRiskLevel,
              { color: "#FF9800", fontWeight: 700 }
            ]}
          >
            {formatMessage({ id: "setting.table.Medium" })}
          </TableCell>
          <TableCell
            style={[
              localStyle.tableTitleHorizontal,
              localStyle.tableTitleScoreThreshold
            ]}
          >
            <Text>
              {formatMessage({
                id: "setting.table.ARiskScoreFrom"
              })}
            </Text>
            <Text
              style={{
                fontWeight: 700
              }}
            >
              {Number(props.scoring.otherSetting?.lowScore) + 1 ?? "-"}
            </Text>
            <Text
              style={{
                paddingHorizontal: 3
              }}
            >
              {formatMessage({
                id: "setting.changeHistory.to"
              })}
            </Text>
            <Text
              style={{
                fontWeight: 700
              }}
            >
              {props.scoring.otherSetting?.mediumScore ?? "-"}
            </Text>
            <Text>
              {" "}
              {formatMessage({ id: "setting.table.hasAMediumRisk" })}
            </Text>
          </TableCell>
          <TableCell
            style={[
              localStyle.tableTitleHorizontal,
              localStyle.tableTitleOngoingMonitoring
            ]}
          >
            <Text
              style={{
                fontWeight: 700
              }}
            >
              {props.scoring.otherSetting?.mediumReScreening ?? "-"}{" "}
            </Text>
            <Text>{formatMessage({ id: "setting.tab.other.months" })}</Text>
          </TableCell>
        </TableRow>
        <TableRow evenOdd={"odd"}>
          <TableCell
            style={[
              localStyle.tableTitleRiskLevel,
              { color: "#EA2134", fontWeight: 700 }
            ]}
          >
            {formatMessage({ id: "setting.table.High" })}
          </TableCell>

          <TableCell
            style={[
              localStyle.tableTitleHorizontal,
              localStyle.tableTitleScoreThreshold
            ]}
          >
            <Text>
              {formatMessage({
                id: "setting.table.aRiskScoreMoreThan"
              })}
            </Text>
            <Text style={{ fontWeight: 700, paddingHorizontal: 3 }}>
              {Number(props.scoring.otherSetting?.mediumScore) ?? "-"}
            </Text>
            <Text
              style={{
                paddingHorizontal: 3
              }}
            >
              {formatMessage({ id: "setting.table.hasAHighRisk" })}
            </Text>
          </TableCell>
          <TableCell
            style={[
              localStyle.tableTitleHorizontal,
              localStyle.tableTitleOngoingMonitoring
            ]}
          >
            <Text style={{ fontWeight: 700 }}>
              {props.scoring.otherSetting?.highReScreening ?? "-"}{" "}
            </Text>
            <Text>{formatMessage({ id: "setting.tab.other.months" })}</Text>
          </TableCell>
        </TableRow>
      </Table>
    );
  }
);

export default SSOtherSettingTable;
