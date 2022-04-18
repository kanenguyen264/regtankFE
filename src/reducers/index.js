import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import Settings from "./Settings";
import Notifications from "./Notifications";
import KYTReducer from "./KYTReducer";
import Staff from "./Staff";
import Me from "./me";
import AuthReducer from "@protego/sdk/reducers/AuthReducer";
import KYCReducer from "./KYCReducer";
import CaseReducer from "./CaseReducer";
import AttachmentReducer from "./AttachmentReducer";
import CreditReducer from "./CreditReducer";
import PackageReducer from "./PackageReducer";
import SettingScoringReducer from "./SettingScoringReducer";
import DashboardReducer from "./DashboardReducer";
import AuditReducer from "./Audit";
import KYBReducer from "./KYBReducer";
import SettingACL from "./SettingACLReducer";
import DJReducer from "./DJReducer";
import LivenessReducer from "./Liveness";
import CaseManagementReducer from "./CaseManagementReducer";
import ProfileTableReducer from "./ProfileTableReducer";

// eslint-disable-next-line import/no-anonymous-default-export
export default (history) =>
  combineReducers({
    router: connectRouter(history),
    settings: Settings,
    auth: AuthReducer,
    kyt: KYTReducer,
    kyc: KYCReducer,
    case: CaseReducer,
    staff: Staff,
    me: Me,
    attachment: AttachmentReducer,
    credit: CreditReducer,
    package: PackageReducer,
    settingScoring: SettingScoringReducer,
    notifications: Notifications,
    dashboard: DashboardReducer,
    audit: AuditReducer,
    kyb: KYBReducer,
    settingACL: SettingACL,
    downJones: DJReducer,
    liveness: LivenessReducer,
    caseManagement: CaseManagementReducer,
    profileTable: ProfileTableReducer,
  });
