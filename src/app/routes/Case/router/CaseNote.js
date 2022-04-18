import makeStyles from "@material-ui/core/styles/makeStyles";
import { toRem } from "@protego/sdk/utils/measurements";
import NoteComposer from "components/NoteComposer/NoteComposer";
import React from "react";
import { compose, withProps } from "recompose";
import { CaseNoteAdapter } from "services/CaseService";

const useStyles = makeStyles({
  header: {
    fontSize: 21 > toRem
  }
});

const CaseNote = compose(
  withProps((props) => ({
    selector: (state) => state.case.notes[props.id],
    fetcher: CaseNoteAdapter.actionGetAll,
    saver: CaseNoteAdapter.actionSave,
    type: "case"
  }))
)((props) => {
  const classes = useStyles();
  return <NoteComposer classes={{ header: classes.header }} {...props} />;
});

export default CaseNote;
