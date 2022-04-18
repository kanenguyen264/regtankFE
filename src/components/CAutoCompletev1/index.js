import { Chip, Paper, Popper, TextField } from "@mui/material";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import { withStyles } from "@material-ui/core/styles";
import { ExpandMore } from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DropdownItem from "@protego/sdk/RegtankUI/v1/DropdownItem";
// import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import { toRem } from "@protego/sdk/utils/measurements";
import { ReactComponent as ChipDeleteIcon } from "assets/icons/ChipDeleteIcon.svg";
import { WHITE } from "constants/ThemeColors";
import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { filter, find } from "lodash";
import clsx from "clsx";
import styles from "./styles.module.scss";
import CustomScrollbar from "@protego/sdk/RegtankUI/v1/Scrollbar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const StyleChip = withStyles({
  root: {
    backgroundColor: "rgba(0, 128, 255, 0.08)",
    color: ThemeColors.primary,
    maxWidth: "100%",
    fontSize: toRem(14),
    border: 0,
    marginRight: toRem(8),
    marginBottom: toRem(8),
    marginTop: toRem(8),
  },
})(Chip);

const CAutoComplete = ({
  form,
  field,
  options,
  placeholder,
  getOptionLabel,
  textFieldProps,
  multiple,
  onPressAdd,
  numberChip,
  onChange,
  label = "",
  className,
  error,
  customRenderInput,
  labelRequired = false,
  disableSearch = false,
  ...props
}) => {
  const { formatMessage } = useIntl();
  const inputRef = useRef();

  const { name } = field;
  const { setFieldValue } = form;
  const [value, setValue] = useState(props?.value);
  const [textInput, setTextInput] = useState("");
  const [widthPopper, setWidthPopper] = useState();

  const InputLabelPropsObj = {
    shrink: true,
    required: labelRequired,
  };

  const onDelete = (val) => () => {
    setValue((value) => value.filter((v) => v.name !== val));
    setFieldValue(
      name,
      value.filter((v) => v.name !== val)
    );
  };

  const onPressAddNewCategory = () => {
    if (typeof onPressAdd === "function") {
      onPressAdd(textInput);
    }
  };
  useEffect(() => {
    let data = find(options, function (o) {
      return o.name === textInput;
    });

    if (data) {
      if (value?.length < numberChip) {
        let valueTemp = [...value, data];
        setValue(valueTemp);
        setFieldValue(name, valueTemp);
      }
    }
    setTextInput("");
  }, [options]);
  const PopperMy = function (props) {
    const { children } = props;
    useEffect(() => {
      setWidthPopper(inputRef.current?.offsetWidth);
    }, []);

    return (
      <Popper
        {...props}
        placement="bottom-start"
        style={{
          width: widthPopper,
        }}
      >
        <div
          style={{
            backgroundColor: WHITE,
            boxShadow: "0px 0px 8px rgba(37, 40, 43, 0.12)",
            borderRadius: "8px",
            margin: `${toRem(8)} 0`,
            overflow: "hidden",
          }}
        >
          {children}
          {textInput && (
            <DropdownItem
              style={{
                color: ThemeColors.primary,
                borderRadius: 6,
                backgroundColor: ThemeColors.white,
              }}
              className={styles.addItem}
              onMouseDown={onPressAddNewCategory}
            >
              {`${formatMessage({
                id: "setting.blacklist.add.category",
              })}${" "} ‘${textInput}’`}
            </DropdownItem>
          )}
        </div>
      </Popper>
    );
  };
  const CustomPaper = (props) => {
    return (
      <div className={styles.paper}>
        <CustomScrollbar>{props.children}</CustomScrollbar>
      </div>
    );
  };
  return (
    <div ref={inputRef} className="RegCAutoComplete-root">
      <Autocomplete
        name={name}
        className={className}
        multiple={multiple}
        PaperComponent={CustomPaper}
        id="tags-outlined"
        popupIcon={<ExpandMore />}
        options={options}
        value={value}
        onChange={(e, newValue) => {
          if (value?.length < numberChip) {
            setValue(newValue);
            setFieldValue(name, newValue);
          }
        }}
        getOptionLabel={(option) => option.name}
        defaultValue={[]}
        filterSelectedOptions={multiple ? true : false}
        renderInput={
          customRenderInput
            ? customRenderInput
            : (params) => {
                return (
                  <TextField
                    {...params}
                    variant="standard"
                    className={clsx(
                      styles.TextField,
                      disableSearch ? styles.disableSearch : ""
                    )}
                    InputLabelProps={InputLabelPropsObj}
                    placeholder={placeholder}
                    label={label}
                    onChange={(e) => {
                      setTextInput(e.target.value);
                    }}
                    disabled={disableSearch}
                    {...textFieldProps}
                  />
                );
              }
        }
        renderTags={() => null}
        PopperComponent={PopperMy}
      />
      <div className={clsx("RegCAutoComplete-chips", styles.chipsWrap)}>
        {value?.map((v, index) => (
          <StyleChip
            key={v.name}
            label={v.name}
            onDelete={onDelete(v.name)}
            deleteIcon={
              <div
                className={"d-flex align-items-center justify-content-center"}
              >
                <ChipDeleteIcon />
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default CAutoComplete;
