export const CHEQUE = "CHEQUE";
export const CASH = "CASH";
export const TELEGRAPHIC_TRANSFER = "TELEGRAPHIC_TRANSFER";
export const MAIL_TRANSFER = "MAIL_TRANSFER";
export const BILL_OF_EXCHANGE = "BILL_OF_EXCHANGE";
export const PROMISSORY_NOTE = "PROMISSORY_NOTE";
export const BANK_DRAFT = "BANK_DRAFT";
export const DIGITAL_MODE = "DIGITAL_MODE";
export const OTHERS = "OTHERS";

export const PAYMENT_MODE = [
  { value: CASH, label: "kyb.payment.mode.cash" },
  { value: CHEQUE, label: "kyb.payment.mode.cheque" },
  { value: TELEGRAPHIC_TRANSFER, label: "kyb.payment.mode.Telegraphic" },
  { value: MAIL_TRANSFER, label: "kyb.payment.mode.Mail" },
  { value: BILL_OF_EXCHANGE, label: "kyb.payment.mode.Bill" },
  { value: PROMISSORY_NOTE, label: "kyb.payment.mode.Promissory" },
  { value: BANK_DRAFT, label: "kyb.payment.mode.Bank" },
  { value: DIGITAL_MODE, label: "kyb.payment.mode.Digital" },
  { value: OTHERS, label: "kyb.payment.mode.Others" }
];
