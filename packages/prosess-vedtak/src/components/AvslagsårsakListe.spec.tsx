import { renderWithIntlAndReduxForm, screen } from '@fpsak-frontend/utils-test/test-utils';
import React from 'react';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import { BehandlingType } from '@k9-sak-web/lib/types/BehandlingType.js';
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
            vilkarStatus: 'IKKE_OPPFYLT', // 'VILKAR_UTFALL_TYPE'
            periode: { fom: '2020-03-16', tom: '2020-03-19' },
            begrunnelse: null,
          },
          {
            avslagKode: '1035',
            merknadParametere: {
              antattGodkjentArbeid: 'P0D',
              antattOpptjeningAktivitetTidslinje: 'LocalDateTimeline<0 [0]> = []',
            },
            vilkarStatus: 'IKKE_OPPFYLT', // 'VILKAR_UTFALL_TYPE'
            periode: { fom: '2020-03-23', tom: '2020-03-26' },
            begrunnelse: null,
          },
        ],
      },
      {
        vilkarType: 'FP_VK_2', // 'VILKAR_TYPE',
        lovReferanse: '§ 2',
        overstyrbar: true,
        perioder: [
          {
            avslagKode: '1020',
            merknadParametere: {},
            vilkarStatus: 'IKKE_OPPFYLT', // 'VILKAR_UTFALL_TYPE'
            periode: { fom: '2020-03-16', tom: '2020-03-26' },
            begrunnelse: null,
          },
        ],
      },
    ];

    renderWithIntlAndReduxForm(
      <KodeverkProvider
        behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <AvslagsårsakListe vilkar={vilkar} />
      </KodeverkProvider>,
    );
    expect(screen.getAllByText('Opptjeningsvilkåret: Ikke tilstrekkelig opptjening')).toHaveLength(1);
    expect(screen.getAllByText('Medlemskapsvilkåret: Søker er ikke medlem')).toHaveLength(1);
  });
});
