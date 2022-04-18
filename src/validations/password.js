const lowerCaseRegex = "(?=.*[a-z])";
const upperCaseRegex = "(?=.*[A-Z])";
const symbolsRegex = "(?=.*[!@#$%^&*])";
const numericRegex = "(?=.*[0-9])";
const lengthRegex = "(?=.{8,})";
const length6Regex = "(?=.{6,})";

const PASSWORD_REGEX = `^${upperCaseRegex}${numericRegex}${lengthRegex}`;

const passwordValidation = (password, regexCondition) => {
  let strength = {
    id: -1,
    value: "error",
    length: 0,
    contains: [],
    isValid: true
  };
  if (!password) {
    return strength;
  }
  let passwordContains = [];

  if (new RegExp(`^${lowerCaseRegex}`).test(password)) {
    passwordContains.push("lowercase");
  }

  if (new RegExp(`^${upperCaseRegex}`).test(password)) {
    passwordContains.push("uppercase");
  }

  if (new RegExp(`^${symbolsRegex}`).test(password)) {
    passwordContains.push("symbol");
  }

  if (new RegExp(`^${numericRegex}`).test(password)) {
    passwordContains.push("number");
  }

  if (new RegExp(`^${lengthRegex}`).test(password)) {
    passwordContains.push("length");
  }

  const strongRegex = new RegExp(
    `^${lowerCaseRegex}${upperCaseRegex}${numericRegex}${lengthRegex}`
  );

  const medium2Regex = new RegExp(
    `^((${upperCaseRegex}${numericRegex})|(${numericRegex}${lengthRegex})|(${lengthRegex}${upperCaseRegex}))`
  );

  const medium1Regex = new RegExp(
    `^((${upperCaseRegex})|(${numericRegex})|(${lengthRegex}))`
  );

  const weakRegex = new RegExp(`^((${lowerCaseRegex})|(${length6Regex}))`);

  const validCondition = new RegExp(
    regexCondition ||
      `^${lowerCaseRegex}${upperCaseRegex}${numericRegex}${lengthRegex}`
  );

  if (strongRegex.test(password)) {
    strength = {
      id: 3,
      value: "Strong"
    };
  } else if (medium2Regex.test(password)) {
    strength = {
      id: 2,
      value: "Medium_2"
    };
  } else if (medium1Regex.test(password)) {
    strength = {
      id: 1,
      value: "Medium_1"
    };
  } else if (weakRegex.test(password)) {
    strength = {
      id: 0,
      value: "Weak"
    };
  } else {
    strength = {
      id: -1,
      value: "Error"
    };
  }
  strength.length = password.length || 0;
  strength.contains = passwordContains;
  strength.isValid = password ? validCondition.test(password) : true;
  return strength;
};

export { PASSWORD_REGEX, passwordValidation };
