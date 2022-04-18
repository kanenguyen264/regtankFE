import { Grid, Tab, Tabs } from "@mui/material";
import { withStyles } from "@mui/styles";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import {
  KYC_ACTION_IMPORT_BLACKLIST_CONFIRM,
  KYC_ACTION_IMPORT_BLACKLIST_CSV,
} from "actions/KYCAction";
import {
  ADD_NEW_BLACKLIST,
  ADD_NEW_CATEGORY,
  CHANGE_STATUS_BLACKLIST,
  FETCH_ACTION_GET_KYC_BLACKLIST,
  REMOVE_BLACKLIST_BY_ID,
  submitGeneralSettings,
  submitGeneralSettingsSuccess,
  UPDATE_CATEGORY_BLACKLIST,
} from "actions/Setting";
import DialogComponent from "components/DialogComponentv1";
import useImportDialog from "components/ImportDialogv1";
import { TabbedListedPageProvider } from "components/TabbedListedPagev1";
import { DATA_DUPLICATED } from "constants/ActionTypes";
import { headerExportKYTListCSV } from "constants/HeaderExport";
import { SETTING_BLACK_LIST_KYC } from "constants/routes";
import { templateExampleForImportKycBlacklistCsv } from "constants/TemplateImport";
import React, { createRef, Fragment, memo, useState } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { compose } from "recompose";
import commonStyles from "styles/base/commonStyles.module.scss";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { getContentMessage } from "util/index";
import { snackActions } from "util/snackbarUtils";
import { randomString } from "util/string";
import styles from "./BlackListStyle.module.scss";
import AddNewBlackList from "./component/AddNewBlackList/AddNewBlackList";
import BlackListKYC from "./component/Table/BlackListKYC";
import ChangeCategoryDialog from "./component/ChangeCategoryDialog";
import TabbedListedBlackListActions from "./component/TabbedListedBlackListActions";
import { withACL } from "../../../../acl";
import moduleStyles from "./BlackListStyle.module.scss";
const ListTabTable = [
  {
    id: 0,
    label: <IntlMessages id={"setting.blacklist.table.KYC"} />,
    path: SETTING_BLACK_LIST_KYC,
  },
];

const Header = () => {
  return (
    <Fragment>
      <PageHeading
        title={<IntlMessages id={"url.blacklist"} />}
        customUrlResolver={(index, sub) => {
          switch (sub) {
            case "setting":
              return [<IntlMessages id={"scoring.settings"} />, null, false];

            case "blacklist": {
              return [
                <IntlMessages id={"setting.menu.blacklist"} />,
                null,
                false,
              ];
            }
            case "kyb":
              return [
                <IntlMessages id={"setting.blacklist.table.KYB"} />,
                null,
                false,
              ];
            case "kyt":
              return [
                <IntlMessages id={"setting.blacklist.table.KYT"} />,
                null,
                false,
              ];
            default:
              return;
          }
        }}
      />
    </Fragment>
  );
};

