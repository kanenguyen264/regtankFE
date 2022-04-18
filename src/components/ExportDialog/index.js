import Dialog from "@protego/sdk/RegtankUI/v1/Dialog/Dialog";
import { makeStyles } from "@mui/styles";
import { ProtegoContext } from "@protego/sdk/core/ProtegoProvider/ProtegoProvider";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import React, { useContext, useEffect, useState } from "react";
import CustomLoadingIndicator from "../CustomLoadingIndicator";
import LoaddingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";

const useStyles = makeStyles({
  loadingWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 0 0",
    fontSize: "22px",
  },
});

const useExportDialog = () => {
  const { addComponent, removeComponent } = useContext(ProtegoContext);

  return ({ onSuccess, init, title }) => {
    const ExportDialog = ({ resolve, reject }) => {
      const [open, setOpen] = useState(true);
      const [data, setData] = useState(null);
      const classes = useStyles();
      useEffect(() => {
        initAction();
      }, []);

      useEffect(() => {
        if (data) {
          success();
          onClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [data]);

      const initAction = async () => {
        try {
          const data = await init();
          setData(data);
        } catch (e) {}
      };

      const onClose = () => {
        setOpen(false);
        resolve();
      };

      const success = async () => {
        await onSuccess(data);
      };

      const removeDialog = () => {
        removeComponent({ key: "exportDialog" });
      };

      return (
        <Dialog
          open={open}
          onClose={onClose}
          onExited={removeDialog}
          title={
            title ? title : <IntlMessages id="appModule.exportPDF.title" />
          }
          disableDialogAction
          hideCloseIcon={true}
        >
          <div style={{ width: toRem(520), height: toRem(214) }}>
            <LoaddingWrapper loading={true} size={toRem(80)}>
              <div style={{ width: "inherit", height:"inherit" }}></div>
            </LoaddingWrapper>
          </div>
        </Dialog>
      );
    };

    return new Promise((resolve, reject) => {
      addComponent({
        component: <ExportDialog resolve={resolve} reject={reject} />,
        key: "exportDialog",
      });
    });
  };
};

export default useExportDialog;
