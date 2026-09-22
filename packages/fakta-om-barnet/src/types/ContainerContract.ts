interface ContainerContract {
  readOnly: boolean;
  endpoints: {
    rettVedDod: string;
    omPleietrengende: string;
  };
  errorNotifier: (error: Error) => void;
  onFinished: (vurdering) => void;
}

export default ContainerContract;
