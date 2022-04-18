import { combineRootSagas } from "@protego/sdk/sagas/utils";
import { generatePath } from "@protego/sdk/utils/router";
import { call, put, select, takeLatest } from "@redux-saga/core/effects";
import {
  KYB_ACTION_ADD_TO_WATCHLIST,
  KYB_ACTION_ASSIGN_KYB_REQUEST,
  KYB_ACTION_CHANGE_MATCH_STATUS,
  KYB_ACTION_GET_KYB_MATCH,
  KYB_ACTION_GET_KYB_REQUEST,
  KYB_ACTION_GET_KYB_REQUESTS,
  KYB_ACTION_GET_KYB_WATCHLIST,
  KYB_ACTION_INPUT_BUSINESS,
  KYB_ACTION_REMOVE_WATCHLIST,
  KYB_ACTION_RE_SCREENING_MY_KYB,
  KYB_ACTION_RE_SCREENING_MY_KYB_DETAILS,
  KYB_ACTION_RISK_ASSESSMENT_DETAILS,
  KYB_ACTION_SWITCH_RE_SCREENING,
  KYB_CHANGE_RISK_LEVEL_ASSESSMENT,
  KYB_RISK_ASSESSMENT_GENERATE,
  KYB_RISK_ASSESSMENT_NOTE,
  KYB_SAVE_RISK_ASSESSMENT,
  KYB_UPDATE_BUSINESS_INFORMATION,
  /**
   * GroupList
   */
  KYB_ACTION_GET_WATCH_GROUP,
  KYB_ACTION_WATCH_GROUP_SEARCH,
  KYB_ACTION_ADD_TO_GROUP,
  KYB_ACTION_CREATE_NEW_GROUP,
  KYB_ACTION_RENAME_GROUP,
  KYB_ACTION_REMOVE_WATCH_GROUP,
  KYB_ACTION_REMOVE_FROM_WATCH_GROUP,
  KYB_ACTION_IMPORT_CSV,
  KYB_ACTION_IMPORT_CONFIRM,
  KYB_ACTION_BULK_ASSIGN,
  KYB_ACTION_ESCALATE,
  KYB_ACTION_GET_KYB_REQUESTS_BY_FILTER,
  KYB_ACTION_BULK_TOGGLE_OM,
  KYB_ACTION_TOGGLE_OM,
  KYB_ACTION_GET_KYB_MATCH_REQUEST,
  KYB_ACTION_GET_MATCHES_FILTER_LIST,
} from "actions/KYBAction";
import { push, replace } from "connected-react-router";
import {
  KYB_ROUTE_KYB_SCREEN,
  KYB_ROUTE_KYB_SCREEN_RESULT,
} from "constants/routes";
import {
  addBusinessFromApi,
  assignKybRequest,
  changeMatchesStatusFalse,
  changeMatchStatus,
  changeRiskLevelAssessmentService,
  fetchKybRiskAssessmentDetailService,
  generateRiskAssessment,
  getKybList,
  getKybMatch,
  getKybRequest,
  getKybWatchList,
  KYBNoteAdapter,
  KYBNoteMatchAdapter,
  kybRiskAssessmentNoteService,
  KYBRiskNoteAdapter,
  kybSaveRiskAssessment,
  requestAddWatchList,
  requestRemoveWatchList,
  re_screeningApi,
  toggleRiskAssessmentService,
  updateBusinessInformationService,
  getWatchGroup,
  addWatchGroupService,
  createWatchGroupService,
  renameWatchGroupService,
  removeWatchGroupService,
  removeFromWatchGroupService,
  requestSearchGroupList,
  addBulkToggleKybOm,
  getKYBMatchRequest,
  getKYBMatchesFilterList,
} from "services/KYBService";
import { KYB_ACTION_CHANGE_STATUS_RISK_ASSESSMENT } from "../actions";
import {
  KYBArchiveAdapter,
  postImportCsvKYBFile,
  postImportKYBConfirm,
  KYBBulkAssign,
  KYBChangeStatusRiskScoreService,
  KYBEscalateService,
  getKyBRequestByFilter,
  addToggleKybOm,
} from "../services/KYBService";
import { paginationParams } from "../util/sagas";

