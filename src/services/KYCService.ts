import { paginationParams } from 'util/sagas';
import { ServiceResponse } from "@protego/sdk/core/AuthService";
import { PageResult } from "@protego/sdk/types";
import {
  KYC_ACTION_ADD_TO_WATCHLIST,
  KYC_ACTION_GET_KYC_REQUESTS,
  KYC_ACTION_GET_KYC_WATCHLIST,
  KYC_ACTION_REMOVE_WATCHLIST
} from "actions/KYCAction";
import { stringify } from "qs";
import ArchiveAdapterCreator from "services/ArchiveAdapterCreator";
import { getCurrentTimeZone } from "util/date";
// @ts-ignore
import { injectService } from "util/index";
import {
  ArchiveService,
  KycDetailedRequestDto,
  KycIndividualRequestEntityReq,
  KycSimplifiedIndividualMatchDto,
  KycSimplifiedRequestDto,
  NoteDtoRes,
  NoteService,
  RiskResponseDto
} from "../types/typings";
import ApiService from "./ApiService";
//@ts-ignore
import NoteAdapterCreator from "./NoteAdapterCreator";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE
} from "constants/pagingSetting";
const KYCService = {
  re_screeningApi(params: any): ServiceResponse<void> {
    return ApiService.post(
      `/kyc/individual/request/${params.kycId}/re-screening?enabled=${params.action}`
    );
  },
  assignKycRequest(
    kycId: string,
    userId: string | number
  ): ServiceResponse<void> {
    return ApiService.post(`/kyc/assign/${kycId}?userId=${userId}`);
  },
  inputIndividualByUser(
    body: KycIndividualRequestEntityReq
  ): ServiceResponse<KycSimplifiedRequestDto> {
    return ApiService.post("/kyc/individual/user/input", body);
  },
  changeMatchStatus(
    kycId: string,
    matchId: string,
    status: KycSimplifiedIndividualMatchDto["status"]
  ): ServiceResponse<void> {
    return ApiService.post(
      `/kyc/individual/${kycId}/match/${matchId}/status?status=${status}`
    );
  },
  changeMatchesStatusFalse(
    kycId: string,
    matchesId: string[]
  ): ServiceResponse<void> {
    return ApiService.post(
      `/kyc/individual/${kycId}/match/mark-false`,
      matchesId
    );
  },
  requestWatchList(
    params: any = {}
  ): ServiceResponse<PageResult<KycSimplifiedRequestDto>> {
    const newParam = { ...params };
    if (!newParam.sort || newParam.sort.length === 0)
      newParam.sort = "createdAt,desc";
    return ApiService.get(
      `/kyc/watch-list${stringify(newParam, { addQueryPrefix: true })}`
    );
  },
  getKycRequest(kycId: string): ServiceResponse<KycDetailedRequestDto> {
    return ApiService.get(`/kyc/individual/request/${kycId}`);
  },
  getKycMatchRequest(payload): ServiceResponse<KycDetailedRequestDto> {
    let paginationParams = { page: DEFAULT_PAGE, size: DEFAULT_PAGE_SIZE, ...payload?.params };
    // return ApiService.post(`/kyc/individual/request/${payload?.id}/matches${stringify(paginationParams, { addQueryPrefix: true })}`, payload?.filters).then(x => new Promise(resolve => setTimeout(() => resolve(x), 10000)));;
    return ApiService.post(`/kyc/individual/request/${payload?.id}/matches${stringify(paginationParams, { addQueryPrefix: true })}`, payload?.filters || []);
  },
  getKycBlacklistRequest(payload): ServiceResponse<KycDetailedRequestDto> {
    let paginationParams = { page: DEFAULT_PAGE, size: DEFAULT_PAGE_SIZE, ...payload?.params };
    // return ApiService.get(`/kyc/individual/request/${payload?.id}/blacklists${stringify(paginationParams, { addQueryPrefix: true })}`).then(x => new Promise(resolve => setTimeout(() => resolve(x), 5000)));
    return ApiService.get(`/kyc/individual/request/${payload?.id}/blacklists${stringify(paginationParams, { addQueryPrefix: true })}`);
  },
  requestAddWatchList(kycIds: any[]): ServiceResponse<void> {
    return ApiService.post(`/kyc/watch-list/add`, kycIds);
  },
  RequestRemoveWatchList(kycIds: any[]): ServiceResponse<void> {
    return ApiService.post(`/kyc/watch-list/remove`, kycIds);
  },
  requestSearchWatchList(
    search: string
  ): ServiceResponse<PageResult<KycSimplifiedRequestDto>> {
    return ApiService.get(`/kyc/watch-list?${search}`);
  },
  requestSearch(
    search: string
  ): ServiceResponse<PageResult<KycSimplifiedRequestDto>> {
    return ApiService.get(`/kyc/individual/requests?${search}`);
  },
  getKycMatch(payload): ServiceResponse<KycSimplifiedIndividualMatchDto> {
    return ApiService.get(
      `/kyc/individual/${payload.kycId}/match/${payload.matchId}`
    );
  },
  getKycRequests(
    params: any
  ): ServiceResponse<PageResult<KycSimplifiedRequestDto>> {
    return ApiService.get(
      `/kyc/individual/requests${stringify(params, { addQueryPrefix: true })}`
    );
  },
  getKycScoring(kycId: string): ServiceResponse<RiskResponseDto> {
    return ApiService.get(`/kyc/individual/request/${kycId}/scoring`);
  },
  postImportCsvFile(formData: FormData) {
    return ApiService.post(`/kyc/import/csv/individual`, formData);
  },
  postImportConfirm(data) {
    const tz = getCurrentTimeZone();
    return ApiService.post(`/kyc/import/confirm?timeZone=${tz}`, data);
  },
  editTotalScore(kycId: string, body: any) {
    return ApiService.post(
      `/kyc/individual/request/${kycId}/scoring/edit`,
      body
    );
  },
  getWatchGroup(data) {
    return ApiService.get(`/kyc/watch-group`);
  },
  addWatchGroupService(params: any): ServiceResponse<void> {
    return ApiService.post(
      `/kyc/watch-list/add?watchGroupId=${params?.watchGroupId}`,
      params?.kycIds
    );
  },
  requestSearchGroupList(
    params: any = {}
  ): ServiceResponse<PageResult<KycSimplifiedRequestDto>> {
    const newParam = { ...params };
    if (!newParam.sort || newParam.sort.length === 0)
      newParam.sort = "createdAt,desc";
    return ApiService.get(
      `/kyc/watch-list/search${stringify(newParam, { addQueryPrefix: true })}`
    );
  },
  createWatchGroupService(params: any): ServiceResponse<void> {
    return ApiService.post(`/kyc/watch-group/create`, params);
  },
  renameWatchGroupService(params: any): ServiceResponse<void> {
    return ApiService.post(`/kyc/watch-group/rename`, params);
  },
  removeWatchGroupService(watchGroupId: any): ServiceResponse<void> {
    return ApiService.post(`/kyc/watch-group/remove?id=${watchGroupId}`);
  },
  removeFromWatchGroupService(params: any): ServiceResponse<void> {
    return ApiService.post(
      `/kyc/watch-list/remove?watchGroupId=${params?.watchGroupId}`,
      params?.list
    );
  },
  KYCBulkAssign(data: any) {
    return ApiService.post(
      `/kyc/bulk-assign?userId=${data.userId}`,
      data.kycIds
    );
  },
  KYCActivityLogService({ payload }: any) {
    const { refId, params } = payload;
    return ApiService.get(
      `audit/view-log?refId=${refId}&page=${params.page}&size=${params.size}`
    );
  },
  KYCEscalateService({ payload }: any) {
    return ApiService.post(
      `kyc/individual/request/${payload?.kycId}/escalate?escalatedTo=${payload?.user}`,
      payload?.note
    );
  },

  KYCChangeStatusRiskScoreService(data: any) {
    return ApiService.post(
      `kyc/individual/request/${data?.kycId}/status?status=${data?.status}`,
      data?.note
    );
  },
  getKycRequestsByFilter(
    data: any
    // @ts-ignore
  ): ServiceResponse<PageResult<KycSimplifiedRequestDto>> {
    return ApiService.post(
      `/kyc/individual/requests/filter${stringify(data?.params, {
        addQueryPrefix: true
      })}`,
      data?.filter
    );
  },
  postToggleKycOm(kycId, enabled) {
    return ApiService.post(
      `/kyc/individual/request/${kycId}/monitoring?enabled=${enabled}`
    );
  },
  postBulkToggleKycOm(kycIds, enabled) {
    return ApiService.post(
      `/kyc/individual/request/monitoring?enabled=${enabled}`,
      kycIds
    );
  },
  changeKYCOrderGroup(data: any) {
    return ApiService.post(`/kyc/watch-group/change-order`, data);
  },
  getBlackListMatchDetailService(data: any) {
    return ApiService.get(`/kyc-blacklist/match?kycId=${data?.kycId}&blacklistId=${data?.blacklistId}`);
  },
  /**
   * Blacklist 
   *
   */

  changeBlacklistMatchStatus(
    kycId: string,
    blacklistId: string,
    status: KycSimplifiedIndividualMatchDto["status"]
  ): ServiceResponse<void> {
    return ApiService.post(
      `/kyc-blacklist/match/status?kycId=${kycId}&blacklistId=${blacklistId}&status=${status}`
    );
  },
  changeBlacklistMatchesStatusFalse(
    kycId: string,
    blacklistId: string[]
  ): ServiceResponse<void> {
    return ApiService.post(
      `/kyc-blacklist/match/${kycId}/status/mark-false`,
      blacklistId
    );
  },
  postImportBlacklistCsvFile(formData: FormData) {
    return ApiService.post(`/kyc-blacklist/import/csv`, formData);
  },
  postImportConfirmBlacklist(data) {
    const tz = getCurrentTimeZone();
    return ApiService.post(`/kyc-blacklist/import/confirm?timeZone=${tz}`, data);
  },
  getKycMatchesFilterList(kycId: string) {
    return ApiService.get(`/kyc/individual/request/${kycId}/dropdowns`);
  },
};

