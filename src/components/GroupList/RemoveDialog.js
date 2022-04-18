import { Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import theme from "@protego/sdk/RegtankUI/v1/MuiTheme/theme";
import clsx from "clsx";
import React from "react";
import styles from "./KYCList.module.scss";
import { styled } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import { DELETE_BUTTON } from "constants/ThemeColors";
const DeleteButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: DELETE_BUTTON,
  "&:hover": {
    backgroundColor: DELETE_BUTTON,
  },
}));
const RemoveDialog = ({
  data,
  isOpen,
  onClose,
  risk,
  paginationParams,
  group,
  type,
  onSubmit,
}) => {
  /**
   * Create group
   */
  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={isOpen}
        onClose={onClose}
        title={{
          text: <IntlMessages id={"appModule.delete.grouplist"} />,
        }}
        allowCloseOnTitle
        actionsCustom={
          <div className="justify-content-center d-flex ">
            <Button onClick={onClose} variant="outlinedSecondary">
              <IntlMessages id="appModule.requestForm.cancel" />
            </Button>
            <DeleteButton
              variant="contained"
              className={clsx("ml-3")}
              type="submit"
              onClick={onSubmit}
            >
              <IntlMessages id="kyc.add.remove.action" />
            </DeleteButton>
          </div>
        }
      >
        <div className="mt-2">
          <Typography
            variant="textLabel"
            className={styles.contentPopupDelete}
            color={"grayText"}
          >
            <div className={"d-flex flex-column align-items-center"}>
              <div className={"mb-2"}>
                <span className={styles.groupName}> {group?.name}</span>{" "}
                <IntlMessages id={"kyc.add.remove.title"} />{" "}
                <IntlMessages id={"appModule.add.remove.content"} />
              </div>
            </div>
          </Typography>
        </div>
      </Dialog>
    </ThemeProvider>
  );
};

export default RemoveDialog;
