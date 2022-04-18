import { PageResult } from "@protego/sdk/types";
import { PaginationParams } from "@protego/sdk/UI/withPagination";
import { AnyAction, createReducer, Reducer } from "@reduxjs/toolkit";
import {
  ACTION_ACTIVITY_LOG_MAIN,
  CLEAN_STATE_ACTIVITY_LOG,
  KYC_ACTION_ASSIGN_KYC_REQUEST,
  KYC_ACTION_CHANGE_MATCH_STATUS,
  KYC_ACTION_CHANGE_STATUS_RISK_SCORE,
  KYC_ACTION_CREATE_NEW_GROUP,
  KYC_ACTION_EDIT_KYC_SCORING,
  KYC_ACTION_FILTER_MATCHES,
  KYC_ACTION_GET_KYC_MATCH,
  KYC_ACTION_GET_KYC_REQUEST,
  KYC_ACTION_GET_KYC_REQUESTS,
  KYC_ACTION_GET_KYC_REQUESTS_BY_FILTER,
  KYC_ACTION_GET_KYC_SCORING,
  KYC_ACTION_GET_KYC_WATCHLIST,
  KYC_ACTION_GET_WATCH_GROUP,
  KYC_ACTION_INPUT_INDIVIDUAL_BY_USER,
  KYC_ACTION_REMOVE_WATCH_GROUP,
  KYC_ACTION_RENAME_GROUP,
  KYC_ACTION_RE_SCREENING_MY_KYC,
  KYC_ACTION_RE_SCREENING_MY_KYC_DETAILS,
  KYC_ACTION_SEARCH,
  KYC_ACTION_SEARCH_WATCHLIST,
  KYC_ACTION_WATCH_GROUP_SEARCH,
  KYC_ACTION_BLACKLIST_MATCH_DETAIL,
  KYC_ACTION_BLACKLIST_MATCH_CHANGE_STATUS,
  KYC_ACTION_TOGGLE_OM,
  KYC_ACTION_GET_KYC_MATCH_REQUEST,
  KYC_ACTION_GET_KYC_BLACKLIST_REQUEST,
  KYC_ACTION_GET_MATCHES_FILTER_LIST,
  KYC_CLEAN_LIST,
} from "actions/KYCAction";
import { LocationChangeAction, LOCATION_CHANGE } from "connected-react-router";
import { KYC_STATUS } from "constants/KycStatus";
import { KYC_ROUTE_KYC_SCREEN_RESULT } from "constants/routes";
import { filter } from "lodash";
import { compose } from "redux";
import {
  KYCArchiveAdapter,
  KYCNoteAdapter,
  KYCNoteMatchAdapter,
  KYCNoteScoringAdapter
} from "services/KYCService";
import {
  KycDetailedRequestDto,
  KycSimplifiedRequestDto,
  MatchResponseDto,
  NoteDtoRes,
  RiskResponseDto
} from "types/typings-api";

export interface IKYCReducerState extends INoteState {
  activityLog: string[];
  archiveList:
  | PageResult<KycSimplifiedRequestDto>
  | Array<KycSimplifiedRequestDto>;
  blacklistMatchDetail: any;
  currentMatchDetail: MatchResponseDto | null;
  currentMatchesFilterList: any;
  currentScreeningBlackLists?: any;
  currentScreeningMatches?: any;
  currentScreeningRequest: KycDetailedRequestDto | null;
  deductOM: any;
  list: PageResult<KycSimplifiedRequestDto>;
  loading: boolean;
  matchNotes: {
    [key: string]: NoteDtoRes;
  };
  riskScoring: RiskResponseDto;
  scoringNotes: {
    [key: string]: NoteDtoRes[];
  };
  screeningResultQuery?: PaginationParams;
  watchGroup: any;
  watchGroupSearch: KycSimplifiedRequestDto[];
  watchList: KycSimplifiedRequestDto[];
}

