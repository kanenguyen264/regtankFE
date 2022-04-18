import React from "react";

/**
 *
 * @see http://jsfiddle.net/eECar/16/
 */

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
ctx.font = ctx.font = "17px Yahei";

export default function useTextMeasurement() {
  return React.useCallback((text = "", width) => {
    let result,
      lines = [],
      i,
      j;
    while (text.length) {
      // noinspection StatementWithEmptyBodyJS
      for (
        i = text.length;
        ctx.measureText(text.substr(0, i)).width > width;
        i--
      ) {
        // console.log(ctx.measureText(text.substr(0, i)).width, width);
      }

      result = text.substr(0, i);

      if (i !== text.length) {
        // noinspection StatementWithEmptyBodyJS
        for (
          j = 0;
          result.indexOf(" ", j) !== -1;
          j = result.indexOf(" ", j) + 1
        );
      }

      lines.push(result.substr(0, j || result.length));
      width = Math.max(width, ctx.measureText(lines[lines.length - 1]).width);
      text = text.substr(lines[lines.length - 1].length, text.length);
    }
    return lines.join("\n");
  }, []);
}
