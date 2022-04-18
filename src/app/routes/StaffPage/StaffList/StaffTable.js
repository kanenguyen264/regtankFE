import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import Link from "@protego/sdk/RegtankUI/v1/Link";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable/Nullable";
import clsx from "clsx";
import LongMenu from "components/menuNPaper/long/LongMenu";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { compose } from "recompose";
import { checkRoleUser } from "util/aclRoles";
import { formatDate, LONG_DATE_TIME, TIME, LONG_DATE } from "util/date";
import { getFullName } from "util/string";
import styles from "./style.module.scss";
import { withACL } from "../../../../acl";
import { displayLimitText } from "util/string";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import Switch from '../components/CustomSwitch';
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";

const userDeleted = {
  firstName: "?",
  colorCode: "#444444",
};

const listOption = [
  { id: 2, label: "Edit" },
  { id: 4, label: "resendActivationLink" },
  { id: 3, label: "Delete" },
];
const checkPermissions = (ACL, val, verified, supperAdmin) => {
  if (verified === true && val.id === 4) {
    return false;
  }
  if (!ACL.isAllowedPermissions("STAFF_MODULE_EDIT") && val.id === 2) {
    return false;
  }
  if (
    (!ACL.isAllowedPermissions("STAFF_MODULE_DELETE") ||
      supperAdmin === true) &&
    val.id === 3
  ) {
    return false;
  }
  return true;
};

const filterListOption = (verified, ACL, supperAdmin) => {
  let dataFilterListOption = listOption.filter((val) =>
    checkPermissions(ACL, val, verified, supperAdmin)
  );
  return dataFilterListOption;
};
const StaffTable = React.memo(function ({
  ACL,
  data,
  onSelectOption,
  onToggleActivation,
}) {
  const intl = useIntl();

  return (
    <CustomTable
      lang={{
        rowsPerPage: <IntlMessages id={"appModule.table.footer"} />,
      }}
      labelDisplayedRows={({ from, to, count }) => {
        return "";
      }}
      options={{
        pagination: true,
        scrollable: false,
        selectable: false,
      }}
      className={clsx("mt-0")}
      data={data}
      columnData={{
        firstName: {
          label: <IntlMessages id="staff.name" />,
          sort: true,
          enable: true,
          width: toRem(220),
          renderCell: (v, data) => {
            return (
              <Link to={`/app/staff/${data.id}`}>
                <Tooltip title={getFullName(data)} placement="top">
                  <span>{displayLimitText(getFullName(data), 20)}</span>
                </Tooltip>
              </Link>
            );
          },
        },
        id: {
          label: <IntlMessages id="staff.id" />,
          enable: true,
          renderCell: (v) => {
            return (
              <Nullable>{v}</Nullable>
            );
          },
        },
        roles: {
          label: <IntlMessages id="staff.table.role" />,
          sort: true,
          enable: true,
          renderCell: (v) => {
            return <Nullable>{checkRoleUser(v)?.displayName}</Nullable>;
          },
        },
        department: {
          label: <IntlMessages id="staff.department" />,
          sort: false,
          enable: true,
          renderCell: (v) => <Nullable>{v?.name}</Nullable>,
        },
        createdBy: {
          label: <IntlMessages id="staff.table.createdby" />,
          sort: true,
          enable: true,
          renderCell: (v, { createdAt }) => {
            return v ? (
              <Nullable
                component={UserAvatar}
                valueProp={"user"}
                size={40}
                txtSize={13}
                description={
                  <div
                    className={clsx(styles.createdByDesc)}
                    style={{ fontSize: toRem(16), color: ThemeColors.bodyText }}
                  >
                    <span>{formatDate(createdAt, LONG_DATE)}</span>
                    <br />
                    <span>{formatDate(createdAt, TIME)}</span>
                  </div>
                }
              >
                {{...v, bgColorCode: v?.colorCode}}
              </Nullable>
            ) : (
              <Nullable
                style={{ backgroundColor: userDeleted.color }}
                component={UserAvatar}
                user={userDeleted}
                toolTipTitle={intl.formatMessage({
                  id: "appModule.deletedUser",
                })}
                description={formatDate(createdAt, LONG_DATE_TIME)}
              >
                {createdAt}
              </Nullable>
            );
          },
        },
        lastAccessed: {
          label: <IntlMessages id="staff.table.lastAssessed" />,
          sort: false,
          enable: true,
          renderCell: (v, { verified }) => {
            if (verified == false) {
              return (
                <IntlMessages id="staff.table.lastaccessend.activated.notyet" />
              );
            } else if (v == null) {
              return (
                <IntlMessages id="staff.table.lastaccessend.signin.notyet" />
              );
            }

            return <Nullable>{formatDate(v, LONG_DATE_TIME)}</Nullable>;
          },
        },
        locked: {
          label: <IntlMessages id="staff.table.active" />,
          sort: false,
          enable: true,
          width: toRem(150),
          renderCell: (v, data) => {
            return (
              !data?.isSuperAdmin && (
                <div>
                  <Switch
                    disabled={!ACL.isAllowedPermissions("STAFF_MODULE_EDIT")}
                    onClick={(event) => onToggleActivation(event, data)}
                    checked={!v}
                  />
                </div>
              )
            );
          },
        },
        bio: {
          label: <IntlMessages id="staff.table.actions" />,
          width: toRem(150),
          sort: false,
          renderCell: (v, data) => {
            return (
              <div onClick={(e) => e.stopPropagation()}>
                <LongMenu
                  data={filterListOption(data.verified, ACL, data.isSuperAdmin)}
                  id={data}
                  onSelected={(option, item) => {
                    onSelectOption(item, option?.label);
                  }}
                />
              </div>
            );
          },
        },
      }}
    />
  );
});

export default compose(withACL, withPagination)(StaffTable);
