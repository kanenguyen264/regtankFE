import { Document, Font, Image, Page, View } from "@react-pdf/renderer";
import LegalNotice from "app/reports/components/LegalNotice";
import ReportFooter from "app/reports/components/ReportFooter/ReportFooter";
import ReportHeader from "app/reports/components/ReportHeader";
import globalStyle from "app/reports/styles";
import stickyTop from "assets/images/sticky-top.png";
import PropTypes from "prop-types";
import React from "react";
import { compose } from "recompose";
import fontRegular from "../../fonts/GenShinGothic-P/GenShinGothic-P-Regular.ttf";
import fontMedium from "../../fonts/GenShinGothic-P/GenShinGothic-P-Medium.ttf";
import fontBold from "../../fonts/GenShinGothic-P/GenShinGothic-P-Bold.ttf";

const fontUse = "GenShinGothic";

Font.register({
  family: fontUse,
  fonts: [
    { src: fontRegular },
    { src: fontMedium },
    { src: fontBold }
  ]
});

Font.registerHyphenationCallback((word) => [word]);

const ReportLayout = compose()(function ReportLayout({
  header,
  footer,
  children
}) {
  return (
    <Document>
      <Page size={"A4"} wrap style={globalStyle.body}>
        <View fixed style={globalStyle.headerStickyImage}>
          <Image src={stickyTop} />
        </View>
        <ReportHeader options={header} key="report-header-main"></ReportHeader>
        <View key="report-container">{children}</View>
        <ReportFooter printedBy={footer} key="report-footer"></ReportFooter>
      </Page>

      <Page size={"A4"} wrap style={globalStyle.body}>
        <View fixed style={globalStyle.headerStickyImage}>
          <Image src={stickyTop} />
        </View>
        <ReportHeader
          options={{
            ...header,
            isShowTitle: false
          }}
          key="report-header-legal"
        ></ReportHeader>
        <LegalNotice />
        <ReportFooter
          printedBy={footer}
          key="report-footer-legal"
        ></ReportFooter>
      </Page>
    </Document>
  );
});

ReportLayout.propTypes = {
  header: PropTypes.object,
  footer: PropTypes.object
};

export default ReportLayout;
