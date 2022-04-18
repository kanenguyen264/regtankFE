import { rangeRight } from "lodash";

export const DAYS = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
];

export const MONTHS = [
  { key: "jan", value: "01", label: "appModule.January" },
  { key: "feb", value: "02", label: "appModule.February" },
  { key: "mar", value: "03", label: "appModule.March" },
  { key: "apr", value: "04", label: "appModule.April" },
  { key: "may", value: "05", label: "appModule.May" },
  { key: "jun", value: "06", label: "appModule.June" },
  { key: "jul", value: "07", label: "appModule.July" },
  { key: "aug", value: "08", label: "appModule.August" },
  { key: "sep", value: "09", label: "appModule.September" },
  { key: "oct", value: "10", label: "appModule.October" },
  { key: "nov", value: "11", label: "appModule.November" },
  { key: "dec", value: "12", label: "appModule.December" },
];

const currentYear = new Date().getFullYear();
export const YEARS = rangeRight(1900, currentYear + 1).map((item) =>
  item.toString()
);

export const getLabelMonth = (number) => {
  if (!number) {
    return "-";
  }
  let objMonthString = MONTHS.filter((item) =>
    item.key.toUpperCase().includes(number?.toUpperCase())
  );
  let objMonth = MONTHS.filter((item) => item.value === number);
  return objMonth ? objMonth[0]?.label : "setting.blacklist.date";
};
