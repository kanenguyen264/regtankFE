import { Badge } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@mui/material";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import { capitalizeFirst } from "@protego/sdk/utils/string";
import { ReactComponent as Edit } from "assets/icons/Edit.svg";
import clsx from "clsx";
import {
  RISK_LEVEL_COLOR,
  RISK_LEVEL_TEXT,
  RISK_LEVEL_TEXT_COLOR,
  INFINITY,
} from "constants/RiskLevelType";
import { isNil, round } from "lodash";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { convertValueToCharacter } from "util/string";
const useStyles = makeStyles((theme) => ({
  riskCore: {
    background: RISK_LEVEL_COLOR.LOW,
    color: ThemeColors.white,
    height: toRem(28),
    paddingLeft: toRem(12),
    paddingRight: toRem(12),
    borderRadius: toRem(24),
    marginRight: toRem(6),
    marginTop: toRem(4),
    marginBottom: toRem(4),
    fontSize: `${toRem(14)} !important`,
    display: "flex",
    fontWeight: 500,
    minWidth: toRem(59),
    justifyContent: "center",
    alignItems: "center",
  },
  riskCoreChild: {
    marginRight: toRem(-10),
    background: ThemeColors.white,
    color: ThemeColors.mainBlackText,
    height: toRem(24),
    paddingLeft: toRem(9),
    paddingRight: toRem(9),
    borderRadius: toRem(24),
    marginLeft: toRem(8),
    marginTop: toRem(2),
    marginBottom: toRem(2),
    fontSize: `${toRem(14)} !important`,
    display: "flex",
    fontWeight: 500,
    textAlign: "center",
    alignItems: "center",
    minWidth: toRem(27),
    justifyContent: "center",
  },
  riskDescription: {
    borderRadius: toRem(18),
    background: RISK_LEVEL_COLOR.LOW,
    color: ThemeColors.white,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: toRem(17),
    paddingLeft: toRem(10),
    paddingRight: toRem(10),
  },
}));

const useBadgeStyles = makeStyles({
  badgeStyle: {
    "& .MuiBadge-badge": {
      background: ThemeColors.white,
      height: toRem(20),
      with: toRem(20),
      minWidth: toRem(20),
      fontWeight: 400,
      borderRadius: "50%",
      color: ({ color, isManualEdit }) => {
        return isManualEdit ? ThemeColors.grayBorder : color;
      },
      border: ({ color, isManualEdit }) => {
        return isManualEdit ? null : `1px solid ${color}`;
      },
      boxShadow: ({ isManualEdit }) => {
        return isManualEdit ? "2px 2px 5px 0px" : null;
      },
      padding: 0,
      fontSize: toRem(12),
      cursor: "pointer",
    },
  },
});

const RiskRatingLabel = ({
  value,
  level,
  size,
  className,
  description,
  showingScore,
  numberOfChanges,
  type,
  showLevel,
  isManualEdit,
  props,
}) => {
  const classes = useStyles();

  const color = RISK_LEVEL_COLOR[level];
  const textColor = RISK_LEVEL_TEXT_COLOR[level];
  const badgeStyles = useBadgeStyles({ color, isManualEdit });

  if (showLevel && isNil(level)) {
    return "-";
  }

  if (showingScore && isNil(value)) {
    return "-";
  }

  const classCombine = clsx(classes.riskCore, className);

  const renderRiskValue = () => {
    let roundVal = 0;
    if (showLevel) {
      roundVal = value;
      return roundVal;
    } else {
      roundVal = round(value);
      let showTooltip = roundVal > 999 ? false : true;
      if (value === INFINITY) {
        return INFINITY;
      }
      return (
        <div
          style={{
            color: textColor,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Tooltip
            component={"div"}
            placement={"top"}
            disableHoverListener={showTooltip}
            title={<Typography variant="body1">{roundVal}</Typography>}
          >
            <div className="d-flex align-content-center justify-content-center">
              {convertValueToCharacter(roundVal)}
            </div>
          </Tooltip>

          {numberOfChanges > 0 && (
            <Tooltip
              arrow
              placement="top-start"
              title={
                <Typography variant="body1">
                  <IntlMessages id={"kyc.number.of.edit"} />
                </Typography>
              }
            >
              <div className={classes.riskCoreChild}>
                {convertValueToCharacter(numberOfChanges)}
              </div>
            </Tooltip>
          )}
        </div>
      );
    }
  };
  const style = {
    background: color,
  };

  const renderDescription = (_color) => {
    const classDescription = clsx(
      classes.riskDescription,
      description.className
    );
    return (
      <label style={{ background: color }} className={classDescription}>
        {capitalizeFirst(level) + " Risk"}
      </label>
    );
  };

  return (
    <Fragment>
      {showingScore && (
        <div>
          <Badge
            component="div"
            badgeContent={
              isManualEdit ? (
                <Tooltip
                  arrow
                  placement="top"
                  title={
                    <Typography variant="body1">
                      <IntlMessages id={"risk-score.manual-edited"} />
                    </Typography>
                  }
                >
                  <Edit style={{ width: toRem(15) }} />
                </Tooltip>
              ) : null
            }
            className={badgeStyles.badgeStyle}
            overlap="circle"
          >
            <span style={style} className={classCombine} {...props}>
              {type === "San" ? "SAN" : renderRiskValue()}
            </span>
          </Badge>
        </div>
      )}
      {description && renderDescription(color)}
    </Fragment>
  );
};

RiskRatingLabel.propTypes = {
  size: PropTypes.oneOf(["tooSmall", "small", "medium", "large"]),
  value: PropTypes.any,
  level: PropTypes.oneOf(["LOW", "MEDIUM", "HIGH"]),
  description: PropTypes.object,
  showingScore: PropTypes.bool,
  showLevel: PropTypes.bool,
};

RiskRatingLabel.defaultProps = {
  size: "small",
  level: RISK_LEVEL_TEXT.LOW,
  showingScore: true,
  showLevel: false,
};

export default RiskRatingLabel;
