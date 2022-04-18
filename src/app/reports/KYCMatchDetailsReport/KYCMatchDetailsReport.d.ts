import { KycSimplifiedRequestDto, MatchResponseDto } from "types/typings-api";

export interface KYCMatchDetailsReportProps {
  kycRequest: KycSimplifiedRequestDto;
  match: MatchResponseDto;
}
export default function KYCMatchDetailsReport(
  props: KYCMatchDetailsReportProps
): JSX.Element;
