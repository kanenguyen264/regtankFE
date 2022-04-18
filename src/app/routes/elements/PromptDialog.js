import React from "react";
import { Grid, Button, Icon } from "@mui/material";
import usePrompt from "@protego/sdk/RegtankUI/v1/PromptDialog/PromptDialog";
const PromptDialog = () => {
    const confirmEnableOM = usePrompt();
    const handleClick = async() => {
        await confirmEnableOM({
            title: "ubakachi",
            okText: "proceed", 
            cancelText: "close", 
            content: "ubakachi"
        });
    }
    return(
        <Grid>
             <Button onClick={handleClick}>show prompt dialog</Button>
        </Grid>
    )
}

export default PromptDialog; 