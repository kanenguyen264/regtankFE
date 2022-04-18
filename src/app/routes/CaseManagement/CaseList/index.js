import { Button, SvgIcon, Typography } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import { withStyles } from "@mui/styles";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
// import SearchBox from "components/SearchBoxDebounce";
import SearchBox from "@protego/sdk/RegtankUI/v1/SearchBoxDebounce";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import { baseStyles } from "@protego/sdk/styles/base";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
// import PageHeading from "@protego/sdk/UI/PageHeading/PageHeading";
import {
  CASE_MANAGEMENT_ACTION_BULK_ASSIGN,
  CASE_MANAGEMENT_ACTION_GET_CASES,
} from "actions/CaseManagementAction";
import { GET_AVAILABLE_ASSIGN } from "actions/Staff";
import { ReactComponent as IconSelect } from "assets/icons/IcoSelectArrow.svg";
import { ReactComponent as plusIcon } from "assets/icons/plusIcon.svg";
import clsx from "clsx";
import React, { Fragment, memo } from "react";
import { FormattedHTMLMessage } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, withRouter } from "react-router";
import { useHistory } from "react-router-dom";
import { compose } from "recompose";
import { snackActions } from "util/snackbarUtils";
import { getFullName } from "util/string";
import AssigneeDialog from "../components/Assignee";
import Filter from "../components/Filter";
import {
  CASE_MANAGEMENT_CREATE_ROUTE,
  CASE_MANAGEMENT_INDEX_ROUTE,
} from "../routes";
import CaseTable from "./CaseTable";
import styles from "./style.module.scss";
import { ReactComponent as SearchIcon } from "assets/icons/IcoOutlineSearch.svg";
import { useLocation } from "react-router-dom";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: 3,
    minWidth: toRem(140),
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.1);",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiList-root": {
      padding: toRem(4),
    },
    "& .MuiMenuItem-root": {
      padding: `${toRem(8)} ${toRem(11)}`,
      "& .MuiSvgIcon-root": {
        fontSize: toRem(16),
        lineHeight: toRem(20),
        color: "#fff",
      },
      "&:active": {
        backgroundColor: "#0080FF",
      },
      "&:hover": {
        backgroundColor: "rgba(0, 128, 255, 0.04)",
      },
    },
  },
}));

const fields = [
  {
    name: "status",
    title: "Status",
    type: "SELECT",
    dataType: "STATUS",
    filterParams: {
      valueType: "CaseManagementStatus",
      property: "status",
      operator: "IN",
    },
  },
  {
    type: "ASSIGNEE",
    name: "assignee",
    title: "Assignee",
    dataType: "CASE_MANAGEMENT",
    filterParams: {
      valueType: "Long",
      property: "assignee",
      operator: "IN",
    },
  },
];

