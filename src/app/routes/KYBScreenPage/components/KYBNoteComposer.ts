import NoteComposer from "components/NoteComposer";
import { NoteComposerEnhancedProps } from "components/NoteComposer/NoteComposer";
import React from "react";
import { withProps } from "recompose";
import { compose } from "redux";
import { KYBNoteAdapter, KYBNoteMatchAdapter } from "services/KYBService";

const KYBNoteComposer = (compose(
  withProps((props: any) => ({
    selector: (state) => state.kyb.notes[props.id],
    fetcher: KYBNoteAdapter.actionGetAll,
    saver: KYBNoteAdapter.actionSave,
    type: "KybNote"
  }))
)(
  NoteComposer
) as unknown) as React.FunctionComponent<NoteComposerEnhancedProps>;

export default KYBNoteComposer;

const KYBNoteMatchComposer = (compose(
  withProps((props: any) => ({
    selector: (state) => state.kyb.matchNotes[props.id],
    fetcher: KYBNoteMatchAdapter.actionGetAll,
    saver: KYBNoteMatchAdapter.actionSave,
    type: "KybMatchNote"
  }))
)(
  NoteComposer
) as unknown) as React.FunctionComponent<NoteComposerEnhancedProps>;

export { KYBNoteMatchComposer };
