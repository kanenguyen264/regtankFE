import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Link from "@protego/sdk/RegtankUI/v1/Link/Link";
import clsx from "clsx";
import { NEW_RISK } from "constants/KYTOM";
import React from "react";
import { useIntl } from "react-intl";
import { getMatchStatusTranslate } from "util/kycMatchStatus";
import { getFullName } from "util/string";
import styles from "./../AuditPage.module.scss";
import AuditItemUpdateKybRisk from "./AuditItemUpdateKybRisk";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl";
import {
  APPROVE,
  REJECT,
  ESCALATE,
  BL_MATCHED,
  BL_DEACTIVATE,
  BL_ACTIVATE,
  DJ_KYC_CHANGE_SEARCH_TYPE,
} from "constants/ViewLogType";
import {
  KYC_ROUTE_KYC_SCREEN_RESULT,
  KYC_ROUTE_KYC_SCREEN_SCORING,
  KYB_ROUTE_KYB_SCREEN_RESULT,
  KYB_ROUTE_RISK_ASSESSMENT,
  KYT_ROUTE_SCREEN,
  SETTING_BLACK_LIST_KYC,
  LIVENESS_ROUTE_LIVENESS_DETAIL,
  DJ_KYC_ROUTE_KYC_SCREEN_SCORING,
  DJ_KYC_ROUTE_KYC_SCREEN_RESULT,
  KYB_ROUTE_KYB_SCREEN_DETAIL,
} from "constants/routes";
import {
  EDIT_RISK_SCORE_NOTE,
  CONFIDENCE_SETTING,
} from "constants/ActionTypes";
import { generatePath } from "@protego/sdk/utils/router";

