import { createReducer } from "@reduxjs/toolkit";
import {
  KYB_ACTION_ASSIGN_KYB_REQUEST,
  KYB_ACTION_CHANGE_MATCH_STATUS,
  KYB_ACTION_GET_KYB_MATCH,
  KYB_ACTION_GET_KYB_REQUEST,
  KYB_ACTION_GET_KYB_REQUESTS,
  KYB_ACTION_GET_KYB_WATCHLIST,
  KYB_ACTION_INPUT_BUSINESS,
  KYB_ACTION_RE_SCREENING_MY_KYB,
  KYB_ACTION_RE_SCREENING_MY_KYB_DETAILS,
  KYB_ACTION_RISK_ASSESSMENT_DETAILS,
  KYB_CHANGE_RISK_LEVEL_ASSESSMENT,
  KYB_RISK_ASSESSMENT_GENERATE,
  KYB_RISK_ASSESSMENT_NOTE,
  KYB_SAVE_RISK_ASSESSMENT,
  KYB_ACTION_WATCH_GROUP_SEARCH,
  KYB_ACTION_RENAME_GROUP,
  KYB_ACTION_REMOVE_WATCH_GROUP,
  KYB_ACTION_CREATE_NEW_GROUP,
  KYB_ACTION_GET_WATCH_GROUP,
  KYB_ACTION_SWITCH_RE_SCREENING,
  KYB_ACTION_GET_KYB_REQUESTS_BY_FILTER,
  KYB_ACTION_TOGGLE_OM,
  KYB_CLEAN_LIST,
  KYB_ACTION_GET_KYB_MATCH_REQUEST,
  KYB_ACTION_GET_MATCHES_FILTER_LIST,
} from "actions/KYBAction";
import { filter } from "lodash";
import { compose } from "redux";
import {
  KYBArchiveAdapter,
  KYBNoteAdapter,
  KYBNoteMatchAdapter,
  KYBRiskNoteAdapter,
} from "services/KYBService";
import { KYB_STATUS } from "constants/KybStatus";

const initialState = {
  status: null,
  list: {},
  archiveList: [],
  current: {},
  assets: null,
  favorites: [],
  notes: {},
  watchList: [],
  assignee: {},
  loading: false,
  currentScreeningRequest: null,
  currentMatchesFilterList: null,
  currentScreeningMatches: null,
  riskDetail: null,
  currentMatchDetail: null,
  matchNotes: {},
};

const regExp = new RegExp(
    "^(" +
      [
        "get-kyb-request",
        "get-kyb-requests",
        "watch-list",
        "change-match-status",
        "get-kyb-match",
        "watch-list",
        "search",
        "get-kyb-scoring",
        "risk-assessment",
        "toggle-om",
        "re-screening",
      ]
        .map((s) => `kyb/${s}`)
        .join("|") +
      ")"
  ),
  resolveRegExp = /\/(success|error)$/;
function isLoadableAction(action) {
  return regExp.test(action.type);
}

const convertStatusPendingOfKYB = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => {
      if (item.status === KYB_STATUS.PENDING) {
        if (item.positiveMatch != null) {
          item.status = "POSITIVE_MATCH";
        } else {
          item.status = "NO_MATCH";
        }
      }
      return item;
    });
  } else if (data?.request?.status) {
    data.request.status =
      data.request.positiveMatch != null ? "POSITIVE_MATCH" : "NO_MATCH";
  }

  return data;
};

