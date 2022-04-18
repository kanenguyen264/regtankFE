import { combineRootSagas } from "@protego/sdk/sagas/utils";
import { CaseArchiveAdapter, CaseNoteAdapter } from "../services/CaseService";
import { CaseManagementService } from "../services/CaseManagementService";
import {
  CASE_MANAGEMENT_ACTION_GET_CASES,
  CASE_MANAGEMENT_ACTION_BULK_ASSIGN,
  CASE_MANAGEMENT_DETAIL_CASES,
  CASE_MANAGEMENT_ACTION_CREATE,
  CASE_MANAGEMENT_ACTION_UPDATE_APPROVAL,
  CASE_MANAGEMENT_DETAIL_ASSIGN,
  CASE_MANAGEMENT_DETAIL_UPDATE,
  CASE_MANAGEMENT_ADD_GROUP_PROFILE,
  CASE_MANAGEMENT_ADD_PROFILE,
  CASE_MANAGEMENT_DELETE_PROFILE,
  UPDATE_PROFILE_TABLE,
  CASE_MANAGEMENT_BASIC_LOG,
  CASE_MANAGEMENT_SEARCH_PROFILE,
} from "actions/CaseManagementAction";
import { call, put, takeLatest } from "@redux-saga/core/effects";
import { CaseManagementNoteAdapter } from "services/CaseManagementService";

/**
 * Get All Cases
 */
function* watchGetCases() {
  yield takeLatest(
    CASE_MANAGEMENT_ACTION_GET_CASES,
    function* getCases({ payload }) {
      try {
        const { data } = yield call(
          CaseManagementService.getCases,
          payload?.pagination,
          payload?.filter
        );
        yield put(CASE_MANAGEMENT_ACTION_GET_CASES.success(data));
      } catch (e) {
        yield put(CASE_MANAGEMENT_ACTION_GET_CASES.error(e));
      }
    }
  );
}

/**
 * Bulk assign
 */
function* watchBulkAssign() {
  yield takeLatest(CASE_MANAGEMENT_ACTION_BULK_ASSIGN, function* ({ payload }) {
    try {
      const { data } = yield call(
        CaseManagementService.bulkAssign,
        payload?.userId,
        payload?.ids
      );
      yield put(CASE_MANAGEMENT_ACTION_BULK_ASSIGN.success(data));
    } catch (e) {
      yield put(CASE_MANAGEMENT_ACTION_BULK_ASSIGN.error(e));
    }
  });
}

/**
 * New Case
 */
function* watchCreateCase() {
  yield takeLatest(CASE_MANAGEMENT_ACTION_CREATE, function* ({ payload }) {
    try {
      const { data } = yield call(CaseManagementService.createCase, payload);
      yield put(CASE_MANAGEMENT_ACTION_CREATE.success(data));
    } catch (e) {
      yield put(CASE_MANAGEMENT_ACTION_CREATE.error(e));
    }
  });
}

/**
 * Update Case
 */
function* watchUpdateCase() {
  yield takeLatest(CASE_MANAGEMENT_DETAIL_UPDATE, function* ({ payload }) {
    try {
      const { data } = yield call(
        CaseManagementService.updateCaseDetail,
        payload?.data,
        payload?.caseId
      );
      yield put(CASE_MANAGEMENT_DETAIL_UPDATE.success(data));
      yield put(CASE_MANAGEMENT_BASIC_LOG({caseId: payload?.caseId}));
    } catch (e) {
      yield put(CASE_MANAGEMENT_DETAIL_UPDATE.error(e));
    }
  });
}

/**
 * Approve/Reject case
 */
function* watchApproval() {
  yield takeLatest(
    CASE_MANAGEMENT_ACTION_UPDATE_APPROVAL,
    function* ({ payload }) {
      try {
        const { data } = yield call(
          CaseManagementService.updateApproval,
          payload
        );
        yield put(CASE_MANAGEMENT_ACTION_UPDATE_APPROVAL.success(data));
        yield put(CASE_MANAGEMENT_BASIC_LOG({caseId: payload?.caseId}));
      } catch (e) {
        yield put(CASE_MANAGEMENT_ACTION_UPDATE_APPROVAL.error(e));
      }
    }
  );
}

/**
 *  assign case detail
 */

function* watchCasesDetailAssign() {
  yield takeLatest(
    CASE_MANAGEMENT_DETAIL_ASSIGN,
    function* getCaseDetail({ payload }) {
      try {
        const { data } = yield call(
          CaseManagementService.caseDetailAssign,
          payload?.userId,
          payload?.caseId
        );
        yield put(CASE_MANAGEMENT_DETAIL_ASSIGN.success(data));
        yield put(CASE_MANAGEMENT_BASIC_LOG({caseId: payload?.caseId}));
      } catch (e) {
        yield put(CASE_MANAGEMENT_DETAIL_ASSIGN.error(e));
      }
    }
  );
}

