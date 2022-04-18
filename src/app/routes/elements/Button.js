import React from "react";
import { Grid, Button, Icon } from "@mui/material";
// import { ReactComponent as plusIcon } from "./icons/plusIcon.svg";
import { Add as plusIcon } from "@mui/icons-material";

const Buttons = () => {
  return (
    <div>
      <Grid space={1} container style={{ marginBottom: 5 }}>
        <Grid item xs={1}>
          <Button variant="containedWhite" color="primary">
            <div>Cancel</div>
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained" color="primary" disabled>
            Disabled
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Icon component={plusIcon} />}
          >
            <div>Add</div>
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button
            variant="contained"
            color="primary"
            endIcon={<Icon component={plusIcon} />}
          >
            <div>Add</div>
          </Button>
        </Grid>
        <Button
          item
          variant="contained"
          color="primary"
          endIcon={<Icon component={plusIcon} />}
          size="small"
          style={{ marginLeft: 10 }}
        >
          small
        </Button>
      </Grid>
      <Grid space={1} container style={{ marginBottom: 5 }}>
        <Button variant="outlined" color="primary" style={{ marginLeft: 10 }}>
          Button
        </Button>
        <Button
          item
          variant="outlined"
          color="primary"
          startIcon={<Icon component={plusIcon} />}
          style={{ marginLeft: 10 }}
        >
          Button
        </Button>
        <Button
          item
          variant="outlined"
          color="primary"
          endIcon={<Icon component={plusIcon} />}
          style={{ marginLeft: 10 }}
        >
          Button
        </Button>
      </Grid>
      <Grid space={1} container style={{ marginBottom: 5 }}>
        <Button variant="contained" color="success" style={{ marginLeft: 10 }}>
          Button
        </Button>
        <Button
          item
          variant="contained"
          color="success"
          startIcon={<Icon component={plusIcon} />}
          style={{ marginLeft: 10 }}
        >
          Button
        </Button>
        <Button
          item
          variant="contained"
          color="success"
          endIcon={<Icon component={plusIcon} />}
          style={{ marginLeft: 10 }}
        >
          Button
        </Button>
      </Grid>
      <Grid space={1} container style={{ marginBottom: 5 }}>
        <Button variant="contained" color="error" style={{ marginLeft: 5 }}>
          Error
        </Button>
        <Button variant="contained" color="warning" style={{ marginLeft: 5 }}>
          Warning
        </Button>
        <Button
            variant="contained"
            color="secondary"
            style={{ marginLeft: 5 }}
          >
            <div>Secondary</div>
          </Button>
      </Grid>
    </div>
  );
};

export default Buttons;
