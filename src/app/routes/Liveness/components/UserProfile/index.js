import IntlMessages from "@protego/sdk/UI/IntlMessages";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { getFullName } from "util/string";
import { getDocumentTypeKey } from "constants/LivenessTest";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import { ReactComponent as CopyIcon } from "assets/icons/CopyIconGreen.svg";
import {
  Typography,
  Divider,
  Icon
} from "@mui/material";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable";
import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import styles from "./styles.module.scss";
import clsx from "clsx";

const UserProfile = ({ onboardingID, userProfile, documentInfo, documentType }) => {
  const { formatMessage } = useIntl();
  return (
    <JRCard
      header={
        <Typography>
          <Nullable>
          {
            userProfile?.firstName ||
            userProfile?.lastName ||
            userProfile?.middleName ? (
              getFullName(userProfile)
            ) : (
              <IntlMessages id={"appModule.hyphen"} />
            )
          }
          </Nullable>
        </Typography>
      }
      fullBody
      disableShadow
      className={styles.userProfileBox}
    >
      <div className={styles.containerBox}>
        <div className={styles.itemBox}>
          <Typography className={styles.titleBox}>
            <IntlMessages id={"liveness.onboarding.id"} />
          </Typography>
          <div className={styles.copyTextBox}>
            <div className={styles.valueBox}>
              <CopyButton
                component={"span"}
                tooltip={<IntlMessages id="tooltip.copyID" />}
                copyIcon={<Icon component={CopyIcon} fontSize={toRem(18.33)} />}
                className={styles.copyButton}
              >
                <Typography
                  variant={"titleForm"}
                  style={{ lineHeight: toRem(20) }}
                >
                  {onboardingID}
                </Typography>
              </CopyButton>
            </div>
          </div>
        </div>
        <div className={styles.itemBox}>
          <Typography className={styles.titleBox}>
            <IntlMessages id={"liveness.idType"} />
          </Typography>
          <Typography className={styles.valueBox}>
            <Nullable>
              <IntlMessages id={getDocumentTypeKey(documentType)} />
            </Nullable>
          </Typography>
        </div>
        <div className={styles.itemBox}>
          <Typography className={styles.titleBox}>
            <IntlMessages id={"liveness.dateOfBirth"} />
          </Typography>
          <Typography className={styles.valueBox}>
            <Nullable>{userProfile?.dateOfBirth}</Nullable>
          </Typography>
        </div>
        <div className={styles.itemBox}>
          <Typography className={styles.titleBox}>
            <IntlMessages id={"liveness.nationality"} />
          </Typography>
          <Typography className={styles.valueBox}>
          <Nullable
            component={CountryFlagLanguage}
            valueProp={"countryCode"}
            displayCountryName
            demonym
            svg
          >
            {userProfile?.nationality}
          </Nullable>
          </Typography>
        </div>
        <div className={styles.itemBox}>
          <Typography className={styles.titleBox}>
            <IntlMessages id={"email-address"} />
          </Typography>
          <Typography className={styles.valueBox}>
            <Nullable>{userProfile?.email}</Nullable>
          </Typography>
        </div>
        <div className={styles.itemBox}>
          <Typography className={styles.titleBox}>
            <IntlMessages id={"liveness.gender"} />
          </Typography>
          <Typography className={styles.valueBox}>
            <Nullable>{userProfile?.gender}</Nullable>
          </Typography>
        </div>
        <div className={styles.itemBox}>
          <Typography className={styles.titleBox}>
            <IntlMessages id={"liveness.ocr.governmentIDNumber"} />
          </Typography>
          <Typography className={styles.valueBox}>
            <Nullable>{userProfile?.governmentIdNumber}</Nullable>
          </Typography>
        </div>
        <div className={styles.itemBox}>
          <Typography className={styles.titleBox}>
            <IntlMessages id={"place-of-birth"} />
          </Typography>
          <Typography className={styles.valueBox}>
            <Nullable
              component={CountryFlagLanguage}
              valueProp={"countryCode"}
              displayCountryName
              svg
            >
              {userProfile?.placeOfBirth}
            </Nullable>
          </Typography>
        </div>
        <div className={styles.itemBox}>
          <Typography className={styles.titleBox}>
            <IntlMessages id={"form.idIssuingCountry"} />
          </Typography>
          <Typography className={styles.valueBox}>
            <Nullable
              component={CountryFlagLanguage}
              valueProp={"countryCode"}
              displayCountryName
              svg
            >
              {userProfile?.idIssuingCountry}
            </Nullable>
          </Typography>
        </div>
        <div className={styles.itemBox}>
          <Typography className={styles.titleBox}>
            <IntlMessages id={"reference-id"} />
          </Typography>
          <Typography className={styles.valueBox}>
            <Nullable>{userProfile?.referenceId}</Nullable>
          </Typography>
        </div>
      </div>
      <Divider />
    </JRCard>
  );
};

export default UserProfile;
