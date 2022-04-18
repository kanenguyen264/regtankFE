import {
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import { FEMALE, MALE, UNSPECIFIED } from "constants/GenderTypes";
import React, { Fragment } from "react";
//@ts-ignore
import styles from "./styles.module.scss";

const CRadio = withStyles({
  root: {
    color: "#C4C4C4",
    "&$checked": {
      color: "#0080FF",
    },
  },
  checked: {}
})((props) => <Radio color="default" size="small" {...props} />);

const GenderGroup = (props) => {
  const { value, handleChange } = props;
  return (
    <Fragment>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          aria-label="gender"
          name="gender"
          value={value}
          onChange={handleChange}
          row
        >
          <Grid container spacing={1}>
            <Grid item xs={4} className={styles.radioItem}>
              <FormControlLabel
                control={<CRadio value={FEMALE} />}
                label={
                  <Typography variant="body1">
                    <IntlMessages id="female" />
                  </Typography>
                }
              />
            </Grid>
            <Grid item xs={4} className={styles.radioItem}>
              <FormControlLabel
                control={<CRadio value={MALE} />}
                label={
                  <Typography variant="body1">
                    <IntlMessages id="male" />
                  </Typography>
                }
              />
            </Grid>
            <Grid item xs={4} className={styles.radioItem}>
              <FormControlLabel
                control={<CRadio value={UNSPECIFIED} />}
                label={
                  <Typography variant="body1">
                    <IntlMessages id="unspecified" />
                  </Typography>
                }
              />
            </Grid>
          </Grid>
        </RadioGroup>
      </FormControl>
    </Fragment>
  );
};

export default GenderGroup;
