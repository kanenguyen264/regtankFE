import { find } from "lodash";
import {
  CountryListWhitelistCN,
  CountryListWhitelistEN
} from "@protego/sdk/consts";
import { getStateInStoreByKey } from "./accessStoreRedux";
const getCountryWhitelist = () => {
  const { locale } = getStateInStoreByKey("settings.locale");
  let listCountry =
    locale === "cn" ? CountryListWhitelistCN : CountryListWhitelistEN;

  return listCountry;
};
function countryWhitelistCodeToName(code, type = "name") {
  const { locale } = getStateInStoreByKey("settings.locale");
  let listCountry =
    locale === "cn" ? CountryListWhitelistCN : CountryListWhitelistEN;
  const match = find(listCountry, { code });
  return match && match[type];
}

export { getCountryWhitelist, countryWhitelistCodeToName };
