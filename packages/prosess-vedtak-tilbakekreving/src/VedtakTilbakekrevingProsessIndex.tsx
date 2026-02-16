import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import type { Behandling, KodeverkMedNavn } from '@k9-sak-web/types';
import { k9_kodeverk_behandling_BehandlingStatus } from '@navikt/k9-sak-typescript-client/types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import TilbakekrevingVedtak from './components/TilbakekrevingVedtak';
import type BeregningsresultatTilbakekreving from './types/beregningsresultatTilbakekrevingTsType';
import type Vedtaksbrev from './types/vedtaksbrevTsType';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const tilbakekrevingÅrsakTyperKlage = [behandlingArsakType.RE_KLAGE_KA, behandlingArsakType.RE_KLAGE_NFP];

const erTilbakekrevingÅrsakKlage = (årsak: any) => årsak && tilbakekrevingÅrsakTyperKlage.includes(årsak.kode);

interface OwnProps {
  behandling: Behandling;
  beregningsresultat: BeregningsresultatTilbakekreving;
  vedtaksbrev: Vedtaksbrev;
  submitCallback: (aksjonspunktData: { kode: string }[]) => Promise<any>;
  isReadOnly: boolean;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  fetchPreviewVedtaksbrev: (data: any) => Promise<any>;
  aksjonspunktKodeForeslaVedtak: string;
}

const VedtakTilbakekrevingProsessIndex = ({
  behandling,
  beregningsresultat,
  vedtaksbrev,
  submitCallback,
  isReadOnly,
  alleKodeverk,
  fetchPreviewVedtaksbrev,
  aksjonspunktKodeForeslaVedtak,
}: OwnProps) => {
  const erRevurderingTilbakekrevingKlage =
    behandling.førsteÅrsak && erTilbakekrevingÅrsakKlage(behandling.førsteÅrsak.behandlingArsakType);
  const erRevurderingTilbakekrevingFeilBeløpBortfalt =
    behandling.førsteÅrsak &&
    behandlingArsakType.RE_FEILUTBETALT_BELØP_REDUSERT === behandling.førsteÅrsak?.behandlingArsakType?.kode;
  const erBehandlingBehandlet = behandling.status.kode !== k9_kodeverk_behandling_BehandlingStatus.OPPRETTET;
  return (
    <RawIntlProvider value={intl}>
      <TilbakekrevingVedtak
        behandlingId={behandling.id}
        behandlingUuid={behandling.uuid}
        behandlingVersjon={behandling.versjon}
        perioder={beregningsresultat.beregningResultatPerioder}
        resultat={beregningsresultat.vedtakResultatType}
        avsnittsliste={vedtaksbrev?.avsnittsliste ?? []}
        submitCallback={submitCallback}
        readOnly={isReadOnly}
        alleKodeverk={alleKodeverk}
        fetchPreviewVedtaksbrev={fetchPreviewVedtaksbrev}
        aksjonspunktKodeForeslaVedtak={aksjonspunktKodeForeslaVedtak}
        erRevurderingTilbakekrevingKlage={erRevurderingTilbakekrevingKlage}
        erRevurderingTilbakekrevingFeilBeløpBortfalt={erRevurderingTilbakekrevingFeilBeløpBortfalt}
        erBehandlingBehandlet={erBehandlingBehandlet}
      />
    </RawIntlProvider>
  );
};

export default VedtakTilbakekrevingProsessIndex;
