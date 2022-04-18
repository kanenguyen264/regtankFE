//@flow
import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import HrTag from "app/reports/components/HrTag";
import globalStyle from "app/reports/styles";
import regtankLogo from "assets/images/logoRegtankReport.png";
import PropTypes from "prop-types";
import React from "react";
import { useIntl } from "react-intl";
import { compose } from "recompose";
import { formatDate, LONG_DATE_TIME } from "../../../../util/date";
import { renderUser } from "../../utils";

const localStyle = StyleSheet.create({
  col1: {
    width: 135,
    logo: {
      width: 121
    },
    copyRight: {
      fontSize: 6,
      fontWeight: 500
    }
  },
  col2: {
    width: 155,
    printBy: {
      fontSize: 7,
      fontWeight: 300,
      height: 13
    },
    printTime: {
      fontSize: 7,
      fontWeight: 700,
      marginBottom: 5
    },
    private: {
      fontSize: 8.5,
      fontWeight: 700
    }
  },
  col3: {
    width: 150,
    paddingTop: 18
  },
  col4: {
    width: 55,
    paddingTop: 12,
    textAlign: "right",
    fontSize: 8,
    fontWeight: 500
  }
});

const ReportFooter = compose()(
  /**
   *
   * @param {ReportFooterProps} props
   * @returns {null}
   * @constructor
   */
  function ReportFooter(props) {
    const { formatMessage } = useIntl();
    return (
      <View style={globalStyle.footer} fixed>
        <View style={globalStyle.row}>
          <View key={"col-1"} style={localStyle.col1}>
            <Image style={localStyle.col1.logo} src={regtankLogo}></Image>
            <Text style={localStyle.col1.copyRight}>
              © 2021 Regtank. All Rights Reserved.
            </Text>
          </View>
          <View key={"col-2"} style={localStyle.col2}>
            <Text style={localStyle.col2.printBy}>
              {formatMessage({ id: "appModule.report.footer.printedOn" })}
            </Text>
            <Text style={localStyle.col2.printTime}>
              {`${formatDate(new Date(), LONG_DATE_TIME)} by ${renderUser(
                props.printedBy
              )}`}
            </Text>
            <Text style={localStyle.col2.private}>PRIVATE & CONFIDENTIAL</Text>
          </View>
          <View key={"col-3"} style={localStyle.col3}>
            <HrTag></HrTag>
          </View>
          <View key={"col-4"} style={localStyle.col4}>
            <Text
              render={({ pageNumber, totalPages }) =>
                `${formatMessage({
                  id: "appModule.report.footer.page"
                })} ${pageNumber} / ${totalPages}`
              }
              fixed
            />
          </View>
        </View>
      </View>
    );
  }
);

ReportFooter.propTypes = {
  printedBy: PropTypes.object.isRequired
};

export default ReportFooter;
