const memoize = require("lodash/memoize");

const elements = ["svg", "Svg"];

const transformValue = memoize(function transformValue(value) {
  let numericValue = isNaN(value) ? 17.0 : value * 1.0;
  if (/px$/.test(value)) numericValue = value.replace(/px$/g, "") * 1.0;
  return (numericValue / 17).toFixed(5) + "rem";
});

const plugin = ({ types: t }) => ({
  visitor: {
    JSXOpeningElement: {
      enter(path) {
        if (
          !elements.some((element) =>
            path.get("name").isJSXIdentifier({ name: element })
          )
        )
          return;

        const requiredAttributes = ["width", "height"];
        const attributeValue = "1em";

        path.get("attributes").forEach((attributePath) => {
          if (!attributePath.isJSXAttribute()) return;
          const index = requiredAttributes.indexOf(
            attributePath.node.name.name
          );

          if (index === -1) return;

          const value = attributePath.get("value");
          let _value$node$value,
            _value$node,
            _value$node$expressio,
            innerValue =
              (_value$node$value =
                (_value$node = value.node) == null
                  ? void 0
                  : _value$node.value) != null
                ? _value$node$value
                : (_value$node$expressio = value.node.expression) == null
                ? void 0
                : _value$node$expressio.value;

          if (innerValue) {
            value.replaceWith(t.stringLiteral(transformValue(innerValue)));
            requiredAttributes.splice(index, 1);
          }
        });

        requiredAttributes.forEach((attribute) => {
          path.pushContainer(
            "attributes",
            t.jsxAttribute(
              t.jsxIdentifier(attribute),
              t.stringLiteral(attributeValue)
            )
          );
        });
      }
    }
  }
});

module.exports = plugin;
