import useMediaQuery from "@mui/material/useMediaQuery";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import {
  KYC_ACTION_GET_KYC_REQUESTS,
  KYC_ACTION_GET_KYC_REQUESTS_BY_FILTER,
} from "actions/KYCAction";
import FilterComponent from "components/FilterComponentv1";
import { KYCFilter } from "constants/KYCFilter";
import React, { memo, useCallback, useEffect } from "react";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import { compose } from "recompose";
import { KYCArchiveAdapter } from "services/KYCService";
import styles from "./KYCList.module.scss";
import KYCTable from "./KYCTable";

const mapStateToProps = (state) => ({
  kycList: state.kyc.list,
});

const MyKYC = ({
  dispatch,
  paginationParams,
  kycList,
  addFavorite,
  onAddItemToArchiveList,
  onRefresh,
  setPaginationParams,
}) => {
  const [filterActive, setFilterActive] = React.useState(false);
  const [dataFilter, setDataFilter] = React.useState();
  const { size, search } = paginationParams;
  const [doFetchData, setDoFetchData] = React.useState(true);
  const { formatMessage } = useIntl();
  const matches = useMediaQuery("(max-width:1440px)");

  const fetch = useCallback(() => {
    if (filterActive && !search) {
      fetchFilter(dataFilter);
    } else {
      dispatch(KYC_ACTION_GET_KYC_REQUESTS(paginationParams));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, paginationParams]);

  const fetchFilter = (data) => {
    dispatch(
      KYC_ACTION_GET_KYC_REQUESTS_BY_FILTER({
        filter: data,
        params: paginationParams,
      })
    );
  };
  useEffect(() => {
    if (doFetchData) {
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams, onRefresh]);
  useEffect(() => {
    setFilterActive(false);
  }, [paginationParams.search]);
  KYCArchiveAdapter.useArchiveWatcher((state) => state.kyc.archiveList, fetch);
  const onSubmitFilter = (filter) => {
    setDataFilter(filter);
    setDoFetchData(false);
    setPaginationParams({ page: 0, size: size, search: "" });
    paginationParams["search"] = "";
    dispatch(
      KYC_ACTION_GET_KYC_REQUESTS_BY_FILTER({
        filter: filter,
        params: paginationParams,
      })
    ).finally(() => {
      setDoFetchData(true);
    });
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
    <div className={styles.kycContainer}>
      <div className={styles.filterGroup}>
        <FilterComponent
          listFilter={KYCFilter}
          onFilterActive={onFilterActive}
          onSubmitFilter={onSubmitFilter}
          resetFilter={resetFilter}
          numberOfDisplayFilter={matches ? 5 : 6}
          SearchPlaceholder={formatMessage({ id: "kyc.search.content" })}
        />
      </div>
      <KYCTable
        data={kycList}
        tab="my-kyc"
        addFavorite={addFavorite}
        onAddItemToArchiveList={onAddItemToArchiveList}
        searchNotFound={
          kycList?.records?.length === 0 && filterActive ? true : false
        }
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default compose(
  connect(mapStateToProps, null),
  withPagination
)(memo(MyKYC));
