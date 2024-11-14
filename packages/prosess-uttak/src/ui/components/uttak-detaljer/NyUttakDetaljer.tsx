import classNames from 'classnames/bind';
import * as React from 'react';

import { BodyShort, Box, Heading, HelpText, HGrid, HStack, Tag, VStack } from '@navikt/ds-react';
import { BriefcaseClockIcon, CheckmarkIcon, ChevronDownIcon, HandHeartIcon, SackKronerIcon } from '@navikt/aksel-icons';
import { ContentWithTooltip, GreenCheckIcon, OnePersonIconBlue } from '@navikt/ft-plattform-komponenter';
import { tilNOK } from '@k9-sak-web/gui/utils/formatters.js';
import BarnetsDødsfallÅrsakerMedTekst from '../../../constants/BarnetsDødsfallÅrsakerMedTekst';
import IkkeOppfylteÅrsakerMedTekst from '../../../constants/IkkeOppfylteÅrsakerMedTekst';
import OverseEtablertTilsynÅrsak from '../../../constants/OverseEtablertTilsynÅrsak';
import Utfall from '../../../constants/Utfall';
import Årsaker from '../../../constants/Årsaker';
import ArbeidsgiverOpplysninger from '../../../types/ArbeidsgiverOpplysninger';
import GraderingMotTilsyn from '../../../types/GraderingMotTilsyn';
import Utbetalingsgrad from '../../../types/Utbetalingsgrad';
import { Inntektsgradering, UttaksperiodeMedInntektsgradering } from '../../../types/Uttaksperiode';
import { harÅrsak } from '../../../util/årsakUtils';
import ContainerContext from '../../context/ContainerContext';

import styles from './nyUttakDetaljer.module.css';

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

const harBeredskapEllerNattevåkÅrsak = (overseEtablertTilsynÅrsak: OverseEtablertTilsynÅrsak) => {
  const beredskapEllerNattevåkÅrsaker = [
    OverseEtablertTilsynÅrsak.BEREDSKAP,
    OverseEtablertTilsynÅrsak.NATTEVÅK,
    OverseEtablertTilsynÅrsak.NATTEVÅK_OG_BEREDSKAP,
  ];
  return beredskapEllerNattevåkÅrsaker.some(årsak => årsak === overseEtablertTilsynÅrsak);
};

const getÅrsakstekst = (overseEtablertTilsynÅrsak: OverseEtablertTilsynÅrsak, etablertTilsyn: number) => {
  if (overseEtablertTilsynÅrsak === OverseEtablertTilsynÅrsak.BEREDSKAP) {
    return `Etablert tilsyn på ${etablertTilsyn} % blir ikke medregnet på grunn av beredskap.`;
  }
  if (overseEtablertTilsynÅrsak === OverseEtablertTilsynÅrsak.NATTEVÅK) {
    return `Etablert tilsyn på ${etablertTilsyn} % blir ikke medregnet på grunn av nattevåk.`;
  }
  return `Etablert tilsyn på ${etablertTilsyn} % blir ikke medregnet på grunn av nattevåk og beredskap.`;
};

const formatGraderingMotTilsyn = (graderingMotTilsyn: GraderingMotTilsyn, pleiebehov: number) => {
  const { etablertTilsyn, andreSøkeresTilsyn, tilgjengeligForSøker, overseEtablertTilsynÅrsak } = graderingMotTilsyn;

  const utnullingPåGrunnAvBeredskapEllerNattevåk =
    overseEtablertTilsynÅrsak && harBeredskapEllerNattevåkÅrsak(overseEtablertTilsynÅrsak);
  const beredskapEllerNattevåkÅrsakTekst = utnullingPåGrunnAvBeredskapEllerNattevåk
    ? getÅrsakstekst(overseEtablertTilsynÅrsak, etablertTilsyn)
    : '';

  return (
    <>
      <BodyShort as="div" className={styles.uttakDetaljer__detailItem} size="small">
        Pleiebehov: {pleiebehov} %
      </BodyShort>
      <BodyShort as="div" className={styles.uttakDetaljer__detailItem} size="small">
        <HStack>
          {`- Etablert tilsyn: `}{' '}
          {!overseEtablertTilsynÅrsak ? (
            <>
              {etablertTilsyn} %
              <HelpText className={styles.uttakDetaljer__data__questionMark} placement="right">
                {utnullingPåGrunnAvBeredskapEllerNattevåk
                  ? beredskapEllerNattevåkÅrsakTekst
                  : 'Etablert tilsyn under 10 % blir ikke medregnet.'}
              </HelpText>
            </>
          ) : (
            `${etablertTilsyn} %`
          )}
        </HStack>
      </BodyShort>
      <BodyShort as="div" className={styles.uttakDetaljer__detailItem} size="small">
        {`- Andre søkeres tilsyn: ${andreSøkeresTilsyn} %`}
      </BodyShort>
      <BodyShort as="div" className={styles.uttakDetaljer__detailSum} size="small">
        {`= ${tilgjengeligForSøker} % tilgjengelig til søker`}
      </BodyShort>
    </>
  );
};

