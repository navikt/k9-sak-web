import type { PersonDto } from '@k9-sak-web/backend/k9sak/generated';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import type { Aksjonspunkt } from '../types/Aksjonspunkt';
import type { Medlemskap } from '../types/Medlemskap';
import type { MerknaderFraBeslutter } from '../types/MerknaderFraBeslutter';
import type { Soknad } from '../types/Soknad';
import OppholdInntektOgPerioderForm from './oppholdInntektOgPerioder/OppholdInntektOgPerioderForm';

interface MedlemskapInfoPanelProps {
  submittable: boolean;
  aksjonspunkter: Aksjonspunkt[];
  readOnly: boolean;
  submitCallback: (aksjonspunktData: any) => Promise<void>;
  alleMerknaderFraBeslutter: MerknaderFraBeslutter;
  behandlingId: number;
  behandlingVersjon: number;
  fagsakPerson: PersonDto;
  behandlingType: string;
  soknad: Soknad;
  medlemskap: Medlemskap;
}

/**
 * MedlemskapInfoPanel
 *
 * Presentasjonskomponent. Har ansvar for å vise faktapanelene for medlemskap.
 */
const MedlemskapInfoPanel = ({
  submittable,
  aksjonspunkter,
  readOnly,
  submitCallback,
  alleMerknaderFraBeslutter,
  behandlingId,
  behandlingVersjon,
  behandlingType: behandlingTypeProp,
  soknad,
  medlemskap,
  fagsakPerson,
}: MedlemskapInfoPanelProps) => (
  <OppholdInntektOgPerioderForm
    soknad={soknad}
    readOnly={readOnly}
    submitCallback={submitCallback}
    submittable={submittable}
    aksjonspunkter={aksjonspunkter}
    alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
    behandlingId={behandlingId}
    behandlingVersjon={behandlingVersjon}
    medlemskap={medlemskap}
    fagsakPerson={fagsakPerson}
    isRevurdering={behandlingTypeProp === behandlingType.REVURDERING && !!medlemskap.fom}
  />
);

export default MedlemskapInfoPanel;
