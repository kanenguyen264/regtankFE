import IntlMessages from "@protego/sdk/UI/IntlMessages";
import {
  fetchGeneralSettings,
  fetchGeneralSettingsSuccess
} from "actions/Setting";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { snackActions } from "util/snackbarUtils";

const withUserSettings = (Component) => (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const fetchSettings = () => {
    dispatch(fetchGeneralSettings())
      .then((response) => {
        dispatch(fetchGeneralSettingsSuccess(response.data));
      })
      .catch((err) => {
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
      });
  };

  return <Component {...props} />;
};

export default withUserSettings;
