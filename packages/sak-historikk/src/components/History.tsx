import React from 'react';
import { Location } from 'history';

import { Historikkinnslag } from '@k9-sak-web/types';
import HistorikkAktor from '@fpsak-frontend/kodeverk/src/historikkAktor';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types/KodeverkType.js';
import { KodeverkNavnFraKodeFnType } from '@k9-sak-web/lib/kodeverk/types.js';
import SkjermlenkeTyper from '@k9-sak-web/types/src/totrinnskontroll/SkjermlenkeType';

import historikkinnslagType from '../kodeverk/historikkinnslagType';
import SnakkebobleContainer from './maler/felles/SnakkebobleContainer';
import HistorikkMalType1 from './maler/historikkMalType1';
import HistorikkMalType2 from './maler/historikkMalType2';
import HistorikkMalType3 from './maler/historikkMalType3';
import HistorikkMalType4 from './maler/historikkMalType4';
import HistorikkMalType5 from './maler/historikkMalType5';
import HistorikkMalType6 from './maler/HistorikkMalType6';
import HistorikkMalType7 from './maler/HistorikkMalType7';
import HistorikkMalType8 from './maler/HistorikkMalType8';
import HistorikkMalType9 from './maler/HistorikkMalType9';
import HistorikkMalType10 from './maler/HistorikkMalType10';
import HistorikkMalTypeFeilutbetaling from './maler/HistorikkMalTypeFeilutbetaling';
import HistorikkMalTypeTilbakekreving from './maler/HistorikkMalTypeTilbakekreving';
import HistorikkMalTypeForeldelse from './maler/HistorikkMalTypeForeldelse';
import PlaceholderHistorikkMal from './maler/placeholderHistorikkMal';

const velgHistorikkMal = (histType: string) => {
  // NOSONAR
  switch (
    histType // NOSONAR
  ) {
    case historikkinnslagType.BEH_GJEN:
    case historikkinnslagType.KOET_BEH_GJEN:
    case historikkinnslagType.FORTSETT_UTEN_AA_VENTE_PAA_TILBAKEKREVING:
    case historikkinnslagType.BEH_MAN_GJEN:
    case historikkinnslagType.BEH_STARTET:
    case historikkinnslagType.BEH_STARTET_PAA_NYTT:
    case historikkinnslagType.BEH_STARTET_FORFRA:
    case historikkinnslagType.VEDLEGG_MOTTATT:
    case historikkinnslagType.BREV_SENT:
    case historikkinnslagType.BREV_BESTILT:
    case historikkinnslagType.REVURD_OPPR:
    case historikkinnslagType.MANGELFULL_SOKNAD:
    case historikkinnslagType.INNSYN_OPPR:
    case historikkinnslagType.VRS_REV_IKKE_SNDT:
    case historikkinnslagType.NYE_REGOPPLYSNINGER:
    case historikkinnslagType.BEH_AVBRUTT_VUR:
    case historikkinnslagType.BEH_OPPDATERT_NYE_OPPL:
    case historikkinnslagType.SPOLT_TILBAKE:
    case historikkinnslagType.TILBAKEKREVING_OPPR:
    case historikkinnslagType.MIGRERT_FRA_INFOTRYGD:
    case historikkinnslagType.MIGRERT_FRA_INFOTRYGD_FJERNET:
    case historikkinnslagType.UNNT_OPPR:
      return HistorikkMalType1;
    case historikkinnslagType.FORSLAG_VEDTAK:
    case historikkinnslagType.FORSLAG_VEDTAK_UTEN_TOTRINN:
    case historikkinnslagType.VEDTAK_FATTET:
    case historikkinnslagType.VEDTAK_FATTET_AUTOMATISK:
    case historikkinnslagType.UENDRET_UTFALL:
    case historikkinnslagType.REGISTRER_OM_VERGE:
      return HistorikkMalType2;
    case historikkinnslagType.SAK_RETUR:
      return HistorikkMalType3;
    case historikkinnslagType.AVBRUTT_BEH:
    case historikkinnslagType.BEH_KØET:
    case historikkinnslagType.BEH_VENT:
    case historikkinnslagType.IVERKSETTELSE_VENT:
    case historikkinnslagType.FJERNET_VERGE:
      return HistorikkMalType4;
    case historikkinnslagType.SAK_GODKJENT:
    case historikkinnslagType.FAKTA_ENDRET:
    case historikkinnslagType.KLAGE_BEH_NK:
    case historikkinnslagType.KLAGE_BEH_NFP:
    case historikkinnslagType.BYTT_ENHET:
    case historikkinnslagType.UTTAK:
    case historikkinnslagType.TERMINBEKREFTELSE_UGYLDIG:
    case historikkinnslagType.ANKE_BEH:
    case historikkinnslagType.VIRKNINGSDATO_UTTAK_NYE_REGLER:
    case historikkinnslagType.OVST_UTTAK_NY:
    case historikkinnslagType.OVST_UTTAK_OPPDATERT:
    case historikkinnslagType.OVST_UTTAK_FJERNET:
      return HistorikkMalType5;
    case historikkinnslagType.NY_INFO_FRA_TPS:
    case historikkinnslagType.NY_GRUNNLAG_MOTTATT:
      return HistorikkMalType6;
    case historikkinnslagType.OVERSTYRT:
    case historikkinnslagType.FJERNET_OVERSTYRING:
      return HistorikkMalType7;
    case historikkinnslagType.OPPTJENING:
      return HistorikkMalType8;
    case historikkinnslagType.OVST_UTTAK_SPLITT:
    case historikkinnslagType.FASTSATT_UTTAK_SPLITT:
    case historikkinnslagType.TILBAKEKR_VIDEREBEHANDLING:
      return HistorikkMalType9;
    case historikkinnslagType.OVST_UTTAK:
      return HistorikkMalType10;
    case historikkinnslagType.FASTSATT_UTTAK:
      return HistorikkMalType5;
    case historikkinnslagType.FAKTA_OM_FEILUTBETALING:
      return HistorikkMalTypeFeilutbetaling;
    case historikkinnslagType.FORELDELSE:
      return HistorikkMalTypeForeldelse;
    case historikkinnslagType.TILBAKEKREVING:
      return HistorikkMalTypeTilbakekreving;
    default:
      return PlaceholderHistorikkMal;
  }
};

