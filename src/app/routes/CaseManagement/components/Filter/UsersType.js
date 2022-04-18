import { FormControl, Select, SvgIcon } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@protego/sdk/RegtankUI/v1/Checkbox";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import CustomScrollbar from "@protego/sdk/RegtankUI/v1/Scrollbar";
import SearchBoxDebounce from "@protego/sdk/RegtankUI/v1/SearchBoxDebounce";
import { GET_AVAILABLE_ASSIGN } from "actions/Staff";
import { ReactComponent as IconSelect } from "assets/icons/IcoSelectArrow.svg";
import clsx from "clsx";
import React from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { setTimeout } from "timers";
import { getFullName } from "util/string";
import styles from "./style.module.scss";
import { ReactComponent as SearchIcon } from "assets/icons/IcoOutlineSearch.svg";

const UsersType = ({ fields, onChange = null }) => {
  const users = useSelector((state) => state.staff.userAvailableAssign);
  // const isUsersLoaded = Array.isArray(users) && users.length > 0;
  const isUsersLoaded = Array.isArray(users);
  const dispatch = useDispatch();
  const [data, setData] = React.useState(null);
  const intl = useIntl();

  React.useEffect(() => {
    if (!isUsersLoaded) {
      dispatch(
        GET_AVAILABLE_ASSIGN({ params: fields?.dataType || "CASE_MANAGEMENT" })
      );
    }
    setData(users);
    // eslint-disable-next-line
  }, [users]);

  const handleSearch = (value) => {
    let filter = users;

    if (value.length) {
      filter = [...users]?.filter((item) => {
        let fullName = getFullName(item);
        return (
          fullName
            .toUpperCase()
            .replace(/\s+/g, " ")
            .indexOf(value.toUpperCase().replace(/\s+/g, " ")) > -1
        );
      });
    }

    setData(filter);
  };

  return (
    <FormControl className={clsx(styles.userType, styles.selectType)}>
      <Select
        multiple
        value={[]}
        onClose={() => {
          setTimeout(() => {
            setData(users);
          }, 500);
        }}
        inputProps={{ "aria-label": "Without label" }}
        MenuProps={{
          classes: { paper: styles.userType_popover },
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
        }}
        IconComponent={() => {
          return <SvgIcon viewBox={"0 0 12 8"} component={IconSelect} />;
        }}
        displayEmpty
        renderValue={(selected) => {
          if (selected.length === 0) {
            return (
              <span>
                <IntlMessages id="kyc.Assignee" />
              </span>
            );
          }

          return selected.join(", ");
        }}
      >
        <MenuItem
          className={clsx(styles.userType_item, styles.userType_item__search)}
        >
          <SearchBoxDebounce
            noSearchParams
            disableDebounce
            onChange={handleSearch}
            placeholder={intl.formatMessage({ id: "kyc.Assignee" })}
            searchIcon={<SvgIcon viewBox="0 0 22 22" component={SearchIcon} />}
          />
        </MenuItem>
        <CustomScrollbar
          classes={{ vCustomScrollBarTrack: styles.vCustomScrollBarTrack }}
        >
          {data?.length > 0 &&
            data.map((item) => {
              let checked =
                fields?.filterValues?.find((val) => val === item?.id) !==
                undefined
                  ? true
                  : false;
              return (
                <MenuItem
                  value={0}
                  className={styles.userType_item}
                  onClick={() => {
                    onChange && onChange(fields?.name, item?.id, !checked);
                  }}
                >
                  <Checkbox checked={checked} />
                  <span>{getFullName(item)}</span>
                </MenuItem>
              );
            })}
        </CustomScrollbar>
      </Select>
    </FormControl>
  );
};

export default UsersType;
