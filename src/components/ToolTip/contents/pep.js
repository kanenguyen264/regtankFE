import React from "react";
import styles from "../styles.module.scss";
import { ReactComponent as ArrowRightAltIcon } from "assets/icons/ArrowRightAltIcon.svg";
import { ReactComponent as ArrowLeftAltIcon } from "assets/icons/ArrowLeftAltIcon.svg";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import { FormattedHTMLMessage } from "react-intl";
import { Typography } from "@material-ui/core";
import { toRem } from "@protego/sdk/utils/measurements";
import { Scrollbars } from "react-custom-scrollbars";
import clsx from "clsx";

export const Tier4 = (
  <React.Fragment>
    <Typography className={styles.headerTitle}>
      <IntlMessages id="setting.kyc.title.tier4" />
    </Typography>
    <div className={styles.content}>
      <FormattedHTMLMessage id="setting.kyc.content.tier4" />
    </div>
  </React.Fragment>
);

export const Tier3 = (
  <React.Fragment>
    <Typography className={styles.headerTitle}>
      <IntlMessages id="setting.kyc.title.tier3" />
    </Typography>
    <div className={styles.content}>
      <ul class="menu" style={{ paddingLeft: toRem(15) }}>
        <FormattedHTMLMessage id="setting.kyc.content.tier3" />
      </ul>
    </div>
  </React.Fragment>
);
export const Tier2 = (
  <React.Fragment>
    <Typography className={styles.headerTitle}>
      <IntlMessages id="setting.kyc.title.tier2" />
    </Typography>
    <div className={styles.content}>
      <ul class="menu" style={{ paddingLeft: toRem(15) }}>
        <FormattedHTMLMessage id="setting.kyc.content.tier2" />
      </ul>
    </div>
  </React.Fragment>
);
export const Tier1 = (
  <React.Fragment>
    <Typography className={styles.headerTitle}>
      <IntlMessages id="setting.kyc.title.tier1" />
    </Typography>
    <div className={styles.content}>
      <ul class="menu" style={{ paddingLeft: toRem(15) }}>
        <FormattedHTMLMessage id="setting.kyc.content.tier1" />
      </ul>
    </div>
  </React.Fragment>
);

export const RCA = (
  <React.Fragment>
    <Typography className={styles.headerTitle}>
      <IntlMessages id="setting.djkyc.RCA" />
    </Typography>
    <div className={styles.content}>
      <IntlMessages id="setting.djkyc.RCA.content" />
    </div>
  </React.Fragment>
);

export const DowJonesTier1 = (
  <React.Fragment>
    <Typography
      className={styles.headerTitle}
      style={{ paddingBottom: toRem(8) }}
    >
      <IntlMessages id="setting.kyc.title.tier1" />
    </Typography>
    <span
      className={styles.content}
      style={{ color: "#fff", fontSize: toRem(14) }}
    >
      <FormattedHTMLMessage id="setting.djkyc.tooltip.Tier1" />
    </span>
  </React.Fragment>
);

export const DowJonesTier2 = (
  <React.Fragment>
    <Typography
      className={styles.headerTitle}
      style={{ paddingBottom: toRem(8) }}
    >
      <IntlMessages id="setting.kyc.title.tier2" />
    </Typography>
    <span
      className={styles.content}
      style={{ color: "#fff", fontSize: toRem(14) }}
    >
      <FormattedHTMLMessage id="setting.djkyc.tooltip.Tier2" />
    </span>
  </React.Fragment>
);

export const DowJonesTier3 = (
  <React.Fragment>
    <Typography
      className={styles.headerTitle}
      style={{ paddingBottom: toRem(8) }}
    >
      <IntlMessages id="setting.kyc.title.tier3" />
    </Typography>
    <span
      className={styles.content}
      style={{ color: "#fff", fontSize: toRem(14) }}
    >
      <FormattedHTMLMessage id="setting.djkyc.tooltip.Tier3" />
    </span>
  </React.Fragment>
);

export const DowJonesRCA = (
  <React.Fragment>
    <span
      className={styles.content}
      style={{ color: "#fff", fontSize: toRem(14) }}
    >
      <FormattedHTMLMessage id="setting.djkyc.tooltip.rca" />
    </span>
  </React.Fragment>
);

