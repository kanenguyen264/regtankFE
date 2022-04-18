import React from "react";
import { makeStyles } from "@mui/styles";
import ThemeColors from "@protego/sdk/RegtankUI/v1/constants/ThemeColors";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";

export const useKycStyles = makeStyles({
  root: {},
  customTable: {
    marginTop: toRem(20),
    "& .MuiTable-root": {
      "& .MuiTableCell-root:first-child": {
        paddingLeft: "0 !important",
        width: toRem(33),
      },
      "& .MuiTableHead-root": {
        backgroundColor: ThemeColors.white,
        "& .MuiTableRow-root": {
          "&:hover": {
            backgroundColor: `${ThemeColors.white} !important`,
          },
          "& .MuiTableCell-root": {
            "& span": {
              fontStyle: "normal",
              fontWeight: "600",
              fontSize: `${toRem(14)}`,
              color: "#7A7A7A",
            },
          },
        },
      },
      "& .MuiTableBody-root": {
        "& .MuiTableRow-root": {
          "&:hover": {
            backgroundColor: `${ThemeColors.white} !important`,
          },
          "& .MuiTableCell-root": {
            fontSize: `${toRem(14)}`,
            fontWeight: 500,
            opacity: 0.9,
            color: ThemeColors.mainBlackText,
            lineHeight: toRem(26),
            "& .MuiIconButton-root": {
              backgroundColor: ThemeColors.iconRowCollapseBgClose,
              opacity: 0.6,
              "& svg": {
                fontSize: toRem(18),
                "& path": {
                  fill: ThemeColors.iconRowCollapseClose,
                },
              },
            },
            "& .MuiIconButton-root.open": {
              backgroundColor: `${ThemeColors.iconRowCollapseBgOpen} !important`,
              opacity: 0.6,
              "& svg": {
                "& path": {
                  fill: ThemeColors.primary,
                },
              },
            },
          },
        },
      },
    },
  },
});
