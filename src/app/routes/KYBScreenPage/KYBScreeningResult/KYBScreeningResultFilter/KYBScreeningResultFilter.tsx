// @ts-nocheck
import CloseIcon from "@mui/icons-material/Close";
import {
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Popover,
  SvgIcon,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import DatePicker from "@protego/sdk/RegtankUI/v1/DatePicker/DatePicker";
import DropdownItem from "@protego/sdk/RegtankUI/v1/DropdownItem";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import CustomScrollbar from "@protego/sdk/RegtankUI/v1/Scrollbar";
import SearchBox from "@protego/sdk/RegtankUI/v1/SearchBoxDebounce";
import { TextFieldOutlined as TextField } from "@protego/sdk/RegtankUI/v1/TextField";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { ReactComponent as FilterIcon } from "assets/icons/IcFilter.svg";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ReactComponent as KeyboardArrowDownIcon } from "assets/icons/IcoArrowDown.svg";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import SelectAutoComplete from "components/SelectAutoCompletev1";
import { Field, Form, Formik, useFormikContext } from "formik";
import { includes, map } from "lodash";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { KybSimplifiedIndividualMatchDto, Timestamp } from "types/typings-api";
import { countryCodeToName, getCountryLib } from "util/country";
import * as Yup from "yup";
//@ts-ignore
import styles from "./KYBScreeningResultFilter.module.scss";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";

const useStyles = makeStyles({
  root: {
    margin: 0,
    display: "flex",
    justifyContent: "space-between",
  },
  labelPlacementStart: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
});

export interface FilterForm extends Partial<KycSimplifiedIndividualMatchDto> {
  countryOfIncorporation: string;
  hasNotes: boolean;
  lastModifiedByEnd: Timestamp;
  lastModifiedByStart: Timestamp;
  nationalityCodes: string[];
  statuses: KybSimplifiedIndividualMatchDto["status"][];
}
//@ts-ignore
export type FilterProps = {
  className?: string;
  data: KybSimplifiedIndividualMatchDto[];
  onChange: (value: FilterForm) => void;
};

function FilterName(props) {
  const nameList = props?.data;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = (e) => setAnchorEl(null);

  const open = Boolean(anchorEl);
  const outerForm = useFormikContext<FilterForm>();

  return (
    <div className={clsx(styles.filterSelect)}>
      <Button
        variant={"outlinedDropdown"}
        className={clsx({
          [props?.className]: props.className,
        })}
        endIcon={
          <SvgIcon viewBox="0 0 12 8" component={KeyboardArrowDownIcon} />
        }
        onClick={handleClick}
        size="small"
      >
        <Typography variant={"Subtitle2"}>
          {outerForm.values.businessName?.length > 0 ? (
            outerForm.values.businessName
          ) : (
            <IntlMessages id="kyb.businessName" />
          )}
        </Typography>
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        className={styles.singleSelect}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Card className={clsx(styles.Popover)}>
          <CardContent>
            <Field
              component={SelectAutoComplete}
              options={nameList}
              name={"businessName"}
              PopperComponent={"div"}
              PaperComponent={(props) => {
                return (
                  <div>
                    <CustomScrollbar>{props.children}</CustomScrollbar>
                  </div>
                );
              }}
              open={true}
              onChange={(e) => {
                outerForm.submitForm();
                handleClose(e);
              }}
            />
          </CardContent>
        </Card>
      </Popover>
    </div>
  );
}

