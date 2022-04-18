import React, { useEffect, useState } from "react";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import { DialogActions, DialogContent, Grid, Tooltip } from "@mui/material";
import Select from "@protego/sdk/RegtankUI/v1/Select/Select";
import MenuItem from "@material-ui/core/MenuItem";
import styles from "./../Department.module.scss";
import { Form, Formik } from "formik";
import CloseableDialogTitle from "@protego/sdk/UI/CloseableDialogTitle/CloseableDialogTitle";
import { ReactComponent as IconDelete } from "assets/icons/icDelete.svg";
import clsx from "clsx";
import { toRem } from "@protego/sdk/utils/measurements";
import { useSelector, useDispatch } from "react-redux";
import { filter } from "lodash";
import {
  deleteDepartment,
  hideMessage,
  fetchDepartmentListAll,
  fetchDepartmentList,
} from "actions/Setting.js";
import { compose } from "recompose";
import withPagination from "@protego/sdk/UI/withPagination";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog/Dialog";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
const DeleteDepartment = ({ paginationParams, data, isLockedFunction }) => {
  const dispatch = useDispatch();
  const { showMessage } = useSelector((state) => state.settings);
  const { departmentListAll } = useSelector((state) => state.settings);
  useEffect(() => {
    if (showMessage) {
      dispatch(hideMessage());
    }
  }, [showMessage, dispatch]);
  const [open, setOpen] = useState(false);
  const setDeleteDepartment = () => {
    setOpen(!open);
  };
  const listTransfer = filter(departmentListAll, function (o) {
    return o.id !== data.id;
  });

  const onClose = () => {
    setOpen(false);
  };
  const onPressClose = () => {
    onClose();
  };
  const onDeleteDepartment = async (idTransfers) => {
    const summitData = {
      id: data.id,
      transferId: idTransfers || null,
    };
    await dispatch(deleteDepartment(summitData));
    setTimeout(() => {
      dispatch(fetchDepartmentList({ params: paginationParams }));
      dispatch(fetchDepartmentListAll());
    }, 1000);
    setOpen(false);
  };
  const handleDeleteIcon = async (dataDelete) => {
    if (!dataDelete.locked) {
      if (dataDelete?.numberOfStaffs === 0) {
        onDeleteDepartment(-1);
      } else {
        setDeleteDepartment();
      }
    }
  };

  return (
    <>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        // fullWidth
        maxWidth={"sm"}
        aria-labelledby="form-dialog-title"
        title={{
          text: (
            <Typography variant="titleForm">
              <IntlMessages id="button.delete" /> "{data?.name}"
            </Typography>
          ),
        }}
        onClose={onPressClose}
        allowCloseOnTitle={true}
        disableDialogAction
      >
        {/* <CloseableDialogTitle onClose={onPressClose}>
          <IntlMessages id="button.delete" /> "{data?.name}"
        </CloseableDialogTitle> */}

        <Formik
          initialValues={{
            transferDepartment: " ",
          }}
        >
          {({ values }) => {
            return (
              <Form className="d-flex flex-column">
                <div>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <IntlMessages id="setting.deleteDepartment.content" />
                    </Grid>
                    <Grid item xs={12}>
                      <Select
                        name={"transferDepartment"}
                        formik
                        size={"large"}
                        style={{ margin: 0 }}
                        withFormControlProps={{ fullWidth: true }}
                      >
                        <MenuItem value={" "} style={{ display: "none" }}>
                          <IntlMessages id="setting.transferDepartment" />
                        </MenuItem>
                        {listTransfer.map((item, index) => (
                          <MenuItem key={index} value={item.id}>
                            <span>
                              <IntlMessages id={item.name} />
                            </span>
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  </Grid>
                </div>
                <DialogActions className="float-right">
                  <Button variant="outlinedSecondary" onClick={onPressClose}>
                    <IntlMessages id="appModule.requestForm.cancel" />
                  </Button>
                  <Button
                    disabled={values.transferDepartment === " "}
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      onDeleteDepartment(values.transferDepartment)
                    }
                  >
                    <IntlMessages id="confirm" />
                  </Button>
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      </Dialog>
      <Tooltip
        arrow
        title={
          <div className={"d-flex flex-column"}>
            <IntlMessages id="button.delete" />
          </div>
        }
        enterDelay={300}
      >
        <span
          className={clsx(
            data.locked ? styles.deleteButtonDisable : styles.deleteButton
          )}
          style={{ cursor: "pointer" }}
          onClick={() => handleDeleteIcon(data)}
        >
          <IconDelete size={toRem(30)} />
        </span>
      </Tooltip>
    </>
  );
};

export default compose(withPagination)(DeleteDepartment);
