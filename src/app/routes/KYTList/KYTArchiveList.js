import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import withPagination from "@protego/sdk/UI/withPagination";
import {
  KYT_ACTION_ADD_TO_WATCHLIST,
  KYT_ACTION_IMPORT_CSV,
  KYT_ACTION_REMOVE_WATCHLIST,
  KYT_ACTION_SEARCH,
} from "actions/KYTAction";
import React, { memo, useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { bindActionCreators } from "redux";
import { KYTSelectorGetIsFavorite } from "selectors/kyt";
import { KYTArchiveAdapter } from "../../../services/KYTService";
import KYTTable from "./KYTTable";

const mapStateToProps = (state) => ({
  kytArchiveList: state.kyt.archiveList,
  kytGetIsFavorite: KYTSelectorGetIsFavorite(state),
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      kytRequestArchiveList: KYTArchiveAdapter.actionGetAll,
      kytToggleFavorite: KYT_ACTION_ADD_TO_WATCHLIST,
      kytActionRemoveFavorite: KYT_ACTION_REMOVE_WATCHLIST,
      kytActionSearchFavorite: KYT_ACTION_SEARCH,
      kytActionImport: KYT_ACTION_IMPORT_CSV,
    },
    dispatch
  );
};

const KYTArchiveList = ({
  paginationParams,
  kytRequestArchiveList,
  kytActionRemoveFavorite,
  kytToggleFavorite,
  selectItemCallback,
  kytArchiveList,
  onRefresh,
}) => {
  const [loading, setLoading] = useState(false);
  const fetch = useCallback(() => {
    setLoading(true);
    kytRequestArchiveList({
      params: { status: "DONE", ...paginationParams },
    }).then(() => setLoading(false));
  }, [kytRequestArchiveList, paginationParams]);

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams, onRefresh]);

  const addFavorite = async (id, inWatchList) => {
    setLoading(true);
    if (inWatchList) {
      await kytActionRemoveFavorite([id]);
    } else {
      await kytToggleFavorite([id]);
    }

    setLoading(false);
  };

  return (
    <LoadingWrapper loading={loading}>
      <KYTTable
        parentCallback={selectItemCallback}
        data={kytArchiveList}
        addFavorite={addFavorite}
        onRefresh={onRefresh}
      />
    </LoadingWrapper>
  );
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withPagination
)(memo(KYTArchiveList));