const AntTabs = withStyles((theme) => ({
  root: {
    borderBottom: "1px solid #e8e8e8",
    paddingLeft: theme.typography.pxToRem(12),
    boxShadow: "0px 2px 5px rgba(34, 59, 96, 0.14)",
  },
  indicator: {
    backgroundColor: "unset",
  },
}))(Tabs);

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    fontSize: theme.typography.pxToRem(16),
    minWidth: theme.typography.pxToRem(60),
    paddingLeft: theme.typography.pxToRem(12),
    paddingRight: theme.typography.pxToRem(12),
    color: "#8C8C8C",
    "&:hover": {
      color: "#0080FF",
      opacity: 1,
    },
    "&$selected": {
      color: "#0080FF",
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&:focus": {
      color: "#40a9ff",
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

const TabCustom = memo((props) => {
  const { value, handleChange } = props;
  return (
    <AntTabs
      value={value}
      onChange={handleChange}
      className={styles.tabContainer}
    >
      {ListTabTable.map((item) => {
        return <AntTab key={item.id} label={item.label} value={item} />;
      })}
    </AntTabs>
  );
});
const TabPanel = memo((props) => {
  const { value } = props;
  switch (value?.path) {
    case SETTING_BLACK_LIST_KYC:
      return <BlackListKYC />;

    default:
      return <BlackListKYC />;
  }
});

const BlackList = (props) => {
  const { paginationParams, ACL } = props;
  const [selected, setSelected] = useState([]);
  const { formatMessage } = useIntl();
  const [value, setValue] = useState(ListTabTable[0]);
  const history = useHistory();
  const downloadTemplateRef = createRef();
  const [fileRefKey, setFileRefKey] = useState(randomString(10));
  const fileRef = createRef();

  const ImportDialog = useImportDialog();
  const [openAddNew, setOpenAddNew] = useState();
  const [blackListUpdateNote, setBlackListUpdateNote] = useState(false);
  const { kycCategory } = useSelector((state) => state.settings);
  const [openBulkDialog, setOpenBulkDialog] = useState(false);
  const [bulkDialogType, setBulkDialogType] = useState("");
  const [openDuplicateDialog, setOpenDuplicateDialog] = useState(false);
  const [nameDuplicate, setNameDuplicate] = useState("");
  const [onUpdateCategory, setOnUpdateCategory] = useState(false);
  const dispatch = useDispatch();

  const templateImportKycData = [
    {
      first_name: "John",
      middle_name: "Rob",
      last_name: "Smith",
      gender: "MALE",
      email: "John.Smith@gmail.com",
      phone: "0988877777",
      address: "Ho Chi Minh",
      dateOfBirth: "12/22/1995",
      placeOfBirth: "SG",
      nationality: "SG",
      countryOfResidence: "SG",
      category: "Category",
      idIssuingCountry: "VN",
      furtherInformation: "This is blacklist",
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
      last_name: "email@domain.com",
    },
    {
      first_name: formatMessage({ id: "appModule.phone" }),
      last_name: formatMessage({
        id: "kyc.import.template.instruction.number",
      }),
    },
    {
      first_name: formatMessage({ id: "setting.blacklist.dialog.address" }),
      last_name: formatMessage({
        id: "kyc.import.template.instruction.string",
      }),
    },
    {
      first_name: formatMessage({ id: "kyc.DateOfBirth" }),
      last_name: "dd/MM/yyyy",
    },
    {
      first_name: formatMessage({ id: "setting.blacklist.dialog.place.birth" }),
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
      first_name: formatMessage({ id: "setting.blacklist.csv.category" }),
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
      first_name: formatMessage({ id: "setting.blacklist.dialog.further" }),
      last_name: formatMessage({
        id: "kyc.import.template.instruction.string",
      }),
    },
  ];

  const generalSettings = useSelector(({ settings }) => {
    const { generalSettings } = settings;
    return generalSettings;
  });

  const templateImportKycHeader = templateExampleForImportKycBlacklistCsv.headers.map(
    (item) => {
      return {
        label: formatMessage({ id: item.label }),
        key: item.key,
      };
    }
  );

  const handleFileUpload = async () => {
    const file = fileRef.current.files[0];
    const formData = new FormData();
    formData.append("file", file);
    setFileRefKey(randomString(10));

    try {
      try {
        await ImportDialog({
          init: () => dispatch(KYC_ACTION_IMPORT_BLACKLIST_CSV(formData)),
          onSuccess: (data) =>
            dispatch(KYC_ACTION_IMPORT_BLACKLIST_CONFIRM(data)),
        });
      } catch (error) {
        snackActions.error(
          <IntlMessages id={"appModule.importCsv.serverError"} />
        );
      } finally {
        setFileRefKey(randomString(10));
      }
    } catch (error) {
      snackActions.error(
        <IntlMessages id={"appModule.importCsv.serverError"} />
      );
    } finally {
      setFileRefKey(randomString(10));
    }
  };

  let filterExport = JSON.parse(JSON.stringify(selected));
  filterExport = filterExport.map((select) => {
    select.isActive = select.isActive
      ? formatMessage({ id: "appModule.status.active" })
      : formatMessage({ id: "appModule.status.dormant" });
    select.updatedAt = formatDate(select.updatedAt, LONG_DATE_TIME);

    return select;
  });

  const handleChange = (event, newValue) => {
    history.push(newValue?.path);
    setValue(newValue);
  };
  const triggerInputFile = () => {
    if (fileRef) {
      fileRef.current.click();
    }
  };
  const handleDownloadCsvTemplate = () => {
    if (downloadTemplateRef) {
      downloadTemplateRef.current.link.click();
    }
  };

  const addBlackList = () => {
    setOpenAddNew(!openAddNew);
  };

  const onPressAddNewBlackList = (values) => {
    if (
      values.yearOfBirthTemp &&
      values.monthOfBirthTemp &&
      values.dateOfBirthTemp
    ) {
      var convertDate =
        values.yearOfBirthTemp?.id +
        "-" +
        values.monthOfBirthTemp?.id +
        "-" +
        values.dateOfBirthTemp?.id;
    }

    let obj = {
      fullName: values.fullName,
      categories: values?.category?.map((item) => {
        return { id: item?.id };
      }),
      nationality: values.nationality?.code,
      dateOfBirth: convertDate,
      gender: values.gender?.id,
      countryOfResidence: values.countryOfResidence?.code,
      idIssuingCountry: values.idIssuingCountry?.code,
      placeOfBirth: values.placeOfBirth?.code,
      email: values.email,
      phone: values.phone,
      address: values.address,
      furtherInformation: values.furtherInformation,
    };

    dispatch(ADD_NEW_BLACKLIST(obj))
      .then((data) => {
        /**
         * Fetch black list
         */

        dispatch(FETCH_ACTION_GET_KYC_BLACKLIST(paginationParams));
        setBlackListUpdateNote(true);
        snackActions.success(<IntlMessages id={"notification.success"} />);
      })
      .catch((err) => {
        let response = JSON.parse(
          JSON.stringify(err?.response ? err?.response.data : "")
        );
        /**
         * set data duplicate
         */
        if (response?.message === DATA_DUPLICATED) {
          setOpenDuplicateDialog(true);
          setNameDuplicate(response?.responseBody);
        }
      })
      .finally(() => {
        setOpenAddNew(false);
      });
  };

  const onPressAddCategory = (val) => {
    let body = {
      name: val,
    };
    dispatch(ADD_NEW_CATEGORY(body))
      .then((data) => {
        snackActions.success(<IntlMessages id={"notification.success"} />);
      })
      .catch((err) => {
        snackActions.error(getContentMessage(err));
      });
  };

  const handleActive = (val) => {
    setBulkDialogType("active");
    setOpenBulkDialog(true);
  };
  const onActiveBulkActive = () => {
    dispatch(
      CHANGE_STATUS_BLACKLIST({
        blacklistIds: selected?.map((item) => item.blacklistId),
        status: true,
      })
    ).then(() => {
      snackActions.success(
        <FormattedHTMLMessage
          id="setting.blacklist.change.active.success"
          values={{ number: selected.length }}
        />
      );
      setOpenBulkDialog(false);
      setSelected([]);
    });
  };

  const onDeActiveBulkActive = () => {
    dispatch(
      CHANGE_STATUS_BLACKLIST({
        blacklistIds: selected?.map((item) => item.blacklistId),
        status: false,
      })
    ).then(() => {
      snackActions.success(
        <FormattedHTMLMessage
          id="setting.blacklist.change.deActive.success"
          values={{ number: selected.length }}
        />
      );
      setOpenBulkDialog(false);
      setSelected([]);
    });
  };

  const handleDeActive = async (val) => {
    setBulkDialogType("deactive");
    setOpenBulkDialog(true);
  };

  const handleRemove = () => {
    setBulkDialogType("remove");
    setOpenBulkDialog(true);
  };

  const onRemoveBulkActive = () => {
    dispatch(
      REMOVE_BLACKLIST_BY_ID(selected?.map((item) => item.blacklistId))
    ).then(() => {
      setOpenBulkDialog(false);
      setSelected([]);
    });
  };

  const getTitle = () => {
    return (
      <span>
        {
          {
            active: formatMessage({ id: "setting.blacklist.bulk.active" }),
            deactive: formatMessage({ id: "setting.blacklist.bulk.deAction" }),
            remove: formatMessage({ id: "setting.blacklist.bulk.remove" }),
          }[bulkDialogType]
        }
      </span>
    );
  };

  const getContentButton = () => {
    return (
      <span>
        {
          {
            active: formatMessage({
              id: "setting.blacklist.option.button.activate",
            }),
            deactive: formatMessage({
              id: "setting.blacklist.option.button.deActive",
            }),
            remove: formatMessage({ id: "setting.blacklist.button.remove" }),
          }[bulkDialogType]
        }
      </span>
    );
  };
  const getContent = () => {
    return (
      <span>
        {
          {
            active: (
              <span>
                <span className={commonStyles.textWeight500}>
                  <FormattedHTMLMessage
                    id="setting.blacklist.bulk.remove.content.profile"
                    values={{
                      numberProfile: selected.length,
                      profile:
                        selected.length > 1
                          ? formatMessage({
                              id: "setting.blacklist.bulk.text.profiles",
                            })
                          : formatMessage({
                              id: "setting.blacklist.bulk.text.profile",
                            }),
                    }}
                  />
                </span>
                <FormattedHTMLMessage id="setting.blacklist.bulk.active.content" />
              </span>
            ),
            deactive: (
              <span>
                <span className={commonStyles.textWeight500}>
                  <FormattedHTMLMessage
                    id="setting.blacklist.bulk.remove.content.profile"
                    values={{
                      numberProfile: selected.length,
                      profile:
                        selected.length > 1
                          ? formatMessage({
                              id: "setting.blacklist.bulk.text.profiles",
                            })
                          : formatMessage({
                              id: "setting.blacklist.bulk.text.profile",
                            }),
                    }}
                  />
                </span>
                <FormattedHTMLMessage id="setting.blacklist.bulk.deactive.content" />
              </span>
            ),
            remove: (
              <span>
                <span className={commonStyles.textWeight500}>
                  <FormattedHTMLMessage
                    id="setting.blacklist.bulk.remove.content.profile"
                    values={{
                      numberProfile: selected.length,
                      profile:
                        selected.length > 1
                          ? formatMessage({
                              id: "setting.blacklist.bulk.text.profiles",
                            })
                          : formatMessage({
                              id: "setting.blacklist.bulk.text.profile",
                            }),
                    }}
                  />
                </span>
                <FormattedHTMLMessage id="setting.blacklist.bulk.remove.content" />
              </span>
            ),
          }[bulkDialogType]
        }
      </span>
    );
  };

  const onSubmitChangeCategory = (val) => {
    let dataSubmit = {
      categories: val?.map((item) => {
        return { id: item.id, fullName: nameDuplicate?.fullName };
      }),
    };

    dispatch(
      UPDATE_CATEGORY_BLACKLIST({
        blacklistId: nameDuplicate?.blacklistId,
        body: dataSubmit,
      })
    )
      .then((data) => {
        snackActions.success(<IntlMessages id={"notification.success"} />);
      })
      .catch((err) => {
        snackActions.error(getContentMessage(err));
      })
      .finally(() => {
        setOnUpdateCategory(false);
      });
  };

  return (
    <Fragment>
      {blackListUpdateNote && generalSettings?.blacklistUpdate && (
        <DialogComponent
          className={moduleStyles.confirmDlg}
          isOpen={blackListUpdateNote}
          title={formatMessage({ id: "setting.blacklist.dialog.update" })}
          content={
            <FormattedHTMLMessage id="setting.blacklist.dialog.update.content" />
          }
          checkBoxNotShow={
            <div>
              <FormattedHTMLMessage id="setting.blacklist.dialog.update.not.show" />
            </div>
          }
          actions={[
            {
              value: true,
              label: formatMessage({ id: "Close" }),
              variant: "contained",
              type: "submit",
            },
          ]}
          onActions={(action, data) => {
            switch (action?.type) {
              case "submit": {
                let dataSubmit = { ...generalSettings, blacklistUpdate: !data };
                dispatch(submitGeneralSettings(dataSubmit)).then((rs) => {
                  dispatch(submitGeneralSettingsSuccess(rs.data));
                });
                setBlackListUpdateNote(false);
                return;
              }
              default:
                return;
            }
          }}
        />
      )}
      {openDuplicateDialog && (
        <DialogComponent
          isOpen={openDuplicateDialog}
          className={moduleStyles.confirmDlg}
          onClose={() => setOpenDuplicateDialog(false)}
          title={formatMessage({ id: "setting.blacklist.duplicate.found" })}
          content={
            <div>
              <span className={commonStyles.textWeight500}>
                {nameDuplicate?.fullName}{" "}
              </span>
              <span>
                <FormattedHTMLMessage id="setting.blacklist.duplicate.found.content" />
              </span>
            </div>
          }
          actions={[
            {
              value: false,
              label: formatMessage({ id: "cancel" }),
              type: "cancel",
              variant: "containedWhite",
            },
            {
              value: true,
              label: formatMessage({
                id: "setting.blacklist.duplicate.found.button",
              }),
              variant: "contained",
              type: "submit",
            },
          ]}
          onActions={(action) => {
            switch (action?.type) {
              case "submit": {
                setOpenDuplicateDialog(false);
                setOnUpdateCategory(true);
                return;
              }
              case "cancel": {
                setOpenDuplicateDialog(false);
                return;
              }
              default:
                return;
            }
          }}
        />
      )}

      {openBulkDialog && (
        <DialogComponent
          isOpen={openBulkDialog}
          className={moduleStyles.confirmDlg}
          title={getTitle()}
          content={getContent()}
          actions={[
            {
              value: false,
              label: formatMessage({ id: "cancel" }),
              type: "cancel",
              variant: "containedWhite",
            },
            {
              value: true,
              label: getContentButton(),
              variant: "contained",
              type: "submit",
            },
          ]}
          onActions={(action) => {
            switch (action?.type) {
              case "submit": {
                if (bulkDialogType === "active") {
                  onActiveBulkActive();
                  return;
                }
                if (bulkDialogType === "deactive") {
                  onDeActiveBulkActive();
                  return;
                }
                onRemoveBulkActive();
                return;
              }

              case "cancel": {
                setOpenBulkDialog(false);
                return;
              }
              default:
                return;
            }
          }}
        />
      )}
      {openAddNew && (
        <AddNewBlackList
          isOpen={openAddNew}
          title={formatMessage({ id: "setting.blacklist.table.KYC" })}
          onClose={() => setOpenAddNew(false)}
          categoryList={kycCategory}
          onSubmit={onPressAddNewBlackList}
          onPressAddCategory={onPressAddCategory}
        />
      )}
      {onUpdateCategory && (
        <ChangeCategoryDialog
          blackListItem={nameDuplicate}
          open={onUpdateCategory}
          onClose={() => setOnUpdateCategory(false)}
          categoryList={kycCategory}
          onSubmitChange={onSubmitChangeCategory}
        />
      )}
      <Header />
      <TabbedListedPageProvider selected={selected} setSelected={setSelected}>
        <Grid container className={styles.containerWrap}>
          <Grid item xs={12} className={styles.controlsListWrap}>
            <TabCustom value={value} handleChange={handleChange} />
            <input
              key={fileRefKey}
              className="d-none"
              id="selectImage"
              type="file"
              onChange={handleFileUpload}
              ref={fileRef}
              accept=".csv"
            />
            <TabbedListedBlackListActions
              disableImport={
                !ACL.isAllowedPermissions("SETTING_BLACKLIST_CREATE")
              }
              disableAddNew={
                !ACL.isAllowedPermissions("SETTING_BLACKLIST_CREATE")
              }
              disableBulk={
                !ACL.isAllowedPermissions("SETTING_BLACKLIST_EDIT") &&
                !ACL.isAllowedPermissions("SETTING_BLACKLIST_DELETE")
                  ? true
                  : false
              }
              CSVLinkProps={{
                ref: downloadTemplateRef,
                id: "download_template_csv",
                data: templateImportKycData,
                filename: "import_kyc_blacklist_template.csv",
                headers: templateImportKycHeader,
                className: "text-dark",
                label: (
                  <IntlMessages id="setting.blacklist.import.profile"></IntlMessages>
                ),
              }}
              ExportCSVProps={{
                nameFileExport: "KYT_MyKYT",
                dataExport: filterExport,
                headersExportCSV: headerExportKYTListCSV,
              }}
              selectedItems={selected}
              additionalActions={(ACL.isAllowedPermissions(
                "SETTING_BLACKLIST_EDIT"
              )
                ? [
                    {
                      label: (
                        <IntlMessages id="setting.blacklist.table.active" />
                      ),
                      onClick: handleActive,
                    },
                    {
                      onClick: handleDeActive,
                      label: (
                        <IntlMessages id="setting.blacklist.option.button.deActive" />
                      ),
                    },
                  ]
                : []
              ).concat(
                ACL.isAllowedPermissions("SETTING_BLACKLIST_DELETE")
                  ? [
                      {
                        onClick: handleRemove,
                        label: (
                          <span className={styles.bulkRemove}>
                            <IntlMessages id="setting.blacklist.button.remove" />
                          </span>
                        ),
                      },
                    ]
                  : []
              )}
              onAction={(action) => {
                switch (action) {
                  case "import":
                    triggerInputFile();
                    return;
                  case "downloadCsv":
                    handleDownloadCsvTemplate();
                    return;
                  case "addBlackList":
                    addBlackList();
                    return;

                  default:
                    return;
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TabPanel value={value} />
          </Grid>
        </Grid>
      </TabbedListedPageProvider>
    </Fragment>
  );
};
export default compose(withPagination, withACL)(memo(BlackList));
