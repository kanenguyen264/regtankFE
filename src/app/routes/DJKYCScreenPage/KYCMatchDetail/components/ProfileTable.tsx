// @ts-nocheck
import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable";
import CountryFlagLanguage from "components/CountryFlagLanguage";
import React, { Fragment, useState } from "react";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import {
  EmbeddableConnection,
  EmbeddableFurtherInformation,
  EmbeddableKeyData,
  EmbeddableSource,
  KycIndividualMatchEntity,
} from "types/typings-api";
import { getFullDateTime } from "util/date";
import DataLink from "../../component/DataLink";
//@ts-ignore
import styles from "./ProfileTab.module.scss";
import TableConnection from "./Table/TableConnection";
import TableNote from "./Table/TableNote";
import clsx from "clsx";
const ListTabTable = [
  { id: 0, label: <IntlMessages id="key-data" /> },
  { id: 1, label: <IntlMessages id={"result.Table.Further"} /> },
  { id: 2, label: <IntlMessages id="connections" /> },
  { id: 3, label: <IntlMessages id={"result.Table.Sources"} /> },
  { id: 4, label: <IntlMessages id={"notes"} /> },
];
const StyledTabs = withStyles({
  selected: {
    backgroundColor: ThemeColors.primary,
  },
  indicator: {
    display: "flex",
    justifyContent: "center",
    "& > span": {
      width: "100%",
      backgroundColor: ThemeColors.primary,
    },
  },
})((props) => (
  <Tabs
    className={styles.tabContainer}
    {...props}
    TabIndicatorProps={{ children: <span /> }}
  />
));

