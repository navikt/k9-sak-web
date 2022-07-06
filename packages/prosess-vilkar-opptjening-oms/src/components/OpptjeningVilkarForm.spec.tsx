import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Aksjonspunkt } from '@k9-sak-web/types';

import OpptjeningVilkarForm from './OpptjeningVilkarForm';
import OpptjeningVilkarAksjonspunktPanel from './OpptjeningVilkarAksjonspunktPanel';

const periode = {
  avslagKode: '1035',
  begrunnelse: null,
  merknadParametere: {
    antattGodkjentArbeid: 'P9D',
    antattOpptjeningAktivitetTidslinje: 'LocalDateTimeline<2020-03-27, 2020-04-04 [1]> = [[2020-03-27, 2020-04-04]]',
  },
  periode: { fom: '2020-04-24', tom: '2020-04-24' },
  vilkarStatus: 'IKKE_OPPFYLT',
  vurdersIBehandlingen: true,
};

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
        aksjonspunkter={
          [
            {
              definisjon: aksjonspunktCodes.SVANGERSKAPSVILKARET,
              status: aksjonspunktStatus.OPPRETTET,
              begrunnelse: undefined,
            },
          ] as Aksjonspunkt[]
        }
        status="test"
        lovReferanse="Dette er en lovreferanse"
        periodeIndex={0}
        vilkårPerioder={[periode]}
        opptjeninger={[]}
      />,
    );

    const aksjonspunktPanel = wrapper.find(OpptjeningVilkarAksjonspunktPanel);
    expect(aksjonspunktPanel).toHaveLength(1);
  });
});
