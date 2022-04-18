const protectedRoute = {
  //KYC
  "/app/kyc/my-kyc": "KYC_MODULE_VIEW",
  "/app/kyc/kyc-screen": ["KYC_MODULE_CREATE", "KYC_MODULE_VIEW"],
  "/app/screen-kyc/result": "KYC_MODULE_VIEW",
  //CASE
  "/app/case": "CASE_MODULE_VIEW",
  //Audit
  "/app/audit": "AUDIT_MODULE_VIEW",
  //Setting: KYC
  "/app/setting/kyc": ["SETTING_MODULE_VIEW", "SETTING_KYC_VIEW"],
  "/app/setting/kyc-acuris": ["SETTING_MODULE_VIEW", "SETTING_KYC_VIEW"],
  //Setting: KYB
  "/app/setting/kyb": ["SETTING_MODULE_VIEW", "SETTING_KYB_VIEW"],
  //KYB
  "/app/kyb/kyb-screen": ["KYB_MODULE_CREATE", "KYB_MODULE_VIEW"],
  "/app/kyb/my-kyb": "KYB_MODULE_VIEW",
  //KYT
  "/app/kyt/kyt-screen": ["KYT_MODULE_CREATE", "KYT_MODULE_VIEW"],
  "/app/kyt/my-kyt": "KYT_MODULE_VIEW",
  //Setting: KYT
  "/app/setting/kyt": ["SETTING_MODULE_VIEW", "SETTING_KYT_VIEW"],
  //Setting: Security
  "/app/setting/security": ["SETTING_MODULE_VIEW", "SETTING_SECURITY_VIEW"],
  //Setting: Blacklist
  "/app/setting/blacklist": ["SETTING_MODULE_VIEW", "SETTING_BLACKLIST_VIEW"],
  //ACL
  "/app/setting/acl": "ADMINISTRATOR",
};

export default protectedRoute;
