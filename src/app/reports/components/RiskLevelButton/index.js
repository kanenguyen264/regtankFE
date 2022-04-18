import { StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";
import { useIntl } from "react-intl";
import { getRiskLevel, getTextTranslateRisk } from "util/riskLevel";

const style = StyleSheet.create({
  styleRisk: {
    fontSize: 20,
    fontWeight: 700,
    textAlign: "center",
    alignItems: "center"
  },
  styleLevel: {
    display: "block",
    fontSize: 10,
    fontWeight: 700,
    paddingHorizontal: 6,
    paddingVertical: 3
  }
});

const RiskLevelButton = (props) => {
  const { level, score, debug, styleLevel, styRisk, ...other } = props;
  const { formatMessage } = useIntl();

  const levelObj = getRiskLevel(level);
  const translateText = getTextTranslateRisk(level);

  return (
    <View debug={debug || false} {...other}>
      <View>
        <Text
          style={[
            style.styleRisk,
            { ...styRisk } || {},
            {
              color: score ? levelObj.color : "#FFFFFF"
            }
          ]}
        >
          {score || "-"}
        </Text>
      </View>

      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text
          style={[
            style.styleLevel,
            { ...styleLevel } || {},
            {
              backgroundColor: level ? levelObj.color : "#FFFFFF",
              color: "#FFFFFF"
            }
          ]}
        >
          {level ? formatMessage({ id: translateText }) : "-"}
        </Text>
      </View>
    </View>
  );
};

export default RiskLevelButton;
