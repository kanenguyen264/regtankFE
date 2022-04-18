import {
    Box,
    Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import clsx from "clsx";
import React, { memo } from "react";
import { TEXT_DARK_GRAY } from "constants/ThemeColors";
import { toRem } from "@protego/sdk/utils/measurements";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";

const useStyles = makeStyles((theme) => ({
    contentText: {
        color: TEXT_DARK_GRAY,
        fontWeight: 500,
    },
    checkboxLabel: {
        color: TEXT_DARK_GRAY,
        fontWeight: 400,
        fontSize: toRem(14),
    },
}));

const NotificationDialog = (props) => {
    const className = useStyles();
    const {
        open,
        onPress,
        icon,
        title,
        disableButton,
        content,
    } = props;

    return (
        <>
            <Dialog
                open={open}
                onClose={onPress}
                title={{
                    text: title,
                    icon: icon,
                }}
                allowCloseOnTitle
                actionsCustom={
                    <div style={{ width: "100%" }}>
                        <div className="d-flex justify-content-end">
                            <Button
                                className={clsx("ml-3")}
                                onClick={onPress}
                                variant="contained"
                                disabled={disableButton}
                            >
                                <IntlMessages id="appModule.ok" />
                            </Button>
                        </div>
                    </div>
                }
                hideCloseIcon={true}
                disableEscapeKeyDown={true}
            >
                <div>
                    <div id="DialogContent">
                        <Box
                            display="flex"
                            className={`${className.contentText} `}
                        >
                            <Typography variant="Subtitle3">
                                {content}
                            </Typography>
                        </Box>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default memo(NotificationDialog);
