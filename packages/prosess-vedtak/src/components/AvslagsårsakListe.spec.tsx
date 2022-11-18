import React from 'react';
import sinon from 'sinon';
import shallowWithIntl from '../../i18n';
import AvslagsårsakListe from './AvslagsårsakListe';

describe('<AvslagårsakListe>', () => {
  it('skal rendre avslagspanel og textArea når en har ikke oppfylt søknadsfristvilkår', () => {
    const vilkar = [
      {
        vilkarType: 'FP_VK_23',
        lovReferanse: '§ 9-2 jamfør 8-2',
        overstyrbar: true,
        perioder: [
          {
            avslagKode: '1035',
            merknadParametere: {
              antattGodkjentArbeid: 'P0D',
              antattOpptjeningAktivitetTidslinje: 'LocalDateTimeline<0 [0]> = []',
            },
            vilkarStatus: 'IKKE_OPPFYLT',
            periode: { fom: '2020-03-16', tom: '2020-03-19' },
            begrunnelse: undefined,
          },
          {
            avslagKode: '1035',
            merknadParametere: {
              antattGodkjentArbeid: 'P0D',
              antattOpptjeningAktivitetTidslinje: 'LocalDateTimeline<0 [0]> = []',
            },
            vilkarStatus: 'IKKE_OPPFYLT',
            periode: { fom: '2020-03-23', tom: '2020-03-26' },
            begrunnelse: undefined,
          },
        ],
      },
      {
        vilkarType: 'FP_VK_2',
        lovReferanse: '§ 2',
        overstyrbar: true,
        perioder: [
          {
            avslagKode: '1020',
            merknadParametere: {},
            vilkarStatus: 'IKKE_OPPFYLT',
            periode: { fom: '2020-03-16', tom: '2020-03-26' },
            begrunnelse: undefined,
          },
        ],
      },
    ];

    const wrapper = shallowWithIntl(<AvslagsårsakListe vilkar={vilkar} getKodeverknavn={sinon.spy()} />);
    const normaltekstFields = wrapper.find('Normaltekst');
    expect(normaltekstFields).toHaveLength(2);
  });
});
