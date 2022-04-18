import {
  takeLatest,
  call,
  put,
  takeEvery,
  select,
  takeLeading,
} from "@redux-saga/core/effects";
import { combineRootSagas } from "@protego/sdk/sagas/utils";
import {
  KYTNoteAdapter,
  KYTService_GetAssets,
  KYTService_RequestItem,
  KYTService_RequestItemTransactions,
  KYTService_RequestItem_FetchTransactions,
  KYTService_RequestList,
  KYTService_RequestUserInput,
  KYTService_RequestWatchList,
  KYTService_RequestAddWatchList,
  KYTService_RequestRemoveWatchList,
  KYTService_RequestSearchWatchList,
  KYTService_RequestSearch,
  KYTService_RequestAssign,
  KYTService_PostImportCsvFile,
  KYTArchiveAdapter,
  KYTService_RequestItem_GetRisk,
  KYTService_RequestItem_GetRiskBulk,
  KYTService_RequestImportConfirm,
  KYTService_EditRiskScore,
  getWatchGroup,
  addWatchGroupService,
  changeKYTOrderGroupService,
  createWatchGroupService,
  renameWatchGroupService,
  removeWatchGroupService,
  removeFromWatchGroupService,
  requestSearchGroupList,
  KYTService_ChangeLog,
  KYTService_OnGoingMonitoring,
  KYTService_ViewReScreen,
  KYTBulkAssign,
  ChangeStatusApprovalService,
  KYTEscalateService,
  getKycRequestByFilter,
  getFilterOwnerService,
} from "../services/KYTService";
import {
  KYTAction_GetAssets,
  KYT_ACTION_REQUEST_INPUT,
  KYTAction_RequestItem,
  KYTAction_RequestItemTransactions,
  KYTAction_RequestItem_FetchTransactions,
  KYTAction_RequestItem_GetRisk,
  KYTAction_RequestItem_GetRiskBulk,
  KYT_ACTION_REQUEST_LIST,
  KYT_ACTION_GET_KYT_WATCHLIST,
  KYT_ACTION_ADD_TO_WATCHLIST,
  KYT_ACTION_REMOVE_WATCHLIST,
  KYTAction_SEARCH_WATCHLIST,
  KYT_ACTION_SEARCH,
  KYT_ACTION_ASSIGN_KYC_REQUEST,
  KYT_ACTION_IMPORT_CSV,
  KYT_ACTION_IMPORT_CONFIRM,
  KYT_ACTION_EDIT_RISK_SCORE,
  /**
   * GroupList
   */
  KYT_ACTION_GET_WATCH_GROUP,
  KYT_ACTION_WATCH_GROUP_SEARCH,
  KYT_ACTION_ADD_TO_GROUP,
  KYT_ACTION_CREATE_NEW_GROUP,
  KYT_ACTION_RENAME_GROUP,
  KYT_ACTION_REMOVE_WATCH_GROUP,
  KYT_ACTION_REMOVE_FROM_WATCH_GROUP,
  KYT_CHANGE_LOG,
  KYT_ONGOING_MONITORING,
  KYT_VIEW_RE_SCREEN,
  KYT_UPDATE_CASE,
  KYT_ACTION_BULK_ASSIGN,
  KYT_ACTION_CHANGE_STATUS_APPROVAL,
  KYT_ACTION_ESCALATE,
  KYT_ACTION_GET_KYT_REQUESTS_BY_FILTER,
  KYT_ACTION_GET_FILTER_OWNER,
  KYT_ACTION_CHANGE_ORDER_GROUP,
} from "actions/KYTAction";
import { paginationParams } from "util/sagas";

