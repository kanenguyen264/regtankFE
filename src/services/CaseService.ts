import { ServiceResponse } from "@protego/sdk/core/AuthService";
import { PageResult } from "@protego/sdk/types";
import {
  CASE_ACTION_ADD_CASES_WATCHLIST,
  CASE_ACTION_GET_CASES,
  CASE_ACTION_GET_CASES_WATCHLIST,
  CASE_ACTION_REMOVE_CASES_WATCHLIST
} from "actions/CaseAction";
import ArchiveAdapterCreator from "services/ArchiveAdapterCreator";
import {
  ArchiveService,
  CaseDetailsDto,
  CaseListingDto,
  NoteDtoRes,
  NoteService
} from "types/typings";
// @ts-ignore
import { injectService } from "util/index";
import { stringifyQuery } from "util/stringQuery";
import ApiService from "./ApiService";
import NoteAdapterCreator from "./NoteAdapterCreator";
import { stringify } from "qs";

const CaseService = {
  getCases(params: any): ServiceResponse<PageResult<CaseListingDto>> {
    return ApiService.get(`/case/${stringifyQuery(params)}`);
  },
  getCaseByCaseId(
    caseId: string | number,
    reference: boolean = false
  ): ServiceResponse<CaseDetailsDto> {
    return ApiService.get(
      `/case/id/${stringifyQuery({
        caseId: decodeURIComponent(caseId.toString()),
        reference
      })}`
    );
  },
  getCasesWatchlist(params: any): ServiceResponse<PageResult<CaseListingDto>> {
    return ApiService.get(`/case/watch-list${stringifyQuery(params)}`);
  },
  addCasesWatchlist(caseId: any): ServiceResponse<PageResult<CaseListingDto>> {
    return ApiService.post(`/case/watch-list/add`, caseId);
  },
  removeCasesWatchlist(
    caseId: any,
    caseIds: any[]
  ): ServiceResponse<PageResult<CaseListingDto>> {
    return ApiService.post(
      `/case/watch-list/remove${caseId ? `?caseId=${caseId}` : ""}`,
      caseIds
    );
  },
  searchCases(search: string): ServiceResponse<PageResult<CaseListingDto>> {
    return ApiService.get(`/case/?${search}`);
  },
  searchCasesWatchlist(
    search: string
  ): ServiceResponse<PageResult<CaseListingDto>> {
    return ApiService.get(`/case/watch-list?${search}`);
  },
  getCaseListArchiveService(
    params: any
  ): ServiceResponse<PageResult<CaseListingDto>> {
    return ApiService.get(`/case/archive${stringifyQuery(params)}`);
  },
  changeCaseOrderGroup(data: any) {
    return ApiService.post(`/case/watch-group/change-order`, data);
  }
};
export default CaseService;

if (process.env.NODE_ENV === "development") injectService({ CaseService });

export const CaseNoteService: NoteService = {
  delete(id: string): ServiceResponse<void> {
    return Promise.resolve(undefined);
  },
  getAll(caseId, ...args): ServiceResponse<Array<NoteDtoRes>> {
    return ApiService.get(`/case/${caseId}/notes`);
  },
  getOne(id, ...args): ServiceResponse<NoteDtoRes> {
    return ApiService.get(`/case/note/${id}`);
  },
  save(typeId: string, body: NoteDtoRes): ServiceResponse<NoteDtoRes> {
    return ApiService.post(`/case/${typeId}/note/save`, body);
  }
};

export const CaseNoteAdapter = NoteAdapterCreator("case", CaseNoteService);

export const CaseArchiveService: ArchiveService<CaseListingDto> = {
  getAll(args: any): ServiceResponse<PageResult<CaseListingDto>> {
    return ApiService.get(`/case/archive${stringifyQuery(args)}`);
  },
  addToArchive(typeId: string[]): ServiceResponse<void> {
    return ApiService.post("/case/archive/add", typeId);
  },
  remove(typeId: string[]): ServiceResponse<void> {
    return ApiService.post("/case/archive/remove", typeId);
  }
};

export const CaseArchiveAdapter = ArchiveAdapterCreator<CaseListingDto>(
  "case",
  CaseArchiveService,
  {
    addToWatchList: CASE_ACTION_ADD_CASES_WATCHLIST,
    removeFromWatchList: CASE_ACTION_REMOVE_CASES_WATCHLIST,
    fetchList: CASE_ACTION_GET_CASES,
    fetchWatchList: CASE_ACTION_GET_CASES_WATCHLIST
  }
);

export function requestSearchGroupList(
    params: any = {}
  ): ServiceResponse<PageResult<any>> {
    const newParam = { ...params };
    if (!newParam.sort || newParam.sort.length === 0)
      newParam.sort = "createdAt,desc";
    return ApiService.get(
      `/case/watch-list/search${stringify(newParam, { addQueryPrefix: true })}`
    );
  }

export function getWatchGroup(data) {
  return ApiService.get(`/case/watch-group`);
}
export function addWatchGroupService(params: any): ServiceResponse<void> {
    return ApiService.post(`/case/watch-list/add?watchGroupId=${params?.watchGroupId}`,params?.caseIds);
  }
export function createWatchGroupService(params: any): ServiceResponse<void> {
    return ApiService.post(`/case/watch-group/create`,params);
  };
  export function renameWatchGroupService(params: any): ServiceResponse<void> {
    return ApiService.post(`/case/watch-group/rename`,params);
  };

 export function removeWatchGroupService(watchGroupId: any): ServiceResponse<void> {
    return ApiService.post(`/case/watch-group/remove?id=${watchGroupId}`);
  };

 export function  removeFromWatchGroupService(params: any): ServiceResponse<void> {
    return ApiService.post(`/case/watch-list/remove?watchGroupId=${params?.watchGroupId}`,params?.list);
  };
