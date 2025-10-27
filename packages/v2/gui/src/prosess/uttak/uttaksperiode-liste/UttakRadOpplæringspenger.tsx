import type { JSX } from 'react';
import { Collapse } from 'react-collapse';
import classNames from 'classnames/bind';
import {
  CheckmarkCircleFillIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PersonPencilFillIcon,
  XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';
import { vilkarType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { BodyShort, Button, HelpText, Table } from '@navikt/ds-react';
import {
  pleiepengerbarn_uttak_kontrakter_Årsak as Årsak,
  k9_kodeverk_vilkår_Utfall as VilkårUtfall,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import Vilkårsliste from '../components/vilkårsliste/Vilkårsliste';
import Endringsstatus from '../components/icons/Endringsstatus';
import type { UttaksperiodeBeriket } from '../types/UttaksperiodeBeriket';
import UttakDetaljer from '../uttak-detaljer/UttakDetaljer';
import { getFirstAndLastWeek, prettifyPeriod } from '../utils/periodUtils';
import styles from './uttak.module.css';

const cx = classNames.bind(styles);

const opplæringspengerVilkår = [
  vilkarType.LANGVARIG_SYKDOM,
  vilkarType.NØDVENDIG_OPPLÆRING,
  vilkarType.GODKJENT_OPPLÆRINGSINSTITUSJON,
] as string[];

interface UttakProps {
  uttak: UttaksperiodeBeriket;
  erValgt: boolean;
  velgPeriode: () => void;
  withBorderTop?: boolean;
}

// Uttak bruker pleiepenger-barn-uttak i backend, som er laget for pleiepenger
// Men har også blitt "hacket til" for å brukes for opplæringspenger
// Lager en egen komponent for å vise opplæringspenger så det ikke blir så forvirrende hvissom atte dersom atte i koden

const UttakRadOpplæringspenger = ({ uttak, erValgt, velgPeriode, withBorderTop = false }: UttakProps): JSX.Element => {
  const { periode, uttaksgrad, inngangsvilkår: vilkår, årsaker, endringsstatus, manueltOverstyrt } = uttak;

  const sykdomOgOpplæringVilkår = Object.fromEntries(
    Object.entries(vilkår ?? {}).filter(([key]) => opplæringspengerVilkår.includes(key)),
  );

  const inngangsvilkår = Object.fromEntries(
    Object.entries(vilkår ?? {}).filter(([key]) => !opplæringspengerVilkår.includes(key)),
  );

  const erGradertMotInntekt = (årsaker ?? []).includes(Årsak.AVKORTET_MOT_INNTEKT);

  const uttakGradIndikatorCls = cx('uttakIndikator', {
    uttakIndikatorAvslått: uttaksgrad === 0,
    uttakIndikatorInnvilget: (uttaksgrad ?? 0) > 0,
    uttakIndikatorInnvilgetDelvisInntekt: erGradertMotInntekt,
    uttakIndikatorInnvilgetDelvis: !erGradertMotInntekt && årsaker?.some(årsak => årsak === Årsak.GRADERT_MOT_TILSYN),
  });

  const harOppfyltAlleInngangsvilkår = Object.values(inngangsvilkår).every(vilkar => vilkar === VilkårUtfall.OPPFYLT);

  const harOppfyltAlleVilkårSykdomOgOpplæring = opplæringspengerVilkår.every(
    vilkar => sykdomOgOpplæringVilkår[vilkar] === VilkårUtfall.OPPFYLT,
  );

  const alleVilkårErOppfylt = harOppfyltAlleInngangsvilkår && harOppfyltAlleVilkårSykdomOgOpplæring;

  return (
    <>
      <Table.Row className={`${erValgt ? styles.uttakExpandedRow : ''}`} onClick={velgPeriode}>
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''} `}>
          {getFirstAndLastWeek(periode.fom, periode.tom)}
        </Table.DataCell>
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''}`}>
          <BodyShort as="div">
            {prettifyPeriod(periode.fom, periode.tom)}
            {manueltOverstyrt && (
              <>
                <PersonPencilFillIcon
                  className="ml-1 align-middle text-2xl text-ax-warning-500"
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
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''} ${styles.uttakVilkarIconContainer}`}>
          {harOppfyltAlleInngangsvilkår ? (
            <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--ax-bg-success-strong)' }} />
          ) : (
            <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--ax-bg-danger-strong)' }} />
          )}
        </Table.DataCell>
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''}`}>
          <div className={styles.uttakIconContainer}>
            {harOppfyltAlleVilkårSykdomOgOpplæring ? (
              <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--ax-bg-success-strong)' }} />
            ) : (
              <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--ax-bg-danger-strong)' }} />
            )}
          </div>
        </Table.DataCell>

        <Table.DataCell className={`${styles.uttakUttaksgrad} ${withBorderTop ? styles.borderTop : ''}`}>
          <p className={styles.uttakUttaksgradTekst}>{`${uttaksgrad} %`}</p>
          <div className={uttakGradIndikatorCls} />
        </Table.DataCell>
        <Table.DataCell className={`${withBorderTop ? styles.borderTop : ''} `}>
          <div className={styles.uttakLastColumn}>
            <div className={styles.uttakBehandlerIcon}>
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
      <tr className={`${erValgt ? '' : styles['collapseRow']} ${styles['expandedRow']}`}>
        <td colSpan={8}>
          <Collapse isOpened={erValgt}>
            <div className={styles['expanded']}>
              {alleVilkårErOppfylt ? (
                <UttakDetaljer uttak={uttak} manueltOverstyrt={manueltOverstyrt || false} />
              ) : (
                <Vilkårsliste vilkår={vilkår ?? {}} />
              )}
            </div>
          </Collapse>
        </td>
      </tr>
    </>
  );
};
export default UttakRadOpplæringspenger;
