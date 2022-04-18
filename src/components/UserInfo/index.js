import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from "@mui/material";
import { AuthActionLogout } from "@protego/sdk/actions/auth";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Link from "@protego/sdk/RegtankUI/v1/Link/Link";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { fetchCustomerCredit, updateSetBillingRenew } from "actions";
import { logout } from "actions/Auth";
import { fetchMe } from "actions/me";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "reactstrap/es/Dropdown";
import DropdownMenu from "reactstrap/es/DropdownMenu";
import DropdownToggle from "reactstrap/es/DropdownToggle";
import { formatCredit } from "util/currency";
import { formatDate } from "util/date";
import { getFullName } from "util/string";
import { withACL } from "../../acl";
import { ReactComponent as EnvelopeIcon } from "../../assets/images/icons/EnvelopeIcon.svg";
import styles from "./UserInfo.module.scss";

const UserInfo = ({ ACL }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const toggleProfileDropdown = () => {
    if (!open === true) {
      dispatch(fetchCustomerCredit());
    }
    setOpen(!open);
  };
  const [openConfirm, setOpenConfirm] = React.useState(false);
  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);
  const { me } = useSelector((state) => state.me);
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  const handleClickRenew = () => {
    dispatch(updateSetBillingRenew());
  };

  const { customerCredit } = useSelector((state) => state.credit);
  const onConfirmYes = () => {
    handleClickRenew();
    setOpenConfirm(false);
  };
  const handleClickBy = (id) => {
    setOpenConfirm(true);
  };

  async function handleLogout() {
    await dispatch(logout());
    await dispatch(AuthActionLogout());
  }

  function showExpiredDate(time) {
    const ExpiredDate = new Date(time).getTime();
    const today = new Date().getTime();
    if (today <= ExpiredDate) {
      return (
        <div>
          <span> {formatDate(time)}</span>
        </div>
      );
    } else {
      return (
        <div className="d-flex flex-column">
          <div>
            <span className="mb-2">{formatDate(time)}</span>
          </div>
          <div>
            <Button
              variant="contained"
              size="small"
              className={styles.renewButton}
              onClick={() => handleClickBy()}
            >
              <IntlMessages id="appModule.lblRenew" />
            </Button>
          </div>
        </div>
      );
    }
  }
  return (
    <div className=" d-flex flex-row align-items-center ml-3">
      <Dialog
        open={openConfirm}
        title={{
          text: <IntlMessages id="confirm" />,
        }}
        allowCloseOnTitle
        cancelProps={{
          text: <IntlMessages id="cancel" />,
          onClick: () => setOpenConfirm(false),
        }}
        okProps={{
          text: <IntlMessages id="button.yes" />,
          onClick: () => onConfirmYes(),
        }}
      >
        <div className={styles.dialogRenew}>
          <Typography variant="textLabel" color="grayText">
            <IntlMessages id="appModule.popup.contentSubscription" />
          </Typography>
        </div>
      </Dialog>
      <Dropdown isOpen={open} toggle={toggleProfileDropdown}>
        <DropdownToggle className={"d-inline-block"} tag={"span"}>
          <UserAvatar user={getFullName(me)} size={36} />
        </DropdownToggle>
        <DropdownMenu right className={styles.dropdownMenu}>
          <div className={styles.container}>
            <div className={styles.profile}>
              <div className={styles.user}>
                <UserAvatar user={getFullName(me)} size={80} />
              </div>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="labelFieldBlack">
                    {getFullName(me)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="smallGrayDefault">
                    {me?.roles?.[0]?.displayName}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="smallGrayDefault">
                    <EnvelopeIcon /> {get(me, "email")}
                  </Typography>
                </Grid>
              </Grid>
            </div>
            <div className={styles.userInfo}>
              <Accordion elevation={0} square>
                <AccordionSummary
                  component={Link}
                  to={"/app/user/profile"}
                  onClick={toggleProfileDropdown}
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                >
                  <Typography variant="labelFieldBlack">
                    <IntlMessages id="popup.profile" />
                  </Typography>
                </AccordionSummary>
              </Accordion>
              {ACL.isAllowedPermissions("PACKAGE_INFORMATION_VIEW") && (
                <Accordion
                  square
                  expanded={expanded === "panel2"}
                  onChange={handleChange("panel2")}
                >
                  <AccordionSummary
                    sx={{
                      "&.Mui-expanded": {
                        minHeight: toRem(48),
                      },
                    }}
                    aria-controls="panel2d-content"
                    id="panel2d-header"
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography variant="labelFieldBlack">
                      <IntlMessages id="popup.myPackageInformation" />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div>
                      <Grid container rowSpacing={0.5} alignItems={"center"}>
                        <Grid item xs={6} sm={6}>
                          <span className={styles.packageLabel}>
                            <IntlMessages id="popup.currentPackage" />:
                          </span>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                          <span className={styles.packageName}>
                            {customerCredit?.usedPackage?.name}
                          </span>
                        </Grid>

                        <Grid item xs={6} sm={6}>
                          <span className={styles.packageLabel}>
                            <IntlMessages id="popup.creditBalance" />:
                          </span>
                        </Grid>
                        <Grid item xs={6} sm={6}>
                          <span className={styles.packageName}>
                            {formatCredit(customerCredit?.creditBalance)}{" "}
                            <span>
                              <IntlMessages id="popup.credits" />
                            </span>
                          </span>
                        </Grid>

                        <Grid item xs={6} sm={6}>
                          <span className={styles.packageLabel}>
                            <IntlMessages id="popup.packageExpiry" />:
                          </span>
                        </Grid>
                        <Grid item xs={6} sm={6} className={styles.packageName}>
                          <Typography
                            variant="small1"
                            className={styles.logoutText}
                          >
                            {showExpiredDate(customerCredit?.expiredDate)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </div>
                  </AccordionDetails>
                </Accordion>
              )}
              <Accordion
                elevation={0}
                square
                expanded={expanded === "panel4"}
                onChange={handleChange("panel4")}
                onClick={() => {
                  toggleProfileDropdown();
                  handleLogout();
                }}
              >
                <AccordionSummary
                  aria-controls="panel3d-content"
                  id="panel3d-header"
                >
                  <Typography variant="small1" className={styles.logoutText}>
                    <IntlMessages id="popup.logout" />
                  </Typography>
                </AccordionSummary>
              </Accordion>
            </div>
          </div>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default withACL(UserInfo);
