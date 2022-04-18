/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface APIReference {
  AddressDetailsEntity: AddressDetailsEntity;
  AttachmentDtoReq: AttachmentDtoReq;
  AttachmentDtoRes: AttachmentDtoRes;
  AuditDto: AuditDto;
  BasicUserInfoDto: BasicUserInfoDto;
  BillingDto: BillingDto;
  BooleanBasedRisk: BooleanBasedRisk;
  CaseDetailsDto: CaseDetailsDto;
  CaseListingDto: CaseListingDto;
  CaseManagementDetailDto: CaseManagementDetailDto;
  ChildWeightSettingDto: ChildWeightSettingDto;
  CountryBasedRisk: CountryBasedRisk;
  CountryOfResidenceRisk: CountryOfResidenceRisk;
  CreditBundleDto: CreditBundleDto;
  CustomerDto: CustomerDto;
  EmbeddableAlias: EmbeddableAlias;
  EmbeddableConnection: EmbeddableConnection;
  EmbeddableFurtherInformation: EmbeddableFurtherInformation;
  EmbeddableKeyData: EmbeddableKeyData;
  EmbeddablePoliticalPosition: EmbeddablePoliticalPosition;
  EmbeddableSource: EmbeddableSource;
  FatfPepScoreDto: FatfPepScoreDto;
  FirstTimeDto: FirstTimeDto;
  ForgetPasswordDto: ForgetPasswordDto;
  IdIssuingCountryRisk: IdIssuingCountryRisk;
  InputStream: InputStream;
  KybSimplifiedIndividualMatchDto: KybSimplifiedIndividualMatchDto;
  KybSimplifiedRequestDto: KybSimplifiedRequestDto;
  KycBaseMatchDto: KycBaseMatchDto;
  KycBaseMatchEntity: KycBaseMatchEntity;
  KycDetailedRequestDto: KycDetailedRequestDto;
  KycImportResponse: KycImportResponse;
  KycIndividualMatchDto: KycIndividualMatchDto;
  KycIndividualMatchEntity: KycIndividualMatchEntity;
  KycIndividualRequestDto: KycIndividualRequestDto;
  KycIndividualRequestEntity: KycIndividualRequestEntity;
  KycIndividualRequestEntityReq: KycIndividualRequestEntityReq;
  KycIndividualRequestEntityRes: KycIndividualRequestEntityRes;
  KycIndividualRiskScoreEntity: KycIndividualRiskScoreEntity;
  KycOrganizationRequestEntity: KycOrganizationRequestEntity;
  KycOrganizationRequestEntityReq: KycOrganizationRequestEntityReq;
  KycOrganizationRequestEntityRes: KycOrganizationRequestEntityRes;
  KycRequestEntity: KycRequestEntity;
  KycSimplifiedIndividualMatchDto: KycSimplifiedIndividualMatchDto;
  KycSimplifiedIndividualRiskScoreDto: KycSimplifiedIndividualRiskScoreDto;
  KycSimplifiedRequestDto: KycSimplifiedRequestDto;
  KytInputDto: KytInputDto;
  KytRequestDto: KytRequestDto;
  KytRequestEntity: KytRequestEntity;
  Link: Link;
  LoginDto: LoginDto;
  LongBasedRisk: LongBasedRisk;
  MatchPaging: MatchPaging;
  MatchResponseDto: MatchResponseDto;
  MfaKeyDto: MfaKeyDto;
  ModelAndView: ModelAndView;
  NationalityRisk: NationalityRisk;
  NoteDtoReq: NoteDtoReq;
  NoteDtoRes: NoteDtoRes;
  NotificationEntity: NotificationEntity;
  OtherSettingDto: OtherSettingDto;
  PackageDto: PackageDto;
  PackagePeriodDto: PackagePeriodDto;
  "PageResult«AuditDto»": PageResultAuditDto;
  "PageResult«CaseListingDto»": PageResultCaseListingDto;
  "PageResult«KybSimplifiedRequestDto»": PageResultKybSimplifiedRequestDto;
  "PageResult«KycRequestEntity»": PageResultKycRequestEntity;
  "PageResult«KycSimplifiedRequestDto»": PageResultKycSimplifiedRequestDto;
  "PageResult«KytRequestDto»": PageResultKytRequestDto;
  "PageResult«NoteDto»": PageResultNoteDto;
  "PageResult«NotificationEntity»": PageResultNotificationEntity;
  "PageResult«ScoringInfoDto»": PageResultScoringInfoDto;
  "PageResult«TransactionEntity»": PageResultTransactionEntity;
  "PageResult«UserDto»": PageResultUserDto;
  RefreshTokenDto: RefreshTokenDto;
  ResetPasswordDto: ResetPasswordDto;
  Resource: Resource;
  ResponseEntity: ResponseEntity;
  Risk: Risk;
  RiskResponseDto: RiskResponseDto;
  ScoringDto: ScoringDto;
  ScoringInfoDto: ScoringInfoDto;
  SettingKycDtoReq: SettingKycDtoReq;
  SettingKycDtoRes: SettingKycDtoRes;
  SettingKytDtoReq: SettingKytDtoReq;
  SettingKytDtoRes: SettingKytDtoRes;
  SupportTicketDto: SupportTicketDto;
  Timestamp: Timestamp;
  TimestampReq: TimestampReq;
  TimestampRes: TimestampRes;
  TokenDto: TokenDto;
  TransactionEntity: TransactionEntity;
  UserDtoReq: UserDtoReq;
  UserDtoRes: UserDtoRes;
  UserWithPasswordDto: UserWithPasswordDto;
  VerifyMfaDto: VerifyMfaDto;
  View: View;
  Wallet: Wallet;
  WeightSettingDto: WeightSettingDto;
}
export interface AddressDetailsEntity {
  address: string;
  asset: "BCH" | "BNB" | "BTC" | "ERC20" | "ETH" | "LTC" | "RSK";
  createdAt: TimestampRes;
  currentBalance: number;
  endDate: number;
  id: number;
  inCase: boolean;
  lastUsedBlockHeight: number;
  queryDepositCount: number;
  queryDeposits: number;
  queryEndingBalance: number;
  querySpendCount: number;
  querySpent: number;
  risk: Risk;
  startDate: number;
  totalDepositCount: number;
  totalDeposits: number;
  totalSpendCount: number;
  totalSpent: number;
  updatedAt: TimestampRes;
  wallet: Wallet;
  kytRiskScoreChangeHistory: any[];
}
export interface TimestampRes extends Date {
  date: number;
  day: number;
  hours: number;
  minutes: number;
  month: number;
  nanos: number;
  seconds: number;
  time: number;
  timezoneOffset: number;
  year: number;
}
export interface Risk {
  callBackSeconds: number;
  gamblingOkRisk: number;
  risk: number;
  riskLevel: "HIGH" | "LOW" | "MEDIUM";
  sanctionsRisk: number;
  updatedToBlock: number;
}
export interface Wallet {
  country: string;
  name: string;
  revision: number;
  subpoenable: boolean;
  totalAddressCount: number;
  type: string;
  url: string;
  walletId: string;
}
export interface AttachmentDtoReq {
  createdAt: TimestampReq;
  createdBy: BasicUserInfoDto;
  id: number;
  lastModifiedBy: BasicUserInfoDto;
  name: string;
  updatedAt: TimestampReq;
}
export interface TimestampReq {
  date: number;
  hours: number;
  minutes: number;
  month: number;
  nanos: number;
  seconds: number;
  time: number;
  year: number;
}
export interface BasicUserInfoDto {
  avatar: string;
  colorCode: string;
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  userPermissions?: string[];
  roles: Array;
}
export interface AttachmentDtoRes {
  createdAt: TimestampRes;
  createdBy: BasicUserInfoDto;
  id: number;
  lastModifiedBy: BasicUserInfoDto;
  name: string;
  updatedAt: TimestampRes;
}
export interface AuditDto {
  createdAt: Timestamp;
  createdBy: BasicUserInfoDto;
  eventType:
    | "ASSIGN"
    | "CHANGE_FILTER_LEVEL"
    | "CHANGE_STATUS"
    | "CREATE"
    | "DELETE"
    | "IMPORT"
    | "LOGIN"
    | "LOGOUT";
  id: number;
  lastModifiedBy: BasicUserInfoDto;
  payload: {};
  tableName: string;
  updatedAt: Timestamp;
}
export interface Timestamp {
  date: number;
  day: number;
  hours: number;
  minutes: number;
  month: number;
  nanos: number;
  seconds: number;
  time: number;
  timezoneOffset: number;
  year: number;
}
export interface BillingDto {
  activateDate: Timestamp;
  buyer: CustomerDto;
  createdAt: Timestamp;
  createdBy: BasicUserInfoDto;
  creditAmount: number;
  id: number;
  lastModifiedBy: BasicUserInfoDto;
  status: "APPROVED" | "CANCEL" | "PENDING";
  type: "RENEW" | "TOP";
  updatedAt: Timestamp;
}
export interface CustomerDto {
  company: string;
  createdAt: Timestamp;
  createdBy: BasicUserInfoDto;
  id: number;
  lastModifiedBy: BasicUserInfoDto;
  paymentFrequency: "ANNUAL" | "BIANNUAL" | "MONTHLY" | "QUARTERLY";
  updatedAt: Timestamp;
  usedPackage: PackageDto;
}
export interface PackageDto {
  annual: PackagePeriodDto;
  biAnnual: PackagePeriodDto;
  description: string;
  id: number;
  isCurrent: boolean;
  kycCost: number;
  kytCost: number;
  monthly: PackagePeriodDto;
  name: string;
  quarterly: PackagePeriodDto;
  usedPackagePeriod: "ANNUAL" | "BIANNUAL" | "MONTHLY" | "QUARTERLY";
}
export interface PackagePeriodDto {
  credits: number;
  price: number;
}
export interface BooleanBasedRisk {
  info: boolean;
  score: number;
}
export interface CaseDetailsDto {
  caseId: string;
  createdAt: TimestampRes;
  createdBy: BasicUserInfoDto;
  id: number;
  inWatchList: boolean;
  kycList: KycSimplifiedRequestDto[];
  kytList: KytRequestDto[];
  lastModifiedBy: BasicUserInfoDto;
  latestKyc: KycSimplifiedRequestDto;
  latestKyt: KytRequestDto;
  referenceId: string;
  updatedAt: TimestampRes;
}
export interface KycSimplifiedRequestDto {
  assignee: BasicUserInfoDto;
  createdAt: TimestampRes;
  createdBy: BasicUserInfoDto;
  designationPosition: string;
  editEnable: boolean;
  enableReScreening: boolean;
  id: number;
  inWatchList: boolean;
  individualRequest: KycIndividualRequestEntityRes;
  individualRiskScore: KycSimplifiedIndividualRiskScoreDto;
  kycId: string;
  lastModifiedBy: BasicUserInfoDto;
  lastScreenedAt: TimestampRes;
  organizationRequest: KycOrganizationRequestEntityRes;
  percentOfShare: number;
  positiveMatch: KycBaseMatchDto;
  reScreenedAt: TimestampRes;
  reScreeningEditable: boolean;
  remarks: string;
  status:
    | "COMPLETED"
    | "PENDING"
    | "UNRESOLVED"
    | "NO_MATCH"
    | "POSITIVE_MATCH";
  type: "INDIVIDUAL" | "ORGANIZATION";
  unresolved: number;
  updatedAt: TimestampRes;
  omUpdated?: boolean;
}
export interface KybSimplifiedRequestDto {
  assignee: BasicUserInfoDto;
  createdAt: TimestampRes;
  createdBy: BasicUserInfoDto;
  editEnable: boolean;
  enableReScreening: boolean;
  id: number;
  inWatchList: boolean;
  individualRequest: KycIndividualRequestEntityRes;
  individualRiskScore: KycSimplifiedIndividualRiskScoreDto;
  kybId: string;
  lastModifiedBy: BasicUserInfoDto;
  lastScreenedAt: TimestampRes;
  organizationRequest: KycOrganizationRequestEntityRes;
  percentOfShare: number;
  positiveMatch: KycBaseMatchDto;
  reScreenedAt: TimestampRes;
  reScreeningEditable: boolean;
  remarks: string;
  status: "COMPLETED" | "PENDING" | "UNRESOLVED";
  type: "INDIVIDUAL" | "ORGANIZATION";
  unresolved: number;
  updatedAt: TimestampRes;
}

