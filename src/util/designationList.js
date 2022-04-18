import { find } from "lodash";
import { DesignationList } from "constants/Designation";
function designationCodeToName(key) {
  const match = find(DesignationList, { key });
  return match;
}

export { designationCodeToName };
