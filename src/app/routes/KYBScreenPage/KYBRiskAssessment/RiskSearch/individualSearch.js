import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Grid, IconButton, Typography } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
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
import { isNumeric } from "util/index";
import styles from "../KYBRiskAssessment.module.scss";
import SearchBox from "../RiskSearch/SearchBox";
import RiskAssessmentTableShare from "./Table/KYCTableIndividual";
import SearchModal from "./SearchModal";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";

const IndividualSearch = withEnhancedPagination({ key: "individual" })(
  ({ headerTitle, paginationParams, setPaginationParams }) => {
    const dispatch = useDispatch();
    const [data, setData] = React.useState();
    const [openModal, setOpenModal] = React.useState(false);
    const [listAdd, setListAdd] = React.useState([]);
    // eslint-disable-next-line
    const [listKycSelect, setListKycSelect] = React.useState();
    const [itemRemove, setItemRemove] = React.useState();
    const [searchText, setSearchText] = React.useState("");
    // eslint-disable-next-line
    const [selectedValue, setSelectedValue] = React.useState();
    const [textRemark, setTextRemark] = React.useState();
    const [textOfShare, setTextOfShare] = React.useState();
    const [collaspe, setCollaspe] = React.useState(false);
    const riskDetail = useSelector((state) => state.kyb.riskDetail);
    const { formatMessage } = useIntl();
    const [loading, setLoading] = React.useState(false);

    const formikContext = useFormikContext();
    /**
     * Sort local
     */
    React.useEffect(() => {
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
        records = listAdd;
      }
      // eslint-disable-next-line
    }, [paginationParams]);

    React.useEffect(() => {
      if (riskDetail) {
        let arr = riskDetail?.individualShareholder?.map((item) => {
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

    const onChangeSearchText = (text) => {
      paginationParams["search"] = text;
      setSearchText(text);
    };

    React.useEffect(() => {
      if (textOfShare) {
        let index = listAdd?.findIndex((item) => item.kycId === textOfShare.id);
        if (index > -1) {
          /**
           * Update value textRemark
           */
          let objSelect = listAdd[index];
          let updateOkb = {
            ...objSelect,
            percentOfShare: textOfShare.value,
          };
          listAdd[index] = updateOkb;
          formikContext.setFieldValue("individualShareholder", listAdd);
        }
      }
      // eslint-disable-next-line
    }, [textOfShare]);

    React.useEffect(() => {
      if (listAdd) {
        formikContext.setFieldValue("individualShareholder", listAdd);
      }
      // eslint-disable-next-line
    }, [listAdd]);

    React.useEffect(() => {
      if (textRemark) {
        let index = listAdd?.findIndex((item) => item.kycId === textRemark.id);
        if (index > -1) {
          /**
           * Update value textRemark
           */
          let objSelect = listAdd[index];
          let updateOkb = {
            ...objSelect,
            remarks: textRemark.value,
          };
          listAdd[index] = updateOkb;
          formikContext.setFieldValue("individualShareholder", listAdd);
        }
      }
      // eslint-disable-next-line
    }, [textRemark]);

    const onChangeRemark = (text, kycId) => {
      /**
       * Because can not get current list. All action move useEffect
       */
      setTextRemark({ value: text, id: kycId });
    };

    const onChangeOfShare = (numberShare, kycId) => {
      if (isNumeric(numberShare) && numberShare <= 100 && numberShare >= 0) {
        setTextOfShare({ value: numberShare, id: kycId });
      }
    };
    const searchAction = () => {
      dispatch(KYC_ACTION_GET_KYC_REQUESTS(paginationParams)).then((result) => {
        if (result) {
          setData(result);
        }
      });
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

    /**
     * Lister action remove
     */
    React.useEffect(() => {
      if (itemRemove) {
        let arr = listAdd.filter((item) => item.kycId !== itemRemove);
        setListAdd(arr);
      }
      // eslint-disable-next-line
    }, [itemRemove]);

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
      setOpenModal(false);
      let newParam = { sort: "", search: "", page: 0, size: 10 };
      setPaginationParams(newParam);
    };
    const onChangeDropdown = (text, kycId) => {
      /**
       * Because can not get current list. All action move useEffect
       */
      setSelectedValue({ value: text, id: kycId });
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
            kycSelect={listKycSelect}
            onPressAdd={onPressAdd}
            onPressClose={onPressCloseModal}
            resultName={searchText}
            title={<IntlMessages id="kyb.modal.existingKYC" />}
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
                      className="ml-3"
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
                <RiskAssessmentTableShare
                  paginationParams={paginationParams}
                  setPaginationParams={setPaginationParams}
                  data={listAdd}
                  selectedValue={selectedValue}
                  onChangeRemark={onChangeRemark}
                  onChangeDropdown={onChangeDropdown}
                  onPressRemove={(kycId) => onPressRemoveRiskItem(kycId)}
                  onChangeOfShare={onChangeOfShare}
                />
              </Grid>
            )}
          </JRCard>
        </LoadingWrapper>
      </Fragment>
    );
  }
);

export default compose(withPagination)(IndividualSearch);
