//@flow
import { createAwaitAction } from "@protego/sdk/actions/utils";
import { PageResult } from "@protego/sdk/types";
import { createAction } from "@reduxjs/toolkit";
import { KYTService_RequestUserInputPayload } from "services/KYTService";
import { BasicUserInfoDto } from "types/typings-api";
import { KytRequestDto, TransactionEntity } from "../types/typings";

export const KYT_ACTION_REQUEST_LIST = createAwaitAction<
  any,
  PageResult<KytRequestDto>
>("kyt/request-list");
export const KYTAction_GetAssets = createAwaitAction<void, string[]>(
  "kyt/get-assets"
);
export const KYT_ACTION_REQUEST_INPUT = createAwaitAction<
  KYTService_RequestUserInputPayload,
  KytRequestDto
>("kyt/request-input");
export const KYTAction_RequestItem = createAwaitAction<string, KytRequestDto>(
  "kyt/request-item"
);
export const KYTAction_RequestItemTransactions = createAwaitAction<
  {
    id: string;
    params: object;
  },
  PageResult<TransactionEntity> & { id: string }
>("kyt/request-item-transactions");
export const KYTAction_RequestItem_FetchTransactions = createAwaitAction<
  {
    id: string;
    params: object;
  },
  any
>("kyt/request-item-fetch-transactions");
export const KYTAction_RequestItem_GetRisk = createAwaitAction<
  {
    id: string;
    kytId: string;
    txId: string;
  },
  any
>("kyt/request-item-get-risk");
export const KYTAction_RequestItem_SeeMore = createAction<{
  kytId: string;
  txId: string;
}>("kyt/request-item-see-more");

export const KYTAction_RequestItem_GetRiskBulk = createAwaitAction<
  {
    ids: string[];
    kytId: string;
  },
  any
>("kyt/request-item-get-risk-bulk");

export const KYT_ACTION_GET_KYT_WATCHLIST = createAwaitAction<
  any,
  PageResult<KytRequestDto>
>("kyt/watch-list");
export const KYT_ACTION_ADD_TO_WATCHLIST = createAwaitAction<
  {
    id: string;
    params: object;
  },
  PageResult<KytRequestDto>
>("kyt/add-watch-list", null);

export const KYT_ACTION_REMOVE_WATCHLIST = createAwaitAction<
  {
    ids?: KytRequestDto[];
  },
  PageResult<KytRequestDto>
>("kyt/remove-watch-list", null);

export const KYTAction_SEARCH_WATCHLIST = createAwaitAction<
  {
    search: string;
  },
  PageResult<TransactionEntity> & { search: string }
>("kyt/search-watch-list");

export const KYT_ACTION_SEARCH = createAwaitAction<
  {
    search: string;
  },
  PageResult<TransactionEntity> & { search: string }
>("kyt/search");

export const KYT_ACTION_ASSIGN_KYC_REQUEST = createAwaitAction<
  { kytId: string; userId: string | number },
  //@ts-ignore
  { kytId: string; user: BasicUserInfoDto }
>("kyt/assign-kyt-request");

export const KYT_ACTION_IMPORT_CSV = createAwaitAction<
  {
    formData: FormData;
  },
  any
>("kyt/import-csv");

export const KYT_ACTION_IMPORT_CONFIRM = createAwaitAction(
  "kyt/import-confirm"
);

export const KYT_ACTION_EDIT_RISK_SCORE = createAwaitAction<{
  data: any;
  kytId: string;
}>("kyt/edit-risk-score");

/**
 * Group list 
 */
export const KYT_ACTION_GET_WATCH_GROUP = createAwaitAction<
  PageResult<KytRequestDto>
>("kyt/getWatchGroup");
/**
 * Search group list 
 */

export const KYT_ACTION_WATCH_GROUP_SEARCH = createAwaitAction<
  any,
  PageResult<KytRequestDto>
>("kyt/watch-group/search");

export const KYT_ACTION_WATCH_GROUP_CLEAN = createAwaitAction<any>("kyt/watch-group-clean");

export const KYT_ACTION_ADD_TO_GROUP = createAwaitAction<
  {
    params: object;
  },
  void
>("kyt/add-group-list");
export const KYT_ACTION_CREATE_NEW_GROUP= createAwaitAction<
  {
    params: object;
  },
  void
>("kyt/watch-group/create");

export const KYT_ACTION_CHANGE_ORDER_GROUP= createAwaitAction<
  {
    params: object;
  },
  void
>("kyt/watch-group/change-order");

export const KYT_ACTION_RENAME_GROUP= createAwaitAction<
  {
    params: object;
  },
  void
>("kyt/watch-group/rename");

export const KYT_ACTION_REMOVE_WATCH_GROUP= createAwaitAction<
  {
    params: object;
  },
  void
>("kyt/watch-group/remove");
export const KYT_ACTION_REMOVE_FROM_WATCH_GROUP= createAwaitAction<
  {
    params: object;
  },
  void
>("kyt/watch-list/remove");
export const KYT_CHANGE_LOG = createAwaitAction<{
  kytId: string;
}>("kyt/alert/changelogs");

export const KYT_ONGOING_MONITORING = createAwaitAction<{
  data: any;
}>("kyt/alert/subscription");
export const KYT_VIEW_RE_SCREEN = createAwaitAction<{
  data: any;
}>("kyt/request/view-rescreened");
export const KYT_UPDATE_CASE = createAwaitAction<{
  data: any;
}>("kyt/update_case");
export const KYT_ACTION_BULK_ASSIGN = createAwaitAction<any>("kyt/bulk-assign");

export const KYT_ACTION_CHANGE_STATUS_APPROVAL = createAwaitAction<
  any>("kyt/request/status");
export const KYT_ACTION_ESCALATE = createAwaitAction<
  any>("kyt/request/escalate");
export const KYT_ACTION_GET_KYT_REQUESTS_BY_FILTER = createAwaitAction<
  any
>("kyt/get-kyt-requests-by-user");
export const KYT_ACTION_GET_FILTER_OWNER = createAwaitAction<
  any
>("kyt/get-kyt-filter-owner");
export const KYT_CLEAN_LIST = createAwaitAction<any>("clean/kyt-list");