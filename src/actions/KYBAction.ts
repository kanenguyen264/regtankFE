import { createAwaitAction } from "@protego/sdk/actions/utils";
import { PageResult } from "@protego/sdk/types";
import {
  BasicUserInfoDto,
  KybSimplifiedRequestDto,
  KycDetailedRequestDto,
  KycSimplifiedIndividualMatchDto,
  KycSimplifiedRequestDto,
  MatchResponseDto,
  RiskResponseDto
} from "types/typings-api";

/**
 *
 * Hàm createAwaitAction cho phép tạo ra một actionCreator
 *
 * type: payload => ThunkAction (tham khảo redux-thunk)
 *
 * bản thân actionCreator có 2 member là `success` và `error`
 *
 * for example
 *
 * component.js
 * ```
 *    ...
 *    await dispatch(actionCreator(payload));  // (*)
 *    ...
 * ```
 * saga.js
 * ```
 *    const {payload} = yield take(actionCreator)
 *    const value = yield call(do_something_with,payload)
 *    yield put(actionCreator.success(value)); //đánh dấu (*) thành công
 *    yield put(actionCreator.error(value)); //đánh dấu (*) có lỗi, throw lỗi ra
 * ```
 */

export const KYB_ACTION_GET_KYB_REQUESTS = createAwaitAction<
  string,
  KycDetailedRequestDto
>("kyb/get-kyb-requests");

export const KYB_ACTION_GET_KYB_WATCHLIST = createAwaitAction<
  any,
  PageResult<KycSimplifiedRequestDto>
>("kyb/watch-list");

export const KYB_ACTION_ADD_TO_WATCHLIST = createAwaitAction<
  {
    id: string;
    params: object;
  },
  void
>("kyb/add-watch-list");

export const KYB_ACTION_REMOVE_WATCHLIST = createAwaitAction<
  {
    id?: string;
    ids?: string[];
  },
  PageResult<KycSimplifiedRequestDto>
>("kyb/remove-watch-list");

export const KYB_ACTION_SEARCH_WATCHLIST = createAwaitAction<
  {
    search: string;
  },
  PageResult<KycSimplifiedRequestDto> & { search: string }
>("kyb/search-watch-list");

export const KYB_ACTION_SEARCH = createAwaitAction<
  {
    search: string;
  },
  PageResult<KycSimplifiedRequestDto> & { search: string }
>("kyb/search");

export const KYB_ACTION_GET_KYB_SCORING = createAwaitAction<
  string,
  RiskResponseDto
>("kyb/get-kyb-scoring");

export const KYB_ACTION_RE_SCREENING_CASE_DETAILS = createAwaitAction<
  {
    action: string;
    kycId: string;
  },
  PageResult<KycSimplifiedRequestDto>
>("kyb/update_re_screening_case_detail");

export const KYB_ACTION_RE_SCREENING_MY_KYC = createAwaitAction<
  {
    action: string;
    kycId: string;
  },
  PageResult<KycSimplifiedRequestDto>
>("kyb/update_re_screening_my_kyc");

export const KYB_ACTION_RE_SCREENING_MY_KYB_DETAILS = createAwaitAction<
  {
    action: string;
    kybId: string;
  },
  PageResult<KycSimplifiedRequestDto>
>("kyb/update_re_screening_my_kyc_details");

export const KYB_ACTION_IMPORT_CSV = createAwaitAction<
  {
    formData: FormData;
  },
  boolean
>("kyb/import-csv");

export const KYB_ACTION_EDIT_KYC_SCORING = createAwaitAction<
  any,
  RiskResponseDto
>("kyb/edit-kyc-scoring");

export const KYB_ACTION_INPUT_BUSINESS = createAwaitAction<
  any,
  PageResult<KybSimplifiedRequestDto>
>("kyb/business-input");

export const fetchBusinessForm = createAwaitAction<
  any,
  PageResult<KycSimplifiedRequestDto>
>("kyc/archive");
export const KYB_ACTION_GET_KYB_REQUEST = createAwaitAction<
  string,
  KycDetailedRequestDto
>("kyb/get-kyb-request");

export const KYB_ACTION_RISK_ASSESSMENT_DETAILS = createAwaitAction<
  {
    kybId: string;
  },
  PageResult<KybSimplifiedRequestDto>
>("kyb/risk-assessment");

export const KYB_UPDATE_BUSINESS_INFORMATION = createAwaitAction<
  {
    kybId: string;
  },
  PageResult<KybSimplifiedRequestDto>
>("kyb/update/kybId/business-information");

export const KYB_ACTION_SWITCH_RE_SCREENING = createAwaitAction<
  {
    kybId: string;
  },
  PageResult<KybSimplifiedRequestDto>