function KeyData(props: { keyData: EmbeddableKeyData }) {
  const { keyData } = props;
  const [
    viewMoreAddressesMatchDetails,
    setViewMoreAddressesMatchDetails,
  ] = useState(false);

  return (
    <Box className={[styles.tabPadding, styles.TableContent]}>
      <Grid container>
        <Grid item xs={4}>
          <Typography variant="subtitleGray">
            <IntlMessages id={"kyc.labelAlias"} />
          </Typography>
        </Grid>
        <Grid item xs={8}>
          {keyData && keyData.aliases.length > 0 ? (
            keyData.aliases.map((item) => {
              return <Typography variant="textLabel2">{item.name}</Typography>;
            })
          ) : (
            <Typography>-</Typography>
          )}
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitleGray">
            <IntlMessages id={"dj.match.detail.Deceased"} />
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="textLabel2">
            {keyData?.deceased ? (
              <IntlMessages id={"yes"} />
            ) : (
              <IntlMessages id={"no"} />
            )}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitleGray">
            <IntlMessages id={"kyc.reportedAllegation"} />
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="textLabel2">
            <Nullable
              component={CountryFlagLanguage}
              valueProp={"countryCode"}
              svg
              djwl
              displayCountryName
            >
              {keyData?.reportedAllegation}
            </Nullable>
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitleGray">
            <IntlMessages id={"kyc.dateOfDeath"} />
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="textLabel2">
            <Nullable className={styles.DataVal}>
              {getFullDateTime(keyData.dayOfDeath)}
            </Nullable>
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitleGray">
            <IntlMessages id={"kyc.recordedDate"} />
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="textLabel2">
            {keyData?.otherRecordedDatesOfBirth.length
              ? keyData?.otherRecordedDatesOfBirth?.map((item, index) => {
                  return (
                    <span key={index} style={{ display: "flex" }}>
                      {getFullDateTime(item)}
                    </span>
                  );
                })
              : "-"}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitleGray">
            <IntlMessages id={"kyc.jurisdiction"} />
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="textLabel2">
            <Nullable
              component={CountryFlagLanguage}
              valueProp={"countryCode"}
              displayCountryName={true}
              svg
              djwl
            >
              {keyData?.jurisdiction}
            </Nullable>
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitleGray">
            <IntlMessages id={"kyc.address"} />
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="textLabel2">
            {keyData?.addresses?.length > 0 ? (
              <table
                className={styles.DataItemTable}
              >
                <tbody>
                  <tr className={styles.TableRow}>
                    <th
                      style={{ width: "40%" }}
                      className={clsx(styles.TableCol, styles.TableHead)}
                    >
                      <IntlMessages id="kyc.city" />
                    </th>
                    <th
                      style={{ width: "30%" }}
                      className={clsx(styles.TableCol, styles.TableHead)}
                    >
                      <IntlMessages id="kyc.stateRegion" />
                    </th>
                    <th
                      style={{ width: "30%" }}
                      className={clsx(styles.TableCol, styles.TableHead)}
                    >
                      <IntlMessages id="kyc.countryTerritory" />
                    </th>
                  </tr>

                  {keyData.addresses.map((item, index) => {
                    return (
                      <tr className={styles.TableRow} key={index}>
                        <td className={styles.TableCol}>
                          <Nullable>{item?.city}</Nullable>
                        </td>
                        <td className={styles.TableCol}>
                          <Nullable>{item?.stateOrRegion}</Nullable>
                        </td>
                        <td className={styles.TableCol}>
                          <Nullable>{item?.countryOrTerritory}</Nullable>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              "-"
            )}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitleGray">
            <IntlMessages id={"kyc.profileNotes"} />
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="textLabel2">
            {keyData?.profileNotes?.length
              ? keyData?.profileNotes?.map((item, index) => {
                  return (
                    <span key={index} style={{ display: "flex" }}>
                      {item}
                    </span>
                  );
                })
              : "-"}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

function Further(props: { further: EmbeddableFurtherInformation }) {
  const { further } = props;
  // @ts-ignores
  return (
    <Box className={[styles.tabPadding, styles.TableContent]}>
      <Grid container>
        <Grid item xs={4}>
          <Typography variant="subtitleGray">
            <IntlMessages id={"kyc.Status"} />
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="textLabel2">
            <Nullable>{further?.status}</Nullable>
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitleGray">
            <IntlMessages id={"table.category"} />
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="textLabel2">
            <Nullable>{further?.category}</Nullable>
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitleGray">
            <IntlMessages id={"kyc.subCategory"} />
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="textLabel2">
            <Nullable>{further?.subCategory}</Nullable>
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitleGray">
            <IntlMessages id={"kyc.idNumbers"} />
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="textLabel2">
            {further?.identificationInformationList?.length ? (
              <table
                className={clsx(styles.DataItemTable)}
                style={{ marginTop: toRem(-12) }}
              >
                <tbody>
                  <tr className={styles.TableRow}>
                    <th
                      style={{ width: "30%" }}
                      className={clsx(styles.TableCol, styles.TableHead)}
                    >
                      <IntlMessages id="type" />
                    </th>
                    <th
                      style={{ width: "30%" }}
                      className={clsx(styles.TableCol, styles.TableHead)}
                    >
                      <IntlMessages id="kyc.number" />
                    </th>
                    <th
                      style={{ width: "40%" }}
                      className={clsx(styles.TableCol, styles.TableHead)}
                    >
                      <IntlMessages id="kyc.Notes" />
                    </th>
                  </tr>
                  {further.identificationInformationList.map((val, index) => {
                    return (
                      <tr key={index} className={styles.TableRow}>
                        <td className={styles.TableCol}>
                          <Nullable>{val?.type}</Nullable>
                        </td>
                        <td className={styles.TableCol}>
                          <Nullable>{val?.number}</Nullable>
                        </td>
                        <td className={styles.TableCol}>
                          <Nullable>{val?.note}</Nullable>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              "-"
            )}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitleGray">
            <IntlMessages id={"kyc.images"} />
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="textLabel2">
            {further?.images?.length > 0
              ? further.images.map((link, index) => {
                  return (
                    <span key={index} style={{ display: "flex" }}>
                      <DataLink displayTxt={link} href={link} />
                    </span>
                  );
                })
              : "-"}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

function Connections(props: { connections: EmbeddableConnection[] }) {
  const { connections } = props;
  return (
    <Box className={clsx(styles.TableContent, styles.ConnectionContent)}>
      <TableConnection list={connections ? connections : []} />
    </Box>
  );
}

function Sources(props: { sources: EmbeddableSource[] }) {
  const { sources } = props;
  return (
    <Box className={clsx(styles.TableContent)}>
      <Nullable>
        {sources.map((item, index) => {
          return (
            <span key={index}>
              <DataLink
                displayTxt={item?.externalLink}
                href={item?.externalLink}
              />
            </span>
          );
        })}
      </Nullable>
    </Box>
  );
}
function TabPanel(props: { match: KycIndividualMatchEntity; value: any }) {
  const { value, match, kycId } = props;

  switch (value) {
    case 0:
      return match?.keyData && <KeyData keyData={match.keyData} />;
    case 1:
      return <Further further={match.furtherInformation} />;
    case 2:
      return <Connections connections={match.connections} />;
    case 3:
      return (
        <Box className={clsx(styles.TableContent, styles.SourceContent)}>
          <Sources sources={match.sources} />
        </Box>
      );
    case 4:
      return (
        <Box className={clsx(styles.TableContent, styles.NoteContent)}>
          <TableNote id={`${kycId}@${match.matchId}`} />
        </Box>
      );
    default:
      return <KeyData keyData={match.keyData} />;
  }
}
//@ts-ignore
function TabCustom(props) {
  const { value, handleChangeTab } = props;
  return (
    <Box className={styles.tabCustom}>
      {/* @ts-ignore */}
      <StyledTabs value={value} onChange={handleChangeTab}>
        {ListTabTable.map((item, index) => {
          if (value === index) {
            return (
              <Tab
                key={item.id}
                label={
                  <Typography variant="labelFieldForm">{item.label}</Typography>
                }
              />
            );
          }
          return (
            <Tab
              key={item.id}
              label={
                <Typography variant="labelFieldForm">{item.label}</Typography>
              }
            />
          );
        })}
      </StyledTabs>
    </Box>
  );
}

// @ts-ignore
const ProfileTable = function Profile(props: {
  kycId: any;
  match: KycIndividualMatchEntity;
}) {
  const [value, setValue] = React.useState(0);
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Fragment>
      <div className={styles.ProfileTabContainer}>
        <TabCustom value={value} handleChangeTab={handleChangeTab} />
        <Box className={styles.boxTabPanel}>
          <TabPanel value={value} match={props.match} kycId={props.kycId} />
        </Box>
      </div>
    </Fragment>
  );
};

export default ProfileTable;
