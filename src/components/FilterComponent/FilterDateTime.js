import { FormControl, FormGroup, Grid, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import clsx from "clsx";
import { useFormikContext } from "formik";
import moment from "moment";
import React, { useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import styles from "./FilterComponent.module.scss";
import { makeStyles } from "@material-ui/core/styles";
import { formatDate } from "util/date";
const useStyles = makeStyles({
  dateRange: {
    "& .rdrSelected": {
      color: "#0080FF !important",
    },
    "& .rdrDayNumber": {
      top: 0,
      bottom: 0,
    },
    "&  .rdrDayNumber span:after": {
      color: "#0080FF !important",
      background: "unset !important",
    },
  },
});

const FilterDateTime = (props) => {
  const { onChange, data, reset, fullWidth, noReset, valueDefault } = props;
  const [value, setValue] = React.useState([
    {
      startDate: {},
      endDate: moment(new Date(null)).endOf("day"),
      key: "selection",
    },
  ]);
  const classesDateRange = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const open = Boolean(anchorEl);
  const formikContext = useFormikContext();

  React.useEffect(() => {
    if (!noReset) {
      onPressReset();
    }

    // eslint-disable-next-line
  }, [reset]);
  React.useEffect(() => {
    if (valueDefault && valueDefault[0] && valueDefault[1]) {
      setValue([
        {
          startDate: valueDefault[0],
          endDate: valueDefault[1],
          key: "selection",
        },
      ]);
    }

    // eslint-disable-next-line
  }, [valueDefault]);

  useEffect(() => {
    /**
     * Reset value when delete chip date time
     */
    if (formikContext.values[data?.property]?.length < 1) {
      setValue([
        {
          startDate: "",
          endDate: moment(new Date()).endOf("day"),
          key: "selection",
        },
      ]);
    }
    // eslint-disable-next-line
  }, [formikContext.values[data?.property]]);

  const onChangeTime = (item) => {
    setValue([item.selection]);
  };

  const handleClose = (e) => {
    if (value[0].startDate && value[0].endDate) {
      onChange(value[0], data.property);
    }
    setAnchorEl(null);
  };

  const onPressReset = () => {
    setValue([
      {
        startDate: "",
        endDate: moment(new Date()).endOf("day"),
        key: "selection",
      },
    ]);
    onChange([], data.property);
  };
  const onApply = () => {
    if (value[0].startDate && value[0].endDate) {
      onChange(value[0], data.property);
    }
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="outlined"
        fullWidth={fullWidth}
        className={clsx(styles.FilterButton, styles.FilterBorder)}
        endIcon={open ? <ExpandLess /> : <ExpandMore />}
        onClick={handleClick}
      >
        <span className={styles.textFilter}>
          {valueDefault && valueDefault[0] && valueDefault[1] ? (
            <Typography>
              {formatDate(valueDefault[0], "DD MMM YY") +
                " - " +
                formatDate(valueDefault[1], "DD MMM YY")}
            </Typography>
          ) : (
            <IntlMessages id={data?.label} />
          )}
        </span>
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <FormControl className={styles.formStyle} style={{ width: "100%" }}>
          <FormGroup>
            {data && data?.maximumMonths && value[0] && value[0]?.startDate ? (
              <DateRange
                ranges={value}
                onChange={(item) => onChangeTime(item)}
                showDateDisplay={false}
                months={1}
                minDate={
                  new Date(
                    moment(new Date(value[0]?.startDate)).add(
                      -data?.maximumMonths,
                      "months"
                    )
                  )
                }
                maxDate={
                  new Date() >
                  new Date(
                    moment(new Date(value[0]?.startDate)).add(
                      data?.maximumMonths,
                      "months"
                    )
                  )
                    ? new Date(
                        moment(new Date(value[0]?.startDate)).add(
                          data?.maximumMonths,
                          "months"
                        )
                      )
                    : new Date()
                }
                direction="horizontal"
                className={classesDateRange.dateRange}
              />
            ) : (
              <DateRange
                maxDate={new Date()}
                ranges={value}
                onChange={(item) => onChangeTime(item)}
                showDateDisplay={false}
                months={1}
                direction="horizontal"
                className={classesDateRange.dateRange}
              />
            )}

            <div className={(styles.fixedButton, styles.popoverBody)}>
              <Grid
                item
                xs={12}
                className={"d-flex justify-content-end align-item-center"}
              >
                <Button
                  variant="contained"
                  className={clsx(styles.FilterButtonCalendarReset, "d-flex")}
                  onClick={onPressReset}
                >
                  <IntlMessages id="audit.filter.reset" />
                </Button>
                <Button
                  variant="contained"
                  className={clsx(
                    styles.FilterButtonCalendarApply,
                    "d-flex ml-3"
                  )}
                  onClick={onApply}
                >
                  <IntlMessages id="appModule.apply" />
                </Button>
              </Grid>
            </div>
          </FormGroup>
        </FormControl>
      </Popover>
    </>
  );
};
export default FilterDateTime;
