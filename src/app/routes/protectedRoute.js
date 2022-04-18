import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { canAccessKYT, canAccessLiveness } from "util/permision";
import { withACL } from "../../acl";
import Error403 from "./ErrorPages/routes/403";
import PageNotFound from "app/routes/ErrorPages/routes/404";

export const isKYTRoute = (path) => {
  return path && path.startsWith("/app/kyt");
};
export const isLivenessRoute = (path) => {
  return path && path.startsWith("/app/liveness");
};
export const ProtectedRoute = withACL(
  ({ component: Component, ACL, ...rest }) => {
    const { customerMe } = useSelector((state) => state.settings, shallowEqual);
    return (
      <Route
        {...rest}
        render={(props) => {
          if (customerMe?.id) {
            if (
              (isKYTRoute(props.location.pathname) &&
                !canAccessKYT(customerMe)) ||
              (isLivenessRoute(props.location.pathname) &&
                !canAccessLiveness(customerMe))
            ) {
              return <Redirect to="/app/dashboard" />;
            }

            if (ACL.isAccessDenied) {
              return <Error403 />;
            }
            return <Component {...props} />;
          }

          return null;
        }}
      />
    );
  }
);
