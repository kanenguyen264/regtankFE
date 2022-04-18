import { View } from "@react-pdf/renderer";
import { TableContext } from "app/reports/components/Table/Table";
import * as React from "react";
import { TableBorder } from "./TableCell";

interface TableRowProps extends React.PropsWithChildren<TableBorder> {
  debug?: boolean;
  declareColumnSizings?: number[];
  evenOdd?: "even" | "odd";
  fontSize?: number | string;
  freeWeight?: boolean;
  textAlign?: "left" | "center" | "right";
}

/**
 * This component describes how to display a row.
 */
const TableRow = (props: Partial<TableRowProps>) => {
  const {
    includeBottomBorder,
    includeLeftBorder,
    includeRightBorder,
    includeTopBorder,
    // @ts-ignore
    style
  } = props;
  const freeWeight = props.freeWeight || false;
  const totalWeight = React.useMemo(() => {
    if (!freeWeight) return 0;
    return React.Children.toArray(props.children).reduce<number>(
      (acc, val, index) => {
        return (
          acc +
          ((val as any).props.weighting ??
            props.declareColumnSizings?.[index] ??
            0)
        );
      },
      0
    );
    // eslint-disable-next-line
  }, [props.children]);
  const { TableRow: contextProps } = React.useContext(TableContext);
  // @ts-ignore
  const { style: contextPropsStyle, ...contextOthers } = contextProps ?? {};

  return (
    <View
      // @ts-ignore
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        //@ts-ignore
        justifyContent: "stretch",
        backgroundColor: props.evenOdd === "even" ? "#f5f5f5" : "#fff",
        //@ts-ignore
        ...(props.style || {}),
        ...(contextPropsStyle || {}),
        // @ts-ignore
        borderBottom: includeBottomBorder
          ? "1pt solid #CFCFCF"
          : style?.borderBottom || "none",
        borderLeft: includeLeftBorder
          ? "1pt solid #CFCFCF"
          : style?.borderLeft || "none",
        borderRight: includeRightBorder
          ? "1pt solid #CFCFCF"
          : style?.borderRight || "none",
        borderTop: includeTopBorder
          ? "1pt solid #CFCFCF"
          : style?.borderTop || "none"
      }}
      // wrap={false}
      {...(contextOthers || {})}
      debug={props.debug || false}
    >
      {freeWeight
        ? React.Children.map(props.children, (elem, index) =>
            React.cloneElement((elem as unknown) as React.ReactElement, {
              key: index,
              totalWeight,
              weighting:
                (elem as any).props.weighting ??
                props.declareColumnSizings?.[index] ??
                0,
              textAlign:
                (elem as any).props.textAlign || props.textAlign || "left"
            })
          )
        : props.children}
    </View>
  );
};

export { TableRow, TableRowProps };
export default TableRow;
