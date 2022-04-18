import { isNaN } from "lodash";

const isEmptyValues = (value) => {
  return (
    value === undefined ||
    value === null ||
    isNaN(value) ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length() === 0)
  );
};

export { isEmptyValues };