export const DowJonesActivePepScoreSetting = (
  <React.Fragment>
    <span
      className={styles.content}
      style={{ color: "#fff", fontSize: toRem(16), fontWeight: 400 }}
    >
      <FormattedHTMLMessage id="setting.djkyc.tooltip.activePep" />
    </span>
  </React.Fragment>
);

export const DowJonesInActivePepScoreSetting = (
  <React.Fragment>
    <span
      className={styles.content}
      style={{ color: "#fff", fontSize: toRem(16), fontWeight: 400 }}
    >
      <FormattedHTMLMessage id="setting.djkyc.tooltip.inactivePep" />
    </span>
  </React.Fragment>
);

export const DowJonesTier3ScoreSetting = (
  <React.Fragment>
    <span
      className={styles.content}
      style={{ color: "#fff", fontSize: toRem(16), fontWeight: 400 }}
    >
      <IntlMessages id="setting.djkyc.title.Tier3" />
      <br />
      <FormattedHTMLMessage id="setting.djkyc.tooltip.Tier3" />
    </span>
  </React.Fragment>
);

export const DowJonesRCAScoreSetting = (
  <React.Fragment>
    <span
      className={styles.content}
      style={{ color: "#fff", fontSize: toRem(16), fontWeight: 400 }}
    >
      <IntlMessages id="setting.djkyc.tooltip.rca" />
    </span>
  </React.Fragment>
);

export const DowJonesTier2ScoreSetting = (
  <React.Fragment>
    <span
      className={styles.content}
      style={{ color: "#fff", fontSize: toRem(16), fontWeight: 400 }}
    >
      <IntlMessages id="setting.djkyc.title.Tier2" />
      <br />
      <FormattedHTMLMessage id="setting.djkyc.tooltip.Tier2" />
    </span>
  </React.Fragment>
);

export const DowJonesTier1ScoreSetting = (
  <React.Fragment>
    <span
      className={styles.content}
      style={{ color: "#fff", fontSize: toRem(16), fontWeight: 400 }}
    >
      <IntlMessages id="setting.djkyc.title.Tier1" />
      <br />
      <FormattedHTMLMessage id="setting.djkyc.tooltip.Tier1" />
    </span>
  </React.Fragment>
);

export const PEP = (isShowMore, onPressShowMore) => {
  return (
    <div className={styles.tooltipWithScrollbar}>
      <Scrollbars
        autoHeight
        autoHeightMin={0}
        autoHeightMax={300}
        renderThumbVertical={(props) => {
          return (
            <div
              {...props}
              className={styles.vCustomScrollBarThumb}
              style={{ ...props.style }}
            />
          );
        }}
        renderTrackHorizontal={() => {
          return <div style={{ display: "none" }} />;
        }}
        renderTrackVertical={(props) => {
          return (
            <div
              {...props}
              className={styles.vCustomScrollBarTrack}
              style={{ ...props.style }}
            />
          );
        }}
        renderView={(props) => (
          <div
            {...props}
            style={{ ...props.style }}
            className={styles.rvScrollBar}
          />
        )}
      >
        <div
          className={
            isShowMore ? styles.minHeightContent : styles.maxHeightContent
          }
        >
          <Typography className={styles.headerTitle}>PEP</Typography>
          {isShowMore ? (
            <div className={styles.contentShort}>
              <ul class="menu" style={{ paddingLeft: toRem(15) }}>
                <li>
                  <Typography>
                    <IntlMessages id="setting.kyc.title.tier1" />
                  </Typography>
                </li>
                <li>
                  <Typography>
                    <IntlMessages id="setting.kyc.title.tier2" />
                  </Typography>
                </li>
                <li>
                  <Typography>
                    <IntlMessages id="setting.kyc.title.tier3" />
                  </Typography>
                </li>
                <li>
                  <Typography>
                    <IntlMessages id="setting.kyc.title.tier4" />
                  </Typography>
                </li>
              </ul>
            </div>
          ) : (
            <div className={styles.content}>
              <ul class="menu" style={{ paddingLeft: toRem(15) }}>
                <li>
                  <Typography className={styles.headerTitleContent}>
                    <IntlMessages id="setting.kyc.title.tier1" />
                  </Typography>
                  <ul
                    className={styles.subtext1}
                    style={{ listStyleType: "decimal" }}
                  >
                    <FormattedHTMLMessage id="setting.kyc.content.tier1" />
                  </ul>
                </li>
                <li>
                  <Typography className={styles.headerTitleContent}>
                    <IntlMessages id="setting.kyc.title.tier2" />
                  </Typography>
                  <ul
                    className={styles.subtext1}
                    style={{ listStyleType: "decimal" }}
                  >
                    <FormattedHTMLMessage id="setting.kyc.content.tier2" />
                  </ul>
                </li>
                <li>
                  <Typography className={styles.headerTitleContent}>
                    <IntlMessages id="setting.kyc.title.tier3" />
                  </Typography>

                  <ul
                    className={styles.subtext1}
                    style={{ listStyleType: "decimal" }}
                  >
                    <FormattedHTMLMessage id="setting.kyc.content.tier3" />
                  </ul>
                </li>
                <li>
                  <Typography className={styles.headerTitleContent}>
                    <IntlMessages id="setting.kyc.title.tier4" />
                  </Typography>
                  <FormattedHTMLMessage id="setting.kyc.content.tier4" />
                </li>
              </ul>
            </div>
          )}
        </div>
      </Scrollbars>
      <div className={styles.readMore}>
        <span onClick={() => onPressShowMore(!isShowMore)}>
          {isShowMore ? "Show more" : "Show less"}{" "}
          {/* {isShowMore ? <ArrowRightAltIcon /> : <ArrowLeftAltIcon />} */}
        </span>
      </div>
    </div>
  );
};

