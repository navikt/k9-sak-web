import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Aksjonspunkt, Behandling, FastsattOpptjening } from '@k9-sak-web/types';

import opptjeningAktivitetKlassifisering from '@fpsak-frontend/prosess-vilkar-opptjening/src/kodeverk/opptjeningAktivitetKlassifisering';
import OpptjeningVilkarForm from './OpptjeningVilkarForm';
import OpptjeningVilkarView from './OpptjeningVilkarView';
import OpptjeningVilkarAksjonspunktPanel from './OpptjeningVilkarAksjonspunktPanel';

const fastsattOpptjening = {
  opptjeningperiode: {
    måneder: 2,
    dager: 3,
  },
  fastsattOpptjeningAktivitetList: [
    {
      fom: '2018-01-01',
      tom: '2018-04-04',
      klasse: {
        kode: opptjeningAktivitetKlassifisering.BEKREFTET_GODKJENT,
      },
    },
  ],
  opptjeningFom: '2018-01-01',
  opptjeningTom: '2018-10-01',
} as FastsattOpptjening;

describe('<OpptjeningVilkarForm>', () => {
  it('skal vise OpptjeningVilkarAksjonspunktPanel når en har aksjonspunkt', () => {
    const wrapper = shallow(
      <OpptjeningVilkarForm
        readOnlySubmitButton
        readOnly
        isAksjonspunktOpen
        submitCallback={sinon.spy()}
        behandlingId={1}
        behandlingVersjon={2}
        behandlingsresultat={{} as Behandling['behandlingsresultat']}
        aksjonspunkter={
          [
            {
              definisjon: {
                kode: aksjonspunktCodes.SVANGERSKAPSVILKARET,
              },
              status: {
                kode: aksjonspunktStatus.OPPRETTET,
              },
              begrunnelse: undefined,
            },
          ] as Aksjonspunkt[]
        }
        status="test"
        lovReferanse="Dette er en lovreferanse"
        fastsattOpptjening={fastsattOpptjening}
      />,
    );

    const aksjonspunktPanel = wrapper.find(OpptjeningVilkarAksjonspunktPanel);
    expect(aksjonspunktPanel).toHaveLength(1);
  });

  it('skal vise OpptjeningVilkarView når en ikke har aksjonspunkt', () => {
    const wrapper = shallow(
      <OpptjeningVilkarForm
        readOnlySubmitButton
        readOnly
        isAksjonspunktOpen={false}
        submitCallback={sinon.spy()}
        behandlingId={1}
        behandlingVersjon={2}
        behandlingsresultat={{} as Behandling['behandlingsresultat']}
        aksjonspunkter={[]}
        status="test"
        lovReferanse="Dette er en lovreferanse"
        fastsattOpptjening={fastsattOpptjening}
      />,
    );
    const vilkarView = wrapper.find(OpptjeningVilkarView);
    expect(vilkarView).toHaveLength(1);
  });
});
