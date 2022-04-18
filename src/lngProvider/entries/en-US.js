import * as enMessages from "../locales/index-en";
import base from "@protego/sdk/locales/en_US.json";

const EnLang = {
  messages: {
    ...base,
    ...enMessages
  },
  locale: "en-US"
};
export default EnLang;
