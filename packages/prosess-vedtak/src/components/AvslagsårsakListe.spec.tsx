import { renderWithIntlAndReduxForm, screen } from '@fpsak-frontend/utils-test/test-utils';
import { vilkarType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { utfall } from '@navikt/k9-sak-typescript-client';
import AvslagsårsakListe from './AvslagsårsakListe';

describe('<AvslagårsakListe>', () => {
  it('skal rendre avslagspanel og textArea når en har ikke oppfylt søknadsfristvilkår', () => {
    const vilkar = [
      {
        vilkarType: 'FP_VK_23', // VILKAR_TYPE
        lovReferanse: '§ 9-2 jamfør 8-2',
        overstyrbar: true,
        perioder: [
          {
            avslagKode: '1035',
            merknadParametere: {
              antattGodkjentArbeid: 'P0D',
              antattOpptjeningAktivitetTidslinje: 'LocalDateTimeline<0 [0]> = []',
            },
            vilkarStatus: utfall.IKKE_OPPFYLT, // VILKAR_UTFALL_TYPE
            periode: { fom: '2020-03-16', tom: '2020-03-19' },
            begrunnelse: null,
          },
          {
            avslagKode: '1035',
            merknadParametere: {
              antattGodkjentArbeid: 'P0D',
              antattOpptjeningAktivitetTidslinje: 'LocalDateTimeline<0 [0]> = []',
            },
            vilkarStatus: utfall.IKKE_OPPFYLT, // VILKAR_UTFALL_TYPE
            periode: { fom: '2020-03-23', tom: '2020-03-26' },
            begrunnelse: null,
          },
        ],
      },
      {
        vilkarType: vilkarType.MEDLEMSKAPSVILKÅRET, // VILKAR_TYPE
        lovReferanse: '§ 2',
        overstyrbar: true,
        perioder: [
          {
            avslagKode: '1020',
            merknadParametere: {},
            vilkarStatus: utfall.IKKE_OPPFYLT, // VILKAR_UTFALL_TYPE
            periode: { fom: '2020-03-16', tom: '2020-03-26' },
            begrunnelse: null,
          },
        ],
      },
    ];

    renderWithIntlAndReduxForm(<AvslagsårsakListe vilkar={vilkar} getKodeverknavn={vi.fn()} />);
    expect(screen.getAllByText(':')).toHaveLength(2);
  });
});
