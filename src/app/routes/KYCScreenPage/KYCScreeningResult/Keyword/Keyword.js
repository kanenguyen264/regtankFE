import withStyles from "@material-ui/core/styles/withStyles";
import { lightness } from "@protego/sdk/utils/colors";
import { extractLetters } from "@protego/sdk/utils/string";
import { compose } from "recompose";
import { getColorKeyWord, getColorTextKeyWord } from "../../../../../util";

const Keyword = compose(
  withStyles((theme) => ({
    root: {
      display: "inline-block",
      backgroundColor: (props) =>
        props.keyword.color
          ? lightness(props.keyword.color)
          : getColorKeyWord(props.keyword),
      color: (props) =>
        props.keyword.color ?? getColorTextKeyWord(props.keyword),
      lineHeight: 22.0 / 16,
      padding: theme.mixins.paddingToRem(3, 20, 4, 20),
      borderRadius: theme.typography.pxToRem(12),
      fontSize: theme.typography.pxToRem(12),
      marginRight: theme.typography.pxToRem(5),
      marginBottom: theme.typography.pxToRem(5),
      marginTop: theme.typography.pxToRem(5)
    }
  }))
)(function Keyword({ keyword, classes }) {
  return (
    <span className={classes.root}>
      {keyword.text ? extractLetters(keyword.text) : keyword}
    </span>
  );
});

export default Keyword;
