import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
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
  Typography,
} from "@mui/material";
import styles from "./style.module.scss";
import { ReactComponent as AddIcon } from "assets/icons/IcoPlus.svg";
import Keyword from "components/Keyword";

import RiskLevel from "components/RiskRatingLabel";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { displayLimitText } from "util/string";
import { CASE_MANAGEMENT_DELETE_PROFILE } from "actions/CaseManagementAction";
import { useDispatch, useSelector } from "react-redux";
import ChidrenTable, {
  KYCRow as KYCRowChild,
  KYBRow as KYBRowChild,
  KYTRow as KYTRowChild,
} from "./ChidrenTable";
import AddProfile from "../AddProfileDialog/AddProfile";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import {
  KYB_KYC_DATA,
  KYB_KYB_DATA,
  KYC_KYC_DATA,
  KYC_KYB_DATA,
} from "constants/RelationshipProfile";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import { FormattedHTMLMessage } from "react-intl";
import OutlinedInput from "./OutlineInput";
import tableAction from "actions/ProfileTableAction";
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

const colSpan = 8;

const renderChildrenTable = (item, caseDetail, profileType) => {
  if (item.profileType === "KYB") {
    return (
      <Box className={styles.ChidrenTable}>
        <Typography
          fontWeight={600}
          color="#0080FF"
          variant="Subtitle2"
          component="div"
        >
          {item.profileType}
        </Typography>
        <ChidrenTable
          header={[
            { title: "Business Name", align: "left" },
            { title: "KYB ID", align: "left" },
            { title: "Risk Level", align: "center" },
            { title: "Relationship", align: "left" },
            { title: "Keywords", align: "center" },
            { title: "Status", align: "left", className: "statusLv2" },
            { title: "Remarks", align: "left" },
          ]}
          body={
            <KYBRowChild
              caseDetail={caseDetail}
              profileInfo={item.profileInfo}
              profileId={item.id}
              relationship={
                profileType !== "KYT"
                  ? profileType === "KYB"
                    ? KYB_KYB_DATA
                    : KYC_KYB_DATA
                  : ""
              }
              profile={item}
            />
          }
        />
      </Box>
    );
  } else if (item.profileType === "KYC") {
    return (
      <Box className={styles.ChidrenTable}>
        <Typography fontWeight={600} color="#0080FF" variant="Subtitle2">
          {item.profileType}
        </Typography>
        <ChidrenTable
          header={[
            { title: "Name", align: "left" },
            { title: "KYC ID", align: "left" },
            { title: "Risk Score", align: "center" },
            { title: "Relationship", align: "left" },
            { title: "Keywords", align: "center" },
            { title: "Status", align: "left", className: "statusLv2" },
            { title: "Remarks", align: "left" },
          ]}
          body={
            <KYCRowChild
              caseDetail={caseDetail}
              profileInfo={item.profileInfo}
              profileId={item.id}
              relationship={
                profileType !== "KYT"
                  ? profileType === "KYC"
                    ? KYC_KYC_DATA
                    : KYB_KYC_DATA
                  : ""
              }
              profile={item}
            />
          }
        />
      </Box>
    );
  } else {
    return (
      <Box className={styles.ChidrenTable}>
        <Typography fontWeight={600} color="#0080FF" variant="Subtitle2">
          {item.profileType}
        </Typography>
        <ChidrenTable
          header={[
            { title: "Business Name", align: "left" },
            { title: "KYT ID", align: "left" },
            { title: "Risk Level", align: "center" },
            { title: "Wallet Address", align: "center" },
            { title: "Balance", align: "left" },
            { title: "Owner", align: "left" },
            { title: "Remarks", align: "left" },
          ]}
          body={
            <KYTRowChild
              caseDetail={caseDetail}
              profileInfo={item.profileInfo}
              profileId={item.id}
              profile={item}
            />
          }
        />
      </Box>
    );
  }
};

