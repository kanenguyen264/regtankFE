import { Button, FormControl, Grid, Popover } from "@mui/material";
import Add from "@material-ui/icons/Add";
import DropdownItem from "@protego/sdk/UI/DropdownItem";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import withPagination from "@protego/sdk/UI/withPagination";
import {
  KYT_ACTION_ADD_TO_GROUP,
  KYT_ACTION_CREATE_NEW_GROUP,
  KYT_ACTION_GET_KYT_WATCHLIST,
  KYT_ACTION_REMOVE_FROM_WATCH_GROUP,
  KYT_ACTION_REMOVE_WATCH_GROUP,
  KYT_ACTION_RENAME_GROUP,
  KYT_ACTION_CHANGE_ORDER_GROUP,
} from "actions/KYTAction";
import clsx from "clsx";
import AddNewGroup from "components/GroupList/AddNewGroup";
import RemoveDialog from "components/GroupList/RemoveDialog";
import { TabbedListedContext } from "components/TabbedListedPagev1";
import TableGroup from "components/TableGroup";
import { RENAME } from "constants/ActionGroupList";
import React, { Fragment, memo } from "react";
import { useIntl } from "react-intl";
import { connect, useSelector } from "react-redux";
import { compose } from "recompose";
import { snackActions } from "util/snackbarUtils";
import AddToGroupDialog from "./AddToGroupDialog";
import styles from "./KYTList.module.scss";
import KYTTable from "./KYTTable";
import SearchBox from "@protego/sdk/RegtankUI/v1/SearchBoxDebounce";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";

const mapStateToProps = (state) => ({
  kytList: state.kyt.watchList,
  watchGroup: state.kyt.watchGroup,
});

const GroupList = ({
  dispatch,
  paginationParams,
  kytList,
  addFavorite,
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
  const { watchGroupSearch } = useSelector((state) => state.kyc);
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
    if (groupId) {
      let newParam = {
        ...paginationParams,
        watchGroupId: groupId,
      };
      /**
       * Filter get group list don't have group is selected
       */
      let filterListGroup = watchGroup?.filter((i) => i.id !== groupId);
      groupListSelect(filterListGroup);
      setGroupListFilter(filterListGroup);
      dispatch(KYT_ACTION_GET_KYT_WATCHLIST({ params: newParam }));
    }
  };

  const onChangeGroup = (value) => {
    /**
     * Update group selected
     */
    setSelectGroup(value);
    setSelected && setSelected([]);
  };
  const onPressAddNewGroup = () => {
    setFormAdd(true);
  };

  const onPressRemoveItemGroup = () => {
    dispatch(
      KYT_ACTION_REMOVE_FROM_WATCH_GROUP({
        params: {
          list: selected?.map((i) => i?.kytId),
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
        let message = (
          <IntlMessages
            id="kyt.remove.from.groupList"
            values={{ NUM: numOfRemovel, GROUP_NAME: groupName }}
          />
        );
        snackActions.success(message);
      })
      .finally(() => {
        setSelected([]);
      });
  };

  const onPressRemoveGroup = () => {
    setOpenRemoveDialog(false);
    dispatch(
      KYT_ACTION_REMOVE_WATCH_GROUP({
        params: {
          watchGroupId: typeCreate?.value?.id,
        },
      })
    )
      .then(() => {
        setTypeCreate();

        let groupName = typeCreate?.value?.name;
        let message =
          selected?.map((i) => i?.kytId) +
          " " +
          groupName +
          " " +
          formatMessage({ id: "kyt.add.remove.from" });
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
      kytIds: selected?.map((i) => i?.kytId),
      watchGroupId: value?.id,
    };
    dispatch(KYT_ACTION_ADD_TO_GROUP({ params: params }))
      .then((result) => {
        let message =
          selected?.map((i) => i?.kytId)?.length +
          " " +
          formatMessage({ id: "kyt.watch.group.add.success" }) +
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
  const changeOrderGroup = (data) => {
    dispatch(KYT_ACTION_CHANGE_ORDER_GROUP({ params: data })).catch((err) => {
      snackActions.error(err?.toString());
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
    dispatch(KYT_ACTION_CREATE_NEW_GROUP({ params: body }))
      .then(() => {
        snackActions.success(<IntlMessages id={"kyt.group.created.success"} />);
      })
      .finally(() => {
        onPressCloseAddGroup();
        setSelected([]);
      });
  };

  const onPressRenameGroup = (body) => {
    dispatch(KYT_ACTION_RENAME_GROUP({ params: body }))
      .then(() => {})
      .finally(() => {
        onPressCloseAddGroup();
      });
  };

  return (
    <Fragment>
      <div>
        {openFormAdd && (
          <AddToGroupDialog
            paginationParams={paginationParams}
            data={watchGroupSearch}
            isOpen={openFormAdd}
            onClose={() => setFormAdd(false)}
            group={selectGroup ? selectGroup?.value : watchGroup?.[0]}
            title={<IntlMessages id={"kyt.watch.group.add.to"} />}
            textPlaceholder={"kyt.watch.group.dialog.search"}
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
        <Grid item>
          <TableGroup
            onChangeGroup={onChangeGroup}
            data={watchGroup}
            select={selectGroup}
            onSelectDropDown={onSelectDropDown}
            onChangeOrderGroup={changeOrderGroup}
            onPressAddNewGroup = {setOpenAddNewGroup}
            addNewRecordIntoGroupProps={{
              onClick: onPressAddNewGroup,
              text: <IntlMessages id="kyt.watch.group.add" />,
            }}
            searchBoxProps={{
              placeholder: formatMessage({ id: "Search ID" }),
            }}
          />
        </Grid>
        <div
          className={clsx(
            styles.boxTabPanel,
            "d-flex align-items-end justify-content-end"
          )}
        >
          {selected?.length > 0 && (
            <div className={"mr-auto pl-2"}>
              {/* <Button
                className={clsx(styles.btnPlaceholder, styles.btn)}
                onClick={onPressAddItemToGroup}
              >
                <IntlMessages id="kyt.watch.add.to.group" />
              </Button> */}
              <FormControl>
                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={onClosePopover}
                  anchorReference="anchorPosition"
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
                    {groupListFilter?.map((i, index) => {
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
                <IntlMessages id="kyt.watch.remove.to.group" />
              </Button>
            </div>
          )}
        </div>
      </div>
      <KYTTable onRefresh={onRefresh} data={kytList} disableBulk={true} />
    </Fragment>
  );
};

export default compose(
  connect(mapStateToProps, null),
  withPagination
)(memo(GroupList));
