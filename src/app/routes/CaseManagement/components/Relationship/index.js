import React, { Fragment, memo } from "react";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import styles from "./style.module.scss";
import clsx from "clsx";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { Typography } from "@mui/material";
import { isEmpty } from "lodash";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { displayLimitText } from "util/string";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
const displayRelationName = (profile) => {
  if (profile.profileType === "KYC") {
    return profile?.profileInfo?.individualRequest;
  } else if (profile.profileType === "KYB") {
    return profile?.profileInfo?.businessName;
  } else {
    return profile?.profileInfo?.asset;
  }
};

const Relationship = ({ profiles }) => {
  return (
    <JRCard
      className={clsx(styles.relationship, {
        [styles.relationship__empty]: isEmpty(profiles),
      })}
      header={
        <Typography
          style={{ fontSize: toRem(18) }}
          variant="title"
          component={"span"}
        >
          <FormattedHTMLMessage id={"caseManagement.relationship"} />
        </Typography>
      }
      headerLine
    >
      {profiles && !isEmpty(profiles) ? (
        <div className={styles.relationship_body}>
          {profiles.map((item) => {
            return (
              <div className={styles.relationship_item}>
                <div>
                  <span>
                    <Tooltip
                      title={
                        item.profileInfo?.individualRequest?.name ||
                        item.profileInfo?.businessName ||
                        item.profileInfo?.asset
                      }
                      placement="top-start"
                    >
                      <span>
                        {displayLimitText(
                          item.profileInfo?.individualRequest?.name ||
                            item.profileInfo?.businessName ||
                            item.profileInfo?.asset,
                          13
                        )}
                      </span>
                    </Tooltip>
                  </span>
                </div>

                <div className={styles.relationship_associations}>
                  <span className={styles.relationship_number}>
                    {item?.profiles?.length || "0"}
                  </span>
                  <span>Associations</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.relationship_body}>
          <FormattedHTMLMessage id="caseManagement.relationship.noRelationship" />
        </div>
      )}
    </JRCard>
  );
};

export default Relationship;
