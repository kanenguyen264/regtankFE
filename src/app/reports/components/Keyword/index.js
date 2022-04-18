import { View, Text, StyleSheet } from "@react-pdf/renderer";
import React from "react";
import PropTypes from "prop-types";
import { getColorKeyWord, getColorTextKeyWord } from "util/keyword";
import { chunk } from "lodash";

const styleDefault = StyleSheet.create({
  keyword: {
    paddingHorizontal: 14,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 5,
    width: 41
  },
  keywordLast: {
    marginRight: 0
  },
  keywordRow: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 5
  },
  keywordRowLast: {
    marginBottom: 0
  }
});

const ItemKeyword = ({ text, color, backgroundColor, style, ...other }) => {
  return (
    <Text
      {...other}
      style={[
        styleDefault.keyword,
        style,
        {
          color: color,
          backgroundColor: backgroundColor
        }
      ]}
    >
      {text}
    </Text>
  );
};

const KeywordRow = ({ keywords, style }) => {
  return (
    <View style={[styleDefault.keywordRow, style]}>
      {keywords.map((item, i) => {
        const color = getColorTextKeyWord(item);
        const backgroundColor = getColorKeyWord(item);
        return (
          <ItemKeyword
            style={i === keywords.length - 1 ? styleDefault.keywordLast : ""}
            key={item + i}
            text={item}
            color={color}
            backgroundColor={backgroundColor}
          />
        );
      })}
    </View>
  );
};

const Keyword = (props) => {
  const { keywords, defaultValue, itemPerRow, debug, style, ...other } = props;
  if (keywords && keywords.length > 0) {
    let listKeyword = [];
    if (Array.isArray(keywords)) {
      listKeyword = keywords;
    } else if (typeof keywords === "string") {
      listKeyword.push(keywords);
    } else {
      return <Text>{defaultValue}</Text>;
    }
    const chunkKeywords = chunk(keywords, itemPerRow);
    return (
      <View debug={debug || false} {...other}>
        {chunkKeywords.map((item, i) => {
          return (
            <KeywordRow
              key={i}
              style={[
                styleDefault.keywordRow,
                i === chunkKeywords.length - 1
                  ? styleDefault.keywordRowLast
                  : ""
              ]}
              keywords={item}
            />
          );
        })}
      </View>
    );
  } else {
    return <Text>{defaultValue}</Text>;
  }
};

Keyword.propTypes = {
  keywords: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  defaultValue: PropTypes.string,
  itemPerRow: PropTypes.number
};

Keyword.defaultProps = {
  defaultValue: "-",
  itemPerRow: 8
};

export default Keyword;
