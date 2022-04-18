// @ts-nocheck
import {
  Box,
  Grid,
  Tab,
  Tabs,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination
} from "@mui/material";
import { withStyles } from "@mui/styles";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable";
import React, { Fragment, useState } from "react";
import {
  EmbeddableKeyData,
  EmbeddableSource,
  KycIndividualMatchEntity,
  linkedIndividuals
} from "types/typings-api";
import { formatDate, MONTH_YEAR_DATE } from "util/date";
//@ts-ignore
import styles from "./ProfileTab.module.scss";
import TableNote from "./Table/TableNote";
import TableSource from "./Table/TableSource";
const ListTabTable = [
  { id: 0, label: <IntlMessages id="key-data" /> },
  { id: 1, label: <IntlMessages id={"result.Table.LinkedBusinesses"} /> },
  { id: 2, label: <IntlMessages id="result.Table.LinkedIndividuals" /> },
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
    <Box className={[styles.TableContent]}>
      <Grid container>
        <Grid item xs={12} className={styles.lastChild}>
          <Table aria-label="simple table" className={styles.tableKeyData}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <IntlMessages id="notes" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {keyData?.notes.map((n, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{n.text}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Box>
  );
}

function LinkedBusinesses(props: { LinkedBusinesses: any }) {
  const { LinkedBusinesses } = props;
  console.log(LinkedBusinesses);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(9);
  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, LinkedBusinesses.length - page * rowsPerPage);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const isPaginationEnabled = false;
  return (
    <Box className={styles.TableContent}>
      <TableContainer className={styles.containerLinkedIndividuals}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <IntlMessages id="kyb.businessName" />
              </TableCell>
              <TableCell>
                <IntlMessages id="connection.table.connection" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {LinkedBusinesses.slice(
              page * rowsPerPage,
              page * rowsPerPage + rowsPerPage
            ).map((n, index) => {
              return (
                <TableRow key={n.personId}>
                  <TableCell>{n.businessName}</TableCell>
                  <TableCell>{n.linkDescription}</TableCell>
                </TableRow>
              );
            })}
            {/* {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )} */}
          </TableBody>
        </Table>
      </TableContainer>
      {isPaginationEnabled && (
        <div className="d-flex align-items-end flex-column">
          {/* @ts-ignore*/}
          <TablePagination
            rowsPerPageOptions={[5, 9]}
            count={LinkedBusinesses.length}
            component="div"
            rowsPerPage={rowsPerPage}
            page={page}
            SelectProps={{
              inputProps: { "aria-label": "rows per page" },
              native: true,
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </div>
      )}
    </Box>
  );
}

function LinkedIndividuals(props: { linkedIndividuals: linkedIndividuals[] }) {
  const { linkedIndividuals } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(9);

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, linkedIndividuals.length - page * rowsPerPage);
  
  const isPaginationEnabled = false;

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };

  return (
    <Box className={styles.TableContent}>
      <TableContainer className={styles.containerLinkedIndividuals}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <IntlMessages id="name" />
              </TableCell>
              <TableCell>
                <IntlMessages id="kyb.position" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {linkedIndividuals
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((n, index) => {
                return (
                  <TableRow key={n.personId}>
                    <TableCell>{n.name}</TableCell>
                    <TableCell>{n.position}</TableCell>
                  </TableRow>
                );
              })}
            {/* {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )} */}
          </TableBody>
        </Table>
      </TableContainer>
      {isPaginationEnabled && (
        <div className="d-flex align-items-end flex-column">
          {/*@ts-ignore */}
          <TablePagination
            rowsPerPageOptions={[5, 9]}
            count={linkedIndividuals.length}
            component="div"
            rowsPerPage={rowsPerPage}
            page={page}
            SelectProps={{
              inputProps: { "aria-label": "rows per page" },
              native: true,
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </div>
      )}
    </Box>
  );
}

function Sources(props: { sources: EmbeddableSource[] }) {
  const { sources } = props;
  return <TableSource sources={sources ? sources : []} />;
}
function TabPanel(props: { match: KycIndividualMatchEntity; value: any }) {
  const { value, match, kybId } = props;

  switch (value) {
    case 0:
      return match?.keyData && <KeyData keyData={match.keyData} />;
    case 1:
      return <LinkedBusinesses LinkedBusinesses={match.linkedBusinesses} />;
    case 2:
      return <LinkedIndividuals linkedIndividuals={match.linkedIndividuals} />;
    case 3:
      return (
        <Box className={styles.TableContent}>
          <Sources sources={match.sources} />
        </Box>
      );
    case 4:
      return (
        <Box className={styles.TableContent} style={{paddingTop: "10px"}}>
          <TableNote id={`${kybId}@${match.matchId}`} />
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
                className={styles.tabHeader}
              />
            );
          }
          return (
            <Tab
              key={item.id}
              label={
                <Typography variant="labelFieldForm">{item.label}</Typography>
              }
              className={styles.tabHeader}
            />
          );
        })}
      </StyledTabs>
    </Box>
  );
}

// @ts-ignore
const ProfileTable = function Profile(props: {
  kybId: any;
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
          <TabPanel value={value} match={props.match} kybId={props.kybId} />
        </Box>
      </div>
    </Fragment>
  );
};

export default ProfileTable;
