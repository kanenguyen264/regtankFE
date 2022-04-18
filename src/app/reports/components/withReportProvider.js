import React from "react";
import { IntlProvider } from "react-intl";
import AppLocale from "../../../lngProvider";
import { Provider, useSelector } from "react-redux";
import { store } from "../../../store";

const injectAppRedux = (Component) => (props) => {
  return (
    <Provider store={store}>
      <Component {...props} />
    </Provider>
  );
};

const withReportProvider = (Component) =>
  injectAppRedux(function WithReportProvider(props) {
    const locale = useSelector(({ settings }) => settings.locale);
    const printedBy = useSelector(({ me }) => me.me);
    const currentAppLocale = AppLocale[locale.locale];
    const [company] = React.useState(() =>
      JSON.parse(window.localStorage.getItem("doc:company"))
    );
    return (
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}
      >
        <Component company={company} printedBy={printedBy} {...props} />
      </IntlProvider>
    );
  });

export default withReportProvider;
