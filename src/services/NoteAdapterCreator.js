//@flow
import { createReducer } from "@reduxjs/toolkit";
import reduceReducers from "reduce-reducers";
import { createAwaitAction } from "@protego/sdk/actions/utils";
import { takeEvery, call, put, takeLeading } from "@redux-saga/core/effects";
import { combineRootSagas } from "@protego/sdk/sagas/utils";
import type { NoteService } from "../types/typings";
// import type { AwaitPayloadAction } from "@protego/sdk/actions/utils";

/**
 *
 * @author ilyatruong
 * This is a creator function which forms like a module
 * Exposes rootSaga, actions and reducer (for Note module)
 * Has been created to archive reusing note management logics
 * That's why I choose term "adapter creator" instead of "Service"
 *    since it doesn't related to pure API calls like other services
 * KYC service, KYT service and anything uses Note feature should implement this adapter
 *    for it's own Note fetch service
 */

export default function NoteAdapterCreator(
  prefix: string,
  service: NoteService,
  reducerKey = "notes"
) {
  const actionMatcher = (
    callbackAction: { id: string },
    action: { id: string }
  ) => action.id === callbackAction.id;
  const actionGetAll = createAwaitAction<
      { id: string },
      { id: string, data: NoteDtoRes[] }
    >(`${prefix}/note/get-all`, null, actionMatcher),
    actionGetOne = createAwaitAction<
      { id: string },
      { id: string, data: NoteDtoRes }
    >(`${prefix}/note/get-one`, null, actionMatcher),
    actionSave = createAwaitAction<
      { id: string, body: NoteDtoRes },
      { id: string, data: NoteDtoRes }
    >(`${prefix}/note/save`, null, actionMatcher);

  function* sagaHandleGetAll() {
    yield takeEvery(actionGetAll, function* ({ payload: { id } }) {
      const { data } = yield call(service.getAll, id);
      yield { id, data } |> actionGetAll.success |> put;
    });
  }

  function* sagaHandleSave() {
    yield takeLeading(actionSave, function* ({ payload: { id, body } }) {
      const { data } = yield call(service.save, id, body);
      yield { id, data } |> actionSave.success |> put;
    });
  }

  return {
    withNoteReducer: (reducer) =>
      reduceReducers(
        null,
        reducer,
        createReducer({ [reducerKey]: {} }, (builder) =>
          builder
            .addCase(actionGetAll.success, (state, { payload }) => {
              state[reducerKey] = Object.assign(
                { ...state[reducerKey] },
                {
                  [payload.id]: payload.data
                }
              );
            })
            .addCase(actionSave.success, (state, { payload }) => {
              if (!state[reducerKey][payload.id])
                state[reducerKey][payload.id] = [];
              state[reducerKey][payload.id].unshift(payload.data);
            })
        )
      ),
    actionGetAll,
    actionGetOne,
    actionSave,
    saga: function* () {
      yield combineRootSagas(sagaHandleGetAll, sagaHandleSave);
    }
  };
}
