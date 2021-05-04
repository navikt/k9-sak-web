import { StepType } from '@navikt/nap-process-menu/dist/Step';

interface ProsessStegMenyRad {
  labelId: string;
  isActive: boolean;
  isDisabled: boolean;
  isFinished: boolean;
  type?: StepType;
  usePartialStatus: boolean;
}

export default ProsessStegMenyRad;