const CaseList = ({ paginationParams, match, setPaginationParams }) => {
  const [selected, setSelected] = React.useState([]);
  const dispatch = useDispatch();
  const [openAssignee, setOpenAssignee] = React.useState(false);
  const history = useHistory();
  const users = useSelector((state) => state.staff.userAvailableAssign);
  const isUsersLoaded = Array.isArray(users);
  // const isUsersLoaded = Array.isArray(users) && users.length > 0;
  const [filterParams, setFilterParams] = React.useState([]);
  React.useEffect(() => {
    if (!isUsersLoaded) {
      dispatch(GET_AVAILABLE_ASSIGN({ params: "CASE_MANAGEMENT" }));
    }
    // eslint-disable-next-line
  }, [users]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const location = useLocation();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBulkAssign = async (user) => {
    setOpenAssignee(false);
    let ids = selected.map((item) => item.caseId);
    await dispatch(
      CASE_MANAGEMENT_ACTION_BULK_ASSIGN({ userId: user?.id, ids: ids })
    ).then(async () => {
      await dispatch(
        CASE_MANAGEMENT_ACTION_GET_CASES({
          pagination: paginationParams,
          filter: filterParams,
        })
      );
      setSelected([]);
      return snackActions.success(
        <FormattedHTMLMessage
          id="notification.success.bulkAssign"
          values={{
            total: ids.length,
            title: "Case",
            user: getFullName(user),
          }}
        />
      );
    });
  };

  const handleSelect = (val) => {
    setSelected(val);
  };

  const handleApplyFilters = (params) => {
    setFilterParams(params);
    dispatch(
      CASE_MANAGEMENT_ACTION_GET_CASES({
        pagination: paginationParams,
        filter: params,
      })
    ).then(() => setSelected([]));
  };

  const handleResetFilter = () => {
    setFilterParams([]);
    if (paginationParams?.search?.length) {
      setPaginationParams({ ...paginationParams, search: "" });
    } else {
      dispatch(
        CASE_MANAGEMENT_ACTION_GET_CASES({
          pagination: { ...paginationParams },
        })
      ).then(() => setSelected([]));
    }
  };

  return (
    <Fragment>
      <PageHeading
        title={
          <Switch>
            <Route path={CASE_MANAGEMENT_INDEX_ROUTE}>
              <IntlMessages id={"url.case-management"} />
            </Route>
          </Switch>
        }
        customUrlResolver={(_index, sub) => {
          switch (sub) {
            case "case":
              return [
                <IntlMessages id={"case.breadcrumb.title"} />,
                null,
                false,
              ];
          }
        }}
        match={match}
      />

      <JRCard
        className={styles.containerWrap}
        header={
          <div className={styles.pageHeader}>
            <Typography className={styles.pageTitle}>
              <IntlMessages id={"case.breadcrumb.title"} />
            </Typography>
            <div className={styles.buttonsHeader}>
              <div
                className={styles.dropdownButton}
                style={{ marginRight: toRem(16) }}
              >
                {selected.length > 0 && (
                  <Button
                    id="demo-customized-button"
                    aria-controls="demo-customized-menu"
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    variant="contained"
                    disableElevation
                    onClick={handleClick}
                    endIcon={
                      <SvgIcon viewBox={"0 0 12 8"} component={IconSelect} />
                    }
                  >
                    <IntlMessages id="bulk-actions" />
                  </Button>
                )}

                <StyledMenu
                  id="demo-customized-menu"
                  MenuListProps={{
                    "aria-labelledby": "demo-customized-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  className={styles.dropdownList}
                >
                  <MenuItem
                    onClick={() => {
                      setOpenAssignee(true);
                      handleClose();
                    }}
                    disableRipple
                  >
                    <IntlMessages id="appModule.assign" />
                  </MenuItem>
                </StyledMenu>
              </div>
              <div className={styles.addNew}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ padding: toRem(12) }}
                  onClick={() => {
                    history.push(CASE_MANAGEMENT_CREATE_ROUTE);
                  }}
                  startIcon={
                    <SvgIcon viewBox={"0 0 20 20"} component={plusIcon} />
                  }
                >
                  <div>
                    <IntlMessages id="caseManagement.addNewCase" />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        }
      >
        <div
          className={clsx("d-flex justify-content-between", styles.searchWrap)}
        >
          <Filter
            fields={fields}
            onSubmit={handleApplyFilters}
            onReset={handleResetFilter}
          />
          <SearchBox
            searchIcon={<SvgIcon viewBox="0 0 22 22" component={SearchIcon} />}
          />
        </div>
        <CaseTable
          selected={selected}
          setSelected={handleSelect}
          filterParams={filterParams}
        />
      </JRCard>

      <AssigneeDialog
        title={<IntlMessages id="caseManagement.title.assignee" />}
        users={users}
        open={openAssignee}
        onClose={() => setOpenAssignee(false)}
        onSave={handleBulkAssign}
      />
    </Fragment>
  );
};

export default compose(
  withRouter,
  withPagination,
  withStyles(baseStyles, { index: 999 })
)(memo(CaseList));
