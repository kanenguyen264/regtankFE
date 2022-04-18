import React from "react";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Link from "@protego/sdk/RegtankUI/v1/Link";
import { generatePath } from "@protego/sdk/utils/router";
import { DJ_KYC_ROUTE_KYC_SCREEN_SCORING } from "constants/routes";
import { useIntl } from "react-intl";
import { useHistory } from "react-router";
import { isCompletedStatus } from "util/index";
import generateDialogPrompt from "./dialog/generateDialog";
import styles from "./KYCScreeningResult.module.scss";

const ScoringButton = ({ currentScreeningResult, ACL }) => {
  const { kycId, status } = currentScreeningResult;
  const history = useHistory();
  const { formatMessage } = useIntl();
  const generateDialog = generateDialogPrompt();

  return isCompletedStatus(status) ? (
    <Button
      variant={"contained"}
      color={"primary"}
      component={Link}
      to={generatePath(DJ_KYC_ROUTE_KYC_SCREEN_SCORING, {
        kycId: kycId,
      })}
      size={"small"}
    >
      <IntlMessages id="view-source" />
    </Button>
  ) : (
    ACL.isAllowedPermissions("KYC_MODULE_CREATE") && (
      <Button
        className={styles.completeButton}
        variant="contained"
        onClick={async () => {
          await generateDialog([{ kycId: kycId }]);
        }}
      >
        <IntlMessages id="generate-score" />
      </Button>
    )
  );
};

export default ScoringButton;
