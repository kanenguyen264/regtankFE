import { Typography } from "@mui/material";
import Dropdown from "@protego/sdk/RegtankUI/v1/Dropdown/Dropdown";
import DropdownItem from "@protego/sdk/RegtankUI/v1/DropdownItem/index";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { ReactComponent as RiskLevelDefaultIcon } from "assets/icons/RiskLevelDefaultIcon.svg";
import { RISK_LEVEL_TEXT } from "constants/RiskLevelType";
import React, { Fragment } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { getTextTranslateRiskKey } from "util/riskLevel";
import styles from "./RiskLevel.module.scss";
//@ts-ignore
const RiskLevel = function RiskLevel({
  disableRounded,
  value,
  onChange,
}: StatusProps) {
  const intl = useIntl();

  return (
    <Fragment>
      <div className={styles.riskLevel}>
        <RiskLevelDefaultIcon />
        <Typography className={styles.textSelect}>
          <FormattedHTMLMessage
            id={"kyb.risk.assessment.level.select"}
          ></FormattedHTMLMessage>
        </Typography>
        <Dropdown
          label={
            <Typography variant="Subtitle3">
              {value ? (
                intl.formatMessage({ id: getTextTranslateRiskKey(value) })
              ) : (
                <IntlMessages id={"kyb.risk.level.select"} />
              )}
            </Typography>
          }
          rounded={!disableRounded}
        >
          <DropdownItem
            onClick={() => onChange({ target: { value: RISK_LEVEL_TEXT.LOW } })}
          >
            <Typography variant="small1">
              <IntlMessages id={"kyb.risk.level.Low"} />
            </Typography>
          </DropdownItem>
          <DropdownItem
            onClick={() =>
              onChange({ target: { value: RISK_LEVEL_TEXT.MEDIUM } })
            }
          >
            <Typography variant="small1">
              <IntlMessages id={"kyb.risk.level.Medium"} />
            </Typography>
          </DropdownItem>
          <DropdownItem
            onClick={() =>
              onChange({ target: { value: RISK_LEVEL_TEXT.HIGH } })
            }
          >
            <Typography variant="small1">
              <IntlMessages id={"kyb.risk.level.High"} />
            </Typography>
          </DropdownItem>
        </Dropdown>
      </div>
    </Fragment>
  );
};

export default RiskLevel;
