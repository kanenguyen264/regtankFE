import type { ServiceResponse } from "@protego/sdk/core/AuthService";
import { PageResult } from "@protego/sdk/types";
import {
  KYT_ACTION_ADD_TO_WATCHLIST,
  KYT_ACTION_GET_KYT_WATCHLIST,
  KYT_ACTION_REMOVE_WATCHLIST,
  KYT_ACTION_REQUEST_LIST
} from "actions/KYTAction";
import { stringify } from "qs";
import ArchiveAdapterCreator from "services/ArchiveAdapterCreator";
import type {
  ArchiveService,
  KytRequestDto,
  NoteDtoRes,
  NoteService,
  TransactionEntity
} from "types/typings";
import { getCurrentTimeZone } from "util/date";
// @ts-ignore
import { injectService } from "util/index";
import ApiService from "./ApiService";
//@ts-ignore
import NoteAdapterCreator from "./NoteAdapterCreator";

export function KYTService_RequestList(
  params: any = {}
): ServiceResponse<PageResult<KytRequestDto>> {
  const newParam = { ...params };
    return ApiService.get(
      `/kyt/requests${stringify(newParam, { addQueryPrefix: true })}`
    );
}
export function KYTService_RequestWatchList(
  params: any = {}
): ServiceResponse<PageResult<KytRequestDto>> {
  const newParam = { ...params };
    return ApiService.get(
      `/kyt/watch-list${stringify(newParam, { addQueryPrefix: true })}`
    );
}

export function KYTService_RequestItem(
  id: string
): ServiceResponse<KytRequestDto> {
  return ApiService.get(`/kyt/request/${id}`);
}

export type KYTService_RequestUserInputPayload = {
  address: string;
  asset: string;
  referenceId?: string;
};
export function KYTService_RequestUserInput(
  data: KYTService_RequestUserInputPayload
): ServiceResponse<KytRequestDto> {
  return ApiService.post("/kyt/user/input", data);
}

export function KYTService_GetAssets(): ServiceResponse<
  Array<string | [string, string]>
> {
  //mocking up only
  return new Promise((resolve) => {
    setTimeout(() => {
      // @ts-ignore
      resolve({
        data: [
          "BTC",
          "ETH",
          "BNB",
          "BCH",
          "LTC",
          // "RSK"
          // ["ERC20", "ERC 20/721 Token"]
        ]
      });
    }, 50);
  });
}

export function KYTService_RequestItemTransactions(
  id: string,
  params: {}
): ServiceResponse<PageResult<TransactionEntity>> {
  return ApiService.get(
    `/kyt/request/${id}/transactions${stringify(params, {
      addQueryPrefix: true
    })}`
  );
}

export function KYTService_RequestItem_FetchTransactions(
  id: string,
  params: {}
): ServiceResponse<any> {
  return ApiService.post(
    `/kyt/request/${id}/transactions/fetch${stringify(params, {
      addQueryPrefix: true
    })}`
  );
}
export function KYTService_RequestItem_GetRisk(
  kytId: string,
  params: {}
): ServiceResponse<any> {
  return ApiService.get(
    `/kyt/request/${kytId}/transactions/risk${stringify(params, {
      addQueryPrefix: true
    })}`
  );
}
export function KYTService_RequestItem_GetRiskBulk(
  kytId: string,
  ids: string[]
): ServiceResponse<any> {
  return ApiService.post(`/kyt/request/${kytId}/transactions/risk`, ids);
}

export function KYTService_RequestAddWatchList(ids) {
  return ApiService.post(`/kyt/watch-list/add`, ids);
}

export function KYTService_RequestRemoveWatchList(ids): ServiceResponse<void> {
  return ApiService.post(`/kyt/watch-list/remove`, ids);
}
export function KYTService_RequestSearchWatchList(
  search: string
): ServiceResponse<PageResult<TransactionEntity>> {
  return ApiService.get(`/kyt/watch-list?${search}`);
}
export function KYTService_RequestSearch(
  search: string
): ServiceResponse<PageResult<TransactionEntity>> {
  return ApiService.get(`/kyt/requests?${search}`);
}
export function KYTService_RequestAssign(
  kytId: string,
  userId: string | number
): ServiceResponse<PageResult<TransactionEntity>> {
  return ApiService.post(`/kyt/assign/${kytId}?userId=${userId}`);
}

export function KYTService_PostImportCsvFile(formData: FormData) {
  return ApiService.post(`/kyt/import/csv`, formData);
}

export function KYTService_RequestImportConfirm(data) {
  const tz = getCurrentTimeZone();
  return ApiService.post(`/kyt/import/confirm?timeZone=${tz}`, data);
}

if (process.env.NODE_ENV === "development") {
  injectService({
    KYTService: {
      requestUserInput: KYTService_RequestUserInput
    }
  });
}

