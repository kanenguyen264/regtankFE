import { call, put, race, select, take } from "@redux-saga/core/effects";
import omitBy from "lodash/omitBy";
import {
  CALLBACK_ARGUMENT,
  ERROR_ACTION,
  WAIT_FOR_ACTION
} from "redux-wait-for-action";
import pick from "lodash/pick";

export function putWait(action) {
  return call(function* () {
    const pureAction = omitBy(action, (_, key) => typeof key === "symbol");
    const callbackArgs = action[CALLBACK_ARGUMENT];
    yield put(pureAction);
    const raceArgs = {
      data: take(action[WAIT_FOR_ACTION])
    };
    if (action[ERROR_ACTION]) raceArgs.error = take(action[ERROR_ACTION]);
    const { data, error } = yield race(raceArgs);
    if (error) console.error(error);
    if (error) throw error;
    else return typeof callbackArgs === "function" ? callbackArgs(data) : data;
  });
}

export const paginationParams = () =>
  call(function* () {
    let query = yield select((state) => state.router.location.query);
    query = Object.assign(
      { page: 0, size: 10, sort: "", search: "" },
      query || {}
    );
    return pick(query, ["page", "size", "sort", "search"]);
  });