export const KYC_ROUTE__INDEX = "/app/kyb/my-kyb";
export const KYC_ROUTE_WATCH_LIST = "/app/kyb/my-kyb/groupList";
export const KYC_ROUTE_ARCHIVE_LIST = "/app/kyb/my-kyb/archiveList";
export const KYC_ROUTE_DETAIL = "/app/kyb/my-kyb/:kybId";

const inListPage = (pathname) =>
  [KYC_ROUTE__INDEX, KYC_ROUTE_WATCH_LIST, KYC_ROUTE_ARCHIVE_LIST].indexOf(
    pathname
  ) >= 0;

export function* watchBusinessForm() {
  // yield takeLatest(FETCH_BUSINESS_FORM, addBusinessForm);
}

/**
 * My Kyb
 */

function* fetchKybList({ payload }) {
  try {
    const { data } = yield call(getKybList, payload);
    yield data |> KYB_ACTION_GET_KYB_REQUESTS.success |> put;
  } catch (e) {
    console.error(e);
  }
}

function* KYBSagaRequestList() {
  yield takeLatest(KYB_ACTION_GET_KYB_REQUESTS, fetchKybList);
}

/**
 * Watch list
 */

function* fetchKybWatchList({ payload: { params } }) {
  try {
    const { data } = yield call(getKybWatchList, params);
    yield data |> KYB_ACTION_GET_KYB_WATCHLIST.success |> put;
  } catch (e) {
    yield KYB_ACTION_GET_KYB_WATCHLIST.error |> put;
  }
}

function* KYBSagaRequestWatchList() {
  yield takeLatest(KYB_ACTION_GET_KYB_WATCHLIST, fetchKybWatchList);
}
/**
 * Add to watchlist
 */

function* addWatchList({ payload: { kybIds } }) {
  try {
    yield call(requestAddWatchList, kybIds);
    const pathname = yield select((state) => state.router.location.pathname);

    if (inListPage(pathname)) {
      const pagination = yield paginationParams();
      try {
        /**
         * Fetch kyc and watch list
         */
        yield put(KYB_ACTION_GET_KYB_REQUESTS(pagination));
      } catch (e) {
        yield e |> KYB_ACTION_ADD_TO_WATCHLIST.error |> put;
      }
    }
    yield put(KYB_ACTION_ADD_TO_WATCHLIST.success());
  } catch (err) {
    yield err |> KYB_ACTION_ADD_TO_WATCHLIST.error |> put;
  }
}

function* KYBSagaAddToWatchList() {
  yield takeLatest(KYB_ACTION_ADD_TO_WATCHLIST, addWatchList);
}
/**
 * KYB Remove Watchlist
 */

function* removeWatchList({ payload: { kybIds } }) {
  try {
    const { data } = yield call(requestRemoveWatchList, kybIds);
    const pathname = yield select((state) => state.router.location.pathname);
    if (inListPage(pathname)) {
      const pagination = yield paginationParams();
      try {
        yield put(KYB_ACTION_GET_KYB_REQUESTS({ params: pagination }));
        yield put(KYB_ACTION_GET_KYB_WATCHLIST({ params: pagination }));
      } catch (e) {
        yield e |> KYB_ACTION_GET_KYB_REQUESTS.error |> put;
      }
    }
    yield data |> KYB_ACTION_REMOVE_WATCHLIST.success |> put;
  } catch (err) {
    yield err |> KYB_ACTION_REMOVE_WATCHLIST.error |> put;
  }
}
function* KYBSagaRemoveWatchList() {
  yield takeLatest(KYB_ACTION_REMOVE_WATCHLIST, removeWatchList);
}

