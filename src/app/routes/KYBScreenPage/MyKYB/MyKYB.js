import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import {
  KYB_ACTION_GET_KYB_REQUESTS,
  KYB_ACTION_GET_KYB_REQUESTS_BY_FILTER,
} from "actions/KYBAction";
import FilterComponent from "components/FilterComponentv1";
import { KYBFilter } from "constants/KYBFilter";
import React, { memo, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import KYBTable from "./KYBTable";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "constants/pagingSetting";
import styles from "./KYBList.module.scss";
import { useIntl } from "react-intl";
const mapStateToProps = (state) => ({
  kybList: state.kyb.list,
});
const MyKYB = ({
  dispatch,
  paginationParams,
  kybList,
  addFavorite,
  onAddItemToArchiveList,
  onRefresh,
  setPaginationParams,
}) => {
  const [filterActive, setFilterActive] = React.useState(false);
  const { size, search } = paginationParams;
  const [dataFilter, setDataFilter] = React.useState();
  const [doFetchData, setDoFetchData] = React.useState(true);
  const { formatMessage } = useIntl();
  const fetch = () => {
    if (filterActive && !search) {
      fetchFilter(dataFilter);
    } else {
      dispatch(KYB_ACTION_GET_KYB_REQUESTS(paginationParams));
    }
  };

  useEffect(() => {
    if (doFetchData) {
      fetch();
    }
    // eslint-disable-next-line
  }, [paginationParams, onRefresh]);
  // KYCArchiveAdapter.useArchiveWatcher((state) => state.kyc.archiveList, fetch);
  const onSubmitFilter = (filter) => {
    if (filter) {
      setDataFilter(filter);
      /**
       * If filter don't fetch
       */
      setDoFetchData(false);
      setPaginationParams({ page: 0, size: size, search: "" });
      paginationParams["search"] = "";
      paginationParams["page"] = DEFAULT_PAGE;
      paginationParams["size"] = DEFAULT_PAGE_SIZE;
      dispatch(
        KYB_ACTION_GET_KYB_REQUESTS_BY_FILTER({
          filter: filter,
          params: { page: 0, size: size },
        })
      ).finally(() => {
        setDoFetchData(true);
      });
    }
  };
  const fetchFilter = (data) => {
    dispatch(
      KYB_ACTION_GET_KYB_REQUESTS_BY_FILTER({
        filter: data,
        params: paginationParams,
      })
    );
  };
  const onFilterActive = () => {
    setFilterActive(true);
  };

  const resetFilter = () => {
    setFilterActive(false);
    setDataFilter([]);
    fetchFilter([]);
  };
  return (
    <div className={styles.kybContainer}>
      <div className={styles.filterGroup}>
        <FilterComponent
          listFilter={KYBFilter}
          onFilterActive={onFilterActive}
          onSubmitFilter={onSubmitFilter}
          resetFilter={() => resetFilter()}
          numberOfDisplayFilter={6}
          SearchPlaceholder={formatMessage({ id: "kyb.search.content" })}
        />
      </div>
      <KYBTable
        onRefresh={onRefresh}
        data={kybList}
        addFavorite={addFavorite}
        tab={"my-kyb"}
        onAddItemToArchiveList={onAddItemToArchiveList}
      />
    </div>
  );
};

export default compose(
  connect(mapStateToProps, null),
  withPagination
)(memo(MyKYB));
