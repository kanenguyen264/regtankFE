import { Grid } from "@material-ui/core";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import DashboardKyb from "app/routes/Dashboard/DashboardKyb/index";
import DashboardKyc from "app/routes/Dashboard/DashboardKyc/index";
import DashboardKyt from "app/routes/Dashboard/DashboardKyt/index";
import StaffAssignment from "app/routes/Dashboard/StaffAssignmentDashboard";
import React, { Fragment } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { withACL } from "../../../acl";
import { canAccessKYT } from "../../../util/permision";
import styles from "./Dashboard.module.scss";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";

const data = {
  list: [
    {
      id: "kyc",
      component: <DashboardKyc />,
    },
    {
      id: "kyb",
      component: <DashboardKyb />,
    },
    {
      id: "kyt",
      component: <DashboardKyt />,
    },
  ],
  column: 4,
};

export const DashboardContext = React.createContext(null);

const Dashboard = ({ ACL, match }) => {
  const { customerMe } = useSelector((state) => state.settings, shallowEqual);
  const [heightOfStatusCard, setHeightOfStatusCard] = React.useState(1000);
  const itemsRef = React.useRef([]);

  const filterDisabledModule = (data) => {
    const disabledList = [];
    if (
      !canAccessKYT(customerMe) ||
      !ACL.isAllowedPermissions("KYT_MODULE_VIEW")
    ) {
      disabledList.push("kyt");
    }

    if (!ACL.isAllowedPermissions("KYC_MODULE_VIEW")) disabledList.push("kyc");

    if (!ACL.isAllowedPermissions("KYB_MODULE_VIEW")) disabledList.push("kyb");

    return {
      list: data?.list.filter((item) => !disabledList.includes(item.id)),
      column: 12 / (data?.list.length - disabledList.length),
    };
  };
  const widgetList = filterDisabledModule(data);

  return (
    <Fragment>
      <PageHeading
        inlineBreadcrumb
        match={match}
        title={<IntlMessages id={"url.dashboard"} />}
      />
      <DashboardContext.Provider
        value={{ heightOfStatusCard, setHeightOfStatusCard }}
      >
        <Grid container spacing={2} ref={itemsRef}>
          {(() => {
            return widgetList?.list.map((item, index) => {
              return (
                <Grid
                  item
                  xs={12}
                  lg={widgetList.column}
                >
                  {item.component}
                </Grid>
              );
            });
          })()}
        </Grid>
      </DashboardContext.Provider>
      <StaffAssignment />
    </Fragment>
  );
};

export default withACL(Dashboard);
