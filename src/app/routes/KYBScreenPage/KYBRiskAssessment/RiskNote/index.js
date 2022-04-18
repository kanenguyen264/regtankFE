import NoteComposer from "@protego/sdk/RegtankUI/v1/NoteComposer";
import {
  ATTC_ACTION_ADD,
  ATTC_ACTION_CLOSE,
  ATTC_ACTION_COMPLETE,
  ATTC_ACTION_PROGRESS,
  ATTC_ACTION_REMOVE,
} from "actions/AttachmentActions";
import React from "react";
import { useIntl } from "react-intl";
import { compose, withProps } from "recompose";
import FileUploaderService from "services/FileUploaderService";
import { KYBRiskNoteAdapter } from "services/KYBService";

/**
 * @param {NoteComposerEnhancedProps} props
 * @return {JSX.Element}
 */
const Note = compose(
  withProps((props) => ({
    selector: (state) => state.kyb.notes[props.id],
    fetcher: KYBRiskNoteAdapter.actionGetAll,
    saver: KYBRiskNoteAdapter.actionSave,
    type: "KybRiskNote",
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

export default Note;