export interface KycIndividualRequestEntityRes {
  address1: string;
  address2: string;
  countryOfResidence: string;
  createdAt: TimestampRes;
  dateOfBirth: TimestampRes;
  email: string;
  enableReScreening: boolean;
  forename: string;
  gender: "FEMALE" | "MALE" | "UNSPECIFIED";
  governmentIdNumber: string;
  id: number;
  idIssuingCountry: string;
  middlename: string;
  name: string;
  nationality: string;
  phone: string;
  placeOfBirth: string;
  referenceId: string;
  surname: string;
  updatedAt: TimestampRes;
  yearOfBirth: number;
}
export interface KybBusinessRequestEntityRes {
  address1: string;
  address2: string;
  assignee: any;
  businessName: string;
  countryOfResidence: string;
  createdAt: TimestampRes;
  dateOfBirth: TimestampRes;
  email: string;
  enableReScreening: boolean;
  forename: string;
  gender: "FEMALE" | "MALE" | "UNSPECIFIED";
  governmentIdNumber: string;
  id: number;
  idIssuingCountry: string;
  middlename: string;
  name: string;
  nationality: string;
  phone: string;
  placeOfBirth: string;
  referenceId: string;
  surname: string;
  updatedAt: TimestampRes;
  yearOfBirth: number;
}
export interface KycSimplifiedIndividualRiskScoreDto {
  isSanction: boolean;
  createdAt: TimestampRes;
  createdBy: BasicUserInfoDto;
  id: number;
  lastModifiedBy: BasicUserInfoDto;
  risk: number;
  riskLevel: "HIGH" | "LOW" | "MEDIUM";
  updatedAt: TimestampRes;
}
export interface KycOrganizationRequestEntityRes {
  address1: string;
  address2: string;
  country: string;
  createdAt: TimestampRes;
  email: string;
  id: number;
  name: string;
  onGoingMonitor: boolean;
  organizationId: string;
  phone: string;
  referenceId: string;
  updatedAt: TimestampRes;
}
export interface KycBaseMatchDto {
  createdAt: TimestampRes;
  createdBy: BasicUserInfoDto;
  id: number;
  keywords: string[];
  lastModifiedBy: BasicUserInfoDto;
  matchId: string;
  status: "FALSE" | "POSITIVE" | "UNRESOLVED";
  updatedAt: TimestampRes;
}
export interface KytRequestDto {
  address: string;
  addressDetails: AddressDetailsEntity;
  asset: "BCH" | "BNB" | "BTC" | "ERC20" | "ETH" | "LTC" | "RSK";
  assignee: BasicUserInfoDto;
  createdAt: TimestampRes;
  createdBy: BasicUserInfoDto;
  id: number;
  inWatchList: boolean;
  kytId: string;
  lastModifiedBy: BasicUserInfoDto;
  messageStatus: "DONE" | "ERROR" | "PENDING";
  referenceId: string;
  updatedAt: TimestampRes;
}
export interface CaseListingDto {
  caseId: string;
  createdAt: TimestampRes;
  createdBy: BasicUserInfoDto;
  id: number;
  inWatchList: boolean;
  lastModifiedBy: BasicUserInfoDto;
  latestKyc: KycSimplifiedRequestDto;
  latestKyt: KytRequestDto;
  referenceId: string;
  updatedAt: TimestampRes;
}

