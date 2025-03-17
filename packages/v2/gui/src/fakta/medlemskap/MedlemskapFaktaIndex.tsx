import type { PersonDto } from '@k9-sak-web/backend/k9sak/generated';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import OppholdInntektOgPerioderForm from './components/oppholdInntektOgPerioder/OppholdInntektOgPerioderForm';
import type { Aksjonspunkt } from './types/Aksjonspunkt';
import type { Behandling } from './types/Behandling';
import type { Medlemskap } from './types/Medlemskap';
import type { MerknaderFraBeslutter } from './types/MerknaderFraBeslutter';
import type { Soknad } from './types/Soknad';

export interface MedlemskapFaktaIndexProps {
  behandling: Behandling;
  medlemskap: Medlemskap;
  soknad: Soknad;
  aksjonspunkter: Aksjonspunkt[];
  fagsakPerson: PersonDto;
  alleMerknaderFraBeslutter: MerknaderFraBeslutter;
  submitCallback: (aksjonspunktData: any) => Promise<void>;
  readOnly: boolean;
  submittable: boolean;
}

const MedlemskapFaktaIndex = ({
  behandling,
  soknad,
  medlemskap,
  aksjonspunkter,
  submittable,
  fagsakPerson,
  alleMerknaderFraBeslutter,
  submitCallback,
  readOnly,
}: MedlemskapFaktaIndexProps) => (
  <>
    {medlemskap && (
      <OppholdInntektOgPerioderForm
        soknad={soknad}
        readOnly={readOnly}
        submitCallback={submitCallback}
        submittable={submittable}
        aksjonspunkter={aksjonspunkter}
        alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        medlemskap={medlemskap}
        fagsakPerson={fagsakPerson}
        isRevurdering={behandling.type === behandlingType.REVURDERING && !!medlemskap.fom}
      />
    )}
  </>
);

export default MedlemskapFaktaIndex;
