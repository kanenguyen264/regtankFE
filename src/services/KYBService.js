import ApiService from "./ApiService";
import { stringifyQuery } from "util/stringQuery";
import { stringify } from "qs";
import NoteAdapterCreator from "./NoteAdapterCreator";
import {
  KYB_ACTION_ADD_TO_WATCHLIST,
  KYB_ACTION_GET_KYB_REQUESTS,
  KYB_ACTION_GET_KYB_WATCHLIST,
  KYB_ACTION_REMOVE_WATCHLIST,
} from "../actions";
import ArchiveAdapterCreator from "services/ArchiveAdapterCreator";
import { getCurrentTimeZone } from "util/date";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE
} from "constants/pagingSetting";

export const addBusinessFromApi = (body) => {
  const url = `/kyb/user/screen`;
  return ApiService.post(url, body);
};

export const getKybList = (body) => {
  return ApiService.get(`/kyb/requests${stringifyQuery(body)}`);
};
export const getKybWatchList = (params) => {
  const newParam = { ...params };
  if (!newParam.sort || newParam.sort.length === 0)
    newParam.sort = "createdAt,desc";
  return ApiService.get(
    `/kyb/watch-list${stringify(newParam, { addQueryPrefix: true })}`
  );
};

export const requestAddWatchList = (kybIds) => {
  return ApiService.post(`/kyb/watch-list/add`, kybIds);
};

export const requestRemoveWatchList = (ids) => {
  return ApiService.post(`/kyb/watch-list/remove`, ids);
};

/**
 * Archive
 */
export const fetchKybListArchive = (params) => {
  const newParam = { ...params };
  if (!newParam.sort || newParam.sort.length === 0)
    newParam.sort = "createdAt,desc";
  return ApiService.get(
    `/kyb/archives${stringify(newParam, { addQueryPrefix: true })}`
  );
};

/**
 * Add to archive
 */
export const addToArchiveService = (kybIds) => {
  return ApiService.post(`/kyb/archive/add`, kybIds);
};
/**
 * Remove to archive
 */

export const removeFromArchiveService = (kybIds) => {
  return ApiService.post(`/kyb/archive/remove`, kybIds);
};
export const getKybRequest = (kybId) => {
  return ApiService.get(`/kyb/request/${kybId}`);
};
/**
 * Fetch risk assessment detail
 */
export const fetchKybRiskAssessmentDetailService = (kybId) => {
  return ApiService.get(`/kyb/risk-assessment/${kybId}`);
};
/**
 * Update business information
 */
export const updateBusinessInformationService = (kybId, content) => {
  const dataSubmit = {
    businessInformation: content,
  };
  return ApiService.post(
    `/kyb/update/${kybId}/business-information`,
    dataSubmit
  );
};
/**
 *  toggle switch RiskAssessment
 */
export const toggleRiskAssessmentService = (kybId, status) => {
  return ApiService.post(`kyb/request/${kybId}/re-screening?enabled=${status}`);
};

/**
 *  Change risk level
 */
export const changeRiskLevelAssessmentService = (kybId, body) => {
  return ApiService.post(
    `kyb/risk-assessment/change-status/${kybId}/status`,
    body
  );
};
/**
 * Save risk assessment
 */
export const kybSaveRiskAssessment = (payload) => {
  return ApiService.post(`kyb/risk-assessment/${payload.id}/save`, payload);
};

export const assignKybRequest = (kybId, userId) => {
  return ApiService.post(`/kyb/assign/${kybId}?userId=${userId}`);
};
export const re_screeningApi = (params) => {
  return ApiService.post(
    `/kyb/request/${params.kybId}/re-screening?enabled=${params.action}`
  );
};
export const changeMatchStatus = (kybId, matchId, status) => {
  return ApiService.post(
    `/kyb/${kybId}/match/${matchId}/status?status=${status}`
  );
};
export const changeMatchesStatusFalse = (kybId, matchesId) => {
  return ApiService.post(`/kyb/${kybId}/match/mark-false`, matchesId);
};
export const getKybMatch = (payload) => {
  return ApiService.get(`/kyb/${payload.kybId}/match/${payload.matchId}`);
};
export const kybRiskAssessmentNoteService = (riskId) => {
  return ApiService.get(`kyb/risk-assessment/${riskId}/notes`);
};
export const kybSaveRiskAssessmentNoteService = (riskId, body) => {
  return ApiService.get(`kyb/risk-assessment/${riskId}/note/save`, body);
};
export const postImportCsvKYBFile = (formData) => {
  return ApiService.post(`/kyb/import/csv`, formData);
};
export const postImportKYBConfirm = (data) => {
  const tz = getCurrentTimeZone();
  return ApiService.post(`/kyb/import/confirm?timeZone=${tz}`, data);
};
export const KYBBulkAssign = (data) => {
  return ApiService.post(`/kyb/bulk-assign?userId=${data.userId}`, data.kybIds);
};

export const KYBChangeStatusRiskScoreService = (data: any) => {
  return ApiService.post(
    `kyb/request/${data?.kybId}/status?status=${data?.status}`,
    data?.note
  );
};

