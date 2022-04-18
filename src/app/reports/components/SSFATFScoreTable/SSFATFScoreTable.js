//@flow
import React from "react";
import { compose } from "recompose";
import Table from "app/reports/components/Table";
import { TableRow } from "app/reports/components/Table/TableRow";
import { TableCell } from "app/reports/components/Table/TableCell";
import { useIntl } from "react-intl";
import globalStyle from "app/reports/styles";
import { StyleSheet } from "@react-pdf/renderer";
const localStyle = StyleSheet.create({
  ...globalStyle
});

const SSFATFScoreTable = compose()(
  /**
   *
   * @param {SSFATFScoreTableProps} props
   * @returns {null}
   * @constructor
   */
  function SSFATFScoreTable(props) {
    const { formatMessage } = useIntl();
    return (
      <Table bordered>
        <TableRow>
          <TableCell
            weighting={135}
            totalWeight={495}
            style={localStyle.tableTitleHorizontal}
          >
            {formatMessage({ id: "setting.table.FATFSetting" })}
          </TableCell>
          <TableCell
            weighting={56}
            totalWeight={495}
            style={localStyle.tableTitleHorizontal}
            textAlign={"center"}
          >
            {formatMessage({ id: "setting.table.member" })}
          </TableCell>
          <TableCell
            weighting={56}
            totalWeight={495}
            style={localStyle.tableTitleHorizontal}
            textAlign={"center"}
          >
            APG
          </TableCell>
          <TableCell
            weighting={56}
            totalWeight={495}
            style={localStyle.tableTitleHorizontal}
            textAlign={"center"}
          >
            {formatMessage({ id: "setting.table.Highrisk" })}
          </TableCell>
          <TableCell
            weighting={72}
            totalWeight={495}
            style={localStyle.tableTitleHorizontal}
            textAlign={"center"}
          >
            {formatMessage({ id: "setting.table.Blacklisted" })}
          </TableCell>
          <TableCell
            weighting={56}
            totalWeight={495}
            style={localStyle.tableTitleHorizontal}
            textAlign={"center"}
          >
            {formatMessage({ id: "setting.table.Other" })}
          </TableCell>
          <TableCell
            weighting={64}
            totalWeight={495}
            style={localStyle.tableTitleHorizontal}
            textAlign={"center"}
          >
            {formatMessage({ id: "setting.table.NoInFormation" })}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell weighting={135} totalWeight={495} />
          <TableCell
            weighting={56}
            totalWeight={495}
            style={localStyle.tableContentHorizontal}
            textAlign={"center"}
          >
            {props.scoring.fatfPepScore?.fatfScore?.Members ?? "-"}
          </TableCell>
          <TableCell
            weighting={56}
            totalWeight={495}
            style={localStyle.tableContentHorizontal}
            textAlign={"center"}
          >
            {props.scoring.fatfPepScore?.fatfScore?.Apg ?? "-"}
          </TableCell>
          <TableCell
            weighting={72}
            totalWeight={495}
            style={localStyle.tableContentHorizontal}
            textAlign={"center"}
          >
            {props.scoring.fatfPepScore?.fatfScore?.HighRisk ?? "-"}
          </TableCell>
          <TableCell
            weighting={56}
            totalWeight={495}
            style={localStyle.tableContentHorizontal}
            textAlign={"center"}
          >
            {props.scoring.fatfPepScore?.fatfScore?.Blacklist ?? "-"}
          </TableCell>
          <TableCell
            weighting={56}
            totalWeight={495}
            style={localStyle.tableContentHorizontal}
            textAlign={"center"}
          >
            {props.scoring.fatfPepScore?.fatfScore?.NonFatf ?? "-"}
          </TableCell>
          <TableCell
            weighting={64}
            totalWeight={495}
            style={localStyle.tableContentHorizontal}
            textAlign={"center"}
          >
            {props.scoring.fatfPepScore?.fatfScore?.NoInformation ?? "-"}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            weighting={135}
            totalWeight={495}
            style={localStyle.tableTitleHorizontal}
          >
            {formatMessage({ id: "setting.table.PEPSetting" })}
          </TableCell>
          <TableCell
            weighting={56}
            totalWeight={495}
            style={localStyle.tableTitleHorizontal}
            textAlign={"center"}
          >
            {formatMessage({ id: "setting.table.NotPEP" })}
          </TableCell>
          <TableCell
            weighting={56}
            totalWeight={495}
            style={localStyle.tableTitleHorizontal}
            textAlign={"center"}
          >
            {formatMessage({ id: "setting.table.Tier4" })}
          </TableCell>
          <TableCell
            weighting={56}
            totalWeight={495}
            style={localStyle.tableTitleHorizontal}
            textAlign={"center"}
          >
            {formatMessage({ id: "setting.table.Tier3" })}
          </TableCell>
          <TableCell
            weighting={72}
            totalWeight={495}
            style={localStyle.tableTitleHorizontal}
            textAlign={"center"}
          >
            {formatMessage({ id: "setting.table.Tier2" })}
          </TableCell>
          <TableCell
            weighting={56}
            totalWeight={495}
            style={localStyle.tableTitleHorizontal}
            textAlign={"center"}
          >
            {formatMessage({ id: "setting.table.Tier1" })}
          </TableCell>
          <TableCell weighting={64} totalWeight={495}></TableCell>
        </TableRow>
        <TableRow textAlign={"center"}>
          <TableCell weighting={135} totalWeight={495} />
          <TableCell
            weighting={56}
            totalWeight={495}
            style={localStyle.tableContentHorizontal}
            textAlign={"center"}
          >
            {props.scoring.fatfPepScore?.pepScore?.NotPep ?? "-"}
          </TableCell>
          <TableCell
            weighting={56}
            totalWeight={495}
            style={localStyle.tableContentHorizontal}
            textAlign={"center"}
          >
            {props.scoring.fatfPepScore?.pepScore?.TierFour ?? "-"}
          </TableCell>
          <TableCell
            weighting={72}
            totalWeight={495}
            style={localStyle.tableContentHorizontal}
            textAlign={"center"}
          >
            {props.scoring.fatfPepScore?.pepScore?.TierThree ?? "-"}
          </TableCell>
          <TableCell
            weighting={56}
            totalWeight={495}
            style={localStyle.tableContentHorizontal}
            textAlign={"center"}
          >
            {props.scoring.fatfPepScore?.pepScore?.TierTwo ?? "-"}
          </TableCell>
          <TableCell
            weighting={56}
            totalWeight={495}
            style={localStyle.tableContentHorizontal}
            textAlign={"center"}
          >
            {props.scoring.fatfPepScore?.pepScore?.TierOne ?? "-"}
          </TableCell>
          <TableCell weighting={64} totalWeight={495}></TableCell>
        </TableRow>
      </Table>
    );
  }
);

export default SSFATFScoreTable;
