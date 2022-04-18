/**
 * KYC
 */
export const KYC_ROUTE_MY_KYC = "/app/kyc/my-kyc";
export const KYC_ROUTE_KYC_SCREEN = "/app/kyc/kyc-screen";
export const KYC_ROUTE_KYC_SCREEN_RESULT = "/app/screen-kyc/result/:kycId";
export const KYC_ROUTE_KYC_SCREEN_SCORING =
  "/app/screen-kyc/result/:kycId/scoring";
export const KYC_ROUTE_KYC_SCREEN_DETAIL =
  "/app/screen-kyc/result/:kycId/match/:matchId";
export const KYC_ROUTE_KYC_WATCH_LIST = "/app/kyc/my-kyc/watchlist";
export const KYC_ROUTE_KYC_ARCHIVE_LIST = "/app/kyc/my-kyc/archiveList";
export const KYC_ROUTE_KYC_BLACKLIST_MATCH =
  "/app/screen-kyc/result/:kycId/match/:blacklistId";

/**
 * KYT
 */
export const KYT_ROUTE_MY_KYT = "/app/kyt/my-kyt";
export const KYT_ROUTE_GROUP_LIST = "/app/kyt/my-kyt/groupList";
export const KYT_ROUTE_ARCHIVE_LIST = "/app/kyt/my-kyt/archiveList";
export const KYT_ROUTE_SCREEN = "/app/kyt/kyt-screen/:id?";

/**
 * Dow Jones KYC
 */
export const DJ_KYC_ROUTE_MY_KYC = "/app/dj-kyc/my-kyc";
export const DJ_KYC_ROUTE_KYC_SCREEN = "/app/dj-kyc/kyc-screen";
export const DJ_KYC_ROUTE_KYC_WATCH_LIST = "/app/dj-kyc/my-kyc/watchlist";
export const DJ_KYC_ROUTE_KYC_ARCHIVE_LIST = "/app/dj-kyc/my-kyc/archiveList";
export const DJ_KYC_ROUTE_KYC_SCREEN_RESULT = "/app/dj-kyc/result/:kycId";
export const DJ_KYC_ROUTE_KYC_SCREEN_DETAIL =
  "/app/dj-kyc/result/:kycId/match/:matchId";
export const DJ_KYC_ROUTE_KYC_SCREEN_SCORING =
  "/app/dj-kyc/result/:kycId/scoring";

/**
 * KYB
 */
export const KYB_ROUTE_KYB_SCREEN_RESULT = "/app/screen-kyb/result/:kybId";
export const KYB_ROUTE_KYB_SCREEN = "/app/kyb/kyb-screen";
export const KYB_ROUTE_MY_KYB = "/app/kyb/my-kyb";
export const KYB_ROUTE_KYB_GROUP_LIST = "/app/kyb/my-kyb/groupList";
export const KYB_ROUTE_KYB_ARCHIVE_LIST = "/app/kyb/my-kyb/archiveList";
export const KYB_ROUTE_KYB_SCREEN_DETAIL =
  "/app/screen-kyb/result/:kybId/match/:matchId";
export const KYB_ROUTE_RISK_ASSESSMENT =
  "/app/screen-kyb/result/:kybId/riskAssessment";
export const KYB_ROUTE_KYB_SCREEN_SCORING =
  "/app/screen-kyb/result/:kybId/scoring";
  export const SETTING_KYB_SCORING_ROUTE_INDEX = "/app/setting/kyb";


/**
 * Settings
 */
export const SETTING_DJ_SCORING_ROUTE_INDEX = "/app/setting/kyc/dow-jones";
export const SETTING_DJ_SCORING_ROUTE_ARCHIVE =
  "/app/setting/kyc/dow-jones/archive";
export const SETTING_DJ_SCORING_ROUTE_DETAIL = "/app/setting/kyc/dow-jones/:id";
export const SETTING_SCORING_ROUTE_INDEX = "/app/setting/kyc/acuris";
export const SETTING_SCORING_ROUTE_ARCHIVE = "/app/setting/kyc/acuris/archive";
export const SETTING_SCORING_ROUTE_DETAIL = "/app/setting/kyc/acuris/:id";
export const SETTING_ACL_LIST = "/app/setting/acl";
export const SETTING_ACL_TABLE_ACCESS = "/app/setting/acl/table-access/:id";
export const BUSINESS = "business";
/**
 * Group list
 */
export const KYC_ROUTE_KYC_GROUP_LIST = "/app/kyc/my-kyc/groupList";
export const DJ_KYC_ROUTE_KYC_GROUP_LIST = "/app/dj-kyc/my-kyc/groupList";

// export const DJ_KYC_ROUTE_KYC_GROUP_LIST= "/app/dj-kyc/my-kyc/groupList";

/**
 * Black list
 */

export const SETTING_BLACK_LIST_KYC = "/app/setting/blacklist";
export const SETTING_BLACK_LIST_KYB = "/app/setting/blacklist/kyb";
export const SETTING_BLACK_LIST_KYT = "/app/setting/blacklist/kyt";
/**
 * Liveness
 */
/**
 * DEPARTMENT
 */
export const SETTING_DEPARTMENT = "/app/setting/department";

export const PAGE_NOT_FOUND = "/app/page-not-found";
export const LIVENESS_ROUTE_LIVENESS_CHECK = "/app/liveness";
export const LIVENESS_ROUTE_LIVENESS_DETAIL = "/app/liveness/:requestId";
/**
 * Report page
 */
export const REPORT_KYC_ACURIS = "/app/report/kyc-acuris";
export const REPORT_KYC_DJ = "/app/report/kyc-dow-jones";
export const REPORT_KYC = "/app/report/kyc";
export const REPORT_KYB = "/app/report/kyb";
export const REPORT_KYT = "/app/report/kyt";

/**
 * Case Management
 */
export const CASE_MANAGEMENT_INDEX_ROUTE = "/app/case-management";
export const CASE_MANAGEMENT_CREATE_ROUTE = "/app/case-management/new";
export const CASE_MANAGEMENT_DETAIL_ROUTE = "/app/case-management/detail/:id";
