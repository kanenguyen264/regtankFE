export const headerExportCaseCSV = [
  { label: "case.table.header.caseId", key: "caseId" },
  {
    label: "case.table.header.kycRiskScore",
    key: "KYCRiskCore",
  },
  {
    label: "case.table.header.kytRiskScore",
    key: "KYTRiskCore",
  },
  {
    label: "case.table.header.referenceId",
    key: "name",
  },
  {
    label: "case.table.header.DOB",
    key: "dateOfBirth",
  },
  {
    label: "case.table.header.nationality",
    key: "nationality",
  },
  {
    label: "case.table.header.status",
    key: "latestKyc.status",
  },
  {
    label: "case.table.header.lastKycScreenBy",
    key: "fullName",
  },
  {
    label: "case.table.header.lastKycScreenAt",
    key: "kycUpdatedAt",
  },
  {
    label: "case.table.header.lastKytScreenBy",
    key: "kytFullName",
  },
  {
    label: "case.table.header.lastKytScreenAt",
    key: "kytUpdatedAt",
  },
];

export const headerExportKYCListCSV = [
  { label: "kyc.kycId", key: "kycId" },
  { label: "kyc.riskRating", key: "riskCore" },
  { label: "kyc.referenceId", key: "individualRequest.referenceId" },
  { label: "name", key: "individualRequest.name" },
  { label: "kyc.DateOfBirth", key: "dateOfBirth" },
  { label: "kyc.Nationality", key: "nationality" },
  { label: "kyc.Status", key: "status" },
  { label: "kyc.LastModifiedBy", key: "lastModifyBy" },
  { label: "kyc.LastModifiedAt", key: "lastScreenedAt" },
];

export const headerExportKYBListCSV = [
  { label: "kyb.kybId", key: "kybId" },
  { label: "kyb.table.risk.level", key: "riskLevel" },
  { label: "kyc.referenceId", key: "referenceId" },
  { label: "result.Table.BusinessName", key: "businessName" },
  { label: "form.dateOfIncorporation", key: "dateOfIncorporation" },
  { label: "kyb.table.header.countryOf", key: "countryOfIncorporation" },
  { label: "keywords", key: "keywords" },
  { label: "status", key: "status" },
  { label: "screening.result.Assignee", key: "assignee" },
  { label: "last-modified-by", key: "updatedAt" },
];

export const headerExportKYTListCSV = [
  { label: "case.detail.table.kyt.header.kycId", key: "kytId" },
  { label: "case.detail.table.kyt.header.riskScore", key: "riskCore" },
  { label: "case.detail.individualRequest.referenceId", key: "referenceId" },
  { label: "case.detail.table.kyt.header.walletAddress", key: "address" },
  { label: "case.detail.table.kyt.header.asset", key: "asset" },
  { label: "case.detail.table.kyt.header.balance", key: "currentBalance" },
  {
    label: "case.detail.table.kyt.header.walletName",
    key: "name",
  },
  { label: "case.detail.table.kyt.header.walletCountry", key: "country" },
  {
    label: "case.detail.table.kyt.header.lastKytScreenBy",
    key: "lastScreenedBy",
  },
  {
    label: "case.detail.table.kyt.header.lastKytScreenAt",
    key: "lastScreenedAt",
  },
];

export const headerExportMatchesCSV = [
  { label: "screening-id", key: "matchId" },
  { label: "name", key: "name" },
  { label: "date-of-birth", key: "dateOfBirth" },
  { label: "gender", key: "gender" },
  { label: "nationality", key: "nationality" },
  { label: "keywords", key: "keywords" },
  { label: "last-screened-by", key: "lastModifiedBy" },
  { label: "status", key: "status" },
];
export const headerExportCYBMatchesCSV = [
  { label: "screening-id", key: "matchId" },
  { label: "kyb.businessName", key: "businessName" },
  { label: "kyb.CountryOfIncorporation", key: "countryOfIncorporation" },
  { label: "keywords", key: "keywords" },
  { label: "kyb.LastModifiedBy", key: "lastModifiedBy" },
  { label: "kyb.LastModifiedAt", key: "updatedAt" },
  { label: "status", key: "status" },
];
export const headerExportScoringCSV = [
  { label: "setting.scoring.fileName", key: "name" },
  { label: "setting.scoring.status", key: "isActive" },
  { label: "setting.scoring.description", key: "description" },
  { label: "setting.scoring.dateEdit", key: "updatedAt" },
];
export const headerExportBlackListMatchesCSV = [
  { label: "blacklist.match.id", key: "matchId" },
  { label: "name", key: "name" },
  { label: "date-of-birth", key: "dateOfBirth" },
  { label: "gender", key: "gender" },
  { label: "nationality", key: "nationality" },
  { label: "table.category", key: "category" },
  { label: "last-screened-by", key: "lastModifiedBy" },
  { label: "status", key: "status" },
];
