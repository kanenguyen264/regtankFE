import { debounce } from "lodash";
import React, { memo, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { parseQuery } from "util/stringQuery";

const SearchBox = (props) => {
  const { styleName, onChange } = props;

  const intl = useIntl();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [isFocus, setIsFocus] = useState("");

  const delayedSearch =
    (debounce((q) => changeSearch(q), 500), [location.search]);

  const handleSearchChange = (event) => setSearch(event.target.value);

  useEffect(() => {
    const { search } = parseQuery(location.search);
    setSearch(search || "");
  }, [location.search]);

  useEffect(() => {
    if (isFocus) delayedSearch(search);
    return () => clearTimeout(delayedSearch);
  }, [delayedSearch, isFocus, search]);

  const changeSearch = (search) => onChange(search);

  const onKeyPressed = (e) => setIsFocus(e);

  return (
    <div className={`search-bar left-side-icon  bg-transparent`}>
      <div className="form-group">
        <input
          className={`form-control  ${styleName}`}
          type="search"
          onKeyDown={onKeyPressed}
          placeholder={intl.formatMessage({
            id: "appModule.search"
          })}
          onChange={handleSearchChange}
          value={search}
        />
        <button className="search-icon mt-1">
          <i className="zmdi zmdi-search zmdi-hc-lg" />
        </button>
      </div>
    </div>
  );
};

export default memo(SearchBox);
