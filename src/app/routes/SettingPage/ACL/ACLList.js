import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import { SETTING_ACL_GET_ALL } from "actions/SettingACLAction";
import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "recompose";
import { snackActions } from "util/snackbarUtils";
import TableList from "./TableList";

const ACLList = (props) => {
  const dispatch = useDispatch();
  const data = useSelector(({ settingACL }) => settingACL.ACLList);
  const loading = useSelector(({ settingACL }) => settingACL.loading);
  const { paginationParams } = props;
  const extractErrorAndNotify = (err) => {
    let jsonParse = JSON.parse(
      JSON.stringify(err.response ? err.response.data : "")
    );

    snackActions.error(
      jsonParse.message ? (
        jsonParse.message
      ) : (
        <IntlMessages id={"notification.error"} />
      )
    );
  };

  React.useEffect(() => {
    document.querySelector(".app-main-content-wrapper").scrollTo(0, 0);
    fetchAllACLData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams]);

  const fetchAllACLData = () => {
    dispatch(SETTING_ACL_GET_ALL(paginationParams)).catch((err) => {
      extractErrorAndNotify(err);
    });
  };

  return (
    <Fragment>
      <PageHeading
        title={<IntlMessages id={"setting.menu.acl"} />}
        customUrlResolver={(index, sub) => {
          switch (index) {
            case 1:
              return [
                <IntlMessages id={"setting.kyc.breadcrumb.settings"} />,
                null,
                false,
              ];
            case 2:
              return [<IntlMessages id={"url.acl"} />, null, false];
            default:
              break;
          }
        }}
      />
      <LoadingWrapper loading={loading} size={"3rem"}>
        <div>
          <TableList data={data} />
        </div>
      </LoadingWrapper>
    </Fragment>
  );
};

export default compose(withPagination)(ACLList);
