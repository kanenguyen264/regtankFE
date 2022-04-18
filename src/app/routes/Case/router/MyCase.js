import React, { useEffect, useCallback, memo } from "react";
import { compose } from "recompose";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import { useDispatch, useSelector } from "react-redux";
import { CASE_ACTION_GET_CASES } from "actions/CaseAction";
import { CaseArchiveAdapter } from "services/CaseService";
import CaseTable from "../component/CaseTable";
import { omit } from "lodash";

export const filterCols = (data, isHiddenKYC = false, isHiddenKYT = false) => {
  let hiddenCols = [];

  if (isHiddenKYT) {
    hiddenCols.push(
      "latestKyt.updatedAt",
      "latestKyt.addressDetails.risk.risk"
    );
  }

  if (isHiddenKYC) {
    hiddenCols.push(
      "latestKyc.individualRequest.nationality",
      "latestKyc.individualRiskScore.sortableRisk",
      "latestKyc.individualRequest.nationality",
      "latestKyc.updatedAt",
      "latestKyc.status",
      "latestKyc.individualRequest.name",
      "latestKyc.individualRequest.dateOfBirth"
    );
  }

  const list = omit(data, hiddenCols);
  return list;
};

const MyCase = ({ paginationParams, addFavorite, onAddItemToArchiveList }) => {
  const dispatch = useDispatch();
  const caseList = useSelector((state) => state.case.list);

  const fetch = useCallback(() => {
    dispatch(CASE_ACTION_GET_CASES(paginationParams));
  }, [dispatch, paginationParams]);
  CaseArchiveAdapter.useArchiveWatcher(
    (state) => state.case.archiveList,
    fetch
  );

  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, [paginationParams]);
  return (
    <CaseTable
      data={caseList}
      addFavorite={addFavorite}
      tab="my-case"
      onAddItemToArchiveList={onAddItemToArchiveList}
    />
  );
};

export default compose(withPagination)(memo(MyCase));
