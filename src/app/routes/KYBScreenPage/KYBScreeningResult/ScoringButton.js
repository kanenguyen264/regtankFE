import React from "react";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Link from "@protego/sdk/RegtankUI/v1/Link";
import { generatePath } from "@protego/sdk/utils/router";
import { KYB_ROUTE_RISK_ASSESSMENT } from "constants/routes";
import { useIntl } from "react-intl";
import { useHistory } from "react-router";
import { isCompletedStatus } from "util/index";
import generateDialogPrompt from "./dialog/generateDialog";
import styles from "./KYBScreeningResult.module.scss";

const ScoringButton = ({ currentScreeningResult, ACL }) => {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const generateDialog = generateDialogPrompt();

  return isCompletedStatus(currentScreeningResult?.status) ? (
    <Button
      variant={"contained"}
      color={"primary"}
      component={Link}
      to={generatePath(KYB_ROUTE_RISK_ASSESSMENT, {
        kybId: currentScreeningResult?.kybId,
      })}
      size={"small"}
    >
      <IntlMessages id="appModule.popup.viewRiskAssessment" />
    </Button>
  ) : (
    ACL.isAllowedPermissions("KYB_MODULE_CREATE") && (
      <Button
        className={styles.completeButton}
        variant="contained"
        onClick={async () => {
          await generateDialog([{ kybId: currentScreeningResult?.kybId }]);
        }}
      >
        <IntlMessages id="appModule.popup.generateRiskAssessment" />
      </Button>
    )
  );
};

export default ScoringButton;
