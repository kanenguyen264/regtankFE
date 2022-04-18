import { combineRootSagas } from "@protego/sdk/sagas/utils";
import { generatePath } from "@protego/sdk/utils/router";
import { call, put, takeLatest } from "@redux-saga/core/effects";
import {
  DJ_ACTION_ADD_TO_GROUP,
  DJ_ACTION_ASSIGN_KYC_REQUEST,
  DJ_ACTION_BLACKLIST_MATCH_CHANGE_STATUS,
  DJ_ACTION_BLACKLIST_MATCH_DETAIL,
  DJ_ACTION_BULK_ASSIGN,
  DJ_ACTION_CHANGE_MATCH_STATUS,
  DJ_ACTION_CHANGE_ORDER_GROUP,
  DJ_ACTION_CHANGE_STATUS_RISK_SCORE,
  DJ_ACTION_CREATE_NEW_GROUP,
  DJ_ACTION_EDIT_KYC_SCORING,
  DJ_ACTION_ESCALATE_KYC,
  DJ_ACTION_GET_KYC_INDIVIDUAL_REQUEST,
  DJ_ACTION_GET_KYC_MATCH,
  DJ_ACTION_GET_KYC_REQUEST,
  DJ_ACTION_GET_KYC_REQUESTS,
  DJ_ACTION_GET_KYC_REQUESTS_BY_FILTER,
  DJ_ACTION_GET_KYC_SCORING,
  DJ_ACTION_GET_KYC_WATCHLIST,
  DJ_ACTION_GET_WATCH_GROUP,
  DJ_ACTION_INPUT_INDIVIDUAL_BY_USER,
  DJ_ACTION_KYC_BULK_TOGGLE_OM,
  DJ_ACTION_KYC_TOGGLE_OM,
  DJ_ACTION_REMOVE_FROM_WATCH_GROUP,
  DJ_ACTION_REMOVE_WATCH_GROUP,
  DJ_ACTION_RENAME_GROUP,
  DJ_ACTION_RE_SCREENING_MY_KYC,
  DJ_ACTION_RE_SCREENING_MY_KYC_DETAILS,
  DJ_ACTION_SEARCH_WATCHLIST,
  DJ_ACTION_WATCH_GROUP_SEARCH,
  DJ_KYC_ACTION_GET_KYC_BLACKLIST_REQUEST,
  DJ_KYC_ACTION_GET_KYC_MATCH_REQUEST,
  DJ_KYC_ACTION_GET_MATCHES_FILTER_LIST,
  DJ_KYC_ACTION_IMPORT_CONFIRM,
  DJ_KYC_ACTION_IMPORT_CSV,
} from "actions/DJAction";
import { SETTING_DJ_SCORING_ACTION_DETAIL } from "actions/SettingScoringAction";
import { push } from "connected-react-router";
import {
  DJ_KYC_ROUTE_KYC_SCREEN_RESULT,
  DJ_KYC_ROUTE_KYC_SCREEN_SCORING,
} from "constants/routes";
import {
  addWatchGroupService,
  assignDjKycRequest,
  changeDJBlacklistMatchesStatusFalse,
  changeDJBlacklistMatchStatus,
  changeDJKYCOrderGroup,
  changeDjMatchStatus,
  changeDjMatchStatusFalse,
  changeStatusRiskScoreService,
  createWatchGroupService,
  dJBulkAssignService,
  dJInputIndividualByUserService,
  DJKYCArchiveAdapter,
  DJNoteAdapter,
  DJNoteMatchAdapter,
  DJNoteScoringAdapter,
  editDjKycTotalScore,
  escalateDjKycService,
  getDJBlackListMatchDetailService,
  getDJFilterService,
  getDJIndividualRequest,
  getDjKycBlacklistRequest,
  getDjKycMatchesFilterList,
  getDjKycMatchRequest,
  getDjKycScoring,
  getDJRequests,
  getKycMatchService,
  getKycRequestService,
  getWatchGroup,
  postBulkToggleKycOm,
  postImportConfirm,
  postImportCsvFile,
  postToggleKycOm,
  removeFromWatchGroupService,
  removeWatchGroupService,
  renameWatchGroupService,
  requestSearchGroupList,
  requestWatchList,
  rescreeningService,
} from "services/DJService";

/**
 * Get my kyc
 */
/**
 * Get watch group
 */

