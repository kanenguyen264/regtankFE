import React from "react";
import { get } from "lodash";
import { Grid, Link as MuiLink } from "@mui/material";
import styles from "./CustomColl.module.scss";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import RiskRatingLabel from "components/RiskRatingLabel";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable/index";
import Link from "@protego/sdk/RegtankUI/v1/Link/Link";
import ScreenStatusBadge from "components/ScreenStatusBadge";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { formatDate, LONG_DATE_TIME } from "util/date";
import clsx from "clsx";
import { displayLimitText } from "util/string";
import  Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";

export const renderOwner = (value) => {
  let v = get(value?.addressDetails, "wallet.name");
  let wallet = get(value?.addressDetails, "wallet");
  if (!v || v.trim().length === 0) {
    // return nullable(v);
    return "_";
  }

  if (wallet.url && wallet.url.length) {
    return (
      <Tooltip arrow title={v} placement={"top-start"}>
        <MuiLink href={wallet.url} target="_blank">
          {displayLimitText(v)}
        </MuiLink>
      </Tooltip>
    );
  }
  return (
    <Tooltip arrow title={v} placement={"top-start"}>
      <div>{displayLimitText(v)}</div>
    </Tooltip>
  );
};

const CustomColl = (value) => {
  const riskLevel = get(value?.addressDetails, "risk.riskLevel");
  const changes = get(value?.addressDetails, "kytRiskScoreChangeHistory");
  const riskValue = get(value?.addressDetails, "risk.risk");
  const hasChange = changes && changes.length;
  // const isManuallyEdited = hasChange && changes[0].type === MANUAL;
  return (
    <div className={styles.CustomColWrapper}>
      <div className={styles.rowCustom}>
        <div className={clsx("d-flex flex-column", styles.Col_1)}>
          <span className={styles.textPlaceholder}>
            <IntlMessages id={"risk-score"} />
          </span>
          <div className={"mt-1"}>
            <RiskRatingLabel
              level={riskLevel}
              value={riskValue}
              // isManualEdit={isManuallyEdited}
            />
          </div>
        </div>
        <div className={clsx("d-flex flex-column", styles.Col_2)}>
          <span className={styles.textPlaceholder}>
            <IntlMessages id={"case.detail.table.kyt.header.assetType"} />
          </span>
          <span className={styles.CellText}>{value?.asset}</span>
        </div>
        <div className={clsx("d-flex flex-column", styles.Col_3)}>
          <div className={"d-flex"}>
            <span className={styles.textPlaceholder}>
              <IntlMessages id={"table.column.refId"} />
            </span>
          </div>
          <div className={styles.textOverflow}>
            <Nullable
              component={Link}
              // to={
              //   value?.referenceId &&
              //   generatePath(
              //     CASE_ROUTE_DETAIL,
              //     { caseId: encodeURIComponent(value?.referenceId) },
              //     { reference: true }
              //   )
              // }
            >
              {value?.referenceId}
            </Nullable>
          </div>
        </div>
      </div>

      <div className={styles.rowCustom}>
        <div className={clsx("d-flex flex-column", styles.Col_1)}>
          <span className={styles.textPlaceholder}>
            <IntlMessages id={"owner"} />
          </span>
          <div className={styles.CellText}>{renderOwner(value)}</div>
        </div>
        <div className={clsx("d-flex flex-column", styles.Col_2)}>
          <span className={styles.textPlaceholder}>
            <IntlMessages id={"kyt.assignee"} />
          </span>
          <div className={styles.avatarAssign}>
            <Nullable
              component={UserAvatar}
              valueProp={"user"}
              style={{ margin: "0 auto" }}
            >
              {value?.assignee}
            </Nullable>
          </div>
        </div>
        <div className={clsx("d-flex flex-column", styles.Col_3)}>
          <span className={styles.textPlaceholder}>
            <IntlMessages id={"last-modified-by"} />
          </span>
          <div className={"d-flex align-items-center"}>
            <Nullable
              component={UserAvatar}
              valueProp={"user"}
              description={formatDate(value?.updatedAt, LONG_DATE_TIME)}
            >
              {value?.lastModifiedBy}
            </Nullable>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomColl;
