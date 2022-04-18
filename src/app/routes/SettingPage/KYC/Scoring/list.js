import { Box, Grid } from "@mui/material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import {
  TabbedListedPage,
  TabbedListedPageActions,
  TabbedListedPageProvider,
} from "components/TabbedListedPagev1";
import { headerExportScoringCSV } from "constants/HeaderExport";
import {
  SETTING_SCORING_ROUTE_ARCHIVE,
  SETTING_SCORING_ROUTE_INDEX,
} from "constants/routes";
import React, { Fragment, memo, useCallback, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { Route, Switch, withRouter } from "react-router";
import { compose } from "recompose";
import { SettingScoringArchiveAdapter } from "services/SettingService";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { snackActions } from "util/snackbarUtils";
import ScoringArchive from "./components/ScoringArchive";
import ScoringList from "./components/ScoringList";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import styles from "./list.module.scss";

const SettingScoringPage = ({ paginationParams }) => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState([]);
  const [onRefresh, setOnRefresh] = useState(false);

  const { formatMessage } = useIntl();

  let filterExport = JSON.parse(JSON.stringify(selected));
  // filterExport = filterExport.map((select) => {
  //   select.isActive = select.isActive
  //     ? formatMessage({ id: "appModule.status.active" })
  //     : formatMessage({ id: "appModule.status.dormant" });
  //   select.updatedAt = formatDate(select.updatedAt, LONG_DATE_TIME);

  //   return select;
  // });

  const handleAddToArchive = useCallback(() => {
    let checkIsActive = selected.find((i) => {
      return i.isActive ? i.isActive : false;
    });
    if (!checkIsActive) {
      return dispatch(
        SettingScoringArchiveAdapter.actionAddToArchive(
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
      SettingScoringArchiveAdapter.actionRemoveFromArchive(
        selected.map((i) => i.id)
      )
    ).then(() => {
      setSelected([]);
      setOnRefresh(!onRefresh);
    });
    // eslint-disable-next-line
  }, [dispatch, selected]);
  const onPressSelect = (value) => {
    // const regex = new RegExp(location?.pathname);
    // if (regex?.test(KYT_ROUTE_MY_KYT)) {
    //   /**
    //    * If main page get all group list
    //    */
    //   setGroupListCurrent(watchGroup);
    // }
    setSelected(value);
  };
  return (
    <div className={styles.riskLevelScoringWrapper}>
      <JRCard header={"Risk Level Scoring"} headerLine>
        <TabbedListedPageProvider
          selected={selected}
          //setSelected={setSelected}
          setSelected={onPressSelect}
        >
          <TabbedListedPage
            mainTabLabel={<IntlMessages id="setting.scoring"></IntlMessages>}
            noWatchList
            routes={[
              SETTING_SCORING_ROUTE_INDEX,
              SETTING_SCORING_ROUTE_ARCHIVE,
            ]}
            mainTabChild={
              <Grid container justifyContent="flex-end">
                <Grid container item xs={6} sm={6} justifyContent="flex-end">
                  <div className={styles.bullAction}>
                    <TabbedListedPageActions
                      ExportCSVProps={{
                        nameFileExport: "scoring",
                        dataExport: filterExport,
                        headersExportCSV: headerExportScoringCSV,
                      }}
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
                  </div>
                </Grid>
              </Grid>
            }
          >
            <Switch>
              <Route
                mainTabLabel={
                  <IntlMessages id="setting.scoring"></IntlMessages>
                }
                path={SETTING_SCORING_ROUTE_ARCHIVE}
              >
                <ScoringArchive onRefresh={onRefresh} />
              </Route>
              <Route path={SETTING_SCORING_ROUTE_INDEX}>
                <ScoringList onRefresh={onRefresh} />
              </Route>
            </Switch>
          </TabbedListedPage>
        </TabbedListedPageProvider>
      </JRCard>
    </div>
  );
};

export default compose(withRouter, withPagination)(memo(SettingScoringPage));