interface OwnProps {
  historikkinnslag: Historikkinnslag;
  saksnummer?: string;
  getBehandlingLocation: (behandlingId: number) => Location;
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeCode: string) => Location;
  erTilbakekreving: boolean;
  kodeverkNavnFraKodeFn: KodeverkNavnFraKodeFnType;
}

/**
 * History
 *
 * Historikken for en behandling
 */
const History = ({
  historikkinnslag,
  saksnummer = '0',
  getBehandlingLocation,
  createLocationForSkjermlenke,
  erTilbakekreving,
  kodeverkNavnFraKodeFn,
}: OwnProps) => {
  const HistorikkMal = velgHistorikkMal(historikkinnslag.type);
  const aktorIsVL = historikkinnslag.aktoer === HistorikkAktor.VEDTAKSLOSNINGEN;
  const aktorIsSOKER = historikkinnslag.aktoer === HistorikkAktor.SOKER;
  const aktorIsArbeidsgiver = historikkinnslag.aktoer === HistorikkAktor.ARBEIDSGIVER;
  return (
    <SnakkebobleContainer
      aktoer={historikkinnslag.aktoer}
      rolleNavn={kodeverkNavnFraKodeFn(historikkinnslag.aktoer, KodeverkType.HISTORIKK_AKTOER)}
      dato={historikkinnslag.opprettetTidspunkt}
      kjoenn={historikkinnslag.kjoenn}
      opprettetAv={aktorIsSOKER || aktorIsArbeidsgiver || aktorIsVL ? '' : historikkinnslag.opprettetAv}
    >
      <HistorikkMal
        historikkinnslag={historikkinnslag}
        behandlingLocation={getBehandlingLocation(historikkinnslag.behandlingId)}
        saksnummer={saksnummer}
        createLocationForSkjermlenke={createLocationForSkjermlenke}
        erTilbakekreving={erTilbakekreving}
        kodeverkNavnFraKodeFn={kodeverkNavnFraKodeFn}
      />
    </SnakkebobleContainer>
  );
};

export default History;
