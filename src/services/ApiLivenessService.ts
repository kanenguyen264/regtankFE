import APIService from "@protego/sdk/core/APIService";
// @ts-ignore
import { stringifyQuery } from "util/stringQuery";

const ApiLivenessService = new APIService({
  baseURL: process.env.REACT_APP_BASE_ONBOARDING_API_URL
});

const buildHeaders = () => {
  const auth = JSON.parse(window.localStorage.getItem("persist:auth") || '{}');
  const authUser = JSON.parse(auth.authUser || '{}');
  return {
    headers: {
      Authorization: `Bearer ${authUser.access_token}`,
    }
  }
}

//@ts-ignore
export const GET = async (url, params) => {
  const urlWithParams = `${url}${stringifyQuery(params)}`;
  return ApiLivenessService.get(urlWithParams, buildHeaders());
};
//@ts-ignore
export const POST = async (url, data) => {
  let body = data || {};
  return ApiLivenessService.post(url, body, buildHeaders());
};
//@ts-ignore
export const PUT = async (url, data) => {
  let body = data || {};
  return ApiLivenessService.put(url, body, buildHeaders());
};

export default ApiLivenessService;
