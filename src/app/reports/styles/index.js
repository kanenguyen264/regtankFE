import { StyleSheet } from "@react-pdf/renderer";

const fontUse = "GenShinGothic";

const h1Light = {
  fontSize: 27,
  lineHeight: "160%"
};

const h3Light = {
  fontSize: 12,
  lineHeight: "150%"
};

const h4Light = {
  fontSize: 12,
  lineHeight: "150%"
};

const styles = StyleSheet.create({
  body: {
    position: "relative",
    paddingHorizontal: 50,
    paddingVertical: 53,
    paddingBottom: 98,
    fontFamily: fontUse,
    fontSize: 8
    // fontWeight: "normal"
  },
  header: {
    marginBottom: 16
  },
  headerContainer: {
    width: 495
  },
  headerTopLine: {
    position: "absolute",
    top: 9
  },
  headerTopRight: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  headerTopRightFirstWord: {
    fontSize: 14,
    fontWeight: 700,
    backgroundColor: "#fff",
    paddingLeft: 22
  },
  headerTopRightSecondWord: {
    fontSize: 14,
    fontWeight: 400,
    paddingLeft: 5,
    backgroundColor: "#fff"
  },
  headerTopSubtitle: {
    flexDirection: "row",
    justifyContent: "flex-end",
    fontSize: 10,
    fontWeight: 700
  },
  headerStickyImage: {
    position: "absolute",
    width: 76,
    height: 62,
    top: 0,
    right: 0
  },
  flex: {
    display: "flex"
  },
  row: {
    flexDirection: "row"
  },
  insideRight: {
    flex: 1
  },
  reportContainer: {
    marginTop: 30
  },
  fontWeight300: {
    fontWeight: 300
  },
  fontWeight400: {
    fontWeight: 400
  },
  fontWeight500: {
    fontWeight: 500
  },
  fontWeight700: {
    fontWeight: 700
  },
  h1Light: h1Light,
  h1Bold: { ...h1Light, fontWeight: 700 },
  h3Light: h3Light,
  h3Bold: { ...h3Light, fontWeight: 700 },
  h4Light: h4Light,
  fontSize7: {
    fontSize: 7
  },
  fontSize10: {
    fontSize: 10
  },
  fontSize12: {
    fontSize: 12
  },
  fontSize14: {
    fontSize: 14
  },
  footer: {
    position: "absolute",
    left: 50,
    bottom: 30,
    textAlign: "left",
    height: 45,
    width: 495
  },
  legalNoticeTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 7
  },
  legalNoticeContent: {
    fontSize: 7,
    textAlign: "justify"
  },

  // Title Block
  titleForBlockFirst: {
    fontSize: 12,
    fontWeight: 500,
    marginBottom: 12,
    textTransform: "uppercase"
  },
  titleForBlock: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 24,
    textTransform: "uppercase"
  },

  // Table
  tableTitleHorizontal: {
    fontSize: 8,
    fontWeight: 300
  },
  tableContentHorizontal: {
    fontSize: 8,
    fontWeight: 700
  },
  tableTitleRiskLevelHorizontal: {
    fontSize: 9,
    fontWeight: 700,
    textAlign: "center"
  },
  notesTitle: {
    alignItems: "flex-start",
    fontSize: 8,
    fontWeight: 300
  },
  notesContent: {
    alignItems: "flex-start",
    fontSize: 8,
    fontWeight: 500,
    textAlign: "justify"
  },
  subRowTable: {
    marginLeft: 20
  },
  //Link
  link: {
    textDecoration: "none",
    color: "#0080FF",
    fontSize: 8,
    fontWeight: 500
  },
  statusPossibleMatches: {
    fontWeight: 700,
    fontSize: 8,
    textTransform: "uppercase"
  }
});

export default styles;