export const KYBRow = ({ profileInfo, profile, caseDetail }) => {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const onChangeRemark = (newValue) => {
    dispatch(
      tableAction.changeField({
        id: profile.id,
        remarks: newValue,
      })
    );
  };
  const profileSelector = useSelector((state) => {
    return state.caseManagement.detail.profiles;
  });
  React.useEffect(() => {
    if (profileSelector.groupProfileId) {
      setOpen(false);
      if (profileSelector.groupProfileId === profile.id) {
        setOpen(true);
      }
    }
  }, [profileSelector]);
  if (profileInfo) {
    return (
      <React.Fragment>
        <TableRow
          sx={{ "& > *": { borderBottom: "unset" } }}
          className={styles.profileTable_item}
        >
          <TableCell align="left" className={styles.nameLv1}>
            <Tooltip
              title={profileInfo?.businessName || ""}
              placement="top-start"
            >
              <span>
                {displayLimitText(profileInfo?.businessName, 12) || "_"}
              </span>
            </Tooltip>
          </TableCell>
          <TableCell align="left" className={styles.IdLv1}>
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
          <TableCell align="center" className={styles.riskLevelLv1}>
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
          </TableCell>
          <TableCell align="center" className={styles.keywordsLv1}>
            <div className={styles.profileTable__keywords}>
              <Keyword keywords={profileInfo?.keywords || "_"} />
            </div>
          </TableCell>
          <TableCell align="left" className={styles.statusLv1}>
            {profileInfo?.status ? (
              <ScreenStatusBadge
                status={profileInfo?.status}
                unresolved={profileInfo?.unresolved}
                type="kyb"
              />
            ) : (
              "_"
            )}
          </TableCell>
          <TableCell align="left" className={styles.remarkLv1}>
            <OutlinedInput
              onChange={onChangeRemark}
              inputValue={profile?.remarks}
            />
          </TableCell>
          <TableCell align="right" className={styles.actionLv1}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
              className={styles.profileTable__collapseIcon}
            >
              {profile?.profiles?.length > 0 ? (
                open ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )
              ) : (
                ""
              )}
            </IconButton>
          </TableCell>
        </TableRow>
        {profile?.profiles?.length > 0 &&
          open &&
          profile?.profiles.map((item, key) => {
            return (
              <TableRow key={key} className={styles.rowHasChildern}>
                <TableCell
                  style={{ paddingBottom: 0, paddingTop: 0 }}
                  colSpan={colSpan}
                >
                  {renderChildrenTable(item, caseDetail, "KYB")}
                </TableCell>
              </TableRow>
            );
          })}
      </React.Fragment>
    );
  }
};

export const KYCRow = ({ profileInfo, profile, caseDetail }) => {
  const [open, setOpen] = React.useState(false);
  const { individualRequest, individualRiskScore, status } = profileInfo;
  const dispatch = useDispatch();
  const onChangeRemark = (newValue) => {
    dispatch(
      tableAction.changeField({
        id: profile.id,
        remarks: newValue,
      })
    );
  };
  const profileSelector = useSelector((state) => {
    return state.caseManagement.detail.profiles;
  });
  React.useEffect(() => {
    if (profileSelector.groupProfileId) {
      setOpen(false);
      if (profileSelector.groupProfileId === profile.id) {
        setOpen(true);
      }
    }
  }, [profileSelector]);
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell align="left" className={styles.nameLv1}>
          <Tooltip title={individualRequest?.name || ""}>
            <span>{displayLimitText(individualRequest?.name, 12) || "_"}</span>
          </Tooltip>
        </TableCell>
        <TableCell align="left" className={styles.IdLv1}>
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
        <TableCell align="center" className={styles.riskLevelLv1}>
          {individualRiskScore && individualRiskScore?.risk ? (
            <RiskLevel
              level={individualRiskScore?.riskLevel}
              value={individualRiskScore?.risk}
              numberOfChanges={individualRiskScore?.numberOfChanges}
              size="tooSmall"
            />
          ) : (
            "_"
          )}
        </TableCell>
        <TableCell align="center" className={styles.keywordsLv1}>
          <div className={styles.profileTable__keywords}>
            <Keyword keywords={individualRequest?.keywords} />
          </div>
        </TableCell>
        <TableCell align="left" className={styles.statusLv1}>
          {/* <CaseStatus status={status} /> */}
          <ScreenStatusBadge
            status={profileInfo?.status}
            unresolved={profileInfo?.unresolved}
            type="kyc"
          />
        </TableCell>
        <TableCell align="left" className={styles.remarkLv1}>
          <OutlinedInput
            onChange={onChangeRemark}
            inputValue={profile?.remarks}
          />
        </TableCell>
        <TableCell align="right" className={styles.actionLv1}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            className={styles.profileTable__collapseIcon}
          >
            {profile?.profiles?.length > 0 ? (
              open ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )
            ) : (
              ""
            )}
          </IconButton>
        </TableCell>
      </TableRow>
      {profile?.profiles?.length > 0 &&
        open &&
        profile?.profiles.map((item, key) => {
          return (
            <TableRow key={key} className={styles.rowHasChildern}>
              <TableCell
                style={{ paddingBottom: 0, paddingTop: 0 }}
                colSpan={colSpan}
              >
                {renderChildrenTable(item, caseDetail, "KYC")}
              </TableCell>
            </TableRow>
          );
        })}
    </React.Fragment>
  );
};

