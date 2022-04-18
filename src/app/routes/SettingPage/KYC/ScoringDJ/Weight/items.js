import React from "react";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Switch from "@protego/sdk/RegtankUI/v1/Switch/BasicSwitch";
import styles from "../../../SettingsPage.module.scss";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { INPUT_COLOR } from "constants/ThemeColors";
import { isEmpty, parseInt } from "lodash";
import clsx from "clsx";
import { onlyNumbers } from "validations/constraints";
import TextField from "@protego/sdk/RegtankUI/v1/TextField/TextFieldOutlined";
import upArrowIcon from "assets/icons/upArrowIcon.svg";
import downArrowIcon from "assets/icons/downArrowIcon.svg";

const maxLengthInput = 5;

export const listHeader = [
  { key: 1, label: <IntlMessages id={"setting.tab.weight.Sanctions"} />, colSpan: 6, },
  { key: 2, label: <IntlMessages id={"setting.tab.weight.Active"} />, colSpan: 3, },
  { key: 3, label: "", colSpan: 4, },
  { key: 4, label: "", colSpan: 3, },
];

export const listHeaderNational = [
  { key: 1, label: <IntlMessages id={"setting.tab.weight.Nationality"} />, colSpan: 6, },
  { key: 2, label: <IntlMessages id={"setting.tab.weight.Active"} />, colSpan: 3 },
  { key: 3, label: <IntlMessages id={"setting.tab.other.Score"} />, colSpan: 4 },
  { key: 4, label: <IntlMessages id={"setting.tab.weight.Weight"} />, colSpan: 3 },
];

export const listHeaderCountry = [
  { key: 1, label: <IntlMessages id={"setting.tab.weight.IssuingCountry"} />, colSpan: 6, },
  { key: 2, label: <IntlMessages id={"setting.tab.weight.Active"} />, colSpan: 3 },
  { key: 3, label: <IntlMessages id={"setting.tab.other.Score"} />, colSpan: 4 },
  { key: 4, label: <IntlMessages id={"setting.tab.weight.Weight"} />, colSpan: 3 },
];

export const listHeaderCountryResidence = [
  {
    key: 1,
    label: <IntlMessages id={"setting.tab.weight.CountryResidence"} />,
    colSpan: 6, 
  },
  { key: 2, label: <IntlMessages id={"setting.tab.weight.Active"} />, colSpan: 3 },
  { key: 3, label: <IntlMessages id={"setting.tab.other.Score"} />, colSpan: 4 },
  { key: 4, label: <IntlMessages id={"setting.tab.weight.Weight"} />, colSpan: 3 },
];

export const listHeaderAML = [
  { key: 1, label: <IntlMessages id={"setting.tab.weight.AML"} />, colSpan: 6, },
  { key: 2, label: <IntlMessages id={"setting.tab.weight.Active"} />, colSpan: 3 },
  { key: 3, label: <IntlMessages id={"setting.tab.other.Score"} />, colSpan: 4 },
  { key: 4, label: <IntlMessages id={"setting.tab.weight.Weight"} />, colSpan: 3 },
];

const Item = ({
  isDisabled = false,
  data,
  className = "",
  isChild = false,
  onPressSwitch = null,
  onChangeScore = null,
  convertToRebase,
}) => {
  return !isEmpty(data) ? (
    <TableRow className={clsx({ [className]: className })}>
      <TableCell
        style={{
          ...(isChild ? { paddingLeft: toRem(70) } : {}),
        }}
        colSpan={6}
      >
        {data.label}
      </TableCell>
      <TableCell colSpan={3}>
        <div>
          <Switch
            disabled={isDisabled}
            onClick={() =>
              onPressSwitch &&
              onPressSwitch({ ...data, isActive: !data?.isActive })
            }
            checked={data.isActive}
          />
        </div>
      </TableCell>
      <TableCell colSpan={4}>
        <div className={styles.inputScoring}>
          <TextField
            value={data.weight || 0}
            style={{ backgroundColor: INPUT_COLOR }}
            InputProps={{ disableUnderline: true }}
            disabled={!data.isActive || isDisabled}
            inputProps={{
              min: 0,
              maxLength: maxLengthInput,
            }}
            onChange={(e) => {
              onChangeScore &&
                onChangeScore({ ...data, weight: parseInt(e.target.value) });
            }}
            onInput={onlyNumbers}
          />
        </div>
      </TableCell>
      <TableCell colSpan={3}>
        {data.isActive ? convertToRebase(data.weight) : 0}
      </TableCell>
      <TableCell />
    </TableRow>
  ) : (
    <></>
  );
};

