import { ScoringDto } from "types/typings-api";

export interface SSWeightSettingTableProps {
  context?: TableContextProps;
  declareColumnSizings?: number[];
  scoring: ScoringDto;
}
export default function SSWeightSettingTable(
  props: SSWeightSettingTableProps
): JSX.Element;
