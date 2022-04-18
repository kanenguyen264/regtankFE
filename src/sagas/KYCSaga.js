import { combineRootSagas } from "@protego/sdk/sagas/utils";
import { generatePath } from "@protego/sdk/utils/router";
import { call, put, select, takeLatest } from "@redux-saga/core/effects";
import {
  ACTION_ACTIVITY_LOG_MAIN,
  KYC_ACTION_ADD_TO_GROUP,
  KYC_ACTION_ADD_TO_WATCHLIST,
  KYC_ACTION_ASSIGN_KYC_REQUEST,
  KYC_ACTION_BLACKLIST_MATCH_CHANGE_STATUS,
  KYC_ACTION_BLACKLIST_MATCH_DETAIL,
  KYC_ACTION_BULK_ASSIGN,
  KYC_ACTION_BULK_TOGGLE_OM,
  KYC_ACTION_CHANGE_MATCH_STATUS,
  KYC_ACTION_CHANGE_ORDER_GROUP,
  KYC_ACTION_CHANGE_STATUS_RISK_SCORE,
  KYC_ACTION_CREATE_NEW_GROUP,
  KYC_ACTION_EDIT_KYC_SCORING,
  KYC_ACTION_ESCALATE,
  KYC_ACTION_GET_KYC_BLACKLIST_REQUEST,
  KYC_ACTION_GET_KYC_MATCH,
  KYC_ACTION_GET_KYC_MATCH_REQUEST,
  KYC_ACTION_GET_KYC_REQUEST,
  KYC_ACTION_GET_KYC_REQUESTS,
  KYC_ACTION_GET_KYC_REQUESTS_BY_FILTER,
  KYC_ACTION_GET_KYC_SCORING,
  KYC_ACTION_GET_KYC_WATCHLIST,
  KYC_ACTION_GET_MATCHES_FILTER_LIST,
  KYC_ACTION_GET_WATCH_GROUP,
  KYC_ACTION_IMPORT_BLACKLIST_CONFIRM,
  KYC_ACTION_IMPORT_BLACKLIST_CSV,
  KYC_ACTION_IMPORT_CONFIRM,
  KYC_ACTION_IMPORT_CSV,
  KYC_ACTION_INPUT_INDIVIDUAL_BY_USER,
  KYC_ACTION_REMOVE_FROM_WATCH_GROUP,
  KYC_ACTION_REMOVE_WATCHLIST,
  KYC_ACTION_REMOVE_WATCH_GROUP,
  KYC_ACTION_RENAME_GROUP,
  KYC_ACTION_RE_SCREENING_CASE_DETAILS,
  KYC_ACTION_RE_SCREENING_MY_KYC,
  KYC_ACTION_RE_SCREENING_MY_KYC_DETAILS,
  KYC_ACTION_SEARCH,
  KYC_ACTION_SEARCH_WATCHLIST,
  KYC_ACTION_TOGGLE_OM,
  KYC_ACTION_WATCH_GROUP_SEARCH,
} from "actions/KYCAction";
import { push, replace } from "connected-react-router";
import {
  KYC_ROUTE_KYC_SCREEN,
  KYC_ROUTE_KYC_SCREEN_RESULT,
  KYC_ROUTE_KYC_SCREEN_SCORING,
} from "constants/routes";
import { SETTING_SCORING_ACTION_DETAIL } from "../actions";
import KYCService, {
  KYCArchiveAdapter,
  KYCNoteAdapter,
  KYCNoteMatchAdapter,
  KYCNoteScoringAdapter,
} from "../services/KYCService";
import { paginationParams } from "../util/sagas";

export const KYC_ROUTE__INDEX = "/app/kyc/my-kyc";
export const KYC_ROUTE_WATCH_LIST = "/app/kyc/my-kyc/watchlist";
export const KYC_ROUTE_ARCHIVE_LIST = "/app/kyc/my-kyc/archiveList";
export const KYC_ROUTE_DETAIL = "/app/kyc/my-kyc/:kycId";

