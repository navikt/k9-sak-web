import hide from "@fpsak-frontend/assets/images/hide.svg";
import show from "@fpsak-frontend/assets/images/show.svg";
import { Image, Table, TableRow } from '@fpsak-frontend/shared-components/index';

import { calcDays, convertHoursToDays, utledArbeidsforholdNavn } from '@fpsak-frontend/utils';
import { Arbeidsforhold, FeatureToggles, KodeverkMedNavn, Utfalltype, Uttaksperiode, Vilkår, VilkårEnum } from '@k9-sak-web/types';
import NavFrontendChevron from 'nav-frontend-chevron';
import Hjelpetekst from "nav-frontend-hjelpetekst";
import Panel from 'nav-frontend-paneler';
import Tabs from "nav-frontend-tabs";
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React, { FunctionComponent, ReactNode, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from "classnames";
import styles from './aktivitetTabell.less';
import NøkkeltallContainer, { Nokkeltalltype } from "./nokkeltall/NokkeltallContainer";
import Utfall from './Utfall';
import { durationTilTimerMed7ogEnHalvTimesDagsbasis, formatDate, periodeErIKoronaperioden } from './utils';

interface AktivitetTabellProps {
  arbeidsforhold?: Arbeidsforhold;
  arbeidsforholdtypeKode: string;
  uttaksperioder: Uttaksperiode[];
  aktivitetsstatuser: KodeverkMedNavn[];
  featureToggles: FeatureToggles;
}

const periodevisning = (periode: string): string => {
  const [fom, tom] = periode.split('/');
  return `${formatDate(fom)} - ${formatDate(tom)}`;
};

const antallDager = (periode: string): string => {
  const [fom, tom] = periode.split('/');
  return calcDays(fom, tom, false);
};

const dagerOgTimer = (duration?: string) => {
  if (duration) {
    const timer = durationTilTimerMed7ogEnHalvTimesDagsbasis(duration);
    return convertHoursToDays(timer);
  }
  return { days: 0, hours: 0 };
};

const formaterFravær = (periode: string, delvisFravær?: string): ReactNode => {
  if (delvisFravær) {
    const { days, hours } = dagerOgTimer(delvisFravær);
    if (days > 0) {
      return <FormattedMessage id="Uttaksplan.DelvisFraværMedDager" values={{ dager: days, timer: hours }} />;
    }
    return <FormattedMessage id="Uttaksplan.DelvisFravær" values={{ timer: hours }} />;
  }
  const dager = antallDager(periode);
  return <FormattedMessage id="Uttaksplan.FulltFravær" values={{ dager }} />;
};

const utfallErIngenUtbetaling = (delvisFravær: string) => {
  if (delvisFravær) {
    const { days, hours } = dagerOgTimer(delvisFravær);

    if (days === 0 && hours === 0) {
      return true;
    }
  }
  return false;
};

const arbeidsforholdSist = (_, [vilkår_2]: [Vilkår, Utfalltype]): number =>
  vilkår_2 === VilkårEnum.ARBEIDSFORHOLD ? -1 : 0;

const AktivitetTabell: FunctionComponent<AktivitetTabellProps> = ({
  arbeidsforhold,
  arbeidsforholdtypeKode,
  uttaksperioder,
  aktivitetsstatuser,
  featureToggles,
}) => {
  const [valgtPeriodeIndex, velgPeriodeIndex] = useState<number>();
  const [valgteDetaljfaner, velgDetaljfaner] = useState<number[]>();
  const [listeApneNokkeltall, endreListeApneNokkeltall] = useState<Nokkeltalltype[][]>();

  const velgPeriode = (index: number) => {
    if (valgtPeriodeIndex === index) {
      velgPeriodeIndex(null);
    } else {
      velgPeriodeIndex(index);
    }
  };

  const velgDetaljfane = (faneindex: number) =>
    velgDetaljfaner(Object.assign([], valgteDetaljfaner, {[valgtPeriodeIndex]: faneindex}));

  const apneNokkeltall = listeApneNokkeltall?.[valgtPeriodeIndex];

  const viserAlleDetaljer = apneNokkeltall && Object.values(apneNokkeltall).length === 4;

  const endreApneNokkeltall = (nyeApneNokkeltall: Nokkeltalltype[]) =>
    endreListeApneNokkeltall(Object.assign([], listeApneNokkeltall, {[valgtPeriodeIndex]: nyeApneNokkeltall}));

  const visEllerSkjulAlleNokkeltalldetaljer =
    () => endreApneNokkeltall(viserAlleDetaljer ? [] : [
      Nokkeltalltype.DAGER_SOKER_HAR_RETT_PA,
      Nokkeltalltype.DAGER_NAV_KAN_UTBETALE,
      Nokkeltalltype.FORBRUKTE_DAGER,
      Nokkeltalltype.RESTDAGER
    ]);

  const visEllerSkjulNokkeltalldetaljer = (nokkeltalltype: Nokkeltalltype) => {
    if (apneNokkeltall?.includes(nokkeltalltype)) {
      endreApneNokkeltall(apneNokkeltall.filter(type => type !== nokkeltalltype));
    } else {
      endreApneNokkeltall(apneNokkeltall
        ? apneNokkeltall.concat([nokkeltalltype])
        : [nokkeltalltype]);
    }
  };

  const arbeidsforholdType: string =
    aktivitetsstatuser.find(aktivitetsstatus => aktivitetsstatus.kode === arbeidsforholdtypeKode)?.navn ||
    arbeidsforholdtypeKode;

  const beskrivelse = arbeidsforhold
    ? `${arbeidsforholdType}, ${utledArbeidsforholdNavn(arbeidsforhold)}`
    : arbeidsforholdType;

  enum Fanenavn {VILKAR, HJEMMEL, NOKKELTALL}

  return (
    <Panel border className={styles.aktivitetTabell}>
      <Element>{beskrivelse}</Element>
      <Table
        suppliedHeaders={<>
          <th><FormattedMessage id="Uttaksplan.Periode" /></th>
          <th><FormattedMessage id="Uttaksplan.Utfall" /></th>
          <th><FormattedMessage id="Uttaksplan.Fravær" /></th>
          <th><FormattedMessage id="Uttaksplan.Utbetalingsgrad" /></th>
          <th/>
        </>}
        noHover
        withoutTbody
        notFocusableHeader
      >
        {uttaksperioder.map(({ periode, delvisFravær, utfall, utbetalingsgrad, vurderteVilkår, hjemler, nøkkeltall }, index) => {
          const erValgt = valgtPeriodeIndex === index;
          const erKoronaperiode = useMemo(() => periodeErIKoronaperioden(periode), [periode]);
          const sorterteVilkår = useMemo(() => Object.entries(vurderteVilkår.vilkår).sort(arbeidsforholdSist), [
            vurderteVilkår.vilkår,
          ]);
          const utfallIngenUtbetaling = utfallErIngenUtbetaling(delvisFravær);

          const visVilkarHjemlerEllerNokkeltall = faneindex => {
            switch (faneindex) {

              case Fanenavn.HJEMMEL:
                return <td colSpan={5}>
                  {hjemler.map(hjemmel => (
                    <div key={`${periode}--${hjemmel}`}>
                      <FormattedMessage id={`Uttaksplan.Hjemmel.${hjemmel}`} />
                    </div>
                  ))}
                </td>;

              case Fanenavn.NOKKELTALL:
                return <td colSpan={5}>
                  <NøkkeltallContainer
                    totaltAntallDager={nøkkeltall.totaltAntallDager}
                    antallDagerArbeidsgiverDekker={nøkkeltall.antallDagerArbeidsgiverDekker}
                    antallDagerInfotrygd={nøkkeltall.antallDagerInfotrygd}
                    antallKoronadager={nøkkeltall.antallKoronadager}
                    forbrukteDager={nøkkeltall.antallForbrukteDager}
                    forbruktTid={nøkkeltall.forbruktTid}
                    restTid={nøkkeltall.restTid}
                    smitteverndager={nøkkeltall.smittevernTid}
                    uttaksperioder={[]}
                    benyttetRammemelding
                    apneNokkeltall={apneNokkeltall}
                    visEllerSkjulNokkeltalldetaljer={visEllerSkjulNokkeltalldetaljer}
                    migrertData={nøkkeltall.migrertData}
                  />
                </td>;

              default:
                return <>
                  <td>
                    {sorterteVilkår.map(([vilkår, vilkårsutfall]) => (
                      <Normaltekst key={`${periode}--${vilkår}`}>
                        <FormattedMessage
                          id={
                            vilkår === VilkårEnum.ARBEIDSFORHOLD
                              ? `Uttaksplan.Vilkår.${vilkår}_${vilkårsutfall}`
                              : `Uttaksplan.Vilkår.${vilkår}`
                          }
                        />
                      </Normaltekst>
                    ))}
                  </td>
                  <td>
                    {sorterteVilkår.map(([key, vilkårsutfall]) =>
                      <Utfall
                        utfall={vilkårsutfall}
                        key={`${periode}--${key}.${vilkårsutfall}`}
                      />
                    )}
                  </td>
                  <td colSpan={3}/>
                </>;
            }
          };

          const faner = ["Uttaksplan.Vilkår", "Uttaksplan.Hjemler"];
          if (nøkkeltall && featureToggles?.PERIODISERTE_NOKKELTALL) {
            faner.push(nøkkeltall.migrertData ? "Uttaksplan.Nokkeltall.Migrert" : "Uttaksplan.Nokkeltall");
          }

          return <tbody key={periode} className={erKoronaperiode ? styles.koronaperiode : undefined}>
            <TableRow notFocusable>
              <td>
                <Normaltekst>{periodevisning(periode)}</Normaltekst>
              </td>
              <td>
                <Utfall
                  utfall={utfall}
                  textId={utfallIngenUtbetaling ? 'Uttaksplan.Utfall.IngenUtbetaling' : undefined}
                />
              </td>
              <td>
                {formaterFravær(periode, delvisFravær)}
              </td>
              <td>
                {`${utbetalingsgrad}%`}
              </td>
              <td>
                <button className={styles.utvidelsesknapp} onClick={() => velgPeriode(index)} type="button">
                  <NavFrontendChevron type={erValgt ? 'opp' : 'ned'} />
                </button>
              </td>
            </TableRow>
            {erValgt && <>
              <TableRow className={styles.fanerad} notFocusable>
                <td colSpan={5}>
                  <div className={styles.fanewrapper}>
                    <Tabs
                      tabs={faner.map(id => ({label: <FormattedMessage id={id}/>}))}
                      onChange={(e, i) => velgDetaljfane(i)}
                      kompakt
                      defaultAktiv={valgteDetaljfaner?.[index]}
                    />
                    {!nøkkeltall && featureToggles?.PERIODISERTE_NOKKELTALL && <>
                      {/* Nav-frontend-tabs støtter ikke deaktiverte faner */}
                      <div className={styles.deaktivertFane}>
                        <FormattedMessage id="Uttaksplan.Nokkeltall"/>
                      </div>
                      <Hjelpetekst><FormattedMessage id="Nøkkeltall.Deaktivert"/></Hjelpetekst>
                    </>}
                    {valgteDetaljfaner?.[valgtPeriodeIndex] === Fanenavn.NOKKELTALL && (
                      <button
                        className={styles.knappForAlleUtregninger}
                        onClick={visEllerSkjulAlleNokkeltalldetaljer}
                        type="button"
                      >
                        <FormattedMessage id={viserAlleDetaljer ? 'Nøkkeltall.SkjulUtregninger' : 'Nøkkeltall.VisUtregninger'}/>
                        <Image src={viserAlleDetaljer ? hide : show}/>
                      </button>
                    )}
                  </div>
                </td>
              </TableRow>
              <TableRow
                className={classNames(styles.innholdsrad, !valgteDetaljfaner?.[index] && styles.vilkar)}
                notFocusable
              >
                {visVilkarHjemlerEllerNokkeltall(valgteDetaljfaner?.[index])}
              </TableRow>
            </>}
          </tbody>;
        })}
      </Table>
    </Panel>
  );
};

export default AktivitetTabell;
