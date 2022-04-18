import React, { Fragment, useEffect } from "react";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";

import IntlMessages from "@protego/sdk/UI/IntlMessages";

const Header = () => {
  return (
    <Fragment>
      <PageHeading
        title={<IntlMessages id={"setting.menu.generalSettings"} />}
        customUrlResolver={(index, sub) => {
          switch (index) {
            case 1:
              return [
                <IntlMessages id={"setting.kyc.breadcrumb.settings"} />,
                null,
                false,
              ];
            case 2:
              return [
                <IntlMessages id={"setting.menu.generalSettings"} />,
                null,
                false,
              ];
            default:
              break;
          }
        }}
      />
    </Fragment>
  );
};

export default Header;
