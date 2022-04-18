//@flow
import MenuItem from "@mui/material/MenuItem";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import Select from "@protego/sdk/RegtankUI/v1/Select";
import { KYTAction_GetAssets } from "actions/KYTAction";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "recompose";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import { useIntl } from "react-intl";
import SelectAutoComplete from "@protego/sdk/RegtankUI/v1/SelectAutoComplete";
import { Field, Form, Formik } from "formik";
import Box from "@mui/material/Box";
import IconBCH from "assets/icons/coin/iconBCH.svg";
import IconBNB from "assets/icons/coin/iconBNB.svg";
import IconBTC from "assets/icons/coin/iconBTC.svg";
import IconERC20 from "assets/icons/coin/iconERC20.svg";
import IconLTC from "assets/icons/coin/iconLTC.svg";
import styles from "./../KYTScreenPage.module.scss";
import Icon from "@mui/material/Icon";
import { Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InputAdornment from "@mui/material/InputAdornment";

function renderIconCoin(value) {
  switch (value) {
    case "BTC":
      return <img src={IconBTC} />;
    case "ETH":
      return <img src={IconERC20} />;
    case "BNB":
      return <img src={IconBNB} />;
    case "BCH":
      return <img src={IconBCH} />;
    case "LTC":
      return <img src={IconLTC} />;
    default:
      break;
  }
}
const KYTAssets = compose()(function KYTAssets(props) {
  const intl = useIntl();
  const [loaded, setLoaded] = React.useState(false),
    assets = useSelector((state) => state.kyt.assets),
    dispatch = useDispatch();
  React.useEffect(() => {
    setLoaded(assets !== null && Array.isArray(assets));
  }, [assets]);
  React.useEffect(() => {
    if (!loaded) dispatch(KYTAction_GetAssets());
  }, [dispatch, loaded]);

  const renderIcontext = (value) => {
    switch (value) {
      case "ETH":
        return "ERC20";
      default:
        return value;
    }
  };
  return (
    <LoadingWrapper loading={!loaded}>
      <div>
        <Field
          id="asset"
          name="asset"
          {...props}
          formik
          placeholder={intl.formatMessage({
            id: "kyt.SelectAsset",
          })}
          label={intl.formatMessage({
            id: "kyt.Asset",
          })}
          component={SelectAutoComplete}
          renderOption={(props, option) => {
            return (
              <Box component="li" {...props}>
                <div className={styles.assetOption}>
                  <span className="mr-2"> {renderIconCoin(option)}</span>
                  {renderIcontext(option)}
                </div>
              </Box>
            );
          }}
          options={assets || ""}
          getOptionLabel={(option) => (option ? renderIcontext(option) : "")}
          disableClearable
          clearOnBlur
          textFieldProps={{ error: props?.errors?.asset ? true : false }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {renderIconCoin(props.values?.asset)}
              </InputAdornment>
            ),
          }}
        />
        {props?.errors?.asset && (
          <Typography
            component={"div"}
            color="#d44333"
            variant="small1"
            style={{ marginTop: 6 }}
          >
            <IntlMessages id={props?.errors?.asset?.props?.id} />
          </Typography>
        )}
      </div>
    </LoadingWrapper>
  );
});

export default KYTAssets;