function* watchInputBusiness() {
  // handle action
  yield takeLatest(
    KYB_ACTION_INPUT_BUSINESS,
    function* addBusinessFrom({ payload }) {
      try {
        const { data } = yield call(addBusinessFromApi, payload);
        yield data |> KYB_ACTION_INPUT_BUSINESS.success |> put;
        yield push(
          generatePath(KYB_ROUTE_KYB_SCREEN_RESULT, {
            kybId: data.kybId,
          })
        ) |> put;
      } catch (e) {
        yield e |> KYB_ACTION_INPUT_BUSINESS.error |> put;
        console.error(e);
      }
    }
  );

  yield takeLatest(KYB_ACTION_INPUT_BUSINESS.error, function* ({ payload }) {
    yield replace(KYB_ROUTE_KYB_SCREEN, { error: payload }) |> put;
  });
}
function* watchGetKybRequest() {
  yield takeLatest(
    KYB_ACTION_GET_KYB_REQUEST,
    function* getKybRequests({ payload }) {
      try {
        const { data } = yield call(getKybRequest, payload);
        yield data |> KYB_ACTION_GET_KYB_REQUEST.success |> put;
      } catch (e) {
        yield e |> KYB_ACTION_GET_KYB_REQUEST.error |> put;
      }
    }
  );
}
/**
 * Fetch risk assessment detail
 */

function* fetchRiskAssessmentDetail({ payload: { kybIds } }) {
  try {
    const { data } = yield call(fetchKybRiskAssessmentDetailService, kybIds);
    yield data |> KYB_ACTION_RISK_ASSESSMENT_DETAILS.success |> put;
  } catch (err) {
    yield err |> KYB_ACTION_RISK_ASSESSMENT_DETAILS.error |> put;
  }
}
function* KYBSagaAssessmentDetail() {
  yield takeLatest(
    KYB_ACTION_RISK_ASSESSMENT_DETAILS,
    fetchRiskAssessmentDetail
  );
}
/**
 * Update business information
 */

function* updateBusiness({ payload }) {
  try {
    const { data } = yield call(
      updateBusinessInformationService,
      payload.kybId,
      payload.body
    );
    yield data |> KYB_UPDATE_BUSINESS_INFORMATION.success |> put;
  } catch (err) {
    yield err |> KYB_UPDATE_BUSINESS_INFORMATION.error |> put;
  }
}
function* KYBSagaUpdateBusinessInformation() {
  yield takeLatest(KYB_UPDATE_BUSINESS_INFORMATION, updateBusiness);
}
/**
 * To switch
 */

function* switchReScreening({ payload: { kybId, status } }) {
  try {
    yield call(toggleRiskAssessmentService, kybId, status);
    yield status |> KYB_ACTION_SWITCH_RE_SCREENING.success |> put;
  } catch (err) {
    yield err |> KYB_ACTION_SWITCH_RE_SCREENING.error |> put;
  }
}
function* KYBSagaSwitchReScreening() {
  yield takeLatest(KYB_ACTION_SWITCH_RE_SCREENING, switchReScreening);
}
/**
 * Change risk level assessment
 */

function* changeRiskLevel({ payload: { kybId, body } }) {
  try {
    const { data } = yield call(changeRiskLevelAssessmentService, kybId, body);
    yield { data, request: body }
      |> KYB_CHANGE_RISK_LEVEL_ASSESSMENT.success
      |> put;
  } catch (err) {
    yield err |> KYB_CHANGE_RISK_LEVEL_ASSESSMENT.error |> put;
  }
}

function* KYBSagaChangeRiskLevel() {
  yield takeLatest(KYB_CHANGE_RISK_LEVEL_ASSESSMENT, changeRiskLevel);
}

