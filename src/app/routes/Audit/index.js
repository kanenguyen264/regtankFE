import IntlMessages from "@protego/sdk/UI/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";

import { toRem } from "@protego/sdk/utils/measurements";
import { fetchAllAudit } from "actions";
import { FILTER_AUDIT } from "constants/ActionTypes";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "constants/pagingSetting";
import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { parseQuery } from "util/stringQuery";
import AuditFilterComponent from "./AuditFilterComponent";
import styles from "./AuditPage.module.scss";
import AuditTable from "./components/AuditTable";

const AuditContent = ({ props, filter }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { audits } = useSelector((state) => state.audit);

  const { page, size } = parseQuery(location.search);
  const currentSize =
    parseInt(size) && parseInt(size) !== 0 ? parseInt(size) : DEFAULT_PAGE_SIZE;
  const currentPage =
    parseInt(page) && parseInt(page) !== 0 ? parseInt(page) : DEFAULT_PAGE;
  useEffect(() => {
    if (filter) {
      const { actions, startDate, endDate, ids } = filter;
      let param = {
        page: currentPage,
        size: currentSize,
        startDate: startDate,
        endDate: endDate,
        ids: ids ? ids : [],
        actions: actions ? actions : [],
      };
      dispatch({
        type: FILTER_AUDIT,
        payload: param,
      });
      return;
    }
    dispatch(
      fetchAllAudit({
        page: currentPage,
        size: currentSize,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, dispatch]);

  return (
    <JRCard className={styles.JRCardStyle} dense>
      {audits?.records?.length > 0 && <AuditTable data={audits} />}
    </JRCard>
  );
};

const Audit = (props) => {
  const [filter, setFilter] = React.useState();
  const onChangeFilter = (filter) => {
    setFilter(filter);
  };

  return (
    <Fragment>
      <PageHeading
        customUrlResolver={(index, sub) => {
          if (index === 1)
            return [<IntlMessages id="audit.header" />, false, false];
        }}
        title={<IntlMessages id={"audit.header"} />}
      />
      <div
        style={{
          marginBottom: toRem(24),
          justifyContent: "flex-end",
          display: "flex",
        }}
      >
        <AuditFilterComponent onChangeFilter={onChangeFilter} />
      </div>
      <AuditContent {...props} filter={filter} />
    </Fragment>
  );
};
export default Audit;
