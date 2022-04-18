import React from "react";
import { compose } from "recompose";
import withPagination from "@protego/sdk/UI/withPagination";
import { useDispatch, useSelector } from "react-redux";
import ScoringTable from "../ScoringTable";
import { SettingDJScoringArchiveAdapter } from "services/SettingService";

const ScoringArchive = compose(withPagination)(function ScoringArchive(props) {
  const dispatch = useDispatch();
  const listSetting = useSelector((state) => state.settingScoring.archiveList);
  const { paginationParams, onRefresh } = props;
  React.useEffect(() => {
    fetchSetting();
    // eslint-disable-next-line
  }, [paginationParams, onRefresh]);

  const fetchSetting = React.useCallback(() => {
    dispatch(
      SettingDJScoringArchiveAdapter.actionGetAll({ params: paginationParams })
    );
  }, [dispatch, paginationParams]);

  return <ScoringTable data={listSetting} />;
});

export default ScoringArchive;
