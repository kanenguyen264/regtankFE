import { isEmpty } from "lodash";
import { checkDateInRangeDate } from "./date";

export const caculateNumerDeduct = (omArray) => {
  const today = new Date().getTime();
  let numberCredit = 0;
  if (!isEmpty(omArray)) {
    omArray.filter((item) => {
      if (!checkDateInRangeDate(today, item.omStartPeriod, item.omEndPeriod)) {
        numberCredit++;
      }
    });
  }
  return numberCredit;
};
