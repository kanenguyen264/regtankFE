import withPagination from "@protego/sdk/UI/withPagination";
import React, { memo, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { KYBArchiveAdapter } from "../../../../services/KYBService";
import KYBTable from "./KYBTable";

const mapStateToProps = (state) => ({
  archiveList: state.kyb.archiveList,
});

const KYBArchiveList = ({
  dispatch,
  paginationParams,
  archiveList,
  addFavorite,
  onRefresh,
}) => {
  const fetch = () => {
    dispatch(KYBArchiveAdapter.actionGetAll({ params: paginationParams }));
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams, onRefresh]);

  return (
    <KYBTable
      onRefresh={onRefresh}
      data={archiveList}
      addFavorite={addFavorite}
    />
  );
};

export default compose(
  connect(mapStateToProps, null),
  withPagination
)(memo(KYBArchiveList));
