import { Text, View } from "@react-pdf/renderer";
import HrTag from "app/reports/components/HrTag";
import styles from "app/reports/styles";
import React from "react";

const defaultOptions = {
  isShowTitle: true
};

const ReportHeader = (props) => {
  const { options, children, ...others } = props;

  const mergeOptions = {
    ...defaultOptions,
    ...options
  };

  const {
    isShowTitle,
    headerTitle,
    subHeaderTitle,
    title,
    subTitle
  } = mergeOptions;
  return (
    <>
      <View fixed style={styles.header} {...others}>
        <View key="report-header-container" style={styles.headerContainer}>
          <View>
            <HrTag style={styles.headerTopLine}></HrTag>
            <View style={styles.headerTopRight}>
              {Array.isArray(headerTitle) ? (
                headerTitle.map((item, index) => {
                  return (
                    <Text
                      key={index}
                      style={[
                        styles.fontSize14,
                        index === 0
                          ? styles.headerTopRightFirstWord
                          : styles.headerTopRightSecondWord
                      ]}
                    >
                      {item}
                    </Text>
                  );
                })
              ) : (
                <Text style={[styles.fontSize14, styles.fontSize700]}>
                  {headerTitle}
                </Text>
              )}
            </View>
          </View>
          {/* <View key="header-top-subtitle" style={styles.headerTopSubtitle}>
            <Text>{subHeaderTitle}</Text>
          </View> */}
        </View>
      </View>
      {isShowTitle && (
        <View style={styles.headerTitle}>
          <Text style={styles.h1Light}>{title}</Text>
          <Text style={[styles.h1Bold, { marginBottom: 25 }]}>{subTitle}</Text>
          <HrTag></HrTag>
        </View>
      )}
    </>
  );
};

// ReportHeader.propTypes = {
//   options: PropTypes.shape({
//     isShowTitle: PropTypes.bool,
//     headerTitle: PropTypes.oneOfType([
//       PropTypes.oneOf([PropTypes.array, PropTypes.string])
//     ]),
//     subHeaderTitle: PropTypes.string,
//     title: PropTypes.string,
//     subTitle: PropTypes.string
//   })
// };

export default ReportHeader;
