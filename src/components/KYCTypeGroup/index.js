import {
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import { DJ, C6 } from "constants/KYCTypes.js";
import React, { Fragment } from "react";

const CRadio = withStyles({
  root: {
    color: "#C4C4C4",
    "&$checked": {
      color: "#0080FF",
    },
  },
  checked: {},
})((props) => <Radio color="default" size="small" {...props} />);

const KYCGroup = (props) => {
  const { value, handleChange } = props;
  return (
    <Fragment>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          aria-label="countrySource"
          name="countrySource"
          value={value}
          onChange={handleChange}
          row
        >
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <FormControlLabel
                control={<CRadio value={C6} />}
                label={<IntlMessages id="setting.sidebar.kyc.acuris" />}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel
                control={<CRadio value={DJ} />}
                label={<IntlMessages id="setting.sidebar.kyc.dowJones" />}
              />
            </Grid>
          </Grid>
        </RadioGroup>
      </FormControl>
    </Fragment>
  );
};

export default KYCGroup;