export interface CaseManagementDetailDto {
  assignee: Object;
  caseId: string;
  createdAt: TimestampRes;
  createdBy: BasicUserInfoDto;
  fields: Object;
  id: number;
  inWatchList: boolean;
  information: string;
  lastModifiedBy: BasicUserInfoDto;
  latestKyc: KycSimplifiedRequestDto;
  latestKyt: KytRequestDto;
  name: string,
  profiles: Array;
  referenceId: string;
  status: string;
  updatedAt: TimestampRes;
}

export interface CaseManagementDynamicField {
  title: string,
  description: string
}

export interface NewCaseManagementFormData {
  name: string;
  referenceId: string;
  information: string;
  fields: CaseManagementDynamicField[]
}

export interface CaseColumnData<RecordType, FieldType> {
  align?: "left" | "center" | "right" | "justify";
  className?: string;
  style?: React.CSSProperties;
  headerProps?: React.ThHTMLAttributes<HTMLTableHeaderCellElement>;
  disablePadding?: boolean;
  enable?: boolean;
  id?: string;
  label?: string | React.ReactNode;
  numeric?: boolean;
  renderCell?: (value: FieldType, record: RecordType) => React.ReactNode;
  sort?: boolean;
}

export interface CaseColumnsData  {
  [F in RK | string]?: CaseColumnData<
    RecordType,
    F extends RK ? RecordType[F] : any
  >;
};