>("kyb/re-screening");

export const KYB_CHANGE_RISK_LEVEL_ASSESSMENT = createAwaitAction<
  {
    kybId: string;
    status: string;
  },
  PageResult<KybSimplifiedRequestDto>
>("kyb/risk-assessment/change-status");

export const KYB_ACTION_ASSIGN_KYB_REQUEST = createAwaitAction<
  { kybId: string; userId: string | number },
  { kybId: string; user: BasicUserInfoDto }
>("kyb/assign-kyb-request");
export const KYB_ACTION_RE_SCREENING_MY_KYB = createAwaitAction<
  {
    action: string;
    kybId: string;
  },
  PageResult<KybSimplifiedRequestDto>
>("kyb/update_re_screening_my_kyb");
export const KYB_ACTION_CHANGE_MATCH_STATUS = createAwaitAction<
  {
    kybId: string;
    matchId: string | string[];
    status?: KycSimplifiedIndividualMatchDto["status"];
  },
  {
    matchId: string | string[];
    status: KycSimplifiedIndividualMatchDto["status"];
  }
>("kyb/change-match-status");
export const KYB_ACTION_GET_KYB_MATCH = createAwaitAction<
  any,
  MatchResponseDto
>("kyb/get-kyb-match");

export const KYB_SAVE_RISK_ASSESSMENT = createAwaitAction<any, any>(
  "kyb/risk-assessment/save"
);

export const KYB_RISK_ASSESSMENT_GENERATE = createAwaitAction<
  {
    kybId: string;
  },
  PageResult<KybSimplifiedRequestDto>
>("kyb/kyb-risk-assessment-generate");
export const KYB_RISK_ASSESSMENT_NOTE = createAwaitAction<
  {
    kybId: string;
  },
  PageResult<KybSimplifiedRequestDto>
>("kyb/risk-assessment-note");
/**
 * Group list 
 */
export const KYB_ACTION_GET_WATCH_GROUP = createAwaitAction<
  PageResult<KybSimplifiedRequestDto>
>("kyb/getWatchGroup");
/**
 * Search group list 
 */

export const KYB_ACTION_WATCH_GROUP_SEARCH = createAwaitAction<
  any,
  PageResult<KybSimplifiedRequestDto>
>("kyb/watch-group/search");

export const KYB_ACTION_ADD_TO_GROUP = createAwaitAction<
  {
    params: object;
  },
  void
>("kyb/add-group-list");
export const KYB_ACTION_CREATE_NEW_GROUP= createAwaitAction<
  {
    params: object;
  },
  void
>("kyb/watch-group/create");

export const KYB_ACTION_RENAME_GROUP= createAwaitAction<
  {
    params: object;
  },
  void
>("kyb/watch-group/rename");

export const KYB_ACTION_REMOVE_WATCH_GROUP= createAwaitAction<
  {
    params: object;
  },
  void
>("kyb/watch-group/remove");
export const KYB_ACTION_REMOVE_FROM_WATCH_GROUP= createAwaitAction<
  {
    params: object;
  },
  void
>("kyb/watch-list/remove");
export const KYB_ACTION_IMPORT_CONFIRM = createAwaitAction(
  "kyb/import-confirm"
);
export const KYB_ACTION_BULK_ASSIGN = createAwaitAction<
  any,
  PageResult<KybSimplifiedRequestDto>
>("kyb/bulk-assign");
export const KYB_ACTION_CHANGE_STATUS_RISK_ASSESSMENT = createAwaitAction<
  any,
  PageResult<KycSimplifiedRequestDto>
>("kyb/individual/request/status");
export const KYB_ACTION_ESCALATE = createAwaitAction<
  any,
  PageResult<KycSimplifiedRequestDto>
>("kyb/individual/request/escalate");

export const KYB_ACTION_GET_KYB_REQUESTS_BY_FILTER = createAwaitAction<
  any
>("kyb/get-kyb-requests-by-user");

export const KYB_ACTION_BULK_TOGGLE_OM = createAwaitAction<
  { enabled: boolean; kybIds: Array<string> },
  any
>("kyb/bulk-toggle-om");

export const KYB_ACTION_TOGGLE_OM = createAwaitAction<
  { enabled: boolean; kybId: string },
  any
>("kyb/toggle-om");
export const KYB_CLEAN_LIST = createAwaitAction<any>("clean/kyb-list");

export const KYB_ACTION_GET_KYB_MATCH_REQUEST = createAwaitAction<
  any,
  PageResult<KycSimplifiedRequestDto>
>("kyb/get-kyc-screening-matches");

export const KYB_ACTION_GET_MATCHES_FILTER_LIST = createAwaitAction<{kybId: string}, any>(
  "kyb/matches/filters"
);
