import React from "react";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import TextField from "@protego/sdk/RegtankUI/v1/TextField/TextFieldOutlined";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Popover, Grid } from "@mui/material";

const DatePickerA = () => {
  const [value, setValue] = React.useState(new Date("2014-08-18T21:11:54"));
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const toggleInput = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClosePopover = () => {
    setAnchorEl(null);
  };
  const months = [1,2,3,4,5,6,7,8,9,10,11,12]
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <Grid container>
      <Grid item xs={6}>
        <TextField value={value} aria-describedby={id} onClick={toggleInput} />
        <Popover
          id={id}
          open={open}
          anchorOrigin={{ bottom: "center" }}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="Date desktop"
              inputFormat="MM/dd/yyyy"
              value={value}
              onChange={handleChange}
              open
              renderInput={(params) => <TextField {...params} />}
              anchorEl={anchorEl}
            />
          </LocalizationProvider>
        </Popover>
      </Grid>
    </Grid>
  );
};

export default DatePickerA;
