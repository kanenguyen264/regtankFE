// @ts-nocheck
import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable";
import React, { Fragment, useState } from "react";
import {
  EmbeddableConnection,
  EmbeddableFurtherInformation,
  EmbeddableKeyData,
  EmbeddableSource,
  KycIndividualMatchEntity,
} from "types/typings-api";
import { formatDate, MONTH_YEAR_DATE } from "util/date";
//@ts-ignore
import styles from "./ProfileTab.module.scss";
import TableConnection from "./Table/TableConnection";
import TableNote from "./Table/TableNote";
import TableSource from "./Table/TableSource";
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
        <Grid item xs={2}>
          <Typography variant="subtitleGray">
            <IntlMessages id={"kyc.labelAlias"} />
          </Typography>
        </Grid>
        <Grid item xs={10}>
          {keyData && keyData.aliases.length > 0 ? (
            keyData.aliases.map((item) => {
              return <Typography variant="textLabel2">{item.name}</Typography>;
            })
          ) : (
            <Typography>-</Typography>
          )}
        </Grid>
        <Grid item xs={2}>
          <Typography variant="subtitleGray">
            <IntlMessages id={"result.Table.EmailAddress"} />
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography variant="textLabel2">
            <Nullable>{keyData.email}</Nullable>
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="subtitleGray">
            <IntlMessages id={"result.Table.Telephone"} />
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography variant="textLabel2">
            <Nullable>{keyData.telephone}</Nullable>
          </Typography>
        </Grid>
        <Grid item xs={2} className={styles.lastChild}>
          <Typography variant="subtitleGray">
            <IntlMessages id={"kyc.address"} />
          </Typography>
        </Grid>
        <Grid item xs={10} className={styles.lastChild}>
          <Typography variant="textLabel2">
            <Nullable>
              {!viewMoreAddressesMatchDetails &&
              keyData.addresses.length > 5 ? (
                <>
                  {keyData.addresses.slice(0, 5).map((item) => (
                    <li style={{ listStyle: "none" }}>{item}</li>
                  ))}
                  <span
                    className={styles.ViewMore}
                    onClick={() => setViewMoreAddressesMatchDetails(true)}
                  >
                    <IntlMessages id={"kyb.viewMore"} />
                  </span>
                </>
              ) : (
                <>
                  {keyData.addresses.map((item) => (
                    <li style={{ listStyle: "none" }}>
                      {item?.replace(`,`, "")}
                    </li>
                  ))}
                  {keyData.addresses.length > 5 && (
                    <span
                      className={styles.ViewMore}
                      onClick={() => setViewMoreAddressesMatchDetails(false)}
                    >
                      <Typography variant="subtitleGray">
                        <IntlMessages id={"kyb.viewLess"} />
                      </Typography>
                    </span>
                  )}
                </>
              )}
            </Nullable>
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

function Further(props: { further: EmbeddableFurtherInformation }) {
  const { further } = props;
  // @ts-ignore
  return (
    <Box className={[styles.tabPadding, styles.TableContent]}>
      <Grid container>
        <Grid item xs={2}>
          <Typography variant="subtitleGray">
            <IntlMessages id={"result.Table.Position"} />
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <div>
            {further.politicalPositions &&
            further.politicalPositions.length > 0 ? (
              further.politicalPositions.map((political, index) => (
                <p key={index}>
                  <Typography variant="textLabel2">
                    {political.description} {political.country} from{" "}
                    {formatDate(political.from, MONTH_YEAR_DATE)}
                    {political.to && " to "}
                    {formatDate(political.to, MONTH_YEAR_DATE)}
                  </Typography>
                </p>
              ))
            ) : (
              <Typography>-</Typography>
            )}
          </div>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="subtitleGray">
            <IntlMessages id={"result.Table.Notes"} />
          </Typography>
        </Grid>
        <Grid item xs={10}>
          {further.notes && further.notes.length > 0 ? (
            further.notes.map((note, index) => (
              <p key={index}>
                <Typography variant="textLabel2">{note}</Typography>
              </p>
            ))
          ) : (
            <Typography>-</Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

function Connections(props: { connections: EmbeddableConnection[] }) {
  const { connections } = props;
  return (
    <Box className={styles.TableContent}>
      <TableConnection list={connections ? connections : []} />
    </Box>
  );
}

function Sources(props: { sources: EmbeddableSource[] }) {
  const { sources } = props;
  return <TableSource sources={sources ? sources : []} />;
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
        <Box className={styles.TableContent}>
          <Sources sources={match.sources} />
        </Box>
      );
    case 4:
      return (
        <Box className={styles.TableContent}>
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
