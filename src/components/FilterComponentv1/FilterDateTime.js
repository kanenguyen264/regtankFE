import { FormControl, FormGroup, Grid, Typography } from "@material-ui/core";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
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
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { WHITE } from "constants/ThemeColors";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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

  dropdown: {
    backgroundColor: `${WHITE} !important`,
  },
  rounded: {
    borderRadius: toRem(8),
  },
});

const FilterDateTime = (props) => {
  const {
    onChange,
    data,
    reset,
    fullWidth,
    noReset,
    valueDefault,
    className = "",
    disableBorderLRT = false,
    titileLable = "",
    clsLabelDefaul = false,
  } = props;
  const classes = useStyles();
  const [value, setValue] = React.useState([
    {
      startDate: {},
      endDate: moment(new Date(null)).endOf("day"),
      key: "selection",
    },
  ]);
  // const classesDateRange = useStyles();

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
      <div
        className={clsx(open && styles.buttonLabelPopover)}
        onClick={handleClick}
      >
        {titileLable && (
          <span
            className={clsx(
              open && styles.clsTitileLableActive,
              styles.clsTitileLable
            )}
          >
            {" "}
            {titileLable}
          </span>
        )}
        <Button
          variant="outlinedDropdown"
          fullWidth={fullWidth}
          size={"small"}
          className={clsx(
            disableBorderLRT ? styles.clsDisableBorderLRT : classes.dropdown,
            classes.rounded
          )}
          endIcon={
            open ? (
              <span className={clsx(styles.clsTitileLableActive)}>
                <ExpandLessIcon />
              </span>
            ) : (
              <ExpandMoreIcon />
            )
          }
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
              <span
                className={clsx(open && styles.clsTitileLableActive, {
                  [styles.clsLabelDefaul]: true,
                })}
              >
                <IntlMessages id={data?.label} />{" "}
              </span>
            )}
          </span>
        </Button>
      </div>
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
        className={clsx(className, styles.filterDatePicker)}
      >
        <FormControl className={styles.formStyle} style={{ width: "100%" }}>
          <FormGroup>
            {data && data?.maximumMonths && value[0] && value[0]?.startDate ? (
              <DateRange
                ranges={value}
                onChange={(item) => onChangeTime(item)}
                showDateDisplay={false}
                months={data?.months || 2}
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
                className={classes.dateRange}
              />
            ) : (
              <DateRange
                maxDate={new Date()}
                ranges={value}
                onChange={(item) => onChangeTime(item)}
                showDateDisplay={false}
                months={data?.months || 2}
                direction="horizontal"
                className={classes.dateRange}
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
