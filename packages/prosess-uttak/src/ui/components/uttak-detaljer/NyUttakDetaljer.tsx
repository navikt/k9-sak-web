import classNames from 'classnames/bind';
import * as React from 'react';

import { Alert, Box, Heading, HelpText, HGrid, HStack, Tag } from '@navikt/ds-react';
import { BriefcaseClockIcon, CheckmarkIcon, HandHeartIcon, SackKronerIcon } from '@navikt/aksel-icons';
import { ContentWithTooltip, GreenCheckIcon, OnePersonIconBlue } from '@navikt/ft-plattform-komponenter';
import BarnetsDødsfallÅrsakerMedTekst from '../../../constants/BarnetsDødsfallÅrsakerMedTekst';
import IkkeOppfylteÅrsakerMedTekst from '../../../constants/IkkeOppfylteÅrsakerMedTekst';
import Utfall from '../../../constants/Utfall';
import Årsaker from '../../../constants/Årsaker';
import { UttaksperiodeMedInntektsgradering } from '../../../types/Uttaksperiode';
import { harÅrsak } from '../../../util/årsakUtils';
import ContainerContext from '../../context/ContainerContext';
import GraderingMotTilsynDetaljer from './GraderingMotTilsynDetaljer';
import GraderingMotArbeidstidDetaljer from './GraderingMotArbeidstidDetaljer';
import GraderingMotInntektDetaljer from './GraderingMotInntektDetaljer';

import styles from './nyUttakDetaljer.module.css';

import type { JSX } from 'react';

const cx = classNames.bind(styles);

const getÅrsaksetiketter = (årsaker: Årsaker[]) => {
  const funnedeÅrsaker = IkkeOppfylteÅrsakerMedTekst.filter(årsak => harÅrsak(årsaker, årsak.årsak));
  return funnedeÅrsaker.map(årsak => (
    <Tag variant="error" key={årsak.årsak} className={styles.uttakDetaljer__etikett}>
      {årsak.tekst}
    </Tag>
  ));
};

const getTekstVedBarnetsDødsfall = (årsaker: Årsaker[]) => {
  const funnedeÅrsaker = BarnetsDødsfallÅrsakerMedTekst.filter(årsak => harÅrsak(årsaker, årsak.årsak));
  return funnedeÅrsaker.map(årsak => (
    <div key={årsak.årsak} className={styles.uttakDetaljer__etikettBarnetsDødsfall}>
      {årsak.tekst}
    </div>
  ));
};

const utenlandsoppholdTekst = (utenlandsopphold, kodeverk) => {
  if (utenlandsopphold?.erEøsLand) {
    return 'Periode med utenlandsopphold i EØS-land, telles ikke i 8 uker.';
  }

  return kodeverk?.find(v => v.kode === utenlandsopphold?.årsak)?.navn;
};

const utenlandsoppholdInfo = (utfall: Utfall, utenlandsopphold: { landkode: string }) => {
  const { kodeverkUtenlandsoppholdÅrsak } = React.useContext(ContainerContext);

  if (!utenlandsopphold?.landkode) {
    return null;
  }

  if (utfall === Utfall.IKKE_OPPFYLT) {
    return null;
  }

  return (
    <Tag variant="success" className={styles.uttakDetaljer__etikett}>
      {utenlandsoppholdTekst(utenlandsopphold, kodeverkUtenlandsoppholdÅrsak)}
    </Tag>
  );
};

const shouldHighlight = (aktuellÅrsak: Årsaker, årsaker: Årsaker[]) => årsaker.some(årsak => årsak === aktuellÅrsak);
const harBarnetsDødsfallÅrsak = (årsaker: Årsaker[]) =>
  BarnetsDødsfallÅrsakerMedTekst.some(barnetsDødsfallÅrsak => harÅrsak(årsaker, barnetsDødsfallÅrsak.årsak));

const getSøkerBerOmMaksimalt = (søkerBerOmMaksimalt: number, årsaker: Årsaker[]) => {
  const highlightSøkerBerOmMaksimalt =
    søkerBerOmMaksimalt && shouldHighlight(Årsaker.AVKORTET_MOT_SØKERS_ØNSKE, årsaker);

  const containerCls = cx('uttakDetaljer__oppsummering__container', {
    'uttakDetaljer__oppsummering__container--highlighted': highlightSøkerBerOmMaksimalt,
  });

  return (
    <div className={containerCls}>
      {highlightSøkerBerOmMaksimalt && (
        <div className={styles.uttakDetaljer__oppsummering__checkIcon}>
          <GreenCheckIcon size={19} />
        </div>
      )}
      <ContentWithTooltip tooltipText="Søker">
        <OnePersonIconBlue />
      </ContentWithTooltip>
      <p className={styles.uttakDetaljer__oppsummering__tekst}>{`Søker ber om maksimalt: ${søkerBerOmMaksimalt} %`}</p>
    </div>
  );
};