function* requestList({ payload: { params = {} } = {} }) {
  try {
    const { data } = yield call(KYTService_RequestList, params);
    yield data |> KYT_ACTION_REQUEST_LIST.success |> put;
  } catch (e) {
    console.error(e);
  }
}
function* getAssets() {
  try {
    const { data } = yield call(KYTService_GetAssets);
    yield data |> KYTAction_GetAssets.success |> put;
  } catch (e) {}
}
function* requestInput({ payload }) {
  try {
    const { data } = yield call(KYTService_RequestUserInput, payload);
    yield data |> KYT_ACTION_REQUEST_INPUT.success |> put;
  } catch (error) {
    yield error |> KYT_ACTION_REQUEST_INPUT.error |> put;
  }
}
function* requestItem({ payload: id }) {
  try {
    const { data } = yield call(KYTService_RequestItem, id);
    yield data |> KYTAction_RequestItem.success |> put;
  } catch (error) {}
}
function* requestItemTransactions({ payload: { id, params = {} } }) {
  try {
    const { data } = yield call(KYTService_RequestItemTransactions, id, params);
    yield { id, ...data } |> KYTAction_RequestItemTransactions.success |> put;
  } catch (err) {
    yield put(KYTAction_RequestItemTransactions.error(err));
  }
}
function* requestItemFetchTransactions({ payload: { id, params = {} } }) {
  try {
    const { data } = yield call(
      KYTService_RequestItem_FetchTransactions,
      id,
      params
    );
    yield { id, ...data }
      |> KYTAction_RequestItem_FetchTransactions.success
      |> put;
  } catch (err) {
    yield put(KYTAction_RequestItem_FetchTransactions.error(err));
  }
}

function* KYTSagaRequestList() {
  yield takeLatest(KYT_ACTION_REQUEST_LIST, requestList);
}
function* KYTSagaGetAssets() {
  yield takeEvery(KYTAction_GetAssets, getAssets);
}
function* KYTSagaRequestInput() {
  yield takeLatest(KYT_ACTION_REQUEST_INPUT, requestInput);
}
function* KYTSagaRequestItem() {
  yield takeLatest(KYTAction_RequestItem, requestItem);
}
function* KYTSagaRequestItemTransactions() {
  yield takeLatest(KYTAction_RequestItemTransactions, requestItemTransactions);
}
function* KYTSagaRequestItemFetchTransactions() {
  yield takeLatest(
    KYTAction_RequestItem_FetchTransactions,
    requestItemFetchTransactions
  );
}
function* KYTSagaRequestWatchList() {
  yield takeLatest(KYT_ACTION_GET_KYT_WATCHLIST, getListWatchList);
}
function* getListWatchList({ payload: { params = {} } = {} }) {
  try {
    const { data } = yield call(KYTService_RequestWatchList, params);
    yield data |> KYT_ACTION_GET_KYT_WATCHLIST.success |> put;
  } catch (e) {
    console.error(e);
  }
}
function* KYTSagaAddWatchList() {
  yield takeLatest(KYT_ACTION_ADD_TO_WATCHLIST, addWatchList);
}
function* addWatchList({ payload }) {
  try {
    yield call(KYTService_RequestAddWatchList, payload);
    const pathname = yield select((state) => state.router.location.pathname);
    if (/my-kyt/.test(pathname)) {
      const pagination = yield paginationParams();
      yield put(KYT_ACTION_REQUEST_LIST({ status: "DONE", ...pagination }));
    }
    yield put(KYT_ACTION_ADD_TO_WATCHLIST.success());
  } catch (err) {
    yield { err } |> KYT_ACTION_ADD_TO_WATCHLIST.error |> put;
  }
}

function* KYTSagaRemoveWatchList() {
  yield takeLatest(KYT_ACTION_REMOVE_WATCHLIST, removeWatchList);
}

function* removeWatchList({ payload }) {
  try {
    yield call(KYTService_RequestRemoveWatchList, payload);
    const pathname = yield select((state) => state.router.location.pathname);
    if (/watchList/.test(pathname)) {
      const pagination = yield paginationParams();
      yield put(
        KYT_ACTION_GET_KYT_WATCHLIST({
          params: pagination,
        })
      );
    } else if (/my-kyt/.test(pathname)) {
      const pagination = yield paginationParams();
      yield put(KYT_ACTION_REQUEST_LIST({ params: pagination }));
    }
    yield put(KYT_ACTION_REMOVE_WATCHLIST.success());
  } catch (err) {
    yield { err } |> KYT_ACTION_REMOVE_WATCHLIST.error |> put;
  }
}
function* KYTSagaSearchWatchList() {
  yield takeLatest(KYTAction_SEARCH_WATCHLIST, searchWatchList);
}

