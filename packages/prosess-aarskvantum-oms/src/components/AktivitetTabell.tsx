import React, { FunctionComponent, useState, ReactNode } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { Table, TableRow, TableColumn, Image } from '@fpsak-frontend/shared-components/index';
import { FormattedMessage } from 'react-intl';
import innvilget from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import avslått from '@fpsak-frontend/assets/images/avslaatt_valgt.svg';
import advarsel from '@fpsak-frontend/assets/images/advarsel_ny.svg';
import classnames from 'classnames/bind';
import NavFrontendChevron from 'nav-frontend-chevron';
import { joinNonNullStrings, durationTilTimerMed7ogEnHalvTimesDagsbasis, formatDate } from './utils';
import Arbeidsforhold from '../dto/Arbeidsforhold';
import Uttaksperiode from '../dto/Uttaksperiode';
import styles from './aktivitetTabell.less';
import Utfalltype, { UtfallEnum } from '../dto/Utfall';

const classNames = classnames.bind(styles);

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

const renderUtfall = (utfall: Utfalltype, key?: string): ReactNode => (
  <div key={key}>
    <Image src={utfallSymbolMap[utfall]} className={styles.utfallImg} />
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
      >
        {uttaksperioder.map(({ periode, delvisFravær, utfall, utbetalingsgrad, vurderteVilkår }, index) => {
          const erValgt = valgtPeriodeIndex === index;
          return (
            <TableRow
              key={periode}
              onMouseDown={() => velgPeriode(index)}
              onKeyDown={() => velgPeriode(index)}
              className={classNames({ expanded: erValgt })}
            >
              <TableColumn>
                <Normaltekst>{periodevisning(periode)}</Normaltekst>
                {erValgt && (
                  <>
                    <Element>
                      <FormattedMessage id="Uttaksplan.Vilkår" />
                    </Element>
                    {Object.keys(vurderteVilkår).map(key => (
                      <Normaltekst key={`${periode}--${key}`}>{key}</Normaltekst>
                    ))}
                  </>
                )}
              </TableColumn>
              <TableColumn>{formaterDelvisFravær(delvisFravær)}</TableColumn>
              <TableColumn>
                {renderUtfall(utfall)}
                {erValgt && (
                  <div className={styles.paddingTop}>
                    {Object.entries(vurderteVilkår).map(([key, vilkårsutfall]) =>
                      renderUtfall(vilkårsutfall, `${periode}--${key}.${vilkårsutfall}`),
                    )}
                  </div>
                )}
              </TableColumn>
              <TableColumn>{`${utbetalingsgrad}%`}</TableColumn>
              <TableColumn>
                <NavFrontendChevron type={erValgt ? 'opp' : 'ned'} />
              </TableColumn>
            </TableRow>
          );
        })}
      </Table>
    </div>
  );
};

export default AktivitetTabell;
