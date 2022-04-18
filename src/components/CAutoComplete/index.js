import { Chip, Paper, Popper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { ExpandMore } from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DropdownItem from "@protego/sdk/UI/DropdownItem";
import TextField from "@protego/sdk/UI/TextField/TextField";
import { toRem } from "@protego/sdk/utils/measurements";
import { ReactComponent as ChipDeleteIcon } from "assets/icons/ChipDeleteIcon.svg";
import { WHITE } from "constants/ThemeColors";
import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { filter, find } from "lodash";
const StyleChip = withStyles({
  root: {
    backgroundColor: "rgba(0, 128, 255, 0.08)",
    color: "#0080FF",
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
  className,
  error,
  ...props
}) => {
  const { formatMessage } = useIntl();
  const inputRef = useRef();

  const { name } = field;
  const { setFieldValue } = form;
  const [value, setValue] = useState(props?.value);
  const [textInput, setTextInput] = useState("");
  const [widthPopper, setWidthPopper] = useState();

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
      setWidthPopper(inputRef.current?.offsetWidth - 10);
    }, []);

    return (
      <Popper
        {...props}
        placement="bottom-start"
        style={{
          boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.161)",
          borderRadius: 6,
          width: widthPopper,
          marginTop: toRem(4),
        }}
      >
        <div style={{ backgroundColor: WHITE }}>
          {children}
          {textInput && (
            <DropdownItem
              style={{
                color: "#0080FF",
                borderRadius: 6,
              }}
              onMouseDown={onPressAddNewCategory}
            >
              {`${formatMessage({
                id: "setting.blacklist.add.category",
              })}${" "} '${textInput}'`}
            </DropdownItem>
          )}
        </div>
      </Popper>
    );
  };
  const CustomPaper = (props) => {
    return <Paper elevation={0} {...props} />;
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
        renderInput={(params) => (
          <TextField
            error={error}
            onChange={(e) => {
              setTextInput(e.target.value);
            }}
            {...params}
            size="large"
            variant="outlined"
            placeholder={placeholder}
          />
        )}
        renderTags={() => null}
        PopperComponent={PopperMy}
      />
      <div className="RegCAutoComplete-chips">
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