const inListPage = (pathname) =>
  [KYC_ROUTE__INDEX, KYC_ROUTE_WATCH_LIST, KYC_ROUTE_ARCHIVE_LIST].indexOf(
    pathname
  ) >= 0;

function* watchAssignKycScreeningCaseDetailRequest() {
  yield takeLatest(
    KYC_ACTION_RE_SCREENING_CASE_DETAILS,
    function* assignKycScreeningCaseDetailRequest({ payload }) {
      try {
        const data = yield call(KYCService.re_screeningApi, payload);
        if (data.status === 200) {
          yield payload |> KYC_ACTION_RE_SCREENING_CASE_DETAILS.success |> put;
        }
      } catch (e) {}
    }
  );
}
function* watchAssignKycScreeningMyKycRequest() {
  yield takeLatest(
    KYC_ACTION_RE_SCREENING_MY_KYC,
    function* assignKycScreeningMyKycRequest({ payload }) {
      try {
        const data = yield call(KYCService.re_screeningApi, payload);
        if (data.status === 200) {
          yield payload |> KYC_ACTION_RE_SCREENING_MY_KYC.success |> put;
        }
      } catch (e) {}
    }
  );
}
function* watchAssignKycScreeningMyKycDetailsRequest() {
  yield takeLatest(
    KYC_ACTION_RE_SCREENING_MY_KYC_DETAILS,
    function* assignKycScreeningMyKycDetailsRequest({ payload }) {
      try {
        const data = yield call(KYCService.re_screeningApi, payload);
        if (data.status === 200) {
          yield payload
            |> KYC_ACTION_RE_SCREENING_MY_KYC_DETAILS.success
            |> put;
        }
      } catch (e) {}
    }
  );
}
//KYC_ACTION_RE_SCREENING_MY_KYC
function* watchAssignKycRequest() {
  yield takeLatest(
    KYC_ACTION_ASSIGN_KYC_REQUEST,
    function* assignKycRequest({ payload }) {
      try {
        yield call(KYCService.assignKycRequest, payload.kycId, payload.userId);
        /**
         * Update user after assign
         */
        const { data } = yield call(KYCService.getKycRequest, payload.kycId);
        if (data) {
          yield put(
            KYC_ACTION_ASSIGN_KYC_REQUEST.success({
              kycId: payload.kycId,
              user: data.assignee,
            })
          );
        } else {
          yield put(KYC_ACTION_ASSIGN_KYC_REQUEST.error());
        }
      } catch (e) {
        yield put(KYC_ACTION_ASSIGN_KYC_REQUEST.error(e));
      }
    }
  );
}

function* watchInputIndividualByUser() {
  // handle action
  yield takeLatest(
    KYC_ACTION_INPUT_INDIVIDUAL_BY_USER,
    function* inputIndividualByUser({ payload }) {
      try {
        const response = yield call(KYCService.inputIndividualByUser, payload);
        if (response && response.status === 200) {
          const { data } = response;

          /**
           * Auto generate score if no record match
           */
          const kycData = yield call(KYCService.getKycRequest, data?.kycId);
          yield put(KYC_ACTION_INPUT_INDIVIDUAL_BY_USER.success(data));

          if (
            kycData?.data?.individualMatches?.length === 0 &&
            kycData?.data?.kycBlacklistMatches?.length === 0
          ) {
            yield put(
              push(
                generatePath(KYC_ROUTE_KYC_SCREEN_SCORING, {
                  kycId: data.kycId,
                })
              )
            );
          } else {
            yield put(
              push(
                generatePath(KYC_ROUTE_KYC_SCREEN_RESULT, {
                  kycId: data.kycId,
                })
              )
            );
          }
        } else {
          throw new Error(response);
        }
      } catch (e) {
        yield put(KYC_ACTION_INPUT_INDIVIDUAL_BY_USER.error(e));
      }
    }
  );

  // handle action error - go back to screening page
  yield takeLatest(
    KYC_ACTION_INPUT_INDIVIDUAL_BY_USER.error,
    function* ({ payload }) {
      yield replace(KYC_ROUTE_KYC_SCREEN, { error: payload }) |> put;
    }
  );
}

