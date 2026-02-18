import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';

interface ProsessStegMenyRad {
  labelId: string;
  isActive: boolean;
  isDisabled: boolean;
  isFinished: boolean;
  type?: ProcessMenuStepType;
  usePartialStatus: boolean;
}

export default ProsessStegMenyRad;
