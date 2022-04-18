import { FormattedHTMLMessage } from "react-intl";
import React from "react";
export const getErrorMsg = (err) => {
    let msg = err?.response?.data?.message || err;
    return <FormattedHTMLMessage id={ msg ? `error.${msg}` : 'error.SOMETHING_WENT_WRONG'} />;
}