export const SanctionList = ({
  isDisabled,
  data,
  onPressSwitch,
  onClickTableCollapse,
  tableCollapses,
}) => {
  return (
    <>
      <TableHead>
        <TableRow>
          {listHeader.map((item, index) => {
            return (
              <TableCell key={index} colSpan={item.colSpan}>
                <Typography>{item.label}</Typography>
              </TableCell>
            );
          })}
          <TableCell width={"10%"} className={styles.collapseCol}>
            <span onClick={() => onClickTableCollapse("sanctions")}>
              {tableCollapses.includes("sanctions") ? (
                <img src={upArrowIcon} />
              ) : (
                <img src={downArrowIcon} />
              )}
            </span>
          </TableCell>
        </TableRow>
      </TableHead>
      {tableCollapses.includes("sanctions") && (
        <TableBody>
          <TableRow>
            <TableCell colSpan={6}>{data.sanction}</TableCell>
            <TableCell colSpan={3}>
              <div>
                <Switch
                  disabled={isDisabled}
                  onClick={(event) => onPressSwitch(data)}
                  checked={data?.isActive}
                />
              </div>
            </TableCell>
            <TableCell style={{ width: "10%" }} />
            <TableCell style={{ width: "10%" }} />
            <TableCell />
          </TableRow>
        </TableBody>
      )}
    </>
  );
};

export const AMLList = ({
  isDisabled,
  data,
  onPressSwitch,
  onChangeScore,
  convertToRebase,
  onClickTableCollapse,
  tableCollapses,
}) => {
  const {
    activePepSetting,
    inActivePepSetting,
    oolSetting,
    siSetting,
    siltSetting,
  } = data;

  return (
    <>
      <TableHead>
        <TableRow>
          {listHeaderAML.map((item, index) => {
            return (
              <TableCell key={index} colSpan={item.colSpan}>
                <Typography>{item.label}</Typography>
              </TableCell>
            );
          })}
          <TableCell width={"10%"} className={styles.collapseCol}>
            <span onClick={() => onClickTableCollapse("aml/cft")}>
              {tableCollapses.includes("aml/cft") ? (
                <img src={upArrowIcon} />
              ) : (
                <img src={downArrowIcon} />
              )}
            </span>
          </TableCell>
        </TableRow>
      </TableHead>
      {tableCollapses.includes("aml/cft") && (
        <TableBody>
          {/* Active PEP */}
          {!isEmpty(activePepSetting) && (
            <Item
              isDisabled={isDisabled}
              data={activePepSetting}
              onPressSwitch={(data) => {
                onPressSwitch({ activePepSetting: data });
              }}
              onChangeScore={(data) => {
                onChangeScore({ activePepSetting: data });
              }}
              convertToRebase={convertToRebase}
            />
          )}

          {/* Inactive PEP */}
          {!isEmpty(inActivePepSetting) && (
            <Item
              isDisabled={isDisabled}
              data={inActivePepSetting}
              onPressSwitch={(data) => {
                onPressSwitch({ inActivePepSetting: data });
              }}
              onChangeScore={(data) => {
                onChangeScore({ inActivePepSetting: data });
              }}
              convertToRebase={convertToRebase}
            />
          )}

          {/* OOL */}
          {!isEmpty(oolSetting) && (
            <Item
              isDisabled={isDisabled}
              data={oolSetting}
              onPressSwitch={(data) => {
                onPressSwitch({ oolSetting: data });
              }}
              onChangeScore={(data) => {
                onChangeScore({ oolSetting: data });
              }}
              convertToRebase={convertToRebase}
            />
          )}

          {/* SI */}
          {!isEmpty(siSetting) && (
            <>
              <TableRow className={styles.rowNoBrd}>
                <TableCell
                  style={{ width: "10%", paddingBottom: 0 }}
                  colSpan={4}
                >
                  <IntlMessages id="setting.tab.weight.SI.desc" />
                </TableCell>
              </TableRow>
              {siSetting.map((item, index) => {
                return (
                  <Item
                    isChild={true}
                    key={index}
                    isDisabled={isDisabled}
                    data={item}
                    className={
                      index !== siSetting.length - 1 ? styles.rowNoBrd : ""
                    }
                    onPressSwitch={(data) => {
                      onPressSwitch({ [item.key]: data });
                    }}
                    onChangeScore={(data) => {
                      onChangeScore({ [item.key]: data });
                    }}
                    convertToRebase={convertToRebase}
                  />
                );
              })}
            </>
          )}

          {/* SI-LT */}
          {!isEmpty(siltSetting) && (
            <>
              <TableRow className={styles.rowNoBrd}>
                <TableCell
                  style={{ width: "10%", paddingBottom: 0 }}
                  colSpan={4}
                >
                  <IntlMessages id="setting.tab.weight.SILT.desc" />
                </TableCell>
              </TableRow>
              {siltSetting.map((item, index) => {
                return (
                  <Item
                    isChild={true}
                    key={index}
                    isDisabled={isDisabled}
                    data={item}
                    className={
                      index !== siltSetting.length - 1 ? styles.rowNoBrd : ""
                    }
                    onPressSwitch={(data) => {
                      onPressSwitch({ [item.key]: data });
                    }}
                    onChangeScore={(data) => {
                      onChangeScore({ [item.key]: data });
                    }}
                    convertToRebase={convertToRebase}
                  />
                );
              })}
            </>
          )}
        </TableBody>
      )}
    </>
  );
};

