import ApiService from "./ApiService";

export const logout = (access_token, refresh_token) => {
  return ApiService.post(`/user/logout`, {
    access_token,
    refresh_token
  });
};
