import { Typography } from "@mui/material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import clsx from "clsx";
import React from "react";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { ACTIVITY_TYPES } from "../../../constants/LivenessTest";
import styles from "../Audit/AuditPage.module.scss";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";


const ActivityItem = React.memo(function ActivityItem(props) {
  const { item } = props;
  const actionBy = <span className={clsx(styles.Link)}>{item?.actionBy}</span>;
  const time = <div className={styles.textActivityDateTime}>
    {formatDate(item.createdDate, LONG_DATE_TIME)}
  </div>;
  switch (item.activityType) {
    case ACTIVITY_TYPES.SEND_MAIL:
      return (
        <div className={styles.itemContainer}>
          <div className={styles.itemPadding}>
            <div>
              {actionBy}<text>&nbsp; <IntlMessages id="liveness.sentMail" /></text>
            </div>
            {time}
          </div>
        </div>
      );
    case ACTIVITY_TYPES.USER_CREATE_REQUEST:
      return (
        <div className={styles.itemContainer}>
          <div className={styles.itemPadding}>
            <div>
              <IntlMessages id="liveness.requestCreated" />
            </div>
            {time}
          </div>
        </div>
      );
    case ACTIVITY_TYPES.USER_UPLOAD_DOCUMENT:
      return (
        <div className={styles.itemContainer}>
          <div className={styles.itemPadding}>
            <div>
              {actionBy} <text>&nbsp; <IntlMessages id="liveness.uploadedDocument" /></text>
            </div>
            {time}
          </div>
        </div>
      );
    case ACTIVITY_TYPES.USER_LIVENESS_TEST:
      return (
        <div className={styles.itemContainer}>
          <div className={styles.itemPadding}>
            <div>
              {actionBy} <text>&nbsp; <IntlMessages id="liveness.doLivenessTest" /></text> <span className={clsx(styles.Link)}><i>{item?.remark}</i></span>
            </div>
            {time}
          </div>
        </div>
      );
    case ACTIVITY_TYPES.USER_SUBMIT:
      return (
        <div className={styles.itemContainer}>
          <div className={styles.itemPadding}>
            <div>
              {actionBy} <text>&nbsp; <IntlMessages id="liveness.submitRequest" /></text>
            </div>
            {time}
          </div>
        </div>
      );
    case ACTIVITY_TYPES.ADMIN_APPROVE:
      return (
        <div className={styles.itemContainer}>
          <div className={styles.itemPadding}>
            <div>
              {actionBy} <text>&nbsp; <IntlMessages id="liveness.adminApprove" /></text>
            </div>
            {time}
          </div>
        </div>
      );
    case ACTIVITY_TYPES.ADMIN_REJECT:
      return (
        <div className={styles.itemContainer}>
          <div className={styles.itemPadding}>
            <div>
              {actionBy} <text>&nbsp; <IntlMessages id="liveness.adminReject" /></text> <span className={clsx(styles.Link)}><i>{item?.remark}</i></span>
            </div>
            {time}
          </div>
        </div>
      );
    default:
      break;
  }
  return null;
});

const LivenessActivity = (props) => {
  return (
    <JRCard
      dense
      header={
        <Typography style={{ fontSize: toRem(21) }}>
          <IntlMessages id="liveness.activity" />
        </Typography>
      }
      headerLine
      fullBody
    >
      <div>
        {props?.activities?.map((item, index) => (
          <ActivityItem key={index} item={item} {...props} />
        ))}
      </div>
    </JRCard>
  );
};
export default LivenessActivity;