// TODO: refactor this pile of shit code
const ItemAudit = React.memo(function ItemAudit(props) {
  const DOT_END = <IntlMessages id="audit.dotEnd" />;
  const { item } = props;
  const intl = useIntl();
  const onPressActivityUser = (item) => {};
  const textAction = (type) => {
    switch (type) {
      case "LOGIN":
        return <IntlMessages id="audit.login" />;
      case "LOGOUT":
        return <IntlMessages id="audit.logout" />;
      default:
        break;
    }
  };

  const getContentReScreen = (value) => {
    let content =
      intl.formatMessage({
        id: "kyt.audit.risk.score",
      }) +
      ` ${value?.from} ` +
      intl.formatMessage({
        id: "kyt.view.change.log.risk.score.to",
      }) +
      ` ${value?.to}`;

    return content;
  };

  const getContentOnGoingChange = (value) => {
    let status = value?.payload?.to
      ? intl.formatMessage({ id: "kyt.audit.change.enable" })
      : intl.formatMessage({ id: "kyt.audit.change.disable" });
    let messageId = "kyt.audit.change.transaction";

    if (value?.payload?.type === NEW_RISK) {
      messageId = "kyt.audit.change.risk.score";
    }
    return (
      <span>
        {status} {<FormattedHTMLMessage id={messageId} />}
      </span>
    );
  };
  const getContentOnGoingChangeKYC = (value) => {
    return (
      <>
        {" "}
        {
          {
            ENABLE: <IntlMessages id="audit.activity.enable" />,
            DISABLE: <IntlMessages id="audit.activity.disable" />,
            RE_ENABLE: <IntlMessages id="audit.activity.reEnable" />,
          }[value]
        }{" "}
        <IntlMessages id="audit.activity.kyc.onGoingMonitoringFor" />{" "}
      </>
    );
  };
  const getContentOnGoingChangeKYB = (value) => {
    return (
      <>
        {" "}
        {
          {
            ENABLE: <IntlMessages id="audit.activity.enable" />,
            DISABLE: <IntlMessages id="audit.activity.disable" />,
            RE_ENABLE: <IntlMessages id="audit.activity.reEnable" />,
          }[value]
        }{" "}
        <IntlMessages id="audit.activity.kyb.onGoingMonitoringFor" />{" "}
      </>
    );
  };
  const showKeywordText = (keywordsArr) => {
    if (keywordsArr && keywordsArr.length) {
      return (
        <span>
          {" "}
          <IntlMessages id="audit.created.withKeywords" />{" "}
          {keywordsArr.map((keyword, index) => {
            if (index === keywordsArr.length - 1) {
              return (
                <span key={index}>
                  {" "}
                  <span className={styles.textBold}>{keyword}</span>
                </span>
              );
            }
            return (
              <span key={index}>
                {" "}
                <span className={styles.textBold}>{keyword}</span>
                {", "}
              </span>
            );
          })}
        </span>
      );
    }
  };
  if (!item) {
    return;
  }
  switch (item.eventType) {
    case "ASSIGN":
      let arrayRefId = item.payload.refId.split(",");
      return (
        <div>
          <div>
            <div>
              <span className={clsx(styles.Link)}>
                <span>
                  <Link to={`/app/staff/${item.createdBy?.id}`}>
                    {getFullName(item.createdBy)}
                  </Link>{" "}
                </span>
              </span>
              <text className={styles.textStatus}>
                <IntlMessages id="audit.assigned" />{" "}
                {
                  {
                    KycRequest: arrayRefId.map((item, index) => {
                      return (
                        <span key={index}>
                          <Link to={`/app/screen-kyc/result/${item}`}>
                            {item}
                          </Link>
                          {index < arrayRefId.length - 1 ? ", " : " "}
                        </span>
                      );
                    }),

                    KytRequest: arrayRefId.map((item, index) => {
                      return (
                        <span key={index}>
                          <Link to={`/app/kyt/kyt-screen/${item}?source=list`}>
                            {item}
                          </Link>
                          {index < arrayRefId.length - 1 ? ", " : " "}
                        </span>
                      );
                    }),
                    KybRequest: arrayRefId.map((item, index) => {
                      return (
                        <span key={index}>
                          <Link to={`/app/screen-kyb/result/${item}`}>
                            {item}
                          </Link>
                          {index < arrayRefId.length - 1 ? ", " : " "}
                        </span>
                      );
                    }),
                    DjKycRequest: arrayRefId.map((item, index) => {
                      return (
                        <span key={index}>
                          <Link to={`/app/dj-kyc/result/${item}`}>{item}</Link>
                          {index < arrayRefId.length - 1 ? ", " : " "}
                        </span>
                      );
                    }),
                  }[item.tableName]
                }
              </text>
              <IntlMessages id="audit.assignedTo" />{" "}
              <span className={clsx(styles.Link)}>
                <span>
                  <Link to={`/app/staff/${item?.payload?.assignee?.id}`}>
                    {getFullName(item?.payload?.assignee).trim()}
                  </Link>
                </span>
              </span>
              <span>{DOT_END}</span>
            </div>
          </div>
        </div>
      );
    case "CHANGE_STATUS":
      return (
        <div>
          <div>
            <div>
              <span className={clsx(styles.Link)}>
                <span>
                  <Link to={`/app/staff/${item?.createdBy?.id}`}>
                    {getFullName(item?.createdBy)}
                  </Link>
                </span>
              </span>
              <text>
                {" "}
                <IntlMessages id="audit.changed" />
                {"  "}
              </text>
              <span onClick={() => onPressActivityUser(item.id)}>
                {
                  {
                    KycRequest: (
                      <Link
                        to={`/app/screen-kyc/result/${item?.payload?.refId}`}
                      >
                        {item?.payload?.refId}
                      </Link>
                    ),
                    KycIndividualMatch: (
                      <Link
                        to={`/app/screen-kyc/result/${item?.payload?.kycId}/match/${item?.payload?.refId}`}
                      >
                        {`${item?.payload?.kycId} - ${item?.payload?.refId}`}
                      </Link>
                    ),
                    KybRequest: (
                      <Link
                        to={`/app/screen-kyb/result/${item?.payload?.refId}`}
                      >
                        {item?.payload?.refId}
                      </Link>
                    ),
                    KybMatch: (
                      <Link
                        to={`/app/screen-kyb/result/${item?.payload?.kybId}/match/${item?.payload?.refId}`}
                      >
                        {`${item?.payload?.kybId} - ${item?.payload?.refId}`}
                      </Link>
                    ),
                    DjKycIndividualMatch: (
                      <Link
                        to={`/app/dj-kyc/result/${item?.payload?.djKycId}/match/${item?.payload?.refId}`}
                      >
                        {`${item?.payload?.djKycId} - ${item?.payload?.refId}`}
                      </Link>
                    ),
                    DjKycRequest: (
                      <Link to={`/app/dj-kyc/result/${item?.payload?.refId}`}>
                        {item?.payload?.refId}
                      </Link>
                    ),
                  }[item?.tableName]
                }
              </span>
              {item?.tableName !== "KybRiskAssessmentEntity" && (
                <>
                  <text>
                    {" "}
                    <IntlMessages id="audit.statusFrom" />
                  </text>{" "}
                  <text className={clsx(styles.textStatus, styles.textBold)}>
                    {item &&
                      item.payload &&
                      intl.formatMessage({
                        id: getMatchStatusTranslate(item?.payload?.from),
                      })}
                  </text>
                  <text>
                    {" "}
                    <IntlMessages id="audit.to" />{" "}
                  </text>
                  <text className={clsx(styles.textStatus, styles.textBold)}>
                    {item &&
                      item.payload &&
                      intl.formatMessage({
                        id: getMatchStatusTranslate(item?.payload?.to),
                      })}
                  </text>
                </>
              )}

              {item?.tableName === "KybRiskAssessmentEntity" && (
                <>
                  <Link
                    to={`/app/screen-kyb/result/${item?.payload?.kybId}/riskAssessment`}
                  >
                    <IntlMessages id="kyb.risk.assessment.header.title"></IntlMessages>
                  </Link>{" "}
                  {item?.payload?.from !== "" && (
                    <>
                      <text>
                        <IntlMessages id="audit.statusFrom" />{" "}
                      </text>
                      <text

                      // style={{ textTransform: "uppercase" }}
                      >
                        {item &&
                          item.payload &&
                          intl.formatMessage({
                            id: getMatchStatusTranslate(item?.payload?.from),
                          })}
                      </text>{" "}
                    </>
                  )}
                  <text>
                    <IntlMessages id="audit.to" />{" "}
                  </text>
                  <text>
                    {item &&
                      item.payload &&
                      intl.formatMessage({
                        id: getMatchStatusTranslate(item?.payload?.to),
                      })}
                  </text>{" "}
                  <IntlMessages id="kyb.risk.assessment.history.of"></IntlMessages>{" "}
                  <Link to={`/app/screen-kyb/result/${item?.payload?.kybId}`}>
                    {item?.payload?.kybId}
                  </Link>
                </>
              )}
              <span>{DOT_END}</span>
            </div>
          </div>
        </div>
      );
    case "RENAME":
      return (
        <span>
          <span className={clsx(styles.Link)}>
            <span>
              <Link to={`/app/staff/${item?.createdBy?.id}`}>
                {getFullName(item?.createdBy)}
              </Link>
            </span>
          </span>{" "}
          {
            {
              KycWatchGroup: (
                <span>
                  {" "}
                  <IntlMessages id={"audit.renameGL"} />{" "}
                  <span>
                    <span className={styles.textBold}>
                      {item.payload.oldGroupName}
                    </span>{" "}
                  </span>{" "}
                  <IntlMessages id={"audit.to"} />{" "}
                  <span>
                    <Link to={`/app/kyc/my-kyc/groupList`}>
                      {item.payload.groupName}
                    </Link>
                  </span>
                  .{" "}
                </span>
              ),
              DjKycWatchGroup: (
                <span>
                  {" "}
                  <IntlMessages id={"audit.renameDJGL"} />{" "}
                  <span className={styles.textBold}>
                    {item.payload.oldGroupName}
                  </span>{" "}
                  <IntlMessages id={"audit.to"} />{" "}
                  <span>
                    <Link to={`/app/dj-kyc/my-kyc/groupList`}>
                      {item.payload.groupName}
                    </Link>
                  </span>
                  .{" "}
                </span>
              ),
            }[item?.tableName]
          }
        </span>
      );
    case "REMOVE":
      return (
        <span>
          <span className={clsx(styles.Link)}>
            <span>
              <Link to={`/app/staff/${item?.createdBy?.id}`}>
                {getFullName(item?.createdBy)}
              </Link>
            </span>
          </span>{" "}
          <IntlMessages id={"audit.filter.removed"} />{" "}
          {
            {
              KycWatchList: (
                <span>
                  <Link
                    to={generatePath(KYC_ROUTE_KYC_SCREEN_RESULT, {
                      kycId: item.payload?.refId,
                    })}
                  >
                    {item.payload?.refId}
                  </Link>{" "}
                  <IntlMessages id="audit.removeGL"></IntlMessages>{" "}
                  <span>
                    <Link to={`/app/kyc/my-kyc/groupList`}>
                      {item.payload.groupName}
                    </Link>
                  </span>
                  .
                </span>
              ),
              DjKycWatchList: (
                <span>
                  <Link
                    to={generatePath(DJ_KYC_ROUTE_KYC_SCREEN_RESULT, {
                      kycId: item.payload?.refId,
                    })}
                  >
                    {item.payload?.refId}
                  </Link>{" "}
                  <IntlMessages id="audit.removeDJGL"></IntlMessages>{" "}
                  <span>
                    <Link to={`/app/dj-kyc/my-kyc/groupList`}>
                      {item.payload.groupName}
                    </Link>
                  </span>
                  .
                </span>
              ),
            }[item?.tableName]
          }{" "}
          {/* */}
        </span>
      );
    case "ADD":
      return (
        <span>
          <span className={clsx(styles.Link)}>
            <span>
              <Link to={`/app/staff/${item?.createdBy?.id}`}>
                {getFullName(item?.createdBy)}
              </Link>
            </span>
          </span>{" "}
          <IntlMessages id={"audit.added"} />{" "}
          {
            {
              KycWatchList: (
                <span>
                  <Link
                    to={generatePath(KYC_ROUTE_KYC_SCREEN_RESULT, {
                      kycId: item.payload?.refId,
                    })}
                  >
                    {item.payload?.refId}
                  </Link>{" "}
                  <IntlMessages id="audit.addedGL"></IntlMessages>{" "}
                  <span>
                    <Link to={`/app/kyc/my-kyc/groupList`}>
                      {item.payload.groupName}
                    </Link>
                  </span>
                  .
                </span>
              ),
              DjKycWatchList: (
                <span>
                  <Link
                    to={generatePath(DJ_KYC_ROUTE_KYC_SCREEN_RESULT, {
                      kycId: item.payload?.refId,
                    })}
                  >
                    {item.payload?.refId}
                  </Link>{" "}
                  <IntlMessages id="audit.addedDJGL"></IntlMessages>{" "}
                  <span>
                    <Link to={`/app/dj-kyc/my-kyc/groupList`}>
                      {item.payload.groupName}
                    </Link>
                  </span>
                  .
                </span>
              ),
            }[item?.tableName]
          }{" "}
          {/* */}
        </span>
      );
    case "ARCHIVE":
      return (
        <span>
          <span className={clsx(styles.Link)}>
            <span>
              <Link to={`/app/staff/${item?.createdBy?.id}`}>
                {getFullName(item?.createdBy)}
              </Link>
            </span>
          </span>{" "}
          <IntlMessages id={"audit.added"} />{" "}
          {
            {
              KycRequest: (
                <span>
                  <Link
                    to={generatePath(KYC_ROUTE_KYC_SCREEN_RESULT, {
                      kycId: item.payload?.refId,
                    })}
                  >
                    {item.payload?.refId}
                  </Link>{" "}
                  <FormattedMessage
                    id={"audit.AL"}
                    values={{
                      b: (msg) => (
                        <span className={styles.textBold}>{msg}</span>
                      ),
                    }}
                  />
                </span>
              ),
              DjKycRequest: (
                <span>
                  <Link
                    to={generatePath(DJ_KYC_ROUTE_KYC_SCREEN_RESULT, {
                      kycId: item.payload?.refId,
                    })}
                  >
                    {item.payload?.refId}
                  </Link>{" "}
                  <FormattedMessage
                    id={"audit.DJAL"}
                    values={{
                      b: (msg) => (
                        <span className={styles.textBold}>{msg}</span>
                      ),
                    }}
                  />
                </span>
              ),
            }[item?.tableName]
          }{" "}
          {/* */}
        </span>
      );
    case "UNARCHIVE":
      return (
        <span>
          <span className={clsx(styles.Link)}>
            <span>
              <Link to={`/app/staff/${item?.createdBy?.id}`}>
                {getFullName(item?.createdBy)}
              </Link>
            </span>
          </span>{" "}
          <IntlMessages id={"audit.filter.removed"} />{" "}
          {
            {
              KycRequest: (
                <span>
                  <Link
                    to={generatePath(KYC_ROUTE_KYC_SCREEN_RESULT, {
                      kycId: item.payload?.refId,
                    })}
                  >
                    {item.payload?.refId}
                  </Link>{" "}
                  <FormattedMessage
                    id={"audit.RMAL"}
                    values={{
                      b: (msg) => (
                        <span className={styles.textBold}>{msg}</span>
                      ),
                    }}
                  />
                </span>
              ),
              DjKycRequest: (
                <span>
                  <Link
                    to={generatePath(DJ_KYC_ROUTE_KYC_SCREEN_RESULT, {
                      kycId: item.payload?.refId,
                    })}
                  >
                    {item.payload?.refId}
                  </Link>{" "}
                  <FormattedMessage
                    id={"audit.RMDJAL"}
                    values={{
                      b: (msg) => (
                        <span className={styles.textBold}>{msg}</span>
                      ),
                    }}
                  />
                </span>
              ),
            }[item?.tableName]
          }{" "}
          {/* */}
        </span>
      );
    case "LOGOUT":
    case "LOGIN":
      return (
        <div>
          <div>
            <div>
              <span className={clsx(styles.Link)}>
                <span>
                  <Link to={`/app/staff/${item?.createdBy?.id}`}>
                    {getFullName(item?.createdBy)}
                  </Link>{" "}
                </span>
              </span>
              <span>
                {textAction(item.eventType)}
                {DOT_END}
              </span>
            </div>
          </div>
        </div>
      );
    case "CREATE":
      return (
        <div>
          <div>
            <div>
              {item?.createdBy ? (
                <span className={clsx(styles.Link)}>
                  <span>
                    <Link to={`/app/staff/${item?.createdBy?.id}`}>
                      {getFullName(item?.createdBy)}
                    </Link>{" "}
                  </span>
                </span>
              ) : (
                <span>
                  {item?.payload?.clientType === "EXCHANGE" ? (
                    <IntlMessages id="audit.exchange.user" />
                  ) : (
                    ""
                  )}{" "}
                </span>
              )}
              <text>
                {
                  {
                    Case: (
                      <span>
                        <span>
                          <IntlMessages id="audit.created" />{" "}
                        </span>
                      </span>
                    ),
                    User: (
                      <span>
                        <span>
                          <IntlMessages id="audit.created" />{" "}
                        </span>
                      </span>
                    ),
                    KycRequest: (
                      <span>
                        <span>
                          <IntlMessages id="audit.created" />{" "}
                        </span>
                      </span>
                    ),
                    KytRequest: (
                      <span>
                        <span>
                          <IntlMessages id="audit.created" />{" "}
                        </span>
                      </span>
                    ),
                    KybRequest: (
                      <span>
                        <span>
                          <IntlMessages id="audit.created" />{" "}
                        </span>
                      </span>
                    ),
                    KycBlacklist: (
                      <span>
                        <span>
                          <IntlMessages id="audit.filter.CREATE.added" />{" "}
                        </span>
                      </span>
                    ),
                    DjKycRequest: (
                      <span>
                        <span>
                          <IntlMessages id="audit.created" />{" "}
                        </span>
                      </span>
                    ),

                    KycWatchGroup: (
                      <span>
                        <span>
                          <IntlMessages id="audit.createdAcurisGL" />{" "}
                        </span>
                      </span>
                    ),
                    DjKycWatchGroup: (
                      <span>
                        <span>
                          <IntlMessages id="audit.createdDJGL" />{" "}
                        </span>
                      </span>
                    ),
                  }[item.tableName]
                }
              </text>
              <text>
                {
                  {
                    Case: (
                      <Link to={`/app/case/detail/${item.payload.refId}`}>
                        <IntlMessages id="sidebar.case" />
                      </Link>
                    ),
                    KycRequest: (
                      <span>
                        <Link
                          to={`/app/screen-kyc/result/${item.payload.refId}`}
                        >
                          {item.payload.refId}
                        </Link>
                        {showKeywordText(item.payload.keywords)}
                      </span>
                    ),
                    KytRequest: (
                      <Link
                        to={`/app/kyt/kyt-screen/${item.payload.refId}?source=list`}
                      >
                        {item.payload.refId}
                      </Link>
                    ),
                    User: (
                      <Link to={`/app/staff/${item.payload.refId}`}>
                        <IntlMessages id="role.user" />
                      </Link>
                    ),
                    KybRequest: (
                      <Link to={`/app/screen-kyb/result/${item.payload.refId}`}>
                        {item.payload.refId}
                      </Link>
                    ),
                    KycBlacklist: (
                      <span>
                        <Link to={SETTING_BLACK_LIST_KYC}>
                          {item.payload.refId}
                        </Link>{" "}
                        <span>
                          <IntlMessages id={"audit.filter.to.kyc"} />
                        </span>
                      </span>
                    ),
                    DjKycRequest: (
                      <span>
                        <Link to={`/app/dj-kyc/result/${item.payload.refId}`}>
                          {item.payload.refId}
                        </Link>
                      </span>
                    ),
                    KycWatchGroup: (
                      <span>
                        <Link to={`/app/kyc/my-kyc/groupList`}>
                          {item.payload.groupName}
                        </Link>
                      </span>
                    ),
                    DjKycWatchGroup: (
                      <span>
                        <Link to={`/app/dj-kyc/my-kyc/groupList`}>
                          {item.payload.groupName}
                        </Link>
                      </span>
                    ),
                  }[item.tableName]
                }
              </text>
              <span>{DOT_END}</span>
            </div>
          </div>
        </div>
      );
    case "IMPORT":
      return (
        <div>
          <span className={clsx(styles.Link)}>
            <span>
              <Link to={`/app/staff/${item?.createdBy?.id}`}>
                {getFullName(item?.createdBy)}
              </Link>{" "}
            </span>
          </span>
          <span>
            <IntlMessages id="audit.imported" />{" "}
          </span>
          {
            {
              KycRequest: (
                <span>
                  <Link to={`/app/screen-kyc/result/${item.payload.refId}`}>
                    {item.payload.refId}
                  </Link>
                </span>
              ),

              DjKycRequest: (
                <span>
                  <Link to={`/app/dj-kyc/result/${item.payload.refId}`}>
                    {item.payload.refId}
                  </Link>
                </span>
              ),
              KybRequest: (
                <span>
                  <Link to={`/app/screen-kyb/result/${item.payload.refId}`}>
                    {item.payload.refId}
                  </Link>
                </span>
              ),
            }[item.tableName]
          }
          <span>{DOT_END}</span>
        </div>
      );
    case "CHANGE_FILTER_LEVEL":
      return (
        <div>
          <div>
            <div>
              <span className={clsx(styles.Link)}>
                <span>
                  <Link to={`/app/staff/${item?.createdBy?.id}`}>
                    {getFullName(item?.createdBy)}
                  </Link>
                </span>
              </span>
              <text className={styles.textStatus}>
                <IntlMessages id="audit.changedTheNameFilterLevel" />
                {
                  {
                    SettingKYB: (
                      <span>
                        Acuris KYB{" "}
                        <text className={styles.textSettingValue}>
                          <IntlMessages id="audit.from" />
                        </text>{" "}
                        <span>
                          <text
                            className={clsx(styles.textStatus, styles.textBold)}
                          >
                            {item.payload.from}%{" "}
                          </text>
                          <text className={styles.textSettingValue}>
                            <IntlMessages id="audit.to" />
                          </text>{" "}
                          <text
                            className={clsx(styles.textStatus, styles.textBold)}
                          >
                            {item.payload.to}%{" "}
                          </text>
                          {DOT_END}
                        </span>
                      </span>
                    ),

                    SettingKYC: (
                      <span>
                        {" "}
                        Acuris KYC{" "}
                        <text className={styles.textSettingValue}>
                          <IntlMessages id="audit.from" />
                        </text>{" "}
                        <span>
                          <text
                            className={clsx(styles.textStatus, styles.textBold)}
                          >
                            {item.payload.from}%{" "}
                          </text>
                          <text className={styles.textSettingValue}>
                            <IntlMessages id="audit.to" />
                          </text>{" "}
                          <text
                            className={clsx(styles.textStatus, styles.textBold)}
                          >
                            {item.payload.to}%
                          </text>
                          {DOT_END}
                        </span>
                      </span>
                    ),
                    SettingDJKYC: (
                      <span>
                        {" "}
                        Dow Jones KYC{" "}
                        <text className={styles.textSettingValue}>
                          <IntlMessages id="audit.from" />
                        </text>{" "}
                        <span>
                          <text
                            className={clsx(styles.textStatus, styles.textBold)}
                          >
                            <IntlMessages id={`audit.` + item.payload.from} />{" "}
                          </text>
                          <text className={styles.textSettingValue}>
                            <IntlMessages id="audit.to" />
                          </text>{" "}
                          <text
                            className={clsx(styles.textStatus, styles.textBold)}
                          >
                            <IntlMessages id={`audit.` + item.payload.to} />
                          </text>
                          {DOT_END}
                        </span>
                      </span>
                    ),
                  }[item.tableName]
                }
              </text>
            </div>
          </div>
        </div>
      );
    case "DELETE":
      return (
        <div>
          <div>
            <div>
              {
                {
                  User: (
                    <div>
                      <span style={{ fontWeight: "bold" }}>{` ${getFullName(
                        item.payload
                      )}`}</span>

                      <text>
                        {" "}
                        <IntlMessages id="audit.hasBeenRemoved" />{" "}
                        <span className={clsx(styles.Link)}>
                          <span>
                            <Link to={`/app/staff/${item?.createdBy?.id}`}>
                              {getFullName(item.createdBy)}
                            </Link>
                          </span>
                        </span>
                      </text>
                      <span>{DOT_END}</span>
                    </div>
                  ),
                  KycBlacklist: (
                    <div>
                      <Link to={`/app/staff/${item?.createdBy?.id}`}>
                        {getFullName(item.createdBy)}
                      </Link>
                      <text>
                        {" "}
                        <IntlMessages id="audit.filter.removed" />{" "}
                        <span className={clsx(styles.Link)}>
                          <span>
                            <Link to={SETTING_BLACK_LIST_KYC}>
                              {item?.payload?.refId}
                            </Link>
                          </span>{" "}
                        </span>
                      </text>
                      <span>
                        <IntlMessages id={"audit.filter.from.kyc"} />
                      </span>
                      <span>{DOT_END}</span>
                    </div>
                  ),
                  KycWatchGroup: (
                    <div>
                      <Link to={`/app/staff/${item?.createdBy?.id}`}>
                        {getFullName(item.createdBy)}
                      </Link>
                      <IntlMessages id={"audit.deleteGroupList"} />{" "}
                      <span>
                        <Link to={`/app/kyc/my-kyc/groupList`}>
                          {item.payload.groupName}
                        </Link>
                      </span>
                      <span>{DOT_END}</span>
                    </div>
                  ),
                  DjKycWatchGroup: (
                    <div>
                      <Link to={`/app/staff/${item?.createdBy?.id}`}>
                        {getFullName(item.createdBy)}
                      </Link>
                      <IntlMessages id={"audit.deleteDJGroupList"} />{" "}
                      <span>
                        <Link to={`/app/dj-kyc/my-kyc/groupList`}>
                          {item.payload.groupName}
                        </Link>
                      </span>
                      <span>{DOT_END}</span>
                    </div>
                  ),
                }[item.tableName]
              }
            </div>
          </div>
        </div>
      );
    case "CHANGE_RISK_SCORE":
      return (
        <div>
          <div>
            <div>
              <span className={clsx(styles.Link)}>
                <label>
                  <Link to={`/app/staff/${item?.createdBy?.id}`}>
                    {getFullName(item.createdBy)}
                  </Link>
                </label>
              </span>
              <span>
                <FormattedMessage
                  id={"audit.editTotalRickScore"}
                  values={{
                    b: (msg) => <span className={styles.textBold}>{msg}</span>,
                  }}
                />
              </span>
              <span>
                {
                  {
                    KycIndividualRiskScoreChange: (
                      <Link
                        to={`/app/screen-kyc/result/${item.payload.kycId}/scoring`}
                      >
                        {item?.payload?.kycId}
                      </Link>
                    ),
                    DjKycIndividualRiskScoreChange: (
                      <Link
                        to={`/app/dj-kyc/result/${item.payload.djKycId}/scoring`}
                      >
                        {item?.payload?.djKycId}
                      </Link>
                    ),
                    KytRiskScoreChange: (
                      <Link to={`/app/kyt/kyt-screen/${item.payload.kytId}`}>
                        {item?.payload?.kytId}
                      </Link>
                    ),
                  }[item.tableName]
                }
              </span>
              <span>
                <IntlMessages id="audit.from" />{" "}
                {` ${Math.round(item?.payload?.from)} `}
                <IntlMessages id="audit.to" /> {Math.round(item?.payload?.to)}
              </span>
              {DOT_END}
            </div>
          </div>
        </div>
      );
    case "FETCH":
      return (
        <div>
          <div>
            <div>
              <span className={clsx(styles.Link)}>
                <span>
                  <Link to={`/app/staff/${item?.createdBy?.id}`}>
                    {getFullName(item.createdBy)}
                  </Link>
                </span>
              </span>{" "}
              <span>
                <IntlMessages id="audit.fetched" />
              </span>{" "}
              <span>{item.payload?.count}</span>{" "}
              <span>
                <Link to={`/app/kyt/kyt-screen/${item.payload?.refId}`}>
                  <IntlMessages id="kyt.transactions" />
                </Link>
              </span>
              {DOT_END}
            </div>
          </div>
        </div>
      );
    case "CHECK_SCORE":
      return (
        <div>
          <div>
            <div>
              <span className={clsx(styles.Link)}>
                <span>
                  <Link to={`/app/staff/${item?.createdBy?.id}`}>
                    {getFullName(item.createdBy)}
                  </Link>
                </span>
              </span>{" "}
              <span>
                <IntlMessages id="audit.checkedScore" />
              </span>{" "}
              <span>
                <Link to={`/app/kyt/kyt-screen/${item.payload?.refId}`}>
                  {item.payload?.refId}
                </Link>
                {DOT_END}
              </span>
            </div>
          </div>
        </div>
      );
    case "REASSIGN":
      return (
        <div>
          <div>
            <div>
              <span style={{ fontWeight: "bold" }}>
                {getFullName(item.payload.oldAssignee)}
              </span>{" "}
              <span>
                <IntlMessages id="audit.testTypeRemoveStaff" />
              </span>{" "}
              <span>
                <Link to={`/app/staff/${item?.payload?.assignee?.id}`}>
                  {getFullName(item.payload.assignee)}
                </Link>
              </span>{" "}
              <span>
                {" "}
                <IntlMessages id="audit.by" />
              </span>{" "}
              <span>
                <Link to={`/app/staff/${item?.payload?.assigner?.id}`}>
                  {getFullName(item.payload.assigner)}
                </Link>
              </span>
              {DOT_END}
            </div>
          </div>
        </div>
      );
    case "ON_GOING_MONITORING_CHANGE":
      return (
        <span>
          <span>
            <Link to={`/app/staff/${item.lastModifiedBy?.id}`}>
              {getFullName(item.lastModifiedBy)}
            </Link>
          </span>{" "}
          {
            {
              KytRequest: (
                <span>
                  {getContentOnGoingChange(item)}{" "}
                  <Link to={`/app/kyt/kyt-screen/${item.payload?.refId}`}>
                    {item.payload?.refId}{" "}
                  </Link>
                  {DOT_END}
                </span>
              ),
              KycRequest: (
                <>
                  {getContentOnGoingChangeKYC(item.payload?.type)}
                  <Link
                    to={generatePath(KYC_ROUTE_KYC_SCREEN_RESULT, {
                      kycId: item.payload?.refId,
                    })}
                  >
                    {item.payload?.refId}
                  </Link>
                  {DOT_END}
                </>
              ),
              DjKycRequest: (
                <>
                  {getContentOnGoingChangeKYC(item.payload?.type)}
                  <Link
                    to={generatePath(DJ_KYC_ROUTE_KYC_SCREEN_RESULT, {
                      kycId: item.payload?.refId,
                    })}
                  >
                    {item.payload?.refId}
                  </Link>
                  {DOT_END}
                </>
              ),
              KybRequest: (
                <>
                  {getContentOnGoingChangeKYB(item.payload?.type)}
                  <Link
                    to={generatePath(KYB_ROUTE_KYB_SCREEN_RESULT, {
                      kybId: item.payload?.refId,
                    })}
                  >
                    {item.payload?.refId}
                  </Link>
                  {DOT_END}
                </>
              ),
            }[item?.tableName]
          }
        </span>
      );

    case "KYT_RE_SCREENED_NEW_TRANSACTION":
      return (
        <div>
          <div>
            <div>
              <Link to={`/app/kyt/kyt-screen/${item.payload?.kytId}`}>
                {item.payload?.kytId}
              </Link>
              <IntlMessages id="kyt.audit.transaction" />
              {DOT_END}
            </div>
          </div>
        </div>
      );
    case "KYT_RE_SCREENED_SCORE_CHANGE":
      return (
        <div>
          <div>
            <div>
              <Link to={`/app/kyt/kyt-screen/${item.payload?.kytId}`}>
                {item?.payload?.kytId}
              </Link>
              {getContentReScreen(item?.payload)}
              {DOT_END}
            </div>
          </div>
        </div>
      );

    case "UPDATE":
      return (
        <>
          {
            {
              KybRiskAssessmentEntity: <AuditItemUpdateKybRisk item={item} />,
              KycBlacklist: (
                <div>
                  <Link to={`/app/staff/${item?.createdBy?.id}`}>
                    {getFullName(item.createdBy)}
                  </Link>
                  <IntlMessages id="updated" />{" "}
                  <text>
                    {" "}
                    <span className={clsx(styles.Link)}>
                      {" "}
                      <span>
                        <Link to={SETTING_BLACK_LIST_KYC}>
                          {item?.payload?.refId}
                        </Link>
                      </span>
                      {""}
                    </span>{" "}
                    <IntlMessages id="audit.filter.blacklist.update" />{" "}
                    <span>{DOT_END}</span>
                  </text>
                </div>
              ),
            }[item.tableName]
          }
        </>
      );
    case "KYB_UPDATE_BUSINESS_INFORMATION":
      return (
        <div>
          <div>
            <Link to={`/app/staff/${item?.createdBy?.id}`}>
              {getFullName(item?.createdBy)}
            </Link>{" "}
            <IntlMessages id="audit.editedBusinessInformationOf" />{" "}
            <Link
              to={`/app/screen-kyb/result/${item.payload?.refId}/riskAssessment`}
            >
              {item.payload?.refId}
            </Link>{" "}
            {DOT_END}
          </div>
        </div>
      );
    case "RE_SCREENED":
      return (
        <span>
          {
            {
              DjKycRequest: (
                <>
                  <Link to={`/app/dj-kyc/result/${item?.payload?.refId}`}>
                    {item?.payload?.refId}
                  </Link>{" "}
                  <FormattedHTMLMessage id="audit.wasRescreenedOnSchedule" />
                </>
              ),
              KybRequest: (
                <>
                  <Link to={`/app/screen-kyb/result/${item?.payload?.refId}`}>
                    {item?.payload?.refId}
                  </Link>{" "}
                  <FormattedHTMLMessage id="audit.wasRescreenedOnSchedule" />
                </>
              ),
              KycRequest: (
                <>
                  <Link to={`/app/screen-kyc/result/${item?.payload?.refId}`}>
                    {item?.payload?.refId}
                  </Link>{" "}
                  <FormattedHTMLMessage id="audit.wasRescreenedOnSchedule" />
                </>
              ),
              KycBlacklistMatch: (
                <>
                  <Link to={`/app/screen-kyc/result/${item?.payload?.refId}`}>
                    {item?.payload?.refId}
                  </Link>{" "}
                  <FormattedHTMLMessage id="setting.blacklist.audit.matched" />
                </>
              ),
            }[item.tableName]
          }
          {DOT_END}
        </span>
      );
    case "RE_SCREENING_SETTING":
      return (
        <span>
          {
            {
              KybRequest: (
                <>
                  <span className={clsx(styles.Link)}>
                    <span>
                      <Link to={`/app/staff/${item?.createdBy?.id}`}>
                        {getFullName(item?.createdBy)}
                      </Link>
                    </span>
                  </span>{" "}
                  <span>
                    {item?.payload?.to === true ? (
                      <IntlMessages id={"audit.enabled"} />
                    ) : (
                      <IntlMessages id={"audit.disabled"} />
                    )}
                  </span>{" "}
                  <IntlMessages id={"audit.rescreeningFor"} />{" "}
                  <Link to={`/app/screen-kyb/result/${item?.payload?.refId}`}>
                    {item?.payload?.refId}
                  </Link>{" "}
                </>
              ),
              KycRequest: (
                <>
                  <span className={clsx(styles.Link)}>
                    <span>
                      <Link to={`/app/staff/${item?.createdBy?.id}`}>
                        {getFullName(item?.createdBy)}
                      </Link>
                    </span>
                  </span>{" "}
                  <span>
                    {item?.payload?.to === true ? (
                      <IntlMessages id={"audit.enabled"} />
                    ) : (
                      <IntlMessages id={"audit.disabled"} />
                    )}
                  </span>{" "}
                  <IntlMessages id={"audit.rescreeningFor"} />{" "}
                  <Link to={`/app/screen-kyc/result/${item?.payload?.refId}`}>
                    {item?.payload?.refId}
                  </Link>{" "}
                </>
              ),
              DjKycRequest: (
                <>
                  <span className={clsx(styles.Link)}>
                    <span>
                      <Link to={`/app/staff/${item?.createdBy?.id}`}>
                        {getFullName(item?.createdBy)}
                      </Link>
                    </span>
                  </span>{" "}
                  <span>
                    {item?.payload?.to === true ? (
                      <IntlMessages id={"audit.enabled"} />
                    ) : (
                      <IntlMessages id={"audit.disabled"} />
                    )}
                  </span>{" "}
                  <IntlMessages id={"audit.rescreeningFor"} />{" "}
                  <Link to={`/app/dj-kyc/result/${item?.payload?.refId}`}>
                    {item?.payload?.refId}
                  </Link>{" "}
                </>
              ),
            }[item.tableName]
          }
          {DOT_END}
        </span>
      );
    case APPROVE: {
      return (
        <div className={styles.itemAuditContainer}>
          <div>
            <span className={clsx(styles.Link)}>
              <span>
                <Link to={`/app/staff/${item.createdBy?.id}`}>
                  {getFullName(item.createdBy)}
                </Link>{" "}
              </span>
            </span>
            <text className={styles.textStatus}>
              {intl
                .formatMessage({ id: "kyc.change.note.approved" })
                .toLowerCase()}
            </text>{" "}
            {
              {
                DjKycRequest: (
                  <Link
                    to={generatePath(DJ_KYC_ROUTE_KYC_SCREEN_SCORING, {
                      kycId: item?.payload?.refId,
                    })}
                  >
                    {item?.payload?.refId}
                  </Link>
                ),
                KybRequest: (
                  <Link
                    to={generatePath(KYB_ROUTE_RISK_ASSESSMENT, {
                      kybId: item?.payload?.refId,
                    })}
                  >
                    {item?.payload?.refId}
                  </Link>
                ),
                KycRequest: (
                  <Link
                    to={generatePath(KYC_ROUTE_KYC_SCREEN_SCORING, {
                      kycId: item?.payload?.refId,
                    })}
                  >
                    {item?.payload?.refId}
                  </Link>
                ),
                KytRequest: (
                  <Link
                    to={generatePath(
                      KYT_ROUTE_SCREEN,
                      { id: item?.payload?.refId },
                      { source: "list" }
                    )}
                    data-cy={"id"}
                  >
                    {item?.payload?.refId}
                  </Link>
                ),
                LivenessVerifyRequest: (
                  <Link
                    to={generatePath(LIVENESS_ROUTE_LIVENESS_DETAIL, {
                      requestId: item?.payload?.refId,
                    })}
                    data-cy={"id"}
                  >
                    {item?.payload?.refId}
                  </Link>
                ),
              }[item.tableName]
            }
            <span>{DOT_END}</span>
          </div>
        </div>
      );
    }
    case REJECT: {
      return (
        <div className={styles.itemAuditContainer}>
          <div>
            <span className={clsx(styles.Link)}>
              <span>
                <Link to={`/app/staff/${item.createdBy?.id}`}>
                  {getFullName(item.createdBy)}
                </Link>{" "}
              </span>
            </span>
            <text className={styles.textStatus}>
              {intl
                .formatMessage({ id: "kyc.change.note.rejected" })
                .toLowerCase()}
            </text>{" "}
            {
              {
                DjKycRequest: (
                  <Link
                    to={generatePath(DJ_KYC_ROUTE_KYC_SCREEN_SCORING, {
                      kycId: item?.payload?.refId,
                    })}
                  >
                    {item?.payload?.refId}
                  </Link>
                ),
                KybRequest: (
                  <Link
                    to={generatePath(KYB_ROUTE_RISK_ASSESSMENT, {
                      kybId: item?.payload?.refId,
                    })}
                  >
                    {item?.payload?.refId}
                  </Link>
                ),
                KycRequest: (
                  <Link
                    to={generatePath(KYC_ROUTE_KYC_SCREEN_SCORING, {
                      kycId: item?.payload?.refId,
                    })}
                  >
                    {item?.payload?.refId}
                  </Link>
                ),
                KytRequest: (
                  <Link
                    to={generatePath(
                      KYT_ROUTE_SCREEN,
                      { id: item?.payload?.refId },
                      { source: "list" }
                    )}
                    data-cy={"id"}
                  >
                    {item?.payload?.refId}
                  </Link>
                ),
                LivenessVerifyRequest: (
                  <Link
                    to={generatePath(LIVENESS_ROUTE_LIVENESS_DETAIL, {
                      requestId: item?.payload?.refId,
                    })}
                    data-cy={"id"}
                  >
                    {item?.payload?.refId}
                  </Link>
                ),
              }[item.tableName]
            }
            <span>{DOT_END}</span>
          </div>
        </div>
      );
    }
    case ESCALATE: {
      return (
        <div className={styles.itemAuditContainer}>
          <div>
            <span className={clsx(styles.Link)}>
              <span>
                <Link to={`/app/staff/${item.createdBy?.id}`}>
                  {getFullName(item.createdBy)}
                </Link>{" "}
              </span>
            </span>
            <text className={styles.textStatus}>
              {intl
                .formatMessage({ id: "kyc.view.log.Escalated" })
                .toLowerCase()}
            </text>{" "}
            {
              {
                KybRequest: (
                  <Link
                    to={generatePath(KYB_ROUTE_KYB_SCREEN_RESULT, {
                      kybId: item?.payload?.refId,
                    })}
                  >
                    {item?.payload?.refId}
                  </Link>
                ),
                KycRequest: (
                  <Link
                    to={generatePath(KYC_ROUTE_KYC_SCREEN_RESULT, {
                      kycId: item?.payload?.refId,
                    })}
                  >
                    {item?.payload?.refId}
                  </Link>
                ),
                DjKycRequest: (
                  <Link
                    to={generatePath(DJ_KYC_ROUTE_KYC_SCREEN_RESULT, {
                      kycId: item?.payload?.refId,
                    })}
                  >
                    {item?.payload?.refId}
                  </Link>
                ),
                KytRequest: (
                  <Link
                    to={generatePath(
                      KYT_ROUTE_SCREEN,
                      { id: item?.payload?.refId },
                      { source: "list" }
                    )}
                    data-cy={"id"}
                  >
                    {item?.payload?.refId}
                  </Link>
                ),
              }[item.tableName]
            }
            <text className={styles.textSettingValue}>
              {" "}
              <IntlMessages id="audit.to" />{" "}
            </text>
            <span>
              <Link to={`/app/staff/${item.payload?.id}`}>
                {getFullName(item.payload)}
              </Link>
              {DOT_END}
            </span>
          </div>
        </div>
      );
    }
    case "NEW_CHANGES_FROM_MONITOR":
      return (
        <div>
          {
            {
              DjKycIndividualMatch: item?.payload?.djKycId && (
                <span>
                  <Link
                    to={`/app/dj-kyc/result/${item?.payload.djKycId}/match/${item?.payload.matchId}`}
                  >
                    {`${item?.payload?.djKycId}-${item?.payload?.matchId}`}
                  </Link>
                </span>
              ),
              KycIndividualMatch: item?.payload?.kycId && (
                <span>
                  <Link
                    to={`/app/screen-kyc/result/${item?.payload.kycId}/match/${item?.payload.matchId}`}
                  >
                    {`${item?.payload?.kycId}-${item?.payload?.matchId}`}
                  </Link>
                </span>
              ),
              KybMatch: item?.payload?.kybId && (
                <span>
                  <Link
                    to={generatePath(KYB_ROUTE_KYB_SCREEN_DETAIL, {
                      kybId: item.payload?.kybId,
                      matchId: item.payload.matchId,
                    })}
                  >
                    {`${item.payload?.kybId}-${item.payload?.matchId}`}
                  </Link>
                </span>
              ),
            }[item.tableName]
          }{" "}
          <IntlMessages id="audit.activity.kyc.hasBeenUpdated" />
          <span>{DOT_END}</span>
        </div>
      );

    case BL_MATCHED: {
      return (
        <span>
          <text>
            <Link to={`/app/screen-kyc/result/${item.payload.refId}`}>
              {item.payload.refId}
            </Link>{" "}
          </text>
          <text className={styles.textStatus}>
            <IntlMessages id="audit.filter.blacklist.had.possible.match" />
          </text>
          <text className={styles.textStatus}>
            {" "}
            <Link to={SETTING_BLACK_LIST_KYC}>{item.payload.blacklistId}</Link>
          </text>
          <span>{DOT_END}</span>
        </span>
      );
    }
    case BL_DEACTIVATE:
    case BL_ACTIVATE: {
      return (
        <span>
          <span className={clsx(styles.Link)}>
            <span>
              <Link to={`/app/staff/${item.createdBy?.id}`}>
                {getFullName(item.createdBy)}
              </Link>{" "}
            </span>
          </span>
          <text className={styles.textStatus}>
            {item?.payload.to ? (
              <IntlMessages id="audit.filter.blacklist.activated" />
            ) : (
              <IntlMessages id="audit.filter.blacklist.deactivated" />
            )}
          </text>{" "}
          <text>
            {
              {
                KycBlacklist: (
                  <Link to={SETTING_BLACK_LIST_KYC}>
                    {item?.payload?.refId}
                  </Link>
                ),
              }[item.tableName]
            }{" "}
          </text>
          <IntlMessages id="audit.filter.blacklist.deactivatedOrActivated" />
          <span>{DOT_END}</span>
        </span>
      );
    }
    case "SETTING_WHITELIST_IP_TURNED_ON":
      return (
        <div>
          <span className={clsx(styles.Link)}>
            <span>
              <Link to={`/app/staff/${item?.lastModifiedBy?.id}`}>
                {getFullName(item?.lastModifiedBy)}
              </Link>{" "}
            </span>
          </span>
          <IntlMessages id={"audit.enabled"} />{" "}
          <span className={clsx(styles.Link)}>
            <span>
              <Link to={`/app/setting/security?tab=1`}>
                <IntlMessages id={"audit.whitelist"} />
              </Link>{" "}
            </span>
          </span>
          <IntlMessages id={"audit.byIPAddress"} />
          <span>{DOT_END}</span>
        </div>
      );
    case "SETTING_WHITELIST_IP_MODIFIED":
      return (
        <div>
          <span className={clsx(styles.Link)}>
            <span>
              <Link to={`/app/staff/${item?.lastModifiedBy?.id}`}>
                {getFullName(item?.lastModifiedBy)}
              </Link>{" "}
            </span>
          </span>
          <IntlMessages id={"audit.modifiedThe"} />{" "}
          <span className={clsx(styles.Link)}>
            <span>
              <Link to={`/app/setting/security?tab=1`}>
                <IntlMessages id={"audit.whitelist"} />
              </Link>{" "}
            </span>
          </span>
          <IntlMessages id={"audit.byIPAddress"} />
          <span>{DOT_END}</span>
        </div>
      );
    case "SETTING_WHITELIST_COUNTRY_TURNED_ON":
      return (
        <div>
          <span className={clsx(styles.Link)}>
            <span>
              <Link to={`/app/staff/${item?.lastModifiedBy?.id}`}>
                {getFullName(item?.lastModifiedBy)}
              </Link>{" "}
            </span>
          </span>
          <IntlMessages id={"audit.enabled"} />{" "}
          <span className={clsx(styles.Link)}>
            <span>
              <Link to={`/app/setting/security?tab=1`}>
                <IntlMessages id={"audit.whitelist"} />
              </Link>{" "}
            </span>
          </span>
          <IntlMessages id={"audit.byCountry"} />
          <span>{DOT_END}</span>
        </div>
      );
    case "SETTING_WHITELIST_COUNTRY_MODIFIED":
      return (
        <div>
          <span className={clsx(styles.Link)}>
            <span>
              <Link to={`/app/staff/${item?.lastModifiedBy?.id}`}>
                {getFullName(item?.lastModifiedBy)}
              </Link>{" "}
            </span>
          </span>
          <IntlMessages id={"audit.modifiedThe"} />{" "}
          <span className={clsx(styles.Link)}>
            <span>
              <Link to={`/app/setting/security?tab=1`}>
                <IntlMessages id={"audit.whitelist"} />
              </Link>{" "}
            </span>
          </span>
          <IntlMessages id={"audit.byCountry"} />
          <span>{DOT_END}</span>
        </div>
      );
    case "SETTING_WHITELIST_TURNED_OFF":
      return (
        <div>
          <span className={clsx(styles.Link)}>
            <span>
              <Link to={`/app/staff/${item?.lastModifiedBy?.id}`}>
                {getFullName(item?.lastModifiedBy)}
              </Link>{" "}
            </span>
          </span>
          <IntlMessages id={"audit.disabled"} />{" "}
          <span className={clsx(styles.Link)}>
            <span>
              <Link to={`/app/setting/security?tab=1`}>
                <IntlMessages id={"audit.whitelist"} />
              </Link>{" "}
            </span>
          </span>
          <IntlMessages id={"audit.function"} />
          <span>{DOT_END}</span>
        </div>
      );
    /**
     * KYC change Risk score note
     */
    case EDIT_RISK_SCORE_NOTE:
      return (
        <div>
          <div>
            <div>
              <span className={clsx(styles.Link)}>
                <label>
                  <Link to={`/app/staff/${item?.createdBy?.id}`}>
                    {getFullName(item.createdBy)}
                  </Link>
                </label>
              </span>
              <span>
                <FormattedMessage
                  id={"audit.editTotalRickScore.note"}
                  values={{
                    b: (msg) => <span className={styles.textBold}>{msg}</span>,
                  }}
                />
              </span>
              <span>
                {
                  {
                    KytRiskScoreChange: (
                      <span>
                        <Link to={`/app/kyt/kyt-screen/${item.payload.kytId}`}>
                          {item?.payload?.kytId}
                        </Link>
                      </span>
                    ),
                    KycIndividualRiskScoreChange: (
                      <span>
                        <Link
                          to={`/app/screen-kyc/result/${item.payload.kycId}/scoring`}
                        >
                          {item?.payload?.kycId}
                        </Link>
                      </span>
                    ),
                    DjKycIndividualRiskScoreChange: (
                      <span>
                        <Link
                          to={`/app/dj-kyc/result/${item?.payload?.djKycId}/scoring`}
                        >
                          {item?.payload?.djKycId}
                        </Link>
                      </span>
                    ),
                  }[item.tableName]
                }
              </span>
              <span>{DOT_END}</span>
            </div>
          </div>
        </div>
      );
    case DJ_KYC_CHANGE_SEARCH_TYPE:
      return (
        <div>
          <div>
            <div>
              <span className={clsx(styles.Link)}>
                <span>
                  <Link to={`/app/staff/${item?.createdBy?.id}`}>
                    {getFullName(item?.createdBy)}
                  </Link>
                </span>
              </span>
              <text className={styles.textStatus}>
                <IntlMessages id="audit.changedTheNameSearchType" />
                <text className={styles.textSettingValue}>
                  <IntlMessages id="audit.from" />
                </text>{" "}
              </text>
              <span>
                <text className={styles.textStatus}>
                  {item.payload.from}{" "}
                  <text className={styles.textSettingValue}>
                    <IntlMessages id="audit.to" />
                  </text>{" "}
                </text>
                <text className={styles.textStatus}>{item.payload.to} </text>
              </span>
            </div>
          </div>
        </div>
      );

    case CONFIDENCE_SETTING:
      return (
        <div>
          <span className={clsx(styles.Link)}>
            <span>
              <Link to={`/app/staff/${item?.createdBy?.id}`}>
                {getFullName(item?.createdBy)}
              </Link>{" "}
            </span>
          </span>
          <span>
            <FormattedHTMLMessage
              id={"audit.liveness.face.match"}
              values={{
                from: item.payload.from,
                to: item.payload.to,
              }}
            />
          </span>
        </div>
      );

    default:
      break;
  }
});
export default ItemAudit;
