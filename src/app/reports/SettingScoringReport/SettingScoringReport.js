import { Image, Text, View } from "@react-pdf/renderer";
import Table from "app/reports/components/Table";
import { TableCell } from "app/reports/components/Table/TableCell";
import { TableRow } from "app/reports/components/Table/TableRow";
import moment from "moment";
import React from "react";
import { useIntl } from "react-intl";
import { compose } from "recompose";
import { formatDate, LONG_DATE_TIME } from "util/date";
import ReportLayout from "../components/ReportLayout";
import SSFATFScoreTable from "../components/SSFATFScoreTable/SSFATFScoreTable";
import SSOtherSettingTable from "../components/SSOtherSettingTable/SSOtherSettingTable";
import SSWeightSettingTable from "../components/SSWeightSettingTable/SSWeightSettingTable";
import withReportProvider from "../components/withReportProvider";
import { renderUser, toPrintedPt } from "../utils";

const styles = {
  header: {
    fontWeight: "medium",
    fontSize: toPrintedPt(25)
  },
  subHeader: {
    fontWeight: "medium",
    fontSize: toPrintedPt(20),
    textTransform: "uppercase"
  }
};

const SettingScoringReport = compose(withReportProvider)(
  /**
   *
   * @param {SettingScoringReportProps} props
   * @returns {null}
   * @constructor
   */
  function SettingScoringReport(props) {
    const { formatMessage } = useIntl();
    const header = {
      headerTitle: ["KYT", "SCREENING DETAILS REPORT"],
      subHeaderTitle: null,
      title: "KNOW YOUR TRANSACTION (KYT)",
      subTitle: "SCREENING DETAILS REPORT"
    };

    return (
      <ReportLayout header={header} footer={props.printedBy}>
        <Text style={[styles.header, { marginTop: toPrintedPt(100, "v") }]}>
          {formatMessage({ id: "scoring-setting" })}
        </Text>
        <Table style={{ paddingTop: toPrintedPt(40, "v") }}>
          <TableRow>
            <TableCell weighting={2} isHeader>
              {formatMessage({ id: "company-name" })}
            </TableCell>
            <TableCell weighting={8}>{props.company.company}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell weighting={2} isHeader>
              {formatMessage({ id: "date-printed" })}
            </TableCell>
            <TableCell weighting={3}>
              {moment().format("DD MMM YYYY")}
            </TableCell>
            <TableCell weighting={2} isHeader>
              {formatMessage({ id: "last-modified-by" })}
            </TableCell>
            <TableCell weighting={3}>{renderUser(props.printedBy)}</TableCell>
          </TableRow>
        </Table>
        <Text style={[styles.header, { marginTop: toPrintedPt(75, "v") }]}>
          {formatMessage({ id: "scoring-setting" })}
        </Text>
        <Text style={[styles.subHeader, { marginTop: toPrintedPt(40, "v") }]}>
          {formatMessage({ id: "fatf-pep-score" })}
        </Text>
        <SSFATFScoreTable scoring={props.scoring} />
        <Text style={[styles.subHeader, { marginTop: toPrintedPt(80, "v") }]}>
          {formatMessage({ id: "risk-parameter" })}
        </Text>
        <Image
          src={props.chartData}
          style={{
            width: toPrintedPt((1040 * 2) / 3, "h")
          }}
        />
        <SSWeightSettingTable scoring={props.scoring} />
        <View wrap={false}>
          <Text style={styles.subHeader}>
            {formatMessage({ id: "setting.tab.other.RiskLevel" })}
          </Text>
          <SSOtherSettingTable scoring={props.scoring} />
        </View>
        <View
          style={{
            color: "#434343"
          }}
          wrap={true}
        >
          <Text
            style={{
              marginTop: toPrintedPt(40, "v")
            }}
          >
            <Text
              style={{
                fontWeight: 600
              }}
            >
              {formatMessage({ id: "setting.tab.weight.ScoringParameter" })}:{" "}
            </Text>
            <Text>{props.scoring?.name}</Text>
          </Text>
          <Text
            style={{
              marginTop: toPrintedPt(10, "v")
            }}
          >
            <Text
              style={{
                fontWeight: 600
              }}
            >
              {formatMessage({
                id: "setting.scoring.dateEdit"
              })}
              {": "}
            </Text>
            <Text>{formatDate(props.scoring?.updatedAt, LONG_DATE_TIME)}</Text>
          </Text>
        </View>
      </ReportLayout>
    );
  }
);

export default SettingScoringReport;
