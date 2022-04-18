import { Grid, Typography, Button } from "@mui/material";
import { withStyles } from "@mui/styles";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { baseStyles } from "@protego/sdk/styles/base";
import { CASE_MANAGEMENT_DETAIL_CASES, CASE_MANAGEMENT_BASIC_LOG } from "actions/CaseManagementAction";
import clsx from "clsx";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter, Switch } from "react-router-dom";
import { compose } from "recompose";
import AddProfile from "../components/AddProfileDialog";
import ApproveGroupBlock from "../components/ApproveGroupBlock";
import CaseNote from "../components/CaseNotes";
import Detail from "../components/Detail/index";
import Relationship from "../components/Relationship";
import { formatCaseDetail } from "./FormatData";
import styles from "./style.module.scss";
import Profile from "./Profile";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading";
import { UPDATE_PROFILE_TABLE } from "actions/CaseManagementAction";
import { snackActions } from "util/snackbarUtils";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import { getErrorMsg } from "util/errors";
import { CASE_MANAGEMENT_INDEX_ROUTE } from "../routes";
import ActivityTracker from "components/ActivityTracker";
import { getFullName } from "util/string";
import { Route } from "react-router-dom";
import { isEmpty } from "lodash";

const CaseDetail = ({ match }) => {
  const { id } = match.params;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(CASE_MANAGEMENT_DETAIL_CASES(id));
  }, []);
  const caseDetailSelector = useSelector((state) => {
    return state.caseManagement.detail;
  });
  const tableProfile = useSelector((state) => {
    return state.profileTable.dataTable;
  });
  const profiles = caseDetailSelector.profiles;
  const caseDetail = formatCaseDetail(caseDetailSelector);
  const basicLog = useSelector((state) => {
    return state.caseManagement.basicLog;
  });

  const updateTableProfile = () => {
    try {
      dispatch(
        UPDATE_PROFILE_TABLE({
          caseId: id,
          profiles: tableProfile,
        })
      ).then((result) => {
        snackActions.success(<IntlMessages id="Update Succeed!" />);
      });
    } catch (error) {
      snackActions.error(getErrorMsg(error));
    }
  };
  return (
    <Fragment>
      <PageHeading
        title={
          <Switch>
            <Route path={CASE_MANAGEMENT_INDEX_ROUTE}>
              <IntlMessages id={"caseManagement.caseDetail"} />
            </Route>
          </Switch>
        }
        customUrlResolver={(_index, sub) => {
          switch (sub) {
            case "case-management":
              return [<IntlMessages id={"url.case-management"} />, null, true];
            case "detail":
              return [null, null, null, true];
          }
          if (_index === 3) {
            return [id, null, false];
          }
        }}
      />
      <ApproveGroupBlock caseId={id} status={caseDetail?.status} />
      <Grid container className={styles.pageWrapper}>
        <Grid item xs={9}>
          <Detail caseDetail={caseDetail} style={{ marginRight: toRem(30) }} />
          <div style={{ marginTop: toRem(30), marginBottom: toRem(20) }}>
            {profiles && (
              <AddProfile caseDetail={caseDetail} profiles={profiles} />
            )}
          </div>
          <Profile
            profiles={caseDetailSelector.profiles}
            caseDetail={caseDetail}
          />
        </Grid>
        <Grid item xs={3}>
          <Relationship profiles={profiles} />
          <JRCard
            className={clsx(styles.notes)}
            header={<span>Notes</span>}
            style={{ marginTop: toRem(30) }}
          >
            <div className={styles.notesBody}>
              <CaseNote
                scrollable={true}
                id={id}
                scrollBarProps={{
                  classes: { vCustomScrollBarTrack: styles.vScrollBarTrack },
                }}
              />
            </div>
          </JRCard>
        </Grid>
      </Grid>
      <Grid container>
        <Grid container xs={9}>
          <ActivityTracker
            style={{ marginTop: 0 }}
            lastModifiedAt={basicLog?.updatedAt}
            lastModifiedBy={getFullName(basicLog?.lastModifiedBy)}
            screenedBy={getFullName(basicLog?.createdBy)}
            screenedAt={basicLog?.createdAt}
          />
        </Grid>
        <Grid xs={3} container justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={updateTableProfile}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default compose(
  withRouter,
  withStyles(baseStyles, { index: 99 })
)(CaseDetail);
