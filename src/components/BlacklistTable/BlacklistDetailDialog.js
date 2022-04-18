import { Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable/index";
import UserAvatar from "@protego/sdk/RegtankUI/v1/UserAvatar";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import ActivityTracker from "components/ActivityTracker";
import ChipCategory from "components/ChipCategory";
import React, { memo } from "react";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { getFullName } from "util/string";

const useStyles = makeStyles((theme) => ({
  DialogContent: {
    paddingTop: toRem(19),
    paddingBottom: toRem(8),
    "& .MuiGrid-item": {
      marginBottom: toRem(24),
      // "&:last-child": {
      //   marginTop: toRem(-24),
      //   marginBottom: 0,
      // },
    },
  },
  CountryFlag: {
    "& > span": {
      display: "flex",
      alignItems: "center",
      "& img": {
        width: toRem(22),
        height: toRem(16),
        borderRadius: "2px",
      },
    },
  },
  content: {
    paddingLeft: toRem(4),
    paddingRight: toRem(4),
    width: toRem(520),
  },

  dialog: {
    "& .MuiDialogActions-root": {
      padding: 0,
      marginTop: toRem(-24),
    },
    "& .MuiDialogTitle-root": {
      paddingLeft: toRem(24),
    },
    "& .MuiSvgIcon-root path":{
      fill: "#232323"
    } ,
    "& .MuiDialogContent-root": {
      marginTop: `${toRem(24)} !important`
    }
  },
}));
const BlacklistDetailDialog = (props) => {
  const { open, onClose, data } = props;
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={{
        text: (
          <Typography variant="titleForm">
            {data?.kycBlacklist?.blacklistId +
              " - " +
              data?.kycBlacklist?.fullName}
          </Typography>
        ),
      }}
      allowCloseOnTitle
      className={classes.dialog}
    >
      <div className={classes.content}>
        <div>
          <div className={"d-flex align-items-center"}>
            <div>
              <UserAvatar size={30} user={data?.kycBlacklist?.fullName} />
            </div>
            <div>
              <Typography variant="textLabel2">
                {data?.kycBlacklist?.fullName}
              </Typography>
            </div>
          </div>
        </div>
        <div className={classes.DialogContent}>
          <Grid container>
            <Grid item xs={6} className="d-flex flex-column">
              <Typography variant="labelFieldForm">
                <IntlMessages id={"date-of-birth"} />
              </Typography>
              <Typography variant="textLabel2">
                <Nullable>
                  {formatDate(data?.kycBlacklist?.dateOfBirth, LONG_DATE_TIME)}
                </Nullable>
              </Typography>
            </Grid>
            <Grid item xs={6} className="d-flex flex-column">
              <Typography variant="labelFieldForm">
                <IntlMessages id={"kyc.category"} />
              </Typography>
              <div>
                <ChipCategory
                  keywords={data?.kycBlacklist?.categories}
                  multiLanguage
                />
              </div>
            </Grid>
            <Grid item xs={6} className="d-flex flex-column">
              <Typography variant="labelFieldForm">
                <IntlMessages id={"form.nationality"} />
              </Typography>
              <Typography variant="textLabel2">
                <Nullable>{data?.kycBlacklist?.nationality}</Nullable>
              </Typography>
            </Grid>
            <Grid item xs={6} className="d-flex flex-column">
              <Typography variant="labelFieldForm">
                <IntlMessages id={"phone-number"} />
              </Typography>
              <Typography variant="textLabel2">
                <Nullable>{data?.kycBlacklist?.phone}</Nullable>
              </Typography>
            </Grid>
            <Grid item xs={6} className="d-flex flex-column">
              <Typography variant="labelFieldForm">
                <IntlMessages id={"form.idIssuingCountry"} />
              </Typography>
              <Typography variant="textLabel2">
                <Nullable>{data?.kycBlacklist?.idIssuingCountry}</Nullable>
              </Typography>
            </Grid>
            <Grid item xs={6} className="d-flex flex-column">
              <Typography variant="labelFieldForm">
                <IntlMessages id={"place-of-birth"} />
              </Typography>
              <Typography variant="textLabel2">
                <Nullable>{data?.kycBlacklist?.placeOfBirth}</Nullable>
              </Typography>
            </Grid>
            <Grid item xs={6} className="d-flex flex-column">
              <Typography variant="labelFieldForm">
                <IntlMessages id={"country-of-residence"} />
              </Typography>
              <Typography variant="textLabel2">
                <Nullable>{data?.kycBlacklist?.countryOfResidence}</Nullable>
              </Typography>
            </Grid>
            <Grid item xs={6} className="d-flex flex-column">
              <Typography variant="labelFieldForm">
                <IntlMessages id={"email-address"} />
              </Typography>
              <Typography variant="textLabel2">
                <Nullable>{data?.kycBlacklist?.email}</Nullable>
              </Typography>
            </Grid>
            <Grid item xs={6} className="d-flex flex-column">
              <Typography variant="labelFieldForm">
                <IntlMessages id={"result.Table.Further"} />
              </Typography>
              <Typography variant="textLabel2">
                <Nullable>{data?.kycBlacklist?.furtherInformation}</Nullable>
              </Typography>
            </Grid>
            <Grid item xs={6} className="d-flex flex-column">
              <Typography variant="labelFieldForm">
                <IntlMessages id={"form.address"} />
              </Typography>
              <Typography variant="textLabel2">
                <Nullable>{data?.kycBlacklist?.address}</Nullable>
              </Typography>
            </Grid>

            {data?.createdBy && data?.createdAt && (
              <Grid item xs={12}>
                <ActivityTracker
                  screenedBy={getFullName(data?.createdBy)}
                  screenedAt={data?.createdAt}
                />
              </Grid>
            )}
          </Grid>
        </div>
      </div>
    </Dialog>
  );
};

export default memo(BlacklistDetailDialog);
