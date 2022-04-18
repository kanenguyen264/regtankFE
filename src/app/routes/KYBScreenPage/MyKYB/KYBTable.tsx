import { SvgIcon,Typography } from "@mui/material";
import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Link from "@protego/sdk/RegtankUI/v1/Link/Link";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable/index";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import { toRem } from "@protego/sdk/utils/measurements";
import { generatePath } from "@protego/sdk/utils/router";
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
import { ReactComponent as Archive } from "assets/images/icons/Archive.svg";
//@ts-ignore
import { ReactComponent as CopyIcon } from "assets/images/icons/CopyIcon.svg";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguagev1";
import Keyword from "components/Keywordv1";
import NoteDialogViewer,{
NoteDialogViewerImplementedProps
} from "components/NoteDialogViewer";
import ReferenceId from "components/ReferenceIdv1";
import RiskRatingLabel from "components/RiskRatingLabelv1";
import ScreenStatusBadge from "components/ScreenStatusBadgev1";
import { TabbedListedContext } from "components/TabbedListedPagev1";
import Tag from "components/Tag";
import UserAvatar from "components/UserAvatar";
import {
KYB_ROUTE_KYB_SCREEN_RESULT,
KYB_ROUTE_RISK_ASSESSMENT
} from "constants/routes";
import { TAG_ESCALATE,TAG_OM } from "constants/ThemeColors";
import React,{ Fragment,FunctionComponent,useEffect,useState } from "react";
import { withProps } from "recompose";
import { compose } from "redux";
import { KYCNoteAdapter } from "services/KYCService";
import { KybSimplifiedRequestDto } from "types/typings-api";
import { formatDate,LONG_DATE_TIME } from "util/date";
import { isCompletedStatus } from "util/index";
import { displayLimitText } from "util/string";
//@ts-ignore
import styles from "./KYBList.module.scss";

export const KYCNoteDialogViewer = (compose(
  withProps(({ id }) => ({
    selector: (state) => state.kyc.notes[id],
    fetcher: KYCNoteAdapter.actionGetAll,
  }))
)(
  NoteDialogViewer
) as unknown) as FunctionComponent<NoteDialogViewerImplementedProps>;

const KYBTable = ({
  parentCallback,
  id,
  data,
  addFavorite,
  onAddItemToArchiveList,
  tab,
  onRefresh,
}) => {
  const [viewNote, setViewNote] = useState<string>(null),
    { selected, setSelected } = React.useContext(TabbedListedContext);
  if (parentCallback) {
    parentCallback(selected);
  }
    const setSelectedKYB = (value) => {
      setSelected(value);
    };
  
  useEffect(() => {
    setSelected([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRefresh]);
  return (
    <Fragment>
      <CustomTable<KybSimplifiedRequestDto>
        lang={{
          rowsPerPage: <IntlMessages id={"appModule.table.footer"} />,
        }}
        options={{
          selectable: true,
          selections: selected,
          onSelected: setSelected,
          onSelected: setSelectedKYB,
          checkHighlight: "hasNewChanges",
          isFixedFirstColumn: true,
        }}
        columnData={{
          kybId: {
            label: <IntlMessages id="kyb.kybId" />,
            sort: true,
            align: "left",
            renderCell: (
              v,
              //@ts-ignore
              { inWatchList, status, escalatedAt, omUpdated }
            ) => (
              <>
                <div
                  className={clsx(
                    styles.Link,
                    styles.Ids,
                    "d-flex align-items-center"
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
                    <Link
                      to={
                        isCompletedStatus(status)
                          ? generatePath(KYB_ROUTE_RISK_ASSESSMENT, {
                              kybId: v,
                            })
                          : generatePath(KYB_ROUTE_KYB_SCREEN_RESULT, {
                              kybId: v,
                            })
                      }
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
                            <Typography>
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
          riskLevel: {
            sort: true,
            align: "center",
            style: { wordBreak: "break-all" },
            className: styles.wRiskScore,
            label: <IntlMessages id="risk-level" />,
            //@ts-ignore
            renderCell: (v, { riskLevel, countRiskLevelChange }) => {
              return (
                <RiskRatingLabel
                  size="small"
                  level={riskLevel}
                  value={riskLevel?.split("", 1)}
                  showLevel
                  numberOfChanges={countRiskLevelChange}
                />
              );
            },
          },
          referenceId: {
            sort: true,
            align: "left",
            label: <IntlMessages id="reference-id" />,
            renderCell: (v) => {
              return (
                <Typography variant={"body1"}>
                  <ReferenceId
                    text={v ? v : "-"}
                    disableCopy={v ? false : true}
                    isRouter={true}
                    limitText={v && displayLimitText(v)}
                  />
                </Typography>
              );
            },
          },
          businessName: {
            sort: true,
            align: "left",
            style: { wordBreak: "break-all", width: toRem(180) },
            label: <IntlMessages id="result.Table.BusinessName" />,
          },
          dateOfIncorporation: {
            sort: true,
            align: "left",
            label: <IntlMessages id="form.dateOfIncorporation" />,
            renderCell: (v) => (
              <div className={"flex-start"}>
                <Nullable>{formatDate(v)}</Nullable>
              </div>
            ),
          },
          countryOfIncorporation: {
            sort: true,
            label: <IntlMessages id="kyb.table.header.countryOf" />,
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
          keywords: {
            label: <IntlMessages id="keywords" />,
            align: "center",
            className: styles.width140,
            sort: false,
            renderCell: (v) => {
              return <Keyword keywords={v} />;
            },
          },
          status: {
            sort: false,
            align: "center",
            label: (
              <div className={"d-flex "}>
                <IntlMessages id="status" />
                <div className={"pl-1"}>
                  <Tooltip
                    arrow
                    title={
                      <div className={"d-flex flex-column"}>
                        <IntlMessages id="kyb.status.UNRESOLVED" />
                        <br />
                        <IntlMessages id="kyb.status.NO_MATCH" />
                        {" / "}
                        <IntlMessages id="screening.result.positiveMatch" />
                        <br />
                        <IntlMessages id="my.kyb.status.COMPLETED" />
                        <br />
                        <IntlMessages id="kyb.status.APPROVED" />
                        {" / "}
                        <IntlMessages id="kyb.status.REJECTED" />
                        <br />
                      </div>
                    }
                    enterDelay={300}
                  >
                    <QuestionMarkIcon />
                  </Tooltip>
                </div>
              </div>
            ),
            className: styles.Status,
            renderCell: (v, record) => (
              <ScreenStatusBadge
                type="kyb"
                status={v}
                unresolved={record?.unresolved}
              />
            ),
          },
          assignee: {
            label: <IntlMessages id="screening.result.Assignee" />,
            align: "center",
            renderCell: (v) => (
              <Nullable
                component={UserAvatar}
                valueProp={"user"}
                style={{ margin: "0 auto" }}
              >
                {v}
              </Nullable>
            ),
          },
          updatedAt: {
            label: <IntlMessages id="last-modified-by" />,
            sort: true,
            align: "left",
            style: { width: 150 },
            renderCell: (v, { lastModifiedBy }) => (
              <div
                className={`align-items-center ${lastModifiedBy && "d-flex"}`}
              >
                <Nullable
                  component={UserAvatar}
                  valueProp={"user"}
                  description={formatDate(v, LONG_DATE_TIME)}
                >
                  {lastModifiedBy}
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

export default KYBTable;
