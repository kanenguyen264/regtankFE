import { find } from "lodash";
import { getStateInStoreByKey } from "./accessStoreRedux";
import { IndustryList, IndustryListCN } from "./data";

const getIndustry = () => {
  const { locale } = getStateInStoreByKey("settings.locale");
  let listIndustry = locale === "cn" ? IndustryListCN : IndustryList;
  return listIndustry;
};

function industryCodeToName(key, type = "value") {
  const { locale } = getStateInStoreByKey("settings.locale");
  let listCountry = locale === "cn" ? IndustryListCN : IndustryList;
  const match = find(listCountry, { key });
  return match && match[type];
}

export { getIndustry, industryCodeToName };