function* watchGetKycRequest() {
  yield takeLatest(
    KYC_ACTION_GET_KYC_REQUEST,
    function* getKycRequest({ payload }) {
      try {
        const { data } = yield call(KYCService.getKycRequest, payload);
        yield data |> KYC_ACTION_GET_KYC_REQUEST.success |> put;
      } catch (e) {
        yield push(generatePath(KYC_ROUTE_KYC_SCREEN)) |> put;
      }
    }
  );
}

function* watchGetKycMatchRequest() {
  yield takeLatest(
    KYC_ACTION_GET_KYC_MATCH_REQUEST,
    function* getKycMatchRequest({ payload }) {
      try {
        const { data } = yield call(KYCService.getKycMatchRequest, payload);
        yield put(KYC_ACTION_GET_KYC_MATCH_REQUEST.success(data));
      } catch (e) {
        yield put(KYC_ACTION_GET_KYC_MATCH_REQUEST.error(e));
      }
    }
  );
}

function* watchGetKycBlacklistRequest() {
  yield takeLatest(
    KYC_ACTION_GET_KYC_BLACKLIST_REQUEST,
    function* getKycBlacklistRequest({ payload }) {
      try {
        const { data } = yield call(KYCService.getKycBlacklistRequest, payload);
        yield put(KYC_ACTION_GET_KYC_BLACKLIST_REQUEST.success(data));
      } catch (e) {
        yield put(KYC_ACTION_GET_KYC_BLACKLIST_REQUEST.error(e));
      }
    }
  );
}

function* watchChangeMatchStatus() {
  yield takeLatest(
    KYC_ACTION_CHANGE_MATCH_STATUS,
    function* changeMatchStatus({ payload }) {
      let res;
      try {
        if (!Array.isArray(payload.matchId))
          res = yield call(
            KYCService.changeMatchStatus,
            payload.kycId,
            payload.matchId,
            payload.status
          );
        else
          res = yield call(
            KYCService.changeMatchesStatusFalse,
            payload.kycId,
            payload.matchId
          );
        yield {
          kycId: payload.kycId,
          matchId: payload.matchId,
          status: payload.status || "FALSE",
          data: res?.data,
        }
          |> KYC_ACTION_CHANGE_MATCH_STATUS.success
          |> put;
      } catch (e) {
        yield e |> KYC_ACTION_CHANGE_MATCH_STATUS.error |> put;
      }
    }
  );
}

function* watchGetKycMatch() {
  yield takeLatest(
    KYC_ACTION_GET_KYC_MATCH,
    function* getKycMatch({ payload }) {
      try {
        const { data } = yield call(KYCService.getKycMatch, payload);
        yield data |> KYC_ACTION_GET_KYC_MATCH.success |> put;
      } catch (e) {
        yield e |> KYC_ACTION_GET_KYC_MATCH.error |> put;
      }
    }
  );
}

function* watchGetKycRequests() {
  yield takeLatest(KYC_ACTION_GET_KYC_REQUESTS, function* ({ payload }) {
    try {
      const { data } = yield call(KYCService.getKycRequests, payload);
      yield data |> KYC_ACTION_GET_KYC_REQUESTS.success |> put;
    } catch (e) {
      yield e |> KYC_ACTION_GET_KYC_REQUESTS.error |> put;
    }
  });
}

