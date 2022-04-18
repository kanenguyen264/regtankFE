import { BasicUserInfoDto, CustomerDto, ScoringDto } from "types/typings-api";

export interface SettingScoringReportProps {
  chartData: string;
  company: CustomerDto;
  printedBy: BasicUserInfoDto;
  scoring: ScoringDto;
}
export default function SettingScoringReport(
  props: SettingScoringReportProps
): JSX.Element;