const initialState: IKYCReducerState = {
  archiveList: [],
  notes: {},
  matchNotes: {},
  scoringNotes: {},
  currentScreeningRequest: null,
  currentScreeningBlackLists: null,
  currentScreeningMatches: null,
  currentMatchesFilterList: null,
  currentMatchDetail: null,
  screeningResultQuery: {
    page: 1,
    search: null,
    size: 10,
    sort: null
  },
  loading: false,
  watchList: [],
  list: {
    records: [],
    total_records: 0,
    total_pages: 0
  },
  riskScoring: null,
  activityLog: [],
  watchGroup: [],
  watchGroupSearch: [],
  blacklistMatchDetail: {},
  deductOM: {},
};

const regExp = new RegExp(
  "^(" +
  [
    "individual-user-input",
    "get-kyc-request",
    "get-kyc-requests",
    "change-match-status",
    "get-kyc-match",
    "watch-list",
    "search",
    "get-kyc-scoring",
    "toggle-om",
    "update_re_screening_my_kyc",
    "update_re_screening_my_kyc_details",
    "blacklist/match/change-match-status"
  ]
    .map((s) => `kyc/${s}`)
    .join("|") +
  ")"
),
  resolveRegExp = /\/(success|error)$/;
function isLoadableAction(action: AnyAction): boolean {
  return regExp.test(action.type);
}

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

