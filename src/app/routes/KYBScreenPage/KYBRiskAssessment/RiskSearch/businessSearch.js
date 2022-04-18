import { Grid, IconButton, Typography } from "@mui/material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import withPagination, {
  withEnhancedPagination,
} from "@protego/sdk/RegtankUI/v1/withPagination";

import { KYB_ACTION_GET_KYB_REQUESTS } from "actions/KYBAction";
import clsx from "clsx";
import { useFormikContext } from "formik";
import { get, isNumber, orderBy } from "lodash";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "recompose";
import { isNumeric } from "util/index";
import styles from "../KYBRiskAssessment.module.scss";
import RiskAssessmentTableShare from "./Table/KYCTableBusiness";
import SearchBox from "../RiskSearch/SearchBox";
import SearchModal from "./SearchKYBModal";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import { useIntl } from "react-intl";

const BusinessSearch = withEnhancedPagination({ key: "business" })(
  ({ headerTitle, paginationParams, setPaginationParams }) => {
    const dispatch = useDispatch();
    const [data, setData] = React.useState();
    const [selectedValue, setSelectedValue] = React.useState();
    const [openModal, setOpenModal] = React.useState(false);
    const [listAdd, setListAdd] = React.useState([]);
    // eslint-disable-next-line
    const [listKybSelect, setListKycSelect] = React.useState();
    const [itemRemove, setItemRemove] = React.useState();
    const [searchText, setSearchText] = React.useState("");
    const [textRemark, setTextRemark] = React.useState();
    const [textOfShare, setTextOfShare] = React.useState();
    const formikContext = useFormikContext();
    const riskDetail = useSelector((state) => state.kyb.riskDetail);
    const [collaspe, setCollaspe] = React.useState(false);
    const { formatMessage } = useIntl();

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
        let arr = riskDetail?.businessShareholder?.map((item) => {
          let obj = Object.assign({}, item);
          obj["id"] = item.kybRequest?.id;
          obj["kybId"] = item.kybRequest?.kybId;
          obj["riskLevel"] = item.kybRequest?.riskLevel;
          obj["countRiskLevelChange"] = item.kybRequest?.countRiskLevelChange;
          obj["keywords"] = item.kybRequest?.keywords;
          obj["businessName"] = item?.kybRequest?.businessName;
          obj["editEnable"] = true;
          obj["status"] = item.kybRequest?.status;
          return obj;
        });
        setListAdd(arr);
      }
    }, [riskDetail]);

    React.useEffect(() => {
      if (textOfShare) {
        let index = listAdd?.findIndex((item) => item.kybId === textOfShare.id);
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
          formikContext.setFieldValue("businessShareholder", listAdd);
        }
      }
      // eslint-disable-next-line
    }, [textOfShare]);

    React.useEffect(() => {
      if (textRemark) {
        let index = listAdd?.findIndex((item) => item.kybId === textRemark.id);
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

          formikContext.setFieldValue("businessShareholder", listAdd);
        }
      }
      // eslint-disable-next-line
    }, [textRemark]);

    const onChangeRemark = (text, kybId) => {
      /**
       * Because can not get current list. All action move useEffect
       */
      setTextRemark({ value: text, id: kybId });
    };

    const onChangeOfShare = (text, kybId) => {
      if (isNumeric(text) && text <= 100 && text >= 0) {
        setTextOfShare({ value: text ? text : 0, id: kybId });
      }
    };

    const onChangeSearchText = (text) => {
      paginationParams["search"] = text;
      setSearchText(text);
    };

    const onChangeDropdown = (value) => {
      setSelectedValue(value);
    };

    const searchAction = () => {
      dispatch(KYB_ACTION_GET_KYB_REQUESTS(paginationParams)).then((result) => {
        if (result) {
          setData(result);
        }
      });
    };
    const onPressSearch = () => {
      let newParam = { sort: "", search: searchText, page: 0, size: 10 };
      setPaginationParams({ search: searchText });
      dispatch(KYB_ACTION_GET_KYB_REQUESTS(newParam)).then((result) => {
        if (result) {
          setData(result);
          setOpenModal(true);
        }
      });
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
        formikContext.setFieldValue("businessShareholder", listAdd);
      }
      // eslint-disable-next-line
    }, [listAdd]);
    React.useEffect(() => {
      if (listKybSelect) {
        /**
         * Check item in list search
         */
        let itemSelect = data?.records?.findIndex(
          (item) => item.kybId === listKybSelect
        );
        /**
         * Check item in list add
         */

        let isSelect = listAdd?.findIndex(
          (item) => item.kybId === listKybSelect
        );
        if (isSelect === -1) {
          let item = data?.records[itemSelect];
          let updateOkb = {
            ...item,
            editEnable: true,
          };
          setListAdd([...listAdd, updateOkb]);
        }
      }
      // eslint-disable-next-line
    }, [listKybSelect]);
    /**
     * Lister action remove
     */
    React.useEffect(() => {
      if (itemRemove) {
        let arr = listAdd.filter((item) => item.kybId !== itemRemove);
        setListAdd(arr);
      }

      // eslint-disable-next-line
    }, [itemRemove]);
    const onPressAdd = (kybItem) => {
      setItemRemove("");
      let newList = kybItem?.map((val) => {
        if (val) {
          let isSelect = listAdd?.findIndex(
            (item) => item.kybId === val?.kybId
          );
          if (isSelect === -1) {
            let item = val;

            var updateOkb = {
              ...item,
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
    let collapsibleEnable = collaspe && listAdd?.length > 0 ? true : false;

    return (
      <JRCard
        header={
          <Typography variant="titleForm">
            <span>{headerTitle ? headerTitle : ""}</span>
          </Typography>
        }
        className={
          collapsibleEnable ? styles.jrCardSearch : styles.jrCardSearchCollaspe
        }
      >
        <SearchModal
          open={openModal}
          data={data}
          kycSelect={listKybSelect}
          onPressAdd={onPressAdd}
          onPressClose={onPressCloseModal}
          resultName={searchText}
          page={"business"}
          title={<IntlMessages id="kyb.modal.existingKBC" />}
        />
        <div>
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
                onChangeOfShare={onChangeOfShare}
                onChangeDropdown={onChangeDropdown}
                onPressRemove={(kycId) => setItemRemove(kycId)}
                page={"business"}
              />
            </Grid>
          )}
        </div>
      </JRCard>
    );
  }
);

export default compose(withPagination)(BusinessSearch);
