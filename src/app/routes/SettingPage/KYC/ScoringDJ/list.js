import { Box, Grid, Typography } from "@mui/material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import {
  TabbedListedPage,
  TabbedListedPageActions,
  TabbedListedPageProvider,
} from "components/TabbedListedPagev1";
import {
  SETTING_DJ_SCORING_ROUTE_ARCHIVE,
  SETTING_DJ_SCORING_ROUTE_INDEX,
} from "constants/routes";
import React, { Fragment, memo, useCallback, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, withRouter } from "react-router";
import { compose } from "recompose";
import { SettingDJScoringArchiveAdapter } from "services/SettingService";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { snackActions } from "util/snackbarUtils";
import ScoringArchive from "./Tabs/ScoringArchive";
import ScoringList from "./Tabs/ScoringList";
import styles from "./list.module.scss";

const SettingScoringPage = () => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState([]);
  const [onRefresh, setOnRefresh] = useState(false);

  const { formatMessage } = useIntl();

  let filterExport = JSON.parse(JSON.stringify(selected));
  filterExport = filterExport.map((select) => {
    select.isActive = select.isActive
      ? formatMessage({ id: "appModule.status.active" })
      : formatMessage({ id: "appModule.status.dormant" });
    select.updatedAt = formatDate(select.updatedAt, LONG_DATE_TIME);

    return select;
  });

  const handleAddToArchive = useCallback(() => {
    let checkIsActive = selected.find((i) => {
      return i.isActive ? i.isActive : false;
    });
    if (!checkIsActive) {
      return dispatch(
        SettingDJScoringArchiveAdapter.actionAddToArchive(
          selected.map((i) => i.id)
        )
      ).then(() => {
        setSelected([]);
        setOnRefresh(!onRefresh);
      });
    }
    snackActions.error(<IntlMessages id="cannotArchiveActiveSetting" />);

    // eslint-disable-next-line
  }, [dispatch, selected]);

  const handleUnarchive = useCallback(() => {
    return dispatch(
      SettingDJScoringArchiveAdapter.actionRemoveFromArchive(
        selected.map((i) => i.id)
      )
    ).then(() => {
      setSelected([]);
      setOnRefresh(!onRefresh);
    });
    // eslint-disable-next-line
  }, [dispatch, selected]);

  return (
    <div className={styles.riskAssementSettingDJ}>
      <TabbedListedPageProvider selected={selected} setSelected={setSelected} className="TabbedListProviderWrapper">
        <TabbedListedPage
          mainTabLabel={<IntlMessages id="setting.riskMatrix"></IntlMessages>}
          noWatchList
          tabsProps={{
            TabIndicatorProps: { children: <span /> },
            className: styles.TabsRoot,
          }}
          title={
            <Typography variant={"titleForm"}>
              Risk Assessment Settings
            </Typography>
          }
          className={styles.TabbedListedPage}
          routes={[
            SETTING_DJ_SCORING_ROUTE_INDEX,
            SETTING_DJ_SCORING_ROUTE_ARCHIVE,
          ]}
          mainTabChild={
            <Grid container justifyContent="flex-end">
              <Grid
                item
                container
                xs={6}
                justifyContent="flex-end"
              >
                <TabbedListedPageActions
                  onAction={(action) => {
                    switch (action) {
                      case "addToArchive":
                        handleAddToArchive();
                        return;
                      case "unarchived":
                        handleUnarchive();
                        return;
                      default:
                        return;
                    }
                  }}
                  selectedItems={selected}
                  disabledWatchList={true}
                  disableExport={true}
                  disableSetOnGoingMonitoring={true}
                />
              </Grid>
            </Grid>
          }
        >
          <Switch>
            <Route
              mainTabLabel={
                <IntlMessages id="setting.riskMatrix"></IntlMessages>
              }
              path={SETTING_DJ_SCORING_ROUTE_ARCHIVE}
            >
              <ScoringArchive onRefresh={onRefresh} />
            </Route>
            <Route path={SETTING_DJ_SCORING_ROUTE_INDEX}>
              <ScoringList onRefresh={onRefresh} />
            </Route>
          </Switch>
        </TabbedListedPage>
      </TabbedListedPageProvider>
    </div>
  );
};

export default compose(withRouter, withPagination)(memo(SettingScoringPage));
