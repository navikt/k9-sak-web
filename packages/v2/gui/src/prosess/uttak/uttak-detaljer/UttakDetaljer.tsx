import { type JSX, useContext } from 'react';
import { Utfall } from '@k9-sak-web/backend/k9sak/kodeverk/uttak/Utfall.js';
import { Årsak as Årsaker } from '@k9-sak-web/backend/k9sak/kodeverk/uttak/Årsak.js';
import type { Utenlandsopphold } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/Utenlandsopphold.js';
import type { Utfall as UttaksperiodeInfoUtfallType } from '@k9-sak-web/backend/k9sak/kodeverk/uttak/Utfall.js';
import type { Årsak as UttaksperiodeInfoÅrsakerType } from '@k9-sak-web/backend/k9sak/kodeverk/uttak/Årsak.js';
import { fagsakYtelsesType, type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { OrUndefined } from '@k9-sak-web/gui/kodeverk/oppslag/GeneriskKodeverkoppslag.js';
import { K9KodeverkoppslagContext } from '@k9-sak-web/gui/kodeverk/oppslag/K9KodeverkoppslagContext.js';
import type { K9Kodeverkoppslag } from '@k9-sak-web/gui/kodeverk/oppslag/useK9Kodeverkoppslag.js';
import { BriefcaseClockIcon, HandHeartIcon, SackKronerIcon } from '@navikt/aksel-icons';
import { Alert, Box, Heading, HelpText, HGrid, HStack, Tag } from '@navikt/ds-react';
import {
  BarnetsDødsfallÅrsakerMedTekst,
  IkkeOppfylteÅrsakerMedTekst,
  SluttfaseÅrsakerMedTekst,
} from '../constants/UttaksperiodeInfoÅrsakerTekst.js';
import { FremhevingTag } from './FremhevingTag.js';
import GraderingMotArbeidstidDetaljer from './GraderingMotArbeidstidDetaljer.js';
import GraderingMotInntektDetaljer from './GraderingMotInntektDetaljer.js';
import GraderingMotTilsynDetaljer from './GraderingMotTilsynDetaljer.js';
import { useUttakContext } from '../context/UttakContext.js';
import type { UttaksperiodeBeriket } from '../types/UttaksperiodeBeriket.js';
import styles from './uttakDetaljer.module.css';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useUttakApi } from '../api/UttakApiContext.js';
import { uttakInntektsgraderingerQueryOptions } from '../api/uttakQueryOptions.js';

const getIkkeOppfylteÅrsaksetiketter = (årsaker: UttaksperiodeInfoÅrsakerType[]) => {
  return getÅrsaksetiketter(årsaker, IkkeOppfylteÅrsakerMedTekst);
};

const getTekstVedBarnetsDødsfall = (årsaker: UttaksperiodeInfoÅrsakerType[]) => {
  const funnedeÅrsaker = BarnetsDødsfallÅrsakerMedTekst.filter(årsak => årsaker.includes(årsak.årsak));
  return funnedeÅrsaker.map(årsak => (
    <div key={årsak.årsak} className={styles.uttakDetaljer}>
      {årsak.tekst}
    </div>
  ));
};

const getSluttfaseÅrsaksetiketter = (årsaker: UttaksperiodeInfoÅrsakerType[], ytelse: FagsakYtelsesType) => {
  return ytelse === fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE
    ? getÅrsaksetiketter(årsaker, SluttfaseÅrsakerMedTekst)
    : [];
};

const getÅrsaksetiketter = (
  årsaker: UttaksperiodeInfoÅrsakerType[],
  årsakerMedTekst: { årsak: UttaksperiodeInfoÅrsakerType; tekst: string }[],
) => {
  return årsakerMedTekst
    .filter(årsak => årsaker.includes(årsak.årsak))
    .map(årsak => (
      <Tag data-color="danger" variant="outline" key={årsak.årsak} className={styles.uttakDetaljer}>
        {årsak.tekst}
      </Tag>
    ));
};