function* getWatchGroupRequest({ payload }) {
  try {
    const { data } = yield call(getWatchGroup, payload);
    yield put(DJ_ACTION_GET_WATCH_GROUP.success(data));
  } catch (e) {
    yield put(DJ_ACTION_GET_WATCH_GROUP.error(e));
  }
}

function* dJKYCSagaGetWatchGroup() {
  yield takeLatest(DJ_ACTION_GET_WATCH_GROUP, getWatchGroupRequest);
}
function* DJSagaRequestGetList() {
  yield takeLatest(DJ_ACTION_GET_KYC_REQUEST, function* ({ payload }) {
    try {
      const { data } = yield call(getKycRequestService, payload);
      yield data |> DJ_ACTION_GET_KYC_REQUEST.success |> put;
    } catch (e) {
      yield e |> DJ_ACTION_GET_KYC_REQUEST.error |> put;
    }
  });
}

function* dJKYCSagaAddWatchGroup() {
  yield takeLatest(DJ_ACTION_ADD_TO_GROUP, addWatchGroup);
}
function* addWatchGroup({ payload: { params } }) {
  try {
    yield call(addWatchGroupService, params);
    /**
     * Get list
     */
    const { data } = yield call(getWatchGroup, params);
    yield put(DJ_ACTION_GET_WATCH_GROUP.success(data));

    yield put(DJ_ACTION_ADD_TO_GROUP.success());
  } catch (err) {
    yield put(DJ_ACTION_ADD_TO_GROUP.error(err));
  }
}
/**
 * Bulk assign
 */
function* updateDJBulkAssign() {
  yield takeLatest(DJ_ACTION_BULK_ASSIGN, function* ({ payload }) {
    try {
      const { data } = yield call(
        dJBulkAssignService,
        payload?.userId,
        payload?.kycIds
      );
      yield data |> DJ_ACTION_BULK_ASSIGN.success |> put;
    } catch (e) {
      yield e |> DJ_ACTION_BULK_ASSIGN.error |> put;
    }
  });
}
/**
 * DJ KYC screen
 */
function* dJInputIndividualByUser() {
  yield takeLatest(DJ_ACTION_INPUT_INDIVIDUAL_BY_USER, function* ({ payload }) {
    try {
      const response = yield call(dJInputIndividualByUserService, payload);
      if (response && response.status === 200) {
        const { data } = response;
        /**
         * Auto generate score if no record match
         */
        const kycData = yield call(getDJIndividualRequest, data?.kycId);
        yield put(DJ_ACTION_INPUT_INDIVIDUAL_BY_USER.success(data));

        if (
          kycData?.data?.individualMatches?.length === 0 &&
          kycData?.data?.kycBlacklistMatches?.length === 0
        ) {
          yield put(
            push(
              generatePath(DJ_KYC_ROUTE_KYC_SCREEN_SCORING, {
                kycId: data.kycId,
              })
            )
          );
        } else {
          yield put(
            push(
              generatePath(DJ_KYC_ROUTE_KYC_SCREEN_RESULT, {
                kycId: data.kycId,
              })
            )
          );
        }
      } else {
        throw new Error(response);
      }
    } catch (e) {
      yield put(DJ_ACTION_INPUT_INDIVIDUAL_BY_USER.error(e));
    }
  });
}

function* dJSagaRequestGetIndividualById() {
  yield takeLatest(
    DJ_ACTION_GET_KYC_INDIVIDUAL_REQUEST,
    function* ({ payload }) {
      try {
        const { data } = yield call(getDJIndividualRequest, payload);
        yield data |> DJ_ACTION_GET_KYC_INDIVIDUAL_REQUEST.success |> put;
      } catch (e) {
        yield e |> DJ_ACTION_GET_KYC_INDIVIDUAL_REQUEST.error |> put;
      }
    }
  );
}

function* dJAssignKycRequest() {
  yield takeLatest(
    DJ_ACTION_ASSIGN_KYC_REQUEST,
    function* assignKycRequest({ payload }) {
      try {
        const res = yield call(
          assignDjKycRequest,
          payload.kycId,
          payload.userId
        );
        yield DJ_ACTION_ASSIGN_KYC_REQUEST.success({
          kycId: payload.kycId,
          user: res?.data,
        }) |> put;
      } catch (e) {
        yield e |> DJ_ACTION_ASSIGN_KYC_REQUEST.error |> put;
      }
    }
  );
}

