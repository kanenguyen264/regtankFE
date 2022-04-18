import { Link as MuiLink, SvgIcon, Tooltip, Typography } from "@mui/material";
import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Link from "@protego/sdk/RegtankUI/v1/Link/Link";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable/index";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { generatePath } from "@protego/sdk/utils/router";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import RiskRatingLabel from "components/RiskRatingLabelv1";
import { TabbedListedContext } from "components/TabbedListedPagev1";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import WalletAddressText from "components/WalletAddressTextv1";
import ReferenceId from "components/ReferenceIdv1";
import LimitTooltipText from "components/LimitTooltipTextv1";
import { KYT_ROUTE_SCREEN } from "constants/routes";
import { get, isEmpty } from "lodash";
import React, { Fragment, memo, useContext, useEffect } from "react";
import { compose } from "recompose";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { CASE_ROUTE_DETAIL } from "../Case/routes";
import styles from "./KYTList.module.scss";
import { MANUAL } from "constants/KYTOM";
import SearchResultPage from "components/SearchResultPage";
import { ReactComponent as Archive } from "assets/images/icons/Archive.svg";
import Tag from "components/Tag";
import { ReactComponent as CopyIcon } from "assets/images/icons/CopyIcon.svg";
import { displayLimitText } from "util/string";
const nullable = (data, fn = (d) => d) => (isEmpty(data) ? "-" : data > fn);

