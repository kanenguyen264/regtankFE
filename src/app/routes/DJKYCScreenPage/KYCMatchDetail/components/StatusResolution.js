import { Typography } from "@mui/material";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import { withACL } from "acl";
import { DJ_ACTION_CHANGE_MATCH_STATUS } from "actions/DJAction";
import MatchesStatus from "components/MatchesStatus";
import React, { Fragment } from "react";
import { useDispatch } from "react-redux";

const StatusResolution =
  /**
   *
   * @param {KycIndividualMatchEntity} props.match
   * @returns {JSX.Element}
   * @constructor
   */
  function StatusResolution(props) {
    const dispatch = useDispatch();
    const { currentResult, ACL, disabled } = props;

    return (
      <Fragment>
        <div className="d-flex flex-column">
          <Typography variant="Subtitle1" className="mb-1">
            <IntlMessages id="status-resolution" />
          </Typography>
          <div>
            <MatchesStatus
              disabled={disabled}
              value={props.match.status}
              onChange={(e) => {
                dispatch(
                  DJ_ACTION_CHANGE_MATCH_STATUS({
                    kycId: props.kycId,
                    matchId: props.match.matchId,
                    status: e.target.value,
                  })
                );
              }}
            />
          </div>
        </div>
      </Fragment>
    );
  };

export default withACL(StatusResolution);
