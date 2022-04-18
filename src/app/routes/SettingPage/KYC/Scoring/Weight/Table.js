import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Icon,
} from "@mui/material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { Switch } from "@protego/sdk/RegtankUI/v1/Switch";
import TextField from "@protego/sdk/RegtankUI/v1/TextField/TextFieldOutlined";
import { useFormikContext } from "formik";
import { isEmpty } from "lodash";
import React, { useState } from "react";
import { onlyNumbers } from "validations/constraints";
import styles from "../../../SettingsPage.module.scss";
import upArrowIcon from "assets/icons/upArrowIcon.svg";
import downArrowIcon from "assets/icons/downArrowIcon.svg";

const INPUT_COLOR = "#F3F3F3";

const listHeader = [
  {
    key: 1,
    label: <IntlMessages id={"setting.tab.weight.Sanctions"} />,
    width: "35%",
  },
  {
    key: 2,
    label: <IntlMessages id={"setting.tab.weight.Active"} />,
    width: "15%",
  },
  { key: 3, label: "", width: "20%" },
  { key: 4, label: "", width: "15%" },
];

const listHeaderNational = [
  {
    key: 1,
    label: <IntlMessages id={"setting.tab.weight.Nationality"} />,
    width: "35%",
  },
  {
    key: 2,
    label: <IntlMessages id={"setting.tab.weight.Active"} />,
    width: "15%",
  },
  {
    key: 3,
    label: <IntlMessages id={"setting.tab.other.Score"} />,
    width: "20%",
  },
  {
    key: 4,
    label: <IntlMessages id={"setting.tab.weight.Weight"} />,
    width: "15%",
  },
];

const listHeaderCountry = [
  {
    key: 1,
    label: <IntlMessages id={"setting.tab.weight.IssuingCountry"} />,
    width: "35%",
  },
  {
    key: 2,
    label: <IntlMessages id={"setting.tab.weight.Active"} />,
    width: "15%",
  },
  {
    key: 3,
    label: <IntlMessages id={"setting.tab.other.Score"} />,
    width: "20%",
  },
  {
    key: 4,
    label: <IntlMessages id={"setting.tab.weight.Weight"} />,
    width: "15%",
  },
];

const listHeaderCountryResidence = [
  {
    key: 1,
    label: <IntlMessages id={"setting.tab.weight.CountryResidence"} />,
    width: "35%",
  },
  {
    key: 2,
    label: <IntlMessages id={"setting.tab.weight.Active"} />,
    width: "15%",
  },
  {
    key: 3,
    label: <IntlMessages id={"setting.tab.other.Score"} />,
    width: "20%",
  },
  {
    key: 4,
    label: <IntlMessages id={"setting.tab.weight.Weight"} />,
    width: "15%",
  },
];

const listHeaderAML = [
  {
    key: 1,
    label: <IntlMessages id={"setting.tab.weight.AML"} />,
    width: "35%",
  },
  {
    key: 2,
    label: <IntlMessages id={"setting.tab.weight.Active"} />,
    width: "15%",
  },
  {
    key: 3,
    label: <IntlMessages id={"setting.tab.other.Score"} />,
    width: "20%",
  },
  {
    key: 4,
    label: <IntlMessages id={"setting.tab.weight.Weight"} />,
    width: "15%",
  },
];

