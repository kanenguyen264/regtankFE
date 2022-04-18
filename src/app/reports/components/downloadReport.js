import React from "react";
import { pdf } from "@react-pdf/renderer";
import FileSaver from "file-saver";
import { customerMe } from "../../../services/CustomerService";

export default async function downloadReport(Component, filename, props) {
  try {
    const { data: me } = await customerMe();
    const blobData = await pdf(<Component {...props} me={me} />).toBlob();
    FileSaver.saveAs(blobData, filename);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
