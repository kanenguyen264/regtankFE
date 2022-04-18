import React from "react";
import { Icon, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { EditButton } from "@protego/sdk/RegtankUI/v1/Button";
import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { ReactComponent as CopyIcon } from "assets/icons/buttons/coppyIcon.svg";
import clsx from "clsx";
import { Form, Formik } from "formik";
import { useIntl } from "react-intl";
import AssignSelect from "../../AssignSelect";
import styles from "../style.module.scss";

const useStyle = makeStyles({
  root: {},
  viewBlockWrap: {
    "& .MuiInput-root.Mui-disabled:before": {
      borderBottom: "0 !important",
      borderBottomStyle: "hidden",
    },
    "& .MuiInput-input.Mui-disabled": {
      "-webkit-text-fill-color": "unset",
    },
  },
});

const ViewDetail = ({ className, caseDetail, handleEditButton, ...props }) => {
  const intl = useIntl();
  const classes = useStyle();
  const { formatMessage } = intl;
  const newFields = caseDetail?.fields || [];
  const userAssigned = caseDetail?.assignee;
  return (
    <JRCard
      className={clsx(styles.editForm, className)}
      header={
        <div className={styles.editForm_header}>
          <div>
            <Typography
              variant="Subtitle2"
              component={"div"}
              style={{ marginBottom: toRem(8) }}
            >
              Case Detail
            </Typography>
            <CopyButton
              component={"span"}
              tooltip={<IntlMessages id="appModule.tooltip.copy" />}
              copyIcon={<Icon component={CopyIcon} fontSize={toRem(18.33)} />}
              className={styles.copyButton}
            >
              <Typography variant="titleCard" component={"span"}>
                {caseDetail?.caseId || "_"}
              </Typography>
            </CopyButton>
          </div>
          <Tooltip title={<IntlMessages id="Edit" />}>
            <EditButton onClick={handleEditButton} />
          </Tooltip>
        </div>
      }
      headerLine={true}
      footer={
        <div className={styles.AssignSelect}>
          <AssignSelect
            userAssigned={userAssigned}
            caseId={caseDetail?.caseId}
          />
        </div>
      }
      footerLine={true}
      {...props}
    >
      <Formik>
        <Form className={clsx(styles.editForm_wrap, classes.viewBlockWrap)}>
          <div className={clsx(styles.editForm_fixed)}>
            <TextField
              label={
                <Typography variant="labelFieldForm">
                  <IntlMessages id="caseManagement.caseName" />
                </Typography>
              }
              value={caseDetail?.caseName}
              disabled
            />
            <TextField
              label={
                <Typography variant="labelFieldForm">
                  <IntlMessages id="caseManagement.caseReference" />
                </Typography>
              }
              value={caseDetail?.caseRefId}
              disabled
            />
            <TextField
              label={
                <Typography variant="labelFieldForm">
                  <IntlMessages id="caseManagement.caseInformation" />
                </Typography>
              }
              value={caseDetail?.caseInfo}
              disabled
            />
          </div>
          <div className={clsx(styles.editForm_fixed)}>
            {newFields.map((field, index) => {
              if (index < 3) {
                return (
                  <TextField
                    label={
                      <Typography variant="labelFieldForm">
                        {field?.title}
                      </Typography>
                    }
                    value={field?.content}
                    disabled
                  />
                );
              }
            })}
          </div>
          <div className={clsx(styles.editForm_fixed)}>
            {newFields.map((field, index) => {
              if (index < 6 && index > 2) {
                return (
                  <TextField
                    label={
                      <Typography variant="labelFieldForm">
                        {field?.title}
                      </Typography>
                    }
                    value={field?.content}
                    disabled
                  />
                );
              }
            })}
          </div>
        </Form>
      </Formik>
    </JRCard>
  );
};

export default ViewDetail;
