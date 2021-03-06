import { IN } from "./FilterOperators";

export const KYTFilter = [
  {
    fieldSystemName: "enableMonitoring",
    property: "enableMonitoring",
    type: "SELECTED",
    label: "kyt.filter.updatedCases",
    dataSelect: "KYT_MONITORING_TYPE",
    operator: IN,
    search: false,
    selectAll: false,
    valueType: "KytMonitoringType",
  },
  {
    fieldSystemName: "asset",
    property: "asset",
    type: "SELECTED",
    label: "kyt.filter.asset",
    dataSelect: "ASSET",
    operator: IN,
    search: false,
    selectAll: false,
    valueType: "Asset",
  },
  {
    fieldSystemName: "addressDetails.wallet.country",
    property: "country",
    type: "SELECTED_ICON",
    label: "country",
    dataSelect: "COUNTRY",
    operator: IN,
    search: true,
    selectAll: true,
    valueType: "String",
  },

  {
    fieldSystemName: "assignee",
    property: "assignee",
    type: "SELECTED_ICON",
    label: "kyc.Assignee",
    dataSelect: "USER",
    operator: IN,
    search: true,
    selectAll: true,
    valueType: "Long",
  },
  {
    fieldSystemName: "addressDetails.risk.riskLevel",
    property: "riskLevel",
    type: "SELECTED",
    label: "risk-level",
    dataSelect: "RISK_LEVEL",
    operator: IN,
    search: false,
    selectAll: false,
    valueType: "RiskLevel",
  },
  {
    fieldSystemName: "addressDetails.risk.risk",
    property: "riskScore",
    type: "SELECTED",
    label: "kyc.filter.riskScore",
    dataSelect: "RISK_SCORE",
    valueType: "Float",
    operator: IN,
    search: false,
    selectAll: false,
  },
  {
    fieldSystemName: "enableNewRiskMonitoring",
    property: "enableNewRiskMonitoring",
    type: "SELECTED",
    label: "kyt.filter.score.change",
    dataSelect: "ACTIVE_DISABLED",
    operator: IN,
    search: false,
    selectAll: false,
    valueType: "Boolean",
  },
  {
    fieldSystemName: "enableNewTransactionMonitoring",
    property: "enableNewTransactionMonitoring",
    type: "SELECTED",
    label: "kyt.filter.new.transaction",
    dataSelect: "ACTIVE_DISABLED",
    operator: IN,
    search: false,
    selectAll: false,
    valueType: "Boolean",
  },

  {
    fieldSystemName: "addressDetails.wallet.name",
    property: "owner",
    type: "SELECTED",
    label: "kyt.filter.owner",
    dataSelect: "OWNER",
    operator: IN,
    search: true,
    selectAll: true,
    valueType: "String",
  },
];
