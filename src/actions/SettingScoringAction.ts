import { createAwaitAction } from "@protego/sdk/actions/utils";
import { PageResult } from "@protego/sdk/types";
import { ScoringDto, ScoringInfoDto } from "types/typings-api";

export const SETTING_SCORING_ACTION_FETCH_ALL = createAwaitAction<
  any,
  PageResult<ScoringInfoDto>
>("setting/kyc-all");

export const SETTING_SCORING_ACTION_SEARCH = createAwaitAction<
  { search: string },
  PageResult<ScoringInfoDto> & { search: string }
>("setting/kyc-search");

export const SETTING_SCORING_ACTION_DETAIL = createAwaitAction<{ any }>(
  "setting/kyc-search-id"
);

export const SETTING_SCORING_ACTION_SAVE = createAwaitAction<
  { setting: string },
  PageResult<ScoringDto> & { setting: string }
>("setting/save-setting");

export const SETTING_KYC_DETAIL = createAwaitAction<any>("setting/kyc-detail");
export const SETTING_KYC_DETAIL_SAVE = createAwaitAction<any>(
  "setting/kyc-detail_save"
);
export const SETTING_KYT_DETAIL = createAwaitAction<any>("setting/kyt-detail");
export const SETTING_KYT_DETAIL_SAVE = createAwaitAction<any>(
  "setting/kyt-detail_save"
);

export const SETTING_KYC_ACTIVITY = createAwaitAction<any>(
  "setting/kyc-activity"
);

export const SETTING_KYB_DETAIL = createAwaitAction<any>("setting/kyb-detail");
export const SETTING_KYB_DETAIL_SAVE = createAwaitAction<any>(
  "setting/kyb-detail_save"
);

// Dow Jones KYC
export const SETTING_DJ_KYC_DETAIL = createAwaitAction<any>(
  "setting/dj-kyc-detail"
);
export const SETTING_DJ_KYC_DETAIL_SAVE = createAwaitAction<any>(
  "setting/kyc-dj-detail_save"
);
export const SETTING_DJ_SCORING_ACTION_FETCH_ALL = createAwaitAction<
  any,
  PageResult<ScoringInfoDto>
>("setting/djkyc-all");

export const SETTING_DJ_SCORING_ACTION_DETAIL = createAwaitAction<{ any }>(
  "setting/kyc-dj-detail"
);

export const SETTING_DJ_SCORING_ACTION_SAVE = createAwaitAction<
  { setting: string },
  PageResult<ScoringDto> & { setting: string }
>("setting/dj-kyc-save");
