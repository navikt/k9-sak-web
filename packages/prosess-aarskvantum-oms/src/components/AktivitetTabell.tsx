import React, { FunctionComponent, useState, ReactNode, useMemo } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { Table, TableRow, Image, VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import innvilget from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import avslått from '@fpsak-frontend/assets/images/avslaatt_valgt.svg';
import advarsel from '@fpsak-frontend/assets/images/advarsel_ny.svg';
import NavFrontendChevron from 'nav-frontend-chevron';
import { joinNonNullStrings, calcDays } from '@fpsak-frontend/utils';
import { durationTilTimerMed7ogEnHalvTimesDagsbasis, formatDate, periodeErIKoronaperioden } from './utils';
import Arbeidsforhold from '../dto/Arbeidsforhold';
import Uttaksperiode from '../dto/Uttaksperiode';
import Utfalltype, { UtfallEnum } from '../dto/Utfall';
import StyledColumn from './StyledColumn';
import Vilkår, { VilkårEnum } from '../dto/Vilkår';

interface AktivitetTabellProps {
  arbeidsforhold: Arbeidsforhold;
  uttaksperioder: Uttaksperiode[];
  aktivitetsstatuser: KodeverkMedNavn[];
}

const periodevisning = (periode: string): string => {
  const [fom, tom] = periode.split('/');
  return `${formatDate(fom)} - ${formatDate(tom)}`;
};

const antallDager = (periode: string): string => {
  const [fom, tom] = periode.split('/');
  return calcDays(fom, tom);
};

const formaterDelvisFravær = (delvisFravær?: string): ReactNode => {
  if (delvisFravær) {
    const timer = durationTilTimerMed7ogEnHalvTimesDagsbasis(delvisFravær);
    return <FormattedMessage id="Uttaksplan.DelvisFravær" values={{ timer }} />;
  }
  return <FormattedMessage id="Uttaksplan.FulltFravær" />;
};

const utfallSymbolMap = {
  [UtfallEnum.INNVILGET]: innvilget,
  [UtfallEnum.AVSLÅTT]: avslått,
  [UtfallEnum.UAVKLART]: advarsel,
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

const UtfallImage = styled.span`
  img {
    margin-right: 0.5em;
    height: 20px;
    width: 20px;
  }
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

const renderUtfall = (utfall: Utfalltype, key?: string): ReactNode => (
  <div key={key}>
    <UtfallImage>
      <Image src={utfallSymbolMap[utfall]} />
    </UtfallImage>
    <FormattedMessage id={`Uttaksplan.Utfall.${utfall}`} />
  </div>
);

const arbeidsforholdSist = (_, [vilkår_2]: [Vilkår, Utfalltype]): number =>
  vilkår_2 === VilkårEnum.ARBEIDSFORHOLD ? -1 : 0;

const AktivitetTabell: FunctionComponent<AktivitetTabellProps> = ({
  arbeidsforhold,
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

  return (
    <div key={joinNonNullStrings(Object.values(arbeidsforhold))}>
      <Element>
        {aktivitetsstatuser.find(aktivitetsstatus => aktivitetsstatus.kode === arbeidsforhold.type)?.navn ||
          arbeidsforhold.type}
      </Element>
      <Table
        suppliedHeaders={
          <>
            <StyledColumn width="30%">
              <FormattedMessage id="Uttaksplan.Periode" />
            </StyledColumn>
            <StyledColumn width="20%">
              <FormattedMessage id="Uttaksplan.Utfall" />
            </StyledColumn>
            <StyledColumn width="5%">
              <FormattedMessage id="Uttaksplan.Dager" />
            </StyledColumn>
            <StyledColumn width="25%">
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
                {renderUtfall(utfall)}
                {erValgt && (
                  <ExpandedContent fyllBorder>
                    <Vilkårsutfall>
                      {sorterteVilkår.map(([key, vilkårsutfall]) =>
                        renderUtfall(vilkårsutfall, `${periode}--${key}.${vilkårsutfall}`),
                      )}
                    </Vilkårsutfall>
                  </ExpandedContent>
                )}
              </StyledColumn>
              <StyledColumn koronaperiode={erKoronaperiode}>
                <>
                  {antallDager(periode)}
                  {erValgt && <ExpandedContent fyllBorder />}
                </>
              </StyledColumn>
              <StyledColumn koronaperiode={erKoronaperiode}>
                <>
                  {formaterDelvisFravær(delvisFravær)}
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
    </div>
  );
};

export default AktivitetTabell;
