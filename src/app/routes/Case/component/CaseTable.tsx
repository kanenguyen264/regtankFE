import { Tooltip } from "@mui/material";
import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Link from "@protego/sdk/RegtankUI/v1/Link/Link";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { toRem } from "@protego/sdk/utils/measurements";
import { generatePath } from "@protego/sdk/utils/router";
import { CASE_ROUTE_DETAIL } from "app/routes/Case/routes";
//@ts-ignore
import { ReactComponent as Archive } from "assets/images/icons/Archive.svg";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import RiskRatingLabel from "components/RiskRatingLabelv1";
import ScreenStatusBadge from "components/ScreenStatusBadgev1";
import { TabbedListedContext } from "components/TabbedListedPagev1";
import { get } from "lodash";
import React, { Fragment } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { CaseColumnsData } from "types/typings-api";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { canAccessKYT } from "util/permision";
import { ACLProps, withACL } from "../../../../acl";
//@ts-ignore
import styles from "../router/CasePage.module.scss";
import { filterCols } from "../router/MyCase";

type CaseTableProps = {
  ACL?: ACLProps;
  data: PageResult<CaseListingDto> | Array<CaseListingDto>;
  onAddItemToArchiveList;
  tab;
};

const columns: CaseColumnsData = {
  "latestKyc.individualRiskScore.sortableRisk": {
    label: <IntlMessages id="case.table.header.kycRiskScore" />,
    sort: true,
    enable: true,
    sortId: "kycRisk",
    align: "center",
    renderCell: (v, { latestKyc }) => {
      const riskScore = get(latestKyc, "individualRiskScore.risk");
      const isSan = get(latestKyc, "individualRiskScore.isSanction");
      const riskLevel = get(latestKyc, "individualRiskScore.riskLevel");
      const numberOfChanges = get(
        latestKyc,
        "individualRiskScore.numberOfChanges"
      );
      return (
        <RiskRatingLabel
          level={riskLevel}
          value={riskScore}
          type={isSan ? "San" : ""}
          numberOfChanges={numberOfChanges}
        />
      );
    },
  },
  "latestKyt.addressDetails.risk.risk": {
    label: <IntlMessages id="case.table.header.kytRiskScore" />,
    sort: true,
    enable: true,
    align: "center",
    sortId: "kytRisk",
    renderCell: (v, { latestKyt }) => {
      const riskScore = get(latestKyt, "addressDetails.risk.risk");
      const riskLevel = get(latestKyt, "addressDetails.risk.riskLevel");

      return <RiskRatingLabel level={riskLevel} value={riskScore} />;
    },
  },
  "latestKyc.individualRequest.name": {
    label: <IntlMessages id="case.table.header.referenceId" />,
    sort: true,
    sortId: "kycName",
    enable: true,
    style: { wordBreak: "break-word" },
    renderCell: (v, { latestKyc }) => (
      <Nullable>{latestKyc?.individualRequest?.name}</Nullable>
    ),
  },
  "latestKyc.individualRequest.dateOfBirth": {
    label: <IntlMessages id="case.table.header.DOB" />,
    sort: true,
    sortId: "kycDob",
    enable: true,
    className: styles.with130,
    renderCell: (v, { latestKyc }) => (
      <Nullable>
        {formatDate(latestKyc?.individualRequest?.dateOfBirth)}
      </Nullable>
    ),
  },
  "latestKyc.individualRequest.nationality": {
    label: <IntlMessages id="case.table.header.nationality" />,
    sort: true,
    sortId: "kycNationality",
    align: "center",
    enable: true,
    renderCell: (v, { latestKyc }) => (
      <Nullable
        component={CountryFlagLanguage}
        valueProp={"countryCode"}
        svg
        demonym
      >
        {latestKyc?.individualRequest?.nationality}
      </Nullable>
    ),
  },
  "latestKyc.status": {
    label: <IntlMessages id="case.table.header.status" />,
    sort: true,
    sortId: "kycStatus",
    enable: true,
    align: "left",
    style: { width: toRem(170) },
    renderCell: (v, { latestKyc }) => {
      return latestKyc ? (
        <ScreenStatusBadge
          type="kyc"
          status={latestKyc?.status}
          unresolved={latestKyc?.unresolved}
        />
      ) : (
        "-"
      );
    },
  },
  "latestKyc.updatedAt": {
    label: <IntlMessages id="case.table.header.lastKycScreenBy" />,
    sort: true,
    sortId: "kycUpdatedAt",
    enable: true,
    renderCell: (v, { latestKyc }) => (
      <div
        style={{ width: toRem(170) }}
        className={"d-flex align-items-center"}
      >
        <Nullable
          component={UserAvatar}
          valueProp={"user"}
          description={formatDate(v, LONG_DATE_TIME)}
        >
          {latestKyc?.lastModifiedBy}
        </Nullable>
      </div>
    ),
  },
  "latestKyt.updatedAt": {
    label: <IntlMessages id="case.table.header.lastKytScreenBy" />,
    sort: true,
    sortId: "kytUpdatedAt",
    enable: true,
    className: styles.with210,
    renderCell: (v, { latestKyt }) => {
      const lastModifiedBy = get(latestKyt, "lastModifiedBy");
      return (
        <div
          style={{ width: toRem(170) }}
          className={clsx("d-flex", "align-items-center")}
        >
          <Nullable
            component={UserAvatar}
            valueProp={"user"}
            description={formatDate(v, LONG_DATE_TIME)}
          >
            {lastModifiedBy}
          </Nullable>
        </div>
      );
    },
  },
};

const CaseTable = function CaseTable(props: CaseTableProps) {
  const { data, tab, onAddItemToArchiveList, ACL } = props;
  const { selected, setSelected } = React.useContext(TabbedListedContext);
  const { customerMe } = useSelector(
    (state: any) => state.settings,
    shallowEqual
  );

  return (
    <Fragment>
      <CustomTable<CaseListingDto>
        lang={{
          rowsPerPage: <IntlMessages id={"appModule.table.footer"} />,
        }}
        options={{
          pagination: true,
          selectable: true,
          selections: selected,
          onSelected: setSelected,
          isFixedFirstColumn: true,
        }}
        className={clsx("mt-0", [
          {
            [styles.tableFixed]:
              !ACL.isAllowedPermissions("KYC_MODULE_VIEW") &&
              !ACL.isAllowedPermissions("KYT_MODULE_VIEW"),
          },
        ])}
        data={data}
        columnData={{
          caseId: {
            label: <IntlMessages id="case.table.header.caseId" />,
            sort: true,
            enable: true,
            renderCell: (caseId) => (
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
                >
                  <Link
                    to={generatePath(CASE_ROUTE_DETAIL, {
                      caseId: caseId as string,
                    })}
                  >
                    {caseId}
                  </Link>
                </CopyButton>
                {tab && (
                  <div onClick={() => onAddItemToArchiveList([caseId])}>
                    <div className={styles.addButton}>
                      <Tooltip
                        title={<IntlMessages id="tooltip.moveToArchiveList" />}
                        arrow
                      >
                        <Archive />
                      </Tooltip>
                    </div>
                  </div>
                )}
              </div>
            ),
          },
          ...filterCols(
            columns,
            !ACL.isAllowedPermissions("KYC_MODULE_VIEW"),
            !(
              canAccessKYT(customerMe) &&
              ACL.isAllowedPermissions("KYT_MODULE_VIEW")
            )
          ),
        }}
      />
    </Fragment>
  );
};

export default withACL(CaseTable);
