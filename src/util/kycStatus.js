import { KYC_STATUS } from "constants/KycStatus";
import { KYB_STATUS } from "constants/KybStatus";

const getKycStatusTranslate = (status) => {
  if (!status) {
    return;
  }
  switch (status) {
    case KYC_STATUS.UNRESOLVED:
      return "appModule.kyc.status.UNRESOLVED";
    case KYC_STATUS.COMPLETED:
      return "appModule.kyc.status.COMPLETED";
    case KYC_STATUS.APPROVED:
      return "kyc.change.note.approved";
    case KYC_STATUS.REJECTED:
      return "kyc.change.note.rejected";
    case KYC_STATUS.NO_MATCH:
      return "appModule.kyc.status.NO_MATCH";
    case KYC_STATUS.POSITIVE_MATCH:
      return "appModule.kyc.status.POSITIVE_MATCH";
    default:
      return "";
  }
};
const getColorStatus = (status) => {
  if (!status) {
    return;
  }
  switch (status) {
    case KYC_STATUS.APPROVED:
      return "#53BE4D";
    case KYC_STATUS.REJECTED:
      return "#F9374A";
    default:
      return "";
  }
};
const getKybStatusTranslate = (status) => {
  if (!status) {
    return;
  }
  switch (status) {
    case KYB_STATUS.PENDING:
      return "appModule.kyb.status.PENDING";
    case KYB_STATUS.UNRESOLVED:
      return "appModule.kyb.status.UNRESOLVED";
    case KYB_STATUS.COMPLETED:
      return "my.kyb.status.COMPLETED";
    case KYC_STATUS.APPROVED:
      return "kyc.change.note.approved";
    case KYC_STATUS.REJECTED:
      return "kyc.change.note.rejected";
    case KYC_STATUS.NO_MATCH:
      return "appModule.kyc.status.NO_MATCH";
    case KYC_STATUS.POSITIVE_MATCH:
      return "appModule.kyc.status.POSITIVE_MATCH";
    default:
      return "";
  }
};

const getKybColorStatus = (status) => {
  if (!status) {
    return;
  }
  switch (status) {
    case KYB_STATUS.PENDING:
      return "#805b01";
    case KYB_STATUS.UNRESOLVED:
      return "#464646";
    case KYB_STATUS.COMPLETED:
      return "#4f0194";
    case KYC_STATUS.APPROVED:
      return "#01572c";
    case KYC_STATUS.REJECTED:
      return "#a20e1c";
    case KYC_STATUS.NO_MATCH:
      return "#805b01";
    case KYC_STATUS.POSITIVE_MATCH:
      return "#004e9b";
    default:
      return "";
  }
};

export {
  getKycStatusTranslate,
  getKybStatusTranslate,
  getColorStatus,
  getKybColorStatus
};
