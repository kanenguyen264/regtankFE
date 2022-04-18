//@flow
import { createReducer } from "@reduxjs/toolkit";
import {
  DJ_ACTION_ASSIGN_KYC_REQUEST,
  DJ_ACTION_BLACKLIST_MATCH_CHANGE_STATUS,
  DJ_ACTION_BLACKLIST_MATCH_DETAIL,
  DJ_ACTION_CHANGE_MATCH_STATUS,
  DJ_ACTION_CREATE_NEW_GROUP,
  DJ_ACTION_GET_KYC_INDIVIDUAL_REQUEST,
  DJ_ACTION_GET_KYC_MATCH,
  DJ_ACTION_GET_KYC_REQUEST,
  DJ_ACTION_GET_KYC_REQUESTS,
  DJ_ACTION_GET_KYC_REQUESTS_BY_FILTER,
  DJ_ACTION_GET_KYC_SCORING,
  DJ_ACTION_GET_KYC_WATCHLIST,
  DJ_ACTION_GET_WATCH_GROUP,
  DJ_ACTION_KYC_TOGGLE_OM,
  DJ_ACTION_RE_SCREENING_MY_KYC,
  DJ_ACTION_RE_SCREENING_MY_KYC_DETAILS,
  DJ_ACTION_SEARCH_WATCHLIST,
  DJ_ACTION_WATCH_GROUP_SEARCH,
  DJ_KYC_ACTION_GET_KYC_BLACKLIST_REQUEST,
  DJ_KYC_ACTION_GET_KYC_MATCH_REQUEST,
  DJ_KYC_ACTION_GET_MATCHES_FILTER_LIST,
} from "actions/DJAction";
import { KYC_STATUS } from "constants/KycStatus";
import { filter } from "lodash";
import { compose } from "redux";
import {
  DJKYCArchiveAdapter,
  DJNoteAdapter,
  DJNoteMatchAdapter,
  DJNoteScoringAdapter,
} from "services/DJService";
const initialState = {
  list: [],
  loading: false,
  currentScreeningRequest: null,
  currentMatchesFilterList: null,
  currentScreeningBlackLists: null,
  currentScreeningMatches: null,
  currentMatchDetail: null,
  notes: {},
  matchNotes: {},
  scoringNotes: {},
  riskScoring: null,
  watchGroup: [],
  watchList: [],
  watchGroupSearch: [],
  archiveList: [],
};

const convertStatusPendingOfKYC = (list) => {
  return list.map((item) => {
    if (item.status === KYC_STATUS.PENDING) {
      if (item.positiveMatch != null) {
        item.status = "POSITIVE_MATCH";
      } else {
        item.status = "NO_MATCH";
      }
    }
    return item;
  });
};

const regExp = new RegExp(
    "^(" +
      [
        "individual/get-all",
        "individual/request",
        "status",
        "individual/user-input",
        "individual/change-match-status",
        "individual/filter",
        "individual/bulk-assign",
        "individual/get-kyc-match",
        "individual/get-kyc-scoring",
        "edit-kyc-scoring",
        "toggle-om",
        "bulk-toggle-om",
        "individual/request/status",
        "individual/watch-list",
        "individual/get-kyc-requests",
        "individual/remove-watch-list",
        "change-match-status",
        "get-kyc-match",
        "update_re_screening_my_kyc",
        "blacklist/match/change-match-status",
      ]
        .map((s) => `djkyc/${s}`)
        .join("|") +
      ")"
  ),
  resolveRegExp = /\/(success|error)$/;

function isLoadableAction(action) {
  return regExp.test(action.type);
}

