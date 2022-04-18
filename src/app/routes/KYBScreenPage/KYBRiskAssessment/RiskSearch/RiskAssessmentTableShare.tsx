import { SvgIcon, Typography } from "@mui/material";
import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Link from "@protego/sdk/RegtankUI/v1/Link/Link";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable/index";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import { PageResult } from "@protego/sdk/types";
import CustomTable from "@protego/sdk/UI/CustomTable";
import { ReactComponent as CopyIcon } from "assets/images/icons/CopyIcon.svg";
//@ts-ignore
import { ReactComponent as RemoveIcon } from "assets/images/icons/RemoveIcon.svg";
import clsx from "clsx";
import Keyword from "components/Keywordv1";
import RiskRatingLabel from "components/RiskRatingLabelv1";
import UserAvatar from "components/UserAvatar";
import { BUSINESS } from "constants/routes";
import { get, isEmpty } from "lodash";
import React, { Fragment, FunctionComponent } from "react";
import {
  KybSimplifiedRequestDto,
  KycSimplifiedRequestDto,
} from "types/typings-api";
import { formatDate, LONG_DATE, TIME } from "util/date";
//@ts-ignore
import styles from "../KYBRiskAssessment.module.scss";

interface RiskAssessmentTableShareProps {
  data: PageResult<KycSimplifiedRequestDto>;
  dataKYB: PageResult<KybSimplifiedRequestDto>;
  enableEdit: boolean;
  onAddItemToArchiveList: (idItemList: string[]) => void;
  onChangeOfShare: (e: string, kycId: string) => void;
  onChangeRemark: (e: string, kycId: string) => void;
  onPressEnableEdit: (status: boolean, id: string) => void;
  onPressRemove: (kycId: string) => void;
  page: string;
  selectedValue: string;
  tab: string;
}

