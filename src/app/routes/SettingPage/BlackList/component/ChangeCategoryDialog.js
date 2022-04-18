import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
// import CAutoComplete from "components/CAutoCompletev1";
import { Field, Formik, ErrorMessage } from "formik";
import React, { useMemo } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import styles from "../BlackListStyle.module.scss";
import { ADD_NEW_CATEGORY } from "actions/Setting";
import { snackActions } from "util/snackbarUtils";
import { getContentMessage } from "util/index";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { TEXT_HIGH } from "constants/ThemeColors";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { CAutoComplete } from "./InputForm";
import SelectAutoCompleteChip from "components/CAutoCompletev1";
import moduleStyles from "../BlackListStyle.module.scss";
import CloseableDialogTitle from "@protego/sdk/RegtankUI/v1/CloseableDialogTitle/CloseableDialogTitle";
import clsx from "clsx";

const ChangeCategoryDialog = (props) => {
  const { open, onClose, onSubmitChange, categoryList, blackListItem } = props;
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      category: Yup.array()
        .min(1, <IntlMessages id="setting.blacklist.category.required" />)
        .required(<IntlMessages id="setting.blacklist.category.required" />),
    });
  }, []);

  const onPressAddNewCategory = (val) => {
    /**
     * Add new category
     */
    let body = {
      name: val,
    };
    dispatch(ADD_NEW_CATEGORY(body))
      .then((data) => {
        snackActions.success(<IntlMessages id={"notification.success"} />);
      })
      .catch((err) => {
        snackActions.error(getContentMessage(err));
      });
  };

  return (
    <Dialog
      maxWidth={"xs"}
      className={clsx(moduleStyles.confirmDlg, moduleStyles.changeCategoryDlg)}
      fullWidth
      open={open}
      onClose={onClose}
      disableBackdropClick
      disableEscapeKeyDown
    >
      <CloseableDialogTitle className={"d-flex align-items-center"} onClose={onClose}>
        <FormattedHTMLMessage
          id="setting.blacklist.option.change.title"
          values={{
            name: blackListItem?.fullName,
          }}
        />
      </CloseableDialogTitle>
      <Formik
        initialValues={{
          category: blackListItem.categories ? blackListItem.categories : [],
        }}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={(values) => onSubmitChange(values?.category)}
      >
        {({ errors, values, submitForm, touched }) => {
          return (
            <div>
              <DialogContent style={{paddingTop: toRem(24)}}>
                <div>
                  <CAutoComplete
                    {...props}
                    name="category"
                    type="select"
                    component={SelectAutoCompleteChip}
                    options={categoryList}
                    value={values.category}
                    getOptionLabel={(option) => option?.name}
                    multiple
                    numberChip={5}
                    disableClearable
                    clearOnBlur
                    required
                    onPressAdd={onPressAddNewCategory}
                    placeholder={formatMessage({
                      id: "setting.blacklist.dialog.placeholder.select.category",
                    })}
                    error={errors.category && touched.category ? true : false}
                    className={moduleStyles.CAutoComplete}
                    labelHeader={
                      <IntlMessages id={"setting.blacklist.dialog.category"} />
                    }
                    labelIns={
                      <IntlMessages id="setting.blacklist.label.add.up.categories" />
                    }
                  />
                </div>
              </DialogContent>
              <DialogActions className={"d-flex justify-content-end"}>
                <Button
                  className={styles.btnDialogActionWidth}
                  variant="containedWhite"
                  onClick={onClose}
                  style={{ marginRight: toRem(16) }}
                >
                  <IntlMessages id="appModule.requestForm.cancel" />
                </Button>
                <Button
                  className={styles.btnDialogActionWidth}
                  variant="contained"
                  color="primary"
                  onClick={submitForm}
                >
                  <IntlMessages id="setting.blacklist.button.save" />
                </Button>
              </DialogActions>
            </div>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default ChangeCategoryDialog;