function* dJChangeMatchStatus() {
  yield takeLatest(
    DJ_ACTION_CHANGE_MATCH_STATUS,
    function* changeMatchStatus({ payload }) {
      let res;
      try {
        if (!Array.isArray(payload.matchId))
          res = yield call(
            changeDjMatchStatus,
            payload.kycId,
            payload.matchId,
            payload.status
          );
        else
          res = yield call(
            changeDjMatchStatusFalse,
            payload.kycId,
            payload.matchId
          );
        yield put(
          DJ_ACTION_CHANGE_MATCH_STATUS.success({
            kycId: payload.kycId,
            matchId: payload.matchId,
            status: payload.status || "FALSE",
            data: res?.data,
          })
        );
      } catch (e) {
        yield e |> DJ_ACTION_CHANGE_MATCH_STATUS.error |> put;
      }
    }
  );
}

/**
 * Screening Result
 */
function* djSagaRequestGetKycMatch() {
  yield takeLatest(DJ_ACTION_GET_KYC_MATCH, function* getKycMatch({ payload }) {
    try {
      const { data } = yield call(
        getKycMatchService,
        payload?.kycId,
        payload?.matchId
      );
      yield data |> DJ_ACTION_GET_KYC_MATCH.success |> put;
    } catch (e) {
      yield e |> DJ_ACTION_GET_KYC_MATCH.error |> put;
    }
  });
}

/**
 * DJ myc filter
 */

function* dJSagaRequestFilter() {
  yield takeLatest(
    DJ_ACTION_GET_KYC_REQUESTS_BY_FILTER,
    function* ({ payload }) {
      try {
        const { data } = yield call(
          getDJFilterService,
          payload.params,
          payload.filter
        );
        yield data |> DJ_ACTION_GET_KYC_REQUESTS_BY_FILTER.success |> put;
      } catch (e) {
        yield e |> DJ_ACTION_GET_KYC_REQUESTS_BY_FILTER.error |> put;
      }
    }
  );
}

function* dJSagaGetKycScoring() {
  yield takeLatest(
    DJ_ACTION_GET_KYC_SCORING,
    function* getKycScoring({ payload: kycId }) {
      try {
        const { data } = yield call(getDjKycScoring, kycId);
        yield data |> DJ_ACTION_GET_KYC_SCORING.success |> put;
      } catch (e) {
        yield e |> DJ_ACTION_GET_KYC_SCORING.error |> put;
      }
    }
  );

  yield takeLatest(
    DJ_ACTION_GET_KYC_SCORING.success,
    function* fetchScoringSettings({ payload }) {
      if (!payload?.disableReloadRiskSetting) {
        yield put(SETTING_DJ_SCORING_ACTION_DETAIL(payload.scoring.scoringId));
      }
    }
  );
}

/**
 * Edit KYC Risk Score
 */
function* dJSagaKYCEditTotalRiskScore() {
  yield takeLatest(DJ_ACTION_EDIT_KYC_SCORING, watchDJKYCEditTotalRiskScore);
}

function* watchDJKYCEditTotalRiskScore({ payload: { kycId, body } }) {
  try {
    const response = yield call(editDjKycTotalScore, kycId, body);
    if (response.status !== 200) {
      throw new Error("Error");
    }
    const { data } = yield call(getDjKycScoring, kycId);
    yield put(
      DJ_ACTION_GET_KYC_SCORING.success({
        ...data,
        disableReloadRiskSetting: true,
      })
    );
    yield put(DJ_ACTION_EDIT_KYC_SCORING.success(response));
  } catch (err) {
    yield err |> DJ_ACTION_EDIT_KYC_SCORING.error |> put;
  }
}

/**
 * Edit KYC Risk Score
 */

function* dJSagaEscalate() {
  yield takeLatest(DJ_ACTION_ESCALATE_KYC, function* escalateRequest(payload) {
    try {
      const response = yield call(escalateDjKycService, payload);
      yield put(DJ_ACTION_ESCALATE_KYC.success(response));
    } catch (err) {
      yield put(DJ_ACTION_ESCALATE_KYC.error(err));
    }
  });
}

