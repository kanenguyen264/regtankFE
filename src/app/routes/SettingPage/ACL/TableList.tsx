import { Typography } from "@mui/material";
import { toRem } from "@protego/sdk//RegtankUI/v1/utils";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Link from "@protego/sdk/RegtankUI/v1/Link";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable/Nullable";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { PageResult } from "@protego/sdk/types";
import clsx from "clsx";
import { ROLE_TYPE_ADMIN } from "constants/Role";
import { SETTING_ACL_TABLE_ACCESS } from "constants/routes";
import React, { Fragment } from "react";
import { Edit, Eye } from "react-feather";
import { ACLInfoDto } from "types/typings-api";
import { formatDate } from "util/date";
import { LONG_DATE, TIME } from "../../../../util/date";
//@ts-ignore
import styles from "./ACLPage.module.scss";
import CustomTooltip from "./components/CustomTooltip";

type TableListProps = {
  data: PageResult<ACLInfoDto> | Array<ACLInfoDto>;
};

const TableList = function CaseTable(props: TableListProps) {
  const { data } = props;
  return (
    <Fragment>
      <div className={styles.ACLList}>
        <CustomTable<ACLInfoDto>
          //@ts-ignore
          lang={{
            rowsPerPage: <IntlMessages id={"appModule.table.footer"} />,
          }}
          className={clsx(["mt-0", styles.TableList])}
          options={{
            pagination: false,
            selectable: false,
          }}
          data={data}
          columnData={{
            displayName: {
              label: <IntlMessages id="setting.ACL.role" />,
              sort: true,
              enable: true,
              renderCell: (v) => (
                <Typography>
                  <Nullable>{v}</Nullable>
                </Typography>
              ),
            },
            description: {
              label: <IntlMessages id="setting.ACL.description" />,
              sort: false,
              enable: true,
              renderCell: (v) => (
                <Typography>
                  <Nullable>{v}</Nullable>
                </Typography>
              ),
            },
            updatedAt: {
              label: <IntlMessages id="last-modified" />,
              enable: true,
              sort: true,
              //@ts-ignore
              renderCell: (v, { lastModifiedBy }) => {
                return (
                  <div className={clsx("d-flex", "align-items-center")}>
                    <Nullable
                      component={UserAvatar}
                      size={40}
                      txtSize={12}
                      valueProp={"user"}
                      description={
                        <div className="d-flex flex-column">
                          <div>{formatDate(v, LONG_DATE)}</div>
                          <div>{formatDate(v, TIME)}</div>
                        </div>
                      }
                    >
                      {lastModifiedBy}
                    </Nullable>
                  </div>
                );
              },
            },
            action: {
              label: <IntlMessages id="setting.ACL.Actions" />,
              sort: false,
              enable: true,
              align: "left",
              renderCell: (v, { id, type }) => {
                return (
                  <div className={styles.ActionWrap}>
                    <CustomTooltip
                      arrow
                      title={
                        <div className="custom-tooltip">
                          <p>
                            <IntlMessages id="setting.ACL.View" />
                          </p>
                        </div>
                      }
                    >
                      <Link
                        to={SETTING_ACL_TABLE_ACCESS.replace(":id", id + "")}
                      >
                        <Eye
                          size={toRem(22)}
                          color={ThemeColors.bgIcon}
                          style={{ cursor: "pointer" }}
                        />
                      </Link>
                    </CustomTooltip>
                    {type && type !== ROLE_TYPE_ADMIN && (
                      <CustomTooltip
                        arrow
                        title={
                          <div className="custom-tooltip">
                            <p>
                              <IntlMessages id="setting.ACL.Edit" />
                            </p>
                          </div>
                        }
                      >
                        <Link
                          to={SETTING_ACL_TABLE_ACCESS.replace(
                            ":id",
                            id + "?mode=edit"
                          )}
                        >
                          <Edit
                            size={toRem(18)}
                            color={ThemeColors.bgIcon}
                            style={{ cursor: "pointer" }}
                          />
                        </Link>
                      </CustomTooltip>
                    )}
                  </div>
                );
              },
            },
          }}
        />
      </div>
    </Fragment>
  );
};

export default TableList;
