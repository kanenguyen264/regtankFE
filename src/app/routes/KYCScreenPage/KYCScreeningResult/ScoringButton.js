import { Typography } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Link from "@protego/sdk/RegtankUI/v1/Link";
import { generatePath } from "@protego/sdk/utils/router";
import { KYC_ROUTE_KYC_SCREEN_SCORING } from "constants/routes";
import * as React from "react";
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
      component={Link}
      to={generatePath(KYC_ROUTE_KYC_SCREEN_SCORING, {
        kycId: kycId,
      })}
      className={styles.completeButton}
    >
      <Typography variant="Subtitle3">
        <IntlMessages id="view-source" />
      </Typography>
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
        <Typography variant="Subtitle3">
          <IntlMessages id="generate-score" />
        </Typography>
      </Button>
    )
  );
};

export default ScoringButton;
