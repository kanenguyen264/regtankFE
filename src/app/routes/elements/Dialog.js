import React from "react";
import { Grid, Button, Icon } from "@mui/material";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog/Dialog";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import { ErrorOutline } from "@mui/icons-material";

const Dialogs = () => {
  const [open, setOpen] = React.useState(false);

  const handleChange = async (event) => {
    setOpen(true);
  };
  const handleAfterOK = () => {
    alert("aaa");
    setOpen(false);
  };
  const onClose = async (event) => {
    setOpen(false);
  };
  return (
    <div>
      <Grid space={1} container style={{ marginBottom: 5 }} xs={3}>
        <Button onClick={handleChange}>Show Dialog</Button>
        <Dialog
          open={open}
          onClose={onClose}
          title={{
            text: "Case Name Has Not Been Saved",
            icon: <Icon component={ErrorOutline} color="primary" />,
          }}
          allowCloseOnTitle={true}
          okProps={{
            text: "Continue",
            onClick: handleAfterOK,
          }}
          cancelProps={{
            text: "cancel",
            onClick: onClose,
          }}
        >
          <div
            style={{ width: toRem(448), height: toRem(72), letterSpacing: 0.1 }}
          >
            The system will not save this profile if the Case Name has not been
            entered and saved by clicking the "check" icon. Do you wish to
            proceed?
          </div>
        </Dialog>
      </Grid>
    </div>
  );
};

export default Dialogs;
