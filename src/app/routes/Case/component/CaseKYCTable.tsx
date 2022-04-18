import { Tooltip, Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CustomTable from "@protego/sdk/UI/CustomTable/CustomTable";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import JRCard from "@protego/sdk/UI/JRCard/JRCard";
import Link from "@protego/sdk/UI/Link";
import Nullable from "@protego/sdk/UI/Nullable/Nullable";
import {
  withEnhancedPagination,
  WithPaginationInjectedProps
} from "@protego/sdk/UI/withPagination";
import { toRem } from "@protego/sdk/utils/measurements";
import { generatePath } from "@protego/sdk/utils/router";
import { KYCNoteDialogViewer } from "app/routes/KYCScreenPage/MyKYC/KYCTable";
//@ts-ignore
import { ReactComponent as NoteIcon } from "assets/icons/IcNote.svg";
//@ts-ignore
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
import clsx from "clsx";
import Keyword from "components/Keyword";
import RiskRatingLabel from "components/RiskRatingLabel";
import ScreenStatusBadge from "components/ScreenStatusBadge";
import UserAvatar from "components/UserAvatar";
import {
  KYC_ROUTE_KYC_SCREEN_RESULT,
  KYC_ROUTE_KYC_SCREEN_SCORING
} from "constants/routes";
import { get } from "lodash";
import React, { Fragment } from "react";
import { CaseDetailsDto, KycSimplifiedRequestDto } from "types/typings-api";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { paginatedSelectorCreator } from "util/selectors";
const useStyles = makeStyles((theme) => ({
  paddingFirstHeader: {
    "& .MuiTableHead-root .MuiTableRow-root .MuiTableCell-root": {
      "&:first-child": {
        paddingLeft: toRem(32)
      }
    }
  }
}));

const paginatedSelector = paginatedSelectorCreator<KycSimplifiedRequestDto>(
  (_, props) => (props as any).current.kycList
);

const CaseKYCTable = withEnhancedPagination({ key: "kyc" })(
  function CaseKYCTable(
    props: { current: CaseDetailsDto } & WithPaginationInjectedProps
  ) {
    const displayData = React.useMemo(() => {
      //@ts-ignore
      return paginatedSelector(null, props);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.current.kycList, props.paginationParams]);
    const [noteKycId, setNoteKycId] = React.useState(null);
    const styles = useStyles();
    //@ts-ignore
    return (
      <Fragment>
        <JRCard
          header={
            <Typography style={{ fontSize: toRem(21) }}>
              <IntlMessages id={"case.detail.table.kyc.title"} />
            </Typography>
          }
          headerLine
          fullBody
        >
          <CustomTable<KycSimplifiedRequestDto>
            className={clsx(styles.paddingFirstHeader, "mt-0 pl-3")}
            //@ts-ignore
            lang={{
              rowsPerPage: <IntlMessages id={"appModule.table.footer"} />
            }}
            columnData={{
              kycId: {
                label: (
                  <IntlMessages id={"case.detail.table.kyc.header.kycId"} />
                ),
                sort: true,
                enable: true,
                style: { paddingLeft: toRem(32) },
                renderCell: (v, { status }) => (
                  <Link
                    to={
                      status === "COMPLETED"
                        ? generatePath(KYC_ROUTE_KYC_SCREEN_SCORING, {
                            kycId: v
                          })
                        : generatePath(KYC_ROUTE_KYC_SCREEN_RESULT, {
                            kycId: v
                          })
                    }
                  >
                    {v}
                  </Link>
                )
              },
              "individualRiskScore.risk": {
                label: (
                  <IntlMessages id={"case.detail.table.kyc.header.riskScore"} />
                ),
                sort: true,
                enable: true,
                align: "center",
                renderCell: (v, { individualRiskScore }) => {
                  const riskLevel = get(individualRiskScore, "riskLevel");
                  const isSan = get(individualRiskScore, "isSanction");
                  const numberOfChanges = get(
                    individualRiskScore,
                    "numberOfChanges"
                  );
                  return (
                    <RiskRatingLabel
                      level={riskLevel}
                      value={v}
                      type={isSan ? "San" : ""}
                      numberOfChanges={numberOfChanges}
                    />
                  );
                }
              },
              "positiveMatch.keywords": {
                label: (
                  <IntlMessages id={"case.detail.table.kyc.header.keyword"} />
                ),
                sort: false,
                enable: true,
                align: "center",
                renderCell: (v) => {
                  return <Keyword keywords={v} />;
                }
              },
              status: {
                sort: false,
                label: (
                  <div className={"d-flex "}>
                    <IntlMessages id={"case.detail.table.kyc.header.status"} />
                    <div className={"pl-1"}>
                      <Tooltip
                        arrow
                        title={
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
                        }
                        enterDelay={300}
                      >
                        <QuestionMarkIcon />
                      </Tooltip>
                    </div>
                  </div>
                ),
                align: "left",
                style: { width: toRem(182) },
                renderCell: (v, { unresolved }) => {
                  return (
                    <div className={clsx("d-flex align-items-center")}>
                      <ScreenStatusBadge
                        type="kyc"
                        status={v}
                        unresolved={unresolved}
                      />
                    </div>
                  );
                }
              },
              "assignee.firstName": {
                label: (
                  <IntlMessages id={"case.detail.table.kyc.header.assignee"} />
                ),
                sort: true,
                enable: true,
                align: "center",
                renderCell: (v, { assignee }) => (
                  <div className="d-flex justify-content-center">
                    <Nullable component={UserAvatar} valueProp={"user"}>
                      {assignee}
                    </Nullable>
                  </div>
                )
              },
              updatedAt: {
                label: (
                  <IntlMessages
                    id={"case.detail.table.kyc.header.lastKycScreenBy"}
                  />
                ),
                sort: true,
                enable: true,
                renderCell: (v, { lastModifiedBy }) => (
                  <div
                    className={"d-flex align-items-center"}
                    style={{ width: toRem(140) }}
                  >
                    <Nullable
                      component={UserAvatar}
                      valueProp={"user"}
                      description={formatDate(v, LONG_DATE_TIME)}
                    >
                      {lastModifiedBy}
                    </Nullable>
                  </div>
                )
              },
              notes: {
                label: (
                  <IntlMessages id={"case.detail.table.kyc.header.note"} />
                ),
                enable: true,
                align: "center",
                renderCell: (v, { kycId }) => (
                  <div
                    onClick={() => setNoteKycId(kycId)}
                    style={{ cursor: "pointer" }}
                  >
                    <NoteIcon />
                  </div>
                )
              }
            }}
            options={{ selectable: false, pagination: false, isFixedFirstColumn: true }}
            data={displayData}
          />
        </JRCard>
        <KYCNoteDialogViewer
          id={noteKycId}
          onClose={() => setNoteKycId(null)}
        />
      </Fragment>
    );
  }
);

export default CaseKYCTable;
