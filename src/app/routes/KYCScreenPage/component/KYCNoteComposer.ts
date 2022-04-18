import NoteComposer from "components/NoteComposer";
import { NoteComposerEnhancedProps } from "components/NoteComposer/NoteComposer";
import React from "react";
import { withProps } from "recompose";
import { compose } from "redux";
import { KYCNoteAdapter, KYCNoteMatchAdapter } from "services/KYCService";

const KYCNoteComposer = compose(
  withProps((props: any) => ({
    selector: (state) => state.kyc.notes[props.id],
    fetcher: KYCNoteAdapter.actionGetAll,
    saver: KYCNoteAdapter.actionSave,
    type: "KycNote"
  }))
)(NoteComposer) as React.FunctionComponent<NoteComposerEnhancedProps>;

export default KYCNoteComposer;

const KYCNoteMatchComposer = (compose(
  withProps((props: any) => ({
    selector: (state) => state.kyc.matchNotes[props.id],
    fetcher: KYCNoteMatchAdapter.actionGetAll,
    saver: KYCNoteMatchAdapter.actionSave,
    type: "KycMatchNote"
  }))
)(
  NoteComposer
) as unknown) as React.FunctionComponent<NoteComposerEnhancedProps>;

export { KYCNoteMatchComposer };