const utenlandsoppholdTekst = (utenlandsopphold: Utenlandsopphold, kodeverkoppslag: K9Kodeverkoppslag) => {
  if (utenlandsopphold?.erEøsLand) {
    return 'Periode med utenlandsopphold i EØS-land, telles ikke i 8 uker.';
  }

  if (!utenlandsopphold.årsak) return 'Mangler årsak for utenlandsopphold';

  return kodeverkoppslag.k9sak.utenlandsoppholdÅrsaker(utenlandsopphold.årsak, OrUndefined)?.navn ?? 'Ukjent årsak';
};

const utenlandsoppholdInfo = (
  utfall: UttaksperiodeInfoUtfallType | undefined,
  utenlandsopphold: Utenlandsopphold | undefined,
  kodeverkoppslag: K9Kodeverkoppslag,
) => {
  if (!utenlandsopphold?.landkode || utfall === undefined) {
    return null;
  }

  if (utfall === Utfall.IKKE_OPPFYLT) {
    return null;
  }

  return (
    <Tag data-color="success" variant="outline" className={styles.uttakDetaljer}>
      {utenlandsoppholdTekst(utenlandsopphold, kodeverkoppslag)}
    </Tag>
  );
};

const shouldHighlight = (aktuellÅrsak: UttaksperiodeInfoÅrsakerType, årsaker: UttaksperiodeInfoÅrsakerType[]) =>
  årsaker.some(årsak => årsak === aktuellÅrsak);

export interface UttakDetaljerProps {
  uttak: UttaksperiodeBeriket;
  manueltOverstyrt: boolean;
}

const graderingBenevnelse = (ytelse: FagsakYtelsesType) => {
  switch (ytelse) {
    case fagsakYtelsesType.PLEIEPENGER_SYKT_BARN:
    case fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE:
      return 'pleiepengegrad';
    default:
      return 'gradering';
  }
};

