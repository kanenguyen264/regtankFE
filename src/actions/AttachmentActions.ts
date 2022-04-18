import { createAction } from "@reduxjs/toolkit";

type AttcActionAddPayload = {
  files: File | FileList;
  id: string;
};

const ATTC_ACTION_ADD = createAction<AttcActionAddPayload>("add"),
  ATTC_ACTION_PROGRESS = createAction<{
    file: File;
    id: string;
    progress: number;
  }>("progress"),
  ATTC_ACTION_COMPLETE = createAction<{ file: File; id: string }>("complete"),
  ATTC_ACTION_CLOSE = createAction<{ id: string }>("close"),
  ATTC_ACTION_REMOVE = createAction<{ file: File; id: string }>("remove");

export {
  ATTC_ACTION_ADD,
  ATTC_ACTION_PROGRESS,
  ATTC_ACTION_COMPLETE,
  ATTC_ACTION_CLOSE,
  ATTC_ACTION_REMOVE
};
