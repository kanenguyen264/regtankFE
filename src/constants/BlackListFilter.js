import { IN } from "./FilterOperators";

export const BlackListFilter = [
  {
    fieldSystemName: "categories.id",
    property: "categories",
    type: "SELECTED",
    label: "setting.blacklist.filter.category",
    dataSelect: "CATEGORY",
    operator: IN,
    search: false,
    selectAll: false,
    valueType: "Long",
    showScrollbar: true,
  },
  {
    fieldSystemName: "dateOfBirth",
    property: "dateOfBirth",
    type: "DATE_TIME_FILTER",
    label: "setting.blacklist.filter.dateOfBirth",
    dataSelect: "DATE_TIME_FILTER",
    operator: IN,
    search: false,
    selectAll: false,
    valueType: "Date",
    months: 1,
  },

  {
    fieldSystemName: "nationality",
    property: "nationality",
    type: "SELECTED",
    label: "setting.blacklist.filter.nationality",
    dataSelect: "NATIONALITY",
    operator: IN,
    search: true,
    selectAll: true,
    valueType: "String",
    hideFlag: true,
    showScrollbar: true,
  },
  {
    fieldSystemName: "gender",
    property: "gender",
    type: "SELECTED",
    label: "setting.blacklist.filter.gender",
    dataSelect: "GENDER",
    operator: IN,
    search: false,
    selectAll: false,
    valueType: "Gender",
  },
  {
    fieldSystemName: "isActive",
    property: "isActive",
    type: "SELECTED",
    label: "setting.blacklist.filter.active",
    dataSelect: "ACTIVE_INACTIVE",
    operator: IN,
    search: false,
    selectAll: false,
    valueType: "Boolean",
  },
];