export const DowJonesActivePEP = (isShowMore, onPressShowMore) => {
  return (
    <div className={styles.tooltipWithScrollbar}>
      <Scrollbars
        autoHeight
        autoHeightMin={0}
        autoHeightMax={350}
        renderThumbVertical={(props) => {
          return (
            <div
              {...props}
              className={styles.vCustomScrollBarThumb}
              style={{ ...props.style }}
            />
          );
        }}
        renderTrackHorizontal={() => {
          return <div style={{ display: "none" }} />;
        }}
        renderTrackVertical={(props) => {
          return (
            <div
              {...props}
              className={styles.vCustomScrollBarTrack}
              style={{ ...props.style }}
            />
          );
        }}
        renderView={(props) => (
          <div
            {...props}
            style={{ ...props.style }}
            className={styles.rvScrollBar}
          />
        )}
      >
        <div
          className={
            isShowMore ? styles.minHeightContent : styles.maxHeightContent
          }
        >
          <Typography className={styles.headerTitle}>
            <FormattedHTMLMessage id="djkyc.tooltip.activePep" />
          </Typography>
          {isShowMore ? (
            <div>
              <ul
                class="menu"
                style={{ paddingLeft: toRem(15) }}
                className={styles.tooltipDJItemsLvl1}
              >
                <li>
                  <Typography>
                    <IntlMessages id="setting.kyc.title.tier1" />
                  </Typography>
                </li>
                <li>
                  <Typography>
                    <IntlMessages id="setting.kyc.title.tier2" />
                  </Typography>
                </li>
                <li>
                  <Typography>
                    <IntlMessages id="setting.kyc.title.tier3" />
                  </Typography>
                </li>
                <li>
                  <Typography>
                    <IntlMessages id="setting.djkyc.tooltip.rca" />
                  </Typography>
                </li>
              </ul>
            </div>
          ) : (
            <div className={clsx(styles.content, styles.showLess)}>
              <ul
                class="menu"
                style={{ paddingLeft: toRem(15) }}
                className={styles.tooltipDJItemsLvl1}
              >
                <li>
                  <Typography>
                    <IntlMessages id="setting.kyc.title.tier1" />
                  </Typography>
                  <p className={styles.tooltipItemsLvl2}>
                    <FormattedHTMLMessage id="setting.djkyc.content.tier1" />
                  </p>
                </li>
                <li>
                  <Typography>
                    <IntlMessages id="setting.kyc.title.tier2" />
                  </Typography>
                  <p className={styles.tooltipItemsLvl2}>
                    <FormattedHTMLMessage id="setting.djkyc.content.tier2" />
                  </p>
                </li>
                <li>
                  <Typography>
                    <IntlMessages id="setting.kyc.title.tier3" />
                  </Typography>
                  <p className={styles.tooltipItemsLvl2}>
                    <FormattedHTMLMessage id="setting.djkyc.content.tier3" />
                  </p>
                </li>
                <li>
                  <Typography>
                    <IntlMessages id="setting.djkyc.tooltip.rca" />
                  </Typography>
                </li>
              </ul>
            </div>
          )}
        </div>
      </Scrollbars>
      <div className={styles.readMore}>
        <span onClick={() => onPressShowMore(!isShowMore)}>
          {isShowMore ? "Show more" : "Show less"}{" "}
          {isShowMore ? <ArrowRightAltIcon /> : <ArrowLeftAltIcon />}
        </span>
      </div>
    </div>
  );
};