function* dJSagaChangeStatusRiskScore() {
  yield takeLatest(
    DJ_ACTION_CHANGE_STATUS_RISK_SCORE,
    function* changeStatusRiskScore({ payload: { params } }) {
      try {
        const response = yield call(changeStatusRiskScoreService, params);
        yield put(DJ_ACTION_CHANGE_STATUS_RISK_SCORE.success(response));
      } catch (err) {
        yield put(DJ_ACTION_CHANGE_STATUS_RISK_SCORE.error(err));
      }
    }
  );
}
/**
 * Create new group
 */

function* createWatchGroup({ payload: { params } }) {
  try {
    const data = yield call(createWatchGroupService, params);
    if (data?.data) {
      yield put(DJ_ACTION_CREATE_NEW_GROUP.success(data?.data));
      return;
    }
  } catch (err) {
    yield put(DJ_ACTION_CREATE_NEW_GROUP.error(err));
  }
}
function* dJKYCSagaCreateWatchGroup() {
  yield takeLatest(DJ_ACTION_CREATE_NEW_GROUP, createWatchGroup);
}
function* dJKYCSagaRequestWatchList() {
  yield takeLatest(DJ_ACTION_GET_KYC_WATCHLIST, getListWatchList);
}
function* getListWatchList({ payload: { params = {} } = {} }) {
  try {
    const { data } = yield call(requestWatchList, params);
    yield put(DJ_ACTION_GET_KYC_WATCHLIST.success(data));
  } catch (e) {
    yield put(DJ_ACTION_GET_KYC_WATCHLIST.error(e));
  }
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
    yield put(DJ_ACTION_GET_WATCH_GROUP.success(data));
    yield put(DJ_ACTION_REMOVE_FROM_WATCH_GROUP.success());
  } catch (err) {
    yield put(DJ_ACTION_REMOVE_FROM_WATCH_GROUP.error(err));
  }
}
function* dJKYCSagaRemoveFromWatchGroup() {
  yield takeLatest(DJ_ACTION_REMOVE_FROM_WATCH_GROUP, removeFromWatchGroup);
}
function* removeWatchGroup({ payload: { params } }) {
  try {
    yield call(removeWatchGroupService, params?.watchGroupId);
    yield put(DJ_ACTION_REMOVE_WATCH_GROUP.success());
    const { data } = yield call(getWatchGroup, params);
    if (data?.length === 0) {
      yield put(DJ_ACTION_SEARCH_WATCHLIST.success([]));
    }
    yield put(DJ_ACTION_GET_WATCH_GROUP.success(data));
  } catch (err) {
    yield put(DJ_ACTION_REMOVE_WATCH_GROUP.error(err));
  }
}
function* dJKYCSagaRemoveWatchGroup() {
  yield takeLatest(DJ_ACTION_REMOVE_WATCH_GROUP, removeWatchGroup);
}
/**
 * Rename group
 */

function* renameWatchGroup({ payload: { params } }) {
  try {
    const result = yield call(renameWatchGroupService, params);
    yield put(DJ_ACTION_RENAME_GROUP.success(result?.data));
    /**
     * Fetch list group
     */
    const { data } = yield call(getWatchGroup, params);
    yield put(DJ_ACTION_GET_WATCH_GROUP.success(data));
  } catch (err) {
    yield put(DJ_ACTION_RENAME_GROUP.error(err));
  }
}
function* dJKYCSagaRenameWatchGroup() {
  yield takeLatest(DJ_ACTION_RENAME_GROUP, renameWatchGroup);
}
/**
 * Change order of element
 */
function* dJKYCSagaChangeOrderGroup() {
  yield takeLatest(DJ_ACTION_CHANGE_ORDER_GROUP, changeOrderGroup);
}
function* changeOrderGroup({ payload: { params } }) {
  try {
    let data = params.map((item) => {
      return { id: item.id };
    });
    const response = yield call(changeDJKYCOrderGroup, data);
    if (response.status === 200) {
      yield put(DJ_ACTION_CHANGE_ORDER_GROUP.success(response?.data));
      return;
    }
  } catch (err) {
    yield put(DJ_ACTION_CHANGE_ORDER_GROUP.error(err));
  }
}
/**
 * Search kyc group
 */
function* searchWatchGroupRequest({ payload: { params = {} } = {} }) {
  try {
    const { data } = yield call(requestSearchGroupList, params);
    yield put(DJ_ACTION_WATCH_GROUP_SEARCH.success(data));
  } catch (e) {
    yield put(DJ_ACTION_WATCH_GROUP_SEARCH.error(e));
  }
}
function* dJKYCSagaSearchWatchGroup() {
  yield takeLatest(DJ_ACTION_WATCH_GROUP_SEARCH, searchWatchGroupRequest);
}

