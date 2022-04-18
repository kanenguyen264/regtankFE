import {
  Avatar,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  MenuItem,
  Typography
} from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import usePrompt from "@protego/sdk/RegtankUI/v1/PromptDialog/PromptDialog";
import Select from "@protego/sdk/RegtankUI/v1/Select/Select";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import Link from "@protego/sdk/UI/Link";
import { typeEmail } from "@protego/sdk/utils/regularExpression";
import { fetchMe } from "actions/me";
import { getDepartmentListByUserId } from "actions/Setting.js";
import { SETTING_ACL_GET_ALL } from "actions/SettingACLAction";
import { EDIT_STAFF, hideMessage, STAFF_DETAIL } from "actions/Staff";
import { BackIcon } from "assets/icons";
import clsx from "clsx";
import { VIEW } from "constants/ActionTypes";
import { ROLE_TYPE_ADMIN } from "constants/Role";
import { Formik } from "formik";
import { findIndex, orderBy } from "lodash";
import React, { useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { compose } from "recompose";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { snackActions } from "util/snackbarUtils";
import { getFirstString } from "util/string";
import * as Yup from "yup";
import { withACL } from "../../../../acl";
import { getContentMessage } from "../../../../util";
import { checkRoleUser, createArrayUserRoles } from "../../../../util/aclRoles";
import { createObjectDepartment } from "../../../../util/department";
import styles from "./style.module.scss";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";

const columnColor = [
  { id: 1, color: "#E89806" },
  { id: 2, color: "#FEBE2D" },
  { id: 3, color: "#FFD36B" },
  { id: 4, color: "#C23636" },
  { id: 5, color: "#D44333" },
  { id: 6, color: "#FF604F" },
  { id: 7, color: "#1D934A" },
  { id: 8, color: "#21A453" },
  { id: 9, color: "#56D687" },
  { id: 10, color: "#0080FF" },
  { id: 11, color: "#0C88FF" },
  { id: 12, color: "#43A4FF" },
  { id: 13, color: "#232323" },
  { id: 14, color: "#606E7B" },
  { id: 15, color: "#95A1AC" },
];

const StaffDetail = function StaffDetail({ match, ACL }) {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [staffProfile, setStaffProfile] = useState("");
  const [openDisable, setOpenDisable] = useState(false);
  const [
    currentEnabledTwoFactorAuth,
    setCurrentEnabledTwoFactorAuth,
  ] = useState();
  const userCurrent = useSelector(({ me }) => me.me);
  const { departmentListByCurrentUser } = useSelector(
    (state) => state.settings
  );
  const [showDepartmentList, setShowDepartmentList] = useState([]);
  const { type } = location.state ? location.state : { type: "" };
  const intl = useIntl();

  const { detail } = useSelector(({ staff }) => staff, shallowEqual);
  useEffect(() => {
    if (userCurrent && userCurrent?.id) {
      dispatch(getDepartmentListByUserId(userCurrent?.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCurrent]);
  useEffect(() => {
    if (staffProfile && staffProfile?.department) {
      const findIndexDepartment = findIndex(departmentListByCurrentUser, [
        "id",
        staffProfile?.department?.id,
      ]);
      if (findIndexDepartment > -1) {
        setShowDepartmentList(departmentListByCurrentUser);
      } else {
        const list = orderBy(
          [staffProfile.department, ...departmentListByCurrentUser],
          ["name"],
          ["asc"]
        );
        setShowDepartmentList(list);
      }
    }
  }, [departmentListByCurrentUser, staffProfile]);

  const { me } = useSelector((state) => state.me, shallowEqual);
  const [itemColorSelected, setItemColorSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [changeColor, setChangeColor] = useState("");
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [avatarColor, setAvatarColor] = useState({
    r: "0",
    g: "9",
    b: "153",
    a: "1",
  });
  const [listRoles, setListRoles] = useState([]);
  const deletePrompt = usePrompt({
    title: intl.formatMessage({ id: "audit.notification" }),
    message: intl.formatMessage({ id: "audit.userIsNotFound" }),
    actions: [
      {
        value: intl.formatMessage({ id: "dialog.confirm.button.confirm" }),
        color: "primary",
      },
    ],
  });

  const validationSchema = Yup.object().shape({
    txtStaffFirstName: Yup.string().required(
      <IntlMessages id="appModule.form.error.firstNameRequired"></IntlMessages>
    ),
    Email: Yup.string()
      .required(
        <IntlMessages id="appModule.form.error.emailIsRequired"></IntlMessages>
      )
      .test(
        "Validate Email",
        <IntlMessages id="staff.from.emailMustBeAValidEmail"></IntlMessages>,
        (value) => {
          return typeEmail(value);
        }
      ),
    Phone: Yup.string().matches(/^[+]*[0-9]*$/, {
      message: (
        <IntlMessages id="appModule.form.error.phoneInValid"></IntlMessages>
      ),
      excludeEmptyString: true,
    }),
  });

  useEffect(() => {
    setLoading(true);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  let { id } = useParams();

  const showModalMessage = async () => {
    const response = await deletePrompt();
    if (
      response === intl.formatMessage({ id: "dialog.confirm.button.confirm" })
    ) {
      onPressBack();
    }
  };

  const fetchData = () => {
    if (id) {
      dispatch(STAFF_DETAIL(id))
        .then(({ data }) => {
          if (data) {
            setStaffProfile(data);
            setChangeColor(data?.colorCode);
            setCurrentEnabledTwoFactorAuth(detail.enabledTwoFactorAuth);
            if (me && detail && me.id === detail.id) {
              dispatch(fetchMe());
            }
          }
        })
        .catch(() => {
          showModalMessage();
        })
        .finally(() => {
          setLoading(false);
        });

      dispatch(SETTING_ACL_GET_ALL()).then(({ data }) => {
        setListRoles(data);
      });
    }
  };

  const handleSubmitData = async (values) => {
    let avatarColor = changeColor ? changeColor : staffProfile.colorCode;

    setLoading(true);
    let obj = {
      id: detail.id,
      email: values.Email,
      roles: createArrayUserRoles(values.txtAccessGroup),
      firstName: values.txtStaffFirstName,
      lastName: values.txtStaffLastName,
      colorCode: avatarColor,
      address: null,
      bio: values.txtNote,
      phone: values.Phone,
      enabledTwoFactorAuth: currentEnabledTwoFactorAuth,
      department: createObjectDepartment(values.department),
    };

    dispatch(EDIT_STAFF(obj))
      .then(() => {
        dispatch(hideMessage());
        onPressBack();
      })
      .catch((err) => {
        return snackActions.error(getContentMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
    setDisplayColorPicker(false);
  };

  const onPressBack = () => {
    history.push("/app/staff");
  };
  const onPressChangeColor = (item) => {
    setChangeColor(item.color);
    setItemColorSelected(item.id);
    setDisplayColorPicker(false);
  };
  const onClickAvatar = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const onHandleCloseColorPicker = () => {
    setDisplayColorPicker(false);
  };

  const onChangeColorPicker = (color) => {
    setAvatarColor(color.rgb);
    setChangeColor(color.hex);
  };

  var nameCode =
    getFirstString(staffProfile.firstName) +
    getFirstString(staffProfile.lastName);

  const onPressDisableTwoFactor = () => {
    setOpenDisable(true);
  };
  const onPressSubmitDisableTwo = () => {
    setOpenDisable(false);
    setCurrentEnabledTwoFactorAuth(!currentEnabledTwoFactorAuth);
  };
  const renderDialog = () => {
    return (
      <Dialog open={openDisable}>
        <DialogTitle>
          <span>
            <IntlMessages id="profile.form.disable" />
          </span>
        </DialogTitle>
        <DialogContent>
          <div className={"mb-2"}>
            <DialogContentText style={{ textAlign: "center" }}>
              <FormattedHTMLMessage
                id="staff.notificationChangeDisableTwoFA"
                values={{
                  user: detail?.fullName,
                }}
              />
            </DialogContentText>
            <center>
              <Button
                onClick={onPressSubmitDisableTwo}
                size="large"
                variant="contained"
              >
                <IntlMessages id="profile.form.button.continue" />
              </Button>

              <Button
                onClick={() => {
                  setOpenDisable(false);
                }}
                size="large"
                variant="outlined"
              >
                <IntlMessages id="appModule.requestForm.cancel" />
              </Button>
            </center>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      {openDisable && renderDialog()}
      <PageHeading
        title={<IntlMessages id={"pageStaff.title"} />}
        titleButton={
          <Link to={"/app/staff"}>
            <BackIcon
              style={{
                verticalAlign: "text-top",
                marginRight: toRem(8),
                height: toRem(16),
              }}
            />
            <IntlMessages id="appModule.back" />
          </Link>
        }
        customUrlResolver={(index, sub) => {
          if (index === 2)
            return [detail.firstName + " " + detail.lastName, false, false];
        }}
      />
      <LoadingWrapper loading={loading} size={"3rem"}>
        <div
          className={clsx(
            "jr-card d-sm-flex  align-items-sm-start jrcard-custom",
            styles.detailPage
          )}
        >
          <div className={styles.leftPanel}>
            <Avatar
              onClick={() => onClickAvatar()}
              style={{
                backgroundColor: changeColor || ThemeColors.default,
              }}
              className="lighten-2 avatar-shadow size-90 mx-auto jr-card-timer-avatar"
            >
              <text className={styles.titleAvatar}>{nameCode}</text>
            </Avatar>
            <div
              style={{
                zIndex: 2,
                position: "absolute",
                height: "100%",
              }}
            >
              {displayColorPicker && (
                <div className="color-picker-cover">
                  <div
                    style={{
                      position: "fixed",
                      top: "0px",
                      right: "0px",
                      bottom: "0px",
                      left: "0px",
                    }}
                    onClick={() => onHandleCloseColorPicker()}
                  />
                  <ChromePicker
                    color={avatarColor}
                    onChange={onChangeColorPicker}
                  />
                </div>
              )}
            </div>
            <div
              className={clsx("column", styles.color)}
              style={{
                display: "flex",
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              {columnColor.map((item) => {
                return (
                  <div key={item.id}>
                    <span
                      onClick={() => onPressChangeColor(item)}
                      className="circleButton"
                      style={{
                        backgroundColor: item.color,
                        cursor: "pointer",
                      }}
                    ></span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ flex: 3 }} className={styles.rightPanel}>
            <div className={styles.header}>
              <Typography className={styles.generalTitle}>
                <IntlMessages id={"staff.general.information"} />
              </Typography>
            </div>
            <Formik
              initialValues={{
                Phone: staffProfile.phone,
                Email: staffProfile.email,
                txtNote: staffProfile.bio ? staffProfile.bio : "",
                txtAccessGroup: +checkRoleUser(staffProfile?.roles)?.id || -1,
                txtStaffFirstName: staffProfile.firstName,
                txtStaffLastName: staffProfile.lastName,
                enabledTwoFactorAuth: staffProfile?.enabledTwoFactorAuth
                  ? staffProfile?.enabledTwoFactorAuth
                  : false,
                department: +staffProfile?.department?.id || -1,
              }}
              validationSchema={validationSchema}
              enableReinitialize={true}
              onSubmit={handleSubmitData}
            >
              {({ submitForm, errors }) => {
                return (
                  <>
                    <Grid container className={styles.form}>
                      <Grid item xs={6} className={styles.field}>
                        <TextField
                          label={
                            <>
                              {intl.formatMessage({
                                id: "staff.addnew.firstname",
                              })}
                              <span className={styles.required}> *</span>
                            </>
                          }
                          placeholder={"Michael"}
                          fullWidth
                          name={"txtStaffFirstName"}
                          formik
                        />
                      </Grid>
                      <Grid className={styles.field} item xs={6}>
                        <TextField
                          name={"txtStaffLastName"}
                          placeholder={"Scott"}
                          label={intl.formatMessage({
                            id: "staff.addnew.lastname",
                          })}
                          fullWidth
                          formik
                        />
                      </Grid>
                      <Grid className={styles.field} item xs={6}>
                        <TextField
                          name={"Email"}
                          label={
                            <>
                              {intl.formatMessage({
                                id: "appModule.email",
                              })}
                              <span className={styles.required}> *</span>
                            </>
                          }
                          placeholder={"email@example.com"}
                          fullWidth
                          formik
                        />
                      </Grid>
                      <Grid className={styles.field} item xs={6}>
                        <TextField
                          label={intl.formatMessage({
                            id: "staff.phone",
                          })}
                          name={"Phone"}
                          placeholder={intl.formatMessage({
                            id: "staff.placeholder.phone",
                          })}
                          fullWidth
                          formik
                        />
                      </Grid>
                      {staffProfile?.role && (
                        <Grid className={styles.field} item xs={6}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend">
                              <IntlMessages id="staff.userRole" />
                            </FormLabel>
                            <Select
                              name={"txtAccessGroup"}
                              formik
                              disabled={
                                (checkRoleUser(me?.roles)?.type !==
                                  ROLE_TYPE_ADMIN &&
                                  checkRoleUser(detail?.roles)?.type ===
                                    ROLE_TYPE_ADMIN) ||
                                detail?.isSuperAdmin ||
                                !ACL.isAllowedPermissions("STAFF_MODULE_EDIT")
                              }
                              size={"large"}
                              style={{ marginBottom: 0 }}
                              displayEmpty
                              withFormControlProps={{ fullWidth: true }}
                              className={styles.selectFieldType}
                              classes={{ menuPaper: styles.selectPaper }}
                            >
                              <MenuItem value={-1} style={{ display: "none" }}>
                                <IntlMessages id="staff.placeholder.userRole" />
                              </MenuItem>
                              {orderBy(listRoles, ["displayName"], ["asc"]).map(
                                (option, index) => (
                                  <MenuItem key={option.id} value={option.id}>
                                    {option?.displayName}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </FormControl>
                        </Grid>
                      )}

                      {staffProfile?.department && (
                        <Grid className={styles.field} item xs={6}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend">
                              <IntlMessages id="staff.table.department" />
                            </FormLabel>
                            <Select
                              size={"large"}
                              name={"department"}
                              formik
                              style={{ marginBottom: 0 }}
                              withFormControlProps={{ fullWidth: true }}
                              className={styles.selectFieldType}
                              classes={{ menuPaper: styles.selectPaper }}
                            >
                              <MenuItem value={-1} style={{ display: "none" }}>
                                <IntlMessages id="staff.placeholder.department" />
                              </MenuItem>
                              {showDepartmentList.map((n) => {
                                return (
                                  <MenuItem key={n.id} value={n.id}>
                                    {n.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                            <FormHelperText>
                              {errors.department?.id}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      )}

                      <Grid className={clsx(styles.field, "mb-0")} item xs={12}>
                        <FormControl component="fieldset">
                          <FormLabel component="legend">
                            <IntlMessages id="staff.note" />
                          </FormLabel>
                          <TextField
                            name={"txtNote"}
                            multiline
                            rows={4}
                            placeholder={intl.formatMessage({
                              id: "staff.placeholder.note",
                            })}
                            fullWidth
                            variant="outlined"
                            formik
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                    <div className={styles.actions}>
                      <div className={clsx(styles.security)} item xs={12}>
                        <Typography className={styles.generalTitle}>
                          <IntlMessages id={"staff.general.security"} />
                        </Typography>
                        <div className={clsx(styles.bgSecurity)}>
                          <div className={styles.autTxt}>
                            <Typography>
                              <IntlMessages id={"profile.two.auth"} />
                            </Typography>

                            {staffProfile?.enabledTwoFactorAuth &&
                              ACL.isAllowedPermissions("STAFF_MODULE_EDIT") &&
                              (currentEnabledTwoFactorAuth ? (
                                <span onClick={onPressDisableTwoFactor}>
                                  <Typography className={styles.Link}>
                                    <IntlMessages
                                      id={"staff.general.disable"}
                                    />
                                  </Typography>
                                </span>
                              ) : (
                                <span onClick={onPressSubmitDisableTwo}>
                                  <Typography className={styles.Link}>
                                    <IntlMessages id={"staff.general.enable"} />
                                  </Typography>
                                </span>
                              ))}
                          </div>
                          <div
                            className={clsx(styles.authButtons, {
                              [styles.disabled]: !currentEnabledTwoFactorAuth,
                            })}
                          >
                            {currentEnabledTwoFactorAuth ? (
                              <Typography
                                className={styles.buttonActive}
                                onClick={
                                  ACL.isAllowedPermissions(
                                    "STAFF_MODULE_EDIT"
                                  ) && onPressDisableTwoFactor
                                }
                              >
                                <IntlMessages id={"staff.general.enable"} />
                              </Typography>
                            ) : (
                              <Tooltip
                                arrow
                                title={
                                  <div className={"d-flex flex-column"}>
                                    <FormattedHTMLMessage id="staff.tooltipDisable" />
                                  </div>
                                }
                                enterDelay={300}
                              >
                                <Typography className={styles.buttonDisable}>
                                  <IntlMessages id="staff.general.disable" />
                                </Typography>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className={clsx(styles.buttonGroup)}>
                        <Typography color={"textSecondary"}>
                          <IntlMessages id="company.dialog.detail.lasteditby" />
                          {`${detail?.lastModifiedBy?.firstName} ${
                            detail?.lastModifiedBy?.lastName
                          } ${formatDate(detail.updatedAt, LONG_DATE_TIME)}`}
                        </Typography>
                        {type !== VIEW &&
                          ACL.isAllowedPermissions("STAFF_MODULE_EDIT") && (
                            <div>
                              <Button
                                onClick={submitForm}
                                variant="contained"
                                color="primary"
                              >
                                <IntlMessages id="customer.dialog.save" />
                              </Button>
                            </div>
                          )}
                      </div>
                    </div>
                  </>
                );
              }}
            </Formik>
          </div>
        </div>
      </LoadingWrapper>
    </>
  );
};

export default compose(withACL)(StaffDetail);
