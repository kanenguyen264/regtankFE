import * as sizeOfCompany from "constants/SizeCompany";

const getSizeOfCompany = (key) => {
  let defaultKey = "appModule.hyphen";
  if (key) {
    return `kyb.sizeOfCompany.type.${key}`;
  }
  return defaultKey;
};

const getSizeOfCompanyList = () => {
  const list = [];
  for (const key in sizeOfCompany) {
    list.push(key);
  }
  return list;
};

export { getSizeOfCompany, getSizeOfCompanyList };
