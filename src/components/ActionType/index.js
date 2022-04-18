import { Typography } from "@material-ui/core";
import React, { memo } from "react";
import styles from "./styles.module.scss";
import { filterActionList, getFilterActionText } from "util/filterActionType";
import IntlMessages from "@protego/sdk/UI/IntlMessages";

const ActionTypeComponent = (props) => {
  const { type } = props;
  if (!type) {
    return <div>-</div>;
  }
  return (
    <div className={"d-flex align-items-center"}>
      <span className={styles.circle}></span>
      <Typography>
        <IntlMessages id={getFilterActionText(type)} />
      </Typography>
    </div>
  );
};

export default memo(ActionTypeComponent);
