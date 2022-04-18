import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import Link from "@protego/sdk/UI/Link";
import Nullable from "@protego/sdk/UI/Nullable/Nullable";
import { generatePath } from "@protego/sdk/utils/router";
import { CASE_MANAGEMENT_ACTION_GET_CASES } from "actions/CaseManagementAction";
import clsx from "clsx";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "recompose";
import { formatDate, LONG_DATE_TIME } from "util/date";
import CaseStatus from "../components/CaseStatus";
import {
  CASE_MANAGEMENT_DETAIL_ROUTE
} from "../routes";
import styles from "./style.module.scss";
import { displayLimitText } from "util/string";

const CaseTable = ({
  paginationParams,
  selected,
  setSelected,
  filterParams = [],
}) => {
  const dispatch = useDispatch();
  const caseList = useSelector((state) => state.caseManagement.list);
  const fetch = useCallback(() => {
    dispatch(
      CASE_MANAGEMENT_ACTION_GET_CASES({
        pagination: paginationParams,
        filter: filterParams,
      })
    );
  }, [dispatch, paginationParams]);

  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, [paginationParams]);
  return (
    <CustomTable
      lang={{
        rowsPerPage: <IntlMessages id={"appModule.table.footer"} />,
      }}
      labelDisplayedRows={({ from, to, count }) => {
        return `Showing ${from}–${to} of ${
          count !== -1 ? count : `more than ${to}`
        }  transactions`;
      }}
      options={{
        pagination: true,
        selectable: true,
        selections: selected,
        onSelected: setSelected,
        scrollable: true,
      }}
      className={clsx("mt-0")}
      data={caseList}
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
                buttonSize={10}
              >
                <Link
                  to={generatePath(CASE_MANAGEMENT_DETAIL_ROUTE, {
                    id: caseId,
                  })}
                >
                  {caseId}
                </Link>
              </CopyButton>
            </div>
          ),
        },
        name: {
          label: <IntlMessages id="case.table.header.referenceId" />,
          sort: true,
          enable: true,
          style: { wordBreak: "break-word" },
          width: "30%",
          className: 'pr-4',
          renderCell: (v) => <Nullable>{displayLimitText(v, 35)}</Nullable>,
        },
        status: {
          label: <IntlMessages id="case.table.header.status" />,
          sort: true,
          enable: true,
          align: "left",
          width: toRem(220),
          renderCell: (v) => {
            return v ? (
              <CaseStatus type="kyc" status={v} unresolved={0} />
            ) : (
              "-"
            );
          },
        },
        assignee: {
          label: "Assignee",
          sort: true,
          enable: true,
          width: toRem(220),
          renderCell: (v) => (
            <div
              style={{ width: toRem(170) }}
              className={"d-flex align-items-center"}
            >
              <Nullable
                component={UserAvatar}
                valueProp={"user"}
                size={36}
                txtSize={16}
                user={{
                  firstName: v?.firstName,
                  lastName: v?.lastName,
                  bgColorCode: v?.colorCode,
                }}
              >
                {v}
              </Nullable>
            </div>
          ),
        },
        lastModifiedBy: {
          label: <IntlMessages id="last-modified" />,
          sort: true,
          enable: true,
          renderCell: (v, { updatedAt }) => (
            <div
              style={{ width: toRem(170) }}
              className={"d-flex align-items-center"}
            >
              <Nullable
                component={UserAvatar}
                valueProp={"user"}
                size={36}
                txtSize={16}
                user={{
                  firstName: v?.firstName,
                  lastName: v?.lastName,
                  bgColorCode: v?.colorCode,
                }}
                description={
                  <span style={{ fontSize: toRem(16), color: "#232323" }}>
                    {formatDate(updatedAt, LONG_DATE_TIME)}
                  </span>
                }
              >
                {v}
              </Nullable>
            </div>
          ),
        },
      }}
    />
  );
};

export default compose(withPagination)(CaseTable);
