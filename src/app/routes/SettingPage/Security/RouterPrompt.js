import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import clsx from "clsx";
import { makeStyles } from "@mui/styles";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import { DialogContent, DialogActions } from "@mui/material";
import { Button } from "@mui/material";

const useStyles = makeStyles({
  dialog: {
    "& .MuiPaper-root": {
      width: toRem(424),
    },
  },
  content: {
    color: "#2b2b2b",
    paddingTop: toRem(40),
  },
  button: {
    width: "calc(50% - 8px)",
  },
});

export function RouterPrompt({
  when,
  onOK,
  onCancel,
  title = <IntlMessages id="appModule.discard-changes" />,
  content = <IntlMessages id="appModule.unsaved-msg" />,
  cancelTxt = <IntlMessages id="appModule.go-back" />,
  okTxt = <IntlMessages id="appModule.discard" />,
}) {
  const classes = useStyles();
  const history = useHistory();
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    if (when) {
      history.block((prompt) => {
        setCurrentPath(prompt.pathname + prompt.search);
        setShowPrompt(true);
        return false;
      });
    } else {
      history.block(() => {});
    }

    return () => {
      history.block(() => {});
    };
  }, [history, when]);

  const handleOK = useCallback(async () => {
    if (onOK) {
      const canRoute = await Promise.resolve(onOK());
      if (canRoute) {
        history.block(() => {});
        setShowPrompt(false);
        history.push(currentPath);
      }
    }
  }, [currentPath, history, onOK]);

  const handleCancel = useCallback(async () => {
    if (onCancel) {
      const canRoute = await Promise.resolve(onCancel());
      if (canRoute) {
        history.block(() => {});
        history.push(currentPath);
      }
    }
    setShowPrompt(false);
  }, [currentPath, history, onCancel]);

  return (
    <Dialog
      open={showPrompt}
      title={title}
      okProps={{ onClick: handleOK, text: okTxt }}
      cancelProps={{ text: cancelTxt, onClick: handleCancel }}
    >
      <div style={{width: toRem(424)}}>{content}</div>
    </Dialog>
  )
}
