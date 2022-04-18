import { Divider, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import { RefreshButton } from "@protego/sdk/RegtankUI/v1/Button";
import DropdownItem from "@protego/sdk/RegtankUI/v1/DropdownItem";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import {
  KYC_ACTION_ADD_TO_GROUP,
  KYC_ACTION_ADD_TO_WATCHLIST,
  KYC_ACTION_BULK_ASSIGN,
  KYC_ACTION_GET_KYC_REQUESTS,
  KYC_ACTION_GET_WATCH_GROUP,
  KYC_ACTION_IMPORT_CONFIRM,
  KYC_ACTION_IMPORT_CSV,
  KYC_ACTION_REMOVE_FROM_WATCH_GROUP,
  KYC_ACTION_REMOVE_WATCHLIST,
} from "actions/KYCAction";
import Assign from "components/Assignv1";
import ExportCSV from "components/ExportCSVv1";
import useImportDialog from "components/ImportDialog";
import {
  TabbedListedPageActions,
  TabbedListedPageProvider,
} from "components/TabbedListedPagev1";
import TabbedListedPage from "components/TabbedListedPagev1/TabbedListedPage";
import { headerExportKYCListCSV } from "constants/HeaderExport";
import {
  KYC_ROUTE_KYC_ARCHIVE_LIST,
  KYC_ROUTE_KYC_GROUP_LIST,
  KYC_ROUTE_MY_KYC,
} from "constants/routes";
import { templateExampleForImportKycCsv } from "constants/TemplateImport";
import React, { createRef, Fragment, memo, useCallback, useState } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { connect, useDispatch, useSelector } from "react-redux";
import { Route, Switch, useLocation } from "react-router";
import { compose } from "recompose";
import { bindActionCreators } from "redux";
import { KYCArchiveAdapter } from "services/KYCService";
import { countryCodeToName } from "util/country";
import { formatDate, LONG_DATE_TIME } from "util/date";
import withUserSettings from "util/hocs/withUserSettings";
import { getKycStatusTranslate } from "util/kycStatus";
import { snackActions } from "util/snackbarUtils";
import { getFullName, randomString } from "util/string";
import { withACL } from "../../../../acl";
import useOnGoingMonitoringPrompt from "./dialogs/OnGoingMonitoringPrompt";
import GroupList from "./GroupList";
import KYCArchiveList from "./KYCArchiveList";
import styles from "./KYCList.module.scss";
import MyKYC from "./MyKYC";

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      kycActionRemoveFavorite: KYC_ACTION_REMOVE_WATCHLIST,
      toggleFavorite: KYC_ACTION_ADD_TO_WATCHLIST,
      kycActionImportCsv: KYC_ACTION_IMPORT_CSV,
      kycActionImportConfirm: KYC_ACTION_IMPORT_CONFIRM,
      kycActionBulkAssign: KYC_ACTION_BULK_ASSIGN,
      kycActionAddToArchive: KYCArchiveAdapter.actionAddToArchive,
      kycActionUnarchive: KYCArchiveAdapter.actionRemoveFromArchive,
      kycWatchGroup: KYC_ACTION_GET_WATCH_GROUP,
    },
    dispatch
  );

