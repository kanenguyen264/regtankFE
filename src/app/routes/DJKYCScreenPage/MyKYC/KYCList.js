import { Button } from "@material-ui/core";
import { RefreshButton } from "@protego/sdk/RegtankUI/v1/Button";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import {
  DJ_ACTION_ADD_TO_GROUP,
  DJ_ACTION_BULK_ASSIGN,
  DJ_ACTION_GET_KYC_REQUEST,
  DJ_ACTION_GET_WATCH_GROUP,
  DJ_KYC_ACTION_IMPORT_CSV,
  DJ_KYC_ACTION_IMPORT_CONFIRM,
} from "actions/DJAction";
import Assign from "components/Assignv1";
import {
  TabbedListedPageActions,
  TabbedListedPageProvider,
} from "components/TabbedListedPagev1";
import TabbedListedPage from "components/TabbedListedPagev1/TabbedListedPage";
import {
  DJ_KYC_ROUTE_KYC_ARCHIVE_LIST,
  DJ_KYC_ROUTE_KYC_GROUP_LIST,
  DJ_KYC_ROUTE_MY_KYC,
} from "constants/routes";
import React, { Fragment, memo, useCallback, useState, createRef } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { connect, useDispatch, useSelector } from "react-redux";
import { Route, Switch, useLocation } from "react-router";
import { compose } from "recompose";
import { bindActionCreators } from "redux";
import { DJKYCArchiveAdapter } from "services/DJService";
import { countryCodeToName } from "util/country";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { getKycStatusTranslate } from "util/kycStatus";
import { snackActions } from "util/snackbarUtils";
import { getFullName, randomString } from "util/string";
import { withACL } from "../../../../acl";
import useOnGoingMonitoringPrompt from "./dialogs/OnGoingMonitoringPrompt";
import GroupList from "./GroupList";
import KYCArchiveList from "./KYCArchiveList";
import styles from "./KYCList.module.scss";
import MyKYC from "./MyKYC";
import { headerExportKYCListCSV } from "constants/HeaderExport";
import {Divider} from "@mui/material";
import { templateExampleForImportDjKycCsv } from "constants/TemplateImport";
import useImportDialog from "components/ImportDialog";

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      djActionBulkAssign: DJ_ACTION_BULK_ASSIGN,
      kycWatchGroup: DJ_ACTION_GET_WATCH_GROUP,
      kycActionAddToArchive: DJKYCArchiveAdapter.actionAddToArchive,
      kycActionUnarchive: DJKYCArchiveAdapter.actionRemoveFromArchive,
      kycActionImportCsv: DJ_KYC_ACTION_IMPORT_CSV,
      kycActionImportConfirm: DJ_KYC_ACTION_IMPORT_CONFIRM,
    },
    dispatch
  );

