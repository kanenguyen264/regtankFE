import { filter, flatten, flow, groupBy, sortBy, unionBy, find } from "lodash";
import {
  CountryList,
  CountryListCN,
  CountryListDJEN,
  CountryListDJCN,
} from "@protego/sdk/consts";
import { getStateInStoreByKey } from "./accessStoreRedux";

const getCountryLib = (propSort = "demonym", djwl = false) => {
  const { locale } = getStateInStoreByKey("settings.locale");
  let listCountry;
  if (djwl) {
    listCountry = locale === "cn" ? CountryListDJCN : CountryListDJEN;
  } else {
    listCountry = locale === "cn" ? CountryListCN : CountryList;
  }
  const list = sortBy(listCountry, propSort);
  const results = getDuplicates(list, "demonym");
  results.forEach((element) => {
    if (element.demonym !== "") {
      element.demonym = `${element.demonym} (${element.name})`;
    } else {
      element.demonym = element.name;
    }
  });
  const countries = unionBy(list, results, "code");
  return countries;
};

function getDuplicates(list, property = "name") {
  const results = flow([
    (arr) => groupBy(arr, property), // group elements by property
    (g) => filter(g, (o) => o.length > 1), // remove groups that have less than two members
    flatten, // flatten the results to a single array
  ])(list);
  return results;
}
function countryCodeToName(code, type, djwl = false) {
  const typeValue = type ? type : "name";
  const { locale } = getStateInStoreByKey("settings.locale");
  let listCountry;
  if (djwl) {
    listCountry = locale === "cn" ? CountryListDJCN : CountryListDJEN;
  } else {
    listCountry = locale === "cn" ? CountryListCN : CountryList;
  }
  const match = find(listCountry, { code });
  return match && match[typeValue];
}

export { getCountryLib, countryCodeToName };
