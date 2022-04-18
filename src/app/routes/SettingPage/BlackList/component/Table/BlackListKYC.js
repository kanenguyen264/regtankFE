import { StylesContext } from "@mui/styles";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import {
  FETCH_ACTION_GET_KYC_BLACKLIST,
  FETCH_ACTION_KYC_CATEGORY,
  KYC_ACTION_GET_KYC_BLACKLIST_BY_FILTER,
} from "actions/Setting";
import FilterComponent from "components/FilterComponentv1";
import { BlackListFilter } from "constants/BlackListFilter";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "constants/pagingSetting";
import React, { memo, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "recompose";
import BlackListTable from "./BlackListTable";
import styles from "./styles.module.scss";
import moduleStyles from "../../BlackListStyle.module.scss";
import clsx from "clsx";
const BlackListKYC = (props) => {
  const { paginationParams, setPaginationParams } = props;
  const dispatch = useDispatch();
  const { kycBlackList } = useSelector((state) => state.settings);
  const [filterActive, setFilterActive] = useState(false);
  const [dataFilter, setDataFilter] = useState();
  const [loading, setLoading] = useState(false);
  const { size, search } = paginationParams;
  const [doFetchData, setDoFetchData] = React.useState(true);
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (doFetchData) {
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams]);

  const fetch = () => {
    if (filterActive && !search) {
      fetchFilter(dataFilter);
    } else {
      dispatch(FETCH_ACTION_GET_KYC_BLACKLIST(paginationParams));
    }
  };

  useEffect(() => {
    /**
     * Fetch category kyc
     */
    dispatch(FETCH_ACTION_KYC_CATEGORY());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFilter = (data) => {
    dispatch(
      KYC_ACTION_GET_KYC_BLACKLIST_BY_FILTER({
        filter: data,
        params: paginationParams,
      })
    );
  };

  const onFilterActive = () => {
    setFilterActive(true);
  };

  const onSubmitFilter = (filter) => {
    if (filter) {
      setLoading(true);
      setDataFilter(filter);
      /**
       * If filter don't fetch
       */
      setDoFetchData(false);
      setPaginationParams({ page: DEFAULT_PAGE, size: size, search: "" });
      /**
       * Set default page when filter
       */
      paginationParams["search"] = "";
      paginationParams["page"] = DEFAULT_PAGE;
      paginationParams["size"] = DEFAULT_PAGE_SIZE;
      dispatch(
        KYC_ACTION_GET_KYC_BLACKLIST_BY_FILTER({
          filter: filter,
          params: paginationParams,
        })
      ).finally(() => {
        setLoading(false);
        setDoFetchData(true);
      });
    }
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
          className={styles.filterWrap}
          listFilter={BlackListFilter}
          onFilterActive={onFilterActive}
          onSubmitFilter={onSubmitFilter}
          hideMoreFilter
          SearchPlaceholder="kyc.filter.placeholder.search"
          resetFilter={() => resetFilter()}
          classes={{selectType: clsx(styles.filterSelectPopover, moduleStyles.actionsPopover),  datePicker: styles.filterDatePicker}}
        />
        <BlackListTable data={kycBlackList} />
      </div>
    </LoadingWrapper>
  );
};

export default compose(withPagination)(memo(BlackListKYC));