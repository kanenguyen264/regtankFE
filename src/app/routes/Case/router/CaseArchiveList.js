import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import { CASE_ACTION_GET_LIST_ARCHIVE } from "actions/CaseAction";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "recompose";
import CaseTable from "../component/CaseTable";

const CaseArchiveList = ({ paginationParams, addFavorite }) => {
  const caseList = useSelector((state) => state.case.archiveList);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(() => {
    setLoading(true);
    dispatch(CASE_ACTION_GET_LIST_ARCHIVE(paginationParams)).then(() =>
      setLoading(false)
    );
  }, [dispatch, paginationParams]);

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams]);

  return (
    <LoadingWrapper loading={loading}>
      <CaseTable data={caseList} addFavorite={addFavorite} />
    </LoadingWrapper>
  );
};

export default compose(withPagination)(memo(CaseArchiveList));