const UttakDetaljer = ({ uttak, manueltOverstyrt }: UttakDetaljerProps): JSX.Element => {
  const kodeverkoppslag = useContext(K9KodeverkoppslagContext);
  const { behandling } = useUttakContext();
  const fagsakYtelseType = behandling.sakstype;
  const uttakApi = useUttakApi();
  const inntektsgraderinger = useSuspenseQuery(uttakInntektsgraderingerQueryOptions(uttakApi, behandling.uuid)).data;
  const {
    utbetalingsgrader,
    graderingMotTilsyn,
    årsaker = [],
    søkersTapteArbeidstid,
    pleiebehov,
    utenlandsopphold,
    utfall,
  } = uttak;

  const inntektgradering = inntektsgraderinger?.perioder?.find(
    p => p.periode.fom === uttak.periode.fom && p.periode.tom === uttak.periode.tom,
  );

  /*
   * Hvis det returneres data for inntektsgradering fra backend, er det Gradering mot arbeidsinntekt som skal "highlightes".
   * Data for gradering mot arbeidsinntekt returneres ikke om det ikke er dette som gir lavest grad.
   * Om det ikke foreligger data for inntektsgradering er det årsakene som forteller hvilken som skal "highlightes",
   * henholdsvis GRADERT_MOT_TILSYN og AVKORTET_MOT_INNTEKT
   * AVKORTET_MOT_INNTEKT er årsaken som definerer om det er Gradert mot arbeidstid.
   */
  const shouldHighlightInntekt = !manueltOverstyrt && !!inntektgradering;
  const shouldHighlightTilsyn =
    !manueltOverstyrt &&
    !shouldHighlightInntekt &&
    årsaker &&
    shouldHighlight(Årsaker.GRADERT_MOT_TILSYN, årsaker || []);
  const shouldHighlightArbeidstid =
    !manueltOverstyrt &&
    !shouldHighlightInntekt &&
    årsaker &&
    shouldHighlight(Årsaker.AVKORTET_MOT_INNTEKT, årsaker || []);

  const skalViseGraderingMotTilsyn =
    fagsakYtelseType !== fagsakYtelsesType.OPPLÆRINGSPENGER &&
    fagsakYtelseType !== fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE;

  // Hvis en av årsakene fra uttaksdetaljene er en av årsakene for barnets dødsfall ...
  const harBarnetsDødsfallÅrsak = årsaker?.some((årsak: UttaksperiodeInfoÅrsakerType) =>
    BarnetsDødsfallÅrsakerMedTekst.some(barnetsDødsfallÅrsak => årsak === barnetsDødsfallÅrsak.årsak),
  );

  return (
    <>
      {getIkkeOppfylteÅrsaksetiketter(årsaker || [])}
      {getSluttfaseÅrsaksetiketter(årsaker || [], fagsakYtelseType)}
      {getTekstVedBarnetsDødsfall(årsaker || [])}
      {utenlandsoppholdInfo(utfall, utenlandsopphold, kodeverkoppslag)}
      {manueltOverstyrt && (
        <Alert variant="info" size="small" className="mx-4">
          Uttaksgrad og/eller utbetalingsgrad er manuelt overstyrt av saksbehandler.
        </Alert>
      )}
      <HGrid gap="space-32" columns={3} align="start" className={styles.uttakDetaljer}>
        {graderingMotTilsyn && skalViseGraderingMotTilsyn && (
          <Box
            className={`${styles.uttakDetaljerGraderingDetaljer} ${shouldHighlightTilsyn ? styles.uttakDetaljerGraderingDetaljerHighlighted : styles.uttakDetaljerGraderingDetaljerNotHighlighted}`}
            title="Gradering mot tilsyn"
          >
            {shouldHighlightTilsyn && (
              <Box className={styles.uttakDetaljerTag}>
                <FremhevingTag text={`Gir lavest ${graderingBenevnelse(fagsakYtelseType)}`} />
              </Box>
            )}
            <HStack>
              <HandHeartIcon className="!ml-[-4px]" />
              <Heading size="xsmall"> Gradering mot tilsyn</Heading>
              {harBarnetsDødsfallÅrsak && (
                <HelpText placement="right" wrapperClassName={styles.uttakDetaljerDataQuestionMark}>
                  Gradering mot tilsyn blir ikke medregnet på grunn av barnets dødsfall.
                </HelpText>
              )}
            </HStack>
            <GraderingMotTilsynDetaljer graderingMotTilsyn={graderingMotTilsyn} pleiebehov={pleiebehov || 0} />
          </Box>
        )}

        <Box
          className={`${styles.uttakDetaljerGraderingDetaljer} ${shouldHighlightArbeidstid ? styles.uttakDetaljerGraderingDetaljerHighlighted : styles.uttakDetaljerGraderingDetaljerNotHighlighted}`}
          title="Gradering mot arbeidstid"
        >
          {shouldHighlightArbeidstid && (
            <Box className={styles.uttakDetaljerTag}>
              <FremhevingTag text={`Gir lavest ${graderingBenevnelse(fagsakYtelseType)}`} />
            </Box>
          )}
          <HStack>
            <BriefcaseClockIcon className="!ml-[-4px]" />
            <Heading size="xsmall">Gradering mot arbeidstid</Heading>
          </HStack>
          <GraderingMotArbeidstidDetaljer
            utbetalingsgrader={utbetalingsgrader || []}
            søkersTapteArbeidstid={søkersTapteArbeidstid}
          />
        </Box>

        {inntektgradering && (
          <Box
            className={`${styles.uttakDetaljerGraderingDetaljer} ${shouldHighlightInntekt ? styles.uttakDetaljerGraderingDetaljerHighlighted : styles.uttakDetaljerGraderingDetaljerNotHighlighted}`}
            title="Gradering mot inntekt"
          >
            {shouldHighlightInntekt && (
              <Box className={styles.uttakDetaljerTag}>
                <FremhevingTag text={`Gir lavest ${graderingBenevnelse(fagsakYtelseType)}`} />
              </Box>
            )}
            <HStack>
              <SackKronerIcon className="!ml-[-4px]" />
              <Heading size="xsmall">Gradering mot arbeidsinntekt</Heading>
            </HStack>
            {inntektgradering && (
              <>
                <GraderingMotInntektDetaljer inntektsgradering={inntektgradering} />
              </>
            )}
          </Box>
        )}
      </HGrid>
    </>
  );
};
export default UttakDetaljer;
