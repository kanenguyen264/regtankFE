import IntlMessages from "@protego/sdk/UI/IntlMessages";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  DialogActions,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useIntl } from "react-intl";
import TextField from "@material-ui/core/TextField";
import styles from "../../Liveness.module.scss";
import clsx from "clsx";

const RejectDialog = ({ onCancel, onYes }) => {
  const { formatMessage } = useIntl();
  const [remark, setRemark] = React.useState(null);

  const handleRemarkChange = (e) => {
    setRemark(e.target.value);
  };

  const handleReject = () => {
    onYes(remark);
  };

  return (
    <Dialog open={true}>
      <DialogTitle>
        <span>
          <IntlMessages id="liveness.rejectTitle" />
        </span>
      </DialogTitle>
      <DialogContent className={styles.container}>
        <div>
          <DialogContentText
            align="center"
            style={{
              marginBottom: "25px",
            }}
          >
            <TextField
              id="outlined-multiline-static"
              label={formatMessage({ id: "liveness.form.remark" })}
              multiline
              rows={4}
              fullWidth
              onChange={handleRemarkChange}
              defaultValue=""
              variant="outlined"
            />
          </DialogContentText>

          <DialogActions
            disableSpacing
            className={clsx("d-flex justify-content-start")}
          >
            <Button
              className={styles.btn}
              onClick={handleReject}
              variant="contained"
              color="primary"
              disabled={!remark}
              fullWidth
            >
              <IntlMessages id="liveness.status.rejected" />
            </Button>
            <Button
              className={[styles.btn, "ml-3"]}
              fullWidth
              onClick={onCancel}
              variant="outlined"
              color="primary"
            >
              <IntlMessages id="cancel" />
            </Button>
          </DialogActions>

          {/* <center className={"d-flex"}>
            <Button
              className={styles.btn}
              onClick={handleReject}
              variant="contained"
              color="primary"
              disabled={!remark}
              fullWidth
            >
              <IntlMessages id="liveness.status.rejected" />
            </Button>
            <Button
              className={[styles.btn, "ml-3"]}
              fullWidth
              onClick={onCancel}
              variant="outlined"
              color="primary"
            >
              <IntlMessages id="cancel" />
            </Button>
          </center> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RejectDialog;
