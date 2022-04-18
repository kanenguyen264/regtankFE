import * as React from "react";
import { Dispatch, SetStateAction } from "react";
type PageType = "main" | "watch" | "archive";

interface TabbedListedPageProviderProps<T> {
  selected?: Array<T>;
  setSelected?: Dispatch<SetStateAction<Array<T>>>;
}
export interface TabbedListedContextProps<T = any>
  extends TabbedListedPageProviderProps<T> {
  page?: PageType;
  setPage?: (type: PageType) => void;
}
export const TabbedListedContext = React.createContext<TabbedListedContextProps>(
  {}
);
function TabbedListedPageProvider<T = any>(
  props: React.PropsWithChildren<TabbedListedPageProviderProps<T>>
) {
  const [page, setPage] = React.useState<PageType | null>(null);
  return (
    <TabbedListedContext.Provider
      value={{
        page,
        setPage,
        selected: props.selected,
        setSelected: props.setSelected
      }}
    >
      {props.children}
    </TabbedListedContext.Provider>
  );
}
export default TabbedListedPageProvider;
