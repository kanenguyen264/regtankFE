import { Dialog, DialogContent, Divider, Grid } from "@mui/material";
import CloseableDialogTitle from "@protego/sdk/RegtankUI/v1/CloseableDialogTitle/CloseableDialogTitle";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import LoadingWrapper from "@protego/sdk/RegtankUI/v1/LoadingWrapper";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable";
import {
  ACTION_ACTIVITY_LOG_MAIN,
  CLEAN_STATE_ACTIVITY_LOG,
} from "actions/KYCAction";
import { ReactComponent as CheckScore } from "assets/icons/IcCheckScore.svg";
import { ReactComponent as CreateIcon } from "assets/icons/IcCreate.svg";
import { ReactComponent as BusinessIcon } from "assets/icons/IcEditBusiness.svg";
import { ReactComponent as EscalateIcon } from "assets/icons/IcEscalate.svg";
import { ReactComponent as FetchIcon } from "assets/icons/IcFetch.svg";
import { ReactComponent as ApproveIcon } from "assets/icons/IcLogApprove.svg";
import { ReactComponent as AssignIcon } from "assets/icons/IcLogAssign.svg";
import { ReactComponent as RejectIcon } from "assets/icons/IcLogReject.svg";
import { ReactComponent as RescreenIcon } from "assets/icons/IcRescreen.svg";
import { ReactComponent as IcRescreeningSettingIcon } from "assets/icons/IcRescreeningSetting.svg";
import { ReactComponent as ResolveIcon } from "assets/icons/IcResolve.svg";
import { ReactComponent as MatchIcon } from "assets/icons/icMatch.svg";
import clsx from "clsx";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "constants/pagingSetting";
import {
  APPROVE,
  ASSIGN,
  CHANGE_STATUS,
  CHECK_SCORE,
  CREATE,
  ESCALATE,
  FETCH,
  IMPORT,
  KYB_UPDATE_BUSINESS_INFORMATION,
  ON_GOING_MONITORING_CHANGE,
  REASSIGN,
  REJECT,
  RE_SCREENED,
  RE_SCREENING_SETTING,
  UPDATE,
  MATCHED,
} from "constants/ViewLogType";
import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDate, LONG_DATE_TIME } from "util/date";
import { getFullName } from "util/string";
import { getEventType, getLabelViewLog } from "util/viewLog";
import styles from "./style.module.scss";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import CustomScrollbar from "@protego/sdk/RegtankUI/v1/Scrollbar";

const getIconViewLog = (type) => {
  switch (type) {
    case ESCALATE: {
      return <EscalateIcon />;
    }
    case APPROVE: {
      return <ApproveIcon />;
    }
    case REJECT: {
      return <RejectIcon />;
    }
    case ASSIGN: {
      return <AssignIcon />;
    }
    case REASSIGN: {
      return <AssignIcon />;
    }
    case CREATE: {
      return <CreateIcon />;
    }
    case IMPORT: {
      return <CreateIcon />;
    }
    case RE_SCREENED: {
      return <RescreenIcon />;
    }
    case RE_SCREENING_SETTING: {
      return <IcRescreeningSettingIcon />;
    }
    case ON_GOING_MONITORING_CHANGE: {
      return <IcRescreeningSettingIcon />;
    }
    case FETCH: {
      return <FetchIcon />;
    }
    case KYB_UPDATE_BUSINESS_INFORMATION: {
      return <BusinessIcon />;
    }
    case UPDATE: {
      return <BusinessIcon />;
    }
    case CHECK_SCORE: {
      return <CheckScore />;
    }
    case CHANGE_STATUS: {
      return <ResolveIcon />;
    }
    case MATCHED: {
      return <MatchIcon />;
    }
    default:
      return "";
  }
};

const getNameUserAction = (payload) => {
  if (payload?.eventType)
    switch (payload?.eventType) {
      case ESCALATE: {
        return getFullName(payload?.payload);
      }
      case ASSIGN: {
        return getFullName(payload?.payload?.assignee);
      }
      default:
        return getFullName(payload?.createdBy);
    }
};
const Content = ({ data, onPressViewMore, isReadMore }) => {
  const isSelect = data?.id === isReadMore?.id ? true : false;
  const toggledClass =
    isReadMore.readMore && isSelect ? styles.expanded : styles.collapsed;

  return (
    <>
      <Grid item xs={5}>
        <div className={"d-flex flex-column"}>
          <span className={styles.label}>
            <IntlMessages id={"kyc.view.log.activity"} />
          </span>
          <div className={clsx(styles.gridItem, "d-flex align-items-center")}>
            {getIconViewLog(data?.eventType) && (
              <div className={styles.icActivityLog}>
                {getIconViewLog(data?.eventType)}
              </div>
            )}
            <Nullable>
              <span className={styles.text}>
                {getEventType(data?.eventType) && (
                  <IntlMessages id={getEventType(data?.eventType)} />
                )}
              </span>
            </Nullable>
          </div>
        </div>
      </Grid>
      <Grid item xs={4}>
        <div className={"d-flex flex-column"}>
          <span className={styles.label}>
            {getLabelViewLog(data?.eventType) && (
              <IntlMessages id={getLabelViewLog(data?.eventType)} />
            )}
          </span>
          <div className={clsx(styles.gridItem, "d-flex align-items-center")}>
            <Nullable>
              <span className={styles.updateBy}>{getNameUserAction(data)}</span>
            </Nullable>
          </div>
        </div>
      </Grid>
      <Grid item xs={3}>
        <div className={"d-flex flex-column"}>
          <span className={styles.label}>
            <IntlMessages id={"kyc.view.log.date.time"} />
          </span>
        </div>
        <div className={clsx(styles.gridItem, "d-flex align-items-center")}>
          <Nullable>
            <span className={styles.text}>
              {formatDate(data?.updatedAt, LONG_DATE_TIME)}
            </span>
          </Nullable>
        </div>
      </Grid>
      {data?.payload?.notes && (
        <Grid item xs={12} className={styles.itemNote}>
          <div className={"d-flex flex-column"}>
            <span className={styles.label}>
              <IntlMessages id={"kyc.Notes"} />
            </span>
            <div
              className={clsx(
                styles.noteContent,
                isReadMore.readMore && isSelect ? styles.breakWord : "d-flex"
              )}
            >
              {isReadMore.readMore && isSelect ? (
                <>{data?.payload?.notes}</>
              ) : (
                <div
                  className={
                    isReadMore.readMore && isSelect
                      ? ""
                      : clsx(styles.content, toggledClass)
                  }
                >
                  {data?.payload?.notes}
                </div>
              )}
              {data?.payload?.notes?.length > 90 && (
                <span
                  className={styles.viewMore}
                  onClick={() =>
                    onPressViewMore({
                      isReadMore: isReadMore?.readMore,
                      id: data?.id,
                    })
                  }
                >
                  {isReadMore.readMore && isSelect ? (
                    <IntlMessages id={"kyc.view.log.view.less"} />
                  ) : (
                    <IntlMessages id={"kyc.view.log.view.more"} />
                  )}
                </span>
              )}
            </div>
          </div>
        </Grid>
      )}
      <Grid item xs={12} className={styles.dividerPadding}>
        <Divider />
      </Grid>
    </>
  );
};

