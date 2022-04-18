// * A4 @ 150 dpi - 1753x1240 pix
// * A4 @ 72 dpi - 841x595 pix
const A4inDesign = {
  // horizontal
  h: [1240, 595],
  // vertical
  v: [1753, 842]
};

/**
 *
 * @param {number} pxInDesign
 * @param {'h'|'v'} direction
 * @return {string}
 * A4 @ 150 dpi - 1753x1240 pix
 * A4 @ 72 dpi - 842x595 pix
 */
export function toPrintedPt(pxInDesign, direction = "v") {
  const [px, mm] = A4inDesign[direction];
  // noinspection PointlessArithmeticExpressionJS
  return (((pxInDesign * 1.0) / px) * mm).toFixed(0);
}

/**
 *
 * @param {BasicUserInfoDto} user
 */
export function renderUser(user) {
  if (typeof user === "undefined" || user === null) return "";
  return user.firstName + " " + user.lastName;
}
