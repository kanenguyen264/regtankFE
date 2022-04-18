import React from "react";
import { Grid } from "@mui/material";
import Dropdown from "@protego/sdk/RegtankUI/v1/Dropdown";
import DropdownItem from "@protego/sdk/RegtankUI/v1/DropdownItem";

const Dropdows = () => {
  return (
    <div>
      <Grid space={1} container style={{ marginBottom: 5 }}>
        <Dropdown 
          variant="contained" 
          color="warning"
          label="Bulk Action"
        >
          <DropdownItem>Assign</DropdownItem>
          <DropdownItem>Reject</DropdownItem>
        </Dropdown>
      </Grid>
      <Grid space={1} container style={{ marginBottom: 5 }}>
        
      </Grid>
    </div>
  );
};

export default Dropdows;
