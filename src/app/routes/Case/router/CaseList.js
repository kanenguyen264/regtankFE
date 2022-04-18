import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import {
  CASE_ACTION_ADD_CASES_WATCHLIST,
  CASE_ACTION_GET_LIST_ARCHIVE,
  CASE_ACTION_REMOVE_CASES_WATCHLIST,
  CASE_ACTION_SEARCH,
  CASE_ACTION_GET_WATCH_GROUP,
  CASE_ACTION_ADD_TO_GROUP,
} from "actions/CaseAction";
import {
  TabbedListedPageActions,
  TabbedListedPageProvider,
} from "components/TabbedListedPagev1";
import TabbedListedPage from "components/TabbedListedPagev1/TabbedListedPage";
import { headerExportCaseCSV } from "constants/HeaderExport";
import React, { Fragment, memo } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, withRouter, useLocation } from "react-router";
import { compose } from "recompose";
import { CaseArchiveAdapter } from "services/CaseService";
import { countryCodeToName } from "util/country";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { getFullName } from "util/string";
import {
  CASE_ROUTE_ARCHIVE_LIST,
  CASE_ROUTE_GROUP_LIST,
  CASE_ROUTE__INDEX,
} from "../routes";
import CaseArchiveList from "./CaseArchiveList";
import MyCase from "./MyCase";
import { getKycStatusTranslate } from "util/kycStatus";
import GroupList from "./GroupList";
import { snackActions } from "util/snackbarUtils";

