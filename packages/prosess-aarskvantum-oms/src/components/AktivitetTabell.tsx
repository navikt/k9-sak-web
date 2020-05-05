import React, { FunctionComponent, useState, ReactNode } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { Table, TableRow, TableColumn, Image } from '@fpsak-frontend/shared-components/index';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import innvilget from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import avslått from '@fpsak-frontend/assets/images/avslaatt_valgt.svg';
import advarsel from '@fpsak-frontend/assets/images/advarsel_ny.svg';
import NavFrontendChevron from 'nav-frontend-chevron';
import { joinNonNullStrings, durationTilTimerMed7ogEnHalvTimesDagsbasis, formatDate } from './utils';
import Arbeidsforhold from '../dto/Arbeidsforhold';
import Uttaksperiode from '../dto/Uttaksperiode';
import Utfalltype, { UtfallEnum } from '../dto/Utfall';

interface AktivitetTabellProps {
  arbeidsforhold: Arbeidsforhold;
  uttaksperioder: Uttaksperiode[];
  aktivitetsstatuser: KodeverkMedNavn[];
}

const periodevisning = (periode: string): string => {
  const [fom, tom] = periode.split('/');
  return `${formatDate(fom)} - ${formatDate(tom)}`;
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

const ExpandButton = styled.button`
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

const ExpandedContent = styled.div`
  margin-top: 0.5em;
  padding-top: 0.5em;
  border-top: 1px solid #c6c2bf;
  position: relative;

  ${({ fyllBorder }: any) =>
    fyllBorder &&
    `
    &:before{
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
        headerTextCodes={[
          'Uttaksplan.Periode',
          'Uttaksplan.Fravær',
          'Uttaksplan.Utfall',
          'Uttaksplan.Utbetalingsgrad',
          'EMPTY',
        ]}
        stripet
        noHover
      >
        {uttaksperioder.map(({ periode, delvisFravær, utfall, utbetalingsgrad, vurderteVilkår }, index) => {
          const erValgt = valgtPeriodeIndex === index;

          return (
            <TableRow key={periode}>
              <TableColumn>
                <Normaltekst>{periodevisning(periode)}</Normaltekst>
                {erValgt && (
                  <ExpandedContent>
                    <Element>
                      <FormattedMessage id="Uttaksplan.Vilkår" />
                    </Element>
                    {Object.keys(vurderteVilkår.vilkår).map(vilkår => (
                      <Normaltekst key={`${periode}--${vilkår}`}>
                        <FormattedMessage id={`Uttaksplan.Vilkår.${vilkår}`} />
                      </Normaltekst>
                    ))}
                  </ExpandedContent>
                )}
              </TableColumn>
              <TableColumn>
                <>
                  {formaterDelvisFravær(delvisFravær)}
                  {erValgt && (
                    <ExpandedContent
                      // @ts-ignore
                      fyllBorder
                    />
                  )}
                </>
              </TableColumn>
              <TableColumn>
                {renderUtfall(utfall)}
                {erValgt && (
                  <ExpandedContent
                    // @ts-ignore
                    fyllBorder
                  >
                    <Vilkårsutfall>
                      {Object.entries(vurderteVilkår.vilkår).map(([key, vilkårsutfall]) =>
                        renderUtfall(vilkårsutfall, `${periode}--${key}.${vilkårsutfall}`),
                      )}
                    </Vilkårsutfall>
                  </ExpandedContent>
                )}
              </TableColumn>
              <TableColumn>
                <>
                  {`${utbetalingsgrad}%`}
                  {erValgt && (
                    <ExpandedContent
                      // @ts-ignore
                      fyllBorder
                    />
                  )}
                </>
              </TableColumn>
              <TableColumn>
                <>
                  <ExpandButton onClick={() => velgPeriode(index)} type="button">
                    <NavFrontendChevron type={erValgt ? 'opp' : 'ned'} />
                  </ExpandButton>
                  {erValgt && (
                    <ExpandedContent
                      // @ts-ignore
                      fyllBorder
                    />
                  )}
                </>
              </TableColumn>
            </TableRow>
          );
        })}
      </Table>
    </div>
  );
};

export default AktivitetTabell;
