import { createAwaitAction } from "@protego/sdk/actions/utils";
import { PageResult } from "@protego/sdk/types";
import { CaseListingDto, CaseManagementDetailDto } from "types/typings-api";

export const CASE_MANAGEMENT_ACTION_GET_CASES = createAwaitAction<
  any,
  PageResult<CaseListingDto>
>("case-management/get-cases");
export const CASE_MANAGEMENT_DETAIL_CASES = createAwaitAction<
  any,
  CaseManagementDetailDto
>("case-management/detail");
export const CASE_MANAGEMENT_DETAIL_ASSIGN = createAwaitAction<any>("case-management-detail-assign");

export const CASE_MANAGEMENT_ACTION_BULK_ASSIGN = createAwaitAction<any>("case-management/bulk-assign");
export const CASE_MANAGEMENT_ACTION_CREATE = createAwaitAction<any>("case-management/create");
export const CASE_MANAGEMENT_ACTION_UPDATE_APPROVAL = createAwaitAction<any>("case-management/update-approval");
export const CASE_MANAGEMENT_DETAIL_UPDATE = createAwaitAction<any>("case-management/detail-update");
export const CASE_MANAGEMENT_ADD_GROUP_PROFILE = createAwaitAction<any>("case-management/detail-add-group-profile");
export const CASE_MANAGEMENT_ADD_PROFILE = createAwaitAction<any>("case-management/detail-add-profile");
export const CASE_MANAGEMENT_DELETE_PROFILE = createAwaitAction<any>("case-management/detail-delete-profile");
export const UPDATE_PROFILE_TABLE = createAwaitAction<any>("case-management/update-profiles");
export const CASE_MANAGEMENT_BASIC_LOG = createAwaitAction<any>("case-management-basic-log");
export const CASE_MANAGEMENT_SEARCH_PROFILE = createAwaitAction<any>("case-management/search-profile");
export const CASE_MANAGEMENT_CLEAN_PROFILE = createAwaitAction<any>("case-management-clean-profile");