function* KYCSagaRequestWatchList() {
  yield takeLatest(KYC_ACTION_GET_KYC_WATCHLIST, getListWatchList);
}
function* getListWatchList({ payload: { params = {} } = {} }) {
  try {
    const { data } = yield call(KYCService.requestWatchList, params);
    yield data |> KYC_ACTION_GET_KYC_WATCHLIST.success |> put;
  } catch (e) {
    yield e |> KYC_ACTION_GET_KYC_WATCHLIST.error |> put;
  }
}
function* KYCSagaAddWatchList() {
  yield takeLatest(KYC_ACTION_ADD_TO_WATCHLIST, addWatchList);
}
function* addWatchList({ payload: { kycIds } }) {
  try {
    yield call(KYCService.requestAddWatchList, kycIds);
    const pathname = yield select((state) => state.router.location.pathname);
    if (inListPage(pathname)) {
      const pagination = yield paginationParams();
      try {
        /**
         * Fetch kyc and watch list
         */
        yield put(KYC_ACTION_GET_KYC_REQUESTS(pagination));
      } catch (e) {
        yield e |> KYC_ACTION_GET_KYC_REQUESTS.error |> put;
      }
    }
    yield put(KYC_ACTION_ADD_TO_WATCHLIST.success());
  } catch (err) {
    yield err |> KYC_ACTION_ADD_TO_WATCHLIST.error |> put;
  }
}

function* KYCSagaRemoveWatchList() {
  yield takeLatest(KYC_ACTION_REMOVE_WATCHLIST, removeWatchList);
}

function* removeWatchList({ payload: { kycIds } }) {
  try {
    const { data } = yield call(KYCService.RequestRemoveWatchList, kycIds);
    const pathname = yield select((state) => state.router.location.pathname);
    if (inListPage(pathname)) {
      const pagination = yield paginationParams();
      try {
        yield put(KYC_ACTION_GET_KYC_REQUESTS({ params: pagination }));
        yield put(KYC_ACTION_GET_KYC_WATCHLIST({ params: pagination }));
      } catch (e) {
        yield e |> KYC_ACTION_GET_KYC_REQUESTS.error |> put;
      }
    }
    yield data |> KYC_ACTION_REMOVE_WATCHLIST.success |> put;
  } catch (err) {
    yield err |> KYC_ACTION_REMOVE_WATCHLIST.error |> put;
  }
}

function* KYCSagaSearchWatchList() {
  yield takeLatest(KYC_ACTION_SEARCH_WATCHLIST, searchWatchList);
}

function* searchWatchList({ payload: { search, params = {} } }) {
  try {
    const { data } = yield call(
      KYCService.requestSearchWatchList,
      search,
      params
    );
    yield data |> KYC_ACTION_GET_KYC_WATCHLIST.success |> put;
  } catch (err) {
    yield err |> KYC_ACTION_GET_KYC_WATCHLIST.error |> put;
  }
}

function* KYCSagaSearch() {
  yield takeLatest(KYC_ACTION_SEARCH, searchKyc);
}

function* searchKyc({ payload: { search, params = {} } }) {
  try {
    const { data } = yield call(KYCService.requestSearch, search, params);
    yield data |> KYC_ACTION_SEARCH.success |> put;
  } catch (err) {
    yield err |> KYC_ACTION_SEARCH.error |> put;
  }
}

function* watchGetKycScoring() {
  yield takeLatest(
    KYC_ACTION_GET_KYC_SCORING,
    function* getKycScoring({ payload: kycId }) {
      try {
        const { data } = yield call(KYCService.getKycScoring, kycId);
        yield data |> KYC_ACTION_GET_KYC_SCORING.success |> put;
      } catch (e) {
        yield e |> KYC_ACTION_GET_KYC_SCORING.error |> put;
      }
    }
  );
  yield takeLatest(
    KYC_ACTION_GET_KYC_SCORING.success,
    function* fetchScoringSettings({ payload }) {
      if (!payload?.disableReloadRiskSetting) {
        yield put(SETTING_SCORING_ACTION_DETAIL(payload.scoring.scoringId));
      }
    }
  );
}

function* KYCSagaImportCsv() {
  yield takeLatest(KYC_ACTION_IMPORT_CSV, watchKYCImportCsv);
}

