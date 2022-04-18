import React, { useEffect, useState } from "react";
import { OutlinedInput as OutlinedInputMui } from "@mui/material";
import styles from "./styles.module.scss";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";

const OutlinedInput = ({ onChange, inputValue, ...props }) => {
  const [value, setValue] = useState(inputValue);
  useEffect(()=>{
    setValue(inputValue)
  }, [inputValue])
  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange && onChange(newValue);
  };
  return (
    <div className={styles.outlinedWrapper}>
      <Tooltip title={value} placement="top-start">
        <OutlinedInputMui value={value} onChange={handleChange} {...props} />
      </Tooltip>
    </div>
  );
};

export default OutlinedInput;
