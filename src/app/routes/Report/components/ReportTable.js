import React, { Fragment, memo, useState, useEffect } from "react";
import { Grid, TableBody, Table, Typography } from "@mui/material";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import styles from "../report.module.scss";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { useIntl } from "react-intl";
import RowTable from "./RowTable";
import { toRem } from "@protego/sdk/utils/measurements";
import { find, forEach, flatMap } from "lodash";
import {
  DATE_TIME_FILTER,
  MODE,
  RISK_ASSESSMENT,
  KEYWORDS,
} from "constants/ActionTypes";
import { BETWEEN } from "constants/FilterOperators";
import {
  ADD_KYC_REPORT,
  ADD_KYB_REPORT,
  ADD_KYT_REPORT,
  ADD_DJ_KYC_REPORT,
} from "actions/ReportAction";
import { useDispatch, useSelector } from "react-redux";
import { DJ_ACTION_GET_WATCH_GROUP } from "actions/DJAction";
import { KYC_ACTION_GET_WATCH_GROUP } from "actions/KYCAction";
import { KYB_ACTION_GET_WATCH_GROUP } from "actions/KYBAction";
import { KYT_ACTION_GET_WATCH_GROUP } from "actions/KYTAction";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import { getKeyFromKeywordData } from "util/filterType";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
//@ts-ignore
import { ReactComponent as Circle } from "assets/icons/circle.svg";
const ReportTable = (props) => {
  const { dataFieldReport, reportName } = props;
  const intl = useIntl();
  const validationSchema = yup.object({
    name: yup.string().required(<IntlMessages id="report.name.required" />),
    fromRisk: yup
      .number(<IntlMessages id="report.MustBeNumber" />)
      .integer()
      .min(0, <IntlMessages id="report.Min0" />)
      .max(
        reportName === "KYT" ? 10 : Infinity,
        <IntlMessages id="report.Max10" />
      ),

    toRisk: yup
      .number(<IntlMessages id="report.MustBeNumber" />)
      .integer()
      .min(0, <IntlMessages id="report.Min0" />)
      .max(
        reportName === "KYT" ? 10 : Infinity,
        <IntlMessages id="report.Max10" />
      )
      .test(
        "checkDate",
        <IntlMessages id="report.MaxGreaterThanOrEqual" />,
        function (value) {
          const _fromRisk = this.parent.fromRisk;
          if (_fromRisk && value < _fromRisk) {
            return this.createError({
              message: <IntlMessages id="report.MaxGreaterThanOrEqual" />,
            });
          }
          return true;
        }
      ),
  });
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.me.me);
  let listFilter = [];
  forEach(dataFieldReport, function (value) {
    if (value.TableName === MODE) {
      listFilter = [...listFilter, value.filterData[0]];
      if (value.filterData[1] && value.filterData[1].children) {
        const dataMode = flatMap(value.filterData[1].children, function (n) {
          return n.tabChildren;
        });

        listFilter = [...listFilter, ...dataMode];
      } else {
        listFilter = [...listFilter, value.filterData];
      }
    } else if (value.TableName === RISK_ASSESSMENT) {
      listFilter = [...listFilter, value.filterData[0]];
      if (
        value.filterData &&
        value.filterData[1] &&
        value.filterData[1].children
      ) {
        listFilter = [...listFilter, ...value.filterData[1].children];
      } else if (value.filterData && value.filterData[1]) {
        listFilter = [...listFilter, value.filterData[1]];
      }
    } else {
      listFilter = [...listFilter, ...value.filterData];
    }
  });
  const { formatMessage } = useIntl();
  const formFilter = React.useRef();
  const [openColl, setOpenColl] = useState([]);
  const [openGeneration, setOpenGeneration] = useState(false);
  const [typeReset, setTypeReset] = useState(false);
  const findByPropertyNameInList = (list, propertyName) => {
    return find(list, function (o2) {
      return o2.property === propertyName;
    });
  };

  const getFilterDefinitionByProperty = (propertyName) => {
    return find(listFilter, function (o) {
      if (o.property === propertyName) {
        return true;
      } else if (o.children) {
        return findByPropertyNameInList(o.children, propertyName);
      } else {
        return o.property === propertyName;
      }
    });
  };
  const isValidFilterValue = (filterValue) => {
    if (!filterValue) {
      return false;
    } else if (Array.isArray(filterValue)) {
      return filterValue.length > 0;
    }

    return true;
  };
  const onSubmitData = async () => {
    let filterData = Object.keys(formFilter.current.values)
      .filter((property) => {
        return isValidFilterValue(formFilter.current.values[property]);
      })
      .map((property) => {
        let dataFilterValue = null;
        const filterDefinitionObj = getFilterDefinitionByProperty(property);
        if (!filterDefinitionObj) {
          return null;
        }
        if (filterDefinitionObj.dataSelect === DATE_TIME_FILTER) {
          dataFilterValue = formFilter.current.values[property];

          return {
            property: filterDefinitionObj.fieldSystemName,
            operator: BETWEEN,
            valueType: filterDefinitionObj.valueType,
            filterValue: dataFilterValue,
          };
        } else {
          dataFilterValue = formFilter.current.values[property];
        }

        return {
          property: filterDefinitionObj.fieldSystemName,
          operator: filterDefinitionObj.operator,
          filterValue:
            filterDefinitionObj.dataSelect === KEYWORDS
              ? getKeyFromKeywordData(dataFilterValue)
              : dataFilterValue,
          valueType: filterDefinitionObj?.valueType,
        };
      })
      .filter((property) => {
        if (formFilter.current.values["filterByMode"] === "creation") {
          return (
            property != null &&
            property?.property !== "updatedAt" &&
            property?.property !== "lastModifiedBy"
          );
        } else if (
          formFilter.current.values["filterByMode"] === "modification"
        ) {
          return (
            property != null &&
            property?.property !== "createdAt" &&
            property?.property !== "createdBy"
          );
        }
      });
    const dataSubmit = {
      reportName: formFilter.current.values.name,
      description: formFilter.current.values.description,
      searchFilters: filterData,
    };
    switch (reportName) {
      case "KYC_ACURIS":
        dispatch(ADD_KYC_REPORT(dataSubmit))
          .then(() => {
            setOpenGeneration(true);
            resetForm();
          })
          .catch((err) => {});
        break;
      case "KYC_DJ":
        dispatch(ADD_DJ_KYC_REPORT(dataSubmit))
          .then(() => {
            setOpenGeneration(true);
            resetForm();
          })
          .catch((err) => {});
        break;
      case "KYB":
        dispatch(ADD_KYB_REPORT(dataSubmit))
          .then(() => {
            setOpenGeneration(true);
            resetForm();
          })
          .catch((err) => {});
        break;
      case "KYT":
        dispatch(ADD_KYT_REPORT(dataSubmit))
          .then(() => {
            setOpenGeneration(true);
            resetForm();
          })
          .catch((err) => {});
        break;

      default:
        break;
    }
  };
  const resetForm = () => {
    formFilter.current.resetForm();
    setTypeReset(!typeReset);
  };
  const handleCloseGeneration = () => {
    setOpenGeneration(false);
  };
  useEffect(() => {
    switch (reportName) {
      case "KYC_ACURIS":
        dispatch(KYC_ACTION_GET_WATCH_GROUP());
        break;
      case "KYC_DJ":
        dispatch(DJ_ACTION_GET_WATCH_GROUP());
        break;
      case "KYB":
        dispatch(KYB_ACTION_GET_WATCH_GROUP());
        break;
      case "KYT":
        dispatch(KYT_ACTION_GET_WATCH_GROUP());
        break;
      default:
        break;
    }
    // eslint-disable-next-line
  }, [reportName]);

  return (
    <Fragment>
      <Dialog
        // fullWidth
        open={openGeneration}
        onClose={handleCloseGeneration}
        closeAfterTransition
        maxWidth={"sm"}
        title={{
          text: (
            <Typography variant="title">
              <IntlMessages id={"report.headline"} />
            </Typography>
          ),
          icon: <Circle />,
        }}
        //   disableDialogAction
        actionsCustom={
          <div className="justify-content-center d-flex ">
            <Button
              style={{ width: toRem(132) }}
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleCloseGeneration}
            >
              <IntlMessages id="OK" />
            </Button>
          </div>
        }
      >
        <div className="d-flex flex-column">
          <div className={styles.labelDialogGenerationContent}>
            <IntlMessages id="report.contentDialogGeneration" />
          </div>
          <div>
            <span className={styles.labelDialogGenerationContent}>Email:</span>{" "}
            <span
              className={styles.labelDialogGenerationEmail}
              style={{ fontWeight: 700 }}
            >
              {currentUser?.email}
            </span>
          </div>
        </div>
      </Dialog>
      <JRCard
        headerLine
        header={
          <Typography className={styles.headerCard}>
            {
              {
                KYC_ACURIS: <IntlMessages id="report.table.header.kycAcuris" />,
                KYC_DJ: <IntlMessages id="report.table.header.kycDJ" />,
                KYB: <IntlMessages id="report.table.header.kyb" />,
                KYT: <IntlMessages id="report.table.header.kyt" />,
              }[reportName]
            }
          </Typography>
        }
        className={styles.reportModule}
      >
        <div className={styles.container}>
          <Formik
            innerRef={formFilter}
            initialValues={{
              name: "",
              description: "",
              fromRisk: "",
              toRisk: "",
              isSanction: false,
              noScore: false,
              updatedAt: [],
              createdAt: [],
              createdBy: [],
              lastModifiedBy: [],
              filterByMode: "creation",
              riskLevel: [],
            }}
            enableReinitialize={true}
            validationSchema={validationSchema}
            className={styles.formContainer}
            onSubmit={onSubmitData}
          >
            {({ values, errors, touched, submitForm }) => {
              return (
                <Form className={styles.formContainer}>
                  <Grid container>
                    <Grid item xs={12}>
                      <div className={styles.reportTitle}>
                        <IntlMessages id={"report.table.General"} />
                      </div>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={12}>
                      <TextField
                        className={styles.placeholderInput}
                        formik
                        fullWidth
                        id="name"
                        label={formatMessage({
                          id: "report.table.ReportName",
                        })}
                        name="name"
                        placeholder={formatMessage({
                          id: "report.TypeYourReportNameHere",
                        })}
                        value={values.description}
                        error={
                          touched.description && Boolean(errors.description)
                        }
                        helperText={touched.description && errors.description}
                        InputLabelProps={{ required: true, shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} className={styles.pt24}>
                      <TextField
                        className={styles.placeholderInput}
                        formik
                        fullWidth
                        label={formatMessage({
                          id: "report.table.Description",
                        })}
                        id="Description"
                        name="description"
                        placeholder={formatMessage({
                          id: "report.TypeYourDescriptionHere",
                        })}
                        value={values.description}
                        error={
                          touched.description && Boolean(errors.description)
                        }
                        helperText={touched.description && errors.description}
                      />
                    </Grid>
                    {/* content */}
                    <Grid xs={12} className={styles.pt24}>
                      <Table aria-label="collapsible table">
                        <TableBody>
                          {dataFieldReport.map((row, index) => {
                            let isOpen = openColl.find(
                              (i) => i === row.TableName
                            );
                            return (
                              <Fragment key={index}>
                                <RowTable
                                  typeReset={typeReset}
                                  row={row}
                                  openColl={isOpen ? true : false}
                                  onChangeCollapse={(val) => {
                                    let index = openColl.findIndex(
                                      (i) => i === val.TableName
                                    );
                                    if (index < 0) {
                                      setOpenColl([...openColl, val.TableName]);
                                    } else {
                                      setOpenColl(
                                        openColl.filter(
                                          (i) => i !== val.TableName
                                        )
                                      );
                                    }
                                  }}
                                />
                              </Fragment>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </Grid>
                  </Grid>
                  <div className={styles.fixedButton}>
                    <Grid
                      item
                      xs={12}
                      className={"d-flex justify-content-end align-item-center"}
                    >
                      <Button
                        type={"reset"}
                        variant="containedWhite"
                        size={"medium"}
                        onClick={resetForm}
                      >
                        <IntlMessages id={"report.table.button.Reset"} />
                      </Button>
                      <Button
                        className={"ml-3"}
                        disabled={values.name === "" && true}
                        variant="contained"
                        size={"medium"}
                        onClick={submitForm}
                      >
                        <IntlMessages id={"report.table.button.Generate"} />
                      </Button>
                    </Grid>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </JRCard>
    </Fragment>
  );
};

export default memo(ReportTable);
