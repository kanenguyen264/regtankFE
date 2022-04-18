//@flow
import { AnyAction, createReducer } from "@reduxjs/toolkit";
import {
  KYTAction_GetAssets,
  KYTAction_RequestItem,
  // KYTAction_RequestItem,
  KYTAction_RequestItemTransactions,
  KYTAction_RequestItem_GetRisk,
  KYTAction_RequestItem_GetRiskBulk,
  KYTAction_RequestItem_SeeMore,
  KYTAction_SEARCH_WATCHLIST,
  KYT_ACTION_ADD_TO_WATCHLIST,
  KYT_ACTION_ASSIGN_KYC_REQUEST,
  KYT_ACTION_GET_KYT_WATCHLIST,
  KYT_ACTION_REQUEST_INPUT,
  KYT_ACTION_REQUEST_LIST,
  KYT_ACTION_SEARCH,
  KYT_ACTION_WATCH_GROUP_SEARCH,
  KYT_ACTION_RENAME_GROUP,
  KYT_ACTION_REMOVE_WATCH_GROUP,
  KYT_ACTION_CREATE_NEW_GROUP,
  KYT_ACTION_GET_WATCH_GROUP,
  KYT_ACTION_EDIT_RISK_SCORE,
  KYT_CHANGE_LOG,
  KYT_ONGOING_MONITORING,
  KYT_UPDATE_CASE,
  KYT_ACTION_GET_KYT_REQUESTS_BY_FILTER,
  KYT_ACTION_GET_FILTER_OWNER,
  KYT_CLEAN_LIST,
  KYT_ACTION_WATCH_GROUP_CLEAN,
} from "actions/KYTAction";
import { get, isEmpty } from "lodash";
// import NoteAdapterCreator from "../services/NoteAdapterCreator";
import { KYTArchiveAdapter, KYTNoteAdapter } from "../services/KYTService";
import type { KYTReducerState } from "../types/typings";
// import reduceReducers from "reduce-reducers";

const initialState: KYTReducerState = {
  status: null,
  list: {},
  archiveList: [],
  current: {},
  assets: null,
  favorites: [],
  transactions: {},
  notes: {},
  watchList: [],
  assignee: {},
  loading: false,
  watchGroup: [],
  watchGroupSearch: [],
  listChangeLog: [],
  listOwner: []
};
const regExp = new RegExp(
    "^(" +
      [
        "request-list",
        "watch-list",
        "archive",
        "alert/subscription",
        "bulk-assign"
      ]
        .map((s) => `kyt/${s}`)
        .join("|") +
      ")"
  ),
  resolveRegExp = /\/(success|error)$/;
function isLoadableAction(action: AnyAction): boolean {
  return regExp.test(action.type);
}

const addressIsValid = (address, currentAddress, asset) => {
  if (
    address &&
    (address === currentAddress ||
      (asset === "ETH" &&
        address.toLowerCase() === currentAddress.toLowerCase()) ||
      isEmpty(address))
  ) {
    return true;
  }
  return false;
};

const getNewTransactionWithCurrentRiskCore = (
  currentKyt,
  transactions,
  newRiskScore = null
) => {
  return {
    ...transactions,
    records: [
      ...transactions?.records?.map((item) => {
        // current risk core
        let risk = {
          risk: newRiskScore?.newScore || currentKyt.addressDetails?.risk?.risk,
          riskLevel:
            newRiskScore?.newScoreRiskLevel ||
            currentKyt.addressDetails?.risk?.riskLevel
        };

        // check address senders
        let senders = item?.senders?.map((sender) => {
          if (sender.risk === null || newRiskScore) {
            if (
              addressIsValid(
                sender.address,
                currentKyt.address,
                currentKyt.asset
              )
            ) {
              return { ...sender, risk };
            }
          }
          return sender;
        });

        // check address recipients
        let recipients = item?.recipients?.map((recipient) => {
          if (recipient.risk === null || newRiskScore) {
            if (
              addressIsValid(
                recipient.address,
                currentKyt.address,
                currentKyt.asset
              )
            ) {
              return { ...recipient, risk };
            }
          }

          return recipient;
        });
        return { ...item, senders, recipients };
      })
    ]
  };
};

