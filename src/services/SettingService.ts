import { ServiceResponse } from "@protego/sdk/core/AuthService";
import { PageResult } from "@protego/sdk/types";
import { stringify } from "qs";
import ArchiveAdapterCreator from "services/ArchiveAdapterCreator";
import {
  ArchiveService,
  GeneralSettingsDto,
  ResponseEntity,
  ScoringDto,
  ScoringInfoDto,
} from "types/typings";
import { stringifyQuery } from "util/stringQuery";
import ApiService from "./ApiService";


export function SettingScoringService_RequestList(
  params: any
): ServiceResponse<PageResult<ScoringInfoDto>> {
  return ApiService.get(
    `/setting/scoring/all${stringify(params, { addQueryPrefix: true })}`
  );
}

export function SettingScoringService_Search(
  search: string
): ServiceResponse<PageResult<ScoringInfoDto>> {
  return ApiService.get(`/setting/scoring/all?${search}`);
}

export function SettingScoringService_Detail(
  id: string
): ServiceResponse<PageResult<ScoringInfoDto>> {
  return ApiService.get(`/setting/scoring/scoring-detail/${id}`);
}

export function SettingScoringService_Save(
  body: ScoringDto
): ServiceResponse<PageResult<ResponseEntity>> {
  return ApiService.post(`/setting/scoring/update`, body);
}
export function SettingKycDetailService(): ServiceResponse<
  PageResult<ResponseEntity>
> {
  return ApiService.get(`/setting/kyc/fuzzy`);
}

export function SettingKytDetailService(): ServiceResponse<
  PageResult<ResponseEntity>
> {
  return ApiService.get(`/setting/kyt/detail`);
}

export function SettingKycDetailSaveService(body: any) {
  return ApiService.post(`/setting/kyc/fuzzy/save`, body);
}

export function SettingKytDetailSaveService(body: any) {
  return ApiService.post(`/setting/kyt/save`, body);
}
export function SettingKycActivityService(body: any) {
  return ApiService.get(`/audit/${body}`);
}

export const SettingScoringArchiveService: ArchiveService<ScoringInfoDto> = {
  getAll(args: any): ServiceResponse<PageResult<ScoringInfoDto>> {
    return ApiService.get(
      `/setting/scoring/archive${stringify(args, {
        addQueryPrefix: true,
      })}`
    );
  },
  addToArchive(typeId: string[]): ServiceResponse<void> {
    return ApiService.post("/setting/scoring/archive/add", typeId);
  },
  remove(typeId: string[]): ServiceResponse<void> {
    return ApiService.post("/setting/scoring/archive/remove", typeId);
  },
};

export const SettingScoringArchiveAdapter = ArchiveAdapterCreator<ScoringInfoDto>(
  "setting",
  SettingScoringArchiveService
);
export function SettingKybDetailService(): ServiceResponse<
  PageResult<ResponseEntity>
> {
  return ApiService.get(`/setting/kyb/fuzzy`);
}
export function SettingKybDetailSaveService(body: any) {
  return ApiService.post(`/setting/kyb/fuzzy/save`, body);
}

export function GeneralSettingsGetServices() {
  return ApiService.get(`/setting/user-settings`);
}

export function GeneralSettingsSaveServices(
  body: any
): ServiceResponse<GeneralSettingsDto> {
  return ApiService.post(`/setting/user-settings/save`, body);
}
export function getWhitelistService() {
  return ApiService.get(`/setting/whitelist`);
}
export function updateWhitelistService(data) {
  return ApiService.post(`/setting/whitelist/save`, data);
}
export function fetchAllKycBlacklistService(params) {
  return ApiService.get(
    `/kyc-blacklist/all${stringify(params, { addQueryPrefix: true })}`
  );
}
export function fetchAllKybBlacklistService(params) {
  return ApiService.get(
    `/kyb-blacklist/all${stringify(params, { addQueryPrefix: true })}`
  );
}

export function fetchAllKytBlacklistService(params) {
  return ApiService.get(
    `/kyt-blacklist/all${stringify(params, { addQueryPrefix: true })}`
  );
}

