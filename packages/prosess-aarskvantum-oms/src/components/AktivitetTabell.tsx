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
import { Table, TableRow, VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import { FormattedMessage } from 'react-intl';
import Panel from 'nav-frontend-paneler';
import styled from 'styled-components';
import NavFrontendChevron from 'nav-frontend-chevron';

import { calcDays, convertHoursToDays, utledArbeidsforholdNavn } from '@fpsak-frontend/utils';
import { durationTilTimerMed7ogEnHalvTimesDagsbasis, formatDate, periodeErIKoronaperioden } from './utils';
import StyledColumn from './StyledColumn';
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
}

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

const Vilkårsutfall = styled.div`
  padding-top: 1em;
`;

export const ExpandButton = styled.button`
  cursor: pointer;
  border: none;
  background: inherit;
  line-height: 17px;
`;

export const ExpandedContent = styled.div<{ fyllBorder?: boolean }>`
  margin-top: 0.5em;
  padding-top: 0.5em;
  border-top: 1px solid #c6c2bf;
  position: relative;

  ${({ fyllBorder }) =>
    fyllBorder &&
    `
    &:before {
    content: '';
    position: absolute;
    border-top: 1px solid #c6c2bf;
    width: 16px;
    height: 1px;
    top: -1px;
    left: -16px;
  }
  `}
`;

const utfallErIngenUtbetaling = (delvisFravær: string) => {
  if (delvisFravær) {
    const { days, hours } = dagerOgTimer(delvisFravær);

    if (days === 0 && hours === 0) {
      return true;
    }
  }
  return false;
}

const arbeidsforholdSist = (_, [vilkår_2]: [Vilkår, Utfalltype]): number =>
  vilkår_2 === VilkårEnum.ARBEIDSFORHOLD ? -1 : 0;

const AktivitetTabell: FunctionComponent<AktivitetTabellProps> = ({
  arbeidsforhold,
  arbeidsforholdtypeKode,
  uttaksperioder,
  aktivitetsstatuser,
}) => {
  const [valgtPeriodeIndex, velgPeriodeIndex] = useState<number>();

  const velgPeriode = (index: number) => {
    if (valgtPeriodeIndex === index) {
      velgPeriodeIndex(null);
    } else {
      velgPeriodeIndex(index);
    }
  };

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
        suppliedHeaders={
          <>
            <StyledColumn width="30%">
              <FormattedMessage id="Uttaksplan.Periode" />
            </StyledColumn>
            <StyledColumn width="20%">
              <FormattedMessage id="Uttaksplan.Utfall" />
            </StyledColumn>
            <StyledColumn width="30%">
              <FormattedMessage id="Uttaksplan.Fravær" />
            </StyledColumn>

            <StyledColumn width="15%">
              <FormattedMessage id="Uttaksplan.Utbetalingsgrad" />
            </StyledColumn>
            <StyledColumn width="5%" />
          </>
        }
        stripet
        noHover
      >
        {uttaksperioder.map(({ periode, delvisFravær, utfall, utbetalingsgrad, vurderteVilkår, hjemler }, index) => {
          const erValgt = valgtPeriodeIndex === index;
          const erKoronaperiode = useMemo(() => periodeErIKoronaperioden(periode), [periode]);
          const sorterteVilkår = useMemo(() => Object.entries(vurderteVilkår.vilkår).sort(arbeidsforholdSist), [
            vurderteVilkår.vilkår,
          ]);
          const utfallIngenUtbetaling = utfallErIngenUtbetaling(delvisFravær);

          return (
            <TableRow key={periode}>
              <StyledColumn koronaperiode={erKoronaperiode} first>
                <Normaltekst>{periodevisning(periode)}</Normaltekst>
                {erValgt && (
                  <ExpandedContent>
                    <Element>
                      <FormattedMessage id="Uttaksplan.Vilkår" />
                    </Element>
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
                    <VerticalSpacer sixteenPx />
                    <Element>
                      <FormattedMessage id="Uttaksplan.Hjemler" />
                    </Element>
                    {hjemler.map(hjemmel => (
                      <div key={`${periode}--${hjemmel}`}>
                        <FormattedMessage id={`Uttaksplan.Hjemmel.${hjemmel}`} />
                      </div>
                    ))}
                  </ExpandedContent>
                )}
              </StyledColumn>
              <StyledColumn koronaperiode={erKoronaperiode}>
                <Utfall
                  utfall={utfall}
                  textId={utfallIngenUtbetaling ? 'Uttaksplan.Utfall.IngenUtbetaling' : undefined}
                />
                {erValgt && (
                  <ExpandedContent fyllBorder>
                    <Vilkårsutfall>
                      {sorterteVilkår.map(([key, vilkårsutfall]) =>
                        <Utfall
                          utfall={vilkårsutfall}
                          key={`${periode}--${key}.${vilkårsutfall}`}
                        />
                      )}
                    </Vilkårsutfall>
                  </ExpandedContent>
                )}
              </StyledColumn>
              <StyledColumn koronaperiode={erKoronaperiode}>
                <>
                  {formaterFravær(periode, delvisFravær)}
                  {erValgt && <ExpandedContent fyllBorder />}
                </>
              </StyledColumn>

              <StyledColumn koronaperiode={erKoronaperiode}>
                <>
                  {`${utbetalingsgrad}%`}
                  {erValgt && <ExpandedContent fyllBorder />}
                </>
              </StyledColumn>
              <StyledColumn koronaperiode={erKoronaperiode}>
                <>
                  <ExpandButton onClick={() => velgPeriode(index)} type="button">
                    <NavFrontendChevron type={erValgt ? 'opp' : 'ned'} />
                  </ExpandButton>
                  {erValgt && <ExpandedContent fyllBorder />}
                </>
              </StyledColumn>
            </TableRow>
          );
        })}
      </Table>
    </Panel>
  );
};

export default AktivitetTabell;
