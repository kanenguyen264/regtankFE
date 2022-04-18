import React, { useState, useEffect, useRef, useCallback } from "react";
import { ReactComponent as ChipDeleteIcon } from "assets/icons/IcChipDelete.svg";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import {
  DialogActions,
  DialogContent,
  Grid,
  Tooltip,
  FormGroup,
  FormControl,
  FormControlLabel,
  Checkbox,
  Chip,
} from "@mui/material";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog/Dialog";
import { Typography } from "@mui/material";
import { Button, SvgIcon } from "@mui/material";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import styles from "./../Department.module.scss";
import { Form, Formik, useFormikContext } from "formik";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
import clsx from "clsx";
import Popover from "@material-ui/core/Popover";
import SearchBox from "components/SearchBoxDebounce";
import { makeStyles } from "@material-ui/core/styles";
import {
  BORDER_CHECKBOX,
  CHECKBOX,
  BR_COLOR_CHIP,
  COLOR_CHIP,
  BR_COLOR_CHIP_DISABLE,
  COLOR_CHIP_DISABLE,
  COLOR_DISABLE,
} from "constants/ThemeColors";
import { toRem } from "@protego/sdk/utils/measurements";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { withStyles } from "@material-ui/core/styles";
import { filter } from "lodash";
import { Edit } from "react-feather";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { map, find } from "lodash";
import { ADD_DEPARTMENT, UPDATE_DEPARTMENT } from "actions/Setting.js";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import { compose } from "recompose";
import { fetchDepartmentList } from "actions/Setting.js";
import { Switch } from "@protego/sdk/RegtankUI/v1/Switch";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import { ReactComponent as PlusIcon } from "assets/icons/plusIcon.svg";
import { fetchDepartmentListAll } from "actions/Setting.js";
const checkBoxStyle = makeStyles({
  root: {
    color: BORDER_CHECKBOX,
    "&$checked": {
      color: CHECKBOX,
    },
  },
  checked: {},
});
const useStyles = makeStyles({
  root: {
    paddingLeft: toRem(16),
    margin: 0,
    display: "flex",
    justifyContent: "space-between",
  },
  labelPlacementStart: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
});

