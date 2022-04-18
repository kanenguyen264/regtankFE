import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import React, { memo } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import BusinessTable from "./BusinessTable";
import styles from "./SearchBoxStyle.module.scss";
import { KYC_ACTION_GET_KYC_REQUESTS } from "actions/KYCAction";
import { KYB_ACTION_GET_KYB_REQUESTS } from "actions/KYBAction";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";

const SearchKYBModal = ({
  kybSelect,
  data,
  open,
  onPress,
  onPressAdd,
  onPressClose,
  resultName,
  page,
  dataKYB,
  title,
  paginationParams,
}) => {
  const [listResult, setListResult] = React.useState();
  const [listAdded, setListAdded] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (searchText) {
      checkIsAdded(data);
      return;
    }
    setListResult(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  React.useEffect(() => {
    checkIsAdded(listResult);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listAdded]);

  const checkIsAdded = (list) => {
    let newList = list?.records?.map((item) => {
      let index = listAdded?.findIndex((i) => i.kybId === item?.kybId);

      if (index >= 0) {
        let obj = { ...item, added: true };
        return obj;
      }
      return { ...item, added: false };
    });
    if (!newList) {
      setListResult(data);
      return;
    }

    let updateList = { ...list, records: newList };
    setListResult(updateList);
  };

  const onClose = () => {
    onPressClose();
  };
  const onSave = () => {
    onPressAdd(listAdded);
  };

  const onPressCheck = (rowData) => {
    let index = listAdded?.findIndex((i) => i.kybId === rowData?.kybId);

    if (index > -1) {
      listAdded.splice(index, 1);

      setListAdded([...listAdded]);
    }
  };
  const onPressAddItem = (value) => {
    listAdded.push(value);
    setListAdded([...listAdded]);
  };

  const onPressSearchModal = (text) => {
    setLoading(true);
    let newParam = {
      ...paginationParams,
      search: text,
    };
    dispatch(KYB_ACTION_GET_KYB_REQUESTS(newParam))
      .then((result) => {
        if (result) {
          setListResult(result);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog
      className={styles.dialog}
      disableBackdropClick
      disableEscapeKeyDown
      open={open}
      onClose={onClose}
      title={{
        text: <Typography variant="titleForm">{title}</Typography>,
      }}
      allowCloseOnTitle
      scrollType={"body"}
      okProps={
        listResult?.total_records > 0 && {
          text: "save",
          onClick: onSave,
          disabled: listAdded?.length === 0,
        }
      }
    >
      <LoadingWrapper loading={loading}>
        <div>
          <BusinessTable
            selectedValue={kybSelect}
            data={listResult ? listResult : []}
            page={page}
            onPressCheck={onPressCheck}
            onPressAddItem={onPressAddItem}
            listAdded={listAdded}
            onPressSearchModal={onPressSearchModal}
            resultName={resultName}
          />
        </div>
      </LoadingWrapper>
    </Dialog>
  );
};

export default memo(SearchKYBModal);
