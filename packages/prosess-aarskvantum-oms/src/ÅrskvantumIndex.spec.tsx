import React from 'react';
import { Behandling, ArbeidsforholdV2 } from '@k9-sak-web/types';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { shallowWithIntl } from '../i18n';
import ÅrskvantumIndex from './ÅrskvantumIndex';
import AksjonspunktForm from './components/AksjonspunktForm';
import ÅrskvantumForbrukteDager from './dto/ÅrskvantumForbrukteDager';

const årskvantum: ÅrskvantumForbrukteDager = {
  totaltAntallDager: 17,
  antallKoronadager: 0,
  antallDagerArbeidsgiverDekker: 3,
  forbrukteDager: 7.4,
  restdager: 9.6,
  restTid: 'PT802H30M',
  antallDagerInfotrygd: 2,
  sisteUttaksplan: {
    aktiviteter: [],
    aktiv: true,
    behandlingUUID: '1',
    saksnummer: '2',
    innsendingstidspunkt: '123',
    benyttetRammemelding: true,
  },
  rammevedtak: [],
  barna: [],
};

const behandling = {
  id: 123,
  versjon: 1,
} as Behandling;

const arbeidsforhold = [
  {
    arbeidsgiver: {
      arbeidsgiverOrgnr: '12345678',
    },
  },
] as ArbeidsforholdV2[];

const arbeidsgivere = {
  12345678: {
    erPrivatPerson: false,
    referanse: '999',
    identifikator: '999',
    navn: 'Bedrift AS',
    arbeidsforholdreferanser: [],
  },
};

describe('<ÅrskvantumIndex>', () => {
  it('rendrer aksjonspunkt-form hvis det finnes aksjonspunkter', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, [{ AKSJONSPUNKT_9014: true }]);

    const wrapperAksjonspunkt = shallowWithIntl(
      <ÅrskvantumIndex
        årskvantum={årskvantum}
        aksjonspunkterForSteg={[
          {
            definisjon: '',
            status: '',
            kanLoses: true,
            erAktivt: true,
          },
        ]}
        behandling={behandling}
        alleKodeverk={{}}
        fullUttaksplan={{}}
        isAksjonspunktOpen={false}
        submitCallback={() => undefined}
        arbeidsforhold={arbeidsforhold}
        arbeidsgiverOpplysningerPerId={arbeidsgivere}
      />,
    );

    expect(wrapperAksjonspunkt.find(AksjonspunktForm)).toHaveLength(1);
  });

  it('rendrer ikke aksjonspunkt-form hvis det ikke finnes aksjonspunkter', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, [{ AKSJONSPUNKT_9014: true }]);

    const wrapperIngenAksjonspunkt = shallowWithIntl(
      <ÅrskvantumIndex
        årskvantum={årskvantum}
        aksjonspunkterForSteg={[]}
        behandling={behandling}
        alleKodeverk={{}}
        fullUttaksplan={{}}
        isAksjonspunktOpen={false}
        submitCallback={() => undefined}
        arbeidsforhold={arbeidsforhold}
        arbeidsgiverOpplysningerPerId={arbeidsgivere}
      />,
    );

    expect(wrapperIngenAksjonspunkt.find(AksjonspunktForm)).toHaveLength(0);
  });
});
