import {
  APPROVE,
  ASSIGN,
  CHANGE_STATUS,
  CREATE,
  ESCALATE,
  IMPORT,
  REASSIGN,
  REJECT,
  RE_SCREENED,
  RE_SCREENING_SETTING,
  KYB_UPDATE_BUSINESS_INFORMATION,
  UPDATE,
  /**
   * KYT
   */
  FETCH,
  ON_GOING_MONITORING_CHANGE,
  KYT_RE_SCREENED_NEW_TRANSACTION,
  CHECK_SCORE,
  MATCHED,
  ARCHIVE,
  UNARCHIVE,
  ADD,
  REMOVE,
} from "constants/ViewLogType";
import { getFilterActionText } from "util/filterActionType";
export const getLabelViewLog = (type) => {
  let label = "";
  if (type) {
    label = getFilterActionText(type.toUpperCase());
    switch (type.toUpperCase()) {
      case ESCALATE: {
        label = "audit.escalated.to";
        break;
      }
      case APPROVE: {
        label = "audit.approved.by";
        break;
      }
      case REJECT: {
        label = "audit.rejected.by";
        break;
      }
      case ASSIGN: {
        label = "audit.assign.to";
        break;
      }
      case REASSIGN: {
        label = "audit.assign.to";
        break;
      }
      case IMPORT: {
        label = "audit.imported.by";
        break;
      }
      case CHANGE_STATUS: {
        label = "audit.resolved.by";
        break;
      }
      case CREATE: {
        label = "audit.created.by";
        break;
      }
      case RE_SCREENED: {
        label = "audit.rescreened.by";
        break;
      }
      case RE_SCREENING_SETTING: {
        label = "audit.rescreened.by";
        break;
      }
      case KYB_UPDATE_BUSINESS_INFORMATION: {
        label = "audit.updated.by";
        break;
      }

      case UPDATE: {
        label = "audit.updated.by";
        break;
      }

      /**
       * KYT
       */
      case FETCH: {
        label = "audit.updated.by";
        break;
      }
      case KYT_RE_SCREENED_NEW_TRANSACTION: {
        label = "audit.updated.by";
        break;
      }
      case CHECK_SCORE: {
        label = "audit.checked.by";
        break;
      }
      case MATCHED: {
        label = "audit.actionPerformed.by";
        break;
      }
      case ON_GOING_MONITORING_CHANGE:
      case ARCHIVE:
      case UNARCHIVE:
      case REMOVE:
      case ADD: {
        label = "audit.activity.log.editBy";
        break;
      }
      default:
    }
  }
  return label;
};

export const getEventType = (key) => {
  if (key) {
    return `audit.activity.log.${key}`;
  }
  return "";
};
export const getEventTypeLiveness = (key) => {
  if (key === APPROVE) {
    return `liveness.view.log.${key}`;
  }
  if (key === REJECT) {
    return `liveness.view.log.${key}`;
  }
  if (key) {
    return `audit.activity.log.${key}`;
  }
  return "";
};
