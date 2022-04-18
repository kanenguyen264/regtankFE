//@flow
import React from "react";
import Table from "./Table";
import { TableCell } from "./TableCell";
import { TableRow } from "./TableRow";

const TableEmpty = (props) => {
  const { children, style, styleRow, styleCell, ...others } = props;
  return (
    <Table {...style} {...others}>
      <TableRow {...styleRow}>
        <TableCell weighting={10} {...styleCell}>
          {children}
        </TableCell>
      </TableRow>
    </Table>
  );
};

export { TableEmpty };
export default TableEmpty;