export const KYBEscalateService = ({ payload }: any) => {
  return ApiService.post(
    `kyb/request/${payload?.kybId}/escalate?escalatedTo=${payload?.user}`,
    payload?.note
  );
};

export const getKYBMatchRequest = (payload) => {
  let paginationParams = { page: DEFAULT_PAGE, size: DEFAULT_PAGE_SIZE, ...payload?.params };
  return ApiService.post(`/kyb/request/${payload?.id}/matches${stringify(paginationParams, { addQueryPrefix: true })}`, payload?.filters || []);
};
export const getKYBMatchesFilterList = (kycId) => {
  return ApiService.get(`/kyb/request/${kycId}/dropdowns`);
};

export const KYBNoteService = {
  getAll(kybId, ...args) {
    return ApiService.get(`/kyb/request/${kybId}/notes`);
  },
  getOne(id, ...args) {
    return ApiService.get(`/kyb/note/${id}`);
  },
  save(typeId, body) {
    return ApiService.post(`/kyb/request/${typeId}/note/save`, body);
  },
  delete() {},
};

export const KYBRiskNoteService = {
  getAll(kybId, ...args) {
    return ApiService.get(`/kyb/risk-assessment/${kybId}/notes`);
  },
  getOne(id, ...args) {
    return ApiService.get(`/kyb/note/${id}`);
  },
  save(typeId, body) {
    return ApiService.post(`/kyb/risk-assessment/${typeId}/note/save`, body);
  },
  delete() {},
};

export const KYBNoteMatchService = {
  delete(id) {
    return Promise.resolve(undefined);
  },
  getOne(id, ...args) {
    return Promise.resolve(undefined);
  },
  save(id, body) {
    const arrayId = id.split("@");
    return ApiService.post(
      `/kyb/${arrayId[0]}/match/${arrayId[1]}/note/save`,
      body
    );
  },
  getAll(id) {
    const arrayId = id.split("@");
    return ApiService.get(`/kyb/${arrayId[0]}/match/${arrayId[1]}/notes`);
  },
};

export const KYBArchiveService = {
  getAll: fetchKybListArchive,
  addToArchive: addToArchiveService,
  remove: removeFromArchiveService,
};

export const generateRiskAssessment = (kybId) => {
  return ApiService.post(`kyb/risk-assessment/generate/${kybId}`);
};
export const KYBNoteAdapter = NoteAdapterCreator("kyb", KYBNoteService);
export const KYBRiskNoteAdapter = NoteAdapterCreator(
  "kyb-risk",
  KYBRiskNoteService
);
export const KYBNoteMatchAdapter = NoteAdapterCreator(
  "kyb-match",
  KYBNoteMatchService,
  "matchNotes"
);
export const KYBArchiveAdapter = ArchiveAdapterCreator(
  "kyb",
  KYBArchiveService,
  {
    addToWatchList: KYB_ACTION_ADD_TO_WATCHLIST,
    removeFromWatchList: KYB_ACTION_REMOVE_WATCHLIST,
    fetchList: KYB_ACTION_GET_KYB_REQUESTS,
    fetchWatchList: KYB_ACTION_GET_KYB_WATCHLIST,
  }
);
export function requestSearchGroupList(
  params: any = {}
): ServiceResponse<PageResult<KybSimplifiedRequestDto>> {
  const newParam = { ...params };
  if (!newParam.sort || newParam.sort.length === 0)
    newParam.sort = "createdAt,desc";
  return ApiService.get(
    `/kyb/watch-list/search${stringify(newParam, { addQueryPrefix: true })}`
  );
}

export function getWatchGroup(data) {
  return ApiService.get(`/kyb/watch-group`);
}
export function addWatchGroupService(params: any): ServiceResponse<void> {
  return ApiService.post(
    `/kyb/watch-list/add?watchGroupId=${params?.watchGroupId}`,
    params?.kybIds
  );
}
export function createWatchGroupService(params: any): ServiceResponse<void> {
  return ApiService.post(`/kyb/watch-group/create`, params);
}
export function renameWatchGroupService(params: any): ServiceResponse<void> {
  return ApiService.post(`/kyb/watch-group/rename`, params);
}

export function removeWatchGroupService(
  watchGroupId: any
): ServiceResponse<void> {
  return ApiService.post(`/kyb/watch-group/remove?id=${watchGroupId}`);
}

export function removeFromWatchGroupService(
  params: any
): ServiceResponse<void> {
  return ApiService.post(
    `/kyb/watch-list/remove?watchGroupId=${params?.watchGroupId}`,
    params?.list
  );
}

export const getKyBRequestByFilter = (data: any) => {
  return ApiService.post(
    `/kyb/requests/filter${stringify(data?.params, {
      addQueryPrefix: true,
    })}`,
    data?.filter
  );
};

export const addBulkToggleKybOm = (kybIds, enabled) => {
  return ApiService.post(`/kyb/request/monitoring?enabled=${enabled}`, kybIds);
};

export const addToggleKybOm = (kybId, enabled) => {
  return ApiService.post(`/kyb/request/${kybId}/monitoring?enabled=${enabled}`);
};
