import MenuItem from "@mui/material/MenuItem";
import Select from "@protego/sdk/RegtankUI/v1/Select/Select";
import React from "react";

const Selects = () => {
  const [age, setAge] = React.useState("");
  const handleChange = (event) => {
    setAge(event.target.value);
  };
  return (
    <div style={{ width: 137 }}>
      <Select
        withFormControlProps={{ fullWidth: true }}
        value={age}
        onChange={handleChange}
        style={{ height: 27 }}
        MenuProps={{ disablePortal: true }}
        // onClick={()=>{setShowInput(false)}}
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Others</MenuItem>
      </Select>
    </div>
  );
};

export default Selects;
