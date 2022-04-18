import APIService from "@protego/sdk/core/APIService";
// @ts-ignore
import { stringifyQuery } from "util/stringQuery";

const ApiService = new APIService({
  baseURL: process.env.REACT_APP_BASE_API_URL,
});

//@ts-ignore
export const GET = async (url, params) => {
  const urlWithParams = `${url}${stringifyQuery(params)}`;
  return ApiService.get(urlWithParams);
};
//@ts-ignore
export const PUT = async (url, data) => {
  let body = data || {};
  return ApiService.put(url, body);
};

export default ApiService;