function* searchWatchList({ payload: { search, params = {} } }) {
  try {
    const { data } = yield call(
      KYTService_RequestSearchWatchList,
      search,
      params
    );
    yield data |> KYT_ACTION_GET_KYT_WATCHLIST.success |> put;
  } catch (err) {
    yield err |> KYT_ACTION_GET_KYT_WATCHLIST.error |> put;
  }
}

function* KYTSagaSearch() {
  yield takeLatest(KYT_ACTION_SEARCH, searchKYT);
}

function* searchKYT({ payload: { search, params = {} } }) {
  try {
    const { data } = yield call(KYTService_RequestSearch, search, params);
    yield data |> KYT_ACTION_SEARCH.success |> put;
  } catch (err) {
    yield err |> KYT_ACTION_SEARCH.error |> put;
  }
}

function* KYTAssignRequest() {
  yield takeLatest(KYT_ACTION_ASSIGN_KYC_REQUEST, assignKYT);
}

function* assignKYT({ payload }) {
  try {
    yield call(KYTService_RequestAssign, payload.kytId, payload.userId);
    const { data } = yield call(KYTService_RequestItem, payload.kytId);
    /**
     * Update user after assign
     */
    if (data) {
      yield put(
        KYT_ACTION_ASSIGN_KYC_REQUEST.success({
          kytId: payload.kytId,
          user: data.assignee,
        })
      );
    } else {
      yield put(KYT_ACTION_ASSIGN_KYC_REQUEST.error());
    }
  } catch (err) {
    yield put(KYT_ACTION_ASSIGN_KYC_REQUEST.error());
  }
}

function* KYTSagaImportCsv() {
  yield takeLatest(KYT_ACTION_IMPORT_CSV, watchKYTImportCsv);
}

function* watchKYTImportCsv({ payload }) {
  try {
    const response = yield call(KYTService_PostImportCsvFile, payload);
    yield response |> KYT_ACTION_IMPORT_CSV.success |> put;
  } catch (err) {
    console.log(err);
    yield err |> KYT_ACTION_IMPORT_CSV.error |> put;
  }
}

function* requestItemGetRisk({ payload: { id, kytId, txId } }) {
  try {
    const { data } = yield call(KYTService_RequestItem_GetRisk, kytId, { id });
    yield put(
      KYTAction_RequestItem_GetRisk.success({ id, kytId, txId, ...data })
    );
  } catch (err) {
    yield put(KYTAction_RequestItem_GetRisk.error(err));
  }
}

function* KYTSagaGetRisk() {
  yield takeLatest(KYTAction_RequestItem_GetRisk, requestItemGetRisk);
}

function* requestItemGetRiskBulk({ payload: { kytId, ids } }) {
  try {
    const { data } = yield call(KYTService_RequestItem_GetRiskBulk, kytId, ids);
    yield put(
      KYTAction_RequestItem_GetRiskBulk.success({ kytId, changes: data })
    );
  } catch (err) {
    yield put(KYTAction_RequestItem_GetRiskBulk.error(err));
  }
}

function* KYTSagaGetRiskBulk() {
  yield takeLatest(KYTAction_RequestItem_GetRiskBulk, requestItemGetRiskBulk);
}

function* requestImportConfirm({ payload }) {
  try {
    const { data } = yield call(KYTService_RequestImportConfirm, payload);
    yield put(KYT_ACTION_IMPORT_CONFIRM.success(data));
  } catch (e) {
    yield put(KYT_ACTION_IMPORT_CONFIRM.error(e));
  }
}

function* KYTSagaImportConfirm() {
  yield takeLatest(KYT_ACTION_IMPORT_CONFIRM, requestImportConfirm);
}

function* KYTSagaEditRisk() {
  yield takeLeading(KYT_ACTION_EDIT_RISK_SCORE, KYTEditRisk);
}

function* KYTEditRisk({ payload: { kytId, data } }) {
  try {
    const response = yield call(KYTService_EditRiskScore, kytId, data);
    if (response.status !== 200) {
      throw new Error("Error");
    }

    const requestItemResponse = yield call(KYTService_RequestItem, kytId);
    yield put(KYTAction_RequestItem.success(requestItemResponse.data));
    yield put(KYT_ACTION_EDIT_RISK_SCORE.success(response));
  } catch (err) {
    yield put(KYT_ACTION_EDIT_RISK_SCORE.error(err));
  }
}
/**
 * Group list
 */

