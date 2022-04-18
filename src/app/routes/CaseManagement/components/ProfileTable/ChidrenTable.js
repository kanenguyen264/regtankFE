import * as React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuItem from "@mui/material/MenuItem";
import {
  SvgIcon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import styles from "./style.module.scss";
import Keyword from "components/Keyword";
import CaseStatus from "../CaseStatus";
import RiskLevel from "components/RiskRatingLabel";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { displayLimitText } from "util/string";
import { CASE_MANAGEMENT_DELETE_PROFILE } from "actions/CaseManagementAction";
import tableAction from "actions/ProfileTableAction";
import { useDispatch, useSelector } from "react-redux";
import Select from "@protego/sdk/RegtankUI/v1/SelectOthers";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import OutlinedInput from "./OutlineInput";
import ScreenStatusBadge from "components/ScreenStatusBadgev1";
import { generatePath } from "@protego/sdk/utils/router";
import {
  KYC_ROUTE_KYC_SCREEN_RESULT,
  KYC_ROUTE_KYC_SCREEN_SCORING,
  KYB_ROUTE_KYB_SCREEN_RESULT,
  KYB_ROUTE_RISK_ASSESSMENT,
  KYT_ROUTE_SCREEN,
} from "constants/routes";
import { isCompletedStatus } from "util/index";

export const KYBRow = ({
  profileInfo,
  profile,
  caseDetail,
  profileId,
  relationship,
}) => {
  const dispatch = useDispatch();
  const [relationValue, setRelationValue] = React.useState(
    profile.relationship
  );
  const handleChangeRelationShip = async (newValue) => {
    setRelationValue(newValue);
    dispatch(
      tableAction.changeField({
        id: profileId,
        relationship: newValue,
      })
    );
  };
  const onDeleteProfile = () => {
    dispatch(
      CASE_MANAGEMENT_DELETE_PROFILE({
        caseId: caseDetail?.caseId,
        profileId: profileId,
      })
    );
  };
  const onChangeRemark = (newValue) => {
    dispatch(
      tableAction.changeField({
        id: profile.id,
        remarks: newValue,
      })
    );
  };
  const onSubmitRelationShipInput = (inputValue, selectValue) => {
    dispatch(
      tableAction.changeField({
        id: profile.id,
        relationship: selectValue,
        userInputtedRelationship: inputValue,
      })
    );
  }
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell align="left" className={styles.nameLv2}>
          <Tooltip title={profileInfo?.businessName} placement={"top-start"}>
            <div>{displayLimitText(profileInfo?.businessName) || "_"}</div>
          </Tooltip>
        </TableCell>
        <TableCell align="left" className={styles.IdLv2}>
          <Link
            to={
              isCompletedStatus(profileInfo?.status)
                ? generatePath(KYB_ROUTE_RISK_ASSESSMENT, {
                    kybId: profileInfo?.kybId,
                  })
                : generatePath(KYB_ROUTE_KYB_SCREEN_RESULT, {
                    kybId: profileInfo?.kybId,
                  })
            }
            style={{ color: "#0080FF", fontWeight: 500 }}
          >
            {profileInfo?.kybId || "_"}
          </Link>
        </TableCell>
        <TableCell align="center" className={styles.riskLevelLv2}>
          <div className={styles.Level2Col3}>
            {profileInfo?.riskLevel ? (
              <RiskLevel
                size="tooSmall"
                level={profileInfo?.riskLevel}
                value={profileInfo?.riskLevel?.split("", 1)}
                showLevel
                numberOfChanges={profileInfo?.countRiskLevelChange}
              />
            ) : (
              "_"
            )}
          </div>
        </TableCell>
        <TableCell align="left" className={styles.relationshipSelect}>
          {relationship ? (
            // <div className={styles.relationshipSelect}>
            <Select
              selected={relationValue}
              onChange={handleChangeRelationShip}
              inputProp={{value: profile.userInputtedRelationship}}
              onSubmitInput={onSubmitRelationShipInput}
              data={relationship}
            />
          ) : (
            // </div>
            "_"
          )}
        </TableCell>
        <TableCell align="center" className={styles.keywordsLv2}>
          <div className={styles.profileTable__keywords}>
            <Keyword keywords={profileInfo?.keywords || "_"} />
          </div>
        </TableCell>
        <TableCell align="left" className={styles.statusLv2}>
          {profileInfo?.status ? (
            // <CaseStatus status={profileInfo?.status} />
            <ScreenStatusBadge
              status={profileInfo?.status}
              unresolved={profileInfo?.unresolved}
              type="kyb"
            />
          ) : (
            "_"
          )}
        </TableCell>
        <TableCell align="left" className={styles.remarkLv2}>
          <OutlinedInput
            onChange={onChangeRemark}
            inputValue={profile?.remarks}
          />
        </TableCell>
        <TableCell align="right" className={styles.actionLv2}>
          <DeleteIcon onClick={onDeleteProfile} />
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export const KYCRow = ({
  profileInfo,
  caseDetail,
  profileId,
  relationship,
  profile,
}) => {
  const dispatch = useDispatch();
  const [relationValue, setRelationValue] = React.useState(
    profile.relationship
  );
  const handleChangeRelationShip = async (newValue) => {
    setRelationValue(newValue);
    await dispatch(
      tableAction.changeField({
        id: profileId,
        relationship: newValue,
      })
    );
  };
  const onDeleteProfile = () => {
    dispatch(
      CASE_MANAGEMENT_DELETE_PROFILE({
        caseId: caseDetail?.caseId,
        profileId: profileId,
      })
    );
  };
  const onChangeRemark = (newValue) => {
    dispatch(
      tableAction.changeField({
        id: profile.id,
        remarks: newValue,
      })
    );
  };
  const onSubmitRelationShipInput = (inputValue, selectValue) => {
    dispatch(
      tableAction.changeField({
        id: profile.id,
        relationship: selectValue,
        userInputtedRelationship: inputValue,
      })
    );
  }
  return (
    <React.Fragment>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        className={styles.profileTable_item}
      >
        <TableCell align="left" className={styles.nameLv2}>
          <Tooltip
            title={profileInfo?.individualRequest?.name}
            placement={"top-start"}
          >
            <div>
              {displayLimitText(profileInfo?.individualRequest?.name) || "_"}
            </div>
          </Tooltip>
        </TableCell>
        <TableCell align="left" className={styles.IdLv2}>
          <Link
            style={{ color: "#0080FF", fontWeight: 500 }}
            to={
              isCompletedStatus(profileInfo?.status)
                ? generatePath(KYC_ROUTE_KYC_SCREEN_SCORING, {
                    kycId: profileInfo?.kycId,
                  })
                : generatePath(KYC_ROUTE_KYC_SCREEN_RESULT, {
                    kycId: profileInfo?.kycId,
                  })
            }
          >
            {profileInfo?.kycId || "_"}
          </Link>
        </TableCell>
        <TableCell align="center" className={styles.riskLevelLv2}>
          <div>
            {profileInfo?.individualRiskScore?.risk ? (
              <RiskLevel
                level={profileInfo?.individualRiskScore?.riskLevel}
                value={profileInfo?.individualRiskScore?.risk}
                numberOfChanges={
                  profileInfo?.individualRiskScore?.numberOfChanges
                }
                size="tooSmall"
              />
            ) : (
              "_"
            )}
          </div>
        </TableCell>
        <TableCell align="left" className={styles.relationshipSelect}>
          {relationship ? (
            <Select
              selected={relationValue}
              onChange={handleChangeRelationShip}
              inputProp={{value: profile.userInputtedRelationship}}
              onSubmitInput={onSubmitRelationShipInput}
              data={relationship}
            />
          ) : (
            "_"
          )}
        </TableCell>
        <TableCell align="center" className={styles.keywordsLv2}>
          <div className={styles.profileTable__keywords}>
            <Keyword keywords={profileInfo?.individualRequest?.keywords} />
          </div>
        </TableCell>
        <TableCell align="left" className={styles.statusLv2}>
          {/* <CaseStatus status={profileInfo?.status} /> */}
          <ScreenStatusBadge
            status={profileInfo?.status}
            unresolved={profileInfo?.unresolved}
            type="kyb"
          />
        </TableCell>
        <TableCell align="left" className={styles.remarkLv2}>
          <OutlinedInput
            onChange={onChangeRemark}
            inputValue={profile?.remarks}
          />
        </TableCell>
        <TableCell align="right" className={styles.actionLv2}>
          <DeleteIcon onClick={onDeleteProfile} />
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export const KYTRow = ({ profileInfo, caseDetail, profileId, profile }) => {
  const dispatch = useDispatch();
  const onDeleteProfile = () => {
    dispatch(
      CASE_MANAGEMENT_DELETE_PROFILE({
        caseId: caseDetail?.caseId,
        profileId: profileId,
      })
    );
  };
  const onChangeRemark = (newValue) => {
    dispatch(
      tableAction.changeField({
        id: profile.id,
        remarks: newValue,
      })
    );
  };
  const { addressDetails } = profileInfo;
  return (
    <React.Fragment>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        className={styles.profileTable_item}
      >
        <TableCell align="left" className={styles.nameLv2}>
          <Tooltip title={profileInfo?.asset} placement={"top-start"}>
            <div>{displayLimitText(profileInfo?.asset) || "_"}</div>
          </Tooltip>
        </TableCell>
        <TableCell align="left" className={styles.IdLv2}>
          <Link
            style={{ color: "#0080FF", fontWeight: 500 }}
            to={generatePath(
              KYT_ROUTE_SCREEN,
              { id: profileInfo?.kytId },
              { source: "list" }
            )}
            data-cy={"id"}
          >
            {profileInfo?.kytId || "_"}
          </Link>
        </TableCell>
        <TableCell align="center" className={styles.riskLevelLv2}>
          <div>
            {addressDetails?.risk ? (
              <RiskLevel
                level={addressDetails?.risk?.riskLevel}
                value={addressDetails?.risk?.risk}
                size="tooSmall"
              />
            ) : (
              "_"
            )}
          </div>
        </TableCell>
        <TableCell align="center" className={styles.walletLv2}>
          <div className={styles.profileTable__keywords}>
            <Tooltip title={profileInfo?.address} placement={"top-start"}>
              <Link style={{ color: "#0080FF", fontWeight: 500 }}>
                {displayLimitText(profileInfo?.address) || "_"}
              </Link>
            </Tooltip>
          </div>
        </TableCell>
        <TableCell align="left" className={styles.balanceLv2}>
          {addressDetails?.currentBalance || "0.0"}
        </TableCell>
        <TableCell align="left" className={styles.ownerLv2}>
          <Tooltip
            title={profileInfo?.addressDetails?.wallet?.name}
            placement={"top-start"}
          >
            <div>
              {displayLimitText(profileInfo?.addressDetails?.wallet?.name) ||
                "_"}
            </div>
          </Tooltip>
        </TableCell>
        <TableCell align="left" className={styles.remarkLv2}>
          <OutlinedInput
            onChange={onChangeRemark}
            inputValue={profile?.remarks}
          />
        </TableCell>
        <TableCell align="right" className={styles.actionLv2}>
          <DeleteIcon onClick={onDeleteProfile} />
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const ProfileTable = ({
  className,
  caseDetail,
  profile,
  header = [],
  body = null,
  ...props
}) => {
  return (
    <Box>
      <TableContainer
        className={clsx(styles.profileTable, className)}
        {...props}
      >
        <Table
          aria-label="collapsible table"
          className={styles.profileTable_tableLv2}
          size="small"
        >
          <TableHead className={styles.profileTable_header}>
            <TableRow>
              {header.length > 0 &&
                header.map((item) => {
                  return (
                    <TableCell
                      align={item?.align.length ? item.align : "left"}
                      className={styles[item.className]}
                    >
                      {item?.title || ""}
                    </TableCell>
                  );
                })}
              <TableCell align="right">
                <div className={styles.profileTable_controls}></div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={styles.profileTable_body}>{body}</TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProfileTable;
