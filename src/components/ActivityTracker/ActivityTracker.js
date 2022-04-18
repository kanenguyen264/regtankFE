import React from "react";
import styles from "./ActivityTrackerStyles.module.scss";
import { ReactComponent as ClockIcon } from "assets/icons/ClockIcon.svg";
import { useIntl } from "react-intl";
import { formatDate, LONG_DATE_TIME } from "util/date";
import clsx from "clsx";
const ActivityTracker = ({
  className = "",
  style = {},
  lastModifiedBy,
  lastModifiedAt,
  screenedBy,
  screenedAt,
  showIcon=true,
}) => {
  const { formatMessage } = useIntl();

  return (
    <div
      className={`${styles.container} ${className} d-flex align-items-center RegActivityTracker-root`}
      style={style}
    >
      {showIcon && ((lastModifiedBy && lastModifiedAt) || (screenedAt && screenedBy)) && (
        <ClockIcon className={styles.icon} />
      )}
      <div className={"d-flex align-items-center"}>
        {lastModifiedBy && lastModifiedAt && (
          <span className={clsx(styles.item, "RegActivityTracker-item")}>
            {formatMessage(
              { id: "last-modified-info" },
              {
                name: <strong>{lastModifiedBy}</strong>,
                time: formatDate(lastModifiedAt, LONG_DATE_TIME)
              }
            )}
          </span>
        )}

        {screenedBy && screenedAt && (
          <span className={clsx(styles.item, "RegActivityTracker-item")}>
            {formatMessage(
              { id: "created-info" },
              {
                name: <strong>{screenedBy}</strong>,
                time: formatDate(screenedAt, LONG_DATE_TIME)
              }
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default ActivityTracker;
