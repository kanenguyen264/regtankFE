import { Divider } from "@material-ui/core";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import clsx from "clsx";
import React from "react";
import { useIntl } from "react-intl";
import ActivityLogDialog from "../ActivityLogDialogv1";
import EscalateDialog from "../EscalateDialogv1";
import styles from "./EscalateStyles.module.scss";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
const EscalateComponent = ({
  isOpen,
  onClose,
  data,
  onPressChange,
  status,
  id,
  viewLogPosition,
  divider,
  screen,
  hideViewLog = false,
  className = "",
}) => {
  const intl = useIntl();
  const { formatMessage } = intl;
  const [openEscalateDialog, setOpenEscalateDialog] = React.useState(false);
  const [openViewLog, setOpenViewLog] = React.useState(false);
  const onPressEscalate = () => {
    setOpenEscalateDialog(true);
  };
  let position = viewLogPosition === "left" ? "flex-row-reverse" : "";

  return (
    <div
      className={clsx("d-flex", position, styles.escalateWidth, {
        [className]: className,
      })}
    >
      {divider && (
        <Divider className={styles.divider} orientation={"vertical"} />
      )}
      <Button onClick={onPressEscalate} variant="outlined" color="primary">
        <IntlMessages id={"kyc.screen.result.Escalate"} />
      </Button>
      {!hideViewLog && (
        <Button
          onClick={() => setOpenViewLog(true)}
          variant="outlined"
          className={"mr-3"}
        >
          <IntlMessages id={"kyc.risk.scoring.view.log"} />
        </Button>
      )}

      {openEscalateDialog && (
        <EscalateDialog
          screen={screen}
          isOpen={openEscalateDialog}
          onClose={() => setOpenEscalateDialog(false)}
          id={id}
        />
      )}
      {openViewLog && (
        <ActivityLogDialog
          isOpen={openViewLog}
          onClose={() => setOpenViewLog(false)}
          refId={id}
          title={formatMessage({ id: "kyc.view.log.activity.log" })}
        />
      )}
    </div>
  );
};

export default React.memo(EscalateComponent);
