import { Grid, Typography } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import Dialog from "@protego/sdk/RegtankUI/v1/Dialog";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import withPagination, {
  withEnhancedPagination,
} from "@protego/sdk/RegtankUI/v1/withPagination";
import clsx from "clsx";
import { RENAME } from "constants/ActionGroupList";
import React from "react";
import { useIntl } from "react-intl";
import { compose } from "redux";

const AddNewGroup = withEnhancedPagination({ key: "addNewGroup" })(
  ({
    data,
    isOpen,
    onClose,
    risk,
    paginationParams,
    group,
    typeAction,
    onPressCreateGroup,
    onPressRenameGroup,
  }) => {
    const { formatMessage } = useIntl();
    const [groupName, setGroupName] = React.useState("");

    React.useEffect(() => {
      if (typeAction?.type === RENAME) {
        setGroupName(typeAction?.value?.name);
        return;
      }
      setGroupName("");
    }, [typeAction]);

    /**
     * Create group
     */
    const onPressSubmit = () => {
      var body = { name: groupName };
      if (typeAction?.type === RENAME) {
        body = { id: typeAction?.value?.id, name: groupName };
        onPressRenameGroup(body);
        return;
      }
      onPressCreateGroup(body);
    };

    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        title={{
          text: (
            <Typography variant="titleForm">
              {typeAction?.type === RENAME ? (
                <IntlMessages id={"kyc.add.new.group.rename"} />
              ) : (
                <IntlMessages id={"kyc.add.new.group"} />
              )}
            </Typography>
          ),
        }}
        allowCloseOnTitle
        actionsCustom={
          <div className="justify-content-center d-flex ">
            <Button onClick={onClose} variant="outlinedSecondary">
              <IntlMessages id="appModule.requestForm.cancel" />
            </Button>
            <Button
              variant="contained"
              className={clsx("ml-3")}
              type="submit"
              onClick={() => {
                onPressSubmit();
              }}
              disabled={groupName ? false : true}
            >
              <IntlMessages id="kyc.add.new.group.action.create" />
            </Button>
          </div>
        }
      >
        <div className="mt-2">
          <Grid container>
            <Grid item xs={12}>
              <div className={"d-flex "}>
                <Typography variant="smallDefault">
                  <IntlMessages id={"kyc.add.new.group.name"} />
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className={"mt-2"}>
                <TextField
                  variant="outlined"
                  fullWidth
                  inputProps={{ maxLength: 30 }}
                  value={groupName}
                  onChange={(e) => setGroupName(e?.target?.value)}
                  placeholder={formatMessage({
                    id: "dialog.input.type.name",
                  })}
                />
              </div>
              <div className="d-flex  justify-content-end mt-1">
                {groupName?.length > 0 && (
                  <Typography variant="smallDefault">
                    {groupName?.length}
                    {"/30"} <IntlMessages id={"kyc.add.new.group.characters"} />
                  </Typography>
                )}
              </div>
            </Grid>
          </Grid>
        </div>
      </Dialog>
    );
  }
);

export default compose(withPagination)(AddNewGroup);
