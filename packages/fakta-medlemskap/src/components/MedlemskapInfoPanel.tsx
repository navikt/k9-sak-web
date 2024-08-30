import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { Aksjonspunkt, FagsakPerson, KodeverkMedNavn } from '@k9-sak-web/types';
import React from 'react';
import { Medlemskap } from './oppholdInntektOgPerioder/Medlemskap';
import { MerknaderFraBeslutter } from './oppholdInntektOgPerioder/MerknaderFraBeslutter';
import OppholdInntektOgPerioderForm from './oppholdInntektOgPerioder/OppholdInntektOgPerioderForm';
import { Soknad } from './oppholdInntektOgPerioder/Soknad';

interface MedlemskapInfoPanelProps {
  submittable: boolean;
  aksjonspunkter: Aksjonspunkt[];
  readOnly: boolean;
  submitCallback: (aksjonspunktData: any) => Promise<void>;
  alleMerknaderFraBeslutter: MerknaderFraBeslutter;
  behandlingId: number;
  behandlingVersjon: number;
  fagsakPerson: FagsakPerson;
  behandlingType: string;
  soknad?: Soknad;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
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
  alleKodeverk,
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
    alleKodeverk={alleKodeverk}
    medlemskap={medlemskap}
    fagsakPerson={fagsakPerson}
    isRevurdering={behandlingTypeProp === behandlingType.REVURDERING && !!medlemskap.fom}
  />
);

export default MedlemskapInfoPanel;
