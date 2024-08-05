import { Aksjonspunkt, Behandling, FagsakPerson, KodeverkMedNavn } from '@k9-sak-web/types';
import React from 'react';
import { RawIntlProvider, createIntl, createIntlCache } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import MedlemskapInfoPanel from './components/MedlemskapInfoPanel';
import { Medlemskap } from './components/oppholdInntektOgPerioder/Medlemskap';
import { MerknaderFraBeslutter } from './components/oppholdInntektOgPerioder/MerknaderFraBeslutter';
import { Soknad } from './components/oppholdInntektOgPerioder/Soknad';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface MedlemskapFaktaIndexProps {
  behandling: Behandling;
  medlemskap: Medlemskap;
  soknad?: Soknad;
  aksjonspunkter: Aksjonspunkt[];
  fagsakPerson: FagsakPerson;
  alleMerknaderFraBeslutter: MerknaderFraBeslutter;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
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
  alleKodeverk,
  submitCallback,
  readOnly,
}: MedlemskapFaktaIndexProps) => (
  <RawIntlProvider value={intl}>
    {medlemskap && (
      <MedlemskapInfoPanel
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        behandlingType={behandling.type}
        soknad={soknad}
        medlemskap={medlemskap}
        fagsakPerson={fagsakPerson}
        aksjonspunkter={aksjonspunkter}
        submittable={submittable}
        alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
        alleKodeverk={alleKodeverk}
        submitCallback={submitCallback}
        readOnly={readOnly}
      />
    )}
  </RawIntlProvider>
);

export default MedlemskapFaktaIndex;
