import withPagination from "@protego/sdk/UI/withPagination";
import { FETCH_ACTION_GET_KYB_BLACKLIST } from "actions/Setting";
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "recompose";
import BlackListTable from "./BlackListTable";

const BlackListKYB = (props) => {
  const { paginationParams } = props;
  const dispatch = useDispatch();
  const { kybBlackList } = useSelector((state) => state.settings);
  React.useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetch = () => {
    dispatch(FETCH_ACTION_GET_KYB_BLACKLIST(paginationParams));
  };

  return <BlackListTable data={kybBlackList} />;
};

export default compose(withPagination)(memo(BlackListKYB));
