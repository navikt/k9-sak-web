import { type JSX } from 'react';
import {
  UttaksperiodeInfoUtfall,
  type UttaksperiodeInfoUtfall as UttaksperiodeInfoUtfallType,
  UttaksperiodeInfoÅrsaker,
  type UttaksperiodeInfoÅrsaker as UttaksperiodeInfoÅrsakerType,
  type Utenlandsopphold,
  type ArbeidsgiverOversiktDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { KodeverkType, type KodeverkNavnFraKodeType } from '@k9-sak-web/lib/kodeverk/types.js';
import { Alert, Box, Heading, HelpText, HGrid, HStack, Tag } from '@navikt/ds-react';
import { BriefcaseClockIcon, CheckmarkIcon, HandHeartIcon, SackKronerIcon } from '@navikt/aksel-icons';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import GraderingMotTilsynDetaljer from './GraderingMotTilsynDetaljer';
import GraderingMotArbeidstidDetaljer from './GraderingMotArbeidstidDetaljer';
import GraderingMotInntektDetaljer from './GraderingMotInntektDetaljer';
import type { UttaksperiodeMedInntektsgradering } from '../types/UttaksperiodeMedInntektsgradering';
import {
  BarnetsDødsfallÅrsakerMedTekst,
  IkkeOppfylteÅrsakerMedTekst,
} from '../constants/UttaksperiodeInfoÅrsakerTekst';
import styles from './uttakDetaljer.module.css';
import { fagsakYtelsesType, type FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';

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

  if (utfall === UttaksperiodeInfoUtfall.IKKE_OPPFYLT) {
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
  uttak: UttaksperiodeMedInntektsgradering;
  arbeidsforhold: ArbeidsgiverOversiktDto['arbeidsgivere'];
  manueltOverstyrt: boolean;
  ytelsetype: FagsakYtelsesType;
}

const UttakDetaljer = ({ uttak, arbeidsforhold, manueltOverstyrt, ytelsetype }: UttakDetaljerProps): JSX.Element => {
  const { kodeverkNavnFraKode } = useKodeverkContext();

  const {
    utbetalingsgrader,
    graderingMotTilsyn,
    årsaker,
    søkersTapteArbeidstid,
    pleiebehov,
    utenlandsopphold,
    utfall,
    inntektsgradering,
  } = uttak;

  /*
   * Hvis det returneres data for inntektsgradering fra backend, er det Gradering mot arbeidsinntekt som skal "highlightes".
   * Data for gradering mot arbeidsinntekt returneres ikke om det ikke er dette som gir lavest grad.
   * Om det ikke foreligger data for inntektsgradering er det årsakene som forteller hvilken som skal "highlightes",
   * henholdsvis GRADERT_MOT_TILSYN og AVKORTET_MOT_INNTEKT
   * AVKORTET_MOT_INNTEKT er årsaken som definerer om det er Gradert mot arbeidstid.
   */
  const shouldHighlightInntekt = !manueltOverstyrt && !!inntektsgradering;
  const shouldHighlightTilsyn =
    !manueltOverstyrt &&
    !shouldHighlightInntekt &&
    årsaker &&
    shouldHighlight(UttaksperiodeInfoÅrsaker.GRADERT_MOT_TILSYN, årsaker || []);
  const shouldHighlightArbeidstid =
    !manueltOverstyrt &&
    !shouldHighlightInntekt &&
    årsaker &&
    shouldHighlight(UttaksperiodeInfoÅrsaker.AVKORTET_MOT_INNTEKT, årsaker || []);

  const skalViseGraderingMotTilsyn = ![
    fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE,
    fagsakYtelsesType.OPPLÆRINGSPENGER,
  ].some(ytelse => ytelse === ytelsetype);

  // Hvis en av årsakene fra uttaksdetaljene er en av årsakene for barnets dødsfall ...
  const harBarnetsDødsfallÅrsak = årsaker?.some(årsak =>
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
      <HGrid gap="8" columns={3} align="start" className={styles['uttakDetaljer']}>
        {graderingMotTilsyn && skalViseGraderingMotTilsyn && (
          <Box
            className={`${styles.uttakDetaljerGraderingDetaljer} ${shouldHighlightTilsyn ? styles.uttakDetaljerGraderingDetaljerHighlighted : styles.uttakDetaljerGraderingDetaljerNotHighlighted}`}
            title="Gradering mot tilsyn"
          >
            {shouldHighlightTilsyn && (
              <Box className={styles.uttakDetaljerTag}>
                <Tag size="medium" variant="alt3-moderate">
                  <CheckmarkIcon />
                  Gir lavest pleiepengegrad
                </Tag>
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
              <Tag size="medium" variant="alt3-moderate">
                <CheckmarkIcon />
                Gir lavest pleiepengegrad
              </Tag>
            </Box>
          )}
          <HStack>
            <BriefcaseClockIcon className="!ml-[-4px]" />
            <Heading size="xsmall">Gradering mot arbeidstid</Heading>
          </HStack>
          <GraderingMotArbeidstidDetaljer
            alleArbeidsforhold={arbeidsforhold || {}}
            utbetalingsgrader={utbetalingsgrader || []}
            søkersTapteArbeidstid={søkersTapteArbeidstid}
          />
        </Box>

        {inntektsgradering && (
          <Box
            className={`${styles.uttakDetaljerGraderingDetaljer} ${shouldHighlightInntekt ? styles.uttakDetaljerGraderingDetaljerHighlighted : styles.uttakDetaljerGraderingDetaljerNotHighlighted}`}
            title="Gradering mot inntekt"
          >
            {shouldHighlightInntekt && (
              <Box className={styles.uttakDetaljerTag}>
                <Tag size="medium" variant="alt3-moderate">
                  <CheckmarkIcon />
                  Gir lavest pleiepengegrad
                </Tag>
              </Box>
            )}
            <HStack>
              <SackKronerIcon className="!ml-[-4px]" />
              <Heading size="xsmall">Gradering mot arbeidsinntekt</Heading>
            </HStack>
            <GraderingMotInntektDetaljer
              alleArbeidsforhold={arbeidsforhold || {}}
              inntektsgradering={inntektsgradering}
            />
          </Box>
        )}
      </HGrid>
    </>
  );
};
export default UttakDetaljer;
