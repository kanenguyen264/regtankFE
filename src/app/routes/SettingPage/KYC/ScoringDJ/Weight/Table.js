import { Table } from "@mui/material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import React, { useState } from "react";
import styles from "../../../SettingsPage.module.scss";
import { useFormikContext } from "formik";
import {
  SanctionList,
  AMLList,
  CountryOfResidenceList,
  IDIssuingCountryList,
  NationalityList,
} from "./items";
import { values } from "lodash";

export const calculatorRebase = (list) => {
  try {
    list = values(list);
    var getWatt = list.reduce((acc, curr) => {
      if (Array.isArray(curr)) {
        let total = curr.reduce((tt, child) => {
          return (
            parseInt(tt) +
            parseInt(child.weight && child.isActive ? child.weight : 0)
          );
        }, 0);

        return  parseInt(acc) + total;
      } else {
        return (
          parseInt(acc) +
          parseInt(curr.weight && curr.isActive ? curr.weight : 0)
        );
      }
    }, 0);
    return getWatt;
  } catch (error) {}
};

const TableWeight = (props) => {
  const [listAMLCFT, setListAMLCFT] = React.useState([]);
  const [listSanction, setListSanction] = React.useState(null);
  const [listCountry, setListCountry] = React.useState([]);
  const [listCountryResidence, setListCountryResidence] = React.useState([]);
  const [listNational, setListNational] = React.useState([]);
  const formikContext = useFormikContext();
  const { isDisabled, data } = props;

  React.useEffect(() => {
    createdTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const convertToRebase = (e) => {
    let total =
      calculatorRebase(listCountry) +
      calculatorRebase(listAMLCFT) +
      calculatorRebase(listCountryResidence) +
      calculatorRebase(listNational);
    if (total > 0) {
      return parseFloat((e / total) * 100).toFixed(2);
    }
    return e;
  };

  /**
   * Created Table
   */
  const createdTable = () => {
    try {
      if (data) {
        /**
         * Santions
         */
        let list = {
          id: 2,
          sanction: <IntlMessages id="setting.tab.weight.sanction" />,
          isActive: data.isSanctionsLists,
        };
        setListSanction(list);

        /**
         * AML/CFT Screening
         */
        let activePepSetting = {};
        if (data.activePep) {
          activePepSetting = {
            id: 1,
            label: (
              <IntlMessages
                id={"setting.tab.weight.activePepScoreSetting.desc"}
              />
            ),
            weight: data.activePep.weight,
            rebase: data.activePep.rebase,
            isActive: data.activePep.isActive,
          };
        }

        let inActivePepSetting = {};
        if (data.inActivePep) {
          inActivePepSetting = {
            id: 1,
            label: (
              <IntlMessages id="setting.tab.weight.inactivePepScoreSetting.desc" />
            ),
            weight: data.inActivePep.weight,
            rebase: data.inActivePep.rebase,
            isActive: data.inActivePep.isActive,
          };
        }

        let oolSetting = {};
        if (data.ool) {
          oolSetting = {
            id: 1,
            label: <IntlMessages id="setting.tab.weight.OOL.desc" />,
            weight: data.ool.weight,
            rebase: data.ool.rebase,
            isActive: data.ool.isActive,
          };
        }

        const getSiData = (prefix = "si") => {
          return [
            "FinancialCrime",
            "Corruption",
            "Trafficking",
            "OrganizedCrime",
            "TaxCrime",
            "Terror",
          ].map((item, index) => {
            let itemIndex = `${prefix}${item}`;
            let keyLabel = item.charAt(0).toLowerCase() + item.slice(1);
            return {
              id: index + 1,
              label: <IntlMessages id={`djkyc.riskParameters.${keyLabel}`} />,
              weight: data[itemIndex]?.weight || 0,
              rebase: data[itemIndex]?.rebase || 0,
              isActive: data[itemIndex]?.isActive || false,
              key: itemIndex,
              cat: `${prefix}Setting`,
            };
          });
        };

        let siSetting = getSiData();
        let siltSetting = getSiData("silt");

        let listAMLCFTData = {
          activePepSetting: activePepSetting,
          inActivePepSetting: inActivePepSetting,
          oolSetting: oolSetting,
          siSetting: siSetting,
          siltSetting: siltSetting,
        };

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
            key: "fatfResidence",
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
            key: "baselResidence",
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
            key: "cpiResidence",
          };
        }
        let objResidence = [
          objFATFResidence,
          objBaselResidence,
          objCPIResidence,
        ];

        setListCountryResidence(objResidence);
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
            key: "fatfGoverment",
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
            key: "baselGoverment",
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
            key: "cpiGoverment",
          };
        }

        let objGoverment = [
          objFATFGoverment,
          objBaselGoverment,
          objCPIGoverment,
        ];

        setListCountry(objGoverment);
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
            key: "fatfNationality",
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
            key: "baselNationality",
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
            key: "cpiNationality",
          };
        }

        let objNationality = [
          objFATFNationality,
          objBaselNationality,
          objCPINationality,
        ];
        setListNational(objNationality);
      }
    } catch (error) {}
  };

  const updateFormValues = (data) => {
    const newObject = { ...formikContext.values.weightSetting };
    const updateObj = {
      ...newObject,
      ...data,
    };
    formikContext.setFieldValue("weightSetting", updateObj);
  };

  /**
   * On press switch Sanctions
   */
  const onPressSwitchSanction = (data) => {
    setListSanction({ ...listSanction, isActive: !data.isActive });
    updateFormValues({ isSanctionsLists: !data.isActive });
  };

  /**
   * On press switch AML
   */

  const onUpdateAML = (data) => {
    const index = Object.keys(data)[0];
    const updateData = {
      isActive: data[index]?.isActive,
      rebase: data[index]?.rebase,
      weight: data[index]?.weight,
    };

    if (data[index]?.cat?.length) {
      let indexItem = listAMLCFT[data[index]?.cat]?.findIndex(
        (item) => item.key === index
      );
      if (indexItem != undefined && indexItem !== -1) {
        let list = listAMLCFT[data[index]?.cat];
        list[indexItem] = {
          ...list[indexItem],
          ...data[index],
        };
        setListAMLCFT({
          ...listAMLCFT,
          siSetting: list,
        });
      }

      updateFormValues({ [index]: updateData });
    } else {
      setListAMLCFT({
        ...listAMLCFT,
        ...data,
      });

      const formField = {
        activePepSetting: "activePep",
        inActivePepSetting: "inActivePep",
        oolSetting: "ool",
      }[index];

      if (formField) {
        updateFormValues({
          [formField]: updateData,
        });
      }
    }
  };

  const onUpdateCountryResidence = (data) => {
    const index = Object.keys(data)[0];
    let result = listCountryResidence.map((item) => {
      return item.key === data[index].key
        ? {
            ...item,
            isActive: data[index]?.isActive,
            rebase: data[index]?.rebase,
            weight: data[index]?.weight,
          }
        : { ...item };
    });

    setListCountryResidence(result);
    updateFormValues(data);
  };

  const onUpdateIDCountry = (data) => {
    const index = Object.keys(data)[0];
    let result = listCountry.map((item) => {
      return item.key === data[index].key
        ? {
            ...item,
            isActive: data[index]?.isActive,
            rebase: data[index]?.rebase,
            weight: data[index]?.weight,
          }
        : { ...item };
    });

    setListCountry(result);
    updateFormValues(data);
  };

  const onUpdateNational = (data) => {
    const index = Object.keys(data)[0];
    let result = listNational.map((item) => {
      return item.key === data[index].key
        ? {
            ...item,
            isActive: data[index]?.isActive,
            rebase: data[index]?.rebase,
            weight: data[index]?.weight,
          }
        : { ...item };
    });

    setListNational(result);
    updateFormValues(data);
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
        {listSanction && (
          <SanctionList
            isDisabled={isDisabled}
            data={listSanction}
            onPressSwitch={onPressSwitchSanction}
            onClickTableCollapse={onClickTableCollapse}
            tableCollapses={tableCollapses}
          />
        )}
        {listAMLCFT && (
          <AMLList
            isDisabled={isDisabled}
            data={listAMLCFT}
            onPressSwitch={onUpdateAML}
            onChangeScore={onUpdateAML}
            convertToRebase={convertToRebase}
            onClickTableCollapse={onClickTableCollapse}
            tableCollapses={tableCollapses}
          />
        )}

        {listCountryResidence && (
          <CountryOfResidenceList
            isDisabled={isDisabled}
            data={listCountryResidence}
            onPressSwitch={onUpdateCountryResidence}
            onChangeScore={onUpdateCountryResidence}
            convertToRebase={convertToRebase}
            onClickTableCollapse={onClickTableCollapse}
            tableCollapses={tableCollapses}
          />
        )}

        {listCountry && (
          <IDIssuingCountryList
            isDisabled={isDisabled}
            data={listCountry}
            onPressSwitch={onUpdateIDCountry}
            onChangeScore={onUpdateIDCountry}
            convertToRebase={convertToRebase}
            onClickTableCollapse={onClickTableCollapse}
            tableCollapses={tableCollapses}
          />
        )}

        {listNational && (
          <NationalityList
            isDisabled={isDisabled}
            data={listNational}
            onPressSwitch={onUpdateNational}
            onChangeScore={onUpdateNational}
            convertToRebase={convertToRebase}
            onClickTableCollapse={onClickTableCollapse}
            tableCollapses={tableCollapses}
          />
        )}
      </Table>
    </div>
  );
};

export default TableWeight;
