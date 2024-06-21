import { renderWithIntl, renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { ArbeidsforholdV2, Behandling } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../i18n/nb_NO.json';
import ÅrskvantumForbrukteDager from './dto/ÅrskvantumForbrukteDager';
import ÅrskvantumIndex from './ÅrskvantumIndex';

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

    renderWithIntlAndReduxForm(
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
        fosterbarn={[]}
      />,
      { messages },
    );

    expect(screen.getByTestId('aksjonspunktform')).toBeInTheDocument();
  });

  it('rendrer ikke aksjonspunkt-form hvis det ikke finnes aksjonspunkter', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, [{ AKSJONSPUNKT_9014: true }]);

    renderWithIntl(
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
      { messages },
    );

    expect(screen.queryByTestId('aksjonspunktform')).not.toBeInTheDocument();
  });
});
