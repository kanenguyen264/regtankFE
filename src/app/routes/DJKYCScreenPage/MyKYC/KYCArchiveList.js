import withPagination from "@protego/sdk/UI/withPagination";
import React, { memo, useCallback, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { DJKYCArchiveAdapter } from "services/DJService";
import KYCTable from "./KYCTable";

const mapStateToProps = (state) => ({
  kycList: state.downJones.archiveList,
});

const KYCArchiveList = ({
  dispatch,
  paginationParams,
  kycList,
  addFavorite,
  onRefresh,
}) => {
  const fetch = useCallback(() => {
    dispatch(DJKYCArchiveAdapter.actionGetAll({ params: paginationParams }));
  }, [dispatch, paginationParams]);

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams, onRefresh]);
  return (
    <KYCTable onRefresh={onRefresh} data={kycList} addFavorite={addFavorite} />
  );
};

export default compose(
  connect(mapStateToProps, null),
  withPagination
)(memo(KYCArchiveList));