function* watchKYCImportCsv({ payload }) {
  try {
    const response = yield call(KYCService.postImportCsvFile, payload);
    yield response |> KYC_ACTION_IMPORT_CSV.success |> put;
  } catch (err) {
    yield err |> KYC_ACTION_IMPORT_CSV.error |> put;
  }
}

function* KYCSagaImportConfirm() {
  yield takeLatest(KYC_ACTION_IMPORT_CONFIRM, watchKYCImportConfirm);
}

function* watchKYCImportConfirm({ payload }) {
  try {
    const { data } = yield call(KYCService.postImportConfirm, payload);
    yield put(KYC_ACTION_IMPORT_CONFIRM.success(data));
  } catch (e) {
    yield put(KYC_ACTION_IMPORT_CONFIRM.error(e));
  }
}

function* KYCSagaEditTotalRiskScore() {
  yield takeLatest(KYC_ACTION_EDIT_KYC_SCORING, watchKYCEditTotalRiskScore);
}

function* watchKYCEditTotalRiskScore({ payload: { kycId, body } }) {
  try {
    const response = yield call(KYCService.editTotalScore, kycId, body);
    if (response.status !== 200) {
      throw new Error("Error");
    }
    const { data } = yield call(KYCService.getKycScoring, kycId);
    yield put(
      KYC_ACTION_GET_KYC_SCORING.success({
        ...data,
        disableReloadRiskSetting: true,
      })
    );
    yield put(KYC_ACTION_EDIT_KYC_SCORING.success(response));
  } catch (err) {
    yield err |> KYC_ACTION_EDIT_KYC_SCORING.error |> put;
  }
}
/**
 * Get watch group
 */

function* getWatchGroupRequest({ payload }) {
  try {
    const { data } = yield call(KYCService.getWatchGroup, payload);
    yield put(KYC_ACTION_GET_WATCH_GROUP.success(data));
  } catch (e) {
    yield put(KYC_ACTION_GET_WATCH_GROUP.error(e));
  }
}

function* KYCSagaGetWatchGroup() {
  yield takeLatest(KYC_ACTION_GET_WATCH_GROUP, getWatchGroupRequest);
}
/**
 * Search kyc group
 */
function* searchWatchGroupRequest({ payload: { params = {} } = {} }) {
  try {
    const { data } = yield call(KYCService.requestSearchGroupList, params);
    yield put(KYC_ACTION_WATCH_GROUP_SEARCH.success(data));
  } catch (e) {
    yield put(KYC_ACTION_WATCH_GROUP_SEARCH.error(e));
  }
}
function* KYCSagaSearchWatchGroup() {
  yield takeLatest(KYC_ACTION_WATCH_GROUP_SEARCH, searchWatchGroupRequest);
}

function* KYCSagaAddWatchGroup() {
  yield takeLatest(KYC_ACTION_ADD_TO_GROUP, addWatchGroup);
}
function* addWatchGroup({ payload: { params } }) {
  try {
    yield call(KYCService.addWatchGroupService, params);
    /**
     * Get list
     */
    const { data } = yield call(KYCService.getWatchGroup, params);
    yield put(KYC_ACTION_GET_WATCH_GROUP.success(data));

    yield put(KYC_ACTION_ADD_TO_GROUP.success());
  } catch (err) {
    yield err |> KYC_ACTION_ADD_TO_GROUP.error |> put;
  }
}
/**
 * Change order of element
 */
function* KYCSagaChangeOrderGroup() {
  yield takeLatest(KYC_ACTION_CHANGE_ORDER_GROUP, changeOrderGroup);
}
function* changeOrderGroup({ payload: { params } }) {
  try {
    let data = params.map((item) => {
      return { id: item.id };
    });
    const response = yield call(KYCService.changeKYCOrderGroup, data);
    if (response.status === 200) {
      yield put(KYC_ACTION_CHANGE_ORDER_GROUP.success(response?.data));
      return;
    }
  } catch (err) {
    yield err |> KYC_ACTION_CHANGE_ORDER_GROUP.error |> put;
  }
}
/**
 * Create new group
 */

