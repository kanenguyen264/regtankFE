import { combineRootSagas } from "@protego/sdk/sagas/utils";
import CaseService, {
  CaseArchiveAdapter,
  CaseNoteAdapter,
  getWatchGroup,
  addWatchGroupService,
  createWatchGroupService,
  renameWatchGroupService,
  removeWatchGroupService,
  removeFromWatchGroupService,
  requestSearchGroupList
} from "../services/CaseService";
import {
  CASE_ACTION_GET_CASE_BY_CASEID,
  CASE_ACTION_GET_CASES,
  CASE_ACTION_GET_CASES_WATCHLIST,
  CASE_ACTION_ADD_CASES_WATCHLIST,
  CASE_ACTION_REMOVE_CASES_WATCHLIST,
  CASE_ACTION_SEARCH_CASES_WATCHLIST,
  CASE_ACTION_SEARCH,
  CASE_ACTION_GET_LIST_ARCHIVE,
  /**
   * GroupList
   */
  CASE_ACTION_GET_WATCH_GROUP,
  CASE_ACTION_WATCH_GROUP_SEARCH,
  CASE_ACTION_ADD_TO_GROUP,
  CASE_ACTION_CREATE_NEW_GROUP,
  CASE_ACTION_RENAME_GROUP,
  CASE_ACTION_REMOVE_WATCH_GROUP,
  CASE_ACTION_REMOVE_FROM_WATCH_GROUP,
  CASE_ACTION_CHANGE_ORDER_GROUP
} from "../actions/CaseAction";
import { call, put, select, takeLatest } from "@redux-saga/core/effects";
import {
  CASE_ROUTE__INDEX,
  CASE_ROUTE_ARCHIVE_LIST,
  CASE_ROUTE_GROUP_LIST
} from "../app/routes/Case/routes";
import { paginationParams } from "../util/sagas";

const inListPage = (pathname) =>
  [CASE_ROUTE__INDEX, CASE_ROUTE_GROUP_LIST, CASE_ROUTE_ARCHIVE_LIST].indexOf(
    pathname
  ) >= 0;

function* watchGetCases() {
  yield takeLatest(CASE_ACTION_GET_CASES, function* getCases({ payload }) {
    try {
      const { data } = yield call(CaseService.getCases, payload);
      yield data |> CASE_ACTION_GET_CASES.success |> put;
    } catch (e) {
      yield e |> CASE_ACTION_GET_CASES.error |> put;
    }
  });
}

function* watchGetCaseByCaseId() {
  yield takeLatest(
    CASE_ACTION_GET_CASE_BY_CASEID,
    function* getCaseByCaseId({ payload }) {
      try {
        const { data } = yield call(
          CaseService.getCaseByCaseId,
          payload.caseId,
          payload.reference
        );
        yield data |> CASE_ACTION_GET_CASE_BY_CASEID.success |> put;
      } catch (err) {
        yield err |> CASE_ACTION_GET_CASE_BY_CASEID.error |> put;
      }
    }
  );
}

