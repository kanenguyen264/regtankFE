import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { IconButton, Typography } from "@mui/material";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import {
  SETTING_ACL_GET_ONE,
  SETTING_ACL_UPDATE_ROLE,
} from "actions/SettingACLAction";
import useStayScrolled from "components/useStayScrolled";
import { ROLE_TYPE_ADMIN } from "constants/Role";
import { SETTING_ACL_LIST } from "constants/routes";
import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { snackActions } from "util/snackbarUtils";
import styles from "./ACLPage.module.scss";
import TableAccess from "./TableAccess";

const ACLDetail = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();
  const params = new URLSearchParams(location.search);
  const data = useSelector(({ settingACL }) => settingACL.ACLDetail);
  const loading = useSelector(({ settingACL }) => settingACL.loading);
  const [isEditable, setIsEditable] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const { setRef, stayScrolled } = useStayScrolled();
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
    fetchACLData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchACLData = () => {
    id.length &&
      dispatch(SETTING_ACL_GET_ONE(id))
        .then(({ data }) => {
          setIsEditable(
            (params.get("mode") === "edit" || false) &&
              data?.type !== ROLE_TYPE_ADMIN
              ? true
              : false
          );
          setIsMounted(true);
        })
        .catch((err) => {
          extractErrorAndNotify(err);
        });
  };

  const handleSubmit = (data) => {
    if (!data?.displayName || data.displayName.trim().length === 0) {
      return snackActions.error(
        <IntlMessages id="setting.ACL.alert.roleNameIsRequired" />
      );
    }

    dispatch(SETTING_ACL_UPDATE_ROLE(data))
      .then(() => {
        snackActions.success(<IntlMessages id="notification.success.saved" />);
      })
      .catch((err) => {
        extractErrorAndNotify(err);
      });
  };

  return (
    <Fragment>
      <PageHeading
        title={<IntlMessages id={"setting.ACL.accessLevel"} />}
        customUrlResolver={(index, sub) => {
          switch (index) {
            case 1:
              return [
                <IntlMessages id={"setting.kyc.breadcrumb.settings"} />,
                null,
                false,
              ];
            case 3:
              return [
                <IntlMessages id={"setting.acl.breadcrumb.details"} />,
                null,
                false,
              ];
            case 4:
              return [null, null, null, true];
            default:
              break;
          }
        }}
      />
      <LoadingWrapper loading={loading} size={"3rem"}>
        <div ref={setRef}>
          <div className="d-flex align-items-center">
            <IconButton
              style={{
                padding: 0,
                color: ThemeColors.bodyText,
              }}
              onClick={() => history.push(SETTING_ACL_LIST)}
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
            <Typography variant="title">
              <IntlMessages id={"setting.ACL.viewAccessLevel"} />
            </Typography>
          </div>
          <div>
            <JRCard className={styles.ACLDetail}>
              {data && isMounted && (
                <TableAccess
                  data={data}
                  editable={isEditable}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    history.push(SETTING_ACL_LIST);
                  }}
                  onChange={() => {
                    stayScrolled();
                  }}
                />
              )}
            </JRCard>
          </div>
        </div>
      </LoadingWrapper>
    </Fragment>
  );
};

export default ACLDetail;
