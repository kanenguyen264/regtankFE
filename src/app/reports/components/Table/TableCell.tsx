import ReactPDF, { Text, View } from "@react-pdf/renderer";
import { TableContext } from "app/reports/components/Table/Table";
import * as React from "react";
import { transformToArray } from "./TableUtils";

/**
 * Whether to include borders or not.
 * Depending on the context some toggles will not have any effect.
 */
interface TableBorder {
  /**
   * Include the bottom border. Default true.
   */
  includeBottomBorder?: boolean;

  /**
   * Include the left border. Default true.
   */
  includeLeftBorder?: boolean;

  /**
   * Include the right border. Default true.
   */
  includeRightBorder?: boolean;

  /**
   * Include the top border. Default true.
   */
  includeTopBorder?: boolean;
}

interface TableCellProps extends React.PropsWithChildren<TableBorder> {
  color?: string;

  debug?: boolean;

  isHeader?: boolean;

  style?: ReactPDF.Style | ReactPDF.Style[];
  textAlign?: "left" | "center" | "right";
  totalWeight?: number;
  weighting?: number;
}

/**
 * This component displays the associated content of it's children.
 */
const TableCell = (props: TableCellProps) => {
  const { TableCell: contextProps } = React.useContext(TableContext);
  let content: any;

  if (typeof props.children === "string") {
    content = <Text>{props.children}</Text>;
  } else if (typeof props.children === "number") {
    content = <Text>{props.children.toString()}</Text>;
  } else if (
    Array.isArray(props.children) &&
    props.children.reduce(
      (acc, val) => acc && (typeof val === "string" || typeof val === "number"),
      true
    )
  ) {
    content = <Text>{props.children.join("")}</Text>;
  } else {
    content = props.children;
  }
  let width = (props.weighting ?? 1) * 10 + "%";
  if (typeof props.totalWeight === "number") {
    width = (props.weighting * 100.0) / props.totalWeight + "%";
  }

  const defaultStyle: ReactPDF.Style = {
    flex: 0,
    width,
    // @ts-ignore
    justifyContent: "stretch",
    textAlign: props.textAlign ?? "left",
    fontSize: 8,
    fontWeight: props.isHeader === true ? 500 : 300,
    lineHeight: 25.0 / 17,
    wordWrap: "break-word",
    whiteSpace: "pre-wrap",
    padding: 6,
    color: props.color || "#000000"
  };
  // @ts-ignore
  const { style: contextPropsStyle } = contextProps ?? {};

  const mergedStyles: ReactPDF.Style[] = [
    defaultStyle,
    ...transformToArray(contextPropsStyle),
    ...transformToArray(props.style)
  ];

  return (
    <View style={mergedStyles} debug={props.debug || false}>
      {content}
    </View>
  );
};

export { TableCell, TableBorder, TableCellProps };
export default TableCell;
