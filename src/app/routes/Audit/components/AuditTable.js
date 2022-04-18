//import CustomTable from "@protego/sdk/UI/CustomTable/CustomTable";
import CustomTable from "@protego/sdk/RegtankUI/v1/CustomTable";
import IntlMessages from "@protego/sdk/RegtankUI/v1/IntlMessages";
import Nullable from "@protego/sdk/RegtankUI/v1/Nullable";
import withPagination from "@protego/sdk/RegtankUI/v1/withPagination";
import {
  CONFIDENCE_SETTING,
  EDIT_RISK_SCORE_NOTE,
} from "constants/ActionTypes";
import {
  APPROVE,
  BL_ACTIVATE,
  BL_DEACTIVATE,
  BL_MATCHED,
  ESCALATE,
  NEW_CHANGES_FROM_MONITOR,
  REJECT,
} from "constants/ViewLogType";
import React, { Fragment, memo } from "react";
import { compose } from "recompose";
import { formatDate, LONG_DATE_TIME } from "util/date";
import AuditActivities from "./AuditActivities";
import { toRem } from "@protego/sdk/RegtankUI/v1/utils";
import clsx from "clsx";
import styles from "./auditTable.module.scss";
const AuditTable = ({ data, paginationParams }) => {
  const activeType = (type, tableName, payload) => {
    switch (type) {
      case "ASSIGN":
        return (
          <span>
            {
              {
                KybRequest: <IntlMessages id={"audit.filter.KYB_ASSIGN"} />,
                KycRequest: <IntlMessages id={"audit.filter.KYC_ASSIGN"} />,
                KytRequest: <IntlMessages id={"audit.filter.KYT_ASSIGN"} />,
                DjKycRequest: (
                  <IntlMessages id={"audit.filter.DJ_KYC_ASSIGN"} />
                ),
              }[tableName]
            }
          </span>
        );
      case "CHANGE_STATUS":
        return (
          <span>
            {
              {
                KybRiskAssessmentEntity: (
                  <IntlMessages id={"audit.filter.KYB_RISK_ASSESSMENT"} />
                ),
                KycIndividualMatch: (
                  <IntlMessages id={"audit.filter.KYC_INDIVIDUAL_MATCH"} />
                ),
                KybMatch: <IntlMessages id={"audit.filter.KYB_MATCH"} />,
                DjKycIndividualMatch: (
                  <IntlMessages id={"audit.filter.DJ_KYC_INDIVIDUAL_MATCH"} />
                ),
              }[tableName]
            }
          </span>
        );
      case "LOGOUT":
        return <IntlMessages id={"audit.filter.LOGOUT"} />;
      case "LOGIN":
        return <IntlMessages id={"audit.filter.LOGIN"} />;
      case "CREATE":
        return (
          <span>
            {
              {
                Case: <IntlMessages id="audit.filter.CREATE_CASE" />,
                KycRequest: <IntlMessages id={"audit.filter.KYC_CREATE"} />,
                KytRequest: <IntlMessages id={"audit.filter.KYT_CREATE"} />,
                User: <IntlMessages id={"audit.filter.CREATE_USER"} />,
                KybRequest: <IntlMessages id={"audit.filter.KYB_CREATE"} />,
                KycBlacklist: <IntlMessages id={"audit.filter.BL_CREATE"} />,
                DjKycRequest: (
                  <IntlMessages id={"audit.filter.DJ_KYC_CREATE"} />
                ),
                KycWatchGroup: (
                  <IntlMessages id={"audit.filter.KYC_GROUP_LIST_CREATE"} />
                ),
                DjKycWatchGroup: (
                  <IntlMessages id={"audit.filter.DJ_KYC_GROUP_LIST_CREATE"} />
                ),
              }[tableName]
            }
          </span>
        );
      case "RENAME":
        return (
          <span>
            {
              {
                KycWatchGroup: (
                  <IntlMessages id={"audit.filter.KYC_GROUP_LIST_RENAME"} />
                ),
                DjKycWatchGroup: (
                  <IntlMessages id={"audit.filter.DJ_KYC_GROUP_LIST_RENAME"} />
                ),
              }[tableName]
            }
          </span>
        );
      case "DELETE":
        return (
          <span>
            {
              {
                KycWatchGroup: (
                  <IntlMessages id={"audit.filter.KYC_GROUP_LIST_DELETE"} />
                ),
                DjKycWatchGroup: (
                  <IntlMessages id={"audit.filter.DJ_KYC_GROUP_LIST_DELETE"} />
                ),
                User: <IntlMessages id={"audit.filter.DELETE_USER"} />,
                KycBlacklist: <IntlMessages id={"audit.filter.BL_DELETE"} />,
              }[tableName]
            }
          </span>
        );
      case "REMOVE":
        return (
          <span>
            {
              {
                KycWatchList: (
                  <IntlMessages
                    id={"audit.filter.KYC_GROUP_LIST_REMOVE_SCREENING"}
                  />
                ),
                DjKycWatchList: (
                  <IntlMessages
                    id={"audit.filter.DJ_KYC_GROUP_LIST_REMOVE_SCREENING"}
                  />
                ),
              }[tableName]
            }
          </span>
        );
      case "ADD":
        return (
          <span>
            {
              {
                KycWatchList: (
                  <IntlMessages
                    id={"audit.filter.KYC_GROUP_LIST_ADD_SCREENING"}
                  />
                ),
                DjKycWatchList: (
                  <IntlMessages
                    id={"audit.filter.DJ_KYC_GROUP_LIST_ADD_SCREENING"}
                  />
                ),
              }[tableName]
            }
          </span>
        );
      case "ARCHIVE":
        return (
          <span>
            {
              {
                KycRequest: <IntlMessages id={"audit.filter.KYC_ARCHIVE"} />,
                DjKycRequest: (
                  <IntlMessages id={"audit.filter.DJ_KYC_ARCHIVE"} />
                ),
              }[tableName]
            }
          </span>
        );
      case "UNARCHIVE":
        return (
          <span>
            {
              {
                KycRequest: <IntlMessages id={"audit.filter.KYC_UNARCHIVE"} />,
                DjKycRequest: (
                  <IntlMessages id={"audit.filter.DJ_KYC_UNARCHIVE"} />
                ),
              }[tableName]
            }
          </span>
        );
      case "IMPORT":
        return (
          <span>
            {
              {
                Case: <IntlMessages id="audit.filter.KYC_IMPORT" />,
                KybRequest: <IntlMessages id={"audit.filter.KYB_IMPORT"} />,
                KycRequest: <IntlMessages id={"audit.filter.KYC_IMPORT"} />,
                KytRequest: <IntlMessages id={"audit.filter.KYT_IMPORT"} />,
              }[tableName]
            }
          </span>
        );
      case "CHANGE_FILTER_LEVEL":
        return (
          <span>
            {
              {
                SettingDJKYC: (
                  <IntlMessages
                    id={"audit.filter.DJ_KYC_CHANGE_FILTER_LEVEL"}
                  />
                ),
                SettingKYC: (
                  <IntlMessages id={"audit.filter.KYC_CHANGE_FILTER_LEVEL"} />
                ),
                SettingKYB: (
                  <IntlMessages id={"audit.filter.KYB_CHANGE_FILTER_LEVEL"} />
                ),
              }[tableName]
            }
          </span>
        );

      case "CHANGE_RISK_SCORE":
        return (
          <span>
            {
              {
                DjKycIndividualRiskScoreChange: (
                  <IntlMessages id={"audit.filter.DJ_KYC_CHANGE_RISK_SCORE"} />
                ),
                KycIndividualRiskScoreChange: (
                  <IntlMessages id={"audit.filter.KYC_CHANGE_RISK_SCORE"} />
                ),
                KytRiskScoreChange: (
                  <IntlMessages id={"audit.filter.KYT_CHANGE_RISK_SCORE"} />
                ),
              }[tableName]
            }
          </span>
        );
      case "FETCH":
        return <IntlMessages id={"audit.filter.KYT_FETCH"} />;
      case "CHECK_SCORE":
        return <IntlMessages id={"audit.filter.KYT_CHECK_SCORE"} />;
      case "REASSIGN":
        return <IntlMessages id={"audit.filter.REASSIGN"} />;
      case "DJ_KYC_CHANGE_SEARCH_TYPE":
        return <IntlMessages id={"audit.filter.changeSearchType"} />;
      case "ON_GOING_MONITORING_CHANGE":
        return (
          <span>
            {
              {
                KytRequest: (
                  <IntlMessages
                    id={"audit.filter.KYT_ON_GOING_MONITORING_CHANGE"}
                  />
                ),
                KybRequest: (
                  <IntlMessages
                    id={"audit.filter.KYB_ON_GOING_MONITORING_CHANGE"}
                  />
                ),
                KycRequest: (
                  <IntlMessages id={"audit.filter.KYC_CHANGE_OM_SETTING"} />
                ),
                DjKycRequest: (
                  <IntlMessages id={"audit.filter.DJ_KYC_CHANGE_OM_SETTING"} />
                ),
              }[tableName]
            }
          </span>
        );
      case "KYT_RE_SCREENED_NEW_TRANSACTION":
        return (
          <IntlMessages id={"audit.filter.KYT_RE_SCREENED_NEW_TRANSACTION"} />
        );
      case "KYT_RE_SCREENED_SCORE_CHANGE":
        return (
          <IntlMessages id={"audit.filter.KYT_RE_SCREENED_SCORE_CHANGE"} />
        );
      case "UPDATE": {
        return (
          <span>
            {
              {
                KybRiskAssessmentEntity: (
                  <IntlMessages
                    id={"audit.filter.KYB_RISK_ASSESSMENT_UPDATE"}
                  />
                ),
                KycBlacklist: <IntlMessages id={"audit.filter.BL_UPDATE"} />,
              }[tableName]
            }
          </span>
        );
      }
      case "RE_SCREENED":
        return (
          <span>
            {
              {
                KybRequest: (
                  <IntlMessages id={"audit.filter.KYB_RE_SCREENED"} />
                ),
                KycRequest: (
                  <IntlMessages id={"audit.filter.KYC_RE_SCREENED"} />
                ),
                DjKycRequest: (
                  <IntlMessages id={"audit.filter.DJ_KYC_RE_SCREENED"} />
                ),
                KycBlacklist: (
                  <IntlMessages id={"audit.filter.BL_RE_SCREENED"} />
                ),
                KycBlacklistMatch: (
                  <IntlMessages id={"audit.filter.BL_RE_SCREENED"} />
                ),
              }[tableName]
            }
          </span>
        );
      case "RE_SCREENING_SETTING":
        return (
          <span>
            {
              {
                KybRequest: (
                  <IntlMessages id={"audit.filter.KYB_RE_SCREENING_SETTING"} />
                ),
                KycRequest: (
                  <IntlMessages id={"audit.filter.KYC_RE_SCREENING_SETTING"} />
                ),
                DjKycRequest: (
                  <IntlMessages
                    id={"audit.filter.DJ_KYC_RE_SCREENING_SETTING"}
                  />
                ),
              }[tableName]
            }
          </span>
        );
      case "KYB_UPDATE_BUSINESS_INFORMATION":
        return (
          <IntlMessages id={"audit.filter.KYB_BUSINESS_INFORMATION_UPDATE"} />
        );

      case APPROVE:
        return (
          <span>
            {
              {
                DjKycRequest: (
                  <IntlMessages id={"audit.filter.DJ_KYC_APPROVE"} />
                ),
                KybRequest: <IntlMessages id={"audit.filter.KYB_APPROVE"} />,
                KycRequest: <IntlMessages id={"audit.filter.KYC_APPROVE"} />,
                KytRequest: <IntlMessages id={"audit.filter.KYT_APPROVE"} />,
                LivenessVerifyRequest: (
                  <IntlMessages id={"audit.filter.LIVENESS_APPROVE"} />
                ),
              }[tableName]
            }
          </span>
        );

      case REJECT:
        return (
          <span>
            {
              {
                DjKycRequest: (
                  <IntlMessages id={"audit.filter.DJ_KYC_REJECT"} />
                ),
                KybRequest: <IntlMessages id={"audit.filter.KYB_REJECT"} />,
                KycRequest: <IntlMessages id={"audit.filter.KYC_REJECT"} />,
                KytRequest: <IntlMessages id={"audit.filter.KYT_REJECT"} />,
                LivenessVerifyRequest: (
                  <IntlMessages id={"audit.filter.LIVENESS_REJECT"} />
                ),
              }[tableName]
            }
          </span>
        );
      case ESCALATE:
        return (
          <span>
            {
              {
                DjKycRequest: (
                  <IntlMessages id={"audit.filter.DJ_KYC_ESCALATE"} />
                ),
                KybRequest: <IntlMessages id={"audit.filter.KYB_ESCALATE"} />,
                KycRequest: <IntlMessages id={"audit.filter.KYC_ESCALATE"} />,
                KytRequest: <IntlMessages id={"audit.filter.KYT_ESCALATE"} />,
              }[tableName]
            }
          </span>
        );
      case NEW_CHANGES_FROM_MONITOR:
        return (
          <span>
            {
              {
                DjKycIndividualMatch: (
                  <IntlMessages id="audit.filter.DJ_KYC_MONITOR_CHANGE" />
                ),
                KycIndividualMatch: (
                  <IntlMessages id="audit.filter.KYC_MONITOR_CHANGE" />
                ),

                KybRequest: (
                  <IntlMessages id="audit.activity.kyb.KYB_MONITOR_CHANGE" />
                ),
                KybMatch: <IntlMessages id="audit.filter.KYB_MONITOR_CHANGE" />,
                KycRequest: (
                  <IntlMessages id="audit.activity.kyc.NEW_CHANGES_FROM_MONITOR" />
                ),
              }[tableName]
            }
          </span>
        );
      //return <IntlMessages id="audit.filter.KYC_MONITOR_CHANGE" />;

      case BL_MATCHED:
        return (
          <span>
            <IntlMessages id={"audit.filter.BL_MATCHED"} />
          </span>
        );

      case BL_ACTIVATE:
      case BL_DEACTIVATE: {
        return (
          <span>
            {payload?.to ? (
              <IntlMessages id={"audit.filter.BL_ACTIVATE"} />
            ) : (
              <IntlMessages id={"audit.filter.BL_DEACTIVATE"} />
            )}
          </span>
        );
      }

      case "SETTING_WHITELIST_IP_TURNED_ON":
        return (
          <IntlMessages id="audit.filter.SETTING_WHITELIST_IP_TURNED_ON" />
        );
      case "SETTING_WHITELIST_IP_MODIFIED":
        return <IntlMessages id="audit.filter.SETTING_WHITELIST_IP_MODIFIED" />;
      case "SETTING_WHITELIST_COUNTRY_TURNED_ON":
        return (
          <IntlMessages id="audit.filter.SETTING_WHITELIST_COUNTRY_TURNED_ON" />
        );
      case "SETTING_WHITELIST_COUNTRY_MODIFIED":
        return (
          <IntlMessages id="audit.filter.SETTING_WHITELIST_COUNTRY_MODIFIED" />
        );
      case "SETTING_WHITELIST_TURNED_OFF":
        return <IntlMessages id="audit.filter.SETTING_WHITELIST_TURNED_OFF" />;
      case EDIT_RISK_SCORE_NOTE:
        return (
          <span>
            {
              {
                DjKycIndividualRiskScoreChange: (
                  <IntlMessages
                    id={"audit.filter.DJ_KYC_EDIT_RISK_SCORE_NOTE"}
                  />
                ),
                KycIndividualRiskScoreChange: (
                  <IntlMessages id={"audit.filter.KYC_EDIT_RISK_SCORE_NOTE"} />
                ),
                KytRiskScoreChange: (
                  <IntlMessages id={"audit.filter.KYT_EDIT_RISK_SCORE_NOTE"} />
                ),
              }[tableName]
            }
          </span>
        );
      case CONFIDENCE_SETTING:
        return (
          <span>
            <IntlMessages id={"audit.filterType.CONFIDENCE_SETTING"} />
          </span>
        );

      default:
        break;
    }
  };
  return (
    <Fragment>
      <CustomTable
        lang={{
          rowsPerPage: <IntlMessages id={"appModule.table.footer"} />,
        }}
        options={{
          pagination: true,
          selectable: false,
          isFixedFirstColumn: true,
          scrollable: true,
          disableShowing: false,
        }}
        className={clsx("mt-0", styles.auditTableWrapper)}
        columnData={{
          tableName: {
            label: <IntlMessages id="audit.title" />,
            enable: true,
            sort: false,
            style: { minWidth: toRem(500) },
            renderCell: (
              tableName,
              { createdBy, eventType, id, lastModifiedBy, payload }
            ) => (
              <div className={"d-flex"}>
                <AuditActivities
                  item={{
                    tableName,
                    createdBy,
                    eventType,
                    id,
                    lastModifiedBy,
                    payload,
                  }}
                />
              </div>
            ),
          },
          eventType: {
            style: { minWidth: toRem(300) },
            label: <IntlMessages id="audit.filter.action.type" />,
            enable: true,
            sort: false,
            renderCell: (eventType, { tableName, payload }) => (
              <div>
                <Nullable>{activeType(eventType, tableName, payload)}</Nullable>
              </div>
            ),
          },
          createdAt: {
            style: { minWidth: toRem(200) },
            label: <IntlMessages id="audit.table.auditDate" />,
            sort: false,
            renderCell: (v) => (
              <div className={"d-flex align-items-center"}>
                <Nullable>{formatDate(v, LONG_DATE_TIME)}</Nullable>
              </div>
            ),
          },
        }}
        data={data}
      />
    </Fragment>
  );
};

export default compose(withPagination)(memo(AuditTable));