function* watchAssignKycRequest() {
  yield takeLatest(
    KYB_ACTION_ASSIGN_KYB_REQUEST,
    function* assignKybRequests({ payload }) {
      try {
        yield call(assignKybRequest, payload.kybId, payload.userId);
        const { data } = yield call(getKybRequest, payload.kybId);
        if (data) {
          yield put(
            KYB_ACTION_ASSIGN_KYB_REQUEST.success({
              kybId: payload.kybId,
              user: data.assignee,
            })
          );
        } else {
          yield put(KYB_ACTION_ASSIGN_KYB_REQUEST.error());
        }
      } catch (e) {
        yield put(KYB_ACTION_ASSIGN_KYB_REQUEST.error(e));
      }
    }
  );
}

function* watchAssignKybScreeningMyKybRequest() {
  yield takeLatest(
    KYB_ACTION_RE_SCREENING_MY_KYB,
    function* assignKycScreeningMyKycRequest({ payload }) {
      try {
        const data = yield call(re_screeningApi, payload);
        if (data.status === 200) {
          yield payload |> KYB_ACTION_RE_SCREENING_MY_KYB.success |> put;
        }
      } catch (e) {}
    }
  );
}

function* watchChangeMatchStatus() {
  yield takeLatest(
    KYB_ACTION_CHANGE_MATCH_STATUS,
    function* functionChangeMatchStatus({ payload }) {
      try {
        let res;
        if (!Array.isArray(payload.matchId)) {
          res = yield call(
            changeMatchStatus,
            payload.kybId,
            payload.matchId,
            payload.status
          );
        } else {
          res = yield call(changeMatchesStatusFalse, payload.kybId, payload.matchId);
        }
        yield {
          kybId: payload.kybId,
          matchId: payload.matchId,
          status: payload.status || "FALSE",
          data: res?.data,
        }
          |> KYB_ACTION_CHANGE_MATCH_STATUS.success
          |> put;
      } catch (e) {
        yield e |> KYB_ACTION_CHANGE_MATCH_STATUS.error |> put;
      }
    }
  );
}
function* watchGetKybMatch() {
  yield takeLatest(
    KYB_ACTION_GET_KYB_MATCH,
    function* getFunKycMatch({ payload }) {
      try {
        const { data } = yield call(getKybMatch, payload);
        yield data |> KYB_ACTION_GET_KYB_MATCH.success |> put;
      } catch (e) {
        yield e |> KYB_ACTION_GET_KYB_MATCH.error |> put;
      }
    }
  );
}
function* watchAssignKybScreeningMyKybDetailsRequest() {
  yield takeLatest(
    KYB_ACTION_RE_SCREENING_MY_KYB_DETAILS,
    function* assignKycScreeningMyKycDetailsRequest({ payload }) {
      try {
        const data = yield call(re_screeningApi, payload);
        if (data.status === 200) {
          yield payload
            |> KYB_ACTION_RE_SCREENING_MY_KYB_DETAILS.success
            |> put;
        }
      } catch (e) {}
    }
  );
}
function* watchRiskAssessmentGenerate() {
  yield takeLatest(
    KYB_RISK_ASSESSMENT_GENERATE,
    function* generateRiskAssessmentFun({ payload }) {
      try {
        const data = yield call(generateRiskAssessment, payload.kybId);
        if (data.status === 200) {
          yield data |> KYB_RISK_ASSESSMENT_GENERATE.success |> put;
        }
      } catch (e) {}
    }
  );
}
function* watchKYBImportCsv({ payload }) {
  try {
    const response = yield call(postImportCsvKYBFile, payload);
    yield response |> KYB_ACTION_IMPORT_CSV.success |> put;
  } catch (err) {
    yield err |> KYB_ACTION_IMPORT_CSV.error |> put;
  }
}

