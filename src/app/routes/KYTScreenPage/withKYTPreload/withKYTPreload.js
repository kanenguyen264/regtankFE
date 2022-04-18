//@flow
import React from "react";
import { compose } from "recompose";
import { withRouter } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { StringParam, withDefault, withQueryParams } from "use-query-params";
import { isEmpty } from "lodash";
import { KYTAction_RequestItem } from "actions/KYTAction";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import type { AsyncDispatch } from "@protego/sdk/actions/utils";
import type { RootState } from "../../../../types/typings";

const withKYTPreload = (Component) => {
  return compose(withRouter, (Component) =>
    withQueryParams(
      {
        source: withDefault(StringParam, null)
      },
      Component
    )
  )(function WithKYTPreload(props) {
    const dispatch = useDispatch<AsyncDispatch>(),
      {
        match: {
          params: { id }
        },
        query: { source }
      } = props;
    const kytCurrent = useSelector((state: RootState) => state.kyt.current);
    const kytList = useSelector((state: RootState) => state.kyt.list);
    const [current, setCurrent] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const loadCurrentKyt = React.useCallback(async () => {
      setLoading(true);
      try {
        setCurrent(await dispatch(KYTAction_RequestItem(id)));
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }, [dispatch, id]);

    React.useEffect(() => {
      // if ((source?.length || 0) === 0) {
      //   setCurrent(null);
      //   return;
      // }
      let obj;
      switch (source) {
        case "current": {
          obj = kytCurrent;
          if (!isEmpty(obj)) break;
        }
        // eslint-disable-next-line no-fallthrough
        case "list": {
          obj = kytList?.records?.find((kytItem) => kytItem.id === id);
          break;
        }
        default:
          setCurrent(null);
          break;
      }
      if (!isEmpty(obj)) setCurrent(obj);
      else if (!isEmpty(id)) {
        // noinspection JSIgnoredPromiseFromCall
        loadCurrentKyt();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, source]);

    return (
      <LoadingWrapper loading={loading}>
        <Component
          {...props}
          current={current}
          loadCurrentKyt={loadCurrentKyt}
        />
      </LoadingWrapper>
    );
  });
};

export default withKYTPreload;
