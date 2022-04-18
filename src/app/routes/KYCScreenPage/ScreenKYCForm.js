import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import React, { memo } from "react";
import IndividualForm from "./component/Individual";

const ScreeningResultDetail = ({ match }) => {
  const [enableDatasets, setEnableDataSets] = React.useState(false);
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
      <IndividualForm />
    </>
  );
};

export default memo(ScreeningResultDetail);