const TableWeigh = (props) => {
  const [listAMLCFT, setListAMLCFT] = React.useState([]);
  const [listSanction, setListSanction] = React.useState([]);
  const [listContry, setListContry] = React.useState([]);
  const [listContryResidence, setListContryResidence] = React.useState([]);
  const [listNational, setListNational] = React.useState([]);
  const formikContext = useFormikContext();
  const [totalRiskScore, setTotalRiskScore] = React.useState(0);
  const { isDisabled } = props;
  const maxLengthInput = 5;
  // const newObject = { ...formikContext.values.weightSetting };

  const { data } = props;

  const listHeaderTotal = [
    { key: 1, label: <IntlMessages id={"setting.tab.weight.total"} /> },
    { key: 2, label: "" },
    {
      key: 3,
      label: (
        <div className={styles.inputScoring}>
          <TextField
            readOnly={true}
            value={totalRiskScore}
            InputProps={{ disableUnderline: true }}
            disabled={true}
            inputProps={{
              min: 0,
            }}
            className={styles.tableCellInput}
            variant={"outlined"}
          />
        </div>
      ),
    },
    { key: 4, label: "" },
  ];
  React.useEffect(() => {
    createdTable();
    const totalWeight = Object.values(data).reduce((acc, cur) => {
      return typeof cur !== "boolean" && cur.weight && cur.isActive
        ? Number(acc) + Number(cur.weight)
        : acc;
    }, 0);
    setTotalRiskScore(totalWeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const createdTable = () => {
    try {
      if (data) {
        /**
         * Santions
         */

        let objPersonSaction = {
          id: 1,
          sanction: <IntlMessages id={"setting.tab.weight.person"} />,
          isActive: data.isPersonSanction,
        };
        let objIsCountrySanction = {
          id: 2,
          sanction: <IntlMessages id={"country"} />,
          isActive: data.isCountrySanction,
        };
        let list = [objPersonSaction, objIsCountrySanction];
        setListSanction(list);
        /**
         * AML/CFT Screening
         */
        let letScoreSettingData = {};
        if (data.pepScoreSetting) {
          letScoreSettingData = {
            id: 1,
            label: <IntlMessages id={"setting.table.PEPSetting"} />,
            weight: data.pepScoreSetting.weight,
            rebase: data.pepScoreSetting.rebase,
            isActive: data.pepScoreSetting.isActive,
          };
        }
        let letPreviouslySanction = {};
        if (data.previouslySanction) {
          letPreviouslySanction = {
            id: 2,
            label: <IntlMessages id={"previously-sanctioned---person"} />,
            weight: data.previouslySanction.weight,
            rebase: data.previouslySanction.rebase,
            isActive: data.previouslySanction.isActive,
          };
        }
        let letFinancialRegulator = {};
        if (data.financialRegulator) {
          letFinancialRegulator = {
            id: 3,
            label: <IntlMessages id={"financial-regulator"} />,
            weight: data.financialRegulator.weight,
            rebase: data.financialRegulator.rebase,
            isActive: data.financialRegulator.isActive,
          };
        }
        let letLawEnforcement = {};
        if (data.lawEnforcement) {
          letLawEnforcement = {
            id: 4,
            label: <IntlMessages id={"law-enforcement"} />,
            weight: data.lawEnforcement.weight,
            rebase: data.lawEnforcement.rebase,
            isActive: data.lawEnforcement.isActive,
          };
        }
        let letAdverseMedia = {};
        if (data.adverseMedia) {
          letAdverseMedia = {
            id: 5,
            label: <IntlMessages id={"adverse-media"} />,
            weight: data.adverseMedia.weight,
            rebase: data.adverseMedia.rebase,
            isActive: data.adverseMedia.isActive,
          };
        }
        let listAMLCFTData = [
          letScoreSettingData,
          letPreviouslySanction,
          letFinancialRegulator,
          letLawEnforcement,
          letAdverseMedia,
        ];

        setListAMLCFT(listAMLCFTData);
        /**
         * Country of Residence
         */

        let objFATFResidence = {};

        if (data.fatfResidence) {
          objFATFResidence = {
            id: 1,
            label: "FATF",
            weight: data.fatfResidence.weight,
            rebase: data.fatfResidence.rebase,
            isActive: data.fatfResidence.isActive,
          };
        }
        let objBaselResidence = {};
        if (data.baselResidence) {
          objBaselResidence = {
            id: 2,
            label: <IntlMessages id={"basel-aml-index"} />,
            weight: data.baselResidence.weight,
            rebase: data.baselResidence.rebase,
            isActive: data.baselResidence.isActive,
          };
        }
        let objCPIResidence = {};
        if (data.cpiResidence) {
          objCPIResidence = {
            id: 3,
            label: <IntlMessages id={"corrupt-perception-index"} />,
            weight: data.cpiResidence.weight,
            rebase: data.cpiResidence.rebase,
            isActive: data.cpiResidence.isActive,
          };
        }
        let objResidence = [
          objFATFResidence,
          objBaselResidence,
          objCPIResidence,
        ];

        setListContryResidence(objResidence);
        /**
         * Country
         */
        let objFATFGoverment = {};
        if (data.fatfGoverment) {
          objFATFGoverment = {
            id: 1,
            label: "FATF",
            weight: data.fatfGoverment.weight,
            rebase: data.fatfGoverment.rebase,
            isActive: data.fatfGoverment.isActive,
          };
        }
        let objBaselGoverment = {};
        if (data.baselGoverment) {
          objBaselGoverment = {
            id: 2,
            label: <IntlMessages id={"basel-aml-index"} />,
            weight: data.baselGoverment.weight,
            rebase: data.baselGoverment.rebase,
            isActive: data.baselGoverment.isActive,
          };
        }

        let objCPIGoverment = {};
        if (data.cpiGoverment) {
          objCPIGoverment = {
            id: 3,
            label: <IntlMessages id={"corrupt-perception-index"} />,
            weight: data.cpiGoverment.weight,
            rebase: data.cpiGoverment.rebase,
            isActive: data.cpiGoverment.isActive,
          };
        }

        let objGoverment = [
          objFATFGoverment,
          objBaselGoverment,
          objCPIGoverment,
        ];

        setListContry(objGoverment);
        /**
         * National
         */
        let objFATFNationality = {};
        if (data.fatfNationality) {
          objFATFNationality = {
            id: 1,
            label: "FATF",
            weight: data.fatfNationality.weight,
            rebase: data.fatfNationality.rebase,
            isActive: data.fatfNationality.isActive,
          };
        }
        let objBaselNationality = {};
        if (data.baselNationality) {
          objBaselNationality = {
            id: 2,
            label: <IntlMessages id={"basel-aml-index"} />,
            weight: data.baselNationality.weight,
            rebase: data.baselNationality.rebase,
            isActive: data.baselNationality.isActive,
          };
        }
        let objCPINationality = {};
        if (data.cpiNationality) {
          objCPINationality = {
            id: 3,
            label: <IntlMessages id={"corrupt-perception-index"} />,
            weight: data.cpiNationality.weight,
            rebase: data.cpiNationality.rebase,
            isActive: data.cpiNationality.isActive,
          };
        }

        let objNationality = [
          objFATFNationality,
          objBaselNationality,
          objCPINationality,
        ];
        setListNational(objNationality);
        /**
         * total
         */
      }
    } catch (error) {}
  };
  /**
   * On press switch Sanctions
   */
  const onPressSwitch = (ID, status) => {
    let result = listSanction.map((item, id) => {
      return item.id === ID ? { ...item, isActive: !status } : { ...item };
    });
    setListSanction(result);

    const newObject = { ...formikContext.values.weightSetting };
    const new_obj = {
      ...newObject,
      isPersonSanction: result[0].isActive,
      isCountrySanction: result[1].isActive,
    };
    formikContext.setFieldValue("weightSetting", new_obj);

    // if (isNumeric(e.target.value)) {
    //   let result = listAMLCFT.map((item, id) => {
    //     return item.id === itemID
    //       ? { ...item, weight: e.target.value }
    //       : { ...item };
    //   });
    //   setListAMLCFT(result);
    //   const newObject = { ...formikContext.values.weightSetting };
    //   const new_obj = {
    //     ...newObject,
    //     pepScoreSetting: result[0],
    //     previouslySanction: result[1],
    //     financialRegulator: result[2],
    //     lawEnforcement: result[3],
    //     adverseMedia: result[4]
    //   };
    //   formikContext.setFieldValue("weightSetting", new_obj);
    // }
  };

  /**
   * On press switch AML/CFT
   */
  const onPressSwitchAML = (ID, status) => {
    try {
      let result = listAMLCFT.map((item, id) => {
        return item.id === ID
          ? {
              ...item,
              isActive: !status,
            }
          : { ...item };
      });
      setListAMLCFT(result);

      const newObject = { ...formikContext.values.weightSetting };
      const new_obj = {
        ...newObject,
        pepScoreSetting: result[0],
        previouslySanction: result[1],
        financialRegulator: result[2],
        lawEnforcement: result[3],
        adverseMedia: result[4],
      };
      formikContext.setFieldValue("weightSetting", new_obj);
    } catch (error) {}
  };
  /**
   * On press switch Country Residence
   */
  const onPressSwitchCountryResidence = (ID, status, rebaseData) => {
    let result = listContryResidence.map((item, id) => {
      return item.id === ID
        ? { ...item, isActive: !status, rebase: !status ? rebaseData : 0 }
        : { ...item };
    });
    setListContryResidence(result);
    const newObject = { ...formikContext.values.weightSetting };
    const new_obj = {
      ...newObject,
      fatfResidence: result[0],
      baselResidence: result[1],
      cpiResidence: result[2],
    };

    formikContext.setFieldValue("weightSetting", new_obj);
  };

  /**
   * On press switch Country
   */
  const onPressSwitchCountry = (ID, status) => {
    let result = listContry.map((item, id) => {
      return item.id === ID ? { ...item, isActive: !status } : { ...item };
    });
    setListContry(result);

    const newObject = { ...formikContext.values.weightSetting };
    const new_obj = {
      ...newObject,
      fatfGoverment: result[0],
      baselGoverment: result[1],
      cpiGoverment: result[2],
    };
    formikContext.setFieldValue("weightSetting", new_obj);
  };
  const isNumeric = (value) => {
    var regex = /^[+]*[0-9]*$/;
    if (!regex.test(value)) {
      return false;
    }
    return true;
  };
  /**
   *
   * @param {Caculator Rebase } ID
   * @param {*} status
   */

  const caculatorRebase = (list) => {
    try {
      var getWatt = list.reduce(
        (acc, curr) =>
          parseInt(acc) +
          parseInt(curr.weight && curr.isActive ? curr.weight : 0),
        0
      );
      return getWatt;
    } catch (error) {}
  };
  /**
   * On press switch National
   */
  const onPressSwitchNational = (ID, status) => {
    let result = listNational.map((item, id) => {
      return item.id === ID ? { ...item, isActive: !status } : { ...item };
    });
    setListNational(result);

    const newObject = { ...formikContext.values.weightSetting };
    const new_obj = {
      ...newObject,
      fatfNationality: result[0],
      baselNationality: result[1],
      cpiNationality: result[2],
    };
    formikContext.setFieldValue("weightSetting", new_obj);
  };

  const inputChangeHandler = (e, itemID) => {
    if (isNumeric(e.target.value)) {
      let result = listAMLCFT.map((item, id) => {
        return item.id === itemID
          ? { ...item, weight: e.target.value }
          : { ...item };
      });
      setListAMLCFT(result);
      const newObject = { ...formikContext.values.weightSetting };
      const new_obj = {
        ...newObject,
        pepScoreSetting: result[0],
        previouslySanction: result[1],
        financialRegulator: result[2],
        lawEnforcement: result[3],
        adverseMedia: result[4],
      };
      formikContext.setFieldValue("weightSetting", new_obj);
    }
  };

  const inputChangeHandlerCountry = (e, itemID) => {
    if (isNumeric(e.target.value)) {
      let result = listContry.map((item, id) => {
        return item.id === itemID
          ? { ...item, weight: e.target.value }
          : { ...item };
      });
      setListContry(result);

      const newObject = { ...formikContext.values.weightSetting };
      const new_obj = {
        ...newObject,
        fatfGoverment: result[0],
        baselGoverment: result[1],
        cpiGoverment: result[2],
      };
      formikContext.setFieldValue("weightSetting", new_obj);
    }
  };

  const inputChangeHandlerCountryResidence = (e, itemID) => {
    if (isNumeric(e.target.value)) {
      let result = listContryResidence.map((item, id) => {
        return item.id === itemID
          ? { ...item, weight: e.target.value }
          : { ...item };
      });
      setListContryResidence(result);
      const newObject = { ...formikContext.values.weightSetting };
      const new_obj = {
        ...newObject,
        fatfResidence: result[0] ? result[0] : {},
        baselResidence: result[1] ? result[1] : {},
        cpiResidence: result[2] ? result[2] : {},
      };
      formikContext.setFieldValue("weightSetting", new_obj);
    }
  };

  const inputChangeHandlerNational = (e, itemID) => {
    if (isNumeric(e.target.value)) {
      let result = listNational.map((item, id) => {
        return item.id === itemID
          ? { ...item, weight: e.target.value }
          : { ...item };
      });
      setListNational(result);

      const newObject = { ...formikContext.values.weightSetting };
      const new_obj = {
        ...newObject,
        fatfNationality: result[0],
        baselNationality: result[1],
        cpiNationality: result[2],
      };
      formikContext.setFieldValue("weightSetting", new_obj);
    }
  };

  const convertToRebase = (e) => {
    let total =
      caculatorRebase(listContry) +
      caculatorRebase(listAMLCFT) +
      caculatorRebase(listContryResidence) +
      caculatorRebase(listNational);
    if (total > 0) {
      return parseFloat((e / total) * 100).toFixed(2);
    }
    return e;
  };

  const [tableCollapses, setTableCollapses] = useState([]);

  const onClickTableCollapse = (keyTable) => {
    if (tableCollapses.includes(keyTable)) {
      const index = tableCollapses.indexOf(keyTable);
      //delete id in profileIdsAdded
      if (index > -1) {
        tableCollapses.splice(index, 1);
        setTableCollapses([...tableCollapses]);
      }
    } else {
      tableCollapses.push(keyTable);
      setTableCollapses([...tableCollapses]);
    }
  };

  return (
    <div className={styles.weightTableWrapper}>
      <Table>
        {/* Sanctions */}
        <TableHead>
          <TableRow>
            {listHeader.map((item, index) => {
              return (
                <TableCell width={item.width} key={index}>
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
            {listSanction.map((n) => {
              if (!isEmpty(n) && n.isActive !== undefined) {
                return (
                  <TableRow key={n.id}>
                    <TableCell>{n.sanction}</TableCell>
                    <TableCell>
                      <div>
                        <Switch
                          disabled={isDisabled}
                          onClick={(event) => onPressSwitch(n.id, n.isActive)}
                          checked={n.isActive}
                        />
                      </div>
                    </TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                  </TableRow>
                );
              }
              return null;
            })}
          </TableBody>
        )}

        {/* AML/CFT Screening */}
        <TableHead>
          <TableRow>
            {listHeaderAML.map((item, index) => {
              return (
                <TableCell width={item.width} key={index}>
                  <Typography>{item.label}</Typography>
                </TableCell>
              );
            })}
            <TableCell className={styles.collapseCol}>
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
            {listAMLCFT.map((n) => {
              if (!isEmpty(n) && n.isActive !== undefined) {
                return (
                  <TableRow key={n.id}>
                    <TableCell>{n.label}</TableCell>
                    <TableCell>
                      <div>
                        <Switch
                          disabled={isDisabled}
                          onClick={(event) =>
                            onPressSwitchAML(n.id, n.isActive)
                          }
                          checked={n.isActive}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={styles.inputScoring}>
                        <TextField
                          value={n.weight}
                          InputProps={{ disableUnderline: true }}
                          disabled={!n.isActive || isDisabled}
                          inputProps={{
                            min: 0,
                            maxLength: maxLengthInput,
                          }}
                          className={styles.tableCellInput}
                          onChange={(e) => inputChangeHandler(e, n.id)}
                          onInput={onlyNumbers}
                          variant={"outlined"}
                        ></TextField>
                      </div>
                    </TableCell>
                    <TableCell>
                      {n.isActive ? convertToRebase(n.weight) : 0}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                );
              }
              return null;
            })}
          </TableBody>
        )}

        {/* Country of Residence */}
        <TableHead>
          <TableRow>
            {listHeaderCountryResidence.map((item) => {
              return (
                <TableCell width={item.width}>
                  <Typography>{item.label}</Typography>
                </TableCell>
              );
            })}
            <TableCell className={styles.collapseCol}>
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
            {listContryResidence.map((n) => {
              if (!isEmpty(n) && n.isActive !== undefined) {
                let rebaseData = n.isActive ? convertToRebase(n.weight) : 0;
                return (
                  <TableRow key={n.id}>
                    <TableCell>{n.label}</TableCell>
                    <TableCell>
                      <div>
                        <Switch
                          disabled={isDisabled}
                          onClick={(event) =>
                            onPressSwitchCountryResidence(
                              n.id,
                              n.isActive,
                              rebaseData
                            )
                          }
                          checked={n.isActive}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={styles.inputScoring}>
                        <TextField
                          value={n.weight}
                          InputProps={{ disableUnderline: true }}
                          inputProps={{
                            min: 0,
                            maxLength: maxLengthInput,
                          }}
                          disabled={!n.isActive || isDisabled}
                          className={styles.tableCellInput}
                          onChange={(e) =>
                            inputChangeHandlerCountryResidence(e, n.id)
                          }
                          onInput={(e) => onlyNumbers(e)}
                          variant={"outlined"}
                        ></TextField>
                      </div>
                    </TableCell>
                    <TableCell>{rebaseData}</TableCell>
                    <TableCell />
                  </TableRow>
                );
              }
              return null;
            })}
          </TableBody>
        )}

        {/* ID Issuing Country */}
        <TableHead>
          <TableRow>
            {listHeaderCountry.map((item) => {
              return (
                <TableCell width={item.width}>
                  <Typography>{item.label}</Typography>
                </TableCell>
              );
            })}
            <TableCell className={styles.collapseCol}>
              <span onClick={() => onClickTableCollapse("issuingResidence")}>
                {tableCollapses.includes("issuingResidence") ? (
                  <img src={upArrowIcon} />
                ) : (
                  <img src={downArrowIcon} />
                )}
              </span>
            </TableCell>
          </TableRow>
        </TableHead>

        {tableCollapses.includes("issuingResidence") && (
          <TableBody>
            {listContry.map((n) => {
              if (!isEmpty(n) && n.isActive !== undefined) {
                return (
                  <TableRow key={n.id}>
                    <TableCell>{n.label}</TableCell>
                    <TableCell>
                      <div>
                        <Switch
                          disabled={isDisabled}
                          onClick={(event) =>
                            onPressSwitchCountry(n.id, n.isActive)
                          }
                          checked={n.isActive}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={styles.inputScoring}>
                        <TextField
                          value={n.weight}
                          InputProps={{ disableUnderline: true }}
                          inputProps={{
                            min: 0,
                            maxLength: maxLengthInput,
                          }}
                          disabled={!n.isActive || isDisabled}
                          className={styles.tableCellInput}
                          onChange={(e) => inputChangeHandlerCountry(e, n.id)}
                          onInput={(e) => onlyNumbers(e)}
                          variant={"outlined"}
                        ></TextField>
                      </div>
                    </TableCell>
                    <TableCell>
                      {n.isActive ? convertToRebase(n.weight) : 0}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                );
              }
              return null;
            })}
          </TableBody>
        )}

        {/* {Nationality}  */}
        <TableHead>
          <TableRow>
            {listHeaderNational.map((item) => {
              return (
                <TableCell width={item.width}>
                  <Typography>{item.label}</Typography>
                </TableCell>
              );
            })}
            <TableCell className={styles.collapseCol}>
              <span onClick={() => onClickTableCollapse("nationality")}>
                {tableCollapses.includes("nationality") ? (
                  <img src={upArrowIcon} />
                ) : (
                  <img src={downArrowIcon} />
                )}
              </span>
            </TableCell>
          </TableRow>
        </TableHead>
        {tableCollapses.includes("nationality") && (
          <TableBody>
            {listNational.map((n) => {
              if (!isEmpty(n) && n.isActive !== undefined) {
                return (
                  <TableRow>
                    <TableCell>{n.label}</TableCell>
                    <TableCell>
                      <Switch
                        disabled={isDisabled}
                        onClick={(event) =>
                          onPressSwitchNational(n.id, n.isActive)
                        }
                        checked={n.isActive}
                      />
                    </TableCell>
                    <TableCell>
                      <div className={styles.inputScoring}>
                        <TextField
                          value={n.weight}
                          disabled={!n.isActive || isDisabled}
                          InputProps={{ disableUnderline: true }}
                          inputProps={{
                            min: 0,
                            maxLength: maxLengthInput,
                          }}
                          className={styles.tableCellInput}
                          onChange={(e) => inputChangeHandlerNational(e, n.id)}
                          onInput={(e) => onlyNumbers(e)}
                          variant={"outlined"}
                        ></TextField>
                      </div>
                    </TableCell>
                    <TableCell>
                      {n.isActive ? convertToRebase(n.weight) : 0}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                );
              }
              return null;
            })}
          </TableBody>
        )}

        {/* Total  */}
        <TableHead>
          <TableRow>
            {listHeaderTotal.map((item, index) => {
              return (
                <TableCell width={item.width} key={index}>
                  <Typography>{item.label}</Typography>
                </TableCell>
              );
            })}
            <TableCell />
          </TableRow>
        </TableHead>
      </Table>
    </div>
  );
};

export default TableWeigh;