export default KYCService;

if (process.env.NODE_ENV === "development") injectService({ KYCService });

//region @author ilyatruong please dont modify
export const KYCNoteService: NoteService = {
  getAll(kycId, ...args): ServiceResponse<Array<NoteDtoRes>> {
    return ApiService.get(`/kyc/individual/request/${kycId}/notes`);
  },
  getOne(id, ...args): ServiceResponse<NoteDtoRes> {
    return ApiService.get(`/kyc/note/${id}`);
  },
  save(typeId: string, body: NoteDtoRes): ServiceResponse<NoteDtoRes> {
    return ApiService.post(`/kyc/individual/request/${typeId}/note/save`, body);
  },
  //@ts-ignore
  delete(id: string): ServiceResponse<void> { }
};

export const KYCNoteMatchService: NoteService = {
  delete(id: string): ServiceResponse<void> {
    return Promise.resolve(undefined);
  },
  getOne(id: string, ...args: any[]): ServiceResponse<NoteDtoRes> {
    return Promise.resolve(undefined);
  },
  save(id: string, body: NoteDtoRes): ServiceResponse<NoteDtoRes> {
    const arrayId = id.split("@");
    return ApiService.post(
      `/kyc/individual/${arrayId[0]}/match/${arrayId[1]}/note/save`,
      body
    );
  },
  getAll(id: string): ServiceResponse<Array<NoteDtoRes>> {
    const arrayId = id.split("@");
    return ApiService.get(
      `/kyc/individual/${arrayId[0]}/match/${arrayId[1]}/notes`
    );
  }
};

