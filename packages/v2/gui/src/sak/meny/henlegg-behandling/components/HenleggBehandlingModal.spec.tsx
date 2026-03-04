import { BehandlingResultatType as behandlingResultatTypeK9Klage } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingResultatType.js';
import { behandlingType as BehandlingTypeK9Klage } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import { BehandlingResultatType as behandlingResultatTypeK9Sak } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingResultatType.js';
import { fagsakYtelsesType as fagsakYtelseType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { behandlingType as BehandlingTypeK9SAK } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { getHenleggArsaker } from './HenleggBehandlingModal';

describe('<HenleggBehandlingModal>', () => {
  const ytelseType = fagsakYtelseType.PLEIEPENGER_SYKT_BARN;

  const behandlingResultatTyper = [
    behandlingResultatTypeK9Klage.HENLAGT_KLAGE_TRUKKET,
    behandlingResultatTypeK9Sak.HENLAGT_FEILOPPRETTET,
    'HENLAGT_FEILOPPRETTET_MED_BREV',
    'HENLAGT_FEILOPPRETTET_UTEN_BREV',
    'HENLAGT_INNSYN_TRUKKET',
    behandlingResultatTypeK9Sak.HENLAGT_SØKNAD_TRUKKET,
  ];

  it('skal bruke behandlingsresultat-typer for klage', () => {
    const behandlingsType = BehandlingTypeK9Klage.KLAGE;
    const resultat = getHenleggArsaker(behandlingResultatTyper, behandlingsType, ytelseType);
    expect(resultat.map(r => r)).toEqual([
      behandlingResultatTypeK9Klage.HENLAGT_KLAGE_TRUKKET,
      behandlingResultatTypeK9Klage.HENLAGT_FEILOPPRETTET,
    ]);
  });

  it('skal bruke behandlingsresultat-typer for tilbakekreving', () => {
    const behandlingsType = BehandlingTypeK9Klage.TILBAKEKREVING;
    const resultat = getHenleggArsaker(behandlingResultatTyper, behandlingsType, ytelseType);
    expect(resultat.map(r => r)).toEqual([behandlingResultatTypeK9Klage.HENLAGT_FEILOPPRETTET]);
  });

  it('skal bruke behandlingsresultat-typer for tilbakekreving revurdering', () => {
    const behandlingsType = BehandlingTypeK9Klage.REVURDERING_TILBAKEKREVING;
    const resultat = getHenleggArsaker(behandlingResultatTyper, behandlingsType, ytelseType);
    expect(resultat.map(r => r)).toEqual(['HENLAGT_FEILOPPRETTET_MED_BREV', 'HENLAGT_FEILOPPRETTET_UTEN_BREV']);
  });

  it('skal bruke behandlingsresultat-typer for revudering', () => {
    const behandlingsType = BehandlingTypeK9Klage.REVURDERING;
    const resultat = getHenleggArsaker(behandlingResultatTyper, behandlingsType, ytelseType);
    expect(resultat.map(r => r)).toEqual([
      behandlingResultatTypeK9Klage.HENLAGT_SØKNAD_TRUKKET,
      behandlingResultatTypeK9Klage.HENLAGT_FEILOPPRETTET,
    ]);
  });

  it('skal bruke behandlingsresultat-typer for førstegangsbehandling', () => {
    const behandlingsType = BehandlingTypeK9SAK.FØRSTEGANGSSØKNAD;
    const resultat = getHenleggArsaker(behandlingResultatTyper, behandlingsType, ytelseType);
    expect(resultat.map(r => r)).toEqual([
      behandlingResultatTypeK9Sak.HENLAGT_SØKNAD_TRUKKET,
      behandlingResultatTypeK9Sak.HENLAGT_FEILOPPRETTET,
    ]);
  });

  it('skal bruke behandlingsresultat-typer for førstegangsbehandling når ytelsestype er Engangsstønad', () => {
    const behandlingsType = BehandlingTypeK9SAK.FØRSTEGANGSSØKNAD;
    const resultat = getHenleggArsaker(behandlingResultatTyper, behandlingsType, fagsakYtelseType.ENGANGSTØNAD);
    expect(resultat.map(r => r)).toEqual([
      behandlingResultatTypeK9Sak.HENLAGT_SØKNAD_TRUKKET,
      behandlingResultatTypeK9Sak.HENLAGT_FEILOPPRETTET,
    ]);
  });
});
