import { combineRootSagas } from "@protego/sdk/sagas/utils";
import { call, put, takeLatest } from "@redux-saga/core/effects";
import actions from "../actions/ProfileTableAction";
/**
 * change feild profile table
 */
 function* watchChangeFeildTable() {
    yield takeLatest(actions.CHAGE_FIELD_REQUEST, function* ({ payload }) {
      const fields = {
        ...payload
      }
        yield put({ type: actions.CHAGE_FIELD_SUCCESS, fields: fields });
    });
  }

  export default function* ProfileTableSaga() {
    yield combineRootSagas(
        watchChangeFeildTable,
    );
  }