import Dialog from "@protego/sdk/RegtankUI/v1/Dialog/Dialog";
import CustomScrollbar from "@protego/sdk/RegtankUI/v1/Scrollbar";
import SelectAutoComplete from "@protego/sdk/RegtankUI/v1/SelectAutoComplete";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import { map } from "lodash";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import styles from "./style.module.scss";
function PaperComponent(props) {
  return (
    <div className={styles.paper}>
      <CustomScrollbar>{props.children}</CustomScrollbar>
    </div>
  );
}
const DeleteStaffDialog = ({
  open = false,
  onClose,
  data,
  onSubmit,
  currentUser,
}) => {
  const [reassignCurrent, setReassignCurrent] = useState(-1);
  const intl = useIntl();

  const handleChange = (val) => {
    setReassignCurrent(val);
  };
  const cancelDialogDelete = () => {
    onClose && onClose();
  };
  const confirmDeleteStaff = async () => {
    let reassignUser = reassignCurrent;
    onSubmit && onSubmit(reassignUser?.id);
    setReassignCurrent(-1);
  };

  return (
    <Dialog
      open={open}
      onClose={cancelDialogDelete}
      title={<IntlMessages id="staff.deleteStaff.title" />}
      aria-labelledby="form-dialog-title"
      allowCloseOnTitle
      okProps={{
        text: intl.formatMessage({ id: "confirm" }),
        onClick: confirmDeleteStaff,
        disabled: reassignCurrent !== -1 ? false : true
      }}
      cancelProps={{
        text: intl.formatMessage({ id: "customer.dialog.cancel" }),
        onClick: cancelDialogDelete,
      }}
      PaperProps={{ classes: { root: styles.deleteStaffDlg } }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          className="d-flex flex-wrap align-items-center justify-content-start"
          style={{ marginBottom: toRem(22) }}
        >
          <p>
            {currentUser?.firstName} {currentUser?.lastName}{" "}
            <IntlMessages id="appModule.willBeRemoved" />
          </p>
          <p>
            <IntlMessages id="appModule.reassignCurrentTaskTo" />
          </p>
        </div>

        <SelectAutoComplete
          type="select"
          placeholder={intl.formatMessage({
            id: "appModule.Unassigned",
          })}
          disableClearable
          options={map(data?.listAllStaffActive, function square(n) {
            return { id: n.id, label: n.fullName, val: n };
          })}
          textFieldProps={{ variant: "outlined" }}
          onChange={(event, newValue) => {
            handleChange(newValue);
          }}
          renderOption={(props, option) => {
            return (
              <li className={styles.userItem} {...props} key={option.id}>
                <span className={styles.borderAvatar}>
                  <UserAvatar
                    user={{ ...option.val, bgColorCode: option.val?.colorCode }}
                    size={32}
                    txtSize={12}
                    description={<div>{option.label}</div>}
                  />
                </span>
              </li>
            );
          }}
          values={reassignCurrent}
          PaperComponent={PaperComponent}
        />
      </div>
    </Dialog>
  );
};

export default DeleteStaffDialog;
