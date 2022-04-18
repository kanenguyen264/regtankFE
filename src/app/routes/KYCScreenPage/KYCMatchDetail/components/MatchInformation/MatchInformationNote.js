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
import { KYCNoteAdapter } from "services/KYCService";
import styles from "./MatchInformation.module.scss";
/**
 * @param {NoteComposerEnhancedProps} props
 * @return {JSX.Element}
 */
const MatchInformationNote = compose(
  withProps((props) => ({
    selector: (state) => state.kyc.notes[props.id],
    fetcher: KYCNoteAdapter.actionGetAll,
    saver: KYCNoteAdapter.actionSave,
    type: "KycNote",
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
    <div className={styles.noteContainer}>
      <NoteComposer
        rows={6}
        placeholder={formatMessage({
          id: "write.a.note",
        })}
        {...props}
      />
    </div>
  );
});

export default MatchInformationNote;
