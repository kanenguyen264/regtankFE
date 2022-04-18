import Slider from "@protego/sdk/RegtankUI/v1/Slider";
import { useFormikContext } from "formik";
import React, { Fragment, useEffect, useState } from "react";
import styles from "./filterLiveness.module.scss";

const marks = [
  {
    value: 10,
  },
  {
    value: 25,
  },
  {
    value: 50,
  },
  {
    value: 75,
  },
  {
    value: 91,
  },
];

const FilterLiveness = ({ disabled = false, livenessMatchLevel, onChange }) => {
  const [matchLevel, setMatchLevel] = useState(livenessMatchLevel);
  const formikContext = useFormikContext();

  useEffect(() => {
    setMatchLevel(livenessMatchLevel);
  }, [livenessMatchLevel]);

  const valueText = (value) => {
    return `${value}%`;
  };

  const handleChange = (e, value) => {
    setMatchLevel(value);
    formikContext.setFieldValue("livenessConfidence", value);
  };

  return (
    <div className={styles.filterLivenessWrapper}>
        <Slider
          defaultValue={0}
          valueLabelDisplay="on"
          step={1}
          marks={marks}
          value={matchLevel}
          min={10}
          max={90}
          valueLabelFormat={(value) => valueText(value)}
          onChange={!disabled && handleChange}
          style={disabled ? { pointerEvents: "none" } : {}}
        />
    </div>
  );
};
export default FilterLiveness;
