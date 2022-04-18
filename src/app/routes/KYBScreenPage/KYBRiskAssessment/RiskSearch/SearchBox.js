import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import { SvgIcon } from "@mui/material";
import styles from "../RiskSearch/SearchBoxStyle.module.scss";
import clsx from "clsx";
import { ReactComponent as SearchIcon } from "assets/icons/IcoOutlineSearch.svg";

const SearchBox = withPagination(function SearchBox(props) {
  const { styleName, onChange, placeholder, value } = props;
  const intl = useIntl();
  const location = useLocation();
  const [search, setSearch] = useState(
    () => props.paginationParams.search ?? ""
  );
  const [isFocus, setIsFocus] = useState("");
  // eslint-disable-next-line
  const delayedSearch = useCallback(
    debounce((q) => changeSearch(q), 500),
    [location.search]
  );
  React.useEffect(() => {
    if (value) {
      setSearch(value);
      props.setPaginationParams({ search: value }, "replaceIn");
    }
    // eslint-disable-next-line
  }, [value]);
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    if (isFocus) delayedSearch(search);
    return () => clearTimeout(delayedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const changeSearch = (value) => {
    onChange(value);
    // props.setPaginationParams({ search: value }, "replaceIn");
  };

  const onKeyPressed = (e) => {
    setIsFocus(e);
  };
  return (
    <div
      className={clsx(styles.container, `search-bar bg-transparent`, {
        [styles.inputFocused]: isFocus,
      })}
    >
      <div className="form-group">
        <input
          className={clsx(styles.input, "form-control")}
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
          onFocus={(e) => {
            setIsFocus(e);
          }}
          onBlur={() => {
            setIsFocus("");
          }}
        />

        <button
          style={{
            top: 0,
            bottom: 0,
          }}
          className="search-icon"
        >
          <SearchIcon />
        </button>
      </div>
    </div>
  );
  // return (
  //   <div className={`search-bar left-side-icon bg-transparent`}>
  //     <div className="form-group">
  //       <TextField
  //         variant={"outlined"}
  //         onKeyDown={onKeyPressed}
  //         className={`form-control ${styleName}`}
  //         placeholder={intl.formatMessage({
  //           id: placeholder ? placeholder : "kyb.search.by.kyc",
  //         })}
  //         onChange={handleSearchChange}
  //         value={search}
  //       />
  //       <button
  //         style={{
  //           right: "auto",
  //           left: 10,
  //           top: 0,
  //           bottom: 0,
  //         }}
  //         className="search-icon"
  //       >
  //         <i className="zmdi zmdi-search zmdi-hc-lg" />
  //       </button>
  //     </div>
  //   </div>
  // );
});

export default SearchBox;
