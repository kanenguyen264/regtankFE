import { Add as addIcon } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Button, Icon, Tab } from "@mui/material";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog/Dialog";
import CustomScrollbar from "@protego/sdk/RegtankUI/v1/Scrollbar";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import React, { useEffect, useState } from "react";
import KYC from "./KYC/KYC";
import KYB from "./KYB/KYB";
import KYT from "./KYT/KYT";
import { useAddProfileStyles } from "./muiStyles/indexStyle";
import { useDispatch, useSelector } from "react-redux";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import {
  CASE_MANAGEMENT_ADD_PROFILE,
  CASE_MANAGEMENT_CLEAN_PROFILE,
} from "actions/CaseManagementAction";
import { snackActions } from "util/snackbarUtils";
import { getErrorMsg } from "util/errors";
import styles from './style.module.scss';

const AddToGroupDialog = ({ caseDetail, groupProfileId, button }) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [valueTab, setValueTab] = React.useState(0);
  const dispatch = useDispatch();
  const caseManagementSelector = useSelector((state) => {
    return state.caseManagement;
  });
  const tabSelector = caseManagementSelector.tab;
  const loading = caseManagementSelector.loading;
  const [dataTabs, setDataTab] = useState({
    tabKYC: { searchText: "" },
    tabKYB: { searchText: "" },
    tabKYT: { searchText: "" },
    caseId: caseDetail?.caseId,
    groupProfileId: groupProfileId,
    profileIdsAdded: [],
  });
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDataTab({ ...dataTabs, profileIdsAdded: [] });
    dispatch(CASE_MANAGEMENT_CLEAN_PROFILE());
  };
  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };

  const handleAddGroupProfile = async () => {
    try {
      handleCloseDialog();
      await dispatch(
        CASE_MANAGEMENT_ADD_PROFILE({
          caseId: caseDetail.caseId,
          profileIds: dataTabs.profileIdsAdded,
          groupProfileId: groupProfileId,
        })
      );
      snackActions.success(<IntlMessages id="Add Succeed!" />);
    } catch (err) {
      handleCloseDialog();
      snackActions.error(getErrorMsg(err));
    }
  };

  useEffect(()=>{
    setDataTab({...dataTabs, caseId: caseDetail?.caseId,})
  }, [caseDetail]);

  useEffect(()=>{
    setDataTab({...dataTabs, groupProfileId: groupProfileId})
  }, [groupProfileId]);

  const classes = useAddProfileStyles();

  return (
    <div>
      <div onClick={handleOpenDialog}>{button}</div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        title={"Add Profile"}
        allowCloseOnTitle={true}
        okProps={{
          text: "save",
          onClick: handleAddGroupProfile,
          disabled: dataTabs.profileIdsAdded.length === 0,
        }}
        disableEscapeKeyDown={true}
        className={classes.MuiDialog}
        scrollType={"body"}
      >
        <LoadingWrapper loading={loading}>
          <CustomScrollbar
            autoHeight={false}
            style={{
              width: toRem(676),
              height: toRem(652),
            }}
            classes={{
              scrollbarView: styles.customScrollbarView,
            }}
          >
            <TabContext value={valueTab}>
              <TabList onChange={handleChangeTab} className={classes.MuiTabs}>
                <Tab label={<IntlMessages id={"Add KYC"} />} />
                <Tab label={<IntlMessages id={"Add KYB"} />} />
                <Tab label={<IntlMessages id={"Add KYT"} />} />
              </TabList>
              <div style={{ display: valueTab === 0 ? "block" : "none" }}>
                <KYC
                  listResult={tabSelector.kyc}
                  dataTabs={dataTabs}
                  setDataTab={setDataTab}
                />
              </div>
              <div style={{ display: valueTab === 1 ? "block" : "none" }}>
                <KYB
                  listResult={tabSelector.kyb}
                  dataTabs={dataTabs}
                  setDataTab={setDataTab}
                />
              </div>
              <div style={{ display: valueTab === 2 ? "block" : "none" }}>
                <KYT
                  listResult={tabSelector.kyt}
                  dataTabs={dataTabs}
                  setDataTab={setDataTab}
                />
              </div>
            </TabContext>
          </CustomScrollbar>
        </LoadingWrapper>
      </Dialog>
    </div>
  );
};

export default AddToGroupDialog;
