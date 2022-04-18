import { GET } from "./ApiService";
import { stringify } from "qs";

export const fetchAllAuditFromApi = (params) => {
  return GET(`/audit/`, params);
};

export const filterAuditService = (params) => {
  return GET(`/audit/${stringify(params, { addQueryPrefix: true })}`);
};
