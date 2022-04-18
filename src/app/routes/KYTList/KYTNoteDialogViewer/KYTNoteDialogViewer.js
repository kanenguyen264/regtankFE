import { compose, withProps } from "recompose";
import NoteDialogViewer from "components/NoteDialogViewer";
import { KYTNoteAdapter } from "services/KYTService";

const KYTNoteDialogViewer = compose(
  withProps((props) => ({
    selector: (state) => state.kyt.notes[props.id],
    fetcher: KYTNoteAdapter.actionGetAll
  }))
)(NoteDialogViewer);

export default KYTNoteDialogViewer;
