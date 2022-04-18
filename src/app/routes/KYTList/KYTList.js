import { Divider } from "@mui/material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import { RefreshButton } from "@protego/sdk/RegtankUI/v1/Button";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import {
  KYT_ACTION_ADD_TO_GROUP,
  KYT_ACTION_ADD_TO_WATCHLIST,
  KYT_ACTION_BULK_ASSIGN,
  KYT_ACTION_GET_WATCH_GROUP,
  KYT_ACTION_IMPORT_CONFIRM,
  KYT_ACTION_IMPORT_CSV,
  KYT_ACTION_REMOVE_WATCHLIST,
  KYT_ACTION_REQUEST_LIST,
  KYT_ONGOING_MONITORING,
} from "actions/KYTAction";
import { ReactComponent as RefreshIcon } from "assets/icons/IcRefresh.svg";
import Assign from "components/Assignv1";
import SearchBox from "components/SearchBoxDebounce";
import {
  TabbedListedPageActions,
  TabbedListedPageProvider,
} from "components/TabbedListedPagev1";
import { headerExportKYTListCSV } from "constants/HeaderExport";
import { BTC } from "constants/KYTOM";
import {
  KYT_ROUTE_ARCHIVE_LIST,
  KYT_ROUTE_GROUP_LIST,
  KYT_ROUTE_MY_KYT,
} from "constants/routes";
import { templateExampleForImportKytCsv } from "constants/TemplateImport";
import React, {
  createRef,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { connect, useDispatch, useSelector } from "react-redux";
import { Route, Switch, useLocation } from "react-router";
import { compose } from "recompose";
import { bindActionCreators } from "redux";
import { KYTSelectorGetIsFavorite } from "selectors/kyt";
import { countryCodeToName } from "util/country";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { snackActions } from "util/snackbarUtils";
import { getFullName, randomString } from "util/string";
import useImportDialog from "../../../components/ImportDialog";
import TabbedListedPage from "components/TabbedListedPagev1/TabbedListedPage";
import { KYTArchiveAdapter } from "../../../services/KYTService";
import GroupList from "./GroupList";
import KYTArchiveList from "./KYTArchiveList";
import styles from "./KYTList.module.scss";
import KYTNoteDialogViewer from "./KYTNoteDialogViewer";
import MyKYT from "./MyKYT";
import KYTUnsupportedAssetErrorDialog from "./KYTUnsupportedAssetErrorDialog";
import KYTOngoingMonitoringDialog from "./KYTOngoingMonitoringDialog";
import { withACL } from "../../../acl";
import withUserSettings from "util/hocs/withUserSettings";
const mapStateToProps = (state) => ({
  kytStatus: state.kyt.status,
  kytGetIsFavorite: KYTSelectorGetIsFavorite(state),
  kytList: state.kyt.list,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      kytRequestList: KYT_ACTION_REQUEST_LIST,
      kytToggleFavorite: KYT_ACTION_ADD_TO_WATCHLIST,
      kytActionRemoveFavorite: KYT_ACTION_REMOVE_WATCHLIST,
      kytActionImport: KYT_ACTION_IMPORT_CSV,
      kytActionImportConfirm: KYT_ACTION_IMPORT_CONFIRM,
      kytActionBulkAssign: KYT_ACTION_BULK_ASSIGN,
      kytActionSetOngoingMonitoring: KYT_ONGOING_MONITORING,
      kytActionAddToArchive: KYTArchiveAdapter.actionAddToArchive,
      kytActionUnarchive: KYTArchiveAdapter.actionRemoveFromArchive,
      kytWatchGroup: KYT_ACTION_GET_WATCH_GROUP,
    },
    dispatch
  );
};

