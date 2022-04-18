import withPagination from "@protego/sdk/UI/withPagination";
import clsx from "clsx";
import { debounce } from "lodash";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { parseQuery } from "util/stringQuery";
import styles from "./styles.module.scss";

const SearchBox = withPagination(function SearchBox(props) {
  const {
    styleName,
    placeholder,
    onChange,
    disableDebounce,
    iconRight,
    noSearchParams,
  } = props;
  const intl = useIntl();
  const location = useLocation();
  const [search, setSearch] = useState(() =>
    noSearchParams ? "" : props.paginationParams.search ?? ""
  );
  const [isFocus, setIsFocus] = useState("");
  // eslint-disable-next-line
  const delayedSearch = useCallback(
    debounce((q) => changeSearch(q), 500),
    [location.search]
  );

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    onChange(event.target.value);
  };

  useEffect(() => {
    if (!noSearchParams) {
      const { search } = parseQuery(location.search);
      setSearch(search || "");
    }
  }, [location.search]);

  useEffect(() => {
    if (!disableDebounce && isFocus) {
      delayedSearch(search);
    }
    return () => clearTimeout(delayedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const changeSearch = (value) => {
    props.setPaginationParams({ page: 0, search: value }, "replaceIn");
  };

  const onKeyPressed = (e) => {
    setIsFocus(e);
  };

  return (
    <div
      className={`search-bar ${!iconRight && "right-side-icon"} bg-transparent`}
    >
      <div className="form-group">
        <input
          className={clsx(styles.input, styleName, "form-control")}
          type="search"
          onKeyDown={onKeyPressed}
          placeholder={
            placeholder
              ? placeholder
              : intl.formatMessage({
                  id: "appModule.search",
                })
          }
          onChange={handleSearchChange}
          value={search}
        />

        <button
          style={{
            left: iconRight ? "auto" : 10,
            right: iconRight ? 10 : "auto",
            top: 0,
            bottom: 0,
          }}
          className="search-icon"
        >
          <i className="zmdi zmdi-search zmdi-hc-lg" />
        </button>
      </div>
    </div>
  );
});

export default SearchBox;
SearchBox.propTypes = {
  onChange: PropTypes.func,
};
SearchBox.defaultProps = {
  onChange: function () {},
};
