import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import { SETTING_SCORING_ACTION_FETCH_ALL } from "actions";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "recompose";
import ScoringTable from "./ScoringTable";

const ScoringList = compose(withPagination)(function ScoringList(props) {
  const dispatch = useDispatch();
  const listSetting = useSelector((state) => state.settingScoring.listSetting);
  const { paginationParams, onRefresh } = props;
  React.useEffect(() => {
    fetchSetting();
    // eslint-disable-next-line
  }, [paginationParams, onRefresh]);

  const fetchSetting = React.useCallback(() => {
    dispatch(SETTING_SCORING_ACTION_FETCH_ALL(paginationParams));
  }, [dispatch, paginationParams]);

  const archiveList = useSelector((state) => state.settingScoring.archiveList);
  React.useEffect(() => {
    fetchSetting();
    // eslint-disable-next-line
  }, [archiveList]);

  return <ScoringTable data={listSetting} />;
});

export default ScoringList;
