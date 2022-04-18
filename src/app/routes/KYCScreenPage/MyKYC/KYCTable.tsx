import { Grid, SvgIcon, Typography } from "@mui/material";
import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Link from "@protego/sdk/RegtankUI/v1/Link/Link";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable/index";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { PageResult } from "@protego/sdk/types";
import { generatePath } from "@protego/sdk/utils/router";
import { CASE_ROUTE_DETAIL } from "app/routes/Case/routes";
//@ts-ignore
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
//@ts-ignore
import { ReactComponent as Archive } from "assets/images/icons/Archive.svg";
//@ts-ignore
import { ReactComponent as CopyIcon } from "assets/images/icons/CopyIcon.svg";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguagev1";
import Keyword from "components/Keywordv1";
import NoteDialogViewer, {
  NoteDialogViewerImplementedProps,
} from "components/NoteDialogViewer";
import ReferenceId from "components/ReferenceIdv1";
import RiskRatingLabel from "components/RiskRatingLabelv1";
import ScreenStatusBadge from "components/ScreenStatusBadgev1";
import SearchResultPage from "components/SearchResultPage";
import { TabbedListedContext } from "components/TabbedListedPagev1";
import Tag from "components/Tag";
import {
  KYC_ROUTE_KYC_SCREEN_RESULT,
  KYC_ROUTE_KYC_SCREEN_SCORING,
} from "constants/routes";
import { ESCALATE_TAG, TAG_OM } from "constants/ThemeColors.js";
import { get } from "lodash";
import React, { Fragment, FunctionComponent, useState } from "react";
import { withProps } from "recompose";
import { compose } from "redux";
import { KYCNoteAdapter } from "services/KYCService";
import { KycSimplifiedRequestDto } from "types/typings-api";
import { formatDate, LONG_DATE, TIME } from "util/date";
import { isCompletedStatus } from "util/index";
import { displayLimitText } from "util/string";
//@ts-ignore
import styles from "./KYCList.module.scss";

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
  tab,
  data,
  addFavorite,
  onAddItemToArchiveList,
  searchNotFound,
  onRefresh,
}) => {
  const [viewNote, setViewNote] = useState<string>(null),
    { selected, setSelected } = React.useContext(TabbedListedContext);

  const setSelectedKYC = (value) => {
    setSelected(value);
  };
  React.useEffect(() => {
    setSelected([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRefresh]);

  if (searchNotFound) {
    return (
      <Fragment>
        {searchNotFound && (
          <SearchResultPage
            title={<IntlMessages id={"popup.message.no.search.result"} />}
          />
        )}
      </Fragment>
    );
  }
  return (
    <Fragment>
      <CustomTable<KycSimplifiedRequestDto>
        //@ts-ignore
        lang={{
          rowsPerPage: <IntlMessages id={"appModule.table.footer"} />,
        }}
        labelDisplayedRows={({ from, to, count }) => {
          if (from === 0 && to === 0) {
            return `Showing 0 of 0 transactions`;
          }

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
            label: <IntlMessages id="kyc.kycId" />,
            sort: true,
            align: "left",
            className: styles.wKycId,
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
                    placement={"top-start"}
                    tooltip={
                      <Typography variant="body1">
                        <IntlMessages id="tooltip.copyID" />
                      </Typography>
                    }
                    copyIcon={
                      <SvgIcon component={CopyIcon} viewBox="0 0 18 16" />
                    }
                  >
                    {/*@ts-ignore*/}
                    <Link
                      to={{
                        pathname: isCompletedStatus(status)
                          ? generatePath(KYC_ROUTE_KYC_SCREEN_SCORING, {
                              kycId: v,
                            })
                          : generatePath(KYC_ROUTE_KYC_SCREEN_RESULT, {
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
                        <Tooltip
                          placement={"top-start"}
                          title={
                            <Typography variant="body1">
                              <IntlMessages id="tooltip.moveToArchiveList" />
                            </Typography>
                          }
                          arrow
                        >
                          {/*ts-ignore*/}
                          <div className="d-flex algin-items-end justify-content-center">
                            <SvgIcon component={Archive} viewBox="0 0 18 16" />
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                  )}
                </div>
                <span style={{ display: "flex" }}>
                  {/* escalated */}
                  {escalatedAt && (
                    <Tag
                      color={ESCALATE_TAG.color}
                      brColor={ESCALATE_TAG.brColor}
                      hideTooltip={true}
                      size={"small"}
                      multiLanguage
                      name={<IntlMessages id="kyc.view.log.Escalated" />}
                    />
                  )}
                  {/* OM */}
                  {omUpdated && (
                    <Tag
                      color={TAG_OM.color}
                      brColor={TAG_OM.bg}
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
            align: "center",
            style: { wordBreak: "break-all" },
            className: styles.wRiskScore,
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
                <Typography variant={"body1"}>
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
          "individualRequest.name": {
            sort: true,
            align: "left",
            className: styles.wColName,
            style: { wordBreak: "break-all" },
            label: <IntlMessages id="name" />,
            //@ts-ignore
            renderCell: (v, { blacklistMatched }) => (
              <div className={styles.wColName}>
                <Grid container wrap="nowrap" direction="column">
                  <Grid item xs>
                    <Typography variant="subtitleGray">{v}</Typography>
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
              </div>
            ),
          },
          "individualRequest.dateOfBirth": {
            sort: true,
            align: "left",
            className: styles.wColNational,
            label: <IntlMessages id="date-of-birth" />,
            renderCell: (v) => (
              <div className={"flex-start"}>
                <Typography variant="subtitleGray">
                  <Nullable>{formatDate(v)}</Nullable>
                </Typography>
              </div>
            ),
          },
          "individualRequest.nationality": {
            sort: true,
            className: styles.wColNational,
            label: (
              <div className="ml-2">
                <IntlMessages id="nationality" />
              </div>
            ),
            align: "center",
            renderCell: (v) => (
              <div>
                <Nullable
                  component={CountryFlagLanguage}
                  demonym
                  valueProp={"countryCode"}
                  svg
                >
                  {v}
                </Nullable>
              </div>
            ),
          },
          "individualRequest.keywords": {
            label: <IntlMessages id="keywords" />,
            align: "left",
            className: styles.wKeyword,
            sort: false,
            renderCell: (v) => {
              return (
                <div>
                  <Keyword keywords={v} />
                </div>
              );
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
                  <Tooltip
                    placement="top-start"
                    arrow
                    title={
                      <Typography variant="body1">
                        <div className={"d-flex flex-column"}>
                          <IntlMessages id="appModule.kyc.status.UNRESOLVED" />
                          <br />
                          <IntlMessages id="appModule.kyc.status.NO_MATCH" />
                          <br />
                          <IntlMessages id="appModule.kyc.status.POSITIVE_MATCH" />
                          <br />
                          <IntlMessages id="appModule.kyc.status.COMPLETED" />
                          <br />
                          <IntlMessages id="kyc.change.note.approved" />
                          <br />
                          <IntlMessages id="kyc.change.note.rejected" />
                        </div>
                      </Typography>
                    }
                    enterDelay={300}
                  >
                    <QuestionMarkIcon />
                  </Tooltip>
                </div>
              </div>
            ),
            renderCell: (v, record) => {
              return (
                <div className={"d-flex justify-content-start"}>
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
                  description={
                    <Typography variant="smallGrayDefault">
                      <div className="d-flex flex-column">
                        <div>{formatDate(v, LONG_DATE)}</div>
                        <div>{formatDate(v, TIME)}</div>
                      </div>
                    </Typography>
                  }
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
