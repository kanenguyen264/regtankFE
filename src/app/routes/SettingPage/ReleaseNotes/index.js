import React, { Fragment } from "react";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import PageHeading from "@protego/sdk/RegtankUI/v1/PageHeading/PageHeading";

import { Grid } from "@material-ui/core";
import JRCard from "@protego/sdk/UI/JRCard/JRCard";
import { clone } from "lodash";
import {
  VERSION_1_1_7,
  VERSION_1_1_8,
  VERSION_1_1_9,
  VERSION_1_1_10,
  VERSION_1_1_11,
  VERSION_1_1_12,
  VERSION_1_1_12B,
  VERSION_1_1_13,
  VERSION_1_1_14,
  VERSION_1_1_15,
  VERSION_1_1_16,
  VERSION_1_1_17,
  VERSION_1_1_18,
  VERSION_1_1_19,
  VERSION_1_1_20,
  VERSION_1_1_21,
  VERSION_1_1_22,
  VERSION_1_1_23,
} from "./versionLogInfo";
import styles from './ReleaseNote.module.scss';

const jsonData = [
  VERSION_1_1_23,
  VERSION_1_1_22,
  VERSION_1_1_21,
  VERSION_1_1_20,
  VERSION_1_1_19,
  VERSION_1_1_18,
  VERSION_1_1_17,
  VERSION_1_1_16,
  VERSION_1_1_15,
  VERSION_1_1_14,
  VERSION_1_1_13,
  VERSION_1_1_12B,
  VERSION_1_1_12,
  VERSION_1_1_11,
  VERSION_1_1_10,
  VERSION_1_1_9,
  VERSION_1_1_8,
  VERSION_1_1_7,
];

const Header = () => {
  return (
    <Fragment>
      <PageHeading
        title={<IntlMessages id={"setting.releaseNotes.header"} />}
        customUrlResolver={(index, sub) => {
          switch (index) {
            case 1:
              return [
                <IntlMessages id={"setting.kyc.breadcrumb.settings"} />,
                null,
                false,
              ];
            case 2:
              return [
                <IntlMessages id={"setting.menu.other.breadcrumb"} />,
                null,
                false,
              ];
            case 3:
              return [
                <IntlMessages
                  id={"setting.releaseNotes.breadcrumb.releaseNotes"}
                />,
                null,
                false,
              ];
            default:
              break;
          }
        }}
      />
    </Fragment>
  );
};

const Feature = React.memo(({ feature }) => {
  return (
    <Grid container className="mt-3">
      <Grid item xs={12} className="mb-2">
        <span className={styles.ReleaseNoteSmallTitle}>
          {feature.title}
        </span>
      </Grid>
      <Grid item xs={12}>
        <ul className="mb-0">
          {feature.list.map((li, i) => {
            return (
              <li
                key={i}
                className={styles.ReleaseNoteContentText}
              >
                {li.description}
              </li>
            );
          })}
        </ul>
      </Grid>
    </Grid>
  );
});

const Content = ({ versions }) => {
  versions = clone(versions);

  return (
    <JRCard
      className={styles.JRCard}
      disableShadow
    >
      {versions.map((version, x) => {
        return (
          <Grid
            key={x}
            container
            className="mb-3"
          >
            <Grid item xs={12} className="mb-2">
              <div className={styles.ReleaseNoteTitle}>
                {version.title}
              </div>
            </Grid>

            <Grid item xs={12}>
              <span
                className={styles.ReleaseNoteDate}
              >
                {version.postedDate}
              </span>
            </Grid>

            {version.features.map((feature, i) => {
              return <Feature key={i} feature={feature} />;
            })}
          </Grid>
        );
      })}
    </JRCard>
  );
};

const ReleaseNotesPage = function ReleaseNotesPage(props) {
  return (
    <Fragment>
      <Header />
      <Content versions={jsonData} />
    </Fragment>
  );
};

export default ReleaseNotesPage;
