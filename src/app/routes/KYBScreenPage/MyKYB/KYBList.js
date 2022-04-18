import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import { Divider } from "@mui/material";
import { RefreshButton } from "@protego/sdk/RegtankUI/v1/Button";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import {
  KYB_ACTION_ADD_TO_GROUP,
  KYB_ACTION_BULK_ASSIGN,
  KYB_ACTION_GET_KYB_REQUESTS,
  KYB_ACTION_GET_WATCH_GROUP,
  KYB_ACTION_IMPORT_CONFIRM,
  KYB_ACTION_IMPORT_CSV,
  KYB_ACTION_REMOVE_WATCHLIST,
} from "actions/KYBAction";
import Assign from "components/Assignv1";
import useImportDialog from "components/ImportDialog";
import {
  TabbedListedPageActions,
  TabbedListedPageProvider,
} from "components/TabbedListedPagev1";
import TabbedListedPage from "components/TabbedListedPagev1/TabbedListedPage";
import { headerExportKYBListCSV } from "constants/HeaderExport";
import {
  KYB_ROUTE_KYB_ARCHIVE_LIST,
  KYB_ROUTE_KYB_GROUP_LIST,
  KYB_ROUTE_MY_KYB,
} from "constants/routes";
import { templateExampleForImportKybCsv } from "constants/TemplateImport";
import React, { createRef, Fragment, memo, useCallback, useState } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { connect, useDispatch, useSelector } from "react-redux";
import { Route, Switch, useLocation } from "react-router";
import { compose } from "recompose";
import { bindActionCreators } from "redux";
import { countryCodeToName } from "util/country";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { getKybStatusTranslate } from "util/kycStatus";
import { getTextTranslateRisk } from "util/riskLevel";
import { snackActions } from "util/snackbarUtils";
import { getFullName, randomString } from "util/string";
import { withACL } from "../../../../acl";
import { KYBArchiveAdapter } from "../../../../services/KYBService";
import GroupList from "./GroupList";
import KYBArchiveList from "./KYBArchiveList";
import styles from "./KYBList.module.scss";
import MyKYB from "./MyKYB";
import useOnGoingMonitoringPrompt from "./dialogs/OnGoingMonitoringPrompt";

const mapStateToProps = () => {
  return (state, props) => ({
    kybList: state.kyb.list,
  });
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      kybActionRemoveFavorite: KYB_ACTION_REMOVE_WATCHLIST,
      kybActionImportCsv: KYB_ACTION_IMPORT_CSV,
      kybWatchGroup: KYB_ACTION_GET_WATCH_GROUP,
      kybActionImportConfirm: KYB_ACTION_IMPORT_CONFIRM,
      kybActionBulkAssign: KYB_ACTION_BULK_ASSIGN,
    },
    dispatch
  );