const ActivityLog = ({ isOpen, onClose, refId, title, cleanState }) => {
  const dispatch = useDispatch();
  const [activityLogCurrent, setActivityLogCurrent] = React.useState([]);
  const activityLog = useSelector((state) => state.kyc.activityLog);
  const [page, setPage] = React.useState(DEFAULT_PAGE);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [pending_process, setPending_process] = React.useState(true);
  const listInnerRef = React.useRef();
  const [loadingMain, setLoadingMain] = React.useState(false);

  React.useEffect(() => {
    if (activityLog?.records?.length >= DEFAULT_PAGE_SIZE || page === 0) {
      setPending_process(true);
      fetch();
    }
    // eslint-disable-next-line
  }, [page]);

  React.useEffect(() => {
    /**
     * Clean old state in component
     */
    return () => {
      dispatch(CLEAN_STATE_ACTIVITY_LOG());
    };
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    if (activityLog?.records?.length > 0) {
      setActivityLogCurrent([...activityLogCurrent, ...activityLog?.records]);
      if (page === 0) {
        setActivityLogCurrent(activityLog?.records);
      }
      setPending_process(false);
      setIsLoadingMore(
        activityLog?.records?.length === DEFAULT_PAGE_SIZE ? true : false
      );
    } else {
      setIsLoadingMore(false);
    }
    // eslint-disable-next-line
  }, [activityLog]);

  const fetch = () => {
    if (!isLoadingMore) {
      setLoadingMain(true);
    }
    if (refId) {
      dispatch(
        ACTION_ACTIVITY_LOG_MAIN({
          refId: refId,
          params: { page: page, size: DEFAULT_PAGE_SIZE },
        })
      ).then(() => {
        setLoadingMain(false);
      });
    }
  };

  const [isReadMore, setIsReadMore] = React.useState({
    readMore: false,
    id: null,
  });

  const onPressViewMore = ({ isReadMore, id }) => {
    setIsReadMore({ readMore: !isReadMore, id: id });
  };

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        if (isLoadingMore && !pending_process) {
          setPage(page + 1);
          return;
        }
      }
    }
  };

  return (
    <Fragment>
      <div className={"d-flex align-items-center justify-content-center"}>
        <Dialog
          maxWidth="sm"
          fullWidth
          open={isOpen}
          onClose={onClose}
          className={styles.dialogWrapper}
        >
          <CloseableDialogTitle onClose={onClose}>
            {title ? title : <IntlMessages id={"kyc.view.log.activity.log"} />}
          </CloseableDialogTitle>
          <LoadingWrapper loading={loadingMain}>
            <DialogContent
              onScroll={() => onScroll()}
              ref={listInnerRef}
              className={styles.contentHeight}
            >
              <CustomScrollbar autoHeight={false}>
                <div className={styles.dialogContent}>
                  {activityLogCurrent?.length === 0 && !loadingMain && (
                    <div className={"d-flex flex-column  align-items-center"}>
                      <span className={clsx(styles.textPlaceholder, "mt-4")}>
                        <IntlMessages id={"no.records.found"} />
                      </span>
                    </div>
                  )}
                  {activityLogCurrent?.map((item, index) => {
                    return (
                      <Grid
                        container
                        key={index}
                        className={styles.itemContent}
                      >
                        <Content
                          data={item}
                          onPressViewMore={onPressViewMore}
                          isReadMore={isReadMore}
                        />
                      </Grid>
                    );
                  })}
                  {isLoadingMore && (
                    <LoadingWrapper loading={true}>
                      <div></div>
                    </LoadingWrapper>
                  )}
                </div>
              </CustomScrollbar>
            </DialogContent>
          </LoadingWrapper>
        </Dialog>
      </div>
    </Fragment>
  );
};

export default React.memo(ActivityLog);
