import { Add as plusIcon } from "@mui/icons-material";
import { Button as MuiButton, Icon, SvgIcon } from "@mui/material";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import SearchBoxDebounce from "@protego/sdk/RegtankUI/v1/SearchBoxDebounce";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import { SETTING_ACL_GET_ALL } from "actions/SettingACLAction";
import {
  addNewStaffUser,
  deleteStaffUser,
  FETCH_STAFF,
  hideMessage,
  setStaffLocked,
  staffActiveAllList,
  userResendActivation
} from "actions/Staff";
import { ReactComponent as SearchIcon } from "assets/icons/IcoOutlineSearch.svg";
import clsx from "clsx";
import React, { Fragment, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { compose } from "recompose";
import { snackActions } from "util/snackbarUtils";
import { parseQuery } from "util/stringQuery";
import { withACL } from "../../../../acl";
import {
  DELETE,
  RESEND_ACTIVATION_LINK
} from "../../../../constants/ActionTypes";
import AddNewStaff from "./AddStaff";
import DeleteStaff from "./DeleteStaff";
import StaffTable from "./StaffTable";
import styles from "./style.module.scss";
const StaffList = React.memo(function ({
  location,
  match,
  ACL,
  paginationParams,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [openAddNewStaff, setOpenAddNewStaff] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [userCurrentDelete, setUserCurrentDelete] = useState();
  const [loading, setLoading] = useState(false);

  const staffState = useSelector(({ staff }) => {
    const {
      showMessage,
      errorMessage,
      listStaff,
      alertMessage,
      total_records,
      search,
      isFetch,
      listAllStaffActive,
      loading,
    } = staff;
    return {
      listAllStaffActive: listAllStaffActive,
      listStaff: listStaff,
      showMessage: showMessage,
      alertMessage: alertMessage,
      errorMessage: errorMessage,
      total_records: total_records,
      search: search,
      isFetch: isFetch,
      loading: loading,
    };
  }, shallowEqual);

  let query = parseQuery(location.search);

  useEffect(() => {
    if (staffState.showMessage) {
      dispatch(hideMessage());
    }
  }, [staffState.showMessage, dispatch]);

  useEffect(() => {
    setLoading(true);
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams]);

  const fetch = () => {
    dispatch(FETCH_STAFF(paginationParams))
      .then(() => {
        dispatch(staffActiveAllList());
        dispatch(SETTING_ACL_GET_ALL());
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onPressAddNewStaff = () => {
    setOpenAddNewStaff(!openAddNewStaff);
  };

  function createNotification() {
    if (staffState.errorMessage)
      return snackActions.error(staffState.alertMessage);
    return snackActions.success(staffState.alertMessage);
  }

  const onPressSubmit = (item) => {
    dispatch(
      addNewStaffUser(item, paginationParams?.page, paginationParams?.size)
    );
    setOpenAddNewStaff(false);
  };

  const handleSelectOption = async (staffData, type) => {
    if (type === DELETE && !staffData.isSuperAdmin) {
      await setUserCurrentDelete(staffData);
      setOpenConfirm(true);
      return;
    } else if (type === RESEND_ACTIVATION_LINK) {
      await dispatch(userResendActivation(staffData));

      return;
    }

    history.push({
      pathname: match.path + staffData.id,
      state: { staffData, type },
    });
  };

  const handleDeleteStaff = async (reAssignUser) => {
    let queryString = {
      page: paginationParams?.page,
      size: paginationParams?.size,
      search: "",
      sort: query.sort,
    };
    await dispatch(
      deleteStaffUser(
        {
          userCurrentDelete: userCurrentDelete?.id,
          reassignCurrent: reAssignUser,
        },
        queryString
      )
    );
    setOpenConfirm(false);
  };

  const handleToggleActivation = (event, data) => {
    if (data?.isSuperAdmin && !data?.locked) {
      return snackActions.error(
        <IntlMessages id="staff.alert.unableToDeactivateSuperAdmin" />
      );
    }

    let obj = { locked: data?.locked, id: data?.id };
    dispatch(
      setStaffLocked(obj, paginationParams?.page, paginationParams?.size)
    );
  };

  return (
    <LoadingWrapper
      loading={loading || staffState?.loading || false}
      size={"3rem"}
    >
      <Fragment>
        <DeleteStaff
          open={openConfirm}
          onClose={() => {
            setOpenConfirm(false);
            setUserCurrentDelete(null);
          }}
          data={staffState}
          onSubmit={handleDeleteStaff}
          currentUser={userCurrentDelete}
        />
        {staffState?.showMessage && createNotification()}
        <PageHeading
          title={<IntlMessages id={"staff.staff"} />}
          match={match}
          customUrlResolver={(index) => {
            switch (index) {
              case 1:
                return [<IntlMessages id={"staff.staff"} />, null, false];
              default:
                break;
            }
          }}
        />
        <AddNewStaff
          open={openAddNewStaff}
          onPress={onPressAddNewStaff}
          onPressSubmit={onPressSubmit}
        />
        <div className={clsx(styles.staffList)}>
          <div>
            <div
              className="d-sm-flex justify-content-sm-between align-items-center"
              style={{ marginBottom: toRem(24) }}
            >
              <div className="d-flex">
                {ACL.isAllowedPermissions("STAFF_MODULE_CREATE") && (
                  <MuiButton
                    variant="contained"
                    color="primary"
                    onClick={onPressAddNewStaff}
                    startIcon={<Icon component={plusIcon} />}
                    className={styles.addNewBtn}
                  >
                    <IntlMessages id={"staff.addnew"} />
                  </MuiButton>
                )}
              </div>
              <div className="d-flex">
                <div className="company-list-search mr-2">
                  <SearchBoxDebounce
                    className={"d-flex left-side-icon"}
                    searchIcon={
                      <SvgIcon viewBox="0 0 22 22" component={SearchIcon} />
                    }
                  />
                </div>
              </div>
            </div>
            <StaffTable
              data={{
                records: staffState?.listStaff,
                total_records: staffState?.total_records || 0,
              }}
              onToggleActivation={handleToggleActivation}
              onSelectOption={handleSelectOption}
            />
          </div>
        </div>
      </Fragment>
    </LoadingWrapper>
  );
});

export default compose(withACL, withPagination)(StaffList);
