import { createSelector } from "reselect";
import orderBy from "lodash/orderBy";
import memoize from "lodash/memoize";

function orderByType(data, type) {
  switch (type) {
    case "date":
      return Date.parse(data);
    default:
      return data;
  }
}
export const KytSelectorGetSortedCreator = () =>
  createSelector(
    (state) => state.kyt.list,
    (_, props) => props,
    (collection, { sortField, sortDirection, sortDataType }) => {
      if (typeof sortField === "string") {
        return orderBy(
          collection,
          (c) => orderByType(c[sortField], sortDataType),
          [sortDirection || "desc"]
        );
      }
      return collection;
    }
  );

export const KYTSelectorGetIsFavorite = createSelector(
  (state) => state.kyt.favorites,
  (favorites) =>
    memoize((id) => favorites.findIndex((_id) => id === _id) !== -1)
);
