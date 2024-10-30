import classNames from 'classnames/bind';
import * as React from 'react';

import { HelpText, Label, Tag } from '@navikt/ds-react';
import { ContentWithTooltip, GreenCheckIcon, OnePersonIconBlue } from '@navikt/ft-plattform-komponenter';
import Arbeidstype, { arbeidstypeTilVisning } from '../../../constants/Arbeidstype';
import BarnetsDødsfallÅrsakerMedTekst from '../../../constants/BarnetsDødsfallÅrsakerMedTekst';
import IkkeOppfylteÅrsakerMedTekst from '../../../constants/IkkeOppfylteÅrsakerMedTekst';
import OverseEtablertTilsynÅrsak from '../../../constants/OverseEtablertTilsynÅrsak';
import Utfall from '../../../constants/Utfall';
import Årsaker from '../../../constants/Årsaker';
import ArbeidsgiverOpplysninger from '../../../types/ArbeidsgiverOpplysninger';
import GraderingMotTilsyn from '../../../types/GraderingMotTilsyn';
import Utbetalingsgrad from '../../../types/Utbetalingsgrad';
import { Uttaksperiode } from '../../../types/Uttaksperiode';
import { beregnDagerTimer } from '../../../util/dateUtils';
import { harÅrsak } from '../../../util/årsakUtils';
import ContainerContext from '../../context/ContainerContext';
import UttakUtregning from './UttakUtregning';
import styles from './uttakDetaljer.module.css';

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
    <div className={styles.uttakDetaljer__graderingMotTilsyn}>
      <p className={styles.uttakDetaljer__data}>{`Pleiebehov: ${pleiebehov} %`}</p>
      <span className={styles.uttakDetaljer__data}>
        {`- Etablert tilsyn: `}
        {overseEtablertTilsynÅrsak ? (
          <>
            <span className={cx('uttakDetaljer__data--utnullet', 'uttakDetaljer__data--margin-left')}>
              {etablertTilsyn} %
            </span>
            <HelpText className={styles.uttakDetaljer__data__questionMark} placement="right">
              {utnullingPåGrunnAvBeredskapEllerNattevåk
                ? beredskapEllerNattevåkÅrsakTekst
                : 'Etablert tilsyn under 10 % blir ikke medregnet.'}
            </HelpText>
          </>
        ) : (
          `${etablertTilsyn} %`
        )}
      </span>
      <p className={styles.uttakDetaljer__data}>{`- Andre søkeres tilsyn: ${andreSøkeresTilsyn} %`}</p>
      <hr className={styles.uttakDetaljer__separator} />
      <p className={styles.uttakDetaljer__sum}>{`= ${tilgjengeligForSøker} % tilgjengelig for søker`}</p>
    </div>
  );
};

const formatAvkortingMotArbeid = (
  utbetalingsgrader: Utbetalingsgrad[],
  søkersTapteArbeidstid: number,
  alleArbeidsforhold: Record<string, ArbeidsgiverOpplysninger>,
) => (
  <>
    <div className={styles.uttakDetaljer__avkortingMotArbeid}>
      {utbetalingsgrader.map((utbetalingsgradItem, index) => {
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
        );

        const nyInntektTekst = () => {
          if (arbeidsforhold?.type === Arbeidstype.AT) {
            return 'Nytt arbeidsforhold';
          }
          if (arbeidsforhold?.type === Arbeidstype.FL) {
            return 'Ny frilansaktivitet';
          }
          if (arbeidsforhold?.type === Arbeidstype.SN) {
            return 'Ny virksomhet';
          }
          return '';
        };

        return (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index}>
            <div className="flex gap-[6px]">
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
          </div>
        );
      })}
    </div>
    <div className="border-4">{`= ${søkersTapteArbeidstid} % totalt inntektstap`}</div>
  </>
);

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
  uttak: Uttaksperiode;
}

const UttakDetaljer = ({ uttak }: UttakDetaljerProps): JSX.Element => {
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
  } = uttak;
  return (
    <div className={styles.uttakDetaljer}>
      {getÅrsaksetiketter(årsaker)}
      {getTekstVedBarnetsDødsfall(årsaker)}
      {utenlandsoppholdInfo(utfall, utenlandsopphold)}
      <div className={styles.uttakDetaljer__oppsummering}>
        {søkerBerOmMaksimalt && getSøkerBerOmMaksimalt(søkerBerOmMaksimalt, årsaker)}
      </div>
      <div className={styles.uttakDetaljer__grid}>
        {graderingMotTilsyn && !erFagytelsetypeLivetsSluttfase && (
          <UttakUtregning
            heading="Gradering mot tilsyn"
            highlight={shouldHighlight(Årsaker.GRADERT_MOT_TILSYN, årsaker)}
            headingPostContent={
              harBarnetsDødsfallÅrsak(årsaker) && (
                <HelpText className={styles.uttakDetaljer__data__questionMark} placement="right">
                  Gradering mot tilsyn blir ikke medregnet på grunn av barnets dødsfall.
                </HelpText>
              )
            }
          >
            {formatGraderingMotTilsyn(graderingMotTilsyn, pleiebehov)}
          </UttakUtregning>
        )}
        <UttakUtregning
          heading="Avkorting mot arbeid"
          highlight={shouldHighlight(Årsaker.AVKORTET_MOT_INNTEKT, årsaker)}
        >
          {formatAvkortingMotArbeid(utbetalingsgrader, søkersTapteArbeidstid, arbeidsforhold)}
        </UttakUtregning>
      </div>
    </div>
  );
};
export default UttakDetaljer;
