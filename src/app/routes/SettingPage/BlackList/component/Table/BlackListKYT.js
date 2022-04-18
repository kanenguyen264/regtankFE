import withPagination from "@protego/sdk/UI/withPagination";
import { FETCH_ACTION_GET_KYT_BLACKLIST } from "actions/Setting";
import React, { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "recompose";
import BlackListTable from "./BlackListTable";

const BlackListKYT = (props) => {
  const { paginationParams } = props;
  const dispatch = useDispatch();
  const { kytBlackList } = useSelector((state) => state.settings);

  React.useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetch = useCallback(() => {
    dispatch(FETCH_ACTION_GET_KYT_BLACKLIST(paginationParams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <BlackListTable data={kytBlackList} />;
};

export default compose(withPagination)(memo(BlackListKYT));
