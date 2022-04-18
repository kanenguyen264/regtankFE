import { CustomerDto, RiskResponseDto, ScoringDto } from "types/typings-api";

export interface RiskScoringReportProps {
  chartData: string;
  company: CustomerDto;
  riskScoring: RiskResponseDto;
  scoring: ScoringDto;

}
export default function DJKYCRiskScoringReport(
  props: RiskScoringReportProps
): JSX.Element;
