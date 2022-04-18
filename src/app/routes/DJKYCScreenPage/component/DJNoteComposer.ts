import NoteComposer from "components/NoteComposer";
import { NoteComposerEnhancedProps } from "components/NoteComposer/NoteComposer";
import React from "react";
import { withProps } from "recompose";
import { compose } from "redux";
import { DJNoteAdapter, DJNoteMatchAdapter, DJNoteScoringAdapter } from "services/DJService";

const DJNoteComposer = compose(
  withProps((props: any) => ({
    selector: (state) => state.downJones.notes[props.id],
    fetcher: DJNoteAdapter.actionGetAll,
    saver: DJNoteAdapter.actionSave,
    type: "djkyc"
  }))
)(NoteComposer) as React.FunctionComponent<NoteComposerEnhancedProps>;

export default DJNoteComposer;

const DJNoteMatchComposer = (compose(
  withProps((props: any) => ({
    selector: (state) => state.downJones.matchNotes[props.id],
    fetcher: DJNoteMatchAdapter.actionGetAll,
    saver: DJNoteMatchAdapter.actionSave,
    type: "djkycMatchNote"
  }))
)(
  NoteComposer
) as unknown) as React.FunctionComponent<NoteComposerEnhancedProps>;

 export { DJNoteMatchComposer };

 const DJScoringNoteComposer = compose(
  withProps((props: any) => ({
    selector: (state) => state.downJones.scoringNotes[props.id],
    fetcher: DJNoteScoringAdapter.actionGetAll,
    saver: DJNoteScoringAdapter.actionSave,
    type: "djkycScoringNote"
  }))
)(NoteComposer) as React.FunctionComponent<NoteComposerEnhancedProps>;

export {DJScoringNoteComposer};
