import React from "react";
import styles from "../SearchBoxDebounce/styles.module.scss";
import clsx from "clsx";
const SearchBox = ({
  styleName,
  placeholder,
  onChange,
  value,
  onPressClear,
  onKeyDown,
  iconRight,
}) => {
  return (
    <div className={`search-bar  bg-transparent`}>
      <div className="form-group">
        <input
          className={clsx(styles.input, styleName, "form-control")}
          type="search"
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          onKeyDown={onKeyDown}
        />

        {iconRight ? (
          <button
            style={{
              left: 10,
              right: "auto",
            }}
            className="search-icon "
            onClick={onKeyDown}
          >
            <i className="zmdi zmdi-search zmdi-hc-lg" />
          </button>
        ) : (
          <button
            style={{
              right: 10,
              left: "auto",
            }}
            className="search-icon "
            onClick={onKeyDown}
          >
            <i className="zmdi zmdi-search zmdi-hc-lg " />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBox;

SearchBox.defaultProps = {
  styleName: "",
  value: "",
};
