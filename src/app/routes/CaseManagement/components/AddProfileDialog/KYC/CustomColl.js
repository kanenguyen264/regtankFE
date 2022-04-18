import React from "react";
import { get } from "lodash";
import { Grid, Typography } from "@mui/material";
import styles from "./CustomColl.module.scss";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import RiskRatingLabel from "components/RiskRatingLabel";
import Nullable from "@protego/sdk/UI/Nullable/index";
import Link from "@protego/sdk/UI/Link/Link";
import ScreenStatusBadge from "components/ScreenStatusBadge";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { toRem } from "@protego/sdk/utils/measurements";
import { formatDate, LONG_DATE_TIME } from "util/date";
import clsx from "clsx";
import { style } from "@mui/system";
import ReferenceId from "components/ReferenceId";
import { displayLimitText } from "util/string";

const CustomColl = (value) => {
  const risk = get(value?.individualRiskScore, "risk");
  const riskLevel = get(value?.individualRiskScore, "riskLevel");
  const numberOfChanges = get(value?.individualRiskScore, "numberOfChanges");

  const refId = get(value, "individualRequest.referenceId");
  return (
    <div className={styles.CustomCollWrapper}>
      <div className={clsx("d-flex flex-column", styles.riskScoreCell)}>
        <span className={styles.headerCell}>
          <Typography variant="headerChildTable">
            <IntlMessages id={"risk-score"} />
          </Typography>
        </span>
        <RiskRatingLabel
          level={riskLevel}
          value={risk}
          type={value?.individualRiskScore?.isSanction === true ? "San" : ""}
          numberOfChanges={numberOfChanges}
        />
      </div>
      <div className={clsx("d-flex flex-column", styles.refIDCell)}>
        <div className={"d-flex"}>
          <span className={styles.headerCell}>
              <IntlMessages id={"table.column.refId"} />
          </span>
        </div>
        <div className={styles.textOverflow}>
          <Nullable
            component={Link}
            //   to={
            //     refId &&
            //     generatePath(
            //       CASE_ROUTE_DETAIL,
            //       { caseId: encodeURIComponent(refId) },
            //       { reference: true }
            //     )
            //   }
          >
            <ReferenceId
              text={refId}
              limitText={displayLimitText(refId)}
              disableCopy={true}
            />
          </Nullable>
        </div>
      </div>
      <div className={clsx("d-flex flex-column", styles.assigneeCell)}>
        <span className={styles.headerCell}>
            <IntlMessages id={"screening.result.Assignee"} />
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
      <div className={clsx("d-flex flex-column", styles.lastModifyCell)}>
        <span className={styles.headerCell}>
            <IntlMessages id={"last-modified-by"} />
        </span>
        <div style={{ width: toRem(150) }} className={clsx("d-flex", styles.CellText)}>
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
  );
};

export default CustomColl;
