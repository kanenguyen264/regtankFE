import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import AssigneeEditor from "@protego/sdk/RegtankUI/v1/AssigneeEditor";
import { toRem } from "@protego/sdk/utils/measurements";
import { useIntl } from "react-intl";
import { GET_AVAILABLE_ASSIGN } from "actions/Staff";
import { CASE_MANAGEMENT_DETAIL_ASSIGN } from "actions/CaseManagementAction";
import { useDispatch, useSelector } from "react-redux";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import clsx from "clsx";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";

const useStyle = makeStyles({
  root: {},
  assignWrapper: {
    display: "flex",
    "& .assignLabel": {
      position: "relative",
      top: toRem(8),
      marginRight: toRem(20),
    },
    "& .assignEditor": {
      width: toRem(221),
    },
    "& .MuiCircularProgress-root":{
      width: "1rem",
      height: "1rem",
      position: "relative",
      left: toRem(-92),
    }
  },
});

const AssignSelect = ({ userAssigned, caseId }) => {
  const intl = useIntl();
  const classes = useStyle();
  const { formatMessage } = intl;
  const dispatch = useDispatch();
  const [userSelected, setUserSelected] = useState(userAssigned);
  const [loading, setLoading] = useState(false);
  const usersAvaiable = useSelector((state) => {
    return state.staff.userAvailableAssign;
  });
  const caseDetailAssign = useSelector((state) => {
    return state.caseManagement.detail.assign;
  });

  useEffect(() => {
    if (userAssigned) {
      setUserSelected(userAssigned);
    }
  }, [userAssigned]);
  useEffect(() => {
    dispatch(GET_AVAILABLE_ASSIGN({ params: "CASE_MANAGEMENT" }));
  }, []);

  const changeAssign = async (optionSelected, setAnchorEl, setSelectedValue) => {
    if(optionSelected?.id) {
      setLoading(true);
      setAnchorEl(null)
      setSelectedValue(optionSelected)
      await dispatch(
        CASE_MANAGEMENT_DETAIL_ASSIGN({
          userId: optionSelected?.id,
          caseId: caseId,
        })
      );
    }
    setLoading(false);
  };
  return (
    <div className={clsx(classes.assignWrapper, "assignWrapper")}>
      <Typography
        className={"assignLabel"}
        variant="labelFieldForm"
        component="div"
      >
        Assignee
      </Typography>
      <LoadingWrapper loading={loading}>
        <div className={"assignEditor"}>
          <AssigneeEditor
            placeholder={intl.formatMessage({id: "kyc.add.new.group.enter.name"})}
            data={usersAvaiable || []}
            selected={userSelected}
            customOnChange={changeAssign}
          />
        </div>
      </LoadingWrapper>
    </div>
  );
};

export default AssignSelect;