function* getWatchGroupRequest({ payload }) {
  try {
    const { data } = yield call(getWatchGroup, payload);
    yield put(KYT_ACTION_GET_WATCH_GROUP.success(data));
  } catch (e) {
    yield put(KYT_ACTION_GET_WATCH_GROUP.error(e));
  }
}

function* KYTSagaGetWatchGroup() {
  yield takeLatest(KYT_ACTION_GET_WATCH_GROUP, getWatchGroupRequest);
}

function* searchWatchGroupRequest({ payload: { params = {} } = {} }) {
  try {
    const { data } = yield call(requestSearchGroupList, params);
    yield put(KYT_ACTION_WATCH_GROUP_SEARCH.success(data));
  } catch (e) {
    yield put(KYT_ACTION_WATCH_GROUP_SEARCH.error(e));
  }
}
function* KYTSagaSearchWatchGroup() {
  yield takeLatest(KYT_ACTION_WATCH_GROUP_SEARCH, searchWatchGroupRequest);
}

function* KYTSagaAddWatchGroup() {
  yield takeLatest(KYT_ACTION_ADD_TO_GROUP, addWatchGroup);
}
function* addWatchGroup({ payload: { params } }) {
  try {
    yield call(addWatchGroupService, params);
    /**
     * Get list
     */
    const { data } = yield call(getWatchGroup, params);
    yield put(KYT_ACTION_GET_WATCH_GROUP.success(data));

    yield put(KYT_ACTION_ADD_TO_GROUP.success());
  } catch (err) {
    yield err |> KYT_ACTION_ADD_TO_GROUP.error |> put;
  }
}

/**
 * Change order of element
 */
function* KYTSagaChangeOrderGroup() {
  yield takeLatest(KYT_ACTION_CHANGE_ORDER_GROUP, changeOrderGroup);
}
function* changeOrderGroup({ payload: { params } }) {
  try {
    let data = params.map((item) => {
      return { id: item.id };
    });
    const response = yield call(changeKYTOrderGroupService, data);
    if (response.status === 200) {
      yield put(KYT_ACTION_CHANGE_ORDER_GROUP.success(response?.data));
      return;
    }
  } catch (err) {
    yield err |> KYT_ACTION_CHANGE_ORDER_GROUP.error |> put;
  }
}

/**
 * Create new group
 */

function* createWatchGroup({ payload: { params } }) {
  try {
    const data = yield call(createWatchGroupService, params);
    if (data?.data) {
      yield put(KYT_ACTION_CREATE_NEW_GROUP.success(data?.data));
      return;
    }
  } catch (err) {
    yield err |> KYT_ACTION_CREATE_NEW_GROUP.error |> put;
  }
}
function* KYTSagaCreateWatchGroup() {
  yield takeLatest(KYT_ACTION_CREATE_NEW_GROUP, createWatchGroup);
}
/**
 * Rename group
 */

function* renameWatchGroup({ payload: { params } }) {
  try {
    const result = yield call(renameWatchGroupService, params);
    yield put(KYT_ACTION_RENAME_GROUP.success(result?.data));
    /**
     * Fetch list group
     */
    const { data } = yield call(getWatchGroup, params);
    yield put(KYT_ACTION_GET_WATCH_GROUP.success(data));
  } catch (err) {
    yield err |> KYT_ACTION_RENAME_GROUP.error |> put;
  }
}
function* KYTSagaRenameWatchGroup() {
  yield takeLatest(KYT_ACTION_RENAME_GROUP, renameWatchGroup);
}
/**
 * Remove group
 */

