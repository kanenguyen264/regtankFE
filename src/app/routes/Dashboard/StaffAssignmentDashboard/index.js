import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable/Nullable";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { toRem } from "@protego/sdk/utils/measurements";
import { fetchStaffAssignment } from "actions/DashboardAction";
import clsx from "clsx";
// import UserAvatar from "components/UserAvatar";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFullName } from "util/string";
import { withACL } from "../../../../acl";
import styles from "./styles.module.scss";
// import { getFullName } from "util/string";

const listKycStatus = [];

const StaffAssignment = ({ ACL }) => {
  const dispatch = useDispatch();
  const [listAssignment, setListAssignment] = React.useState([]);
  const { staffAssign } = useSelector((state) => state.dashboard);
  const { customerMe } = useSelector((state) => state.settings);

  useEffect(() => {
    fetchStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (staffAssign.length > 0) {
      setListAssignment(staffAssign);
    }
  }, [staffAssign]);

  const fetchStaff = () => {
    dispatch(fetchStaffAssignment());
  };

  return (
    <div className={clsx(styles.tableWrap)}>
      <div><h5 className={styles.tableHeader}>Staff Assignment</h5></div>
      <CustomTable
        lang={{
          rowsPerPage: <IntlMessages id={"appModule.table.footer"} />,
        }}
        options={{
          pagination: true,
          // scrollable: true,
          selectable: false,
        }}
        className={styles.tableRoot}
        data={listAssignment}
        columnData={{
          assignee: {
            label: <IntlMessages id="kyc.Assignee" />,
            enable: true,
            width: "25%",
            renderCell: (v) => {
              return (
                <Nullable
                  component={UserAvatar}
                  valueProp={"user"}
                  size={32}
                  txtSize={12}
                  description={
                    <span className={styles.textCell}>
                      {v && getFullName(v)}
                    </span>
                  }
                >
                  {{ ...v, bgColorCode: v?.colorCode }}
                </Nullable>
              );
            },
          },
          "kyc.case": {
            label: <IntlMessages id="dashboard.Credit.KYCCases" />,
            enable: true,
            width: toRem(96),
            renderCell: () => {
              return <></>;
            },
          },
          Completed: {
            label: (
              <span className="d-flex align-items-center">
                <span
                  style={{ backgroundColor: "#21A453" }}
                  className={styles.dotCircle}
                ></span>
                <IntlMessages id="dashboard.status.Completed" />
              </span>
            ),
            enable: true,
            align: "center",
            renderCell: (v) => {
              return <span>{v || 0}</span>;
            },
          },
          pending: {
            label: (
              <span className="d-flex align-items-center">
                <span
                  style={{ backgroundColor: "#FEBE2D" }}
                  className={styles.dotCircle}
                ></span>
                <IntlMessages id="dashboard.status.positiveAndNoMatch" />
              </span>
            ),
            enable: true,
            align: "center",
            renderCell: (v) => {
              return <span>{v || 0}</span>;
            },
          },
          unresolved: {
            label: (
              <span className="d-flex align-items-center">
                <span
                  style={{ backgroundColor: "#D44333" }}
                  className={styles.dotCircle}
                ></span>
                <IntlMessages id="dashboard.status.Unresolved" />
              </span>
            ),
            enable: true,
            align: "center",
            renderCell: (v) => {
              return <span>{v || 0}</span>;
            },
          },
          kyb: {
            label: <IntlMessages id="dashboard.Credit.KYBCases" />,
            enable: true,
            align: "center",
            width: "20%",
            renderCell: (v) => {
              return <span>{v || 0}</span>;
            },
          },
          kyt: {
            label: <IntlMessages id="dashboard.Credit.KYTCases" />,
            enable: true,
            align: "center",
            width: "15%",
            renderCell: (v) => {
              return <span>{v || 0}</span>;
            },
          },
        }}
      />
    </div>
  );
};

export default withACL(StaffAssignment);