const DJReducer = compose(
  DJNoteAdapter.withNoteReducer,
  DJNoteMatchAdapter.withNoteReducer,
  DJNoteScoringAdapter.withNoteReducer,
  DJKYCArchiveAdapter.withArchiveReducer
)(
  createReducer(initialState, (builder) => {
    builder
      .addCase(
        DJ_ACTION_BLACKLIST_MATCH_DETAIL.success,
        (state, { payload }) => {
          //@ts-ignore
          state.blacklistMatchDetail = payload;
        }
      )
      .addCase(
        DJ_ACTION_BLACKLIST_MATCH_CHANGE_STATUS.success,
        (state, { payload }) => {
          function resolveMatch(blacklistId) {
            //@ts-ignore
            const match = state.currentScreeningBlackLists.records?.find(
              //@ts-ignore
              (m) => m?.kycBlacklist?.blacklistId === blacklistId
            );
            if (match) match.status = payload.status;
            if (payload && payload.status === "POSITIVE") {
              filter(
                //@ts-ignore
                state.currentScreeningBlackLists.records,
                function (o) {
                  if (
                    o?.kycBlacklist.blacklistId !== blacklistId &&
                    o.status === "POSITIVE"
                  ) {
                    o.status = "FALSE";
                  }
                  return o;
                }
              );
            }
          }

          if (state.currentScreeningRequest?.id) {
            state.currentScreeningRequest = {
              ...state.currentScreeningRequest,
              blacklistUnresolved: payload.data?.unresolved,
            };
          }

          if (!Array.isArray(payload.blacklistId)) {
            resolveMatch(payload.blacklistId);
          } else payload.blacklistId.forEach(resolveMatch);
        }
      )
      .addCase(DJ_ACTION_WATCH_GROUP_SEARCH.success, (state, { payload }) => {
        if (payload && payload.total_records > 0) {
          payload.records = convertStatusPendingOfKYC(payload.records);
        }
        //@ts-ignore
        state.watchGroupSearch = payload;
      })
      .addCase(DJ_ACTION_CREATE_NEW_GROUP.success, (state, { payload }) => {
        //@ts-ignore
        state.watchGroup = payload;
      })
      .addCase(DJ_ACTION_GET_KYC_WATCHLIST.success, (state, { payload }) => {
        if (payload && payload.total_records > 0) {
          payload.records = convertStatusPendingOfKYC(payload.records);
        }
        //@ts-ignore
        state.watchList = payload;
      })
      .addCase(DJ_ACTION_SEARCH_WATCHLIST.success, (state, { payload }) => {
        if (payload && payload.total_records > 0) {
          payload.records = convertStatusPendingOfKYC(payload.records);
        }
        state.watchList = payload;
      })
      .addCase(DJ_ACTION_GET_WATCH_GROUP.success, (state, { payload }) => {
        state.watchGroup = payload;
      })
      .addCase(DJ_ACTION_GET_KYC_REQUEST.success, (state, { payload }) => {
        if (payload && payload.total_records > 0) {
          payload.records = convertStatusPendingOfKYC(payload.records);
        }
        state.list = payload;
      })
      .addCase(DJ_ACTION_GET_KYC_REQUESTS.success, (state, { payload }) => {
        if (payload && payload.total_records > 0) {
          payload.records = convertStatusPendingOfKYC(payload.records);
        }
        state.list = payload;
      })
      .addCase(
        DJ_ACTION_GET_KYC_INDIVIDUAL_REQUEST.success,
        (state, { payload }) => {
          state.currentScreeningRequest = payload;
        }
      )
      .addCase(DJ_ACTION_ASSIGN_KYC_REQUEST.success, (state, { payload }) => {
        state.currentScreeningRequest.assignee = payload.user;
      })
      .addCase(DJ_ACTION_CHANGE_MATCH_STATUS.success, (state, { payload }) => {
        function resolveMatch(matchId) {
          const match = state.currentScreeningMatches?.records.find(
            (m) => m.matchId === matchId
          );
          if (match) match.status = payload.status;
          if (matchId === state.currentMatchDetail?.match.matchId) {
            state.currentMatchDetail.match.status = payload.status;
          }
          if (payload && payload.status === "POSITIVE") {
            filter(state.currentScreeningMatches?.records, function (o) {
              if (o.matchId !== matchId && o.status === "POSITIVE") {
                o.status = "FALSE";
              }
              return o;
            });
          }
        }
        if (!Array.isArray(payload.matchId)) {
          resolveMatch(payload.matchId);
        } else payload.matchId.forEach(resolveMatch);

        if (state.currentScreeningRequest?.id) {
          state.currentScreeningRequest = {
            ...state.currentScreeningRequest,
            unresolved: payload.data?.unresolved,
            positiveMatch: !payload.data?.positiveCount
              ? null
              : state.currentScreeningRequest?.positiveMatch || 1,
            falseCount: payload.data?.falseCount,
          };
        }
        /**
         * Update highlight after change match status
         */

        if (state?.currentScreeningMatches?.records) {
          const newMatch = state.currentScreeningMatches?.records.map((val) => {
            let newArr = Array.isArray(payload.matchId)
              ? payload.matchId
              : [payload?.matchId];

            if (newArr?.find((m) => m === val?.matchId)) {
              return { ...val, hasNewChanges: false };
            }
            return val;
          });
          state.currentScreeningMatches.records = newMatch;
        }
      })
      .addCase(
        DJ_ACTION_GET_KYC_REQUESTS_BY_FILTER.success,
        (state, { payload }) => {
          if (payload && payload.total_records > 0) {
            payload.records = convertStatusPendingOfKYC(payload.records);
          }
          state.list = payload;
        }
      )
      .addCase(DJ_ACTION_GET_KYC_MATCH.success, (state, { payload }) => {
        state.currentMatchDetail = payload;
      })
      .addCase(DJ_ACTION_GET_KYC_SCORING, (state) => {
        state.riskScoring = null;
      })
      .addCase(DJ_ACTION_GET_KYC_SCORING.success, (state, { payload }) => {
        state.riskScoring = payload;
      })
      .addCase(DJ_ACTION_KYC_TOGGLE_OM.success, (state, { payload }) => {
        if (state.currentScreeningRequest) {
          state.currentScreeningRequest.enableOnGoingMonitoring = payload;
        }

        if (state.currentMatchDetail && state.currentMatchDetail.request) {
          state.currentMatchDetail.request.enableOnGoingMonitoring = payload;
        }
      })
      .addCase(DJ_ACTION_RE_SCREENING_MY_KYC.success, (state, { payload }) => {
        const { action } = payload;
        state.currentScreeningRequest.enableReScreening = action;
        if (state.currentMatchDetail && state.currentMatchDetail.request) {
          state.currentMatchDetail.request.enableReScreening = action;
        }
      })
      .addCase(
        DJ_ACTION_RE_SCREENING_MY_KYC_DETAILS.success,
        (state, { payload }) => {
          const { action } = payload;
          if (state.currentMatchDetail) {
            state.currentMatchDetail.request.enableReScreening = action;
          }
          if (state.currentScreeningRequest) {
            state.currentScreeningRequest.enableReScreening = action;
          }
        }
      )
      .addCase(
        DJ_KYC_ACTION_GET_KYC_MATCH_REQUEST.success,
        (state, { payload }) => {
          //@ts-ignore
          state.currentScreeningMatches = payload;
        }
      )
      .addCase(
        DJ_KYC_ACTION_GET_KYC_BLACKLIST_REQUEST.success,
        (state, { payload }) => {
          //@ts-ignore
          state.currentScreeningBlackLists = payload;
        }
      )
      .addCase(
        DJ_KYC_ACTION_GET_MATCHES_FILTER_LIST.success,
        (state, { payload }) => {
          //@ts-ignore
          state.currentMatchesFilterList = payload;
        }
      )
      .addMatcher(isLoadableAction, (state, { type }) => {
        state.loading = !resolveRegExp.test(type);
      });
  })
);

export default DJReducer;
