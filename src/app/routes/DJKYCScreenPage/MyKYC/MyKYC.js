import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import {
  DJ_ACTION_GET_KYC_REQUEST,
  DJ_ACTION_GET_KYC_REQUESTS_BY_FILTER,
} from "actions/DJAction";
import React, { memo, useCallback, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import KYCTable from "./KYCTable";
import FilterComponent from "components/FilterComponentv1";
import { DJKYCFilter } from "constants/KYCFilter";
import { ReactComponent as IconExpandFilter } from "assets/icons/IcExpandFilter.svg";
import styles from "./KYCList.module.scss";
import { DJKYCArchiveAdapter } from "services/DJService";
import {useIntl} from "react-intl";
const mapStateToProps = (state) => ({
  downJonesList: state.downJones.list,
});

const MyKYC = ({
  dispatch,
  paginationParams,
  downJonesList,
  onRefresh,
  setPaginationParams,
  addFavorite,
  onAddItemToArchiveList,
}) => {
  const [filterActive, setFilterActive] = React.useState(false);
  const [dataFilter, setDataFilter] = React.useState();
  const { size, search } = paginationParams;
  const [doFetchData, setDoFetchData] = React.useState(true);
  const { formatMessage } = useIntl();
  const fetch = useCallback(() => {
    if (filterActive && !search) {
      fetchFilter(dataFilter);
    } else {
      dispatch(DJ_ACTION_GET_KYC_REQUEST(paginationParams));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, paginationParams]);

  const fetchFilter = (data) => {
    dispatch(
      DJ_ACTION_GET_KYC_REQUESTS_BY_FILTER({
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
  DJKYCArchiveAdapter.useArchiveWatcher(
    (state) => state.downJones.archiveList,
    fetch
  );
  const onSubmitFilter = (filter) => {
    setDataFilter(filter);
    setDoFetchData(false);
    setPaginationParams({ page: 0, size: size, search: "" });
    paginationParams["search"] = "";
    dispatch(
      DJ_ACTION_GET_KYC_REQUESTS_BY_FILTER({
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
    <div>
      <FilterComponent
        listFilter={DJKYCFilter}
        onFilterActive={onFilterActive}
        onSubmitFilter={onSubmitFilter}
        resetFilter={resetFilter}
        numberOfDisplayFilter={6}
        djwl={true}
        SearchPlaceholder={formatMessage({id: "kyc.search.content"})}
      />
      <KYCTable
        data={downJonesList}
        tab="my-kyc"
        onAddItemToArchiveList={onAddItemToArchiveList}
        searchNotFound={
          downJonesList?.records?.length === 0 && filterActive ? true : false
        }
        onRefresh={onRefresh}
       addFavorite={addFavorite}/>
    </div>
  );
};

export default compose(
  connect(mapStateToProps, null),
  withPagination
)(memo(MyKYC));
