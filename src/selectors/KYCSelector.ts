// @ts-nocheck
import { createSelector } from "reselect";
import { DefaultRootState } from "react-redux";
import { KycSimplifiedIndividualMatchDto } from "types/typings-api";

export const KYC_SELECTOR_GET_CURRENT_SCREEN_KEYWORDS = createSelector<
  DefaultRootState,
  KycSimplifiedIndividualMatchDto[],
  string[]
>(
  //@ts-ignore
  (state) => state.kyc.currentScreeningRequest.individualMatches,
  (matches) => {
    return Object.keys(
      matches
        .map((m) => m.keywords)
        .reduce((acc, val) => {
          const newAcc = { ...acc };
          val.forEach((keyword) => {
            newAcc[keyword] = 1;
          });
          return newAcc;
        }, {})
    );
  }
);
