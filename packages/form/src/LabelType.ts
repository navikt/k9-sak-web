interface Label {
  id: string;
  args?: any;
}

type LabelType = React.ReactNode | Label;

export default LabelType;