function* watchGetCasesWatchlist() {
  yield takeLatest(
    CASE_ACTION_GET_CASES_WATCHLIST,
    function* getCasesWatchlist({ payload: { params = {} } = {} }) {
      try {
        const { data } = yield call(CaseService.getCasesWatchlist, params);
        yield data |> CASE_ACTION_GET_CASES_WATCHLIST.success |> put;
      } catch (e) {
        yield e |> CASE_ACTION_GET_CASES_WATCHLIST.error |> put;
      }
    }
  );
}
function* watchAddCasesWatchlist() {
  yield takeLatest(
    CASE_ACTION_ADD_CASES_WATCHLIST,
    function* addCasesWatchlist({ payload: { caseId } }) {
      try {
        const { data } = yield call(CaseService.addCasesWatchlist, caseId);
        const pathname = yield select(
          (state) => state.router.location.pathname
        );
        if (inListPage(pathname)) {
          const pagination = yield paginationParams();
          yield put(CASE_ACTION_GET_CASES(pagination));
        } else yield data |> CASE_ACTION_ADD_CASES_WATCHLIST.success |> put;
      } catch (e) {
        yield e |> CASE_ACTION_ADD_CASES_WATCHLIST.error |> put;
      }
    }
  );
  yield takeLatest(
    CASE_ACTION_REMOVE_CASES_WATCHLIST,
    function* removeCasesWatchlist({
      payload: { caseId = null, caseIds = [] }
    }) {
      try {
        const { data } = yield call(
          CaseService.removeCasesWatchlist,
          caseId,
          caseIds
        );
        const pathname = yield select(
          (state) => state.router.location.pathname
        );
        if (inListPage(pathname)) {
          const pagination = yield paginationParams();
          /**
           * Fetch case
           */
          yield put(CASE_ACTION_GET_CASES(pagination));
          /**
           * Fetch watch list
           */
          try {
            const { data } = yield call(
              CaseService.getCasesWatchlist,
              pathname
            );
            yield data |> CASE_ACTION_GET_CASES_WATCHLIST.success |> put;
          } catch (e) {
            yield e |> CASE_ACTION_GET_CASES_WATCHLIST.error |> put;
          }
        } else yield data |> CASE_ACTION_REMOVE_CASES_WATCHLIST.success |> put;
      } catch (e) {
        yield e |> CASE_ACTION_REMOVE_CASES_WATCHLIST.error |> put;
      }
    }
  );
  yield takeLatest(
    [
      CASE_ACTION_ADD_CASES_WATCHLIST.success,
      CASE_ACTION_REMOVE_CASES_WATCHLIST.success
    ],
    function* () {
      const pathname = yield select((state) => state.router.location.pathname);
      if (pathname === CASE_ROUTE__INDEX) {
        yield put(CASE_ACTION_GET_CASES());
      }
    }
  );
}

function* watchSearchCasesWatchlist() {
  yield takeLatest(
    CASE_ACTION_SEARCH_CASES_WATCHLIST,
    function* searchCasesWatchlist({ payload }) {
      try {
        const { data } = yield call(
          CaseService.searchCasesWatchlist,
          payload.search
        );
        yield data |> CASE_ACTION_SEARCH_CASES_WATCHLIST.success |> put;
      } catch (e) {
        yield e |> CASE_ACTION_SEARCH_CASES_WATCHLIST.error |> put;
      }
    }
  );
}

function* watchSearchCases() {
  yield takeLatest(CASE_ACTION_SEARCH, function* searchCases({ payload }) {
    try {
      const { data } = yield call(CaseService.searchCases, payload.search);
      yield data |> CASE_ACTION_SEARCH.success |> put;
    } catch (e) {
      yield e |> CASE_ACTION_SEARCH.error |> put;
    }
  });
}

function* getCaseListArchive() {
  yield takeLatest(
    CASE_ACTION_GET_LIST_ARCHIVE,
    function* getCaseListArchiveSagas({ payload }) {
      try {
        const { data } = yield call(
          CaseService.getCaseListArchiveService,
          payload
        );
        yield data |> CASE_ACTION_GET_LIST_ARCHIVE.success |> put;
      } catch (e) {
        yield e |> CASE_ACTION_GET_LIST_ARCHIVE.error |> put;
      }
    }
  );
}
/**
 *
 * Group list
 */
function* getWatchGroupRequest({ payload }) {
  try {
    const { data } = yield call(getWatchGroup, payload);
    yield put(CASE_ACTION_GET_WATCH_GROUP.success(data));
  } catch (e) {
    yield put(CASE_ACTION_GET_WATCH_GROUP.error(e));
  }
}

function* CaseSagaGetWatchGroup() {
  yield takeLatest(CASE_ACTION_GET_WATCH_GROUP, getWatchGroupRequest);
}

function* searchWatchGroupRequest({ payload: { params = {} } = {} }) {
  try {
    const { data } = yield call(requestSearchGroupList, params);
    yield put(CASE_ACTION_WATCH_GROUP_SEARCH.success(data));
  } catch (e) {
    yield put(CASE_ACTION_WATCH_GROUP_SEARCH.error(e));
  }
}
function* CaseSagaSearchWatchGroup() {
  yield takeLatest(CASE_ACTION_WATCH_GROUP_SEARCH, searchWatchGroupRequest);
}

function* CaseSagaAddWatchGroup() {
  yield takeLatest(CASE_ACTION_ADD_TO_GROUP, addWatchGroup);
}
function* addWatchGroup({ payload: { params } }) {
  try {
    yield call(addWatchGroupService, params);
    /**
     * Get list
     */
    const { data } = yield call(getWatchGroup, params);
    yield put(CASE_ACTION_GET_WATCH_GROUP.success(data));

    yield put(CASE_ACTION_ADD_TO_GROUP.success());
  } catch (err) {
    yield err |> CASE_ACTION_ADD_TO_GROUP.error |> put;
  }
}
/**
 * Change order of element
 */
