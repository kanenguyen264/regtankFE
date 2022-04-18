//@flow
import React from "react";
import { compose } from "recompose";
import type { KytRequestDto } from "../../../../types/typings";
import { useDispatch, useSelector } from "react-redux";
import { KYTAction_RequestItemTransactions } from "actions/KYTAction";
import { isEmpty } from "lodash";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper/LoadingWrapper";
import Moment from "react-moment";
import withPagination from "components/withPagination";
import styles from "../KYTScreenPage.module.scss";
import useStayScrolled from "components/useStayScrolled";
import type { WithPaginationInjectedProps } from "@protego/sdk/UI/withPagination";
import CustomTable from "@protego/sdk/UI/CustomTable/CustomTable";

type Props = {
  current: KytRequestDto,
} & WithPaginationInjectedProps;
const KYTScreenTransactions = compose(withPagination)(
  function KYTScreenTransactions(props: Props) {
    const { current, paginationParams } = props;
    const dispatch = useDispatch(),
      pageResultData = useSelector(
        (state) => state.kyt.transactions[current.id]
      ),
      [loading, setLoading] = React.useState(true),
      { setRef, stayScrolled, scrolledRef } = useStayScrolled();

    React.useEffect(() => {
      setLoading(true);
      dispatch(
        KYTAction_RequestItemTransactions({
          id: current.id,
          params: paginationParams,
        })
      ).then(() => setLoading(false));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginationParams]);

    React.useEffect(() => {
      stayScrolled();
    });

    return (
      <LoadingWrapper loading={loading}>
        <div ref={setRef}>
          {!isEmpty(pageResultData) && (
            <CustomTable
              //@ts-ignore
              lang={{
                rowsPerPage: <IntlMessages id={"appModule.table.footer"} />,
              }}
              className={styles.Table}
              columnData={
                /* inline */ {
                  updatedAt: {
                    label: "Date/Time",
                    sort: true,
                    enable: true,
                    renderCell: (v) => (
                      <Moment format={"DD MMM YYYY HH:mm"}>{v}</Moment>
                    ),
                  },
                  asset: { label: "Asset", sort: true, enable: true }, //not implemented in Schema yet
                  total: { label: "Total", sort: true, enable: true },
                  amount: { label: "Amount", sort: true, enable: true }, //mix between received+spent
                  txHash: {
                    label: "Transaction ID",
                    sort: true,
                    enable: true,
                    renderCell: (v) => <div className={styles.Ids}>{v}</div>,
                  },
                  receivedId: { label: "Received", sort: true, enable: true }, //n/a
                  sentId: { label: "Sent", sort: true, enable: true }, //n/a
                  entity: { label: "Entity", sort: true, enable: true }, //n/a
                  geo: { label: "GEO", sort: true, enable: true }, //n/a
                }
              }
              data={pageResultData}
              options={{ selectable: false }}
            />
          )}
        </div>
      </LoadingWrapper>
    );
  }
);

export default KYTScreenTransactions;
