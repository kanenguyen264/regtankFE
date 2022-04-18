import { createReducer } from "@reduxjs/toolkit";
import {
  ATTC_ACTION_ADD,
  ATTC_ACTION_CLOSE,
  ATTC_ACTION_COMPLETE,
  ATTC_ACTION_PROGRESS,
  ATTC_ACTION_REMOVE
} from "actions/AttachmentActions";

export interface IAttachmentReducerStateItem {
  complete: boolean;
  file: File;
  instanceId: string;
  name: string;
  progress: number;
}
export interface IAttachmentReducerState {
  list: {
    [key: string]: {
      [key: string]: IAttachmentReducerStateItem;
    };
  };
  open: boolean;
}

const initialState: IAttachmentReducerState = {
  list: {},
  open: false
};

const AttachmentReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(
      ATTC_ACTION_ADD,
      /**
       *
       * @param state
       * @param {File|FileList} payload
       */
      (state, { payload }) => {
        // state.open = true;
        const create = (file, instanceId) => ({
          name: file.name,
          file,
          progress: 0,
          complete: false,
          instanceId
        });
        if (!state.list[payload.id]) {
          state.list[payload.id] = {};
        }
        if (payload.files instanceof File) {
          state.list[payload.id][payload.files.name] = create(
            payload.files,
            payload.id
          );
        } else if (payload.files instanceof FileList) {
          for (let i = 0; i < payload.files.length; i++) {
            const file = payload.files[i];
            state.list[payload.id][file.name] = create(file, payload.id);
          }
        }
      }
    )
    .addCase(
      ATTC_ACTION_PROGRESS,
      (state, { payload: { file, progress, id } }) => {
        if (state.list[id][file.name])
          state.list[id][file.name].progress = progress;
      }
    )
    .addCase(
      ATTC_ACTION_COMPLETE,
      /**
       *
       * @param state
       * @param {File} file
       */
      (state, { payload: { file, id } }) => {
        if (state.list[id][file.name]) {
          state.list[id][file.name].complete = true;
        }
      }
    )
    .addCase(ATTC_ACTION_CLOSE, (state, { payload }) => {
      // state.open = false;
      state.list[payload.id] = {};
    })
    .addCase(ATTC_ACTION_REMOVE, (state, { payload }) => {
      for (let key in state.list[payload.id])
        if (state.list[payload.id].hasOwnProperty(key)) {
          if (state.list[payload.id][key].file === payload.file) {
            delete state.list[payload.id][key];
          }
        }
    })
);

export default AttachmentReducer;
