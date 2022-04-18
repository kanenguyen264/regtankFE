import * as React from "react";
import styles from "../../Dashboard.module.scss";

const NumberOfRecords = ({ title, number }) => {
  return (
    <div className={styles.box}>
      <p>{title}</p>
      <div className={styles.number}>{number >= 0 ? number : 'N/A'}</div>
    </div>
  );
};

export default NumberOfRecords;
