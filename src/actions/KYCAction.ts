import { createAwaitAction } from "@protego/sdk/actions/utils";
import { PageResult } from "@protego/sdk/types";
import { PaginationParams } from "@protego/sdk/UI/withPagination";
import { createAction } from "@reduxjs/toolkit";
import {
  BasicUserInfoDto,
  KycDetailedRequestDto,
  KycIndividualRequestEntityReq,
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
export const KYC_ACTION_ASSIGN_KYC_REQUEST = createAwaitAction<
  { kycId: string; userId: string | number },
  { kycId: string; user: BasicUserInfoDto }
>("kyc/assign-kyc-request");

export const KYC_ACTION_INPUT_INDIVIDUAL_BY_USER = createAwaitAction<
  KycIndividualRequestEntityReq,
  KycDetailedRequestDto
>("kyc/individual-user-input");

export const KYC_ACTION_FILTER_MATCHES = createAction<PaginationParams>(
  "kyc/screening-result-filter-matches"
);

export const KYC_ACTION_GET_KYC_REQUEST = createAwaitAction<
  string,
  KycDetailedRequestDto
>("kyc/get-kyc-request");

export const KYC_ACTION_GET_KYC_MATCH_REQUEST = createAwaitAction<
  string,
  KycDetailedRequestDto
>("kyc/get-kyc-screening-matches");

export const KYC_ACTION_GET_KYC_BLACKLIST_REQUEST = createAwaitAction<
  string,
  KycDetailedRequestDto
>("kyc/get-kyc-screening-blacklist");

export const KYC_ACTION_CHANGE_ORDER_GROUP= createAwaitAction<
  {
    params: object;
  },
  void
>("kyc/watch-group/change-order");

export const KYC_ACTION_CHANGE_MATCH_STATUS = createAwaitAction<
  {
    kycId: string;
    matchId: string | string[];
    status?: KycSimplifiedIndividualMatchDto["status"];
  },
  {
    matchId: string | string[];
    status: KycSimplifiedIndividualMatchDto["status"];
  }
>("kyc/change-match-status");

export const KYC_ACTION_GET_KYC_MATCH = createAwaitAction<
  string,
  MatchResponseDto
>("kyc/get-kyc-match");

export const KYC_ACTION_GET_KYC_WATCHLIST = createAwaitAction<
  any,
  PageResult<KycSimplifiedRequestDto>
>("kyc/watch-list");

export const KYC_ACTION_ADD_TO_WATCHLIST = createAwaitAction<
  {
    id: string;
    params: object;
  },
  void
>("kyc/add-watch-list");

export const KYC_ACTION_GET_KYC_REQUESTS = createAwaitAction<
  any,
  PageResult<KycSimplifiedRequestDto>
>("kyc/get-kyc-requests");

export const KYC_ACTION_REMOVE_WATCHLIST = createAwaitAction<
  {
    id?: string;
    ids?: string[];
  },
  PageResult<KycSimplifiedRequestDto>
>("kyc/remove-watch-list", null, KYC_ACTION_GET_KYC_REQUESTS);

export const KYC_ACTION_SEARCH_WATCHLIST = createAwaitAction<
  {
    search: string;
  },
  PageResult<KycSimplifiedRequestDto> & { search: string }
>("kyc/search-watch-list");

export const KYC_ACTION_SEARCH = createAwaitAction<
  {
    search: string;
  },
  PageResult<KycSimplifiedRequestDto> & { search: string }
>("kyc/search");

export const KYC_ACTION_GET_KYC_SCORING = createAwaitAction<
  string,
  RiskResponseDto
>("kyc/get-kyc-scoring");

export const KYC_ACTION_RE_SCREENING_CASE_DETAILS = createAwaitAction<
  {
    action: string;
    kycId: string;
  },
  PageResult<KycSimplifiedRequestDto>
>("kyc/update_re_screening_case_detail");

export const KYC_ACTION_RE_SCREENING_MY_KYC = createAwaitAction<
  {
    action: string;
    kycId: string;
  },
  PageResult<KycSimplifiedRequestDto>
>("kyc/update_re_screening_my_kyc");

export const KYC_ACTION_RE_SCREENING_MY_KYC_DETAILS = createAwaitAction<
  {
    action: string;
    kycId: string;
  },
  PageResult<KycSimplifiedRequestDto>
>("kyc/update_re_screening_my_kyc_details");

export const KYC_ACTION_IMPORT_CSV = createAwaitAction<
  {
    formData: FormData;
  },
  boolean
>("kyc/import-csv");

export const KYC_ACTION_IMPORT_CONFIRM = createAwaitAction(
  "kyc/import-confirm"
);

export const KYC_ACTION_EDIT_KYC_SCORING = createAwaitAction<
  any,
  RiskResponseDto
>("kyc/edit-kyc-scoring");

export const KYC_ACTION_GET_LIST_ARCHIVE = createAwaitAction<
  any,
  PageResult<KycSimplifiedRequestDto>
>("kyc/archive");
/**
 * Group list
 */
export const KYC_ACTION_GET_WATCH_GROUP = createAwaitAction<
  PageResult<KycSimplifiedRequestDto>
>("kyc/getWatchGroup");
/**
 * Search group list
 */

export const KYC_ACTION_WATCH_GROUP_SEARCH = createAwaitAction<
  any,
  PageResult<KycSimplifiedRequestDto>
>("kyc/watch-group/search");

export const KYC_ACTION_ADD_TO_GROUP = createAwaitAction<
  {
    params: object;
  },
  void
>("kyc/add-group-list");
export const KYC_ACTION_CREATE_NEW_GROUP = createAwaitAction<
  {
    params: object;
  },
  void
>("kyc/watch-group/create");

export const KYC_ACTION_RENAME_GROUP = createAwaitAction<
  {
    params: object;
  },
  void
>("kyc/watch-group/rename");

export const KYC_ACTION_REMOVE_WATCH_GROUP = createAwaitAction<
  {
    params: object;
  },
  void
>("kyc/watch-group/remove");
export const KYC_ACTION_REMOVE_FROM_WATCH_GROUP = createAwaitAction<
  {
    params: object;
  },
  void
>("kyc/watch-list/remove");

export const KYC_ACTION_BULK_ASSIGN = createAwaitAction<any>("kyc/bulk-assign");

export const KYC_ACTION_CHANGE_STATUS_RISK_SCORE = createAwaitAction<
  any,
  PageResult<KycSimplifiedRequestDto>
>("kyc/individual/request/status");
export const ACTION_ACTIVITY_LOG_MAIN = createAwaitAction<any>(
  "audit/view-log"
);
export const KYC_ACTION_ESCALATE = createAwaitAction<
  any,
  PageResult<KycSimplifiedRequestDto>
>("kyc/individual/request/escalate");

export const CLEAN_STATE_ACTIVITY_LOG = createAwaitAction<any>("clean/state");
export const KYC_ACTION_GET_KYC_REQUESTS_BY_FILTER = createAwaitAction<
  any,
  PageResult<KycSimplifiedRequestDto>
>("kyc/get-kyc-requests-by-user");

/* KYC on-going monitoring */
export const KYC_ACTION_BULK_TOGGLE_OM = createAwaitAction<
  { enabled: boolean; kycIds: Array<string> },
  any
>("kyc/bulk-toggle-om");
export const KYC_ACTION_TOGGLE_OM = createAwaitAction<
  { enabled: boolean; kycId: string },
  any
>("kyc/toggle-om");
export const KYC_ACTION_BLACKLIST_MATCH_DETAIL = createAwaitAction<
  any
>("/kyc-blacklist/match");

export const KYC_ACTION_BLACKLIST_MATCH_CHANGE_STATUS = createAwaitAction<
  { 
    blacklistId: string | string[];
    kycId: string;
    status?: KycSimplifiedIndividualMatchDto["status"];
  },
  {
    blacklistId: string | string[];
    status: KycSimplifiedIndividualMatchDto["status"];
  }
>("kyc/blacklist/match/change-match-status");
/**
 * Import blacklist
 */
export const KYC_ACTION_IMPORT_BLACKLIST_CSV = createAwaitAction<
  {
    formData: FormData;
  },
  boolean
>("kyc-blacklist/import/csv");

export const KYC_ACTION_IMPORT_BLACKLIST_CONFIRM = createAwaitAction(
  "kyc-blacklist/import/confirm"
);

export const KYC_CLEAN_LIST = createAwaitAction<any>("clean/kyc-list");
export const KYC_ACTION_GET_MATCHES_FILTER_LIST = createAwaitAction<{kycId: string}, any>(
  "kyc/matches/filters"
);
