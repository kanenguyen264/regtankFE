//@flow
import { Tab, Tabs } from "@mui/material";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import clsx from "clsx";
import React from "react";
import { useHistory, useLocation } from "react-router";
import { TabbedListedContext } from "./TabbedListedContext";
import styles from "./TabbedListedPage.module.scss";
/**
 *
 * @param {TabbedListedPageProps} props
 * @returns {JSX.Element}
 * @constructor
 */
function TabbedListedPage(props) {
  const context = React.useContext(TabbedListedContext),
    location = useLocation(),
    history = useHistory(),
    noArchiveList = props.noArchiveList ?? false,
    noWatchList = props.noWatchList ?? false;
  React.useEffect(() => {
    const index = props.routes.findIndex((r) => {
      const regex = new RegExp(location.pathname);
      return regex.test(r);
    });
    if (index >= 0)
      context.setPage(
        ["main", !noWatchList && "watch", "archive"].filter(Boolean)[index]
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div
      className={clsx(styles.Container, { [props.className]: props.className })}
    >
      {props?.title && (
        <div className={clsx(styles.heading)}>{props.title}</div>
      )}

      <Tabs
        {...props?.tabsProps}
        value={location.pathname}
        onChange={(e, newValue) => {
          history.push(newValue);
        }}
      >
        <Tab
          label={props.mainTabLabel}
          value={props.routes[0]}
          data-cy={"tabMain"}
        />

        {!noWatchList && (
          <Tab
            label={<IntlMessages id={"group.lists"} />}
            value={props.routes[1]}
            data-cy={"tabWatch"}
          />
        )}

        {!noArchiveList && (
          <Tab
            label={<IntlMessages id={"archive-list"} />}
            value={props.routes[noWatchList ? 1 : 2]}
            data-cy={"tabArchive"}
          />
        )}
        <div className={styles.mainTabChild}>{props.mainTabChild}</div>
      </Tabs>
      {props.children}
    </div>
  );
}

export default TabbedListedPage;
