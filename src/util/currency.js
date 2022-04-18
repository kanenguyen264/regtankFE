// https://www.npmjs.com/package/currency-formatter

import currencyFormatter from "currency-formatter";
import currencies from "currency-formatter/currencies.json";

function formatCurrency(value, options = {}) {
  return currencyFormatter.format(value, {
    format: {
      pos: "%s%v",
      neg: "(%s%v)",
      zero: "%s%v"
    },
    precision: 0,
    code: options.code || "USD",
    ...options
  });
}

function formatCredit(value, options = {}) {
  return currencyFormatter.format(value, {
    decimalDigits: 0,
    format: {
      pos: "%s%v",
      neg: "(%s%v)",
      zero: "%s%v"
    },
    precision: 0,
    ...options
  });
}
function currencySymbol(code) {
  return currencies[code] ? currencies[code].symbol : "?";
}

function currencyValue(value, code) {
  const floatVal =
    typeof value === "string" ? parseCurrency(value, code) : value;
  return !currencies[code] || isNaN(floatVal)
    ? value
    : currencyFormatter.format(floatVal, {
        code,
        symbol: ""
      });
}

function parseCurrency(value, code = "USD") {
  return currencyFormatter.unformat(value, {
    code
  });
}

function formatCoinValue(value) {
  return Number(value.toFixed(9));
}

export {
  formatCurrency,
  currencySymbol,
  currencyValue,
  parseCurrency,
  formatCredit,
  formatCoinValue
};
