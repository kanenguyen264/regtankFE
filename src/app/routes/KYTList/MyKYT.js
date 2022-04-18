import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import withPagination from "@protego/sdk/UI/withPagination";
import {
  KYT_ACTION_ADD_TO_WATCHLIST,
  KYT_ACTION_GET_FILTER_OWNER,
  KYT_ACTION_GET_KYT_REQUESTS_BY_FILTER,
  KYT_ACTION_IMPORT_CSV,
  KYT_ACTION_REMOVE_WATCHLIST,
  KYT_ACTION_REQUEST_LIST,
  KYT_ACTION_SEARCH,
} from "actions/KYTAction";
// import FilterComponent from "components/FilterComponent";
import { KYTFilter } from "constants/KYTFilter";
import React, { memo, useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { compose } from "recompose";
import { bindActionCreators } from "redux";
import { KYTSelectorGetIsFavorite } from "selectors/kyt";
import KYTTable from "./KYTTable";
import FilterComponent from "components/FilterComponentv1";
const mapStateToProps = (state) => ({
  kytList: state.kyt.list,
  kytGetIsFavorite: KYTSelectorGetIsFavorite(state),
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      kytToggleFavorite: KYT_ACTION_ADD_TO_WATCHLIST,
      kytActionRemoveFavorite: KYT_ACTION_REMOVE_WATCHLIST,
      kytActionSearchFavorite: KYT_ACTION_SEARCH,
      kytActionImport: KYT_ACTION_IMPORT_CSV,
    },
    dispatch
  );
};

const MyKYT = ({
  paginationParams,
  kytList,
  addFavorite,
  onRefresh,
  listOwner,
  setPaginationParams,
  onAddItemToArchiveList,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [filterActive, setFilterActive] = React.useState(false);
  const [dataFilter, setDataFilter] = React.useState();
  const [doFetchData, setDoFetchData] = React.useState(true);
  const { size, search } = paginationParams;
  const fetch = () => {
    if (filterActive && !search) {
      fetchFilter(dataFilter);
    } else {
      dispatch(KYT_ACTION_REQUEST_LIST({ params: paginationParams }));
    }
  };
  const fetchFilter = (data) => {
    dispatch(
      KYT_ACTION_GET_KYT_REQUESTS_BY_FILTER({
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
    /**
     * Fetch filter filed
     */
    dispatch(KYT_ACTION_GET_FILTER_OWNER());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmitFilter = (filter) => {
    if (filter) {
      setLoading(true);
      setDataFilter(filter);
      /**
       * If filter don't fetch
       */
      setDoFetchData(false);
      setPaginationParams({ page: 0, size: size, search: "" });
      paginationParams["search"] = "";
      dispatch(
        KYT_ACTION_GET_KYT_REQUESTS_BY_FILTER({
          filter: filter,
          params: paginationParams,
        })
      ).finally(() => {
        setLoading(false);
        setDoFetchData(true);
      });
    }
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
    <LoadingWrapper loading={loading}>
      <div>
        <FilterComponent
          listFilter={KYTFilter}
          onFilterActive={onFilterActive}
          onSubmitFilter={onSubmitFilter}
          resetFilter={() => resetFilter()}
          SearchPlaceholder="appModule.search.mykyt.placeholder"
        />
        <KYTTable
          onRefresh={onRefresh}
          data={kytList}
          addFavorite={addFavorite}
          searchNotFound={
            kytList?.records?.length === 0 && filterActive ? true : false
          }
          tab="my-kyt"
          onAddItemToArchiveList={onAddItemToArchiveList}
        />
      </div>
    </LoadingWrapper>
  );
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPagination
)(memo(MyKYT));
