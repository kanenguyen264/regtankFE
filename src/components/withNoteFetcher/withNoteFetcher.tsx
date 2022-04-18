import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { isNil } from "lodash";
import { NoteDtoRes } from "../../types/typings-api";
import { AwaitPayloadAction } from "@protego/sdk/actions/utils";
import { RootState } from "../../types/typings";

export interface WithNoteFetcherInjectedProps {
  loading: boolean;
  notes: NoteDtoRes[];
}

export interface WithNoteFetcherProps
  extends React.HTMLAttributes<HTMLElement> {
  fetcher: AwaitPayloadAction<{ id: string }, { data: NoteDtoRes[] }>;
  id: string;
  onClose: () => void;
  saver?: AwaitPayloadAction<
    { body: NoteDtoRes; id: string },
    { data: NoteDtoRes[] }
  >;
  selector: (state: RootState) => NoteDtoRes[];
}

const withNoteFetcher = <P extends WithNoteFetcherProps = WithNoteFetcherProps>(
  Component: React.ComponentType<P>
) => {
  /**
   *
   * @param {WithNoteFetcherProps} props
   * @constructor
   */
  function WithNoteFetcher(props: Exclude<P, WithNoteFetcherProps>) {
    const { fetcher, selector, id } = props,
      notes = useSelector(selector),
      dispatch = useDispatch(),
      loading = !Array.isArray(notes);

    React.useEffect(() => {
      if (loading && !isNil(id)) {
        dispatch(fetcher({ id }));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, id]);

    return <Component loading={loading} notes={notes} {...props} />;
  }

  return WithNoteFetcher;
};

export default withNoteFetcher;