interface UttakDetaljerProps {
  uttak: UttaksperiodeMedInntektsgradering;
  manueltOverstyrt: boolean;
}

const NyUttakDetaljer = ({ uttak, manueltOverstyrt }: UttakDetaljerProps): JSX.Element => {
  const { arbeidsforhold, erFagytelsetypeLivetsSluttfase } = React.useContext(ContainerContext);
  const {
    utbetalingsgrader,
    graderingMotTilsyn,
    søkerBerOmMaksimalt,
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
    !manueltOverstyrt && !shouldHighlightInntekt && shouldHighlight(Årsaker.GRADERT_MOT_TILSYN, årsaker);
  const shouldHighlightArbeidstid =
    !manueltOverstyrt && !shouldHighlightInntekt && shouldHighlight(Årsaker.AVKORTET_MOT_INNTEKT, årsaker);

  return (
    <>
      {getÅrsaksetiketter(årsaker)}
      {getTekstVedBarnetsDødsfall(årsaker)}
      {utenlandsoppholdInfo(utfall, utenlandsopphold)}
      <div className={styles.uttakDetaljer__oppsummering}>
        {søkerBerOmMaksimalt && getSøkerBerOmMaksimalt(søkerBerOmMaksimalt, årsaker)}
      </div>
      {manueltOverstyrt && (
        <Alert variant="info" size="small" className="mx-4">
          Uttaksgrad og/eller utbetalingsgrad er manuelt overstyrt av saksbehandler.
        </Alert>
      )}
      <HGrid gap="8" columns={3} align="start" className={styles.uttakDetaljer}>
        {graderingMotTilsyn && !erFagytelsetypeLivetsSluttfase && (
          <Box
            className={cx({
              uttakDetaljer__graderingDetaljer: true,
              uttakDetaljer__graderingDetaljer__highlight: shouldHighlightTilsyn,
              uttakDetaljer__graderingDetaljer__notHighlighted: !shouldHighlightTilsyn,
            })}
            title="Gradering mot tilsyn"
          >
            {shouldHighlightTilsyn && (
              <Box className={styles.uttakDetaljer__tag}>
                <Tag size="medium" variant="alt3-moderate">
                  <CheckmarkIcon />
                  Gir lavest pleiepengegrad
                </Tag>
              </Box>
            )}
            <HStack>
              <HandHeartIcon className="!ml-[-4px]" />
              <Heading size="xsmall"> Gradering mot tilsyn</Heading>
              {harBarnetsDødsfallÅrsak(årsaker) && (
                <HelpText placement="right" wrapperClassName={styles.uttakDetaljer__data__questionMark}>
                  Gradering mot tilsyn blir ikke medregnet på grunn av barnets dødsfall.
                </HelpText>
              )}
            </HStack>
            <GraderingMotTilsynDetaljer graderingMotTilsyn={graderingMotTilsyn} pleiebehov={pleiebehov} />
          </Box>
        )}

        <Box
          className={cx({
            uttakDetaljer__graderingDetaljer: true,
            uttakDetaljer__graderingDetaljer__highlight: shouldHighlightArbeidstid,
            uttakDetaljer__graderingDetaljer__notHighlighted: !shouldHighlightArbeidstid,
          })}
          title="Gradering mot arbeidstid"
        >
          {shouldHighlightArbeidstid && (
            <Box className={styles.uttakDetaljer__tag}>
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
            alleArbeidsforhold={arbeidsforhold}
            utbetalingsgrader={utbetalingsgrader}
            søkersTapteArbeidstid={søkersTapteArbeidstid}
          />
        </Box>

        {inntektsgradering && (
          <Box
            className={cx({
              uttakDetaljer__graderingDetaljer: true,
              uttakDetaljer__graderingDetaljer__highlight: shouldHighlightInntekt,
              uttakDetaljer__graderingDetaljer__notHighlighted: !shouldHighlightInntekt,
            })}
            title="Gradering mot inntekt"
          >
            {shouldHighlightInntekt && (
              <Box className={styles.uttakDetaljer__tag}>
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
            <GraderingMotInntektDetaljer alleArbeidsforhold={arbeidsforhold} inntektsgradering={inntektsgradering} />
          </Box>
        )}
      </HGrid>
    </>
  );
};
export default NyUttakDetaljer;
