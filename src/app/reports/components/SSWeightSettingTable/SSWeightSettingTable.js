//@flow
import React from "react";
import { useIntl } from "react-intl";
import { compose } from "recompose";
import Table from "app/reports/components/Table";
import { TableRow } from "app/reports/components/Table/TableRow";
import { TableCell } from "app/reports/components/Table/TableCell";
import globalStyle from "app/reports/styles";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
const localStyle = StyleSheet.create({
  ...globalStyle
});
const SSWeightSettingTable = compose()(
  /**
   *
   * @param {SSWeightSettingTableProps} props
   * @returns {null}
   * @constructor
   */
  function SSWeightSettingTable(props) {
    const { formatMessage } = useIntl();
    return (
      <View>
        <Table disableEvenOdd bordered>
          {/* Sanctions - Active */}
          <TableRow evenOdd={"even"}>
            <TableCell weighting={5} style={localStyle.tableTitleHorizontal}>
              {formatMessage({ id: "setting.tab.weight.Sanctions" })}
            </TableCell>
            <TableCell weighting={5} style={localStyle.tableTitleHorizontal}>
              {formatMessage({ id: "setting.tab.weight.Active" })}
            </TableCell>
          </TableRow>

          <TableRow evenOdd={"odd"}>
            <TableCell weighting={5} style={localStyle.tableContentHorizontal}>
              {formatMessage({ id: "setting.tab.weight.person" })}
            </TableCell>
            <TableCell weighting={5} style={localStyle.tableContentHorizontal}>
              {(props.scoring.weightSetting?.isPersonSanction
                ? formatMessage({ id: "appModule.on" })
                : formatMessage({ id: "appModule.off" })) ?? "-"}
            </TableCell>
          </TableRow>

          <TableRow evenOdd={"odd"}>
            <TableCell weighting={5} style={localStyle.tableContentHorizontal}>
              {formatMessage({ id: "country" })}
            </TableCell>
            <TableCell weighting={5} style={localStyle.notesContent}>
              {(props.scoring.weightSetting?.isCountrySanction
                ? formatMessage({ id: "appModule.on" })
                : formatMessage({ id: "appModule.off" })) ?? "-"}
            </TableCell>
          </TableRow>
        </Table>

        <Table disableEvenOdd bordered>
          <TableRow evenOdd={"even"}>
            <TableCell
              weighting={247}
              totalWeight={495}
              style={localStyle.tableTitleHorizontal}
            >
              {formatMessage({ id: "setting.tab.weight.AML" })}
            </TableCell>
            <TableCell
              weighting={89}
              totalWeight={495}
              style={localStyle.tableTitleHorizontal}
            >
              {formatMessage({ id: "setting.tab.weight.Active" })}
            </TableCell>
            <TableCell
              weighting={74}
              totalWeight={495}
              style={localStyle.tableTitleHorizontal}
            >
              {formatMessage({ id: "setting.tab.weight.Score" })}
            </TableCell>
            <TableCell
              weighting={85}
              totalWeight={495}
              style={localStyle.tableTitleHorizontal}
            >
              {formatMessage({ id: "setting.tab.weight.Weight" })}
            </TableCell>
          </TableRow>

          {/* PEP Score Settings */}
          <TableRow evenOdd={"odd"}>
            <TableCell
              weighting={247}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {formatMessage({ id: "setting.table.PEPSetting" })}
            </TableCell>
            <TableCell
              weighting={89}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {(props.scoring.weightSetting?.pepScoreSetting?.isActive
                ? "ON"
                : "OFF") ?? "-"}
            </TableCell>
            <TableCell
              weighting={74}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.pepScoreSetting?.weight?.toFixed(
                2
              ) ?? "-"}
            </TableCell>
            <TableCell
              weighting={85}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.pepScoreSetting?.rebase?.toFixed(
                2
              ) ?? "-"}
            </TableCell>
          </TableRow>

          {/* Previously Sanctioned Person */}
          <TableRow evenOdd={"odd"}>
            <TableCell
              weighting={247}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {formatMessage({ id: "previously-sanctioned---person" })}
            </TableCell>
            <TableCell
              weighting={89}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {(props.scoring.weightSetting?.previouslySanction?.isActive
                ? "ON"
                : "OFF") ?? "-"}
            </TableCell>
            <TableCell
              weighting={74}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.previouslySanction?.weight?.toFixed(
                2
              ) ?? "-"}
            </TableCell>
            <TableCell
              weighting={85}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.previouslySanction?.rebase?.toFixed(
                2
              ) ?? "-"}
            </TableCell>
          </TableRow>

          {/* Financial Regulator */}
          <TableRow evenOdd={"odd"}>
            <TableCell
              weighting={247}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {formatMessage({ id: "financial-regulator" })}
            </TableCell>
            <TableCell
              weighting={89}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {(props.scoring.weightSetting?.financialRegulator?.isActive
                ? "ON"
                : "OFF") ?? "-"}
            </TableCell>
            <TableCell
              weighting={74}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.financialRegulator?.weight?.toFixed(
                2
              ) ?? "-"}
            </TableCell>
            <TableCell
              weighting={85}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.financialRegulator?.rebase?.toFixed(
                2
              ) ?? "-"}
            </TableCell>
          </TableRow>

          {/* Law Enforcement */}
          <TableRow evenOdd={"odd"}>
            <TableCell
              weighting={247}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {formatMessage({ id: "law-enforcement" })}
            </TableCell>
            <TableCell
              weighting={89}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {(props.scoring.weightSetting?.lawEnforcement?.isActive
                ? "ON"
                : "OFF") ?? "-"}
            </TableCell>
            <TableCell
              weighting={74}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.lawEnforcement?.weight?.toFixed(
                2
              ) ?? "-"}
            </TableCell>
            <TableCell
              weighting={85}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.lawEnforcement?.rebase?.toFixed(
                2
              ) ?? "-"}
            </TableCell>
          </TableRow>

          {/* Adverse Media */}
          <TableRow evenOdd={"odd"}>
            <TableCell
              weighting={247}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {formatMessage({ id: "adverse-media" })}
            </TableCell>
            <TableCell
              weighting={89}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {(props.scoring.weightSetting?.adverseMedia?.isActive
                ? "ON"
                : "OFF") ?? "-"}
            </TableCell>
            <TableCell
              weighting={74}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.adverseMedia?.weight?.toFixed(2) ??
                "-"}
            </TableCell>
            <TableCell
              weighting={85}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.adverseMedia?.rebase?.toFixed(2) ??
                "-"}
            </TableCell>
          </TableRow>

          {/* Country of Residence */}
          <TableRow evenOdd={"odd"}>
            <TableCell weighting={10} style={localStyle.tableContentHorizontal}>
              {formatMessage({ id: "country-of-residence" })}
            </TableCell>
          </TableRow>
          <TableRow evenOdd={"odd"}>
            <TableCell
              weighting={247}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              <Text style={localStyle.subRowTable}>
                ● {formatMessage({ id: "fatf" })}
              </Text>
            </TableCell>
            <TableCell
              weighting={89}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {(props.scoring.weightSetting?.fatfResidence?.isActive
                ? "ON"
                : "OFF") ?? "-"}
            </TableCell>
            <TableCell
              weighting={74}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.fatfResidence?.weight?.toFixed(2) ??
                "-"}
            </TableCell>
            <TableCell
              weighting={85}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.fatfResidence?.rebase?.toFixed(2) ??
                "-"}
            </TableCell>
          </TableRow>
          <TableRow evenOdd={"odd"}>
            <TableCell
              weighting={247}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              <Text style={localStyle.subRowTable}>
                ● {formatMessage({ id: "basel-aml-index" })}
              </Text>
            </TableCell>
            <TableCell
              weighting={89}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {(props.scoring.weightSetting?.baselResidence?.isActive
                ? "ON"
                : "OFF") ?? "-"}
            </TableCell>
            <TableCell
              weighting={74}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.baselResidence?.weight?.toFixed(
                2
              ) ?? "-"}
            </TableCell>
            <TableCell
              weighting={85}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.baselResidence?.rebase?.toFixed(
                2
              ) ?? "-"}
            </TableCell>
          </TableRow>
          <TableRow evenOdd={"odd"}>
            <TableCell
              weighting={247}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              <Text style={localStyle.subRowTable}>
                ● {formatMessage({ id: "corrupt-perception-index" })}
              </Text>
            </TableCell>
            <TableCell
              weighting={89}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {(props.scoring.weightSetting?.cpiResidence?.isActive
                ? "ON"
                : "OFF") ?? "-"}
            </TableCell>
            <TableCell
              weighting={74}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.cpiResidence?.weight?.toFixed(2) ??
                "-"}
            </TableCell>
            <TableCell
              weighting={85}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.cpiResidence?.rebase?.toFixed(2) ??
                "-"}
            </TableCell>
          </TableRow>

          {/* ID Issuing Country */}
          <TableRow evenOdd={"odd"}>
            <TableCell weighting={10} style={localStyle.tableContentHorizontal}>
              {formatMessage({ id: "form.idIssuingCountry" })}
            </TableCell>
          </TableRow>
          <TableRow evenOdd={"odd"}>
            <TableCell
              weighting={247}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              <Text style={localStyle.subRowTable}>● FATF</Text>
            </TableCell>
            <TableCell
              weighting={89}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {(props.scoring.weightSetting?.fatfGoverment?.isActive
                ? "ON"
                : "OFF") ?? "-"}
            </TableCell>
            <TableCell
              weighting={74}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.fatfGoverment?.weight?.toFixed(2) ??
                "-"}
            </TableCell>
            <TableCell
              weighting={85}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.fatfGoverment?.rebase?.toFixed(2) ??
                "-"}
            </TableCell>
          </TableRow>
          <TableRow evenOdd={"odd"}>
            <TableCell
              weighting={247}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              <Text style={localStyle.subRowTable}>
                ● {formatMessage({ id: "basel-aml-index" })}
              </Text>
            </TableCell>
            <TableCell
              weighting={89}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {(props.scoring.weightSetting?.baselGoverment?.isActive
                ? "ON"
                : "OFF") ?? "-"}
            </TableCell>
            <TableCell
              weighting={74}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.baselGoverment?.weight?.toFixed(
                2
              ) ?? "-"}
            </TableCell>
            <TableCell
              weighting={85}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.baselGoverment?.rebase?.toFixed(
                2
              ) ?? "-"}
            </TableCell>
          </TableRow>
          <TableRow evenOdd={"odd"}>
            <TableCell
              weighting={247}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              <Text style={localStyle.subRowTable}>
                ● {formatMessage({ id: "corrupt-perception-index" })}
              </Text>
            </TableCell>
            <TableCell
              weighting={89}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {(props.scoring.weightSetting?.cpiGoverment?.isActive
                ? "ON"
                : "OFF") ?? "-"}
            </TableCell>
            <TableCell
              weighting={74}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.cpiGoverment?.weight?.toFixed(2) ??
                "-"}
            </TableCell>
            <TableCell
              weighting={85}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.cpiGoverment?.rebase?.toFixed(2) ??
                "-"}
            </TableCell>
          </TableRow>

          {/* Nationality */}
          <TableRow evenOdd={"odd"}>
            <TableCell weighting={10} style={localStyle.tableContentHorizontal}>
              {formatMessage({ id: "nationality" })}
            </TableCell>
          </TableRow>
          <TableRow evenOdd={"odd"}>
            <TableCell
              weighting={247}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              <Text style={localStyle.subRowTable}>● FATF</Text>
            </TableCell>
            <TableCell
              weighting={89}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {(props.scoring.weightSetting?.fatfNationality?.isActive
                ? "ON"
                : "OFF") ?? "-"}
            </TableCell>
            <TableCell
              weighting={74}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.fatfNationality?.weight?.toFixed(
                2
              ) ?? "-"}
            </TableCell>
            <TableCell
              weighting={85}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.fatfNationality?.rebase?.toFixed(
                2
              ) ?? "-"}
            </TableCell>
          </TableRow>
          <TableRow evenOdd={"odd"}>
            <TableCell
              weighting={247}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              <Text style={localStyle.subRowTable}>
                ● {formatMessage({ id: "basel-aml-index" })}
              </Text>
            </TableCell>
            <TableCell
              weighting={89}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {(props.scoring.weightSetting?.baselNationality?.isActive
                ? "ON"
                : "OFF") ?? "-"}
            </TableCell>
            <TableCell
              weighting={74}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.baselNationality?.weight?.toFixed(
                2
              ) ?? "-"}
            </TableCell>
            <TableCell
              weighting={85}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.baselNationality?.rebase?.toFixed(
                2
              ) ?? "-"}
            </TableCell>
          </TableRow>
          <TableRow evenOdd={"odd"}>
            <TableCell
              weighting={247}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              <Text style={localStyle.subRowTable}>
                ● {formatMessage({ id: "corrupt-perception-index" })}
              </Text>
            </TableCell>
            <TableCell
              weighting={89}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {(props.scoring.weightSetting?.cpiNationality?.isActive
                ? "ON"
                : "OFF") ?? "-"}
            </TableCell>
            <TableCell
              weighting={74}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.cpiNationality?.weight.toFixed(2) ??
                "-"}
            </TableCell>
            <TableCell
              weighting={85}
              totalWeight={495}
              style={localStyle.tableContentHorizontal}
            >
              {props.scoring.weightSetting?.cpiNationality?.rebase?.toFixed(
                2
              ) ?? "-"}
            </TableCell>
          </TableRow>
        </Table>
      </View>
    );
  }
);

export default SSWeightSettingTable;
