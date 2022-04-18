import { PageResult } from "@protego/sdk/types";
import { AnyAction, createReducer } from "@reduxjs/toolkit";
import {
  CASE_ACTION_CREATE_NEW_GROUP,
  CASE_ACTION_GET_CASES,
  CASE_ACTION_GET_CASES_WATCHLIST,
  CASE_ACTION_GET_CASE_BY_CASEID,
  CASE_ACTION_GET_LIST_ARCHIVE,
  /**
   * GroupList
   */
  CASE_ACTION_GET_WATCH_GROUP,
  CASE_ACTION_REMOVE_WATCH_GROUP,
  CASE_ACTION_RENAME_GROUP,
  CASE_ACTION_SEARCH,
  CASE_ACTION_SEARCH_CASES_WATCHLIST,
  CASE_ACTION_WATCH_GROUP_SEARCH
} from "actions/CaseAction";
import { KYC_ACTION_RE_SCREENING_CASE_DETAILS } from "actions/KYCAction";
import { KYC_STATUS } from "constants/KycStatus";
import { compose } from "redux";
import { CaseArchiveAdapter, CaseNoteAdapter } from "services/CaseService";
import { CaseDetailsDto, CaseListingDto, CaseManagementDetailDto } from "types/typings-api";

export interface ICaseReducerState extends INoteState {
  archiveList: PageResult<CaseListingDto>;
  current: CaseDetailsDto;
  list: PageResult<CaseListingDto>;
  loading: boolean;
  watchGroup: any;
  watchGroupSearch: any;
  watchlist: PageResult<CaseListingDto>;
}

const initialState: ICaseReducerState = {
  archiveList: {
    records: [],
    total_pages: 0,
    total_records: 0
  },
  notes: {},
  current: null,
  list: {
    records: [],
    total_pages: 0,
    total_records: 0
  },
  watchGroup: [],
  watchGroupSearch: [],
  watchlist: {
    records: [],
    total_pages: 0,
    total_records: 0
  },
  loading: false
};

const regExp = new RegExp(
    "^(" +
      ["get-cases", "get-case-by-caseid"].map((s) => `case/${s}`).join("|") +
      ")"
  ),
  resolveRegExp = /\/(success|error)$/;
function isLoadableAction(action: AnyAction): boolean {
  return regExp.test(action.type);
}

const convertListStatusPendingOfKYC = (list) => {
  return list.map((item) => {
    if (item.latestKyc && item.latestKyc.status === KYC_STATUS.PENDING) {
      if (item.latestKyc.positiveMatch != null) {
        item.latestKyc.status = KYC_STATUS.POSITIVE_MATCH;
      } else {
        item.latestKyc.status = KYC_STATUS.NO_MATCH;
      }
    }
    return item;
  });
};

const CaseReducer =
  /**
   * You can replace this below line by your own familiar reducer
   * (like state,action=>{switch...})
   */
  compose(
    CaseNoteAdapter.withNoteReducer,
    CaseArchiveAdapter.withArchiveReducer
  )(
    createReducer(initialState, (builder) => {
      builder
        .addCase(CASE_ACTION_GET_CASES.success, (state, { payload }) => {
          // In My KYC page, add two more statuses called "No Match" and "Positive Match".
          if (payload && payload.total_records > 0) {
            payload.records = convertListStatusPendingOfKYC(payload.records);
          }
          state.list = payload;
        })
        .addCase(
          CASE_ACTION_GET_CASES_WATCHLIST.success,
          (state, { payload }) => {
            // In My KYC page, add two more statuses called "No Match" and "Positive Match".
            if (payload && payload.total_records > 0) {
              payload.records = convertListStatusPendingOfKYC(payload.records);
            }
            state.watchlist = payload;
          }
        )
        .addCase(CASE_ACTION_SEARCH.success, (state, { payload }) => {
          // In My KYC page, add two more statuses called "No Match" and "Positive Match".
          if (payload && payload.total_records > 0) {
            payload.records = convertListStatusPendingOfKYC(payload.records);
          }
          state.list = payload;
        })
        .addCase(
          CASE_ACTION_SEARCH_CASES_WATCHLIST.success,
          (state, { payload }) => {
            // In My KYC page, add two more statuses called "No Match" and "Positive Match".
            if (payload && payload.total_records > 0) {
              payload.records = convertListStatusPendingOfKYC(payload.records);
            }
            state.watchlist = payload;
          }
        )
        .addCase(
          CASE_ACTION_GET_CASE_BY_CASEID.success,
          (state, { payload }) => {
            // In My KYC page, add two more statuses called "No Match" and "Positive Match".
            if (
              payload &&
              payload.latestKyc &&
              payload.latestKyc.status === KYC_STATUS.PENDING
            ) {
              if (payload.latestKyc.positiveMatch != null) {
                payload.latestKyc.status = KYC_STATUS.POSITIVE_MATCH;
              } else {
                payload.latestKyc.status = KYC_STATUS.NO_MATCH;
              }
            }

            if (payload.kycList && payload.kycList.length > 0) {
              payload.kycList.map((item) => {
                if (item.status === KYC_STATUS.PENDING) {
                  if (item.positiveMatch != null) {
                    item.status = KYC_STATUS.POSITIVE_MATCH;
                  } else {
                    item.status = KYC_STATUS.NO_MATCH;
                  }
                }
                return item;
              });
            }
            state.current = payload;
          }
        )
        .addCase(CASE_ACTION_GET_LIST_ARCHIVE.success, (state, { payload }) => {
          // In My KYC page, add two more statuses called "No Match" and "Positive Match".
          if (payload && payload.total_records > 0) {
            payload.records = convertListStatusPendingOfKYC(payload.records);
          }
          state.archiveList = payload;
        })
        .addCase(
          KYC_ACTION_RE_SCREENING_CASE_DETAILS.success,
          (state, { payload }) => {
            const { action } = payload as any;
            state.current.latestKyc.enableReScreening = action;
          }
        )
        .addCase(CASE_ACTION_GET_WATCH_GROUP.success, (state, { payload }) => {
          //@ts-ignore
          state.watchGroup = payload;
        })
        .addCase(
          CASE_ACTION_WATCH_GROUP_SEARCH.success,
          (state, { payload }) => {
            // In My KYC page, add two more statuses called "No Match" and "Positive Match".
            if (payload && payload.total_records > 0) {
              payload.records = convertListStatusPendingOfKYC(payload.records);
            }
            //@ts-ignore
            state.watchGroupSearch = payload;
          }
        )
        .addCase(CASE_ACTION_RENAME_GROUP.success, (state, { payload }) => {
          //@ts-ignore
        })
        .addCase(
          CASE_ACTION_REMOVE_WATCH_GROUP.success,
          (state, { payload }) => {
            //@ts-ignore
          }
        )
        .addCase(CASE_ACTION_CREATE_NEW_GROUP.success, (state, { payload }) => {
          //@ts-ignore
          state.watchGroup = payload;
        })
        .addMatcher(isLoadableAction, (state, { type }) => {
          state.loading = !resolveRegExp.test(type);
        });
    })
  );

export default CaseReducer;
