import { Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
//@ts-ignore
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
import clsx from "clsx";
import { Form, Formik } from "formik";
import React from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
//@ts-ignore
import styles from "./ACLPage.module.scss";
import ACLDropdown from "./components/ACLDropdown";
import CustomCheckbox from "./components/CustomCheckbox";
import CustomTooltip from "./components/CustomTooltip";

export interface FilterForm {
  description: string;
  role_name: string;
}

const useStyles = makeStyles({
  dialog: {
    "& .MuiPaper-root": {
      width: toRem(424),
    },
    "& .MuiCloseableDialogTitle-root": {
      paddingTop: toRem(14),
      paddingBottom: toRem(14),
    },
  },
  content: {
    color: "#2b2b2b",
    paddingTop: toRem(40),
    "& p": {
      lineHeight: toRem(26),
    },
  },
});

const useInputStyles = makeStyles((theme) => ({
  fieldWrap: {
    "& .MuiFormLabel-root": {
      marginBottom: toRem(8),
      fontSize: toRem(12),
      lineHeight: toRem(20),
      color: "rgba(43, 43, 43, 0.7)",
    },
  },
  fieldInput: {
    fontSize: toRem(17),
    lineHeight: toRem(22),
    background: "   ",
    padding: `0 ${toRem(14)}`,
    border: "1px solid #E6E6E6",
    height: toRem(52),
    borderRadius: "5px",
    width: "100%",
    outline: 0,
    "&:focus": {
      border: "1px solid #0080FF !important",
    },
    "&:disabled": {
      background: "#F5F5F5",
      "& fieldset": {
        borderColor: "#E6E6E6",
      },
    },
    "& .MuiInputBase-formControl": {
      "&.Mui-focused fieldset": {
        borderColor: "#0080FF !important",
      },
      "&.Mui-disabled": {
        background: "#F5F5F5",
        "& fieldset": {
          borderColor: "#E6E6E6",
        },
      },
    },
    "& input": {
      fontSize: toRem(17),
      lineHeight: toRem(22),
      background: "transparent",
      color: "#2B2B2B",
      padding: `0 ${toRem(14)}`,
    },
    "& fieldset": {
      border: "1.5px solid #E6E6E6",
      borderRadius: "5px",
    },
  },
  fieldInputErr: {
    border: "1.5px solid red",
  },
  required: {
    color: "#EA2134",
  },
}));

const TableAccess = function TableAccessTable(props) {
  const { data: dataProps, editable, onSubmit, onCancel, onChange } = props;
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const dialogClasses = useStyles();
  const classes = useInputStyles();
  const [data, setData] = React.useState(null);
  const inputRef = React.useRef(null);
  const inputDescRef = React.useRef(null);
  const [currentItem, setCurrentItem] = React.useState(null);
  const [descriptionError, setDescriptionError] = React.useState(null);
  const [roleNameError, setRoleNameError] = React.useState(null);
  const intl = useIntl();
  const onclickRoleName = () => {
    setRoleNameError(false);
  };
  const onclickDescription = () => {
    setDescriptionError(false);
  };
  React.useEffect(() => {
    setData(dataProps);
  }, [dataProps]);

  React.useEffect(() => {
    onChange();
  }, [data]);

  const updateRole = (item) => {
    if (editable) {
      let updatedData = data?.permissions?.map((v) => {
        if (v?.id === item?.id) {
          return item;
        } else if (v?.children.length) {
          let temp = v.children.map((x) =>
            x.id === item.id ? { ...item } : x
          );
          return { ...v, children: temp };
        }
        return v;
      });
      setData({ ...data, permissions: updatedData || [] });
    }

    onChange();
  };

  const ACLRow = ({ item, isChild, disabled = false }) => {
    return (
      <>
        <Grid
          container
          className={clsx(
            styles.TableRow,
            isChild ? styles.tableChildRow : styles.tableModuleRow,
            item.function === "DEPARTMENT_MODULE" && "mb-2"
          )}
          style={{
            marginBottom: item.children?.length > 0 && toRem(-8),
          }}
        >
          <Grid
            className={clsx([styles.tableTd, styles.tableCell])}
            item
            xs={3}
          >
            <CustomTooltip
              arrow
              title={<div className="custom-tooltip">{item.name}</div>}
            >
              <Typography variant="Subtitle4">{item.name}</Typography>
            </CustomTooltip>
          </Grid>
          <Grid
            className={clsx([styles.tableTd, styles.tableCell])}
            item
            xs={3}
          >
            {item?.dataAccessPermission ? (
              <div className={"d-flex"}>
                <ACLDropdown
                  handleChange={(item) => {
                    updateRole(item);
                  }}
                  disabled={disabled || !editable}
                  item={item}
                  viewMode={item?.dataAccessPermission}
                  isRelatedView={item?.canViewRelated ? true : false}
                />
                <div className={"d-flex align-items-center pl-2"}>
                  {item?.function === "STAFF_MODULE" && (
                    <CustomTooltip
                      arrow
                      title={
                        <div className="custom-tooltip">
                          <FormattedHTMLMessage id="setting.ACL.popup.staff.module" />
                        </div>
                      }
                    >
                      <QuestionMarkIcon />
                    </CustomTooltip>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <CustomCheckbox
                  name={`${item.function}.canView`}
                  checked={item.canView ? true : false}
                  type={"checkbox"}
                  className={clsx({ [styles.blockedField]: !editable })}
                  onChange={(e) => {
                    if (item.canView === null) return false;
                    if (!disabled && editable) {
                      if (!isChild) {
                        setCurrentItem({ ...item, canView: e.target.checked });
                        setOpenConfirm(true);
                      } else {
                        updateRole({ ...item, canView: e.target.checked });
                      }
                    }
                  }}
                  disabled={disabled}
                  indeterminate={item.canView === null ? true : false}
                />
              </div>
            )}
          </Grid>
          <Grid
            className={clsx([styles.tableTd, styles.tableCell])}
            item
            xs={2}
          >
            <CustomCheckbox
              name={`${item.function}.canCreate`}
              checked={item.canCreate ? true : false}
              type={"checkbox"}
              className={clsx({ [styles.blockedField]: !editable })}
              disabled={disabled || item.canView === false}
              onChange={(e) => {
                item.canCreate !== null &&
                  !disabled &&
                  editable &&
                  updateRole({ ...item, canCreate: e.target.checked });
              }}
              indeterminate={item.canCreate === null ? true : false}
            />
          </Grid>
          <Grid
            className={clsx([styles.tableTd, styles.tableCell])}
            item
            xs={2}
          >
            <CustomCheckbox
              name={`${item.function}.canEdit`}
              checked={item.canEdit ? true : false}
              type={"checkbox"}
              className={clsx({ [styles.blockedField]: !editable })}
              onChange={(e) => {
                item.canEdit !== null &&
                  !disabled &&
                  editable &&
                  updateRole({ ...item, canEdit: e.target.checked });
              }}
              indeterminate={item.canEdit === null ? true : false}
              disabled={disabled || item.canView === false}
            />
          </Grid>
          <Grid
            className={clsx([styles.tableTd, styles.tableCell])}
            item
            xs={2}
          >
            <CustomCheckbox
              name={`${item.function}.canDelete`}
              checked={item.canDelete ? true : false}
              type={"checkbox"}
              className={clsx({ [styles.blockedField]: !editable })}
              onChange={(e) => {
                item.canDelete !== null &&
                  !disabled &&
                  editable &&
                  updateRole({ ...item, canDelete: e.target.checked });
              }}
              disabled={disabled || item.canView === false}
              indeterminate={item.canDelete === null ? true : false}
            />
          </Grid>
        </Grid>
      </>
    );
  };

//   //CONFLICT_NEED_TO_CHECK_AGAIN
//   const renderLabel = (item) => {
//       if (item.function === "MY_KYC" || item.function === "DJ_MY_KYC") {
//         return (
//           <Grid container className={clsx(styles.TableRow, styles.tableChildRow)}>
//             <Grid className={styles.tableTd} item xs={12}>
//               {item.function === "MY_KYC" && (
//                 <span className={styles.tableLabelRow}>
//                   <IntlMessages id={"kyc.acuris"} />
//                 </span>
//               )}
//               {item.function === "DJ_MY_KYC" && (
//                 <span className={styles.tableLabelRow}>
//                   <IntlMessages id={"kyc.dowjone"} />
//                 </span>
//               )}
//             </Grid>
//           </Grid>
//         );
//       }
//       return;
//     };
//
//     const ACLRow = ({ item, isChild, disabled = false }) => {
//       return (
//         <>
//           {isChild && renderLabel(item)}
//           <Grid
//             container
//             className={clsx(styles.TableRow, isChild ? styles.tableChildRow : "")}
//           >
//             <Grid
//               className={clsx([styles.tableTd, styles.tableCell])}
//               item
//               xs={3}
//             >
//               <CustomTooltip
//                 arrow
//                 title={<div className="custom-tooltip">{item.name}</div>}
//               >
//                 <span className="label">{item.name}</span>
//               </CustomTooltip>
//             </Grid>
//
//             <Grid
//               className={clsx([styles.tableTd, styles.tableCell])}
//               item
//               xs={3}
//             >
//               {item?.dataAccessPermission ? (
//                 <div className={"d-flex"}>
//                   <ACLDropdown
//                     handleChange={(item) => {
//                       updateRole(item);
//                     }}
//                     disabled={disabled || !editable}
//                     item={item}
//                     viewMode={item?.dataAccessPermission}
//                     isRelatedView={item?.canViewRelated ? true : false}
//                   />
//                   <div className={"d-flex align-items-center pl-2"}>
//                     {item?.function === "STAFF_MODULE" && (
//                       <CustomTooltip
//                         arrow
//                         title={
//                           <div className="custom-tooltip">
//                             <FormattedHTMLMessage id="setting.ACL.popup.staff.module" />
//                           </div>
//                         }
//                       >
//                         <QuestionMarkIcon />
//                       </CustomTooltip>
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 <CustomCheckbox
//                   name={`${item.function}.canView`}
//                   checked={item.canView ? true : false}
//                   type={"checkbox"}
//                   className={clsx({ [styles.blockedField]: !editable })}
//                   onChange={(e) => {
//                     if (item.canView === null) return false;
//                     if (!disabled && editable) {
//                       if (!isChild) {
//                         setCurrentItem({ ...item, canView: e.target.checked });
//                         setOpenConfirm(true);
//                       } else {
//                         updateRole({ ...item, canView: e.target.checked });
//                       }
//                     }
//                   }}
//                   disabled={disabled}
//                   indeterminate={item.canView === null ? true : false}
//                 />
//               )}
//             </Grid>
//             <Grid
//               className={clsx([styles.tableTd, styles.tableCell])}
//               item
//               xs={2}
//             >
//               <CustomCheckbox
//                 name={`${item.function}.canCreate`}
//                 checked={item.canCreate ? true : false}
//                 type={"checkbox"}
//                 className={clsx({ [styles.blockedField]: !editable })}
//                 disabled={disabled || item.canView === false}
//                 onChange={(e) => {
//                   item.canCreate !== null &&
//                     !disabled &&
//                     editable &&
//                     updateRole({ ...item, canCreate: e.target.checked });
//                 }}
//                 indeterminate={item.canCreate === null ? true : false}
//               />
//             </Grid>
//             <Grid
//               className={clsx([styles.tableTd, styles.tableCell])}
//               item
//               xs={2}
//             >
//               <CustomCheckbox
//                 name={`${item.function}.canEdit`}
//                 checked={item.canEdit ? true : false}
//                 type={"checkbox"}
//                 className={clsx({ [styles.blockedField]: !editable })}
//                 onChange={(e) => {
//                   item.canEdit !== null &&
//                     !disabled &&
//                     editable &&
//                     updateRole({ ...item, canEdit: e.target.checked });
//                 }}
//                 indeterminate={item.canEdit === null ? true : false}
//                 disabled={disabled || item.canView === false}
//               />
//             </Grid>
//             <Grid
//               className={clsx([styles.tableTd, styles.tableCell])}
//               item
//               xs={2}
//             >
//               <CustomCheckbox
//                 name={`${item.function}.canDelete`}
//                 checked={item.canDelete ? true : false}
//                 type={"checkbox"}
//                 className={clsx({ [styles.blockedField]: !editable })}
//                 onChange={(e) => {
//                   item.canDelete !== null &&
//                     !disabled &&
//                     editable &&
//                     updateRole({ ...item, canDelete: e.target.checked });
//                 }}
//                 disabled={disabled || item.canView === false}
//                 indeterminate={item.canDelete === null ? true : false}
//               />
//             </Grid>
//           </Grid>
//         </>
//       );
//     };

  const checkValidateForm = () => {
    let result = true;
    if (inputRef.current?.values?.description.length > 150) {
      setDescriptionError(true);
      result = false;
    }
    if (!inputRef.current?.values?.displayName.length) {
      setRoleNameError(true);
      result = false;
    }
    return result;
  };
  const onSubmitForm = (value) => {
    if (checkValidateForm() === true) {
      onSubmit({
        ...data,
        displayName: value?.displayName,
        description: value?.description,
      });
    }
  };
  return (
    <>
      <Formik
        initialValues={{
          displayName: data?.displayName,
          description: data?.description,
        }}
        onSubmit={onSubmitForm}
        enableReinitialize={true}
        innerRef={inputRef}
      >
        {({ errors, values, submitForm }) => {
          return (
            <Form>
              <div className={styles.Form}>
                <div className={styles.InputWrap}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <div>
                        <div className="search-bar  bg-transparent">
                          <div className="form-group">
                            <TextField
                              fullWidth
                              formik
                              name={"displayName"}
                              label={
                                <span>
                                  <IntlMessages id="setting.ACL.roleName" />
                                  <span className={classes.required}> *</span>
                                </span>
                              }
                              disabled={!editable}
                              onClick={onclickRoleName}
                              className={clsx(classes.fieldInput)}
                              error={roleNameError}
                            />
                            {roleNameError && (
                              <Typography>
                                <span className={styles.ACLInputTextErr}>
                                  <IntlMessages id="setting.ACL.validateRoleNameRequire" />
                                </span>
                              </Typography>
                            )}
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div>
                        <div className="search-bar  bg-transparent">
                          <div className="form-group">
                            <TextField
                              formik
                              name={"description"}
                              fullWidth
                              label={
                                <span>
                                  <IntlMessages id="setting.ACL.description" />
                                </span>
                              }
                              onClick={onclickDescription}
                              disabled={!editable}
                              className={clsx(classes.fieldInput)}
                              error={descriptionError}
                            />
                            {descriptionError && (
                              <Typography>
                                <span className={styles.ACLInputTextErr}>
                                  <IntlMessages id="setting.ACL.validateDescriptionUpto150" />
                                </span>
                              </Typography>
                            )}
                          </div>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </div>
                {data?.permissions?.length > 0 && (
                  <div
                    className={clsx(styles.TableAccess, {
                      [styles.tableAccessView]: !editable,
                    })}
                  >
                    <Grid container className={clsx(styles.TableHead)}>
                      <Grid
                        className={clsx([styles.tableTh, styles.tableCell])}
                        item
                        xs={3}
                      >
                        <IntlMessages id="setting.ACL.functionModule" />
                      </Grid>
                      <Grid
                        className={clsx([styles.tableTh, styles.tableCell])}
                        item
                        xs={3}
                      >
                        <CustomTooltip
                          arrow
                          title={
                            <div className="custom-tooltip">
                              <IntlMessages id="setting.ACL.tooltip.accessView" />
                            </div>
                          }
                        >
                          <span className="label">
                            <IntlMessages id="setting.ACL.pe.view" />
                          </span>
                        </CustomTooltip>
                      </Grid>
                      <Grid
                        className={clsx([styles.tableTh, styles.tableCell])}
                        item
                        xs={2}
                      >
                        <CustomTooltip
                          arrow
                          title={
                            <div className="custom-tooltip">
                              <IntlMessages id="setting.ACL.tooltip.permission" />
                            </div>
                          }
                        >
                          <span className="label">
                            <IntlMessages id="setting.ACL.pe.create" />
                          </span>
                        </CustomTooltip>
                      </Grid>
                      <Grid
                        className={clsx([styles.tableTh, styles.tableCell])}
                        item
                        xs={2}
                      >
                        <CustomTooltip
                          arrow
                          title={
                            <div className="custom-tooltip">
                              <IntlMessages id="setting.ACL.tooltip.permission" />
                            </div>
                          }
                        >
                          <span className="label">
                            <IntlMessages id="setting.ACL.pe.edit" />
                          </span>
                        </CustomTooltip>
                      </Grid>
                      <Grid
                        className={clsx([styles.tableTh, styles.tableCell])}
                        item
                        xs={2}
                      >
                        <CustomTooltip
                          arrow
                          title={
                            <div className="custom-tooltip">
                              <IntlMessages id="setting.ACL.tooltip.permission" />
                            </div>
                          }
                        >
                          <span className="label">
                            <IntlMessages id="setting.ACL.pe.delete" />
                          </span>
                        </CustomTooltip>
                      </Grid>
                    </Grid>
                    {data?.permissions.map((item, index) => {
                      return (
                        <React.Fragment key={`mdl.${item.id + index}`}>
                          <ACLRow
                            key={item.id + index}
                            item={item}
                            isChild={false}
                          />
                          {item?.children?.map((child, index) => {
                            return (
                              <ACLRow
                                key={child.id + index}
                                disabled={item?.canView ? false : true}
                                item={child}
                                isChild={true}
                              />
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}

                {editable && (
                  <div
                    className={clsx([
                      "d-flex justify-content-end",
                      styles.Controls,
                    ])}
                  >
                    <Button
                      variant="outlinedSecondary"
                      type="button"
                      onClick={() => {
                        onCancel();
                      }}
                      className="mr-3"
                    >
                      <IntlMessages id="cancel" />
                    </Button>
                    <Button
                      variant="contained"
                      type="button"
                      onClick={() => {
                        submitForm();
                      }}
                    >
                      <IntlMessages id="save" />
                    </Button>
                  </div>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>

      <Dialog
        open={openConfirm}
        allowCloseOnTitle
        onClose={() => {
          setOpenConfirm(false);
        }}
        title={{
          text: (
            <Typography variant="title">
              <IntlMessages id="setting.ACL.popup.changeStatus" />
            </Typography>
          ),
        }}
        actionsCustom={
          <div style={{ width: "100%" }}>
            <div className="d-flex justify-content-center">
              <Button
                variant="contained"
                style={{
                  marginRight: toRem(8),
                }}
                onClick={() => {
                  setOpenConfirm(false);
                  updateRole(currentItem);
                  setCurrentItem(null);
                }}
              >
                <IntlMessages id="confirm" />
              </Button>
              <Button
                variant="outlinedSecondary"
                style={{
                  marginLeft: toRem(8),
                }}
                onClick={() => {
                  setOpenConfirm(false);
                  setCurrentItem(null);
                }}
              >
                <IntlMessages id="Cancel" />
              </Button>
            </div>
          </div>
        }
      >
        <div className={clsx("text-center")}>
          <p className="mb-2">
            {currentItem?.canView ? (
              <IntlMessages
                id="setting.ACL.popup.confirmDisplayAppear"
                values={{ module: <b>{currentItem?.name || ""}</b> }}
              />
            ) : (
              <IntlMessages
                id="setting.ACL.popup.confirmHideModule"
                values={{ module: <b>{currentItem?.name || ""}</b> }}
              />
            )}
          </p>
          <p className="mb-0">
            <IntlMessages id="setting.ACL.popup.confirmModifySystem" />
          </p>
        </div>
        {/* <div
          style={{ backgroundColor: "green" }}
          className="d-flex justify-content-end align-items-center"
        >
          <Button
            // className={clsx(dialogClasses.button)}
            variant="contained"
            style={{
              marginRight: toRem(8),
            }}
            onClick={() => {
              setOpenConfirm(false);
              updateRole(currentItem);
              setCurrentItem(null);
            }}
          >
            <IntlMessages id="confirm" />
          </Button>
          <Button
            variant="outlinedSecondary"
            style={{
              marginLeft: toRem(8),
            }}
            onClick={() => {
              setOpenConfirm(false);
              setCurrentItem(null);
            }}
          >
            <IntlMessages id="Cancel" />
          </Button>
        </div> */}
      </Dialog>
    </>
  );
};

export default TableAccess;
