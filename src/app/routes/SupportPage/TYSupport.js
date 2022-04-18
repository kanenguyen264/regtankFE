import React from "react";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import styles from "./SupportPage.module.scss";
import { Typography } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import { ReactComponent as SupportIcon } from "assets/icons/SupportMailIcon.svg";
import { useHistory } from "react-router-dom";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";

function TYSupportPage() {
  const history = useHistory();

  /**
   * On Press submit
   */
  const onPressGotoDashboard = () => {
    history.push({
      pathname: "/app/dashboard"
    });
  };
  return (
    <JRCard
      disableShadow
      style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div className={styles.tySupportContainer}>
        <SupportIcon />
        <Typography className={styles.tySupportTitle}>
          <IntlMessages id="thank-you-for-your-email-" />
        </Typography>
        <h2 className={styles.tySupportDescription}>
          <IntlMessages id="we-will-respond-to-you-within-3-working-days-" />
        </h2>
        <Button
          className={styles.tySupportButton}
          variant={"contained"}
          color={"primary"}
          type={"button"}
          onClick={onPressGotoDashboard}
        >
          <IntlMessages id="go-to-dashboard" />
        </Button>
      </div>
    </JRCard>
  );
}

export default TYSupportPage;
