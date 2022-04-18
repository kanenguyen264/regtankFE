import * as companies from "constants/CompanyType";

const getCompanyType = (key) => {
  let defaultKey = "appModule.hyphen";
  if (!key) {
    return defaultKey;
  }
  return `kyb.company.type.${key}`;
};

const getCompanyList = () => {
  const list = [];
  for (const key in companies) {
    list.push(key);
  }
  return list;
};

export { getCompanyType, getCompanyList };
