import { ROLE_TYPE_ADMIN } from "constants/Role";
import React, { ReactNode, useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ACLs from "./config/accessControlList";
import protectedRoute from "./config/protectedRoute";

const mappingACL = ACLs;
export interface ACLProps {
  data: string[];
  isAllowedPermissions: (
    action: keyof typeof mappingACL | Array<keyof typeof mappingACL>
  ) => boolean;
  setAccessDenied: (value: boolean, errorMsg?: string) => void;
}

export type ACLProviderProps = {
  children: ReactNode;
};

const ACLContext = React.createContext(null);

export type Props = {
  children: ReactNode;
};

function ACLProvider(props: Props) {
  const { children } = props;
  const { me } = useSelector((state) => state.me, shallowEqual);
  const [isAccessDenied, setIsAccessDenied] = React.useState<boolean>(false);
  const location = useLocation();
  const routeList = protectedRoute;

  const ACL = useMemo(() => {
    const data = [];
    const acl = me?.userPermissions;
    if (acl?.length) {
      for (var key in mappingACL) {
        if (acl.includes(mappingACL[key])) {
          data.push(key);
        }
      }
    }

    if (me?.roles && me.roles[0]?.type === ROLE_TYPE_ADMIN) {
      data.push(ROLE_TYPE_ADMIN);
    }

    return data;
  }, [me]);

  const isAllowedPermissions = (
    action: keyof typeof mappingACL | Array<keyof typeof mappingACL>
  ) => {
    if (!Array.isArray(action)) action = [action];
    if (ACL.length && action.every((v) => ACL.includes(v))) return true;
    return false;
  };

  const isBlockedRequestedPage = React.useCallback(() => {
    const routes = Object.keys(routeList);
    const index = routes.findIndex((v: string) => {
      return location.pathname.startsWith(v);
    });
    if (index === -1) return false;
    let pe = routeList[routes[index]];
    pe = !Array.isArray(pe) ? [pe] : pe;
    return !isAllowedPermissions(pe);
  }, [location, routeList, me]);

  const setAccessDenied = (value: boolean, errorMsg: string = "") => {
    setIsAccessDenied(value);
  };

  React.useEffect(() => {
    setIsAccessDenied(isBlockedRequestedPage());
  }, [location, me, ACL, isBlockedRequestedPage]);

  return (
    <ACLContext.Provider
      value={{
        data: ACL,
        isAllowedPermissions: isAllowedPermissions,
        setAccessDenied: setAccessDenied,
        isAccessDenied: isAccessDenied,
      }}
    >
      {children}
    </ACLContext.Provider>
  );
}

const ACLConsumer = ACLContext.Consumer;

export const withACL = (Component) => {
  return function ACLConsumerWrapper(props) {
    return (
      <ACLConsumer>
        {(value) => <Component {...props} ACL={value} />}
      </ACLConsumer>
    );
  };
};

const useAxios = () => React.useContext(ACLContext);

export { ACLProvider, useAxios };
