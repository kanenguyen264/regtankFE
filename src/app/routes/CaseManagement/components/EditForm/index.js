import React, { useEffect } from "react";
import { Button, SvgIcon } from "@mui/material";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import styles from "./style.module.scss";
import clsx from "clsx";
import { useIntl } from "react-intl";
import { ReactComponent as CancelIcon } from "assets/icons/IcoDeleteBtn.svg";
import { ReactComponent as CheckIcon } from "assets/icons/IcoSaveBtn.svg";
import { ReactComponent as AddIcon } from "assets/icons/IcoAdd.svg";
import { Form, Formik, FieldArray } from "formik";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { ReactComponent as IconDeleteField } from "assets/icons/IcoDeleteField.svg";
import { pick } from "lodash";
import * as Yup from "yup";
import { FormHelperText } from "@mui/material";
import AssignSelect from "../AssignSelect";

const EditForm = ({
  className,
  formikRef,
  onSubmit,
  onCancel,
  caseDetail,
  displayAssign,
  mode,
  ...props
}) => {
  const intl = useIntl();
  const { formatMessage } = intl;

  const handleSubmitForm = () => {
    const formData = formikRef.current.values;
    const dynamicFields = formData?.dynamicFields.map((item) =>
      pick(item, ["title", "content"])
    );
    onSubmit &&
      onSubmit({
        name: formData.name,
        referenceId: formData.referenceId,
        information: formData.information,
        fields: dynamicFields,
      });
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(<IntlMessages id="caseManagement.validation.caseName" />)
      .max(255, <IntlMessages id="caseManagement.validation.maxLength" />),
    referenceId: Yup.string().max(
      255,
      <IntlMessages id="caseManagement.validation.maxLength" />
    ),
    information: Yup.string().max(
      255,
      <IntlMessages id="caseManagement.validation.maxLength" />
    ),
    dynamicFields: Yup.array().of(
      Yup.object().shape({
        title: Yup.string()
          .required(
            <IntlMessages id="caseManagement.validation.title.required" />
          )
          .max(
            255,
            <IntlMessages id="caseManagement.validation.title.maxLength" />
          )
          .nullable(true),
        content: Yup.string()
          .max(
            255,
            <IntlMessages id="caseManagement.validation.description.maxLength" />
          )
          .nullable(true),
      })
    ),
  });

  return (
    <JRCard
      className={clsx(styles.editForm, className)}
      header={
        <div className={styles.editForm_header}>
          <span>
            <IntlMessages id="caseManagement.caseDetail" />
          </span>
          <div className={styles.editForm_control}>
            <Button
              className={clsx(styles.editForm_btn, styles.editForm_btn__cancel)}
              onClick={onCancel}
            >
              <SvgIcon viewBox="0 0 16 16" component={CancelIcon} />
            </Button>
            <Button
              className={clsx(styles.editForm_btn, styles.editForm_btn__save)}
              onClick={() => {
                formikRef.current.handleSubmit();
              }}
            >
              <SvgIcon viewBox="0 0 17 14" component={CheckIcon} />
            </Button>
          </div>
        </div>
      }
      headerLine={true}
      footer={
        displayAssign && (
          <div className={styles.AssignSelect}>
            <AssignSelect
              userAssigned={caseDetail?.assignee}
              caseId={caseDetail?.caseId}
            />
          </div>
        )
      }
      {...props}
    >
      <Formik
        initialValues={{
          name: caseDetail?.caseName || "",
          referenceId: caseDetail?.caseRefId || "",
          information: caseDetail?.caseInfo || "",
          dynamicFields: caseDetail?.fields || [],
        }}
        onSubmit={handleSubmitForm}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={validationSchema}
        innerRef={formikRef}
      >
        {({ values, setFieldValue, errors }) => {
          return (
            <Form className={clsx(styles.editForm_wrap)}>
              <div className={clsx(styles.editForm_fixed)}>
                <TextField
                  name="name"
                  label={<IntlMessages id="caseManagement.caseName" />}
                  placeholder={intl.formatMessage({
                    id: "caseManagement.placeholder.caseName",
                  })}
                  formik
                  error={errors.name}
                />
                <TextField
                  name="referenceId"
                  label={<IntlMessages id="caseManagement.caseReference" />}
                  placeholder={formatMessage({
                    id: "caseManagement.placeholder.reference",
                  })}
                  formik
                  error={errors.referenceId}
                />
                <TextField
                  name="information"
                  label={<IntlMessages id="caseManagement.caseInformation" />}
                  placeholder={formatMessage({
                    id: "caseManagement.placeholder.information",
                  })}
                  formik
                  error={errors.information}
                />
              </div>
              <div className={clsx(styles.editForm_dynamic)}>
                <FieldArray name="dynamicFields">
                  {() =>
                    values.dynamicFields.map((field, i) => {
                      const fieldError =
                        (errors.dynamicFields?.length &&
                          errors.dynamicFields[i]) ||
                        {};
                      return (
                        <div
                          key={field.key}
                          className={clsx(
                            styles.editForm_dynamicField,
                            styles.editForm_dynamicItem
                          )}
                        >
                          <TextField
                            name={`dynamicFields.${i}.title`}
                            formik
                            placeholder={formatMessage({
                              id: "caseManagement.placeholder.title",
                            })}
                          />
                          <TextField
                            name={`dynamicFields.${i}.content`}
                            formik
                            placeholder={formatMessage({
                              id: "caseManagement.placeholder.description",
                            })}
                            error={fieldError?.title || fieldError.content}
                          />
                          {(fieldError?.title || fieldError?.content) && (
                            <FormHelperText error className={clsx(styles.editForm_helperText)}>
                              {fieldError?.title || fieldError?.content}
                            </FormHelperText>
                          )}

                          <Tooltip
                            title={
                              <IntlMessages id="caseManagement.Placeholder.deleteField" />
                            }
                          >
                            <SvgIcon
                              className={clsx(styles.editForm_deleteField)}
                              viewBox="0 0 18 18"
                              component={IconDeleteField}
                              onClick={() => {
                                let data = values.dynamicFields.filter(
                                  (val, index) => {
                                    return index !== i;
                                  }
                                );
                                setFieldValue("dynamicFields", [...data]);
                              }}
                            />
                          </Tooltip>
                        </div>
                      );
                    })
                  }
                </FieldArray>
                {values.dynamicFields.length < 6 && (
                  <Tooltip title="Limited to 6 Fields">
                    <Button
                      disableTouchRipple={true}
                      className={clsx(
                        styles.editForm_addField,
                        styles.editForm_dynamicItem
                      )}
                      onClick={() => {
                        let key = new Date().getTime();
                        setFieldValue("dynamicFields", [
                          ...values.dynamicFields,
                          {
                            title: "",
                            content: "",
                            key: key,
                          },
                        ]);
                      }}
                    >
                      <AddIcon />
                      <IntlMessages id="caseManagement.btn.addAField" />
                    </Button>
                  </Tooltip>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </JRCard>
  );
};

export default EditForm;
