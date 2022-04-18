import ApiService from "./ApiService";
import { stringifyQuery } from "util/stringQuery";

export const getAllListStaffService = (staff) => {
  return ApiService.get(`/user/all`);
};
export const getListStaffService = (staff) => {
  return ApiService.get(`/user/${stringifyQuery(staff)}`);
};
export const addStaffService = (staff) => {
  return ApiService.post(`/user/save/`, staff);
};
export const staffDetailService = (staffID) => {
  return ApiService.get(`/user/get/${staffID}`);
};

export const editStaffService = (staff) => {
  return ApiService.put(`/user/update/${staff.id}`, staff);
};
export const deleteStaffService = ({ userCurrentDelete, reassignCurrent }) => {
  return ApiService.delete(
    `/user/delete/${userCurrentDelete}?assigneeId=${reassignCurrent}`
  );
};

export const setStaffLockedService = (staff) => {
  return ApiService.post(`/user/active/${staff.id}/?active=${staff.locked}`);
};

export const sortStaffTable = (staff) => {
  return ApiService.post(`/user/${stringifyQuery(staff)}`);
};

export const searchStaffService = (staff) => {
  return ApiService.get(`/user/${stringifyQuery(staff)}`);
};
export const staffResendActivationService = (staff) => {
  return ApiService.post(`/user/resend-activation/${staff}`);
};
export const getAllListStaffActiveService = () => {
  return ApiService.get(`/user/get-activated-users`);
};

export const getListAdminService = (params) => {
  return ApiService.get(`/user/get-admin-users/${params}`);
};
/**
 * Get available assign
 */
export const getAvailableAssignService = (payload) => {
  return ApiService.get(`/user/get-available-assignees/${payload}`);
};
