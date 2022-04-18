import { ServiceResponse } from "@protego/sdk/core/AuthService";
import { PageResult } from "@protego/sdk/types";
import {
  DJ_ACTION_ADD_TO_WATCHLIST,
  DJ_ACTION_GET_KYC_REQUESTS,
  DJ_ACTION_GET_KYC_WATCHLIST,
  DJ_ACTION_REMOVE_WATCHLIST,
} from "actions/DJAction";
import { stringify } from "qs";
//@ts-ignore
import ArchiveAdapterCreator from "services/ArchiveAdapterCreator";
//@ts-ignore
import type { NoteDtoRes, NoteService } from "types/typings";
import {
  ArchiveService,
  KycSimplifiedIndividualMatchDto,
  KycSimplifiedRequestDto,
} from "../types/typings";
import ApiService from "./ApiService";
//@ts-ignore
import NoteAdapterCreator from "./NoteAdapterCreator";
//@ts-ignore
import { getCurrentTimeZone } from "util/date";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE
} from "constants/pagingSetting";

export const getKycRequestService = (params) => {
  return ApiService.get(
    `/djkyc/individual/requests${stringify(params, { addQueryPrefix: true })}`
  );
};
export const dJBulkAssignService = (userId: string, kycIds: string[]) => {
  return ApiService.post(`/djkyc/bulk-assign?userId=${userId}`, kycIds);
};
export const dJInputIndividualByUserService = (body) => {
  return ApiService.post("/djkyc/individual/user/input", body);
};

export const getDJIndividualRequest = (id: string | number) => {
  return ApiService.get(`/djkyc/individual/request/${id}`);
};

export const getAvailableAssignee = (id: string | number) => {
  return ApiService.get("user/get-available-assignees/DJKYC");
};

export const assignDjKycRequest = (kycId: string, userId: string | number) => {
  return ApiService.post(`/djkyc/assign/${kycId}?userId=${userId}`);
};

export const getDjKycScoring = (kycId: string, userId: string | number) => {
  return ApiService.get(`/djkyc/individual/request/${kycId}/scoring`);
};

export const changeDjMatchStatus = (
  kycId: string,
  matchId: string,
  status: KycSimplifiedIndividualMatchDto["status"]
) => {
  return ApiService.post(
    `/djkyc/individual/${kycId}/match/${matchId}/status?status=${status}`
  );
};

export const changeDjMatchStatusFalse = (
  kycId: string,
  matchesId: string[]
) => {
  return ApiService.post(
    `/djkyc/individual/${kycId}/match/mark-false`,
    matchesId
  );
};

export const getDJFilterService = (params: any, filter: any) => {
  return ApiService.post(
    `/djkyc/individual/requests/filter${stringify(params, {
      addQueryPrefix: true,
    })}`,
    filter
  );
};

export const getKycMatchService = (kycId: string, matchId: string) => {
  return ApiService.get(`/djkyc/individual/${kycId}/match/${matchId}`);
};

export const editDjKycTotalScore = (kycId: string, body: any) => {
  return ApiService.post(
    `/djkyc/individual/request/${kycId}/scoring/edit`,
    body
  );
};

export const postToggleKycOm = (kycId: string, enabled: boolean) => {
  return ApiService.post(
    `/djkyc/individual/request/${kycId}/monitoring?enabled=${enabled}`
  );
};

export const postBulkToggleKycOm = (kycIds: string, enabled: boolean) => {
  return ApiService.post(
    `/djkyc/individual/request/monitoring?enabled=${enabled}`,
    kycIds
  );
};

export const escalateDjKycService = ({ payload }: any) => {
  return ApiService.post(
    `djkyc/individual/request/${payload?.kycId}/escalate?escalatedTo=${payload?.user}`,
    payload?.note
  );
};

export const changeStatusRiskScoreService = (data: any) => {
  return ApiService.post(
    `djkyc/individual/request/${data?.kycId}/status?status=${data?.status}`,
    data?.note
  );
};

