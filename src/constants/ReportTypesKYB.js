import {
  MODE,
  RISK_ASSESSMENT,
  GROUP_LIST,
  OTHER,
} from "constants/ActionTypes";
import { EQUALS, IN, BETWEEN } from "./FilterOperators";
export const KYB_REPORT = [
  {
    name: "report.table.filter.Mode",
    TableName: MODE,
    filterData: [
      {
        fieldSystemName: "assignee",
        property: "assignee",
        type: "SELECTED",
        label: "report.table.select.user",
        dataSelect: "USER",
        operator: IN,
        search: true,
        selectAll: false,
        valueType: "Long",
        labelMany: "report.users",
        labelOne: "report.user",
        maximumValues: 2,
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
        children: [
          {
            tabName: "creation",
            tabChildren: [
              {
                fieldSystemName: "createdAt",
                property: "createdAt",
                type: "SELECTED",
                label: "report.selectDate",
                dataSelect: "DATE_TIME_FILTER",
                operator: BETWEEN,
                search: true,
                selectAll: false,
                valueType: "Date",
                name: "report.table.DateCreated",
                labelMany: "report.table.DateCreated",
                labelOne: "report.table.DateCreated",
                maximumMonths: 6,
              },

              {
                fieldSystemName: "createdBy",
                property: "createdBy",
                type: "SELECTED",
                label: "report.table.select.user",
                dataSelect: "USER",
                operator: IN,
                search: true,
                selectAll: false,
                valueType: "Long",
                name: "report.table.CreatedBy",
                labelMany: "report.users",
                labelOne: "report.user",
                maximumValues: 2,
              },
            ],
          },
          {
            tabName: "modification",
            tabChildren: [
              {
                fieldSystemName: "updatedAt",
                property: "updatedAt",
                type: "SELECTED",
                label: "report.selectDate",
                dataSelect: "DATE_TIME_FILTER",
                operator: IN,
                search: true,
                selectAll: false,
                valueType: "Date",
                name: "report.LastModifiedOn",
                labelMany: "report.table.DateCreated",
                labelOne: "report.table.DateCreated",
                maximumMonths: 6,
              },
              {
                fieldSystemName: "lastModifiedBy",
                property: "lastModifiedBy",
                type: "SELECTED",
                label: "report.table.select.user",
                dataSelect: "USER",
                operator: IN,
                search: true,
                selectAll: false,
                valueType: "Long",
                name: "last-modified-by",
                labelMany: "report.users",
                labelOne: "report.user",
                maximumValues: 2,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "report.table.filter.RiskAssessment",
    TableName: RISK_ASSESSMENT,
    filterData: [
      {
        fieldSystemName: "riskAssessment.riskLevel",
        property: "riskLevel",
        type: "SELECTED",
        label: "report.table.select.level",
        dataSelect: "RISK_LEVEL",
        operator: IN,
        search: false,
        selectAll: false,
        valueType: "RiskLevel",
        name: "report.table.RiskLevel",
        labelMany: "report.levels",
        labelOne: "report.level",
      },
    ],
  },
  {
    name: "report.table.filter.GroupList",
    TableName: GROUP_LIST,
    filterData: [
      {
        fieldSystemName: "groupList",
        property: "groupList",
        type: "SELECTED",
        label: "report.table.select.group",
        dataSelect: "GROUP_LIST_KYB",
        operator: IN,
        search: false,
        selectAll: false,
        valueType: "Long",
        name: "report.table.GroupList",
        labelMany: "report.GroupLists",
        labelOne: "report.GroupList",
        maximumValues: 2,
      },
      {
        fieldSystemName: "status",
        property: "status",
        type: "SELECTED",
        label: "report.table.select.status",
        labelMany: "report.status",
        labelOne: "report.status",
        dataSelect: "STATUS",
        operator: IN,
        search: false,
        selectAll: false,
        valueType: "KybRequestStatus",
        name: "report.table.Status",
        padding: true,
      },
    ],
  },
  {
    name: "report.table.filter.Others",
    TableName: OTHER,
    filterData: [
      {
        fieldSystemName: "natureOfBusiness",
        property: "natureOfBusiness",
        type: "SELECTED",
        label: "report.selectNatureOfBusiness",
        dataSelect: "NATURE_OF_BUSINESS",
        operator: IN,
        search: true,
        selectAll: false,
        valueType: "String",
        name: "kyb.NatureOfBusiness",
        labelMany: "report.values",
        labelOne: "report.value",
        maximumValues: 4,
      },
      {
        fieldSystemName: "companyType",
        property: "companyType",
        type: "SELECTED",
        label: "report.selectCompanyType",
        dataSelect: "COMPANY_TYPE",
        operator: IN,
        search: false,
        selectAll: false,
        valueType: "CompanyType",
        name: "kyb.companyType",
        labelMany: "report.values",
        labelOne: "report.value",
        maximumValues: 4,
        padding: true,
      },
      {
        fieldSystemName: "countryOfIncorporation",
        property: "countryOfIncorporation",
        type: "SELECTED_ICON",
        label: "report.SelectCountryOfIncorporation",
        dataSelect: "COUNTRY",
        operator: IN,
        search: true,
        selectAll: false,
        valueType: "String",
        name: "kyb.CountryOfIncorporation",
        labelMany: "report.values",
        labelOne: "report.value",
        maximumValues: 4,
        padding: true,
      },
      {
        fieldSystemName: "countryOfHeadQuarter",
        property: "countryOfHeadQuarter",
        type: "SELECTED_ICON",
        label: "report.selectCountryOfHeadquarter",
        dataSelect: "COUNTRY",
        operator: IN,
        search: true,
        selectAll: false,
        valueType: "String",
        name: "kyb.CountryOfHeadquarter",
        labelMany: "report.values",
        labelOne: "report.value",
        maximumValues: 4,
        padding: true,
      },
      {
        fieldSystemName: "keywords",
        property: "keywords",
        type: "SELECTED",
        label: "report.table.select.keyword",
        dataSelect: "KEYWORDS",
        operator: IN,
        search: false,
        selectAll: false,
        valueType: "KeyWordEnum",
        name: "report.table.Keyword",
        padding: true,
        labelMany: "report.keywords",
        labelOne: "report.keyword",
        maximumValues: 2,
      },
    ],
  },
];
