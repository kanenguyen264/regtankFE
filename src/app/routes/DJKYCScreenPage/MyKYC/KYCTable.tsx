import { PageResult } from "@protego/sdk/types";
import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Link from "@protego/sdk/RegtankUI/v1/Link/Link";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable/index";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { displayLimitText } from "util/string";
import ReferenceId from "components/ReferenceIdv1";
import Keyword from "components/Keywordv1";
import ScreenStatusBadge from "components/ScreenStatusBadgev1";
import { TabbedListedContext } from "components/TabbedListedPagev1";
import RiskRatingLabel from "components/RiskRatingLabelv1";
import { generatePath } from "@protego/sdk/utils/router";
import { CASE_ROUTE_DETAIL } from "app/routes/Case/routes";
//@ts-ignore
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
//@ts-ignore
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguagev1";
import NoteDialogViewer, {
  NoteDialogViewerImplementedProps,
} from "components/NoteDialogViewer";
import SearchResultPage from "components/SearchResultPage";
import Tag from "components/Tag";
import {
  DJ_KYC_ROUTE_KYC_SCREEN_RESULT,
  DJ_KYC_ROUTE_KYC_SCREEN_SCORING,
} from "constants/routes";
import { BG_TAG, TAG_ESCALATE, TEXT_TAG } from "constants/ThemeColors";
import { get } from "lodash";
import React, {Fragment, FunctionComponent, useEffect, useState} from "react";
import { withProps } from "recompose";
import { compose } from "redux";
import { KYCNoteAdapter } from "services/KYCService";
import { KycSimplifiedRequestDto } from "types/typings-api";
import { formatDate, getFullDateTime, LONG_DATE_TIME } from "util/date";
import { isCompletedStatus } from "util/index";
import CustomTooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
//@ts-ignore
import styles from "./KYCList.module.scss";
import {Grid, SvgIcon, Typography} from "@mui/material";
// @ts-ignore
import { ReactComponent as Archive } from "assets/images/icons/Archive.svg";
// @ts-ignore
import { ReactComponent as CopyIcon } from "assets/images/icons/CopyIcon.svg";

export const KYCNoteDialogViewer = (compose(
  withProps((props: any) => ({
    selector: (state) => state.kyc.notes[props.id],
    fetcher: KYCNoteAdapter.actionGetAll,
  }))
)(
  NoteDialogViewer
) as unknown) as FunctionComponent<NoteDialogViewerImplementedProps>;

interface KYCTableProps {
  addFavorite: (kycId: string, inWatchList: boolean) => void;
  data: PageResult<KycSimplifiedRequestDto>;
  onAddItemToArchiveList: (idItemList: string[]) => void;
  onRefresh: any;
  searchNotFound: boolean;
  tab: string;
}