export const DowJonesInactivePEP = (isShowMore, onPressShowMore) => {
  return (
    <div className={styles.tooltipDownJonesWithScrollbar}>
      <Scrollbars
        autoHeight
        width={440}
        autoHeightMin={0}
        autoHeightMax={350}
        renderThumbVertical={(props) => {
          return (
            <div
              {...props}
              className={styles.vCustomScrollBarThumb}
              style={{ ...props.style }}
            />
          );
        }}
        renderTrackHorizontal={() => {
          return <div style={{ display: "none" }} />;
        }}
        renderTrackVertical={(props) => {
          return (
            <div
              {...props}
              className={styles.vCustomScrollBarTrack}
              style={{ ...props.style }}
            />
          );
        }}
        renderView={(props) => (
          <div
            {...props}
            style={{ ...props.style }}
            className={styles.rvScrollBar}
          />
        )}
      >
        <div
          className={
            isShowMore ? styles.minHeightContent : styles.maxHeightContent
          }
        >
          <Typography className={styles.headerTitle}>
            <FormattedHTMLMessage id="djkyc.tooltip.inactivePep" />
          </Typography>
          {isShowMore ? (
            <div>
              <ul
                class="menu"
                style={{ paddingLeft: toRem(15) }}
                className={styles.tooltipDJItemsLvl1}
              >
                <li>
                  <Typography>
                    <IntlMessages id="setting.kyc.title.tier1" />
                  </Typography>
                </li>
                <li>
                  <Typography>
                    <IntlMessages id="setting.kyc.title.tier2" />
                  </Typography>
                </li>
                <li>
                  <Typography>
                    <IntlMessages id="setting.kyc.title.tier3" />
                  </Typography>
                </li>
                <li>
                  <Typography>
                    <IntlMessages id="setting.djkyc.tooltip.rca" />
                  </Typography>
                </li>
              </ul>
            </div>
          ) : (
            <div className={clsx(styles.content, styles.showLess)}>
              <ul
                class="menu"
                style={{ paddingLeft: toRem(15) }}
                className={styles.tooltipDJItemsLvl1}
              >
                <li>
                  <Typography>
                    <IntlMessages id="setting.kyc.title.tier1" />
                  </Typography>
                  <p className={styles.tooltipItemsLvl2}>
                    <FormattedHTMLMessage id="setting.djkyc.content.tier1" />
                  </p>
                </li>
                <li>
                  <Typography>
                    <IntlMessages id="setting.kyc.title.tier2" />
                  </Typography>
                  <p className={styles.tooltipItemsLvl2}>
                    <FormattedHTMLMessage id="setting.djkyc.content.tier2" />
                  </p>
                </li>
                <li>
                  <Typography>
                    <IntlMessages id="setting.kyc.title.tier3" />
                  </Typography>
                  <p className={styles.tooltipItemsLvl2}>
                    <FormattedHTMLMessage id="setting.djkyc.content.tier3" />
                  </p>
                </li>
                <li>
                  <Typography>
                    <IntlMessages id="setting.djkyc.tooltip.rca" />
                  </Typography>
                </li>
              </ul>
            </div>
          )}
        </div>
      </Scrollbars>
      <div className={styles.readMore}>
        <span onClick={() => onPressShowMore(!isShowMore)}>
          {isShowMore ? "Show more" : "Show less"}{" "}
          {isShowMore ? <ArrowRightAltIcon /> : <ArrowLeftAltIcon />}
        </span>
      </div>
    </div>
  );
};