const CaseList = ({ paginationParams, match }) => {
  const [selected, setSelected] = React.useState([]);
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const { watchGroup } = useSelector((state) => state.case);
  const [groupListCurrent, setGroupListCurrent] = React.useState([]);
  let location = useLocation();

  React.useEffect(() => {
    dispatch(CASE_ACTION_GET_WATCH_GROUP());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const addFavorite = (id, isWatchList) => {
    dispatch(
      (isWatchList
        ? CASE_ACTION_REMOVE_CASES_WATCHLIST
        : CASE_ACTION_ADD_CASES_WATCHLIST)({ caseId: [id] })
    ).then((result) => {
      dispatch(CASE_ACTION_GET_LIST_ARCHIVE(paginationParams));
    });
  };

  let filterExport = JSON.parse(JSON.stringify(selected));
  filterExport = filterExport.map((select) => {
    select.fullName = getFullName(select?.latestKyc?.lastModifiedBy);
    select.nationality = select?.latestKyc?.individualRequest?.nationality
      ? countryCodeToName(
          select.latestKyc?.individualRequest?.nationality,
          "demonym"
        )
      : "";
    select.dateOfBirth = formatDate(
      select?.latestKyc?.individualRequest?.dateOfBirth
    );
    select.name = select?.latestKyc?.individualRequest?.name;
    select.KYCRiskCore =
      Math.round(select?.latestKyc?.individualRiskScore?.risk) || 0;
    select.KYTRiskCore =
      Math.round(select?.latestKyt?.addressDetails?.risk?.risk) || 0;
    select.kycUpdatedAt = formatDate(
      select.latestKyc?.updatedAt,
      LONG_DATE_TIME
    );
    select.kytFullName = getFullName(select?.latestKyt?.lastModifiedBy);
    select.kytUpdatedAt = formatDate(
      select.latestKyt?.updatedAt,
      LONG_DATE_TIME
    );
    const kycStatus = getKycStatusTranslate(select?.latestKyc?.status);
    if (select.latestKyc) {
      select.latestKyc.status = formatMessage({
        id: kycStatus,
      });
    } else {
      select.latestKyc = { status: null };
    }
    return select;
  });

  const handleAddToArchive = React.useCallback(() => {
    return dispatch(
      CaseArchiveAdapter.actionAddToArchive(selected.map((i) => i.caseId))
    ).then(() => setSelected([]));
  }, [dispatch, selected]);

  const handleUnarchived = React.useCallback(() => {
    return dispatch(
      CaseArchiveAdapter.actionRemoveFromArchive(selected.map((i) => i.caseId))
    ).then(() => setSelected([]));
  }, [dispatch, selected]);

  const actionAddToGroupList = (value) => {
    let params = {
      caseIds: selected?.map((i) => i?.caseId),
      watchGroupId: value?.id,
    };

    dispatch(CASE_ACTION_ADD_TO_GROUP({ params: params }))
      .then((result) => {
        let message =
          selected?.map((i) => i?.caseId)?.length +
          " " +
          formatMessage({ id: "case.watch.group.add.success" }) +
          " " +
          value?.name;
        snackActions.success(message);
      })
      .catch((err) => {
        snackActions.error(err?.toString());
      })
      .finally(() => {
        setSelected([]);
      });
  };

  const setGroupListFilter = (list) => {
    setGroupListCurrent(list);
  };

  const onPressSelect = (value) => {
    const regex = new RegExp(location?.pathname);
    if (regex?.test(CASE_ROUTE__INDEX)) {
      /**
       * If main page get all group list
       */
      setGroupListCurrent(watchGroup);
    }
    setSelected(value);
  };

  const handleAddItemToArchiveList = (idItemList) => {
    return dispatch(CaseArchiveAdapter.actionAddToArchive(idItemList));
  };

  return (
    <Fragment>
      <PageHeading
        title={
          <Switch>
            <Route path={CASE_ROUTE_GROUP_LIST}>
              <IntlMessages id={"case.groupList.breadcrumb.header"} />
            </Route>
            <Route path={CASE_ROUTE_ARCHIVE_LIST}>
              <IntlMessages id={"archive-list"} />
            </Route>
            <Route path={CASE_ROUTE__INDEX}>
              <IntlMessages id={"case.breadcrumb.title"} />
            </Route>
          </Switch>
        }
        customUrlResolver={(_index, sub) => {
          switch (sub) {
            case "case":
              return [
                <IntlMessages id={"case.breadcrumb.title"} />,
                null,
                false,
              ];
            case "grouplist":
              return [<IntlMessages id={"group.list"} />, false, false];
            case "archivelist":
              return [<IntlMessages id={"archive-list"} />, false, false];
            default:
              return null;
          }
        }}
        match={match}
      />
      <TabbedListedPageProvider selected={selected} setSelected={onPressSelect}>
        <TabbedListedPage
          mainTabLabel={
            <IntlMessages id="case.breadcrumb.title"></IntlMessages>
          }
          routes={[
            CASE_ROUTE__INDEX,
            CASE_ROUTE_GROUP_LIST,
            CASE_ROUTE_ARCHIVE_LIST,
          ]}
          mainTabChild={
            <div className={"d-flex align-items-center"}>
              <div>
                <TabbedListedPageActions
                  ExportCSVProps={{
                    nameFileExport: "CaseManagement_MyCase",
                    dataExport: filterExport,
                    headersExportCSV: headerExportCaseCSV,
                  }}
                  onAction={(action) => {
                    switch (action) {
                      case "addToArchive":
                        return handleAddToArchive();
                      case "unarchived":
                        return handleUnarchived();
                      default:
                        return;
                    }
                  }}
                  selectedItems={selected}
                  additionalActions={[
                    {
                      label: <IntlMessages id={"group.list.add.dropdown"} />,
                      subMenu:
                        groupListCurrent && groupListCurrent.length > 0
                          ? groupListCurrent.map((group) => {
                              return {
                                label: group.name,
                                onClick: () => actionAddToGroupList(group),
                              };
                            })
                          : [
                              {
                                label: (
                                  <IntlMessages
                                    id={"group.list.dropdown.no.group"}
                                  />
                                ),
                                onClick: () => {},
                                additionalProps: { disabled: true },
                              },
                            ],
                    },
                  ]}
                />
              </div>
            </div>
          }
        >
          <Switch>
            <Route path={CASE_ROUTE_ARCHIVE_LIST}>
              <CaseArchiveList addFavorite={addFavorite} />
            </Route>
            <Route path={CASE_ROUTE_GROUP_LIST}>
              <GroupList groupListSelect={setGroupListFilter} />
            </Route>
            <Route path={CASE_ROUTE__INDEX}>
              <MyCase
                addFavorite={addFavorite}
                onAddItemToArchiveList={handleAddItemToArchiveList}
              />
            </Route>
          </Switch>
        </TabbedListedPage>
      </TabbedListedPageProvider>
    </Fragment>
  );
};

export default compose(withRouter, withPagination)(memo(CaseList));
