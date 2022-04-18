import { DialogContent, MenuItem, Typography, Box } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Select from "@protego/sdk/RegtankUI/v1/CSelect";
import { GET_AVAILABLE_ASSIGN } from "actions/Staff";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { Form, Formik } from "formik";
import React, { memo, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { getFullName } from "util/string";
import styles from "./styles.module.scss";
import Dropdown from "@protego/sdk/UI/Dropdown/Dropdown";
import DropdownItem from "@protego/sdk/RegtankUI/v1/DropdownItem";
const Assign = (props) => {
  const { open, onClose, onSave, screen } = props;
  const intl = useIntl();
  const dispatch = useDispatch();
  const [userAvailableAssign, setUserAvailableAssign] = useState([]);
  const assignRef = useRef();
  const onCancelForm = async () => {
    onClose();
  };
  const onPressSubmit = async (data) => {
    try {
      onSave(data.user);
      onClose();
    } catch (error) {}
  };

  useEffect(() => {
    dispatch(GET_AVAILABLE_ASSIGN({ params: screen })).then((data) => {
      if (data) {
        setUserAvailableAssign(data);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Formik
      initialValues={{
        user: -1,
      }}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={onPressSubmit}
      ref={assignRef}
    >
      {({ resetForm, submitForm, values }) => {
        return (
          <Form>
            <Dialog
              open={open}
              onClose={onClose}
              onExited={resetForm}
              aria-labelledby="form-dialog-title"
              title={{
                text: (
                  <Typography variant="titleForm2">
                    <IntlMessages id={"dialog.assignTo"} />
                  </Typography>
                ),
              }}
              allowCloseOnTitle
              actionsCustom={
                <div className="d-flex justify-content-end">
                  <Button onClick={onCancelForm} variant="outlinedSecondary">
                    <IntlMessages id={"dialog.confirm.button.cancel"} />
                  </Button>
                  <Button
                    className={"ml-3"}
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={values?.user === -1}
                    onClick={submitForm}
                  >
                    <IntlMessages id={"dialog.confirm.button.proceed"} />
                  </Button>
                </div>
              }
            >
              <div className={styles.content}>
                <Select
                  name={"user"}
                  formik
                  displayEmpty
                  getContentAnchorEl={null}
                  renderValue={(selected) => {
                    if (selected.length === 0 || selected === -1) {
                      return (
                        <div className="d-inline-flex align-items-center">
                          <Typography variant="small1">
                            {intl.formatMessage({
                              id: "appModule.Unassigned",
                            })}
                          </Typography>
                        </div>
                      );
                    }
                    return (
                      <div className="d-inline-flex align-items-center">
                        <Box>
                          <UserAvatar user={selected} size={32} />
                        </Box>
                        <Typography variant="small1">
                          {getFullName(selected)}
                        </Typography>
                      </div>
                    );
                  }}
                >
                  {userAvailableAssign?.map((user) => (
                    <MenuItem key={user.id} value={user}>
                      <div className="d-inline-flex align-items-center">
                        <Box>
                          <UserAvatar user={user} size={32} />
                        </Box>
                        <Typography variant="small1">
                          {getFullName(user)}
                        </Typography>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </Dialog>
          </Form>
        );
      }}
    </Formik>
  );
};

export default memo(Assign);