const formatAvkortingMotArbeidstid = () => {
  // FIXME
  return <>tid ... den går</>;
};

interface UttakEkspanderbarProps {
  title: string;
  children: React.ReactNode;
}

const UttakEkspanderbar: React.FC<UttakEkspanderbarProps> = ({ title, children }) => {
  const [utvid, setUtvid] = React.useState<boolean>(false);

  const toggleExpand = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setUtvid(!utvid);
  };

  return (
    <Box className={styles.uttakDetaljer__expandableDetailItem}>
      <Box className={styles.uttakDetaljer__expandableDetailItem__header}>
        <a href="#" onClick={toggleExpand}>
          <div>
            <BodyShort size="small" as="span">
              {title}
            </BodyShort>
            <ChevronDownIcon />
          </div>
        </a>
      </Box>
      <div
        className={`uttakDetaljer__expandableDetailItem__content ${
          utvid
            ? styles.uttakDetaljer__expandableDetailItem__contentExpanded
            : styles.uttakDetaljer__expandableDetailItem__contentCollapsed
        }`}
      >
        {children}
      </div>
    </Box>
  );
};

const formatAvkortingMotArbeidsinntekt = (
  utbetalingsgrader: Utbetalingsgrad[],
  søkersTapteArbeidstid: number,
  alleArbeidsforhold: Record<string, ArbeidsgiverOpplysninger>,
  inntektsgradering: Inntektsgradering,
) => {
  console.log('inntektsgraering', inntektsgradering);
  const { reduksjonsProsent, inntektsforhold } = inntektsgradering; // graderingsProsent
  const beregningsgrunnlag = tilNOK.format(inntektsgradering.beregningsgrunnlag);
  const løpendeInntekt = tilNOK.format(inntektsgradering.løpendeInntekt);
  const bortfaltInntekt = tilNOK.format(inntektsgradering.bortfaltInntekt);
  return (
    <VStack>
      <>
        <UttakEkspanderbar title={`Beregningsgrunnlag: ${beregningsgrunnlag}`}>
          {inntektsforhold.map(inntForhold => {
            const { løpendeInntekt, bruttoInntekt } = inntForhold;
            return (
              <Box className={styles.uttakDetaljer__beregningFirma}>
                <BodyShort size="small" weight="semibold">
                  {/* FIXME: Må få inn data fra backend */}
                  Navnet på firma (123321123)
                </BodyShort>
                <BodyShort size="small">Inntekt: {tilNOK.format(bruttoInntekt - løpendeInntekt)}</BodyShort>
              </Box>
            );
          })}
        </UttakEkspanderbar>
        <UttakEkspanderbar title={`Utbetalt lønn: ${løpendeInntekt}`}>
          {inntektsforhold.map(inntForhold => {
            return (
              <>
                <Box className={styles.uttakDetaljer__beregningFirma}>
                  <BodyShort size="small" weight="semibold">
                    {/* FIXME: Må få inn data fra backend */}
                    Navnet på firma (123321123)
                  </BodyShort>
                  <BodyShort size="small">Inntekt: {tilNOK.format(inntForhold.bruttoInntekt)}</BodyShort>
                  <BodyShort size="small">Jobber: {inntForhold.arbeidstidprosent} %</BodyShort>
                  <BodyShort size="small">= {tilNOK.format(inntForhold.løpendeInntekt)} i utbetalt lønn</BodyShort>
                </Box>
              </>
            );
          })}
        </UttakEkspanderbar>
        <UttakEkspanderbar title={`Tapt inntekt: ${bortfaltInntekt}`}>
          <Box className={styles.uttakDetaljer__taptInntektBeregning}>
            <BodyShort as="div" size="small">
              <span className={styles.uttakDetaljer__taptInntektAnnotasjon}></span>
              {beregningsgrunnlag} (beregningsgrunnlag)
            </BodyShort>
            <BodyShort as="div" size="small" className={styles.uttakDetaljer__beregningStrek}>
              <span className={styles.uttakDetaljer__taptInntektAnnotasjon}>-</span>
              {løpendeInntekt} (utbetalt lønn)
            </BodyShort>
            <BodyShort as="div" size="small" className={styles.uttakDetaljer__beregningSum}>
              <span className={styles.uttakDetaljer__taptInntektAnnotasjon}>=</span>
              {bortfaltInntekt} i tapt inntekt
            </BodyShort>
          </Box>
        </UttakEkspanderbar>

        <VStack className={styles.uttakDetaljer__nyGradering}>
          <BodyShort as="div" size="small" weight="semibold">
            Ny gradering
          </BodyShort>
          <BodyShort as="div" size="small">
            {løpendeInntekt} (utbetalt lønn) /
          </BodyShort>
          <BodyShort as="div" size="small" className={styles.uttakDetaljer__beregningStrek}>
            {beregningsgrunnlag} (beregningsgrunnlag)
          </BodyShort>
          <BodyShort as="div" size="small" className={styles.uttakDetaljer__beregningSum}>
            = {reduksjonsProsent} % reduksjon pga. utbetalt lønn
          </BodyShort>
        </VStack>

        <Box>
          <BodyShort as="div" className={styles.uttakDetaljer__detailSum} size="small">
            = {reduksjonsProsent} % totalt inntektstap
          </BodyShort>
        </Box>
      </>
    </VStack>
  );
  {
    /* {utbetalingsgrader.map((utbetalingsgradItem, index) => {
        const { normalArbeidstid, faktiskArbeidstid, utbetalingsgrad, arbeidsforhold } = utbetalingsgradItem;
        const orgnr = arbeidsforhold?.organisasjonsnummer;
        const aktoerId = arbeidsforhold?.aktørId;
        const arbeidsforholdData = alleArbeidsforhold[orgnr || aktoerId];
        const arbeidsgivernavn = arbeidsforholdData?.navn;
        const arbeidsgiverFnr = arbeidsforholdData?.personIdentifikator;
        const arbeidstype = arbeidstypeTilVisning[arbeidsforhold?.type];
        const arbeidsgiverInfo = arbeidsgivernavn ? `${arbeidsgivernavn} (${orgnr || arbeidsgiverFnr})` : '';
        const beregnetNormalArbeidstid = beregnDagerTimer(normalArbeidstid);
        const beregnetFaktiskArbeidstid = beregnDagerTimer(faktiskArbeidstid);
        const erNyInntekt = utbetalingsgradItem?.tilkommet;
        const faktiskOverstigerNormal = beregnetNormalArbeidstid < beregnetFaktiskArbeidstid;
        const prosentFravær = Math.round(
          (Math.max(beregnetNormalArbeidstid - beregnetFaktiskArbeidstid, 0) / beregnetNormalArbeidstid) * 100,
        ); */
  }

  // const nyInntektTekst = () => {
  //   if (arbeidsforhold?.type === Arbeidstype.ARBEIDSTAKER) {
  //     return 'Nytt arbeidsforhold';
  //   }
  //   if (arbeidsforhold?.type === Arbeidstype.FRILANSER) {
  //     return 'Ny frilansaktivitet';
  //   }
  //   if (arbeidsforhold?.type === Arbeidstype.SELVSTENDIG_NÆRINGSDRIVENDE) {
  //     return 'Ny virksomhet';
  //   }
  //   return '';
  // };

  // return (
  // eslint-disable-next-line react/no-array-index-key
  // <div key={index}>
  /*   sdf
          {
            /* <div className="flex gap-[6px]">
            <Label className="flex items-end" size="small">
              {arbeidstype}
            </Label>
            {erNyInntekt && (
              <Tag size="small" variant="info">
                {nyInntektTekst()}
              </Tag>
            )}
          </div>
          <span>{arbeidsgiverInfo || orgnr || arbeidsgiverFnr}</span>
          <p className={styles.uttakDetaljer__data}>{`Normal arbeidstid: ${beregnetNormalArbeidstid} timer`}</p>
          <span className={styles.uttakDetaljer__data}>
            <span>Faktisk arbeidstid:</span>
            <span
              className={cx({
                'uttakDetaljer__data--utnullet': faktiskOverstigerNormal,
                'uttakDetaljer__data--margin-left-right': true,
              })}
            >
              {beregnetFaktiskArbeidstid}
            </span>
            <span>{`${faktiskOverstigerNormal ? beregnetNormalArbeidstid : ''} timer`}</span>
            {faktiskOverstigerNormal && (
              <HelpText className={styles.uttakDetaljer__data__questionMark} placement="right">
                Overstigende timer tas ikke hensyn til, faktisk arbeidstid settes lik normal arbeidstid
              </HelpText>
            )}
          </span>
          <hr />
          <div className="inline-flex justify-between w-full mb-6">
            <div>= {prosentFravær}% fravær</div>
            <div className="inline-flex justify-end">Utbetalingsgrad: {utbetalingsgrad}%</div>
          </div> 
        }
        // </div>
        */
  // );
  // })}
  {
    /* <div className="border-4">{`= ${søkersTapteArbeidstid} % totalt inntektstap`}</div> */
  }
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
  // inntektsgradering: any; // FIXME legg til riktig type
}

