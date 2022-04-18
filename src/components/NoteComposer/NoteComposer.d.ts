import {
  WithNoteFetcherInjectedProps,
  WithNoteFetcherProps
} from "../withNoteFetcher";
import { StyledComponentProps } from "@material-ui/styles";
import React from "react";

interface NoteComposerProps
  extends StyledComponentProps<"card" | "header">,
    WithNoteFetcherInjectedProps,
    WithNoteFetcherProps {
  addNoteButtonTitle?:React.ReactNode,
  addNoteCallbackRef?: React.RefObject<() => void>;
  title?: React.ReactNode;
  withoutOutsideCard?: boolean;
  containerHeight?: String | Number;
  scrollBarColor?: string;
}

export type NoteComposerEnhancedProps = Omit<
  NoteComposerProps,
  "selector" | "fetcher" | "saver" | "loading" | "notes" | "onClose"
>;

export default function NoteComposer(props: NoteComposerProps): JSX.Element;