function* watchKYBImportConfirm({ payload }) {
  try {
    const { data } = yield call(postImportKYBConfirm, payload);
    yield put(KYB_ACTION_IMPORT_CONFIRM.success(data));
  } catch (e) {
    yield put(KYB_ACTION_IMPORT_CONFIRM.error(e));
  }
}
function* watchKYBBulkAssign({ payload }) {
  try {
    const response = yield call(KYBBulkAssign, payload);
    yield put(KYB_ACTION_BULK_ASSIGN.success(response));
  } catch (err) {
    yield put(KYB_ACTION_BULK_ASSIGN.error(err));
  }
}
/**
 * Save risk assessment
 */
function* KYBSagaBulkAssign() {
  yield takeLatest(KYB_ACTION_BULK_ASSIGN, watchKYBBulkAssign);
}
function* saveRiskAssessment({ payload }) {
  try {
    const { data } = yield call(kybSaveRiskAssessment, payload);
    yield data |> KYB_SAVE_RISK_ASSESSMENT.success |> put;
  } catch (err) {
    yield err |> KYB_SAVE_RISK_ASSESSMENT.error |> put;
  }
}
function* KYBSagaSaveRiskAssessment() {
  yield takeLatest(KYB_SAVE_RISK_ASSESSMENT, saveRiskAssessment);
}
/**
 * Fetch risk assessment note
 */

function* fetchRiskNote({ payload }) {
  try {
    const { data } = yield call(kybRiskAssessmentNoteService, payload);
    yield data |> KYB_RISK_ASSESSMENT_NOTE.success |> put;
  } catch (err) {
    yield err |> KYB_RISK_ASSESSMENT_NOTE.error |> put;
  }
}
function* KYBSagaRiskAssessmentNote() {
  yield takeLatest(KYB_RISK_ASSESSMENT_NOTE, fetchRiskNote);
}
function* KYBSagaImportConfirm() {
  yield takeLatest(KYB_ACTION_IMPORT_CONFIRM, watchKYBImportConfirm);
}
function* KYBSagaImportCsv() {
  yield takeLatest(KYB_ACTION_IMPORT_CSV, watchKYBImportCsv);
}

/**
 * Group list
 */
/**
 * Get watch group
 */

function* getWatchGroupRequest({ payload }) {
  try {
    const { data } = yield call(getWatchGroup, payload);
    yield put(KYB_ACTION_GET_WATCH_GROUP.success(data));
  } catch (e) {
    yield put(KYB_ACTION_GET_WATCH_GROUP.error(e));
  }
}

function* KYBSagaGetWatchGroup() {
  yield takeLatest(KYB_ACTION_GET_WATCH_GROUP, getWatchGroupRequest);
}
/**
 * Search kyc group
 */
function* searchWatchGroupRequest({ payload: { params = {} } = {} }) {
  try {
    const { data } = yield call(requestSearchGroupList, params);
    yield put(KYB_ACTION_WATCH_GROUP_SEARCH.success(data));
  } catch (e) {
    yield put(KYB_ACTION_WATCH_GROUP_SEARCH.error(e));
  }
}
function* KYBSagaSearchWatchGroup() {
  yield takeLatest(KYB_ACTION_WATCH_GROUP_SEARCH, searchWatchGroupRequest);
}

function* KYBSagaAddWatchGroup() {
  yield takeLatest(KYB_ACTION_ADD_TO_GROUP, addWatchGroup);
}
function* addWatchGroup({ payload: { params } }) {
  try {
    yield call(addWatchGroupService, params);
    /**
     * Get list
     */
    const { data } = yield call(getWatchGroup, params);
    yield put(KYB_ACTION_GET_WATCH_GROUP.success(data));

    yield put(KYB_ACTION_ADD_TO_GROUP.success());
  } catch (err) {
    yield err |> KYB_ACTION_ADD_TO_GROUP.error |> put;
  }
}
/**
 * Create new group
 */

