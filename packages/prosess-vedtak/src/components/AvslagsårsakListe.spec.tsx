import React from 'react';
import sinon from 'sinon';
import { renderWithIntlAndReduxForm, screen } from '@fpsak-frontend/utils-test/src/test-utils';
import AvslagsårsakListe from './AvslagsårsakListe';

describe('<AvslagårsakListe>', () => {
  it('skal rendre avslagspanel og textArea når en har ikke oppfylt søknadsfristvilkår', () => {
    const vilkar = [
      {
        vilkarType: { kode: 'FP_VK_23', kodeverk: 'VILKAR_TYPE' },
        lovReferanse: '§ 9-2 jamfør 8-2',
        overstyrbar: true,
        perioder: [
          {
            avslagKode: '1035',
            merknadParametere: {
              antattGodkjentArbeid: 'P0D',
              antattOpptjeningAktivitetTidslinje: 'LocalDateTimeline<0 [0]> = []',
            },
            vilkarStatus: { kode: 'IKKE_OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
            periode: { fom: '2020-03-16', tom: '2020-03-19' },
            begrunnelse: null,
          },
          {
            avslagKode: '1035',
            merknadParametere: {
              antattGodkjentArbeid: 'P0D',
              antattOpptjeningAktivitetTidslinje: 'LocalDateTimeline<0 [0]> = []',
            },
            vilkarStatus: { kode: 'IKKE_OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
            periode: { fom: '2020-03-23', tom: '2020-03-26' },
            begrunnelse: null,
          },
        ],
      },
      {
        vilkarType: { kode: 'FP_VK_2', kodeverk: 'VILKAR_TYPE' },
        lovReferanse: '§ 2',
        overstyrbar: true,
        perioder: [
          {
            avslagKode: '1020',
            merknadParametere: {},
            vilkarStatus: { kode: 'IKKE_OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
            periode: { fom: '2020-03-16', tom: '2020-03-26' },
            begrunnelse: null,
          },
        ],
      },
    ];

    renderWithIntlAndReduxForm(<AvslagsårsakListe vilkar={vilkar} getKodeverknavn={sinon.spy()} />);
    expect(screen.getAllByText(':')).toHaveLength(2);
  });
});
