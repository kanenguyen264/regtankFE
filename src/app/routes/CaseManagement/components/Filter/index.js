import CloseIcon from "@mui/icons-material/Close";
import { Button, SvgIcon } from "@mui/material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import clsx from "clsx";
import React from "react";
import { useSelector } from "react-redux";
import { getFullName } from "util/string";
import SelectType from "./SelectType";
import styles from "./style.module.scss";
import UsersType from "./UsersType";
import { useIntl } from "react-intl";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";

const dataList = {
  STATUS: [
    { id: "UNRESOLVED", label: "caseManagement.status.unresolved" },
    { id: "APPROVED", label: "caseManagement.status.approved" },
    { id: "REJECTED", label: "caseManagement.status.rejected" },
  ],
};

const Field = ({ type, ...props }) => {
  switch (type) {
    case "SELECT":
      return (
        <SelectType
          data={dataList[props?.dataType || "STATUS"]}
          fields={props?.data}
          onChange={props?.onChange}
        />
      );
    case "ASSIGNEE":
      return <UsersType fields={props?.data} onChange={props?.onChange} />;
  }
};

const Filter = ({ fields, onSubmit = null, onReset = null }) => {
  const [filters, setFilters] = React.useState(fields);
  const users = useSelector((state) => state.staff.userAvailableAssign);
  const intl = useIntl();

  const getChipLabel = (data) => {
    let labels;
    switch (data?.type) {
      case "SELECT":
        labels = data?.filterValues?.length
          ? data?.filterValues.map((item) => {
              let find = dataList[data?.dataType]?.find(
                (val) => val.id === item
              );
              return intl.formatMessage({ id: find?.label });
            })
          : [];
        break;
      case "ASSIGNEE":
        labels = data?.filterValues?.length
          ? data?.filterValues.map((item) => {
              let user = users?.find((val) => val.id === item);
              return getFullName(user);
            })
          : [];
        break;
    }

    return labels.join(", ");
  };

  const handleChangeField = (fieldName, id, value = "") => {
    let cloneFilters = [...filters];
    let updateData = cloneFilters.map((item) => {
      if (item.name !== fieldName) return item;
      else {
        let filterValues = item?.filterValues || [];
        if (value) filterValues.push(id);
        else filterValues = filterValues.filter((item) => id !== item);

        filterValues = [...new Set(filterValues)];
        return { ...item, filterValues: filterValues };
      }
    });

    setFilters(updateData);
  };

  const handleSubmit = () => {
    const params = filters
      ?.filter((item) => item.filterValues?.length > 0)
      .map((item) => {
        return {
          ...item.filterParams,
          filterValue: item.filterValues?.map(String),
        };
      });

    onSubmit && onSubmit(params);
  };

  const handleReset = () => {
    setFilters(fields);
    onReset && onReset();
  };

  const removeChip = (data) => {
    let cloneFilters = [...filters];
    let updatedData = cloneFilters.map((item) => {
      if (item.name === data.name) {
        return { ...item, filterValues: [] };
      }

      return item;
    });

    setFilters(updatedData);
  };

  return (
    <div className={styles.filter}>
      <div className={clsx(styles.filter_form, "d-flex")}>
        <div className={styles.filter_list}>
          <span className={styles.filter_txt}>
            <IntlMessages id="caseManagement.status.filter" />
          </span>
          <div className={styles.filter_fields}>
            {filters.map(({ type, ...item }) => {
              return (
                <Field type={type} data={item} onChange={handleChangeField} />
              );
            })}
          </div>
        </div>
        <div
          className={clsx(styles.filter_controls, "d-flex align-items-center")}
        >
          <span
            className={clsx(styles.filter_spacer, "d-block")}
            style={{
              height: toRem(36),
              width: "2px",
              backgroundColor: ThemeColors.grayBorder,
              margin: `0 ${toRem(16)}`,
            }}
          ></span>
          <Button
            onClick={handleReset}
            style={{
              color: ThemeColors.defaultDark,
              borderColor: ThemeColors.grayBorder,
              backgroundColor: ThemeColors.white,
              marginRight: toRem(16),
              fontWeight: 600,
            }}
            variant="containedWhite"
          >
            <IntlMessages id="appModule.reset" />
          </Button>
          <Button onClick={handleSubmit} variant="outlined" color="primary">
            <IntlMessages id="appModule.apply" />
          </Button>
        </div>
      </div>
      <div className={styles.filter_chips}>
        {filters
          ?.filter((item) => item?.filterValues?.length)
          .map((item) => {
            return (
              <div className={styles.filter_chip}>
                {/* <span className={styles.filter_chipTitle}>
                  {item.title || "__"}: &nbsp;
                </span> */}
                <span>
                  {item.title || "__"}: &nbsp;{getChipLabel(item)}
                </span>
                <SvgIcon
                  onClick={() => {
                    removeChip(item);
                  }}
                  component={CloseIcon}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Filter;
