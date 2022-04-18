import { View, Text, StyleSheet } from "@react-pdf/renderer";
import React from "react";

const styleDefault = StyleSheet.create({
  category: {
    paddingHorizontal: 14,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 5,
  },

  categoryRow: {
    display: "flex",
    flexDirection: "row",
  },
  categoryRowLast: {
    marginBottom: 0,
  },
});
const getWidthCategory = (value) => {
  return value * 10 - (value - 4) * 2 + 1;
};
const ItemCategory = ({
  width,
  text,
  color,
  backgroundColor,
  style,
  ...other
}) => {
  return (
    <Text
      {...other}
      style={[
        styleDefault.category,
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

const CategoryRow = ({ categories, style }) => {
  const width = getWidthCategory(categories?.shortName.length);
  return (
    <ItemCategory
      width={width}
      text={categories.shortName}
      color={"#212652"}
      backgroundColor={"#EEEEEE"}
    />
  );
};

const Category = (props) => {
  const { categories, defaultValue, style, ...other } = props;
  if (categories && categories.length > 0) {
    return (
      <View style={[styleDefault.categoryRow, style]} {...other}>
        {categories.map((item, i) => {
          return <CategoryRow key={i} categories={item} />;
        })}
      </View>
    );
  } else {
    return <Text>{defaultValue}</Text>;
  }
};

export default Category;
