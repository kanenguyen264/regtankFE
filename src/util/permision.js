export const canAccessKYT = (data) => {
  if (
    data &&
    (data.disabledKytModule === undefined || data.disabledKytModule === false)
  ) {
    return true;
  }
  return false;
};
export const canAccessLiveness = (data) => {
  if (
    data &&
    (data.disabledLivenessModule === undefined ||
      data.disabledLivenessModule === false)
  ) {
    return true;
  }
  return false;
};
