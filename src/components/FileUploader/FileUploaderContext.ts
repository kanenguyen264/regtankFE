import * as React from "react";
import { SyntheticEvent } from "react";
import { AttachmentDtoRes } from "../../types/typings-api";

interface IFileUploaderContextOnCompleted {
  (e: AttachmentDtoRes[]): void;
}

export interface IFileUploaderContext {
  instanceId: string;
  onChange: (e: SyntheticEvent<HTMLInputElement>) => void | null;
  onCompleted: IFileUploaderContextOnCompleted | null;
  setOnCompleted: (value: IFileUploaderContextOnCompleted) => void | null;
}

const FileUploaderContext = React.createContext<IFileUploaderContext>({
  onChange: null,
  onCompleted: null,
  setOnCompleted: null,
  instanceId: "unknown"
});

export default FileUploaderContext;
