import { PageResult } from "@protego/sdk/types";
import { AnyAction, createReducer } from "@reduxjs/toolkit";
import {
  CASE_MANAGEMENT_ACTION_GET_CASES,
  CASE_MANAGEMENT_ADD_GROUP_PROFILE,
  CASE_MANAGEMENT_ADD_PROFILE,
  CASE_MANAGEMENT_BASIC_LOG,
  CASE_MANAGEMENT_CLEAN_PROFILE,
  CASE_MANAGEMENT_DELETE_PROFILE,
  CASE_MANAGEMENT_DETAIL_ASSIGN,
  CASE_MANAGEMENT_DETAIL_CASES,
  CASE_MANAGEMENT_DETAIL_UPDATE,
  CASE_MANAGEMENT_SEARCH_PROFILE,
  UPDATE_PROFILE_TABLE,
} from "actions/CaseManagementAction";
import { KYB_STATUS } from "constants/KybStatus.js";
import { KYC_STATUS } from "constants/KycStatus";
import { compose } from "redux";
import { CaseManagementNoteAdapter } from "services/CaseManagementService";
import {
  CaseDetailsDto,
  CaseListingDto,
  CaseManagementDetailDto,
} from "types/typings-api";
export interface ICaseReducerState extends INoteState {
  current: CaseDetailsDto;
  detail: CaseManagementDetailDto;
  list: PageResult<CaseListingDto>;
  loading: boolean;
  tableData: Array<any>;
}
const initialState: ICaseReducerState = {
  notes: {},
  current: null,
  //@ts-ignore
  detail: {
    assignee: {
      loading: true,
    },
  },
  list: {
    records: [],
    total_pages: 0,
    total_records: 0,
  },
  tableData: [],
  loading: false,
  basicLog: {},
  tab: {
    kyc: {},
    kyb: {},
    kyt: {},
  },
};

const regExp = new RegExp(
    "^(" +
      [
        "get-cases",
        "get-case-by-caseid",
        "bulk-assign",
        "create",
        "update-approval",
        "detail-delete-profile",
        "detail-add-group-profile",
        "detail-add-profile",
        "update-profiles",
        "detail",
        "search-profile",
      ]
        .map((s) => `case-management/${s}`)
        .join("|") +
      ")"
  ),
  resolveRegExp = /\/(success|error)$/;
function isLoadableAction(action: AnyAction): boolean {
  return regExp.test(action.type);
}

const formatStatusPending = (item) => {
  if (
    item.profileType === "KYC" &&
    item.profileInfo &&
    item.profileInfo.status === KYC_STATUS.PENDING
  ) {
    if (item.profileInfo.positiveMatch != null) {
      item.profileInfo.status = KYC_STATUS.POSITIVE_MATCH;
    } else {
      item.profileInfo.status = KYC_STATUS.NO_MATCH;
    }
  }
  else if (
    item.profileType === "KYB" &&
    item.profileInfo &&
    item.profileInfo.status === KYB_STATUS.PENDING
  ) {
    if (item.profileInfo.positiveMatch != null) {
      item.profileInfo.status = KYB_STATUS.POSITIVE_MATCH;
    } else {
      item.profileInfo.status = KYB_STATUS.NO_MATCH;
    }
  }
}

const recursiveFormatStatus = (data) => {
  if(data?.profiles.length > 0) {
    const list = data?.profiles;
    convertListStatusPending(list);
  }
}

const convertListStatusPending = (list) => {
  return list.map((item) => {
    formatStatusPending(item);
    recursiveFormatStatus(item)
    return item;
  });
};
const convertListStatusPendingSearchTab = (list, type) => {
  return list.map((item) => {
    if (type === "KYC" && item.status === KYC_STATUS.PENDING) {
      if (item.positiveMatch != null) {
        item.status = KYC_STATUS.POSITIVE_MATCH;
      } else {
        item.status = KYC_STATUS.NO_MATCH;
      }
    }
    if (type === "KYB" && item.status === KYB_STATUS.PENDING) {
      if (item.positiveMatch != null) {
        item.status = KYB_STATUS.POSITIVE_MATCH;
      } else {
        item.status = KYB_STATUS.NO_MATCH;
      }
    }
    return item;
  });
};
const CaseManagementReducer = compose(
  CaseManagementNoteAdapter.withNoteReducer
)(
  createReducer(initialState, (builder) => {
    builder
      .addCase(
        CASE_MANAGEMENT_ACTION_GET_CASES.success,
        (state, { payload }) => {
          state.list = payload;
        }
      )
      .addCase(CASE_MANAGEMENT_DETAIL_CASES.success, (state, { payload }) => {
        state.detail = payload;
        if (payload.profiles && payload.profiles.length > 0)
          state.detail.profiles = convertListStatusPending(payload.profiles);
      })
      .addCase(CASE_MANAGEMENT_DETAIL_CASES.error, (state, { payload }) => {
        //@ts-ignore
        state.error = payload;
      })
      .addCase(CASE_MANAGEMENT_DETAIL_ASSIGN.success, (state, { payload }) => {
        state.detail.assignee = payload;
      })
      .addCase(CASE_MANAGEMENT_DETAIL_UPDATE.success, (state, action) => {
        //@ts-ignore
        const {
          caseId,
          name,
          fields,
          information,
          referenceId,
        } = action.payload;
        state.detail.caseId = caseId;
        state.detail.fields = fields;
        state.detail.name = name;
        state.detail.information = information;
        state.detail.referenceId = referenceId;
      })
      .addCase(
        CASE_MANAGEMENT_ADD_GROUP_PROFILE.success,
        (state, { payload }) => {
          state.detail.profiles = convertListStatusPending(payload);
        }
      )
      .addCase(CASE_MANAGEMENT_ADD_PROFILE.success, (state, { payload }) => {
        state.detail.profiles = convertListStatusPending(payload);
        state.detail.profiles.groupProfileId = payload.groupProfileId;
      })
      .addCase(CASE_MANAGEMENT_DELETE_PROFILE.success, (state, { payload }) => {
        state.detail.profiles = convertListStatusPending(payload);
      })
      .addCase(UPDATE_PROFILE_TABLE.success, (state, { payload }) => {
        state.detail.profiles = convertListStatusPending(payload);
      })
      .addCase(CASE_MANAGEMENT_BASIC_LOG.success, (state, { payload }) => {
        state.basicLog = payload;
      })
      .addCase(CASE_MANAGEMENT_SEARCH_PROFILE.success, (state, { payload }) => {
        state.tab.kyc = payload?.kyc || state.tab.kyc;
        state.tab.kyt = payload?.kyt || state.tab.kyt;
        state.tab.kyb = payload?.kyb || state.tab.kyb;
        if (payload?.kyc) {
          state.tab.kyc.records = convertListStatusPendingSearchTab(
            payload?.kyc?.records,
            "KYC"
          );
        } else if (payload?.kyb) {
          state.tab.kyb.records = convertListStatusPendingSearchTab(
            payload?.kyb?.records,
            "KYC"
          );
        }
      })
      .addCase(CASE_MANAGEMENT_CLEAN_PROFILE, (state, { payload }) => {
        state.tab.kyc = {};
        state.tab.kyt = {};
        state.tab.kyb = {};
      })
      .addMatcher(isLoadableAction, (state, { type }) => {
        state.loading = !resolveRegExp.test(type);
      });
  })
);

export default CaseManagementReducer;
