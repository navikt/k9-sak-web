import Tabs from "nav-frontend-tabs";
import React, { FunctionComponent, useState, ReactNode, useMemo } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
  Arbeidsforhold,
  KodeverkMedNavn,
  Utfalltype,
  VilkårEnum,
  Uttaksperiode,
  Vilkår,
} from '@k9-sak-web/types';
import { Table, TableRow } from '@fpsak-frontend/shared-components/index';
import { FormattedMessage } from 'react-intl';
import Panel from 'nav-frontend-paneler';
import NavFrontendChevron from 'nav-frontend-chevron';

import { calcDays, convertHoursToDays, utledArbeidsforholdNavn } from '@fpsak-frontend/utils';
import NøkkeltallContainer from "./nokkeltall/NøkkeltallContainer";
import { durationTilTimerMed7ogEnHalvTimesDagsbasis, formatDate, periodeErIKoronaperioden } from './utils';
import styles from './aktivitetTabell.less';
import Utfall from './Utfall';

interface AktivitetTabellProps {
  arbeidsforhold?: Arbeidsforhold;
  arbeidsforholdtypeKode: string;
  uttaksperioder: Uttaksperiode[];
  aktivitetsstatuser: KodeverkMedNavn[];
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
}) => {
  const [valgtPeriodeIndex, velgPeriodeIndex] = useState<number>();
  const [valgteDetaljfaner, velgDetaljfaner] = useState<number[]>();

  const velgPeriode = (index: number) => {
    if (valgtPeriodeIndex === index) {
      velgPeriodeIndex(null);
    } else {
      velgPeriodeIndex(index);
    }
  };

  const velgDetaljfane = (faneindex: number) =>
    velgDetaljfaner(Object.assign([], valgteDetaljfaner, {[valgtPeriodeIndex]: faneindex}));

  const arbeidsforholdType: string =
    aktivitetsstatuser.find(aktivitetsstatus => aktivitetsstatus.kode === arbeidsforholdtypeKode)?.navn ||
    arbeidsforholdtypeKode;

  const beskrivelse = arbeidsforhold
    ? `${arbeidsforholdType}, ${utledArbeidsforholdNavn(arbeidsforhold)}`
    : arbeidsforholdType;

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

              case 1:
                return <td colSpan={5}>
                  {hjemler.map(hjemmel => (
                    <div key={`${periode}--${hjemmel}`}>
                      <FormattedMessage id={`Uttaksplan.Hjemmel.${hjemmel}`} />
                    </div>
                  ))}
                </td>;

              case 2: return <td colSpan={5}>
                <NøkkeltallContainer
                  totaltAntallDager={nøkkeltall.totaltAntallDager}
                  antallDagerArbeidsgiverDekker={nøkkeltall.antallDagerArbeidsgiverDekker}
                  antallDagerInfotrygd={nøkkeltall.antallDagerInfotrygd}
                  antallKoronadager={nøkkeltall.antallKoronadager}
                  forbrukteDager={nøkkeltall.antallForbrukteDager}
                  uttaksperioder={[]}
                  benyttetRammemelding
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
                      tabs={[
                        {label: <FormattedMessage id="Uttaksplan.Vilkår"/>},
                        {label: <FormattedMessage id="Uttaksplan.Hjemler"/>},
                        {label: <FormattedMessage id="Uttaksplan.Nokkeltall"/>}
                      ]}
                      onChange={(e, i) => velgDetaljfane(i)}
                      kompakt
                      defaultAktiv={valgteDetaljfaner?.[index]}
                    />
                  </div>
                </td>
              </TableRow>
              <TableRow className={styles.innholdsrad} notFocusable>
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