function* createWatchGroup({ payload: { params } }) {
  try {
    const data = yield call(createWatchGroupService, params);
    if (data?.data) {
      yield put(KYB_ACTION_CREATE_NEW_GROUP.success(data?.data));
      return;
    }
  } catch (err) {
    yield err |> KYB_ACTION_CREATE_NEW_GROUP.error |> put;
  }
}
function* KYBSagaCreateWatchGroup() {
  yield takeLatest(KYB_ACTION_CREATE_NEW_GROUP, createWatchGroup);
}
/**
 * Rename group
 */

function* renameWatchGroup({ payload: { params } }) {
  try {
    const result = yield call(renameWatchGroupService, params);
    yield put(KYB_ACTION_RENAME_GROUP.success(result?.data));
    /**
     * Fetch list group
     */
    const { data } = yield call(getWatchGroup, params);
    yield put(KYB_ACTION_GET_WATCH_GROUP.success(data));
  } catch (err) {
    yield err |> KYB_ACTION_RENAME_GROUP.error |> put;
  }
}
function* KYBSagaRenameWatchGroup() {
  yield takeLatest(KYB_ACTION_RENAME_GROUP, renameWatchGroup);
}
/**
 * Remove group
 */

function* removeWatchGroup({ payload: { params } }) {
  try {
    yield call(removeWatchGroupService, params?.watchGroupId);
    yield put(KYB_ACTION_REMOVE_WATCH_GROUP.success());

    const { data } = yield call(getWatchGroup, params);
    if (data?.length === 0) {
      yield put(KYB_ACTION_GET_KYB_WATCHLIST.success([]));
    }
    yield put(KYB_ACTION_GET_WATCH_GROUP.success(data));
  } catch (err) {
    yield err |> KYB_ACTION_REMOVE_WATCH_GROUP.error |> put;
  }
}
function* KYBSagaRemoveWatchGroup() {
  yield takeLatest(KYB_ACTION_REMOVE_WATCH_GROUP, removeWatchGroup);
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
    yield put(KYB_ACTION_GET_WATCH_GROUP.success(data));
    yield put(KYB_ACTION_REMOVE_FROM_WATCH_GROUP.success());
  } catch (err) {
    yield err |> KYB_ACTION_REMOVE_FROM_WATCH_GROUP.error |> put;
  }
}
function* KYBSagaRemoveFromWatchGroup() {
  yield takeLatest(KYB_ACTION_REMOVE_FROM_WATCH_GROUP, removeFromWatchGroup);
}

/**
 * Change status risk score
 */

function* KYBSagaChangeStatusRiskAssessment() {
  yield takeLatest(
    KYB_ACTION_CHANGE_STATUS_RISK_ASSESSMENT,
    changeStatusRiskAssessment
  );
}

function* changeStatusRiskAssessment({ payload: { params } }) {
  try {
    const response = yield call(KYBChangeStatusRiskScoreService, params);
    yield response |> KYB_ACTION_CHANGE_STATUS_RISK_ASSESSMENT.success |> put;
  } catch (err) {
    yield err |> KYB_ACTION_CHANGE_STATUS_RISK_ASSESSMENT.error |> put;
  }
}

/**
 * Escalate
 */
function* KYBSagaEscalate() {
  yield takeLatest(KYB_ACTION_ESCALATE, escalateRequest);
}

function* escalateRequest(payload) {
  try {
    const response = yield call(KYBEscalateService, payload);
    yield response |> KYB_ACTION_ESCALATE.success |> put;
  } catch (err) {
    yield err |> KYB_ACTION_ESCALATE.error |> put;
  }
}
/**
 *  KYB Filter
 */
function* KYBSagaRequestFilter() {
  yield takeLatest(KYB_ACTION_GET_KYB_REQUESTS_BY_FILTER, requestFilter);
}

function* requestFilter({ payload }) {
  try {
    const { data } = yield call(getKyBRequestByFilter, payload);
    yield data |> KYB_ACTION_GET_KYB_REQUESTS_BY_FILTER.success |> put;
  } catch (err) {
    yield err |> KYB_ACTION_GET_KYB_REQUESTS_BY_FILTER.error |> put;
  }
}
/**
 * KYB OM
 */

