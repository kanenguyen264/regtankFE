import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import {
  KYB_ACTION_ADD_TO_GROUP,
  KYB_ACTION_CREATE_NEW_GROUP,
  KYB_ACTION_GET_KYB_WATCHLIST,
  KYB_ACTION_REMOVE_FROM_WATCH_GROUP,
  KYB_ACTION_REMOVE_WATCH_GROUP,
  KYB_ACTION_RENAME_GROUP,
} from "actions/KYBAction";
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
import styles from "./KYBList.module.scss";
import KYBTable from "./KYBTable";

const mapStateToProps = (state) => ({
  kybList: state.kyb.watchList,
  watchGroup: state.kyb.watchGroup,
});

const GroupList = ({
  dispatch,
  paginationParams,
  kybList,
  onRefresh,
  watchGroup,
  groupListSelect,
}) => {
  const [selectGroup, setSelectGroup] = React.useState();
  const [openFormAdd, setFormAdd] = React.useState(false);
  const [openAddNewGroup, setOpenAddNewGroup] = React.useState(false);
  const [openRemoveDialog, setOpenRemoveDialog] = React.useState(false);
  const [typeCreate, setTypeCreate] = React.useState("");
  const { selected, setSelected, setGroupListSelected } = React.useContext(
    TabbedListedContext
  );
  const { formatMessage } = useIntl();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { watchGroupSearch } = useSelector((state) => state.kyb);
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
    fetch(watchGroup && watchGroup[0]?.id);
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
      dispatch(KYB_ACTION_GET_KYB_WATCHLIST({ params: newParam }));
    }
  };

  const onChangeGroup = (value) => {
    /**
     * Update group selected
     */
    setSelectGroup(value);
    setSelected([]);
    setGroupListSelected(value?.value);
  };
  const onPressAddNewGroup = () => {
    setFormAdd(true);
  };

  const onPressRemoveItemGroup = () => {
    dispatch(
      KYB_ACTION_REMOVE_FROM_WATCH_GROUP({
        params: {
          list: selected?.map((i) => i?.kybId),
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
            id="kyb.remove.from.groupList"
            values={{ NUM: numOfRemovel, GROUP_NAME: groupName }}
          />
        );
        snackActions.success(message);
      })
      .finally(() => {
        setSelectGroup(null);
        setSelected([]);
      });
  };

  const onPressRemoveGroup = () => {
    setOpenRemoveDialog(false);
    dispatch(
      KYB_ACTION_REMOVE_WATCH_GROUP({
        params: {
          watchGroupId: typeCreate?.value?.id,
        },
      })
    )
      .then(() => {
        setTypeCreate();

        let groupName = typeCreate?.value?.name;
        let message =
          selected?.map((i) => i?.kybId) +
          " " +
          groupName +
          " " +
          formatMessage({ id: "kyb.add.remove.from" });
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
      kybIds: selected?.map((i) => i?.kybId),
      watchGroupId: value?.id,
    };
    dispatch(KYB_ACTION_ADD_TO_GROUP({ params: params }))
      .then((result) => {
        let message =
          selected?.map((i) => i?.kybId)?.length +
          " " +
          formatMessage({ id: "kyb.watch.group.add.success" }) +
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
    dispatch(KYB_ACTION_CREATE_NEW_GROUP({ params: body }))
      .then(() => {
        snackActions.success(<IntlMessages id={"kyb.group.created.success"} />);
      })
      .finally(() => {
        onPressCloseAddGroup();
        setSelected([]);
      });
  };

  const onPressRenameGroup = (body) => {
    dispatch(KYB_ACTION_RENAME_GROUP({ params: body }))
      .then(() => {})
      .finally(() => {
        onPressCloseAddGroup();
      });
  };
  return (
    <Fragment>
      <div className={styles.kybContainer}>
        <div>
          {openFormAdd && (
            <AddToGroupDialog
              paginationParams={paginationParams}
              data={watchGroupSearch}
              isOpen={openFormAdd}
              onClose={() => setFormAdd(false)}
              group={selectGroup ? selectGroup?.value : watchGroup?.[0]}
              title={<IntlMessages id={"kyb.watch.group.add.to"} />}
              textPlaceholder={"kyb.watch.group.dialog.search"}
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
          <TableGroup
            onChangeGroup={onChangeGroup}
            data={watchGroup}
            select={selectGroup}
            onSelectDropDown={onSelectDropDown}
            onPressAddNewGroup={setOpenAddNewGroup}
            addNewRecordIntoGroupProps={{
              onClick: onPressAddNewGroup,
              text: <IntlMessages id="kyb.watch.group.add" />,
            }}
            searchBoxProps={{
              placeholder: formatMessage({ id: "kyb.search.content" }),
            }}
          />
        </div>
        <KYBTable data={kybList} disableBulk={true} />
      </div>
    </Fragment>
  );
};

export default compose(
  connect(mapStateToProps, null),
  withPagination
)(memo(GroupList));