function* removeWatchGroup({ payload: { params } }) {
  try {
    yield call(removeWatchGroupService, params?.watchGroupId);
    yield put(KYT_ACTION_REMOVE_WATCH_GROUP.success());
    const { data } = yield call(getWatchGroup, params);
    if (data?.length === 0) {
      yield put(KYT_ACTION_GET_KYT_WATCHLIST.success([]));
    }
    yield put(KYT_ACTION_GET_WATCH_GROUP.success(data));
  } catch (err) {
    yield err |> KYT_ACTION_REMOVE_WATCH_GROUP.error |> put;
  }
}
function* KYTSagaRemoveWatchGroup() {
  yield takeLatest(KYT_ACTION_REMOVE_WATCH_GROUP, removeWatchGroup);
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
    yield put(KYT_ACTION_GET_WATCH_GROUP.success(data));
    yield put(KYT_ACTION_REMOVE_FROM_WATCH_GROUP.success());
  } catch (err) {
    yield err |> KYT_ACTION_REMOVE_FROM_WATCH_GROUP.error |> put;
  }
}
function* KYTSagaRemoveFromWatchGroup() {
  yield takeLatest(KYT_ACTION_REMOVE_FROM_WATCH_GROUP, removeFromWatchGroup);
}

function* KYTChangeLog({ payload }) {
  try {
    const response = yield call(KYTService_ChangeLog, payload);
    if (response?.status === 200) {
      yield put(KYT_CHANGE_LOG.success(response?.data));
    }
  } catch (err) {
    yield put(KYT_CHANGE_LOG.error(err));
  }
}
function* KYTSagaChangeLog() {
  yield takeLeading(KYT_CHANGE_LOG, KYTChangeLog);
}
/**
 * On Going monitoring
 */

function* KYTOnGoingMonitoring({ payload }) {
  try {
    const response = yield call(KYTService_OnGoingMonitoring, payload);
    if (response.status === 200) {
      yield put(KYT_ONGOING_MONITORING.success(response?.data));
      return;
    }

    yield put(KYT_ONGOING_MONITORING.error());
  } catch (err) {
    if (err.response?.status === 400 && err.response?.data) {
      yield put(KYT_ONGOING_MONITORING.error(err.response?.data));
    } else {
      yield put(KYT_ONGOING_MONITORING.error(err));
    }
  }
}
function* KYTSagaOnGoingMonitoring() {
  yield takeLeading(KYT_ONGOING_MONITORING, KYTOnGoingMonitoring);
}
/**
 * View screen
 */
function* KYTViewReScreen({ payload }) {
  try {
    const response = yield call(KYTService_ViewReScreen, payload);
    if (response?.status === 200) {
      yield put(KYT_VIEW_RE_SCREEN.success(response?.data));
      return;
    }
    yield put(KYT_VIEW_RE_SCREEN.error());
  } catch (err) {
    yield put(KYT_VIEW_RE_SCREEN.error(err));
  }
}
function* KYTSagaViewReScreen() {
  yield takeLeading(KYT_VIEW_RE_SCREEN, KYTViewReScreen);
}
/**
 * Update case
 */
function* KYTUpdateCase({ payload }) {
  try {
    var listFilter = yield select((state) => state.kyt.list);
    const pathname = yield select((state) => state.router.location.pathname);

    if (/watchList/.test(pathname)) {
      listFilter = yield select((state) => state.kyt.watchList);
    }

    if (/archiveList/.test(pathname)) {
      listFilter = yield select((state) => state.kyt.archiveList);
    }

    if (payload === "UPDATECASE") {
      let newList = listFilter?.records?.filter((item) => {
        return (
          item?.enableNewRiskMonitoring || item?.enableNewTransactionMonitoring
        );
      });

      let listUpdateCase = { ...listFilter, records: newList };
      if (/watchList/.test(pathname)) {
        yield listUpdateCase |> KYT_ACTION_GET_KYT_WATCHLIST.success |> put;
        return;
      }
      if (/archiveList/.test(pathname)) {
        /**
         * Update reducer archive
         */
        yield listUpdateCase |> KYT_UPDATE_CASE.success |> put;
        return;
      }
      yield listUpdateCase |> KYT_ACTION_REQUEST_LIST.success |> put;
    } else {
      if (/watchList/.test(pathname)) {
        yield listFilter |> KYT_ACTION_GET_KYT_WATCHLIST.success |> put;
        return;
      }
      if (/archiveList/.test(pathname)) {
        yield listFilter |> KYT_UPDATE_CASE.success |> put;
        return;
      }
      yield listFilter |> KYT_ACTION_REQUEST_LIST.success |> put;
    }
  } catch (err) {
    yield [] |> KYT_ACTION_REQUEST_LIST.success |> put;
  }
}
function* KYTUpdateCaseReScreen() {
  yield takeLeading(KYT_UPDATE_CASE, KYTUpdateCase);
}
function* KYTSagaBulkAssign() {
  yield takeLatest(KYT_ACTION_BULK_ASSIGN, watchKYTBulkAssign);
}

