import * as React from 'react';
import classNames from 'classnames/bind';

import { ContentWithTooltip, GreenCheckIcon, OnePersonIconBlue } from '@navikt/ft-plattform-komponenter';
import { EtikettAdvarsel, EtikettSuksess } from 'nav-frontend-etiketter';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { PopoverOrientering } from 'nav-frontend-popover';
import { Element } from 'nav-frontend-typografi';
import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { HelpText } from '@navikt/ds-react';

import { arbeidstypeTilVisning } from '../../../constants/Arbeidstype';
import BarnetsDødsfallÅrsakerMedTekst from '../../../constants/BarnetsDødsfallÅrsakerMedTekst';
import IkkeOppfylteÅrsakerMedTekst from '../../../constants/IkkeOppfylteÅrsakerMedTekst';
import OverseEtablertTilsynÅrsak from '../../../constants/OverseEtablertTilsynÅrsak';
import Årsaker from '../../../constants/Årsaker';
import ArbeidsgiverOpplysninger from '../../../types/ArbeidsgiverOpplysninger';
import GraderingMotTilsyn from '../../../types/GraderingMotTilsyn';
import Utbetalingsgrad from '../../../types/Utbetalingsgrad';
import { Uttaksperiode } from '../../../types/Uttaksperiode';
import { beregnDagerTimer } from '../../../util/dateUtils';
import { harÅrsak } from '../../../util/årsakUtils';
import ContainerContext from '../../context/ContainerContext';
import UttakUtregning from './UttakUtregning';
import Utfall from '../../../constants/Utfall';

import styles from './uttakDetaljer.css';

const cx = classNames.bind(styles);

const getÅrsaksetiketter = (årsaker: Årsaker[]) => {
  const funnedeÅrsaker = IkkeOppfylteÅrsakerMedTekst.filter(årsak => harÅrsak(årsaker, årsak.årsak));
  return funnedeÅrsaker.map(årsak => (
    <EtikettAdvarsel key={årsak.årsak} className={styles.uttakDetaljer__etikett}>
      {årsak.tekst}
    </EtikettAdvarsel>
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
    <EtikettSuksess className={styles.uttakDetaljer__etikett}>
      {utenlandsoppholdTekst(utenlandsopphold, kodeverkUtenlandsoppholdÅrsak)}
    </EtikettSuksess>
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
            <Hjelpetekst className={styles.uttakDetaljer__data__questionMark} type={PopoverOrientering.Hoyre}>
              {utnullingPåGrunnAvBeredskapEllerNattevåk
                ? beredskapEllerNattevåkÅrsakTekst
                : 'Etablert tilsyn under 10 % blir ikke medregnet.'}
            </Hjelpetekst>
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
  manueltOverstyrt?: boolean
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
        const faktiskOverstigerNormal = beregnetNormalArbeidstid < beregnetFaktiskArbeidstid;
        const prosentFravær = Math.round(Math.max(beregnetNormalArbeidstid - beregnetFaktiskArbeidstid, 0) / beregnetNormalArbeidstid * 100);

        return (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index}>
            <Element className={styles.uttakDetaljer__avkortingMotArbeid__heading}>
              <span>{arbeidstype}</span>
              <span>{arbeidsgiverInfo || orgnr || arbeidsgiverFnr}</span>
            </Element>
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
                <Hjelpetekst className={styles.uttakDetaljer__data__questionMark} type={PopoverOrientering.Hoyre}>
                  Overstigende timer tas ikke hensyn til, faktisk arbeidstid settes lik normal arbeidstid
                </Hjelpetekst>
              )}
            </span>
            <hr />
            <div className="inline-flex justify-between w-full mb-6">
              <div>= {prosentFravær}% fravær</div>
              <div className='inline-flex justify-end'>
                Utbetalingsgrad: {utbetalingsgrad}%
                {manueltOverstyrt && <>
                  <PersonPencilFillIcon className="ml-1 align-middle text-2xl text-border-warning" title="Manuelt overstyrt" />
                  <HelpText title="Hvor kommer utbetalingsgraden fra?">
                    Utbetalingsgraden <i>kan</i> være manuelt overstyrt av saksbehandler.
                  </HelpText>
                </>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
    <div className="border-4">
      {`= ${søkersTapteArbeidstid} % totalt inntektstap`}
    </div>
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
    manueltOverstyrt
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
                <Hjelpetekst className={styles.uttakDetaljer__data__questionMark} type={PopoverOrientering.Hoyre}>
                  Gradering mot tilsyn blir ikke medregnet på grunn av barnets dødsfall.
                </Hjelpetekst>
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
          {formatAvkortingMotArbeid(utbetalingsgrader, søkersTapteArbeidstid, arbeidsforhold, manueltOverstyrt)}
        </UttakUtregning>
      </div>
    </div>
  );
};
export default UttakDetaljer;
