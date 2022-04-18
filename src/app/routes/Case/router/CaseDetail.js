import { Button, Grid, Switch, Typography } from "@material-ui/core";
import CopyButton from "@protego/sdk/UI/CopyButton/CopyButton";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import JRCard from "@protego/sdk/UI/JRCard/JRCard";
import Link from "@protego/sdk/UI/Link";
import Nullable from "@protego/sdk/UI/Nullable";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";

import { toRem } from "@protego/sdk/utils/measurements";
import { CASE_ACTION_GET_CASE_BY_CASEID } from "actions/CaseAction";
import { KYC_ACTION_RE_SCREENING_CASE_DETAILS } from "actions/KYCAction";
import { useCaseRiskLevelChart } from "app/reports/CaseDetailReport/CaseRiskLevelChart";
import { BackIcon } from "assets/icons";
import clsx from "clsx";
import CaseRiskLevel from "components/CaseRiskLevel";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import useExportDialog from "components/ExportDialog";
import Gender from "components/Gender";
import moment from "moment";
import React, { Fragment, useCallback, useEffect, useState, memo } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { formatDate } from "util/date";
import { parseQuery } from "util/stringQuery";
import { CaseDetailReport, downloadReport } from "../../../reports";

import CaseKYCTable from "../component/CaseKYCTable";
import CaseKYTTable from "../component/CaseKYTTable";
import CaseNote from "./CaseNote";
import styles from "./CasePage.module.scss";
import { canAccessKYT } from "util/permision";
import { get } from "lodash";
import {
  dataChartKYT,
  dataChartKYC,
} from "components/DataChartCaseRiskScore/dataChart";
import { withACL } from "../../../../acl";