const AccessTo = ({ departmentListAll, locked, dataDeptCurrent }) => {
  const intl = useIntl();

  const checkBoxClass = checkBoxStyle();
  const classes = useStyles();
  const [selected, setSelected] = React.useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchTextDepartment, setSearchTextDepartment] = useState("");
  const open = Boolean(anchorEl);
  const [dataDepartmentSelect, setDataDepartmentSelect] = useState(
    departmentListAll
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const getNameDepartment = (id) => {
    const data = find(departmentListAll, function (o) {
      return o.id === id;
    });
    return data?.name;
  };
  const handleClose = async (e) => {
    setAnchorEl(null);
    setTimeout(() => {
      setDataDepartmentSelect(departmentListAll);
    }, 500);
  };
  const outerForm = useFormikContext();

  React.useEffect(() => {
    if (outerForm.values["accessTo"]) {
      const filters = {};
      for (let value of outerForm.values["accessTo"]) {
        if (!filters[value]) {
          filters[value] = true;
        }
      }
      // eslint-disable-next-line
      setSelected(filters);
    }
  }, [outerForm.values]);
  const setDepartment = React.useCallback(
    async (department) => {
      outerForm.setFieldValue("accessTo", department);
    },
    [outerForm]
  );
  const onChange = async (action, property) => {
    // eslint-disable-next-line
    const accessTo = Object.keys(action)?.filter(function (key) {
      if (action[key]) {
        return key;
      }
    });
    setDepartment(accessTo);
  };
  const handleChangeAccessTo = (event) => {
    const emitValue = {
      // eslint-disable-next-line
      ...selected,
      [event.target.name]: event.target.checked,
    };
    onChange(emitValue, "accessTo");
  };
  let isSelectAll =
    Object.keys(selected)?.length === dataDepartmentSelect.length
      ? true
      : false;
  const onPressSelectAll = () => {
    let isSelectAll =
      Object.keys(selected)?.length === dataDepartmentSelect.length
        ? true
        : false;
    let filters = {};
    for (let value of dataDepartmentSelect) {
      if (!filters[value.id]) {
        filters[value.id] = true;
      }
    }

    if (isSelectAll) {
      onChange([], "nationality");
      return;
    }
    onChange(filters, "nationality");
  };
  const onChangeSearchDepartment = (text) => {
    setSearchTextDepartment(text);
    let dataFilter = departmentListAll.filter(
      (item) => item.name.toUpperCase().indexOf(text.toUpperCase()) > -1
    );
    setDataDepartmentSelect(dataFilter);
  };
  return (
    <>
      <Button
        variant={"outlinedDropdown"}
        size="large"
        disabled={locked ? true : false}
        fullWidth
        className={clsx(styles.buttonDropdown)}
        endIcon={open ? <ExpandLess /> : <ExpandMore />}
        onClick={handleClick}
        style={{
          color: ThemeColors.defaultDark,
          borderColor: ThemeColors.grayBorder,
          backgroundColor: ThemeColors.white,
          fontWeight: 400,
        }}
      >
        <span
        // className={styles.textButtonDropdown}
        // style={{ color: locked && COLOR_DISABLE }}
        >
          - Select Department -
          {/* <IntlMessages id="setting.add.accessTo" /> */}
        </span>
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        classes={{
          paper: clsx({ [styles.PopoverContainerFull]: true }),
        }}
      >
        <div className={"m-3"}>
          <Grid
            container
            direction={"row"}
            alignItems={"center"}
            justify={"center"}
            spacing={1}
          >
            <Grid item xs={12}>
              <SearchBox
                noSearchParams={true}
                onChange={onChangeSearchDepartment}
                value={searchTextDepartment}
                placeholder={intl.formatMessage({
                  id: "setting.department.table.departmentName",
                })}
                styleName={styles.FilterBorder}
                iconRight={false}
                disableDebounce
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                style={{ width: "100%" }}
                variant={"outlined"}
                //  className={clsx(styles.FilterButtonContained)}
                onClick={onPressSelectAll}
              >
                {isSelectAll ? (
                  <IntlMessages id="audit.filter.un.select.all" />
                ) : (
                  <IntlMessages id="audit.filter.select.all" />
                )}
              </Button>
            </Grid>
          </Grid>
        </div>
        <FormControl
          className={styles.formStyle}
          style={{ width: "100%", zIndex: "1100" }}
        >
          <FormGroup>
            {map(
              filter(dataDepartmentSelect, function (o) {
                return o.id !== dataDeptCurrent?.id;
              }),
              "id"
            )?.map((item, index) => {
              return (
                <FormControlLabel
                  className={styles.labelList}
                  classes={{
                    labelPlacementStart: classes.labelPlacementStart,
                  }}
                  labelPlacement={"end"}
                  // classes={classes}
                  control={
                    <Checkbox
                      key={index}
                      classes={{
                        root: checkBoxClass.root,
                        checked: checkBoxClass.checked,
                      }}
                      name={item}
                      checked={selected[item] ? selected[item] : false}
                      onChange={handleChangeAccessTo}
                    />
                  }
                  label={
                    <div key={index}>
                      <div className="d-inline-flex align-items-center">
                        <div className={styles.textOverflow}>
                          {getNameDepartment(item)}
                        </div>
                      </div>
                    </div>
                  }
                />
              );
            })}
          </FormGroup>
        </FormControl>
      </Popover>
    </>
  );
};
const AddNewDepartment = ({
  type,
  data,
  paginationParams,
  isLockedFunction,
}) => {
  const StyleChip = withStyles({
    root: {
      backgroundColor: data?.locked ? BR_COLOR_CHIP_DISABLE : BR_COLOR_CHIP,
      color: data?.locked ? COLOR_CHIP_DISABLE : COLOR_CHIP,
      maxWidth: "100%",
      fontSize: toRem(14),
    },
  })(Chip);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(fetchDepartmentListAll());
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const { departmentListAll, validateDepartmentName } = useSelector(
    (state) => state.settings
  );

  const [typeValidateDepartmentName, setTypeValidateDepartmentName] = useState(
    false
  );
  React.useEffect(() => {
    if (typeValidateDepartmentName !== validateDepartmentName) {
      setTypeValidateDepartmentName(validateDepartmentName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validateDepartmentName]);
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const openDialog = () => {
    setOpen(!open);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onPressClose = () => {
    onClose();
  };
  const onSubmitData = (values, { setErrors }) => {
    setErrors({});
    const dataSubmit = {
      name: values.departmentName,
      locked: values.locked,
      accesses: values.accessTo,
    };
    if (type === "EDIT") {
      dispatch(
        UPDATE_DEPARTMENT({
          body: dataSubmit,
          id: data.id,
          params: paginationParams,
        })
      )
        .then(() => {
          dispatch(
            fetchDepartmentList({
              params: {
                page: 0,
                size: paginationParams?.size,
              },
            })
          );
          dispatch(fetchDepartmentListAll());
          onClose();
        })
        .catch((err) => {
          setErrors({
            departmentName: intl.formatMessage({
              id: "setting.departmentNameExists",
            }),
          });
        });
    } else {
      dispatch(ADD_DEPARTMENT(dataSubmit))
        .then(() => {
          dispatch(
            fetchDepartmentList({
              params: {
                page: 0,
                size: paginationParams?.size,
              },
            })
          );
          dispatch(fetchDepartmentListAll());
          onClose();
        })
        .catch((err) => {
          // console.log("err", JSON.parse(JSON.stringify(err)));
          setErrors({
            departmentName: intl.formatMessage({
              id: "setting.departmentNameExists",
            }),
          });
        });
    }
  };

  const validationSchema = Yup.object().shape({
    departmentName: Yup.string()
      .required(<IntlMessages id="setting.form.DepartmentName" />)
      .max(
        50,
        <IntlMessages
          id="appModule.form.error.fieldLessThan"
          values={{
            FIELD: (
              <IntlMessages id="setting.department.table.departmentName" />
            ),
            LENGTH_CHAR: 50,
          }}
        />
      ),
    // .matches(/^[a-zA-Z0-9-,/_() ]+$/g, {
    //   message: (
    //     <IntlMessages id="setting.departmentExcludeSpecialCharacter" />
    //   ),
    //   excludeEmptyString: true,
    // }),
  });

  const getNameDepartment = (id) => {
    const department = find(departmentListAll, function (o) {
      return o.id === Number(id);
    });

    return department?.name;
  };
  return (
    <>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={onPressClose}
        // fullWidth
        maxWidth={"sm"}
        aria-labelledby="form-dialog-title"
        title={{
          text: (
            <Typography variant="titleForm">
              {type === "ADD" ? (
                <IntlMessages id={"setting.addNewDepartment"} />
              ) : (
                data?.name
              )}
            </Typography>
          ),
        }}
        allowCloseOnTitle={true}
        disableDialogAction
      >
        <Formik
          initialValues={{
            departmentName: data?.name || "",
            accessTo: data?.departmentAccesses
              ? map(data?.departmentAccesses, function square(n) {
                  return n.id;
                })
              : [],
            locked: data?.locked || false,
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmitData}
          validateOnBlur={false}
          validateOnChange={true}
        >
          {({ values, submitForm, setFieldValue }) => {
            return (
              <Form className="d-flex flex-column">
                <div>
                  <div className={styles.container}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <div>
                          {" "}
                          <Typography variant={"smallDefault"}>
                            <IntlMessages id="setting.department.table.departmentName" />
                            <span style={{ color: "red" }}> *</span>
                          </Typography>
                        </div>

                        <TextField
                          className="mt-2"
                          disabled={data?.locked ? true : false}
                          fullWidth
                          formik
                          name={"departmentName"}
                          variant={"outlined"}
                          placeholder={intl.formatMessage({
                            id: "setting.TypeTheDepartmentNameHere",
                          })}
                          InputLabelProps={{ required: true, shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant={"smallDefault"}>
                          <IntlMessages id="setting.AccessToOtherDepartments" />
                        </Typography>
                        <AccessTo
                          dataDeptCurrent={data}
                          locked={data?.locked ? true : false}
                          departmentListAll={departmentListAll}
                        />
                        <div className="mt-2">
                          {values.accessTo.map((item, index) => {
                            return (
                              <span key={index}>
                                <StyleChip
                                  key={1}
                                  className={styles.paddingChip}
                                  size={"medium"}
                                  deleteIcon={
                                    <div className={styles.chipDelete}>
                                      <ChipDeleteIcon />
                                    </div>
                                  }
                                  label={<>{item && getNameDepartment(item)}</>}
                                  onDelete={
                                    data?.locked
                                      ? false
                                      : () =>
                                          setFieldValue(
                                            "accessTo",
                                            filter(
                                              values.accessTo,
                                              function (o) {
                                                return o !== item;
                                              }
                                            )
                                          )
                                  }
                                />
                              </span>
                            );
                          })}
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <span>
                          <IntlMessages id="setting.lockDepartment" />
                        </span>
                        <span className="ml-1">
                          <Tooltip
                            arrow
                            title={
                              <div className="custom-tooltip">
                                <h5>
                                  <IntlMessages id="setting.lockDepartment" />
                                </h5>
                                <p>
                                  <FormattedHTMLMessage id="setting.lockDepartment.tooltip" />
                                </p>
                              </div>
                            }
                          >
                            <QuestionMarkIcon />
                          </Tooltip>
                        </span>
                        <span>
                          <Switch
                            disabled={
                              type === "EDIT" && !isLockedFunction
                                ? true
                                : false
                            }
                            checked={values.locked}
                            onChange={(e) =>
                              setFieldValue("locked", e.target.checked)
                            }
                            name="enableReScreening"
                            inputProps={{
                              "aria-label": "secondary checkbox",
                            }}
                          />
                        </span>
                      </Grid>
                    </Grid>
                  </div>
                </div>
                <DialogActions className="float-right">
                  <Button
                    variant="outlinedSecondary"
                    onClick={onPressClose}
                    //className={styles.btnDialogActionWidth}
                  >
                    <IntlMessages id="appModule.requestForm.cancel" />
                  </Button>
                  {type === "ADD" ? (
                    <Button
                      disabled={!values.departmentName}
                      variant="contained"
                      color="primary"
                      //  className={styles.btnDialogActionWidth}
                      onClick={submitForm}
                    >
                      <IntlMessages id="setting.dialog.add" />
                    </Button>
                  ) : (
                    <Button
                      disabled={
                        !values.departmentName ||
                        (values.departmentName === data?.name &&
                          values.locked === data?.locked &&
                          JSON.stringify(values?.accessTo) ===
                            JSON.stringify(data?.accesses))
                      }
                      variant="contained"
                      color="primary"
                      //     className={styles.btnDialogActionWidth}
                      onClick={submitForm}
                    >
                      <IntlMessages id="setting.dialog.save" />
                    </Button>
                  )}
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      </Dialog>
      {type === "ADD" ? (
        <Button
          // className={styles.paddingButtonAddNewDepartment}
          variant={"contained"}
          color="primary"
          size={"small"}
          onClick={openDialog}
          startIcon={<SvgIcon viewBox={"0 0 20 20"} component={PlusIcon} />}
        >
          <IntlMessages id="setting.department.addNewDepartment" />
        </Button>
      ) : (
        <Tooltip
          arrow
          title={
            <div className={"d-flex flex-column"}>
              <IntlMessages id="Edit" />
            </div>
          }
          enterDelay={300}
        >
          <span
            className={clsx(
              !isLockedFunction && data.locked
                ? styles.addButtonDisable
                : !isLockedFunction && !data.locked
                ? styles.addButtonDisableCanlocked
                : styles.addButton,
              "mr-2"
            )}
            style={{ cursor: "pointer" }}
            onClick={!data.locked || isLockedFunction ? openDialog : null}
          >
            <Edit size={toRem(24)} />
          </span>
        </Tooltip>
      )}
    </>
  );
};

export default compose(withPagination)(AddNewDepartment);
