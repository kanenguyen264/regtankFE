import IntlMessages from "@protego/sdk/UI/IntlMessages";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";

import React from "react";
import BusinessForm from "./Business";
import { toRem } from "@protego/sdk/utils/measurements";
import JRCard from "@protego/sdk/UI/JRCard/JRCard";

const ScreeningResultDetail = React.memo(function StaffDetail({ match }) {
  return (
    <>
      <PageHeading
        customUrlResolver={(_index, sub) => {
          switch (sub) {
            case "kyb-screen":
              return [<IntlMessages id={"screen-kyb"} />, null, false];
            default:
              return null;
          }
        }}
        title={<IntlMessages id={"screen-kyb"} />}
      />
      <div className={"d-flex"}>
        <div style={{ flex: 2.895 }}>
          <JRCard disableShadow>
            <BusinessForm />
          </JRCard>
        </div>
      </div>
    </>
  );
});

export default ScreeningResultDetail;
