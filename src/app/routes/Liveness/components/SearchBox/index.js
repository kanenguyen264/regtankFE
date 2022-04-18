import React, { useState } from "react";
import withPagination from "@protego/sdk/UI/withPagination";
import { useIntl } from "react-intl";
const SearchBox = withPagination(function SearchBox(props) {
  const { styleName } = props;
  const intl = useIntl();
  const [search, setSearch] = useState(
    () => props.value ?? ""
  );

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    props.onChange(event.target.value);
  };

  return (
    <div className={`search-bar right-side-icon bg-transparent`}>
      <div className="form-group">
        <input
          className={`form-control  ${styleName}`}
          type="search"
          placeholder={intl.formatMessage({
            id: "appModule.search"
          })}
          onChange={handleSearchChange}
          value={search}
        />
        <button
          style={{
            left: 10,
            right: "auto",
            top: 0,
            bottom: 0
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
