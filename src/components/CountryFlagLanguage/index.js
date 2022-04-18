import React, { Fragment } from "react";
import CountryFlag from "@protego/sdk/RegtankUI/v1/CountryFlag/CountryFlag";
import { useSelector } from "react-redux";

const CountryFlagLanguage = (props) => {
  const language = useSelector((state) => state.settings.locale.locale);
  let countryCodeArr = [];
  const { countryCode, djwl } = props;

  // check multinational
  if (countryCode) {
    if (countryCode.includes("/")) {
      countryCodeArr = countryCode.split("/");
    } else {
      countryCodeArr.push(countryCode);
    }
  } else {
    countryCodeArr.push("");
  }
  return (
    <Fragment>
      {countryCodeArr &&
        countryCodeArr.map((item, key) => {
          return (
            <CountryFlag
              key={key}
              {...props}
              countryCode={item}
              language={language}
              djwl={djwl}
            />
          );
        })}
    </Fragment>
  );
};

export default CountryFlagLanguage;
