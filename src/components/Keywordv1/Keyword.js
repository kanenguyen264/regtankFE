import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import clsx from "clsx";
import React, { Fragment } from "react";
import {
  getColorKeyWord,
  getColorTextKeyWord,
  getTextKeyWork,
  getTextTranslate,
} from "util/keyword";
import styles from "./styles.module.scss";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import { Icon } from "@mui/material";
import { ReactComponent as limitKeywordIcon } from "assets/icons/limitKeywordIcon.svg";
const SMALL = "small";

const Keyword = function Keyword({
  keywords,
  hideTooltip,
  size,
  multiLanguage,
  screen,
}) {
  const getTemplateTooltip = (keywords) => {
    return (
      <ul className={styles.keywordTooltipContent}>
        {keywords.map((item, key) => {
          return <li key={key}>{getTextKeyWork(item)}</li>;
        })}
      </ul>
    );
  };
  const KeyWord = ({ item, key }) => (
    <Tooltip
      placement="top-start"
      key={key}
      title={<IntlMessages id={getTextTranslate(item, screen)} />}
      arrow
      disableHoverListener={hideTooltip}
    >
      <span
        style={{
          backgroundColor: getColorKeyWord(item),
          color: getColorTextKeyWord(item),
        }}
        className={clsx(styles.keyword, size === SMALL && styles.keywordSmall)}
      >
        {multiLanguage ? (
          <span>{item && <IntlMessages id={getTextTranslate(item)} />}</span>
        ) : (
          getTextKeyWork(item)
        )}
      </span>
    </Tooltip>
  );
  const displayShortKeyword = (keywords) => {
    return (
      <Fragment>
        {keywords?.map((item, index) => {
          if (index < 3) {
            return <KeyWord item={item} key={index} />;
          }
        })}
        <Tooltip
          placement="top-start"
          title={getTemplateTooltip(keywords)}
          arrow
        >
          <span className={clsx(styles.readMorekeyword)}>
            <Icon component={limitKeywordIcon}></Icon>
          </span>
        </Tooltip>
      </Fragment>
    );
  };
  if (keywords?.length < 4) {
    return (
      <Fragment>
        {keywords &&
          keywords.map((item, index) => {
            if (!item) {
              return null;
            }
            return (
              <KeyWord item={item} key={index} />
            );
          })}
      </Fragment>
    );
  } else if (keywords?.length > 4) {
    return displayShortKeyword(keywords);
  } else {
    return "-";
  }
};

export default Keyword;
