const getColorStatus = (text) => {
  switch (text) {
    case "POSITIVE":
      return "#EA2134";
    case "FALSE":
      return "#4CAF50;";
    case "UNRESOLVED":
      return "#0080FF";
    default:
      break;
  }
};
const getWidthStatus = (width) => {
  switch (width) {
    case "POSITIVE":
      return 60;
    case "FALSE":
      return 45;
    case "UNRESOLVED":
      return 70;
    default:
      break;
  }
};
const getTextStatus = (text) => {
  switch (text) {
    case "POSITIVE":
      return "Positive";
    case "FALSE":
      return "False";
    case "UNRESOLVED":
      return "Unresolved";
    default:
      break;
  }
};
export { getColorStatus, getWidthStatus, getTextStatus };
