import { PageResult } from "@protego/sdk/types";
import { WithPaginationInjectedProps } from "@protego/sdk/UI/withPagination";
import { get, isNumber, orderBy } from "lodash";
import { DefaultRootState } from "react-redux";
import { createSelector, ParametricSelector } from "reselect";

type ExtendProp<P, I> = P & {
  filter: (data: I) => boolean;
};

export const paginatedSelectorCreator = <
  I,
  S = DefaultRootState,
  P extends WithPaginationInjectedProps = WithPaginationInjectedProps
>(
  selector1: ParametricSelector<S, P, I[]>,
  selector2?: ParametricSelector<S, ExtendProp<P, I>, any>
) => {
  const selectPaginationParams = (_, props) => props.paginationParams;
  return createSelector(
    [selector1, selectPaginationParams, selector2].filter(Boolean),
    (list, paginationParams, filter) => {
      const { page, size, sort } = paginationParams;
      const sortParams =
        (sort?.length || 0) > 0 ? sort.split(",").map((p) => [p]) : null;

      const keySort = sort ? sort.split(",")[0] : "";
      const typeSort = sort ? sort.split(",")[1] : "";
      let filteredList =
        typeof filter === "function" ? list.filter(filter) : list;

      let attrPath = `${keySort}`;
      const sortValue = (user) => {
        if (isNumber(get(user, attrPath))) {
          // if sort is number
          return get(user, attrPath) ? get(user, attrPath) : -1;
        }
        // If sort is string
        return get(user, attrPath) ? get(user, attrPath).toUpperCase() : "";
      };

      if (filteredList && filteredList.length > 0) {
        // check space object
        filteredList = filteredList.map((item) => {
          if (item.hasOwnProperty("name") && typeof item["name"] === "string") {
            return {
              ...item,
              name: item["name"].trim()
            };
          }
          return item;
        });

        try {
          var records = (sortParams
            ? orderBy(filteredList, [sortValue], typeSort)
            : filteredList
          ).slice(page * size, (page + 1) * size) as I[];
        } catch (error) {
          records = filteredList;
        }
        return {
          total_records: filteredList.length,
          records,
          total_pages: Math.ceil((list.length * 1.0) / paginationParams.size)
        } as PageResult<I>;
      }
      return {
        total_records: 0,
        records: [],
        total_pages: 0
      } as PageResult<I>;
    }
  );
};