export interface ChildWeightSettingDto {
  isActive: boolean;
  rebase: number;
  weight: number;
}
export interface CountryBasedRisk {
  info: string;
  score: number;
}
export interface CountryOfResidenceRisk {
  basel: CountryBasedRisk;
  cpi: CountryBasedRisk;
  fatf: CountryBasedRisk;
}
export interface CreditBundleDto {
  creditAmount: number;
  currency: string;
  id: number;
  price: number;
}
export interface EmbeddableAlias {
  alternateTitle: string;
  name: string;
  title: string;
}
export interface EmbeddableConnection {
  association: string;
  name: string;
  personId: string;
}
export interface linkedIndividuals {
  name: string;
  personId: string;
  position: string;
}
export interface EmbeddableFurtherInformation {
  notes: string[];
  politicalPositions: EmbeddablePoliticalPosition[];
}
export interface EmbeddablePoliticalPosition {
  country: string;
  countryCode: string;
  description: string;
  from: TimestampRes;
  to: TimestampRes;
}
export interface EmbeddableKeyData {
  addresses: string[];
  aliases: EmbeddableAlias[];
  email: string;
  telephone: string;
  website: string;
}
export interface EmbeddableSource {
  c6Url: string;
  creationDate: TimestampRes;
  keywords: string[];
  keywordsMatched: string[];
  originalUrl: string;
  summary: string;
  title: string;
}
export interface FatfPepScoreDto {
  fatfScore: {};
  pepScore: {};
}
export interface FirstTimeDto {
  mfaCode: number;
  password: string;
}
export interface ForgetPasswordDto {
  email: string;
}
export interface IdIssuingCountryRisk {
  basel: CountryBasedRisk;
  cpi: CountryBasedRisk;
  fatf: CountryBasedRisk;
}
export interface InputStream {}
export interface KycBaseMatchEntity {
  connections: EmbeddableConnection[];
  createdAt: TimestampRes;
  furtherInformation: EmbeddableFurtherInformation;
  id: number;
  keyData: EmbeddableKeyData;
  keywords: string[];
  matchId: string;
  sources: EmbeddableSource[];
  status: "FALSE" | "POSITIVE" | "UNRESOLVED";
  updatedAt: TimestampRes;
}
export interface InputStream {}
export interface KycDetailedRequestDto {
  assignee: BasicUserInfoDto;
  createdAt: TimestampRes;
  createdBy: BasicUserInfoDto;
  enableReScreening: boolean;
  enableOnGoingMonitoring: boolean;
  id: number;
  inWatchList: boolean;
  individualMatches: KycSimplifiedIndividualMatchDto[];
  individualRequest: KycIndividualRequestEntityRes;
  individualRiskScore: KycSimplifiedIndividualRiskScoreDto;
  kycId: string;
  lastModifiedBy: BasicUserInfoDto;
  lastScreenedAt: TimestampRes;
  omEndPeriod: string;
  omStartPeriod: string;
  organizationRequest: KycOrganizationRequestEntityRes;
  positiveMatch: KycBaseMatchDto;
  reScreenedAt: TimestampRes;
  reScreeningEditable: boolean;
  status: "COMPLETED" | "PENDING" | "UNRESOLVED";
  type: "INDIVIDUAL" | "ORGANIZATION";
  unresolved: number;
  updatedAt: TimestampRes;
}

export interface KybDetailedRequestDto {
  assignee: BasicUserInfoDto;
  createdAt: TimestampRes;
  createdBy: BasicUserInfoDto;
  enableReScreening: boolean;
  id: number;
  inWatchList: boolean;
  // individualMatches?: KycSimplifiedIndividualMatchDto[];
  individualRequest: KycIndividualRequestEntityRes;
  individualRiskScore: KycSimplifiedIndividualRiskScoreDto;
  kybId: string;
  lastModifiedBy: BasicUserInfoDto;
  lastScreenedAt: TimestampRes;
  organizationRequest: KycOrganizationRequestEntityRes;
  positiveMatch: KycBaseMatchDto;
  reScreenedAt: TimestampRes;
  reScreeningEditable: boolean;
  status: "COMPLETED" | "PENDING" | "UNRESOLVED";
  type: "INDIVIDUAL" | "ORGANIZATION";
  unresolved: number;
  updatedAt: TimestampRes;
}
export interface KycSimplifiedIndividualMatchDto {
  createdAt: TimestampRes;
  createdBy: BasicUserInfoDto;
  dateOfBirth: TimestampRes;
  gender: "FEMALE" | "MALE" | "UNSPECIFIED";
  id: number;
  imageThumbnail: string;
  keywords: string[];
  lastModifiedBy: BasicUserInfoDto;
  matchId: string;
  name: string;
  nationality: string;
  nationalityCode: string;
  personId: string;
  placeOfBirth: string;
  status: "FALSE" | "POSITIVE" | "UNRESOLVED";
  updatedAt: TimestampRes;
  yearOfBirth: number;
  dayOfBirth?: number;
  monthOfBirth?: number;
}
export interface KybSimplifiedIndividualMatchDto {
  businessName: string;
  countryOfIncorporation: string;
  countryOfIncorporationCode: string[];
  createdAt: TimestampRes;
  createdBy: BasicUserInfoDto;
  dateOfBirth: TimestampRes;
  gender: "FEMALE" | "MALE" | "UNSPECIFIED";
  id: number;
  keywords: string[];
  lastModifiedBy: BasicUserInfoDto;
  matchId: string;
  name: string;
  nationality: string;
  nationalityCode: string;
  personId: string;
  placeOfBirth: string;
  status: "FALSE" | "POSITIVE" | "UNRESOLVED";
  updatedAt: TimestampRes;
  yearOfBirth: number;
}

