export const checkRoleUser = (role) => {
  if (!role) {
    return;
  }
  return role?.[0];
};

export const createArrayUserRoles = (val) => {
  if (!val) {
    return;
  }
  return [{ id: val }];
};
