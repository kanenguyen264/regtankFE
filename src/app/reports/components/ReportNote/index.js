import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import Table from "app/reports/components/Table";
import { TableCell } from "app/reports/components/Table/TableCell";
import { TableRow } from "app/reports/components/Table/TableRow";
import globalStyle from "app/reports/styles";
import attachmentIcon from "assets/images/attachments.png";
import React from "react";
import { useIntl } from "react-intl";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { renderUser } from "app/reports/utils";
import useTextMeasurement from "app/reports/components/useTextMeasurement";
const localStyle = StyleSheet.create({
  ...globalStyle,
  attachment: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 6,
    alignContent: "center"
  },
  attachmentLast: {
    marginBottom: 0
  }
});

const ReportNote = ({ notes }) => {
  const { formatMessage } = useIntl();
  const textMeasurement = useTextMeasurement();
  return (
    <View>
      {notes && notes.length > 0 ? (
        <Table disableEvenOdd>
          {notes &&
            notes.map((item) => {
              return (
                <View key={item.id}>
                  <TableRow evenOdd={"even"}>
                    <TableCell weighting={2} style={localStyle.notesTitle}>
                      {formatMessage({
                        id: "kyt.postedBy"
                      })}
                    </TableCell>
                    <TableCell weighting={3} style={localStyle.notesContent}>
                      {item.createdBy ? renderUser(item.createdBy) : "-"}
                    </TableCell>
                    <TableCell weighting={2} style={localStyle.notesTitle}>
                      {formatMessage({
                        id: "kyt.transaction.dateTime"
                      })}
                    </TableCell>
                    <TableCell weighting={3} style={localStyle.notesContent}>
                      {formatDate(item.updatedAt, LONG_DATE_TIME) || "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow evenOdd={"odd"}>
                    <TableCell
                      weighting={2}
                      style={[
                        localStyle.notesTitle,
                        { justifyContent: "flex-start" }
                      ]}
                    >
                      {formatMessage({
                        id: "notes"
                      })}
                    </TableCell>
                    <TableCell weighting={8} style={localStyle.notesContent}>
                      {item.content ? textMeasurement(item.content, 600) : "-"}
                    </TableCell>
                  </TableRow>
                  {item.attachments && item.attachments.length > 0 && (
                    <TableRow evenOdd={"even"}>
                      <TableCell
                        weighting={2}
                        style={[
                          localStyle.notesTitle,
                          { justifyContent: "flex-start" }
                        ]}
                      >
                        {formatMessage({
                          id: "appModule.attachments"
                        })}
                      </TableCell>
                      <TableCell
                        weighting={8}
                        style={[localStyle.notesContent, { paddingLeft: 4 }]}
                      >
                        {item.attachments.map((attachment, index) => {
                          return (
                            <View
                              key={attachment.id}
                              style={[
                                localStyle.attachment,
                                index === item.attachments.length - 1
                                  ? localStyle.attachmentLast
                                  : ""
                              ]}
                            >
                              <Image
                                style={{
                                  height: 12,
                                  marginRight: 4
                                }}
                                src={attachmentIcon}
                              ></Image>
                              <Text>{attachment.name}</Text>
                            </View>
                          );
                        })}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow
                    evenOdd={"odd"}
                    style={{ marginBottom: 10 }}
                  ></TableRow>
                </View>
              );
            })}
        </Table>
      ) : (
        <Table>
          <TableRow>
            <TableCell weighting={10}>
              {formatMessage({
                id: "kyt.noNotesToShow"
              })}
            </TableCell>
          </TableRow>
        </Table>
      )}
    </View>
  );
};

export default ReportNote;
