import staffSagas from "./Staff";

import apiSagaCreator from "@protego/sdk/sagas/api";
import { combineRootSagas } from "@protego/sdk/sagas/utils";
import authSagas from "@protego/sdk/sagas/auth";
import supportSaga from "./support";
import KYTSaga from "./KYTSaga";
import meSagas from "./me";
import KYCSaga from "./KYCSaga";
import CaseSaga from "./CaseSaga";
import CreditSaga from "./CreditSaga";
import PackageSaga from "./Package";
import NotificationSaga from "./Notification";
import SettingScoringSaga from "./SettingScoringSaga";
import DashboardSaga from "./Dashboard";
import AuditSaga from "./AuditSaga";
import AuthCPSaga from "./AuthCPSaga";
import KYBSaga from "./KYBSaga";
import SettingSaga from "./SettingSaga";
import SettingACLSaga from "./SettingACLSaga";
import DJSaga from "./DJSaga";
import LivenessSaga from "./LivenessSaga";
import ReportSaga from "./ReportSaga";
import CaseManagementSaga from "./CaseManagementSaga";
import ProfileTableSaga from "./ProfileTableSaga";

const apiSaga = apiSagaCreator({
  refreshTokenEndpoint: "oauth/token",
  clientId: "crm-admin",
  bodyType: "formData",
});

export default function* rootSaga(getState) {
  yield combineRootSagas(
    authSagas,
    apiSaga,
    staffSagas,
    supportSaga,
    KYTSaga,
    KYCSaga,
    CaseSaga,
    meSagas,
    CreditSaga,
    PackageSaga,
    NotificationSaga,
    SettingScoringSaga,
    DashboardSaga,
    AuditSaga,
    AuthCPSaga,
    KYBSaga,
    SettingSaga,
    SettingACLSaga,
    DJSaga,
    LivenessSaga,
    ReportSaga,
    CaseManagementSaga,
    ProfileTableSaga,
  );
}