const KYBReducer = compose(
  KYBNoteAdapter.withNoteReducer,
  KYBNoteMatchAdapter.withNoteReducer,
  KYBRiskNoteAdapter.withNoteReducer,
  KYBArchiveAdapter.withArchiveReducer
)(
  // main reducer
  createReducer(initialState, (builder) => {
    builder

      .addCase(KYB_ACTION_SWITCH_RE_SCREENING.success, (state, { payload }) => {
        if (state.riskDetail && state.riskDetail.kybRequest) {
          state.riskDetail.kybRequest.enableReScreening = payload;
        }
      })
      .addCase(KYB_ACTION_CHANGE_MATCH_STATUS.success, (state, { payload }) => {
        function resolveMatch(matchId) {
          const match = state.currentScreeningMatches?.records.find(
            (m) => m.matchId === matchId
          );

          if (match) match.status = payload.status;
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

        //@ts-ignore
        if (state.currentScreeningRequest?.id) {
          //@ts-ignore
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

        if (state.currentMatchDetail?.match?.matchId === payload.matchId) {
          state.currentMatchDetail.match.status = payload.status;
        }
      })
      .addCase(KYB_ACTION_GET_KYB_REQUEST.success, (state, { payload }) => {
        let result = { ...payload };
        result.matches?.sort?.((m1, m2) => {
          if (m1.status === "POSITIVE") return -1;
          if (m2.status === "POSITIVE") return 1;
          return 0;
        });

        result = convertStatusPendingOfKYB([result])[0];
        state.currentScreeningRequest = { ...result, error: false };
      })
      .addCase(KYB_ACTION_GET_KYB_REQUEST.error, (state, { payload }) => {
        state.currentScreeningRequest = { error: true };
      })
      .addCase(KYB_ACTION_ASSIGN_KYB_REQUEST.success, (state, { payload }) => {
        state.currentScreeningRequest.assignee = payload.user;
      })
      .addCase(KYB_ACTION_INPUT_BUSINESS.success, (state, { payload }) => {
        state.currentScreeningRequest = payload;
      })
      .addCase(KYB_ACTION_GET_KYB_REQUESTS.success, (state, { payload }) => {
        if (payload && payload.total_records > 0) {
          payload.records = convertStatusPendingOfKYB(payload.records);
        }

        state.list = payload;
      })
      .addCase(KYB_ACTION_GET_KYB_WATCHLIST.success, (state, { payload }) => {
        if (payload && payload.total_records > 0) {
          payload.records = convertStatusPendingOfKYB(payload.records);
        }
        state.watchList = payload;
      })
      .addCase(KYB_RISK_ASSESSMENT_NOTE.success, (state, { payload }) => {
        state.notes = payload;
      })
      .addCase(
        KYB_ACTION_RISK_ASSESSMENT_DETAILS.success,
        (state, { payload }) => {
          state.riskDetail = payload;
        }
      )
      .addCase(KYB_ACTION_GET_KYB_MATCH.success, (state, { payload }) => {
        state.currentMatchDetail = convertStatusPendingOfKYB(payload);
        //@ts-ignore
        // state.currentScreeningRequest = payload.request;
      })
      .addCase(KYB_SAVE_RISK_ASSESSMENT.success, (state, { payload }) => {
        state.riskDetail = payload;
      })
      .addCase(
        KYB_ACTION_RE_SCREENING_MY_KYB_DETAILS.success,
        (state, { payload }) => {
          const { action } = payload;
          state.currentMatchDetail.request.enableReScreening = action;
          if (state.currentScreeningRequest) {
            state.currentScreeningRequest.enableReScreening = action;
          }
        }
      )
      .addCase(KYB_ACTION_RE_SCREENING_MY_KYB.success, (state, { payload }) => {
        const { action } = payload;
        state.currentScreeningRequest.enableReScreening = action;
        if (state.currentMatchDetail && state.currentMatchDetail.request) {
          state.currentMatchDetail.request.enableReScreening = action;
        }
      })
      .addCase(KYB_RISK_ASSESSMENT_GENERATE.success, (state, { payload }) => {})
      .addCase(
        KYB_CHANGE_RISK_LEVEL_ASSESSMENT.success,
        (state, { payload }) => {
          if (state.riskDetail) {
            if (state.riskDetail.kybRequest) {
              state.riskDetail.kybRequest.riskLevel =
                payload.request.newRiskAssessmentLevel;
            }

            state.riskDetail.riskLevel = payload.request.newRiskAssessmentLevel;
          }
        }
      )
      .addCase(KYB_ACTION_GET_WATCH_GROUP.success, (state, { payload }) => {
        //@ts-ignore
        state.watchGroup = payload;
      })
      .addCase(KYB_ACTION_WATCH_GROUP_SEARCH.success, (state, { payload }) => {
        if (payload && payload.total_records > 0) {
          payload.records = convertStatusPendingOfKYB(payload.records);
        }
        //@ts-ignore
        state.watchGroupSearch = payload;
      })
      .addCase(KYB_ACTION_RENAME_GROUP.success, (state, { payload }) => {
        //@ts-ignore
      })
      .addCase(KYB_ACTION_REMOVE_WATCH_GROUP.success, (state, { payload }) => {
        //@ts-ignore
      })
      .addCase(KYB_ACTION_CREATE_NEW_GROUP.success, (state, { payload }) => {
        //@ts-ignore
        state.watchGroup = payload;
      })
      .addCase(
        KYB_ACTION_GET_KYB_REQUESTS_BY_FILTER.success,
        (state, { payload }) => {
          //@ts-ignore
          if (payload && payload.total_records > 0) {
            payload.records = convertStatusPendingOfKYB(payload.records);
          }
          state.list = payload;
        }
      )
      .addCase(KYB_ACTION_TOGGLE_OM.success, (state, { payload }) => {
        if (state?.riskDetail?.kybRequest) {
          state.riskDetail.kybRequest.enableOnGoingMonitoring =
            payload?.enabled;
        }
        if (state.currentScreeningRequest) {
          state.currentScreeningRequest.enableOnGoingMonitoring =
            payload?.enabled;
        }

        if (state.currentMatchDetail && state.currentMatchDetail.request) {
          state.currentMatchDetail.request.enableOnGoingMonitoring =
            payload?.enabled;
        }
      })
      .addCase(KYB_CLEAN_LIST, (state) => {
        //@ts-ignore
        state.list = [];
      })
      .addCase(
        KYB_ACTION_GET_KYB_MATCH_REQUEST.success,
        (state, { payload }) => {
          state.currentScreeningMatches = payload;
        }
      )
      .addCase(
        KYB_ACTION_GET_MATCHES_FILTER_LIST.success,
        (state, { payload }) => {
          state.currentMatchesFilterList = payload;
        }
      )
      .addMatcher(isLoadableAction, (state, { type }) => {
        state.loading = !resolveRegExp.test(type);
      });
  })
);

export default KYBReducer;
