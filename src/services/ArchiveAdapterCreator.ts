import {
  AwaitPayloadAction,
  createAwaitAction,
} from "@protego/sdk/actions/utils";
import { combineRootSagas } from "@protego/sdk/sagas/utils";
import {
  call,
  put,
  select,
  takeEvery,
  takeLeading,
} from "@redux-saga/core/effects";
import { createReducer } from "@reduxjs/toolkit";
import { KYC_STATUS } from "constants/KycStatus";
import { DefaultRootState } from "react-redux";
import reduceReducers from "reduce-reducers";
import { ArchiveService, KytRequestDto } from "types/typings";
import { paginationParams } from "util/sagas";

const convertStatusPendingOfKYC = (list) => {
  return list.map((item) => {
    if (item.status === KYC_STATUS.PENDING) {
      if (item.positiveMatch != null) {
        item.status = "POSITIVE_MATCH";
      } else {
        item.status = "NO_MATCH";
      }
    }
    return item;
  });
};

export default function ArchiveAdapterCreator<T>(
  prefix: string,
  service: ArchiveService<T>,
  actions: {
    addToWatchList: AwaitPayloadAction<any, any>;
    fetchList: AwaitPayloadAction<any, any>;
    fetchWatchList: AwaitPayloadAction<any, any>;
    removeFromWatchList: AwaitPayloadAction<any, any>;
  } | null = null,
  reducerKey: string = "archiveList"
) {
  const actionGetAll = createAwaitAction<
      any,
      {
        data: Array<T>;
      }
    >(`${prefix}/archive/getAll`),
    actionAddToArchive = createAwaitAction<
      string | number | KytRequestDto,
      Array<T>
    >( //@ts-ignore
      `${prefix}/archive/add`, null, actionGetAll),
    actionRemoveFromArchive = createAwaitAction<
      string | number | KytRequestDto,
      Array<T>
    >( //@ts-ignore
      `${prefix}/archive/remove`, null, actionGetAll);
  function* handleGetAll() {
    // @ts-ignore
    yield takeEvery(actionGetAll, function* ({ payload: { params } }: any) {
      const { data } = yield call(service.getAll, params);
      if (
        (prefix === "djkyc" || prefix === "kyc" || prefix === "kyb") &&
        data &&
        data.total_records > 0
      ) {
        data.records = convertStatusPendingOfKYC(data.records);
      }
      yield put(actionGetAll.success({ data }));
    });
  }
  function* handleAddTo() {
    yield takeLeading(actionAddToArchive, function* ({ payload }: any) {
      try {
        yield call(service.addToArchive, payload);
        yield put(actionAddToArchive.success());
      } catch (err) {
        yield put(actionAddToArchive.error());
      }
    });
  }
  function* handleRemove() {
    yield takeLeading(actionRemoveFromArchive, function* ({ payload }: any) {
      yield call(service.remove, payload);
      const pagination = yield paginationParams();
      yield put(actionGetAll({ params: pagination }));
    });
  }
  function* handleRelatedActions() {
    if (actions !== null) {
      yield takeEvery([actionAddToArchive.success], function* ({ payload }) {
        const pathname = yield select(
          (state) => state.router.location.pathname
        );
        if (/archiveList/.test(pathname)) return;
        const pagination = yield paginationParams();
        if (/watchList/.test(pathname))
          yield put(actions.fetchWatchList({ params: pagination }));
        else yield put(actions.fetchList({ params: pagination }));
      });
    }
  }

  /**
   * @deprecated
   * @param {(state: DefaultRootState) => unknown} selectorFn
   * @param callback
   * @param {boolean} loading
   */
  function useArchiveWatcher(
    selectorFn: (state: DefaultRootState) => unknown,
    callback,
    loading: boolean
  ) {
    // callback();
  }

  return {
    withArchiveReducer: (reducer) =>
      reduceReducers(
        null,
        reducer,
        createReducer({ [reducerKey]: [] }, (builder) => {
          builder.addCase(actionGetAll.success, (state, { payload }) => {
            state[reducerKey] = payload.data;
          });
        })
      ),
    actionGetAll,
    actionAddToArchive,
    actionRemoveFromArchive,
    saga: function* () {
      yield combineRootSagas(
        handleGetAll,
        handleAddTo,
        handleRemove,
        handleRelatedActions
      );
    },
    useArchiveWatcher,
  };
}
