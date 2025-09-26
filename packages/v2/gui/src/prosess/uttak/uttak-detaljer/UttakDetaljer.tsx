import type {
  pleiepengerbarn_uttak_kontrakter_Utfall as Utfall,
  pleiepengerbarn_uttak_kontrakter_Årsak as Årsaker,
  type pleiepengerbarn_uttak_kontrakter_Utenlandsopphold as Utenlandsopphold,
  type pleiepengerbarn_uttak_kontrakter_Utfall as UttaksperiodeInfoUtfallType,
  type pleiepengerbarn_uttak_kontrakter_Årsak as UttaksperiodeInfoÅrsakerType,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { fagsakYtelsesType, type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkType, type KodeverkNavnFraKodeType } from '@k9-sak-web/lib/kodeverk/types.js';
import { BriefcaseClockIcon, HandHeartIcon, SackKronerIcon } from '@navikt/aksel-icons';
import { Alert, Box, Heading, HelpText, HGrid, HStack, Tag, Skeleton } from '@navikt/ds-react';
import { type JSX } from 'react';
import {
  BarnetsDødsfallÅrsakerMedTekst,
  IkkeOppfylteÅrsakerMedTekst,
} from '../constants/UttaksperiodeInfoÅrsakerTekst';
import { FremhevingTag } from './FremhevingTag';
import GraderingMotArbeidstidDetaljer from './GraderingMotArbeidstidDetaljer';
import GraderingMotInntektDetaljer from './GraderingMotInntektDetaljer';
import GraderingMotTilsynDetaljer from './GraderingMotTilsynDetaljer';
import styles from './uttakDetaljer.module.css';
import { useUttakContext } from '../context/UttakContext';
import { useQuery } from '@tanstack/react-query';
import type { UttaksperiodeBeriket } from '../Uttak';

const getÅrsaksetiketter = (årsaker: UttaksperiodeInfoÅrsakerType[]) => {
  const funnedeÅrsaker = IkkeOppfylteÅrsakerMedTekst.filter(årsak => årsaker.includes(årsak.årsak));
  return funnedeÅrsaker.map(årsak => (
    <Tag variant="error" key={årsak.årsak} className={styles.uttakDetaljer}>
      {årsak.tekst}
    </Tag>
  ));
};

const getTekstVedBarnetsDødsfall = (årsaker: UttaksperiodeInfoÅrsakerType[]) => {
  const funnedeÅrsaker = BarnetsDødsfallÅrsakerMedTekst.filter(årsak => årsaker.includes(årsak.årsak));
  return funnedeÅrsaker.map(årsak => (
    <div key={årsak.årsak} className={styles.uttakDetaljer}>
      {årsak.tekst}
    </div>
  ));
};

const utenlandsoppholdTekst = (utenlandsopphold: Utenlandsopphold, kodeverkNavnFraKode: KodeverkNavnFraKodeType) => {
  if (utenlandsopphold?.erEøsLand) {
    return 'Periode med utenlandsopphold i EØS-land, telles ikke i 8 uker.';
  }

  if (!utenlandsopphold.årsak) return 'Mangler årsak for utenlandsopphold';

  return kodeverkNavnFraKode(utenlandsopphold.årsak, KodeverkType.UTLANDSOPPHOLD_AARSAK);
};

const utenlandsoppholdInfo = (
  utfall: UttaksperiodeInfoUtfallType | undefined,
  utenlandsopphold: Utenlandsopphold | undefined,
  kodeverkNavnFraKode: KodeverkNavnFraKodeType,
) => {
  if (!utenlandsopphold?.landkode || utfall === undefined) {
    return null;
  }

  if (utfall === Utfall.IKKE_OPPFYLT) {
    return null;
  }

  return (
    <Tag variant="success" className={styles.uttakDetaljer}>
      {utenlandsoppholdTekst(utenlandsopphold, kodeverkNavnFraKode)}
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
  const { kodeverkNavnFraKode } = useKodeverkContext();
  const { erSakstype, behandling, uttakApi } = useUttakContext();
  const {
    utbetalingsgrader,
    graderingMotTilsyn,
    årsaker = [],
    søkersTapteArbeidstid,
    pleiebehov,
    utenlandsopphold,
    utfall,
  } = uttak;

  const { data: inntektsgraderinger, isLoading: lasterInntektsgradering } = useQuery({
    queryKey: ['uttak-inntektsgraderinger', behandling.uuid],
    queryFn: async () => uttakApi.hentInntektsgraderinger(behandling.uuid),
    enabled: !!behandling.uuid,
  });

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
    !lasterInntektsgradering &&
    !shouldHighlightInntekt &&
    årsaker &&
    shouldHighlight(Årsaker.AVKORTET_MOT_INNTEKT, årsaker || []);

  const skalViseGraderingMotTilsyn = !erSakstype([
    BehandlingDtoSakstype.OPPLÆRINGSPENGER,
    BehandlingDtoSakstype.PLEIEPENGER_NÆRSTÅENDE,
  ]);

  // Hvis en av årsakene fra uttaksdetaljene er en av årsakene for barnets dødsfall ...
  const harBarnetsDødsfallÅrsak = årsaker?.some((årsak: UttaksperiodeInfoÅrsakerType) =>
    BarnetsDødsfallÅrsakerMedTekst.some(barnetsDødsfallÅrsak => årsak === barnetsDødsfallÅrsak.årsak),
  );

  return (
    <>
      {getÅrsaksetiketter(årsaker || [])}
      {getTekstVedBarnetsDødsfall(årsaker || [])}
      {utenlandsoppholdInfo(utfall, utenlandsopphold, kodeverkNavnFraKode)}

      {manueltOverstyrt && (
        <Alert variant="info" size="small" className="mx-4">
          Uttaksgrad og/eller utbetalingsgrad er manuelt overstyrt av saksbehandler.
        </Alert>
      )}
      <HGrid gap="space-32" columns={3} align="start" className={styles['uttakDetaljer']}>
        {graderingMotTilsyn && skalViseGraderingMotTilsyn && (
          <Box.New
            className={`${styles.uttakDetaljerGraderingDetaljer} ${shouldHighlightTilsyn ? styles.uttakDetaljerGraderingDetaljerHighlighted : styles.uttakDetaljerGraderingDetaljerNotHighlighted}`}
            title="Gradering mot tilsyn"
          >
            {shouldHighlightTilsyn && (
              <Box.New className={styles.uttakDetaljerTag}>
                <FremhevingTag text={`Gir lavest ${graderingBenevnelse(ytelsetype)}`} />
              </Box.New>
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
          </Box.New>
        )}

        <Box.New
          className={`${styles.uttakDetaljerGraderingDetaljer} ${shouldHighlightArbeidstid ? styles.uttakDetaljerGraderingDetaljerHighlighted : styles.uttakDetaljerGraderingDetaljerNotHighlighted}`}
          title="Gradering mot arbeidstid"
        >
          {shouldHighlightArbeidstid && (
            <Box.New className={styles.uttakDetaljerTag}>
              <FremhevingTag text={`Gir lavest ${graderingBenevnelse(ytelsetype)}`} />
            </Box.New>
          )}
          <HStack>
            <BriefcaseClockIcon className="!ml-[-4px]" />
            <Heading size="xsmall">Gradering mot arbeidstid</Heading>
          </HStack>
          <GraderingMotArbeidstidDetaljer
            utbetalingsgrader={utbetalingsgrader || []}
            søkersTapteArbeidstid={søkersTapteArbeidstid}
          />
        </Box.New>

        {(lasterInntektsgradering || inntektgradering) && (
          <Box.New
            className={`${styles.uttakDetaljerGraderingDetaljer} ${shouldHighlightInntekt ? styles.uttakDetaljerGraderingDetaljerHighlighted : styles.uttakDetaljerGraderingDetaljerNotHighlighted}`}
            title="Gradering mot inntekt"
          >
            {shouldHighlightInntekt && (
              <Box.New className={styles.uttakDetaljerTag}>
                <FremhevingTag text={`Gir lavest ${graderingBenevnelse(ytelsetype)}`} />
              </Box.New>
            )}
            <HStack>
              <SackKronerIcon className="!ml-[-4px]" />
              <Heading size="xsmall">Gradering mot arbeidsinntekt</Heading>
            </HStack>
            {!lasterInntektsgradering && inntektgradering && (
              <>
                <GraderingMotInntektDetaljer inntektsgradering={inntektgradering} />
              </>
            )}
            {lasterInntektsgradering && (
              <>
                <Skeleton variant="text" width={200} className="mt-2" />
                <Skeleton variant="text" width={160} />
                <Skeleton variant="text" width={180} />
              </>
            )}
          </Box.New>
        )}
      </HGrid>
    </>
  );
};
export default UttakDetaljer;
