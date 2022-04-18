import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";

import React, { Fragment } from "react";
import Main from "./component/main";
import { useIntl } from "react-intl";
const CreditTopUp = function CreditTopUp() {
  const intl = useIntl();
  return (
    <Fragment>
      <PageHeading
        title={intl.formatMessage({
          id: "credit.creditTopUp",
        })}
        customUrlResolver={(index, sub) => {
          if (index === 1)
            return [
              intl.formatMessage({
                id: "credit.creditTopUp",
              }),
              false,
              false,
            ];
        }}
      />
      <Main />
    </Fragment>
  );
};

export default CreditTopUp;
