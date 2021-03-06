import { IN } from "./FilterOperators";

export const KYBFilter = [
  {
    fieldSystemName: "countryOfIncorporation",
    property: "countryOfIncorporation",
    type: "SELECTED_ICON",
    label: "kyb.filter.Country",
    dataSelect: "COUNTRY",
    operator: IN,
    search: true,
    selectAll: true,
    valueType: "String",
  },
  {
    fieldSystemName: "keywords",
    property: "keywords",
    type: "SELECTED",
    label: "kyb.filter.Keywords",
    dataSelect: "KEYWORDS",
    operator: IN,
    search: false,
    selectAll: false,
    valueType: "KeyWordEnum",
  },
  {
    fieldSystemName: "status",
    property: "status",
    type: "SELECTED",
    label: "status",
    dataSelect: "STATUS",
    operator: IN,
    search: false,
    selectAll: false,
    valueType: "KybRequestStatus",
  },

  {
    fieldSystemName: "riskAssessment.riskLevel",
    property: "riskLevel",
    type: "SELECTED",
    label: "kyb.filter.RiskLevel",
    dataSelect: "RISK_LEVEL",
    operator: IN,
    search: false,
    selectAll: false,
    valueType: "RiskLevel",
  },
  {
    fieldSystemName: "assignee",
    property: "assignee",
    type: "SELECTED_ICON",
    label: "kyb.filter.Assignee",
    dataSelect: "USER",
    operator: IN,
    search: true,
    selectAll: true,
    valueType: "Long",
  },
  {
    fieldSystemName: "enableReScreening",
    property: "enableReScreening",
    type: "SELECTED",
    label: "kyb.filter.Rescreening",
    dataSelect: "ACTIVE_DISABLED",
    operator: IN,
    search: false,
    selectAll: false,
    valueType: "Boolean",
  },
  {
    fieldSystemName: "enableOnGoingMonitoring",
    property: "enableOnGoingMonitoring",
    type: "SELECTED",
    label: "kyc.filter.ongoingmonitoring",
    dataSelect: "ACTIVE_DISABLED",
    operator: IN,
    search: false,
    selectAll: false,
    valueType: "Boolean",
  },
];