function FilterNationality(props: FilterProps) {
  const intl = useIntl();
  const classes = useStyles();
  const [selected, setSelected] = React.useState({});
  const [searchText, setSearchText] = useState();
  let countryByName = getCountryLib();
  const [dataCountrySelect, setDataCountrySelect] = useState([]);
  const [dataCountry, setDataCountry] = useState([]);
  const countryList = props.data;

  React.useEffect(() => {
    const countryByNameClone = [...countryByName];
    const dataSelect = countryByNameClone.filter((item) => {
      return includes(countryList, item.code);
    });
    setDataCountrySelect(dataSelect);
    setDataCountry(dataSelect);
    // eslint-disable-next-line
  }, [countryList]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
    setDataCountrySelect(dataCountry);
  };
  const open = Boolean(anchorEl);
  const outerForm = useFormikContext<FilterForm>();
  const setCountry = React.useCallback(
    async (country) => {
      outerForm.setFieldValue("countryOfIncorporation", country);
      await outerForm.submitForm();
    },
    [outerForm]
  );
  React.useEffect(() => {
    if (outerForm.values["countryOfIncorporation"]) {
      const filters = {};
      for (let value of outerForm.values["countryOfIncorporation"]) {
        if (!filters[value]) {
          filters[value] = true;
        }
      }
      // eslint-disable-next-line
      setSelected(filters);
    }
  }, [outerForm.values]);
  const onChange = async (action, property) => {
    // eslint-disable-next-line
    const nationality = Object.keys(action)?.filter(function (key) {
      if (action[key]) {
        return key;
      }
    });
    setCountry(nationality);
  };
  const handleChangeNationality = (event) => {
    const emitValue = {
      // eslint-disable-next-line
      ...selected,
      [event.target.name]: event.target.checked,
    };
    onChange(emitValue, "countryOfIncorporation");
  };
  const onChangeSearch = (text) => {
    setSearchText(text);
    let dataFilter = dataCountry.filter(
      (item) => item.name.toUpperCase().indexOf(text.toUpperCase()) > -1
    );
    setDataCountrySelect(dataFilter);
  };
  let isSelectAll =
    Object.keys(selected)?.length === map(dataCountrySelect, "code")?.length
      ? true
      : false;
  const onPressSelectAll = () => {
    let isSelectAll =
      Object.keys(selected)?.length === map(dataCountrySelect, "code")?.length
        ? true
        : false;
    let filters = {};
    for (let value of map(dataCountrySelect, "code")) {
      if (!filters[value]) {
        filters[value] = true;
      }
    }

    if (isSelectAll) {
      onChange([], "countryOfIncorporation");
      return;
    }
    onChange(filters, "countryOfIncorporation");
  };
  return (
    <div className={clsx(styles.filterSelect)}>
      <Button
        variant={"outlinedDropdown"}
        size={"small"}
        className={clsx({
          [props?.className]: props.className,
        })}
        endIcon={
          <SvgIcon viewBox="0 0 12 8" component={KeyboardArrowDownIcon} />
        }
        onClick={handleClick}
      >
        <Typography variant={"Subtitle2"}>
          <IntlMessages id="kyb.countryOfInCorporationtry" />
        </Typography>
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        className={styles.iconSelect}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <div className={"m-3"}>
          <Grid
            container
            direction={"row"}
            alignItems={"center"}
            justify={"center"}
            spacing={1}
          >
            <Grid item xs={12}>
              <SearchBox
                onChange={onChangeSearch}
                value={searchText}
                placeholder={intl.formatMessage({
                  id: "kyc.filter.search.country.name",
                })}
                iconRight={false}
                disableDebounce
                className={styles.searchBox}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant={"outlinedSecondary"}
                className={clsx(styles.FilterButtonContained)}
                onClick={onPressSelectAll}
                fullWidth
              >
                <Typography variant={"labelFieldForm"}>
                  {isSelectAll ? (
                    <IntlMessages id="audit.filter.un.select.all" />
                  ) : (
                    <IntlMessages id="audit.filter.select.all" />
                  )}
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </div>
        <FormControl className={styles.formStyle}>
          <CustomScrollbar>
            <FormGroup>
              {map(dataCountrySelect, "code")?.map((type, index) => {
                return (
                  <DropdownItem key={index} className={styles.dropdown}>
                    <FormControlLabel
                      labelPlacement={"start"}
                      style={{
                        margin: 0,
                        paddingLeft: toRem(10),
                        paddingRight: toRem(10),
                      }}
                      classes={classes}
                      control={
                        <Checkbox
                          style={{ padding: 0 }}
                          name={type}
                          checked={selected[type] ? selected[type] : false}
                          onChange={handleChangeNationality}
                        />
                      }
                      label={
                        <div className="d-flex align-items-center">
                          <CountryFlagLanguage countryCode={type} svg demonym />
                          <div>{countryCodeToName(type)}</div>
                        </div>
                      }
                    />
                  </DropdownItem>
                );
              })}
            </FormGroup>
          </CustomScrollbar>
        </FormControl>
      </Popover>
    </div>
  );
}

