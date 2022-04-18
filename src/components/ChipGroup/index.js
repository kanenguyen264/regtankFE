import { Chip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { toRem } from "@protego/sdk/utils/measurements";
import { ReactComponent as ChipDeleteIcon } from "assets/icons/ChipDeleteIcon.svg";
import React, { Fragment } from "react";
import styles from "./chipStyle.module.scss";
import PropTypes from "prop-types";
const StyleChip = withStyles({
  root: {
    backgroundColor: "rgba(0, 128, 255, 0.08)",
    color: "#0080FF",
    maxWidth: "100%",
    fontSize: toRem(14)
  }
})(Chip);

const ChipGroup = (props) => {
  const { data, handleChipDelete } = props;
  if (data?.length) {
    return (
      <Fragment>
        {data?.map((item, index) => {
          if (!item) return null;
          return (
            <StyleChip
              key={index}
              className={styles.mgChip}
              size={"medium"}
              deleteIcon={
                <div className={styles.chipDelete}>
                  <ChipDeleteIcon />
                </div>
              }
              label={item?.name}
              onDelete={() => handleChipDelete(data, item)}
            />
          );
        })}
      </Fragment>
    );
  }
  return null;
};

ChipGroup.propTypes = {
  data: PropTypes.array
};
ChipGroup.defaultProps = {
  data: []
};

export default ChipGroup;
