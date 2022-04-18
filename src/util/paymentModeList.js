import { find } from "lodash";
import { PAYMENT_MODE } from "constants/PaymentMode";

function paymentModeCodeToName(value) {
  const match = find(PAYMENT_MODE, { value });
  return match;
}

export { paymentModeCodeToName };