/**
 * get case detail
 */
function* watchCasesDetail() {
  yield takeLatest(
    CASE_MANAGEMENT_DETAIL_CASES,
    function* getCaseDetail({ payload }) {
      try {
        const { data } = yield call(
          CaseManagementService.getCaseDetail,
          payload
        );
        yield put(CASE_MANAGEMENT_DETAIL_CASES.success(data));
        yield put(CASE_MANAGEMENT_BASIC_LOG({caseId: payload}));
      } catch (e) {
        yield put(CASE_MANAGEMENT_DETAIL_CASES.error(e));
      }
    }
  );
}

/**
 * add group profile
 */
function* watchGroupProfileAdd() {
  yield takeLatest(CASE_MANAGEMENT_ADD_GROUP_PROFILE, function* ({ payload }) {
    try {
      const { data } = yield call(
        CaseManagementService.addGroupProfile,
        payload?.profileIds,
        payload?.caseId
      );
      yield put(CASE_MANAGEMENT_ADD_GROUP_PROFILE.success(data));
      yield put(CASE_MANAGEMENT_BASIC_LOG({caseId: payload?.caseId}));
    } catch (e) {
      yield put(CASE_MANAGEMENT_ADD_GROUP_PROFILE.error(e));
    }
  });
}

/**
 * add profiles
 */
function* watchProfileAdd() {
  yield takeLatest(CASE_MANAGEMENT_ADD_PROFILE, function* ({ payload }) {
    try {
      const { data } = yield call(
        CaseManagementService.addProfile,
        payload?.caseId,
        payload?.groupProfileId,
        payload?.profileIds
      );
      let rs = data;
      rs.groupProfileId = payload?.groupProfileId;
      yield put(CASE_MANAGEMENT_ADD_PROFILE.success(rs));
      yield put(CASE_MANAGEMENT_BASIC_LOG({caseId: payload?.caseId}));
    } catch (e) {
      yield put(CASE_MANAGEMENT_ADD_PROFILE.error(e));
    }
  });
}

/**
 * delete a profile
 */
function* watchProfileDelete() {
  yield takeLatest(CASE_MANAGEMENT_DELETE_PROFILE, function* ({ payload }) {
    try {
      const { data } = yield call(
        CaseManagementService.deleteProfile,
        payload?.caseId,
        payload?.profileId
      );
      yield put(CASE_MANAGEMENT_DELETE_PROFILE.success(data));
      yield put(CASE_MANAGEMENT_BASIC_LOG({caseId: payload?.caseId}));
    } catch (e) {
      yield put(CASE_MANAGEMENT_DELETE_PROFILE.error(e));
    }
  });
}

/**
 * update profile table
 */
 function* watchProfile() {
  yield takeLatest(UPDATE_PROFILE_TABLE, function* ({ payload }) {
    try {
      const { data } = yield call(
        CaseManagementService.updateProfile,
        payload?.caseId,
        payload?.profiles
      );
      yield put(UPDATE_PROFILE_TABLE.success(data));
      yield put(CASE_MANAGEMENT_BASIC_LOG({caseId: payload?.caseId}));
    } catch (e) {
      yield put(UPDATE_PROFILE_TABLE.error(e));
    }
  });
}

/**
 * get Basic Log
 */
 function* watchBasicLog() {
  yield takeLatest(CASE_MANAGEMENT_BASIC_LOG, function* ({ payload }) {
    try {
      const { data } = yield call(
        CaseManagementService.getBasicLog,
        payload?.caseId,
      );
      yield put(CASE_MANAGEMENT_BASIC_LOG.success(data));
    } catch (e) {
      yield put(CASE_MANAGEMENT_BASIC_LOG.error(e));
    }
  });
}

/**
 * search profile
 */
 function* watchSearchProfile() {
  yield takeLatest(CASE_MANAGEMENT_SEARCH_PROFILE, function* ({ payload }) {
    try {
      const { data } = yield call(
        CaseManagementService.searchProfile,
        payload?.caseId,
        payload?.params,
      );
      let res = {}
      if(payload?.params?.profileType === "KYC") {
        res.kyc = data
      } else if(payload?.params?.profileType === "KYT") {
        res.kyt = data
      } else {
        res.kyb = data
      }
      yield put(CASE_MANAGEMENT_SEARCH_PROFILE.success(res));
    } catch (e) {
      yield put(CASE_MANAGEMENT_SEARCH_PROFILE.error(e));
    }
  });
}
export default function* CaseManagementSaga() {
  yield combineRootSagas(
    watchGetCases,
    watchCasesDetail,
    watchBulkAssign,
    watchCreateCase,
    watchApproval,
    watchCasesDetailAssign,
    watchUpdateCase,
    watchGroupProfileAdd,
    watchProfileAdd,
    watchProfileDelete,
    watchProfile,
    CaseManagementNoteAdapter.saga,
    watchBasicLog,
    watchSearchProfile,
  );
}
