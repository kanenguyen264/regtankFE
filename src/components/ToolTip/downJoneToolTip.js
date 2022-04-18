import { styled } from "@mui/material/styles";
import { tooltipClasses } from "@mui/material/Tooltip";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import { ReactComponent as IconMore } from "assets/icons/questionMark.svg";
import React from "react";
import * as tooltipList from "./contents/pep";
import styles from "./styles.module.scss";

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 440,
  },
  [`& .${tooltipClasses.arrow}`]: {
    borderColor: `${ThemeColors.grayText} transparent transparent transparent`,
    borderWidth: "0.5rem  0.5rem 0 0.5rem",
    left: "2% !important",
  },
});

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
      <CustomWidthTooltip
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
      </CustomWidthTooltip>
    </div>
  );
};

export default ToolTipMore;