const NyUttakDetaljer = ({ uttak }: UttakDetaljerProps): JSX.Element => {
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
  return (
    <>
      {/* Disse var i den gamle visningen, er de relevante for den nye? */}
      {getÅrsaksetiketter(årsaker)}
      {getTekstVedBarnetsDødsfall(årsaker)}
      {utenlandsoppholdInfo(utfall, utenlandsopphold)}
      <div className={styles.uttakDetaljer__oppsummering}>
        {søkerBerOmMaksimalt && getSøkerBerOmMaksimalt(søkerBerOmMaksimalt, årsaker)}
      </div>
      {/* Disse var i den gamle visningen, er de relevante for den nye? */}

      <HGrid gap="8" columns={3} align="start" className={styles.uttakDetaljer}>
        {graderingMotTilsyn && !erFagytelsetypeLivetsSluttfase && (
          <Box
            className={cx(
              'uttakDetaljer__graderingDetaljer',
              shouldHighlight(Årsaker.GRADERT_MOT_TILSYN, årsaker) ? 'uttakDetaljer__graderingDetaljer__highlight' : '',
            )}
          >
            <HStack>
              <HandHeartIcon />
              <Heading size="xsmall"> Gradering mot tilsyn</Heading>
              {harBarnetsDødsfallÅrsak(årsaker) && (
                <HelpText placement="right" wrapperClassName={styles.uttakDetaljer__data__questionMark}>
                  Gradering mot tilsyn blir ikke medregnet på grunn av barnets dødsfall.
                </HelpText>
              )}
            </HStack>
            {formatGraderingMotTilsyn(graderingMotTilsyn, pleiebehov)}
          </Box>
        )}

        <Box className={styles.uttakDetaljer__graderingDetaljer}>
          <HStack>
            <BriefcaseClockIcon />
            <Heading size="xsmall">Gradering mot arbeidstid</Heading>
          </HStack>
          <VStack>{formatAvkortingMotArbeidstid()}</VStack>
        </Box>

        <Box
          className={cx(
            'uttakDetaljer__graderingDetaljer',
            shouldHighlight(Årsaker.AVKORTET_MOT_INNTEKT, årsaker) ? 'uttakDetaljer__graderingDetaljer__highlight' : '',
          )}
        >
          {/* FIXME: denne må regnes ut */}
          <Box className={styles.uttakDetaljer__tag}>
            <Tag size="medium" variant="alt3-moderate">
              <CheckmarkIcon />
              Gir lavest pleiepengegrad
            </Tag>
          </Box>
          <HStack>
            <SackKronerIcon />
            <Heading size="xsmall">Gradering mot arbeidsinntekt</Heading>
          </HStack>
          {formatAvkortingMotArbeidsinntekt(
            utbetalingsgrader,
            søkersTapteArbeidstid,
            arbeidsforhold,
            inntektsgradering,
          )}
        </Box>
      </HGrid>
    </>
  );
};
export default NyUttakDetaljer;
