import { createAwaitAction } from "@protego/sdk/actions/utils";
import { PageResult } from "@protego/sdk/types";
import {
  BasicUserInfoDto,
  KycSimplifiedIndividualMatchDto,
  KycSimplifiedRequestDto,
  MatchResponseDto,
  RiskResponseDto,
} from "types/typings-api";

export const DJ_ACTION_GET_KYC_REQUEST = createAwaitAction<any>(
  "djkyc/individual/get-all"
);
export const DJ_ACTION_GET_KYC_REQUESTS_BY_FILTER = createAwaitAction<any>(
  "djkyc/individual/filter"
);
export const DJ_ACTION_BULK_ASSIGN = createAwaitAction<any>(
  "djkyc/individual/bulk-assign"
);
export const DJ_ACTION_INPUT_INDIVIDUAL_BY_USER = createAwaitAction<any>(
  "djkyc/individual/user-input"
);
export const DJ_ACTION_GET_KYC_INDIVIDUAL_REQUEST = createAwaitAction<string>(
  "djkyc/individual/request"
);
export const DJ_ACTION_ASSIGN_KYC_REQUEST = createAwaitAction<
  { kycId: string; userId: string | number },
  { kycId: string; user: BasicUserInfoDto }
>("djkyc/assign-kyc-request");
export const DJ_ACTION_CHANGE_MATCH_STATUS = createAwaitAction<{
  kycId: string;
  matchId: string | string[];
  status?: KycSimplifiedIndividualMatchDto["status"];
}>("djkyc/individual/change-match-status");

export const DJ_ACTION_GET_KYC_SCORING = createAwaitAction<
  string,
  RiskResponseDto
>("djkyc/individual/get-kyc-scoring");

export const DJ_ACTION_GET_KYC_MATCH = createAwaitAction<
  string,
  MatchResponseDto
>("djkyc/individual/get-kyc-match");

export const DJ_ACTION_EDIT_KYC_SCORING = createAwaitAction<
  any,
  RiskResponseDto
>("djkyc/edit-kyc-scoring");

export const DJ_ACTION_ESCALATE_KYC = createAwaitAction<
  any,
  PageResult<KycSimplifiedRequestDto>
>("djkyc/individual/request/escalate");

export const DJ_ACTION_CHANGE_STATUS_RISK_SCORE = createAwaitAction<
  any,
  PageResult<KycSimplifiedRequestDto>
>("djkyc/individual/request/status");
export const DJ_ACTION_KYC_TOGGLE_OM = createAwaitAction<
  { enabled: boolean; kycId: string },
  any
>("djkyc/toggle-om");

export const DJ_ACTION_KYC_BULK_TOGGLE_OM = createAwaitAction<
  { enabled: boolean; kycIds: Array<string> },
  any
>("djkyc/bulk-toggle-om");
export const DJ_ACTION_GET_WATCH_GROUP = createAwaitAction<
  PageResult<KycSimplifiedRequestDto>
>("djkyc/individual/getWatchGroup");
export const DJ_ACTION_ADD_TO_GROUP = createAwaitAction<
  {
    params: object;
  },
  void
>("djkyc/individual/add-group-list");
export const DJ_ACTION_CREATE_NEW_GROUP = createAwaitAction<
  {
    params: object;
  },
  void
>("djkyc/individual/watch-group/create");
export const DJ_ACTION_GET_KYC_WATCHLIST = createAwaitAction<
  any,
  PageResult<KycSimplifiedRequestDto>
>("djkyc/individual/watch-list");
export const DJ_ACTION_REMOVE_FROM_WATCH_GROUP = createAwaitAction<
  {
    params: object;
  },
  void
>("djkyc/individual/watch-list/remove");
export const DJ_ACTION_REMOVE_WATCH_GROUP = createAwaitAction<
  {
    params: object;
  },
  void
>("djkyc/individual/watch-group/remove");
export const DJ_ACTION_RENAME_GROUP = createAwaitAction<
  {
    params: object;
  },
  void
>("djkyc/individual/watch-group/rename");
export const DJ_ACTION_CHANGE_ORDER_GROUP = createAwaitAction<
  {
    params: object;
  },
  void
>("djkyc/individual/watch-group/change-order");
export const DJ_ACTION_SEARCH_WATCHLIST = createAwaitAction<
  {
    search: string;
  },
  PageResult<KycSimplifiedRequestDto> & { search: string }
>("djkyc/individual/search-watch-list");
export const DJ_ACTION_WATCH_GROUP_SEARCH = createAwaitAction<
  any,
  PageResult<KycSimplifiedRequestDto>
>("djkyc/individual/watch-group/search");
export const DJ_ACTION_ADD_TO_WATCHLIST = createAwaitAction<
  {
    id: string;
    params: object;
  },
  void
>("djkyc/individual/add-watch-list");
export const DJ_ACTION_GET_KYC_REQUESTS = createAwaitAction<
  any,
  PageResult<KycSimplifiedRequestDto>
>("djkyc/individual/get-kyc-requests");
export const DJ_ACTION_REMOVE_WATCHLIST = createAwaitAction<
  {
    id?: string;
    ids?: string[];
  },
  PageResult<KycSimplifiedRequestDto>
>("djkyc/individual/remove-watch-list", null, DJ_ACTION_GET_KYC_REQUESTS);
export const DJ_ACTION_RE_SCREENING_MY_KYC = createAwaitAction<
  {
    action: string;
    kycId: string;
  },
  PageResult<KycSimplifiedRequestDto>
>("djkyc/update_re_screening_my_kyc");
export const DJ_ACTION_RE_SCREENING_MY_KYC_DETAILS = createAwaitAction<
  {
    action: string;
    kycId: string;
  },
  PageResult<KycSimplifiedRequestDto>
>("djkyc/update_re_screening_my_kyc_details");
export const DJ_ACTION_BLACKLIST_MATCH_CHANGE_STATUS = createAwaitAction<
  {
    blacklistId: string | string[];
    djkyc: string;
    status?: KycSimplifiedIndividualMatchDto["status"];
  },
  {
    blacklistId: string | string[];
    status: KycSimplifiedIndividualMatchDto["status"];
  }
>("djkyc/blacklist/match/change-match-status");
export const DJ_ACTION_BLACKLIST_MATCH_DETAIL = createAwaitAction<any>(
  "djkyc/match"
);

export const DJ_KYC_ACTION_IMPORT_CSV = createAwaitAction<
  {
    formData: FormData;
  },
  boolean
>("djkyc/import-csv");

export const DJ_KYC_ACTION_IMPORT_CONFIRM = createAwaitAction(
  "djkyc/import-confirm"
);

export const DJ_KYC_ACTION_GET_KYC_MATCH_REQUEST = createAwaitAction<
  any,
  PageResult<KycSimplifiedRequestDto>
>("djkyc/get-kyc-screening-matches");

export const DJ_KYC_ACTION_GET_KYC_BLACKLIST_REQUEST = createAwaitAction<
  any,
  PageResult<KycSimplifiedRequestDto>
>("djkyc/get-kyc-screening-blacklist");

export const DJ_KYC_ACTION_GET_MATCHES_FILTER_LIST = createAwaitAction<{kycId: string}, any>(
  "djkyc/matches/filters"
);
