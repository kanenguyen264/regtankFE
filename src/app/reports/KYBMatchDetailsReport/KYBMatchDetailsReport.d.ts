import { MatchResponseDto } from "types/typings-api";

export interface KYBMatchDetailsReportProps {
  kybRequest: KybSimplifiedRequestDto;
  match: MatchResponseDto;
}
export default function KYBMatchDetailsReport(
  props: KYBMatchDetailsReportProps
): JSX.Element;
