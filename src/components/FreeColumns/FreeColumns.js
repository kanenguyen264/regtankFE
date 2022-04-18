import React from "react";
import { toRem } from "@protego/sdk/utils/measurements";

function percentage(num, total) {
  return ((num * 100.0) / total).toFixed(2);
}

export default function FreeColumns(props) {
  const totalWidth = React.useMemo(() => {
      return React.Children.toArray(props.children).reduce((acc, val) => {
        return acc + val.props.dataWidth ?? 0;
      }, 0);
    }, [props.children]),
    gutter = props.gutter || 30;

  return (
    <div
      className={"d-flex"}
      style={{
        margin: toRem(-gutter / 2)
      }}
    >
      {React.Children.map(props.children, (child) =>
        React.cloneElement(child, {
          style: {
            ...child.props.style,
            flex: `${0} 0 ${percentage(child.props.dataWidth, totalWidth)}%`,
            width: percentage(child.props.dataWidth, totalWidth) + "%",
            padding: toRem(gutter / 2)
          }
        })
      )}
    </div>
  );
}
