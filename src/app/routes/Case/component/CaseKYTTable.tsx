import { Typography } from "@material-ui/core";
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
import KYTNoteDialogViewer from "app/routes/KYTList/KYTNoteDialogViewer";
//@ts-ignore
import { ReactComponent as NoteIcon } from "assets/icons/IcNote.svg";
import clsx from "clsx";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import RiskRatingLabel from "components/RiskRatingLabel";
import UserAvatar from "components/UserAvatar";
import WalletAddressText from "components/WalletAddressText";
import { KYT_ROUTE_SCREEN } from "constants/routes";
import { get } from "lodash";
import React, { Fragment } from "react";
import { CaseDetailsDto, KytRequestDto } from "types/typings-api";
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

const paginatedSelector = paginatedSelectorCreator<KytRequestDto>(
  (_, props) => (props as any).current.kytList
);

const CaseKYTTable = withEnhancedPagination({ key: "kyt" })(
  function CaseKYTTable(
    props: { current: CaseDetailsDto } & WithPaginationInjectedProps
  ) {
    const [noteKytId, setNoteKytId] = React.useState(null),
      displayData = React.useMemo(() => {
        //@ts-ignore
        return paginatedSelector(null, props);
        // eslint-disable-next-line
      }, [props.current.kytList, props.paginationParams]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const screenObj = window.screen;
    const isSafari =
      navigator.vendor.match(/apple/i) &&
      !navigator.userAgent.match(/crios/i) &&
      !navigator.userAgent.match(/fxios/i);

    const getToFixed = (v) => {
      return isSafari ? v.toFixed(9) : v.toFixed(9);
    };

    const getWithFromScreen = (value) => {
      return isSafari ? 100 : 120;
    };

    const styles = useStyles();

    return (
      <Fragment>
        <JRCard
          headerLine
          fullBody
          header={
            <Typography style={{ fontSize: toRem(21) }}>
              <IntlMessages id={"case.detail.table.kyt.title"} />
            </Typography>
          }
        >
          <CustomTable<KytRequestDto>
            className={clsx(styles.paddingFirstHeader, "mt-0")}
            options={{ selectable: false, pagination: false, isFixedFirstColumn: true  }}
            data={displayData}
            //@ts-ignore
            lang={{
              rowsPerPage: <IntlMessages id={"appModule.table.footer"} />
            }}
            columnData={{
              kytId: {
                label: (
                  <IntlMessages id={"case.detail.table.kyt.header.kycId"} />
                ),
                sort: true,
                enable: true,
                style: { paddingLeft: !isSafari && toRem(32) },
                renderCell: (v) => (
                  <Link
                    to={generatePath(
                      KYT_ROUTE_SCREEN,
                      { id: v },
                      { source: "list" }
                    )}
                  >
                    {v}
                  </Link>
                )
              },
              "addressDetails.risk.risk": {
                label: (
                  <IntlMessages id={"case.detail.table.kyt.header.riskScore"} />
                ),
                sort: true,
                enable: true,
                align: "center",
                renderCell: (v, { addressDetails }) => {
                  const riskLevel = get(addressDetails, "risk.riskLevel");
                  const kytRiskScoreChangeHistory = get(
                    addressDetails,
                    "kytRiskScoreChangeHistory"
                  );
                  return (
                    <RiskRatingLabel
                      level={riskLevel}
                      value={v}
                      numberOfChanges={
                        kytRiskScoreChangeHistory
                          ? kytRiskScoreChangeHistory.length
                          : 0
                      }
                    />
                  );
                }
              },
              address: {
                label: (
                  <IntlMessages
                    id={"case.detail.table.kyt.header.walletAddress"}
                  />
                ),
                sort: true,
                enable: true,
                style: { width: getWithFromScreen(120) },
                renderCell: (v) => {
                  return (
                    <WalletAddressText
                      width={getWithFromScreen(120)}
                      text={v}
                    ></WalletAddressText>
                  );
                }
              },
              asset: {
                label: (
                  <IntlMessages id={"case.detail.table.kyt.header.asset"} />
                ),
                sort: true,
                enable: true
              },
              "addressDetails.currentBalance": {
                label: (
                  <IntlMessages id={"case.detail.table.kyt.header.balance"} />
                ),
                sort: true,
                enable: true,
                renderCell: (v) => ((v as number) ? getToFixed(v) : "-")
              },
              "addressDetails.wallet.name": {
                label: (
                  <IntlMessages
                    id={"case.detail.table.kyt.header.walletName"}
                  />
                ),
                sort: true,
                enable: true,
                renderCell: (v) => <Nullable>{v}</Nullable>
              },
              "addressDetails.wallet.country": {
                label: (
                  <IntlMessages
                    id={"case.detail.table.kyt.header.walletCountry"}
                  />
                ),
                sort: true,
                enable: true,
                align: "center",
                renderCell: (v) => (
                  <Nullable
                    component={CountryFlagLanguage}
                    valueProp={"countryCode"}
                    svg
                  >
                    {v}
                  </Nullable>
                )
              },
              "assignee.firstName": {
                label: (
                  <IntlMessages id={"case.detail.table.kyt.header.assignee"} />
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
                    id={"case.detail.table.kyt.header.lastKytScreenBy"}
                  />
                ),
                sort: true,
                enable: true,
                renderCell: (v, { lastModifiedBy }) => (
                  <div
                    className={"d-flex align-items-center"}
                    // style={{ width: getHeightFromScreen(120) }}
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
                  <IntlMessages id={"case.detail.table.kyt.header.note"} />
                ),
                enable: true,
                align: "center",
                renderCell: (v, { kytId }) => (
                  <div
                    onClick={() => setNoteKytId(kytId)}
                    style={{ cursor: "pointer" }}
                  >
                    <NoteIcon />
                  </div>
                )
              }
            }}
          />
        </JRCard>
        {(props.current.kytList?.length ?? 0) === 0 && (
          <p
            className="text-center"
            style={{
              marginTop: toRem(40),
              fontWeight: 500,
              color: "#808080"
            }}
          >
            <IntlMessages id="no-transactions-yet-for-this-individual" />
          </p>
        )}
        <KYTNoteDialogViewer
          id={noteKytId}
          onClose={() => setNoteKytId(null)}
        />
      </Fragment>
    );
  }
);

export default CaseKYTTable;
