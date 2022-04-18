import { LinearProgress } from "@material-ui/core";
import {
  ATTC_ACTION_CLOSE,
  ATTC_ACTION_REMOVE
} from "actions/AttachmentActions";
//@ts-ignore
import { ReactComponent as FileIconOutlined } from "assets/icons/attachmentIcon.svg";
//@ts-ignore
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
//@ts-ignore
import { ReactComponent as DownloadIcon } from "assets/icons/downloadIcon.svg";
import clsx from "clsx";
import { uniqBy } from "lodash";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AttachmentDtoRes } from "types/typings-api";
import { IAttachmentReducerStateItem } from "../../reducers/AttachmentReducer";
import FileUploaderService from "../../services/FileUploaderService";
//@ts-ignore
import styles from "./FileUploader.module.scss";
import FileUploaderContext from "./FileUploaderContext";

interface FileUploaderIndicatorProps {
  onDelete: (args: AttachmentDtoRes[]) => void;
  value: AttachmentDtoRes[];
}

function executeDownloadFile(file: AttachmentDtoRes) {
  FileUploaderService.download(file.id, file.name);
}

const FileUploaderIndicator = function FileUploaderIndicator(
  props: FileUploaderIndicatorProps
) {
  const context = React.useContext(FileUploaderContext),
    isInsideUploader = typeof context.onChange === "function",
    uploadList = useSelector((state) =>
      Object.values(state.attachment.list[context.instanceId] || {})
    ),
    dispatch = useDispatch(),
    finalValues = React.useMemo<
      Array<IAttachmentReducerStateItem | AttachmentDtoRes>
    >(() => {
      return uniqBy(
        [].concat(
          Object.values(uploadList).filter((item) =>
            isInsideUploader ? item.instanceId === context.instanceId : true
          ),
          props.value
        ),
        "name"
      );
      // eslint-disable-next-line
    }, [props.value, uploadList]);

  React.useEffect(() => {
    if (props.value.length === 0) {
      dispatch(ATTC_ACTION_CLOSE({ id: context.instanceId }));
    }
    // eslint-disable-next-line
  }, [props.value]);

  return (
    <div
      className={
        isInsideUploader ? styles.UploadItemWrap : styles.UploadedItemWrap
      }
    >
      {
        // eslint-disable-next-line
        finalValues.map((v) => {
          if (typeof v === "undefined") return null;
          if ("file" in v && v.file.name) {
            if (isInsideUploader)
              //v is IAttachmentItem
              return (
                <div className="position-relative">
                  <div
                    className={`${styles.UploadItem}`}
                    key={`${v.name}--uploading`}
                  >
                    <div className="d-flex align-items-center flex-grow-1">
                      <span
                        className={"d-inline-flex"}
                        style={{ flex: "0 0 auto" }}
                      >
                        <FileIconOutlined />
                      </span>
                      <span className={styles.FileName}>{v.file.name}</span>
                    </div>
                    <div
                      className={styles.CloseIcon}
                      onClick={() => {
                        dispatch(
                          ATTC_ACTION_REMOVE({
                            file: v.file,
                            id: context.instanceId
                          })
                        );
                        const afterDel = [...props.value],
                          index = afterDel.findIndex(
                            (i) => i.name === v.file.name
                          );
                        if (index >= 0) afterDel.splice(index, 1);
                        props.onDelete(afterDel);
                      }}
                    >
                      <DeleteIcon />
                    </div>
                  </div>
                  <div
                    className={`${styles.Progress} ${
                      v.progress === 100 ? styles.ProgressDone : ""
                    }`}
                  >
                    <LinearProgress
                      variant={"determinate"}
                      value={v.progress}
                    />
                  </div>
                </div>
              );
            return null;
          }

          if (!isInsideUploader) {
            return (
              <div className={clsx(styles.UploadedItem, styles.Uploaded)}>
                <span className={styles.FileInfo}>
                  <span className="d-inline-flex">
                    <FileIconOutlined />
                  </span>
                  <span className={styles.FileName}>{v.name}</span>
                </span>
                <span
                  className={styles.FileDownloadIcon}
                  key={`${v.name}`}
                  onClick={() => executeDownloadFile(v as AttachmentDtoRes)}
                >
                  <DownloadIcon />
                </span>
              </div>
            );
          }
        })
      }
    </div>
  );
};

export default FileUploaderIndicator;
