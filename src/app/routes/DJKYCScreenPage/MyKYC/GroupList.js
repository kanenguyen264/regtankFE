import { FormControl, Popover } from "@material-ui/core";
import Add from "@material-ui/icons/Add";
import DropdownItem from "@protego/sdk/RegtankUI/v1/DropdownItem";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import {
  DJ_ACTION_ADD_TO_GROUP,
  DJ_ACTION_CREATE_NEW_GROUP,
  DJ_ACTION_GET_KYC_WATCHLIST,
  DJ_ACTION_REMOVE_FROM_WATCH_GROUP,
  DJ_ACTION_REMOVE_WATCH_GROUP,
  DJ_ACTION_RENAME_GROUP,
  DJ_ACTION_CHANGE_ORDER_GROUP,
} from "actions/DJAction";
import clsx from "clsx";
import AddNewGroup from "components/GroupList/AddNewGroup";
import RemoveDialog from "components/GroupList/RemoveDialog";
import { TabbedListedContext } from "components/TabbedListedPagev1";
import TableGroup from "components/TableGroup";
import { RENAME } from "constants/ActionGroupList";
import React, { Fragment, memo } from "react";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import { compose } from "recompose";
import { snackActions } from "util/snackbarUtils";
import AddToGroupDialog from "./AddToGroupDialog";
import styles from "./KYCList.module.scss";
import KYCTable from "./KYCTable";
import theme from "@protego/sdk/RegtankUI/v1/MuiTheme/theme";
import { ThemeProvider } from "@mui/material/styles";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";

const mapStateToProps = (state) => ({
  kycList: state.downJones.watchList,
  watchGroup: state.downJones.watchGroup,
});