const KYTTable = ({
  data,
  addFavorite,
  reScreen,
  searchNotFound,
  tab,
  onAddItemToArchiveList,
  onRefresh,
}) => {
  const { selected, setSelected } = useContext(TabbedListedContext);
  const setSelectedKYT = (value) => {
    setSelected(value);
  };
  useEffect(() => {
    setSelected([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRefresh]);
  return (
    <Fragment>
      {searchNotFound && (
        <SearchResultPage
          title={<IntlMessages id={"popup.message.no.search.result"} />}
        />
      )}
      <CustomTable
        lang={{
          rowsPerPage: <IntlMessages id={"appModule.table.footer"} />,
        }}
        options={{
          selectable: true,
          selections: selected,
          onSelected: setSelectedKYT,
          highLight: "viewReScreened",
          disableTableHead: searchNotFound,
          isFixedFirstColumn: true,
          checkHighlight: (record) => !record.viewReScreened,
        }}
        columnData={{
          kytId: {
            label: <IntlMessages id="kyt.kytId" />,
            enable: true,
            sort: true,
            renderCell: (id, { inWatchList, omUpdated, escalatedAt }) => (
              <>
                <div
                  className={clsx(
                    styles.Link,
                    styles.Ids,
                    "d-flex align-items-center"
                  )}
                >
                  <CopyButton
                    component={"span"}
                    tooltip={<IntlMessages id="tooltip.copyID" />}
                    copyIcon={
                      <SvgIcon component={CopyIcon} viewBox="0 0 18 16" />
                    }
                  >
                    <Link
                      to={generatePath(
                        KYT_ROUTE_SCREEN,
                        { id },
                        { source: "list" }
                      )}
                      data-cy={"id"}
                    >
                      {id}
                    </Link>
                  </CopyButton>

                  {tab && (
                    <div onClick={() => onAddItemToArchiveList([id])}>
                      <div className={styles.addButton}>
                        <Tooltip
                          title={
                            <IntlMessages id="tooltip.moveToArchiveList" />
                          }
                          arrow
                        >
                          <Archive />
                        </Tooltip>
                      </div>
                    </div>
                  )}
                </div>
                <span style={{ display: "flex" }}>
                  {/* escalated */}
                  {escalatedAt && (
                    <Tag
                      color="#EE6B77"
                      brColor="rgba(238, 143, 152, 0.18)"
                      hideTooltip={true}
                      size={"small"}
                      multiLanguage
                      name={<IntlMessages id="kyc.view.log.Escalated" />}
                    />
                  )}
                  {/* OM */}
                  {omUpdated && (
                    <Tag
                      color="#4DA6FF"
                      brColor="#66b3ff2e"
                      hideTooltip={true}
                      size={"small"}
                      multiLanguage
                      name={<IntlMessages id="appModule.OMUpdated" />}
                    />
                  )}
                </span>
              </>
            ),
          },
          "addressDetails.risk.risk": {
            label: <IntlMessages id="risk-score" />,
            enable: true,
            sort: true,
            align: "center",
            renderCell: (v, { addressDetails }) => {
              const riskLevel = get(addressDetails, "risk.riskLevel");
              const changes = get(addressDetails, "kytRiskScoreChangeHistory");
              const hasChange = changes && changes.length;
              const isManuallyEdited = hasChange && changes[0].type === MANUAL;
              return (
                <RiskRatingLabel
                  level={riskLevel}
                  value={v}
                  // numberOfChanges={0}
                  isManualEdit={isManuallyEdited}
                />
              );
            },
          },
          referenceId: {
            align: "center",
            label: <IntlMessages id="reference-id" />,
            enable: true,
            sort: true,
            renderCell: (v) => {
              const href =
                v &&
                generatePath(
                  CASE_ROUTE_DETAIL,
                  { caseId: encodeURIComponent(v) },
                  { reference: true }
                );
              return (
                <ReferenceId
                  text={v ? v : "-"}
                  href={href}
                  disableCopy={v ? false : true}
                  isRouter={true}
                  limitText={v && displayLimitText(v)}
                />
              );
            },
          },
          "addressDetails.address": {
            align: "center",
            label: <IntlMessages id="wallet-address" />,
            enable: true,
            sort: true,
            style: { width: toRem(190) },
            renderCell: (v, rowData) => {
              return (
                <WalletAddressText
                  rowData={rowData}
                  enableNewTransactionMonitoring={
                    rowData?.enableNewTransactionMonitoring
                  }
                  enableNewRiskMonitoring={rowData?.enableNewRiskMonitoring}
                  // width={19}
                  text={v}
                  limitText={v && displayLimitText(v, 11)}
                />
              );
            },
          },
          asset: {
            align: "center",
            label: <IntlMessages id="appModule.asset" />,
            enable: true,
            sort: true,
          },
          "addressDetails.currentBalance": {
            align: "center",
            label: <IntlMessages id="balance" />,
            enable: true,
            sort: true,
            renderCell: (v) => {
              return v ? (
                <LimitTooltipText
                  text={v}
                  disableCopy
                  isRouter={true}
                  limitText={v && displayLimitText(String(v), 6)}
                />
              ) : (
                "-"
              );
            },
          },
          "addressDetails.wallet.name": {
            label: <IntlMessages id="owner" />,
            enable: true,
            sort: true,
            align: "center",
            renderCell: (v, { addressDetails: { wallet } }) => {
              if (!v || v.trim().length === 0) {
                return nullable(v);
              }

              if (wallet.url && wallet.url.length) {
                return (
                  <MuiLink
                    style={{ textDecoration: "none" }}
                    href={wallet.url}
                    target="_blank"
                  >
                    {v}
                  </MuiLink>
                );
              }
              return v;
            },
          },
          "addressDetails.wallet.country": {
            label: <IntlMessages id="country" />,
            enable: true,
            sort: true,
            align: "center",
            renderCell: (v) =>
              !isEmpty(v) ? (
                <CountryFlagLanguage countryCode={v} svg size={30} />
              ) : (
                "-"
              ),
          },
          assignee: {
            label: <IntlMessages id="kyt.assignee" />,

            sort: true,
            align: "left",
            className: styles.assign,
            renderCell: (v) => (
              <Nullable
                className={styles.assignPadding}
                component={UserAvatar}
                valueProp={"user"}
                // size={32}
              >
                {v}
              </Nullable>
            ),
          },
          updatedAt: {
            label: <IntlMessages id="last-modified-by" />,
            enable: true,
            sort: true,
            align: "left",
            className: styles.Update,
            renderCell: (v, { lastModifiedBy }) => (
              <div
                className={`align-items-center ${lastModifiedBy && "d-flex"}`}
              >
                <Nullable
                  component={UserAvatar}
                  valueProp={"user"}
                  description={formatDate(v, LONG_DATE_TIME)}
                >
                  {lastModifiedBy}
                </Nullable>
              </div>
            ),
          },
        }}
        data={data}
      />
    </Fragment>
  );
};

export default compose(withPagination)(memo(KYTTable));
