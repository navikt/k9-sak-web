import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { kravDokumentStatusType } from '@k9-sak-web/backend/k9sak/kodeverk/KravDokumentStatus.js';
import { render, screen } from '@testing-library/react';
import { SoknadsfristVilkarForm } from './SoknadsfristVilkarForm';

const periode = {
  vilkarStatus: vilkårStatus.IKKE_OPPFYLT, // kodeverk: 'test'
  vurderesIBehandlingen: true,
  periode: {
    fom: '2020-02-20',
    tom: '2020-02-25',
  },
};

const dokumenter = [
  {
    type: kravDokumentStatusType.SØKNAD,
    status: [
      {
        periode: { fom: '2020-02-20', tom: '2020-02-25' },
        status: vilkårStatus.IKKE_OPPFYLT, // kodeverk: 'test'
      },
    ],
    innsendingstidspunkt: '2020-06-01',
    journalpostId: '12345',
  },
  {
    type: kravDokumentStatusType.SØKNAD,
    status: [
      {
        periode: { fom: '2020-02-26', tom: '2020-02-27' },
        status: vilkårStatus.IKKE_OPPFYLT, // kodeverk: 'test'
      },
    ],
    innsendingstidspunkt: '2020-06-01',
    journalpostId: '23456',
  },
];

describe('<SoknadsfristVilkarForm>', () => {
  it('skal rendre form med knapp når vilkåret er overstyrt', () => {
    render(
      <SoknadsfristVilkarForm
        erOverstyrt
        harÅpentAksjonspunkt={false}
        overrideReadOnly={false}
        toggleOverstyring={() => undefined}
        aksjonspunkter={[]}
        status={vilkårStatus.IKKE_OPPFYLT}
        submitCallback={() => undefined}
        dokumenterIAktivPeriode={dokumenter}
        alleDokumenter={dokumenter}
        periode={periode}
        kanEndrePåSøknadsopplysninger
      />,
    );

    expect(
      screen.getAllByText(
        (_, element) => element?.textContent === 'SØKNAD innsendt 01.06.2020 (journalpostId: 12345)',
      )[0],
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(
        (_, element) => element?.textContent === 'SØKNAD innsendt 01.06.2020 (journalpostId: 23456)',
      )[0],
    ).toBeInTheDocument();
    expect(screen.getAllByText('Vilkåret er oppfylt for hele perioden').length).toBe(2);
    expect(screen.getByRole('button', { name: 'Bekreft overstyring' })).toBeInTheDocument();
  });
});
