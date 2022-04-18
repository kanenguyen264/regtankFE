import { SvgIcon, TextField, Typography } from "@mui/material";
import CopyButton from "@protego/sdk/RegtankUI/v1/CopyButton";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Link from "@protego/sdk/RegtankUI/v1/Link/Link";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable/index";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
// import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { PageResult } from "@protego/sdk/types";
import CustomTable from "@protego/sdk/UI/CustomTable";
import { ReactComponent as CopyIcon } from "assets/images/icons/CopyIcon.svg";
//@ts-ignore
import { ReactComponent as RemoveIcon } from "assets/images/icons/RemoveIcon.svg";
import clsx from "clsx";
import DropdownList from "components/Dropdown/DropdownList";
import Keyword from "components/Keywordv1";
import RiskRatingLabel from "components/RiskRatingLabelv1";
import { DesignationList } from "constants/Designation";
import { get, isEmpty } from "lodash";
import React, { Fragment, FunctionComponent } from "react";
import { KycSimplifiedRequestDto } from "types/typings-api";
import { formatDate, LONG_DATE, TIME } from "util/date";
//@ts-ignore
import styles from "../KYBRiskAssessment.module.scss";

interface RiskAssessmentTableProps {
  data: PageResult<KycSimplifiedRequestDto>;
  onAddItemToArchiveList: (idItemList: string[]) => void;
  onChangeDropdown: (value: string, id: string) => void;
  onChangeRemark: (e: string, id: string) => void;
  onPressRemove: (id: string) => void;
  selectedValue: string;
  tab: string;
}

const RiskAssessmentTable: FunctionComponent<RiskAssessmentTableProps> = ({
  data,
  onChangeDropdown,
  onChangeRemark,
  onPressRemove,
}) => {
  const inputRef = React.useRef(null);

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
              label: <IntlMessages id="kyc.kycId" />,
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
              className: styles.wRiskScore,
              label: <IntlMessages id="risk-score" />,
              renderCell: (v) => {
                const risk = get(v, "risk");
                const riskLevel = get(v, "riskLevel");
                const isSan = get(v, "isSanction");
                const numberOfChanges = get(v, "numberOfChanges");
                return (
                  <RiskRatingLabel
                    size="small"
                    type={isSan ? "San" : ""}
                    level={riskLevel}
                    value={risk}
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
            designationPosition: {
              sort: true,
              className: styles.wPosition,
              label: <IntlMessages id="kyb.table.designation" />,
              align: "left",
              renderCell: (v, { kycId, id, designationPosition }) => (
                <div className={"align-items-center"}>
                  <DropdownList
                    value={designationPosition ? designationPosition : ""}
                    data={DesignationList}
                    onChange={(value) => onChangeDropdown(value, kycId)}
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
              className: styles.wPosition,
              renderCell: (v, { kycId, remarks }, rowData) => (
                <div className={"d-flex align-items-center"}>
                  <Tooltip
                    placement={"top-start"}
                    disableFocusListener={remarks?.length > 0 ? false : true}
                    title={<Typography variant="body1">{remarks} </Typography>}
                    arrow
                  >
                    <TextField
                      variant={"outlined"}
                      fullWidth
                      style={{ marginBottom: 0 }}
                      value={remarks ? remarks : ""}
                      className={styles.textRemarks}
                      onChange={(e) =>
                        onChangeRemark(e.target.value, kycId, data)
                      }
                    />
                  </Tooltip>
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
              align: "left",
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
};

export default RiskAssessmentTable;
