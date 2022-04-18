import { Box, Card, Grid, Popover, Icon } from "@mui/material";
import { makeStyles } from "@mui/styles";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { typeEmail } from "@protego/sdk/utils/regularExpression";
import { KYB_ACTION_INPUT_BUSINESS } from "actions/KYBAction";
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
import clsx from "clsx";
import CreditDeductionModelConfirm from "components/CreditDeductionModelConfirmv1";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import { Switch } from "@protego/sdk/RegtankUI/v1/Switch";
import SelectAutoComplete from "@protego/sdk/RegtankUI/v1/SelectAutoComplete";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import { Field, Form, Formik } from "formik";
import { cloneDeep } from "lodash";
import React, { useRef, useState } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "recompose";
import { getCompanyList } from "util/companyType";
import { getCountryLib } from "util/country";
import withUserSettings from "util/hocs/withUserSettings";
import { getContentMessage } from "util/index";
import { getIndustry } from "util/industry";
import { getSizeOfCompanyList } from "util/sizeOfCompany";
import { snackActions } from "util/snackbarUtils";
import { TEXT_DARK_GRAY } from "constants/ThemeColors";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import * as Yup from "yup";
import CountryFlagLanguage from "components/CountryFlagLanguagev1";
import InputDatepicker from "@protego/sdk/RegtankUI/v1/DatePicker/InputDatepicker";
//@ts-ignore
import styles from "./Business.module.scss";
const useStyles = makeStyles((theme) => ({
  datePicker: {
    width: "100%",
  },
  BrColor: {
    "& .MuiOutlinedInput-input": {
      background: "unset",
    },
  },
  cardReScreening: {
    display: "flex",
    alignItems: "center",
    boxShadow: "none !important",
  },
  reScreening: {
    marginLeft: toRem(0),
  },
}));

