import { makeStyles } from "@mui/styles";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { generatePath } from "@protego/sdk/utils/router";
import { fetchAllNotificationIdRead } from "actions";
import {
  KYB_ROUTE_KYB_SCREEN_RESULT,
  KYC_ROUTE_KYC_SCREEN_RESULT,
  KYC_ROUTE_KYC_SCREEN_DETAIL,
  KYT_ROUTE_SCREEN,
  KYB_ROUTE_MY_KYB,
  KYC_ROUTE_MY_KYC,
  KYT_ROUTE_MY_KYT,
  DJ_KYC_ROUTE_MY_KYC,
  DJ_KYC_ROUTE_KYC_SCREEN_RESULT,
  KYB_ROUTE_KYB_SCREEN_DETAIL,
  DJ_KYC_ROUTE_KYC_SCREEN_DETAIL,
} from "constants/routes";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { getFullName } from "util/string";
import styles from "./AppNotifications.module.scss";
import { ReactComponent as ReScreenIcon } from "assets/icons/ic_reScreen.svg";
import { ReactComponent as OmIcon } from "assets/icons/ic_onGoingMonitor.svg";
import { NEW_TRANSACTION } from "constants/KYTOM";
import { FormattedHTMLMessage } from "react-intl";
import clsx from "clsx";
import { Grid, Typography } from "@mui/material";
import { toRem } from "@protego/sdk/utils/measurements";
import { KYB_MONITOR_CHANGE } from "constants/ActionTypes";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
const useStyles = makeStyles((theme) => ({
  name: {
    color: theme.palette.text.body,
  },
  date: {
    color: theme.palette.text.secondary,
  },
  notificationItem: {
    "&.highlight": {
      backgroundColor: ThemeColors.highLight,
    },
    "& .container": {
      padding: `${toRem(15)} ${toRem(24)}  ${toRem(8)} ${toRem(24)}`,
    },
    "&:last-child .container": {
      borderBottom: "none",
    },

    "& .icon": {
      maxWidth: toRem(36),
      maxHeight: toRem(36),
    },
  },
  content: {
    borderBottom: `1px solid ${ThemeColors.grayText1}`,
  },
}));

