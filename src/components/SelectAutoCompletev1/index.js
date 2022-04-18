import {
  Paper,
  Popper,
  Autocomplete,
  Typography,
  // TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { WHITE } from "constants/ThemeColors";
import React, { useEffect, useRef, useState } from "react";
import { BODY_TEXT } from "constants/ThemeColors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import CustomScrollbar from "@protego/sdk/RegtankUI/v1/Scrollbar";
import TextField  from "@protego/sdk/RegtankUI/v1/TextField";

const useStyles = makeStyles({
  root: {
    top: "unset",
    right: 9,
  },

  clearIndicator: {
    "& span": {
      "& svg": {
        "& path": {
          d:
            "path('M0.577485 0.910779C0.733758 0.754553 0.945681 0.66679 1.16665 0.66679C1.38762 0.66679 1.59954 0.754553 1.75582 0.910779L6.99999 6.15495L12.2442 0.910779C12.321 0.831187 12.413 0.767702 12.5146 0.724027C12.6163 0.680353 12.7257 0.657365 12.8363 0.656404C12.947 0.655442 13.0567 0.676527 13.1591 0.718428C13.2615 0.760328 13.3546 0.822206 13.4328 0.90045C13.5111 0.978694 13.5729 1.07174 13.6148 1.17415C13.6567 1.27656 13.6778 1.3863 13.6769 1.49695C13.6759 1.6076 13.6529 1.71695 13.6092 1.81862C13.5656 1.92029 13.5021 2.01224 13.4225 2.08911L7.58915 7.92245C7.43288 8.07867 7.22096 8.16643 6.99999 8.16643C6.77902 8.16643 6.56709 8.07867 6.41082 7.92245L0.577485 2.08911C0.421259 1.93284 0.333496 1.72092 0.333496 1.49995C0.333496 1.27898 0.421259 1.06705 0.577485 0.910779Z')", // your svg icon path here
        },
      },
    },
  },
  option: {
    height: toRem(36),
    paddingTop: toRem(8),
    paddingBottom: toRem(8),
    marginTop: toRem(8),
    marginBottom: toRem(8),
    color: ThemeColors.grayText,
    zIndex: 10,
    fontSize: toRem(12),
    fontWeight: 500,
    "&:hover": {
      backgroundColor: `${ThemeColors.itemHover} !important`,
      color: ThemeColors.primary,
    },
  },
});

const SelectAutoComplete = ({
  form,
  field,
  options,
  placeholder,
  getOptionLabel,
  textFieldProps,
  PopperComponent,
  popperFullWidth = false,
  PaperComponent,
  ...props
}) => {
  const { name, value } = field;
  const { setTouched, setFieldValue } = form;
  const classes = useStyles();
  const inputRef = useRef();

  const onChange = (event, value) => {
    setFieldValue(name, value);
    props.onChange?.(value);
  };

  const PopperMy = (props) => {
    const { children } = props;
    const [widthPopper, setWidthPopper] = useState();
    useEffect(() => {
      setWidthPopper(
        inputRef.current?.offsetWidth - (popperFullWidth ? 0 : 10)
      );
    }, []);

    return (
      <Popper
        {...props}
        placement="bottom-start"
        style={{
          boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.161)",
          borderRadius: 6,
          width: widthPopper,
          paddingTop: toRem(4),
        }}
      >
        {children}
      </Popper>
    );
  };
  const CustomPaper = (props) => {
    return (
      <div>
        <CustomScrollbar>{props.children}</CustomScrollbar>
      </div>
    );
  };
  return (
    <div ref={inputRef}>
      <Autocomplete
        {...props}
        name={name}
        popupIcon={<ExpandMoreIcon />}
        // disableCloseOnSelect={true}
        classes={{
          endAdornment: classes.root, // class name, e.g. `classes-nesting-root-x`
          clearIndicatorDirty: classes.clearIndicator,
          popupIndicator: classes.popupIndicator,
          option: classes.option,
        }}
        onChange={onChange}
        PaperComponent={PaperComponent || CustomPaper}
        onBlur={() => setTouched({ [name]: true })}
        getOptionLabel={getOptionLabel}
        options={options}
        value={value}
        defaultValue={value}
        renderInput={
          props?.renderInput
            ? props.renderInput
            : (params) => {
                return (
                  <TextField
                    {...params}
                    {...textFieldProps}
                    placeholder={placeholder}
                    variant="outlined"
                    fullWidth
                  />
                );
              }
        }
        PopperComponent={PopperComponent ? PopperComponent : PopperMy}
      />
    </div>
  );
};

export default SelectAutoComplete;
