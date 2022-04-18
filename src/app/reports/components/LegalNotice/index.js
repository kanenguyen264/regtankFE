import { Text, View } from "@react-pdf/renderer";
import globalSize from "app/reports/styles";
import React from "react";
import { useIntl } from "react-intl";
// import useTextMeasurement from "../useTextMeasurement";

const LegalNotice = () => {
  const { formatMessage } = useIntl();
  // const textMeasurement = useTextMeasurement();

  return (
    <View>
      <Text break style={globalSize.legalNoticeTitle}>
        {formatMessage({ id: "appModule.report.legal.title" })}
      </Text>
      <Text
        style={[
          globalSize.fontSize7,
          {
            textAlign: "justify"
          }
        ]}
      >
        {/* {textMeasurement(
          formatMessage({ id: "appModule.report.legal.content" }),
          1180
        )} */}
        {formatMessage({ id: "appModule.report.legal.content" })}
      </Text>
    </View>
  );
};

export default LegalNotice;
