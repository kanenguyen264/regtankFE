// @ts-nocheck
import { Typography } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import Dropdown from "@protego/sdk/RegtankUI/v1/Dropdown/Dropdown";
import DropdownItem from "@protego/sdk/RegtankUI/v1/DropdownItem/index";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import clsx from "clsx";
import { KYC_MATCHES } from "constants/KycMatchStatus";
import { isNil } from "lodash";
import * as React from "react";
import { useIntl } from "react-intl";
import { KycSimplifiedIndividualMatchDto } from "types/typings-api";
import { getMatchStatusTranslate } from "util/kycMatchStatus";
//@ts-ignore
import styles from "./styles.module.scss";

interface StatusProps<T = KycSimplifiedIndividualMatchDto["status"]> {
  className?: string;
  disabled?: boolean;
  onChange: (event: { target: { value: T } }) => void;
  value: T;
}

const MatchesStatus = function MatchesStatus({
  //@ts-ignore
  disableRounded,
  value,
  onChange,
  disabled = false,
  className = "",
}: StatusProps) {
  const intl = useIntl();
  return (
    <>
      {disabled ? (
        <Button
          className={clsx(styles.Disable)}
          variant="containedRounded"
          disabled
        >
          {value ? (
            <Typography variant="small1">
              {intl.formatMessage({ id: getMatchStatusTranslate(value) })}
            </Typography>
          ) : (
            ""
          )}
        </Button>
      ) : (
        <Dropdown
          variant="containedRounded"
          classes={{popoverContainer: styles.dropdownPopover}}
          open={true}
          label={
            value ? (
              <Typography variant="small1">
                {intl.formatMessage({ id: getMatchStatusTranslate(value) })}
              </Typography>
            ) : (
              ""
            )
          }
          className={clsx({
            [className]: className,
            [styles.Unresolved]:
              isNil(value) || value === KYC_MATCHES.UNRESOLVED,
            [styles.Positive]: value === KYC_MATCHES.POSITIVE,
            [styles.False]: value === KYC_MATCHES.FALSE,
          })}
          rounded={true}
        >
          <DropdownItem
            onClick={() =>
              onChange({ target: { value: KYC_MATCHES.POSITIVE } })
            }
          >
            <Typography variant="small1">
              <IntlMessages id={"status.resolution.button.positive"} />
            </Typography>
          </DropdownItem>
          <DropdownItem
            onClick={() => onChange({ target: { value: KYC_MATCHES.FALSE } })}
          >
            <Typography variant="small1">
              <IntlMessages id={"status.resolution.button.false"} />
            </Typography>
          </DropdownItem>
        </Dropdown>
      )}
    </>
  );
};

export default MatchesStatus;