export function fetchAllKycCategoryService(params) {
  return ApiService.get(`/category-blacklist/kyc`);
}
export function fetchKycBlackListFilterService(params) {
  return ApiService.post(
    `/kyc-blacklist/filter${stringify(params?.params, {
      addQueryPrefix: true,
    })}`,
    params?.filter
  );
}

export function addNewBlackListService(params) {
  return ApiService.post(`/kyc-blacklist/create`, params);
}

export function removeBlackListService(params) {
  return ApiService.post(`/kyc-blacklist/delete`, params);
}
export function changeStatusBlackListService(params) {
  return ApiService.post(
    `kyc-blacklist/change-status?status=${params?.status}`,
    params?.blacklistIds
  );
}
export function updateCategoryBlackListService(params) {
  return ApiService.post(
    `kyc-blacklist/update/${params?.blacklistId}`,
    params?.body
  );
}

export function addNewCategoryService(params) {
  return ApiService.post(`category-blacklist/kyc/add`, params);
}

export function getAllACLService(params) {
  return ApiService.get(
    `/user-roles/all${stringify(params, { addQueryPrefix: true })}`
  );
}

export function getACLService(id: string | number) {
  return ApiService.get(`/user-roles/${id}`);
}

export function updateACL(data) {
  return ApiService.post(`/user-roles/update`, data);
}


/**
 * Setting Dow Jones KYC
 */
export function SettingDjKycDetailService(): ServiceResponse<
  PageResult<ResponseEntity>
> {
  return ApiService.get(`/setting/djkyc/search-type`);
}

export function SettingDjKycDetailSaveService(params) {
  return ApiService.post(`/setting/djkyc/search-type/save`, params);
}
export function deleteDepartmentService({ id, transferId }) {
  return ApiService.delete(`/department/delete/${id}/${transferId}`);
}
export const getDepartmentAllService = () => {
  return ApiService.get(`/department/all`);
};
export const getDepartmentService = ({ params }) => {
  return ApiService.get(`/department/${stringifyQuery(params)}`);
};
export const updateDepartmentService = ({ body, id }) => {
  return ApiService.put(`/department/update/${id}`, body);
};
export const addDepartmentService = (body) => {
  return ApiService.post(`/department/save`, body);
};
export const getDepartmentListByUserIdService = (id) => {
  return ApiService.get(`/department/department-accesses/${id}`);
};
export const checkValidateDepartmentNameService = (value) => {
  return ApiService.get(`/department/check-duplicate-by-name?name=${value}`);
};

/**
 * Setting Dow Jones KYC
 */
export const SettingDJScoringArchiveService = {
  getAll(args: any): ServiceResponse<PageResult<ScoringInfoDto>> {
    return ApiService.get(
      `/setting/scoring/archive/dj${stringify(args, {
        addQueryPrefix: true,
      })}`
    );
  },
  addToArchive(typeId: string[]): ServiceResponse<void> {
    return ApiService.post("/setting/scoring/archive/add", typeId);
  },
  remove(typeId: string[]): ServiceResponse<void> {
    return ApiService.post("/setting/scoring/archive/remove", typeId);
  },
};

 export function SettingDjScoringService_Detail(
  id: string
): ServiceResponse<PageResult<ScoringInfoDto>> {
  return ApiService.get(`/setting/scoring/scoring-detail/dj/${id}`);
}

export function SettingDJScoringService_Save(
  body: ScoringDto
): ServiceResponse<PageResult<ResponseEntity>> {
  return ApiService.post(`/setting/scoring/update/dj`, body);
}
export const SettingDJScoringArchiveAdapter = ArchiveAdapterCreator<ScoringInfoDto>(
  "djsetting",
  SettingDJScoringArchiveService
);


export function SettingDJScoringService_RequestList(
  params: any
): ServiceResponse<PageResult<ScoringInfoDto>> {
  return ApiService.get(
    `/setting/scoring/all/dj${stringify(params, { addQueryPrefix: true })}`
  );
}