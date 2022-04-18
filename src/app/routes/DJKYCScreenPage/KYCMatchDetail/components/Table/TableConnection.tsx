// @ts-nocheck
import { Typography } from "@mui/material";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { toRem } from "@protego/sdk/utils/measurements";
import Keyword from "components/Keywordv1";
import React from "react";
import { EmbeddableConnection } from "../../../../../../types/typings-api";
import styles from "../../../component/MatchProfile/MatchProfile.module.scss";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable";

function TableConnection(props: { list: EmbeddableConnection[] }) {
  return (
    <CustomTable<EmbeddableConnection>
      //@ts-ignore
      lang={{
        rowsPerPage: <IntlMessages id={"appModule.table.footer"} />,
      }}
      options={{
        selectable: false,
        pagination: false,
      }}
      data={props.list}
      className={styles.TableConnection}
      columnData={{
        name: {
          label: <IntlMessages id={"connection.table.name"} />,
          style: { maxWidth: toRem(100) },
          renderCell: (v) => (
            <>
              <Typography variant="subtitleGray">{v}</Typography>
            </>
          ),
        },
        association: {
          label: <IntlMessages id="kyc.associations" />,
          renderCell: (v) => (
            <>
              <Typography variant="subtitleGray">{v}</Typography>
            </>
          ),
        },
        keywords: {
          label: <IntlMessages id="keywords" />,
          renderCell: (v) => (
            <Nullable>
              <Keyword keywords={v} screen={"DJ"} />
            </Nullable>
          ),
        },
      }}
    />
  );
}
export default TableConnection;
