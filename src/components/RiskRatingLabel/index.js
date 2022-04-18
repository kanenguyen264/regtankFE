import { Badge } from "@material-ui/core";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { capitalizeFirst } from "@protego/sdk/utils/string";
import clsx from "clsx";
import { RISK_LEVEL_COLOR, RISK_LEVEL_TEXT } from "constants/RiskLevelType";
import { isNil, round } from "lodash";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { ReactComponent as Edit } from "assets/icons/Edit.svg";

const settingSize = {
  tooSmall: {
    width: toRem(38),
    height: toRem(40),
  },
  small: {
    width: toRem(49),
    height: toRem(52),
  },
  medium: {
    width: toRem(60),
    height: toRem(70),
    fontSize: toRem(25),
  },
  large: {
    width: toRem(80),
    height: toRem(90),
  },
};

const useStyles = makeStyles((theme) => ({
  riskCore: {
    background: RISK_LEVEL_COLOR.LOW,
    color: "#ffffff",
    display: "inline-flex",
    borderRadius: theme.typography.pxToRem(8),
    width: theme.typography.pxToRem(50),
    height: theme.typography.pxToRem(55),
    alignItems: "center",
    justifyContent: "center",
  },
  riskDescription: {
    borderRadius: theme.typography.pxToRem(18),
    background: RISK_LEVEL_COLOR.LOW,
    color: "#ffffff",
    display: "inline-flex",
    height: theme.typography.pxToRem(37),
    minWidth: theme.typography.pxToRem(100),
    alignItems: "center",
    justifyContent: "center",
    fontSize: toRem(17),
    paddingLeft: theme.typography.pxToRem(10),
    paddingRight: theme.typography.pxToRem(10),
  },
}));

const useBadgeStyles = makeStyles({
  badgeStyle: {
    "& .MuiBadge-badge": {
      background: "#fff",
      height: toRem(20),
      with: toRem(20),
      minWidth: toRem(20),
      fontWeight: 400,
      borderRadius: "50%",
      color: ({ color, isManualEdit }) => {
        return isManualEdit ? "#dee2e6" : color;
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
      if (String(roundVal).length > 2) {
        return (
          <Tooltip title={roundVal}>
            <div>99+</div>
          </Tooltip>
        );
      } else {
        return roundVal;
      }
    }
  };
  const style = {
    background: color,
    ...settingSize[size ? size : "small"],
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
              numberOfChanges && numberOfChanges > 0 ? (
                <Tooltip
                  arrow
                  placement="top"
                  title={<IntlMessages id={"kyc.number.of.edit"} />}
                >
                  <span
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {numberOfChanges}
                  </span>
                </Tooltip>
              ) : isManualEdit ? (
                <Tooltip
                  arrow
                  placement="top"
                  title={<IntlMessages id={"risk-score.manual-edited"} />}
                >
                  <Edit style={{ width: toRem(15) }} />
                </Tooltip>
              ) : null
            }
            className={badgeStyles.badgeStyle}
            overlap="circle"
          >
            <label style={style} className={classCombine} {...props}>
              {type === "San" ? "SAN" : renderRiskValue()}
            </label>
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
