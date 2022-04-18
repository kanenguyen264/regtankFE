// //@flow
// import { compose, withProps } from "recompose";
import { KYTNoteAdapter } from "../../../services/KYTService";
// import NoteComposer from "components/NoteComposer/NoteComposer";
// //import NoteComposer from "@protego/sdk/RegtankUI/v1/NoteComposer";
// /**
//  * @param {NoteComposerEnhancedProps} props
//  * @return {JSX.Element}
//  */
// const KYTScreenPageNote = compose(
//   withProps((props) => ({
//     selector: (state) => state.kyt.notes[props.id],
//     fetcher: KYTNoteAdapter.actionGetAll,
//     saver: KYTNoteAdapter.actionSave,
//     type: "KytNote",
//   }))
// )(NoteComposer);

// export default KYTScreenPageNote;

import NoteComposer from "@protego/sdk/RegtankUI/v1/NoteComposer";
import React from "react";
import { compose, withProps } from "recompose";
import { KYCNoteScoringAdapter } from "services/KYCService";
import { useIntl } from "react-intl";
import FileUploaderService from "services/FileUploaderService";
import {
  ATTC_ACTION_ADD,
  ATTC_ACTION_CLOSE,
  ATTC_ACTION_COMPLETE,
  ATTC_ACTION_PROGRESS,
  ATTC_ACTION_REMOVE,
} from "actions/AttachmentActions";
/**
 * @param {NoteComposerEnhancedProps} props
 * @return {JSX.Element}
 */
const Note = compose(
  withProps((props) => ({
    selector: (state) => state.kyt.notes[props.id],
    fetcher: KYTNoteAdapter.actionGetAll,
    saver: KYTNoteAdapter.actionSave,
    type: "KytNote",
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
        id: "kyc.note.enter.your.note",
      })}
      scrollable
      {...props}
    />
  );
});

export default Note;
