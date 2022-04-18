import IntlMessages from "@protego/sdk/UI/IntlMessages";
import JRCard from "@protego/sdk/UI/JRCard/JRCard";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import React, { memo } from "react";
import IndividualForm from "../component/Individual";
import styles from "./style.module.scss";

const ScreeningResultDetail = ({ match }) => {
  return (
    <>
      <PageHeading
        title={<IntlMessages id={"screen-kyc"} />}
        customUrlResolver={(_index, sub) => {
          switch (sub) {
            case "kyc-screen":
              return [<IntlMessages id="url.kyc-screen" />, null, false];
            default:
              return null;
          }
        }}
      />
      <div className={"d-flex"}>
        <div style={{ flex: 2.895 }}>
          <JRCard className={styles.djkycJrCard} href="">
            <h2>
              <IntlMessages id="kyc.dowJonesKYC" />
            </h2>
            <IndividualForm />
          </JRCard>
        </div>
      </div>
    </>
  );
};

export default memo(ScreeningResultDetail);
