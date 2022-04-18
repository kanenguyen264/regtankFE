import {
  useSnackbar,
  OptionsObject,
  WithSnackbarProps,
  SnackbarKey
} from "notistack";
import React from "react";
import { randomString } from "util/string";

const InnerSnackbarUtilsConfigurator = (props) => {
  props.setUseSnackbarRef(useSnackbar());
  return null;
};

let useSnackbarRef: WithSnackbarProps;
const setUseSnackbarRef = (useSnackbarRefProp) => {
  useSnackbarRef = useSnackbarRefProp;
};

export const SnackbarUtilsConfigurator: React.FC = () => {
  return (
    <InnerSnackbarUtilsConfigurator setUseSnackbarRef={setUseSnackbarRef} />
  );
};

const defaultOptions = {
  key: randomString(10),
  variant: "error",
  autoHideDuration: 3000,
  preventDuplicate: true,
  anchorOrigin: {
    vertical: "top",
    horizontal: "right"
  },
};

export const snackActions = {
  success(
    msg: string | React.ReactNode,
    options: OptionsObject = {}
  ): SnackbarKey {
    return this.toast(msg, { ...options, variant: "success" });
  },
  warning(
    msg: string | React.ReactNode,
    options: OptionsObject = {}
  ): SnackbarKey {
    return this.toast(msg, { ...options, variant: "warning" });
  },
  info(
    msg: string | React.ReactNode,
    options: OptionsObject = {}
  ): SnackbarKey {
    return this.toast(msg, { ...options, variant: "info" });
  },
  error(
    msg: string | React.ReactNode,
    options: OptionsObject = {}
  ): SnackbarKey {
    return this.toast(msg, { ...options, variant: "error" });
  },
  toast(
    msg: string | React.ReactNode,
    options: OptionsObject = {}
  ): SnackbarKey {
    return useSnackbarRef.enqueueSnackbar(msg, {
      ...defaultOptions,
      ...options
    });
  }
};