const NotificationItem = ({ notification }) => {
  const history = useHistory();
  const { id, createdAt, payload, type, read } = notification;

  function redirectToDetailPage(notification) {
    const isBulk = notification.payload?.refId?.split(",").length > 1;
    if (isBulk) {
      if (notification.payload?.type === "KYB") {
        history.push(generatePath(KYB_ROUTE_MY_KYB));
      } else if (notification.payload?.type === "KYC") {
        history.push(generatePath(KYC_ROUTE_MY_KYC));
      } else if (notification.payload?.type === "KYT") {
        history.push(generatePath(KYT_ROUTE_MY_KYT));
      } else if (notification.payload?.type === "DJKYC") {
        history.push(generatePath(DJ_KYC_ROUTE_MY_KYC));
      }
    } else {
      if (notification.payload?.type === "KYB") {
        history.push(
          generatePath(KYB_ROUTE_KYB_SCREEN_RESULT, {
            kybId: notification.payload?.refId,
          })
        );
      } else if (notification.payload?.type === "KYC") {
        history.push(
          generatePath(KYC_ROUTE_KYC_SCREEN_RESULT, {
            kycId: notification.payload?.refId,
          })
        );
      } else if (notification.payload?.type === "DJKYC") {
        history.push(
          generatePath(DJ_KYC_ROUTE_KYC_SCREEN_RESULT, {
            kycId: notification.payload?.refId,
          })
        );
      } else {
        if (notification.payload?.refId) {
          history.push(
            generatePath(
              KYT_ROUTE_SCREEN,
              { id: notification.payload?.refId },
              { source: "notification" }
            )
          );
        }
      }
    }
  }

  return (() => {
    switch (type) {
      case "ASSIGN":
        return (
          <NotificationItemInternal
            id={id}
            user={payload?.assigner}
            title={
              payload?.refId.split(",").length > 1 ? (
                <FormattedHTMLMessage
                  id="notification.bulkAssign"
                  values={{
                    total: payload?.refId?.split(",").length,
                    title: payload.type,
                    assigner: getFullName(payload?.assigner),
                  }}
                />
              ) : (
                <>
                  <b>{getFullName(payload?.assigner)}</b>{" "}
                  <IntlMessages id="notifications.assignedToYou" />:{" "}
                  <b>{notification.payload?.refId}</b>
                </>
              )
            }
            onClick={() => redirectToDetailPage(notification)}
            read={read}
            date={createdAt}
          />
        );
      case "REASSIGN":
        return (
          <NotificationItemInternal
            id={id}
            read={read}
            date={createdAt}
            user={payload?.assigner}
            title={
              <div>
                <b>{getFullName(notification.payload.oldAssignee)}</b>{" "}
                <span>
                  <IntlMessages id="audit.testTypeRemoveStaff" />
                </span>{" "}
                <b>{getFullName(notification.payload.assignee)}</b>{" "}
                <span>
                  {" "}
                  <IntlMessages id="audit.by" />
                </span>{" "}
                <b>{getFullName(notification.payload.assigner)}</b>
              </div>
            }
          />
        );
      case "RE_SCREENED":
        return (
          <NotificationItemInternal
            id={id}
            icon={<ReScreenIcon />}
            title={
              <>
                <b>{payload?.refId}</b>
                <span>
                  {payload?.onGoingMonitoringType === NEW_TRANSACTION ? (
                    <IntlMessages id="kyt.notification.log.transaction" />
                  ) : (
                    <IntlMessages id="kyt.notification.log.risk.score" />
                  )}
                </span>
              </>
            }
            onClick={() => {
              redirectToDetailPage(notification);
            }}
            date={createdAt}
            read={read}
          />
        );
      case "ESCALATE":
        return (
          <NotificationItemInternal
            id={id}
            read={read}
            date={createdAt}
            user={payload?.escalatedBy}
            title={
              <FormattedHTMLMessage
                id="notifications.escalated"
                values={{
                  title: payload?.refId,
                  assigner: getFullName(payload?.escalatedBy),
                }}
              />
            }
            onClick={() => redirectToDetailPage(notification)}
          />
        );
      case "KYC_MONITOR_CHANGE":
        return (
          <NotificationItemInternal
            id={id}
            read={read}
            date={createdAt}
            icon={<OmIcon />}
            title={
              <FormattedHTMLMessage
                id="notifications.kycMonitor"
                values={{ name: `${payload?.kycId}-${payload?.matchId}` }}
              />
            }
            onClick={() => {
              history.push(
                generatePath(KYC_ROUTE_KYC_SCREEN_DETAIL, {
                  kycId: payload?.kycId,
                  matchId: payload?.matchId,
                })
              );
            }}
          />
        );
      case "DJ_KYC_MONITOR_CHANGE":
        return (
          <NotificationItemInternal
            id={id}
            read={read}
            date={createdAt}
            icon={<OmIcon />}
            title={
              <FormattedHTMLMessage
                id="notifications.kycMonitor"
                values={{ name: `${payload?.djKycId}-${payload?.matchId}` }}
              />
            }
            onClick={() => {
              history.push(
                generatePath(DJ_KYC_ROUTE_KYC_SCREEN_DETAIL, {
                  kycId: payload?.djKycId,
                  matchId: payload?.matchId,
                })
              );
            }}
          />
        );
      case "KYB_MONITOR_CHANGE":
        return (
          <NotificationItemInternal
            id={id}
            read={read}
            date={createdAt}
            icon={<OmIcon />}
            title={
              <FormattedHTMLMessage
                id="notifications.kycMonitor"
                values={{ name: `${payload?.kybId}-${payload?.matchId}` }}
              />
            }
            onClick={() => {
              history.push(
                generatePath(KYB_ROUTE_KYB_SCREEN_DETAIL, {
                  kybId: payload?.kybId,
                  matchId: payload?.matchId,
                })
              );
            }}
          />
        );

      default:
        return null;
    }
  })();
};

const NotificationItemInternal = ({
  id,
  icon,
  user,
  title,
  date,
  read,
  onClick,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleClick = (e) => {
    dispatch(fetchAllNotificationIdRead(id));
    onClick && onClick(e);
  };

  return (
    <div
      className={clsx(
        styles.NotificationItem,
        classes.notificationItem,
        "pointer",
        {
          highlight: !read,
        }
      )}
      onClick={handleClick}
    >
      <div className={classes.content}>
        <Grid container className="container">
          <Grid item xs={2}>
            {icon ? (
              <div>{icon}</div>
            ) : user ? (
              <UserAvatar user={user} size={36} />
            ) : null}
          </Grid>

          <Grid item xs={10}>
            <Typography variant={"labelFieldBlack"}>
              <div>{title}</div>
            </Typography>
            <Typography variant={"smallGrayDefault"}>
              <div className={styles.datePadding}>
                {formatDate(date, LONG_DATE_TIME)}
              </div>
            </Typography>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default NotificationItem;