const KYCTable: FunctionComponent<KYCTableProps> = ({
  data,
  searchNotFound,
  onRefresh,
  tab,
  addFavorite,
  onAddItemToArchiveList,
}) => {
  const [viewNote, setViewNote] = useState<string>(null),
    { selected, setSelected } = React.useContext(TabbedListedContext);
  const setSelectedKYC = (value) => {
    setSelected(value);
  };
  useEffect(() => {
    setSelected([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRefresh]);
  return (
    <Fragment>
      {searchNotFound && (
        <SearchResultPage
          title={<IntlMessages id={"popup.message.no.search.result"} />}
        />
      )}
      <CustomTable<KycSimplifiedRequestDto>
        //@ts-ignore
        lang={{
          rowsPerPage: <IntlMessages id={"appModule.table.footer"} />,
        }}
        labelDisplayedRows={({ from, to, count }) => {
          return `Showing ${from}–${to} of ${
            count !== -1 ? count : `more than ${to}`
          }  transactions`;
        }}
        options={{
          selectable: true,
          selections: selected,
          onSelected: setSelectedKYC,
          checkHighlight: "hasNewChanges",
          isFixedFirstColumn: true,
          pagination: true,
        }}
        columnData={{
          kycId: {
            label: <IntlMessages id="djkyc.kycId" />,
            sort: true,
            align: "left",
            renderCell: (
              v,
              //@ts-ignore
              {
                inWatchList,
                status,
                //@ts-ignore
                escalatedAt,
                omUpdated,
              }
            ) => (
              <>
                <div
                  className={clsx(
                    styles.Link,
                    styles.Ids,
                    "d-flex align-items-end"
                  )}
                >
                  <CopyButton
                    component={"span"}
                    copyIcon={
                      <CustomTooltip
                        placement="top"
                        title={
                          <IntlMessages id="tooltip.copyID" />
                        }
                        arrow
                      >
                        <SvgIcon component={CopyIcon} viewBox="0 0 18 16" />
                      </CustomTooltip>
                    }
                  >
                    {/*@ts-ignore*/}
                    <Link
                      to={{
                        pathname: isCompletedStatus(status)
                          ? generatePath(DJ_KYC_ROUTE_KYC_SCREEN_SCORING, {
                            kycId: v,
                          })
                          : generatePath(DJ_KYC_ROUTE_KYC_SCREEN_RESULT, {
                            kycId: v,
                          }),
                        state: { fromKYC: true },
                      }}
                    >
                      <Typography>{v}</Typography>
                    </Link>
                  </CopyButton>
                  {tab && (
                    <div onClick={() => onAddItemToArchiveList([v])}>
                      <div className={styles.addButton}>
                        <CustomTooltip
                          placement="top"
                          title={
                            <IntlMessages id="tooltip.moveToArchiveList" />
                          }
                          arrow
                        >
                          {/*ts-ignore*/}
                          <div className="d-flex algin-items-end justify-content-center">
                            <SvgIcon component={Archive} viewBox="0 0 18 16" />
                          </div>
                        </CustomTooltip>
                      </div>
                    </div>
                  )}
                </div>
                <span style={{ display: "flex" }}>
                  {/* escalated */}
                  {escalatedAt && (
                    <Tag
                      color={TAG_ESCALATE.color}
                      brColor={TAG_ESCALATE.brColor}
                      hideTooltip={true}
                      size={"small"}
                      multiLanguage
                      name={<IntlMessages id="kyc.view.log.Escalated" />}
                    />
                  )}
                  {/* OM */}
                  {omUpdated && (
                    <Tag
                      color={TEXT_TAG}
                      brColor={BG_TAG}
                      hideTooltip={true}
                      size={"small"}
                      multiLanguage
                      name={<IntlMessages id="appModule.OMUpdated" />}
                    />
                  )}
                </span>
              </>
            ),
          },
          "individualRiskScore.sortableRisk": {
            sort: true,
            align: "left",
            style: { wordBreak: "break-all" },
            className: styles.width115,
            label: <IntlMessages id="risk-score" />,
            renderCell: (v, { individualRiskScore }) => {
              const risk = get(individualRiskScore, "risk");
              const riskLevel = get(individualRiskScore, "riskLevel");
              const numberOfChanges = get(
                individualRiskScore,
                "numberOfChanges"
              );
              return (
                <RiskRatingLabel
                  level={riskLevel}
                  value={risk}
                  type={individualRiskScore?.isSanction === true ? "San" : ""}
                  numberOfChanges={numberOfChanges}
                />
              );
            },
          },
          "individualRequest.referenceId": {
            sort: true,
            align: "left",
            label: <IntlMessages id="reference-id" />,
            className: styles.Update,
            renderCell: (v) => {
              const href =
                v &&
                generatePath(
                  CASE_ROUTE_DETAIL,
                  { caseId: encodeURIComponent(v) },
                  { reference: true }
                );
              if (!v) {
                return <IntlMessages id={"appModule.hyphen"} />;
              }
              return (
                <Typography>
                  <ReferenceId
                    text={v ? v : "-"}
                    href={href}
                    disableCopy={v ? false : true}
                    isRouter={true}
                    limitText={v && displayLimitText(v)}
                  />
                </Typography>
              );
            },
          },
          "individualRequest.fullName": {
            sort: true,
            align: "left",
            className: styles.Name,
            style: { wordBreak: "break-all" },
            label: (
              <>
                <div className="d-flex align-items-center">
                  <IntlMessages id="name" />
                </div>
              </>
            ),
            //@ts-ignore
            renderCell: (v, { blacklistMatched }) => (
              <Grid container wrap="nowrap" direction="column">
                <Grid item xs>
                  <Typography>{v}</Typography>
                </Grid>
                {blacklistMatched && (
                  <Grid item xs>
                    <div className={styles.KeywordWrap}>
                      <div className={styles.Badge}>
                        <IntlMessages id="kyc.internalBlacklist" />
                      </div>
                    </div>
                  </Grid>
                )}
              </Grid>
            ),
          },
          "individualRequest.dateOfBirth": {
            sort: true,
            align: "left",
            className: styles.width120,
            label: <IntlMessages id="date-of-birth" />,
            renderCell: (v) => (
              <div className={"flex-start"}>
                <Typography>
                  <Nullable>{formatDate(v)}</Nullable>
                </Typography>
              </div>
            ),
          },
          "individualRequest.nationality": {
            sort: true,
            className: styles.width115,
            label: <IntlMessages id="nationality" />,
            align: "center",
            renderCell: (v) => (
              <Nullable
                component={CountryFlagLanguage}
                demonym
                valueProp={"countryCode"}
                svg
              >
                {v}
              </Nullable>
            ),
          },
          "positiveMatch.keywords": {
            label: <IntlMessages id="keywords" />,
            align: "center",
            className: styles.wKeywords,
            sort: false,
            renderCell: (v) => {
              return <Keyword keywords={v} />;
            },
          },
          status: {
            sort: false,
            align: "left",
            className: styles.wStatus,
            label: (
              <div className={"d-flex"}>
                <IntlMessages id="status" />
                <div className={"pl-1"}>
                  <CustomTooltip
                    placement="top-start"
                    arrow
                    title={
                      <div className={"d-flex flex-column"}>
                        &bull; <IntlMessages id="appModule.kyc.status.UNRESOLVED" />
                        <br />
                        &bull; <IntlMessages id="appModule.kyc.status.NO_MATCH" />
                        <br />
                        &bull; <IntlMessages id="appModule.kyc.status.POSITIVE_MATCH" />
                        <br />
                        &bull; <IntlMessages id="appModule.kyc.status.COMPLETED" />
                      </div>
                    }
                    enterDelay={300}
                  >
                    <QuestionMarkIcon />
                  </CustomTooltip>
                </div>
              </div>
            ),
            renderCell: (v, record) => {
              return (
                <div className={`d-flex justify-content-start ${styles.contentStatus}`}>
                  <ScreenStatusBadge
                    type="kyc"
                    status={v}
                    unresolved={record.unresolved}
                  />
                </div>
              );
            },
          },
          assignee: {
            label: (
              <div className={styles.assignPadding}>
                <IntlMessages id="screening.result.Assignee" />
              </div>
            ),
            align: "left",
            className: styles.assign,
            renderCell: (v) => (
              <Nullable
                className={styles.assignPadding}
                component={UserAvatar}
                valueProp={"user"}
                size={32}
              >
                {v}
              </Nullable>
            ),
          },
          updatedAt: {
            label: <IntlMessages id="last-modified-by" />,
            sort: true,
            align: "left",
            className: styles.Update,
            renderCell: (v, { lastModifiedBy }) => (
              <div
                className={`align-items-center ${lastModifiedBy && "d-flex"}`}
              >
                <Nullable
                  component={UserAvatar}
                  user={lastModifiedBy}
                  size={32}
                  description={formatDate(v, LONG_DATE_TIME)}
                >
                  <Typography>{lastModifiedBy}</Typography>
                </Nullable>
              </div>
            ),
          },
        }}
        data={data}
      />
      <KYCNoteDialogViewer id={viewNote} onClose={() => setViewNote(null)} />
    </Fragment>
  );
};

export default KYCTable;
