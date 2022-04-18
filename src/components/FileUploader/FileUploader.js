//@flow
import {
  ATTC_ACTION_ADD,
  ATTC_ACTION_COMPLETE,
  ATTC_ACTION_PROGRESS
} from "actions/AttachmentActions";
import { AxiosRequestConfig } from "axios";
import type { FileUploadProps } from "components/FileUploader/FileUploader";
import FileUploaderContext from "components/FileUploader/FileUploaderContext";
import FileUploaderIndicator from "components/FileUploader/FileUploaderIndicator";
import React from "react";
import { useDispatch } from "react-redux";
import FileUploaderService from "../../services/FileUploaderService";

/**
 *
 * @param {FileUploaderProps} props
 * @returns {null}
 * @constructor
 */
function FileUploader(props) {
  const { children, id } = props;
  const uploadDispatch = useDispatch();
  const onCompleted = React.useRef(null);

  const attachFile = (e) => {
    const files = [...e.target.files];
    uploadDispatch(
      ATTC_ACTION_ADD({
        id,
        files: e.target.files
      })
    );
    e.target.value = "";
    // noinspection JSIgnoredPromiseFromCall
    Promise.all(files.map((file) => {
        const form = new FormData();
        form.append("files", file);
        const config: AxiosRequestConfig = {
          onUploadProgress(e) {
            const percentage = Math.round((e.loaded * 100) / e.total);
            uploadDispatch(
              ATTC_ACTION_PROGRESS({ file, progress: percentage, id })
            );
          }
        };
        return FileUploaderService.post(form, config).then((response) => {
          const responseData = response.data[0];
          uploadDispatch(ATTC_ACTION_COMPLETE({ file, id }));
          return responseData;
        });
      })
    ).then((fullList) => {
      onCompleted.current(fullList);
    });
  };

  return (
    <FileUploaderContext.Provider
      value={{
        onChange: attachFile,
        onCompleted: onCompleted.current,
        setOnCompleted: (cb) => {
          onCompleted.current = cb;
        },
        instanceId: id
      }}
    >
      {children}
    </FileUploaderContext.Provider>
  );
}

FileUploader.FileUpload = function FileUpload(props: FileUploadProps) {
  const context = React.useContext(FileUploaderContext),
    onChange =
      typeof context.onChange === "function"
        ? (...args) => {
            context.setOnCompleted(props.onCompleted);
            context.onChange(...args);
          }
        : props.onChange,
    { multiple, accept, children } = props;
  // React.useEffect(() => {
  //   if (typeof context.setOnCompleted === "function")
  //     context.setOnCompleted(props.onCompleted);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [context.setOnCompleted,props.onCompleted]);
  return (
    <>
      <input
        style={{ display: "none" }}
        id={context.instanceId}
        accept={accept}
        multiple={multiple}
        type={"file"}
        onChange={onChange}
      />
      <label htmlFor={context.instanceId}>
        {React.cloneElement(React.Children.only(children), {
          component: "span"
        })}
      </label>
    </>
  );
};
FileUploader.Indicator = FileUploaderIndicator;

export default FileUploader;
