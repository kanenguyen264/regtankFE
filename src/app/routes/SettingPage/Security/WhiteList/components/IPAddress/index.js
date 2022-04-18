import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { ReactComponent as IconDeleteGrey } from "assets/icons/IconDeleteGrey.svg";
import { filter } from "lodash";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddIPAddress from "./AddIPAddress";
import IconButton from "@mui/material/IconButton";
import styles from "./../ComponentsWhitelist.module.scss";
import CustomScrollbar from "@protego/sdk/RegtankUI/v1/Scrollbar";
const IPAddress = function IPAddress({
  addListIPAddress,
  typeEnable,
  isReset,
  disabled = false,
}) {
  const { whitelist } = useSelector((state) => state.settings);
  const [selectCurrentIPAddress, setSelectCurrentIPAddress] = useState([]);
  useEffect(() => {
    setSelectCurrentIPAddress(whitelist?.ips ? whitelist?.ips : []);
  }, [whitelist?.ips]);
  const addToList = (item) => {
    const { ipAddress } = item;
    const SelectCountryTamp = [...selectCurrentIPAddress];
    SelectCountryTamp.unshift(ipAddress);
    setSelectCurrentIPAddress(SelectCountryTamp);
  };
  const deleteItem = (item) => {
    if (typeEnable) {
      const IPAddress = filter(selectCurrentIPAddress, function (o) {
        return o !== item;
      });
      setSelectCurrentIPAddress(IPAddress);
    }
  };
  useEffect(() => {
    addListIPAddress(selectCurrentIPAddress);
  }, [selectCurrentIPAddress, addListIPAddress]);

  return (
    <Fragment>
      <AddIPAddress
        selectIPAddress={selectCurrentIPAddress}
        onAdd={(item) => addToList(item)}
        typeEnable={typeEnable}
        isReset={isReset}
        disabled={disabled}
      />
      <div className={styles.tableContainer}>
        <Table className={styles.tableList}>
          <TableHead>
            <TableRow>
              <TableCell>
                <IntlMessages id={"setting.ipAddress"} />
              </TableCell>
              <TableCell className={styles.columnAction}>
                <span>
                  <IntlMessages id={"setting.action"} />
                </span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                colspan="2"
                style={{ padding: 0, paddingRight: "6px" }}
              >
                <Table className={styles.tableInner}>
                  <CustomScrollbar>
                    <div className={styles.boxTableBody}>
                      <TableBody>
                        {selectCurrentIPAddress &&
                          selectCurrentIPAddress.map((item, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell>
                                  <span>{item}</span>
                                </TableCell>

                                <TableCell className="text-center">
                                  <IconButton
                                    disabled={!typeEnable || disabled}
                                    className={styles.buttonRemove}
                                    onClick={() => deleteItem(item)}
                                  >
                                    <span
                                      className={
                                        typeEnable || !disabled
                                          ? styles.labelRemove
                                          : styles.labelRemoveDisable
                                      }
                                    >
                                      <IconDeleteGrey />
                                    </span>
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </div>
                  </CustomScrollbar>
                </Table>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className={styles.tablePaginationRow}>
        {selectCurrentIPAddress && selectCurrentIPAddress.length}{" "}
        <IntlMessages id={"setting.of5IP"} />
      </div>
    </Fragment>
  );
};

export default IPAddress;