export const KYCNoteScoringService: NoteService = {
  delete(id: string): ServiceResponse<void> {
    return Promise.resolve(undefined);
  },
  getAll(kycId: string): ServiceResponse<Array<NoteDtoRes>> {
    return ApiService.get(`/kyc/individual/request/${kycId}/scoring/notes`);
  },
  getOne(id: string, ...args: any[]): ServiceResponse<NoteDtoRes> {
    return Promise.resolve(undefined);
  },
  save(kycId: string, body: NoteDtoRes): ServiceResponse<NoteDtoRes> {
    return ApiService.post(
      `/kyc/individual/request/${kycId}/scoring/note/save`,
      body
    );
  }
};

export const KYCNoteAdapter = NoteAdapterCreator("kyc", KYCNoteService);

export const KYCNoteMatchAdapter = NoteAdapterCreator(
  "kyc-match",
  KYCNoteMatchService,
  "matchNotes"
);

export const KYCNoteScoringAdapter = NoteAdapterCreator(
  "kyc-scoring",
  KYCNoteScoringService,
  "scoringNotes"
);
//endregion

export const KYCArchiveService: ArchiveService<KycSimplifiedRequestDto> = {
  getAll(args: any): ServiceResponse<PageResult<KycSimplifiedRequestDto>> {
    return ApiService.get(
      `/kyc/archive${stringify(args, {
        addQueryPrefix: true
      })}`
    );
  },
  addToArchive(typeId: string[]): ServiceResponse<void> {
    return ApiService.post("/kyc/archive/add", typeId);
  },
  remove(typeId: string[]): ServiceResponse<void> {
    return ApiService.post("/kyc/archive/remove", typeId);
  }
};

export const KYCArchiveAdapter = ArchiveAdapterCreator<KycSimplifiedRequestDto>(
  "kyc",
  KYCArchiveService,
  {
    addToWatchList: KYC_ACTION_ADD_TO_WATCHLIST,
    removeFromWatchList: KYC_ACTION_REMOVE_WATCHLIST,
    fetchList: KYC_ACTION_GET_KYC_REQUESTS,
    fetchWatchList: KYC_ACTION_GET_KYC_WATCHLIST
  }
);
