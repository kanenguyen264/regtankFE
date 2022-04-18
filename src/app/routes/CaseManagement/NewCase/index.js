import { Grid } from "@mui/material";
import { withStyles } from "@mui/styles";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { baseStyles } from "@protego/sdk/styles/base";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import { generatePath } from "@protego/sdk/utils/router";
import {
  CASE_MANAGEMENT_ACTION_CREATE
} from "actions/CaseManagementAction";
import React, { Fragment } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch, useHistory, withRouter } from "react-router-dom";
import { compose } from "recompose";
import CaseHasNotBeenSaveDlg from "../components/CaseHasNotBeenSaveDlg";
import EditForm from "../components/EditForm/index";
import Relationship from "../components/Relationship";
import {
  CASE_MANAGEMENT_DETAIL_ROUTE, CASE_MANAGEMENT_INDEX_ROUTE
} from "../routes";
import styles from "./style.module.scss";

const NewCase = () => {
  const formikRef = React.useRef();
  const dispatch = useDispatch();
  const history = useHistory();
  const [openNotSaveDlg, setOpenNotSaveDlg] = React.useState(false);

  const handleSubmit = async (params) => {
    dispatch(CASE_MANAGEMENT_ACTION_CREATE(params)).then((res) => {
      history.push(
        generatePath(CASE_MANAGEMENT_DETAIL_ROUTE, {
          id: res?.caseId,
        })
      );
    });
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
              return [<IntlMessages id={"caseManagement.breadcrumb.myCase"} />];
          }
        }}
      />
      <Grid container className={styles.pageWrapper}>
        <Grid item xs={9}>
          <EditForm
            onSubmit={handleSubmit}
            onCancel={() => setOpenNotSaveDlg(true)}
            formikRef={formikRef}
            style={{ marginRight: toRem(30) }}
          />
        </Grid>
        <Grid item xs={3}>
          <Relationship />
        </Grid>
      </Grid>
      <CaseHasNotBeenSaveDlg
        open={openNotSaveDlg}
        onClickCancel={() => {
          setOpenNotSaveDlg(false);
        }}
        onClickOk={() => {
          history.push(CASE_MANAGEMENT_INDEX_ROUTE);
        }}
      />
    </Fragment>
  );
};

export default compose(
  withRouter,
  withStyles(baseStyles, { index: 99 })
)(NewCase);