export const KYTRow = ({ profileInfo, profile, caseDetail }) => {
  const [open, setOpen] = React.useState(false);
  const { addressDetails } = profileInfo;
  const dispatch = useDispatch();
  const onChangeRemark = (newValue) => {
    dispatch(
      tableAction.changeField({
        id: profile.id,
        remarks: newValue,
      })
    );
  };
  const profileSelector = useSelector((state) => {
    return state.caseManagement.detail.profiles;
  });
  React.useEffect(() => {
    if (profileSelector.groupProfileId) {
      setOpen(false);
      if (profileSelector.groupProfileId === profile.id) {
        setOpen(true);
      }
    }
  }, [profileSelector]);
  return (
    <React.Fragment>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        className={styles.profileTable_item}
      >
        <TableCell align="left" className={styles.nameLv1}>
          <Tooltip title={profileInfo?.asset || ""}>
            <span>{displayLimitText(profileInfo?.asset, 12) || "_"}</span>
          </Tooltip>
        </TableCell>
        <TableCell align="left" className={styles.IdLv1}>
          <Link
            style={{ color: "#0080FF", fontWeight: 500 }}
            to={generatePath(KYT_ROUTE_SCREEN, { id: profileInfo?.kytId }, { source: "list" })}
            data-cy={"id"}
          >
            {profileInfo?.kytId || "_"}
          </Link>
        </TableCell>
        <TableCell align="center" className={styles.riskLevelLv1}>
          {addressDetails && addressDetails?.risk ? (
            <RiskLevel
              level={addressDetails?.risk?.riskLevel}
              value={addressDetails?.risk?.risk}
              size="tooSmall"
            />
          ) : (
            "_"
          )}
        </TableCell>
        <TableCell align="center" className={styles.walletLv1}>
          <div className={styles.profileTable__keywords}>
            <Tooltip title={profileInfo?.address || ""}>
              <Link style={{ color: "#0080FF", fontWeight: 500 }}>
                {displayLimitText(profileInfo?.address, 12) || "_"}
              </Link>
            </Tooltip>
          </div>
        </TableCell>
        <TableCell align="left" className={styles.balanceLv1}>
          {addressDetails?.currentBalance || "0.0"}
        </TableCell>
        <TableCell align="left" className={styles.ownerLv1}>
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
        <TableCell align="left" className={styles.remarkLv1}>
          <OutlinedInput
            onChange={onChangeRemark}
            inputValue={profile?.remarks}
          />
        </TableCell>
        <TableCell align="right" className={styles.actionLv1}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            className={styles.profileTable__collapseIcon}
          >
            {profile?.profiles?.length > 0 ? (
              open ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )
            ) : (
              ""
            )}
          </IconButton>
        </TableCell>
      </TableRow>
      {profile?.profiles?.length > 0 &&
        open &&
        profile?.profiles.map((item, key) => {
          return (
            <TableRow key={key} className={styles.rowHasChildern}>
              <TableCell
                style={{ paddingBottom: 0, paddingTop: 0 }}
                colSpan={colSpan}
              >
                {renderChildrenTable(item, caseDetail, "KYT")}
              </TableCell>
            </TableRow>
          );
        })}
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
  const dispatch = useDispatch();
  const onDeleteGroupProfile = () => {
    dispatch(
      CASE_MANAGEMENT_DELETE_PROFILE({
        caseId: caseDetail?.caseId,
        profileId: profile?.id,
      })
    );
  };
  return (
    <div className={styles.wrapperTable}>
      <TableContainer className={clsx(styles.profileTable)} {...props}>
        <Table
          aria-label="collapsible table"
          className={styles.profileTable_table}
        >
          <TableHead className={styles.profileTable_header}>
            <TableRow>
              {header.length > 0 &&
                header.map((item) => {
                  return (
                    <TableCell align={item?.align.length ? item.align : "left"}>
                      {item?.title || ""}
                    </TableCell>
                  );
                })}

              <TableCell align="right">
                <div className={styles.profileTable_controls}>
                  <AddProfile
                    button={
                      <Tooltip title="Add Association">
                        <SvgIcon viewBox="0 0 21 20" component={AddIcon} />
                      </Tooltip>
                    }
                    caseDetail={caseDetail}
                    groupProfileId={profile.id}
                  />
                  <span className={styles.profileTable_spacer}></span>
                  <IconButton
                    aria-label="delete"
                    onClick={onDeleteGroupProfile}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={styles.profileTable_body}>{body}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ProfileTable;
