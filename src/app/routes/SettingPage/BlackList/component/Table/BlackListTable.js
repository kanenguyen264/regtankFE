import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import CloseableDialogTitle from "@protego/sdk/RegtankUI/v1/CloseableDialogTitle/CloseableDialogTitle";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import { Switch } from "@protego/sdk/RegtankUI/v1/Switch";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable/index";
import { toRem } from "@protego/sdk/utils/measurements";
import {
  CHANGE_STATUS_BLACKLIST,
  REMOVE_BLACKLIST_BY_ID,
  UPDATE_CATEGORY_BLACKLIST,
} from "actions/Setting";
import ActivityTracker from "components/ActivityTracker";
import ChipCategory from "components/ChipCategory";
import CountryFlagLanguage from "components/CountryFlagLanguagev1";
import LongMenu from "components/menuNPaper/long/LongMenu";
import { TabbedListedContext } from "components/TabbedListedPagev1";
import { CHANGE_CATEGORY, MENU_OPTION_BACKLIST } from "constants/ActionTypes";
import React, { Fragment, memo, useContext, useState } from "react";
import { FormattedHTMLMessage, useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "util/date";
import { getGenderTranslate } from "util/gender";
import { getContentMessage } from "util/index";
import { snackActions } from "util/snackbarUtils";
import { getFullName } from "util/string";
import { withACL } from "../../../../../../acl";
import styles from "./styles.module.scss";
import ChangeCategoryDialog from "../ChangeCategoryDialog";
import clsx from "clsx";
import moduleStyles from "../../BlackListStyle.module.scss";

const BlackListTable = (props) => {
  const { formatMessage } = useIntl();
  const { data, ACL } = props;
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openChangeCategory, setOpenChangeCategory] = useState(false);
  const [openDialogSwitchActive, setOpenDialogSwitchActive] = useState(false);
  const { selected, setSelected } = useContext(TabbedListedContext);
  const [blackListItem, setBlackListItem] = useState();
  const dispatch = useDispatch();
  const { kycCategory } = useSelector((state) => state.settings);

  const handleToggleBlackList = (event, rowData) => {
    setBlackListItem(rowData);
    setOpenDialogSwitchActive(true);
  };

  const onSelectedOption = (option, val) => {
    setBlackListItem(val);
    if (option.key === CHANGE_CATEGORY) {
      /**
       * Change category
       */
      setOpenChangeCategory(true);
      return;
    }
    /**
     * Delete
     */
    setOpenDeleteDialog(true);
  };

  const onClose = () => {
    setOpenDeleteDialog(false);
  };
  const onPressDelete = () => {
    dispatch(REMOVE_BLACKLIST_BY_ID([blackListItem?.blacklistId])).then(() => {
      setOpenDeleteDialog(false);
    });
  };

  const onPressChangeSwitchActive = () => {
    dispatch(
      CHANGE_STATUS_BLACKLIST({
        blacklistIds: [blackListItem.blacklistId],
        status: !blackListItem.isActive,
      })
    ).then(() => {
      setOpenDialogSwitchActive(false);
    });
  };

  const onSubmitChangeCategory = (val) => {
    let dataSubmit = {
      categories: val?.map((item) => {
        return { id: item.id, fullName: blackListItem?.fullName };
      }),
    };

    dispatch(
      UPDATE_CATEGORY_BLACKLIST({
        blacklistId: blackListItem?.blacklistId,
        body: dataSubmit,
      })
    )
      .then((data) => {
        snackActions.success(<IntlMessages id={"notification.success"} />);
      })
      .catch((err) => {
        snackActions.error(getContentMessage(err));
      })
      .finally(() => {
        setOpenChangeCategory(false);
      });
  };

  const onCloseCategory = () => {
    setOpenChangeCategory(false);
  };
  const DialogDelete = (props) => {
    const { open, onClose } = props;
    return (
      <Dialog
        maxWidth={"xs"}
        open={open}
        onClose={onClose}
        className={moduleStyles.confirmDlg}
        disableBackdropClick
        disableEscapeKeyDown
      >
        <CloseableDialogTitle onClose={onClose}>
          <FormattedHTMLMessage
            id="setting.blacklist.option.delete.title"
            values={{
              name: blackListItem?.fullName,
            }}
          />
        </CloseableDialogTitle>
        <DialogContent className={styles.textAlignCenter}>
          <span>
            <FormattedHTMLMessage id="setting.blacklist.option.delete.content" />
          </span>
        </DialogContent>
        <DialogActions>
          <Button
            fullWidth
            variant="containedWhite"
            onClick={onClose}
            style={{ marginRight: toRem(16) }}
          >
            <IntlMessages id="appModule.requestForm.cancel" />
          </Button>
          <Button
            variant="contained"
            type="submit"
            fullWidth
            onClick={onPressDelete}
          >
            <IntlMessages id="Delete" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const DialogSwitchActive = (props) => {
    const { open, onClose } = props;
    return (
      <Dialog
        maxWidth={"xs"}
        open={open}
        onClose={onClose}
        disableBackdropClick
        disableEscapeKeyDown
        className={moduleStyles.confirmDlg}
      >
        <CloseableDialogTitle onClose={onClose}>
          <FormattedHTMLMessage
            id={
              blackListItem?.isActive
                ? "setting.blacklist.option.deActive"
                : "setting.blacklist.option.active"
            }
            values={{
              name: blackListItem?.fullName || "__",
            }}
          />
        </CloseableDialogTitle>
        <DialogContent>
          <span className={"d-flex align-items-center"}>
            <FormattedHTMLMessage id="setting.blacklist.option.switch.content" />
          </span>
        </DialogContent>
        <DialogActions>
          <Button
            fullWidth
            variant="containedWhite"
            onClick={onClose}
            style={{ marginRight: toRem(16) }}
          >
            <IntlMessages id="appModule.requestForm.cancel" />
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            onClick={onPressChangeSwitchActive}
          >
            {blackListItem?.isActive ? (
              <IntlMessages id="setting.blacklist.option.button.deActive" />
            ) : (
              <IntlMessages id="setting.blacklist.option.button.active" />
            )}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const CustomColl = (value) => {
    return (
      <div className={styles.collPadding}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <div className={"d-flex flex-column"}>
              <span className={styles.headerTxt}>
                <IntlMessages id={"setting.tab.weight.IssuingCountry"} />
              </span>
              <div className={styles.contentTxt}>
                <Nullable
                  component={CountryFlagLanguage}
                  displayCountryName
                  valueProp={"countryCode"}
                  svg
                >
                  {value?.idIssuingCountry}
                </Nullable>
              </div>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className={"d-flex flex-column"}>
              <span className={styles.headerTxt}>
                <IntlMessages id={"setting.blacklist.table.placeOfBirth"} />
              </span>
              <div className={styles.contentTxt}>
                <Nullable
                  component={CountryFlagLanguage}
                  displayCountryName
                  valueProp={"countryCode"}
                  svg
                >
                  {value?.placeOfBirth}
                </Nullable>
              </div>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className={"d-flex flex-column"}>
              <div className={"d-flex"}>
                <span className={styles.headerTxt}>
                  <IntlMessages id={"setting.blacklist.dialog.phone"} />
                </span>
              </div>
              <div className={styles.contentTxt}>
                <Nullable>{value?.phone}</Nullable>
              </div>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className={"d-flex flex-column "}>
              <span className={styles.headerTxt}>
                <IntlMessages id={"setting.blacklist.table.email"} />
              </span>
              <div className={styles.contentTxt}>
                <Nullable>{value?.email}</Nullable>
              </div>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div className={"d-flex flex-column "}>
              <span className={styles.headerTxt}>
                <IntlMessages id={"setting.blacklist.table.address"} />
              </span>
              <span className={styles.contentTxt}>
                <Nullable>{value?.address}</Nullable>
              </span>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={4}>
                <div className={"d-flex flex-column"}>
                  <span className={styles.headerTxt}>
                    <IntlMessages
                      id={"setting.blacklist.table.furtherInformation"}
                    />
                  </span>
                  <div className={styles.contentTxt}>
                    <Nullable>{value?.furtherInformation}</Nullable>
                  </div>
                </div>
              </Grid>
              {/* <Grid item xs={4}></Grid> */}
            </Grid>
          </Grid>
        </Grid>
        <div className={styles.aTrackerPadding}>
          <ActivityTracker
            style={{ marginTop: 0 }}
            lastModifiedAt={value?.updatedAt}
            lastModifiedBy={getFullName(value?.lastModifiedBy)}
            screenedBy={getFullName(value?.createdBy)}
            screenedAt={value?.createdAt}
            showIcon={false}
            divider={"|"}
          />
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      {openDeleteDialog && (
        <DialogDelete
          open={openDeleteDialog}
          onClose={onClose}
          data={blackListItem}
        />
      )}
      {openChangeCategory && (
        <ChangeCategoryDialog
          blackListItem={blackListItem}
          open={openChangeCategory}
          onClose={onCloseCategory}
          categoryList={kycCategory}
          onSubmitChange={onSubmitChangeCategory}
        />
      )}
      {openDialogSwitchActive && (
        <DialogSwitchActive
          open={openDialogSwitchActive}
          onClose={() => {
            setOpenDialogSwitchActive(false);
          }}
        />
      )}
      <div className={clsx(styles.tableWrap)}>
        <CustomTable
          lang={{
            rowsPerPage: <IntlMessages id={"appModule.table.footer"} />,
          }}
          labelDisplayedRows={({ from, to, count }) => {
            return `Showing ${from}–${to} of ${
              count !== -1 ? count : `more than ${to}`
            }  transactions`;
          }}
          options={{
            selectable: true,
            selections: selected,
            onSelected: setSelected,
            enableCollapsibleCell: true,
            renderCollapse: CustomColl,
            isFixedFirstColumn: true,
          }}
          columnData={{
            blacklistId: {
              sort: true,
              className: styles.Name,
              style: { wordBreak: "break-all", minWidth: toRem(110) },

              label: (
                <div className="d-flex align-items-center">
                  <IntlMessages id="setting.blacklist.table.blackListId" />
                </div>
              ),
              renderCell: (v) => (
                <div className={"flex-start"}>
                  <Nullable>{v}</Nullable>
                </div>
              ),
            },
            fullName: {
              sort: true,
              className: styles.Name,
              style: { wordBreak: "break-all" },
              label: (
                <div className="d-flex align-items-center">
                  <IntlMessages id="name" />
                </div>
              ),
              renderCell: (v) => (
                <div className={"flex-start"}>
                  <Nullable>{v}</Nullable>
                </div>
              ),
            },
            dateOfBirth: {
              sort: true,
              align: "left",
              label: <IntlMessages id="date-of-birth" />,
              renderCell: (v) => (
                <div className={"flex-start"}>
                  <Nullable>{formatDate(v)}</Nullable>
                </div>
              ),
            },
            nationality: {
              sort: true,
              className: styles.width115,
              label: <IntlMessages id="nationality" />,
              style: { textAlign: "center" },
              align: "center",
              renderCell: (v) => (
                <Nullable
                  component={CountryFlagLanguage}
                  valueProp={"countryCode"}
                  svg
                >
                  {v}
                </Nullable>
              ),
            },
            gender: {
              label: <IntlMessages id="setting.blacklist.table.gender" />,
              enable: true,
              sort: false,
              align: "left",
              renderCell: (v) => (
                <Nullable>
                  {v &&
                    formatMessage({
                      id: getGenderTranslate(v),
                    })}
                </Nullable>
              ),
            },
            countryOfResidence: {
              label: <IntlMessages id="setting.blacklist.table.country" />,
              enable: true,
              sort: true,
              style: { textAlign: "center" },
              align: "center",
              renderCell: (v) => {
                return (
                  <div>
                    <Nullable
                      component={CountryFlagLanguage}
                      valueProp={"countryCode"}
                      svg
                    >
                      {v}
                    </Nullable>
                  </div>
                );
              },
            },
            categories: {
              label: <IntlMessages id="setting.blacklist.table.category" />,
              enable: true,
              sort: false,
              align: "left",
              renderCell: (v) => (
                <div
                  className={clsx(
                    "d-flex flex-wrap align-items-center",
                    styles.categoriesChipWrap
                  )}
                >
                  <ChipCategory
                    className={styles.chipCategory}
                    keywords={v}
                    multiLanguage
                    limit={3}
                  ></ChipCategory>
                </div>
              ),
            },
            isActive: ACL.isAllowedPermissions("SETTING_BLACKLIST_EDIT") ? (
              {
                label: <IntlMessages id="setting.blacklist.table.active" />,
                enable: true,
                sort: false,
                align: "left",
                width: toRem(120),
                renderCell: (v, rowData) => (
                  <div>
                    <Switch
                      onClick={(event) => handleToggleBlackList(event, rowData)}
                      checked={v}
                    />
                  </div>
                ),
              }
            ) : (
              <></>
            ),
            action:
              ACL &&
              !ACL.isAllowedPermissions("SETTING_BLACKLIST_DELETE") &&
              !ACL.isAllowedPermissions("SETTING_BLACKLIST_EDIT") ? (
                <></>
              ) : (
                {
                  label: <IntlMessages id="setting.blacklist.table.action" />,
                  enable: false,
                  sort: false,
                  align: "left",
                  width: toRem(100),
                  renderCell: (v, rowData) => (
                    <div onClick={(e) => e.stopPropagation()}>
                      <LongMenu
                        className={styles.menuPopover}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        data={MENU_OPTION_BACKLIST.slice(
                          1,
                          ACL &&
                            ACL.isAllowedPermissions(
                              "SETTING_BLACKLIST_DELETE"
                            ) &&
                            2
                        ).concat(
                          MENU_OPTION_BACKLIST.slice(
                            0,
                            ACL &&
                              ACL.isAllowedPermissions(
                                "SETTING_BLACKLIST_EDIT"
                              ) &&
                              1
                          )
                        )}
                        id={rowData}
                        onSelected={onSelectedOption}
                      />
                    </div>
                  ),
                }
              ),
          }}
          data={data}
        />
      </div>
    </Fragment>
  );
};

export default withACL(memo(BlackListTable));