function* watchGetDJRequests() {
  yield takeLatest(DJ_ACTION_GET_KYC_REQUESTS, function* ({ payload }) {
    try {
      const { data } = yield call(getDJRequests, payload);
      yield put(DJ_ACTION_GET_KYC_REQUESTS.success(data));
    } catch (e) {
      yield put(DJ_ACTION_GET_KYC_REQUESTS.error(e));
    }
  });
}

/**
 * Toogle OM
 */
function* djSagaKYCToggleOM() {
  yield takeLatest(
    DJ_ACTION_KYC_TOGGLE_OM,
    function* ({ payload: { kycId, enabled } }) {
      try {
        yield call(postToggleKycOm, kycId, enabled);
        yield enabled |> DJ_ACTION_KYC_TOGGLE_OM.success |> put;
      } catch (e) {
        yield put(DJ_ACTION_KYC_TOGGLE_OM.error(e));
      }
    }
  );
}

function* djSagaKYCBulkToggleOM() {
  yield takeLatest(
    DJ_ACTION_KYC_BULK_TOGGLE_OM,
    function* ({ payload: { kycIds, enabled } }) {
      try {
        const { data } = yield call(postBulkToggleKycOm, kycIds, enabled);
        yield put(DJ_ACTION_KYC_BULK_TOGGLE_OM.success(data));
      } catch (e) {
        yield put(DJ_ACTION_KYC_BULK_TOGGLE_OM.error(e));
      }
    }
  );
}
function* watchAssignDJScreeningMyKycRequest() {
  yield takeLatest(
    DJ_ACTION_RE_SCREENING_MY_KYC,
    function* assignKycScreeningMyKycRequest({ payload }) {
      try {
        const data = yield call(rescreeningService, payload);
        if (data.status === 200) {
          yield put(DJ_ACTION_RE_SCREENING_MY_KYC.success(data));
        }
      } catch (e) {
        yield put(DJ_ACTION_RE_SCREENING_MY_KYC.error(e));
      }
    }
  );
}
/**
 * Black list match change status
 */

function* blacklistDJChangeMatchStatus() {
  yield takeLatest(
    DJ_ACTION_BLACKLIST_MATCH_CHANGE_STATUS,
    function* changeMatchStatus({ payload }) {
      let res;
      try {
        if (!Array.isArray(payload.blacklistId))
          res = yield call(
            changeDJBlacklistMatchStatus,
            payload.djkyc,
            payload.blacklistId,
            payload.status
          );
        else
          res = yield call(
            changeDJBlacklistMatchesStatusFalse,
            payload.djkyc,
            payload.blacklistId
          );

        yield put(
          DJ_ACTION_BLACKLIST_MATCH_CHANGE_STATUS.success({
            kycId: payload.djkyc,
            blacklistId: payload.blacklistId,
            status: payload.status || "FALSE",
            data: res?.data,
          })
        );
      } catch (e) {
        yield put(DJ_ACTION_BLACKLIST_MATCH_CHANGE_STATUS.error(e));
      }
    }
  );
}

function* watchAssignDJScreeningMyKycDetailsRequest() {
  yield takeLatest(
    DJ_ACTION_RE_SCREENING_MY_KYC_DETAILS,
    function* assignKycScreeningMyKycDetailsRequest({ payload }) {
      try {
        const data = yield call(rescreeningService, payload);
        if (data.status === 200) {
          yield put(DJ_ACTION_RE_SCREENING_MY_KYC_DETAILS.success(data));
        }
      } catch (e) {}
    }
  );
}
/**
 * KYC action blacklist detail
 */
function* getDJBlackListDetail({ payload: { params } }) {
  try {
    const { data } = yield call(getDJBlackListMatchDetailService, params);
    yield put(DJ_ACTION_BLACKLIST_MATCH_DETAIL.success(data));
  } catch (e) {
    yield put(DJ_ACTION_BLACKLIST_MATCH_DETAIL.error(e));
  }
}

function* KYCSagaDJGetBlackListDetail() {
  yield takeLatest(DJ_ACTION_BLACKLIST_MATCH_DETAIL, getDJBlackListDetail);
}

/**
 * KYC action import
 */
