import Dialog from "@material-ui/core/Dialog";
import MuiDialogContent from "@material-ui/core/DialogContent";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
import "./style.scss";

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

export default function CustomizedDialogs(props) {
  const { open } = props;

  return (
    <div className="dialogCredit">
      {/* onClose={handleClose} */}
      <Dialog aria-labelledby="customized-dialog-title" open={open}>
        <DialogContent dividers>
          <div className="dialogContent">
            <div className="iconSuccess">
              <center>
                <img
                  width="80"
                  height="80"
                  className="avatar"
                  src={require("assets/images/success.png")}
                  alt="avatar"
                />
              </center>
            </div>
            <h3>
              Congratulations! You have successfully purchased this package.
            </h3>
            <p>
              We will now process your order. A confirmation email will be sent
              to your registered email address.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
