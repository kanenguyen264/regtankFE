import * as React from "react";
import { AwaitPayloadAction } from "@protego/sdk/actions/utils";
import { NoteDtoRes } from "types/typings-api";
import { RootState } from "types/typings";

export interface NoteDialogViewerProps
  extends React.HTMLAttributes<HTMLElement> {
  fetcher: AwaitPayloadAction<{ id: string }, { data: NoteDtoRes[] }>;
  id: string;
  onClose: () => void;
  selector: (state: RootState) => NoteDtoRes[];
}

export type NoteDialogViewerImplementedProps = Omit<
  NoteDialogViewerProps,
  "fetcher" | "selector"
>;

export default function NoteDialogViewer(
  props: NoteDialogViewerProps
): JSX.Element;
