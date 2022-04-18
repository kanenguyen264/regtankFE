import { createMuiTheme } from "@material-ui/core/styles";
import BaseMuiTheme from "@protego/sdk/RegtankUI/v1/MuiTheme/theme";
import white_logo from "../assets/images/logo_white.png";
import black_logo from "../assets/images/logo_black.png";
import { toRem } from "@protego/sdk/utils/measurements";
// import BaseMuiTheme from "@protego/sdk/RegtankUI/v1/MuiTheme/theme"

//region doc
export const customTheme = {
  typography: {
    h4: {
      fontSize: "1.2353rem",
      fontWeight: "bold",
    },
    body2: {
      fontWeight: 500,
    },
    button: {
      textTransform: "capitalize",
    },
  },
  /**
   * Search table
   */
  palette: {
    text: {
      primary: "#595959",
      secondary: "#7e7e7e",
      body: "#252525",
    },
    sideBar: {
      bgActive: "#293145",
      text: "#a1a1a1",
      textActive: "#fff",
    },
    dropdown: {
      bg: "#fff",
    },
    CustomSelect: {
      item: "#fff",
      itemSelected: "#f4f4f4",
    },
  },
  props: {
    // MuiButton: {
    //   debug: "light",
    // },
    Logo: {
      src: white_logo, //exclude
      alt: "Client Portal",
      title: "Client Portal",
    },
    AppBarNotification: {
      backgroundColor: "#fff",
    },
    MuiDropdown: {
      variant: "contained",
      color: "",
    },
  },
  overrides: {
    // MuiButton: {
    //   root: {
    //     paddingTop: toRem(15),
    //     paddingBottom: toRem(15),
    //     fontSize: "0.9412rem",
    //     fontWeight: 500,
    //   },
    //   text: {
    //     paddingTop: toRem(15),
    //     paddingBottom: toRem(15),
    //     fontSize: "0.9412rem",
    //     fontWeight: 500,
    //     color: "#7e7e7e",
    //   },
    //   label: {
    //     lineHeight: 1.3125,
    //   },
    //   contained: {
    //     backgroundColor: "#FFFFFF",
    //     color: "#2B2B2B",
    //     border: "1px solid #E6E6E6",
    //     borderRadius: "6px",
    //     boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.14)",

    //     "&:hover": {
    //       boxShadow: "0px 2px 10px rgba(34, 59, 96, 0.16)",
    //       backgroundColor: "#FFFFFF",
    //     },
    //     "&:active": {
    //       borderColor: "#0073E6",
    //       boxShadow: "0px 2px 4px rgba(34, 59, 96, 0.06)",
    //       color: "#0073E6",
    //     },
    //     "&$disabled": {
    //       backgroundColor: "#F5F5F5",
    //       color: "#BFBFBF",
    //     },
    //     "&$root": {
    //       fontWeight: 500,
    //     },
    //   },
    //   containedPrimary: {
    //     backgroundColor: "#0080FF",
    //     border: "1.5px solid #0078F0",

    //     "&:hover": {
    //       backgroundColor: "#1A8DFF",
    //     },
    //     "&:active": {
    //       backgroundColor: "#0073E6",
    //       color: "#FFFFFF",
    //     },
    //     "&$disabled": {
    //       backgroundColor: "rgba(0, 128, 255, 0.4)",
    //       color: "#FFFFFF",
    //       borderColor: "transparent",
    //     },
    //   },
    //   containedSecondary: {
    //     backgroundColor: "#FFFFFF",
    //     border: "1px solid #0080FF",
    //     color: "#0080FF",

    //     "&:hover": {
    //       borderColor: "#1A8DFF",
    //       color: "#1A8DFF",
    //       backgroundColor: "#FFFFFF",
    //     },
    //     "&:active": {
    //       borderColor: "#0073E6",
    //       color: "#0073E6",
    //       backgroundColor: "#FFFFFF",
    //     },
    //     "&$disabled": {
    //       borderColor: "#E6E6E6",
    //     },
    //   },
    // },
    MuiDropdown: {
      dropdown: {
        paddingTop: toRem(10),
        paddingBottom: toRem(10),
      },
    },
    MuiAlert: {
      filledError: {
        backgroundColor: "#E25141",
      },
    },
    SearchBox: {
      panel: {
        backgroundColor: "#fff",
        "& .MuiListItemText-root": {
          color: "#808080",
        },
      },
    },
    PageHeading: {
      root: {
        backgroundColor: "#fff",
        "& $linkItem": {
          color: "#808080",
          "&.active, &:hover": {
            color: "#3f51b5",
            "&$disabled": {
              color: "#808080",
              userSelect: "none",
            },
          },
        },
      },
    },
    MuiToolbar: {
      root: {
        color: "#303030",
        fontWeight: 400,
        fontSize: "1rem",
      },
    },
    MuiOutlinedInput: {
      root: {
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#E6E6E6",
        },
      },
      input: {
        padding: BaseMuiTheme.mixins.paddingToRem(10, 14, 10, 14),
        backgroundColor: "#fff",
        "&::placeholder": {
          color: "#7e7e7e",
          opacity: 1,
        },
      },
      notchedOutline: {
        border: "1px solid #E6E6E6",
      },
    },
    /**
     * MUI select
     */

    MuiTypography: {
      body2: {
        fontSize: "1rem",
        fontWeight: 400,
      },
      colorInherit: {
        color: "#303030",
      },
      colorPrimary: {
        color: "#0080FF",
      },
    },
    MuiListItem: {
      color: "#a1a1a1",
    },
    MuiSelect: {
      root: {
        marginLeft: BaseMuiTheme.typography.pxToRem(0),
        backgroundColor: "white",
      },
      nativeInput: {
        height: "100%",
      },
      icon: {
        top: "unset",
        bottom: "unset",
        marginRight: BaseMuiTheme.typography.pxToRem(4),
        "@media (min-width:1920px)": {
          marginRight: BaseMuiTheme.typography.pxToRem(2),
        },
      },
    },
    /**
     * Table
     */
    MuiAvatar: {
      root: {
        marginRight: BaseMuiTheme.typography.pxToRem(8),
      },
      colorDefault: {
        color: "#fff",
        backgroundColor: "#7d7d7d",
      },
    },

    MuiTablePagination: {
      toolbar: {
        height: BaseMuiTheme.typography.pxToRem(10),
      },
    },

    MuiTableCell: {
      root: {
        borderBottomColor: "#eee",
        fontWeight: 400,
      },
      head: {
        backgroundColor: "#ffffff",
        color: "#808080",
      },
      body: {
        backgroundColor: "#fff",
        color: "#212529",
      },
    },

    MuiTableSortLabel: {
      root: {
        "&&$active": {
          color: "#575757",
        },
      },
      active: {},
    },

    MuiDialog: {
      paper: {
        backgroundColor: "transparent",
        boxShadow: "0px 11px 15px -7px rgb(0, 0, 0, .2)",
      },
    },

    MuiDialogTitle: {
      root: {
        backgroundColor: "#0080FF",
        fontSize: toRem(21),
        padding: "16px 24px",
        "& h2": {
          color: "#fff",
        },
      },
    },
    MuiCloseableDialogTitle: {
      root: {
        backgroundColor: "#0080FF",
        padding: "16px 24px",
      },
      text: {
        fontSize: toRem(21),
      },
    },

    MuiDialogContent: {
      root: {
        backgroundColor: "#fff",
        padding: toRem(32),
        "&:first-child": {
          padding: toRem(32),
        },
      },
    },

    MuiDialogActions: {
      root: {
        backgroundColor: "#fff",
        padding: toRem(32),
        paddingTop: 0,
      },
    },

    MuiPromptDialog: {
      actions: {
        padding: toRem(32),
        paddingBottom: toRem(32),
        paddingTop: 0,
      },
      content: {
        fontWeight: 400,
        minWidth: "unset",
        maxWidth: "unset",
        padding: toRem(32),
        fontSize: toRem(17),
        textAlign: "center",
      },
    },

    JRCard: {
      root: {
        backgroundColor: "#fff",
      },
      headerLine: {
        borderColor: "#e4e4e4",
      },
    },

    MuiSlider: {
      root: {
        height: 6,
      },
      rail: {
        height: 6,
      },
      thumb: {
        height: 22,
        width: 22,
        backgroundColor: "#fff",
        border: "7px solid #3F51B5",
        marginTop: -9,
        marginLeft: -15,
        "&:focus, &:hover, &$active": {
          boxShadow: "inherit",
        },
      },
      valueLabel: {
        left: "calc(-50% - 9px)",
        top: "-40px",
      },
      track: {
        height: 6,
        borderRadius: 6,
        color: "#3F51B5",
      },
      mark: {
        height: 16,
        width: 16,
        top: "8px",
        borderRadius: "50%",
        backgroundColor: "#7D91FF",
        transform: "translateX(-12px)",
      },
      markActive: {
        left: "calc(-50% - 9px)",
        backgroundColor: "#3F51B5",
        opacity: 1,
        transform: "translateX(-12px)",
      },
      marked: {
        margin: 0,
        marginBottom: 0,
      },
    },
    MuiPickersDay: {
      day: {
        color: "#1d2429",
      },
      daySelected: {
        backgroundColor: "#0080FF",
        color: "white",
        "& .MuiTypography-colorInherit": {
          color: "white",
        },
      },
      current: {
        color: "#0080FF",
      },
      dayDisabled: {
        "pointer-events": "inherit",
        cursor: "not-allowed !important",
        "& span": {
          "& p": { color: "#00000061" },
        },
      },
    },
    /**
     * Link
     */
    MuiLink: {
      root: {
        color: "#0080FF",
      },
      underlineHover: {
        "&:hover": {
          // textDecorationColor: "#8E9ACC",
          textDecorationThickness: "1px",
          color: "#0052A3",
          textDecorationColor: "#0052A3",
          textDecorationLine: "underline",
          textDecorationStyle: "dashed",
          textUnderlineOffset: "2px",
        },
      },
    },
    MuiCopyButton: {
      copyButton: {
        cursor: "pointer",
        "& svg": {
          height: toRem(16),
          width: toRem(13),
          float: "left",
        },
        "&:hover svg path": {
          opacity: 0.7,
          fill: "#0080ff !important",
        },
      },
    },
    MuiTooltip: {
      tooltip: {
        fontSize: toRem(14),
        fontWeight: "400",
        lineHeight: toRem(20),
        backgroundColor: "#2F364A",
        padding: "12px",
        borderRadius: "6px",
        minWidth: "12px",
      },
      arrow: {
        color: "#2F364A",
      },
    },
    /**
     * Mui check box all page
     */
    MuiCheckbox: {
      colorPrimary: {
        color: "#DBDDE0",
        "&$checked": {
          color: "#0080FF",
        },
      },
    },
    /**
     * Mui Picker
     */
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: "#0080FF",
      },
    },
    // MuiTypography: {
    //   colorPrimary: { color: "#0080FF" },
    // },
    /**
     * Mui radio button
     */
    MuiRadio: {
      root: {
        color: "#C4C4C4",
        "&$checked": {
          color: "#0080FF",
        },
      },
    },
  },
};

const MuiTheme = createMuiTheme(BaseMuiTheme, customTheme);

export default MuiTheme;
//endregion
export const MuiThemeAuthentication = createMuiTheme(MuiTheme, {
  overrides: {
    MuiOutlinedInput: {
      root: {
        backgroundColor: "#f5f5f5",
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#adadad",
        },
        "& svg": {
          fill: "#a5abb1",
          position: "relative",
          right: "-5px",
        },
      },
      input: {
        backgroundColor: "#f5f5f5",
        "&::placeholder": {
          color: "#7e7e7e",
          opacity: 1,
        },
      },
      notchedOutline: {
        borderColor: "#DCE0E4",
      },
    },
    MuiFormControlLabel: {
      root: { marginLeft: -7 },
    },
    MuiCheckbox: {
      root: {
        padding: 6,
        "& + [class*='MuiFormControlLabel-label']": {
          fontSize: `${14 / 17}rem`,
        },
      },
    },
  },
  props: {
    MuiCheckbox: {
      // icon: <IcCheckbox />,
      // checkedIcon: <IcCheckboxChecked />,
      disableRipple: true,
    },
    Logo: {
      src: black_logo,
    },
  },
});
