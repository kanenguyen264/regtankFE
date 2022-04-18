// import React from "react";
// import { compose, withProps } from "recompose";
// import NoteComposer from "components/NoteComposer/NoteComposer";
// import { KYCNoteScoringAdapter } from "services/KYCService";
// import makeStyles from "@material-ui/core/styles/makeStyles";
// import { toRem } from "@protego/sdk/utils/measurements";

// const useStyles = makeStyles({
//   header: {
//     fontSize: 21 |> toRem,
//     fontWeight: 500
//   }
// });

// /**
//  * @param {NoteComposerEnhancedProps} props
//  * @return {JSX.Element}
//  */
// const Note = compose(
//   withProps((props) => ({
//     selector: (state) => state.kyc.scoringNotes[props.id],
//     fetcher: KYCNoteScoringAdapter.actionGetAll,
//     saver: KYCNoteScoringAdapter.actionSave,
//     type: "KycRiskNote"
//   }))
// )((props) => {
//   const classes = useStyles();
//   return <NoteComposer classes={{ header: classes.header }} {...props} />;
// });

// export default Note;
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
import {
  DJNoteAdapter,
  DJNoteMatchAdapter,
  DJNoteScoringAdapter,
} from "services/DJService";

/**
 * @param {NoteComposerEnhancedProps} props
 * @return {JSX.Element}
 */
const Note = compose(
  withProps((props) => ({
    selector: (state) => state.downJones.scoringNotes[props.id],
    fetcher: DJNoteScoringAdapter.actionGetAll,
    saver: DJNoteScoringAdapter.actionSave,
    type: "djkycScoringNote",
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
