//@flow
// import React from "react";
import { compose, withProps } from "recompose";
import NoteDialogViewer from "components/NoteDialogViewer";
import { KYCNoteAdapter } from "services/KYCService";

/**
 * @typedef {Omit<NoteDialogViewerProps,'selector'|'fetcher'>} KYCNoteDialogViewerProps
 */

/**
 * @param {KYCNoteDialogViewerProps} props
 * @return {JSX.Element}
 */
const KYCNoteDialogViewer = compose(
  withProps((props) => ({
    selector: (state) => state.kyc.notes[props.id],
    fetcher: KYCNoteAdapter.actionGetAll
  }))
)(NoteDialogViewer);

export default KYCNoteDialogViewer;