const KYTReducer =
  // main reducer
  createReducer(initialState, (builder) => {
    builder
      .addCase(KYT_ACTION_ADD_TO_WATCHLIST, (state, { payload }) => {})
      .addCase(KYT_ACTION_REQUEST_LIST.success, (state, { payload }) => {
        state.list = payload;
        state.assignee = {};
      })
      .addCase(KYT_ACTION_SEARCH.success, (state, { payload }) => {
        state.list = payload;
        state.assignee = {};
      })
      .addCase(KYTAction_SEARCH_WATCHLIST.success, (state, { payload }) => {
        state.watchList = payload;
      })
      .addCase(KYTAction_GetAssets.success, (state, { payload }) => {
        state.assets = payload;
        state.assignee = {};
      })
      .addCase(KYT_ACTION_REQUEST_INPUT.success, (state, { payload }) => {
        state.current = payload;
        state.assignee = {};
      })
      .addCase(KYT_ACTION_GET_KYT_WATCHLIST.success, (state, { payload }) => {
        state.watchList = payload;
      })
      .addCase(
        KYTAction_RequestItemTransactions.success,
        (state, { payload: { id, ...pageResult } }) => {
          if (state.current?.kytId) {
            state.transactions[id] = getNewTransactionWithCurrentRiskCore(
              state.current,
              pageResult
            );
          } else {
            state.transactions[id] = pageResult;
          }
        }
      )
      .addCase(KYT_ACTION_ASSIGN_KYC_REQUEST.success, (state, { payload }) => {
        state.assignee = payload.user;
      })
      .addCase(KYTAction_RequestItem.success, (state, { payload }) => {
        state.current = payload;
      })
      .addCase(KYT_CHANGE_LOG.success, (state, { payload }) => {
        state.listChangeLog = payload;
      })
      .addCase(KYT_ONGOING_MONITORING.success, (state, { payload }) => {
        state.current = payload?.[0].kytRequestDto;
      })
      .addCase(KYT_UPDATE_CASE.success, (state, { payload }) => {
        state.archiveList = payload;
      })
      .addCase(
        KYTAction_RequestItem_GetRisk.success,
        (state, { payload: { id, kytId, txId, ...rest } }) => {
          let allTxs = get(state, `transactions.${kytId}.records`);
          let tx = null;
          for (let i = 0; i < allTxs.length; i++) {
            if (allTxs[i].id === txId) {
              tx = allTxs[i];
              break;
            }
          }
          if (tx) {
            for (
              let i = 0;
              i < tx.senders.length || i < tx.recipients.length;
              i++
            ) {
              if (tx.senders[i] && tx.senders[i].id === id) {
                tx.senders[i] = { id, ...rest };
              }
              if (tx.recipients[i] && tx.recipients[i].id === id) {
                tx.recipients[i] = { id, ...rest };
              }
            }
          }
        }
      )
      .addCase(
        KYTAction_RequestItem_SeeMore,
        (state, { payload: { txId, kytId } }) => {
          let allTxs = get(state, `transactions.${kytId}.records`);
          let tx = null;
          for (let i = 0; i < allTxs.length; i++) {
            if (allTxs[i].id === txId) {
              tx = allTxs[i];
              break;
            }
          }
          if (tx) {
            tx.shownMore = true;
          }
        }
      )
      .addCase(
        KYTAction_RequestItem_GetRiskBulk.success,
        (state, { payload: { kytId, changes } }) => {
          let allTxs = get(state, `transactions.${kytId}.records`);
          let affected = 0;
          for (let tx of allTxs) {
            for (let changeTx of changes) {
              if (changeTx.id === tx.id) {
                if (tx.isReceive) {
                  tx.senders = Object.assign(tx.senders, changeTx.senders);
                } else {
                  tx.recipients = Object.assign(
                    tx.recipients,
                    changeTx.recipients
                  );
                }
                affected++;
                break;
              }
            }

            if (affected === changes.length) {
              break;
            }
          }
        }
      )
      .addCase(KYT_ACTION_EDIT_RISK_SCORE.success, (state, { payload }) => {
        //@ts-ignore
        let newRiskScore = payload.data;
        if (state.current?.kytId) {
          let kytId = state.current.kytId;
          if (state?.transactions?.[kytId]?.records) {
            state.transactions[kytId] = getNewTransactionWithCurrentRiskCore(
              state.current,
              state.transactions[kytId],
              newRiskScore
            );
          }
        }
      })
      .addCase(KYT_ACTION_GET_WATCH_GROUP.success, (state, { payload }) => {
        //@ts-ignore
        state.watchGroup = payload;
      })
      .addCase(KYT_ACTION_WATCH_GROUP_SEARCH.success, (state, { payload }) => {
        //@ts-ignore
        state.watchGroupSearch = payload;
      })
      .addCase(KYT_ACTION_WATCH_GROUP_CLEAN, (state) => {
        //@ts-ignore
        state.watchGroupSearch = [];
      })
      .addCase(KYT_ACTION_RENAME_GROUP.success, (state, { payload }) => {
        //@ts-ignore
      })
      .addCase(KYT_ACTION_REMOVE_WATCH_GROUP.success, (state, { payload }) => {
        //@ts-ignore
      })
      .addCase(KYT_ACTION_CREATE_NEW_GROUP.success, (state, { payload }) => {
        //@ts-ignore
        state.watchGroup = payload;
      })
      .addCase(KYT_ACTION_GET_FILTER_OWNER.success, (state, { payload }) => {
        //@ts-ignore
        state.listOwner = payload;
      })
      .addCase(
        KYT_ACTION_GET_KYT_REQUESTS_BY_FILTER.success,
        (state, { payload }) => {
          // if (payload && payload.total_records > 0) {
          //   payload.records = convertStatusPendingOfKYC(payload.records);
          // }
          state.list = payload;
        }
      )
      .addCase(KYT_CLEAN_LIST, (state) => {
        //@ts-ignore
        state.list = [];
      })
      .addMatcher(isLoadableAction, (state, { type }) => {
        state.loading = !resolveRegExp.test(type);
      })
      .addDefaultCase((state, action) => {
        switch (action.type) {
        }
      });
  }) |>
  // augment with note reducer
  KYTNoteAdapter.withNoteReducer
  |> KYTArchiveAdapter.withArchiveReducer;

export default KYTReducer;
