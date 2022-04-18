import * as React from "react";

export interface FileUploaderProps {
  children: any;
  title?: string;
}
export default function FileUploader(props: FileUploaderProps): JSX.Element;

export interface FileUploadProps {
  accept?: string;
  children: any;
  multiple?: boolean;
  onChange?: React.ChangeEvent<HTMLInputElement>;
}
declare function FileUpload(props: FileUploadProps): JSX.Element;
// @ts-ignore
FileUploader.FileUpload = FileUpload;
