import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";

import React from "react";
import { withRouter } from "react-router";
import { compose } from "recompose";
import styles from "./KYTScreenPage.module.scss";
import KYTScreenPageDetail from "./KYTScreenPageDetail";
import KYTSearchBox from "./KYTSearchBox";
import withKYTPreload from "./withKYTPreload/withKYTPreload";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import { KYT_ROUTE_MY_KYT, KYT_ROUTE_SCREEN } from "constants/routes";

const KYTScreenPage = compose(
  withRouter,
  withKYTPreload
)(
  React.forwardRef(function KYTScreenPage(props, ref) {
    const { current, query } = props;
    let backUrl = KYT_ROUTE_MY_KYT;
    if (query && query.source === "current") {
      backUrl = KYT_ROUTE_SCREEN.replace("/:id?", "");
    }

    return (
      <>
        <PageHeading
          title={<IntlMessages id="know-your-transaction" />}
          customUrlResolver={(i, sub) => {
            if (i === 3) return sub;
            if (sub === "kyt") return [null, KYT_ROUTE_MY_KYT];
          }}
          backButtonUrl={query.source && backUrl}
        />
        <div className={styles.KYTScreenPage}>
          {current ? null : <KYTSearchBox ref={ref} current={current} />}
          {current ? <KYTScreenPageDetail ref={ref} current={current} /> : null}
        </div>
      </>
    );
  })
);

export default KYTScreenPage;
