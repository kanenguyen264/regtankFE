import React from "react";
import Chart from "./Chart";
import TableWeight from "./Table";
import styles from "../../../SettingsPage.module.scss";
import { useFormikContext } from "formik";
import { useIntl } from "react-intl";
import { listOptionDJScoringSetting } from "constants/ChartListOption";
import { toRem } from "@protego/sdk/utils/measurements";

const Weight = React.memo((props) => {
  const formikContext = useFormikContext();
  const { formatMessage } = useIntl();
  const newObject = { ...formikContext.values.weightSetting };
  const options = listOptionDJScoringSetting.map((item) => {
    return {
      ...item,
      label: formatMessage({ id: item.label })
    };
  });
  return (
    <div className={styles.chartFlexRow}>
      <div style={{ flex: 1.636 }}>
        <TableWeight {...props} data={newObject} />
      </div>
    </div>
  );
});

export default Weight;
