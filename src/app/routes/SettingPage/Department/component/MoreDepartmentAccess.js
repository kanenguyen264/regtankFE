import React, { useState } from "react";
import { DialogContent, Grid, Chip } from "@mui/material";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog/Dialog";
import { useIntl } from "react-intl";
import styles from "./../Department.module.scss";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import CloseableDialogTitle from "@protego/sdk/UI/CloseableDialogTitle/CloseableDialogTitle";
import Tag from "components/Tag";
import { ReactComponent as IconViewDetail } from "assets/icons/icon_viewDetail.svg";
import { withStyles } from "@material-ui/core/styles";
import { toRem } from "@protego/sdk/utils/measurements";
import {
  BR_COLOR_CHIP,
  COLOR_CHIP,
  BR_COLOR_CHIP_DISABLE,
  COLOR_CHIP_DISABLE,
} from "constants/ThemeColors";
import { Typography } from "@mui/material";

const MoreDepartmentAccess = (props) => {
  const { data, total } = props;
  const StyleChip = withStyles({
    root: {
      backgroundColor: data?.locked ? BR_COLOR_CHIP_DISABLE : BR_COLOR_CHIP,
      color: data?.locked ? COLOR_CHIP_DISABLE : COLOR_CHIP,
      maxWidth: "100%",
      fontSize: toRem(14),
      marginBottom: toRem(2),
    },
  })(Chip);
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const moreDepartmentAccess = () => {
    setOpen(!open);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onPressClose = () => {
    onClose();
  };
  return (
    <>
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        fullWidth
        maxWidth={"sm"}
        aria-labelledby="form-dialog-title"
        title={{
          text: <Typography variant="titleForm">{data?.name}</Typography>,
        }}
        onClose={onPressClose}
        allowCloseOnTitle={true}
        disableDialogAction
      >
        {/* <CloseableDialogTitle onClose={onPressClose}>
          {data?.name}
        </CloseableDialogTitle> */}

        <div className={styles.container}>
          <Grid container spacing={0} className="mt-3">
            <Grid item xs={12}>
              <TextField
                disabled
                fullWidth
                name={"departmentName"}
                variant={"outlined"}
                placeholder={intl.formatMessage({
                  id: "setting.add.accessTo",
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <div className="mt-3">
                {data.departmentAccesses.map((item, index) => {
                  return (
                    <span key={index}>
                      <StyleChip
                        key={1}
                        className={styles.paddingChip}
                        size={"medium"}
                        label={<>{item.name}</>}
                      />
                    </span>
                  );
                })}
              </div>
            </Grid>
          </Grid>
        </div>
      </Dialog>
      <span onClick={moreDepartmentAccess} style={{ cursor: "pointer" }}>
        <Tag
          color="#0080FF"
          brColor="rgba(0, 128, 255, 0.08)"
          hideTooltip={true}
          size={"small"}
          multiLanguage
          name={
            <span>
              <IconViewDetail /> +{total - 3}
            </span>
          }
        />
      </span>
    </>
  );
};

export default MoreDepartmentAccess;
