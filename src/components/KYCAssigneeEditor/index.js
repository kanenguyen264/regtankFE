import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import { KYC_ACTION_ASSIGN_KYC_REQUEST } from "actions/KYCAction";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "recompose";
import styles from "./styles.module.scss";
import { GET_AVAILABLE_ASSIGN } from "actions";
import { MenuItem } from "@mui/material";
import { getFullName } from "util/string";
import UserAvatar from "components/UserAvatar";
import { useIntl } from "react-intl";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Select from "@protego/sdk/UI/Select";

const KYCAssigneeEditor = compose()(
  /**
   *
   * @param {string|number} kycId
   * @param {BasicUserInfoDto|null} value
   * @returns {JSX.Element}
   * @constructor
   */
  function KYCAssigneeEditor({
    selected,
    type = "KYC",
    onChange,
    loading = false,
  }) {
    // noinspection DuplicatedCode
    const intl = useIntl();
    const users = useSelector((state) => state.staff.userAvailableAssign),
      dispatch = useDispatch(),
      isUsersLoaded = Array.isArray(users);
    useEffect(() => {
      if (!isUsersLoaded) {
        dispatch(GET_AVAILABLE_ASSIGN({ params: type }));
      }
      // eslint-disable-next-line
    }, [users]);

    return (
      <LoadingWrapper loading={loading || !isUsersLoaded} size={"1rem"}>
        <div>
          <Select
            value={selected?.id ?? -1}
            classes={{
              input: styles.AssigneeEditorInput,
              // menuPaper: styles.maxHeighMenuPaperAssignee,
            }}
            onChange={(e) => {
              onChange(e);
            }}
          >
            <MenuItem key={"__null"} value={-1}>
              <div className="d-inline-flex align-items-center">
                <UserAvatar
                  user={{
                    firstName: "?",
                    lastName: "",
                    colorCode: "#444444",
                  }}
                  size={28}
                  classes={{ root: styles.AssigneeEditorInputUser }}
                  noExtractLetter
                  toolTipTitle={
                    <IntlMessages id="appModule.Unassigned"></IntlMessages>
                  }
                />
                <span>
                  {intl.formatMessage({
                    id: "appModule.Unassigned",
                  })}
                </span>
              </div>
            </MenuItem>
            {isUsersLoaded &&
              users.length &&
              users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  <div className="d-inline-flex align-items-center">
                    <UserAvatar
                      user={user}
                      size={26}
                      classes={{ root: styles.AssigneeEditorInputUser }}
                    />
                    <div className={styles.textOverflow}>
                      {getFullName(user)}
                    </div>
                  </div>
                </MenuItem>
              ))}
          </Select>
        </div>
      </LoadingWrapper>
    );
  }
);

export default KYCAssigneeEditor;
