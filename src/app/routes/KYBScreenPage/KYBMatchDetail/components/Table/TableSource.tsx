// @ts-nocheck
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Grid, Typography } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { ReactComponent as LaunchIcon } from "assets/icons/IcLaunchIcon.svg";
import Keyword from "components/Keywordv1";
import { findIndex, isEqual } from "lodash";
import React, { Fragment, useEffect, useState } from "react";
import { EmbeddableSource } from "types/typings-api";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { replaceHtmlEntites } from "util/string";
import { getHostURL, validURL } from "util/url";
//@ts-ignore
import styles from "../../../components/MatchProfile/MatchProfile.module.scss"


const SourcePopup = ({ dataSource, selected, onClose, getTitle }) => {
  const getCurrentIndex = findIndex(dataSource, function (o) {
    return isEqual(o, selected);
  });

  const [indexCurrent, setIndexCurrent] = useState(getCurrentIndex);
  const [current, setCurrent] = useState(selected);

  const totalItem = dataSource.length;

  const nextPrevSource = (type) => {
    if (type) {
      setIndexCurrent(indexCurrent + 1);
    } else {
      setIndexCurrent(indexCurrent - 1);
    }
  };

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  useEffect(() => {
    if (indexCurrent >= 0 && indexCurrent < totalItem) {
      setCurrent(dataSource[indexCurrent]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexCurrent]);

  return (
    <Fragment>
      <Dialog
        open={true}
        onClose={onClose}
        aria-labelledby="max-width-dialog-title"
        scrollType={"body"}
        allowCloseOnTitle
        title={{
          text: (
            <Typography variant="titleForm">
              <IntlMessages id="result.Table.Sources" />
            </Typography>
          ),
        }}
        disableDialogAction
      >
        <Box className={`${styles.dialogPaper} bg-white`} component="div">
          <Grid container>
            <Grid item xs={12}>
              <div className="d-flex justify-content-between align-items-center">
                <Typography variant="Subtitle1" className="mr-2">
                  {getTitle(current, true)}
                </Typography>
                <div>
                  {totalItem > 1 && (
                    <div className={"d-flex align-items-center"}>
                      <div className="d-flex align-baseline pr-3">
                        <Typography variant="textLabel">
                          {indexCurrent + 1}{" "}
                          <IntlMessages id={"dialog.profile.outOf"} />
                        </Typography>
                        &nbsp;
                        <Typography variant="textLabel" color="primary">
                          {totalItem}{" "}
                          <IntlMessages id={"kyc.screen.detail.tab.source"} />
                        </Typography>
                      </div>

                      <div>
                        <Button
                          variant="outlinedIcon"
                          size="small"
                          disabled={indexCurrent === 0}
                          style={{ padding: 0, margin: 0, paddingLeft: 2 }}
                          onClick={() => nextPrevSource(false)}
                        >
                          <KeyboardArrowLeftIcon />
                        </Button>
                      </div>
                      <div className={"ml-2"}>
                        <Button
                          disabled={indexCurrent === totalItem - 1}
                          variant="outlinedIcon"
                          size="small"
                          style={{ padding: 0, margin: 0, paddingLeft: 2 }}
                          onClick={() => nextPrevSource(true)}
                        >
                          <KeyboardArrowRightIcon />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <hr />
            <Grid container columnSpacing={1}>
              <Grid item xs={6} className="mb-2">
                <div>
                  <Typography variant="labelFieldForm">
                    <IntlMessages id="kyc.screen.detail.tab.source.title" />
                  </Typography>
                </div>
                <div className="text-justify">
                  <Typography variant="textLabel2">
                    {replaceHtmlEntites(getTitle(current))}
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={6} className="mb-2">
                <div>
                  <Typography variant="labelFieldForm">
                    <IntlMessages id="source.table.keywords" />
                  </Typography>
                </div>
                <div>
                  <Keyword keywords={current.keywords} />
                </div>
              </Grid>
              <Grid item xs={12} className="mb-2">
                <div>
                  <Typography variant="labelFieldForm">
                    <IntlMessages id="source.table.summary" />
                  </Typography>
                </div>
                <div>
                  <Typography variant="textLabel2">
                    {replaceHtmlEntites(current.summary)}
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={12}>
                <div>
                  <Typography variant="labelFieldForm">
                    <IntlMessages id="source.table.orignal" />
                  </Typography>
                </div>
                <div className="d-flex algin-items-center">
                  <span className={styles.textOverflow}>
                    <Typography variant="textLabel2">
                      {current.originalUrl || current.c6Url}
                    </Typography>
                  </span>
                  <span
                    style={{
                      cursor: "pointer",
                      verticalAlign: "text-bottom",
                    }}
                    className="ml-2"
                    onClick={() =>
                      openInNewTab(current.originalUrl || current.c6Url)
                    }
                  >
                    <LaunchIcon />
                  </span>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </Fragment>
  );
};

function TableSource(props: { sources: EmbeddableSource[] }) {
  const { sources } = props;
  const [sourceSelected, setSourceSelected] = useState(null);

  const handleClose = () => {
    setSourceSelected(null);
  };

  const openPopup = (item) => {
    setSourceSelected(item);
  };

  const getTitle = (item, isUrl = false) => {
    let nameUrl = "";
    if (item.title && !isUrl) {
      nameUrl = item.title;
    } else {
      const { originalUrl, c6Url } = item;
      const urlCombine = originalUrl || c6Url;
      nameUrl = validURL(urlCombine ? urlCombine : "")
        ? getHostURL(urlCombine)
        : urlCombine;
    }
    return nameUrl;
  };

  return (
    <Fragment>
      {sources && sourceSelected && (
        <SourcePopup
          dataSource={sources}
          selected={sourceSelected}
          onClose={handleClose}
          getTitle={getTitle}
        ></SourcePopup>
      )}
      <div>
        <CustomTable<EmbeddableSource>
          //@ts-ignore
          lang={{
            rowsPerPage: <IntlMessages id={"appModule.table.footer"} />,
          }}
          className={styles.TableSource}
          data={sources}
          options={{ selectable: false, pagination: false }}
          columnData={{
            title: {
              label: (
                <Typography variant="small2">
                  <IntlMessages id={"source.table.name"} />
                </Typography>
              ),

              renderCell: (_v, item) => {
                const nameUrl = getTitle(item);
                return (
                  <div
                    className="d-flex algin-items-center"
                    onClick={() => openPopup(item)}
                  >
                    <span className={styles.linkSrc}>
                      {replaceHtmlEntites(nameUrl)}
                      <span
                        style={{
                          cursor: "pointer",
                          verticalAlign: "text-bottom",
                        }}
                        className="ml-2"
                      >
                        <LaunchIcon />
                      </span>
                    </span>
                  </div>
                );
              },
            },
            keywords: {
              label: (
                <Typography variant="small2">
                  <IntlMessages id={"source.table.keyword"} />
                </Typography>
              ),

              renderCell: (keywords) => {
                return <Keyword keywords={keywords}></Keyword>;
              },
            },
            creationDate: {
              label: (
                <Typography variant="small2">
                  <IntlMessages id={"source.table.CreationDate"} />
                </Typography>
              ),

              headerProps: {
                //@ts-ignore
                noWrap: "nowrap",
              },
              renderCell: (date) => {
                return (
                  <Typography variant="subtitleGray">
                    {date ? formatDate(date, LONG_DATE_TIME) : "-"}
                  </Typography>
                );
              },
            },
          }}
        />
      </div>
    </Fragment>
  );
}

export default TableSource;
