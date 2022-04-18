import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import CustomScrollbar from "@protego/sdk/RegtankUI/v1/Scrollbar";
import SearchBoxDebounce from "@protego/sdk/RegtankUI/v1/SearchBoxDebounce";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { ReactComponent as IconSelected } from "assets/icons/IcoSelected.svg";
import PropTypes from "prop-types";
import React from "react";
import { useIntl } from "react-intl";
import { getFullName } from "util/string";
import styles from "./style.module.scss";

const AssigneeDialog = ({
  open,
  users,
  onClose,
  title = "",
  multiple = false,
  onSave,
}) => {
  const [selected, setSelected] = React.useState([]);
  const [data, setData] = React.useState(null);
  const intl = useIntl();

  React.useEffect(() => {
    setData(users);
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

  const handleCancel = () => {
    onClose && onClose();
    setTimeout(() => {
      setSelected(null);
      setData(users);
    }, 1000);
  };

  return (
    <Dialog
      allowCloseOnTitle={true}
      open={open}
      title={title}
      cancelProps={{
        onClick: handleCancel,
      }}
      okProps={{
        text: intl.formatMessage({id: "save"}),
        disabled: !selected?.length > 0,
        onClick: () => {
          onSave && onSave(!multiple ? selected[0] : selected);
        },
      }}
      onClose={handleCancel}
      className={styles.assigneeDialog}
    >
      <div className={styles.assigneeDialog__Content}>
        <div className={styles.assigneeDialog__search}>
          <SearchBoxDebounce
            noSearchParams
            disableDebounce
            onChange={handleSearch}
            placeholder={intl.formatMessage({
              id: "kyc.add.new.group.enter.name",
            })}
          />
        </div>
        <div className={styles.assigneeDialog__listWrap}>
          <CustomScrollbar>
            <ul className={styles.assigneeDialog__list}>
              {data?.map((item, index) => {
                return (
                  <li
                    key={index}
                    className={styles.assigneeDialog__item}
                    onClick={() => {
                      if (!multiple) {
                        setSelected(
                          selected && selected[0]?.id === item?.id ? [] : [item]
                        );
                      } else {
                        let temp = selected.filter(
                          (val) => val?.id !== item?.id
                        );
                        if (temp?.length === selected?.length) {
                          setSelected([...selected, item]);
                        } else {
                          setSelected(temp);
                        }
                      }
                    }}
                  >
                    <UserAvatar
                      user={{
                        firstName: item.firstName,
                        lastName: item.lastName,
                        bgColorCode: item?.colorCode,
                      }}
                      txtSize={11}
                      size={26}
                      description={
                        <span
                          style={{
                            fontWeight: 400,
                            fontSize: toRem(14),
                            lineHeight: toRem(24),
                            color: "#444444",
                          }}
                        >
                          {getFullName(item)}
                        </span>
                      }
                    />
                    {selected &&
                      selected.filter((val) => val.id === item.id).length >
                        0 && <IconSelected />}
                  </li>
                );
              })}
            </ul>
          </CustomScrollbar>
        </div>
      </div>
    </Dialog>
  );
};

AssigneeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  users: PropTypes.array.isRequired,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  title: PropTypes.string,
  multiple: PropTypes.bool,
};

export default AssigneeDialog;
