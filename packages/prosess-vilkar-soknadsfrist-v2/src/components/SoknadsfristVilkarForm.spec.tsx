// import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import { KravDokumentStatus, VilkårPeriodeDto } from '@navikt/k9-sak-typescript-client';
import { render, screen } from '@testing-library/react';
import { SoknadsfristVilkarForm } from './SoknadsfristVilkarForm';

const periode = {
  vilkarStatus: 'IKKE_OPPFYLT', // kodeverk: 'test'
  vurderesIBehandlingen: true,
  periode: {
    fom: '2020-02-20',
    tom: '2020-02-25',
  },
} as VilkårPeriodeDto;

const dokumenter = [
  {
    type: 'SØKNAD',
    status: [
      {
        periode: { fom: '2020-02-20', tom: '2020-02-25' },
        status: 'IKKE_OPPFYLT', // kodeverk: 'test'
      },
    ],
    innsendingstidspunkt: '2020-06-01',
    journalpostId: '12345',
    avklarteOpplysninger: null,
    overstyrteOpplysninger: null,
  },
  {
    type: 'SØKNAD',
    status: [
      {
        periode: { fom: '2020-02-26', tom: '2020-02-27' },
        status: 'IKKE_OPPFYLT', // kodeverk: 'test'
      },
    ],
    innsendingstidspunkt: '2020-06-01',
    journalpostId: '23456',
    avklarteOpplysninger: null,
    overstyrteOpplysninger: null,
  },
] as KravDokumentStatus[];

describe('<SoknadsfristVilkarForm>', () => {
  it('skal rendre form med knapp når vilkåret er overstyrt', () => {
    requestApi.mock(K9sakApiKeys.FEATURE_TOGGLE, []);
    render(
      <SoknadsfristVilkarForm
        behandlingId={1}
        behandlingVersjon={2}
        erOverstyrt
        harÅpentAksjonspunkt={false}
        overrideReadOnly={false}
        toggleOverstyring={() => undefined}
        aksjonspunkter={[]}
        status={vilkarUtfallType.IKKE_OPPFYLT}
        submitCallback={() => undefined}
        dokumenterIAktivPeriode={dokumenter}
        alleDokumenter={dokumenter}
        periode={periode}
        kanEndrePåSøknadsopplysninger
      />,
    );

    expect(
      screen.getAllByText(
        (_, element) => element.textContent === 'SØKNAD innsendt 01.06.2020 (journalpostId: 12345)',
      )[0],
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(
        (_, element) => element.textContent === 'SØKNAD innsendt 01.06.2020 (journalpostId: 23456)',
      )[0],
    ).toBeInTheDocument();
    expect(screen.getAllByText('Vilkåret er oppfylt for hele perioden').length).toBe(2);
    expect(screen.getByRole('button', { name: 'Bekreft overstyring' })).toBeInTheDocument();
  });
});
