interface LineLabelProps {
  lineWidth?: number;
  margin?: number;
  strokeWidth?: number;
  textPadding?: number;
  textStyle?: any;
}

export default function LineLabel(
  config?: LineLabelProps
): {
  label: (props: any) => SVGElement;
  labelLine: (props: any) => SVGElement;
};