const KYTList = ({
  paginationParams,
  kytActionSearchFavorite,
  kytActionImport,
  kytActionAddToArchive,
  kytActionUnarchive,
  kytToggleFavorite,
  kytActionRemoveFavorite,
  kytActionImportConfirm,
  kytWatchGroup,
  kytActionBulkAssign,
  kytActionSetOngoingMonitoring,
  kytList,
  ACL,
}) => {
  const dispatch = useDispatch();
  const { watchGroup } = useSelector((state) => state.kyt);

  const [fileRefImportKytKey, setFileRefImportKytKey] = useState(
    randomString(10)
  );
  const [noteKytId, setNoteKytId] = useState(null);
  const [selected, setSelected] = useState([]);
  const downloadTemplateRef = createRef();
  const fileRefImportKyt = createRef();
  const [onRefresh, setOnRefresh] = useState(false);
  const [dialogAssign, setDialogAssign] = useState(false);
  const [
    openOngoingMonitoringDialog,
    setOpenOngoingMonitoringDialog,
  ] = useState(false);
  const [
    typeOngoingMonitoringDialog,
    setTypeOngoingMonitoringDialog,
  ] = useState(null); // request || error
  const [listKYTError, setListKYTError] = useState([]);

  let location = useLocation();
  const [groupListCurrent, setGroupListCurrent] = React.useState([]);
  const [
    openUnsupportedAssetErrorDialog,
    setOpenUnsupportedAssetErrorDialog,
  ] = React.useState(false);

  useEffect(() => {
    /**
     * Check if change page, change location set default for dropdown
     */

    if (listKYTError?.totalKYTError) {
      setTypeOngoingMonitoringDialog("error");
      setOpenOngoingMonitoringDialog(true);
    }
  }, [listKYTError]);

  const ImportDialog = useImportDialog();

  const { formatMessage } = useIntl();

  React.useEffect(() => {
    kytWatchGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  let filterExport = JSON.parse(JSON.stringify(selected));
  filterExport = filterExport.map((select) => {
    select.fullName = getFullName(select?.lastModifiedBy);
    select.name = select?.addressDetails.wallet.name;
    select.riskCore = Math.round(select?.addressDetails?.risk?.risk) || 0;
    select.referenceId = `${
      select.referenceId ? "'" + select.referenceId : ""
    }`;
    select.currentBalance =
      Math.round(select?.addressDetails?.currentBalance, 11) || 0;
    select.lastScreenedBy = `${select?.lastModifiedBy?.firstName} ${select?.lastModifiedBy?.lastName}`;
    select.lastScreenedAt = formatDate(select?.updatedAt, LONG_DATE_TIME);
    select.address = `${select.address}`;
    select.country = select?.addressDetails?.wallet?.country
      ? countryCodeToName(select.addressDetails.wallet.country)
      : "";

    return select;
  });

  const triggerInputFile = () => {
    if (fileRefImportKyt) {
      fileRefImportKyt.current.click();
    }
  };

  const handleFileUpload = async () => {
    const file = fileRefImportKyt.current.files[0];
    const formData = new FormData();
    formData.append("file", file);
    try {
      await ImportDialog({
        init: () => kytActionImport(formData),
        onSuccess: kytActionImportConfirm,
      });
    } catch (error) {
      snackActions.error(
        <IntlMessages id={"appModule.importCsv.serverError"} />
      );
    } finally {
      setFileRefImportKytKey(randomString(10));
    }
  };

  const handleDownloadCsvTemplate = () => {
    if (downloadTemplateRef) {
      downloadTemplateRef.current.link.click();
    }
  };

  const handleAddToArchive = useCallback(() => {
    return kytActionAddToArchive(selected.map((i) => i.kytId)).then(() =>
      setSelected([])
    );
  }, [kytActionAddToArchive, selected]);

  const handleUnarchive = useCallback(() => {
    return kytActionUnarchive(selected.map((i) => i.kytId)).then(() =>
      setSelected([])
    );
  }, [kytActionUnarchive, selected]);

  const handleOnGoingMonitoring = () => {
    setOpenOngoingMonitoringDialog(true);

    setTypeOngoingMonitoringDialog("request");
    setListKYTError([]);
  };

  const saveOngoingMonitoringAction = useCallback(
    (data) => {
      let listSelected = selected?.map((item) => {
        return {
          kytId: item?.kytId,
          ...data,
        };
      });

      kytActionSetOngoingMonitoring(listSelected)
        .then((result) => {
          if (result) {
            let content = formatMessage(
              {
                id:
                  listSelected?.length > 1
                    ? "kyt.on.going.monitoringScreenings"
                    : "kyt.on.going.monitoringScreening",
              },
              {
                number: listSelected?.length,
              }
            );

            snackActions.success(content);
          }
        })
        .catch((result) => {
          /** Handle Wallet is not BTC set OM */
          if (result?.length > 0) {
            const unSuccessKyts = result?.filter((item) => !item?.success);
            const listError = {
              listKYTError: unSuccessKyts.map((item) => {
                return {
                  kytId: item?.kytRequestDto?.kytId,
                };
              }),
              totalKYTError: unSuccessKyts?.length,
              totalKYTApplied: listSelected?.length,
            };

            setListKYTError(listError);
          } else {
            /**
             * Handle error
             */
            let content =
              listSelected?.length +
              formatMessage({ id: "kyt.on.monitoring.error" }) +
              listSelected?.length +
              formatMessage({ id: "kyt.on.going.KYT" });

            snackActions.error(content);
          }
        })
        .finally(() => {
          onPressRefresh();
          setSelected([]);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kytActionSetOngoingMonitoring, selected]
  );

  const onCloseOngoingMonitoringDialog = () => {
    setOpenOngoingMonitoringDialog(false);
  };

  const templateImportKytHeaders = templateExampleForImportKytCsv.headers.map(
    (item) => {
      return {
        label: formatMessage({ id: item.label }),
        key: item.key,
      };
    }
  );

  const onPressRefresh = () => {
    setOnRefresh(!onRefresh);
  };
  const actionAddToGroupList = (value) => {
    let params = {
      kytIds: selected?.map((i) => i?.kytId),
      watchGroupId: value?.id,
    };

    dispatch(KYT_ACTION_ADD_TO_GROUP({ params: params }))
      .then((result) => {
        let message =
          selected?.map((i) => i?.kytId)?.length +
          " " +
          formatMessage({ id: "kyt.watch.group.add.success" }) +
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
  const handleAssign = () => {
    return setDialogAssign(!dialogAssign);
  };

  const onCloseAssign = () => {
    setDialogAssign(false);
  };

  const onSaveAssign = async (value) => {
    const kytIds = selected?.map((i) => i.kytId);
    const data = await kytActionBulkAssign({
      userId: value?.id,
      kytIds: kytIds,
    });
    if (data.status === 200) {
      dispatch(KYT_ACTION_REQUEST_LIST(paginationParams));
      setSelected([]);
      return snackActions.success(
        <FormattedHTMLMessage
          id="notification.success.bulkAssign"
          values={{
            total: kytIds.length,
            title: "KYT",
            user: getFullName(value),
          }}
        />
      );
    }
  };

  const setGroupListFilter = (list) => {
    setGroupListCurrent(list);
  };

  const onPressSelect = (value) => {
    const regex = new RegExp(location?.pathname);
    if (regex?.test(KYT_ROUTE_MY_KYT)) {
      /**
       * If main page get all group list
       */
      setGroupListCurrent(watchGroup);
    }
    setSelected(value);
  };

  const isDisabledSetOnGoingMonitoring =
    selected.length &&
    selected.filter((item) => item.asset !== BTC).length === selected.length;

  const handleAddItemToArchiveList = (idItemList) => {
    return kytActionAddToArchive(idItemList);
  };

  return (
    <div>
      <KYTUnsupportedAssetErrorDialog
        open={openUnsupportedAssetErrorDialog}
        onClose={() => setOpenUnsupportedAssetErrorDialog(false)}
      />
      <KYTOngoingMonitoringDialog
        open={openOngoingMonitoringDialog}
        onClose={onCloseOngoingMonitoringDialog}
        onSave={saveOngoingMonitoringAction}
        type={typeOngoingMonitoringDialog}
        selected={selected}
        errorSelected={listKYTError}
      />
      <PageHeading
        title={
          <Switch>
            <Route path={KYT_ROUTE_GROUP_LIST}>
              <IntlMessages id="group.list" />
            </Route>
            <Route path={KYT_ROUTE_ARCHIVE_LIST}>
              <IntlMessages id="archive-list" />
            </Route>
            <Route path={KYT_ROUTE_MY_KYT}>
              <IntlMessages id="url.my-kyt" />
            </Route>
          </Switch>
        }
        customUrlResolver={(_index, sub) => {
          switch (sub) {
            case "my-kyt":
              return [<IntlMessages id={"my-kyt"} />, null, false];
            case "groupList":
              return [<IntlMessages id={"group.list"} />, null, false];
            case "archiveList":
              return [<IntlMessages id={"archive-list"} />, null, false];
            case "kyt":
              return [null, KYT_ROUTE_MY_KYT, false];
            default:
              break;
          }
        }}
      />
      <TabbedListedPageProvider selected={selected} setSelected={onPressSelect}>
        <div>
          <div className={"d-flex"}>
            <input
              key={fileRefImportKytKey}
              className="d-none"
              id="selectImage"
              type="file"
              onChange={handleFileUpload}
              ref={fileRefImportKyt}
              accept=".csv"
            />
          </div>

          <Assign
            open={dialogAssign}
            onClose={onCloseAssign}
            onSave={onSaveAssign}
            screen={"KYT"}
          />
          <TabbedListedPage
            mainTabLabel={<IntlMessages id={"my-kyt"} />}
            routes={[
              KYT_ROUTE_MY_KYT,
              KYT_ROUTE_GROUP_LIST,
              KYT_ROUTE_ARCHIVE_LIST,
            ]}
            mainTabChild={
              <div className={"d-flex align-items-center"}>
                <div>
                  <TabbedListedPageActions
                    disableImport={
                      !ACL.isAllowedPermissions("KYT_MODULE_CREATE")
                    }
                    disableExport={!ACL.isAllowedPermissions("KYT_MODULE_VIEW")}
                    CSVLinkProps={{
                      ref: downloadTemplateRef,
                      id: "download_template_csv",
                      data: templateExampleForImportKytCsv.data,
                      filename: "import_kyt_template.csv",
                      headers: templateImportKytHeaders,
                      label: (
                        <IntlMessages id="appModule.importKYT"></IntlMessages>
                      ),
                    }}
                    onAction={(action) => {
                      switch (action) {
                        case "import":
                          triggerInputFile();
                          return;
                        case "downloadCsv":
                          handleDownloadCsvTemplate();
                          return;
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
                    ExportCSVProps={{
                      nameFileExport: "KYT_MyKYT",
                      dataExport: filterExport,
                      headersExportCSV: headerExportKYTListCSV,
                    }}
                    additionalActions={(ACL.isAllowedPermissions("MY_KYT_EDIT")
                      ? [
                          {
                            onClick: () =>
                              !isDisabledSetOnGoingMonitoring
                                ? handleOnGoingMonitoring()
                                : setOpenUnsupportedAssetErrorDialog(true),
                            label: (
                              <IntlMessages
                                id={"appModule.button.setMonitoring"}
                              />
                            ),
                          },
                        ]
                      : []
                    ).concat([
                      {
                        onClick: handleAssign,
                        label: <IntlMessages id="appModule.assign" />,
                      },
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
                    ])}
                  />
                </div>
                <div className={"ml-2 mr-2"}>
                  <Divider orientation="vertical" className={styles.divider} />
                </div>
                <div className={styles.refreshPadding}>
                  <RefreshButton onClick={onPressRefresh} />
                </div>
              </div>
            }
          >
            <Switch>
              <Route path={KYT_ROUTE_GROUP_LIST}>
                <GroupList
                  onRefresh={onRefresh}
                  groupListSelect={setGroupListFilter}
                />
              </Route>
              <Route path={KYT_ROUTE_ARCHIVE_LIST}>
                <KYTArchiveList onRefresh={onRefresh} />
              </Route>
              <Route path={KYT_ROUTE_MY_KYT}>
                <MyKYT
                  onRefresh={onRefresh}
                  onAddItemToArchiveList={handleAddItemToArchiveList}
                />
              </Route>
            </Switch>
          </TabbedListedPage>
          <KYTNoteDialogViewer
            id={noteKytId}
            onClose={() => setNoteKytId(null)}
          />
        </div>
      </TabbedListedPageProvider>
    </div>
  );
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPagination,
  withACL,
  withUserSettings
)(memo(KYTList));