export const getDjKycMatchRequest = (payload) => {
  let paginationParams = { page: DEFAULT_PAGE, size: DEFAULT_PAGE_SIZE, ...payload?.params };
   //return ApiService.post(`/kyc/individual/request/${payload?.id}/matches${stringify(paginationParams, { addQueryPrefix: true })}`, payload?.filters).then(x => new Promise(resolve => setTimeout(() => resolve(x), 10000)));;
  return ApiService.post(`/djkyc/individual/request/${payload?.id}/matches${stringify(paginationParams, { addQueryPrefix: true })}`, payload?.filters || []);
};

export const getDjKycBlacklistRequest = (payload) => {
  let paginationParams = { page: DEFAULT_PAGE, size: DEFAULT_PAGE_SIZE, ...payload?.params };
  // return ApiService.get(`/kyc/individual/request/${payload?.id}/blacklists${stringify(paginationParams, { addQueryPrefix: true })}`).then(x => new Promise(resolve => setTimeout(() => resolve(x), 5000)));
  return ApiService.get(`/djkyc/individual/request/${payload?.id}/blacklists${stringify(paginationParams, { addQueryPrefix: true })}`);
};

export const getDjKycMatchesFilterList = (kycId) => {
  return ApiService.get(`/djkyc/individual/request/${kycId}/dropdowns`);
};

export const DJNoteService = {
  getAll(kycId: string, ...args): ServiceResponse<Array<NoteDtoRes>> {
    return ApiService.get(`/djkyc/individual/request/${kycId}/notes`);
  },
  getOne(id: string, ...args): ServiceResponse<NoteDtoRes> {
    return ApiService.get(`/djkyc/individual/request/note/${id}`);
  },
  save(typeId: string, body: NoteDtoRes): ServiceResponse<NoteDtoRes> {
    return ApiService.post(
      `/djkyc/individual/request/${typeId}/note/save`,
      body
    );
  },
  delete(id: string): ServiceResponse<void> {
    return ApiService.delete(`/djkyc/individual/request/delete/note/${id}`);
  },
};

export const DJNoteMatchService: NoteService = {
  delete(id: string): ServiceResponse<void> {
    return Promise.resolve(undefined);
  },
  getOne(id: string, ...args: any[]): ServiceResponse<NoteDtoRes> {
    return Promise.resolve(undefined);
  },
  save(id: string, body: NoteDtoRes): ServiceResponse<NoteDtoRes> {
    const arrayId = id.split("@");
    return ApiService.post(
      `/djkyc/individual/${arrayId[0]}/match/${arrayId[1]}/note/save`,
      body
    );
  },
  getAll(id: string): ServiceResponse<Array<NoteDtoRes>> {
    const arrayId = id.split("@");
    return ApiService.get(
      `/djkyc/individual/${arrayId[0]}/match/${arrayId[1]}/notes`
    );
  },
};

export const DJNoteScoringService: NoteService = {
  getAll(id: string): ServiceResponse<Array<NoteDtoRes>> {
    return ApiService.get(`/djkyc/individual/request/${id}/scoring/notes`);
  },
  getOne(): ServiceResponse<NoteDtoRes> {
    return Promise.resolve(undefined);
  },
  save(id: string, body: NoteDtoRes): ServiceResponse<NoteDtoRes> {
    return ApiService.post(
      `/djkyc/individual/request/${id}/scoring/note/save`,
      body
    );
  },
  delete(): ServiceResponse<void> {
    return Promise.resolve(undefined);
  },
};
///endregion

export const DJNoteAdapter = NoteAdapterCreator("djkyc", DJNoteService);

export const DJNoteMatchAdapter = NoteAdapterCreator(
  "djkyc-match",
  DJNoteMatchService,
  "matchNotes"
);

