import { ServiceResponse } from "@protego/sdk/core/AuthService";
import { PageResult } from "@protego/sdk/types";
import {
  CaseListingDto,
  CaseManagementDetailDto,
  NewCaseManagementFormData,
  NoteDtoRes,
  NoteService,
} from "types/typings";
// @ts-ignore
import { stringifyQuery } from "util/stringQuery";
import ApiService from "./ApiService";
import NoteAdapterCreator from "./NoteAdapterCreator";
import { stringify } from "qs";

export const CaseManagementService = {
  getCases(
    params: any,
    filter: any
  ): ServiceResponse<PageResult<CaseListingDto>> {
    return ApiService.post(
      `/case-management/list/${stringifyQuery(params)}`,
      filter || []
    );
  },
  bulkAssign(userId: string, caseIds: string[]) {
    return ApiService.post(
      `/case-management/bulk-assign?userId=${userId}`,
      caseIds
    );
  },
  getCaseDetail(params: any): ServiceResponse<CaseManagementDetailDto> {
    return ApiService.get(`/case-management/${params}`);
  },
  createCase(data: NewCaseManagementFormData) {
    return ApiService.post(`/case-management/create`, data);
  },
  updateCaseDetail(data: NewCaseManagementFormData, caseId) {
    return ApiService.post(`/case-management/${caseId}`, data);
  },
  updateApproval(params: { caseId: string; content: string; status: string }) {
    return ApiService.post(
      `/case-management/${params.caseId}/change-status?status=${params.status}`,
      { content: params?.content }
    );
  },
  caseDetailAssign(userId: string, caseId: string) {
    return ApiService.post(
      `/case-management/${caseId}/assign?userId=${userId}`
    );
  },
  addGroupProfile(profileIds: Array<string>, caseId: string) {
    return ApiService.post(
      `/case-management/${caseId}/profiles/add`, profileIds
    );
  },
  addProfile(caseId: string, groupProfileId: string, profileIds: Array<string>) {
    return ApiService.post(
      `/case-management/${caseId}/profiles/add?parentProfileId=${groupProfileId}`, profileIds
    );
  },
  deleteProfile(caseId: string, profileId: string) {
    return ApiService.post(
      `/case-management/${caseId}/profiles/delete?id=${profileId}`
    );
  },
  updateProfile(caseId: string, profiles: Array<any>) {
    return ApiService.post(
      `/case-management/${caseId}/profiles/update`, profiles
    );
  },
  getBasicLog(caseId: string) {
    return ApiService.get(
      `/case-management/${caseId}/basic`
    );
  },
  searchProfile(caseId: string, params: any = {}) {
    return ApiService.get(
      `/case-management/${caseId}/search-profiles${stringify(params, { addQueryPrefix: true })}`
    );
  },
};

export const CaseManagementNoteService: NoteService = {
  delete(id: string): ServiceResponse<void> {
    return Promise.resolve(undefined);
  },
  getAll(caseId, ...args): ServiceResponse<Array<NoteDtoRes>> {
    return ApiService.get(`/case-management/${caseId}/notes`);
  },
  getOne(id, ...args): ServiceResponse<NoteDtoRes> {
    return ApiService.get(`/case-management/note/${id}`);
  },
  save(caseId: string, body: NoteDtoRes): ServiceResponse<NoteDtoRes> {
    return ApiService.post(`/case-management/${caseId}/notes`, body);
  },
};

export const CaseManagementNoteAdapter = NoteAdapterCreator(
  "caseManagement",
  CaseManagementNoteService
);
