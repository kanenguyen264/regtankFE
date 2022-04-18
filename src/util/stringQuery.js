import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "constants/pagingSetting";
import { parse, stringify } from "query-string";

function parseQuery(str) {
  return str ? parse(str) : {};
}

function stringifyQuery(params, addQueryPrefix = true) {
  const parsed = stringify(params);
  if (parsed) {
    return `${addQueryPrefix ? "?" : ""}${parsed}`;
  }
  return "";
}

function locationWithQuery(location, params) {
  const query = parseQuery(location.search);
  const newQuery = { ...query, ...params };
  return `${location.pathname}${stringifyQuery(newQuery)}`;
}

function locationWithCustomQuery(location, params) {
  return `${location.pathname}${stringifyQuery({ ...params })}`;
}

function parseQueryDefaultContactPage(location, customerId) {
  let query = parseQuery(location.search);
  query = {
    ...query,
    customerId: customerId,
    page: query.page ? query.page : DEFAULT_PAGE,
    size: query.size ? query.size : DEFAULT_PAGE_SIZE,
    sort: query.sort ? query.sort : "name,desc"
  };
  return query;
}

export {
  parseQuery,
  stringifyQuery,
  locationWithQuery,
  locationWithCustomQuery,
  parseQueryDefaultContactPage
};