const KYCList = ({
  match,
  paginationParams,
  kycActionImportCsv,
  kycActionImportConfirm,
  kycActionAddToArchive,
  kycActionUnarchive,
  kycWatchGroup,
  kycActionBulkAssign,
  ACL,
}) => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState([]);
  const [fileRefKey, setFileRefKey] = useState(randomString(10));
  const fileRef = createRef();
  const downloadTemplateRef = createRef();
  const { formatMessage } = useIntl();
  const importDialog = useImportDialog();
  const [onRefresh, setOnRefresh] = useState(false);
  const { watchGroup } = useSelector((state) => state.kyc);
  const [dialogAssign, setDialogAssign] = useState(false);
  const [groupListCurrent, setGroupListCurrent] = React.useState([]);
  const [groupListSelect, setGroupListSelect] = React.useState();
  const stringToday = "_" + formatDate(new Date(), "YYYYMMDD");

  const location = useLocation();
  const handleOnGoingMonitoring = useOnGoingMonitoringPrompt();

  const CustomDropdownItem = withStyles({
    root: {
      "&[disabled]": {
        cursor: "not-allowed",
      },
    },
  })(DropdownItem);

  const templateImportKycData = [
    {
      first_name: "John",
      middle_name: "Rob",
      last_name: "Smith",
      gender: "MALE",
      email: "john.smith@mail.com",
      phone: "85640976",
      address_1: "23 Broad St",
      address_2: "San Francisco",
      date_of_birth: "23/1/1972",
      year_of_birth: "1972",
      place_of_birth: "SG",
      nationality: "SG",
      country_of_residence: "US",
      government_id_number: "EN-05-10092",
      id_issuing_country: "US",
      reference: "CaseNum0012",
      enable_re_screening: "FALSE",
      enable_ongoing_monitoring: "FALSE",
      assignee: "assignee@email.com",
    },
    {},
    {
      first_name: formatMessage({ id: "kyc.import.template.instruction" }),
    },
    {
      first_name: formatMessage({ id: "kyc.import.template.instruction.1" }),
    },
    {
      first_name: formatMessage({ id: "kyc.import.template.instruction.2" }),
    },
    {
      first_name: formatMessage({ id: "kyc.import.template.instruction.3" }),
    },
    {
      first_name: formatMessage({ id: "kyc.import.template.instruction.4" }),
    },
    {},
    {
      first_name: formatMessage({ id: "form.firstName" }),
      last_name: formatMessage({
        id: "kyc.import.template.instruction.string",
      }),
    },
    {
      first_name: formatMessage({ id: "form.middleName" }),
      last_name: formatMessage({
        id: "kyc.import.template.instruction.string",
      }),
    },
    {
      first_name: formatMessage({ id: "form.lastName" }),
      last_name: formatMessage({
        id: "kyc.import.template.instruction.string",
      }),
    },
    {
      first_name: formatMessage({ id: "screening.result.Gender" }),
      last_name: "MALE | FEMALE | UNSPECIFIED",
    },
    {
      first_name: formatMessage({ id: "appModule.requestForm.email" }),
      last_name: "xxx@yyy.zzz",
    },
    {
      first_name: formatMessage({ id: "appModule.phone" }),
      last_name: formatMessage({
        id: "kyc.import.template.instruction.number",
      }),
    },
    {
      first_name: formatMessage({ id: "address-line-1" }),
      last_name: formatMessage({
        id: "kyc.import.template.instruction.string",
      }),
    },
    {
      first_name: formatMessage({ id: "address-line-2" }),
      last_name: formatMessage({
        id: "kyc.import.template.instruction.string",
      }),
    },
    {
      first_name: formatMessage({ id: "kyc.DateOfBirth" }),
      last_name: "dd/MM/yyyy",
    },
    {
      first_name: formatMessage({ id: "screening.result.Yob" }),
      last_name: "yyyy",
    },
    {
      first_name: formatMessage({ id: "screening.result.Pob" }),
      last_name: formatMessage({
        id: "kyc.import.template.instruction.countryCode",
      }),
    },
    {
      first_name: formatMessage({ id: "kyc.Nationality" }),
      last_name: formatMessage({
        id: "kyc.import.template.instruction.countryCode",
      }),
    },
    {
      first_name: formatMessage({ id: "kyc.countryOfResidence" }),
      last_name: formatMessage({
        id: "kyc.import.template.instruction.countryCode",
      }),
    },
    {
      first_name: formatMessage({
        id: "case.detail.individualRequest.governmentId",
      }),
      last_name: formatMessage({
        id: "kyc.import.template.instruction.string",
      }),
    },
    {
      first_name: formatMessage({ id: "kyc.idIssuingCountry" }),
      last_name: formatMessage({
        id: "kyc.import.template.instruction.countryCode",
      }),
    },
    {
      first_name: formatMessage({ id: "kyc.referenceId" }),
      last_name:
        formatMessage({ id: "kyc.import.template.instruction.string" }) +
        " (" +
        formatMessage({ id: "kyc.referenceIdExcludeSpecialCharacter" }) +
        " " +
        formatMessage({ id: "appModule.labelAnd" }) +
        " " +
        formatMessage({ id: "appModule.from.referenceIdIsOnly40Characters" }) +
        ")",
    },
    {
      first_name: formatMessage({ id: "kyc.enableReScreening" }),
      last_name: formatMessage({
        id: "kyc.import.template.instruction.boolean",
      }),
    },
    {
      first_name: formatMessage({ id: "kyc.enableOngoingMonitoring" }),
      last_name: formatMessage({
        id: "kyc.import.template.instruction.boolean",
      }),
    },
    {
      first_name: formatMessage({ id: "kyc.Assignee" }),
      last_name: "xxx@yyy.zzz",
    },
  ];

  React.useEffect(() => {
    kycWatchGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  let filterExport = JSON.parse(JSON.stringify(selected));
  filterExport = filterExport.map((select) => {
    select.fullName = getFullName(select?.createdBy);
    select.dateOfBirth = formatDate(select?.individualRequest?.dateOfBirth);
    select.keyword = select?.positiveMatch?.keywords;
    select.riskCore = Math.round(select?.individualRiskScore?.risk) || 0;
    select.lastModifyBy = `${select?.lastModifiedBy?.firstName} ${select?.lastModifiedBy?.lastName}`;
    select.lastScreenedAt = formatDate(select?.updatedAt, LONG_DATE_TIME);
    select.nationality = select?.individualRequest?.nationality
      ? countryCodeToName(select.individualRequest?.nationality, "demonym")
      : "";
    select.status = formatMessage({
      id: getKycStatusTranslate(select.status),
    });

    return select;
  });

  const triggerInputFile = () => {
    if (fileRef) {
      fileRef.current.click();
    }
  };

  const handleFileUpload = async () => {
    const file = fileRef.current.files[0];
    const formData = new FormData();
    formData.append("file", file);
    setFileRefKey(randomString(10));
    try {
      await importDialog({
        init: () => kycActionImportCsv(formData),
        onSuccess: kycActionImportConfirm,
      });
    } catch (error) {
      snackActions.error(
        <IntlMessages id={"appModule.importCsv.serverError"} />
      );
    } finally {
      setFileRefKey(randomString(10));
    }
  };

  const handleDownloadCsvTemplate = () => {
    if (downloadTemplateRef) {
      downloadTemplateRef.current.link.click();
    }
  };

  const handleAddToArchive = useCallback(() => {
    return kycActionAddToArchive(selected.map((i) => i.kycId)).then(() =>
      setSelected([])
    );
  }, [kycActionAddToArchive, selected]);

  const handleAddItemToArchiveList = (idItemList) => {
    return kycActionAddToArchive(idItemList);
  };

  const handleUnarchive = useCallback(() => {
    return kycActionUnarchive(selected.map((i) => i.kycId)).then(() =>
      setSelected([])
    );
  }, [kycActionUnarchive, selected]);

  const templateImportKycHeader = templateExampleForImportKycCsv.headers.map(
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
      kycIds: selected?.map((i) => i?.kycId),
      watchGroupId: value?.id,
    };
    dispatch(KYC_ACTION_ADD_TO_GROUP({ params: params }))
      .then((result) => {
        let message =
          selected?.map((i) => i?.kycId)?.length +
          " " +
          formatMessage({ id: "kyc.watch.group.add.success" }) +
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };
  const onCloseAssign = () => {
    setDialogAssign(false);
  };
  const onSaveAssign = async (value) => {
    const kycIds = selected?.map((i) => i.kycId);
    const data = await kycActionBulkAssign({
      userId: value?.id,
      kycIds: kycIds,
    });
    if (data.status === 200) {
      dispatch(KYC_ACTION_GET_KYC_REQUESTS(paginationParams));
      setSelected([]);
      return snackActions.success(
        <FormattedHTMLMessage
          id="notification.success.bulkAssign"
          values={{
            total: kycIds.length,
            title: "KYC",
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
    if (regex?.test(KYC_ROUTE_MY_KYC)) {
      /**
       * If main page get all group list
       */
      setGroupListCurrent(watchGroup);
    }
    setSelected(value);
  };

  const onPressSelectGroup = (groupId) => {
    setGroupListSelect(groupId);
  };

  const handleRemoveGroupList = () => {
    dispatch(
      KYC_ACTION_REMOVE_FROM_WATCH_GROUP({
        params: {
          list: selected?.map((i) => i?.kycId),
          watchGroupId: groupListSelect
            ? groupListSelect?.id
            : watchGroup?.[0]?.id,
        },
      })
    )
      .then(() => {
        let groupName = groupListSelect
          ? groupListSelect?.name
          : watchGroup?.[0]?.name;
        let numOfRemovel = selected.length;

        snackActions.success(
          <IntlMessages
            id="kyc.remove.from.groupList"
            values={{ NUM: numOfRemovel, GROUP_NAME: groupName }}
          />
        );
      })
      .finally(() => {
        setSelected([]);
      });
  };

  return (
    <Fragment>
      <PageHeading
        title={
          <Switch>
            <Route path={KYC_ROUTE_KYC_GROUP_LIST}>
              <IntlMessages id={"url.my-kyc"} />
            </Route>
            <Route path={KYC_ROUTE_KYC_ARCHIVE_LIST}>
              <IntlMessages id={"url.my-kyc"} />
            </Route>
            <Route path={KYC_ROUTE_MY_KYC}>
              <IntlMessages id={"url.my-kyc"} />
            </Route>
          </Switch>
        }
        customUrlResolver={(_index, sub) => {
          switch (sub) {
            case "my-kyc":
              return [<IntlMessages id={"url.my-kyc"} />, null, false];
            case "groupList":
              return [<IntlMessages id={"group.list"} />, null, false];
            case "archiveList":
              return [<IntlMessages id={"archive-list"} />, null, false];
            case "kyc":
              return [<IntlMessages id="url.acurisKyc" />, null, false];
            default:
              return null;
          }
        }}
        match={match}
      />
      <TabbedListedPageProvider
        selected={selected}
        setSelected={onPressSelect}
        setGroupListSelected={onPressSelectGroup}
      >
        <div>
          <div className={"d-flex justify-content-between"}>
            <div className={"d-flex"}>
              <input
                key={fileRefKey}
                className="d-none"
                id="selectImage"
                type="file"
                onChange={handleFileUpload}
                ref={fileRef}
                accept=".csv"
              />
            </div>
          </div>
          <Assign
            open={dialogAssign}
            onClose={onCloseAssign}
            onSave={onSaveAssign}
            screen={"KYC"}
          />
          <TabbedListedPage
            mainTabLabel={<IntlMessages id="kyc.kycList" />}
            routes={[
              KYC_ROUTE_MY_KYC,
              KYC_ROUTE_KYC_GROUP_LIST,
              KYC_ROUTE_KYC_ARCHIVE_LIST,
            ]}
            mainTabChild={
              <div className={"d-flex align-items-center"}>
                <div>
                  <TabbedListedPageActions
                    disableImport={
                      ACL.isAllowedPermissions("KYC_MODULE_CREATE")
                        ? false
                        : true
                    }
                    CSVLinkProps={{
                      ref: downloadTemplateRef,
                      id: "download_template_csv",
                      data: templateImportKycData,
                      filename: "import_kyc_template.csv",
                      headers: templateImportKycHeader,
                      label: (
                        <IntlMessages id="appModule.importKYC"></IntlMessages>
                      ),
                    }}
                    ExportCSVProps={{
                      nameFileExport: "KYC_MyKYC",
                      dataExport: filterExport,
                      headersExportCSV: headerExportKYCListCSV,
                    }}
                    disableExport
                    disabledArchive
                    onAction={(action) => {
                      switch (action) {
                        case "import":
                          triggerInputFile();
                          return;
                        case "downloadCsv":
                          handleDownloadCsvTemplate();
                          return;
                        case "unarchived":
                          handleUnarchive();
                          return;
                        default:
                          return;
                      }
                    }}
                    selectedItems={selected}
                    additionalActions={(ACL.isAllowedPermissions("MY_KYC_EDIT")
                      ? [
                          {
                            label: (
                              <IntlMessages id="appModule.button.setMonitoring" />
                            ),
                            onClick: (selected) => {
                              handleOnGoingMonitoring(selected, setSelected);
                            },
                          },
                        ]
                      : []
                    )
                      .concat([
                        {
                          onClick: handleAssign,
                          label: <IntlMessages id="appModule.assign" />,
                        },
                        {
                          label: (
                            <IntlMessages id={"group.list.add.dropdown"} />
                          ),
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

                        /**
                         * Export
                         */
                        {
                          label: (
                            <IntlMessages
                              id={"appModule.button.addToArchive"}
                            />
                          ),
                          component: (
                            <CustomDropdownItem
                              className={styles.ExportSelected}
                              component={ExportCSV}
                              dataExport={filterExport}
                              nameFileExport={
                                "KYC_MyKYC" + stringToday + ".csv"
                              }
                              headersExportCSV={headerExportKYCListCSV}
                            >
                              <Typography variant="small1">
                                <IntlMessages
                                  id={"appModule.button.exportSelected"}
                                />
                              </Typography>
                            </CustomDropdownItem>
                          ),
                        },
                        /**
                         * Archive
                         */
                        {
                          label: (
                            <IntlMessages
                              id={"appModule.button.addToArchive"}
                            />
                          ),
                          onClick: handleAddToArchive,
                        },
                      ])
                      /**
                       * Remove group list
                       */
                      .concat(
                        match?.path === KYC_ROUTE_KYC_GROUP_LIST
                          ? [
                              {
                                label: (
                                  <IntlMessages
                                    id={"group.list.remove.dropdown"}
                                  />
                                ),
                                onClick: handleRemoveGroupList,
                              },
                            ]
                          : []
                      )}
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
              <Route path={KYC_ROUTE_KYC_ARCHIVE_LIST}>
                <KYCArchiveList onRefresh={onRefresh} />
              </Route>
              <Route path={KYC_ROUTE_KYC_GROUP_LIST}>
                <GroupList
                  onRefresh={onRefresh}
                  groupListSelect={setGroupListFilter}
                />
              </Route>
              <Route path={KYC_ROUTE_MY_KYC}>
                <MyKYC
                  onAddItemToArchiveList={handleAddItemToArchiveList}
                  onRefresh={onRefresh}
                />
              </Route>
            </Switch>
          </TabbedListedPage>
        </div>
      </TabbedListedPageProvider>
    </Fragment>
  );
};

export default compose(
  connect(null, mapDispatchToProps),
  withPagination,
  withACL,
  withUserSettings
)(memo(KYCList));
