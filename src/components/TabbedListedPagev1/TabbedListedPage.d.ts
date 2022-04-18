import * as React from "react";

export interface TabbedListedPageProps extends React.PropsWithChildren<{}> {
  mainTabLabel: string;
  noWatchList?: boolean;
  routes: string[];
}
export default function TabbedListedPage(
  props: TabbedListedPageProps
): JSX.Element;