function* createWatchGroup({ payload: { params } }) {
  try {
    const data = yield call(KYCService.createWatchGroupService, params);
    if (data?.data) {
      yield put(KYC_ACTION_CREATE_NEW_GROUP.success(data?.data));
      return;
    }
  } catch (err) {
    yield err |> KYC_ACTION_CREATE_NEW_GROUP.error |> put;
  }
}
function* KYCSagaCreateWatchGroup() {
  yield takeLatest(KYC_ACTION_CREATE_NEW_GROUP, createWatchGroup);
}
/**
 * Rename group
 */

function* renameWatchGroup({ payload: { params } }) {
  try {
    const result = yield call(KYCService.renameWatchGroupService, params);
    yield put(KYC_ACTION_RENAME_GROUP.success(result?.data));
    /**
     * Fetch list group
     */
    const { data } = yield call(KYCService.getWatchGroup, params);
    yield put(KYC_ACTION_GET_WATCH_GROUP.success(data));
  } catch (err) {
    yield err |> KYC_ACTION_RENAME_GROUP.error |> put;
  }
}
function* KYCSagaRenameWatchGroup() {
  yield takeLatest(KYC_ACTION_RENAME_GROUP, renameWatchGroup);
}
/**
 * Remove group
 */

function* removeWatchGroup({ payload: { params } }) {
  try {
    yield call(KYCService.removeWatchGroupService, params?.watchGroupId);
    yield put(KYC_ACTION_REMOVE_WATCH_GROUP.success());
    const { data } = yield call(KYCService.getWatchGroup, params);
    if (data?.length === 0) {
      yield put(KYC_ACTION_SEARCH_WATCHLIST.success([]));
    }
    yield put(KYC_ACTION_GET_WATCH_GROUP.success(data));
  } catch (err) {
    yield err |> KYC_ACTION_REMOVE_WATCH_GROUP.error |> put;
  }
}
function* KYCSagaRemoveWatchGroup() {
  yield takeLatest(KYC_ACTION_REMOVE_WATCH_GROUP, removeWatchGroup);
}
/**
 * Remove kyc from group list
 */

function* removeFromWatchGroup({ payload: { params } }) {
  try {
    yield call(KYCService.removeFromWatchGroupService, params);

    /**
     * Get list
     */
    const { data } = yield call(KYCService.getWatchGroup, params);
    yield put(KYC_ACTION_GET_WATCH_GROUP.success(data));
    yield put(KYC_ACTION_REMOVE_FROM_WATCH_GROUP.success());
  } catch (err) {
    yield err |> KYC_ACTION_REMOVE_FROM_WATCH_GROUP.error |> put;
  }
}
function* KYCSagaRemoveFromWatchGroup() {
  yield takeLatest(KYC_ACTION_REMOVE_FROM_WATCH_GROUP, removeFromWatchGroup);
}

function* KYCSagaBulkAssign() {
  yield takeLatest(KYC_ACTION_BULK_ASSIGN, watchKYCBulkAssign);
}

function* watchKYCBulkAssign({ payload }) {
  try {
    const response = yield call(KYCService.KYCBulkAssign, payload);
    yield response |> KYC_ACTION_BULK_ASSIGN.success |> put;
  } catch (err) {
    yield err |> KYC_ACTION_BULK_ASSIGN.error |> put;
  }
}
/**
 * View log
 */
function* KYCSagaViewLogRiskScore() {
  yield takeLatest(ACTION_ACTIVITY_LOG_MAIN, viewLogRiskScore);
}

function* viewLogRiskScore(payload) {
  try {
    const response = yield call(KYCService.KYCActivityLogService, payload);
    yield response |> ACTION_ACTIVITY_LOG_MAIN.success |> put;
  } catch (err) {
    yield err |> ACTION_ACTIVITY_LOG_MAIN.error |> put;
  }
}
/**
 * Escalate
 */
