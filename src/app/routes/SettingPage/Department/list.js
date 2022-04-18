import IntlMessages from "@protego/sdk/UI/IntlMessages";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";

import { TabbedListedPageProvider } from "components/TabbedListedPage";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styles from "./Department.module.scss";
import SearchBox from "@protego/sdk/RegtankUI/v1/SearchBoxDebounce";
import DepartmentTable from "./component/DepartmentTable.js";
import DepartmentDetail from "./component/DepartmentDetail";
import { fetchDepartmentList } from "actions/Setting.js";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import { compose } from "recompose";
import { withACL } from "../../../../acl";
import { useSelector } from "react-redux";
import { snackActions } from "util/snackbarUtils";
import { FormattedHTMLMessage, useIntl } from "react-intl";
const Header = () => {
  return (
    <>
      <PageHeading
        title={<IntlMessages id={"setting.menu.department"} />}
        customUrlResolver={(index, sub) => {
          switch (index) {
            case 1:
              return [null, null, null, true];
            case 2:
              return [
                <IntlMessages id={"setting.menu.department"} />,
                null,
                false,
              ];

            default:
              break;
          }
        }}
      />
    </>
  );
};

const DepartmentList = ({ paginationParams, ACL }) => {
  const intl = useIntl();
  const isAddNewDepartment = ACL.isAllowedPermissions(
    "DEPARTMENT_MODULE_CREATE"
  );
  const dispatch = useDispatch();
  const [selected, setSelected] = useState([]);
  const { departmentList } = useSelector((state) => state.settings);
  const { showMessage, errorMessage, alertMessage } = useSelector(
    (state) => state.settings
  );

  const onPressSelect = (value) => {
    setSelected(value);
  };
  const fetch = () => {
    dispatch(fetchDepartmentList({ params: paginationParams }));
  };
  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams]);
  function createNotification() {
    if (errorMessage)
      return snackActions.error(
        <IntlMessages id={alertMessage}></IntlMessages>
      );
    return snackActions.success(
      <IntlMessages id={alertMessage}></IntlMessages>
    );
  }
  return (
    <>
      {showMessage && createNotification()}
      <Header />
      <TabbedListedPageProvider selected={selected} setSelected={onPressSelect}>
        <div>
          <div
            style={{ marginBottom: `${25 / 17}rem` }}
            className={"d-flex justify-content-between"}
          >
            <div className={"d-flex"}>
              {isAddNewDepartment && <DepartmentDetail type="ADD" />}
            </div>
            <div className={styles.searchWidth}>
              <SearchBox
                styleName={styles.searchBoxStyle}
                placeholder={intl.formatMessage({
                  id: "setting.SearchDepartment",
                })}
              />
            </div>
          </div>
          <DepartmentTable ACL={ACL} data={departmentList} />
        </div>
      </TabbedListedPageProvider>
    </>
  );
};
export default compose(withPagination)(withACL(DepartmentList));
