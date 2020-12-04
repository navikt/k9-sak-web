import React from 'react';
import { expect } from 'chai';
import { Behandling, InntektArbeidYtelse } from '@k9-sak-web/types';
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

// @ts-ignore
const behandling: Behandling = {
  id: 123,
  versjon: 1,
};
// @ts-ignore
const inntektArbeidYtelse: InntektArbeidYtelse = {
  arbeidsforhold: [
    {
      kilde: {
        kode: '-',
      },
      navn: 'Bedrift AS',
      arbeidsgiverIdentifikator: '999',
    },
  ],
};

describe('<ÅrskvantumIndex>', () => {
  it('rendrer aksjonspunkt-form hvis det finnes aksjonspunkter', () => {
    const wrapperAksjonspunkt = shallowWithIntl(
      <ÅrskvantumIndex
        årskvantum={årskvantum}
        aksjonspunkterForSteg={[
          {
            definisjon: {
              kode: '',
              kodeverk: '',
            },
            status: {
              kode: '',
              kodeverk: '',
            },
            kanLoses: true,
            erAktivt: true,
          },
        ]}
        behandling={behandling}
        alleKodeverk={{}}
        fullUttaksplan={{}}
        isAksjonspunktOpen={false}
        submitCallback={() => undefined}
        inntektArbeidYtelse={inntektArbeidYtelse}
      />,
    );

    expect(wrapperAksjonspunkt.find(AksjonspunktForm)).to.have.length(1);
  });

  it('rendrer ikke aksjonspunkt-form hvis det ikke finnes aksjonspunkter', () => {
    const wrapperIngenAksjonspunkt = shallowWithIntl(
      <ÅrskvantumIndex
        årskvantum={årskvantum}
        aksjonspunkterForSteg={[]}
        behandling={behandling}
        alleKodeverk={{}}
        fullUttaksplan={{}}
        isAksjonspunktOpen={false}
        submitCallback={() => undefined}
        inntektArbeidYtelse={inntektArbeidYtelse}
      />,
    );

    expect(wrapperIngenAksjonspunkt.find(AksjonspunktForm)).to.have.length(0);
  });
});
