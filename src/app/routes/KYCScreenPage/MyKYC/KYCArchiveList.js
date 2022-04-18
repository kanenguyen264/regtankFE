import withPagination from "@protego/sdk/UI/withPagination";
import React, { Fragment, memo, useCallback, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { KYCArchiveAdapter } from "services/KYCService";
import KYCTable from "./KYCTable";
import styles from "./KYCList.module.scss";
import clsx from "clsx";
import { useIntl } from "react-intl";
import SearchBox from "@protego/sdk/RegtankUI/v1/SearchBoxDebounce";
import { ReactComponent as SearchIcon } from "assets/icons/IcoOutlineSearch.svg";

const mapStateToProps = (state) => ({
  kycList: state.kyc.archiveList,
  watchGroup: state.kyc.watchGroup,
});

const KYCArchiveList = ({
  dispatch,
  paginationParams,
  kycList,
  addFavorite,
  onRefresh,
  watchGroup,
}) => {
  const { formatMessage } = useIntl();

  const fetch = useCallback(() => {
    dispatch(KYCArchiveAdapter.actionGetAll({ params: paginationParams }));
  }, [dispatch, paginationParams]);

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams, onRefresh]);

  return (
    <div className={styles.kycContainer}>
      <div className={clsx(styles.bgTabGroup, "d-flex justify-content-end")}>
        <SearchBox
          className={clsx(styles.searchBoxArchive)}
          placeholder={formatMessage({ id: "kyc.search.content" })}
          searchIcon={<SearchIcon />}
        />
      </div>

      <KYCTable
        onRefresh={onRefresh}
        data={kycList}
        addFavorite={addFavorite}
      />
    </div>
  );
};

export default compose(
  connect(mapStateToProps, null),
  withPagination
)(memo(KYCArchiveList));
