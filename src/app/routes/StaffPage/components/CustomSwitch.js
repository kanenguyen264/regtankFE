import { Switch } from "@mui/material";
import { styled } from "@mui/material/styles";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
const CustomSwitch = styled(Switch)(() => ({
  width: "48px",
  height: "32px",
  overflow: "hidden",
  padding: "6px",
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: "16px",
    height: "16px",
    backgroundColor: ThemeColors.white,
  },
  "& .MuiSwitch-switchBase": {
    padding: "8px",

    "&.Mui-checked": {
      transform: "translateX(16px)",
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: "18px",
    backgroundColor: ThemeColors.defaultLight,
    opacity: "1 !important",
  },
}));

export default CustomSwitch;
