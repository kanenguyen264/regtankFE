import NoteComposer from "@protego/sdk/RegtankUI/v1/NoteComposer";
import {
  ATTC_ACTION_ADD,
  ATTC_ACTION_CLOSE,
  ATTC_ACTION_COMPLETE,
  ATTC_ACTION_PROGRESS,
  ATTC_ACTION_REMOVE,
} from "actions/AttachmentActions";
import React, { Fragment } from "react";
import { compose, withProps } from "recompose";
import FileUploaderService from "services/FileUploaderService";
import { KYCNoteMatchAdapter } from "services/KYCService";
import { useIntl } from "react-intl";

const TableNote = compose(
  withProps((props) => ({
    selector: (state) => state.kyc.matchNotes[props.id],
    fetcher: KYCNoteMatchAdapter.actionGetAll,
    saver: KYCNoteMatchAdapter.actionSave,
    type: "KycMatchNote",
    uploader: {
      add: ATTC_ACTION_ADD,
      close: ATTC_ACTION_CLOSE,
      post: FileUploaderService.post,
      remove: ATTC_ACTION_REMOVE,
      progress: ATTC_ACTION_PROGRESS,
      complete: ATTC_ACTION_COMPLETE,
    },
    download: FileUploaderService.download,
  }))
)((props) => {
  const { formatMessage } = useIntl();

  return (
    <NoteComposer
      rows={2}
      placeholder={formatMessage({
        id: "write.a.note",
      })}
      {...props}
    />
  );
});

export default TableNote;
