import {
  CheckmarkCircleFillIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PersonPencilFillIcon,
  XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';
import { BodyShort, Button, HelpText, Table } from '@navikt/ds-react';
import classNames from 'classnames/bind';
import * as React from 'react';
import { Collapse } from 'react-collapse';
import Årsaker from '../../../constants/Årsaker';
import { UttaksperiodeMedInntektsgradering } from '../../../types';
import Vilkårsliste from '../../../vilkårsliste/Vilkårsliste';
import ContainerContext from '../../context/ContainerContext';
import Endringsstatus from '../icons/Endringsstatus';
import UttakDetaljerV2Wrapper from '../uttak-detaljer/UttakDetaljerV2Wrapper';

import styles from './uttak.module.css';

import type { JSX } from 'react';
import { vilkarType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { VilkårPeriodeDtoVilkarStatus } from '@k9-sak-web/backend/k9sak/generated';

const cx = classNames.bind(styles);

const opplæringspengerVilkår = [
  vilkarType.LANGVARIG_SYKDOM,
  vilkarType.NØDVENDIG_OPPLÆRING,
  vilkarType.GODKJENT_OPPLÆRINGSINSTITUSJON,
] as string[];

interface UttakProps {
  uttak: UttaksperiodeMedInntektsgradering;
  erValgt: boolean;
  velgPeriode: () => void;
  withBorderTop?: boolean;
}

// Uttak bruker pleiepenger-barn-uttak i backend, som er laget for pleiepenger
// Men har også blitt "hacket til" for å brukes for opplæringspenger
// Lager en egen komponent for å vise opplæringspenger så det ikke blir så forvirrende hvissom atte dersom atte i koden

const UttakRadOpplæringspenger = ({ uttak, erValgt, velgPeriode, withBorderTop = false }: UttakProps): JSX.Element => {
  const { periode, uttaksgrad, inngangsvilkår: vilkår, årsaker, endringsstatus, manueltOverstyrt } = uttak;
  const containerContext = React.useContext(ContainerContext);

  const sykdomOgOpplæringVilkår = Object.fromEntries(
    Object.entries(vilkår).filter(([key]) => opplæringspengerVilkår.includes(key)),
  );

  const inngangsvilkår = Object.fromEntries(
    Object.entries(vilkår).filter(([key]) => !opplæringspengerVilkår.includes(key)),
  );

  const arbeidsforhold = containerContext?.arbeidsforhold ?? {};

  const erGradertMotInntekt = uttak.inntektsgradering !== undefined;

  const uttakGradIndikatorCls = cx('uttak__indikator', {
    uttak__indikator__avslått: uttaksgrad === 0,
    uttak__indikator__innvilget: uttaksgrad > 0,
    'uttak__indikator__innvilget--delvis--inntekt': erGradertMotInntekt,
    'uttak__indikator__innvilget--delvis':
      !erGradertMotInntekt && årsaker.some(årsak => årsak === Årsaker.GRADERT_MOT_TILSYN),
  });

  const harOppfyltAlleInngangsvilkår = Object.values(inngangsvilkår).every(
    vilkar => vilkar === VilkårPeriodeDtoVilkarStatus.OPPFYLT,
  );

  const harOppfyltAlleVilkårSykdomOgOpplæring = opplæringspengerVilkår.every(
    vilkar => sykdomOgOpplæringVilkår[vilkar] === VilkårPeriodeDtoVilkarStatus.OPPFYLT,
  );

  const alleVilkårErOppfylt = harOppfyltAlleInngangsvilkår && harOppfyltAlleVilkårSykdomOgOpplæring;

  return (
    <>
      <Table.Row className={`${erValgt ? styles.uttak__expandedRow : ''} ${styles.uttak__row}`} onClick={velgPeriode}>
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''} `}>
          {periode.getFirstAndLastWeek()}
        </Table.DataCell>
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''}`}>
          <BodyShort as="div">
            {periode.prettifyPeriod()}
            {manueltOverstyrt && (
              <>
                <PersonPencilFillIcon
                  className="ml-1 align-middle text-2xl text-border-warning"
                  title="Manuelt overstyrt"
                />
                <HelpText
                  wrapperClassName="inline-flex align-middle ml-2"
                  onClick={e => {
                    e.stopPropagation();
                  }}
                >
                  Uttaksgrad og/eller utbetalingsgrad er manuelt overstyrt av saksbehandler.
                </HelpText>
              </>
            )}
          </BodyShort>
        </Table.DataCell>
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''} ${styles.uttak__vilkarIconContainer}`}>
          {harOppfyltAlleInngangsvilkår ? (
            <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--a-surface-success)' }} />
          ) : (
            <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--a-surface-danger)' }} />
          )}
        </Table.DataCell>
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''}`}>
          <div className={styles.uttak__iconContainer}>
            {harOppfyltAlleVilkårSykdomOgOpplæring ? (
              <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--a-surface-success)' }} />
            ) : (
              <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--a-surface-danger)' }} />
            )}
          </div>
        </Table.DataCell>

        <Table.DataCell className={`${styles.uttak__uttaksgrad} ${withBorderTop ? styles.borderTop : ''}`}>
          <p className={styles.uttak__uttaksgrad__tekst}>{`${uttaksgrad} %`}</p>
          <div className={uttakGradIndikatorCls} />
        </Table.DataCell>
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''} `}>
          <div className={styles.uttak__lastColumn}>
            <div className={styles.uttak__behandlerIcon}>
              <Endringsstatus status={endringsstatus} />
            </div>
            <Button
              size="xsmall"
              variant="tertiary-neutral"
              onClick={velgPeriode}
              aria-label={erValgt ? 'Lukk' : 'Åpne'}
              aria-expanded={erValgt}
              icon={erValgt ? <ChevronUpIcon fontSize={32} /> : <ChevronDownIcon fontSize={32} />}
            />
          </div>
        </Table.DataCell>
      </Table.Row>
      <tr className={`${erValgt ? '' : styles.collapseRow} ${styles.expandedRow}`}>
        <td colSpan={8}>
          <Collapse isOpened={erValgt}>
            <div className={styles.expanded}>
              {alleVilkårErOppfylt ? (
                <UttakDetaljerV2Wrapper
                  uttak={uttak}
                  manueltOverstyrt={manueltOverstyrt}
                  arbeidsforhold={arbeidsforhold}
                />
              ) : (
                <Vilkårsliste vilkår={vilkår} />
              )}
            </div>
          </Collapse>
        </td>
      </tr>
    </>
  );
};
export default UttakRadOpplæringspenger;
