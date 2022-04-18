import { createAwaitAction } from "@protego/sdk/actions/utils";
import { PageResult } from "@protego/sdk/types";
import { CaseDetailsDto, CaseListingDto } from "types/typings-api";

export const CASE_ACTION_GET_CASES = createAwaitAction<
  any,
  PageResult<CaseListingDto>
>("case/get-cases");

export const CASE_ACTION_GET_CASE_BY_CASEID = createAwaitAction<
  { caseId: string | number; reference: boolean },
  CaseDetailsDto
>("case/get-case-by-caseid");

export const CASE_ACTION_GET_CASES_WATCHLIST = createAwaitAction<
  any,
  PageResult<CaseListingDto>
>("case/get-cases-watchlist");
export const CASE_ACTION_ADD_CASES_WATCHLIST = createAwaitAction<
  any,
  PageResult<CaseListingDto>
>("case/add-cases-watchlist", null, CASE_ACTION_GET_CASES);

export const CASE_ACTION_REMOVE_CASES_WATCHLIST = createAwaitAction<
  any,
  PageResult<CaseListingDto>
>("case/remove-cases-watchlist", null, CASE_ACTION_GET_CASES);

export const CASE_ACTION_SEARCH_CASES_WATCHLIST = createAwaitAction<
  {
    any;
  },
  PageResult<CaseListingDto>
>("case/search-watch-list");

export const CASE_ACTION_SEARCH = createAwaitAction<
  {
    any;
  },
  PageResult<CaseListingDto>
>("case/search-case");

/**
 * Get archive case 
 */
 export const CASE_ACTION_GET_LIST_ARCHIVE = createAwaitAction<
  any,
  PageResult<CaseListingDto>
>("case/archive");

/**
 * Group list 
 */
export const CASE_ACTION_GET_WATCH_GROUP = createAwaitAction<
  PageResult<CaseListingDto>
>("case/getWatchGroup");
/**
 * Search group list 
 */

export const CASE_ACTION_WATCH_GROUP_SEARCH = createAwaitAction<
  any,
  PageResult<CaseListingDto>
>("case/watch-group/search");

export const CASE_ACTION_ADD_TO_GROUP = createAwaitAction<
  {
    params: object;
  },
  void
>("case/add-group-list");
export const CASE_ACTION_CREATE_NEW_GROUP= createAwaitAction<
  {
    params: object;
  },
  void
>("case/watch-group/create");

export const CASE_ACTION_RENAME_GROUP= createAwaitAction<
  {
    params: object;
  },
  void
>("case/watch-group/rename");

export const CASE_ACTION_REMOVE_WATCH_GROUP= createAwaitAction<
  {
    params: object;
  },
  void
>("case/watch-group/remove");
export const CASE_ACTION_REMOVE_FROM_WATCH_GROUP= createAwaitAction<
  {
    params: object;
  },
  void
>("case/watch-list/remove");

export const CASE_ACTION_CHANGE_ORDER_GROUP= createAwaitAction<
  {
    params: object;
  },
  void
>("case/watch-group/change-order");
