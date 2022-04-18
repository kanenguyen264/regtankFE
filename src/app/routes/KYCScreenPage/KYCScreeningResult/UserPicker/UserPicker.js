import Dropdown from "@protego/sdk/UI/Dropdown/Dropdown";
import DropdownItem from "@protego/sdk/UI/DropdownItem/DropdownItem";
import { isEmpty } from "lodash";
import React from "react";
import { compose } from "recompose";
import mockJson from "__mock/mock.json";
import UserAvatar from "components/UserAvatar";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
const { users } = mockJson;

const UserPicker = compose()(
  /**
   *
   * @param {UserDtoRes|null} value
   * @param onChange
   * @returns {null}
   * @constructor
   */
  function UserList({ value, onChange }) {
    if (!isEmpty(value)) {
      return <UserAvatar user={value} />;
    }
    return (
      <Dropdown label={<IntlMessages id="appModule.Unassigned" />}>
        {users.map((user) => (
          <DropdownItem>
            {user.firstName} {user.lastName}
          </DropdownItem>
        ))}
      </Dropdown>
    );
  }
);

export default UserPicker;