function* DjKycSagaImportCsv() {
  yield takeLatest(DJ_KYC_ACTION_IMPORT_CSV, watchDjKycImportCsv);
}

function* watchDjKycImportCsv({ payload }) {
  try {
    const response = yield call(postImportCsvFile, payload);
    yield put(DJ_KYC_ACTION_IMPORT_CSV.success(response));
  } catch (err) {
    yield err |> DJ_KYC_ACTION_IMPORT_CSV.error |> put;
  }
}

function* DjKycSagaImportConfirm() {
  yield takeLatest(DJ_KYC_ACTION_IMPORT_CONFIRM, watchDjKycImportConfirm);
}

function* watchDjKycImportConfirm({ payload }) {
  try {
    const { data } = yield call(postImportConfirm, payload);
    yield put(DJ_KYC_ACTION_IMPORT_CONFIRM.success(data));
  } catch (e) {
    yield put(DJ_KYC_ACTION_IMPORT_CONFIRM.error(e));
  }
}

function* watchGetDjKycMatchRequest() {
  yield takeLatest(
    DJ_KYC_ACTION_GET_KYC_MATCH_REQUEST,
    function* getKycMatchRequest({ payload }) {
      try {
        const { data } = yield call(getDjKycMatchRequest, payload);
        yield put(DJ_KYC_ACTION_GET_KYC_MATCH_REQUEST.success(data));
      } catch (e) {
        yield put(DJ_KYC_ACTION_GET_KYC_MATCH_REQUEST.error(e));
      }
    }
  );
}

function* watchGetDjKycBlacklistRequest() {
  yield takeLatest(
    DJ_KYC_ACTION_GET_KYC_BLACKLIST_REQUEST,
    function* getKycBlacklistRequest({ payload }) {
      try {
        const { data } = yield call(getDjKycBlacklistRequest, payload);
        yield put(DJ_KYC_ACTION_GET_KYC_BLACKLIST_REQUEST.success(data));
      } catch (e) {
        yield put(DJ_KYC_ACTION_GET_KYC_BLACKLIST_REQUEST.error(e));
      }
    }
  );
}

function* watchGetDjKycMatchesFilterList() {
  yield takeLatest(
    DJ_KYC_ACTION_GET_MATCHES_FILTER_LIST,
    function* ({ payload }) {
      try {
        const { data } = yield call(getDjKycMatchesFilterList, payload.kycId);
        yield put(DJ_KYC_ACTION_GET_MATCHES_FILTER_LIST.success(data));
      } catch (e) {
        yield put(DJ_KYC_ACTION_GET_MATCHES_FILTER_LIST.error(e));
      }
    }
  );
}

export default function* DJSaga() {
  yield combineRootSagas(
    DJSagaRequestGetList,
    updateDJBulkAssign,
    dJInputIndividualByUser,
    dJSagaRequestGetIndividualById,
    dJAssignKycRequest,
    dJChangeMatchStatus,
    dJSagaRequestFilter,
    djSagaRequestGetKycMatch,
    dJSagaGetKycScoring,
    dJSagaKYCEditTotalRiskScore,
    djSagaKYCToggleOM,
    djSagaKYCBulkToggleOM,
    dJSagaEscalate,
    dJSagaChangeStatusRiskScore,
    dJKYCSagaGetWatchGroup,
    dJKYCSagaAddWatchGroup,
    dJKYCSagaCreateWatchGroup,
    dJKYCSagaRequestWatchList,
    dJKYCSagaRemoveFromWatchGroup,
    dJKYCSagaRemoveWatchGroup,
    dJKYCSagaRenameWatchGroup,
    dJKYCSagaChangeOrderGroup,
    dJKYCSagaSearchWatchGroup,
    watchGetDJRequests,
    watchAssignDJScreeningMyKycRequest,
    watchAssignDJScreeningMyKycDetailsRequest,
    blacklistDJChangeMatchStatus,
    KYCSagaDJGetBlackListDetail,
    DjKycSagaImportCsv,
    DjKycSagaImportConfirm,
    watchGetDjKycMatchRequest,
    watchGetDjKycBlacklistRequest,
    watchGetDjKycMatchesFilterList,
    DJNoteAdapter.saga,
    DJNoteMatchAdapter.saga,
    DJNoteScoringAdapter.saga,
    DJKYCArchiveAdapter.saga
  );
}
