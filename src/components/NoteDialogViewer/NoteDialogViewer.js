//@flow
import React from "react";
import { compose } from "recompose";
import Dialog from "@material-ui/core/Dialog";
import CloseableDialogTitle from "@protego/sdk/UI/CloseableDialogTitle/CloseableDialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import LoadingWrapper from "@protego/sdk/UI/LoadingWrapper";
import UserAvatar from "components/UserAvatar";
import { Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { isNil } from "lodash";
import withNoteFetcher from "components/withNoteFetcher";
import FileUploader from "components/FileUploader";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import { formatDate, LONG_DATE_TIME } from "util/date";

const useStyles = makeStyles(
  (theme) => ({
    createdAt: {
      fontSize: theme.typography.pxToRem(14),
      color: "#a3a3a3",
      marginBottom: theme.typography.pxToRem(9.8)
    }
  }),
  { name: "NoteItem" }
);

/**
 * @typedef {Object} NoteItemProps
 * @property {import("../../types/typings").NoteDto} note
 */

/**
 *
 * @param {NoteItemProps} props
 * @return JSX.Element
 */
function NoteItem(props) {
  const { note } = props,
    classes = useStyles();
  return (
    <div className={"d-flex my-4"}>
      <UserAvatar user={note.createdBy} />
      <div className={"flex-grow-1"}>
        <Typography>
          {note.createdBy?.firstName} {note.createdBy?.lastName}
        </Typography>
        <Typography className={classes.createdAt}>
          {formatDate(note.createdAt, LONG_DATE_TIME)}
        </Typography>
        <Typography>{note.content}</Typography>
        <FileUploader.Indicator value={note.attachments} />
      </div>
    </div>
  );
}

/**
 *
 * @param {NoteDialogViewerProps & {loading:boolean,notes:NoteDto[]}} props
 * @returns {JSX.Element}
 */
const NoteDialogViewer = compose(withNoteFetcher)(function NoteDialogViewer(
  props
) {
  const {
    notes,
    onClose,
    id,
    loading,
    style = {},
    selector, //omit
    fetcher, //omit
    ...others
  } = props;
  return (
    <Dialog open={props.id |> !isNil(#)} onClose={props.onClose} fullWidth>
      <CloseableDialogTitle onClose={props.onClose}>Notes</CloseableDialogTitle>
      <DialogContent>
        <LoadingWrapper loading={props.loading}>
          <div style={{ minHeight: "10vh", ...style }} {...others}>
            {Array.isArray(props.notes) &&
              notes.map((note) => <NoteItem note={note} key={note.id} />)}
            {!Array.isArray(props.notes) ||
              (props.notes.length === 0 && (
                <p
                  className={"d-inline-block w-100 text-center"}
                  style={{ color: "#aaa", marginTop: "4vh" }}
                >
                  <IntlMessages id="empty-notes" />
                </p>
              ))}
          </div>
        </LoadingWrapper>
      </DialogContent>
    </Dialog>
  );
});

export default NoteDialogViewer;