const BusinessForm = compose(withUserSettings)(function BusinessForm() {
  const classes = useStyles();
  const countryByName = getCountryLib("name");
  const industryByName = getIndustry();
  const intl = useIntl();
  const dispatch = useDispatch();
  const [switchRescreening, setWitchRescreening] = useState(true);
  const [loading, setLoading] = useState(false);
  const [openConfirmModel, setOpenConfirmModel] = useState(false);
  const companyList = getCompanyList();
  const sizeOfTheCompany = getSizeOfCompanyList();
  const onSwitchRescreening = () => {
    setWitchRescreening(!switchRescreening);
  };

  const formikKybSearchFormRef = useRef();
  const generalSettings = useSelector(({ settings }) => {
    const { generalSettings } = settings;
    return generalSettings;
  });
  const { kybCost, kybOmCost } = generalSettings;

  const validationSchema = Yup.object().shape({
    businessName: Yup.string()
      .required(<IntlMessages id="kyb.from.businessNameIsARequiredField" />)
      .max(150, <IntlMessages id="kyb.from.businessNameIsOnly150Characters" />),
    address1: Yup.string().max(
      150,
      <IntlMessages id="kyb.from.address1IsOnly150Characters" />
    ),
    address2: Yup.string().max(
      150,
      <IntlMessages id="kyb.from.address2IsOnly150Characters" />
    ),
    referenceId: Yup.string()
      .max(
        40,
        <IntlMessages id="appModule.from.referenceIdIsOnly40Characters" />
      )
      .matches(/^[a-zA-Z0-9.@_-]+$/g, {
        message: <IntlMessages id="kyb.referenceIdExcludeSpecialCharacter" />,
        excludeEmptyString: true,
      }),
    email: Yup.string().test(
      "Validate Email",
      <IntlMessages id="kyb.from.emailMustBeAValidEmail"></IntlMessages>,
      (value) => {
        return typeEmail(value);
      }
    ),
    phone: Yup.string().matches(
      /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/,
      {
        message: <IntlMessages id="kyb.from.pleaseEnterAValidPhone" />,
        excludeEmptyString: true,
      }
    ),
  });

  const onSubmitData = async (values) => {
    if (generalSettings.kybSearchConfirmation) {
      setOpenConfirmModel(true);
    } else {
      doSubmit();
    }
  };

  const doSubmit = async () => {
    setOpenConfirmModel(false);
    let values = formikKybSearchFormRef.current.values;
    let data = cloneDeep(values);
    data.companyType = values.companyType !== -1 ? values.companyType : null;
    data.sizeOfTheCompany =
      values.sizeOfTheCompany !== -1 ? values.sizeOfTheCompany : null;
    data.natureOfBusiness =
      values.natureOfBusiness !== -1 ? values.natureOfBusiness?.key : null;
    data.countryOfIncorporation =
      values.countryOfIncorporation !== -1
        ? values.countryOfIncorporation?.code
        : null;
    data.countryOfHeadQuarter =
      values.countryOfHeadQuarter !== -1
        ? values.countryOfHeadQuarter?.code
        : null;
    data.enableReScreening = switchRescreening;
    setLoading(true);
    try {
      await dispatch(KYB_ACTION_INPUT_BUSINESS(data));
    } catch (error) {
      snackActions.error(getContentMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const onResetData = () => {
    setWitchRescreening(true);
  };

  const onCloseConfirmModel = () => {
    setOpenConfirmModel(false);
  };

  const onChangeOM = (e) => {
    const val = e.target.checked;
    formikKybSearchFormRef.current.setFieldValue(
      "enableOnGoingMonitoring",
      val
    );
  };

  const enableOM = formikKybSearchFormRef.current
    ? formikKybSearchFormRef.current.values.enableOnGoingMonitoring
    : false;

  return (
    <LoadingWrapper loading={loading} size={"3rem"}>
      <div className={styles.FormIndividual}>
        <CreditDeductionModelConfirm
          open={openConfirmModel}
          onPressSubmit={doSubmit}
          onPress={onCloseConfirmModel}
          searchType={"KYB"}
          disableButton={loading}
          creditsDeducted={enableOM ? kybCost + kybOmCost : kybCost}
        />

        <Grid container xs={12}>
          <h2
            style={{
              fontSize: toRem(21),
              marginBottom: toRem(29),
              marginTop: toRem(5),
              textAlign: "center",
              color: TEXT_DARK_GRAY,
              fontWeight: 600,
            }}
          >
            <IntlMessages id="kyb.businessInformation" />
          </h2>
          <Grid item xs={12} sm={12} className={classes.BrColor}>
            <Formik
              initialValues={{
                address1: "",
                address2: "",
                businessIdNumber: "",
                businessName: "",
                countryOfIncorporation: "",
                countryOfHeadQuarter: "",
                dateOfIncorporation: null,
                email: "",
                enableReScreening: true,
                natureOfBusiness: -1,
                phone: "",
                referenceId: "",
                relationship: "",
                sizeOfTheCompany: -1,
                website: "",
                companyType: -1,
                enableOnGoingMonitoring: false,
              }}
              onSubmit={onSubmitData}
              validationSchema={validationSchema}
              enableReinitialize={true}
              onReset={onResetData}
              innerRef={formikKybSearchFormRef}
            >
              {({ errors, values, submitForm }) => {
                return (
                  <Form className="d-flex flex-column ">
                    <Grid container spacing={2}>
                      {/* Business Name */}
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          formik
                          name={"businessName"}
                          placeholder={intl.formatMessage({
                            id: "form.businessName",
                          })}
                          label={intl.formatMessage({
                            id: "kyb.businessName",
                          })}
                          required={true}
                        />
                      </Grid>

                      {/*  business ID Number */}
                      <Grid item xs={6} container>
                        <TextField
                          fullWidth
                          formik
                          name={"businessIdNumber"}
                          placeholder={intl.formatMessage({
                            id: "form.businessIDNumber",
                          })}
                          label={intl.formatMessage({
                            id: "kyb.BusinessIDNumber",
                          })}
                        />
                      </Grid>
                      {/* Relationship (Assessor and Assessee) */}
                      <Grid item xs={6}>
                        <TextField
                          style={{ marginTop: "15px" }}
                          fullWidth
                          formik
                          name={"relationship"}
                          placeholder={intl.formatMessage({
                            id: "form.relationship",
                          })}
                          label={intl.formatMessage({
                            id: "kyb.businessRelationship",
                          })}
                        />
                      </Grid>

                      {/*Nature of Business */}
                      <Grid item xs={6}>
                        <Field
                          className={styles.widthBoxYear}
                          name={"natureOfBusiness"}
                          type="select"
                          inputProps={{ "aria-label": "Without label" }}
                          formik
                          style={{ margin: 0 }}
                          component={SelectAutoComplete}
                          placeholder={intl.formatMessage({
                            id: "form.natureOfBusiness",
                          })}
                          label={intl.formatMessage({
                            id: "kyb.NatureOfBusiness",
                          })}
                          options={industryByName}
                          getOptionLabel={(option) =>
                            option.value ? option.value : ""
                          }
                          disableClearable
                          clearOnBlur
                          value={values.natureOfBusiness}
                        />
                      </Grid>

                      {/*Company type */}
                      <Grid item xs={6}>
                        <Field
                          className={styles.widthBoxYear}
                          name={"companyType"}
                          type="select"
                          inputProps={{ "aria-label": "Without label" }}
                          formik
                          style={{ margin: 0 }}
                          component={SelectAutoComplete}
                          placeholder={intl.formatMessage({
                            id: "form.selectCompanyType",
                          })}
                          label={intl.formatMessage({
                            id: "kyb.companyType",
                          })}
                          options={companyList}
                          getOptionLabel={(option) =>
                            option !== -1 ? option : ""
                          }
                          disableClearable
                          error={true}
                          clearOnBlur
                        />
                      </Grid>

                      {/* Size of the Company */}
                      <Grid item xs={6}>
                        <Field
                          className={styles.widthBoxYear}
                          name={"sizeOfTheCompany"}
                          type="select"
                          inputProps={{ "aria-label": "Without label" }}
                          formik
                          style={{ margin: 0 }}
                          component={SelectAutoComplete}
                          placeholder={intl.formatMessage({
                            id: "form.sizeOfTheCompany",
                          })}
                          label={intl.formatMessage({
                            id: "kyb.SizeOfTheCompany",
                          })}
                          options={sizeOfTheCompany}
                          getOptionLabel={(option) =>
                            option !== -1 ? option : ""
                          }
                          disableClearable
                          error={true}
                          clearOnBlur
                        />
                      </Grid>

                      {/* Date Of Incorporation */}
                      <Grid item xs={6}>
                        <InputDatepicker
                          name={"dateOfIncorporation"}
                          label={intl.formatMessage({
                            id: "kyb.DateOfIncorporation",
                          })}
                          placeholder={intl.formatMessage({
                            id: "form.dateOfIncorporation.placeholder",
                          })}
                          formik
                          fullWidth
                        />
                      </Grid>

                      {/* Country of Incorporation*/}
                      <Grid item xs={6}>
                        <Field
                          className={styles.widthBoxYear}
                          name={"countryOfIncorporation"}
                          type="select"
                          inputProps={{ "aria-label": "Without label" }}
                          formik
                          style={{ margin: 0 }}
                          component={SelectAutoComplete}
                          placeholder={intl.formatMessage({
                            id: "form.countryOfIncorporation",
                          })}
                          label={intl.formatMessage({
                            id: "kyb.countryOfInCorporationtry",
                          })}
                          options={countryByName}
                          renderOption={(props, option) => (
                            <Box component="li" {...props}>
                              <CountryFlagLanguage
                                countryCode={option.name}
                                svg
                                displayCountryName
                                disableTooltip
                                demonym
                                size={"26.67"}
                              />
                            </Box>
                          )}
                          getOptionLabel={(option) =>
                            option.name ? option.name : ""
                          }
                          disableClearable
                          clearOnBlur
                          formik
                          value={values.countryOfIncorporation}
                        ></Field>
                      </Grid>

                      {/* Country Of Headquarter Country of Incorporation*/}
                      <Grid item xs={6}>
                        <Field
                          className={styles.widthBoxYear}
                          name={"countryOfHeadQuarter"}
                          type="select"
                          inputProps={{ "aria-label": "Without label" }}
                          formik
                          style={{ marginTop: "-16px" }}
                          component={SelectAutoComplete}
                          placeholder={intl.formatMessage({
                            id: "form.CountryOfHeadquarter",
                          })}
                          label={intl.formatMessage({
                            id: "kyb.CountryOfHeadquarter",
                          })}
                          options={countryByName}
                          renderOption={(props, option) => (
                            <Box component="li" {...props}>
                              <CountryFlagLanguage
                                countryCode={option.name}
                                svg
                                displayCountryName
                                disableTooltip
                                demonym
                                size={"26.67"}
                              />
                            </Box>
                          )}
                          getOptionLabel={(option) =>
                            option.name ? option.name : ""
                          }
                          disableClearable
                          clearOnBlur
                          formik
                          value={values.countryOfHeadQuarter}
                        ></Field>
                      </Grid>

                      {/* website */}
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          formik
                          name={"website"}
                          placeholder={intl.formatMessage({
                            id: "form.website",
                          })}
                          label={intl.formatMessage({
                            id: "kyb.Website",
                          })}
                        />
                      </Grid>

                      {/* Phone Number*/}
                      <Grid item xs={6}>
                        <Field
                          component={TextField}
                          formik
                          fullWidth
                          type="tel"
                          name={"phone"}
                          placeholder={intl.formatMessage({
                            id: "form.phoneNumber",
                          })}
                          label={intl.formatMessage({
                            id: "kyb.phoneNumber",
                          })}
                        />
                      </Grid>

                      {/* Email Address */}
                      <Grid item xs={6}>
                        <Field
                          component={TextField}
                          fullWidth
                          name={"email"}
                          placeholder={intl.formatMessage({
                            id: "form.email",
                          })}
                          label={intl.formatMessage({
                            id: "email-address",
                          })}
                          formik
                        />
                      </Grid>

                      {/* Email Address */}
                      <Grid item xs={6}>
                        <Field
                          component={TextField}
                          fullWidth
                          name={"address1"}
                          placeholder={intl.formatMessage({
                            id: "form.addressEx",
                          })}
                          label={intl.formatMessage({
                            id: "kyb.addressLine1",
                          })}
                        />
                      </Grid>

                      {/* reference ID */}
                      <Grid item xs={6} container>
                        <TextField
                          fullWidth
                          formik
                          name={"referenceId"}
                          inputProps={{
                            maxLength: 40,
                          }}
                          placeholder={intl.formatMessage({
                            id: "form.referenceID",
                          })}
                          label={intl.formatMessage({
                            id: "kyb.ReferenceID",
                          })}
                        />
                      </Grid>

                      {/* switchOnGoingMonitoring */}
                      <Grid item xs={6} className={styles.omMargin}>
                        <Grid container>
                          <Grid item xs={5}>
                            <Card className={classes.cardReScreening}>
                              <span className={classes.reScreening}>
                                <Switch
                                  checked={switchRescreening}
                                  onChange={onSwitchRescreening}
                                  name="reScreening"
                                  inputProps={{
                                    "aria-label": "secondary checkbox",
                                  }}
                                />
                              </span>
                              <div>
                                <span>
                                  <IntlMessages id="re-screening" />
                                </span>
                                <span className="ml-1">
                                  <Tooltip
                                    arrow
                                    placement="top"
                                    title={
                                      <div className="custom-tooltip">
                                        <h5>
                                          <IntlMessages id="setting.kyb.reScreening" />
                                        </h5>
                                        <p>
                                          <FormattedHTMLMessage id="kyb.screen.tooltip.rescreening" />
                                        </p>
                                      </div>
                                    }
                                  >
                                    <QuestionMarkIcon />
                                  </Tooltip>
                                </span>
                              </div>
                            </Card>
                          </Grid>
                          <Grid item xs={6}>
                            <Card className={clsx(classes.cardReScreening)}>
                              <span className={classes.reScreening}>
                                <Switch
                                  checked={values.enableOnGoingMonitoring}
                                  onChange={onChangeOM}
                                  name="enableOnGoingMonitoring"
                                  inputProps={{
                                    "aria-label": "secondary checkbox",
                                  }}
                                />
                              </span>
                              <div>
                                <span>
                                  <IntlMessages id="kyb.filter.OM" />
                                </span>
                                <span className="ml-1">
                                  <Tooltip
                                    title={
                                      <div className="custom-tooltip">
                                        <h5>
                                          <IntlMessages id="kyc.ongoing" />
                                        </h5>
                                        <p>
                                          <FormattedHTMLMessage id="kyc.screen.tooltip.onGoingMonitoring" />
                                        </p>
                                      </div>
                                    }
                                  >
                                    <QuestionMarkIcon />
                                  </Tooltip>
                                </span>
                              </div>
                            </Card>
                          </Grid>
                        </Grid>
                      </Grid>
                      {/* Button Action */}
                      <Grid item xs={12} className={styles.groupAction}>
                        <Box display="flex" justifyContent="flex-end">
                          <Box>
                            <Button
                              style={{ color: ThemeColors.defaultLight }}
                              variant={"outlined"}
                              type={"reset"}
                            >
                              <IntlMessages id="appModule.reset" />
                            </Button>
                          </Box>
                          <Box>
                            <Button
                              style={{
                                backgroundColor: ThemeColors.defaultLight,
                              }}
                              variant={"contained"}
                              className="ml-3"
                              type={"button"}
                              onClick={submitForm}
                            >
                              <IntlMessages id="screen" />
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Form>
                );
              }}
            </Formik>
          </Grid>
        </Grid>
      </div>
    </LoadingWrapper>
  );
});

export default BusinessForm;
