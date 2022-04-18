//@flow
import { Grid, Link as MuiLink, MenuItem } from "@material-ui/core";
import { Button } from "@protego/sdk/RegtankUI/v1/Button";
import { makeStyles } from "@material-ui/core/styles";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import IntlMessages from "@protego/sdk/UI/IntlMessages";
import JRCard from "@protego/sdk/RegtankUI/v1/JRCard";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import Select from "@protego/sdk/UI/Select/Select";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import {
  KYTAction_RequestItemTransactions,
  KYTAction_RequestItem_FetchTransactions,
  KYTAction_RequestItem_GetRisk,
  KYTAction_RequestItem_GetRiskBulk,
  KYTAction_RequestItem_SeeMore,
} from "actions/KYTAction";
import { ReactComponent as ArrowRight } from "assets/icons/ArrowRight.svg";
import RiskRatingLabel from "components/RiskRatingLabelv1";
import WalletAddressText from "components/WalletAddressTextv1";
import { isEmpty } from "lodash";
import { snackActions } from "util/snackbarUtils";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { compose } from "recompose";
import { formatCoinValue } from "util/currency";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { getContentMessage } from "util/index";
import styles from "./../KYTScreenPage.module.scss";
import { displayLimitText } from "util/string";
import Dropdown from "@protego/sdk/RegtankUI/v1/Dropdown/Dropdown";
import DropdownItem from "@protego/sdk/RegtankUI/v1/DropdownItem/index";
import { Typography } from "@mui/material";
import clsx from "clsx";
const paging = [50, 100, 200, 500];
const useStyles = makeStyles({
  transaction: {
    "& tbody tr td": {
      verticalAlign: "top",
      padding: `${toRem(15)} ${toRem(8)}`,
    },
  },
  addressLink: {
    color: "#0080FF",
    "&:visited": {
      color: "#3F51B5",
    },
  },
  actionButtonWrapper: {
    margin: "30px 20px 20px",
  },
  textTransactionsTable: {
    fontSize: toRem(12),
    color: "#95A1AC",
  },

  fetchArea: {
    wordSpacing: "1rem",
    textAlign: "right",
  },
  fetchSelect: {
    // lineHeight: 1.7,
    width: toRem(100),
    heigh: "10px   !important",
    textAlign: "initial",
  },
});

const SeeMoreHOC = ({
  id,
  data,
  limit = 2,
  render,
  seeMore = false,
  expanded = false,
  onSeeMore,
}) => {
  const classes = useStyles();
  return (
    <div>
      {(expanded ? data : data.slice(0, limit)).map((item, index) => {
        return <div key={index}>{render(item)}</div>;
      })}
      {seeMore && data.length > limit && !expanded ? (
        <MuiLink
          component="button"
          onClick={() => {
            onSeeMore(id);
          }}
          style={{ verticalAlign: "baseline" }}
        >
          <IntlMessages id="see-more" /> <ArrowRight />
        </MuiLink>
      ) : null}
    </div>
  );
};

