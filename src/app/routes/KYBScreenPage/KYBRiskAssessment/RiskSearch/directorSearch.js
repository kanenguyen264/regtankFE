import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Grid, IconButton, Typography } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import withPagination, {
  withEnhancedPagination,
} from "@protego/sdk/RegtankUI/v1/withPagination";
import { KYC_ACTION_GET_KYC_REQUESTS } from "actions/KYCAction";
import { useFormikContext } from "formik";
import { get, isNumber, orderBy } from "lodash";
import React, { Fragment } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "recompose";
import styles from "../KYBRiskAssessment.module.scss";
import SearchBox from "../RiskSearch/SearchBox";
import SearchModal from "./SearchModal";
import RiskAssessmentTable from "./Table/KYCTable";

const DirectorSearch = withEnhancedPagination({ key: "director" })(
  ({ headerTitle, paginationParams, setPaginationParams }) => {
    const dispatch = useDispatch();
    const [data, setData] = React.useState();
    const [selectedValue, setSelectedValue] = React.useState();
    const [openModal, setOpenModal] = React.useState(false);
    const [listAdd, setListAdd] = React.useState([]);
    const [itemRemove, setItemRemove] = React.useState("");
    const [searchText, setSearchText] = React.useState("");
    const [collaspe, setCollaspe] = React.useState(false);
    const formikContext = useFormikContext();
    const [loading, setLoading] = React.useState(false);
    const riskDetail = useSelector((state) => state.kyb.riskDetail);
    const { formatMessage } = useIntl();

    React.useEffect(() => {
      // eslint-disable-next-line
      const { page, size, sort } = paginationParams;

      if (openModal) {
        searchAction();
        return;
      }
      try {
        const sortParams =
          (sort?.length || 0) > 0 ? sort.split(",").map((p) => [p]) : null;
        const keySort = sort ? sort.split(",")[0] : "";
        const typeSort = sort ? sort.split(",")[1] : "";
        let attrPath = `${keySort}`;
        const sortValue = (user) => {
          if (keySort === "individualRiskScore") {
            return get(user, attrPath)?.risk ? get(user, attrPath)?.risk : -1;
          }
          if (isNumber(get(user, attrPath))) {
            /**
             * if sort is number
             */
            return get(user, attrPath) ? get(user, attrPath) : -1;
          }
          /**
           * If sort is string
           */
          return get(user, attrPath) ? get(user, attrPath).toUpperCase() : "";
        };
        var records = (sortParams
          ? orderBy(listAdd, [sortValue], typeSort)
          : listAdd
        ).slice(page * size, (page + 1) * size);
        /**
         * Sort if have value
         */
        records.sort(function (a, b) {
          let data = get(a, attrPath);
          if (data) return -1;
          return 1;
        });
        setListAdd(records);
      } catch (error) {
        /**
         * If sort error set default list
         */
        setListAdd(listAdd);
      }
      // eslint-disable-next-line
    }, [paginationParams]);

    React.useEffect(() => {
      if (riskDetail) {
        let arr = riskDetail?.directorsController?.map((item) => {
          let obj = Object.assign({}, item);
          obj["kycId"] = item.kycRequest?.kycId;
          obj["id"] = item.kycRequest?.id;
          obj["keywords"] = item.kycRequest?.keywords;
          obj["editEnable"] = true;
          obj["individualRequest"] = { name: item?.kycRequest?.name };
          obj["individualRiskScore"] = {
            risk: item.kycRequest?.risk,
            riskLevel: item.kycRequest?.riskLevel,
            numberOfChanges: item.kycRequest?.numberOfChanges,
          };
          obj["status"] = item.kycRequest?.status;
          return obj;
        });
        setListAdd(arr);
      }
    }, [riskDetail]);

    const searchAction = () => {
      dispatch(KYC_ACTION_GET_KYC_REQUESTS(paginationParams)).then((result) => {
        if (result) {
          setData(result);
        }
      });
    };

    const onChangeSearchText = (text) => {
      let newParam = { sort: "", search: searchText, page: 0 };
      setPaginationParams(newParam);
      setSearchText(text);
    };

    const onChangeDropdown = (text, kycId) => {
      /**
       * Because can not get current list. All action move useEffect
       */
      setSelectedValue({ value: text, id: kycId });
    };

    React.useEffect(() => {
      if (selectedValue) {
        var index = listAdd?.findIndex(
          (item) => item.kycId === selectedValue.id
        );
        if (index > -1) {
          /**
           * Update value designationPosition
           */
          var objSelect = listAdd[index];
          if (objSelect) {
            var updateOkb = {
              ...objSelect,
              designationPosition: selectedValue.value,
            };
            listAdd[index] = updateOkb;
            formikContext.setFieldValue("directorsController", listAdd);
          }
        }
      }
      // eslint-disable-next-line
    }, [selectedValue]);

    const onChangeRemark = (text, kycId, data) => {
      let index = data?.findIndex((item) => item.kycId === kycId);
      if (index > -1) {
        /**
         * Update value textRemark
         */
        let objSelect = data[index];
        let updateOkb = {
          ...objSelect,
          remarks: text,
        };
        data[index] = updateOkb;
        formikContext.setFieldValue("directorsController", data);
      }

      /**
       * Because can not get current list. All action move useEffect
       */
    };

    const onPressSearch = () => {
      setLoading(true);
      let newParam = { sort: "", search: searchText, page: 0, size: 10 };
      setPaginationParams({ search: searchText });
      dispatch(KYC_ACTION_GET_KYC_REQUESTS(newParam))
        .then((result) => {
          if (result) {
            setData(result);
            setOpenModal(true);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    };

    React.useEffect(() => {
      if (listAdd) {
        formikContext.setFieldValue("directorsController", listAdd);
      }
      // eslint-disable-next-line
    }, [listAdd]);

    /**
     * Lister action remove
     */
    React.useEffect(() => {
      if (itemRemove) {
        let arr = listAdd.filter((item) => item.kycId !== itemRemove);
        setListAdd(arr);
      }
      // eslint-disable-next-line
    }, [itemRemove, dispatch]);

    const onPressAdd = (kycItem) => {
      setItemRemove("");
      let newList = kycItem?.map((val) => {
        if (val) {
          let isSelect = listAdd?.findIndex(
            (item) => item.kycId === val?.kycId
          );
          if (isSelect === -1) {
            let item = val;

            var updateOkb = {
              ...item,
              keywords: item?.positiveMatch?.keywords,
            };
            return updateOkb;
          }
          return null;
        }
        return null;
      });

      let list = listAdd.concat(newList.filter((item) => item));
      setListAdd([...list]);

      let newParam = { sort: "", search: "", page: 0, size: 10 };
      setPaginationParams(newParam);
      setOpenModal(false);
    };

    const onPressCloseModal = () => {
      /**
       * Update page size default
       */
      let newParam = { sort: "", search: "", page: 0, size: 10 };
      setPaginationParams(newParam);
      setOpenModal(false);
    };

    const onPressRemoveRiskItem = (id) => {
      setItemRemove(id);
    };

    let collapsibleEnable = collaspe && listAdd?.length > 0 ? true : false;

    return (
      <Fragment>
        {openModal && (
          <SearchModal
            open={true}
            data={data}
            onPressAdd={onPressAdd}
            onPressClose={onPressCloseModal}
            resultName={searchText}
            title={<IntlMessages id="kyb.modal.existingKYC" />}
            paginationParams={paginationParams}
          />
        )}
        <LoadingWrapper loading={loading}>
          <JRCard
            header={
              <Typography variant="titleForm">
                <span>{headerTitle ? headerTitle : ""}</span>
              </Typography>
            }
            className={
              collapsibleEnable
                ? styles.jrCardSearch
                : styles.jrCardSearchCollaspe
            }
          >
            <Grid container justify={"center"} alignItems={"center"}>
              <Grid item xs={12}>
                <div className={styles.searchContainer}>
                  <div className="d-flex">
                    <SearchBox
                      onChange={onChangeSearchText}
                      placeholder={formatMessage({
                        id: "kyb.search.content",
                      })}
                    />
                    <Button
                      variant={searchText ? "outlined" : "outlinedSecondary"}
                      disabled={searchText ? false : true}
                      onClick={onPressSearch}
                      type={"submit"}
                      className={"ml-3"}
                    >
                      <IntlMessages id="appModule.apply" />
                    </Button>
                  </div>
                  <div className="algin-items-center d-flex">
                    <IconButton
                      onClick={() => {
                        setCollaspe(!collaspe);
                      }}
                    >
                      {(collaspe && <KeyboardArrowUpIcon />) || (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </div>
                </div>
              </Grid>
            </Grid>
            {collapsibleEnable && (
              <Grid item xs={12}>
                <RiskAssessmentTable
                  paginationParams={paginationParams}
                  setPaginationParams={setPaginationParams}
                  data={listAdd}
                  selectedValue={selectedValue}
                  onChangeRemark={onChangeRemark}
                  onChangeDropdown={onChangeDropdown}
                  onPressRemove={(kycId) => onPressRemoveRiskItem(kycId)}
                />
              </Grid>
            )}
          </JRCard>
        </LoadingWrapper>
      </Fragment>
    );
  }
);

export default compose(withPagination)(DirectorSearch);