function KYBList({
  match,
  props,
  kybWatchGroup,
  kybActionImportCsv,
  kybActionImportConfirm,
  kybActionBulkAssign,
  paginationParams,
  ACL,
}) {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const { watchGroup } = useSelector((state) => state.kyb);
  const importDialog = useImportDialog();
  const [selected, setSelected] = useState([]);
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [fileRefKey, setFileRefKey] = useState(randomString(10));
  const fileRef = createRef();
  const downloadTemplateRef = createRef();
  const [onRefresh, setOnRefresh] = useState(false);
  const [dialogAssign, setDialogAssign] = useState(false);
  const templateImportKybData = [
    {
      business_name: "Business A",
      business_id_number: "12345ABCD",
      address_1: "23 Broad St",
      address_2: "San Francisco",
      size_of_company: "FROM_500_AND_MORE",
      email_address: "businessa@email.com",
      website: "businessa.com",
      reference: "businessACase",
      nature_of_business: "COMPUTER_SOFTWARE_ENGINEERING",
      company_type: "CORPORATION",
      country_of_incorporation: "SG",
      country_of_headquarter: "SG",
      date_of_incorporation: "1/1/21",
      phone_number: "123456789",
      relationship: "relationship",
      enable_re_screening: "FALSE",
      enable_ongoing_monitoring: "FALSE",
      assignee: "assignee@email.com",
    },
    {},
    {
      business_name: formatMessage({ id: "kyc.import.template.instruction" }),
    },
    {
      business_name: formatMessage({ id: "kyc.import.template.instruction.1" }),
    },
    {
      business_name: formatMessage({ id: "kyc.import.template.instruction.2" }),
    },
    {
      business_name: formatMessage({ id: "kyc.import.template.instruction.3" }),
    },
    {
      business_name: formatMessage({ id: "kyc.import.template.instruction.4" }),
    },
    {},
    {
      business_name: formatMessage({ id: "kyb.businessName" }),
      address_2: formatMessage({
        id: "kyc.import.template.instruction.string",
      }),
    },
    {
      business_name: formatMessage({ id: "form.businessIDNumber" }),
      address_2: formatMessage({
        id: "kyc.import.template.instruction.string",
      }),
    },
    {
      business_name: formatMessage({ id: "address-line-1" }),
      address_2: formatMessage({
        id: "kyc.import.template.instruction.string",
      }),
    },
    {
      business_name: formatMessage({ id: "address-line-2" }),
      address_2: formatMessage({
        id: "kyc.import.template.instruction.string",
      }),
    },
    {
      business_name: formatMessage({ id: "kyb.sizeOfCompany" }),
      address_2: formatMessage({ id: "kyb.getTheCodeFromTheListBelow" }),
    },
    {
      business_name: formatMessage({ id: "email-address" }),
      address_2: "xxx@yyy.zzz",
    },
    {
      business_name: formatMessage({ id: "kyb.Website" }),
      address_2: formatMessage({
        id: "kyc.import.template.instruction.string",
      }),
    },
    {
      business_name: formatMessage({ id: "kyc.referenceId" }),
      address_2:
        formatMessage({ id: "kyc.import.template.instruction.string" }) +
        " (" +
        formatMessage({ id: "kyb.referenceIdExcludeSpecialCharacter" }) +
        " " +
        formatMessage({ id: "appModule.labelAnd" }) +
        " " +
        formatMessage({ id: "appModule.from.referenceIdIsOnly40Characters" }) +
        ")",
    },
    {
      business_name: formatMessage({ id: "kyb.NatureOfBusiness" }),
      address_2: formatMessage({ id: "kyb.getTheCodeFromTheListBelow" }),
    },
    {
      business_name: formatMessage({ id: "kyb.companyType" }),
      address_2: formatMessage({ id: "kyb.getTheCodeFromTheListBelow" }),
    },
    {
      business_name: formatMessage({ id: "form.countryOfIncorporation" }),
      address_2: formatMessage({
        id: "kyc.import.template.instruction.countryCode",
      }),
    },
    {
      business_name: formatMessage({ id: "kyb.CountryOfHeadquarter" }),
      address_2: formatMessage({
        id: "kyc.import.template.instruction.countryCode",
      }),
    },
    {
      business_name: formatMessage({ id: "kyb.DateOfIncorporation" }),
      address_2: "dd/MM/yyyy",
    },
    {
      business_name: formatMessage({ id: "kyb.phoneNumber" }),
      address_2: formatMessage({
        id: "kyc.import.template.instruction.number",
      }),
    },
    {
      business_name: formatMessage({ id: "kyb.Relationship" }),
      address_2: formatMessage({
        id: "kyc.import.template.instruction.string",
      }),
    },
    {
      business_name: formatMessage({ id: "kyb.enableReScreening" }),
      address_2: formatMessage({
        id: "kyb.import.template.instruction.boolean",
      }),
    },
    {
      business_name: formatMessage({ id: "kyb.enableOngoingMonitoring" }),
      address_2: formatMessage({
        id: "kyb.import.template.instruction.boolean",
      }),
    },
    {
      business_name: formatMessage({ id: "kyb.Assignee" }),
      address_2: "xxx@yyy.zzz",
    },
    {},

    {
      business_name: formatMessage({ id: "kyb.companyType" }),
    },
    {
      business_name: "SOLE_PROPRIETORSHIP",
    },
    {
      business_name: "LIMITED_PARTNERSHIP",
    },
    {
      business_name: "PARTNERSHIP",
    },
    {
      business_name: "CORPORATION",
    },
    {
      business_name: "LIMITED_LIABILITY_COMPANY",
    },
    {
      business_name: "COOPERATIVE",
    },
    {
      business_name: "NONPROFIT_ORGANIZATION",
    },
    {
      business_name: "CHARITIES",
    },
    {
      business_name: "OTHER",
    },
    {},
    {
      business_name: formatMessage({ id: "kyb.sizeOfCompany" }),
    },
    {
      business_name: "FROM_0_TO_1",
    },
    {
      business_name: "FROM_2_TO_10",
    },
    {
      business_name: "FROM_11_TO_50",
    },
    {
      business_name: "FROM_51_TO_200",
    },
    {
      business_name: "FROM_201_TO_500",
    },
    {
      business_name: "FROM_500_AND_MORE",
    },
    {},
    {
      business_name: formatMessage({ id: "kyb.NatureOfBusiness" }),
    },
    {
      business_name: "ACCOUNTING",
    },
    {
      business_name: "AIRLINES_AVIATION",
    },
    {
      business_name: "ALTERNATIVE_DISPUTE_RESOLUTION",
    },
    {
      business_name: "ALTERNATIVE_MEDICINE",
    },
    {
      business_name: "ANIMATION",
    },
    {
      business_name: "APPAREL_FASHION",
    },
    {
      business_name: "ARCHITECTURE_PLANNING",
    },
    {
      business_name: "ARTS_CRAFTS",
    },
    {
      business_name: "AUTOMOTIVE",
    },
    {
      business_name: "AVIATION_AEROSPACE",
    },
    {
      business_name: "BANKING_MORTGAGE",
    },
    {
      business_name: "BIOTECHNOLOGY_GREENTECH",
    },
    {
      business_name: "BROADCAST_MEDIA",
    },
    {
      business_name: "BUILDING_MATERIALS",
    },
    {
      business_name: "BUSINESS_SUPPLIES_EQUIPMENT",
    },
    {
      business_name: "CAPITAL_MARKETS_HEDGE_FUND_PRIVATE_EQUITY",
    },
    {
      business_name: "CHEMICALS",
    },
    {
      business_name: "CIVIC_SOCIAL_ORGANIZATION",
    },
    {
      business_name: "CIVIL_ENGINEERING",
    },
    {
      business_name: "COMMERCIAL_REAL_ESTATE",
    },
    {
      business_name: "COMPUTER_GAMES",
    },
    {
      business_name: "COMPUTER_HARDWARE",
    },
    {
      business_name: "COMPUTER_NETWORKING",
    },
    {
      business_name: "COMPUTER_NETWORK_SECURITY",
    },
    {
      business_name: "COMPUTER_SOFTWARE_ENGINEERING",
    },
    {
      business_name: "CONSTRUCTION",
    },
    {
      business_name: "CONSUMER_ELECTRONICS",
    },
    {
      business_name: "CONSUMER_GOODS",
    },
    {
      business_name: "CONSUMER_SERVICES",
    },
    {
      business_name: "COSMETICS",
    },
    {
      business_name: "DAIRY",
    },
    {
      business_name: "DEFENSE_SPACE",
    },
    {
      business_name: "DESIGN",
    },
    {
      business_name: "EDUCATION_MANAGEMENT",
    },
    {
      business_name: "E_LEARNING",
    },
    {
      business_name: "ELECTRICAL_ELECTRONIC_MANUFACTURING",
    },
    {
      business_name: "ENTERTAINMENT_MOVIE_PRODUCTION",
    },
    {
      business_name: "ENVIRONMENTAL_SERVICES",
    },
    {
      business_name: "EVENTS_SERVICES",
    },
    {
      business_name: "EXECUTIVE_OFFICE",
    },
    {
      business_name: "FACILITIES_SERVICES",
    },
    {
      business_name: "FARMING",
    },
    {
      business_name: "FINANCIAL_SERVICES",
    },
    {
      business_name: "FINE_ART",
    },
    {
      business_name: "FISHERY",
    },
    {
      business_name: "FOOD_BEVERAGES",
    },
    {
      business_name: "FOOD_PRODUCTION",
    },
    {
      business_name: "FUNDRAISING",
    },
    {
      business_name: "FURNITURE",
    },
    {
      business_name: "GAMBLING_CASINOS",
    },
    {
      business_name: "GLASS_CERAMICS_CONCRETE",
    },
    {
      business_name: "GOVERNMENT_ADMINISTRATION",
    },
    {
      business_name: "GOVERNMENT_RELATIONS",
    },
    {
      business_name: "GRAPHIC_DESIGN_WEB_DESIGN",
    },
    {
      business_name: "HEALTH_FITNESS",
    },
    {
      business_name: "HIGHER_EDUCATION_ACADAMIA",
    },
    {
      business_name: "HOSPITAL_HEALTH_CARE",
    },
    {
      business_name: "HOSPITALITY",
    },
    {
      business_name: "HUMAN_RESOURCES_HR",
    },
    {
      business_name: "IMPORT_EXPORT",
    },
    {
      business_name: "INDIVCODEUAL_FAMILY_SERVICES",
    },
    {
      business_name: "INDUSTRIAL_AUTOMATION",
    },
    {
      business_name: "INFORMATION_SERVICES",
    },
    {
      business_name: "INFORMATION_TECHNOLOGY_IT",
    },
    {
      business_name: "INSURANCE",
    },
    {
      business_name: "INTERNATIONAL_AFFAIRS",
    },
    {
      business_name: "INTERNATIONAL_TRADE_DEVELOPMENT",
    },
    {
      business_name: "INTERNET",
    },
    {
      business_name: "INVESTMENT_BANKING_VENTURE",
    },
    {
      business_name: "INVESTMENT_MANAGEMENT_HEDGE_FUND_PRIVATE_EQUITY",
    },
    {
      business_name: "JUDICIARY",
    },
    {
      business_name: "LAW_ENFORCEMENT",
    },
    {
      business_name: "LAW_PRACTICE_LAW_FIRMS",
    },
    {
      business_name: "LEGAL_SERVICES",
    },
    {
      business_name: "LEGISLATIVE_OFFICE",
    },
    {
      business_name: "LEISURE_TRAVEL",
    },
    {
      business_name: "LIBRARY",
    },
    {
      business_name: "LOGISTICS_PROCUREMENT",
    },
    {
      business_name: "LUXURY_GOODS_JEWELRY",
    },
    {
      business_name: "MACHINERY",
    },
    {
      business_name: "MANAGEMENT_CONSULTING",
    },
    {
      business_name: "MARITIME",
    },
    {
      business_name: "MARKETING_ADVERTISING_SALES",
    },
    {
      business_name: "MARKET_RESEARCH",
    },
    {
      business_name: "MECHANICAL_OR_INDUSTRIAL_ENGINEERING",
    },
    {
      business_name: "MEDIA_PRODUCTION",
    },
    {
      business_name: "MEDICAL_EQUIPMENT",
    },
    {
      business_name: "MEDICAL_PRACTICE",
    },
    {
      business_name: "MENTAL_HEALTH_CARE",
    },
    {
      business_name: "MILITARY_INDUSTRY",
    },
    {
      business_name: "MINING_METALS",
    },
    {
      business_name: "MOTION_PICTURES_FILM",
    },
    {
      business_name: "MUSEUMS_INSTITUTIONS",
    },
    {
      business_name: "MUSIC",
    },
    {
      business_name: "NANOTECHNOLOGY",
    },
    {
      business_name: "NEWSPAPERS_JOURNALISM",
    },
    {
      business_name: "NON_PROFIT_VOLUNTEERING",
    },
    {
      business_name: "OIL_ENERGY_SOLAR_GREENTECH",
    },
    {
      business_name: "ONLINE_PUBLISHING",
    },
    {
      business_name: "OTHER_NDUSTRY",
    },
    {
      business_name: "OUTSOURCING_OFFSHORING",
    },
    {
      business_name: "PACKAGE_FREIGHT_DELIVERY",
    },
    {
      business_name: "PACKAGING_CONTAINERS",
    },
    {
      business_name: "PAPER_FOREST_PRODUCTS",
    },
    {
      business_name: "PERFORMING_ARTS",
    },
    {
      business_name: "PHARMACEUTICALS",
    },
    {
      business_name: "PHILANTHROPY",
    },
    {
      business_name: "PHOTOGRAPHY",
    },
    {
      business_name: "PLASTICS",
    },
    {
      business_name: "POLITICAL_ORGANIZATION",
    },
    {
      business_name: "PRIMARY_SECONDARY_EDUCATION",
    },
    {
      business_name: "PRINTING",
    },
    {
      business_name: "PROFESSIONAL_RAINING",
    },
    {
      business_name: "PROGRAM_DEVELOPMENT",
    },
    {
      business_name: "PUBLIC_RELATIONS_PR",
    },
    {
      business_name: "PUBLIC_SAFETY",
    },
    {
      business_name: "PUBLISHING_INDUSTRY",
    },
    {
      business_name: "RAILROAD_MANUFACTURE",
    },
    {
      business_name: "RANCHING",
    },
    {
      business_name: "REAL_ESTATE_MORTGAGE",
    },
    {
      business_name: "RECREATIONAL_FACILITIES_SERVICES",
    },
    {
      business_name: "RELIGIOUS_INSTITUTIONS",
    },
    {
      business_name: "RENEWABLES_ENVIRONMENT",
    },
    {
      business_name: "RESEARCH_INDUSTRY",
    },
    {
      business_name: "RESTAURANTS",
    },
    {
      business_name: "RETAIL_INDUSTRY",
    },
    {
      business_name: "SECURITY_INVESTIGATIONS",
    },
    {
      business_name: "SEMICONDUCTORS",
    },
    {
      business_name: "SHIPBUILDING",
    },
    {
      business_name: "SPORTING_GOODS",
    },
    {
      business_name: "SPORTS",
    },
    {
      business_name: "STAFFING_RECRUITING",
    },
    {
      business_name: "SUPERMARKETS",
    },
    {
      business_name: "TELECOMMUNICATIONS",
    },
    {
      business_name: "TEXTILES",
    },
    {
      business_name: "THINK_TANKS",
    },
    {
      business_name: "TOBACCO",
    },
    {
      business_name: "TRANSLATION_LOCALIZATION",
    },
    {
      business_name: "TRANSPORTATION",
    },
    {
      business_name: "UTILITIES",
    },
    {
      business_name: "VENTURE_CAPITAL_VC",
    },
    {
      business_name: "VETERINARY",
    },
    {
      business_name: "WAREHOUSING",
    },
    {
      business_name: "WHOLESALE",
    },
    {
      business_name: "WINE_SPIRITS",
    },
    {
      business_name: "WIRELESS",
    },
    {
      business_name: "WRITING_EDITING",
    },
  ];
  const [groupListCurrent, setGroupListCurrent] = React.useState([]);
  let location = useLocation();
  const handleOnGoingMonitoring = useOnGoingMonitoringPrompt();

  React.useEffect(() => {
    kybWatchGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  let filterExport = JSON.parse(JSON.stringify(selected));

  filterExport = filterExport.map((o) => {
    const exportItem = Object.assign({}, o);
    exportItem.riskLevel = o.riskLevel
      ? formatMessage({ id: getTextTranslateRisk(o.riskLevel) })
      : "-";
    exportItem.dateOfIncorporation = formatDate(o.dateOfIncorporation);
    exportItem.countryOfIncorporation = countryCodeToName(
      o.countryOfIncorporation
    );
    exportItem.status = formatMessage({
      id: getKybStatusTranslate(exportItem.status),
    });
    exportItem.assignee = getFullName(o.assignee);
    exportItem.updatedAt = formatDate(o.updatedAt, LONG_DATE_TIME);
    return exportItem;
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
        init: () => kybActionImportCsv(formData),
        onSuccess: kybActionImportConfirm,
      });
    } catch (error) {
      snackActions.error(
        <IntlMessages id={"appModule.importCsv.serverError"} />
      );
    } finally {
      setFileRefKey(randomString(10));
    }
  };

  const handleAddToArchive = useCallback(() => {
    return dispatch(
      KYBArchiveAdapter.actionAddToArchive(selected?.map((item) => item.kybId))
    ).then(() => setSelected([]));
    // eslint-disable-next-line
  }, [selected]);

  const handleUnarchive = useCallback(() => {
    return dispatch(
      KYBArchiveAdapter.actionRemoveFromArchive(
        selected?.map((item) => item.kybId)
      )
    ).then(() => setSelected([]));
    // eslint-disable-next-line
  }, [selected]);

  const handleAddItemToArchiveList = (ids) => {
    return dispatch(KYBArchiveAdapter.actionAddToArchive(ids)).then(() =>
      setSelected([])
    );
  };
  const actionAddToGroupList = (value) => {
    let params = {
      kybIds: selected?.map((i) => i?.kybId),
      watchGroupId: value?.id,
    };

    dispatch(KYB_ACTION_ADD_TO_GROUP({ params: params }))
      .then((result) => {
        let message =
          selected?.map((i) => i?.kybId)?.length +
          " " +
          formatMessage({ id: "kyb.watch.group.add.success" }) +
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
  const templateImportKybHeader = templateExampleForImportKybCsv.headers.map(
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

  const onPressRefresh = () => {
    setOnRefresh(!onRefresh);
  };
  const handleAssign = () => {
    return setDialogAssign(!dialogAssign);
  };

  const onCloseAssign = () => {
    setDialogAssign(false);
  };
  const onSaveAssign = async (value) => {
    const kybIds = selected?.map((item) => item.kybId);
    const data = await kybActionBulkAssign({
      userId: value?.id,
      kybIds: kybIds,
    });
    if (data.status === 200) {
      dispatch(KYB_ACTION_GET_KYB_REQUESTS(paginationParams));
      setSelected([]);
      return snackActions.success(
        <FormattedHTMLMessage
          id="notification.success.bulkAssign"
          values={{
            total: kybIds.length,
            title: "KYB",
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
    if (regex?.test(KYB_ROUTE_MY_KYB)) {
      /**
       * If main page get all group list
       */
      setGroupListCurrent(watchGroup);
    }
    setSelected(value);
  };
  return (
    <Fragment>
      <PageHeading
        title={
          <Switch>
            <Route path={KYB_ROUTE_KYB_GROUP_LIST}>
              <IntlMessages id={"kyb.WatchList"} />
            </Route>
            <Route path={KYB_ROUTE_KYB_ARCHIVE_LIST}>
              <IntlMessages id="archive-list" />
            </Route>
            <Route path={KYB_ROUTE_MY_KYB}>
              <IntlMessages id={"url.all-kyb"} />
            </Route>
          </Switch>
        }
        customUrlResolver={(_index, sub) => {
          switch (sub) {
            case "kyb":
              return [<IntlMessages id={"kyb.kyb"} />, null, false];
            case "my-kyb":
              return [<IntlMessages id={"kyb.myKyb"} />, null, false];
            case "groupList":
              return [<IntlMessages id={"kyb.WatchList"} />, null, false];
            case "archiveList":
              return [<IntlMessages id={"archive-list"} />, null, false];
            default:
              break;
          }
        }}
        match={match}
      />

      <TabbedListedPageProvider selected={selected} setSelected={onPressSelect}>
        <LoadingWrapper loading={loading}>
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
              screen={"KYB"}
            />
            <TabbedListedPage
              mainTabLabel={<IntlMessages id="url.all-kyb" />}
              routes={[
                KYB_ROUTE_MY_KYB,
                KYB_ROUTE_KYB_GROUP_LIST,
                KYB_ROUTE_KYB_ARCHIVE_LIST,
              ]}
              mainTabChild={
                <div className={"d-flex align-items-center"}>
                  <div>
                    <TabbedListedPageActions
                      disableImport={
                        ACL.isAllowedPermissions("KYB_MODULE_CREATE")
                          ? false
                          : true
                      }
                      CSVLinkProps={{
                        ref: downloadTemplateRef,
                        id: "download_template_csv",
                        data: templateImportKybData,
                        filename: "import_kyb_template.csv",
                        headers: templateImportKybHeader,
                        label: (
                          <IntlMessages id="appModule.importKYB"></IntlMessages>
                        ),
                      }}
                      ExportCSVProps={{
                        nameFileExport: "KYB_MyKYB",
                        dataExport: filterExport,
                        headersExportCSV: headerExportKYBListCSV,
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
                      lectedItems={selected}
                      additionalActions={[
                        {
                          label: (
                            <IntlMessages id="appModule.button.setMonitoring" />
                          ),
                          onClick: (selected) =>
                            handleOnGoingMonitoring(selected) &&
                            setSelected([]),
                        },
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
                      ]}
                    />
                  </div>

                  <div className={"ml-2 mr-2"}>
                    <Divider
                      orientation="vertical"
                      className={styles.divider}
                    />
                  </div>
                  <div className={styles.refreshPadding}>
                    <RefreshButton onClick={onPressRefresh} />
                  </div>
                </div>
              }
            >
              <Switch>
                <Route path={KYB_ROUTE_KYB_ARCHIVE_LIST}>
                  <KYBArchiveList onRefresh={onRefresh} />
                </Route>
                <Route path={KYB_ROUTE_KYB_GROUP_LIST}>
                  <GroupList
                    onRefresh={onRefresh}
                    groupListSelect={setGroupListFilter}
                  />
                </Route>
                <Route path={KYB_ROUTE_MY_KYB}>
                  <MyKYB
                    onAddItemToArchiveList={handleAddItemToArchiveList}
                    onRefresh={onRefresh}
                  />
                </Route>
              </Switch>
            </TabbedListedPage>
          </div>
        </LoadingWrapper>
      </TabbedListedPageProvider>
    </Fragment>
  );
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPagination,
  withACL
)(memo(KYBList));