export interface KycImportResponse {
  importFail: KycIndividualRequestEntityRes[];
  importSucceed: KycIndividualRequestEntityRes[];
}
export interface KycIndividualMatchDto {
  createdAt: TimestampRes;
  createdBy: BasicUserInfoDto;
  dateOfBirth: TimestampRes;
  gender: "FEMALE" | "MALE" | "UNSPECIFIED";
  id: number;
  keywords: string[];
  lastModifiedBy: BasicUserInfoDto;
  matchId: string;
  name: string;
  nationality: string;
  nationalityCode: string;
  pepLevel: number;
  personId: string;
  placeOfBirth: string;
  status: "FALSE" | "POSITIVE" | "UNRESOLVED";
  updatedAt: TimestampRes;
  yearOfBirth: number;
}
export interface KycIndividualMatchEntity {
  connections: EmbeddableConnection[];
  createdAt: TimestampRes;
  dateOfBirth: TimestampRes;
  furtherInformation: EmbeddableFurtherInformation;
  gender: "FEMALE" | "MALE" | "UNSPECIFIED";
  id: number;
  isAdverseMedia: boolean;
  isDisqualifiedDirector: boolean;
  isFinancialRegulator: boolean;
  isInsolvent: boolean;
  isLawEnforcement: boolean;
  isPep: boolean;
  isSanctionsCurrent: boolean;
  isSanctionsPrevious: boolean;
  keyData: EmbeddableKeyData;
  keywords: string[];
  matchId: string;
  name: string;
  nationality: string;
  nationalityCode: string;
  pepLevel: number;
  personId: string;
  placeOfBirth: string;
  sources: EmbeddableSource[];
  status: "FALSE" | "POSITIVE" | "UNRESOLVED";
  updatedAt: TimestampRes;
  yearOfBirth: number;
}
export interface KycIndividualRequestDto {
  address1: string;
  address2: string;
  countryOfResidence: string;
  createdAt: TimestampRes;
  createdBy: BasicUserInfoDto;
  dateOfBirth: TimestampRes;
  email: string;
  enableReScreening: boolean;
  enableOnGoingMonitoring: boolean;
  forename: string;
  gender: "FEMALE" | "MALE" | "UNSPECIFIED";
  governmentIdNumber: string;
  id: number;
  idIssuingCountry: string;
  lastModifiedBy: BasicUserInfoDto;
  middlename: string;
  name: string;
  nationality: string;
  phone: string;
  placeOfBirth: string;
  reScreeningEditable: boolean;
  referenceId: string;
  surname: string;
  updatedAt: TimestampRes;
  yearOfBirth: number;
  omStartPeriod: string;
  omEndPeriod: string;
}
export interface KycIndividualRequestEntity {
  address1: string;
  address2: string;
  countryOfResidence: string;
  createdAt: TimestampRes;
  dateOfBirth: TimestampRes;
  email: string;
  enableReScreening: boolean;
  forename: string;
  gender: "FEMALE" | "MALE" | "UNSPECIFIED";
  governmentIdNumber: string;
  id: number;
  idIssuingCountry: string;
  middlename: string;
  name: string;
  nationality: string;
  phone: string;
  placeOfBirth: string;
  referenceId: string;
  surname: string;
  updatedAt: TimestampRes;
  yearOfBirth: number;
}
export interface KycIndividualRequestEntityReq {
  address1: string;
  address2: string;
  countryOfResidence: string;
  createdAt: TimestampReq;
  dateOfBirth: TimestampReq;
  email: string;
  enableReScreening: string;
  forename: string;
  gender: "FEMALE" | "MALE" | "UNSPECIFIED";
  governmentIdNumber: string;
  id: number;
  idIssuingCountry: string;
  middlename: string;
  name: string;
  nationality: string;
  phone: string;
  placeOfBirth: string;
  referenceId: string;
  surname: string;
  updatedAt: TimestampReq;
  yearOfBirth: number;
}
export interface KybBusinessRequestEntityReq {
  address1: string;
  address2: string;
  countryOfResidence: string;
  createdAt: TimestampReq;
  dateOfBirth: TimestampReq;
  email: string;
  enableReScreening: string;
  forename: string;
  gender: "FEMALE" | "MALE" | "UNSPECIFIED";
  governmentIdNumber: string;
  id: number;
  idIssuingCountry: string;
  middlename: string;
  name: string;
  nationality: string;
  phone: string;
  placeOfBirth: string;
  referenceId: string;
  surname: string;
  updatedAt: TimestampReq;
  yearOfBirth: number;
}
export interface KycIndividualRiskScoreEntity {
  adverseMedia: BooleanBasedRisk;
  countryOfResidence: CountryOfResidenceRisk;
  createdAt: TimestampRes;
  financialRegulator: BooleanBasedRisk;
  id: number;
  idIssuingCountry: IdIssuingCountryRisk;
  lawEnforcement: BooleanBasedRisk;
  nationality: NationalityRisk;
  pep: LongBasedRisk;
  previouslySanctionedPerson: BooleanBasedRisk;
  reScreeningPeriod: number;
  risk: number;
  riskLevel: "HIGH" | "LOW" | "MEDIUM";
  sanctionedPersonOrCountry: BooleanBasedRisk;
  scoringId: number;
  settingId: number;
  updatedAt: TimestampRes;
}
export interface NationalityRisk {
  basel: CountryBasedRisk;
  cpi: CountryBasedRisk;
  fatf: CountryBasedRisk;
}
export interface LongBasedRisk {
  info: number;
  score: number;
}
export interface KycOrganizationRequestEntity {
  address1: string;
  address2: string;
  country: string;
  createdAt: TimestampRes;
  email: string;
  id: number;
  name: string;
  onGoingMonitor: boolean;
  organizationId: string;
  phone: string;
  referenceId: string;
  updatedAt: TimestampRes;
}
export interface KycOrganizationRequestEntityReq {
  address1: string;
  address2: string;
  country: string;
  createdAt: TimestampReq;
  email: string;
  id: number;
  name: string;
  onGoingMonitor: boolean;
  organizationId: string;
  phone: string;
  referenceId: string;
  updatedAt: TimestampReq;
}
export interface KycRequestEntity {
  archivedAt: TimestampRes;
  clientType: "EXCHANGE" | "IMPORT" | "USER";
  createdAt: TimestampRes;
  enableReScreening: boolean;
  id: number;
  individualPositiveMatch: KycIndividualMatchEntity;
  individualRequest: KycIndividualRequestEntityRes;
  individualRiskScore: KycIndividualRiskScoreEntity;
  kycId: string;
  lastScreenedAt: TimestampRes;
  messageStatus: "DONE" | "ERROR" | "PENDING";
  organizationRequest: KycOrganizationRequestEntityRes;
  positiveMatch: KycBaseMatchEntity;
  referenceId: string;
  status: "COMPLETED" | "PENDING" | "UNRESOLVED";
  type: "INDIVIDUAL" | "ORGANIZATION";
  unresolved: number;
  updatedAt: TimestampRes;
}
export interface KytInputDto {
  address: string;
  asset: "BCH" | "BNB" | "BTC" | "ERC20" | "ETH" | "LTC" | "RSK";
  createdBy: number;
  lastModifiedBy: number;
  output: string;
  referenceId: string;
}
export interface KytRequestEntity {
  address: string;
  addressDetails: AddressDetailsEntity;
  archivedAt: TimestampRes;
  asset: "BCH" | "BNB" | "BTC" | "ERC20" | "ETH" | "LTC" | "RSK";
  clientType: "EXCHANGE" | "IMPORT" | "RESCREEN" | "USER";
  createdAt: TimestampRes;
  id: number;
  kytId: string;
  messageStatus: "DONE" | "ERROR" | "PENDING";
  referenceId: string;
  updatedAt: TimestampRes;
}
export interface Link {
  href: string;
  templated: boolean;
}
export interface LoginDto {
  password: string;
  username: string;
}
export interface MatchPaging {
  currentMatch: number;
  nextId: string;
  previousId: string;
  totalMatches: number;
}
export interface MatchResponseDto {
  assignee: BasicUserInfoDto;
  kycId: string;
  match: KycIndividualMatchEntity;
  matchId: string;
  paging: MatchPaging;
  positiveMatch: KycIndividualMatchDto;
  request: KycIndividualRequestDto;
}
export interface MfaKeyDto {
  mfaKey: string;
  otpAuthUri: string;
}
export interface ModelAndView {
  empty: boolean;
  model: {};
  modelMap: {
    [k: string]: {};
  };
  reference: boolean;
  status:
    | "ACCEPTED"
    | "ALREADY_REPORTED"
    | "BAD_GATEWAY"
    | "BAD_REQUEST"
    | "BANDWIDTH_LIMIT_EXCEEDED"
    | "CHECKPOINT"
    | "CONFLICT"
    | "CONTINUE"
    | "CREATED"
    | "DESTINATION_LOCKED"
    | "EXPECTATION_FAILED"
    | "FAILED_DEPENDENCY"
    | "FORBIDDEN"
    | "FOUND"
    | "GATEWAY_TIMEOUT"
    | "GONE"
    | "HTTP_VERSION_NOT_SUPPORTED"
    | "IM_USED"
    | "INSUFFICIENT_SPACE_ON_RESOURCE"
    | "INSUFFICIENT_STORAGE"
    | "INTERNAL_SERVER_ERROR"
    | "I_AM_A_TEAPOT"
    | "LENGTH_REQUIRED"
    | "LOCKED"
    | "LOOP_DETECTED"
    | "METHOD_FAILURE"
    | "METHOD_NOT_ALLOWED"
    | "MOVED_PERMANENTLY"
    | "MOVED_TEMPORARILY"
    | "MULTIPLE_CHOICES"
    | "MULTI_STATUS"
    | "NETWORK_AUTHENTICATION_REQUIRED"
    | "NON_AUTHORITATIVE_INFORMATION"
    | "NOT_ACCEPTABLE"
    | "NOT_EXTENDED"
    | "NOT_FOUND"
    | "NOT_IMPLEMENTED"
    | "NOT_MODIFIED"
    | "NO_CONTENT"
    | "OK"
    | "PARTIAL_CONTENT"
    | "PAYLOAD_TOO_LARGE"
    | "PAYMENT_REQUIRED"
    | "PERMANENT_REDIRECT"
    | "PRECONDITION_FAILED"
    | "PRECONDITION_REQUIRED"
    | "PROCESSING"
    | "PROXY_AUTHENTICATION_REQUIRED"
    | "REQUESTED_RANGE_NOT_SATISFIABLE"
    | "REQUEST_ENTITY_TOO_LARGE"
    | "REQUEST_HEADER_FIELDS_TOO_LARGE"
    | "REQUEST_TIMEOUT"
    | "REQUEST_URI_TOO_LONG"
    | "RESET_CONTENT"
    | "SEE_OTHER"
    | "SERVICE_UNAVAILABLE"
    | "SWITCHING_PROTOCOLS"
    | "TEMPORARY_REDIRECT"
    | "TOO_EARLY"
    | "TOO_MANY_REQUESTS"
    | "UNAUTHORIZED"
    | "UNAVAILABLE_FOR_LEGAL_REASONS"
    | "UNPROCESSABLE_ENTITY"
    | "UNSUPPORTED_MEDIA_TYPE"
    | "UPGRADE_REQUIRED"
    | "URI_TOO_LONG"
    | "USE_PROXY"
    | "VARIANT_ALSO_NEGOTIATES";
  view: View;
  viewName: string;
}
export interface View {
  contentType: string;
}
export interface NoteDtoReq {
  attachments: AttachmentDtoReq[];
  content: string;
  createdAt: TimestampReq;
  createdBy: BasicUserInfoDto;
  id: number;
  lastModifiedBy: BasicUserInfoDto;
  referenceId: number;
  type: "CASE" | "KYC" | "KYC_MATCH" | "KYC_SCORING" | "KYT";
  updatedAt: TimestampReq;
}
export interface NoteDtoRes {
  attachments: AttachmentDtoRes[];
  content: string;
  createdAt: TimestampRes;
  createdBy: BasicUserInfoDto;
  id: number;
  lastModifiedBy: BasicUserInfoDto;
  referenceId: number;
  type: "CASE" | "KYC" | "KYC_MATCH" | "KYC_SCORING" | "KYT";
  updatedAt: TimestampRes;
}
export interface NotificationEntity {
  createdAt: Timestamp;
  id: number;
  payload: {};
  read: boolean;
  type: "ASSIGN";
  updatedAt: Timestamp;
  userId: number;
}
export interface OtherSettingDto {
  highReScreening: number;
  highScore: number;
  lowReScreening: number;
  lowScore: number;
  mediumReScreening: number;
  mediumScore: number;
}
export interface PageResultAuditDto {
  records: AuditDto[];
  total_pages: number;
  total_records: number;
}
export interface PageResultCaseListingDto {
  records: CaseListingDto[];
  total_pages: number;
  total_records: number;
}
export interface PageResultKycRequestEntity {
  records: KycRequestEntity[];
  total_pages: number;
  total_records: number;
}
export interface PageResultKycSimplifiedRequestDto {
  records: KycSimplifiedRequestDto[];
  total_pages: number;
  total_records: number;
}
export interface PageResultKytRequestDto {
  records: KytRequestDto[];
  total_pages: number;
  total_records: number;
}
export interface PageResultNoteDto {
  records: NoteDtoRes[];
  total_pages: number;
  total_records: number;
}
export interface PageResultNotificationEntity {
  records: NotificationEntity[];
  total_pages: number;
  total_records: number;
}
export interface PageResultScoringInfoDto {
  records: ScoringInfoDto[];
  total_pages: number;
  total_records: number;
}
export interface ScoringInfoDto {
  description: string;
  id: number;
  isActive: boolean;
  isEnabledActive: boolean;
  name: string;
}

