import deepmerge from "@material-ui/utils/deepmerge";

function lowerCaseFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

export default function muiClassBinding(classes, muiControls = []) {
  const keys = Object.keys(classes);
  return keys.reduce((acc, cls) => {
    const isFound = muiControls.find((ctrl) => cls.indexOf(ctrl) === 0);
    if (typeof isFound === "string") {
      const subClassName = lowerCaseFirstLetter(cls.slice(isFound.length));
      return deepmerge(acc, {
        [isFound]: {
          [subClassName]: classes[cls]
        }
      });
    }
    return acc;
  }, {});
}
