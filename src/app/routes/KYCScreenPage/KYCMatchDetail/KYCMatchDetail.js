import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Button, Grid, IconButton, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Link from "@protego/sdk/RegtankUI/v1/Link";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { baseStyles } from "@protego/sdk/styles/base";
import { generatePath } from "@protego/sdk/utils/router";
import { KYC_ACTION_GET_KYC_MATCH } from "actions/KYCAction";
import { downloadReport, KYCMatchDetailsReport } from "app/reports";
import { BackIcon } from "assets/icons";
import { ReactComponent as ExportIcon } from "assets/icons/IcExport.svg";
import ActivityTracker from "components/ActivityTracker";
import useExportDialog from "components/ExportDialog";
import {
  KYC_ROUTE_KYC_SCREEN_RESULT,
  KYC_ROUTE_MY_KYC,
} from "constants/routes";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { compose } from "recompose";
import { formatDate } from "util/date";
import { getFullName } from "util/string";
import MatchDetail from "./components/MatchDetail/MatchDetail";
import MatchInformation from "./components/MatchInformation/MatchInformation";
import ProfileTable from "./components/ProfileTable";
import styles from "./MatchDetail.module.scss";

const ScreeningResultDetailOuter = (Component) =>
  function ScreeningResultDetailOuter(props) {
    const dispatch = useDispatch();
    const matchDetail = useSelector((state) => state.kyc.currentMatchDetail);
    const printedBy = useSelector((state) => state.me.me);
    const matchNotes = useSelector((state) => state.kyc.matchNotes);
    const exportDialog = useExportDialog();
    const kycId = props.match.params.kycId;
    const matchId = props.match.params.matchId;
    let history = useHistory();

    useEffect(() => {
      dispatch(
        KYC_ACTION_GET_KYC_MATCH({
          kycId: kycId,
          matchId: matchId,
        })
      );
    }, [dispatch, matchId, kycId]);

    const download = useCallback(() => {
      return downloadReport(
        KYCMatchDetailsReport,
        `KYC_MatchDetails_${matchId}_${formatDate(
          new Date(),
          "YYYYMMDDHHmmss"
        )}`,
        {
          notesDetail: matchNotes
            ? matchNotes[matchDetail?.kycId + "@" + matchId]
            : [],
          matchDetail: matchDetail,
          printedBy,
        }
      );
      // eslint-disable-next-line
    }, [matchDetail, matchNotes]);

    const exportPDF = async () => {
      await exportDialog({
        init: download,
        onSuccess: () => {},
      });
    };

    return (
      <>
        <PageHeading
          title={<IntlMessages id={"screening.title"} />}
          className={styles.PageHeading}
          titleButton={
            <Link
              to={generatePath(KYC_ROUTE_KYC_SCREEN_RESULT, {
                kycId: kycId,
              })}
            >
              <BackIcon
                style={{
                  verticalAlign: "text-top",
                  marginRight: toRem(8),
                  height: toRem(16),
                }}
              />
              <IntlMessages id="appModule.back" />
            </Link>
          }
          customUrlResolver={(index, isLast) => {
            if (index === 0) {
              return [<IntlMessages id="url._home" />];
            }
            if (index === 1) {
              return [
                <IntlMessages id="url.acurisKyc" />,
                generatePath(KYC_ROUTE_MY_KYC),
                true,
              ];
            }
            if (index === 2) {
              return [
                <IntlMessages id="screening-result" />,
                generatePath(KYC_ROUTE_KYC_SCREEN_RESULT, {
                  kycId: kycId,
                }),
              ];
            }
            if (index === 3 || index === 4) {
              return [null, null, null, true];
            }

            if (isLast) {
              return [
                <IntlMessages id="screening-result-details" />,
                null,
                false,
              ];
            }
          }}
        />
        <Grid container>
          <Grid item xs={12} className={styles.header}>
            <div className={"d-flex"}>
              <div className="align-items-center d-flex justify-content-between">
                <div className={"mr-2"}>
                  <IconButton
                    className={styles.iconBack}
                    onClick={() =>
                      history.push(
                        generatePath(KYC_ROUTE_KYC_SCREEN_RESULT, {
                          kycId: kycId,
                        })
                      )
                    }
                  >
                    <KeyboardArrowLeftIcon />
                  </IconButton>
                </div>
                <Typography variant="titleForm">{kycId}</Typography>
              </div>
              <div className={"ml-auto d-flex"}>
                <Button
                  className={["ml-3", styles.export]}
                  onClick={exportPDF}
                  variant={"contained"}
                  size={"medium"}
                  startIcon={<ExportIcon />}
                >
                  <IntlMessages id="export"></IntlMessages>
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>

        {matchDetail !== null ? (
          <Component
            matchDetail={matchDetail}
            {...props}
            currentResult={matchDetail.request}
          />
        ) : (
          <div style={{ height: "60vh" }} />
        )}
        <ActivityTracker
          lastModifiedAt={matchDetail?.request?.updatedAt}
          lastModifiedBy={getFullName(matchDetail?.request?.lastModifiedBy)}
          screenedBy={getFullName(matchDetail?.request?.createdBy)}
          screenedAt={matchDetail?.request?.createdAt}
        />
      </>
    );
  };

const ScreeningResultDetail = compose(ScreeningResultDetailOuter)(
  /**
   *
   * @param {MatchResponseDto} matchDetail
   * @param props
   * @returns {JSX.Element}
   * @constructor
   */
  // @ts-ignore
  function KYCMatchDetail({ matchDetail, currentResult }) {
    const requestEntity = {
      assignee: matchDetail.assignee,
      ...matchDetail.request,
    };

    return (
      <Grid container columnSpacing={1.5}>
        <Grid item>
          <div className={styles.wMatchInfo}>
            <MatchInformation
              kycId={matchDetail.kycId}
              requestEntity={requestEntity}
              positiveMatch={matchDetail.positiveMatch}
              archivedAt={
                !matchDetail?.request?.reScreeningEditable &&
                matchDetail?.archivedAt === null
              }
            />
          </div>
        </Grid>
        <Grid item xs>
          <div className={styles.matchDetailContainer}>
            <MatchDetail
              matchDetail={matchDetail}
              currentResult={currentResult}
            />
            <div>
              <ProfileTable
                match={matchDetail.match}
                kycId={matchDetail.kycId}
              />
            </div>
          </div>
        </Grid>
      </Grid>
    );
  }
);

export default compose(withStyles(baseStyles, { index: 99 }))(
  ScreeningResultDetail
);