const GroupList = ({
  dispatch,
  paginationParams,
  kycList,
  onRefresh,
  watchGroup,
  groupListSelect,
}) => {
  const [selectGroup, setSelectGroup] = React.useState();
  const [openFormAdd, setFormAdd] = React.useState(false);
  const [openAddNewGroup, setOpenAddNewGroup] = React.useState(false);
  const [openRemoveDialog, setOpenRemoveDialog] = React.useState(false);
  const [typeCreate, setTypeCreate] = React.useState("");
  const { selected, setSelected } = React.useContext(TabbedListedContext);
  const { formatMessage } = useIntl();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [groupListFilter, setGroupListFilter] = React.useState([]);

  React.useEffect(() => {
    if (watchGroup?.length < 1) {
      /**
       * Clean select
       */
      setSelectGroup(null);
    }
    if (selectGroup?.value) {
      fetch(selectGroup?.value?.id);
      return;
    }
    fetch(watchGroup[0]?.id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchGroup, selectGroup, paginationParams, onRefresh]);

  const fetch = (groupId) => {
    if (!groupId) {
      return;
    }
    /**
     * Filter get group list don't have group is selected
     */
    let filterListGroup = watchGroup?.filter((i) => i.id !== groupId);
    groupListSelect(filterListGroup);
    setGroupListFilter(filterListGroup);
    let newParam = {
      ...paginationParams,
      watchGroupId: groupId,
    };
    dispatch(DJ_ACTION_GET_KYC_WATCHLIST({ params: newParam }));
  };

  const onChangeGroup = (value) => {
    /**
     * Update group selected
     */

    setSelectGroup(value);
    setSelected([]);
  };
  const onPressAddNewGroup = () => {
    setFormAdd(true);
  };

  const onPressRemoveItemGroup = () => {
    dispatch(
      DJ_ACTION_REMOVE_FROM_WATCH_GROUP({
        params: {
          list: selected?.map((i) => i?.kycId),
          watchGroupId: selectGroup
            ? selectGroup?.value?.id
            : watchGroup?.[0]?.id,
        },
      })
    )
      .then(() => {
        let groupName = selectGroup
          ? selectGroup?.value?.name
          : watchGroup?.[0]?.name;
        let numOfRemovel = selected.length;

        snackActions.success(
          <IntlMessages
            id="kyc.remove.from.groupList"
            values={{ NUM: numOfRemovel, GROUP_NAME: groupName }}
          />
        );
      })
      .finally(() => {
        setSelected([]);
      });
  };

  const onPressRemoveGroup = () => {
    setOpenRemoveDialog(false);
    dispatch(
      DJ_ACTION_REMOVE_WATCH_GROUP({
        params: {
          watchGroupId: typeCreate?.value?.id,
        },
      })
    )
      .then(() => {
        setTypeCreate();

        let groupName = typeCreate?.value?.name;
        let message =
          selected?.map((i) => i?.kycId) +
          " " +
          groupName +
          " " +
          formatMessage({ id: "kyc.add.remove.from" });
        snackActions.success(message);
      })
      .finally(() => {
        setSelectGroup(null);
        setSelected([]);
      });
  };

  const onPressAddItemToGroup = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const changeOrderGroup = (data) => {
    dispatch(DJ_ACTION_CHANGE_ORDER_GROUP({ params: data })).catch((err) => {
      snackActions.error(err?.toString());
    });
  };
  const onClosePopover = () => {
    setAnchorEl(false);
  };
  const onPressSelectGroup = (value) => {
    /**
     * add to group
     */
    if (!value) {
      setAnchorEl(false);
      return;
    }
    let params = {
      kycIds: selected?.map((i) => i?.kycId),
      watchGroupId: value?.id,
    };
    dispatch(DJ_ACTION_ADD_TO_GROUP({ params: params }))
      .then((result) => {
        let message =
          selected?.map((i) => i?.kycId)?.length +
          " " +
          formatMessage({ id: "kyc.watch.group.add.success" }) +
          " " +
          value?.name;
        snackActions.success(message);
      })
      .catch((err) => {
        snackActions.error(err?.toString());
      })
      .finally(() => {
        setAnchorEl(false);
        setSelected([]);
      });
  };
  const onSelectDropDown = (type, value) => {
    if (type?.keyLabel === RENAME) {
      setOpenAddNewGroup(true);
      setTypeCreate({ type: RENAME, value: value });
      return;
    }
    setTypeCreate({ value: value });
    setOpenRemoveDialog(true);
  };
  const onPressCloseAddGroup = () => {
    setOpenAddNewGroup(false);
    setTypeCreate();
  };

  const open = Boolean(anchorEl);

  const onPressCreateGroup = (body) => {
    dispatch(DJ_ACTION_CREATE_NEW_GROUP({ params: body }))
      .then(() => {
        snackActions.success(<IntlMessages id={"kyc.group.created.success"} />);
      })
      .finally(() => {
        onPressCloseAddGroup();
        setSelected([]);
      });
  };

  const onPressRenameGroup = (body) => {
    dispatch(DJ_ACTION_RENAME_GROUP({ params: body }))
      .then(() => {})
      .finally(() => {
        onPressCloseAddGroup();
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Fragment>
        <div>
          {openFormAdd && (
            <AddToGroupDialog
              paginationParams={paginationParams}
              isOpen={openFormAdd}
              onClose={() => setFormAdd(false)}
              group={selectGroup ? selectGroup?.value : watchGroup?.[0]}
              title={<IntlMessages id={"kyc.watch.group.add.to"} />}
              textPlaceholder={<IntlMessages id={"kyc.watch.group.matches"} />}
            />
          )}
          {openAddNewGroup && (
            <AddNewGroup
              onPressCreateGroup={onPressCreateGroup}
              onPressRenameGroup={onPressRenameGroup}
              typeAction={typeCreate}
              isOpen={openAddNewGroup}
              onClose={() => onPressCloseAddGroup()}
              group={selectGroup ? selectGroup?.value : watchGroup?.[0]}
            />
          )}
          {openRemoveDialog && (
            <RemoveDialog
              isOpen={openRemoveDialog}
              onSubmit={onPressRemoveGroup}
              onClose={() => setOpenRemoveDialog(false)}
              group={typeCreate?.value}
            />
          )}
        </div>
        <div className={clsx(styles.bgTabGroup, "d-flex flex-column")}>
          <div>
            <TableGroup
              onChangeGroup={onChangeGroup}
              data={watchGroup}
              select={selectGroup}
              onSelectDropDown={onSelectDropDown}
              onPressAddNewGroup={setOpenAddNewGroup}
              onChangeOrderGroup={changeOrderGroup}
              addNewRecordIntoGroupProps={{
                onClick: onPressAddNewGroup,
                text: <IntlMessages id="kyc.watch.group.add" />,
              }}
              searchBoxProps={{
                placeholder: formatMessage({ id: "kyc.search.content" }),
              }}
            />
          </div>
          <div className={"d-flex align-items-end justify-content-end"}>
            {selected?.length > 0 && (
              <div className={"mr-auto pl-2"}>
                <Button
                  className={clsx(styles.btnPlaceholder, styles.btn)}
                  onClick={onPressAddItemToGroup}
                >
                  <IntlMessages id="kyc.watch.add.to.group" />
                </Button>
                <FormControl>
                  <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={onClosePopover}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <div>
                      {groupListFilter?.length === 0 && (
                        <DropdownItem onClick={() => onPressSelectGroup()}>
                          <IntlMessages id={"group.list.dropdown.no.group"} />
                        </DropdownItem>
                      )}
                      {groupListFilter.map((i, index) => {
                        return (
                          <div key={index}>
                            <DropdownItem onClick={() => onPressSelectGroup(i)}>
                              <IntlMessages id={i?.name} />
                            </DropdownItem>
                          </div>
                        );
                      })}
                    </div>
                  </Popover>
                </FormControl>
                <Button
                  className={clsx(styles.btn, styles.btnRemove, "ml-2")}
                  onClick={onPressRemoveItemGroup}
                >
                  <IntlMessages id="kyc.watch.remove.to.group" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <KYCTable data={kycList} disableBulk={true} />
      </Fragment>
    </ThemeProvider>
  );
};

export default compose(
  connect(mapStateToProps, null),
  withPagination
)(memo(GroupList));
