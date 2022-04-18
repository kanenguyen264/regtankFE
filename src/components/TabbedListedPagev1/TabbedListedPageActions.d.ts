import { ReactNode } from "react";

export type TabbedListedPageActionTypes =
  | "import"
  | "downloadCsv"
  | "exportSelected"
  | "addToArchive"
  | "addToWatchList"
  | "removeFromWatchList"
  | "unarchived";

export interface BulkAction {
  onClick?: (selected) => void;
  label: ReactNode | any;
  additionalProps?: { [string]: any };
  subMenu?: Array[BulkAction];
}

export interface TabbedListedPageActionsProps {
  CSVLinkProps?: {
    [key: string]: any;
  };
  ExportCSVProps: {
    [key: string]: any;
  };
  onAction(action: TabbedListedPageActionTypes): Promise<void> | void;
  disableExport?: boolean;
  disabledWatchList?: boolean;
  selectedItems: Array<any>;
  additionalActions?: Array<BulkAction>;
  disableImport?: boolean;
}

export default function TabbedListedPageActions(
  props: TabbedListedPageActionsProps
): JSX.Element;