function* watchKybToggleOm() {
  yield takeLatest(KYB_ACTION_BULK_TOGGLE_OM, bulkToggleKybOm);
}

function* bulkToggleKybOm({ payload: { enabled, kybIds } }) {
  try {
    const { data } = yield call(addBulkToggleKybOm, kybIds, enabled);
    yield put(KYB_ACTION_BULK_TOGGLE_OM.success(data));
  } catch (err) {
    yield put(KYB_ACTION_BULK_TOGGLE_OM.error());
  }
}
/**
 * Kyb OM
 */

function* updateKybToggleOm() {
  yield takeLatest(KYB_ACTION_TOGGLE_OM, toggleKybOm);
}

function* toggleKybOm({ payload: { enabled, kybId } }) {
  try {
    const { data } = yield call(addToggleKybOm, kybId, enabled);
    yield put(KYB_ACTION_TOGGLE_OM.success(data));
  } catch (err) {
    yield put(KYB_ACTION_TOGGLE_OM.error());
  }
}

function* watchGetKybMatchRequest() {
  yield takeLatest(
    KYB_ACTION_GET_KYB_MATCH_REQUEST,
    function* getKycMatchRequest({ payload }) {
      try {
        const { data } = yield call(getKYBMatchRequest, payload);
        yield put(KYB_ACTION_GET_KYB_MATCH_REQUEST.success(data));
      } catch (e) {
        yield put(KYB_ACTION_GET_KYB_MATCH_REQUEST.error(e));
      }
    }
  );
}

function* watchGetKybMatchesFilterList() {
  yield takeLatest(
    KYB_ACTION_GET_MATCHES_FILTER_LIST,
    function* ({ payload }) {
      try {
        const { data } = yield call(getKYBMatchesFilterList, payload.kybId);
        yield put(KYB_ACTION_GET_MATCHES_FILTER_LIST.success(data));
      } catch (e) {
        yield put(KYB_ACTION_GET_MATCHES_FILTER_LIST.error(e));
      }
    }
  );
}

export default function* KYBSaga() {
  yield combineRootSagas(
    watchAssignKybScreeningMyKybDetailsRequest,
    watchBusinessForm,
    KYBSagaRequestList,
    KYBSagaRequestWatchList,
    KYBSagaAddToWatchList,
    KYBSagaRemoveWatchList,
    watchInputBusiness,
    KYBSagaAssessmentDetail,
    KYBSagaUpdateBusinessInformation,
    KYBSagaSwitchReScreening,
    KYBSagaChangeRiskLevel,
    watchGetKybRequest,
    watchAssignKycRequest,
    watchAssignKybScreeningMyKybRequest,
    watchChangeMatchStatus,
    watchGetKybMatch,
    watchRiskAssessmentGenerate,
    KYBSagaSaveRiskAssessment,
    KYBSagaRiskAssessmentNote,
    KYBSagaGetWatchGroup,
    KYBSagaSearchWatchGroup,
    KYBSagaAddWatchGroup,
    KYBSagaCreateWatchGroup,
    KYBSagaRenameWatchGroup,
    KYBSagaRemoveWatchGroup,
    KYBSagaRemoveFromWatchGroup,
    KYBSagaImportCsv,
    KYBSagaImportConfirm,
    KYBSagaBulkAssign,
    KYBSagaChangeStatusRiskAssessment,
    KYBSagaEscalate,
    KYBSagaRequestFilter,
    watchKybToggleOm,
    updateKybToggleOm,
    watchGetKybMatchRequest,
    watchGetKybMatchesFilterList,
    KYBNoteAdapter.saga,
    KYBNoteMatchAdapter.saga,
    KYBRiskNoteAdapter.saga,
    KYBArchiveAdapter.saga
  );
}
