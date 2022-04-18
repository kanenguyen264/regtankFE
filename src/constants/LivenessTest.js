import { KYC_STATUS } from "constants/KycStatus";

export const VERIFY_STATUS = {
  URL_GENERATED: {
    color: "#004283",
    key: "URL_GENERATED",
    label: "liveness.status.urlGenerated",
    background: "#B5DAFF",
  },
  PROCESSING: {
    color: "#0080FF",
    key: "PROCESSING",
    label: "liveness.status.in_progress",
    background: "#DFEFFF",
  },
  ID_UPLOADED: {
    color: "#004283",
    key: "ID_UPLOADED",
    label: "liveness.status.idUploaded",
    background: "#B5DAFF",
  },
  LIVENESS_STARTED: {
    color: "#004283",
    key: "LIVENESS_STARTED",
    label: "liveness.status.started",
    background: "#B5DAFF",
  },
  CAMERA_FAILED: {
    color: "#6A000A",
    key: "CAMERA_FAILED",
    label: "liveness.status.cameraFailed",
    background: "#FFB9C0",
  },
  LIVENESS_FAILED: {
    color: "#531830",
    key: "LIVENESS_FAILED",
    label: "liveness.status.liveness_failed",
    label2: "liveness.status.liveness_failed",
    background: "#FAD3E3",
  },
  LIVENESS_PASSED: {
    color: "#006B51",
    key: "LIVENESS_PASSED",
    label: "liveness.status.liveness_passed",
    label2: "liveness.status.liveness_passed",
    background: "rgba(0, 210, 160, 0.2)",
  },
  RETRY: {
    color: "#606E7B",
    key: "RETRY",
    label: "liveness.status.retry",
    background: "#ECEEF0",
  },
  EMAIL_SENT: {
    color: "#787878",
    key: "EMAIL_SENT",
    label: "liveness.status.emailSent",
    background: "#E6E6E6",
  },
  EXPIRED: {
    color: "#606E7B",
    key: "EXPIRED",
    label: "liveness.status.expired",
    background: "#ECEEF0",
  },
  WAIT_FOR_APPROVAL: {
    color: "#665728",
    key: "WAIT_FOR_APPROVAL",
    label: "liveness.status.waiting_approve",
    label2: "liveness.status.pending",
    background: "#FFE9B4",
  },
  APPROVED: {
    color: "#18783D",
    key: "APPROVED",
    label: "liveness.status.approved",
    background: "#E6FAEC",
  },
  REJECTED: {
    color: "#D44333",
    key: "REJECTED",
    label: "liveness.status.rejected",
    background: "#FBEFEE",
  },
};

export const LIVENESS_MODE = {
  AUTO: "AUTO",
  APPROVAL: "APPROVAL",
};

export const FILTER_STATUS = [
  VERIFY_STATUS.PROCESSING,
  VERIFY_STATUS.LIVENESS_FAILED,
  VERIFY_STATUS.LIVENESS_PASSED,
  VERIFY_STATUS.EXPIRED,
];

export const FILTER_APPROVAL_STATUS = [
  VERIFY_STATUS.PROCESSING,
  VERIFY_STATUS.LIVENESS_FAILED,
  VERIFY_STATUS.WAIT_FOR_APPROVAL,
  VERIFY_STATUS.APPROVED,
  VERIFY_STATUS.REJECTED,
  VERIFY_STATUS.EXPIRED,
];

export const FACE_COMPARE_STATUS = {
  LIVENESS_PASSED: {
    color: "#18783D",
    key: "LIVENESS_PASSED",
    label: "liveness.compare.passed",
    background: "#E6FAEC",
  },
  LIVENESS_FAILED: {
    background: "#FBEFEE",
    key: "LIVENESS_FAILED",
    label: "liveness.compare.failed",
    color: "#D44333",
  },
  PROCESSING: {
    color: "#004283",
    key: "PROCESSING",
    label: "liveness.status.processing",
    background: "#B5DAFF",
  },
};

export const DOCUMENT_TYPES = {
  Identity: {
    label: "liveness.document_type.identity",
  },
  Passport: {
    label: "liveness.document_type.passport",
  },
  DriverLicence: {
    label: "liveness.document_type.driving_licence",
  },
  WorkPermit: {
    label: "liveness.document_type.work_permit",
  },
  EmploymentPass: {
    label: "liveness.document_type.employment_pass",
  },
};

export const ACTIVITY_TYPES = {
  USER_CREATE_REQUEST: "USER_CREATE_REQUEST",
  USER_UPLOAD_DOCUMENT: "USER_UPLOAD_DOCUMENT",
  USER_LIVENESS_TEST: "USER_LIVENESS_TEST",
  USER_SUBMIT: "USER_SUBMIT",
  ADMIN_APPROVE: "ADMIN_APPROVE",
  ADMIN_REJECT: "ADMIN_REJECT",
  SEND_MAIL: "SEND_MAIL",
};

export const getDocumentTypeKey = (idType) => {
  return (DOCUMENT_TYPES[idType] || {}).label || "appModule.hyphen";
};

export const getLivenessKYCStatus = () => {
  return VERIFY_STATUS.APPROVED;
};
export const LIVENESS_KYC_STATUS = {
  APPROVED: {
    color: "#4CAF50",
    key: "APPROVED",
    label: "liveness.status.approved",
    background: "#55D05B",
  },
  REJECTED: {
    color: "#EA2134",
    key: "REJECTED",
    label: "liveness.status.rejected",
    background: "#EA2134",
  },
  UNRESOLVED: {
    color: "#1C243C",
    key: "UNRESOLVED",
    label: "appModule.kyc.status.UNRESOLVED",
    background: "#EA2134",
  },
  COMPLETED: {
    color: "#460489",
    key: "COMPLETED",
    label: "appModule.kyc.status.COMPLETED",
    background: "#EA2134",
  },
  NO_MATCH: {
    color: "#7D5A10",
    key: "NO_MATCH",
    label: "appModule.kyc.status.NO_MATCH",
    background: "#EA2134",
  },
  POSITIVE_MATCH: {
    color: "#7D5A10",
    key: "POSITIVE_MATCH",
    label: "appModule.kyc.status.POSITIVE_MATCH",
    background: "#EA2134",
  },
};