const KYCList = ({
  match,
  paginationParams,
  djActionBulkAssign,
  kycWatchGroup,
  kycActionAddToArchive,
  kycActionUnarchive,
  kycActionImportCsv,
  kycActionImportConfirm,
  ACL,
}) => {
  const [selected, setSelected] = useState([]);
  const { formatMessage } = useIntl();
  const [onRefresh, setOnRefresh] = useState(false);
  const [dialogAssign, setDialogAssign] = useState(false);
  const dispatch = useDispatch();
  const handleOnGoingMonitoring = useOnGoingMonitoringPrompt();
  const [groupListCurrent, setGroupListCurrent] = React.useState([]);
  const { watchGroup } = useSelector((state) => state.downJones);
  const location = useLocation();
  const downloadTemplateRef = createRef();
  const [fileRefKey, setFileRefKey] = useState(randomString(10));
  const fileRef = createRef();
  const importDialog = useImportDialog();
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
      id: getKycStatusTranslate(select.status) || "-",
    });

    return select;
  });

  const templateImportKycData = [
    {
      full_name: "",
      first_name: "John",
      middle_name: "",
      last_name: "Smith",
      profile_notes: "TRUE",
      occupation_titles: "TRUE",
      gender: "MALE",
      email: "john.smith@mail.com",
      phone: "85640976",
      address_1: "23 Broad St",
      address_2: "San Francisco",
      date_of_birth: "",
      strict_date_match: "FALSE",
      year_of_birth: "1980 - 1990",
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
    {
      full_name: "John Smith",
      first_name: "",
      middle_name: "",
      last_name: "",
      profile_notes: "TRUE",
      occupation_titles: "TRUE",
      gender: "MALE",
      email: "john.smith@mail.com",
      phone: "85640976",
      address_1: "23 Broad St",
      address_2: "San Francisco",
      date_of_birth: "01/03/1980",
      strict_date_match: "",
      year_of_birth: "",
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
      full_name: formatMessage({ id: "kyc.import.template.instruction" }),
    },
    {
      full_name: formatMessage({ id: "kyc.import.template.instruction.1" }),
    },
    {
      full_name: formatMessage({ id: "kyc.import.template.instruction.2" }),
    },
    {
      full_name: formatMessage({ id: "kyc.import.template.instruction.3" }),
    },
    {
      full_name: formatMessage({ id: "kyc.import.template.instruction.4" }),
    },
    {},
    {
      full_name: formatMessage({ id: "form.fullName" }),
      middle_name: formatMessage({
        id: "kyc.import.template.instruction.fullName",
      }),
    },
    {
      full_name: formatMessage({ id: "form.firstName" }),
      middle_name: formatMessage({
        id: "kyc.import.template.instruction.name",
      }),
    },
    {
      full_name: formatMessage({ id: "form.middleName" }),
      middle_name: formatMessage({
        id: "kyc.import.template.instruction.name",
      }),
    },
    {
      full_name: formatMessage({ id: "form.lastName" }),
      middle_name: formatMessage({
        id: "kyc.import.template.instruction.name",
      }),
    },
    {
      full_name: formatMessage({ id: "form.profileNotes" }),
      middle_name: formatMessage({
        id: "kyc.import.template.instruction.boolean",
      }),
    },
    {
      full_name: formatMessage({ id: "form.occupationTitles" }),
      middle_name: formatMessage({
        id: "kyc.import.template.instruction.boolean",
      }),
    },
    {
      full_name: formatMessage({ id: "screening.result.Gender" }),
      middle_name: "MALE | FEMALE | UNSPECIFIED",
    },
    {
      full_name: formatMessage({ id: "appModule.requestForm.email" }),
      middle_name: "xxx@yyy.zzz",
    },
    {
      full_name: formatMessage({ id: "appModule.phone" }),
      middle_name: formatMessage({
        id: "kyc.import.template.instruction.number",
      }),
    },
    {
      full_name: formatMessage({ id: "address-line-1" }),
      middle_name: formatMessage({
        id: "kyc.import.template.instruction.string",
      }),
    },
    {
      full_name: formatMessage({ id: "address-line-2" }),
      middle_name: formatMessage({
        id: "kyc.import.template.instruction.string",
      }),
    },
    {
      full_name: formatMessage({ id: "kyc.DateOfBirth" }),
      middle_name: formatMessage({
        id: "djkyc.import.template.instruction.dateOfBirth",
      }),
    },
    {
      full_name: formatMessage({ id: "form.strictDateMatch" }),
      middle_name: formatMessage({
        id: "djkyc.import.template.instruction.strictDateMatch",
      }),
    },
    {
      full_name: formatMessage({ id: "screening.result.Yob" }),
      middle_name: formatMessage({
        id: "djkyc.import.template.instruction.yearOfBirth",
      }),
    },
    {
      full_name: formatMessage({ id: "screening.result.Pob" }),
      middle_name: formatMessage({
        id: "kyc.import.template.instruction.countryCode",
      }),
    },
    {
      full_name: formatMessage({ id: "kyc.Nationality" }),
      middle_name: formatMessage({
        id: "kyc.import.template.instruction.countryCode",
      }),
    },
    {
      full_name: formatMessage({ id: "kyc.countryOfResidence" }),
      middle_name: formatMessage({
        id: "kyc.import.template.instruction.countryCode",
      }),
    },
    {
      full_name: formatMessage({
        id: "case.detail.individualRequest.governmentId",
      }),
      middle_name: formatMessage({
        id: "kyc.import.template.instruction.string",
      }),
    },
    {
      full_name: formatMessage({ id: "kyc.idIssuingCountry" }),
      middle_name: formatMessage({
        id: "kyc.import.template.instruction.countryCode",
      }),
    },
    {
      full_name: formatMessage({ id: "kyc.referenceId" }),
      middle_name:
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
      full_name: formatMessage({ id: "kyc.enableReScreening" }),
      middle_name: formatMessage({
        id: "kyc.import.template.instruction.boolean",
      }),
    },
    {
      full_name: formatMessage({ id: "kyc.enableOngoingMonitoring" }),
      middle_name: formatMessage({
        id: "kyc.import.template.instruction.boolean",
      }),
    },
    {
      full_name: formatMessage({ id: "kyc.Assignee" }),
      middle_name: "xxx@yyy.zzz",
    },
  ];

  const templateImportKycHeader = templateExampleForImportDjKycCsv.headers.map(
    (item) => {
      return {
        label: formatMessage({ id: item.label }),
        key: item.key,
      };
    }
  );

  const handleDownloadCsvTemplate = () => {
    if (downloadTemplateRef) {
      downloadTemplateRef.current.link.click();
    }
  };

  React.useEffect(() => {
    kycWatchGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const onPressRefresh = () => {
    setOnRefresh(!onRefresh);
  };

  const handleAssign = () => {
    return setDialogAssign(!dialogAssign);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };
  const actionAddToGroupList = (value) => {
    let params = {
      kycIds: selected?.map((i) => i?.kycId),
      watchGroupId: value?.id,
    };
    dispatch(DJ_ACTION_ADD_TO_GROUP({ params: params }))
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
  const onCloseAssign = () => {
    setDialogAssign(false);
  };
  const setGroupListFilter = (list) => {
    setGroupListCurrent(list);
  };

  const onPressSelect = (value) => {
    // setSelected(value);
    const regex = new RegExp(location?.pathname);
    if (regex?.test(DJ_KYC_ROUTE_MY_KYC)) {
      /**
       * If main page get all group list
       */
      setGroupListCurrent(watchGroup);
    }
    setSelected(value);
  };

  const onSaveAssign = async (value) => {
    const kycIds = selected?.map((i) => i.kycId);
    const data = await djActionBulkAssign({
      userId: value?.id,
      kycIds: kycIds,
    }).then(() => {
      dispatch(DJ_ACTION_GET_KYC_REQUEST(paginationParams));
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
    });
  };
  const handleAddItemToArchiveList = (idItemList) => {
    return kycActionAddToArchive(idItemList);
  };
  const handleAddToArchive = useCallback(() => {
    return kycActionAddToArchive(selected.map((i) => i.kycId)).then(() =>
      setSelected([])
    );
  }, [kycActionAddToArchive, selected]);
  const handleUnarchive = useCallback(() => {
    return kycActionUnarchive(selected.map((i) => i.kycId)).then(() =>
      setSelected([])
    );
  }, [kycActionUnarchive, selected]);

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

  return (
    <Fragment>
      <PageHeading
        title={
          <Switch>
            <Route path={DJ_KYC_ROUTE_KYC_GROUP_LIST}>
              <IntlMessages id={"group.list"} />
            </Route>
            <Route path={DJ_KYC_ROUTE_KYC_ARCHIVE_LIST}>
              <IntlMessages id="archive-list" />
            </Route>
            <Route path={DJ_KYC_ROUTE_MY_KYC}>
              <IntlMessages id={"djkyc.kycList"} />
            </Route>
          </Switch>
        }
        customUrlResolver={(_index, sub) => {
          switch (sub) {
            case "my-kyc":
              return [<IntlMessages id={"url.my-kyc"} />, null, false];
            case "dj-kyc":
              return [<IntlMessages id="url.dj-kyc" />, null, false];
            case "groupList":
              return [<IntlMessages id={"group.list"} />, null, false];
            case "archiveList":
              return [<IntlMessages id={"archive-list"} />, null, false];
            default:
              return null;
          }
        }}
        match={match}
      />
      <TabbedListedPageProvider selected={selected} setSelected={onPressSelect}>
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
            screen={"DJKYC"}
          />
          <TabbedListedPage
            mainTabLabel={<IntlMessages id="kyc.kycList" />}
            routes={[
              DJ_KYC_ROUTE_MY_KYC,
              DJ_KYC_ROUTE_KYC_GROUP_LIST,
              DJ_KYC_ROUTE_KYC_ARCHIVE_LIST,
            ]}
            mainTabChild={
              <div className={"d-flex align-items-center"}>
                <div>
                  <TabbedListedPageActions
                    disableImport={
                      !ACL.isAllowedPermissions("KYC_MODULE_CREATE")
                    }
                    CSVLinkProps={{
                      ref: downloadTemplateRef,
                      id: "download_template_csv",
                      data: templateImportKycData,
                      filename: "import_kyc_template.csv",
                      headers: templateImportKycHeader,
                      label: (
                        <IntlMessages id="appModule.importKYC"/>
                      ),
                    }}
                    ExportCSVProps={{
                      nameFileExport: "KYC_MyKYC",
                      dataExport: filterExport,
                      headersExportCSV: headerExportKYCListCSV,
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
                    additionalActions={(ACL.isAllowedPermissions("DJ_MY_KYC_EDIT")
                        ? [
                          {
                            label: (
                              <IntlMessages id="appModule.button.setMonitoring" />
                            ),
                            onClick: (selected) =>
                              handleOnGoingMonitoring(selected) &&
                              setSelected([]),
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
              <Route path={DJ_KYC_ROUTE_MY_KYC} exact>
                <MyKYC
                  onAddItemToArchiveList={handleAddItemToArchiveList}
                  onRefresh={onRefresh}
                />
              </Route>
              <Route path={DJ_KYC_ROUTE_KYC_GROUP_LIST} exact>
                <GroupList
                  onRefresh={onRefresh}
                  groupListSelect={setGroupListFilter}
                />
              </Route>
              <Route path={DJ_KYC_ROUTE_KYC_ARCHIVE_LIST} exact>
                <KYCArchiveList onRefresh={onRefresh} />
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
  withACL
)(memo(KYCList));
