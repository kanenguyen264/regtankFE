// import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { createTheme as createMuiTheme } from "@mui/material/styles";
import BaseMuiTheme from "@protego/sdk/RegtankUI/v1/MuiTheme/theme";
import { customTheme } from "../constants/MuiTheme";
export const MuiTheme = createMuiTheme(BaseMuiTheme, customTheme);