function* KYCSagaEscalate() {
  yield takeLatest(KYC_ACTION_ESCALATE, escalateRequest);
}

function* escalateRequest(payload) {
  try {
    const response = yield call(KYCService.KYCEscalateService, payload);
    yield response |> KYC_ACTION_ESCALATE.success |> put;
  } catch (err) {
    yield err |> KYC_ACTION_ESCALATE.error |> put;
  }
}

/**
 * Change status risk score
 */

function* KYCSagaChangeStatusRiskScore() {
  yield takeLatest(KYC_ACTION_CHANGE_STATUS_RISK_SCORE, changeStatusRiskScore);
}

function* changeStatusRiskScore({ payload: { params } }) {
  try {
    const response = yield call(
      KYCService.KYCChangeStatusRiskScoreService,
      params
    );
    yield response |> KYC_ACTION_CHANGE_STATUS_RISK_SCORE.success |> put;
  } catch (err) {
    yield err |> KYC_ACTION_CHANGE_STATUS_RISK_SCORE.error |> put;
  }
}

function* watchGetKycRequestsByFilter() {
  yield takeLatest(
    KYC_ACTION_GET_KYC_REQUESTS_BY_FILTER,
    function* ({ payload }) {
      try {
        const { data } = yield call(KYCService.getKycRequestsByFilter, payload);
        yield data |> KYC_ACTION_GET_KYC_REQUESTS_BY_FILTER.success |> put;
      } catch (e) {
        yield e |> KYC_ACTION_GET_KYC_REQUESTS_BY_FILTER.error |> put;
      }
    }
  );
}

function* toggleKycOm({ payload: { kycId, enabled } }) {
  try {
    const { data } = yield call(KYCService.postToggleKycOm, kycId, enabled);
    yield put(KYC_ACTION_TOGGLE_OM.success(data));
  } catch (e) {
    yield put(KYC_ACTION_TOGGLE_OM.error(e));
  }
}

function* watchKycToggleOm() {
  yield takeLatest(KYC_ACTION_TOGGLE_OM, toggleKycOm);
}

function* bulkToggleKycOm({ payload: { kycIds, enabled } }) {
  try {
    const { data } = yield call(
      KYCService.postBulkToggleKycOm,
      kycIds,
      enabled
    );
    yield put(KYC_ACTION_BULK_TOGGLE_OM.success(data));
  } catch (e) {
    yield put(KYC_ACTION_BULK_TOGGLE_OM.error(e));
  }
}

function* watchKycBulkToggleOm() {
  yield takeLatest(KYC_ACTION_BULK_TOGGLE_OM, bulkToggleKycOm);
}
/**
 * KYC action blacklist detail
 */
function* getBlackListDetail({ payload: { params } }) {
  try {
    const { data } = yield call(
      KYCService.getBlackListMatchDetailService,
      params
    );
    yield put(KYC_ACTION_BLACKLIST_MATCH_DETAIL.success(data));
  } catch (e) {
    yield put(KYC_ACTION_BLACKLIST_MATCH_DETAIL.error(e));
  }
}

function* KYCSagaGetBlackListDetail() {
  yield takeLatest(KYC_ACTION_BLACKLIST_MATCH_DETAIL, getBlackListDetail);
}
/**
 * Black list match change status
 */

function* blacklistChangeMatchStatus() {
  yield takeLatest(
    KYC_ACTION_BLACKLIST_MATCH_CHANGE_STATUS,
    function* changeMatchStatus({ payload }) {
      let res;
      try {
        if (!Array.isArray(payload.blacklistId))
          res = yield call(
            KYCService.changeBlacklistMatchStatus,
            payload.kycId,
            payload.blacklistId,
            payload.status
          );
        else
          res = yield call(
            KYCService.changeBlacklistMatchesStatusFalse,
            payload.kycId,
            payload.blacklistId
          );
        yield {
          kycId: payload.kycId,
          blacklistId: payload.blacklistId,
          status: payload.status || "FALSE",
          data: res?.data
        }
          |> KYC_ACTION_BLACKLIST_MATCH_CHANGE_STATUS.success
          |> put;
      } catch (e) {
        yield e |> KYC_ACTION_BLACKLIST_MATCH_CHANGE_STATUS.error |> put;
      }
    }
  );
}

