import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
import DialogSuccess from "./dialogSuccess";
import { updateSetBillingTop } from "actions";
import React from "react";
import { useDispatch } from "react-redux";
import { formatCredit } from "util/currency";
import "./style.scss";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
const CardsCredit = (props) => {
  const { creditBundle } = props;
  const dispatch = useDispatch();
  const [typeOpen, setTypeOpen] = React.useState(false);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [idByNow, setIdByNow] = React.useState();
  const handleClickOpen = () => {
    setTypeOpen(true);
  };
  const handleClose = () => {
    setTypeOpen(false);
  };
  const handleClickByNow = (id) => {
    dispatch(updateSetBillingTop(id));
    handleClickOpen();
    setTimeout(() => {
      handleClose();
    }, 3000);
  };
  const handleClickBy = (id) => {
    setOpenConfirm(true);
    setIdByNow(id);
  };
  const onConfirmYes = () => {
    handleClickByNow(idByNow);
    setOpenConfirm(false);
  };
  return (
    <div>
      <div className="cardPricing text-center ">
        <div className="card cardMain cardMain" style={{ width: "18rem" }}>
          <div class="card-header headerCard ">
            <div className="bodyHeaderPage">
              <h1>
                <IntlMessages id="credit.top-up" />
              </h1>
            </div>
          </div>
          <div className="card-body ">
            <div className="body-content">
              <span className="total-credit">
                {formatCredit(creditBundle?.creditAmount)}
              </span>
              <span className="credit-link">
                <IntlMessages id="credit.credits" />
              </span>
              <hr className="hrBody" />
              <span className="price">
                USD {formatCredit(creditBundle?.price)}{" "}
              </span>
            </div>
          </div>
          <div class="card-footer ">
            <Button
              onClick={() => handleClickBy(creditBundle?.id)}
              size="small"
              variant="contained"
              color="primary"
            >
              <span style={{ textTransform: "uppercase" }}>
                <IntlMessages id="credit.buyNow" />
              </span>
            </Button>
          </div>
        </div>
      </div>
      <DialogSuccess open={typeOpen} />
      <Dialog open={openConfirm}>
        <DialogTitle style={{ background: "#3F51B5" }}>
          <span style={{ color: "white" }}>
            <IntlMessages id="confirm" />
          </span>
        </DialogTitle>
        <DialogContent>
          <div style={{ margin: "20px 0px" }}>
            <DialogContentText>
              <center>
                <IntlMessages id="credit.confirmTopUp" />
              </center>
            </DialogContentText>
            <center>
              <Button
                style={{ width: "150px", marginRight: "10px" }}
                onClick={onConfirmYes}
                variant="contained"
                size="small"
                color="primary"
              >
                <IntlMessages id="yes" />
              </Button>
              <Button
                style={{ width: "150px", marginRight: "10px" }}
                onClick={() => {
                  setOpenConfirm(false);
                }}
                variant="outlined"
                size="small"
                color="primary"
              >
                <IntlMessages id="appModule.requestForm.cancel" />
              </Button>
            </center>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CardsCredit;
