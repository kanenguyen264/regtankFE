//@flow
import { Grid, Typography } from "@mui/material";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import FormControl from "@material-ui/core/FormControl";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import TextField from "@protego/sdk/RegtankUI/v1/TextField";
import { generatePath } from "@protego/sdk/utils/router";
import { KYT_ACTION_REQUEST_INPUT } from "actions/KYTAction";
import clsx from "clsx";
import CreditDeductionModelConfirm from "components/CreditDeductionModelConfirm";
import SwitchButton from "components/SwitchButton";
import { KYT_ROUTE_SCREEN } from "constants/routes";
import { Form, Formik } from "formik";
import { cloneDeep, pick } from "lodash";
import React, { useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { compose } from "recompose";
import { StringParam, withDefault, withQueryParams } from "use-query-params";
import withUserSettings from "util/hocs/withUserSettings";
import { getContentMessage } from "util/index";
import { snackActions } from "util/snackbarUtils";
import * as Yup from "yup";
import KYTAssets from "../KYTAssets";
import styles from "../KYTScreenPage.module.scss";
import { BTC } from "constants/KYTOM";
import { withACL } from "../../../../acl";
import { ReactComponent as QuestionMarkIcon } from "assets/icons/questionMark.svg";
import { FormattedHTMLMessage } from "react-intl";
import Tooltip from "@protego/sdk/RegtankUI/v1/Tooltip";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils"

const KYTSearchBox = compose(
  withACL,
  (Component) =>
    withQueryParams(
      {
        address: withDefault(StringParam, ""),
        asset: withDefault(StringParam, ""),
      },
      Component
    ),
  withUserSettings
)(
  React.forwardRef(function KYTSearchBox(
    { current, query: { address, asset }, heightOM, ACL },
    ref
  ) {
    const [loading, setLoading] = React.useState(false);
    const [openConfirmModel, setOpenConfirmModel] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch<AsyncDispatch>();
    const intl = useIntl();
    const $address = React.useRef();

    const formikKytSearchFormRef = useRef();

    const [enableBTC, setEnableBTC] = React.useState(false);
    const generalSettings = useSelector(({ settings }) => {
      const { generalSettings } = settings;
      return generalSettings;
    });

    const ValidationSchema = React.useMemo(() => {
      const addressErr = (
        <IntlMessages id="please-enter-a-valid-wallet-address" />
      );
      return Yup.object().shape({
        address: Yup.string()
          .min(2, addressErr)
          .required(addressErr)
          .matches(/^[^\s]+$/, () => {
            return <IntlMessages id="must-not-have-whitespace-character" />;
          }),
        asset: Yup.string()
          .min(3, <IntlMessages id="please-choose-an-asset-type" />)
          .required(<IntlMessages id="please-choose-an-asset-type" />),
        referenceId: Yup.string()
          .max(
            40,
            <IntlMessages id="appModule.from.referenceIdIsOnly40Characters" />
          )
          .matches(/^[a-zA-Z0-9.@_-]+$/g, {
            message: (
              <IntlMessages id="kyt.referenceIdExcludeSpecialCharacter" />
            ),
            excludeEmptyString: true,
          }),
      });
      // eslint-disable-next-line
    }, [intl]);

    const onSubmitData = async (payload) => {
      if (generalSettings.kytSearchConfirmation) {
        setOpenConfirmModel(true);
      } else {
        doSubmit();
      }
    };

    const doSubmit = async () => {
      setOpenConfirmModel(false);
      let values = formikKytSearchFormRef.current.values;
      let data = cloneDeep(values);

      setLoading(true);
      try {
        const { kytId } = await dispatch(KYT_ACTION_REQUEST_INPUT(data));
        formikKytSearchFormRef.current.resetForm();
        history.replace(
          generatePath(KYT_ROUTE_SCREEN, { id: kytId }, { source: "current" })
        );
      } catch (e) {
        snackActions.error(
          getContentMessage(e, <IntlMessages id="kyt.error" />)
        );
      } finally {
        setLoading(false);
      }
    };

    const onCloseConfirmModel = () => {
      setOpenConfirmModel(false);
    };

    const getNumberCreditDeduce = () => {
      if (formikKytSearchFormRef.current) {
        const {
          enableNewRiskMonitoring,
          enableNewTransactionMonitoring,
        } = formikKytSearchFormRef.current.values;
        const { kytOmCost, kytCost } = generalSettings;
        if (enableNewRiskMonitoring || enableNewTransactionMonitoring) {
          return kytCost + kytOmCost;
        }
        return kytCost;
      }
    };

    return (
      <>
        <CreditDeductionModelConfirm
          open={openConfirmModel}
          onPressSubmit={doSubmit}
          onPress={onCloseConfirmModel}
          searchType={"KYT"}
          creditsDeducted={getNumberCreditDeduce()}
          disableButton={loading}
        />
        <Formik
          initialValues={Object.assign(
            {
              address: "",
              asset: "",
              referenceId: "",
              enableNewRiskMonitoring: current ? true : false,
              enableNewTransactionMonitoring: current ? true : false,
            },
            pick({ address, asset }, "address", "asset")
          )}
          validationSchema={ValidationSchema}
          enableReinitialize
          onSubmit={onSubmitData}
          innerRef={formikKytSearchFormRef}
          validate={({ asset }) => {
            if (asset === BTC) {
              setEnableBTC(true);
              return;
            }
            setEnableBTC(false);
          }}
        >
          {({ submitForm, setFieldValue, values, errors }) => {
            return (
              <LoadingWrapper loading={loading}>
                <Form className={styles.searchWalletFormWrapper}>
                  <JRCard
                    style={{ height: heightOM }}
                    header={
                      <Typography className={styles.title}>
                        <IntlMessages id="search-wallet-address" />
                      </Typography>
                    }
                    ref={ref}
                    headerLine
                  >
                    <Grid container wrap="nowrap" direction={"column"}>
                      <Grid item>
                        <div className={styles.SearchForm}>
                          <TextField
                            ref={$address}
                            formik
                            name={"address"}
                            size={"large"}
                            placeholder={intl.formatMessage({
                              id: "kyt.typeWalletAddresshere",
                            })}
                            label={intl.formatMessage({
                              id: "wallet-address",
                            })}
                          />
                          <KYTAssets
                            formik
                            name={"asset"}
                            size={"large"}
                            errors={errors}
                            values={values}
                          />
                          <TextField
                            size={"large"}
                            formik
                            name={"referenceId"}
                            inputProps={{
                              maxLength: 40,
                            }}
                            placeholder={intl.formatMessage({
                              id: "kyt.TypeReferenceIDhere",
                            })}
                            label={intl.formatMessage({
                              id: "kyt.referenceID",
                            })}
                          />
                          <FormControl>
                            <Button
                              variant={"contained"}
                              color="primary"
                              className={styles.Submit}
                              type={"button"}
                              onClick={submitForm}
                              disabled={
                                ACL &&
                                !ACL.isAllowedPermissions("KYT_MODULE_VIEW")
                              }
                            >
                              <IntlMessages id="submit" />
                            </Button>
                          </FormControl>
                        </div>
                      </Grid>
                      {enableBTC && current === null && (
                        <div className={"mt-3"}>
                          {/* <Divider /> */}
                          <Grid item style={{marginTop: toRem(35)}}>
                            <div className={"d-flex"} style={{marginBottom: toRem(12)}}>
                              <div className={clsx(styles.titleCard)}>
                                <Typography className={styles.titleMonitoring}>
                                  <IntlMessages id="kyt.transactions.ongoing" />
                                </Typography>
                              </div>
                            </div>
                            <div className={"d-flex"}>
                              <SwitchButton
                                formik
                                className={styles.boxSwitches}
                                name={
                                  <div>
                                    <span className={styles.titleSwitches}>
                                      <IntlMessages
                                        id={"kyt.transactions.new"}
                                      />
                                    </span>
                                    <span className="ml-1">
                                      <Tooltip
                                        arrow
                                        placement="top-start"
                                        title={
                                          <div className="custom-tooltip">
                                            <h5>
                                              <IntlMessages id="kyt.transactions.new" />
                                            </h5>
                                            <p>
                                              <FormattedHTMLMessage id="kyt.transactions.new.tooltip" />
                                            </p>
                                          </div>
                                        }
                                      >
                                        <QuestionMarkIcon />
                                      </Tooltip>
                                    </span>
                                  </div>
                                }
                                onChange={(value) => {
                                  setFieldValue(
                                    "enableNewTransactionMonitoring",
                                    value?.target?.checked
                                  );
                                }}
                                checked={values?.enableNewTransactionMonitoring}
                                labelPlacement={"end"}
                              />
                              <SwitchButton
                                className={clsx(styles.boxSwitches, "ml-5")}
                                checked={values?.enableNewRiskMonitoring}
                                labelPlacement={"end"}
                                onChange={(value) => {
                                  setFieldValue(
                                    "enableNewRiskMonitoring",
                                    value?.target?.checked
                                  );
                                }}
                                name={
                                  <div>
                                    <span>
                                      <IntlMessages
                                        id={"kyt.transactions.risk.score"}
                                      />
                                    </span>
                                    <span className="ml-1">
                                      <Tooltip
                                        arrow
                                        placement="top-start"
                                        title={
                                          <div className="custom-tooltip">
                                            <h5>
                                              <IntlMessages id="kyt.transactions.risk.score" />
                                            </h5>
                                            <p>
                                              <FormattedHTMLMessage id="kyt.transactions.risk.score.tooltip" />
                                            </p>
                                          </div>
                                        }
                                      >
                                        <QuestionMarkIcon />
                                      </Tooltip>
                                    </span>
                                  </div>
                                }
                              />
                            </div>
                          </Grid>
                        </div>
                      )}
                    </Grid>
                  </JRCard>
                </Form>
              </LoadingWrapper>
            );
          }}
        </Formik>
      </>
    );
  })
);

export default KYTSearchBox;
