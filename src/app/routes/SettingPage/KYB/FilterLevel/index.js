import { Grid } from "@mui/material";
import Slider from "@protego/sdk/RegtankUI/v1/Slider";
import { makeStyles } from "@mui/styles";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { BACKGROUND_APP_BAR } from "constants/ThemeColors";
import React, { Fragment } from "react";

const marks = [
  {
    value: 0,
    label: "0%",
  },
  {
    value: 25,
    label: "25%",
  },
  {
    value: 50,
    label: "50%",
  },
  {
    value: 75,
    label: "75%",
  },
  {
    value: 100,
    label: "100%",
  },
];

const FilterLevel = ({ fuzzyLevel, onChange, disabled = false, loading }) => {
  const valueText = (value) => {
    return `${value}%`;
  };

  const handleChange = (e, value) => {
    onChange(value);
  };

  return (
    <Fragment>
      <LoadingWrapper loading={loading}>
        <JRCard
          header={<IntlMessages id="setting.kyb.filterLevel"></IntlMessages>}
          headerLine
        >
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            className="mt-4"
          >
            <Grid item xs={8} className="mb-4 mt-4">
              {fuzzyLevel !== undefined && (
                <Slider
                  defaultValue={0}
                  valueLabelDisplay="on"
                  step={1}
                  marks={marks}
                  value={fuzzyLevel}
                  min={0}
                  max={100}
                  di
                  valueLabelFormat={valueText}
                  onChange={!disabled && handleChange}
                  style={disabled ? { pointerEvents: "none" } : {}}
                  // className={classes.SliderCustom}
                />
              )}
            </Grid>
          </Grid>
        </JRCard>
      </LoadingWrapper>
    </Fragment>
  );
};
export default FilterLevel;
