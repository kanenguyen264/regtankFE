import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { makeStyles } from '@mui/styles';
import { ProtegoContext } from "@protego/sdk/core/ProtegoProvider/ProtegoProvider";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { ReactComponent as ImportDuplicated } from "assets/icons/ImportDuplicate.svg";
import { ReactComponent as ImportFailedIcon } from "assets/icons/ImportFailed.svg";
import { ReactComponent as ImportSuccessIcon } from "assets/icons/ImportSuccess.svg";
import { ReactComponent as TopUpNeededIcon } from "assets/icons/TopUpNeeded.svg";
import clsx from "clsx";
import { findIndex, map, uniq } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { FormattedHTMLMessage } from "react-intl";
import CustomLoadingIndicator from "../CustomLoadingIndicator";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";

const useStyles = makeStyles({
  cancelButton: {
    backgroundColor: ThemeColors.white,
    color: "#2B2B2B",
    border: "1px solid #E6E6E6",
    fontWeight: "500!important",
    boxShadow: "0px 2px 4px rgba(230, 230, 230, 0.16)",
    paddingTop: "0.824rem",
    paddingBottom: "0.824rem",

    "&:hover": {
      borderColor: ThemeColors.primary,
      boxShadow: "0px 12px 20px rgba(51, 152, 255, 0.08)",
      color: ThemeColors.primary,
    },
  },
  confirmButton: {
    backgroundColor: ThemeColors.primary,
    fontWeight: "500!important",
    "&:hover": {
      backgroundColor: "#43A4FF",
    },
    "&.padding": {
      paddingLeft: 40,
      paddingRight: 40,
    },
  },
  actions: {
    display: "flex",
    justifyContent: "center",
  },
  growingButton: {
    flexGrow: 1,
  },
  loadingWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 0 0",
    fontSize: "22px",
  },
  contentWrapper: {
    textAlign: "center",
    padding: "50px 10px 0",
    fontSize: "17px",
    lineHeight: "24px",
    fontWeight: 400,
    color: "#2B2B2B",
    "& > svg": {
      marginBottom: "18px",
    },
    "& p": {
      margin: 0,
    },
  },
  errorWrapper: {
    maxHeight: "200px",
    listStyle: "none",
    overflowY: "auto",
    overflowX: "hidden",
    width: "100%",
    margin: "20px 0 0",
    padding: "14px 16px",
    border: "1px solid #C7C7C7",
    borderRadius: "6px",
    textAlign: "left",
    "& li": {
      margin: 0,
    },
  },
});

const errorTypes = {
  CREDIT: "INSUFFICIENT_CREDIT",
  FILETYPE: "INVALID_CSV_FILE",
  FILECONTENT: "INVALID_CSV_HEADER",
  FILESIZE: "FILE_SIZE_EXCEEDED",
  VALIDATION: "VALIDATION",
  INVALID_ASSIGNEE: "INVALID_ASSIGNEE",
  DUPLICATED_DATA: "DUPLICATED_DATA",
  INVALID_COUNTRY: "INVALID_COUNTRY",
  NAME_REQUIRED: "NAME_REQUIRED",
  CATEGORY_REQUIRED: "CATEGORY_REQUIRED",
  COUNTRY_SOURCE_REQUIRED: "COUNTRY_SOURCE_REQUIRED",
  DJ_KYC_NAME_REQUIRED: "DJ_KYC_NAME_REQUIRED",
  DJ_KYC_FULL_NAME_OR_NAME_TYPE: "DJ_KYC_FULL_NAME_OR_NAME_TYPE",
  DJ_KYC_DOB_OR_YEAR_RANGE: "DJ_KYC_DOB_OR_YEAR_RANGE",
  DJ_KYC_INVALID_DOB: "DJ_KYC_INVALID_DOB",
  DJ_KYC_INVALID_YEAR_RANGE: "DJ_KYC_INVALID_YEAR_RANGE",
  INVALID_DATE: "INVALID_DATE",
};
const errorTypeValidate = [
  "INVALID_ASSIGNEE",
  "INVALID_EMAIL",
  "EMPTY_DATA",
  "DUPLICATED_DATA",
  "INVALID_COUNTRY",
  "NAME_REQUIRED",
  "CATEGORY_REQUIRED",
  "COUNTRY_SOURCE_REQUIRED",
  "INVALID_DATE_OR_YEAR",
  "DJ_KYC_NAME_REQUIRED",
  "DJ_KYC_FULL_NAME_OR_NAME_TYPE",
  "DJ_KYC_DOB_OR_YEAR_RANGE",
  "DJ_KYC_INVALID_DOB",
  "DJ_KYC_INVALID_YEAR_RANGE",
  "INVALID_DATE",
];

