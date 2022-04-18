import { Button, IconButton, Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import ClearSharpIcon from "@material-ui/icons/ClearSharp";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import JRCard from "@protego/sdk/UI/JRCard/JRCard";
import LoadingWrapper from "@protego/sdk/UI/LoadingWrapper/LoadingWrapper";
import clsx from "clsx";
import FileUploader from "components/FileUploader";
// import FileUploader from "@protego/sdk/RegtankUI/v1/FileUploader";
import UserAvatar from "components/UserAvatar";
import withNoteFetcher from "components/withNoteFetcher";
// import withNoteFetcher from "@protego/sdk/RegtankUI/v1/withNoteFetcher";
import { Field, Form, Formik, useFormik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import { compose } from "recompose";
import { formatDate, LONG_DATE_TIME } from "util/date";
import styles from "./NoteComposer.module.scss";
import { ReactComponent as SendIcon } from "assets/icons/sendIcon.svg";
import { useIntl } from "react-intl";

const greenColor = "#4CAF4F";
const greenColorDark = "#3e9d42";
const lightGrayColor = "#f5f5f5";

const useButtonStyles = makeStyles(() => ({
  outlined: {
    borderColor: greenColor,
    color: greenColor,
    "&:hover": {
      borderColor: greenColorDark,
      color: greenColorDark
    }
  },
  contained: {
    backgroundColor: greenColor,
    color: "white",
    "&:hover": {
      backgroundColor: greenColorDark
    }
  }
}));

const useCustomStyle = makeStyles({
  scrollBar: {
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: (props) =>
        (props.scrollBarColor ?? lightGrayColor) + "! important"
    }
  }
});

const NoteComposer = compose(
  withNoteFetcher,
  withStyles(
    {
      card: { marginBottom: 0, paddingBottom: 0 },
      header: {}
    },
    { name: "CpNoteComposer" }
  )
)(
  /**
   *
   * @param {NoteComposerProps} props
   * @returns {JSX.Element}
   * @constructor
   */
  function NoteComposer(props) {
    const {
        notes,
        id: typeId,
        saver,
        classes,
        // service,
        addNoteCallbackRef,
        withoutOutsideCard = false,
        className,
        containerHeight,
        type,
        placeholder,
        // addNoteButtonTitle = <IntlMessages id={"note"} />,
        title = <IntlMessages id={"notes"} />,
        showIconInButtons = true,
        hideClearBtn = true,
        rows = 1,
        resizeable = false,
        buttonsPosition = "inline",
        autoHeight = true
      } = props,
      dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const buttonClasses = useButtonStyles();
    const [isAdd, setAdd] = React.useState(
        // process.env.NODE_ENV === "development"
        true
      ),
      [adding, setAdding] = React.useState(false),
      fm = useFormik({
        initialValues: {
          note: ""
        }
      });
    const containerEl = React.useRef(null);
    const textAreaEl = React.useRef(null);
    const [maxHeight, setMaxHeight] = React.useState(containerHeight);
    const customStyles = useCustomStyle(props);

    const addNote = () => {
        fm.resetForm();
        setAdd(true);
        setAdding(false);
      },
      doAddNote = async (note) => {
        setAdding(true);
        try {
          await dispatch(saver({ id: typeId, body: note }));
        } catch {
        } finally {
          setAdding(false);
        }
      };

    React.useEffect(() => {
      if (addNoteCallbackRef?.current) addNoteCallbackRef.current = addNote;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
      if (containerHeight) {
        let fs = parseFloat(
          getComputedStyle(document.documentElement).fontSize
        );
        const newHeight =
          containerHeight - (withoutOutsideCard ? 10 : fs * 4.85);
        setMaxHeight(newHeight);
      }
      // eslint-disable-next-line
    }, [containerHeight, containerEl]);

    const autoHeightNoteInput = () => {
      if (textAreaEl && textAreaEl.current && textAreaEl.current.value.length) {
        if (textAreaEl.current.offsetHeight < 80) {
          textAreaEl.current.style.height =
            textAreaEl.current.scrollHeight + "px";
        }
      } else {
        textAreaEl.current.style.height = "inherit";
      }
    };

    const content = (
      <div
        className={styles.NoteHeight}
        style={containerHeight ? { height: maxHeight } : {}}
        ref={containerEl}
      >
        {isAdd && (
          <FileUploader id={type}>
            <Formik
              initialValues={{
                content: "",
                attachments: []
              }}
              onSubmit={(values, { resetForm }) =>
                doAddNote(values).then(() => {
                  resetForm({ content: "", attachments: [] });
                  textAreaEl.current.style.height = "inherit";
                })
              }
            >
              {({ values, handleChange, resetForm, setFieldValue }) => (
                //
                <React.Fragment>
                  <LoadingWrapper loading={adding}>
                    <JRCard
                      dense
                      className={`${styles.Notes} ${
                        buttonsPosition === "inline" ? styles.NotesInline : ""
                      }`}
                    >
                      <Form className={styles.NoteForm}>
                        <Field
                          innerRef={textAreaEl}
                          onChange={(e) => {
                            autoHeight && autoHeightNoteInput();
                            handleChange(e);
                          }}
                          placeholder={
                            placeholder ?? formatMessage({ id: "write-a-note" })
                          }
                          className={clsx([styles.NoteInput])}
                          as={"textarea"}
                          rows={rows}
                          name={"content"}
                          style={!resizeable ? { resize: "none" } : {}}
                        />
                        <div className={`${styles.NoteButtons}`}>
                          <FileUploader.FileUpload
                            multiple={false}
                            id={"note-upload"}
                            onCompleted={(e) => {
                              if (e !== null)
                                setFieldValue("attachments", [
                                  ...(values.attachments || []),
                                  ...e
                                ]);
                            }}
                          >
                            <IconButton
                              size={"small"}
                              className={styles.NoteAttach}
                            >
                              <AttachFileIcon />
                            </IconButton>
                          </FileUploader.FileUpload>
                          <div>
                            {showIconInButtons ? (
                              <IconButton
                                size={"small"}
                                className={styles.NoteSubmit}
                                disabled={values.content.trim().length === 0}
                                type={"submit"}
                              >
                                <SendIcon width="16" height="16" />
                              </IconButton>
                            ) : (
                              <Button
                                variant={"contained"}
                                size={"small"}
                                classes={buttonClasses}
                                className={"mr-2"}
                                disabled={values.content.length === 0}
                                type={"submit"}
                              >
                                <IntlMessages id="save" />
                              </Button>
                            )}

                            {!hideClearBtn &&
                              (showIconInButtons ? (
                                <IconButton
                                  size={"small"}
                                  disabled={values.content.length === 0}
                                  onClick={() => setFieldValue("content", "")}
                                >
                                  <ClearSharpIcon />
                                </IconButton>
                              ) : (
                                <Button
                                  variant={"outlined"}
                                  size={"small"}
                                  classes={buttonClasses}
                                  disabled={values.content.length === 0}
                                  onClick={() => setFieldValue("content", "")}
                                >
                                  <IntlMessages id="clear" />
                                </Button>
                              ))}
                          </div>
                        </div>
                      </Form>
                    </JRCard>
                  </LoadingWrapper>
                  <FileUploader.Indicator
                    value={values.attachments}
                    onDelete={(e) => setFieldValue("attachments", e)}
                  />
                </React.Fragment>
              )}
            </Formik>
          </FileUploader>
        )}
        <div className={clsx([styles.NoteList, customStyles.scrollBar])}>
          {Array.isArray(notes) &&
            notes.map((note) => (
              <div className={"d-flex"} key={note.id}>
                <UserAvatar user={note.createdBy} />
                <div className={"flex-grow-1"}>
                  <Typography>
                    {note.createdBy?.firstName + " " + note.createdBy?.lastName}
                  </Typography>
                  <Typography
                    style={{
                      fontSize: `${14 / 17}rem`,
                      color: "#a3a3a3",
                      marginBottom: `${9.8 / 17}rem`
                    }}
                  >
                    {formatDate(note.createdAt, LONG_DATE_TIME)}
                  </Typography>
                  <div>
                    <Typography
                      className={`${styles.NoteText} w-100 `}
                      noWrap={false}
                    >
                      {note.content}
                    </Typography>
                  </div>
                  <FileUploader.Indicator
                    value={note.attachments}
                    calssName={styles.NoteAttachment}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    );
    if (withoutOutsideCard) return <div className={className}>{content}</div>;

    return (
      <JRCard
        className={clsx(classes.card, className)}
        dense
        style={{
          maxHeight: containerHeight ? containerHeight : "initial",
          paddingBottom: 0
        }}
        header={
          <div className={"d-flex justify-content-between align-items-center"}>
            <Typography className={classes.header}>{title}</Typography>
          </div>
        }
        headerLine
      >
        {content}
      </JRCard>
    );
  }
);

NoteComposer.propTypes = {
  buttonsPosition: PropTypes.oneOf(["default", "inline"])
};

export default NoteComposer;