const IndividualRequestView = memo(
  ({ current, onReScreening, hideContent = false }) => {
    const latestKyc = get(current, "latestKyc");
    const individualRequest = get(latestKyc, "individualRequest");

    return (
      <JRCard
        headerLine
        header={
          <div className={"d-flex align-items-center"}>
            <Typography component="div" style={{ fontSize: 21 > toRem }}>
              <span>
                <IntlMessages id="case.detail.individualRequest.title" /> -{" "}
              </span>
              <CopyButton
                className={clsx(styles.copyButton, "position-relative")}
                component={"span"}
              >
                <span>{current.caseId}</span>
              </CopyButton>
            </Typography>
          </div>
        }
      >
        {!hideContent && (
          <Grid container>
            <Grid item xs={5} container data-border-right>
              <Grid item xs={6} container data-border-right>
                <Grid item>
                  <div>
                    <small className="text-muted">
                      <IntlMessages id="case.detail.individualRequest.name" />
                    </small>
                  </div>
                  <div>
                    <Nullable>{individualRequest?.name}</Nullable>
                  </div>
                </Grid>
                <Grid container>
                  <Grid item xs={6}>
                    <div>
                      <small className="text-muted">
                        <IntlMessages id="case.detail.individualRequest.DOB" />
                      </small>
                    </div>
                    <div>
                      <Nullable>
                        {formatDate(individualRequest?.dateOfBirth)}
                      </Nullable>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div>
                      <small className="text-muted">
                        <IntlMessages id="case.detail.individualRequest.YOB" />
                      </small>
                    </div>
                    <div>
                      <Nullable>{individualRequest?.yearOfBirth}</Nullable>
                    </div>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={6}>
                    <div>
                      <small className="text-muted">
                        <IntlMessages id="case.detail.individualRequest.gender" />
                      </small>
                    </div>
                    <div>
                      {individualRequest ? (
                        <Gender type={individualRequest.gender} />
                      ) : (
                        "-"
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div>
                      <small className="text-muted">
                        <IntlMessages id="case.detail.individualRequest.POB" />
                      </small>
                    </div>
                    <div>
                      <Nullable
                        component={CountryFlagLanguage}
                        valueProp={"countryCode"}
                        displayCountryName
                        svg
                      >
                        {individualRequest?.placeOfBirth}
                      </Nullable>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6} container className={"pl-3 pr-2"}>
                <Grid item xs={12} className="mb-3">
                  <div>
                    <small className="text-muted">
                      <IntlMessages id="case.detail.individualRequest.referenceId" />
                    </small>
                  </div>
                  <div
                    style={{
                      wordBreak: "break-word",
                    }}
                  >
                    <Nullable
                      component={({ children, ...others }) => (
                        <CopyButton component={"span"} {...others}>
                          <span>{children}</span>
                        </CopyButton>
                      )}
                    >
                      {decodeURIComponent(current?.referenceId)}
                    </Nullable>
                  </div>
                </Grid>
                <Grid item xs={12} className="mb-3">
                  <div>
                    <small className="text-muted">
                      <IntlMessages id="case.detail.individualRequest.phoneNumber" />
                    </small>
                  </div>
                  <div>
                    <Nullable>{individualRequest?.phone}</Nullable>
                  </div>
                </Grid>
                <Grid item xs={12} className="mb-3">
                  <div>
                    <small className="text-muted">
                      <IntlMessages id="case.detail.individualRequest.emailAddress" />
                    </small>
                  </div>
                  <div>
                    <Nullable>{individualRequest?.email}</Nullable>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={5} container>
              <Grid item xs={6} container data-border-right className={"pl-3"}>
                <Grid item xs={12} className="mb-3">
                  <div>
                    <small className="text-muted">
                      <IntlMessages id="case.detail.individualRequest.governmentId" />
                    </small>
                  </div>
                  <div>
                    <Nullable>{individualRequest?.governmentIdNumber}</Nullable>
                  </div>
                </Grid>
                <Grid item xs={12} className="mb-3">
                  <div>
                    <small className="text-muted">
                      <IntlMessages id="case.detail.individualRequest.idIssuingCountry" />
                    </small>
                  </div>
                  <div>
                    <Nullable
                      component={CountryFlagLanguage}
                      valueProp={"countryCode"}
                      displayCountryName
                      svg
                    >
                      {individualRequest?.idIssuingCountry}
                    </Nullable>
                  </div>
                </Grid>
                <Grid item xs={12} className="mb-3">
                  <div>
                    <small className="text-muted">
                      <IntlMessages id="case.detail.individualRequest.nationality" />
                    </small>
                  </div>
                  <div>
                    <Nullable
                      component={CountryFlagLanguage}
                      valueProp={"countryCode"}
                      displayCountryName
                      svg
                      demonym
                    >
                      {individualRequest?.nationality}
                    </Nullable>
                  </div>
                </Grid>
              </Grid>
              <Grid item xs={6} container data-border-right className={"pl-3"}>
                <Grid item xs={12} className="mb-3">
                  <div>
                    <small className="text-muted">
                      <IntlMessages id="case.detail.individualRequest.addressLine" />
                      {" 1"}
                    </small>
                  </div>
                  <div>
                    <Nullable>{individualRequest?.address1}</Nullable>
                  </div>
                </Grid>
                <Grid item xs={12} className="mb-3">
                  <div>
                    <small className="text-muted">
                      <IntlMessages id="case.detail.individualRequest.addressLine" />
                      {" 2"}
                    </small>
                  </div>
                  <div>
                    <Nullable>{individualRequest?.address2}</Nullable>
                  </div>
                </Grid>
                <Grid item xs={12} className="mb-3">
                  <div>
                    <small className="text-muted">
                      <IntlMessages id="case.detail.individualRequest.countryOfResidence" />
                    </small>
                  </div>
                  <div>
                    <Nullable
                      component={CountryFlagLanguage}
                      valueProp={"countryCode"}
                      displayCountryName
                      svg
                    >
                      {individualRequest?.countryOfResidence}
                    </Nullable>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={2}>
              <Grid item xs={12} className={"pl-3"}>
                <div>
                  <small className="text-muted">
                    <IntlMessages id="case.detail.individualRequest.reScreening" />
                  </small>
                </div>
                <div>
                  <Switch
                    checked={latestKyc ? latestKyc.enableReScreening : false}
                    onChange={onReScreening}
                    name="reScreening"
                    inputProps={{ "aria-label": "primary checkbox" }}
                    disabled={!(latestKyc && latestKyc?.reScreeningEditable)}
                  />
                </div>
              </Grid>
            </Grid>
          </Grid>
        )}
      </JRCard>
    );
  }
);

const CaseDetail = function CaseDetail({ match, location, history, ACL }) {
  const dispatch = useDispatch();
  const intl = useIntl();
  const exportDialog = useExportDialog();
  const getRiskLevelChart = useCaseRiskLevelChart();

  const { caseId } = match.params;
  const [caseCurrent, setCaseCurrent] = useState(null);

  const current = useSelector((state) => state.case.current);
  const printedBy = useSelector((state) => state.me.me);
  const notes = useSelector((state) => state.case.notes[caseId]);
  const { customerMe } = useSelector((state) => state.settings, shallowEqual);
  const kycList = get(current, "kycList");
  const kytList = get(current, "kytList");
  const dataChartCountKYC = dataChartKYC(kycList, intl);
  const dataChartCountKYT = dataChartKYT(kytList, intl);
  const fetch = useCallback(() => {
    const query = parseQuery(location.search);
    dispatch(
      CASE_ACTION_GET_CASE_BY_CASEID({
        caseId: caseId,
        ...query,
      })
    );
    // eslint-disable-next-line
  }, [dispatch, caseId]);

  const download = useCallback(async () => {
    const chartKyc = await getRiskLevelChart({
      model: dataChartCountKYC,
    });
    const chartKyt = await getRiskLevelChart({
      model: dataChartCountKYT,
    });
    return downloadReport(
      CaseDetailReport,
      `CaseManagement_CaseDetails_${current.caseId}_${moment().format(
        "YYYYMMDD"
      )}`,
      {
        chartKyc: chartKyc,
        chartKyt: chartKyt,
        caseDetail: current,
        printedBy,
        notes: notes || [],
        hideKYCInfo: !ACL.isAllowedPermissions("KYC_MODULE_VIEW"),
        hideKYTInfo:
          !ACL.isAllowedPermissions("KYT_MODULE_VIEW") ||
          !canAccessKYT(customerMe),
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, notes, dataChartCountKYC, dataChartCountKYT]);

  const exportPDF = async () => {
    await exportDialog({
      init: download,
      onSuccess: () => {},
    });
  };

  useEffect(() => {
    setCaseCurrent(current);
  }, [current]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const onReScreening = (event) => {
    dispatch(
      KYC_ACTION_RE_SCREENING_CASE_DETAILS({
        action: event.target.checked,
        kycId: current?.latestKyc?.kycId,
      })
    );
  };

  return (
    <Fragment>
      <PageHeading
        title={<IntlMessages id="case.detail.breadcrumb.header" />}
        titleButton={
          <Link to={"/app/case"}>
            <BackIcon
              style={{
                verticalAlign: "text-top",
                marginRight: 8 > toRem,
                height: 16 > toRem,
              }}
            />
            <span
              style={{
                marginLeft: "8px",
              }}
            >
              <IntlMessages id="appModule.back" />
            </span>
          </Link>
        }
        customUrlResolver={(i, sub) => {
          if (i === 1)
            return [<IntlMessages id="case.breadcrumb.title" />, null, true];
          if (i === 2) return [null, null, null, true];
          if (i === 3) return [decodeURIComponent(sub), false, false];
        }}
      />
      <Grid container className="mb-4">
        <Button
          variant={"contained"}
          className={clsx("mr-2")}
          onClick={exportPDF}
          style={{
            height: toRem(40),
          }}
        >
          <IntlMessages id={"case.button.export"} />
        </Button>
      </Grid>
      {caseCurrent && (
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <IndividualRequestView
              hideContent={!ACL.isAllowedPermissions("KYC_MODULE_VIEW")}
              current={caseCurrent}
              onReScreening={onReScreening}
            />
            {ACL.isAllowedPermissions("KYC_MODULE_VIEW") && (
              <CaseKYCTable current={caseCurrent} />
            )}
            {canAccessKYT(customerMe) &&
              ACL.isAllowedPermissions("KYT_MODULE_VIEW") && (
                <CaseKYTTable current={caseCurrent} />
              )}
          </Grid>
          <Grid item xs={3}>
            {(ACL.isAllowedPermissions("KYC_MODULE_VIEW") ||
              (canAccessKYT(customerMe) &&
                ACL.isAllowedPermissions("KYT_MODULE_VIEW"))) && (
              <CaseRiskLevel
                data={current}
                hideKYTChart={
                  !canAccessKYT(customerMe) ||
                  !ACL.isAllowedPermissions("KYT_MODULE_VIEW")
                }
                hideKYCChart={!ACL.isAllowedPermissions("KYC_MODULE_VIEW")}
              />
            )}
            <CaseNote id={current.caseId} />
          </Grid>
        </Grid>
      )}
    </Fragment>
  );
};

export default withACL(CaseDetail);