const KYBScreeningResultFilter = function KYBScreeningResultFilter(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const { data, loading } = props;

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const intl = useIntl();

  return (
    <LoadingWrapper loading={loading} size={"3rem"}>
      <div
        className={clsx(styles.FilterContainer, {
          [props?.classes?.filterContainer]: props?.classes?.filterContainer,
        })}
      >
        <span
          className={clsx(styles.textFilter, {
            [props?.classes?.textFilter]: props?.classes?.textFilter,
          })}
        >
          <Typography variant="textLabel">
            <IntlMessages id="appModule.filter.by" />
          </Typography>
        </span>
        <Formik<FilterForm>
          initialValues={{
            matchId: "",
            statuses: [],
            dateOfBirth: null,
            keywords: [],
            lastModifiedByStart: null,
            lastModifiedByEnd: null,
            hasNotes: null,
            nationalityCodes: [],
            businessName: "",
            countryOfIncorporation: "",
          }}
          validationSchema={Yup.object().shape({
            lastModifiedByStart: Yup.date().nullable(),
            lastModifiedByEnd: Yup.date()
              .nullable()
              .transform((curr, orig) => (orig === "" ? null : curr))
              .min(
                Yup.ref("lastModifiedByStart"),
                intl.formatMessage({ id: "filter.time.error" })
              ),
          })}
          onSubmit={(values, actions) => {
            if (values) {
              props.onChange(values);
              handleClose();
            }
          }}
        >
          {({ submitForm, values, handleReset, dirty, isValid }) => {
            return (
              <Form>
                <div className={"d-flex"}>
                  <div className={styles.filterItemMargin}>
                    <FilterName
                      data={data?.businessNames || []}
                      onChange={props.onChange}
                    />
                  </div>
                  <div className={styles.filterItemMargin}>
                    <FilterNationality
                      data={data?.countriesOfIncorporation}
                      onChange={props.onChange}
                    />
                  </div>
                  <div className={"d-flex align-items-center"}>
                    <Typography variant={"textLabel"}>
                      <IntlMessages id="filter.more" />
                    </Typography>
                    <Button
                      variant={"outlinedIcon"}
                      size={"small"}
                      className={styles.moreFilter}
                      onClick={handleClick}
                      className={"ml-2"}
                    >
                      <FilterIcon />
                    </Button>
                  </div>
                </div>
                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  className={styles.morePopover}
                  transformOrigin={{
                    vertical: "center",
                    horizontal: "left",
                  }}
                >
                  <JRCard
                    dense
                    header={
                      <div className={styles.FilterHeader}>
                        <Grid container justifyContent={"space-between"}>
                          <Grid item xs>
                            <Typography variant={"titleForm"}>
                              <IntlMessages
                                id={"appModule.filter.title.moreFilter"}
                              />
                            </Typography>
                          </Grid>
                          <Grid item xs={1}>
                            <IconButton
                              onClick={handleClose}
                              aria-label="cancel"
                              className={styles.CloseIcon}
                            >
                              <CloseIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </div>
                    }
                    headerLine
                  >
                    <div className={styles.Content}>
                      <Grid container rowSpacing={1}>
                        <Grid item xs={12} className={styles.contentItem}>
                          <div className={"d-flex flex-column"}>
                            <Typography variant={"smallDefault"}>
                              <IntlMessages id="screening-id" />
                            </Typography>
                            <TextField
                              formik
                              placeholder={intl.formatMessage({
                                id: "enter-screening-id",
                              })}
                              name={"matchId"}
                              variant={"outlined"}
                              className={"mt-2"}
                            />
                          </div>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          className={styles.contentItem}
                          style={{ marginBottom: "-9px" }}
                        >
                          <div className={"d-flex flex-column"}>
                            <Typography variant={"smallDefault"}>
                              <IntlMessages id="status" />
                            </Typography>
                            <div>
                              <FormControl>
                                <FormGroup row>
                                  <Grid container>
                                    <Grid item xs={6}>
                                      <FormControlLabel
                                        control={
                                          <Field
                                            as={Checkbox}
                                            type={"checkbox"}
                                            name={"statuses"}
                                            value={"UNRESOLVED"}
                                          />
                                        }
                                        label={
                                          <Typography variant="Subtitle2">
                                            <IntlMessages id="unresolved" />
                                          </Typography>
                                        }
                                      />
                                    </Grid>
                                    <Grid item xs={6}>
                                      <FormControlLabel
                                        control={
                                          <Field
                                            as={Checkbox}
                                            type={"checkbox"}
                                            name={"statuses"}
                                            value={"POSITIVE"}
                                          />
                                        }
                                        label={
                                          <Typography variant="Subtitle2">
                                            <IntlMessages id="positive" />
                                          </Typography>
                                        }
                                      />
                                    </Grid>

                                    <Grid item xs={12}>
                                      <FormControlLabel
                                        control={
                                          <Field
                                            as={Checkbox}
                                            type={"checkbox"}
                                            name={"statuses"}
                                            value={"FALSE"}
                                          />
                                        }
                                        label={
                                          <Typography variant="Subtitle2">
                                            <IntlMessages id="false" />
                                          </Typography>
                                        }
                                      />
                                    </Grid>
                                  </Grid>
                                </FormGroup>
                              </FormControl>
                            </div>
                          </div>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          className={styles.contentItem}
                          style={{ marginBottom: "-9px" }}
                        >
                          {data?.keywords?.length > 0 && (
                            <div className={"d-flex flex-column"}>
                              <Typography variant={"smallDefault"}>
                                <IntlMessages id="keywords" />
                              </Typography>
                              <FormControl>
                                <FormGroup row>
                                  <Grid container>
                                    {data.keywords?.map((keyword) =>
                                      keyword ? (
                                        <Grid item xs={6}>
                                          <FormControlLabel
                                            key={keyword}
                                            control={
                                              <Field
                                                as={Checkbox}
                                                type={"checkbox"}
                                                name={"keywords"}
                                                value={keyword}
                                              />
                                            }
                                            label={
                                              <Typography variant="Subtitle2">
                                                {keyword}
                                              </Typography>
                                            }
                                          />
                                        </Grid>
                                      ) : (
                                        <></>
                                      )
                                    )}
                                  </Grid>
                                </FormGroup>
                              </FormControl>
                            </div>
                          )}
                        </Grid>
                        <Grid item xs={12} className={styles.contentItem}>
                          <div className={"d-flex flex-column"}>
                            <Typography variant={"smallDefault"}>
                              <IntlMessages id="last-modified" />
                            </Typography>

                            <div className="mt-2">
                              <Grid container alignItems={"center"} spacing={1}>
                                <Grid item xs={12} className={"d-flex"}>
                                  <div>
                                    <DatePicker
                                      formik
                                      autoOk
                                      name={"lastModifiedByStart"}
                                      placeholder={intl.formatMessage({
                                        id: "start-date",
                                      })}
                                      size={"small"}
                                      disableFuture
                                      format="MMM Do YYYY"
                                    />
                                  </div>
                                  <span className={styles.dash}>-</span>
                                  <div>
                                    <DatePicker
                                      formik
                                      autoOk
                                      name={"lastModifiedByEnd"}
                                      placeholder={intl.formatMessage({
                                        id: "end-date",
                                      })}
                                      size={"small"}
                                      disableFuture
                                      format="MMM Do YYYY"
                                    />
                                  </div>
                                </Grid>
                              </Grid>
                            </div>
                          </div>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          className={styles.contentItem}
                          style={{ paddingLeft: 0, paddingRight: 0 }}
                        >
                          <hr className="m-0" style={{borderColor: ThemeColors.grayText1}} />
                          <div className={styles.Buttons}>
                            <Grid container spacing={1}>
                              <Grid item xs={6}>
                                <Button
                                  variant={"outlinedSecondary"}
                                  type={"reset"}
                                  fullWidth
                                  onClick={() => {
                                    handleReset();
                                    props?.onChange(null);
                                  }}
                                >
                                  <IntlMessages id="filter.button.reset" />
                                </Button>
                              </Grid>
                              <Grid item xs={6}>
                                <Button
                                  type={"submit"}
                                  variant={"contained"}
                                  fullWidth
                                  onClick={submitForm}
                                  disabled={!dirty || !isValid}
                                >
                                  <IntlMessages id="appModule.apply" />
                                </Button>
                              </Grid>
                            </Grid>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </JRCard>
                </Popover>
              </Form>
            );
          }}
        </Formik>
      </div>
    </LoadingWrapper>
  );
};

export default KYBScreeningResultFilter;
