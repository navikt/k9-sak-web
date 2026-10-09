import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import Uttak from '@k9-sak-web/gui/prosess/uttak/Uttak.js';
import { relevanteUttakAksjonspunkter } from '@k9-sak-web/gui/prosess/uttak/relevanteUttakAksjonspunkter.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { AntallDagerLivetsSluttfase } from '@k9-sak-web/gui/prosess/uttak-antall-dager-sluttfase/AntallDagerLivetsSluttfase.js';
import ErrorBoundary from '@k9-sak-web/gui/app/errorhandling/boundary/ErrorBoundary.js';
import { LoadingPanelSuspense } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanelSuspense.js';
import { PleiepengerSluttfaseBehandlingApiKeys } from '../../data/pleiepengerSluttfaseBehandlingApi';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps, false);
    const { erOverstyrer, isReadOnly } = props;
    const { behandling, aksjonspunkter } = deepCopyProps;
    // Felles Suspense slik at kvoteinfo og uttak vises samtidig fra samme uttak-query
    return (
      <LoadingPanelSuspense>
        <ErrorBoundary>
          <AntallDagerLivetsSluttfase behandlingUuid={behandling.uuid} behandlingVersjon={behandling.versjon} />
          <Uttak
            behandling={behandling}
            aksjonspunkter={aksjonspunkter}
            erOverstyrer={erOverstyrer}
            readOnly={isReadOnly}
          />
        </ErrorBoundary>
      </LoadingPanelSuspense>
    );
  };

  getAksjonspunktKoder = () => relevanteUttakAksjonspunkter(fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE);

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = props => {
    const { uttak } = props;
    if (
      !uttak ||
      !uttak.uttaksplan ||
      !uttak.uttaksplan.perioder ||
      (uttak.uttaksplan.perioder && Object.keys(uttak.uttaksplan.perioder).length === 0)
    ) {
      return vilkarUtfallType.IKKE_VURDERT;
    }
    const uttaksperiodeKeys = Object.keys(uttak.uttaksplan.perioder);

    if (uttaksperiodeKeys.every(key => uttak.uttaksplan.perioder[key].utfall === vilkarUtfallType.IKKE_OPPFYLT)) {
      return vilkarUtfallType.IKKE_OPPFYLT;
    }

    return vilkarUtfallType.OPPFYLT;
  };

  getEndepunkter = () => [PleiepengerSluttfaseBehandlingApiKeys.ARBEIDSFORHOLD];
}

class UttakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.UTTAK;

  getTekstKode = () => 'Behandlingspunkt.Uttak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default UttakProsessStegPanelDef;