function* watchKYTBulkAssign({ payload }) {
  try {
    const response = yield call(KYTBulkAssign, payload);
    yield response |> KYT_ACTION_BULK_ASSIGN.success |> put;
  } catch (err) {
    yield err |> KYT_ACTION_BULK_ASSIGN.error |> put;
  }
}
/**
 * Escalate
 */
function* KYTSagaEscalate() {
  yield takeLatest(KYT_ACTION_ESCALATE, escalateRequest);
}

function* escalateRequest(payload) {
  try {
    const response = yield call(KYTEscalateService, payload);
    yield response |> KYT_ACTION_ESCALATE.success |> put;
  } catch (err) {
    yield err |> KYT_ACTION_ESCALATE.error |> put;
  }
}

/**
 * Change approval
 */
function* KYTSagaChangeStatusApproval() {
  yield takeLatest(KYT_ACTION_CHANGE_STATUS_APPROVAL, changeStatusApproval);
}

function* changeStatusApproval({ payload: { params } }) {
  try {
    const response = yield call(ChangeStatusApprovalService, params);
    yield response |> KYT_ACTION_CHANGE_STATUS_APPROVAL.success |> put;
  } catch (err) {
    yield err |> KYT_ACTION_CHANGE_STATUS_APPROVAL.error |> put;
  }
}

/**
 *
 */
function* KYTSagaRequestFilter() {
  yield takeLatest(KYT_ACTION_GET_KYT_REQUESTS_BY_FILTER, requestFilter);
}

function* requestFilter({ payload }) {
  try {
    const { data } = yield call(getKycRequestByFilter, payload);
    yield data |> KYT_ACTION_GET_KYT_REQUESTS_BY_FILTER.success |> put;
  } catch (err) {
    yield err |> KYT_ACTION_GET_KYT_REQUESTS_BY_FILTER.error |> put;
  }
}
/**
 * Get all field in filter
 */
function* KYTSagaFilter() {
  yield takeLatest(KYT_ACTION_GET_FILTER_OWNER, getFilter);
}

function* getFilter() {
  try {
    const { data } = yield call(getFilterOwnerService);
    yield data |> KYT_ACTION_GET_FILTER_OWNER.success |> put;
  } catch (err) {
    yield err |> KYT_ACTION_GET_FILTER_OWNER.error |> put;
  }
}

export default function* KYTSaga() {
  yield combineRootSagas(
    KYTSagaRequestList,
    KYTSagaGetAssets,
    KYTSagaRequestInput,
    KYTSagaRequestItem,
    KYTSagaRequestItemTransactions,
    KYTSagaRequestItemFetchTransactions,
    KYTSagaRequestWatchList,
    KYTSagaAddWatchList,
    KYTSagaRemoveWatchList,
    KYTSagaSearchWatchList,
    KYTSagaSearch,
    KYTAssignRequest,
    KYTSagaImportCsv,
    KYTSagaGetRisk,
    KYTSagaGetRiskBulk,
    KYTSagaImportConfirm,
    KYTSagaGetWatchGroup,
    KYTSagaSearchWatchGroup,
    KYTSagaAddWatchGroup,
    KYTSagaChangeOrderGroup,
    KYTSagaCreateWatchGroup,
    KYTSagaRenameWatchGroup,
    KYTSagaRemoveWatchGroup,
    KYTSagaRemoveFromWatchGroup,
    KYTSagaChangeLog,
    KYTSagaOnGoingMonitoring,
    KYTSagaViewReScreen,
    KYTUpdateCaseReScreen,
    KYTSagaBulkAssign,
    KYTSagaChangeStatusApproval,
    KYTSagaEscalate,
    KYTSagaRequestFilter,
    KYTSagaFilter,
    //notes
    KYTNoteAdapter.saga,
    //archive
    KYTArchiveAdapter.saga,
    KYTSagaEditRisk
  );
}
