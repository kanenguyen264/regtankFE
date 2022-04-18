import { Chip } from "@material-ui/core";
import { PageResult } from "@protego/sdk/types";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import Link from "@protego/sdk/RegtankUI/v1/Link";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable/Nullable";
import { toRem } from "@protego/sdk/utils/measurements";
import clsx from "clsx";
import { TabbedListedContext } from "components/TabbedListedPagev1";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { SETTING_SCORING_ROUTE_DETAIL } from "constants/routes";
import React, { Fragment } from "react";
import { ScoringInfoDto } from "types/typings-api";
import { formatDate, LONG_DATE_TIME } from "util/date";
//@ts-ignore
import styles from "../../../SettingsPage.module.scss";

type ScoringTableProps = {
  data: PageResult<ScoringInfoDto> | Array<ScoringInfoDto>;
};

const ScoringTable = function CaseTable(props: ScoringTableProps) {
  const { data } = props;
  const { selected, setSelected } = React.useContext(TabbedListedContext);
  const setSelectedTable = (value) => {
    setSelected(value);
  };
  return (
    <Fragment>
      <JRCard className="p-0">
        <CustomTable
          lang={{
            rowsPerPage: <IntlMessages id={"appModule.table.footer"} />
          }}
          className="mt-0"
          options={{
            pagination: true,
            selectable: true,
            selections: selected,
            onSelected: setSelectedTable,
            isFixedFirstColumn: true
          }}
          data={data}
          columnData={{
            name: {
              label: <IntlMessages id="setting.scoring.fileName" />,
              sort: true,
              enable: true,
              style: { minWidth: toRem(300) },
              renderCell: (v, { id }) => (
                <>
                  <span className={clsx(styles.Link, styles.Ids)}>
                    <Link
                      to={SETTING_SCORING_ROUTE_DETAIL.replace(
                        ":id",
                        id.toString()
                      )}
                    >
                      {v}
                    </Link>
                  </span>
                </>
              )
            },
            isActive: {
              label: <IntlMessages id="setting.scoring.status" />,
              sort: false,
              enable: true,
              renderCell: (v, { isActive }) => (
                <Chip
                  className={
                    v ? styles.chipStyleActive : styles.chipStyleDormant
                  }
                  label={
                    v ? (
                      <IntlMessages id="appModule.status.active" />
                    ) : (
                      <IntlMessages id="appModule.status.dormant" />
                    )
                  }
                  variant="outlined"
                  color="primary"
                />
              )
            },
            description: {
              label: <IntlMessages id="setting.scoring.description" />,
              sort: false,
              enable: true,
              renderCell: (v) => <Nullable>{v}</Nullable>
            },
            //dateEdit
            updatedAt: {
              label: <IntlMessages id="setting.scoring.dateEdit" />,
              enable: true,
              sort: true,
              style: { width: toRem(190) },
              //@ts-ignore
              renderCell: (v, { lastModifiedBy }) => (
                <div
                  className={clsx(
                    "d-flex",
                    "align-items-center",
                    lastModifiedBy ? "" : "justify-content-center"
                  )}
                >
                  <Nullable
                    component={UserAvatar}
                    valueProp={"user"}
                    description={formatDate(v, LONG_DATE_TIME)}
                  >
                    {lastModifiedBy}
                  </Nullable>
                </div>
              )
            }
          }}
        />
      </JRCard>
    </Fragment>
  );
};

export default ScoringTable;
