import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import React, { memo, useEffect } from "react";
import { compose } from "recompose";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Nullable from "@protego/sdk/UI/Nullable/index";
import UserAvatar from "components/UserAvatar";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { ReactComponent as LockIcon } from "assets/icons/ic_lock.svg";
import { toRem } from "@protego/sdk/utils/measurements";
import Tag from "components/Tag";
import { Tooltip } from "@material-ui/core";
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
import { FormattedHTMLMessage } from "react-intl";
import DeleteDepartment from "./DeleteDepartment";
import DepartmentDetail from "./DepartmentDetail";
import MoreDepartmentAccess from "./MoreDepartmentAccess";
import Switch from "@protego/sdk/RegtankUI/v1/Switch/BasicSwitch";
import { fetchDepartmentList } from "actions/Setting.js";
import { useDispatch } from "react-redux";
import { fetchDepartmentListAll } from "actions/Setting.js";
const DepartmentTable = ({ ACL, data }) => {
  const dispatch = useDispatch();
  const isEditDepartment = ACL.isAllowedPermissions("DEPARTMENT_MODULE_EDIT");
  const isDeleteDepartment = ACL.isAllowedPermissions(
    "DEPARTMENT_MODULE_DELETE"
  );
  const isLockedFunction = ACL.isAllowedPermissions("LOCKED_FUNCTION_EDIT");
  const fetch = () => {
    dispatch(fetchDepartmentListAll());
  };
  React.useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <CustomTable
        lang={{
          rowsPerPage: <IntlMessages id={"appModule.table.footer"} />,
        }}
        options={{
          selectable: false,
          disableShowing: false,
        }}
        data={data}
        columnData={{
          name: {
            label: (
              <IntlMessages id="setting.department.table.departmentName" />
            ),
            headerProps: {
              style: {
                paddingLeft: toRem(30),
              },
            },
            style: { minWidth: toRem(200), paddingLeft: toRem(30) },
            sort: true,
            align: "left",
            renderCell: (v) => <div>{v}</div>,
          },
          numberOfStaffs: {
            label: <IntlMessages id="setting.department.table.NoOfStaffs" />,
            sort: false,
            align: "left",
            renderCell: (v) => <div>{v}</div>,
          },
          departmentAccesses: {
            label: (
              <div className={"d-flex "}>
                <IntlMessages id="setting.department.table.departmentAccess" />
                <div className={"pl-1"}>
                  <Tooltip
                    arrow
                    title={
                      <div className="custom-tooltip">
                        <h5>
                          <IntlMessages id="setting.department.table.departmentAccess" />
                        </h5>
                        <p>
                          <FormattedHTMLMessage id="setting.department.table.departmentAccess.tooltip" />
                        </p>
                      </div>
                    }
                    enterDelay={300}
                  >
                    <QuestionMarkIcon />
                  </Tooltip>
                </div>
              </div>
            ),
            sort: false,
            align: "left",
            style: { maxWidth: toRem(200) },
            renderCell: (v, item) => (
              <div>
                {v.length > 4 ? (
                  <>
                    {v.slice(0, 3).map((item, index) => {
                      return (
                        <span key={index}>
                          <Tag
                            color="rgba(43, 43, 43, 0.7)"
                            brColor="#F5F5F5"
                            hideTooltip={true}
                            size={"small"}
                            multiLanguage
                            name={item.name}
                          />
                        </span>
                      );
                    })}

                    <MoreDepartmentAccess data={item} total={v.length} />
                  </>
                ) : (
                  v.map((item, index) => {
                    return (
                      <span key={index}>
                        <Tag
                          color="rgba(43, 43, 43, 0.7)"
                          brColor="#F5F5F5"
                          hideTooltip={true}
                          size={"small"}
                          multiLanguage
                          name={item.name}
                        />
                      </span>
                    );
                  })
                )}
              </div>
            ),
          },
          createdAt: {
            label: <IntlMessages id="setting.department.table.CreatedBy" />,
            sort: true,
            renderCell: (v, { createdBy }) => (
              <div className={"d-flex align-items-center"}>
                <Nullable
                  component={UserAvatar}
                  valueProp={"user"}
                  description={formatDate(v, LONG_DATE_TIME)}
                >
                  {createdBy}
                </Nullable>
              </div>
            ),
          },
          updatedAt: {
            label: <IntlMessages id="last-modified-by" />,
            sort: true,

            renderCell: (v, { lastModifiedBy }) => (
              <div className={"d-flex align-items-center"}>
                <Nullable
                  component={UserAvatar}
                  valueProp={"user"}
                  description={formatDate(v, LONG_DATE_TIME)}
                >
                  {lastModifiedBy}
                </Nullable>
              </div>
            ),
          },
          locked: {
            label: (
              <div className={"d-flex "}>
                <IntlMessages id="setting.department.table.lock" />
                <div className={"pl-1"}>
                  <Tooltip
                    arrow
                    title={
                      <div className="custom-tooltip">
                        <h5>
                          <IntlMessages id="setting.lockDepartment" />
                        </h5>
                        <p>
                          <FormattedHTMLMessage id="setting.department.table.lock.tooltip" />
                        </p>
                      </div>
                    }
                    enterDelay={300}
                  >
                    <QuestionMarkIcon />
                  </Tooltip>
                </div>
              </div>
            ),
            sort: false,
            align: "left",
            renderCell: (v) => <div>{<Switch checked={v} disabled />}</div>,
          },
          id: {
            label: "Action",
            sort: false,
            align: "left",
            renderCell: (v, item) => {
              return (
                <div>
                  {isEditDepartment && !item.isDefault && (
                    <DepartmentDetail
                      isLockedFunction={isLockedFunction}
                      type="EDIT"
                      data={item}
                      id={data.id}
                    />
                  )}
                  {isDeleteDepartment && !item.isDefault && (
                    <DeleteDepartment
                      isLockedFunction={isLockedFunction}
                      data={item}
                    />
                  )}
                </div>
              );
            },
          },
        }}
      />
    </div>
  );
};
export default compose(withPagination)(memo(DepartmentTable));
