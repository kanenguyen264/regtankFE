import { MALE, FEMALE, UNSPECIFIED } from "constants/GenderTypes";

const getGenderTranslate = (enumGender) => {
  let localizeGenderKey = "appModule.hyphen";
  switch (enumGender) {
    case MALE:
      localizeGenderKey = "component.gender.male";
      break;
    case FEMALE:
      localizeGenderKey = "component.gender.female";
      break;
    case UNSPECIFIED:
      localizeGenderKey = "component.gender.unspecified";
      break;
    default:
      localizeGenderKey = "appModule.hyphen";
      break;
  }
  return localizeGenderKey;
};

export { getGenderTranslate };