export const CountryOfResidenceList = ({
  isDisabled,
  data,
  onPressSwitch,
  onChangeScore,
  convertToRebase,
  onClickTableCollapse,
  tableCollapses,
}) => {
  return (
    <>
      <TableHead>
        <TableRow>
          {listHeaderCountryResidence.map((item) => {
            return (
              <TableCell colSpan={item.colSpan}>
                <Typography>{item.label}</Typography>
              </TableCell>
            );
          })}
          <TableCell width={"10%"} className={styles.collapseCol}>
            <span onClick={() => onClickTableCollapse("countryOfResidence")}>
              {tableCollapses.includes("countryOfResidence") ? (
                <img src={upArrowIcon} />
              ) : (
                <img src={downArrowIcon} />
              )}
            </span>
          </TableCell>
        </TableRow>
      </TableHead>
      {tableCollapses.includes("countryOfResidence") && (
        <TableBody>
          {data.map((item, index) => {
            if (!isEmpty(item) && item.isActive !== undefined) {
              return (
                <Item
                  key={index}
                  isDisabled={isDisabled}
                  data={item}
                  onPressSwitch={(data) => {
                    onPressSwitch({ [item?.key]: data });
                  }}
                  onChangeScore={(data) => {
                    onChangeScore({ [item?.key]: data });
                  }}
                  convertToRebase={convertToRebase}
                />
              );
            }
            return null;
          })}
        </TableBody>
      )}
    </>
  );
};

export const IDIssuingCountryList = ({
  isDisabled,
  data,
  onPressSwitch,
  onChangeScore,
  convertToRebase,
  onClickTableCollapse,
  tableCollapses,
}) => {
  return (
    <>
      <TableHead>
        <TableRow>
          {listHeaderCountry.map((item) => {
            return (
              <TableCell colSpan={item.colSpan}>
                <Typography>{item.label}</Typography>
              </TableCell>
            );
          })}
          <TableCell width={"10%"} className={styles.collapseCol}>
            <span onClick={() => onClickTableCollapse("issuingCountry")}>
              {tableCollapses.includes("issuingCountry") ? (
                <img src={upArrowIcon} />
              ) : (
                <img src={downArrowIcon} />
              )}
            </span>
          </TableCell>
        </TableRow>
      </TableHead>
      {tableCollapses.includes("issuingCountry") && (
        <TableBody>
          {data.map((item, index) => {
            if (!isEmpty(item) && item.isActive !== undefined) {
              return (
                <Item
                  key={index}
                  isDisabled={isDisabled}
                  data={item}
                  convertToRebase={convertToRebase}
                  onPressSwitch={(data) => {
                    onPressSwitch({ [item?.key]: data });
                  }}
                  onChangeScore={(data) => {
                    onChangeScore({ [item?.key]: data });
                  }}
                />
              );
            }
            return null;
          })}
        </TableBody>
      )}
    </>
  );
};

export const NationalityList = ({
  isDisabled,
  data,
  onPressSwitch,
  onChangeScore,
  convertToRebase,
  onClickTableCollapse,
  tableCollapses,
}) => {
  return (
    <>
      <TableHead>
        <TableRow>
          {listHeaderNational.map((item) => {
            return (
              <TableCell colSpan={item.colSpan}>
                <Typography>{item.label}</Typography>
              </TableCell>
            );
          })}
          <TableCell width={"10%"} className={styles.collapseCol}>
            <span onClick={() => onClickTableCollapse("nations")}>
              {tableCollapses.includes("nations") ? (
                <img src={upArrowIcon} />
              ) : (
                <img src={downArrowIcon} />
              )}
            </span>
          </TableCell>
        </TableRow>
      </TableHead>
      {tableCollapses.includes("nations") && (
        <TableBody>
          {data.map((item, index) => {
            if (!isEmpty(item) && item.isActive !== undefined) {
              return (
                <Item
                  key={index}
                  isDisabled={isDisabled}
                  data={item}
                  onPressSwitch={(data) => {
                    onPressSwitch({ [item?.key]: data });
                  }}
                  onChangeScore={(data) => {
                    onChangeScore({ [item?.key]: data });
                  }}
                  convertToRebase={convertToRebase}
                />
              );
            }
            return null;
          })}
        </TableBody>
      )}
    </>
  );
};
