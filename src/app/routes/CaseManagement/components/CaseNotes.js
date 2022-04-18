import NoteComposer from "@protego/sdk/RegtankUI/v1/NoteComposer";
import {
  ATTC_ACTION_ADD, ATTC_ACTION_CLOSE, ATTC_ACTION_COMPLETE,
  ATTC_ACTION_PROGRESS, ATTC_ACTION_REMOVE
} from "actions/AttachmentActions";
import { CASE_MANAGEMENT_BASIC_LOG } from "actions/CaseManagementAction";
import React from "react";
import { useIntl } from "react-intl";
import { compose, withProps } from "recompose";
import { CaseManagementNoteAdapter } from "services/CaseManagementService";
import FileUploaderService from "../../../../services/FileUploaderService";

const CaseNote = compose(
  withProps((props) => ({
    selector: (state) => state.caseManagement.notes[props.id],
    fetcher: CaseManagementNoteAdapter.actionGetAll,
    saver: CaseManagementNoteAdapter.actionSave,
    afterSaved: CASE_MANAGEMENT_BASIC_LOG({caseId: props.id}),
    type: "case-management",
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
  const intl = useIntl();
  const { formatMessage } = intl;

  return (
    <NoteComposer
      rows={2}
      placeholder={formatMessage({
        id: "caseManagement.placeholder.note",
      })}
      {...props}
    />
  );
});

export default CaseNote;
