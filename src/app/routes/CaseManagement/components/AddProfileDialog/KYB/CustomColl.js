import React from "react";
import { get } from "lodash";
import { Grid, Link as MuiLink } from "@mui/material";
import styles from "./CustomColl.module.scss";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import RiskRatingLabel from "components/RiskRatingLabel";
import Nullable from "@protego/sdk/UI/Nullable/index";
import Link from "@protego/sdk/UI/Link/Link";
import ScreenStatusBadge from "components/ScreenStatusBadge";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { toRem } from "@protego/sdk/utils/measurements";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { style } from "@mui/styles";
import clsx from "clsx";

export const renderOwner = (value) => {
  let v = get(value?.addressDetails, "wallet.name");
  let wallet = get(value?.addressDetails, "wallet");

  if (!v || v.trim().length === 0) {
    // return nullable(v);
    return "";
  }

  if (wallet.url && wallet.url.length) {
    return (
      <MuiLink href={wallet.url} target="_blank">
        {v}
      </MuiLink>
    );
  }
  return v;
};

const CustomColl = (value) => {
  const riskLevel = value?.riskLevel;
  const refId = value?.referenceId;
  // const isManuallyEdited = hasChange && changes[0].type === MANUAL;
  return (
    <div className={styles.CustomColWrapper}>
      <div className={styles.rowCustom}>
        <div className={clsx("d-flex flex-column", styles.Col_1)}>
          <span className={styles.textPlaceholder}>
            <IntlMessages id={"risk-level"} />
          </span>
          <div className={"mt-1"}>
            <RiskRatingLabel
              size="small"
              level={riskLevel}
              value={riskLevel?.split("", 1)}
              showLevel
              numberOfChanges={value?.countRiskLevelChange}
            />
          </div>
        </div>
        <div className={clsx("d-flex flex-column", styles.Col_2)}>
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
        <div className={clsx("d-flex flex-column", styles.Col_3)}>
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
      </div>
      <div className={styles.rowCustom}>
        <div className={clsx("d-flex flex-column", styles.Col_1)}>
          <span className={styles.textPlaceholder}>
            <IntlMessages id={"last-modified-by"} />
          </span>
          <div style={{ width: toRem(150) }} className={"d-flex"}>
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
