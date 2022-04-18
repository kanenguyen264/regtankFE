import React from "react";
import Chart from "./Chart";
import TableWeight from "./Table";
import styles from "../../../SettingsPage.module.scss";
import { useFormikContext } from "formik";
import { useIntl } from "react-intl";
import { listOptionScoringSetting } from "constants/ChartListOption";
const Weight = React.memo((props) => {
  const formikContext = useFormikContext();
  const { formatMessage } = useIntl();
  const newObject = { ...formikContext.values.weightSetting };
  const options = listOptionScoringSetting.map((item) => {
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
      {/* <div style={{ flex: 1 }}>
        <Chart
          {...props}
          data={newObject}
          formatMessage={formatMessage}
          listOption={options}
        />
      </div> */}
    </div>
  );
});

export default Weight;
