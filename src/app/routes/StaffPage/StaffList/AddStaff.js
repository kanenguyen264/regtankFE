import MenuItem from "@material-ui/core/MenuItem";
import {
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormLabel,
  TextField as MuiTextField
} from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import CustomScrollbar from "@protego/sdk/RegtankUI/v1/Scrollbar";
import Select from "@protego/sdk/RegtankUI/v1/Select";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import CloseableDialogTitle from "@protego/sdk/UI/CloseableDialogTitle/CloseableDialogTitle";
import { getDepartmentListByUserId } from "actions/Setting.js";
import { Field, Form, Formik } from "formik";
import { orderBy } from "lodash";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { createArrayUserRoles } from "../../../../util/aclRoles";
import { createObjectDepartment } from "../../../../util/department";
import { validationSchema } from "./Formik";
import styles from "./style.module.scss";

function AddNewStaff({ open, onPress, onPressSubmit }) {
  const { ACLList } = useSelector((state) => state.settingACL);
  const userCurrent = useSelector(({ me }) => me.me);
  const dispatch = useDispatch();
  const { departmentListByCurrentUser } = useSelector(
    (state) => state.settings
  );
  const intl = useIntl();
  const onSubmitData = async (values) => {
    let objStaff = {
      email: values.email,
      roles: createArrayUserRoles(values.roles),
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      colorCode: null,
      address: null,
      bio: null,
      department: createObjectDepartment(values.department),
    };
    onPressSubmit(objStaff);
  };
  useEffect(() => {
    if (open && userCurrent && userCurrent?.id) {
      dispatch(getDepartmentListByUserId(userCurrent?.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCurrent, open]);
  return (
    <>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={onPress}
        fullWidth
        maxWidth="md"
        aria-labelledby="form-dialog-title"
        className={styles.addStaffDialog}
      >
        <CloseableDialogTitle onClose={onPress}>
          <IntlMessages id="staff.addnew.title" />
        </CloseableDialogTitle>
        <Formik
          // validateOnChange={false}
          // validateOnBlur={false}
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            roles: -1,
            department: -1,
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmitData}
        >
          {({ submitForm, errors, isValid, dirty, values, touched }) => {
            return (
              <Form>
                <DialogContent id="DialogContent">
                  <CustomScrollbar
                    autoHeightMax={toRem(500)}
                    classes={{
                      vCustomScrollBarTrack: styles.vScrollbar,
                      vCustomScrollBarThumb: styles.vScrollbarThumb,
                    }}
                  >
                    <div className={styles.fieldsWrap}>
                      <FormControl
                        className={styles.field}
                        component="fieldset"
                      >
                        <FormLabel component="legend">
                          <IntlMessages id="staff.addnew.firstname" />{" "}
                          <span className={styles.required}> *</span>
                        </FormLabel>
                        <Field
                          as={MuiTextField}
                          fullWidth
                          name="firstName"
                          variant="outlined"
                          shrink={"true"}
                          placeholder={"Michael"}
                          error={touched?.firstName && errors?.firstName ? true : false}
                          helperText={!touched?.firstName || errors?.firstName}
                        />
                      </FormControl>
                      <FormControl
                        className={styles.field}
                        component="fieldset"
                      >
                        <FormLabel component="legend">
                          <IntlMessages id="staff.addnew.lastname" />
                        </FormLabel>
                        <Field
                          as={MuiTextField}
                          fullWidth
                          name={"lastName"}
                          variant="outlined"
                          shrink={"true"}
                          placeholder={"Scott"}
                          error={errors?.lastName ? true : false}
                          helperText={errors?.lastName}
                        />
                      </FormControl>
                      <FormControl
                        className={styles.field}
                        component="fieldset"
                      >
                        <FormLabel component="legend">
                          <IntlMessages id="customer.addnew.phone" />
                        </FormLabel>
                        <Field
                          as={MuiTextField}
                          fullWidth
                          name={"phone"}
                          variant="outlined"
                          shrink={"true"}
                          placeholder={intl.formatMessage({
                            id: "staff.placeholder.phone",
                          })}
                          error={errors?.phone ? true : false}
                          helperText={errors?.phone}
                        />
                      </FormControl>
                      <FormControl
                        className={styles.field}
                        component="fieldset"
                      >
                        <FormLabel component="legend">
                          <IntlMessages id="customer.contact.email" />{" "}
                          <span className={styles.required}>*</span>
                        </FormLabel>
                        <Field
                          as={MuiTextField}
                          fullWidth
                          name={"email"}
                          formik
                          variant="outlined"
                          shrink={"true"}
                          placeholder={"email@example.com"}
                          error={touched?.email && errors?.email ? true : false}
                          helperText={!touched?.email || errors?.email}
                        />
                      </FormControl>

                      <FormControl
                        className={styles.field}
                        component="fieldset"
                      >
                        <FormLabel component="legend">
                          <IntlMessages id="staff.userRole" />
                          <span className={styles.required}> *</span>
                        </FormLabel>
                        <Select
                          name={"roles"}
                          formik
                          size={"large"}
                          style={{ margin: 0 }}
                          withFormControlProps={{ fullWidth: true }}
                          classes={{ menuPaper: styles.selectPaper }}
                          error={touched?.roles && errors?.roles ? true : false}
                          displayEmpty
                          renderValue={
                            values?.roles !== -1
                              ? undefined
                              : () => (
                                  <div className={styles.selectPlaceholder}>
                                    <IntlMessages id="staff.placeholder.userRole" />
                                  </div>
                                )
                          }
                        >
                          {orderBy(ACLList, ["displayName"], ["asc"])?.map(
                            (n) => (
                              <MenuItem key={n.id} value={n.id}>
                                {n.displayName}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </FormControl>
                      <FormControl
                        className={styles.field}
                        component="fieldset"
                      >
                        <FormLabel component="legend">
                          <IntlMessages id="staff.department" />
                          <span className={styles.required}> *</span>
                        </FormLabel>
                        <Select
                          name={"department"}
                          formik
                          displayEmpty
                          size={"large"}
                          style={{ margin: 0 }}
                          withFormControlProps={{ fullWidth: true }}
                          classes={{ menuPaper: styles.selectPaper }}
                          error={touched?.department && errors?.department ? true : false}
                          renderValue={
                            values?.department !== -1
                              ? undefined
                              : () => (
                                  <div className={styles.selectPlaceholder}>
                                    <IntlMessages id="staff.placeholder.department" />
                                  </div>
                                )
                          }
                        >
                          {departmentListByCurrentUser.map((n) => (
                            <MenuItem key={n.id} value={n.id}>
                              {n.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </CustomScrollbar>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={onPress}
                    variant="containedWhite"
                    style={{
                      marginRight: toRem(10),
                      backgroundColor: ThemeColors.white,
                    }}
                  >
                    <IntlMessages id="customer.dialog.cancel" />
                  </Button>
                  <Button
                    onClick={submitForm}
                    variant="contained"
                    color="primary"
                    disabled={!(dirty && isValid)}
                  >
                    <IntlMessages id="customer.dialog.save" />
                  </Button>
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      </Dialog>
    </>
  );
}
export default AddNewStaff;