export interface ACLInfoDto {
  id: number,
  role: string,
  lastModifiedBy: BasicUserInfoDto,
  updatedAt: TimestampRes,
  type?: string,
}
export interface PageResultTransactionEntity {
  records: TransactionEntity[];
  total_pages: number;
  total_records: number;
}
export interface TransactionEntity {
  balance: number;
  blockHeight: number;
  createdAt: TimestampRes;
  date: number;
  id: number;
  received: number;
  spent: number;
  txHash: string;
  txIndex: number;
  updatedAt: TimestampRes;
}
export interface PageResultUserDto {
  records: UserDtoRes[];
  total_pages: number;
  total_records: number;
}
export interface UserDtoRes {
  address: string;
  avatar: string;
  bio: string;
  colorCode: string;
  createdAt: TimestampRes;
  createdBy: BasicUserInfoDto;
  email: string;
  firstName: string;
  id: number;
  lastModifiedBy: BasicUserInfoDto;
  lastName: string;
  locked: boolean;
  phone: string;
  role: "ADMIN" | "STAFF" | "SUPERADMIN" | "USER";
  updatedAt: TimestampRes;
}
export interface RefreshTokenDto {
  refresh_token: string;
}
export interface ResetPasswordDto {
  password: string;
}
export interface Resource {
  description: string;
  file: string;
  filename: string;
  inputStream: InputStream;
  open: boolean;
  readable: boolean;
  uri: string;
  url: string;
}
export interface ResponseEntity {
  body: {};
  statusCode:
    | "ACCEPTED"
    | "ALREADY_REPORTED"
    | "BAD_GATEWAY"
    | "BAD_REQUEST"
    | "BANDWIDTH_LIMIT_EXCEEDED"
    | "CHECKPOINT"
    | "CONFLICT"
    | "CONTINUE"
    | "CREATED"
    | "DESTINATION_LOCKED"
    | "EXPECTATION_FAILED"
    | "FAILED_DEPENDENCY"
    | "FORBIDDEN"
    | "FOUND"
    | "GATEWAY_TIMEOUT"
    | "GONE"
    | "HTTP_VERSION_NOT_SUPPORTED"
    | "IM_USED"
    | "INSUFFICIENT_SPACE_ON_RESOURCE"
    | "INSUFFICIENT_STORAGE"
    | "INTERNAL_SERVER_ERROR"
    | "I_AM_A_TEAPOT"
    | "LENGTH_REQUIRED"
    | "LOCKED"
    | "LOOP_DETECTED"
    | "METHOD_FAILURE"
    | "METHOD_NOT_ALLOWED"
    | "MOVED_PERMANENTLY"
    | "MOVED_TEMPORARILY"
    | "MULTIPLE_CHOICES"
    | "MULTI_STATUS"
    | "NETWORK_AUTHENTICATION_REQUIRED"
    | "NON_AUTHORITATIVE_INFORMATION"
    | "NOT_ACCEPTABLE"
    | "NOT_EXTENDED"
    | "NOT_FOUND"
    | "NOT_IMPLEMENTED"
    | "NOT_MODIFIED"
    | "NO_CONTENT"
    | "OK"
    | "PARTIAL_CONTENT"
    | "PAYLOAD_TOO_LARGE"
    | "PAYMENT_REQUIRED"
    | "PERMANENT_REDIRECT"
    | "PRECONDITION_FAILED"
    | "PRECONDITION_REQUIRED"
    | "PROCESSING"
    | "PROXY_AUTHENTICATION_REQUIRED"
    | "REQUESTED_RANGE_NOT_SATISFIABLE"
    | "REQUEST_ENTITY_TOO_LARGE"
    | "REQUEST_HEADER_FIELDS_TOO_LARGE"
    | "REQUEST_TIMEOUT"
    | "REQUEST_URI_TOO_LONG"
    | "RESET_CONTENT"
    | "SEE_OTHER"
    | "SERVICE_UNAVAILABLE"
    | "SWITCHING_PROTOCOLS"
    | "TEMPORARY_REDIRECT"
    | "TOO_EARLY"
    | "TOO_MANY_REQUESTS"
    | "UNAUTHORIZED"
    | "UNAVAILABLE_FOR_LEGAL_REASONS"
    | "UNPROCESSABLE_ENTITY"
    | "UNSUPPORTED_MEDIA_TYPE"
    | "UPGRADE_REQUIRED"
    | "URI_TOO_LONG"
    | "USE_PROXY"
    | "VARIANT_ALSO_NEGOTIATES";
  statusCodeValue: number;
}
export interface RiskResponseDto {
  assignee: BasicUserInfoDto;
  kycId: string;
  positiveMatch: KycIndividualMatchDto;
  request: KycIndividualRequestDto;
  scoring: KycIndividualRiskScoreEntity;
}
export interface ScoringDto {
  description: string;
  fatfPepScore: FatfPepScoreDto;
  id: number;
  isActive: boolean;
  isEnabledActive: boolean;
  name: string;
  otherSetting: OtherSettingDto;
  weightSetting: WeightSettingDto;
}
export interface WeightSettingDto {
  adverseMedia: ChildWeightSettingDto;
  baselGoverment: ChildWeightSettingDto;
  baselNationality: ChildWeightSettingDto;
  baselResidence: ChildWeightSettingDto;
  cpiGoverment: ChildWeightSettingDto;
  cpiNationality: ChildWeightSettingDto;
  cpiResidence: ChildWeightSettingDto;
  fatfGoverment: ChildWeightSettingDto;
  fatfNationality: ChildWeightSettingDto;
  fatfResidence: ChildWeightSettingDto;
  financialRegulator: ChildWeightSettingDto;
  isCountrySanction: boolean;
  isPersonSanction: boolean;
  lawEnforcement: ChildWeightSettingDto;
  pepScoreSetting: ChildWeightSettingDto;
  previouslySanction: ChildWeightSettingDto;
}
export interface SettingKycDtoReq {
  createdAt: TimestampReq;
  createdBy: BasicUserInfoDto;
  fuzzyLevel: number;
  id: number;
  lastModifiedBy: BasicUserInfoDto;
  name: string;
  updatedAt: TimestampReq;
}
export interface SettingKycDtoRes {
  createdAt: TimestampRes;
  createdBy: BasicUserInfoDto;
  fuzzyLevel: number;
  id: number;
  lastModifiedBy: BasicUserInfoDto;
  name: string;
  updatedAt: TimestampRes;
}
export interface SettingKytDtoReq {
  createdAt: TimestampReq;
  createdBy: BasicUserInfoDto;
  id: number;
  lastModifiedBy: BasicUserInfoDto;
  name: string;
  riskLevelSetting: {};
  updatedAt: TimestampReq;
}
export interface SettingKytDtoRes {
  createdAt: TimestampRes;
  createdBy: BasicUserInfoDto;
  id: number;
  lastModifiedBy: BasicUserInfoDto;
  name: string;
  riskLevelSetting: {};
  updatedAt: TimestampRes;
}
export interface SupportTicketDto {
  email: string;
  message: string;
  name: string;
  phone: string;
  subject: string;
  supportType: string;
}
export interface TokenDto {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}
export interface UserDtoReq {
  address: string;
  avatar: string;
  bio: string;
  colorCode: string;
  createdAt: TimestampReq;
  createdBy: BasicUserInfoDto;
  email: string;
  firstName: string;
  id: number;
  lastModifiedBy: BasicUserInfoDto;
  lastName: string;
  locked: boolean;
  phone: string;
  role: "ADMIN" | "STAFF" | "SUPERADMIN" | "USER";
  updatedAt: TimestampReq;
}
export interface UserWithPasswordDto {
  address: string;
  avatar: string;
  bio: string;
  colorCode: string;
  createdAt: TimestampReq;
  createdBy: BasicUserInfoDto;
  email: string;
  firstName: string;
  id: number;
  lastModifiedBy: BasicUserInfoDto;
  lastName: string;
  locked: boolean;
  password: string;
  phone: string;
  role: "ADMIN" | "STAFF" | "SUPERADMIN" | "USER";
  updatedAt: TimestampReq;
}
export interface VerifyMfaDto {
  mfaCode: string;
  mfaToken: string;
}
export interface TransactionListDto {
  createdAt: TimestampRes;
  createdBy: BasicUserInfoDto;
}

export interface GeneralSettingsDto {
  kycSearchConfirmation: boolean;
  kybSearchConfirmation: boolean;
  kytSearchConfirmation: boolean;
}