/**
 * Blacklist import
 */
function* KYCSagaImportBlacklistCsv() {
  yield takeLatest(KYC_ACTION_IMPORT_BLACKLIST_CSV, watchKYCImportBlacklistCsv);
}

function* watchKYCImportBlacklistCsv({ payload }) {
  try {
    const response = yield call(KYCService.postImportBlacklistCsvFile, payload);
    yield response |> KYC_ACTION_IMPORT_BLACKLIST_CSV.success |> put;
  } catch (err) {
    yield err |> KYC_ACTION_IMPORT_BLACKLIST_CSV.error |> put;
  }
}

function* KYCSagaImportBlacklistConfirm() {
  yield takeLatest(
    KYC_ACTION_IMPORT_BLACKLIST_CONFIRM,
    watchKYCImportBlacklistConfirm
  );
}

function* watchKYCImportBlacklistConfirm({ payload }) {
  try {
    const { data } = yield call(KYCService.postImportConfirmBlacklist, payload);
    yield put(KYC_ACTION_IMPORT_BLACKLIST_CONFIRM.success(data));
  } catch (e) {
    yield put(KYC_ACTION_IMPORT_BLACKLIST_CONFIRM.error(e));
  }
}

function* watchGetKycMatchesFilterList() {
  yield takeLatest(KYC_ACTION_GET_MATCHES_FILTER_LIST, function* ({ payload }) {
    try {
      const { data } = yield call(
        KYCService.getKycMatchesFilterList,
        payload.kycId
      );
      yield put(KYC_ACTION_GET_MATCHES_FILTER_LIST.success(data));
    } catch (e) {
      yield put(KYC_ACTION_GET_MATCHES_FILTER_LIST.error(e));
    }
  });
}

export default function* KYCSaga() {
  yield combineRootSagas(
    watchAssignKycRequest,
    watchInputIndividualByUser,
    watchGetKycRequest,
    watchChangeMatchStatus,
    watchGetKycMatch,
    watchGetKycRequests,
    KYCSagaRequestWatchList,
    KYCSagaAddWatchList,
    KYCSagaRemoveWatchList,
    KYCSagaSearchWatchList,
    KYCSagaSearch,
    watchGetKycScoring,
    watchAssignKycScreeningCaseDetailRequest,
    watchAssignKycScreeningMyKycRequest,
    watchAssignKycScreeningMyKycDetailsRequest,
    KYCSagaImportCsv,
    KYCSagaImportConfirm,
    KYCSagaEditTotalRiskScore,
    KYCSagaGetWatchGroup,
    KYCSagaSearchWatchGroup,
    KYCSagaAddWatchGroup,
    KYCSagaCreateWatchGroup,
    KYCSagaRenameWatchGroup,
    KYCSagaRemoveWatchGroup,
    KYCSagaRemoveFromWatchGroup,
    KYCSagaBulkAssign,
    KYCSagaChangeStatusRiskScore,
    KYCSagaViewLogRiskScore,
    KYCSagaEscalate,
    watchGetKycRequestsByFilter,
    watchKycToggleOm,
    watchKycBulkToggleOm,
    KYCSagaChangeOrderGroup,
    KYCSagaGetBlackListDetail,
    blacklistChangeMatchStatus,
    KYCSagaImportBlacklistConfirm,
    KYCSagaImportBlacklistCsv,
    watchGetKycMatchRequest,
    watchGetKycBlacklistRequest,
    watchGetKycMatchesFilterList,
    KYCNoteAdapter.saga,
    KYCNoteMatchAdapter.saga,
    KYCNoteScoringAdapter.saga,
    KYCArchiveAdapter.saga
  );
}