export const DJNoteScoringAdapter = NoteAdapterCreator(
  "djkyc-scoring",
  DJNoteScoringService,
  "scoringNotes"
);
//Group list
export const getWatchGroup = (data) => {
  return ApiService.get(`/djkyc/group-list`);
};
export const addWatchGroupService = (params) => {
  return ApiService.post(
    `/djkyc/group-list/items/add?watchGroupId=${params?.watchGroupId}`,
    params?.kycIds
  );
};
export const requestSearchGroupList = (params) => {
  const newParam = { ...params };
  if (!newParam.sort || newParam.sort.length === 0)
    newParam.sort = "createdAt,desc";
  return ApiService.get(
    `/djkyc/group-list/search-to-add${stringify(newParam, {
      addQueryPrefix: true,
    })}`
  );
};
export const renameWatchGroupService = (params) => {
  return ApiService.post(`/djkyc/group-list/rename`, params);
};
export const removeWatchGroupService = (watchGroupId) => {
  return ApiService.post(`/djkyc/group-list/remove?id=${watchGroupId}`);
};
export const removeFromWatchGroupService = (params) => {
  return ApiService.post(
    `/djkyc/group-list/items/remove?watchGroupId=${params?.watchGroupId}`,
    params?.list
  );
};
export const createWatchGroupService = (params) => {
  return ApiService.post(`/djkyc/group-list/create`, params);
};
export const requestWatchList = (params) => {
  const newParam = { ...params };
  if (!newParam.sort || newParam.sort.length === 0)
    newParam.sort = "createdAt,desc";
  return ApiService.get(
    `/djkyc/group-list/items${stringify(newParam, { addQueryPrefix: true })}`
  );
};
export const changeDJKYCOrderGroup = (data) => {
  return ApiService.post(`/djkyc/group-list/change-order`, data);
};
export const getDJRequests = (params) => {
  return ApiService.get(
    `/djkyc/individual/requests${stringify(params, { addQueryPrefix: true })}`
  );
};
export const changeDJBlacklistMatchStatus = (djKycId, blacklistId, status) => {
  return ApiService.post(
    `/kyc-blacklist/match/dj/status?djKycId=${djKycId}&blacklistId=${blacklistId}&status=${status}`
  );
};

export const changeDJBlacklistMatchesStatusFalse = (djKycId, blacklistId) => {
  return ApiService.post(
    `/kyc-blacklist/match/dj/${djKycId}/status/mark-false`,
    blacklistId
  );
};
export const getDJBlackListMatchDetailService = (data) => {
  return ApiService.get(
    `/kyc-blacklist/match/dj?djKycId=${data?.kycId}&blacklistId=${data?.blacklistId}`
  );
};

export const DJArchiveService: ArchiveService<KycSimplifiedRequestDto> = {
  getAll(args: any): ServiceResponse<PageResult<KycSimplifiedRequestDto>> {
    return ApiService.get(
      `/djkyc/archive${stringify(args, {
        addQueryPrefix: true,
      })}`
    );
  },
  addToArchive(typeId: string[]): ServiceResponse<void> {
    return ApiService.post("/djkyc/archive/add", typeId);
  },
  remove(typeId: string[]): ServiceResponse<void> {
    return ApiService.post("/djkyc/archive/remove", typeId);
  },
};

export const DJKYCArchiveAdapter = ArchiveAdapterCreator<KycSimplifiedRequestDto>(
  "djkyc",
  DJArchiveService,
  {
    addToWatchList: DJ_ACTION_ADD_TO_WATCHLIST,
    removeFromWatchList: DJ_ACTION_REMOVE_WATCHLIST,
    fetchList: DJ_ACTION_GET_KYC_REQUESTS,
    fetchWatchList: DJ_ACTION_GET_KYC_WATCHLIST,
  }
);
export const rescreeningService = (params) => {
  return ApiService.post(
    `/djkyc/individual/request/${params.kycId}/re-screening?enabled=${params.action}`
  );
};

export const postImportCsvFile = (formData: FormData) => {
  return ApiService.post(`/djkyc/import/csv/individual`, formData);
};

export const postImportConfirm = (data) => {
  const tz = getCurrentTimeZone();
  return ApiService.post(`/djkyc/import/confirm?timeZone=${tz}`, data);
};
