import { ProcessMenuStepType } from '@navikt/k9-react-components';

interface ProsessStegMenyRad {
  labelId: string;
  isActive: boolean;
  isDisabled: boolean;
  isFinished: boolean;
  type?: ProcessMenuStepType;
  usePartialStatus: boolean;
}

export default ProsessStegMenyRad;