const TransactionList = compose(withPagination)(function TransactionList(
  props
) {
  const classes = useStyles();
  const { current, paginationParams } = props;
  const [selected, setSelected] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const transactions = useSelector(
    (state) => state.kyt.transactions[current.kytId] || {}
  );
  const [fetchAmount, setFetchAmount] = React.useState(50);
  const [enableRiskCheck, setEnableRiskCheck] = React.useState(false);
  const kytId = current?.kytId;

  React.useEffect(() => {
    getTxList();
    // eslint-disable-next-line
  }, [paginationParams, kytId]);

  React.useEffect(() => {
    if (selected.length) {
      setEnableRiskCheck(true);
    } else {
      setEnableRiskCheck(false);
    }
  }, [selected]);

  const getTxList = () => {
    setLoading(true);
    dispatch(
      KYTAction_RequestItemTransactions({
        id: current.kytId,
        params: paginationParams,
      })
    )
      .then(() => setLoading(false))
      .catch((err) => {
        snackActions.error(getContentMessage(err));
        setLoading(false);
      });
  };

  const fetchMoreTx = () => {
    setLoading(true);
    dispatch(
      KYTAction_RequestItem_FetchTransactions({
        id: current.kytId,
        params: {
          more: fetchAmount,
        },
      })
    )
      .then(() => {
        getTxList();
        setSelected([]);
      })
      .catch((err) => {
        setLoading(false);
        snackActions.error(getContentMessage(err));
      });
  };

  const showRiskScore = (item, txId) => {
    setLoading(true);
    dispatch(
      KYTAction_RequestItem_GetRisk({
        kytId: current.kytId,
        id: item.id,
        txId,
      })
    )
      .catch((err) => {
        setLoading(false);
        snackActions.error(getContentMessage(err));
      })
      .finally(() => {
        setLoading(false);
        setSelected([]);
      });
  };

  const getRiskScoreBulk = () => {
    if (selected.length) {
      setLoading(true);
      const ids = selected.map((item) => item.id);
      dispatch(KYTAction_RequestItem_GetRiskBulk({ kytId: current.kytId, ids }))
        .catch((err) => {
          snackActions.error(getContentMessage(err));
        })
        .finally(() => {
          setSelected([]);
          setLoading(false);
        });
    }
  };

  const onSeeMore = (id) => {
    dispatch(
      KYTAction_RequestItem_SeeMore({
        kytId: current.kytId,
        txId: id,
      })
    );
  };

  const showWallet = (item) => {
    return (
      <div className={styles.lineHeight}>
        {item.address === current.address ||
        (current.asset === "ETH" &&
          item.address.toLowerCase() === current.address.toLowerCase()) ? (
          <WalletAddressText
            width={250}
            text={item?.address}
            limitText={item && displayLimitText(item?.address, 10)}
          />
        ) : isEmpty(item?.address) ? (
          "-"
        ) : (
          <WalletAddressText
            // href={`/app/kyt/kyt-screen?address=${item?.address}&asset=${current.asset}`}
            //target="_blank"
            width={250}
            text={item?.address}
            //   linkStyle={classes.addressLink}
            limitText={item && displayLimitText(item?.address, 10)}
          />
        )}
      </div>
    );
  };

  const showCheck = (item, txId) => {
    return (
      <>
        {item && item.risk ? (
          <div className={styles.ratingTop}>
            {" "}
            <RiskRatingLabel
              size="tooSmall"
              level={item.risk.riskLevel}
              value={item?.risk?.risk}
            />
          </div>
        ) : (
          item &&
          item.address &&
          (item.address === current.address ||
          (current.asset === "ETH" &&
            item.address.toLowerCase() === current.address.toLowerCase()) ||
          isEmpty(item.address) ? (
            <div className={styles.ratingTop}>
              <RiskRatingLabel
                size="tooSmall"
                level={current?.addressDetails?.risk?.riskLevel}
                value={current?.addressDetails?.risk?.risk}
              />
            </div>
          ) : (
            <div className={styles.lineHeight}>
              <Button
                className={styles.checkButton}
                size="small"
                variant="outlinedSecondary"
                onClick={() => showRiskScore(item, txId)}
              >
                <IntlMessages id="check" />
              </Button>
            </div>
          ))
        )}
      </>
    );
  };

  const showAmount = (item) => {
    return `${formatCoinValue(item.amount)} ${item.asset}`;
  };

  return (
    <>
      <JRCard headerLine className={classes.transaction} fullBody>
        <div style={{ position: "relative", minHeight: "50px" }}>
          <LoadingWrapper loading={loading}>
            <>
              {transactions && (
                <>
                  <div className={classes.actionButtonWrapper}>
                    <Grid container>
                      <Grid item xs={4}>
                        <Button
                          size="small"
                          variant={"contained"}
                          color="primary"
                          type={"submit"}
                          disabled={!enableRiskCheck}
                          onClick={getRiskScoreBulk}
                        >
                          <IntlMessages id={"kyt.transaction.checkRiskScore"} />
                        </Button>
                      </Grid>
                      <Grid item xs={8} className={classes.fetchArea}>
                        <span className={classes.textTransactionsTable}>
                          <IntlMessages id={"fetch"} />
                        </span>{" "}
                        <span>
                          <Dropdown
                            //   className="mr-3"
                            name="newScoreRiskLevel"
                            size="medium"
                            label={
                              <Typography variant="body1">
                                {fetchAmount}
                              </Typography>
                            }
                            variant="outlinedDropdown"
                            className={clsx("", styles.dropdownButton)}
                          >
                            {paging.map((item) => (
                              <DropdownItem
                                onClick={() => {
                                  setFetchAmount(item);
                                }}
                                style={{
                                  margin: 0,
                                }}
                              >
                                <Typography>{item}</Typography>
                              </DropdownItem>
                            ))}
                          </Dropdown>{" "}
                        </span>
                        <span className={classes.textTransactionsTable}>
                          <IntlMessages id={"kyt.transactions"} />
                        </span>{" "}
                        <Button
                          size="small"
                          variant={"contained"}
                          color={"primary"}
                          type={"submit"}
                          className={styles.submitButton}
                          onClick={fetchMoreTx}
                        >
                          <IntlMessages id={"submit"} />
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                  <CustomTable
                    lang={{
                      rowsPerPage: (
                        <IntlMessages id={"appModule.table.footer"} />
                      ),
                    }}
                    options={{
                      pagination: true,
                      selectable: true,
                      selections: selected,
                      onSelected: setSelected,
                    }}
                    columnData={{
                      timestamp: {
                        sort: true,
                        label: <IntlMessages id="kyt.transaction.dateTime" />,
                        style: { width: toRem(120) },
                        renderCell: (v) => formatDate(v, LONG_DATE_TIME),
                      },
                      txHash: {
                        align: "center",
                        label: (
                          <IntlMessages id="kyt.transaction.transactionId" />
                        ),
                        style: { width: toRem(130) },
                        renderCell: (v) => {
                          return (
                            <WalletAddressText
                              width={130}
                              text={v}
                              limitText={v && displayLimitText(v, 6)}
                            />
                          );
                        },
                      },
                      senders: {
                        align: "center",
                        label: <IntlMessages id="kyt.transaction.sender" />,
                        style: { width: toRem(200) },
                        renderCell: (v, { id, shownMore }) => (
                          <SeeMoreHOC
                            id={id}
                            seeMore={true}
                            expanded={shownMore}
                            data={v}
                            render={showWallet}
                            onSeeMore={onSeeMore}
                          />
                        ),
                      },
                      "senders.risk": {
                        label: <IntlMessages id="kyt.transaction.riskScore" />,
                        style: {
                          minWidth: toRem(100),
                        },
                        align: "center",
                        renderCell: (v, { senders, id, shownMore }) => (
                          <SeeMoreHOC
                            id={id}
                            expanded={shownMore}
                            data={senders}
                            render={(item) => showCheck(item, id)}
                            onSeeMore={onSeeMore}
                          />
                        ),
                      },
                      "senders.amount": {
                        align: "center",
                        sort: false,
                        label: <IntlMessages id="kyt.transaction.amount" />,
                        renderCell: (v, { senders, id, shownMore }) => (
                          <SeeMoreHOC
                            id={id}
                            expanded={shownMore}
                            data={senders}
                            render={showAmount}
                            onSeeMore={onSeeMore}
                          />
                        ),
                      },
                      recipients: {
                        align: "center",
                        label: <IntlMessages id="kyt.transaction.recipient" />,
                        style: {
                          width: toRem(200),
                        },
                        renderCell: (v, { id, shownMore }) => (
                          <SeeMoreHOC
                            id={id}
                            seeMore={true}
                            expanded={shownMore}
                            data={v}
                            render={showWallet}
                            onSeeMore={onSeeMore}
                          />
                        ),
                      },
                      "recipients.risk": {
                        label: <IntlMessages id="kyt.transaction.riskScore" />,
                        style: {
                          width: toRem(100),
                        },
                        align: "center",
                        renderCell: (v, { recipients, id, shownMore }) => (
                          <SeeMoreHOC
                            id={id}
                            expanded={shownMore}
                            data={recipients}
                            render={(item) => showCheck(item, id)}
                            onSeeMore={onSeeMore}
                          />
                        ),
                      },
                      "recipients.amount": {
                        align: "center",
                        sort: false,
                        label: <IntlMessages id="kyt.transaction.amount" />,
                        renderCell: (v, { recipients, id, shownMore }) => (
                          <SeeMoreHOC
                            id={id}
                            expanded={shownMore}
                            data={recipients}
                            render={showAmount}
                            onSeeMore={onSeeMore}
                          />
                        ),
                      },
                    }}
                    data={transactions}
                  />
                </>
              )}
            </>
          </LoadingWrapper>
        </div>
      </JRCard>
    </>
  );
});

export default TransactionList;