function* CaseSagaChangeOrderGroup() {
  yield takeLatest(CASE_ACTION_CHANGE_ORDER_GROUP, changeOrderGroup);
}
function* changeOrderGroup({ payload: { params } }) {
  try {
    let data = params.map((item) => {
      return { id: item.id };
    });
    const response = yield call(CaseService.changeCaseOrderGroup, data);
    if (response.status === 200) {
      yield put(CASE_ACTION_CHANGE_ORDER_GROUP.success(response?.data));
      return;
    }
  } catch (err) {
    yield err |> CASE_ACTION_CHANGE_ORDER_GROUP.error |> put;
  }
}
/**
 * Create new group
 */

function* createWatchGroup({ payload: { params } }) {
  try {
    const data = yield call(createWatchGroupService, params);
    if (data?.data) {
      yield put(CASE_ACTION_CREATE_NEW_GROUP.success(data?.data));
      return;
    }
  } catch (err) {
    yield err |> CASE_ACTION_CREATE_NEW_GROUP.error |> put;
  }
}
function* CaseSagaCreateWatchGroup() {
  yield takeLatest(CASE_ACTION_CREATE_NEW_GROUP, createWatchGroup);
}
/**
 * Rename group
 */

function* renameWatchGroup({ payload: { params } }) {
  try {
    const result = yield call(renameWatchGroupService, params);
    yield put(CASE_ACTION_RENAME_GROUP.success(result?.data));
    /**
     * Fetch list group
     */
    const { data } = yield call(getWatchGroup, params);
    yield put(CASE_ACTION_GET_WATCH_GROUP.success(data));
  } catch (err) {
    yield err |> CASE_ACTION_RENAME_GROUP.error |> put;
  }
}
function* CaseSagaRenameWatchGroup() {
  yield takeLatest(CASE_ACTION_RENAME_GROUP, renameWatchGroup);
}
/**
 * Remove group
 */

function* removeWatchGroup({ payload: { params } }) {
  try {
    yield call(removeWatchGroupService, params?.watchGroupId);
    yield put(CASE_ACTION_REMOVE_WATCH_GROUP.success());
    const { data } = yield call(getWatchGroup, params);
    if (data?.length === 0) {
      yield put(CASE_ACTION_SEARCH_CASES_WATCHLIST.success([]));
    }
    yield put(CASE_ACTION_GET_WATCH_GROUP.success(data));
  } catch (err) {
    yield err |> CASE_ACTION_REMOVE_WATCH_GROUP.error |> put;
  }
}
function* CaseSagaRemoveWatchGroup() {
  yield takeLatest(CASE_ACTION_REMOVE_WATCH_GROUP, removeWatchGroup);
}
/**
 * Remove kyc from group list
 */

function* removeFromWatchGroup({ payload: { params } }) {
  try {
    yield call(removeFromWatchGroupService, params);

    /**
     * Get list
     */
    const { data } = yield call(getWatchGroup, params);
    yield put(CASE_ACTION_GET_WATCH_GROUP.success(data));
    yield put(CASE_ACTION_REMOVE_FROM_WATCH_GROUP.success());
  } catch (err) {
    yield err |> CASE_ACTION_REMOVE_FROM_WATCH_GROUP.error |> put;
  }
}
function* CaseSagaRemoveFromWatchGroup() {
  yield takeLatest(CASE_ACTION_REMOVE_FROM_WATCH_GROUP, removeFromWatchGroup);
}

export default function* CaseSaga() {
  yield combineRootSagas(
    watchGetCases,
    watchGetCaseByCaseId,
    watchGetCasesWatchlist,
    watchAddCasesWatchlist,
    watchSearchCasesWatchlist,
    watchSearchCases,
    CaseSagaGetWatchGroup,
    CaseSagaSearchWatchGroup,
    CaseSagaAddWatchGroup,
    CaseSagaCreateWatchGroup,
    CaseSagaRenameWatchGroup,
    CaseSagaRemoveWatchGroup,
    CaseSagaRemoveFromWatchGroup,
    CaseSagaChangeOrderGroup,
    CaseNoteAdapter.saga,
    CaseArchiveAdapter.saga,
    getCaseListArchive
  );
}
