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
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { countryWhitelistCodeToName } from "util/countryWhitelist.js";
import AddCountry from "./AddCountry";
import IconButton from "@mui/material/IconButton";
import styles from "./../ComponentsWhitelist.module.scss";
import CustomScrollbar from "@protego/sdk/RegtankUI/v1/Scrollbar";
function Countries({
  typeEnable,
  countries,
  addListCountries,
  isReset,
  disabled = false,
}) {
  const { whitelist } = useSelector((state) => state.settings);
  const [countryAutoComplete] = useState(countries);
  const [selectCountry, setSelectedCountry] = useState([]);

  useEffect(() => {
    setSelectedCountry(whitelist?.countries ? whitelist?.countries : []);
  }, [whitelist?.countries]);
  useEffect(() => {
    addListCountries(selectCountry);
  }, [selectCountry, addListCountries]);
  const addToList = (item) => {
    const { country } = item;

    const SelectCountryTamp = [...selectCountry];
    SelectCountryTamp.unshift(country.code);
    setSelectedCountry(SelectCountryTamp);
  };
  const deleteItem = (item) => {
    if (typeEnable) {
      const SelectCountryTamp = filter(selectCountry, function (o) {
        return o !== item;
      });
      setSelectedCountry(SelectCountryTamp);
    }
  };

  return (
    <>
      <AddCountry
        countries={countryAutoComplete}
        onAdd={(item) => addToList(item)}
        selectCountry={selectCountry}
        typeEnable={typeEnable}
        disabled={disabled}
        isReset={isReset}
      />
      <div className={styles.tableContainer}>
        <Table className={styles.tableList}>
          <TableHead>
            <TableRow>
              <TableCell>
                <IntlMessages id={"setting.countryRegion"} />
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
                      {selectCountry &&
                        selectCountry.map((item, index) => {
                          return (
                            <>
                              <TableRow key={index}>
                                <TableCell>
                                  <span>
                                    {countryWhitelistCodeToName(item)}
                                  </span>
                                </TableCell>
                                <TableCell className="text-center">
                                  <IconButton
                                    disabled={!typeEnable || disabled}
                                    className={styles.buttonRemove}
                                    onClick={() => deleteItem(item)}
                                  >
                                    <span
                                      className={
                                        typeEnable
                                          ? styles.labelRemove
                                          : styles.labelRemoveDisable
                                      }
                                    >
                                      <IconDeleteGrey />
                                    </span>
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            </>
                          );
                        })}
                    </div>
                  </CustomScrollbar>
                </Table>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className={styles.tablePaginationRow}>
        {selectCountry && selectCountry.length}{" "}
        <IntlMessages id={"setting.of10Countries"} />
      </div>
    </>
  );
}

export default Countries;