const RiskAssessmentTableShare: FunctionComponent<RiskAssessmentTableShareProps> = ({
  data,
  onChangeOfShare,
  onPressRemove,
  onChangeRemark,
  page,
  dataKYB,
}) => {
  /**
   * Render Business table
   */
  if (page === BUSINESS) {
    if (isEmpty(dataKYB)) {
      return null;
    }
    return (
      <Fragment>
        <div className="mt-3">
          <CustomTable<KybSimplifiedRequestDto>
            className={styles.tableWrapper}
            //@ts-ignore
            lang={{
              rowsPerPage: <IntlMessages id={"appModule.table.footer"} />,
            }}
            options={{
              selectable: false,
              pagination: false,
            }}
            columnData={{
              kybId: {
                label: <IntlMessages id="kyb.kybId" />,
                sort: true,
                align: "left",
                className: styles.wId,
                renderCell: (v, { status }) => (
                  <div className={clsx(styles.Link, styles.Ids)}>
                    <CopyButton
                      component={"span"}
                      copyIcon={
                        <SvgIcon component={CopyIcon} viewBox="0 0 18 16" />
                      }
                    >
                      <Link
                        to={`/app/screen-kyb/result/${v}${
                          status === "COMPLETED" ? "/riskAssessment" : ""
                        }`}
                        target={"_blank"}
                      >
                        {v}
                      </Link>
                    </CopyButton>
                  </div>
                ),
              },
              riskLevel: {
                sort: true,
                align: "center",
                className: styles.wRiskScore,
                label: <IntlMessages id="risk-level" />,
                //@ts-ignore
                renderCell: (v, { countRiskLevelChange }) => {
                  return (
                    <RiskRatingLabel
                      level={v}
                      value={v?.split("", 1)}
                      size="small"
                      showLevel
                      numberOfChanges={countRiskLevelChange}
                    />
                  );
                },
              },
              businessName: {
                sort: true,
                className: styles.wName,
                style: { wordBreak: "break-all" },
                label: <IntlMessages id="name" />,
              },
              percentOfShare: {
                sort: true,
                label: <IntlMessages id="kyb.table.ofShare" />,
                align: "left",
                className: styles.wPercentOfShare,

                renderCell: (v, { kybId, percentOfShare }) => (
                  <div className={clsx("d-flex")}>
                    <TextField
                      variant={"outlined"}
                      inputProps={{
                        min: 0,
                        maxLength: 6,
                        style: { textAlign: "left" },
                      }} // the change is here
                      value={percentOfShare ? percentOfShare : ""}
                      onChange={(e) => onChangeOfShare(e.target.value, kybId)}
                    />{" "}
                  </div>
                ),
              },
              keywords: {
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
              remarks: {
                sort: false,
                label: <IntlMessages id="kyb.table.Remarks" />,
                align: "left",
                className: styles.wPosition,
                renderCell: (v, { kybId, remarks }) => (
                  <div className={"d-flex align-items-center"}>
                    <TextField
                      variant={"outlined"}
                      style={{ marginBottom: 0 }}
                      className={styles.textRemarks}
                      value={remarks ? remarks : ""}
                      onChange={(e) => onChangeRemark(e.target.value, kybId)}
                    />
                  </div>
                ),
              },
              updatedAt: {
                label: <IntlMessages id="last-modified-by" />,
                sort: true,
                className: styles.width145,
                renderCell: (v, { lastModifiedBy }) => (
                  <div className={"d-flex align-items-center"}>
                    <Nullable
                      component={UserAvatar}
                      user={lastModifiedBy}
                      valueProp={"user"}
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
              remove: {
                label: "",
                sort: false,
                className: styles.width30,
                renderCell: (v, { lastModifiedBy, kybId }) => (
                  <div className={"d-flex align-items-center"}>
                    <span
                      className={clsx(
                        styles.Link,
                        styles.CopyIconHover,
                        "d-flex align-items-center"
                      )}
                      onClick={() => onPressRemove(kybId)}
                    >
                      <RemoveIcon />
                    </span>
                  </div>
                ),
              },
            }}
            data={dataKYB}
          />
        </div>
      </Fragment>
    );
  } else {
    if (isEmpty(data)) {
      return null;
    }
    return (
      <Fragment>
        <div className="mt-3">
          <CustomTable<KycSimplifiedRequestDto>
            className={styles.tableWrapper}
            lang={{
              rowsPerPage: <IntlMessages id={"appModule.table.footer"} />,
            }}
            options={{
              selectable: false,
              pagination: false,
            }}
            columnData={{
              kycId: {
                label: "KYC ID",
                sort: true,
                align: "left",
                className: styles.wId,
                renderCell: (v, { status }) => (
                  <div className={clsx(styles.Link, styles.Ids, "d-flex")}>
                    <CopyButton
                      component={"span"}
                      copyIcon={
                        <SvgIcon component={CopyIcon} viewBox="0 0 18 16" />
                      }
                    >
                      <Link
                        to={`/app/screen-kyc/result/${v}${
                          status === "COMPLETED" ? "/scoring" : ""
                        }`}
                        target={"_blank"}
                      >
                        {v}
                      </Link>
                    </CopyButton>
                  </div>
                ),
              },
              individualRiskScore: {
                sort: true,
                align: "center",
                className: styles.width90,
                label: <IntlMessages id="risk-score" />,
                renderCell: (v) => {
                  const risk = get(v, "risk");
                  const riskLevel = get(v, "riskLevel");
                  const isSan = get(v, "isSanction");
                  const numberOfChanges = get(v, "numberOfChanges");
                  return (
                    <RiskRatingLabel
                      level={riskLevel}
                      value={risk}
                      size="small"
                      type={isSan ? "San" : ""}
                      numberOfChanges={numberOfChanges}
                    />
                  );
                },
              },
              "individualRequest.name": {
                sort: true,
                className: styles.wName,
                style: { wordBreak: "break-all" },
                label: <IntlMessages id="name" />,
              },
              percentOfShare: {
                sort: true,
                className: styles.wPercentOfShare,
                label: <IntlMessages id="kyb.table.ofShare" />,
                align: "left",
                renderCell: (v, { kycId, percentOfShare }) => (
                  <div className={"d-flex"}>
                    <TextField
                      variant={"outlined"}
                      inputProps={{
                        min: 0,
                        maxLength: 6,
                        style: { textAlign: "left" },
                      }}
                      value={percentOfShare ? percentOfShare : ""}
                      onChange={(e) => onChangeOfShare(e.target.value, kycId)}
                    />
                  </div>
                ),
              },
              keywords: {
                label: <IntlMessages id="keywords" />,
                align: "left",
                sort: false,
                className: styles.wKeyword,
                renderCell: (v) => {
                  return <Keyword keywords={v} />;
                },
              },
              remarks: {
                sort: false,
                label: <IntlMessages id="kyb.table.Remarks" />,
                align: "left",
                renderCell: (v, { kycId, remarks }) => (
                  <div className={"d-flex align-items-center"}>
                    <TextField
                      variant={"outlined"}
                      fullWidth
                      style={{ marginBottom: 0 }}
                      className={styles.textRemarks}
                      value={remarks ? remarks : ""}
                      onChange={(e) => onChangeRemark(e.target.value, kycId)}
                    />
                  </div>
                ),
              },
              updatedAt: {
                label: <IntlMessages id="last-modified-by" />,
                sort: true,
                className: styles.width145,
                renderCell: (v, { lastModifiedBy }) => (
                  <div className={"d-flex align-items-center"}>
                    <Nullable
                      component={UserAvatar}
                      user={lastModifiedBy}
                      valueProp={"user"}
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
              remove: {
                label: "",
                sort: false,
                className: styles.width30,
                renderCell: (v, { lastModifiedBy, kycId }) => (
                  <div className={"d-flex align-items-center"}>
                    <span
                      className={clsx(
                        styles.Link,
                        styles.CopyIconHover,
                        "d-flex align-items-center"
                      )}
                      onClick={() => onPressRemove(kycId)}
                    >
                      <RemoveIcon />
                    </span>
                  </div>
                ),
              },
            }}
            data={data}
          />
        </div>
      </Fragment>
    );
  }
};

export default RiskAssessmentTableShare;
