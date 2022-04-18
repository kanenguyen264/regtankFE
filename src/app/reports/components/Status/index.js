import { View, Text, StyleSheet } from "@react-pdf/renderer";
import React from "react";
import { getColorStatus, getWidthStatus, getTextStatus } from "util/status";

const styleDefault = StyleSheet.create({
  keyword: {
    paddingHorizontal: 14,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 5,
  },
  statusLast: {
    marginRight: 0,
  },
  statusRow: {
    display: "flex",
    flexDirection: "row",
  },
  statusRowLast: {
    marginBottom: 0,
  },
});

const ItemKeyword = ({
  text,
  color,
  backgroundColor,
  width,
  style,
  ...other
}) => {
  return (
    <Text
      {...other}
      style={[
        styleDefault.keyword,
        style,
        {
          width: width,
          color: color,
          backgroundColor: backgroundColor,
        },
      ]}
    >
      {text}
    </Text>
  );
};

const StatusRow = ({ status, style }) => {
  const color = "#FFFFFF";
  const backgroundColor = getColorStatus(status);
  const width = getWidthStatus(status);
  const text = getTextStatus(status);
  return (
    <View style={[styleDefault.statusRow, style]}>
      <ItemKeyword
        style={styleDefault.statusLast}
        key={status}
        text={text}
        color={color}
        width={width}
        backgroundColor={backgroundColor}
      />
    </View>
  );
};

const Status = (props) => {
  const { status, style, ...other } = props;

  return (
    <View {...other}>
      <StatusRow key={"i"} style={[styleDefault.statusRow]} status={status} />
    </View>
  );
};

export default Status;
