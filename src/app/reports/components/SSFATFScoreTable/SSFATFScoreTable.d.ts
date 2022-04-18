import { ScoringDto } from "types/typings-api";

export interface SSFATFScoreTableProps {
  context?: TableContextProps;
  scoring: ScoringDto;
}
export default function SSFATFScoreTable(
  props: SSFATFScoreTableProps
): JSX.Element;
