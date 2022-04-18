import React, { useState } from "react";
import { Grid, Button, Typography, Icon } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import clsx from "clsx";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import ChangeApproval from "../ChangeApproval";
import { CASE_MANAGEMENT_ACTION_UPDATE_APPROVAL } from "actions/CaseManagementAction";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  CASE_MANAGEMENT_INDEX_ROUTE,
} from "../../routes";

const useStyle = makeStyles({
  root: {},
  mr_16: {
    marginRight: `${toRem(16)} !important`,
  },
  mb_20: {
    marginBottom: `${toRem(20)}`,
  },
  ml_8: {
    marginLeft: `${toRem(8)}`,
  },
  caseId: {
    position: "relative",
    top: toRem(2),
    fontWeight: 600,
    color: ThemeColors.mainBlackText,
    opacity: 0.9,
    fontSize: `${toRem(18)} !important`,
  },
  backIcon: {
    fill: `${ThemeColors.mainBlackText} !important`,
  },
  titleWrapper: {
    cursor: "pointer",
  },
});

const ApproveGroupBlock = ({ caseId, status }) => {
  const classes = useStyle();
  const [openChangeStatus, setOpenChangeStatus] = useState(false);
  const [stateApproval, setStateApproval] = React.useState(null);
  const dispatch = useDispatch();
  const history = useHistory();

  React.useEffect(() => {
    setStateApproval(status);
  }, [status]);
  const onPressChangeStatus = (status, note) => {
    setOpenChangeStatus(false);
    dispatch(
      CASE_MANAGEMENT_ACTION_UPDATE_APPROVAL({
        caseId: caseId,
        status: status,
        content: note,
      })
    ).then(() => setStateApproval(status));
  };
  return (
    <Grid
      className={clsx(classes.titleWrapper, classes.mb_20)}
      container
      alignItems="center"
    >
      <Grid item xs={3} onClick={()=>{history.push(CASE_MANAGEMENT_INDEX_ROUTE)}}>
        <Icon className={classes.backIcon} component={ChevronLeft} />
        <span className={classes.caseId}>
          {caseId}
        </span>
      </Grid>
      <Grid
        container
        xs={9}
        justifyContent="flex-end"
        style={{ minHeight: toRem(40) }}
      >
        {status && (
          <ChangeApproval
            openChangeStatus={openChangeStatus}
            setOpenChangeStatus={() => setOpenChangeStatus(!openChangeStatus)}
            onPressChange={onPressChangeStatus}
            status={stateApproval}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default ApproveGroupBlock;
