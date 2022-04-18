import React from "react";
import clsx from "clsx";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
const LanguageItem = ({
  className,
  language,
  switchLanguage,
  handleRequestClose
}) => {
  const { icon, name } = language;
  return (
    <li
      className={clsx(className, "pointer")}
      onClick={() => {
        handleRequestClose();
        switchLanguage(language);
      }}
    >
      <div className="d-flex align-items-center">
        <i className={`flag flag-24 flag-${icon}`} />
        <h4 className="mb-0 ml-2">
          <IntlMessages id={"appModule." + name} />
        </h4>
      </div>
    </li>
  );
};

export default LanguageItem;