const useImportDialog = () => {
  const { addComponent, removeComponent } = useContext(ProtegoContext);

  return ({ onSuccess, init, title }) => {
    const ImportDialog = ({ resolve, reject }) => {
      const [open, setOpen] = useState(true),
        [validating, setValidating] = useState(false),
        [loading, setLoading] = useState(false),
        [data, setData] = useState(null),
        [error, setError] = useState(false);

      const classes = useStyles();

      useEffect(() => {
        initAction();
      }, []);

      const initAction = async () => {
        setValidating(true);
        try {
          const { data } = await init();
          if (!data.success) {
            setError({ type: errorTypes.VALIDATION, data: data });
          } else if (!data.credit?.sufficient) {
            setError({ type: errorTypes.CREDIT, data: data });
          } else {
            setData(data);
          }
        } catch (e) {
          if (e.response?.data?.message === errorTypes.FILESIZE) {
            setError({ type: errorTypes.FILESIZE });
          } else if (e.response?.data?.message === errorTypes.FILECONTENT) {
            setError({ type: errorTypes.FILECONTENT });
          } else {
            setError({ type: errorTypes.FILETYPE });
          }
        } finally {
          setValidating(false);
        }
      };

      const onClose = () => {
        setOpen(false);
        resolve();
      };

      const onConfirm = async () => {
        setLoading(true);
        try {
          await onSuccess(data);
          setOpen(false);
          resolve();
        } catch (e) {
          if (e.response?.data?.message === errorTypes.CREDIT) {
            setError({ type: errorTypes.CREDIT, data });
          } else {
            reject(e.response?.data);
          }
        } finally {
          setLoading(false);
        }
      };

      const removeDialog = () => {
        removeComponent({ key: "importDialog" });
      };
      const renderErrorsImport = (typeError) => {
        return (
          <div className="mb-3">
            {findIndex(error.data?.failed, function (o) {
              return o.errorType === typeError;
            }) > -1 && (
              <>
                {
                  {
                    INVALID_ASSIGNEE: (
                      <IntlMessages id="appModule.importCsv.invalidAssignee" />
                    ),
                    INVALID_EMAIL: (
                      <IntlMessages id="appModule.importCsv.invalidEmailAddress" />
                    ),
                    EMPTY_DATA: (
                      <IntlMessages id="appModule.importCsv.others" />
                    ),
                    DUPLICATED_DATA: (
                      <IntlMessages id="appModule.importCsv.duplicatedData" />
                    ),
                    INVALID_COUNTRY: (
                      <IntlMessages id="appModule.importCsv.invalidCountry" />
                    ),
                    NAME_REQUIRED: <IntlMessages id={"import.required.name"} />,
                    CATEGORY_REQUIRED: (
                      <IntlMessages id={"import.required.category"} />
                    ),
                    COUNTRY_SOURCE_REQUIRED: (
                      <IntlMessages id={"import.required.country"} />
                    ),
                    DJ_KYC_NAME_REQUIRED: (
                      <IntlMessages id={"import.djkyc.nameRequired"} />
                    ),
                    DJ_KYC_FULL_NAME_OR_NAME_TYPE: (
                      <IntlMessages id={"import.djkyc.fullNameOrNameType"} />
                    ),
                    DJ_KYC_DOB_OR_YEAR_RANGE: (
                      <IntlMessages id={"import.djkyc.dobOrYearRange"} />
                    ),
                    DJ_KYC_INVALID_DOB: (
                      <IntlMessages id={"import.djkyc.invalidDob"} />
                    ),
                    DJ_KYC_INVALID_YEAR_RANGE: (
                      <IntlMessages id={"import.djkyc.invalidYearRange"} />
                    ),
                    INVALID_DATE: <IntlMessages id={"import.format.DOB"} />,
                  }[typeError]
                }
                <br />
              </>
            )}
            {error &&
              // eslint-disable-next-line
              error.data?.failed?.map((item, index) => {
                if (item.errorType === typeError) {
                  return (
                    <li key={index}>
                      <IntlMessages id="appModule.importCsv.row" /> {item.index}
                    </li>
                  );
                }
              })}
          </div>
        );
      };

      return (
        <Dialog
          fullWidth
          maxWidth={"xs"}
          open={open}
          onClose={onClose}
          onExited={removeDialog}
        >
          <DialogTitle style={{ textAlign: "center" }}>
            <span>
              {title ? title : <IntlMessages id="appModule.importCsv.title" />}
            </span>
          </DialogTitle>
          <DialogContent className={"position-relative"}>
            {validating || loading ? (
              <div className={classes.loadingWrapper}>
                <CustomLoadingIndicator size={60} thickness={3} />
                <p className="mt-3">
                  {validating ? (
                    <IntlMessages id="appModule.importCsv.validating" />
                  ) : (
                    <IntlMessages id="appModule.importCsv.loading" />
                  )}
                </p>
              </div>
            ) : (
              <div className={classes.contentWrapper}>
                {error
                  ? {
                      [errorTypes.CREDIT]: (
                        <>
                          <TopUpNeededIcon />
                          <p>
                            <FormattedHTMLMessage
                              id="appModule.importCsv.creditInsufficient"
                              values={{
                                total: error.data?.data?.length,
                                credit: error.data?.credit?.amount,
                              }}
                            />
                          </p>
                        </>
                      ),
                      [errorTypes.FILESIZE]: (
                        <>
                          <ImportFailedIcon />
                          <p>
                            <IntlMessages id="appModule.importCsv.maxSizeExceeded" />
                          </p>
                        </>
                      ),
                      [errorTypes.FILETYPE]: (
                        <>
                          <ImportFailedIcon />
                          <p>
                            <IntlMessages id="appModule.importCsv.invalidFileType" />
                          </p>
                        </>
                      ),
                      [errorTypes.FILECONTENT]: (
                        <>
                          <ImportFailedIcon />
                          <p>
                            <IntlMessages id="appModule.importCsv.invalidFileContent" />
                          </p>
                        </>
                      ),
                      [errorTypes.VALIDATION]: (
                        <>
                          {error?.data?.failed[0]?.errorType ===
                          errorTypes.DUPLICATED_DATA ? (
                            <ImportDuplicated />
                          ) : (
                            <ImportFailedIcon />
                          )}
                          <p>
                            <FormattedHTMLMessage
                              id="appModule.importCsv.validationError"
                              values={{
                                total: error.data?.data?.length,
                                error: uniq(map(error.data?.failed, "index"))
                                  .length,
                              }}
                            />
                          </p>
                          <ul className={classes.errorWrapper}>
                            {errorTypeValidate.map((type, index) => {
                              return (
                                <div key={index}>
                                  {renderErrorsImport(type)}
                                </div>
                              );
                            })}
                          </ul>
                        </>
                      ),
                    }[error.type]
                  : data && (
                      <>
                        <ImportSuccessIcon />
                        <p>
                          <FormattedHTMLMessage
                            id="appModule.importCsv.validated"
                            values={{
                              total: data.data.length,
                            }}
                          />
                        </p>
                        <p>
                          <FormattedHTMLMessage
                            id="appModule.importCsv.creditDeduct"
                            values={{
                              credit: data.credit.amount,
                            }}
                          />
                        </p>
                      </>
                    )}
              </div>
            )}
          </DialogContent>
          <DialogActions className={classes.actions}>
            {!loading &&
              !validating &&
              (error ? (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={onClose}
                  className={clsx(classes.confirmButton, "padding")}
                >
                  <IntlMessages id="close" />
                </Button>
              ) : (
                <>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={onConfirm}
                    className={clsx(
                      classes.growingButton,
                      classes.confirmButton
                    )}
                  >
                    <IntlMessages id="proceed" />
                  </Button>
                  <Button
                    variant="outlined"
                    className={clsx(
                      classes.cancelButton,
                      classes.growingButton
                    )}
                    onClick={onClose}
                  >
                    <IntlMessages id="cancel" />
                  </Button>
                </>
              ))}
          </DialogActions>
        </Dialog>
      );
    };

    return new Promise((resolve, reject) => {
      addComponent({
        component: <ImportDialog resolve={resolve} reject={reject} />,
        key: "importDialog",
      });
    });
  };
};

export default useImportDialog;
