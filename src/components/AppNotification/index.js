import React from "react";

import NotificationItem from "./NotificationItem";
import CustomScrollbars from "util/hocs/CustomScrollbars";
import { useSelector } from "react-redux";

const AppNotification = () => {
  const notificationsPopup = useSelector(
    (state) => state.notifications.notificationsPopup
  );
  return (
    <CustomScrollbars className="scrollbar" style={{ height: 440 }}>
      {notificationsPopup && notificationsPopup.records && (
        <ul className="list-unstyled">
          {notificationsPopup.records.map((notification, index) => {
            return <NotificationItem key={index} notification={notification} />;
          })}
        </ul>
      )}
    </CustomScrollbars>
  );
};

export default AppNotification;
