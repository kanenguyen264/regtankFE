import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import { ReactComponent as IconMore } from "assets/icons/questionMark.svg";
import React from "react";
import * as tooltipList from "./contents/pep";
import styles from "./styles.module.scss";

const ToolTipMore = (props) => {
  const { content, placement = "bottom" } = props;
  const [isShowMore, setIsShowMore] = React.useState(true);
  const onPressShowMore = (type) => {
    setIsShowMore(type);
  };

  const getContent = (name) => {
    if (typeof tooltipList[name] === "function") {
      return tooltipList[name](isShowMore, onPressShowMore);
    }

    return tooltipList[name];
  };

  return (
    <div className={styles.tooltipWrapper}>
      <Tooltip
        className={styles.tooltipCustom}
        interactive
        placement={placement}
        arrow
        leaveDelay={500}
        title={
          <div className={styles.contentToolTip}>
            {getContent(content, isShowMore, (type) => onPressShowMore(type))}
          </div>
        }
      >
        <IconMore />
      </Tooltip>
    </div>
  );
};

export default ToolTipMore;
