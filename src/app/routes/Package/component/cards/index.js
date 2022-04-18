import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
// import Button from "@material-ui/core/Button";
import "./style.scss";
import { formatCredit } from "util/currency";
import { packageUpgrade } from "actions";
import { useDispatch } from "react-redux";
import DialogSuccess from "./dialogSuccess";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
export default function RecipeReviewCard(props) {
  const dispatch = useDispatch();
  const { data, type } = props;
  const [typeOpen, setTypeOpen] = React.useState(false);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [idByNow, setIdByNow] = React.useState();

  // MONTHLY  QUARTERLY BIANNUAL ANNUAL
  const handleClickOpen = () => {
    setTypeOpen(true);
  };

  const handleClose = () => {
    setTypeOpen(false);
  };

  const showPricePackage = () => {
    switch (type) {
      case "MONTHLY":
        return data.monthly?.price;
      case "QUARTERLY":
        return data.quarterly?.price;
      case "BIANNUAL":
        return data.biAnnual?.price;
      case "ANNUAL":
        return data.annual?.price;
      default:
        break;
    }
  };

  const showCreditPackage = () => {
    switch (type) {
      case "MONTHLY":
        return data.monthly?.credits;
      case "QUARTERLY":
        return data.quarterly?.credits;
      case "BIANNUAL":
        return data.biAnnual?.credits;
      case "ANNUAL":
        return data.annual?.credits;
      default:
        break;
    }
  };

  const handleClickBy = (id) => {
    setOpenConfirm(true);
    setIdByNow(id);
  };
  const onConfirmYes = () => {
    handleClickByNow(idByNow);
    setOpenConfirm(false);
  };
  const handleClickByNow = (id) => {
    dispatch(packageUpgrade({ id: id, type: type }));
    handleClickOpen();
    setTimeout(() => {
      handleClose();
    }, 3000);
  };

  return (
    <div className="cardPricingPackage text-center ">
      <div className="card cardMain cardMain" style={{ width: "18rem" }}>
        <div class="card-header headerCard ">
          <div className="bodyHeaderPage">
            <h1>
              {showPricePackage() === 0
                ? "Free"
                : `${formatCredit(showPricePackage())}`}{" "}
            </h1>
            <h3 className="lablePackage">{data.name}</h3>
            {data.isCurrent === true ? (
              <span class="badge button-card">Current</span>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="card-body ">
          <div style={{ minHeight: "45px" }}>
            <p className="card-text">{data.description}</p>
          </div>

          <div className="pagekageDiv">
            <span className="spanPagekage">
              {formatCredit(data.kycCost)}{" "}
              <IntlMessages id="package.creditKYCQuery" />
            </span>
            <span className="spanPagekage">
              {formatCredit(data.kytCost)}{" "}
              <IntlMessages id="package.creditKYTQuery" />
            </span>
            <span className="spanPagekage">
              {formatCredit(showCreditPackage())}{" "}
              <IntlMessages id="package.Credit" />
            </span>
          </div>
        </div>
        <div class="card-footer ">
          {data.isCurrent === true && data.usedPackagePeriod === type ? (
            <Button disabled size="small" variant="contained" color="primary">
              <IntlMessages id="credit.buyNow" />
            </Button>
          ) : (
            <Button
              onClick={() => handleClickBy(data?.id)}
              size="small"
              variant="contained"
              color="primary"
            >
              <IntlMessages id="credit.buyNow" />
            </Button>
          )}
        </div>
      </div>
      <DialogSuccess open={typeOpen} />
      <Dialog open={openConfirm}>
        <DialogTitle style={{ background: "#3F51B5" }}>
          <span style={{ color: "white" }}>Confirmation</span>
        </DialogTitle>
        <DialogContent>
          <div style={{ margin: "20px 0px" }}>
            <DialogContentText>
              <center>
                Change your subscription to {data ? data.name : ""} Package?
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
                Yes
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
                Cancel
              </Button>
            </center>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