//region @author ilyatruong please dont modify
export const KYTNoteService: NoteService = {
  getAll(kytId: string, ...args): ServiceResponse<Array<NoteDtoRes>> {
    return ApiService.get(`/kyt/request/${kytId}/notes`);
  },
  getOne(id: string, ...args): ServiceResponse<NoteDtoRes> {
    return ApiService.get(`/kyt/request/note/${id}`);
  },
  save(typeId: string, body: NoteDtoRes): ServiceResponse<NoteDtoRes> {
    return ApiService.post(`/kyt/request/${typeId}/note/save`, body);
  },
  delete(id: string): ServiceResponse<void> {
    return ApiService.delete(`/kyt/request/delete/note/${id}`);
  }
};
///endregion

export const KYTNoteAdapter = NoteAdapterCreator("kyt", KYTNoteService);

export const KYTArchiveService: ArchiveService<KytRequestDto> = {
  getAll(args: any): ServiceResponse<PageResult<KytRequestDto>> {
    return ApiService.get(
      `/kyt/archive${stringify(args, {
        addQueryPrefix: true
      })}`
    );
    // return Promise.resolve(undefined);
  },
  addToArchive(typeId: string[]): ServiceResponse<void> {
    return ApiService.post("/kyt/archive/add", typeId);
  },
  remove(typeId: string[]): ServiceResponse<void> {
    return ApiService.post("/kyt/archive/remove", typeId);
  }
};

export const KYTArchiveAdapter = ArchiveAdapterCreator<KytRequestDto>(
  "kyt",
  KYTArchiveService,
  {
    addToWatchList: KYT_ACTION_ADD_TO_WATCHLIST,
    removeFromWatchList: KYT_ACTION_REMOVE_WATCHLIST,
    fetchList: KYT_ACTION_REQUEST_LIST,
    fetchWatchList: KYT_ACTION_GET_KYT_WATCHLIST
  }
);

export function KYTService_EditRiskScore(
  kytId: string,
  data: any
): ServiceResponse<any> {
  return ApiService.post(`/kyt/request/${kytId}/edit-risk-score`, data);
}
export function requestSearchGroupList(
  params: any = {}
): ServiceResponse<PageResult<any>> {
  const newParam = { ...params };
  if (!newParam.sort || newParam.sort.length === 0)
    newParam.sort = "createdAt,desc";
  return ApiService.get(
    `/kyt/watch-list/search${stringify(newParam, { addQueryPrefix: true })}`
  );
}
export function getWatchGroup(data) {
  return ApiService.get(`/kyt/watch-group`);
}
export function addWatchGroupService(params: any): ServiceResponse<void> {
  return ApiService.post(
    `/kyt/watch-list/add?watchGroupId=${params?.watchGroupId}`,
    params?.kytIds
  );
}
export function changeKYTOrderGroupService(params: any): ServiceResponse<void> {
  return ApiService.post(`/kyt/watch-group/change-order`, params);
}
export function createWatchGroupService(params: any): ServiceResponse<void> {
  return ApiService.post(`/kyt/watch-group/create`, params);
}
export function renameWatchGroupService(params: any): ServiceResponse<void> {
  return ApiService.post(`/kyt/watch-group/rename`, params);
}

export function removeWatchGroupService(
  watchGroupId: any
): ServiceResponse<void> {
  return ApiService.post(`/kyt/watch-group/remove?id=${watchGroupId}`);
}

export function removeFromWatchGroupService(
  params: any
): ServiceResponse<void> {
  return ApiService.post(
    `/kyt/watch-list/remove?watchGroupId=${params?.watchGroupId}`,
    params?.list
  );
}

export function KYTService_ChangeLog(kytId) {
  return ApiService.get(`/kyt/alert/changelogs/${kytId}`);
}

export function KYTService_OnGoingMonitoring(body) {
  return ApiService.post(`/kyt/alert/subscription`, body);
}

export function KYTService_ViewReScreen(kytId) {
  return ApiService.put(`/kyt/request/view-rescreened/${kytId}`);
}
export const KYTBulkAssign = (data) => {
  return ApiService.post(`/kyt/bulk-assign?userId=${data.userId}`, data.kytIds);
};

export const ChangeStatusApprovalService = (data: any) => {
  return ApiService.post(
    `kyt/request/${data?.kytId}/status?status=${data?.status}`,
    data?.note
  );
};
export const KYTEscalateService = ({ payload }: any) => {
  return ApiService.post(
    `kyt/request/${payload?.kytId}/escalate?escalatedTo=${payload?.user}`,
    payload?.note
  );
};

export const getKycRequestByFilter = (data: any) => {
  return ApiService.post(
    `/kyt/requests/filter${stringify(data?.params, {
      addQueryPrefix: true
    })}`,
    data?.filter
  );
};

export const getFilterOwnerService = () => {
  return ApiService.get(`kyt/request/owners`);
};