const KYCReducer = compose(
  KYCNoteAdapter.withNoteReducer,
  KYCNoteMatchAdapter.withNoteReducer,
  KYCNoteScoringAdapter.withNoteReducer,
  KYCArchiveAdapter.withArchiveReducer
)(
  // @ts-ignore
  createReducer<IKYCReducerState>(initialState, (builder) => {
    builder
      //@ts-ignore
      .addCase(
        LOCATION_CHANGE,
        (state, { payload }: LocationChangeAction<{}>) => {
          const pathname = payload.location.pathname,
            //@ts-ignore
            query = payload.location.query as any;
          /**
           * Use case: go to /kyc-screen
           * Reset module kyc
           */
          if (/\/kyc-screen$/.test(payload.location.pathname)) {
            Object.assign(state, initialState);
          }
          /**
           * Use case: go to /screen-kyc/result
           * Delete old current KYC request
           */
          if (
            pathname === KYC_ROUTE_KYC_SCREEN_RESULT &&
            query?.kycId !== state.currentScreeningRequest?.kycId
          ) {
            state.currentScreeningRequest = null;
          }
        }
      )
      .addCase(KYC_ACTION_ASSIGN_KYC_REQUEST.success, (state, { payload }) => {
        state.currentScreeningRequest.assignee = payload.user;
      })
      .addCase(
        KYC_ACTION_INPUT_INDIVIDUAL_BY_USER.success,
        (state, { payload }) => {
          if (payload && payload.status === KYC_STATUS.PENDING) {
            payload.status = KYC_STATUS.NO_MATCH;
          }
          state.currentScreeningRequest = payload;
        }
      )
      .addCase(KYC_ACTION_SEARCH.success, (state, { payload }) => {
        if (payload && payload.total_records > 0) {
          payload.records = convertStatusPendingOfKYC(payload.records);
        }
        state.list = payload;
      })
      .addCase(KYC_ACTION_GET_KYC_REQUEST.success, (state, { payload }) => {
        if (payload && payload.status === KYC_STATUS.PENDING) {
          if (payload.positiveMatch !== null) {
            payload.status = KYC_STATUS.POSITIVE_MATCH;
          } else {
            payload.status = KYC_STATUS.NO_MATCH;
          }
        }

        const result = { ...payload };
        result.individualMatches?.sort?.((m1, m2) => {
          if (m1.status === "POSITIVE") return -1;
          if (m2.status === "POSITIVE") return 1;
          return 0;
        });
        state.currentScreeningRequest = result;
      })
      .addCase(KYC_ACTION_FILTER_MATCHES, (state, { payload }) => {
        state.screeningResultQuery = Object.assign(
          {},
          state.screeningResultQuery,
          payload
        );
      })
      .addCase(KYC_ACTION_CHANGE_MATCH_STATUS.success, (state, { payload }) => {
        function resolveMatch(matchId: string) {
          const match = state.currentScreeningMatches?.records.find(
            (m) => m.matchId === matchId
          );

          if (match) match.status = payload.status;
          if (matchId === state.currentMatchDetail?.match.matchId) {
            state.currentMatchDetail.match.status = payload.status;
          }
          if (payload && payload.status === "POSITIVE") {
            filter(
              state.currentScreeningMatches?.records,
              function (o) {
                if (o.matchId !== matchId && o.status === "POSITIVE") {
                  o.status = "FALSE";
                }
                return o;
              }
            );
          }
        }
        if (!Array.isArray(payload.matchId)) {
          resolveMatch(payload.matchId);
        } else payload.matchId.forEach(resolveMatch);

        //@ts-ignore
        if (state.currentScreeningRequest?.id) {
          //@ts-ignore
          state.currentScreeningRequest = { ...state.currentScreeningRequest, unresolved: payload.data?.unresolved, positiveMatch: !payload.data?.positiveCount ? null : (state.currentScreeningRequest?.positiveMatch || 1), falseCount: payload.data?.falseCount }
        }

        /**
         * Update highlight after change match status
         */

        if (state?.currentScreeningMatches?.records) {
          const newMatch = state.currentScreeningMatches?.records.map((val) => {
            let newArr = Array.isArray(payload.matchId) ? payload.matchId : [payload?.matchId];
            if (newArr?.find((m) => m === val?.matchId)) {
              return { ...val, hasNewChanges: false };
            }
            return val;
          });
          state.currentScreeningMatches.records = newMatch;
        }
      })
      .addCase(KYC_ACTION_GET_KYC_MATCH.success, (state, { payload }) => {
        state.currentMatchDetail = payload;
      })
      .addCase(KYC_ACTION_GET_KYC_REQUESTS.success, (state, { payload }) => {
        if (payload && payload.total_records > 0) {
          payload.records = convertStatusPendingOfKYC(payload.records);
        }
        state.list = payload;
      })
      .addCase(
        KYC_ACTION_GET_KYC_REQUESTS_BY_FILTER.success,
        (state, { payload }) => {
          if (payload && payload.total_records > 0) {
            payload.records = convertStatusPendingOfKYC(payload.records);
          }
          state.list = payload;
        }
      )
      .addCase(KYC_ACTION_GET_KYC_WATCHLIST.success, (state, { payload }) => {
        if (payload && payload.total_records > 0) {
          payload.records = convertStatusPendingOfKYC(payload.records);
        }
        //@ts-ignore
        state.watchList = payload;
      })
      .addCase(KYC_ACTION_SEARCH_WATCHLIST.success, (state, { payload }) => {
        if (payload && payload.total_records > 0) {
          payload.records = convertStatusPendingOfKYC(payload.records);
        }
        // @ts-ignore
        state.watchList = payload;
      })

      .addCase(KYC_ACTION_GET_KYC_SCORING, (state) => {
        state.riskScoring = null;
      })
      .addCase(KYC_ACTION_GET_KYC_SCORING.success, (state, { payload }) => {
        state.riskScoring = payload;
        //@ts-ignore
      })
      .addCase(
        KYC_ACTION_CHANGE_STATUS_RISK_SCORE.success,
        (state, { payload }) => {
          // state.riskScoring = payload;
          //@ts-ignore
        }
      )
      .addCase(ACTION_ACTIVITY_LOG_MAIN.success, (state, { payload }) => {
        //@ts-ignore
        state.activityLog = payload?.data;
      })
      .addCase(KYC_ACTION_GET_WATCH_GROUP.success, (state, { payload }) => {
        //@ts-ignore
        state.watchGroup = payload;
      })
      //@ts-ignore
      .addCase(CLEAN_STATE_ACTIVITY_LOG, (state, { payload }) => {
        state.activityLog = [];
      })
      .addCase(KYC_ACTION_BLACKLIST_MATCH_CHANGE_STATUS.success, (state, { payload }) => {
        function resolveMatch(blacklistId: string) {
          //@ts-ignore
          const match = state.currentScreeningBlackLists.records?.find(
            //@ts-ignore
            (m) => m?.kycBlacklist?.blacklistId === blacklistId
          );
          if (match) match.status = payload.status;
          if (payload && payload.status === "POSITIVE") {
            filter(//@ts-ignore
              state.currentScreeningBlackLists.records,
              function (o) {
                if (o?.kycBlacklist.blacklistId !== blacklistId && o.status === "POSITIVE") {
                  o.status = "FALSE";
                }
                return o;
              }
            );
          }
        }

        //@ts-ignore
        if (state.currentScreeningRequest?.id) {
          //@ts-ignore
          state.currentScreeningRequest = { ...state.currentScreeningRequest, blacklistUnresolved: payload.data?.unresolved }
        }
        if (!Array.isArray(payload.blacklistId)) {
          resolveMatch(payload.blacklistId);
        } else payload.blacklistId.forEach(resolveMatch);
      })
      .addCase(KYC_ACTION_RE_SCREENING_MY_KYC.success, (state, { payload }) => {
        const { action } = payload as any;
        state.currentScreeningRequest.enableReScreening = action;
        if (state.currentMatchDetail && state.currentMatchDetail.request) {
          state.currentMatchDetail.request.enableReScreening = action;
        }
      })
      .addCase(
        KYC_ACTION_RE_SCREENING_MY_KYC_DETAILS.success,
        (state, { payload }) => {
          const { action } = payload as any;
          if (state.currentMatchDetail) {
            state.currentMatchDetail.request.enableReScreening = action;
          }
          if (state.currentScreeningRequest) {
            state.currentScreeningRequest.enableReScreening = action;
          }
        }
      )
      .addCase(KYC_ACTION_TOGGLE_OM.success, (state, { payload }) => {
        if (state.currentScreeningRequest) {
          state.currentScreeningRequest.enableOnGoingMonitoring = payload.enabled;
          state.currentScreeningRequest.omStartPeriod = payload.omStartDate;
          state.currentScreeningRequest.omEndPeriod = payload.omEndDate;
        }

        if (state.currentMatchDetail && state.currentMatchDetail.request) {
          state.currentMatchDetail.request.enableOnGoingMonitoring = payload.enabled;
          state.currentMatchDetail.request.omStartPeriod = payload.omStartDate;
          state.currentMatchDetail.request.omEndPeriod = payload.omEndDate;
        }
        if (state.deductOM) {
          state.deductOM.enabled = payload.enabled;
          state.deductOM.omStartPeriod = payload.omStartDate;
          state.deductOM.omEndPeriod = payload.omEndDate;
        }
      })
      .addCase(KYC_ACTION_EDIT_KYC_SCORING.success, (state, { payload }) => { })
      .addCase(KYC_ACTION_WATCH_GROUP_SEARCH.success, (state, { payload }) => {
        if (payload && payload.total_records > 0) {
          payload.records = convertStatusPendingOfKYC(payload.records);
        }
        //@ts-ignore
        state.watchGroupSearch = payload;
      })
      .addCase(KYC_ACTION_RENAME_GROUP.success, (state, { payload }) => {
        //@ts-ignore
      })
      .addCase(KYC_ACTION_REMOVE_WATCH_GROUP.success, (state, { payload }) => {
        //@ts-ignore
      })
      .addCase(KYC_ACTION_CREATE_NEW_GROUP.success, (state, { payload }) => {
        //@ts-ignore
        state.watchGroup = payload;
      })
      .addCase(KYC_ACTION_BLACKLIST_MATCH_DETAIL.success, (state, { payload }) => {
        //@ts-ignore
        state.blacklistMatchDetail = payload;
      })
      .addCase(KYC_ACTION_GET_KYC_MATCH_REQUEST.success, (state, { payload }) => {
        //@ts-ignore
        state.currentScreeningMatches = payload;
      })
      .addCase(KYC_ACTION_GET_KYC_BLACKLIST_REQUEST.success, (state, { payload }) => {
        //@ts-ignore
        state.currentScreeningBlackLists = payload;
      })
      .addCase(KYC_ACTION_GET_MATCHES_FILTER_LIST.success, (state, { payload }) => {
        //@ts-ignore
        state.currentMatchesFilterList = payload;
      })
      .addCase(KYC_CLEAN_LIST, (state, { payload }) => {
        //@ts-ignore
        state.list = [];
      })
      .addMatcher(isLoadableAction, (state, { type }) => {
        state.loading = !resolveRegExp.test(type);
      });
  })
) as Reducer<IKYCReducerState>;

export default KYCReducer;
