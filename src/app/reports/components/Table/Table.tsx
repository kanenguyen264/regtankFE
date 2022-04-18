import ReactPDF, { View } from "@react-pdf/renderer";
import { TableCellProps } from "app/reports/components/Table/TableCell";
import { TableRowProps } from "app/reports/components/Table/TableRow";
import * as React from "react";

interface TableContextProps {
  TableCell?: TableCellProps;
  TableRow?: TableRowProps;
}

export interface TableProps extends ReactPDF.ViewProps {
  bordered?: boolean;
  context?: TableContextProps;
  declareColumnSizings?: number[];
  disableEvenOdd?: boolean;
}

export const TableContext = React.createContext<TableContextProps>({
  TableRow: {},
  TableCell: {}
});

function Table(props: TableProps) {
  const {
    children,
    disableEvenOdd = false,
    bordered = false,
    context = {},
    style,
    ...others
  } = props;
  const rows: any[] = React.Children.toArray(children);

  return (
    <TableContext.Provider value={context}>
      <View {...style} {...others}>
        {rows.map((row, index) => {
          return React.cloneElement(row, {
            declareColumnSizings: props.declareColumnSizings,
            style: {
              borderBottom: bordered ? "1pt solid #CFCFCF" : "none"
            },
            ...(!disableEvenOdd
              ? {
                  evenOdd: index % 2 === 0 ? "even" : "odd"
                }
              : {})
          });
        })}
      </View>
    </TableContext.Provider>
  );
}

export default Table;
