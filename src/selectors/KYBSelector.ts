// @ts-nocheck
import { DefaultRootState } from "react-redux";
import { createSelector } from "reselect";
import { KybSimplifiedIndividualMatchDto } from "types/typings-api";

export const KYB_SELECTOR_GET_CURRENT_SCREEN_KEYWORDS = createSelector<
  DefaultRootState,
  KybSimplifiedIndividualMatchDto[],
  string[]
>(
  //@ts-ignore
  (state) => state.kyb.currentScreeningRequest.matches,
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
