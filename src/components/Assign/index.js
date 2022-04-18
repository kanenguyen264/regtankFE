import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
} from "@material-ui/core";
import CloseableDialogTitle from "@protego/sdk/UI/CloseableDialogTitle/CloseableDialogTitle";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import Select from "@protego/sdk/UI/Select/Select";
import { toRem } from "@protego/sdk/utils/measurements";
import { GET_AVAILABLE_ASSIGN } from "actions/Staff";
import clsx from "clsx";
import UserAvatar from "components/UserAvatar";
import { Form, Formik } from "formik";
import React, { memo, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { getFullName } from "util/string";

const Assign = (props) => {
  const { open, onClose, onSave, screen } = props;
  const intl = useIntl();
  const dispatch = useDispatch();
  const [userAvailableAssign, setUserAvailableAssign] = useState([]);
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
    >
      {({ resetForm, submitForm, values }) => {
        return (
          <Form>
            <Dialog
              disableBackdropClick
              disableEscapeKeyDown
              open={open}
              onClose={onClose}
              fullWidth
              modal={false}
              maxWidth="xs"
              onExited={resetForm}
              aria-labelledby="form-dialog-title"
            >
              <CloseableDialogTitle onClose={onClose}>
                <IntlMessages id={"dialog.assignTo"} />
              </CloseableDialogTitle>

              <div>
                <DialogContent className="company-dialog-body">
                  <div
                    style={{
                      marginTop: 20 |> toRem,
                    }}
                  >
                    <Select
                      name={"user"}
                      formik
                      withFormControlProps={{ fullWidth: true }}
                    >
                      <MenuItem key={"__null"} value={-1}>
                        <div className="d-inline-flex align-items-center">
                          <UserAvatar
                            user={{
                              firstName: "?",
                              lastName: "",
                              colorCode: "#444444",
                            }}
                            size={26}
                            noExtractLetter
                          />
                          <span>
                            {intl.formatMessage({
                              id: "appModule.Unassigned",
                            })}
                          </span>
                        </div>
                      </MenuItem>

                      {userAvailableAssign?.map((user) => (
                        <MenuItem key={user.id} value={user}>
                          <div className="d-inline-flex align-items-center">
                            <UserAvatar user={user} size={26} />
                            <div>{getFullName(user)}</div>
                          </div>
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button
                    className={clsx("mr-3")}
                    size="large"
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={values.user === -1}
                    onClick={submitForm}
                  >
                    <IntlMessages id={"dialog.confirm.button.proceed"} />
                  </Button>
                  <Button
                    className={clsx("mr-0")}
                    onClick={onCancelForm}
                    size="large"
                    variant="contained"
                  >
                    <IntlMessages id={"dialog.confirm.button.cancel"} />
                  </Button>
                </DialogActions>
              </div>
            </Dialog>
          </Form>
        );
      }}
    </Formik>
  );
};

export default memo(Assign);
