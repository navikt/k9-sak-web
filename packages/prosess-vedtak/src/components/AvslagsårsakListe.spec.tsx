import { renderWithIntlAndReduxForm, screen } from '@fpsak-frontend/utils-test/test-utils';
import { vilkarType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import {
  kodeverk_behandling_BehandlingType as BehandlingType,
  kodeverk_vilkår_Utfall as VilkårUtfall,
} from '@navikt/k9-sak-typescript-client';
import AvslagsårsakListe from './AvslagsårsakListe';

describe('<AvslagårsakListe>', () => {
  it('skal rendre liste med avslagsårsaker', () => {
    const vilkar = [
      {
        vilkarType: vilkarType.OPPTJENINGSVILKÅRET,
        lovReferanse: '§ 9-2 jamfør 8-2',
        overstyrbar: true,
        perioder: [
          {
            avslagKode: '1035',
            merknadParametere: {
              antattGodkjentArbeid: 'P0D',
              antattOpptjeningAktivitetTidslinje: 'LocalDateTimeline<0 [0]> = []',
            },
            vilkarStatus: VilkårUtfall.IKKE_OPPFYLT, // VILKAR_UTFALL_TYPE
            periode: { fom: '2020-03-16', tom: '2020-03-19' },
            begrunnelse: null,
          },
          {
            avslagKode: '1035',
            merknadParametere: {
              antattGodkjentArbeid: 'P0D',
              antattOpptjeningAktivitetTidslinje: 'LocalDateTimeline<0 [0]> = []',
            },
            vilkarStatus: VilkårUtfall.IKKE_OPPFYLT, // VILKAR_UTFALL_TYPE
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
            vilkarStatus: VilkårUtfall.IKKE_OPPFYLT, // VILKAR_UTFALL_TYPE
            periode: { fom: '2020-03-16', tom: '2020-03-26' },
            begrunnelse: null,
          },
        ],
      },
    ];

    renderWithIntlAndReduxForm(
      <KodeverkProvider
        behandlingType={BehandlingType.FØRSTEGANGSSØKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <AvslagsårsakListe vilkar={vilkar} />
      </KodeverkProvider>,
    );
    expect(screen.getByText('Opptjeningsvilkåret: Ikke tilstrekkelig opptjening')).toBeInTheDocument();
    expect(screen.getByText('Medlemskapsvilkåret: Søker er ikke medlem')).toBeInTheDocument();
  });
});
